import { useState } from "react";
import { Upload, FileText, CheckCircle2, Clock, AlertCircle, Loader2, Brain } from "lucide-react";
import { Link } from "react-router-dom";

interface UploadedLecture {
  id: string;
  filename: string;
  uploadedAt: string;
  status: "processing" | "completed" | "failed";
  materials?: {
    summaries: boolean;
    notes: boolean;
    flashcards: boolean;
    quizzes: boolean;
    studyGuide: boolean;
  };
}

export default function LectureUpload() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedLectures, setUploadedLectures] = useState<UploadedLecture[]>([
    {
      id: "1",
      filename: "Introduction to Machine Learning.pdf",
      uploadedAt: "2024-01-15",
      status: "completed",
      materials: {
        summaries: true,
        notes: true,
        flashcards: true,
        quizzes: true,
        studyGuide: true,
      },
    },
  ]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFiles = (files: FileList) => {
    const file = files[0];
    if (file) {
      // TODO: Implement file upload and AI processing
      console.log("File selected:", file.name);
      
      // Simulate upload
      const newLecture: UploadedLecture = {
        id: Date.now().toString(),
        filename: file.name,
        uploadedAt: new Date().toISOString().split("T")[0],
        status: "processing",
      };
      
      setUploadedLectures((prev) => [newLecture, ...prev]);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processing":
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "failed":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "processing":
        return "Processing with AI...";
      case "completed":
        return "Ready to study";
      case "failed":
        return "Failed to process";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              StudyAI
            </span>
          </Link>
          <Link to="/dashboard" className="text-sm text-foreground hover:text-primary transition">
            Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Upload Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Upload Your Lectures
          </h1>
          <p className="text-lg text-muted-foreground">
            Upload PDF or PowerPoint files and get AI-generated study materials instantly
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Upload area */}
          <div className="lg:col-span-2">
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                dragActive
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary hover:bg-primary/5"
              }`}
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Drag and drop your files here
                </h3>
                <p className="text-muted-foreground mb-6">
                  or click to select files from your computer
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  Supported formats: PDF, PowerPoint (.pptx)
                </p>
                <label className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-semibold cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.pptx,.ppt"
                    onChange={(e) => {
                      if (e.target.files) {
                        handleFiles(e.target.files);
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Upload info */}
            <div className="mt-8 grid sm:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">
                      Supported Formats
                    </h4>
                    <p className="text-sm text-blue-700">
                      PDF, PowerPoint presentations
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Brain className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-purple-900 mb-1">
                      AI Analysis
                    </h4>
                    <p className="text-sm text-purple-700">
                      Powered by Google Gemini 1.5 Pro
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-green-900 mb-1">
                      Fast Processing
                    </h4>
                    <p className="text-sm text-green-700">
                      Usually under 5 minutes
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="space-y-4">
            <div className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 rounded-xl">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                What You Get
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-foreground">Concise Summaries</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-foreground">Study Notes</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-foreground">Flashcards</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-foreground">Practice Quizzes</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-foreground">Study Guide</span>
                </li>
              </ul>
            </div>

            <div className="p-6 bg-gradient-to-br from-secondary/5 to-accent/5 border border-secondary/20 rounded-xl">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Tip
              </h3>
              <p className="text-sm text-muted-foreground">
                For best results, upload clear, well-structured lecture slides with text content.
              </p>
            </div>
          </div>
        </div>

        {/* Recent uploads */}
        {uploadedLectures.length > 0 && (
          <div className="border border-border rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 border-b border-border">
              <h2 className="text-2xl font-bold text-foreground">Your Lectures</h2>
            </div>
            <div className="divide-y divide-border">
              {uploadedLectures.map((lecture) => (
                <div
                  key={lecture.id}
                  className="p-6 hover:bg-primary/5 transition flex items-start justify-between"
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">
                        {lecture.filename}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        {getStatusIcon(lecture.status)}
                        <span className="text-sm text-muted-foreground">
                          {getStatusText(lecture.status)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Uploaded {lecture.uploadedAt}
                      </p>
                    </div>
                  </div>

                  {lecture.status === "completed" && lecture.materials && (
                    <div className="flex flex-wrap gap-2 justify-end ml-4">
                      {Object.entries(lecture.materials).map(([key, value]) => (
                        value && (
                          <span
                            key={key}
                            className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full"
                          >
                            {key.charAt(0).toUpperCase() +
                              key.slice(1).replace(/([A-Z])/g, " $1")}
                          </span>
                        )
                      ))}
                    </div>
                  )}

                  {lecture.status === "completed" && (
                    <button className="ml-4 px-4 py-2 text-primary font-semibold text-sm hover:underline whitespace-nowrap">
                      View Materials
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
