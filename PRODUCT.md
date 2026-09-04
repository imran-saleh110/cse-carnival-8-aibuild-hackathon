# Product

<!-- impeccable:product-schema 1 -->

## Platform

adaptive

## Users

CSE students at Ahsanullah University of Science and Technology (AUST). They move between lectures, labs, and seminar halls on a Sunday–Thursday schedule, juggling deadlines, room changes, events, and scattered campus information across group chats and notices.

## Product Purpose

CampusOS keeps a student's entire campus life in one place — schedules, rooms, events, announcements, assignments — and puts an AI agent on top that answers questions and takes actions in real time. Success means a student never has to scroll a group chat to figure out where their next class is.

## Positioning

An AI-powered campus companion that reads live backend data and can both answer cross-source questions ("What's due this week and when is my next free slot?") and take actions ("Book me a room tomorrow 3–5 PM"). The agent handles vague requests, refuses what it shouldn't do, and always reflects the latest data state.

## Operating Context

- Students navigate a Sunday–Thursday academic week with courses spread across 7A (classrooms), 7B (labs), and 7C (seminar halls) floors
- Five interconnected data systems: schedules, rooms (with bookings), events (with registrations), announcements (with priority/expiry), assignments (with deadlines and status)
- AI agent queries may span multiple systems in a single request ("I'm free until 2 — what's happening on campus?")
- Room and event actions must update live data and persist across sessions
- Backend runs on PostgreSQL (Neon) with a full REST API on port 3000

## Capabilities and Constraints

- Full CRUD for all five campus data systems via REST API
- Student registration, login, profile management with JWT (httpOnly cookie) auth
- Room booking and cancellation sub-system
- Event registration and cancellation sub-system
- Course catalog
- AI agent must use tool/function calling to read and write live data
- Agent must handle vague or ambiguous requests by asking clarifying questions
- All responses must reflect the current backend state (no cached/hardcoded data)
- Hackathon deadline: 8:30 PM, September 4, 2026

## Evidence on Hand

- 24 schedule records, 20 rooms, 7 events, 8 announcements, 8 assignments (JSON seed data in `data/`)
- Complete backend API: 8 route groups, 9 PostgreSQL tables, JWT auth, Zod validation (in `CampusOS/backend/`)
- API documentation (`CampusOS/backend/API.md`)
- Data schema reference (`schema/schema.md`)
- Sample AI agent queries for judging (`sample_queries/sample_queries.md`)
- Mobile app scaffold: Expo 57, React 19, React Native 0.86 (in `CampusOS/mobile/`) — currently empty `App.js`

## Brand Commitments

- Product name: CampusOS
- University context: AUST CSE department
- Room numbering follows AUST convention (7A01–7A07 classrooms, 7B01–7B08 labs, 7C01–7C05 seminar halls)

## Product Principles

1. Live data is truth — the agent never guesses when it can query
2. Cross-source reasoning over single-table lookups
3. Action-capable, not just informational
4. Respect ambiguity — ask when unclear, refuse when inappropriate
5. Persistence — every change survives reload and reflects immediately

## Accessibility & Inclusion

No product-specific requirements established yet. Standard React Native accessibility practices apply.
