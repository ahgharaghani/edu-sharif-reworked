package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"edu-gateway/internal/api"
	"edu-gateway/internal/session"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	dataDir := os.Getenv("DATA_DIR")
	if dataDir == "" {
		// Default to scraped_data folder next to backend or in project root
		cwd, _ := os.Getwd()
		candidate1 := filepath.Join(cwd, "..", "scraped_data")
		candidate2 := filepath.Join(cwd, "scraped_data")
		if _, err := os.Stat(candidate1); err == nil {
			dataDir = candidate1
		} else {
			dataDir = candidate2
		}
	}

	log.Printf("[*] Initializing Secure SessionManager with data directory: %s", dataDir)
	sessionMgr := session.NewSessionManager(dataDir, 24*time.Hour)

	handler := api.NewAPIHandler(dataDir, sessionMgr)
	router := api.NewRouter(handler)

	// Configure HTTP server with production-grade timeouts to mitigate slow-loris attacks
	server := &http.Server{
		Addr:         ":" + port,
		Handler:      router,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 30 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	log.Printf("==================================================")
	log.Printf("🛡️  Edu Sharif Secure Gateway running on http://localhost:%s", port)
	log.Printf("   - Security:     Isolated Sessions, Strict CORS, Rate Limiting")
	log.Printf("   - Health Check: http://localhost:%s/api/health", port)
	log.Printf("   - Dashboard:    http://localhost:%s/api/dashboard", port)
	log.Printf("   - Courses:      http://localhost:%s/api/courses", port)
	log.Printf("   - Schedule:     http://localhost:%s/api/schedule", port)
	log.Printf("   - Exams:        http://localhost:%s/api/exams", port)
	log.Printf("==================================================")

	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("[!] Server stopped: %v", err)
	}
}
