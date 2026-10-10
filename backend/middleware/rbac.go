package middleware

import (
	"strings"

	"github.com/gofiber/fiber/v3"

	"sop-kemenag-backend/config"
	"sop-kemenag-backend/pocketbase"
)

// VerifySuperAdmin ensures the authenticated user is the super admin.
func VerifySuperAdmin(cfg *config.Config) fiber.Handler {
	return func(c fiber.Ctx) error {
		email, _ := c.Locals("user_email").(string)
		role, _ := c.Locals("user_role").(string)

		isSuper := strings.EqualFold(email, cfg.SuperAdminEmail) || role == "super_admin"
		if !isSuper {
			return c.Status(fiber.StatusForbidden).JSON(map[string]string{
				"error": "Forbidden: insufficient permissions",
			})
		}
		return c.Next()
	}
}

// RequireRbac checks the user's access via PocketBase users record.
// Allows any active user (super_admin or admin_bidang).
func RequireRbac(pb *pocketbase.Client, cfg *config.Config) fiber.Handler {
	return func(c fiber.Ctx) error {
		userID, ok := c.Locals("user_id").(string)
		if !ok || userID == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(map[string]string{
				"error": "Unauthorized",
			})
		}

		userEmail, _ := c.Locals("user_email").(string)
		if strings.EqualFold(userEmail, cfg.SuperAdminEmail) {
			c.Locals("user_role", "super_admin")
			return c.Next()
		}

		role, _ := c.Locals("user_role").(string)
		if role == "" {
			return c.Status(fiber.StatusForbidden).JSON(map[string]string{
				"error": "Forbidden: you do not have access to this application",
			})
		}

		return c.Next()
	}
}
