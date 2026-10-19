package security

import (
	"net"
	"net/http"
	"strings"
	"sync"
	"time"
)

type clientRecord struct {
	count     int
	lastSeen  time.Time
	blockedTo time.Time
}

// RateLimiter tracks requests per key (IP or identifier)
type RateLimiter struct {
	mu          sync.Mutex
	records     map[string]*clientRecord
	maxAttempts int
	window      time.Duration
	blockTime   time.Duration
}

func NewRateLimiter(maxAttempts int, window time.Duration, blockTime time.Duration) *RateLimiter {
	rl := &RateLimiter{
		records:     make(map[string]*clientRecord),
		maxAttempts: maxAttempts,
		window:      window,
		blockTime:   blockTime,
	}

	// Periodic cleanup of expired entries
	go rl.cleanupRoutine()
	return rl
}

// Allow checks if the given key is allowed to make a request
func (rl *RateLimiter) Allow(key string) (bool, time.Duration) {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	now := time.Now()
	rec, exists := rl.records[key]

	if !exists {
		rl.records[key] = &clientRecord{
			count:    1,
			lastSeen: now,
		}
		return true, 0
	}

	// Check if temporarily blocked
	if now.Before(rec.blockedTo) {
		return false, rec.blockedTo.Sub(now)
	}

	// If window expired, reset counter
	if now.Sub(rec.lastSeen) > rl.window {
		rec.count = 1
		rec.lastSeen = now
		rec.blockedTo = time.Time{}
		return true, 0
	}

	// Increment attempt
	rec.count++
	rec.lastSeen = now

	if rec.count > rl.maxAttempts {
		rec.blockedTo = now.Add(rl.blockTime)
		return false, rl.blockTime
	}

	return true, 0
}

// Reset clears the count on successful action (e.g., successful login)
func (rl *RateLimiter) Reset(key string) {
	rl.mu.Lock()
	defer rl.mu.Unlock()
	delete(rl.records, key)
}

func (rl *RateLimiter) cleanupRoutine() {
	ticker := time.NewTicker(5 * time.Minute)
	for range ticker.C {
		rl.mu.Lock()
		now := time.Now()
		for key, rec := range rl.records {
			if now.Sub(rec.lastSeen) > rl.window*2 && now.After(rec.blockedTo) {
				delete(rl.records, key)
			}
		}
		rl.mu.Unlock()
	}
}

// GetClientIP extracts real client IP even behind proxies/load balancers
func GetClientIP(r *http.Request) string {
	xForwardedFor := r.Header.Get("X-Forwarded-For")
	if xForwardedFor != "" {
		parts := strings.Split(xForwardedFor, ",")
		ip := strings.TrimSpace(parts[0])
		if ip != "" {
			return ip
		}
	}

	xRealIP := r.Header.Get("X-Real-IP")
	if xRealIP != "" {
		return strings.TrimSpace(xRealIP)
	}

	ip, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return r.RemoteAddr
	}
	return ip
}
