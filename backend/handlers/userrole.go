package handlers

import (
	"strings"

	"github.com/gofiber/fiber/v3"

	"sop-kemenag-backend/config"
	"sop-kemenag-backend/pocketbase"
)

// GetUserRole returns the role of the authenticated user.
// GET /api/admin/user-role
func GetUserRole(pb *pocketbase.Client, cfg *config.Config) fiber.Handler {
	return func(c fiber.Ctx) error {
		email, ok := c.Locals("user_email").(string)
		if !ok || email == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
		}

		role, _ := c.Locals("user_role").(string)
		if strings.EqualFold(email, cfg.SuperAdminEmail) {
			role = "super_admin"
		}

		return c.JSON(fiber.Map{
			"role":   role,
			"email":  email,
			"id":     c.Locals("user_id"),
			"nama":   c.Locals("user_nama"),
			"bidang": c.Locals("user_bidang"),
		})
	}
}