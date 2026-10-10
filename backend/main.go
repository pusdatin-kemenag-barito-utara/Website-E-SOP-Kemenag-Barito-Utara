package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/compress"
	"github.com/gofiber/fiber/v3/middleware/recover"
	"github.com/gofiber/fiber/v3/middleware/requestid"

	"sop-kemenag-backend/config"
	"sop-kemenag-backend/middleware"
	"sop-kemenag-backend/pocketbase"
	"sop-kemenag-backend/routes"
)

func main() {
	cfg := config.Load()
	cfg.Validate()

	log.Printf("Starting E-SOP Digital backend in %s environment", cfg.AppEnv)

	pb := pocketbase.NewClient(cfg.PocketbaseURL, cfg.PocketbaseAdminEmail, cfg.PocketbaseAdminPassword)
	if err := pb.HealthCheck(); err != nil {
		log.Printf("Warning: PocketBase health check returned: %v (continuing)", err)
	} else {
		log.Printf("PocketBase connection verified at %s", cfg.PocketbaseURL)
	}

	app := fiber.New(fiber.Config{
		AppName:      "E-SOP Digital Backend",
		ServerHeader: "E-SOP Digital",
		BodyLimit:    10 * 1024 * 1024,
	})

	app.Use(requestid.New())
	app.Use(middleware.RequestLogger())
	app.Use(recover.New())
	app.Use(compress.New(compress.Config{
		Level: compress.LevelDefault,
	}))
	app.Use(middleware.SecurityHeaders())
	app.Use(middleware.CORS(cfg))
	app.Use(middleware.RateLimit(120, time.Minute))

	app.Get("/", func(c fiber.Ctx) error {
		return c.JSON(fiber.Map{"app": "E-SOP Digital API", "status": "ok"})
	})

	routes.Setup(app, pb, cfg)

	// Graceful shutdown
	serverErrors := make(chan error, 1)
	go func() {
		addr := ":" + cfg.ServerPort
		log.Printf("Server listening on %s", addr)
		serverErrors <- app.Listen(addr, fiber.ListenConfig{
			GracefulContext: context.Background(),
		})
	}()

	// Wait for interrupt signal
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	select {
	case err := <-serverErrors:
		log.Fatalf("Server error: %v", err)
	case <-quit:
		log.Println("Shutting down server...")
		_, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		if err := app.Shutdown(); err != nil {
			log.Printf("Error during shutdown: %v", err)
		}
		log.Println("Server stopped gracefully")
	}
}
