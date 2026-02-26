import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Brain, Zap, Clock, MessageSquare, Database } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background">
      {/* Navigation */}
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
            <Link to="/login" className="text-sm font-medium text-foreground hover:text-primary transition">
              Sign In
            </Link>
            <Link to="/signup" className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-medium text-sm">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Background gradient blobs */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50 -z-10" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-50 -z-10" />

          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Learning Platform</span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold mb-6 text-foreground leading-tight">
              Your Personal AI
              <span className="block bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                Study Companion
              </span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Transform your lecture slides into comprehensive study materials. Get AI-generated summaries, flashcards, quizzes, and personalized study plans—all powered by advanced AI and available offline.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-semibold text-lg group"
              >
                Start Learning
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-border rounded-lg hover:border-primary hover:bg-primary/5 transition font-semibold text-lg"
              >
                Learn More
              </a>
            </div>

            {/* Hero stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-border">
              <div>
                <div className="text-3xl font-bold text-primary">∞</div>
                <div className="text-sm text-muted-foreground mt-1">Study Materials</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-secondary">24/7</div>
                <div className="text-sm text-muted-foreground mt-1">AI Tutor Available</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent">100%</div>
                <div className="text-sm text-muted-foreground mt-1">Works Offline</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">AI</div>
                <div className="text-sm text-muted-foreground mt-1">Powered Learning</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-32 px-4 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-foreground">
              Everything You Need to Ace Your Exams
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive AI-powered tools designed specifically for university students
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature cards */}
            {[
              {
                icon: BookOpen,
                title: "Smart Summaries",
                description: "Automatically generate concise, structured summaries from your lecture slides",
              },
              {
                icon: Brain,
                title: "Interactive Flashcards",
                description: "Create and review AI-generated flashcards with spaced repetition learning",
              },
              {
                icon: Zap,
                title: "Practice Quizzes",
                description: "Generate exam-style questions including MCQ, True/False, and short answers",
              },
              {
                icon: Clock,
                title: "Smart Study Plans",
                description: "Get personalized study schedules based on your timetable and deadlines",
              },
              {
                icon: MessageSquare,
                title: "AI Tutor Chat",
                description: "Chat 24/7 with an AI tutor who understands your lecture content",
              },
              {
                icon: Database,
                title: "Offline Access",
                description: "Study anywhere without internet—all materials cached locally on your device",
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="group p-6 rounded-xl border border-border hover:border-primary hover:shadow-lg transition-all duration-300 bg-card hover:bg-gradient-to-br hover:from-primary/5 hover:to-secondary/5"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center mb-4 group-hover:from-primary/30 group-hover:to-secondary/30 transition">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32 px-4 border-t border-border bg-gradient-to-r from-primary/5 via-transparent to-secondary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-foreground">
            Ready to Transform Your Study Routine?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of students using StudyAI to excel in their exams
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-semibold text-lg group"
          >
            Start Free Today
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 bg-background/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 sm:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-foreground">StudyAI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 StudyAI. Empowering students worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
