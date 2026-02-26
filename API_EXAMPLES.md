# StudyAI API Usage Examples

## Quick Start

All endpoints require the dev server running:
```bash
pnpm dev
```

Base URL: `http://localhost:8080/api`

## Examples

### 1. Upload a Lecture

**Request:**
```javascript
async function uploadLecture() {
  const formData = new FormData();
  const fileInput = document.querySelector('input[type="file"]');
  
  formData.append('filename', fileInput.files[0].name);
  formData.append('fileType', 'pdf');
  formData.append('file', fileInput.files[0]);

  const response = await fetch('/api/lectures/upload', {
    method: 'POST',
    body: formData
  });

  const data = await response.json();
  console.log('Lecture uploaded:', data.lectureId);
  return data;
}
```

**Response:**
```json
{
  "lectureId": "lecture_1705411200000",
  "filename": "Introduction to Machine Learning.pdf",
  "status": "processing",
  "uploadedAt": "2024-01-16T10:00:00.000Z"
}
```

### 2. Process Lecture & Generate Materials

**Request:**
```javascript
async function processlecture(lectureId) {
  const response = await fetch(`/api/lectures/${lectureId}/process`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      lectureId,
      materials: ['summary', 'notes', 'flashcards', 'quizzes', 'guide']
    })
  });

  const data = await response.json();
  console.log('Materials generated:', data);
  return data;
}
```

**Response:**
```json
{
  "lectureId": "lecture_1705411200000",
  "status": "completed",
  "materials": {
    "summary": {
      "lectureId": "lecture_1705411200000",
      "title": "Lecture Summary",
      "content": "Machine Learning is...",
      "keyPoints": [
        "Supervised learning uses labeled data",
        "Unsupervised learning finds patterns",
        "Model evaluation is critical"
      ],
      "generatedAt": "2024-01-16T10:05:00.000Z"
    },
    "notes": {
      "lectureId": "lecture_1705411200000",
      "title": "Detailed Study Notes",
      "sections": [
        {
          "heading": "Introduction to ML",
          "content": "Machine Learning enables systems..."
        },
        {
          "heading": "Types of Learning",
          "content": "There are three main types..."
        }
      ],
      "generatedAt": "2024-01-16T10:05:00.000Z"
    },
    "flashcards": {
      "lectureId": "lecture_1705411200000",
      "flashcards": [
        {
          "id": "card_0",
          "lectureId": "lecture_1705411200000",
          "question": "What is supervised learning?",
          "answer": "Supervised learning is learning from labeled training data...",
          "difficulty": "easy",
          "reviewedCount": 0
        }
      ],
      "count": 10,
      "generatedAt": "2024-01-16T10:05:00.000Z"
    },
    "quizzes": {
      "lectureId": "lecture_1705411200000",
      "questions": [
        {
          "id": "q_0",
          "lectureId": "lecture_1705411200000",
          "question": "Which type of learning uses labeled data?",
          "type": "mcq",
          "options": [
            "Supervised learning",
            "Unsupervised learning",
            "Reinforcement learning",
            "Transfer learning"
          ],
          "correctAnswer": "Supervised learning",
          "explanation": "Supervised learning requires labeled training data...",
          "difficulty": "easy"
        }
      ],
      "totalQuestions": 10,
      "generatedAt": "2024-01-16T10:05:00.000Z"
    },
    "guide": {
      "lectureId": "lecture_1705411200000",
      "title": "Complete Study Guide",
      "weeks": [
        {
          "weekNumber": 1,
          "topics": ["ML Basics", "Types of Learning"],
          "learningObjectives": [
            "Understand ML fundamentals",
            "Learn the three types of ML"
          ],
          "activities": [
            "Read chapter 1",
            "Watch intro videos",
            "Complete basic exercises"
          ],
          "estimatedHours": 5
        }
      ],
      "generatedAt": "2024-01-16T10:05:00.000Z"
    }
  },
  "completedAt": "2024-01-16T10:05:00.000Z"
}
```

### 3. Get Lecture Materials

**Request:**
```javascript
async function getMaterials(lectureId) {
  const response = await fetch(`/api/lectures/${lectureId}/materials`);
  const materials = await response.json();
  return materials;
}
```

**Response:** (Same as materials object from step 2)

### 4. Chat with AI Tutor

**Request:**
```javascript
async function tutorChat(message, lectureId, history = []) {
  const response = await fetch('/api/tutor/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message,
      lectureId,
      conversationHistory: history
    })
  });

  const data = await response.json();
  return data;
}

// Usage
const response = await tutorChat(
  'What is the difference between supervised and unsupervised learning?',
  'lecture_1705411200000',
  []
);
```

**Response:**
```json
{
  "message": {
    "id": "msg_1705411500000",
    "role": "assistant",
    "content": "That's an excellent question! Let me explain the key differences...\n\nSupervised Learning:\n- Uses labeled training data where correct answers are provided\n- Examples: Linear Regression, Classification\n- Goal: Predict outcomes based on labeled examples\n\nUnsupervised Learning:\n- Works with unlabeled data\n- Finds hidden patterns and structure\n- Examples: Clustering, Dimensionality Reduction\n\nThe key difference is whether we have labeled training data or not...",
    "lectureId": "lecture_1705411200000",
    "timestamp": "2024-01-16T10:07:00.000Z"
  },
  "conversationId": "conv_1705411200000"
}
```

### 5. Continue Conversation with Tutor

**Request:**
```javascript
// Add previous messages to history
const history = [
  {
    id: "msg_1",
    role: "user",
    content: "What is supervised learning?",
    timestamp: "2024-01-16T10:06:00.000Z"
  },
  {
    id: "msg_2",
    role: "assistant",
    content: "Supervised learning is...",
    timestamp: "2024-01-16T10:06:30.000Z"
  }
];

const response = await tutorChat(
  'Can you give me a real-world example?',
  'lecture_1705411200000',
  history
);
```

**Response:**
```json
{
  "message": {
    "id": "msg_1705411600000",
    "role": "assistant",
    "content": "Great follow-up question! Here's a real-world example:\n\nEmail Spam Detection:\n- Training Data: Thousands of emails labeled as 'spam' or 'not spam'\n- Features: Sender, subject keywords, content patterns\n- Model: Learns to distinguish spam from legitimate emails\n- Result: Can predict if new emails are spam\n\nOther examples:\n- House price prediction (regression)\n- Medical diagnosis (classification)\n- Credit card fraud detection",
    "lectureId": "lecture_1705411200000",
    "timestamp": "2024-01-16T10:08:00.000Z"
  },
  "conversationId": "conv_1705411200000"
}
```

### 6. Generate AI Study Plan

**Request:**
```javascript
async function generateStudyPlan() {
  const response = await fetch('/api/study-plan/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      academicTimetable: [
        {
          day: "Monday",
          time: "09:00",
          type: "lecture",
          subject: "Machine Learning",
          duration: 2
        },
        {
          day: "Tuesday",
          time: "10:00",
          type: "lecture",
          subject: "Data Structures",
          duration: 2
        },
        {
          day: "Friday",
          time: "15:00",
          type: "exam",
          subject: "Calculus",
          duration: 3
        }
      ],
      personalSchedule: [
        {
          day: "Monday",
          time: "14:00",
          type: "free",
          duration: 3
        },
        {
          day: "Wednesday",
          time: "09:00",
          type: "free",
          duration: 4
        },
        {
          day: "Saturday",
          time: "10:00",
          type: "work",
          duration: 6
        }
      ],
      subjects: [
        {
          name: "Machine Learning",
          exams: [
            {
              date: "2024-05-15",
              time: "09:00"
            }
          ],
          uploadedLectures: ["lecture_1705411200000"]
        },
        {
          name: "Data Structures",
          exams: [
            {
              date: "2024-05-20",
              time: "14:00"
            }
          ],
          uploadedLectures: ["lecture_1705411200001"]
        },
        {
          name: "Calculus",
          exams: [
            {
              date: "2024-05-08",
              time: "15:00"
            }
          ],
          uploadedLectures: ["lecture_1705411200002"]
        }
      ]
    })
  });

  const plan = await response.json();
  return plan;
}
```

**Response:**
```json
{
  "planId": "plan_1705411200000",
  "studyBlocks": [
    {
      "id": "block_0",
      "day": "Monday",
      "time": "14:00",
      "duration": 2,
      "subject": "Machine Learning",
      "activities": [
        "Review lecture notes",
        "Complete flashcard review",
        "Practice problems"
      ],
      "priority": "high",
      "materials": ["lecture_1705411200000"]
    },
    {
      "id": "block_1",
      "day": "Wednesday",
      "time": "09:00",
      "duration": 2,
      "subject": "Calculus",
      "activities": [
        "Review lecture notes",
        "Complete flashcard review",
        "Practice problems"
      ],
      "priority": "high",
      "materials": ["lecture_1705411200002"]
    }
  ],
  "totalHoursPerWeek": 12,
  "generatedAt": "2024-01-16T10:10:00.000Z",
  "analytics": {
    "subjectsScheduled": ["Machine Learning", "Data Structures", "Calculus"],
    "daysWithStudy": 4,
    "averageSessionLength": 2
  }
}
```

### 7. Get Study Plan

**Request:**
```javascript
async function getStudyPlan(planId) {
  const response = await fetch(`/api/study-plan/${planId}`);
  const plan = await response.json();
  return plan;
}
```

**Response:** (Same as from step 6)

### 8. Complete Frontend Integration Example

```javascript
import { useState } from 'react';

export default function StudyApp() {
  const [lectureId, setLectureId] = useState(null);
  const [materials, setMaterials] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handle file upload
  const handleUpload = async (file) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('filename', file.name);
      formData.append('fileType', 'pdf');

      const uploadResponse = await fetch('/api/lectures/upload', {
        method: 'POST',
        body: formData
      });

      const uploadData = await uploadResponse.json();
      setLectureId(uploadData.lectureId);

      // Process the lecture
      const processResponse = await fetch(`/api/lectures/${uploadData.lectureId}/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lectureId: uploadData.lectureId,
          materials: ['summary', 'notes', 'flashcards', 'quizzes', 'guide']
        })
      });

      const processData = await processResponse.json();
      setMaterials(processData.materials);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Chat with tutor
  const handleChat = async (message) => {
    const newMessage = { role: 'user', content: message };
    setMessages(prev => [...prev, newMessage]);
    setLoading(true);

    try {
      const response = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          lectureId,
          conversationHistory: messages
        })
      });

      const data = await response.json();
      setMessages(prev => [...prev, data.message]);
    } catch (error) {
      console.error('Chat failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Upload UI */}
      {!lectureId && (
        <input
          type="file"
          onChange={(e) => handleUpload(e.target.files[0])}
        />
      )}

      {/* Display materials */}
      {materials && (
        <div>
          <h2>Summary</h2>
          <p>{materials.summary.content}</p>
          
          <h2>Flashcards</h2>
          {materials.flashcards.flashcards.map(card => (
            <div key={card.id}>
              <p>{card.question}</p>
              <p>{card.answer}</p>
            </div>
          ))}
        </div>
      )}

      {/* Chat interface */}
      {lectureId && (
        <div>
          {messages.map((msg, i) => (
            <div key={i} className={msg.role}>
              {msg.content}
            </div>
          ))}
          <input
            type="text"
            placeholder="Ask the tutor..."
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleChat(e.target.value);
                e.target.value = '';
              }
            }}
            disabled={loading}
          />
        </div>
      )}
    </div>
  );
}
```

## Error Handling

### Example Error Responses

**Missing API Key:**
```json
{
  "error": "Gemini API key not configured"
}
```

**Invalid Lecture ID:**
```json
{
  "error": "Lecture not found"
}
```

**Processing Error:**
```json
{
  "error": "Failed to process lecture"
}
```

## Testing with curl

```bash
# Upload lecture
curl -X POST http://localhost:8080/api/lectures/upload \
  -F "filename=lecture.pdf" \
  -F "fileType=pdf"

# Process lecture
curl -X POST http://localhost:8080/api/lectures/lecture_123/process \
  -H "Content-Type: application/json" \
  -d '{
    "lectureId": "lecture_123",
    "materials": ["summary", "flashcards"]
  }'

# Chat with tutor
curl -X POST http://localhost:8080/api/tutor/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Explain machine learning",
    "lectureId": "lecture_123"
  }'

# Generate study plan
curl -X POST http://localhost:8080/api/study-plan/generate \
  -H "Content-Type: application/json" \
  -d '{
    "academicTimetable": [...],
    "personalSchedule": [...],
    "subjects": [...]
  }'
```

## Next Steps

1. Set up authentication for user accounts
2. Implement persistent database (PostgreSQL)
3. Add file storage (AWS S3 or Cloud Storage)
4. Implement real PDF/PPT text extraction
5. Add progress tracking and analytics
6. Enable offline sync functionality

Happy learning! 🚀
