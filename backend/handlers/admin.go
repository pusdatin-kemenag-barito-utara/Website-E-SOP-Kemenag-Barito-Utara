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

const usersListCacheKey = "admin_users_list"

// ListUsers returns all profiles from PocketBase users collection.
// Protected by super_admin middleware.
func ListUsers(pb *pocketbase.Client) fiber.Handler {
	return func(c fiber.Ctx) error {
		if cached, found := cache.DefaultCache.Get(usersListCacheKey); found {
			if profiles, ok := cached.([]models.Profile); ok {
				return c.JSON(profiles)
			}
		}

		q := url.Values{}
		q.Set("sort", "-created")
		q.Set("perPage", "500")

		userToken, _ := c.Locals("user_token").(string)
		resp, err := pb.Request(http.MethodGet, "/api/collections/users/records", q, nil, userToken)
		if err != nil {
			log.Printf("[ADMIN] ListUsers error: %v", err)
			return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{
				Error: "Gagal mengambil daftar pengguna dari PocketBase",
			})
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{
				Error: fmt.Sprintf("PocketBase error (%d)", resp.StatusCode),
			})
		}

		var pbList struct {
			Items []struct {
				ID        string    `json:"id"`
				Email     string    `json:"email"`
				Name      string    `json:"name"`
				Nama      string    `json:"nama"`
				Role      string    `json:"role"`
				Bidang    string    `json:"bidang"`
				IsActive  *bool     `json:"is_active"`
				Created   interface{} `json:"created"`
				Updated   interface{} `json:"updated"`
			} `json:"items"`
		}

		if err := json.NewDecoder(resp.Body).Decode(&pbList); err != nil {
			log.Printf("[ADMIN] ListUsers decode error: %v", err)
			return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{
				Error: "Gagal membaca data pengguna",
			})
		}

		profiles := make([]models.Profile, 0, len(pbList.Items))
		for _, item := range pbList.Items {
			nama := item.Nama
			if nama == "" {
				nama = item.Name
			}
			email := item.Email
			bidang := item.Bidang
			isActive := true
			if item.IsActive != nil {
				isActive = *item.IsActive
			}

			role := item.Role
			if role == "" {
				role = "admin_bidang"
			}

			profiles = append(profiles, models.Profile{
				ID:        item.ID,
				Email:     &email,
				Nama:      &nama,
				Role:      role,
				Bidang:    &bidang,
				IsActive:  isActive,
				CreatedAt: pocketbase.ParsePBTime(item.Created),
				UpdatedAt: pocketbase.ParsePBTime(item.Updated),
			})
		}

		// Cache user list for 60 seconds
		cache.DefaultCache.Set(usersListCacheKey, profiles, 60*time.Second)

		return c.JSON(profiles)
	}
}

// CreateUser creates a new user in PocketBase users collection.
// Protected by super_admin middleware.
func CreateUser(pb *pocketbase.Client, cfg *config.Config) fiber.Handler {
	return func(c fiber.Ctx) error {
		var req models.CreateUserRequest
		if err := c.Bind().JSON(&req); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(models.ErrorResponse{
				Error: "Format request tidak valid",
			})
		}

		cleanEmail := strings.TrimSpace(strings.ToLower(req.Email))
		if cleanEmail == "" || req.Password == "" || strings.TrimSpace(req.Bidang) == "" {
			return c.Status(fiber.StatusBadRequest).JSON(models.ErrorResponse{
				Error: "Email, kata sandi, dan bidang wajib diisi",
			})
		}

		role := strings.TrimSpace(req.Role)
		if role != "super_admin" {
			role = "admin_bidang"
		}

		nama := strings.TrimSpace(req.Nama)
		if nama == "" {
			nama = strings.Split(cleanEmail, "@")[0]
		}
		bidang := strings.TrimSpace(req.Bidang)

		payload := map[string]interface{}{
			"email":           cleanEmail,
			"password":        req.Password,
			"passwordConfirm": req.Password,
			"name":            nama,
			"nama":            nama,
			"role":            role,
			"bidang":          bidang,
			"is_active":       true,
			"emailVisibility": true,
		}

		userToken, _ := c.Locals("user_token").(string)
		resp, err := pb.Request(http.MethodPost, "/api/collections/users/records", nil, payload, userToken)
		if err != nil {
			log.Printf("[ADMIN] CreateUser error: %v", err)
			return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{
				Error: "Gagal membuat pengguna di PocketBase",
			})
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
			respBody, _ := io.ReadAll(resp.Body)
			log.Printf("[ADMIN] CreateUser PocketBase returned %d: %s", resp.StatusCode, string(respBody))
			return c.Status(fiber.StatusBadRequest).JSON(models.ErrorResponse{
				Error: string(respBody),
			})
		}

		var created struct {
			ID    string `json:"id"`
			Email string `json:"email"`
		}
		_ = json.NewDecoder(resp.Body).Decode(&created)

		// Invalidate user cache and dashboard stats
		cache.DefaultCache.Delete(usersListCacheKey)
		cache.DefaultCache.InvalidatePrefix("admin_stats")
		cache.DefaultCache.InvalidatePrefix("admin_dashboard_stats")

		return c.Status(fiber.StatusCreated).JSON(fiber.Map{
			"success": true,
			"user": fiber.Map{
				"id":        created.ID,
				"email":     cleanEmail,
				"nama":      nama,
				"role":      role,
				"bidang":    bidang,
				"is_active": true,
			},
		})
	}
}

// UpdateUser updates profile information and optionally resets password in PocketBase.
// Protected by super_admin middleware.
func UpdateUser(pb *pocketbase.Client, cfg *config.Config) fiber.Handler {
	return func(c fiber.Ctx) error {
		id := c.Params("id")
		if id == "" {
			id = c.Query("id")
		}
		if id == "" {
			return c.Status(fiber.StatusBadRequest).JSON(models.ErrorResponse{
				Error: "User ID wajib disertakan",
			})
		}

		var req models.UpdateUserRequest
		if err := c.Bind().JSON(&req); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(models.ErrorResponse{
				Error: "Format request tidak valid",
			})
		}

		// Check current user record
		userToken, _ := c.Locals("user_token").(string)
		getResp, err := pb.Request(http.MethodGet, "/api/collections/users/records/"+id, nil, nil, userToken)
		if err != nil || getResp.StatusCode != http.StatusOK {
			if getResp != nil {
				getResp.Body.Close()
			}
			return c.Status(fiber.StatusNotFound).JSON(models.ErrorResponse{
				Error: "Pengguna tidak ditemukan",
			})
		}

		var currentRecord struct {
			Email string `json:"email"`
		}
		_ = json.NewDecoder(getResp.Body).Decode(&currentRecord)
		getResp.Body.Close()

		// Protect Primary Super Admin
		if strings.EqualFold(currentRecord.Email, cfg.SuperAdminEmail) {
			req.Role = "super_admin"
			active := true
			req.IsActive = &active
		}

		role := strings.TrimSpace(req.Role)
		if role != "super_admin" {
			role = "admin_bidang"
		}
		nama := strings.TrimSpace(req.Nama)
		bidang := strings.TrimSpace(req.Bidang)
		isActive := true
		if req.IsActive != nil {
			isActive = *req.IsActive
		}

		updatePayload := map[string]interface{}{
			"name":      nama,
			"nama":      nama,
			"role":      role,
			"bidang":    bidang,
			"is_active": isActive,
		}

		if req.Password != nil && strings.TrimSpace(*req.Password) != "" {
			newPass := strings.TrimSpace(*req.Password)
			if len(newPass) < 6 {
				return c.Status(fiber.StatusBadRequest).JSON(models.ErrorResponse{
					Error: "Kata sandi baru minimal 6 karakter",
				})
			}
			updatePayload["password"] = newPass
			updatePayload["passwordConfirm"] = newPass
		}

		patchResp, patchErr := pb.Request(http.MethodPatch, "/api/collections/users/records/"+id, nil, updatePayload, userToken)
		if patchErr != nil {
			log.Printf("[ADMIN] Update profile error: %v", patchErr)
			return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{
				Error: "Gagal memperbarui profil pengguna di PocketBase",
			})
		}
		defer patchResp.Body.Close()

		if patchResp.StatusCode != http.StatusOK {
			respBody, _ := io.ReadAll(patchResp.Body)
			return c.Status(fiber.StatusBadRequest).JSON(models.ErrorResponse{
				Error: string(respBody),
			})
		}

		// Invalidate user cache and dashboard stats
		cache.DefaultCache.Delete(usersListCacheKey)
		cache.DefaultCache.InvalidatePrefix("admin_stats")
		cache.DefaultCache.InvalidatePrefix("admin_dashboard_stats")

		return c.JSON(fiber.Map{
			"success": true,
			"message": "Data pengguna berhasil diperbarui",
		})
	}
}

// DeleteUser deletes a PocketBase user by ID.
// Protected by super_admin middleware.
func DeleteUser(pb *pocketbase.Client, cfg *config.Config) fiber.Handler {
	return func(c fiber.Ctx) error {
		id := c.Params("id")
		if id == "" {
			id = c.Query("id")
		}
		if id == "" {
			return c.Status(fiber.StatusBadRequest).JSON(models.ErrorResponse{
				Error: "User ID wajib disertakan",
			})
		}

		userToken, _ := c.Locals("user_token").(string)

		// Get user email to protect Super Admin
		getResp, err := pb.Request(http.MethodGet, "/api/collections/users/records/"+id, nil, nil, userToken)
		if err == nil && getResp.StatusCode == http.StatusOK {
			var current struct {
				Email string `json:"email"`
			}
			_ = json.NewDecoder(getResp.Body).Decode(&current)
			getResp.Body.Close()

			if strings.EqualFold(current.Email, cfg.SuperAdminEmail) {
				return c.Status(fiber.StatusForbidden).JSON(models.ErrorResponse{
					Error: "Akun Super Admin utama tidak dapat dihapus",
				})
			}
		} else if getResp != nil {
			getResp.Body.Close()
		}

		delResp, err := pb.Request(http.MethodDelete, "/api/collections/users/records/"+id, nil, nil, userToken)
		if err != nil {
			log.Printf("[ADMIN] DeleteUser error: %v", err)
			return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{
				Error: "Gagal menghapus pengguna dari PocketBase",
			})
		}
		defer delResp.Body.Close()

		// Invalidate user cache and dashboard stats
		cache.DefaultCache.Delete(usersListCacheKey)
		cache.DefaultCache.InvalidatePrefix("admin_stats")
		cache.DefaultCache.InvalidatePrefix("admin_dashboard_stats")

		return c.JSON(fiber.Map{
			"success": true,
			"message": "Pengguna berhasil dihapus",
		})
	}
}

// ResetAllPasswords resets all non-super-admin user passwords to a specified password (default "123456").
// Super Admin (baritoutara@kemenag.go.id / role super_admin) is strictly protected and never touched.
func ResetAllPasswords(pb *pocketbase.Client, cfg *config.Config) fiber.Handler {
	return func(c fiber.Ctx) error {
		var req struct {
			Password string `json:"password"`
		}
		_ = c.Bind().JSON(&req)

		newPassword := strings.TrimSpace(req.Password)
		if newPassword == "" {
			newPassword = "123456"
		}
		if len(newPassword) < 6 {
			return c.Status(fiber.StatusBadRequest).JSON(models.ErrorResponse{
				Error: "Kata sandi minimal 6 karakter",
			})
		}

		userToken, _ := c.Locals("user_token").(string)

		// 1. Fetch all users from PocketBase
		q := url.Values{}
		q.Set("perPage", "500")
		resp, err := pb.Request(http.MethodGet, "/api/collections/users/records", q, nil, userToken)
		if err != nil {
			log.Printf("[ADMIN] ResetAllPasswords List error: %v", err)
			return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{
				Error: "Gagal mengambil daftar pengguna dari PocketBase",
			})
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{
				Error: fmt.Sprintf("PocketBase error (%d)", resp.StatusCode),
			})
		}

		var pbList struct {
			Items []struct {
				ID    string `json:"id"`
				Email string `json:"email"`
				Role  string `json:"role"`
				Nama  string `json:"nama"`
				Name  string `json:"name"`
			} `json:"items"`
		}
		if err := json.NewDecoder(resp.Body).Decode(&pbList); err != nil {
			log.Printf("[ADMIN] ResetAllPasswords decode error: %v", err)
			return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{
				Error: "Gagal membaca data pengguna",
			})
		}

		var updatedCount int
		var skippedCount int
		var failedAccounts []string
		var lastErrorMsg string

		for _, item := range pbList.Items {
			cleanEmail := strings.TrimSpace(strings.ToLower(item.Email))

			// STRICT SECURITY RULE: Super Admin is protected and never touched under any circumstance
			if strings.EqualFold(cleanEmail, cfg.SuperAdminEmail) || strings.EqualFold(item.Role, "super_admin") {
				skippedCount++
				continue
			}

			updatePayload := map[string]interface{}{
				"password":        newPassword,
				"passwordConfirm": newPassword,
				"is_active":       true,
			}

			// Try updating with userToken
			patchResp, patchErr := pb.Request(http.MethodPatch, "/api/collections/users/records/"+item.ID, nil, updatePayload, userToken)
			if patchErr != nil || patchResp.StatusCode != http.StatusOK {
				var errMsg string
				if patchResp != nil {
					b, _ := io.ReadAll(patchResp.Body)
					patchResp.Body.Close()
					errMsg = string(b)
				}
				// Retry with PocketBase admin token fallback if configured
				patchResp2, patchErr2 := pb.Request(http.MethodPatch, "/api/collections/users/records/"+item.ID, nil, updatePayload, "")
				if patchErr2 != nil || patchResp2.StatusCode != http.StatusOK {
					var errMsg2 string
					if patchResp2 != nil {
						b2, _ := io.ReadAll(patchResp2.Body)
						patchResp2.Body.Close()
						errMsg2 = string(b2)
					}
					lastErrorMsg = fmt.Sprintf("UserToken error: %s | Admin fallback error: %s", errMsg, errMsg2)
					log.Printf("[ADMIN] Failed to reset password for %s (%s): %s", item.ID, cleanEmail, lastErrorMsg)
					failedAccounts = append(failedAccounts, cleanEmail)
					continue
				}
				patchResp2.Body.Close()
			} else {
				patchResp.Body.Close()
			}

			updatedCount++
		}

		cache.DefaultCache.Delete(usersListCacheKey)

		if len(failedAccounts) > 0 && updatedCount == 0 {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"success": false,
				"error":   fmt.Sprintf("Gagal memperbarui sandi pengguna di PocketBase. Detail: %s", lastErrorMsg),
				"failed":  failedAccounts,
			})
		}

		return c.JSON(fiber.Map{
			"success":       true,
			"message":       fmt.Sprintf("Berhasil mengatur ulang kata sandi %d akun admin menjadi '%s'. Akun Super Admin tidak diubah.", updatedCount, newPassword),
			"updated_count": updatedCount,
			"skipped_count": skippedCount,
			"failed_count":  len(failedAccounts),
			"failed":        failedAccounts,
		})
	}
}

// GetAdminStats returns aggregated dashboard statistics for super admins.
// Results are cached in memory for 60 seconds with automatic invalidation on updates.
// GET /api/admin/stats
func GetAdminStats(pb *pocketbase.Client) fiber.Handler {
	return func(c fiber.Ctx) error {
		const cacheKey = "admin_dashboard_stats"
		if cached, found := cache.DefaultCache.Get(cacheKey); found {
			return c.JSON(cached)
		}

		userToken, _ := c.Locals("user_token").(string)

		// 1. Fetch user counts & roles
		uq := url.Values{}
		uq.Set("perPage", "500")
		uq.Set("fields", "id,role,bidang,is_active")
		uResp, err := pb.Request(http.MethodGet, "/api/collections/users/records", uq, nil, userToken)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{
				Error: "Gagal mengambil statistik pengguna",
			})
		}
		defer uResp.Body.Close()

		var uList struct {
			Items []struct {
				Role     string `json:"role"`
				Bidang   string `json:"bidang"`
				IsActive *bool  `json:"is_active"`
			} `json:"items"`
		}
		_ = json.NewDecoder(uResp.Body).Decode(&uList)

		totalUsers := len(uList.Items)
		activeUsers := 0
		inactiveUsers := 0
		usersByRole := make(map[string]int)

		for _, u := range uList.Items {
			role := u.Role
			if role == "" {
				role = "admin_bidang"
			}
			usersByRole[role]++

			if u.IsActive == nil || *u.IsActive {
				activeUsers++
			} else {
				inactiveUsers++
			}
		}

		// 2. Fetch SOP counts & bidang distribution
		sq := url.Values{}
		sq.Set("perPage", "500")
		sq.Set("expand", "user")
		sq.Set("fields", "id,user_bidang,expand.user.bidang")
		sResp, err := pb.Request(http.MethodGet, "/api/collections/sops/records", sq, nil, userToken)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{
				Error: "Gagal mengambil statistik SOP",
			})
		}
		defer sResp.Body.Close()

		var sList struct {
			Items []struct {
				ID         string `json:"id"`
				UserBidang string `json:"user_bidang"`
				Expand     struct {
					User struct {
						Bidang string `json:"bidang"`
					} `json:"user"`
				} `json:"expand"`
			} `json:"items"`
		}
		_ = json.NewDecoder(sResp.Body).Decode(&sList)

		totalSOPs := len(sList.Items)
		sopsByBidang := make(map[string]int)

		for _, s := range sList.Items {
			bidang := strings.TrimSpace(s.UserBidang)
			if bidang == "" {
				bidang = strings.TrimSpace(s.Expand.User.Bidang)
			}
			if bidang == "" {
				bidang = "Umum"
			}
			sopsByBidang[bidang]++
		}

		stats := fiber.Map{
			"total_sops":     totalSOPs,
			"total_users":    totalUsers,
			"active_users":   activeUsers,
			"inactive_users": inactiveUsers,
			"sops_by_bidang": sopsByBidang,
			"users_by_role":  usersByRole,
			"cached_at":      time.Now().Format(time.RFC3339),
		}

		// Cache for 60 seconds
		cache.DefaultCache.Set(cacheKey, stats, 60*time.Second)

		return c.JSON(stats)
	}
}

