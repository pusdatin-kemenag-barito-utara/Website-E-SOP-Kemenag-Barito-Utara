package handlers

import (
	"time"

	"github.com/gofiber/fiber/v3"

	"sop-kemenag-backend/models"
	"sop-kemenag-backend/pocketbase"
)

func KeepAlive(pb *pocketbase.Client) fiber.Handler {
	return func(c fiber.Ctx) error {
		if err := pb.HealthCheck(); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(models.ErrorResponse{
				Error: "Failed to ping PocketBase API: " + err.Error(),
			})
		}

		return c.JSON(models.KeepAliveResponse{
			Success:   true,
			Message:   "PocketBase database API pinged successfully to stay active!",
			Timestamp: time.Now().UTC(),
		})
	}
}
