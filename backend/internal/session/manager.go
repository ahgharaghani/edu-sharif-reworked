package session

import (
	"crypto/rand"
	"encoding/hex"
	"sync"
	"time"

	"edu-gateway/internal/edu"
	"edu-gateway/internal/models"
)

// UserSession encapsulates an isolated session for a single user
type UserSession struct {
	Token     string
	Username  string
	Student   *models.StudentProfile
	EduClient *edu.EduClient
	CreatedAt time.Time
	LastSeen  time.Time
}

// SessionManager manages thread-safe per-user sessions in memory
type SessionManager struct {
	mu       sync.RWMutex
	sessions map[string]*UserSession
	dataDir  string
	ttl      time.Duration
}

// NewSessionManager initializes a new SessionManager with a cleanup worker
func NewSessionManager(dataDir string, ttl time.Duration) *SessionManager {
	sm := &SessionManager{
		sessions: make(map[string]*UserSession),
		dataDir:  dataDir,
		ttl:      ttl,
	}

	go sm.cleanupWorker()
	return sm
}

// CreateSession generates a cryptographic random session token and stores user state
func (sm *SessionManager) CreateSession(username string, student *models.StudentProfile, client *edu.EduClient) (*UserSession, error) {
	bytes := make([]byte, 32)
	if _, err := rand.Read(bytes); err != nil {
		return nil, err
	}
	token := hex.EncodeToString(bytes)

	now := time.Now()
	s := &UserSession{
		Token:     token,
		Username:  username,
		Student:   student,
		EduClient: client,
		CreatedAt: now,
		LastSeen:  now,
	}

	sm.mu.Lock()
	sm.sessions[token] = s
	sm.mu.Unlock()

	return s, nil
}

// GetSession retrieves an active user session and updates its last activity timestamp
func (sm *SessionManager) GetSession(token string) *UserSession {
	if token == "" {
		return nil
	}
	sm.mu.Lock()
	defer sm.mu.Unlock()

	s, ok := sm.sessions[token]
	if !ok {
		return nil
	}

	// Check if session has expired
	if time.Since(s.LastSeen) > sm.ttl {
		delete(sm.sessions, token)
		return nil
	}

	s.LastSeen = time.Now()
	return s
}

// DestroySession terminates and removes an active session
func (sm *SessionManager) DestroySession(token string) {
	if token == "" {
		return
	}
	sm.mu.Lock()
	defer sm.mu.Unlock()

	if s, ok := sm.sessions[token]; ok {
		if s.EduClient != nil {
			_ = s.EduClient.Logout()
		}
		delete(sm.sessions, token)
	}
}

// Count returns the number of active sessions
func (sm *SessionManager) Count() int {
	sm.mu.RLock()
	defer sm.mu.RUnlock()
	return len(sm.sessions)
}

func (sm *SessionManager) cleanupWorker() {
	ticker := time.NewTicker(5 * time.Minute)
	for range ticker.C {
		sm.mu.Lock()
		now := time.Now()
		for token, s := range sm.sessions {
			if now.Sub(s.LastSeen) > sm.ttl {
				if s.EduClient != nil {
					_ = s.EduClient.Logout()
				}
				delete(sm.sessions, token)
			}
		}
		sm.mu.Unlock()
	}
}
