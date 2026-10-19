package models

// StudentProfile represents the authenticated student's identity and status.
type StudentProfile struct {
	StudentID       string `json:"student_id"`
	FullName        string `json:"full_name"`
	Department      string `json:"department"`
	Major           string `json:"major"`
	Minor           string `json:"minor,omitempty"`
	Degree          string `json:"degree"`
	EntrySemester   string `json:"entry_semester"`
	Gender          string `json:"gender"`
	Email           string `json:"email"`
	AcademicStatus  string `json:"academic_status"`
	AdvisorApproved bool   `json:"advisor_approved"`
	ExemptionExpiry string `json:"exemption_expiry"`
}

// Course represents an enrolled course in the active semester.
type Course struct {
	Code         string   `json:"code"`
	Group        string   `json:"group"`
	Title        string   `json:"title"`
	Units        int      `json:"units"`
	Instructor   string   `json:"instructor"`
	EnrolledNum  int      `json:"enrolled_num"`
	ExamDate     string   `json:"exam_date"`
	ExamTime     string   `json:"exam_time"`
	ExamLocation string   `json:"exam_location"`
	ClassTimes   string   `json:"class_times"`
	ClassRoom    string   `json:"class_room"`
	Status       string   `json:"status"`
	VirtualURL   string   `json:"virtual_url,omitempty"`
	Notes        string   `json:"notes,omitempty"`
	Color        string   `json:"color,omitempty"`
}

// ScheduleItem represents a single scheduled class session block.
type ScheduleItem struct {
	DayOfWeek    string `json:"day_of_week"` // شنبه, یکشنبه, دوشنبه, سه شنبه, چهارشنبه
	DayIndex     int    `json:"day_index"`   // 0 for شنبه ... 4 for چهارشنبه
	StartTime    string `json:"start_time"`  // e.g. "09:00"
	EndTime      string `json:"end_time"`    // e.g. "10:30"
	StartHour    float64 `json:"start_hour"` // 9.0
	EndHour      float64 `json:"end_hour"`   // 10.5
	CourseCode   string `json:"course_code"`
	CourseGroup  string `json:"course_group"`
	CourseTitle  string `json:"course_title"`
	Instructor   string `json:"instructor"`
	Room         string `json:"room"`
	Color        string `json:"color"`
}

// ExamItem represents an upcoming final exam.
type ExamItem struct {
	CourseCode  string `json:"course_code"`
	CourseGroup string `json:"course_group"`
	CourseTitle string `json:"course_title"`
	Instructor  string `json:"instructor"`
	ExamDate    string `json:"exam_date"`
	ExamTime    string `json:"exam_time"`
	Room        string `json:"room"`
	DaysLeft    int    `json:"days_left"`
	HasClash    bool   `json:"has_clash"`
}

// DashboardOverview aggregates summary data for the home view.
type DashboardOverview struct {
	Student          StudentProfile `json:"student"`
	ActiveSemester   string         `json:"active_semester"`
	TotalUnits       int            `json:"total_units"`
	CourseCount      int            `json:"course_count"`
	TodayClasses     []ScheduleItem `json:"today_classes"`
	NextExam         *ExamItem      `json:"next_exam,omitempty"`
	PendingRequests  int            `json:"pending_requests"`
	ServerSystemTime string         `json:"server_system_time"`
}

// GradeItem represents a course grade entry (either provisional or permanent).
type GradeItem struct {
	CourseCode        string  `json:"course_code"`
	CourseGroup       string  `json:"course_group"`
	CourseTitle       string  `json:"course_title"`
	Units             int     `json:"units"`
	Instructor        string  `json:"instructor"`
	Grade             string  `json:"grade"` // e.g. "۱۹.۵", "۱۸", "—"
	NumericGrade      float64 `json:"numeric_grade,omitempty"`
	Status            string  `json:"status"` // "ثبت قطعی", "ثبت موقت", "در جریان نیم‌سال"
	IsProvisional     bool    `json:"is_provisional"`
	CanObject         bool    `json:"can_object"`
	ObjectionDeadline string  `json:"objection_deadline,omitempty"`
	ExamDate          string  `json:"exam_date,omitempty"`
	ObjectionStatus   string  `json:"objection_status,omitempty"` // "ثبت نشده", "ثبت شد"
	RankInClass       int     `json:"rank_in_class,omitempty"`
	ClassSize         int     `json:"class_size,omitempty"`
}

// TranscriptTerm represents an academic term in the student's cumulative transcript.
type TranscriptTerm struct {
	TermCode       string      `json:"term_code"`      // e.g. "14041"
	TermTitle      string      `json:"term_title"`     // e.g. "نیم‌سال اول ۱۴۰۵-۱۴۰۴"
	TermGPA        float64     `json:"term_gpa"`       // e.g. 18.50
	CumulativeGPA  float64     `json:"cumulative_gpa"` // e.g. 18.50
	TermUnits      int         `json:"term_units"`     // 19
	PassedUnits    int         `json:"passed_units"`   // 19
	Standing       string      `json:"standing"`       // "ممتاز", "عادی", "مشروط"
	Grades         []GradeItem `json:"grades"`
}

// StudentTranscript encapsulates the full official academic transcript & grade report.
type StudentTranscript struct {
	StudentID          string           `json:"student_id"`
	FullName           string           `json:"full_name"`
	TotalPassedUnits   int              `json:"total_passed_units"`
	TotalEnrolledUnits int              `json:"total_enrolled_units"`
	OverallGPA         float64          `json:"overall_gpa"`
	AcademicStanding   string           `json:"academic_standing"`
	Degree             string           `json:"degree"`
	Major              string           `json:"major"`
	Minor              string           `json:"minor,omitempty"`
	Terms              []TranscriptTerm `json:"terms"`
	CurrentTermGrades  []GradeItem      `json:"current_term_grades"`
}

// ObjectionRequest payload for submitting grade reviews.
type ObjectionRequest struct {
	CourseCode string `json:"course_code"`
	Text       string `json:"text"`
}
