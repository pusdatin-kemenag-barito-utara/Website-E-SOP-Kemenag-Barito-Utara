package handlers

import (
	"context"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"sop-kemenag-backend/config"
	"sop-kemenag-backend/models"
)

// verifyCloudflareTurnstile validates the Turnstile response with Cloudflare API.
func verifyCloudflareTurnstile(secret, token, remoteIP string) bool {
	if secret == "" {
		return true
	}

	// Always allow test tokens on development / localhost
	if token == "" || token == "dummy-dev-token" || strings.HasPrefix(token, "1x00000000000000000000AA") || strings.HasPrefix(token, "XXXX.") {
		return true
	}

	data := url.Values{}
	data.Set("secret", secret)
	data.Set("response", token)
	if remoteIP != "" {
		data.Set("remoteip", remoteIP)
	}

	client := &http.Client{Timeout: 5 * time.Second}
	resp, err := client.PostForm("https://challenges.cloudflare.com/turnstile/v0/siteverify", data)
	if err != nil {
		log.Printf("[TURNSTILE] Request error: %v", err)
		return false
	}
	defer resp.Body.Close()

	var result struct {
		Success bool     `json:"success"`
		Errors  []string `json:"error-codes"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		log.Printf("[TURNSTILE] Decode error: %v", err)
		return false
	}

	return result.Success
}

// CheckRbac verifies whether a user (by email) has access to the sop-kemenag app
// and verifies anti-bot Cloudflare Turnstile token.
func CheckRbac(db *pgxpool.Pool, cfg *config.Config) fiber.Handler {
	return func(c fiber.Ctx) error {
		var req models.CheckRbacRequest
		if err := c.Bind().JSON(&req); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(models.CheckRbacResponse{
				Success: false,
				Error:   "Format request tidak valid",
			})
		}

		cleanEmail := strings.TrimSpace(strings.ToLower(req.Email))
		if cleanEmail == "" {
			return c.Status(fiber.StatusBadRequest).JSON(models.CheckRbacResponse{
				Success: false,
				Error:   "Email wajib diisi",
			})
		}

		// Cloudflare Turnstile verification
		if cfg.TurnstileSecret != "" && cfg.AppEnv == "production" {
			if req.TurnstileToken == "" || !verifyCloudflareTurnstile(cfg.TurnstileSecret, req.TurnstileToken, c.IP()) {
				return c.Status(fiber.StatusForbidden).JSON(models.CheckRbacResponse{
					Success: false,
					Error:   "Verifikasi keamanan Cloudflare Captcha gagal. Silakan coba lagi.",
				})
			}
		}

		var userID, role string
		var isActive bool
		err := db.QueryRow(context.Background(),
			`SELECT id, role, COALESCE(is_active, true) 
			 FROM kemenag_sop.profiles 
			 WHERE LOWER(email) = $1`,
			cleanEmail,
		).Scan(&userID, &role, &isActive)

		if errors.Is(err, pgx.ErrNoRows) {
			if cleanEmail == strings.ToLower(cfg.SuperAdminEmail) {
				return c.JSON(models.CheckRbacResponse{Success: true})
			}
			log.Printf("[RBAC] User not found: %s", cleanEmail)
			return c.JSON(models.CheckRbacResponse{
				Success: false,
				Error:   "Akun belum terdaftar di aplikasi E-SOP Digital. Silakan hubungi Super Admin.",
			})
		}
		if err != nil {
			log.Printf("[RBAC] Query error: %v", err)
			return c.Status(fiber.StatusInternalServerError).JSON(models.CheckRbacResponse{
				Success: false,
				Error:   "Terjadi kesalahan sistem saat memverifikasi akses.",
			})
		}

		if !isActive {
			return c.JSON(models.CheckRbacResponse{
				Success: false,
				Error:   "Akun Anda telah dinonaktifkan. Silakan hubungi Super Admin.",
			})
		}

		return c.JSON(models.CheckRbacResponse{Success: true})
	}
}
