package routes

import (
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/jackc/pgx/v5/pgxpool"

	"sop-kemenag-backend/config"
	"sop-kemenag-backend/handlers"
	"sop-kemenag-backend/middleware"
)

// Setup registers all HTTP routes.
func Setup(app *fiber.App, db *pgxpool.Pool, cfg *config.Config) {
	// Public routes
	app.Get("/api/health", handlers.Health)
	app.Get("/api/keep-alive", middleware.RateLimit(10, time.Minute), handlers.KeepAlive(db))
	app.Get("/api/maintenance/status", handlers.MaintenanceStatus(cfg))

	// Auth routes (public but strictly rate-limited)
	auth := app.Group("/api/auth")
	auth.Post("/check-rbac",
		middleware.RateLimit(15, time.Minute),
		handlers.CheckRbac(db, cfg),
	)

	// SOP routes (authenticated user's own SOPs)
	sops := app.Group("/api/sops")
	sops.Use(middleware.VerifyJWT(cfg))

	sops.Get("/admin", middleware.VerifySuperAdmin(cfg), handlers.ListAdminSOPs(db))
	sops.Get("/", handlers.ListUserSOPs(db))
	sops.Post("/", handlers.CreateSOP(db))
	sops.Get("/:id", handlers.GetSOP(db))
	sops.Put("/:id", handlers.UpdateSOP(db))
	sops.Delete("/:id", handlers.DeleteSOP(db))

	// Admin routes (JWT + super_admin only)
	admin := app.Group("/api/admin")
	admin.Use(middleware.VerifyJWT(cfg))
	admin.Use(middleware.VerifySuperAdmin(cfg))

	admin.Get("/user-role", middleware.RateLimit(30, time.Minute), handlers.GetUserRole(db))
	admin.Get("/users", middleware.RateLimit(30, time.Minute), handlers.ListUsers(db))
	admin.Post("/users", middleware.RateLimit(30, time.Minute), handlers.CreateUser(db, cfg))
	admin.Put("/users/:id", middleware.RateLimit(30, time.Minute), handlers.UpdateUser(db, cfg))
	admin.Delete("/users/:id", middleware.RateLimit(30, time.Minute), handlers.DeleteUser(db, cfg))
	admin.Delete("/users", middleware.RateLimit(30, time.Minute), handlers.DeleteUser(db, cfg))
}
