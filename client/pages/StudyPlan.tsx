import { useState } from "react";
import { Clock, Upload, CheckCircle2, Brain, AlertCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface TimeTableSession {
  day: string;
  time: string;
  type: "lecture" | "exam" | "free";
  subject?: string;
  duration: number;
}

interface StudyBlock {
  id: string;
  day: string;
  time: string;
  duration: number;
  subject: string;
  activities: string[];
  priority: "high" | "medium" | "low";
}

const SAMPLE_TIMETABLE: TimeTableSession[] = [
  { day: "Monday", time: "09:00", type: "lecture", subject: "Machine Learning", duration: 2 },
  { day: "Monday", time: "14:00", type: "free", duration: 3 },
  { day: "Tuesday", time: "10:00", type: "lecture", subject: "Data Structures", duration: 2 },
  { day: "Wednesday", time: "09:00", type: "free", duration: 4 },
  { day: "Friday", time: "15:00", type: "exam", subject: "Calculus Midterm", duration: 3 },
];

const SAMPLE_STUDY_PLAN: StudyBlock[] = [
  {
    id: "1",
    day: "Monday",
    time: "14:00",
    duration: 2,
    subject: "Machine Learning",
    activities: ["Review lecture notes", "Complete flashcard review", "Watch summary video"],
    priority: "high",
  },
  {
    id: "2",
    day: "Tuesday",
    time: "14:00",
    duration: 2,
    subject: "Data Structures",
    activities: ["Practice problem solving", "Review algorithms", "Complete quiz"],
    priority: "medium",
  },
  {
    id: "3",
    day: "Wednesday",
    time: "09:00",
    duration: 3,
    subject: "Calculus",
    activities: ["Intensive exam prep", "Solve practice problems", "Review formulas"],
    priority: "high",
  },
];

export default function StudyPlan() {
  const [timetableFile, setTimetableFile] = useState<File | null>(null);
  const [hasGeneratedPlan, setHasGeneratedPlan] = useState(true);

  const handleTimetableUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setTimetableFile(e.target.files[0]);
      // Simulate plan generation
      setTimeout(() => {
        setHasGeneratedPlan(true);
      }, 2000);
    }
  };

  const handleGeneratePlan = () => {
    // TODO: Implement plan generation API call
    console.log("Generating study plan...");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 hover:text-primary transition">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back to Dashboard</span>
          </Link>
          <h1 className="text-xl font-bold text-foreground">AI Study Plan Generator</h1>
          <div className="w-32" />
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!hasGeneratedPlan ? (
          <>
            {/* Upload section */}
            <div className="grid lg:grid-cols-2 gap-12 mb-12">
              {/* Left column */}
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  Get a Personalized Study Plan
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                  Upload your academic and personal timetables, and our AI will create a customized study schedule optimized for your learning.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-foreground">AI-Optimized Schedule</h3>
                      <p className="text-sm text-muted-foreground">Study at your peak productivity hours</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-foreground">Smart Time Management</h3>
                      <p className="text-sm text-muted-foreground">Fits around your lectures and commitments</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-foreground">Deadline Tracking</h3>
                      <p className="text-sm text-muted-foreground">Prioritizes based on exam dates</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right column - Upload forms */}
              <div className="space-y-6">
                {/* Academic Timetable */}
                <div className="border-2 border-dashed border-border rounded-xl p-8 hover:border-primary hover:bg-primary/5 transition">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">
                      Academic Timetable
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload your lectures, exams, and assignment deadlines
                    </p>
                    <label className="inline-flex items-center justify-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition font-semibold cursor-pointer text-sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                      <input
                        type="file"
                        accept=".csv,.xlsx,.pdf"
                        onChange={handleTimetableUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Personal Timetable */}
                <div className="border-2 border-dashed border-border rounded-xl p-8 hover:border-secondary hover:bg-secondary/5 transition">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                      <Clock className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">
                      Personal Schedule
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload your work, sports, and free time
                    </p>
                    <label className="inline-flex items-center justify-center px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition font-semibold cursor-pointer text-sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                      <input
                        type="file"
                        accept=".csv,.xlsx,.pdf"
                        onChange={(e) => console.log(e.target.files?.[0])}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {timetableFile && (
                  <button
                    onClick={handleGeneratePlan}
                    className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-semibold"
                  >
                    Generate Study Plan
                  </button>
                )}
              </div>
            </div>

            {/* Info cards */}
            <div className="grid md:grid-cols-3 gap-4 pt-8 border-t border-border">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-1">File Formats</h4>
                <p className="text-sm text-blue-700">
                  CSV, Excel, or PDF files from Google Calendar, Outlook, or Apple Calendar
                </p>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-1">Privacy</h4>
                <p className="text-sm text-green-700">
                  Your schedule is never shared and processed locally
                </p>
              </div>
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-1">Updates</h4>
                <p className="text-sm text-purple-700">
                  Regenerate your plan anytime your schedule changes
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Generated Plan View */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-foreground mb-2">
                    Your AI Study Plan
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    Optimized for your schedule and exam deadlines
                  </p>
                </div>
                <div className="flex gap-4">
                  <button className="px-6 py-2 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition font-semibold text-sm">
                    Regenerate
                  </button>
                  <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-semibold text-sm">
                    Export Plan
                  </button>
                </div>
              </div>
            </div>

            {/* Study Plan Grid */}
            <div className="space-y-4 mb-12">
              {SAMPLE_STUDY_PLAN.map((block) => (
                <div
                  key={block.id}
                  className={`border rounded-xl p-6 hover:shadow-lg transition ${
                    block.priority === "high"
                      ? "border-red-200 bg-red-50"
                      : block.priority === "medium"
                      ? "border-orange-200 bg-orange-50"
                      : "border-border bg-background"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {block.subject}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          block.priority === "high"
                            ? "bg-red-200 text-red-800"
                            : block.priority === "medium"
                            ? "bg-orange-200 text-orange-800"
                            : "bg-green-200 text-green-800"
                        }`}>
                          {block.priority.toUpperCase()} PRIORITY
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {block.day} at {block.time} • {block.duration} hours
                      </p>
                    </div>
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-muted-foreground mb-2">
                      Activities:
                    </p>
                    <ul className="space-y-2">
                      {block.activities.map((activity, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-foreground">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Statistics */}
            <div className="grid md:grid-cols-4 gap-4 border-t border-border pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">15.5</div>
                <p className="text-sm text-muted-foreground">Hours/Week</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary mb-2">4</div>
                <p className="text-sm text-muted-foreground">Subjects</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">7</div>
                <p className="text-sm text-muted-foreground">Study Sessions</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500 mb-2">100%</div>
                <p className="text-sm text-muted-foreground">Schedule Fit</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
