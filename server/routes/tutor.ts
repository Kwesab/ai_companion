import { RequestHandler } from "express";
import { TutorChatResponse, ChatMessage } from "@shared/api";
import { geminiIntegration } from "../lib/geminiIntegration";

// In-memory storage for conversations (replace with database in production)
const conversations: Map<string, ChatMessage[]> = new Map();

export const handleTutorChat: RequestHandler = async (req, res) => {
  try {
    const { message, lectureId, conversationHistory } = req.body;

    if (!message) {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    const conversationId = lectureId || `conv_${Date.now()}`;

    // Get or create conversation history
    let history = conversations.get(conversationId) || [];

    // Add user message to history
    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: "user",
      content: message,
      lectureId,
      timestamp: new Date().toISOString(),
    };

    history.push(userMessage);

    // Generate AI response
    const aiResponse = await generateTutorResponse(
      message,
      lectureId,
      history
    );

    // Add AI response to history
    const assistantMessage: ChatMessage = {
      id: `msg_${Date.now() + 1}`,
      role: "assistant",
      content: aiResponse,
      lectureId,
      timestamp: new Date().toISOString(),
    };

    history.push(assistantMessage);

    // Store updated conversation
    conversations.set(conversationId, history);

    const response: TutorChatResponse = {
      message: assistantMessage,
      conversationId,
    };

    res.json(response);
  } catch (error) {
    console.error("Tutor chat error:", error);
    res.status(500).json({ error: "Failed to generate tutor response" });
  }
};

export const handleGetConversation: RequestHandler = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const conversationId_ = conversationId as string;

    const history = conversations.get(conversationId_);
    if (!history) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }

    res.json({ conversationId: conversationId_, messages: history });
  } catch (error) {
    console.error("Get conversation error:", error);
    res.status(500).json({ error: "Failed to retrieve conversation" });
  }
};

export const handleClearConversation: RequestHandler = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const conversationId_ = conversationId as string;

    conversations.delete(conversationId_);

    res.json({ success: true, message: "Conversation cleared" });
  } catch (error) {
    console.error("Clear conversation error:", error);
    res.status(500).json({ error: "Failed to clear conversation" });
  }
};

// AI response generation using Google Gemini API
async function generateTutorResponse(
  userMessage: string,
  lectureId: string | undefined,
  conversationHistory: ChatMessage[]
): Promise<string> {
  try {
    // TODO: Retrieve actual lecture content from storage based on lectureId
    const lectureContext = lectureId
      ? `Lecture ID: ${lectureId}\nLecture Content: [Retrieved from storage]`
      : "General academic content";

    // Convert conversation history to format expected by Gemini
    const history = conversationHistory
      .slice(-6) // Keep last 6 messages for context
      .map((msg) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content,
      }));

    return await geminiIntegration.generateTutorResponse(
      userMessage,
      lectureContext,
      history.length > 0 ? history : undefined
    );
  } catch (error) {
    console.error("Tutor response generation error:", error);
    // Return fallback response
    return `I'd like to help you with that question! However, the AI tutoring system requires GEMINI_API_KEY to be configured. Please set it in your environment variables to use this feature.\n\nYour question: "${userMessage}"\n\nOnce configured, I'll be able to provide detailed explanations based on your lecture content.`;
  }
}
