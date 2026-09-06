package handlers

import (
	"github.com/gofiber/fiber/v3"

	"sop-kemenag-backend/models"
)

func Health(c fiber.Ctx) error {
	return c.JSON(models.HealthResponse{Status: "ok"})
}
