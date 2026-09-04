# CampusOS API Reference

Base URL: `http://localhost:3000` — all endpoints are under `/api`.

All POST/PUT bodies are JSON. IDs are the string IDs from the seed data (e.g. `sch-001`, `room-003`, `evt-002`, `ann-001`, `asgn-004`).

## Health

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/health` | Liveness check → `{ status: "ok", timestamp }` |

---

## Schedules `/api/schedules`

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/schedules` | List all. Filters: `course`, `day`, `room`, `instructor` |
| GET | `/api/schedules/:id` | Get one |
| POST | `/api/schedules` | Create |
| PUT | `/api/schedules/:id` | Update (partial) |
| DELETE | `/api/schedules/:id` | Delete |

**Create body:**
```json
{
  "id": "sch-025",
  "course": "CSE 4113",
  "title": "Pattern Recognition",
  "day": "Sunday",
  "start_time": "08:00",
  "end_time": "08:50",
  "room": "7A03",
  "instructor": "TBA",
  "section": "B"
}
```

---

## Rooms `/api/rooms`

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/rooms` | List all (with equipment). Filters: `type`, `status`, `min_capacity`, `floor` |
| GET | `/api/rooms/:id` | Get one (with equipment + bookings) |
| POST | `/api/rooms` | Create |
| PUT | `/api/rooms/:id` | Update (partial) |
| DELETE | `/api/rooms/:id` | Delete (cascades equipment + bookings) |
| POST | `/api/rooms/bookings` | Create a booking (`room_id` in body) |
| PUT | `/api/rooms/bookings/:bookingId` | Update booking |
| DELETE | `/api/rooms/bookings/:bookingId` | Delete booking |

**Create room body:**
```json
{
  "id": "room-021",
  "room_number": "7C06",
  "type": "seminar",
  "capacity": 60,
  "floor": 7,
  "equipment": ["projector", "AC"]
}
```

**Create booking body:**
```json
{
  "booking_id": "bk-004",
  "room_id": "room-003",
  "booked_by": "Test",
  "booking_date": "2026-09-08",
  "start_time": "14:00",
  "end_time": "16:00",
  "purpose": "Study session"
}
```

---

## Events `/api/events`

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/events` | List all. Filters: `status`, `venue`, `organizer`, `date` |
| GET | `/api/events/:id` | Get one (with registrations) |
| POST | `/api/events` | Create |
| PUT | `/api/events/:id` | Update (partial) |
| DELETE | `/api/events/:id` | Delete (cascades registrations) |
| POST | `/api/events/:id/register` | Register student |
| DELETE | `/api/events/:id/register/:studentId` | Unregister student |

**Create event body:**
```json
{
  "id": "evt-008",
  "name": "Test Event",
  "start_date": "2026-09-15",
  "start_time": "10:00",
  "end_time": "12:00",
  "end_date": "2026-09-15",
  "venue": "7C01",
  "organizer": "Test",
  "capacity": 50
}
```

**Register body:** `{ "student_id": "20-40999", "student_name": "Test Student" }`
- 409 if already registered, 400 if the event is full.

---

## Announcements `/api/announcements`

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/announcements` | List all (newest first). Filters: `priority`, `status`, `posted_by` |
| GET | `/api/announcements/:id` | Get one |
| POST | `/api/announcements` | Create |
| PUT | `/api/announcements/:id` | Update (partial) |
| DELETE | `/api/announcements/:id` | Delete |

**Create body:**
```json
{
  "id": "ann-009",
  "title": "Test Notice",
  "body": "Notice body",
  "date": "2026-09-04",
  "priority": "high",
  "posted_by": "Admin",
  "expires_date": "2026-09-30"
}
```

---

## Assignments `/api/assignments`

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/assignments` | List all (by deadline). Filters: `course`, `status` |
| GET | `/api/assignments/:id` | Get one |
| POST | `/api/assignments` | Create |
| PUT | `/api/assignments/:id` | Update (partial) |
| DELETE | `/api/assignments/:id` | Delete |

**Create body:**
```json
{
  "id": "asgn-009",
  "course": "CSE 4113",
  "course_title": "Pattern Recognition",
  "title": "Assignment 2",
  "assigned_date": "2026-09-04",
  "deadline": "2026-09-20",
  "marks": 15
}
```

---

## Auth `/api/auth`

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/login` | Login with email + password → sets httpOnly cookies |
| POST | `/api/auth/refresh` | Rotate refresh token → new access + refresh cookies |
| POST | `/api/auth/logout` | Revoke refresh token → clears cookies |

**Login body:**
```json
{
  "email": "student@example.com",
  "password": "secret123"
}
```
Returns the student object (without password) and sets two cookies:
- `token` — access token (15 min)
- `refreshToken` — refresh token (7 days)

**Refresh:** No body needed. Reads `refreshToken` from cookies, verifies it, deletes the old one, and issues a new pair.

**Logout:** No body needed. Revokes the refresh token from the database and clears both cookies.

**Auth flow:**
1. Register a student via `POST /api/students`
2. Login via `POST /api/auth/login` to get tokens
3. Access protected endpoints (`/api/students/profile`, `PUT /api/students/:id`, `DELETE /api/students/:id`) — the `token` cookie is read automatically
4. When the access token expires, call `POST /api/auth/refresh` to get a new pair
5. Logout via `POST /api/auth/logout` to revoke everything

---

## Students `/api/students`

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/students` | No | List all students |
| GET | `/api/students/profile` | Yes | Get own profile |
| POST | `/api/students` | No | Register a new student |
| PUT | `/api/students/:id` | Yes | Update own account |
| DELETE | `/api/students/:id` | Yes | Delete own account |

**Register body:**
```json
{
  "student_id": "20-40999",
  "student_name": "Imran",
  "email": "imran@example.com",
  "phone": "01712345678",
  "password": "secret123"
}
```
Returns the created student (without password). Does **not** auto-login — call `/api/auth/login` afterwards.

**Update body** (all optional):
```json
{
  "student_name": "Imran Hossain",
  "email": "imran@new.com",
  "phone": "01812345678",
  "password": "newpassword"
}
```
Only the student themselves can update or delete their own account (enforced via the `student_id` in the JWT).

---

## Courses `/api/courses`

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/courses` | List all. Filter: `department` |
| GET | `/api/courses/:courseCode` | Get one |
| POST | `/api/courses` | Create |
| PUT | `/api/courses/:courseCode` | Update (partial) |
| DELETE | `/api/courses/:courseCode` | Delete |

**Create body:**
```json
{
  "course_code": "CSE 4113",
  "course_title": "Pattern Recognition",
  "department": "CSE",
  "credits": 3
}
```

**Update body** (all optional):
```json
{
  "course_title": "Pattern Recognition & ML",
  "credits": 4
}
```

---

## Errors

All errors return JSON: `{ "error": "message" }`

| Status | Meaning |
|--------|---------|
| 400 | Validation failed / bad request |
| 401 | Unauthorized (missing or invalid token) |
| 403 | Forbidden (not your account) |
| 404 | Resource not found |
| 409 | Duplicate ID or already registered |
| 500 | Server error |
