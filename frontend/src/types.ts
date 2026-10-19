export interface StudentProfile {
  student_id: string;
  full_name: string;
  department: string;
  major: string;
  minor?: string;
  degree: string;
  entry_semester: string;
  gender: string;
  email: string;
  academic_status: string;
  advisor_approved: boolean;
  exemption_expiry: string;
}

export interface Course {
  code: string;
  group: string;
  title: string;
  units: number;
  instructor: string;
  enrolled_num: number;
  exam_date: string;
  exam_time: string;
  exam_location: string;
  class_times: string;
  class_room: string;
  status: string;
  virtual_url?: string;
  notes?: string;
  color?: string;
}

export interface ScheduleItem {
  day_of_week: string; // شنبه, یکشنبه, دوشنبه, سه شنبه, چهارشنبه
  day_index: number;
  start_time: string;
  end_time: string;
  start_hour: number;
  end_hour: number;
  course_code: string;
  course_group: string;
  course_title: string;
  instructor: string;
  room: string;
  color: string;
}

export interface ExamItem {
  course_code: string;
  course_group: string;
  course_title: string;
  instructor: string;
  exam_date: string;
  exam_time: string;
  room: string;
  days_left: number;
  has_clash: boolean;
}

export interface EducationalRequest {
  id: string;
  title: string;
  category: string;
  submit_date: string;
  status: 'در جریان' | 'تایید شده' | 'رد شده' | 'منتظر اقدام دانشجو';
  status_color: string;
  tracking_code: string;
  step: string;
  description: string;
}

export interface GradeItem {
  course_code: string;
  course_group: string;
  course_title: string;
  units: number;
  instructor: string;
  grade: string;
  numeric_grade?: number;
  status: string;
  is_provisional: boolean;
  can_object: boolean;
  objection_deadline?: string;
  exam_date?: string;
  objection_status?: string;
  rank_in_class?: number;
  class_size?: number;
}

export interface TranscriptTerm {
  term_code: string;
  term_title: string;
  term_gpa: number;
  cumulative_gpa: number;
  term_units: number;
  passed_units: number;
  standing: string;
  grades: GradeItem[];
}

export interface StudentTranscript {
  student_id: string;
  full_name: string;
  total_passed_units: number;
  total_enrolled_units: number;
  overall_gpa: number;
  academic_standing: string;
  degree: string;
  major: string;
  minor?: string;
  terms: TranscriptTerm[];
  current_term_grades: GradeItem[];
}

export interface DashboardOverview {
  student: StudentProfile;
  active_semester: string;
  total_units: number;
  course_count: number;
  today_classes: ScheduleItem[];
  next_exam?: ExamItem;
  pending_requests: number;
  server_system_time: string;
}

export type NavigationModule = 
  | 'dashboard'
  | 'schedule'
  | 'courses'
  | 'transcript'
  | 'requests'
  | 'exams'
  | 'department_reports'
  | 'preferences';
