/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

// ============= Lecture Management =============

export interface LectureUploadRequest {
  filename: string;
  fileType: "pdf" | "pptx";
  fileData: ArrayBuffer;
}

export interface LectureUploadResponse {
  lectureId: string;
  filename: string;
  status: "processing" | "completed" | "failed";
  uploadedAt: string;
}

// ============= Study Materials =============

export interface StudySummary {
  lectureId: string;
  title: string;
  content: string;
  keyPoints: string[];
  generatedAt: string;
}

export interface StudyNotes {
  lectureId: string;
  title: string;
  sections: Array<{
    heading: string;
    content: string;
  }>;
  generatedAt: string;
}

export interface Flashcard {
  id: string;
  lectureId: string;
  question: string;
  answer: string;
  difficulty: "easy" | "medium" | "hard";
  reviewedCount: number;
  lastReviewedAt?: string;
}

export interface FlashcardsResponse {
  lectureId: string;
  flashcards: Flashcard[];
  count: number;
  generatedAt: string;
}

export interface QuizQuestion {
  id: string;
  lectureId: string;
  question: string;
  type: "mcq" | "truefalse" | "shortanswer";
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface QuizzesResponse {
  lectureId: string;
  questions: QuizQuestion[];
  totalQuestions: number;
  generatedAt: string;
}

export interface StudyGuide {
  lectureId: string;
  title: string;
  weeks: Array<{
    weekNumber: number;
    topics: string[];
    learningObjectives: string[];
    activities: string[];
    estimatedHours: number;
  }>;
  generatedAt: string;
}

// ============= AI Processing =============

export interface ProcessLectureRequest {
  lectureId: string;
  materials: ("summary" | "notes" | "flashcards" | "quizzes" | "guide")[];
}

export interface ProcessLectureResponse {
  lectureId: string;
  status: "processing" | "completed" | "failed";
  materials: {
    summary?: StudySummary;
    notes?: StudyNotes;
    flashcards?: FlashcardsResponse;
    quizzes?: QuizzesResponse;
    guide?: StudyGuide;
  };
  completedAt: string;
}

// ============= AI Tutor Chat =============

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  lectureId?: string;
  timestamp: string;
}

export interface TutorChatRequest {
  message: string;
  lectureId?: string;
  conversationHistory?: ChatMessage[];
}

export interface TutorChatResponse {
  message: ChatMessage;
  conversationId: string;
}

// ============= Study Plan Generation =============

export interface TimeTableEntry {
  day: string;
  time: string;
  type: "lecture" | "exam" | "deadline" | "free";
  subject?: string;
  duration: number;
}

export interface StudyPlanRequest {
  academicTimetable: TimeTableEntry[];
  personalSchedule: TimeTableEntry[];
  subjects: Array<{
    name: string;
    exams: Array<{ date: string; time: string }>;
    uploadedLectures: string[];
  }>;
}

export interface StudyBlock {
  id: string;
  day: string;
  time: string;
  duration: number;
  subject: string;
  activities: string[];
  priority: "high" | "medium" | "low";
  materials?: string[];
}

export interface StudyPlanResponse {
  planId: string;
  studyBlocks: StudyBlock[];
  totalHoursPerWeek: number;
  generatedAt: string;
  analytics: {
    subjectsScheduled: string[];
    daysWithStudy: number;
    averageSessionLength: number;
  };
}

// ============= Authentication =============

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

// ============= Sync & Offline =============

export interface SyncRequest {
  lastSyncTime: string;
  actions: Array<{
    type: string;
    data: unknown;
  }>;
}

export interface SyncResponse {
  synced: number;
  errors: number;
  nextSyncTime: string;
}
