package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/gofiber/fiber/v3"

	"sop-kemenag-backend/cache"
	"sop-kemenag-backend/config"
	"sop-kemenag-backend/models"
	"sop-kemenag-backend/pocketbase"
)

// sopClaimsDestructure pulls the authenticated user identity set by VerifyJWT.
func sopClaims(c fiber.Ctx) (userID string, email string, token string, ok bool) {
	uid, ok1 := c.Locals("user_id").(string)
	em, ok2 := c.Locals("user_email").(string)
	tok, _ := c.Locals("user_token").(string)
	if !ok1 || !ok2 || uid == "" {
		return "", "", "", false
	}
	return uid, em, tok, true
}

// ListUserSOPs returns the authenticated user's own SOP list.
// GET /api/sops
func ListUserSOPs(pb *pocketbase.Client) fiber.Handler {
	return func(c fiber.Ctx) error {
		userID, email, token, ok := sopClaims(c)
		if !ok {
			return c.Status(fiber.StatusUnauthorized).JSON(models.ErrorResponse{Error: "Unauthorized"})
		}

		q := url.Values{}
		q.Set("filter", fmt.Sprintf("user='%s' || user_email='%s'", userID, email))
		q.Set("sort", "-id")
		q.Set("perPage", "500")
		q.Set("fields", "id,title,updated")

		resp, err := pb.Request(http.MethodGet, "/api/collections/sops/records", q, nil, token)
		if err != nil {
			log.Printf("[SOP] ListUserSOPs network error: %v", err)
			return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{Error: "Failed to connect to PocketBase"})
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			respBody, _ := io.ReadAll(resp.Body)
			log.Printf("[SOP] ListUserSOPs PocketBase status=%d body=%s", resp.StatusCode, string(respBody))
			return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{Error: "PocketBase error: " + string(respBody)})
		}

		var pbList struct {
			Items []struct {
				ID      string      `json:"id"`
				Title   string      `json:"title"`
				Updated interface{} `json:"updated"`
			} `json:"items"`
		}

		if err := json.NewDecoder(resp.Body).Decode(&pbList); err != nil {
			log.Printf("[SOP] ListUserSOPs decode error: %v", err)
			return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{Error: "Internal Server Error"})
		}

		items := make([]models.SOPListItem, 0, len(pbList.Items))
		for _, it := range pbList.Items {
			items = append(items, models.SOPListItem{
				ID:        it.ID,
				Title:     it.Title,
				UpdatedAt: pocketbase.ParsePBTime(it.Updated),
			})
		}

		return c.JSON(items)
	}
}

// ListAdminSOPs returns ALL SOPs (super admin only).
// GET /api/sops/admin
func ListAdminSOPs(pb *pocketbase.Client) fiber.Handler {
	return func(c fiber.Ctx) error {
		_, _, token, ok := sopClaims(c)
		if !ok {
			return c.Status(fiber.StatusUnauthorized).JSON(models.ErrorResponse{Error: "Unauthorized"})
		}

		const cacheKey = "admin_sops_list"
		if cached, found := cache.DefaultCache.Get(cacheKey); found {
			if items, ok := cached.([]models.AdminSOPListItem); ok {
				return c.JSON(items)
			}
		}

		q := url.Values{}
		q.Set("sort", "-id")
		q.Set("perPage", "500")
		q.Set("expand", "user")
		q.Set("fields", "id,title,updated,user,user_email,header,expand.user.bidang,expand.user.nama,expand.user.name")

		resp, err := pb.Request(http.MethodGet, "/api/collections/sops/records", q, nil, token)
		if err != nil {
			log.Printf("[SOP] ListAdminSOPs network error: %v", err)
			return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{Error: "Failed to connect to PocketBase"})
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			respBody, _ := io.ReadAll(resp.Body)
			log.Printf("[SOP] ListAdminSOPs PocketBase status=%d body=%s", resp.StatusCode, string(respBody))
			return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{Error: "PocketBase error: " + string(respBody)})
		}

		var pbList struct {
			Items []struct {
				ID        string                 `json:"id"`
				Title     string                 `json:"title"`
				Updated   interface{}            `json:"updated"`
				User      string                 `json:"user"`
				UserEmail string                 `json:"user_email"`
				Header    map[string]interface{} `json:"header"`
				Expand    struct {
					User struct {
						Bidang string `json:"bidang"`
						Nama   string `json:"nama"`
						Name   string `json:"name"`
					} `json:"user"`
				} `json:"expand"`
			} `json:"items"`
		}

		if err := json.NewDecoder(resp.Body).Decode(&pbList); err != nil {
			log.Printf("[SOP] ListAdminSOPs decode error: %v", err)
			return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{Error: "Internal Server Error"})
		}

		items := make([]models.AdminSOPListItem, 0, len(pbList.Items))
		for _, it := range pbList.Items {
			userID := it.User
			userEmail := it.UserEmail
			userBidang := it.Expand.User.Bidang
			headerBytes, _ := json.Marshal(it.Header)

			items = append(items, models.AdminSOPListItem{
				ID:         it.ID,
				Title:      it.Title,
				UpdatedAt:  pocketbase.ParsePBTime(it.Updated),
				UserID:     userID,
				UserEmail:  &userEmail,
				UserBidang: &userBidang,
				Header:     headerBytes,
			})
		}

		// Cache in memory for 30 seconds
		cache.DefaultCache.Set(cacheKey, items, 30*time.Second)

		return c.JSON(items)
	}
}

// GetSOP returns a single SOP, enforcing ownership unless the user is super admin.
// GET /api/sops/:id
func GetSOP(pb *pocketbase.Client, cfg *config.Config) fiber.Handler {
	return func(c fiber.Ctx) error {
		id := c.Params("id")
		if id == "" {
			return c.Status(fiber.StatusBadRequest).JSON(models.ErrorResponse{Error: "id is required"})
		}

		userID, email, token, ok := sopClaims(c)
		if !ok {
			return c.Status(fiber.StatusUnauthorized).JSON(models.ErrorResponse{Error: "Unauthorized"})
		}
		isAdmin := isSuperAdminEmail(email, cfg)

		resp, err := pb.Request(http.MethodGet, "/api/collections/sops/records/"+id, nil, nil, token)
		if err != nil {
			log.Printf("[SOP] GetSOP network error: %v", err)
			return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{Error: "Failed to connect to PocketBase"})
		}
		defer resp.Body.Close()

		if resp.StatusCode == http.StatusNotFound {
			return c.Status(fiber.StatusNotFound).JSON(models.ErrorResponse{Error: "SOP not found"})
		}
		if resp.StatusCode != http.StatusOK {
			respBody, _ := io.ReadAll(resp.Body)
			log.Printf("[SOP] GetSOP PocketBase status=%d body=%s", resp.StatusCode, string(respBody))
			return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{Error: "Internal Server Error"})
		}

		var pbRec struct {
			ID         string                 `json:"id"`
			User       string                 `json:"user"`
			UserEmail  string                 `json:"user_email"`
			Title      string                 `json:"title"`
			Header     map[string]interface{} `json:"header"`
			Activities []interface{}          `json:"activities"`
			Roles      []interface{}          `json:"roles"`
			Created    interface{}            `json:"created"`
			Updated    interface{}            `json:"updated"`
		}

		if err := json.NewDecoder(resp.Body).Decode(&pbRec); err != nil {
			log.Printf("[SOP] GetSOP decode error: %v", err)
			return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{Error: "Internal Server Error"})
		}

		// ownership: user must own the SOP, or be super admin
		if !isAdmin && (pbRec.User != userID && pbRec.UserEmail != email) {
			return c.Status(fiber.StatusForbidden).JSON(models.ErrorResponse{Error: "Forbidden"})
		}

		headerBytes, _ := json.Marshal(pbRec.Header)
		actBytes, _ := json.Marshal(pbRec.Activities)
		rolesBytes, _ := json.Marshal(pbRec.Roles)
		uID := pbRec.User
		uEmail := pbRec.UserEmail

		return c.JSON(models.SOPRecord{
			ID:         pbRec.ID,
			UserID:     &uID,
			UserEmail:  &uEmail,
			Title:      pbRec.Title,
			Header:     headerBytes,
			Activities: actBytes,
			Roles:      rolesBytes,
			CreatedAt:  pocketbase.ParsePBTime(pbRec.Created),
			UpdatedAt:  pocketbase.ParsePBTime(pbRec.Updated),
		})
	}
}

// CreateSOP inserts a new SOP owned by the authenticated user.
// POST /api/sops
func CreateSOP(pb *pocketbase.Client) fiber.Handler {
	return func(c fiber.Ctx) error {
		userID, userEmail, token, ok := sopClaims(c)
		if !ok {
			return c.Status(fiber.StatusUnauthorized).JSON(models.ErrorResponse{Error: "Unauthorized"})
		}

		var req models.SaveSOPRequest
		if err := c.Bind().JSON(&req); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(models.ErrorResponse{Error: "Invalid request body"})
		}
		title := req.Title
		if title == "" {
			title = "Untitled SOP"
		}

		var headerObj interface{}
		var activitiesObj interface{}
		var rolesObj interface{}

		_ = json.Unmarshal(req.Header, &headerObj)
		_ = json.Unmarshal(req.Activities, &activitiesObj)
		_ = json.Unmarshal(req.Roles, &rolesObj)

		payload := map[string]interface{}{
			"user":       userID,
			"user_email": userEmail,
			"title":      title,
			"header":     headerObj,
			"activities": activitiesObj,
			"roles":      rolesObj,
		}

		resp, err := pb.Request(http.MethodPost, "/api/collections/sops/records", nil, payload, token)
		if err != nil {
			log.Printf("[SOP] CreateSOP error: %v", err)
			return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{Error: "Failed to connect to PocketBase"})
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
			respBody, _ := io.ReadAll(resp.Body)
			log.Printf("[SOP] CreateSOP PocketBase returned %d: %s", resp.StatusCode, string(respBody))
			return c.Status(fiber.StatusBadRequest).JSON(models.ErrorResponse{Error: string(respBody)})
		}

		var created struct {
			ID      string      `json:"id"`
			Title   string      `json:"title"`
			Updated interface{} `json:"updated"`
		}
		_ = json.NewDecoder(resp.Body).Decode(&created)

		// Invalidate admin cached list & stats
		cache.DefaultCache.Delete("admin_sops_list")
		cache.DefaultCache.InvalidatePrefix("admin_stats")

		return c.Status(fiber.StatusCreated).JSON(models.SaveSOPResponse{
			ID:        created.ID,
			Title:     created.Title,
			UpdatedAt: pocketbase.ParsePBTime(created.Updated),
		})
	}
}

// UpdateSOP updates a SOP's header/activities/roles, enforcing ownership.
// PUT /api/sops/:id
func UpdateSOP(pb *pocketbase.Client, cfg *config.Config) fiber.Handler {
	return func(c fiber.Ctx) error {
		id := c.Params("id")
		if id == "" {
			return c.Status(fiber.StatusBadRequest).JSON(models.ErrorResponse{Error: "id is required"})
		}

		userID, email, token, ok := sopClaims(c)
		if !ok {
			return c.Status(fiber.StatusUnauthorized).JSON(models.ErrorResponse{Error: "Unauthorized"})
		}
		isAdmin := isSuperAdminEmail(email, cfg)

		// ownership check
		getResp, err := pb.Request(http.MethodGet, "/api/collections/sops/records/"+id, nil, nil, token)
		if err != nil || getResp.StatusCode != http.StatusOK {
			if getResp != nil {
				getResp.Body.Close()
			}
			return c.Status(fiber.StatusNotFound).JSON(models.ErrorResponse{Error: "SOP not found"})
		}

		var ownerCheck struct {
			User      string `json:"user"`
			UserEmail string `json:"user_email"`
		}
		_ = json.NewDecoder(getResp.Body).Decode(&ownerCheck)
		getResp.Body.Close()

		if !isAdmin && (ownerCheck.User != userID && ownerCheck.UserEmail != email) {
			return c.Status(fiber.StatusForbidden).JSON(models.ErrorResponse{Error: "Forbidden"})
		}

		var req models.SaveSOPRequest
		if err := c.Bind().JSON(&req); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(models.ErrorResponse{Error: "Invalid request body"})
		}
		title := req.Title
		if title == "" {
			title = "Untitled SOP"
		}

		var headerObj interface{}
		var activitiesObj interface{}
		var rolesObj interface{}

		_ = json.Unmarshal(req.Header, &headerObj)
		_ = json.Unmarshal(req.Activities, &activitiesObj)
		_ = json.Unmarshal(req.Roles, &rolesObj)

		patchPayload := map[string]interface{}{
			"title":      title,
			"header":     headerObj,
			"activities": activitiesObj,
			"roles":      rolesObj,
		}

		patchResp, err := pb.Request(http.MethodPatch, "/api/collections/sops/records/"+id, nil, patchPayload, token)
		if err != nil {
			log.Printf("[SOP] UpdateSOP error: %v", err)
			return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{Error: "Failed to connect to PocketBase"})
		}
		defer patchResp.Body.Close()

		if patchResp.StatusCode != http.StatusOK {
			respBody, _ := io.ReadAll(patchResp.Body)
			log.Printf("[SOP] UpdateSOP PocketBase returned %d: %s", patchResp.StatusCode, string(respBody))
			return c.Status(fiber.StatusBadRequest).JSON(models.ErrorResponse{Error: string(respBody)})
		}

		var updated struct {
			ID      string      `json:"id"`
			Title   string      `json:"title"`
			Updated interface{} `json:"updated"`
		}
		_ = json.NewDecoder(patchResp.Body).Decode(&updated)

		// Invalidate admin cached list & stats
		cache.DefaultCache.Delete("admin_sops_list")
		cache.DefaultCache.InvalidatePrefix("admin_stats")

		return c.JSON(models.SaveSOPResponse{
			ID:        updated.ID,
			Title:     updated.Title,
			UpdatedAt: pocketbase.ParsePBTime(updated.Updated),
		})
	}
}

// DeleteSOP removes a SOP, enforcing ownership.
// DELETE /api/sops/:id
func DeleteSOP(pb *pocketbase.Client, cfg *config.Config) fiber.Handler {
	return func(c fiber.Ctx) error {
		id := c.Params("id")
		if id == "" {
			return c.Status(fiber.StatusBadRequest).JSON(models.ErrorResponse{Error: "id is required"})
		}

		userID, email, token, ok := sopClaims(c)
		if !ok {
			return c.Status(fiber.StatusUnauthorized).JSON(models.ErrorResponse{Error: "Unauthorized"})
		}
		isAdmin := isSuperAdminEmail(email, cfg)

		// ownership check
		getResp, err := pb.Request(http.MethodGet, "/api/collections/sops/records/"+id, nil, nil, token)
		if err != nil || getResp.StatusCode != http.StatusOK {
			if getResp != nil {
				getResp.Body.Close()
			}
			return c.Status(fiber.StatusNotFound).JSON(models.ErrorResponse{Error: "SOP not found"})
		}

		var ownerCheck struct {
			User      string `json:"user"`
			UserEmail string `json:"user_email"`
		}
		_ = json.NewDecoder(getResp.Body).Decode(&ownerCheck)
		getResp.Body.Close()

		if !isAdmin && (ownerCheck.User != userID && ownerCheck.UserEmail != email) {
			return c.Status(fiber.StatusForbidden).JSON(models.ErrorResponse{Error: "Forbidden"})
		}

		delResp, err := pb.Request(http.MethodDelete, "/api/collections/sops/records/"+id, nil, nil, token)
		if err != nil {
			log.Printf("[SOP] DeleteSOP error: %v", err)
			return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{Error: "Failed to connect to PocketBase"})
		}
		defer delResp.Body.Close()

		// Invalidate admin cached list & stats
		cache.DefaultCache.Delete("admin_sops_list")
		cache.DefaultCache.InvalidatePrefix("admin_stats")

		return c.JSON(models.MessageResponse{Success: true, Message: "SOP deleted"})
	}
}

// isSuperAdminEmail matches the configured super admin email.
func isSuperAdminEmail(email string, cfg *config.Config) bool {
	if cfg != nil && cfg.SuperAdminEmail != "" {
		return strings.EqualFold(email, cfg.SuperAdminEmail)
	}
	return false
}
