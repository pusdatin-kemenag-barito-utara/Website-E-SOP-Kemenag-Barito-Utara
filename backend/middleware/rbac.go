package middleware

import (
	"context"

	"github.com/gofiber/fiber/v3"
	"github.com/jackc/pgx/v5/pgxpool"

	"sop-kemenag-backend/config"
)

// VerifySuperAdmin ensures the authenticated user (from JWT) is the super admin.
// It checks the JWT email claim against the configured super admin email.
func VerifySuperAdmin(cfg *config.Config) fiber.Handler {
	return func(c fiber.Ctx) error {
		email, ok := c.Locals("user_email").(string)
		if !ok || email != cfg.SuperAdminEmail {
			return c.Status(fiber.StatusForbidden).JSON(map[string]string{
				"error": "Forbidden: insufficient permissions",
			})
		}
		return c.Next()
	}
}

// RequireRbac checks the user's access via kemenag_sop.profiles.
// Allows any active user (super_admin or admin_bidang).
func RequireRbac(db *pgxpool.Pool, cfg *config.Config) fiber.Handler {
	return func(c fiber.Ctx) error {
		userID, ok := c.Locals("user_id").(string)
		if !ok || userID == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(map[string]string{
				"error": "Unauthorized",
			})
		}

		userEmail, _ := c.Locals("user_email").(string)
		if userEmail == cfg.SuperAdminEmail {
			c.Locals("user_role", "super_admin")
			return c.Next()
		}

		var role string
		var isActive bool
		err := db.QueryRow(context.Background(),
			`SELECT role, COALESCE(is_active, true) FROM kemenag_sop.profiles WHERE id = $1`, userID,
		).Scan(&role, &isActive)

		if err != nil || !isActive {
			return c.Status(fiber.StatusForbidden).JSON(map[string]string{
				"error": "Forbidden: you do not have access to this application",
			})
		}

		c.Locals("user_role", role)
		return c.Next()
	}
}
