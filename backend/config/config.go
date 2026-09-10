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
	// Muat .env tunggal dari root repo. Coba beberapa lokasi kandidat
	// bergantung pada working directory saat `go run` dijalankan
	// (dari repo root: ".env", dari backend/: "../.env").
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
	if c.FrontendURL == "" {
		log.Fatal("FRONTEND_URL is required")
	}
	if c.PusdatinURL == "" {
		log.Fatal("PUSDATIN_URL is required")
	}
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}
