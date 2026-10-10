package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	AppEnv                  string
	ServerPort              string
	PocketbaseURL           string
	PocketbaseAdminEmail    string
	PocketbaseAdminPassword string
	PusdatinURL             string
	FrontendURL             string
	SuperAdminEmail         string
	TurnstileSecret         string
	DefaultUserPassword     string
}

func Load() *Config {
	// Variabel lingkungan diinjeksi langsung ke proses via Infisical CLI / runtime container.
	for _, p := range []string{".env", "../.env"} {
		_ = godotenv.Load(p)
	}

	pbURL := getEnv("POCKETBASE_URL", getEnv("PUBLIC_POCKETBASE_URL", ""))
	superAdminEmail := getEnv("SUPER_ADMIN_EMAIL", getEnv("PUBLIC_SUPER_ADMIN_EMAIL", ""))
	pbAdminEmail := getEnv("POCKETBASE_ADMIN_EMAIL", superAdminEmail)

	return &Config{
		AppEnv:                  getEnv("APP_ENV", "development"),
		ServerPort:              getEnv("SERVER_PORT", "8080"),
		PocketbaseURL:           pbURL,
		PocketbaseAdminEmail:    pbAdminEmail,
		PocketbaseAdminPassword: getEnv("POCKETBASE_ADMIN_PASSWORD", ""),
		PusdatinURL:             getEnv("PUSDATIN_URL", getEnv("PUBLIC_PUSDATIN_URL", "")),
		FrontendURL:             getEnv("FRONTEND_URL", getEnv("PUBLIC_SITE_URL", "")),
		SuperAdminEmail:         superAdminEmail,
		TurnstileSecret:         getEnv("TURNSTILE_SECRET_KEY", ""),
		DefaultUserPassword:     getEnv("DEFAULT_USER_PASSWORD", ""),
	}
}

func (c *Config) Validate() {
	if c.PocketbaseURL == "" {
		log.Fatal("CRITICAL: POCKETBASE_URL (atau PUBLIC_POCKETBASE_URL) wajib disediakan via Infisical / environment variable")
	}
	if c.SuperAdminEmail == "" {
		log.Fatal("CRITICAL: SUPER_ADMIN_EMAIL (atau PUBLIC_SUPER_ADMIN_EMAIL) wajib disediakan via Infisical / environment variable")
	}
	if c.PocketbaseAdminPassword == "" {
		log.Println("[CONFIG] CATATAN: POCKETBASE_ADMIN_PASSWORD belum diset di Infisical. Fitur super admin PocketBase (seperti reset password & kelola akun) memerlukan kredensial ini.")
	}
	if c.AppEnv == "production" && c.TurnstileSecret == "" {
		log.Println("[CONFIG] PERINGATAN: TURNSTILE_SECRET_KEY belum diset untuk mode production.")
	}
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists && value != "" {
		return value
	}
	return fallback
}
