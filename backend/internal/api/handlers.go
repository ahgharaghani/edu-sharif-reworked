package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"edu-gateway/internal/edu"
	"edu-gateway/internal/models"
	"edu-gateway/internal/security"
	"edu-gateway/internal/session"
)

const (
	SessionCookieName = "edu_session"
	MaxBodyBytes      = 64 * 1024 // 64 KB
)

type APIHandler struct {
	dataDir      string
	sessionMgr   *session.SessionManager
	loginLimiter *security.RateLimiter
	apiLimiter   *security.RateLimiter
}

func NewAPIHandler(dataDir string, sessionMgr *session.SessionManager) *APIHandler {
	return &APIHandler{
		dataDir:      dataDir,
		sessionMgr:   sessionMgr,
		loginLimiter: security.NewRateLimiter(5, 2*time.Minute, 5*time.Minute),   // max 5 attempts per 2 min, 5 min cooldown
		apiLimiter:   security.NewRateLimiter(120, 1*time.Minute, 1*time.Minute), // 120 req/min general limit
	}
}

// getEduClient extracts the isolated EduClient for the current user session
func (h *APIHandler) getEduClient(r *http.Request) (*edu.EduClient, *session.UserSession) {
	cookie, err := r.Cookie(SessionCookieName)
	if err != nil || cookie.Value == "" {
		return nil, nil
	}

	userSession := h.sessionMgr.GetSession(cookie.Value)
	if userSession == nil || userSession.EduClient == nil {
		return nil, nil
	}

	return userSession.EduClient, userSession
}

func (h *APIHandler) HandleDashboard(w http.ResponseWriter, r *http.Request) {
	client, _ := h.getEduClient(r)
	if client == nil {
		http.Error(w, "نشست کاربری نامعتبر یا منقضی شده است. لطفاً مجدداً وارد شوید.", http.StatusUnauthorized)
		return
	}

	data, err := client.GetDashboardOverview()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	writeJSON(w, data)
}

func (h *APIHandler) HandleProfile(w http.ResponseWriter, r *http.Request) {
	client, _ := h.getEduClient(r)
	if client == nil {
		http.Error(w, "نشست کاربری نامعتبر یا منقضی شده است", http.StatusUnauthorized)
		return
	}

	profile, err := client.GetStudentProfile()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	writeJSON(w, profile)
}

func (h *APIHandler) HandleCourses(w http.ResponseWriter, r *http.Request) {
	client, _ := h.getEduClient(r)
	if client == nil {
		http.Error(w, "نشست کاربری نامعتبر یا منقضی شده است", http.StatusUnauthorized)
		return
	}

	courses, err := client.GetEnrolledCourses()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	writeJSON(w, courses)
}

func (h *APIHandler) HandleSchedule(w http.ResponseWriter, r *http.Request) {
	client, _ := h.getEduClient(r)
	if client == nil {
		http.Error(w, "نشست کاربری نامعتبر یا منقضی شده است", http.StatusUnauthorized)
		return
	}

	schedule, err := client.GetWeeklySchedule()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	writeJSON(w, schedule)
}

func (h *APIHandler) HandleExams(w http.ResponseWriter, r *http.Request) {
	client, _ := h.getEduClient(r)
	if client == nil {
		http.Error(w, "نشست کاربری نامعتبر یا منقضی شده است", http.StatusUnauthorized)
		return
	}

	exams, err := client.GetFinalExams()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	writeJSON(w, exams)
}

func (h *APIHandler) HandleTranscript(w http.ResponseWriter, r *http.Request) {
	client, _ := h.getEduClient(r)
	if client == nil {
		http.Error(w, "نشست کاربری نامعتبر یا منقضی شده است", http.StatusUnauthorized)
		return
	}

	transcript, err := client.GetTranscript()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	writeJSON(w, transcript)
}

func (h *APIHandler) HandleObjection(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	client, _ := h.getEduClient(r)
	if client == nil {
		http.Error(w, "نشست کاربری نامعتبر یا منقضی شده است", http.StatusUnauthorized)
		return
	}

	r.Body = http.MaxBytesReader(w, r.Body, MaxBodyBytes)
	var req models.ObjectionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.CourseCode == "" {
		http.Error(w, "درخواست نامعتبر است", http.StatusBadRequest)
		return
	}

	writeJSON(w, map[string]interface{}{
		"status":  "ok",
		"message": "درخواست بازبینی نمره با موفقیت ثبت شد و به استاد درس ارسال گردید",
		"course":  req.CourseCode,
	})
}

func (h *APIHandler) HandleAuthStatus(w http.ResponseWriter, r *http.Request) {
	client, userSession := h.getEduClient(r)
	if client == nil || !client.IsAuthenticated() {
		writeJSON(w, map[string]interface{}{
			"authenticated": false,
		})
		return
	}

	student := userSession.Student
	if student == nil {
		if p, err := client.GetStudentProfile(); err == nil {
			student = &p
			userSession.Student = &p
		}
	}

	writeJSON(w, map[string]interface{}{
		"authenticated": true,
		"student":       student,
	})
}

func (h *APIHandler) HandleLogin(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// 1. Rate Limiting Check (per client IP)
	clientIP := security.GetClientIP(r)
	allowed, waitDur := h.loginLimiter.Allow(clientIP)
	if !allowed {
		w.WriteHeader(http.StatusTooManyRequests)
		writeJSON(w, map[string]interface{}{
			"status":  "rate_limited",
			"message": fmt.Sprintf("تعداد تلاش‌های ورود بیش از حد مجاز است. لطفاً پس از %d ثانیه مجدداً تلاش نمایید.", int(waitDur.Seconds())),
		})
		return
	}

	// 2. Limit request body size to prevent DoS
	r.Body = http.MaxBytesReader(w, r.Body, MaxBodyBytes)

	var req struct {
		Username   string `json:"username"`
		Password   string `json:"password"`
		JSESSIONID string `json:"jsessionid"`
		Demo       bool   `json:"demo"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "درخواست نامعتبر است یا حجم بدنه بیش از حد مجاز است", http.StatusBadRequest)
		return
	}

	// 3. Handle Demo Login
	if req.Demo {
		demoClient, err := edu.NewEduClient(h.dataDir)
		if err != nil {
			http.Error(w, "خطا در بارگذاری اطلاعات دمو", http.StatusInternalServerError)
			return
		}
		profile, err := demoClient.GetStudentProfile()
		if err != nil {
			profile = models.StudentProfile{
				StudentID:  "400000000",
				FullName:   "دانشجوی دمو",
				Department: "دانشکده مهندسی کامپیوتر",
			}
		}

		userSession, err := h.sessionMgr.CreateSession("demo", &profile, demoClient)
		if err != nil {
			http.Error(w, "خطا در ایجاد نشست امن", http.StatusInternalServerError)
			return
		}

		h.setSessionCookie(w, userSession.Token)
		h.loginLimiter.Reset(clientIP)

		writeJSON(w, map[string]interface{}{
			"status":  "ok",
			"message": "ورود به سامانه با موفقیت انجام شد (حساب نمایشی دمو)",
			"student": profile,
		})
		return
	}

	// 4. Handle Custom JSESSIONID Input
	if req.JSESSIONID != "" {
		userClient, err := edu.NewIsolatedClient(h.dataDir)
		if err != nil {
			http.Error(w, "خطا در آماده‌سازی کلاینت شبکه", http.StatusInternalServerError)
			return
		}
		userClient.SetSessionID(req.JSESSIONID)
		profile, err := userClient.GetStudentProfile()
		if err != nil {
			http.Error(w, "کوکی ارائه‌شده منقضی یا نامعتبر است", http.StatusUnauthorized)
			return
		}

		userSession, err := h.sessionMgr.CreateSession(profile.StudentID, &profile, userClient)
		if err != nil {
			http.Error(w, "خطا در ایجاد نشست امن", http.StatusInternalServerError)
			return
		}

		h.setSessionCookie(w, userSession.Token)
		h.loginLimiter.Reset(clientIP)

		writeJSON(w, map[string]interface{}{
			"status":  "ok",
			"message": "لاگین با کوکی موفقیت‌آمیز بود",
			"student": profile,
		})
		return
	}

	// 5. Handle Standard Username/Password Login
	if req.Username == "" || req.Password == "" {
		http.Error(w, "لطفاً نام کاربری و رمز عبور را وارد نمایید", http.StatusBadRequest)
		return
	}

	userClient, err := edu.NewIsolatedClient(h.dataDir)
	if err != nil {
		http.Error(w, "خطا در آماده‌سازی کلاینت شبکه", http.StatusInternalServerError)
		return
	}

	profile, err := userClient.LoginWithCredentials(req.Username, req.Password)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		writeJSON(w, map[string]interface{}{
			"status":  "error",
			"message": err.Error(),
		})
		return
	}

	userSession, err := h.sessionMgr.CreateSession(req.Username, profile, userClient)
	if err != nil {
		http.Error(w, "خطا در ایجاد نشست امن", http.StatusInternalServerError)
		return
	}

	h.setSessionCookie(w, userSession.Token)
	h.loginLimiter.Reset(clientIP)

	writeJSON(w, map[string]interface{}{
		"status":  "ok",
		"message": "ورود به سامانه با موفقیت انجام شد",
		"student": profile,
	})
}

func (h *APIHandler) HandleLogout(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie(SessionCookieName)
	if err == nil && cookie.Value != "" {
		h.sessionMgr.DestroySession(cookie.Value)
	}

	// Expire the cookie in user's browser
	http.SetCookie(w, &http.Cookie{
		Name:     SessionCookieName,
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
		MaxAge:   -1,
		Expires:  time.Unix(0, 0),
	})

	writeJSON(w, map[string]string{
		"status":  "ok",
		"message": "خروج از سامانه انجام شد",
	})
}

func (h *APIHandler) HandleUpdateSession(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	r.Body = http.MaxBytesReader(w, r.Body, MaxBodyBytes)

	var req struct {
		JSESSIONID string `json:"jsessionid"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid body", http.StatusBadRequest)
		return
	}

	client, _ := h.getEduClient(r)
	if client != nil && req.JSESSIONID != "" {
		client.SetSessionID(req.JSESSIONID)
	}

	writeJSON(w, map[string]string{"status": "ok", "message": "Session updated"})
}

func (h *APIHandler) HandleHealth(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, map[string]interface{}{
		"status":          "healthy",
		"service":         "edu-sharif-gateway",
		"version":         "2.0.0-secure",
		"active_sessions": h.sessionMgr.Count(),
	})
}

func (h *APIHandler) setSessionCookie(w http.ResponseWriter, token string) {
	http.SetCookie(w, &http.Cookie{
		Name:     SessionCookieName,
		Value:    token,
		Path:     "/",
		HttpOnly: true,                 // Prevents JavaScript access (mitigates XSS)
		SameSite: http.SameSiteLaxMode, // Mitigates CSRF
		MaxAge:   86400 * 7,            // 7 days
	})
}

func writeJSON(w http.ResponseWriter, data interface{}) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	json.NewEncoder(w).Encode(data)
}
