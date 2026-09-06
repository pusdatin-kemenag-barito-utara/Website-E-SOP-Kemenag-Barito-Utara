package handlers

import (
	"context"
	"errors"
	"log"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"sop-kemenag-backend/models"
)

// sopClaimsDestructure pulls the authenticated user identity set by VerifyJWT.
func sopClaims(c fiber.Ctx) (userID string, email string, ok bool) {
	uid, ok1 := c.Locals("user_id").(string)
	em, ok2 := c.Locals("user_email").(string)
	if !ok1 || !ok2 || uid == "" {
		return "", "", false
	}
	return uid, em, true
}

// ListUserSOPs returns the authenticated user's own SOP list.
// GET /api/sops
func ListUserSOPs(db *pgxpool.Pool) fiber.Handler {
	return func(c fiber.Ctx) error {
		userID, _, ok := sopClaims(c)
		if !ok {
			return c.Status(fiber.StatusUnauthorized).JSON(models.ErrorResponse{Error: "Unauthorized"})
		}

		rows, err := db.Query(context.Background(),
			`SELECT id, title, updated_at
			 FROM kemenag_sop.sops
			 WHERE user_id = $1
			 ORDER BY updated_at DESC`, userID)
		if err != nil {
			log.Printf("[SOP] ListUserSOPs error: %v", err)
			return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{Error: "Internal Server Error"})
		}
		defer rows.Close()

		items := []models.SOPListItem{}
		for rows.Next() {
			var it models.SOPListItem
			if err := rows.Scan(&it.ID, &it.Title, &it.UpdatedAt); err != nil {
				log.Printf("[SOP] ListUserSOPs scan error: %v", err)
				return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{Error: "Internal Server Error"})
			}
			items = append(items, it)
		}

		return c.JSON(items)
	}
}

// ListAdminSOPs returns ALL SOPs (super admin only).
// GET /api/sops/admin
func ListAdminSOPs(db *pgxpool.Pool) fiber.Handler {
	return func(c fiber.Ctx) error {
		rows, err := db.Query(context.Background(),
			`SELECT s.id, s.title, s.updated_at, s.user_id, s.user_email, p.bidang, s.header
			 FROM kemenag_sop.sops s
			 LEFT JOIN kemenag_sop.profiles p ON s.user_id = p.id
			 ORDER BY s.updated_at DESC`)
		if err != nil {
			log.Printf("[SOP] ListAdminSOPs error: %v", err)
			return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{Error: "Internal Server Error"})
		}
		defer rows.Close()

		items := []models.AdminSOPListItem{}
		for rows.Next() {
			var it models.AdminSOPListItem
			if err := rows.Scan(&it.ID, &it.Title, &it.UpdatedAt, &it.UserID, &it.UserEmail, &it.UserBidang, &it.Header); err != nil {
				log.Printf("[SOP] ListAdminSOPs scan error: %v", err)
				return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{Error: "Internal Server Error"})
			}
			items = append(items, it)
		}

		return c.JSON(items)
	}
}

// GetSOP returns a single SOP, enforcing ownership unless the user is super admin.
// GET /api/sops/:id
func GetSOP(db *pgxpool.Pool) fiber.Handler {
	return func(c fiber.Ctx) error {
		id := c.Params("id")
		if id == "" {
			return c.Status(fiber.StatusBadRequest).JSON(models.ErrorResponse{Error: "id is required"})
		}

		userID, email, ok := sopClaims(c)
		if !ok {
			return c.Status(fiber.StatusUnauthorized).JSON(models.ErrorResponse{Error: "Unauthorized"})
		}
		isAdmin := isSuperAdminEmail(email)

		var rec models.SOPRecord
		err := db.QueryRow(context.Background(),
			`SELECT id, user_id, user_email, title, header, activities, roles, created_at, updated_at
			 FROM kemenag_sop.sops WHERE id = $1`, id,
		).Scan(&rec.ID, &rec.UserID, &rec.UserEmail, &rec.Title, &rec.Header,
			&rec.Activities, &rec.Roles, &rec.CreatedAt, &rec.UpdatedAt)

		if errors.Is(err, pgx.ErrNoRows) {
			return c.Status(fiber.StatusNotFound).JSON(models.ErrorResponse{Error: "SOP not found"})
		}
		if err != nil {
			log.Printf("[SOP] GetSOP error: %v", err)
			return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{Error: "Internal Server Error"})
		}

		// ownership: user must own the SOP, or be super admin
		if !isAdmin && (rec.UserID == nil || *rec.UserID != userID) {
			return c.Status(fiber.StatusForbidden).JSON(models.ErrorResponse{Error: "Forbidden"})
		}

		return c.JSON(rec)
	}
}

// CreateSOP inserts a new SOP owned by the authenticated user.
// POST /api/sops
func CreateSOP(db *pgxpool.Pool) fiber.Handler {
	return func(c fiber.Ctx) error {
		userID, userEmail, ok := sopClaims(c)
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
		now := time.Now()

		var created models.SOPRecord
		err := db.QueryRow(context.Background(),
			`INSERT INTO kemenag_sop.sops
			   (user_id, user_email, title, header, activities, roles, created_at, updated_at)
			 VALUES ($1, $2, $3, $4, $5, $6, $7, $7)
			 RETURNING id, title, updated_at`,
			userID, userEmail, title, req.Header, req.Activities, req.Roles, now,
		).Scan(&created.ID, &created.Title, &created.UpdatedAt)

		if err != nil {
			log.Printf("[SOP] CreateSOP error: %v", err)
			return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{Error: "Internal Server Error"})
		}

		return c.Status(fiber.StatusCreated).JSON(models.SaveSOPResponse{
			ID:        created.ID,
			Title:     created.Title,
			UpdatedAt: created.UpdatedAt,
		})
	}
}

// UpdateSOP updates a SOP's header/activities/roles, enforcing ownership.
// PUT /api/sops/:id
func UpdateSOP(db *pgxpool.Pool) fiber.Handler {
	return func(c fiber.Ctx) error {
		id := c.Params("id")
		if id == "" {
			return c.Status(fiber.StatusBadRequest).JSON(models.ErrorResponse{Error: "id is required"})
		}

		userID, email, ok := sopClaims(c)
		if !ok {
			return c.Status(fiber.StatusUnauthorized).JSON(models.ErrorResponse{Error: "Unauthorized"})
		}
		isAdmin := isSuperAdminEmail(email)

		// ownership check
		var ownerID *string
		err := db.QueryRow(context.Background(),
			`SELECT user_id FROM kemenag_sop.sops WHERE id = $1`, id,
		).Scan(&ownerID)
		if errors.Is(err, pgx.ErrNoRows) {
			return c.Status(fiber.StatusNotFound).JSON(models.ErrorResponse{Error: "SOP not found"})
		}
		if err != nil {
			log.Printf("[SOP] UpdateSOP ownership check error: %v", err)
			return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{Error: "Internal Server Error"})
		}
		if !isAdmin && (ownerID == nil || *ownerID != userID) {
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
		now := time.Now()

		var updated models.SOPRecord
		err = db.QueryRow(context.Background(),
			`UPDATE kemenag_sop.sops
			 SET title = $2, header = $3, activities = $4, roles = $5, updated_at = $6
			 WHERE id = $1
			 RETURNING id, title, updated_at`,
			id, title, req.Header, req.Activities, req.Roles, now,
		).Scan(&updated.ID, &updated.Title, &updated.UpdatedAt)

		if err != nil {
			log.Printf("[SOP] UpdateSOP error: %v", err)
			return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{Error: "Internal Server Error"})
		}

		return c.JSON(models.SaveSOPResponse{
			ID:        updated.ID,
			Title:     updated.Title,
			UpdatedAt: updated.UpdatedAt,
		})
	}
}

// DeleteSOP removes a SOP, enforcing ownership.
// DELETE /api/sops/:id
func DeleteSOP(db *pgxpool.Pool) fiber.Handler {
	return func(c fiber.Ctx) error {
		id := c.Params("id")
		if id == "" {
			return c.Status(fiber.StatusBadRequest).JSON(models.ErrorResponse{Error: "id is required"})
		}

		userID, email, ok := sopClaims(c)
		if !ok {
			return c.Status(fiber.StatusUnauthorized).JSON(models.ErrorResponse{Error: "Unauthorized"})
		}
		isAdmin := isSuperAdminEmail(email)

		var ownerID *string
		err := db.QueryRow(context.Background(),
			`SELECT user_id FROM kemenag_sop.sops WHERE id = $1`, id,
		).Scan(&ownerID)
		if errors.Is(err, pgx.ErrNoRows) {
			return c.Status(fiber.StatusNotFound).JSON(models.ErrorResponse{Error: "SOP not found"})
		}
		if err != nil {
			log.Printf("[SOP] DeleteSOP ownership check error: %v", err)
			return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{Error: "Internal Server Error"})
		}
		if !isAdmin && (ownerID == nil || *ownerID != userID) {
			return c.Status(fiber.StatusForbidden).JSON(models.ErrorResponse{Error: "Forbidden"})
		}

		if _, err := db.Exec(context.Background(),
			`DELETE FROM kemenag_sop.sops WHERE id = $1`, id); err != nil {
			log.Printf("[SOP] DeleteSOP error: %v", err)
			return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{Error: "Internal Server Error"})
		}

		return c.JSON(models.MessageResponse{Success: true, Message: "SOP deleted"})
	}
}

// isSuperAdminEmail matches the configured super admin email (hardcoded fallback).
func isSuperAdminEmail(email string) bool {
	return email == "baritoutara@kemenag.go.id"
}
