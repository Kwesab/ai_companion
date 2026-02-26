import { RequestHandler } from "express";
import { StudyPlanResponse, StudyBlock, TimeTableEntry } from "@shared/api";

// In-memory storage for study plans (replace with database in production)
const studyPlans: Map<string, StudyPlanResponse> = new Map();

export const handleGenerateStudyPlan: RequestHandler = async (req, res) => {
  try {
    const { academicTimetable, personalSchedule, subjects } = req.body;

    if (!academicTimetable || !personalSchedule || !subjects) {
      res.status(400).json({
        error: "Missing required fields: academicTimetable, personalSchedule, subjects",
      });
      return;
    }

    // Generate study plan
    const studyPlan = generateOptimalStudyPlan(
      academicTimetable,
      personalSchedule,
      subjects
    );

    // Store the plan
    studyPlans.set(studyPlan.planId, studyPlan);

    res.json(studyPlan);
  } catch (error) {
    console.error("Study plan generation error:", error);
    res.status(500).json({ error: "Failed to generate study plan" });
  }
};

export const handleGetStudyPlan: RequestHandler = async (req, res) => {
  try {
    const { planId } = req.params;
    const planId_ = planId as string;

    const plan = studyPlans.get(planId_);
    if (!plan) {
      res.status(404).json({ error: "Study plan not found" });
      return;
    }

    res.json(plan);
  } catch (error) {
    console.error("Get study plan error:", error);
    res.status(500).json({ error: "Failed to retrieve study plan" });
  }
};

export const handleUpdateStudyPlan: RequestHandler = async (req, res) => {
  try {
    const { planId } = req.params;
    const planId_ = planId as string;
    const { studyBlocks } = req.body;

    const plan = studyPlans.get(planId_);
    if (!plan) {
      res.status(404).json({ error: "Study plan not found" });
      return;
    }

    plan.studyBlocks = studyBlocks;
    studyPlans.set(planId_, plan);

    res.json(plan);
  } catch (error) {
    console.error("Update study plan error:", error);
    res.status(500).json({ error: "Failed to update study plan" });
  }
};

// Study plan generation algorithm
function generateOptimalStudyPlan(
  academicTimetable: TimeTableEntry[],
  personalSchedule: TimeTableEntry[],
  subjects: Array<{
    name: string;
    exams: Array<{ date: string; time: string }>;
    uploadedLectures: string[];
  }>
): StudyPlanResponse {
  const planId = `plan_${Date.now()}`;
  const studyBlocks: StudyBlock[] = [];

  // Find available time slots
  const availableSlots = findAvailableTimeSlots(
    academicTimetable,
    personalSchedule
  );

  // Allocate study sessions for each subject
  let sessionId = 0;
  const hoursPerSubject = 3; // Default hours per week per subject

  subjects.forEach((subject) => {
    // Find exam deadlines for this subject
    const examDates = subject.exams.map((e) => new Date(e.date));
    const daysUntilExam = Math.max(
      ...examDates.map((d) => {
        const today = new Date();
        return Math.ceil((d.getTime() - today.getTime()) / (1000 * 3600 * 24));
      })
    );

    // Priority is based on how soon the exam is
    let priority: "high" | "medium" | "low" = "medium";
    if (daysUntilExam <= 7) {
      priority = "high";
    } else if (daysUntilExam > 30) {
      priority = "low";
    }

    // Create study blocks for this subject
    const blocksNeeded = Math.ceil(hoursPerSubject / 2); // 2-hour blocks

    for (let i = 0; i < blocksNeeded && availableSlots.length > 0; i++) {
      const slot = availableSlots[i % availableSlots.length];

      studyBlocks.push({
        id: `block_${sessionId++}`,
        day: slot.day,
        time: slot.time,
        duration: 2, // 2-hour study blocks
        subject: subject.name,
        activities: [
          "Review lecture notes",
          "Complete flashcard review",
          "Practice problems",
        ],
        priority,
        materials: subject.uploadedLectures,
      });
    }
  });

  // Calculate analytics
  const daysWithStudy = new Set(studyBlocks.map((b) => b.day)).size;
  const totalHours = studyBlocks.reduce((sum, b) => sum + b.duration, 0);
  const avgSessionLength =
    studyBlocks.length > 0 ? totalHours / studyBlocks.length : 0;

  return {
    planId,
    studyBlocks,
    totalHoursPerWeek: totalHours,
    generatedAt: new Date().toISOString(),
    analytics: {
      subjectsScheduled: subjects.map((s) => s.name),
      daysWithStudy,
      averageSessionLength: Math.round(avgSessionLength * 10) / 10,
    },
  };
}

// Find available time slots in the schedule
function findAvailableTimeSlots(
  academicTimetable: TimeTableEntry[],
  personalSchedule: TimeTableEntry[]
): Array<{ day: string; time: string }> {
  const availableSlots: Array<{ day: string; time: string }> = [];

  // Define study hours (e.g., 9 AM to 10 PM)
  const studyHours = [9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20, 21];
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Combine all occupied time slots
  const occupiedSlots = new Set<string>();

  academicTimetable.forEach((entry) => {
    const startHour = parseInt(entry.time.split(":")[0]);
    for (let i = 0; i < entry.duration; i++) {
      occupiedSlots.add(`${entry.day}_${startHour + i}`);
    }
  });

  personalSchedule.forEach((entry) => {
    const startHour = parseInt(entry.time.split(":")[0]);
    for (let i = 0; i < entry.duration; i++) {
      occupiedSlots.add(`${entry.day}_${startHour + i}`);
    }
  });

  // Find available slots
  daysOfWeek.forEach((day) => {
    studyHours.forEach((hour) => {
      if (!occupiedSlots.has(`${day}_${hour}`)) {
        availableSlots.push({
          day,
          time: `${hour.toString().padStart(2, "0")}:00`,
        });
      }
    });
  });

  return availableSlots;
}
