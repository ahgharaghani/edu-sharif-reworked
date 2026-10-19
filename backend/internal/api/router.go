package api

import (
	"fmt"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"strings"

	"edu-gateway/internal/security"
)

func NewRouter(handler *APIHandler) http.Handler {
	mux := http.NewServeMux()

	// API Routes
	mux.HandleFunc("/api/health", handler.HandleHealth)
	mux.HandleFunc("/api/auth/status", handler.HandleAuthStatus)
	mux.HandleFunc("/api/auth/login", handler.HandleLogin)
	mux.HandleFunc("/api/auth/logout", handler.HandleLogout)
	mux.HandleFunc("/api/auth/session", handler.HandleUpdateSession)
	mux.HandleFunc("/api/dashboard", handler.HandleDashboard)
	mux.HandleFunc("/api/student/profile", handler.HandleProfile)
	mux.HandleFunc("/api/courses", handler.HandleCourses)
	mux.HandleFunc("/api/schedule", handler.HandleSchedule)
	mux.HandleFunc("/api/exams", handler.HandleExams)
	mux.HandleFunc("/api/transcript", handler.HandleTranscript)
	mux.HandleFunc("/api/grades/objection", handler.HandleObjection)

	// Serve Static Frontend if exists
	cwd, _ := os.Getwd()
	frontendDist := filepath.Join(cwd, "..", "frontend", "dist")
	if _, err := os.Stat(frontendDist); err != nil {
		frontendDist = filepath.Join(cwd, "frontend", "dist")
	}

	if _, err := os.Stat(frontendDist); err == nil {
		fs := http.FileServer(http.Dir(frontendDist))
		mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
			if strings.HasPrefix(r.URL.Path, "/api/") {
				http.NotFound(w, r)
				return
			}

			// SPA Fallback: if file doesn't exist, serve index.html
			path := filepath.Join(frontendDist, r.URL.Path)
			if fi, err := os.Stat(path); err != nil || fi.IsDir() {
				http.ServeFile(w, r, filepath.Join(frontendDist, "index.html"))
				return
			}

			fs.ServeHTTP(w, r)
		})
	}

	// Apply Middlewares in order: Rate Limiting -> Security Headers -> Strict CORS
	var wrapped http.Handler = mux
	wrapped = apiRateLimitMiddleware(handler.apiLimiter, wrapped)
	wrapped = securityHeadersMiddleware(wrapped)
	wrapped = strictCORSMiddleware(wrapped)

	return wrapped
}

// strictCORSMiddleware validates request Origin and avoids wildcard '*'
func strictCORSMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")

		if origin != "" {
			if isOriginAllowed(origin) {
				w.Header().Set("Access-Control-Allow-Origin", origin)
				w.Header().Set("Access-Control-Allow-Credentials", "true")
				w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
				w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
			}
		}

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// isOriginAllowed checks if the origin is trusted (localhost, 127.0.0.1, or configured domain)
func isOriginAllowed(origin string) bool {
	u, err := url.Parse(origin)
	if err != nil {
		return false
	}

	hostname := strings.ToLower(u.Hostname())
	return hostname == "localhost" || hostname == "127.0.0.1" || hostname == "::1"
}

// securityHeadersMiddleware injects defense-in-depth HTTP security headers
func securityHeadersMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Prevent MIME type sniffing
		w.Header().Set("X-Content-Type-Options", "nosniff")
		// Prevent Clickjacking
		w.Header().Set("X-Frame-Options", "SAMEORIGIN")
		// Cross-Site Scripting protection
		w.Header().Set("X-XSS-Protection", "1; mode=block")
		// Referrer policy
		w.Header().Set("Referrer-Policy", "strict-origin-when-cross-origin")

		next.ServeHTTP(w, r)
	})
}

// apiRateLimitMiddleware throttles excessive API requests to protect server availability
func apiRateLimitMiddleware(limiter *security.RateLimiter, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Only apply API limiter to /api/ routes
		if strings.HasPrefix(r.URL.Path, "/api/") && r.URL.Path != "/api/auth/login" {
			clientIP := security.GetClientIP(r)
			allowed, waitDur := limiter.Allow(clientIP)
			if !allowed {
				w.Header().Set("Retry-After", fmt.Sprintf("%d", int(waitDur.Seconds())))
				http.Error(w, "تعداد درخواست‌های ارسالی بیش از حد مجاز است. لطفاً کمی صبر کنید.", http.StatusTooManyRequests)
				return
			}
		}

		next.ServeHTTP(w, r)
	})
}
