package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/recover"
	"github.com/gofiber/fiber/v3/middleware/requestid"

	"sop-kemenag-backend/config"
	"sop-kemenag-backend/database"
	"sop-kemenag-backend/middleware"
	"sop-kemenag-backend/routes"
)

func main() {
	cfg := config.Load()
	cfg.Validate()

	log.Printf("Starting E-SOP Digital backend in %s environment", cfg.AppEnv)

	db, err := database.Connect(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()
	log.Printf("Database connection established")

	app := fiber.New(fiber.Config{
		AppName:      "E-SOP Digital Backend",
		ServerHeader: "E-SOP Digital",
		BodyLimit:    10 * 1024 * 1024,
	})

	app.Use(requestid.New())
	app.Use(middleware.RequestLogger())
	app.Use(recover.New())
	app.Use(middleware.SecurityHeaders())
	app.Use(middleware.CORS(cfg))
	app.Use(middleware.RateLimit(120, time.Minute))

	app.Get("/", func(c fiber.Ctx) error {
		return c.JSON(fiber.Map{"app": "E-SOP Digital API", "status": "ok"})
	})

	routes.Setup(app, db, cfg)

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
