# Architecture

## Overview

Lab Slot Booking System uses a microservice architecture with an API Gateway pattern, MongoDB for persistence, and React-based frontend with sessionStorage authentication.

## Components

### Frontend (React + Vite)
- **Location:** `frontend/`
- **Entry Points:**
  - Registration Page: Name/email/role/password with validation and auto-login
  - Login Page: Role selector with account-type validation
  - Student Dashboard: Browse slots grouped by lab, book slots, view active and history bookings, self-delete account
  - Admin Dashboard: Full lab/slot CRUD (create, inline edit, delete), booking approval workflow, all booking history, user management
- **Authentication:** JWT in sessionStorage + axios request interceptor (attaches token on every request) + 401 response interceptor (auto-redirect to login) + `authReady` gate prevents rendering before token is restored
- **Key Libraries:** React Router, Axios
- **Port:** 5173

### API Gateway
- **Location:** `backend/api-gateway/`
- **Responsibility:** Single entry point for all backend services
- **Routing:**
  - `/auth/*` → Auth Service (port 4001)
  - `/booking/*` → Booking Service (port 4002)
  - `/api-docs` → Swagger UI (served directly from gateway)
- **Port:** 4000

### Auth Service
- **Location:** `backend/services/auth-service/`
- **Responsibility:** User registration, login, JWT generation, profile retrieval, user management
- **Key Features:**
  - Password hashing (bcrypt)
  - JWT token generation and validation
  - User role validation (student/admin)
  - Admin: list all users, delete any user (last-admin guard)
  - Self-delete: authenticated user can delete own account
- **Port:** 4001
- **Endpoints:** `/auth/register`, `/auth/login`, `/auth/me`, `/auth/users`, `/auth/users/:id`

### Booking Service
- **Location:** `backend/services/booking-service/`
- **Responsibility:** Full Lab/Slot/Booking lifecycle management
- **Key Features:**
  - Lab CRUD (create, list, edit, delete — delete blocked if active slots exist)
  - Slot CRUD (create, list, edit, delete — delete blocked if active bookings exist)
  - Slot capacity ≤ lab totalSeats enforced at create and update
  - Slot availability metadata (`approvedCount`, `remainingCapacity`, `isAvailable`) on every GET
  - Booking creation with comprehensive validation (past, duplicate, overlap, full)
  - Booking approval/rejection/cancellation workflow
  - Admin: all bookings history across all statuses
  - Student: own booking history split by active vs past
- **Port:** 4002
- **Endpoints:** `/booking/labs`, `/booking/labs/:id`, `/booking/slots`, `/booking/slots/:id`, `/booking/bookings`, `/booking/bookings/me`, `/booking/bookings/:id/approve|reject|cancel`

### Database (MongoDB)
- **Collections:** User, Lab, Slot, Booking
- **Connection String:** `mongodb://127.0.0.1:27017/lab-slot-booking`
- **Mongoose ODM:** For schema validation and relationships

## Request Flow

```
┌─────────────────────────┐
│   React     Frontend    │  (sessionStorage token)
│   (Port 5173)           │
└───────────┬─────────────┘
            │ HTTP Request
            ↓
┌───────────────────────────────────────────────┐
│   API Gateway        Port: 4000               │
│   (Express proxy)                             │
└───────┬──────────────────────────────┬────────┘
        │ /auth/*                      │ /booking/*
        ↓                              ↓
┌────────────────────┐    ┌──────────────────────────┐
│ Auth Svc   Port 4001    │ Booking Svc   Port 4002 │
│ - Register         │    │ - Labs (CRUD)           │
│ - Login            │    │ - Slots (CRUD)          │
│ - Token Gen        │    │ - Bookings (*)          │
│ - Profile          │    │                         │
└────────┬───────────┘    └──────────────┬───────────┘
         │                              │
         └──────────────┬───────────────┘
                        ↓
               ┌──────────────────────────┐
               │    MongoDB               │
               │ (Collections)            │
               └──────────────────────────┘
```

## Authentication Flow

1. **Login:**
   - Frontend displays role selector (Student/Admin)
   - User enters email and password
   - Frontend validates role matches account type
   - POST `/auth/login` with email, password, and role
   - Auth Service validates credentials and returns JWT token + user object
   - Frontend stores token in sessionStorage

2. **Session Management:**
   - All subsequent requests include `Authorization: Bearer <token>` header
   - Frontend redirects unauthenticated users to login
   - Root path redirects logged-in users to role-appropriate dashboard
   - Session clears when browser closes (sessionStorage)

3. **Role-Based Access:**
   - Admin routes: `/admin-dashboard`
   - Student routes: `/student-dashboard`
   - Protected routes check token and role validity

## Booking Workflow

### Student Perspective
1. Student logs in → Student Dashboard
2. Views available slots (GET `/booking/slots`)
3. Clicks "Book Slot" → POST `/booking/bookings`
4. Booking created with status PENDING
5. Waits for admin approval or cancels (PATCH `/booking/bookings/:id/cancel`)
6. Once APPROVED, booking appears in "Approved Bookings"

### Admin Perspective
1. Admin logs in → Admin Dashboard
2. Creates labs (POST `/booking/labs`) — can also inline-edit or delete labs
3. Creates slots for labs (POST `/booking/slots`) — can also inline-edit or delete slots
4. Views "Pending Booking Requests" queue
5. Approves (PATCH `.../approve`) or rejects (PATCH `.../reject`) each booking
6. Views "Approved Bookings" queue; can cancel any approved booking
7. Views "All Booking History" (every booking across all statuses)
8. Manages registered users (list all, delete any user)

## Validation Layer

### Slot Creation / Edit Validation
- No past slots (date must be today or later)
- Valid time range (`startTime` < `endTime`)
- No overlapping time slots for same lab on same date
- `capacity` ≤ lab `totalSeats`
- On edit: `capacity` ≥ current approved booking count

### Lab Edit / Delete Validation
- Edit: cannot reduce `totalSeats` below any existing active slot's capacity
- Delete: blocked if any active slots exist

### Booking Validation
- Student cannot book past slots
- Student cannot book same slot twice (duplicate prevention)
- Student cannot have time overlaps on same date (prevent double-booking)
- Cannot exceed slot capacity (`approvedCount` ≥ `capacity`)
- Role-based access (students book only, admins approve/manage)

### User Deletion Guard
- Cannot delete the last admin account (system lockout prevention)

## Data Persistence

All models stored in MongoDB with Mongoose schemas:
- **User:** name, email, passwordHash, role, timestamps
- **Lab:** name, location, totalSeats, equipmentTags
- **Slot:** labId (ref), date, startTime, endTime, capacity, isActive
- **Booking:** studentId, slotId (ref), purpose, status, reviewedBy, reviewedAt

## Error Handling

- Frontend: Form-level error display with specific messages
- Backend: Consistent HTTP status codes with descriptive error messages
- Database: Mongoose validation at schema level

## API Documentation

Interactive Swagger UI is available at `http://localhost:4000/api-docs` when the gateway is running.

- Spec file: `docs/openapi.yaml` (OpenAPI 3.0.3)
- All 15 endpoints documented with request/response schemas, security requirements, and error codes
- JWT Bearer auth can be entered directly in the Swagger UI to test protected endpoints

## Deployment Pattern

Monorepo structure allows independent service deployment:
- Frontend can be deployed to static hosting
- Services can be containerized and deployed to any platform
- MongoDB can be managed cloud database or self-hosted
- Gateway provides single URL for all backend endpoints
