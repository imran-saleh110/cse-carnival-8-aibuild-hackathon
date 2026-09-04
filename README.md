# CampusOS 🎓

> An intelligent university platform powered by an AI agent that understands and acts on real-time campus data.

---

## 1. Project Overview

**CampusOS** is a unified campus operating platform designed to eliminate scattered university data (schedules, room bookings, events, announcements, and assignment deadlines) and replace it with a single, live source of truth. The project consists of two core components:
1. **Part 1 — The Campus Data Manager**: A robust PostgreSQL-backed REST API and dashboard that manages five interconnected university data systems (Class Schedules, Rooms & Bookings, Events & Registrations, Announcements, and Assignments) with immediate persistence and live state synchronization.
2. **Part 2 — The AI Senior Agent**: A conversational AI persona representing a knowledgeable university senior. Powered by native LLM tool calling (via Groq / OpenAI / Gemini), the agent queries live database state in real time, reasons across multiple data sources, performs safe transactional actions (booking rooms, registering for events), disambiguates vague user requests, and strictly enforces security guardrails against unauthorized modifications.

---

## 2. Tech Stack

- **Backend / Runtime**: Node.js, TypeScript, Express.js
- **Database**: PostgreSQL (Hosted on Neon serverless Postgres)
- **Database Client**: `pg` (Node-Postgres connection pool)
- **LLM Engine & Tool Calling**:
  - **Primary Provider**: [Groq](https://groq.com) (`openai/gpt-oss-120b` / `llama-3.3-70b-versatile`) for ultra-low latency native function calling.
  - **Universal Fallback & Compatibility**: OpenAI (`gpt-4o`, `gpt-4o-mini`) and Google Gemini (`@google/genai` / OpenAI-compatible endpoint).
  - **Deterministic Fail-Safe**: Built-in fallback tool execution engine that continues serving live data even if external LLM APIs experience rate limits or network issues.
- **Frontend / Mobile**: React Native & Expo (`CampusOS/mobile`)
- **Validation & Environment**: Zod, Dotenv

---

## 3. The 5 Core Data Systems

| System | Fields | Supported Capabilities |
|---|---|---|
| **Schedules** | Course code, title, day, start/end time, room, instructor, section | Full CRUD, day & course filtering, timetable lookups |
| **Rooms** | Room number, type (classroom/lab/seminar), capacity, equipment array, floor, status | Full CRUD, equipment filtering, conflict-free booking & cancellation |
| **Events** | Name, description, date, start/end time, venue, organizer, capacity, registered count | Full CRUD, registration management with capacity checks |
| **Announcements** | Title, body, date, priority (high/medium/low), posted by, expiry date | Full CRUD, priority filtering, class relocation/reschedule detection |
| **Assignments** | Course, course title, title, description, assigned date, deadline, platform, status, marks | Full CRUD, pending deadline tracking, submission status |

---

## 4. Setup Instructions

Follow these exact steps to run CampusOS locally:

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### Step 1: Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/CampusOS.git
cd CampusOS
```

### Step 2: Install Backend Dependencies
```bash
cd CampusOS/backend
npm install
```

### Step 3: Configure Environment Variables
Create a `.env` file inside `CampusOS/backend/`:
```bash
cp .env.example .env
```
Populate `.env` with your credentials (see section below).

### Step 4: Run Migrations & Seed the Database (Optional if already seeded)
To initialize the database schema and populate seed records:
```bash
npm run migrate
npm run seed
```

### Step 5: Start the Backend Server
```bash
npm run dev
```
The server will start at `http://localhost:3000`. You can verify it by opening `http://localhost:3000/api/health`.

### Step 6: Verify the AI Agent
Run the automated end-to-end evaluation suite to verify all sample queries against the live database:
```bash
npx ts-node scripts/test-agent-e2e.ts
```

---

## 5. Environment Variables

Create a `.env` file in `CampusOS/backend/.env` with the following keys:

```env
# Server Port
PORT=3000

# PostgreSQL Database Connection URL (Neon Postgres)
DATABASE_URL=postgresql://neondb_owner:YOUR_PASSWORD@ep-summer-moon-ayspw25o-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require

# Node Environment
NODE_ENV=development

# LLM Configuration (Groq, OpenAI, or Gemini)
GROQ_API_KEY=gsk_your_groq_api_key_here
LLM_PROVIDER=groq
LLM_MODEL=openai/gpt-oss-120b

# Optional Alternative Providers:
# OPENAI_API_KEY=sk-your_openai_api_key_here
# GEMINI_API_KEY=your_gemini_api_key_here
```

> **Note**: Never commit your `.env` file or real API keys to GitHub. Use `.env.example` as the template.

---

## 6. How to Use the AI Agent

The AI Agent listens at:
`POST /api/agent/chat`

### Request Format
```json
{
  "message": "When is my next class?"
}
```
Or with conversation history:
```json
{
  "messages": [
    { "role": "user", "content": "Which labs have a projector and can fit at least 30 people?" }
  ]
}
```

### Response Format
```json
{
  "reply": "Here are the computer labs with a projector and at least 30 seats: Room 7B01, 7B02, 7B05, 7B06, 7B07, and 7B08...",
  "toolCallsMade": [
    {
      "name": "search_rooms",
      "args": { "type": "lab", "min_capacity": 30, "equipment": "projector" },
      "result": { "count": 6, "rooms": [...] }
    }
  ]
}
```

### Types of Questions the Agent Handles

1. **Simple Lookups**:
   - *"When is my next class?"*
   - *"What classes do I have on Wednesday?"*
   - *"What assignments do I have due this week?"*
   - *"Show me all high priority announcements."*

2. **Multi-Source Reasoning**:
   - *"I'm free until 2 PM — is there anything on campus I could drop into?"* (Cross-references schedule gaps with live campus events).
   - *"Which labs have a projector and can fit at least 30 people?"* (Combines room type, capacity filtering, and equipment array parsing).

3. **Live Actions & Transactions**:
   - *"Book Room 7A02 tomorrow from 3 PM to 5 PM."* (Checks booking conflicts and scheduled class times before booking).
   - *"Register me for the Guest Lecture on Deep Learning."* (Validates capacity, prevents duplicates, and records registration).
   - *"I need a room for 5 people with a projector, tomorrow between 2 and 4."* (Filters rooms and verifies availability in the specified slot).

4. **Ambiguity Disambiguation**:
   - *"Just book me any room tomorrow afternoon."*
   - The agent detects missing parameters (room, precise time slot, group size) and asks clarifying questions before touching the database.

5. **Security & Guardrails**:
   - *"Delete the CSE321 class schedule."*
   - The agent refuses unauthorized administrative actions (cancelling classes, deleting schedules, modifying marks).

6. **Live Data Synchronization**:
   - When an announcement or class location is edited via Part 1 (e.g. moving CSE321 to Room 304), the agent immediately answers questions using the new live data without requiring an app reload.

---

## 7. API Reference Summary

- `GET /api/health` — Service health check
- `GET /api/schedules` — List schedules (filters: `day`, `course`, `room`, `instructor`)
- `POST /api/schedules` — Create a schedule entry
- `GET /api/rooms` — List rooms (filters: `type`, `min_capacity`, `status`, `floor`)
- `POST /api/rooms/:id/bookings` — Book a room
- `GET /api/events` — List events (filters: `status`, `date`, `venue`)
- `POST /api/events/:id/register` — Register for an event
- `GET /api/announcements` — List notices (filters: `priority`, `status`)
- `GET /api/assignments` — List assignments (filters: `course`, `status`)
- `POST /api/agent/chat` — Unified Senior AI Agent endpoint

---

## 8. License

This project is licensed under the MIT License.
