/**
 * Google Gemini 1.5 Pro Integration
 * Handles all AI-powered content generation for StudyAI
 *
 * Setup:
 * 1. Get API key from https://ai.google.dev/
 * 2. Set GEMINI_API_KEY environment variable
 * 3. Install: npm install @google/generative-ai
 */

// Types for Gemini API responses
export interface GeminiGenerationOptions {
  temperature?: number;
  topK?: number;
  topP?: number;
  maxOutputTokens?: number;
}

export interface SummaryGenerationRequest {
  lectureTitle: string;
  lectureContent: string;
  options?: GeminiGenerationOptions;
}

export interface NotesGenerationRequest {
  lectureTitle: string;
  lectureContent: string;
  options?: GeminiGenerationOptions;
}

export interface FlashcardsGenerationRequest {
  lectureTitle: string;
  lectureContent: string;
  count?: number;
  options?: GeminiGenerationOptions;
}

export interface QuizzesGenerationRequest {
  lectureTitle: string;
  lectureContent: string;
  questionCount?: number;
  types?: ("mcq" | "truefalse" | "shortanswer")[];
  options?: GeminiGenerationOptions;
}

export interface StudyGuideGenerationRequest {
  lectureTitle: string;
  lectureContent: string;
  weeks?: number;
  options?: GeminiGenerationOptions;
}

class GeminiIntegration {
  private apiKey: string;
  private baseUrl = "https://generativelanguage.googleapis.com/v1beta/models";
  private model = "gemini-1.5-pro-latest";

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || "";
    if (!this.apiKey) {
      console.warn(
        "GEMINI_API_KEY not set. AI features will be disabled. Set it via environment variables."
      );
    }
  }

  /**
   * Generate a concise summary from lecture content
   */
  async generateSummary(
    request: SummaryGenerationRequest
  ): Promise<{
    title: string;
    content: string;
    keyPoints: string[];
  }> {
    const prompt = `You are an expert educator. Analyze the following lecture and create a concise, well-structured summary.

Lecture Title: ${request.lectureTitle}

Lecture Content:
${request.lectureContent}

Please provide:
1. A clear, concise summary (2-3 paragraphs)
2. 5-7 key points in bullet format

Format your response as JSON with keys: "summary" (string), "keyPoints" (array of strings)`;

    const response = await this.callGeminiAPI(prompt, request.options);
    return this.parseJSONResponse(response);
  }

  /**
   * Generate detailed study notes with sections
   */
  async generateNotes(
    request: NotesGenerationRequest
  ): Promise<{
    sections: Array<{ heading: string; content: string }>;
  }> {
    const prompt = `You are an expert educator. Create detailed, well-organized study notes from the following lecture content.

Lecture Title: ${request.lectureTitle}

Lecture Content:
${request.lectureContent}

Create detailed notes with 4-6 main sections. Each section should have:
- A clear heading
- Detailed explanation
- Examples where relevant

Format your response as JSON with key "sections" containing an array of objects with "heading" and "content" keys.`;

    const response = await this.callGeminiAPI(prompt, request.options);
    return this.parseJSONResponse(response);
  }

  /**
   * Generate flashcards from lecture content
   */
  async generateFlashcards(
    request: FlashcardsGenerationRequest
  ): Promise<
    Array<{
      question: string;
      answer: string;
      difficulty: "easy" | "medium" | "hard";
    }>
  > {
    const count = request.count || 10;
    const prompt = `You are an expert educator. Create ${count} high-quality flashcards from the following lecture content.

Lecture Title: ${request.lectureTitle}

Lecture Content:
${request.lectureContent}

For each flashcard:
- Create a clear, concise question
- Provide a comprehensive answer
- Rate difficulty (easy, medium, hard)
- Mix conceptual questions with specific facts

Format your response as JSON with key "flashcards" containing an array of objects with keys: "question", "answer", "difficulty"`;

    const response = await this.callGeminiAPI(prompt, request.options);
    return this.parseJSONResponse(response);
  }

  /**
   * Generate exam-style quiz questions
   */
  async generateQuizzes(
    request: QuizzesGenerationRequest
  ): Promise<
    Array<{
      question: string;
      type: "mcq" | "truefalse" | "shortanswer";
      options?: string[];
      correctAnswer: string;
      explanation: string;
      difficulty: "easy" | "medium" | "hard";
    }>
  > {
    const questionCount = request.questionCount || 10;
    const types = request.types || ["mcq", "truefalse", "shortanswer"];
    const prompt = `You are an expert exam creator. Create ${questionCount} exam-style questions from the following lecture content.

Lecture Title: ${request.lectureTitle}

Lecture Content:
${request.lectureContent}

Question Types to include: ${types.join(", ")}

For each question:
- Create a clear, exam-appropriate question
- If MCQ: provide 4 plausible options (1 correct, 3 distractors)
- Provide the correct answer
- Provide a detailed explanation
- Rate difficulty (easy, medium, hard)
- Ensure questions test understanding, not just memorization

Format your response as JSON with key "questions" containing an array of objects with keys: "question", "type", "options" (only for MCQ), "correctAnswer", "explanation", "difficulty"`;

    const response = await this.callGeminiAPI(prompt, request.options);
    return this.parseJSONResponse(response);
  }

  /**
   * Generate a complete self-learning study guide
   */
  async generateStudyGuide(
    request: StudyGuideGenerationRequest
  ): Promise<{
    weeks: Array<{
      weekNumber: number;
      topics: string[];
      learningObjectives: string[];
      activities: string[];
      estimatedHours: number;
    }>;
  }> {
    const weeks = request.weeks || 4;
    const prompt = `You are an expert curriculum designer. Create a ${weeks}-week self-learning study guide for the following lecture content.

Lecture Title: ${request.lectureTitle}

Lecture Content:
${request.lectureContent}

For each week, provide:
- Key topics to cover
- 3-5 learning objectives
- Specific activities (reading, practice, reviews, projects)
- Estimated study hours

Structure the learning progressively from basics to advanced concepts.

Format your response as JSON with key "weeks" containing an array of objects with keys: "weekNumber", "topics" (array), "learningObjectives" (array), "activities" (array), "estimatedHours"`;

    const response = await this.callGeminiAPI(prompt, request.options);
    return this.parseJSONResponse(response);
  }

  /**
   * Generate AI tutor response based on user question and context
   */
  async generateTutorResponse(
    question: string,
    lectureContext: string,
    conversationHistory?: Array<{ role: string; content: string }>
  ): Promise<string> {
    let prompt = `You are an expert, patient tutor helping a student understand lecture material.

Lecture Context:
${lectureContext}

Student Question: ${question}`;

    if (conversationHistory && conversationHistory.length > 0) {
      prompt += "\n\nPrevious Conversation:\n";
      conversationHistory.forEach((msg) => {
        prompt += `${msg.role === "user" ? "Student" : "Tutor"}: ${msg.content}\n`;
      });
    }

    prompt += `

Provide:
1. A clear, understanding answer to the question
2. An explanation of why this is important
3. A follow-up question or example to deepen understanding
4. Additional resources or concepts to explore

Be encouraging and patient. Adjust complexity based on the student's apparent level.`;

    return await this.callGeminiAPI(prompt);
  }

  /**
   * Call the Gemini API
   */
  private async callGeminiAPI(
    prompt: string,
    options: GeminiGenerationOptions = {}
  ): Promise<string> {
    if (!this.apiKey) {
      console.error(
        "GEMINI_API_KEY not configured. Please set it in environment variables."
      );
      throw new Error("Gemini API key not configured");
    }

    try {
      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: options.temperature ?? 0.7,
          topK: options.topK ?? 40,
          topP: options.topP ?? 0.95,
          maxOutputTokens: options.maxOutputTokens ?? 2048,
        },
      };

      const response = await fetch(
        `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error("Gemini API error:", error);
        throw new Error(`Gemini API error: ${error.error.message}`);
      }

      const data = await response.json();

      if (
        data.candidates &&
        data.candidates[0] &&
        data.candidates[0].content &&
        data.candidates[0].content.parts &&
        data.candidates[0].content.parts[0]
      ) {
        return data.candidates[0].content.parts[0].text;
      }

      throw new Error("Invalid response format from Gemini API");
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      throw error;
    }
  }

  /**
   * Parse JSON response from Gemini
   */
  private parseJSONResponse(response: string): any {
    // Try to extract JSON from the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.error("Failed to parse JSON response:", e);
        return { raw: response };
      }
    }
    return { raw: response };
  }
}

// Export singleton instance
export const geminiIntegration = new GeminiIntegration();

export default GeminiIntegration;
