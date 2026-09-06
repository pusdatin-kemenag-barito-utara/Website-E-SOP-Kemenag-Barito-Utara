package models

import (
	"encoding/json"
	"time"
)

type UserRecord struct {
	ID   string `json:"id"`
	Role string `json:"role"`
}

type Profile struct {
	ID        string    `json:"id"`
	Email     *string   `json:"email"`
	Nama      *string   `json:"nama"`
	Role      string    `json:"role"`
	Bidang    *string   `json:"bidang"`
	IsActive  bool      `json:"is_active"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type Permission struct {
	Role string `json:"role"`
}

type CheckRbacRequest struct {
	Email          string `json:"email" validate:"required,email"`
	TurnstileToken string `json:"turnstile_token,omitempty"`
}

type CreateUserRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=6"`
	Nama     string `json:"nama"`
	Role     string `json:"role"`
	Bidang   string `json:"bidang" validate:"required"`
}

type UpdateUserRequest struct {
	Nama     string  `json:"nama"`
	Role     string  `json:"role"`
	Bidang   string  `json:"bidang"`
	IsActive *bool   `json:"is_active"`
	Password *string `json:"password,omitempty"`
}

type CheckRbacResponse struct {
	Success bool   `json:"success"`
	Error   string `json:"error,omitempty"`
}

type HealthResponse struct {
	Status string `json:"status"`
}

type KeepAliveResponse struct {
	Success   bool      `json:"success"`
	Message   string    `json:"message"`
	Timestamp time.Time `json:"timestamp"`
}

type MaintenanceStatusResponse struct {
	Status string `json:"status"`
}

type ErrorResponse struct {
	Error string `json:"error"`
}

// SOP-related models ------------------------------------------------------------------

// SOPRecord is a full SOP document (header/activities/roles stored as raw JSONB).
type SOPRecord struct {
	ID        string          `json:"id"`
	UserID    *string         `json:"user_id"`
	UserEmail *string         `json:"user_email"`
	Title     string          `json:"title"`
	Header    json.RawMessage `json:"header"`
	Activities json.RawMessage `json:"activities"`
	Roles     json.RawMessage `json:"roles"`
	CreatedAt time.Time       `json:"created_at"`
	UpdatedAt time.Time       `json:"updated_at"`
}

// SOPListItem is a lightweight list item for the current user's SOPs.
type SOPListItem struct {
	ID        string    `json:"id"`
	Title     string    `json:"title"`
	UpdatedAt time.Time `json:"updated_at"`
}

// AdminSOPListItem is the admin list item (includes owner + header preview + user bidang).
type AdminSOPListItem struct {
	ID         string          `json:"id"`
	Title      string          `json:"title"`
	UpdatedAt  time.Time       `json:"updated_at"`
	UserID     string          `json:"user_id"`
	UserEmail  *string         `json:"user_email"`
	UserBidang *string         `json:"user_bidang,omitempty"`
	Header     json.RawMessage `json:"header"`
}

// SaveSOPRequest is the body for create/update SOP.
type SaveSOPRequest struct {
	Title      string          `json:"title"`
	Header     json.RawMessage `json:"header"`
	Activities json.RawMessage `json:"activities"`
	Roles      json.RawMessage `json:"roles"`
}

// SaveSOPResponse is returned after create/update.
type SaveSOPResponse struct {
	ID        string    `json:"id"`
	Title     string    `json:"title"`
	UpdatedAt time.Time `json:"updated_at"`
}

// MessageResponse is a simple success/message envelope.
type MessageResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}
