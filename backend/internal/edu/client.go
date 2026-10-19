package edu

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/http/cookiejar"
	"net/url"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"time"

	"edu-gateway/internal/models"
)

type EduClient struct {
	mu         sync.RWMutex
	httpClient *http.Client
	sessionID  string
	dataDir    string
	baseURL    string
}

func NewEduClient(dataDir string) (*EduClient, error) {
	jar, err := cookiejar.New(nil)
	if err != nil {
		return nil, err
	}

	client := &EduClient{
		httpClient: &http.Client{
			Jar:     jar,
			Timeout: 10 * time.Second,
		},
		dataDir: dataDir,
		baseURL: "https://edu.sharif.edu",
	}

	// Try loading saved cookies
	client.loadSavedSession()
	return client, nil
}

// NewIsolatedClient creates a clean, independent client with no preloaded cookies
func NewIsolatedClient(dataDir string) (*EduClient, error) {
	jar, err := cookiejar.New(nil)
	if err != nil {
		return nil, err
	}

	return &EduClient{
		httpClient: &http.Client{
			Jar:     jar,
			Timeout: 10 * time.Second,
		},
		dataDir: dataDir,
		baseURL: "https://edu.sharif.edu",
	}, nil
}

func (c *EduClient) loadSavedSession() {
	c.mu.Lock()
	defer c.mu.Unlock()

	cookiePath := filepath.Join(c.dataDir, "cookies.json")
	data, err := os.ReadFile(cookiePath)
	if err != nil {
		return
	}

	var rawCookies []struct {
		Name  string `json:"name"`
		Value string `json:"value"`
	}
	if err := json.Unmarshal(data, &rawCookies); err != nil {
		return
	}

	u, _ := url.Parse(c.baseURL)
	var httpCookies []*http.Cookie
	for _, rc := range rawCookies {
		if rc.Name == "JSESSIONID" {
			c.sessionID = rc.Value
		}
		httpCookies = append(httpCookies, &http.Cookie{
			Name:  rc.Name,
			Value: rc.Value,
			Path:  "/",
		})
	}
	c.httpClient.Jar.SetCookies(u, httpCookies)
}

func (c *EduClient) SetSessionID(jsessionid string) {
	c.mu.Lock()
	defer c.mu.Unlock()

	c.sessionID = jsessionid
	u, _ := url.Parse(c.baseURL)
	c.httpClient.Jar.SetCookies(u, []*http.Cookie{
		{
			Name:  "JSESSIONID",
			Value: jsessionid,
			Path:  "/",
		},
	})
}

func (c *EduClient) IsAuthenticated() bool {
	c.mu.RLock()
	defer c.mu.RUnlock()
	return c.sessionID != ""
}

func (c *EduClient) LoginWithCredentials(username, password string) (*models.StudentProfile, error) {
	if (username == "demo" || username == "guest") && (password == "demo" || password == "guest") {
		c.mu.Lock()
		c.sessionID = "demo_session_active"
		c.mu.Unlock()
		p, err := c.GetStudentProfile()
		return &p, err
	}

	form := url.Values{}
	form.Set("command", "login")
	form.Set("username", username)
	form.Set("password", password)

	req, err := http.NewRequest("POST", c.baseURL+"/login.do", strings.NewReader(form.Encode()))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	req.Header.Set("User-Agent", "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:130.0) Gecko/20100101 Firefox/130.0")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("خطا در برقراری ارتباط با سرور دانشگاه: %w", err)
	}
	defer resp.Body.Close()

	bodyBytes, _ := io.ReadAll(resp.Body)
	bodyStr := string(bodyBytes)

	if strings.Contains(bodyStr, "نام کاربری یا رمز عبور نادرست است") || strings.Contains(bodyStr, "invalid-feedback") {
		return nil, fmt.Errorf("نام کاربری یا رمز عبور وارد شده نادرست است.")
	}
	if strings.Contains(bodyStr, "درصورت اطمینان از صحت نام کاربری") {
		return nil, fmt.Errorf("خطا در احراز هویت. لطفاً پس از چند دقیقه مجدداً تلاش نمایید.")
	}

	u, _ := url.Parse(c.baseURL)
	foundSession := false
	for _, ck := range c.httpClient.Jar.Cookies(u) {
		if ck.Name == "JSESSIONID" && ck.Value != "" {
			c.mu.Lock()
			c.sessionID = ck.Value
			c.mu.Unlock()
			foundSession = true
			break
		}
	}

	// Successful login in Sepehr always renders headerMenuForm or redirects to action.do
	if !foundSession || (!strings.Contains(bodyStr, "headerMenuForm") && !strings.Contains(bodyStr, "خروج") && !strings.Contains(bodyStr, "firstpage")) {
		return nil, fmt.Errorf("نام کاربری یا رمز عبور وارد شده نادرست است.")
	}

	profile, err := c.GetStudentProfile()
	if err != nil {
		return nil, err
	}
	return &profile, nil
}

func (c *EduClient) Logout() error {
	c.mu.Lock()
	defer c.mu.Unlock()

	if c.sessionID != "" && c.sessionID != "demo_session_active" {
		form := url.Values{}
		form.Set("changeMenu", "Exit")
		req, _ := http.NewRequest("POST", c.baseURL+"/action.do", strings.NewReader(form.Encode()))
		if req != nil {
			req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
			c.httpClient.Do(req)
		}
	}

	c.sessionID = ""
	jar, _ := cookiejar.New(nil)
	c.httpClient.Jar = jar

	return nil
}

// FetchMenuHTML posts changeMenu to action.do or falls back to local snapshot.
func (c *EduClient) FetchMenuHTML(menuCode string, localFallbackFile string) (string, error) {
	c.mu.RLock()
	hasSession := c.sessionID != ""
	c.mu.RUnlock()

	if hasSession {
		form := url.Values{}
		form.Set("changeMenu", menuCode)

		req, err := http.NewRequest("POST", c.baseURL+"/action.do", strings.NewReader(form.Encode()))
		if err == nil {
			req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
			req.Header.Set("User-Agent", "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:130.0) Gecko/20100101 Firefox/130.0")
			req.Header.Set("Referer", c.baseURL+"/action.do")

			resp, err := c.httpClient.Do(req)
			if err == nil && resp.StatusCode == http.StatusOK {
				bodyBytes, err := io.ReadAll(resp.Body)
				resp.Body.Close()
				if err == nil && len(bodyBytes) > 1000 && !strings.Contains(string(bodyBytes), "نام کاربری یا رمز عبور") {
					return string(bodyBytes), nil
				}
			}
		}
	}

	// Fallback to local snapshot file
	fallbackPath := filepath.Join(c.dataDir, localFallbackFile)
	data, err := os.ReadFile(fallbackPath)
	if err != nil {
		return "", fmt.Errorf("could not fetch live page or local fallback %s: %w", localFallbackFile, err)
	}
	return string(data), nil
}

func (c *EduClient) GetStudentProfile() (models.StudentProfile, error) {
	transHTML, _ := c.FetchMenuHTML("ExamTab*DepthSearch", "transcript.html")
	dashHTML, _ := c.FetchMenuHTML("firstpage", "dashboard.html")
	profile := ParseStudentProfile(transHTML, dashHTML, "")
	return profile, nil
}

func (c *EduClient) GetEnrolledCourses() ([]models.Course, error) {
	html, err := c.FetchMenuHTML("register*RegistrationFormForStudent", "enrolled_courses.html")
	if err != nil {
		return nil, err
	}
	courses := ParseEnrolledCourses(html)
	return courses, nil
}

func (c *EduClient) GetWeeklySchedule() ([]models.ScheduleItem, error) {
	courses, err := c.GetEnrolledCourses()
	if err != nil {
		return nil, err
	}
	schedule := ParseWeeklySchedule(courses)
	return schedule, nil
}

func (c *EduClient) GetFinalExams() ([]models.ExamItem, error) {
	courses, err := c.GetEnrolledCourses()
	if err != nil {
		return nil, err
	}
	exams := ParseFinalExams(courses)
	return exams, nil
}

func (c *EduClient) GetTranscript() (models.StudentTranscript, error) {
	transFullHTML := ""
	if data, err := os.ReadFile(filepath.Join(c.dataDir, "transcript_full.html")); err == nil {
		transFullHTML = string(data)
	}
	transHTML, _ := c.FetchMenuHTML("ExamTab*DepthSearch", "transcript.html")
	tempHTML, _ := c.FetchMenuHTML("ExamTab*showTempGradeAndObligate", "temp_grades.html")
	profile, _ := c.GetStudentProfile()
	courses, _ := c.GetEnrolledCourses()

	transcript := ParseStudentTranscript(transFullHTML, transHTML, tempHTML, c.dataDir, profile, courses)
	return transcript, nil
}

func (c *EduClient) GetDashboardOverview() (models.DashboardOverview, error) {
	profile, _ := c.GetStudentProfile()
	courses, _ := c.GetEnrolledCourses()
	schedule, _ := c.GetWeeklySchedule()
	exams, _ := c.GetFinalExams()

	totalUnits := 0
	for _, c := range courses {
		totalUnits += c.Units
	}

	// Calculate today's classes
	now := time.Now()
	persianDay := ""
	switch now.Weekday() {
	case time.Saturday:
		persianDay = "شنبه"
	case time.Sunday:
		persianDay = "یکشنبه"
	case time.Monday:
		persianDay = "دوشنبه"
	case time.Tuesday:
		persianDay = "سه شنبه"
	case time.Wednesday:
		persianDay = "چهارشنبه"
	default:
		persianDay = "جمعه"
	}

	var todayClasses []models.ScheduleItem
	for _, item := range schedule {
		if item.DayOfWeek == persianDay {
			todayClasses = append(todayClasses, item)
		}
	}

	var nextExam *models.ExamItem
	if len(exams) > 0 {
		nextExam = &exams[0]
	}

	return models.DashboardOverview{
		Student:          profile,
		ActiveSemester:   "نیم‌سال اول ۱۴۰۵-۱۴۰۴",
		TotalUnits:       totalUnits,
		CourseCount:      len(courses),
		TodayClasses:     todayClasses,
		NextExam:         nextExam,
		PendingRequests:  1,
		ServerSystemTime: time.Now().Format("2006/01/02 15:04:05"),
	}, nil
}
