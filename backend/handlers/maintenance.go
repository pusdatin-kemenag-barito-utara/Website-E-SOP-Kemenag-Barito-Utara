package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"sync"
	"time"

	"github.com/gofiber/fiber/v3"

	"sop-kemenag-backend/config"
	"sop-kemenag-backend/models"
)

var (
	maintenanceCache     models.MaintenanceStatusResponse
	maintenanceCacheTime time.Time
	maintenanceMu        sync.Mutex
)

const maintenanceCacheDuration = 2 * time.Second

// MaintenanceStatus proxies the central Pusdatin maintenance status.
// Results are cached for 60s to avoid hammering the external API.
func MaintenanceStatus(cfg *config.Config) fiber.Handler {
	return func(c fiber.Ctx) error {
		maintenanceMu.Lock()
		defer maintenanceMu.Unlock()

		status := models.MaintenanceStatusResponse{Status: "active"}

		// Serve from cache if fresh
		if time.Since(maintenanceCacheTime) < maintenanceCacheDuration {
			return c.JSON(maintenanceCache)
		}

		appID := "sop-kemenag"
		url := cfg.PusdatinURL + "/api/public/apps/" + appID + "/status?t=" + strconv.FormatInt(time.Now().UnixMilli(), 10)

		req, err := http.NewRequest(http.MethodGet, url, nil)
		if err == nil {
			req.Header.Set("Cache-Control", "no-cache, no-store, must-revalidate")
			resp, err := http.DefaultClient.Do(req)
			if err == nil && resp.StatusCode == http.StatusOK {
				defer resp.Body.Close()
				var data struct {
					Status string `json:"status"`
				}
				if json.NewDecoder(resp.Body).Decode(&data) == nil && data.Status != "" {
					status.Status = data.Status
				}
			}
		} else {
			log.Printf("[KEEPALIVE] maintenance fetch error: %v", err)
		}

		maintenanceCache = status
		maintenanceCacheTime = time.Now()

		return c.JSON(status)
	}
}
