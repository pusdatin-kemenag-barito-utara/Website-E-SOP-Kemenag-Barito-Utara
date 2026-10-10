package middleware

import (
	"strings"

	"github.com/gofiber/fiber/v3"

	"sop-kemenag-backend/config"
	"sop-kemenag-backend/pocketbase"
)

// VerifyJWT validates the PocketBase access token from the Authorization header.
func VerifyJWT(pb *pocketbase.Client, cfg *config.Config) fiber.Handler {
	return func(c fiber.Ctx) error {
		authHeader := c.Get("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			return c.Status(fiber.StatusUnauthorized).JSON(map[string]string{
				"error": "Missing or invalid Authorization header",
			})
		}

		tokenString := strings.TrimSpace(strings.TrimPrefix(authHeader, "Bearer "))
		if tokenString == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(map[string]string{
				"error": "Token is empty",
			})
		}

		claims, err := pb.VerifyUserToken(tokenString)
		if err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(map[string]string{
				"error": "Invalid or expired PocketBase token",
			})
		}

		if !claims.IsActive {
			return c.Status(fiber.StatusForbidden).JSON(map[string]string{
				"error": "Akun Anda telah dinonaktifkan",
			})
		}

		role := claims.Role
		if strings.EqualFold(claims.Email, cfg.SuperAdminEmail) {
			role = "super_admin"
		}

		c.Locals("user_id", claims.UserID)
		c.Locals("user_email", claims.Email)
		c.Locals("user_role", role)
		c.Locals("user_bidang", claims.Bidang)
		c.Locals("user_nama", claims.Nama)
		c.Locals("user_token", tokenString)

		return c.Next()
	}
}
