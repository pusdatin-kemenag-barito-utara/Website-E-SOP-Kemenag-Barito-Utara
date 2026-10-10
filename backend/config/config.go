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
}

func Load() *Config {
	// Variabel lingkungan diinjeksi langsung ke proses via Infisical CLI / runtime container.
	for _, p := range []string{".env", "../.env"} {
		_ = godotenv.Load(p)
	}

	pbURL := getEnv("POCKETBASE_URL", getEnv("PUBLIC_POCKETBASE_URL", "https://db-sop.kemenag-baritoutara.com"))

	return &Config{
		AppEnv:                  getEnv("APP_ENV", "development"),
		ServerPort:              getEnv("SERVER_PORT", "8080"),
		PocketbaseURL:           pbURL,
		PocketbaseAdminEmail:    getEnv("POCKETBASE_ADMIN_EMAIL", getEnv("SUPER_ADMIN_EMAIL", "baritoutara@kemenag.go.id")),
		PocketbaseAdminPassword: getEnv("POCKETBASE_ADMIN_PASSWORD", ""),
		PusdatinURL:             getEnv("PUSDATIN_URL", ""),
		FrontendURL:             getEnv("FRONTEND_URL", ""),
		SuperAdminEmail:         getEnv("SUPER_ADMIN_EMAIL", "baritoutara@kemenag.go.id"),
		TurnstileSecret:         getEnv("TURNSTILE_SECRET_KEY", ""),
	}
}

func (c *Config) Validate() {
	if c.PocketbaseURL == "" {
		log.Fatal("POCKETBASE_URL is required")
	}
	if c.SuperAdminEmail == "" {
		log.Fatal("SUPER_ADMIN_EMAIL is required")
	}
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}
