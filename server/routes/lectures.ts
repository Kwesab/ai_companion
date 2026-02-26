import { RequestHandler } from "express";
import { LectureUploadResponse, ProcessLectureResponse, StudySummary } from "@shared/api";
import { geminiIntegration } from "../lib/geminiIntegration";

// In-memory storage for demo (replace with database in production)
const lectures: Map<string, any> = new Map();
const materials: Map<string, any> = new Map();

export const handleLectureUpload: RequestHandler = async (req, res) => {
  try {
    const { filename, fileType } = req.body;

    if (!filename || !fileType) {
      res.status(400).json({ error: "Missing filename or fileType" });
      return;
    }

    const lectureId = `lecture_${Date.now()}`;

    // Store lecture metadata
    lectures.set(lectureId, {
      id: lectureId,
      filename,
      fileType,
      status: "processing",
      uploadedAt: new Date().toISOString(),
    });

    // TODO: Implement file storage (e.g., AWS S3, local storage)
    // TODO: Extract text from PDF/PPTX

    const response: LectureUploadResponse = {
      lectureId,
      filename,
      status: "processing",
      uploadedAt: new Date().toISOString(),
    };

    res.json(response);
  } catch (error) {
    console.error("Lecture upload error:", error);
    res.status(500).json({ error: "Failed to upload lecture" });
  }
};

export const handleProcessLecture: RequestHandler = async (req, res) => {
  try {
    const { lectureId, materials: requestedMaterials } = req.body;

    if (!lectureId || !requestedMaterials || requestedMaterials.length === 0) {
      res.status(400).json({ error: "Missing lectureId or materials" });
      return;
    }

    const lecture = lectures.get(lectureId);
    if (!lecture) {
      res.status(404).json({ error: "Lecture not found" });
      return;
    }

    const processedMaterials: any = {};

    // Generate each requested material type
    for (const materialType of requestedMaterials) {
      switch (materialType) {
        case "summary":
          processedMaterials.summary = await generateSummary(lectureId);
          break;
        case "notes":
          processedMaterials.notes = await generateNotes(lectureId);
          break;
        case "flashcards":
          processedMaterials.flashcards = await generateFlashcards(lectureId);
          break;
        case "quizzes":
          processedMaterials.quizzes = await generateQuizzes(lectureId);
          break;
        case "guide":
          processedMaterials.guide = await generateStudyGuide(lectureId);
          break;
      }
    }

    // Update lecture status
    lecture.status = "completed";
    lectures.set(lectureId, lecture);

    // Cache materials
    materials.set(lectureId, processedMaterials);

    const response: ProcessLectureResponse = {
      lectureId,
      status: "completed",
      materials: processedMaterials,
      completedAt: new Date().toISOString(),
    };

    res.json(response);
  } catch (error) {
    console.error("Lecture processing error:", error);
    res.status(500).json({ error: "Failed to process lecture" });
  }
};

export const handleGetMaterials: RequestHandler = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lectureId_ = lectureId as string;

    const lectureMaterials = materials.get(lectureId_);
    if (!lectureMaterials) {
      res.status(404).json({ error: "Materials not found" });
      return;
    }

    res.json(lectureMaterials);
  } catch (error) {
    console.error("Get materials error:", error);
    res.status(500).json({ error: "Failed to retrieve materials" });
  }
};

export const handleGetLecture: RequestHandler = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lectureId_ = lectureId as string;

    const lecture = lectures.get(lectureId_);
    if (!lecture) {
      res.status(404).json({ error: "Lecture not found" });
      return;
    }

    res.json(lecture);
  } catch (error) {
    console.error("Get lecture error:", error);
    res.status(500).json({ error: "Failed to retrieve lecture" });
  }
};

// AI generation functions using Google Gemini API

async function generateSummary(lectureId: string) {
  try {
    // TODO: Retrieve actual lecture content from storage
    const lectureContent = "Sample lecture content about the topic";
    const lectureTitle = "Lecture Title";

    const result = await geminiIntegration.generateSummary({
      lectureTitle,
      lectureContent,
    });

    return {
      lectureId,
      title: "Lecture Summary",
      content: result.summary || result.raw || "Generated summary",
      keyPoints: result.keyPoints || [],
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Summary generation error:", error);
    // Return fallback response
    return {
      lectureId,
      title: "Lecture Summary",
      content:
        "Summary generation requires GEMINI_API_KEY. Please set it in environment variables.",
      keyPoints: ["API key not configured"],
      generatedAt: new Date().toISOString(),
    };
  }
}

async function generateNotes(lectureId: string) {
  try {
    const lectureContent = "Sample lecture content about the topic";
    const lectureTitle = "Lecture Title";

    const result = await geminiIntegration.generateNotes({
      lectureTitle,
      lectureContent,
    });

    return {
      lectureId,
      title: "Detailed Study Notes",
      sections: result.sections || [],
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Notes generation error:", error);
    return {
      lectureId,
      title: "Detailed Study Notes",
      sections: [
        {
          heading: "Note",
          content:
            "Notes generation requires GEMINI_API_KEY. Please set it in environment variables.",
        },
      ],
      generatedAt: new Date().toISOString(),
    };
  }
}

async function generateFlashcards(lectureId: string) {
  try {
    const lectureContent = "Sample lecture content about the topic";
    const lectureTitle = "Lecture Title";

    const result = await geminiIntegration.generateFlashcards({
      lectureTitle,
      lectureContent,
      count: 10,
    });

    const flashcards = (result.flashcards || []).map(
      (card: any, idx: number) => ({
        id: `card_${idx}`,
        lectureId,
        question: card.question,
        answer: card.answer,
        difficulty: card.difficulty || "medium",
        reviewedCount: 0,
      })
    );

    return {
      lectureId,
      flashcards,
      count: flashcards.length,
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Flashcards generation error:", error);
    return {
      lectureId,
      flashcards: [],
      count: 0,
      generatedAt: new Date().toISOString(),
    };
  }
}

async function generateQuizzes(lectureId: string) {
  try {
    const lectureContent = "Sample lecture content about the topic";
    const lectureTitle = "Lecture Title";

    const result = await geminiIntegration.generateQuizzes({
      lectureTitle,
      lectureContent,
      questionCount: 10,
      types: ["mcq", "truefalse", "shortanswer"],
    });

    const questions = (result.questions || []).map(
      (q: any, idx: number) => ({
        id: `q_${idx}`,
        lectureId,
        question: q.question,
        type: q.type,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: q.difficulty || "medium",
      })
    );

    return {
      lectureId,
      questions,
      totalQuestions: questions.length,
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Quizzes generation error:", error);
    return {
      lectureId,
      questions: [],
      totalQuestions: 0,
      generatedAt: new Date().toISOString(),
    };
  }
}

async function generateStudyGuide(lectureId: string) {
  try {
    const lectureContent = "Sample lecture content about the topic";
    const lectureTitle = "Lecture Title";

    const result = await geminiIntegration.generateStudyGuide({
      lectureTitle,
      lectureContent,
      weeks: 4,
    });

    return {
      lectureId,
      title: "Complete Study Guide",
      weeks: result.weeks || [],
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Study guide generation error:", error);
    return {
      lectureId,
      title: "Complete Study Guide",
      weeks: [],
      generatedAt: new Date().toISOString(),
    };
  }
}
