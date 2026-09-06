package middleware

import (
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"

	"sop-kemenag-backend/config"
)

func CORS(cfg *config.Config) fiber.Handler {
	origins := []string{cfg.FrontendURL, "http://localhost:3000", "http://127.0.0.1:3000"}
	if cfg.FrontendURL != "" && cfg.FrontendURL != "http://localhost:3000" {
		origins = append(origins, cfg.FrontendURL)
	}

	return cors.New(cors.Config{
		AllowOrigins:     origins,
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization", "Cache-Control", "X-Requested-With", "Pragma"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowCredentials: true,
		MaxAge:           3600,
	})
}
