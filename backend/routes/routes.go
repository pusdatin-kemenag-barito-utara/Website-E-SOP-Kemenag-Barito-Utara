package routes

import (
	"time"

	"github.com/gofiber/fiber/v3"

	"sop-kemenag-backend/config"
	"sop-kemenag-backend/handlers"
	"sop-kemenag-backend/middleware"
	"sop-kemenag-backend/pocketbase"
)

// Setup registers all HTTP routes using PocketBase as the backend database.
func Setup(app *fiber.App, pb *pocketbase.Client, cfg *config.Config) {
	// Public routes
	app.Get("/api/health", handlers.Health)
	app.Get("/api/keep-alive", middleware.RateLimit(10, time.Minute), handlers.KeepAlive(pb))
	app.Get("/api/maintenance/status", handlers.MaintenanceStatus(cfg))

	// Auth routes (public but strictly rate-limited)
	auth := app.Group("/api/auth")
	auth.Post("/check-rbac",
		middleware.RateLimit(15, time.Minute),
		handlers.CheckRbac(pb, cfg),
	)

	// SOP routes (authenticated user's own SOPs)
	sops := app.Group("/api/sops")
	sops.Use(middleware.VerifyJWT(pb, cfg))

	sops.Get("/admin", middleware.VerifySuperAdmin(cfg), handlers.ListAdminSOPs(pb))
	sops.Get("/", handlers.ListUserSOPs(pb))
	sops.Post("/", handlers.CreateSOP(pb))
	sops.Get("/:id", handlers.GetSOP(pb, cfg))
	sops.Put("/:id", handlers.UpdateSOP(pb, cfg))
	sops.Delete("/:id", handlers.DeleteSOP(pb, cfg))

	// User role endpoint (any authenticated user can check their role & profile)
	app.Get("/api/admin/user-role", middleware.VerifyJWT(pb, cfg), handlers.GetUserRole(pb, cfg))
	app.Get("/api/user-role", middleware.VerifyJWT(pb, cfg), handlers.GetUserRole(pb, cfg))

	// Admin routes (JWT + super_admin only)
	admin := app.Group("/api/admin")
	admin.Use(middleware.VerifyJWT(pb, cfg))
	admin.Use(middleware.VerifySuperAdmin(cfg))
	admin.Get("/users", middleware.RateLimit(30, time.Minute), handlers.ListUsers(pb))
	admin.Get("/stats", middleware.RateLimit(60, time.Minute), handlers.GetAdminStats(pb))
	admin.Post("/users", middleware.RateLimit(30, time.Minute), handlers.CreateUser(pb, cfg))
	admin.Post("/users/reset-all-passwords", middleware.RateLimit(10, time.Minute), handlers.ResetAllPasswords(pb, cfg))
	admin.Put("/users/:id", middleware.RateLimit(30, time.Minute), handlers.UpdateUser(pb, cfg))
	admin.Delete("/users/:id", middleware.RateLimit(30, time.Minute), handlers.DeleteUser(pb, cfg))
	admin.Delete("/users", middleware.RateLimit(30, time.Minute), handlers.DeleteUser(pb, cfg))
}
