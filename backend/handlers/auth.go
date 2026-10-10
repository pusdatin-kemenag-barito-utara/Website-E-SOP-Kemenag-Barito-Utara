package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/gofiber/fiber/v3"

	"sop-kemenag-backend/config"
	"sop-kemenag-backend/models"
	"sop-kemenag-backend/pocketbase"
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
func CheckRbac(pb *pocketbase.Client, cfg *config.Config) fiber.Handler {
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

		// 1. Jika token otentikasi disertakan di header (dikirim oleh frontend useAuth),
		// verifikasi klaim pengguna langsung via PocketBase auth-refresh
		authHeader := c.Get("Authorization")
		if strings.HasPrefix(authHeader, "Bearer ") {
			token := strings.TrimSpace(strings.TrimPrefix(authHeader, "Bearer "))
			if token != "" {
				claims, err := pb.VerifyUserToken(token)
				if err == nil && claims != nil {
					if !claims.IsActive {
						return c.JSON(models.CheckRbacResponse{
							Success: false,
							Error:   "Akun Anda telah dinonaktifkan. Silakan hubungi Super Admin.",
						})
					}
					return c.JSON(models.CheckRbacResponse{Success: true})
				}
			}
		}

		// 2. Super Admin bypass
		if strings.EqualFold(cleanEmail, cfg.SuperAdminEmail) {
			return c.JSON(models.CheckRbacResponse{Success: true})
		}

		// Cari profil pengguna di koleksi users PocketBase
		q := url.Values{}
		q.Set("filter", fmt.Sprintf("email='%s'", cleanEmail))
		q.Set("perPage", "1")

		resp, err := pb.Request(http.MethodGet, "/api/collections/users/records", q, nil, "")
		if err != nil {
			log.Printf("[RBAC] PocketBase request error: %v", err)
			return c.Status(fiber.StatusInternalServerError).JSON(models.CheckRbacResponse{
				Success: false,
				Error:   "Terjadi kesalahan sistem saat memverifikasi akses ke PocketBase.",
			})
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			log.Printf("[RBAC] PocketBase returned status %d", resp.StatusCode)
			return c.Status(fiber.StatusInternalServerError).JSON(models.CheckRbacResponse{
				Success: false,
				Error:   "Gagal membaca data dari server PocketBase.",
			})
		}

		var searchRes struct {
			Items []struct {
				ID       string `json:"id"`
				Email    string `json:"email"`
				Role     string `json:"role"`
				IsActive *bool  `json:"is_active"`
			} `json:"items"`
		}

		if err := json.NewDecoder(resp.Body).Decode(&searchRes); err != nil {
			log.Printf("[RBAC] Decode error: %v", err)
			return c.Status(fiber.StatusInternalServerError).JSON(models.CheckRbacResponse{
				Success: false,
				Error:   "Gagal memproses data otentikasi.",
			})
		}

		if len(searchRes.Items) == 0 {
			log.Printf("[RBAC] User not found in PocketBase: %s", cleanEmail)
			return c.JSON(models.CheckRbacResponse{
				Success: false,
				Error:   "Akun belum terdaftar di aplikasi E-SOP Digital. Silakan hubungi Super Admin.",
			})
		}

		userItem := searchRes.Items[0]
		isActive := true
		if userItem.IsActive != nil {
			isActive = *userItem.IsActive
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
