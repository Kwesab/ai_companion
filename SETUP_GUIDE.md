# AI Student Companion - Complete Setup Guide

Welcome to **StudyAI** - your AI-powered learning companion for university success!

## Overview

StudyAI is a full-stack web application that helps students:
- Upload lecture slides (PDF/PowerPoint)
- Generate AI summaries, study notes, flashcards, quizzes, and study guides
- Create personalized study plans based on their timetable
- Chat with an AI tutor about lecture content
- Study offline with cached materials

## Architecture

### Frontend
- **Framework**: React 18 + TypeScript
- **Routing**: React Router 6
- **Styling**: TailwindCSS 3
- **State Management**: React Query
- **Offline Storage**: IndexedDB
- **UI Components**: Radix UI + Lucide Icons

### Backend
- **Server**: Express.js
- **Language**: TypeScript
- **AI Integration**: Google Gemini 1.5 Pro API
- **API Routes**: RESTful endpoints with JSON

## Prerequisites

- Node.js 18+ and pnpm
- Google Account (for Gemini API)
- Modern web browser

## Setup Instructions

### Step 1: Get Google Gemini API Key

1. Visit [Google AI Studio](https://ai.google.dev/)
2. Click "Get API key"
3. Create a new API key (free tier available)
4. Copy your API key

### Step 2: Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Google Gemini API
GEMINI_API_KEY=your_api_key_here

# Server configuration
PORT=8080
NODE_ENV=development

# Optional
PING_MESSAGE=pong
```

### Step 3: Install Dependencies

```bash
pnpm install
```

### Step 4: Run Development Server

```bash
pnpm dev
```

The app will be available at `http://localhost:8080`

### Step 5: Build for Production

```bash
pnpm build
```

### Step 6: Start Production Server

```bash
pnpm start
```

## Project Structure

```
client/
├── pages/
│   ├── Index.tsx           # Homepage
│   ├── Login.tsx           # Login page
│   ├── Signup.tsx          # Signup page
│   ├── Dashboard.tsx       # Main dashboard
│   ├── LectureUpload.tsx   # Lecture upload page
│   ├── StudyMaterials.tsx  # Study materials viewer
│   ├── AITutor.tsx         # AI tutor chat
│   ├── StudyPlan.tsx       # Study plan generator
│   └── NotFound.tsx        # 404 page
├── components/
│   └── ui/                 # Radix UI components
├── lib/
│   ├── utils.ts            # Utility functions
│   └── offlineCache.ts     # IndexedDB offline caching
├── hooks/
│   ├── use-mobile.tsx      # Mobile detection hook
│   └── use-toast.ts        # Toast notifications
├── App.tsx                 # Main app with routing
└── global.css              # Global styles & theme

server/
├── routes/
│   ├── demo.ts             # Demo endpoint
│   ├── lectures.ts         # Lecture management
│   ├── tutor.ts            # AI tutor chat
│   └── studyplan.ts        # Study plan generation
├── lib/
│   └── geminiIntegration.ts # Google Gemini API integration
└── index.ts                # Express server setup

shared/
└── api.ts                  # Shared types and interfaces
```

## API Endpoints

### Lectures

**Upload Lecture**
```
POST /api/lectures/upload
Content-Type: multipart/form-data

{
  "filename": "Lecture.pdf",
  "fileType": "pdf"
}
```

**Process Lecture (Generate Materials)**
```
POST /api/lectures/{lectureId}/process
{
  "lectureId": "lecture_123",
  "materials": ["summary", "notes", "flashcards", "quizzes", "guide"]
}
```

**Get Lecture**
```
GET /api/lectures/{lectureId}
```

**Get Materials**
```
GET /api/lectures/{lectureId}/materials
```

### AI Tutor

**Chat with AI Tutor**
```
POST /api/tutor/chat
{
  "message": "What is machine learning?",
  "lectureId": "lecture_123",
  "conversationHistory": []
}
```

**Get Conversation**
```
GET /api/tutor/conversations/{conversationId}
```

**Clear Conversation**
```
DELETE /api/tutor/conversations/{conversationId}
```

### Study Plan

**Generate Study Plan**
```
POST /api/study-plan/generate
{
  "academicTimetable": [
    {
      "day": "Monday",
      "time": "09:00",
      "type": "lecture",
      "subject": "Machine Learning",
      "duration": 2
    }
  ],
  "personalSchedule": [
    {
      "day": "Monday",
      "time": "14:00",
      "type": "free",
      "duration": 3
    }
  ],
  "subjects": [
    {
      "name": "Machine Learning",
      "exams": [
        {
          "date": "2024-05-15",
          "time": "09:00"
        }
      ],
      "uploadedLectures": ["lecture_123"]
    }
  ]
}
```

**Get Study Plan**
```
GET /api/study-plan/{planId}
```

**Update Study Plan**
```
PUT /api/study-plan/{planId}
{
  "studyBlocks": [...]
}
```

## Features

### 1. Lecture Upload & Processing
- Upload PDF or PowerPoint presentations
- Automatic text extraction (TODO: implement)
- AI-powered content analysis using Gemini

### 2. Study Materials Generation
- **Summaries**: Concise overview of key points
- **Study Notes**: Detailed, structured notes
- **Flashcards**: Question-answer pairs for review
- **Quizzes**: MCQ, True/False, and short answer questions
- **Study Guides**: Week-by-week learning plan

### 3. AI Tutor Chat
- Real-time Q&A about lecture content
- Context-aware responses using Gemini
- Conversation history tracking
- Suggested follow-up questions

### 4. Personalized Study Plans
- Upload academic timetable
- Add personal schedule (work, sports, free time)
- AI generates optimized study blocks
- Considers exam deadlines and subject priorities

### 5. Offline Support
- IndexedDB caching of all materials
- Work without internet connection
- Automatic sync when online
- Local storage of flashcards and quizzes

## Customization

### Update Theme Colors

Edit `client/global.css` to change the color scheme:

```css
:root {
  --primary: 263 80% 50%;      /* Main brand color */
  --secondary: 218 92% 50%;    /* Secondary accent */
  --accent: 4 90% 58%;         /* Call-to-action color */
  /* ... other colors ... */
}
```

### Modify Tailwind Configuration

Edit `tailwind.config.ts` to customize design tokens:

```ts
export default {
  theme: {
    extend: {
      colors: {
        primary: "hsl(var(--primary))",
        // ...
      },
    },
  },
};
```

## Deployment

### Deploy to Netlify

1. Push code to GitHub
2. Connect repository to Netlify
3. Set environment variables in Netlify dashboard
4. Deploy automatically on push

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Set `GEMINI_API_KEY` in Environment Variables
4. Deploy

### Self-Hosted (VPS/Server)

```bash
# Build
pnpm build

# Start
pnpm start
```

Use PM2 or systemd for process management.

## Database Integration (TODO)

Currently uses in-memory storage. To add persistent storage:

1. **PostgreSQL Setup**
   ```sql
   CREATE TABLE lectures (
     id SERIAL PRIMARY KEY,
     user_id INT NOT NULL,
     filename VARCHAR(255),
     status VARCHAR(50),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE study_materials (
     id SERIAL PRIMARY KEY,
     lecture_id INT NOT NULL,
     type VARCHAR(50),
     content TEXT,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (lecture_id) REFERENCES lectures(id)
   );
   ```

2. **Connect in server/routes**
   ```ts
   import { Pool } from 'pg';
   const pool = new Pool();
   ```

## Authentication (TODO)

Implement JWT-based authentication:

1. Hash passwords using bcrypt
2. Generate JWT tokens on login
3. Validate tokens on protected routes
4. Store user sessions in database

## File Upload Handling (TODO)

Implement file storage:

```ts
// Option 1: AWS S3
import AWS from 'aws-sdk';

// Option 2: Local storage
import multer from 'multer';

// Option 3: Cloud storage
// Cloudinary, Google Cloud Storage, etc.
```

## Testing

```bash
# Run unit tests
pnpm test

# Run with coverage
pnpm test --coverage
```

## Troubleshooting

### "GEMINI_API_KEY not set"
- Make sure `.env` file exists in root directory
- Verify API key is correct
- Restart dev server after adding/changing `.env`

### "Failed to fetch lecture materials"
- Check API key is valid
- Verify Gemini API is enabled in Google Cloud
- Check browser console for detailed errors
- Ensure network request headers are correct

### Offline mode not working
- Check if browser supports IndexedDB
- Clear browser cache and reload
- Verify data was cached before going offline

### Build fails
- Clear `node_modules` and reinstall: `pnpm install`
- Clear Vite cache: `rm -rf dist .vite`
- Check Node.js version: `node --version` (need 18+)

## Performance Optimization

- Enable gzip compression on server
- Use CDN for static assets
- Lazy load routes with React.lazy()
- Optimize images and PDFs
- Cache API responses with React Query

## Security Notes

- Never commit `.env` file to version control
- Validate all user inputs on server
- Use HTTPS in production
- Implement rate limiting on API endpoints
- Sanitize HTML in generated content
- Use CORS appropriately
- Implement CSRF protection

## Future Enhancements

- [ ] User authentication & profiles
- [ ] Persistent database (PostgreSQL)
- [ ] File storage (AWS S3/Cloud Storage)
- [ ] Weak topic tracking & recommendations
- [ ] Collaborative study groups
- [ ] Progress analytics & reporting
- [ ] Mobile app (React Native)
- [ ] Video lecture support
- [ ] Integration with calendar apps
- [ ] Advanced search and filtering

## Support & Feedback

- GitHub Issues: Report bugs and feature requests
- Documentation: Check AGENTS.md for framework details
- API Documentation: See shared/api.ts for all types

## License

MIT License - See LICENSE file for details

## Resources

- [Google Gemini API Docs](https://ai.google.dev/docs)
- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [TailwindCSS Docs](https://tailwindcss.com)
- [React Router Guide](https://reactrouter.com)

---

**Happy Learning! 🚀**

For questions or issues, check the GitHub repository or contact the development team.
