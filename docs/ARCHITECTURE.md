# Architecture

## Overview

Lab Slot Booking System uses a microservice architecture with an API Gateway pattern, MongoDB for persistence, and React-based frontend with sessionStorage authentication.

## Components

### Frontend (React + Vite)
- **Location:** `frontend/`
- **Entry Points:**
  - Login Page: Role selector with account-type dropdown
  - Student Dashboard: Browse available slots, manage bookings
  - Admin Dashboard: Create labs/slots, approve/reject pending bookings
- **Authentication:** JWT tokens stored in sessionStorage (session-only, clears on browser close)
- **Key Libraries:** React Router, Axios for API calls
- **Port:** 5173

### API Gateway
- **Location:** `backend/api-gateway/`
- **Responsibility:** Single entry point for all backend services
- **Routing:**
  - `/auth/*` → Auth Service (port 4001)
  - `/booking/*` → Booking Service (port 4002)
- **Port:** 4000

### Auth Service
- **Location:** `backend/services/auth-service/`
- **Responsibility:** User registration, login, JWT generation, profile retrieval
- **Key Features:**
  - Password hashing (bcrypt)
  - JWT token generation and validation
  - User role validation (student/admin)
- **Port:** 4001
- **Endpoints:** `/auth/register`, `/auth/login`, `/auth/me`

### Booking Service
- **Location:** `backend/services/booking-service/`
- **Responsibility:** Lab management, slot creation, booking operations
- **Key Features:**
  - Lab CRUD operations
  - Slot creation with validation (no past slots, no overlaps)
  - Booking creation with comprehensive validation
  - Booking approval/rejection/cancellation workflow
  - Capacity tracking (approved booking count vs. slot capacity)
- **Port:** 4002
- **Endpoints:** `/booking/labs`, `/booking/slots`, `/booking/bookings`

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
2. Creates labs (POST `/booking/labs`)
3. Creates slots for labs (POST `/booking/slots`)
4. Views "Pending Booking Requests" queue
5. Approves (PATCH `.../approve`) or rejects (PATCH `.../reject`) each booking
6. Views "Approved Bookings" queue
7. Can cancel any approved booking if needed (PATCH `.../cancel`)

## Validation Layer

### Slot Creation Validation
- No past slots (date must be today or later)
- Valid time range (startTime < endTime)
- No overlapping time slots for same lab on same date

### Booking Validation
- Student cannot book past slots
- Student cannot book same slot twice (duplicate prevention)
- Student cannot have time overlaps on same date (prevent double-booking)
- Cannot exceed slot capacity (approved bookings ≥ capacity)
- Role-based access (students can only book, admins can approve/manage)

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

## Deployment Pattern

Monorepo structure allows independent service deployment:
- Frontend can be deployed to static hosting
- Services can be containerized and deployed to any platform
- MongoDB can be managed cloud database or self-hosted
- Gateway provides single URL for all backend endpoints
