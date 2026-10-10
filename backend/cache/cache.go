package cache

import (
	"strings"
	"sync"
	"time"
)

type item struct {
	value     interface{}
	expiresAt time.Time
}

// MemoryCache provides a concurrent-safe, in-memory TTL cache with prefix invalidation.
type MemoryCache struct {
	mu    sync.RWMutex
	items map[string]item
}

// Global default cache instance for application-wide use
var DefaultCache = New()

// New creates an initialized MemoryCache with automatic expiration cleanup.
func New() *MemoryCache {
	c := &MemoryCache{
		items: make(map[string]item),
	}

	// Periodic background cleanup of expired items
	go func() {
		ticker := time.NewTicker(5 * time.Minute)
		for range ticker.C {
			c.cleanup()
		}
	}()

	return c
}

// Get retrieves a cached item if present and not expired.
func (c *MemoryCache) Get(key string) (interface{}, bool) {
	c.mu.RLock()
	defer c.mu.RUnlock()

	it, found := c.items[key]
	if !found {
		return nil, false
	}
	if time.Now().After(it.expiresAt) {
		return nil, false
	}
	return it.value, true
}

// Set stores a value with the specified Time-To-Live.
func (c *MemoryCache) Set(key string, value interface{}, ttl time.Duration) {
	c.mu.Lock()
	defer c.mu.Unlock()

	c.items[key] = item{
		value:     value,
		expiresAt: time.Now().Add(ttl),
	}
}

// Delete removes a specific key from the cache.
func (c *MemoryCache) Delete(key string) {
	c.mu.Lock()
	defer c.mu.Unlock()

	delete(c.items, key)
}

// InvalidatePrefix deletes all keys starting with the given prefix.
func (c *MemoryCache) InvalidatePrefix(prefix string) {
	c.mu.Lock()
	defer c.mu.Unlock()

	for k := range c.items {
		if strings.HasPrefix(k, prefix) {
			delete(c.items, k)
		}
	}
}

func (c *MemoryCache) cleanup() {
	c.mu.Lock()
	defer c.mu.Unlock()

	now := time.Now()
	for k, it := range c.items {
		if now.After(it.expiresAt) {
			delete(c.items, k)
		}
	}
}
