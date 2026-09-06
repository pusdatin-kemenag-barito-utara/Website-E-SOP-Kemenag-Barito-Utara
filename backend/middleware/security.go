package middleware

import "github.com/gofiber/fiber/v3"

// SecurityHeaders applies enterprise-grade HTTP security headers (OWASP Recommended).
func SecurityHeaders() fiber.Handler {
	return func(c fiber.Ctx) error {
		// Prevent MIME-sniffing
		c.Set("X-Content-Type-Options", "nosniff")
		// Prevent clickjacking
		c.Set("X-Frame-Options", "SAMEORIGIN")
		// Enable browser XSS protection
		c.Set("X-XSS-Protection", "1; mode=block")
		// Referrer policy
		c.Set("Referrer-Policy", "strict-origin-when-cross-origin")
		// Restrict dangerous browser features
		c.Set("Permissions-Policy", "geolocation=(), camera=(), microphone=(), payment=()")
		// Isolate browsing context
		c.Set("Cross-Origin-Opener-Policy", "same-origin")
		c.Set("Cross-Origin-Resource-Policy", "same-site")
		// HTTP/3 (QUIC) Advertisement & DNS Prefetch
		c.Set("Alt-Svc", `h3=":443"; ma=86400, h3-29=":443"; ma=86400`)
		c.Set("X-DNS-Prefetch-Control", "on")
		// HSTS (HTTP Strict Transport Security)
		c.Set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload")

		return c.Next()
	}
}
