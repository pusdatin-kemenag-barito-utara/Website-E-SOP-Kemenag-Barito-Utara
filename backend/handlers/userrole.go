package handlers

import (
	"context"
	"log"
	"strings"

	"github.com/gofiber/fiber/v3"
	"github.com/jackc/pgx/v5/pgxpool"

	"sop-kemenag-backend/config"
)

// GetUserRole returns the role of the authenticated user.
// The identity comes from the verified JWT claims (set by VerifyJWT middleware),
// so no trust can be placed on a client-supplied email query parameter.
// GET /api/admin/user-role
func GetUserRole(db *pgxpool.Pool, cfg *config.Config) fiber.Handler {
	return func(c fiber.Ctx) error {
		email, ok := c.Locals("user_email").(string)
		if !ok || email == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
		}

		var role string
		err := db.QueryRow(context.Background(),
			`SELECT role FROM kemenag_sop.profiles WHERE LOWER(email) = LOWER($1)`,
			email,
		).Scan(&role)

		if err != nil {
			if cfg != nil && cfg.SuperAdminEmail != "" && strings.EqualFold(email, cfg.SuperAdminEmail) {
				return c.JSON(fiber.Map{"role": "super_admin", "email": email})
			}
			log.Printf("[ADMIN] GetUserRole error: %v", err)
			return c.JSON(fiber.Map{"role": nil, "email": email})
		}

		return c.JSON(fiber.Map{"role": role, "email": email})
	}
}