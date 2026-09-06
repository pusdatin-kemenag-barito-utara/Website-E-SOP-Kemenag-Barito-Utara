package handlers

import (
	"context"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/jackc/pgx/v5/pgxpool"

	"sop-kemenag-backend/models"
)

func KeepAlive(db *pgxpool.Pool) fiber.Handler {
	return func(c fiber.Ctx) error {
		ctx, cancel := context.WithTimeout(c.Context(), 5*time.Second)
		defer cancel()

		var id string
		err := db.QueryRow(ctx,
			`SELECT id FROM kemenag_sop.profiles LIMIT 1`,
		).Scan(&id)

		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{
				Error: "Failed to ping database",
			})
		}

		return c.JSON(models.KeepAliveResponse{
			Success:   true,
			Message:   "Supabase database pinged successfully to stay active!",
			Timestamp: time.Now().UTC(),
		})
	}
}
