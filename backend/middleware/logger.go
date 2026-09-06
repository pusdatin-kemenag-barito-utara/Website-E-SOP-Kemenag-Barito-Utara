package middleware

import (
	"time"

	"github.com/gofiber/fiber/v3"
)

const (
	ansiReset  = "\x1b[0m"
	ansiBold   = "\x1b[1m"
	ansiRed    = "\x1b[31m"
	ansiGreen  = "\x1b[32m"
	ansiYellow = "\x1b[33m"
	ansiBlue   = "\x1b[34m"
	ansiMagenta = "\x1b[35m"
	ansiCyan   = "\x1b[36m"
	ansiGray   = "\x1b[90m"
)

// methodColor returns a colored method label based on the HTTP verb.
func methodColor(method string) string {
	switch method {
	case "GET":
		return ansiGreen + method + ansiReset
	case "POST":
		return ansiCyan + method + ansiReset
	case "PUT", "PATCH":
		return ansiYellow + method + ansiReset
	case "DELETE":
		return ansiRed + method + ansiReset
	default:
		return ansiMagenta + method + ansiReset
	}
}

// statusColor colors the status code based on its class.
func statusColor(status int) string {
	var color string
	switch {
	case status >= 500:
		color = ansiRed
	case status >= 400:
		color = ansiYellow
	case status >= 300:
		color = ansiCyan
	default:
		color = ansiGreen
	}
	return color + ansiBold + itoa(status) + ansiReset
}

// latencyLabel formats the request duration in a human-friendly way.
func latencyLabel(d time.Duration) string {
	if d < time.Millisecond {
		return d.Round(time.Microsecond).String()
	}
	if d < time.Second {
		return d.Round(time.Millisecond).String()
	}
	return d.Round(time.Millisecond * 100).String()
}

// itoa is a tiny int-to-string (avoids importing strconv for a single call path).
func itoa(n int) string {
	if n == 0 {
		return "0"
	}
	neg := n < 0
	if neg {
		n = -n
	}
	var buf [12]byte
	i := len(buf)
	for n > 0 {
		i--
		buf[i] = byte('0' + n%10)
		n /= 10
	}
	if neg {
		i--
		buf[i] = '-'
	}
	return string(buf[i:])
}

// RequestLogger logs every request with timestamp, colored method, path,
// colored status, latency and request id. It is a helpful dev dashboard.
func RequestLogger() fiber.Handler {
	return func(c fiber.Ctx) error {
		start := time.Now()

		err := c.Next()

		statusCode := c.Response().StatusCode()
		path := c.Path()

		// Saring log berulang untuk polling status maintenance dan preflight OPTIONS agar terminal dev tetap bersih
		if (path == "/api/maintenance/status" || path == "/api/keep-alive" || c.Method() == "OPTIONS") && statusCode < 400 {
			return err
		}

		ts := time.Now().Format("15:04:05.000")
		method := methodColor(c.Method())
		status := statusColor(statusCode)
		latency := latencyLabel(time.Since(start))
		reqID := c.GetRespHeader("X-Request-ID")

		line := "[" + ansiGray + ts + ansiReset + "] " +
			method + " " + path + "  " + status +
			"  " + ansiCyan + latency + ansiReset

		if reqID != "" && path != "/api/keep-alive" {
			line += "  " + ansiGray + "req=" + reqID + ansiReset
		}

		println(line)

		return err
	}
}
