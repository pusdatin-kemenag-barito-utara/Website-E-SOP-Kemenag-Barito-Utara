package handlers

import (
	"bytes"
	"context"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/jackc/pgx/v5/pgxpool"

	"sop-kemenag-backend/config"
	"sop-kemenag-backend/models"
)

const supabaseAdminEndpoint = "auth/v1/admin/users"

// ListUsers returns all profiles from kemenag_sop.profiles.
// Protected by super_admin middleware.
func ListUsers(db *pgxpool.Pool) fiber.Handler {
	return func(c fiber.Ctx) error {
		rows, err := db.Query(context.Background(),
			`SELECT id, email, nama, role, bidang, COALESCE(is_active, true), created_at, updated_at
			 FROM kemenag_sop.profiles
			 ORDER BY created_at DESC`)
		if err != nil {
			log.Printf("[ADMIN] ListUsers error: %v", err)
			return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{
				Error: "Gagal mengambil daftar pengguna",
			})
		}
		defer rows.Close()

		profiles := []models.Profile{}
		for rows.Next() {
			var p models.Profile
			if err := rows.Scan(&p.ID, &p.Email, &p.Nama, &p.Role, &p.Bidang, &p.IsActive, &p.CreatedAt, &p.UpdatedAt); err != nil {
				log.Printf("[ADMIN] ListUsers scan error: %v", err)
				return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{
					Error: "Gagal membaca data pengguna",
				})
			}
			profiles = append(profiles, p)
		}

		return c.JSON(profiles)
	}
}

// CreateUser creates a new Supabase Auth user, then records their profile in kemenag_sop.profiles.
// Protected by super_admin middleware.
func CreateUser(db *pgxpool.Pool, cfg *config.Config) fiber.Handler {
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

		// Create user via Supabase Admin API (uses service role key)
		payload := map[string]interface{}{
			"email":         cleanEmail,
			"password":      req.Password,
			"email_confirm": true,
			"user_metadata": map[string]interface{}{
				"nama":      nama,
				"full_name": nama,
				"role":      role,
				"bidang":    bidang,
			},
		}
		bodyBytes, _ := json.Marshal(payload)

		resp, err := supabaseAdminRequest(cfg, http.MethodPost, supabaseAdminEndpoint, bodyBytes)
		if err != nil {
			log.Printf("[ADMIN] CreateUser supabase error: %v", err)
			return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{
				Error: "Gagal menghubungi layanan otentikasi",
			})
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
			respBody, _ := io.ReadAll(resp.Body)
			log.Printf("[ADMIN] CreateUser Supabase returned %d: %s", resp.StatusCode, string(respBody))
			return c.Status(fiber.StatusBadRequest).JSON(models.ErrorResponse{
				Error: string(respBody),
			})
		}

		var created struct {
			ID    string `json:"id"`
			Email string `json:"email"`
		}
		if err := json.NewDecoder(resp.Body).Decode(&created); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{
				Error: "Gagal memproses respon dari Supabase",
			})
		}

		// Insert or update profile directly in kemenag_sop.profiles
		_, dbErr := db.Exec(context.Background(),
			`INSERT INTO kemenag_sop.profiles (id, email, nama, role, bidang, is_active, created_at, updated_at)
			 VALUES ($1, $2, $3, $4, $5, true, now(), now())
			 ON CONFLICT (id) DO UPDATE SET
			   email = EXCLUDED.email,
			   nama = EXCLUDED.nama,
			   role = EXCLUDED.role,
			   bidang = EXCLUDED.bidang,
			   is_active = true,
			   updated_at = now()`,
			created.ID, cleanEmail, nama, role, bidang,
		)
		if dbErr != nil {
			log.Printf("[ADMIN] Create profile DB error: %v", dbErr)
		}

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

// UpdateUser updates profile information (nama, role, bidang, is_active) and optionally resets password.
// Protected by super_admin middleware.
func UpdateUser(db *pgxpool.Pool, cfg *config.Config) fiber.Handler {
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

		// Check current profile
		var currentEmail string
		err := db.QueryRow(context.Background(),
			`SELECT email FROM kemenag_sop.profiles WHERE id = $1`, id,
		).Scan(&currentEmail)
		if err != nil {
			return c.Status(fiber.StatusNotFound).JSON(models.ErrorResponse{
				Error: "Pengguna tidak ditemukan",
			})
		}

		// Don't allow deactivating or demoting the primary super admin
		if currentEmail == cfg.SuperAdminEmail {
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

		// If password is provided, reset in Supabase Auth via Admin API
		if req.Password != nil && strings.TrimSpace(*req.Password) != "" {
			newPass := strings.TrimSpace(*req.Password)
			if len(newPass) < 6 {
				return c.Status(fiber.StatusBadRequest).JSON(models.ErrorResponse{
					Error: "Kata sandi baru minimal 6 karakter",
				})
			}
			updatePayload := map[string]interface{}{
				"password": newPass,
				"user_metadata": map[string]interface{}{
					"nama":      nama,
					"full_name": nama,
					"role":      role,
					"bidang":    bidang,
				},
			}
			bodyBytes, _ := json.Marshal(updatePayload)
			resp, sbErr := supabaseAdminRequest(cfg, http.MethodPut, supabaseAdminEndpoint+"/"+id, bodyBytes)
			if sbErr != nil {
				log.Printf("[ADMIN] Reset password error: %v", sbErr)
			} else {
				resp.Body.Close()
			}
		} else {
			// Update user_metadata in Supabase Auth
			updatePayload := map[string]interface{}{
				"user_metadata": map[string]interface{}{
					"nama":      nama,
					"full_name": nama,
					"role":      role,
					"bidang":    bidang,
				},
			}
			bodyBytes, _ := json.Marshal(updatePayload)
			resp, sbErr := supabaseAdminRequest(cfg, http.MethodPut, supabaseAdminEndpoint+"/"+id, bodyBytes)
			if sbErr == nil {
				resp.Body.Close()
			}
		}

		// Update database profile
		_, updateErr := db.Exec(context.Background(),
			`UPDATE kemenag_sop.profiles
			 SET nama = $1, role = $2, bidang = $3, is_active = $4, updated_at = now()
			 WHERE id = $5`,
			nama, role, bidang, isActive, id,
		)
		if updateErr != nil {
			log.Printf("[ADMIN] Update profile DB error: %v", updateErr)
			return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{
				Error: "Gagal memperbarui profil pengguna",
			})
		}

		return c.JSON(fiber.Map{
			"success": true,
			"message": "Data pengguna berhasil diperbarui",
		})
	}
}

// DeleteUser deletes a Supabase Auth user by ID and removes profile.
// Protected by super_admin middleware.
func DeleteUser(db *pgxpool.Pool, cfg *config.Config) fiber.Handler {
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

		// Protect Super Admin email from deletion
		var email string
		_ = db.QueryRow(context.Background(),
			`SELECT email FROM kemenag_sop.profiles WHERE id = $1`, id,
		).Scan(&email)

		if email == cfg.SuperAdminEmail {
			return c.Status(fiber.StatusForbidden).JSON(models.ErrorResponse{
				Error: "Akun Super Admin utama tidak dapat dihapus",
			})
		}

		// Delete from Supabase Auth
		resp, err := supabaseAdminRequest(cfg, http.MethodDelete, supabaseAdminEndpoint+"/"+id, nil)
		if err != nil {
			log.Printf("[ADMIN] DeleteUser supabase error: %v", err)
			return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{
				Error: "Gagal menghapus user dari Supabase Auth",
			})
		}
		defer resp.Body.Close()

		// Delete from kemenag_sop.profiles
		_, _ = db.Exec(context.Background(), `DELETE FROM kemenag_sop.profiles WHERE id = $1`, id)

		return c.JSON(fiber.Map{
			"success": true,
			"message": "Pengguna berhasil dihapus",
		})
	}
}

// supabaseAdminRequest performs an authenticated call to the Supabase Auth Admin API
// using the service role key (full admin privileges).
func supabaseAdminRequest(cfg *config.Config, method, path string, body []byte) (*http.Response, error) {
	url := cfg.SupabaseURL + "/" + path
	req, err := http.NewRequest(method, url, bytes.NewReader(body))
	if err != nil {
		return nil, err
	}
	req.Header.Set("apikey", cfg.SupabaseServiceKey)
	req.Header.Set("Authorization", "Bearer "+cfg.SupabaseServiceKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 15 * time.Second}
	return client.Do(req)
}

