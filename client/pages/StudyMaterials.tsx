import { useState } from "react";
import { Brain, BookOpen, Zap, FileText, MessageSquare, ArrowLeft, Check, X } from "lucide-react";
import { Link } from "react-router-dom";

type MaterialTab = "summary" | "notes" | "flashcards" | "quizzes" | "guide";

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  isFlipped: boolean;
}

interface Quiz {
  id: string;
  question: string;
  type: "mcq" | "truefalse" | "shortanswer";
  options?: string[];
  userAnswer?: string;
  correctAnswer: string;
  explanation: string;
}

const SAMPLE_SUMMARY = `# Introduction to Machine Learning - Summary

Machine Learning is a subset of artificial intelligence that enables systems to learn and improve from experience without explicit programming.

## Key Concepts:
- **Supervised Learning**: Learning from labeled data
- **Unsupervised Learning**: Finding patterns in unlabeled data
- **Reinforcement Learning**: Learning through rewards and penalties

## Applications:
- Computer Vision
- Natural Language Processing
- Predictive Analytics
- Recommendation Systems`;

const SAMPLE_NOTES = `# Detailed Study Notes

## 1. Machine Learning Fundamentals
Machine Learning enables computers to learn from data without being explicitly programmed...

## 2. Types of Learning Algorithms
### Supervised Learning
- Used when we have labeled training data
- Examples: Linear Regression, Classification

### Unsupervised Learning
- Used to find hidden patterns in data
- Examples: Clustering, Dimensionality Reduction

## 3. Model Evaluation Metrics
- Accuracy: Proportion of correct predictions
- Precision: True positives / (True positives + False positives)
- Recall: True positives / (True positives + False negatives)
- F1-Score: Harmonic mean of precision and recall`;

const SAMPLE_STUDY_GUIDE = `# Complete Self-Learning Study Guide

## Week 1-2: Foundations
- Understand basic concepts of ML
- Learn about supervised vs unsupervised learning
- Get familiar with common algorithms

## Week 3-4: Practical Implementation
- Work with real datasets
- Implement models using Python/TensorFlow
- Practice data preprocessing

## Week 5-6: Advanced Topics
- Deep learning concepts
- Neural networks
- Advanced optimization techniques`;

export default function StudyMaterials() {
  const [activeTab, setActiveTab] = useState<MaterialTab>("summary");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([
    {
      id: "1",
      question: "What is the difference between supervised and unsupervised learning?",
      answer:
        "Supervised learning uses labeled training data while unsupervised learning finds patterns in unlabeled data.",
      isFlipped: false,
    },
    {
      id: "2",
      question: "What are the main types of machine learning?",
      answer:
        "The three main types are supervised learning, unsupervised learning, and reinforcement learning.",
      isFlipped: false,
    },
    {
      id: "3",
      question: "What is overfitting in machine learning?",
      answer:
        "Overfitting occurs when a model learns the training data too well, including noise, and performs poorly on new data.",
      isFlipped: false,
    },
  ]);

  const [quizzes, setQuizzes] = useState<Quiz[]>([
    {
      id: "1",
      question: "What is machine learning?",
      type: "mcq",
      options: [
        "Programming computers to perform tasks",
        "Enabling systems to learn from experience",
        "Teaching humans about computers",
        "Building physical machines",
      ],
      correctAnswer: "Enabling systems to learn from experience",
      explanation: "Machine Learning is a subset of AI that allows systems to learn and improve from experience without explicit programming.",
    },
    {
      id: "2",
      question: "True or False: Supervised learning requires labeled training data.",
      type: "truefalse",
      options: ["True", "False"],
      correctAnswer: "True",
      explanation: "Supervised learning requires labeled training data where the correct answers are provided.",
    },
  ]);

  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [quizProgress, setQuizProgress] = useState<{ [key: string]: string }>({});

  const toggleFlashcard = (id: string) => {
    setFlashcards((prev) =>
      prev.map((card) =>
        card.id === id ? { ...card, isFlipped: !card.isFlipped } : card
      )
    );
  };

  const nextFlashcard = () => {
    if (currentFlashcardIndex < flashcards.length - 1) {
      setCurrentFlashcardIndex((prev) => prev + 1);
    }
  };

  const prevFlashcard = () => {
    if (currentFlashcardIndex > 0) {
      setCurrentFlashcardIndex((prev) => prev - 1);
    }
  };

  const answerQuiz = (quizId: string, answer: string) => {
    setQuizProgress((prev) => ({
      ...prev,
      [quizId]: answer,
    }));
  };

  const currentFlashcard = flashcards[currentFlashcardIndex];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 hover:text-primary transition">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back to Dashboard</span>
          </Link>
          <div className="text-center">
            <h1 className="font-bold text-foreground">
              Introduction to Machine Learning
            </h1>
          </div>
          <div className="w-10" />
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Material type tabs */}
        <div className="border-b border-border mb-8 overflow-x-auto">
          <div className="flex gap-1">
            {[
              { id: "summary", label: "Summary", icon: FileText },
              { id: "notes", label: "Notes", icon: BookOpen },
              { id: "flashcards", label: "Flashcards", icon: Zap },
              { id: "quizzes", label: "Quizzes", icon: MessageSquare },
              { id: "guide", label: "Study Guide", icon: Brain },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as MaterialTab)}
                className={`px-6 py-4 font-semibold text-sm transition-colors border-b-2 ${
                  activeTab === id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4 inline-block mr-2" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Tab */}
        {activeTab === "summary" && (
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 rounded-xl p-8">
              <div className="whitespace-pre-wrap text-foreground font-sans max-w-4xl">
                {SAMPLE_SUMMARY}
              </div>
            </div>
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === "notes" && (
          <div className="bg-gradient-to-br from-secondary/5 to-accent/5 border border-secondary/20 rounded-xl p-8">
            <div className="whitespace-pre-wrap text-foreground font-sans max-w-4xl">
              {SAMPLE_NOTES}
            </div>
          </div>
        )}

        {/* Flashcards Tab */}
        {activeTab === "flashcards" && (
          <div className="max-w-2xl mx-auto">
            <div className="mb-6 text-center">
              <p className="text-muted-foreground mb-4">
                Flashcard {currentFlashcardIndex + 1} of {flashcards.length}
              </p>
              <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{
                    width: `${((currentFlashcardIndex + 1) / flashcards.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {currentFlashcard && (
              <div
                onClick={() => toggleFlashcard(currentFlashcard.id)}
                className="h-72 bg-gradient-to-br from-primary via-purple-500 to-secondary rounded-xl cursor-pointer flex items-center justify-center p-8 text-white transition-transform transform hover:scale-105 shadow-lg mb-8"
              >
                <div className="text-center">
                  {!currentFlashcard.isFlipped ? (
                    <div>
                      <p className="text-sm opacity-75 mb-4">QUESTION</p>
                      <p className="text-2xl font-semibold">
                        {currentFlashcard.question}
                      </p>
                      <p className="text-sm opacity-75 mt-8">Click to reveal answer</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm opacity-75 mb-4">ANSWER</p>
                      <p className="text-xl">
                        {currentFlashcard.answer}
                      </p>
                      <p className="text-sm opacity-75 mt-8">Click to see question</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <button
                onClick={prevFlashcard}
                disabled={currentFlashcardIndex === 0}
                className="px-6 py-2 border border-border rounded-lg hover:border-primary disabled:opacity-50 transition"
              >
                Previous
              </button>
              <button
                onClick={nextFlashcard}
                disabled={currentFlashcardIndex === flashcards.length - 1}
                className="px-6 py-2 border border-border rounded-lg hover:border-primary disabled:opacity-50 transition"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Quizzes Tab */}
        {activeTab === "quizzes" && (
          <div className="max-w-2xl mx-auto space-y-8">
            {quizzes.map((quiz) => {
              const isAnswered = !!quizProgress[quiz.id];
              const isCorrect = quizProgress[quiz.id] === quiz.correctAnswer;

              return (
                <div
                  key={quiz.id}
                  className="border border-border rounded-xl p-6 hover:shadow-lg transition"
                >
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-muted-foreground mb-2">
                      Question {quizzes.indexOf(quiz) + 1}
                    </p>
                    <h3 className="text-lg font-semibold text-foreground">
                      {quiz.question}
                    </h3>
                  </div>

                  <div className="space-y-3 mb-6">
                    {quiz.options?.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          if (!isAnswered) {
                            answerQuiz(quiz.id, option);
                          }
                        }}
                        disabled={isAnswered}
                        className={`w-full p-4 text-left border-2 rounded-lg transition ${
                          quizProgress[quiz.id] === option
                            ? isCorrect
                              ? "border-green-500 bg-green-50"
                              : "border-red-500 bg-red-50"
                            : "border-border hover:border-primary"
                        } ${isAnswered ? "cursor-default" : "cursor-pointer"}`}
                      >
                        <div className="flex items-center gap-3">
                          {quizProgress[quiz.id] === option && (
                            <>
                              {isCorrect ? (
                                <Check className="w-5 h-5 text-green-600" />
                              ) : (
                                <X className="w-5 h-5 text-red-600" />
                              )}
                            </>
                          )}
                          <span className={isAnswered && quizProgress[quiz.id] === option ? (isCorrect ? "text-green-900" : "text-red-900") : "text-foreground"}>
                            {option}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {isAnswered && (
                    <div
                      className={`p-4 rounded-lg border-2 ${
                        isCorrect
                          ? "bg-green-50 border-green-200"
                          : "bg-blue-50 border-blue-200"
                      }`}
                    >
                      <p className={`font-semibold mb-2 ${isCorrect ? "text-green-900" : "text-blue-900"}`}>
                        {isCorrect ? "Correct!" : "Explanation:"}
                      </p>
                      <p className={isCorrect ? "text-green-800" : "text-blue-800"}>
                        {quiz.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Study Guide Tab */}
        {activeTab === "guide" && (
          <div className="bg-gradient-to-br from-accent/5 to-primary/5 border border-accent/20 rounded-xl p-8">
            <div className="whitespace-pre-wrap text-foreground font-sans max-w-4xl">
              {SAMPLE_STUDY_GUIDE}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
