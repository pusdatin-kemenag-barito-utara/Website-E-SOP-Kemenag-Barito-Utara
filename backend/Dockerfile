# Build stage
FROM golang:1.26-alpine AS builder

WORKDIR /app

# Install CGO deps
RUN apk add --no-cache gcc musl-dev

# Cache modules
COPY go.mod go.sum ./
RUN go mod download

# Copy source and build
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /sop-backend .

# Runtime stage
FROM alpine:3.21

RUN apk add --no-cache ca-certificates tzdata \
    && adduser -D -H -u 1001 backenduser

WORKDIR /app
COPY --from=builder /sop-backend .

USER backenduser
EXPOSE 8080

CMD ["/app/sop-backend"]