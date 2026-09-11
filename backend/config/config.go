package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	AppEnv           string
	ServerPort       string
	SupabaseURL      string
	SupabaseAnonKey  string
	SupabaseJWTKey   string
	SupabaseServiceKey string
	DatabaseURL      string
	PusdatinURL      string
	FrontendURL      string
	SuperAdminEmail  string
	TurnstileSecret  string
}

func Load() *Config {
	// Variabel lingkungan diinjeksi langsung ke proses via Infisical CLI / runtime container.
	// godotenv dipertahankan sebagai silent fallback opsional jika ada file lokal.
	for _, p := range []string{".env", "../.env"} {
		_ = godotenv.Load(p)
	}

	return &Config{
		AppEnv:             getEnv("APP_ENV", "development"),
		ServerPort:         getEnv("SERVER_PORT", "8080"),
		SupabaseURL:        getEnv("SUPABASE_URL", ""),
		SupabaseAnonKey:    getEnv("SUPABASE_ANON_KEY", ""),
		SupabaseJWTKey:     getEnv("SUPABASE_JWT_SECRET", ""),
		SupabaseServiceKey: getEnv("SUPABASE_SERVICE_ROLE_KEY", ""),
		DatabaseURL:        getEnv("DATABASE_URL", ""),
		PusdatinURL:        getEnv("PUSDATIN_URL", ""),
		FrontendURL:        getEnv("FRONTEND_URL", ""),
		SuperAdminEmail:    getEnv("SUPER_ADMIN_EMAIL", ""),
		TurnstileSecret:    getEnv("TURNSTILE_SECRET_KEY", ""),
	}
}

func (c *Config) Validate() {
	if c.SupabaseURL == "" {
		log.Fatal("SUPABASE_URL is required")
	}
	if c.DatabaseURL == "" {
		log.Fatal("DATABASE_URL is required")
	}
	if c.SupabaseJWTKey == "" {
		log.Fatal("SUPABASE_JWT_SECRET is required")
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
