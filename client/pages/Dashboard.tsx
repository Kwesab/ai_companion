import { Brain, Upload, BookOpen, Zap, Clock, MessageSquare, Home, Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              StudyAI
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm text-foreground hover:text-primary transition flex items-center gap-1">
              <Home className="w-4 h-4" />
              Home
            </Link>
            <button className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition">
              U
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Welcome to StudyAI
          </h1>
          <p className="text-lg text-muted-foreground">
            Upload your lectures and let AI transform them into study materials
          </p>
        </div>

        {/* Quick actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Link to="/upload" className="group p-8 rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Upload Lecture Slides
            </h3>
            <p className="text-muted-foreground text-sm">
              Upload PDF or PowerPoint presentations to analyze
            </p>
          </Link>

          <Link to="/study-plan" className="group p-8 rounded-xl border-2 border-dashed border-border hover:border-secondary hover:bg-secondary/5 transition">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition">
              <Clock className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Create Study Plan
            </h3>
            <p className="text-muted-foreground text-sm">
              Upload timetables and get a personalized study schedule
            </p>
          </Link>

          <Link to="/tutor" className="group p-8 rounded-xl border-2 border-dashed border-border hover:border-accent hover:bg-accent/5 transition">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent/20 transition">
              <MessageSquare className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Chat with AI Tutor
            </h3>
            <p className="text-muted-foreground text-sm">
              Get instant answers about your lecture content
            </p>
          </Link>
        </div>

        {/* Recent materials */}
        <div className="border border-border rounded-xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 border-b border-border">
            <h2 className="text-2xl font-bold text-foreground">Your Study Materials</h2>
            <p className="text-muted-foreground text-sm mt-1">
              You haven't uploaded any lectures yet
            </p>
          </div>
          <div className="p-12 text-center">
            <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Get started by uploading your first lecture slides
            </p>
            <Link to="/upload" className="inline-flex items-center justify-center px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-semibold">
              <Upload className="w-4 h-4 mr-2" />
              Upload First Lecture
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
