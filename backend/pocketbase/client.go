package pocketbase

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"sync"
	"time"
)

type UserClaims struct {
	UserID   string
	Email    string
	Role     string
	Bidang   string
	Nama     string
	IsActive bool
}

type cachedToken struct {
	claims    *UserClaims
	expiresAt time.Time
}

// ParsePBTime safely parses PocketBase date strings (e.g. "2006-01-02 15:04:05.000Z").
func ParsePBTime(raw interface{}) time.Time {
	if raw == nil {
		return time.Now()
	}
	switch v := raw.(type) {
	case string:
		if v == "" {
			return time.Now()
		}
		formats := []string{
			"2006-01-02 15:04:05.000Z",
			"2006-01-02 15:04:05.000",
			"2006-01-02 15:04:05Z",
			"2006-01-02 15:04:05",
			time.RFC3339,
			time.RFC3339Nano,
		}
		for _, f := range formats {
			if t, err := time.Parse(f, v); err == nil {
				return t
			}
		}
	case time.Time:
		return v
	}
	return time.Now()
}

type Client struct {
	BaseURL       string
	AdminEmail    string
	AdminPassword string
	httpClient    *http.Client

	adminTokenMu sync.RWMutex
	adminToken   string
	adminExpires time.Time

	cacheMu    sync.RWMutex
	tokenCache map[string]*cachedToken
}

func NewClient(baseURL, adminEmail, adminPassword string) *Client {
	cleanURL := strings.TrimRight(baseURL, "/")

	tr := &http.Transport{
		Proxy:                 http.ProxyFromEnvironment,
		MaxIdleConns:          100,
		MaxIdleConnsPerHost:   50,
		MaxConnsPerHost:       100,
		IdleConnTimeout:       90 * time.Second,
		TLSHandshakeTimeout:   5 * time.Second,
		ExpectContinueTimeout: 1 * time.Second,
		ForceAttemptHTTP2:     true,
	}

	return &Client{
		BaseURL:       cleanURL,
		AdminEmail:    adminEmail,
		AdminPassword: adminPassword,
		httpClient: &http.Client{
			Timeout:   10 * time.Second,
			Transport: tr,
		},
		tokenCache: make(map[string]*cachedToken),
	}
}

// GetAdminToken obtains or returns a cached PocketBase superuser/admin token.
func (c *Client) GetAdminToken() (string, error) {
	c.adminTokenMu.RLock()
	if c.adminToken != "" && time.Now().Before(c.adminExpires) {
		token := c.adminToken
		c.adminTokenMu.RUnlock()
		return token, nil
	}
	c.adminTokenMu.RUnlock()

	c.adminTokenMu.Lock()
	defer c.adminTokenMu.Unlock()

	// Double check inside lock
	if c.adminToken != "" && time.Now().Before(c.adminExpires) {
		return c.adminToken, nil
	}

	if c.AdminEmail == "" || c.AdminPassword == "" {
		return "", fmt.Errorf("pocketbase admin credentials not configured")
	}

	authBody, _ := json.Marshal(map[string]string{
		"identity": c.AdminEmail,
		"password": c.AdminPassword,
	})

	// PocketBase v0.40+ uses _superusers collection for admins
	authURL := c.BaseURL + "/api/collections/_superusers/auth-with-password"
	resp, err := c.httpClient.Post(authURL, "application/json", bytes.NewReader(authBody))
	if err != nil {
		return "", fmt.Errorf("failed to reach pocketbase admin auth: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		respBytes, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("pocketbase admin auth failed (%d): %s", resp.StatusCode, string(respBytes))
	}

	var authRes struct {
		Token string `json:"token"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&authRes); err != nil {
		return "", fmt.Errorf("failed to decode pocketbase admin token: %w", err)
	}

	c.adminToken = authRes.Token
	// Set expiry for 2 hours (PocketBase JWT default is longer, 2h is safe)
	c.adminExpires = time.Now().Add(2 * time.Hour)
	return c.adminToken, nil
}

// VerifyUserToken validates a user's Bearer token with PocketBase.
// Uses in-memory cache to ensure sub-millisecond response times.
func (c *Client) VerifyUserToken(token string) (*UserClaims, error) {
	if token == "" {
		return nil, fmt.Errorf("empty token")
	}

	c.cacheMu.RLock()
	if entry, ok := c.tokenCache[token]; ok {
		if time.Now().Before(entry.expiresAt) {
			c.cacheMu.RUnlock()
			return entry.claims, nil
		}
	}
	c.cacheMu.RUnlock()

	// Call PocketBase /api/collections/users/auth-refresh
	reqURL := c.BaseURL + "/api/collections/users/auth-refresh"
	req, err := http.NewRequest(http.MethodPost, reqURL, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", "Bearer "+token)

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to verify token with pocketbase: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("invalid or expired token (%d)", resp.StatusCode)
	}

	var refreshRes struct {
		Record struct {
			ID       string `json:"id"`
			Email    string `json:"email"`
			Role     string `json:"role"`
			Bidang   string `json:"bidang"`
			Nama     string `json:"nama"`
			Name     string `json:"name"`
			IsActive *bool  `json:"is_active"`
		} `json:"record"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&refreshRes); err != nil {
		return nil, fmt.Errorf("failed to parse auth refresh record: %w", err)
	}

	isActive := true
	if refreshRes.Record.IsActive != nil {
		isActive = *refreshRes.Record.IsActive
	}

	nama := refreshRes.Record.Nama
	if nama == "" {
		nama = refreshRes.Record.Name
	}

	claims := &UserClaims{
		UserID:   refreshRes.Record.ID,
		Email:    refreshRes.Record.Email,
		Role:     refreshRes.Record.Role,
		Bidang:   refreshRes.Record.Bidang,
		Nama:     nama,
		IsActive: isActive,
	}

	// Cache verified claims for 60 seconds
	c.cacheMu.Lock()
	c.tokenCache[token] = &cachedToken{
		claims:    claims,
		expiresAt: time.Now().Add(60 * time.Second),
	}
	c.cacheMu.Unlock()

	return claims, nil
}

// Request performs an HTTP request to PocketBase with optional auth.
func (c *Client) Request(method, path string, query url.Values, body interface{}, authToken string) (*http.Response, error) {
	fullURL := c.BaseURL + path
	if len(query) > 0 {
		fullURL += "?" + query.Encode()
	}

	var bodyReader io.Reader
	if body != nil {
		bodyBytes, err := json.Marshal(body)
		if err != nil {
			return nil, err
		}
		bodyReader = bytes.NewReader(bodyBytes)
	}

	req, err := http.NewRequest(method, fullURL, bodyReader)
	if err != nil {
		return nil, err
	}

	if body != nil {
		req.Header.Set("Content-Type", "application/json")
	}

	if authToken != "" {
		req.Header.Set("Authorization", "Bearer "+authToken)
	} else {
		// If no user auth token, try using superuser/admin token if configured
		if adminToken, err := c.GetAdminToken(); err == nil && adminToken != "" {
			req.Header.Set("Authorization", "Bearer "+adminToken)
		}
	}

	return c.httpClient.Do(req)
}

// HealthCheck verifies that the PocketBase API is healthy and reachable.
func (c *Client) HealthCheck() error {
	resp, err := c.httpClient.Get(c.BaseURL + "/api/health")
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("pocketbase returned status %d", resp.StatusCode)
	}
	return nil
}
