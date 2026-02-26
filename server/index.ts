import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  handleLectureUpload,
  handleProcessLecture,
  handleGetMaterials,
  handleGetLecture,
} from "./routes/lectures";
import {
  handleTutorChat,
  handleGetConversation,
  handleClearConversation,
} from "./routes/tutor";
import {
  handleGenerateStudyPlan,
  handleGetStudyPlan,
  handleUpdateStudyPlan,
} from "./routes/studyplan";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // ============= Lecture Management =============
  app.post("/api/lectures/upload", handleLectureUpload);
  app.post("/api/lectures/:lectureId/process", handleProcessLecture);
  app.get("/api/lectures/:lectureId", handleGetLecture);
  app.get("/api/lectures/:lectureId/materials", handleGetMaterials);

  // ============= AI Tutor Chat =============
  app.post("/api/tutor/chat", handleTutorChat);
  app.get("/api/tutor/conversations/:conversationId", handleGetConversation);
  app.delete(
    "/api/tutor/conversations/:conversationId",
    handleClearConversation
  );

  // ============= Study Plan Generation =============
  app.post("/api/study-plan/generate", handleGenerateStudyPlan);
  app.get("/api/study-plan/:planId", handleGetStudyPlan);
  app.put("/api/study-plan/:planId", handleUpdateStudyPlan);

  return app;
}
