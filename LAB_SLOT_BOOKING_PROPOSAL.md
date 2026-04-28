# Lab Slot Booking System

## 1) Problem Statement
In many colleges, lab slot allocation is handled through spreadsheets, classroom messages, or manual approvals. This causes double-booking, uneven usage, and poor visibility for students and lab admins.

This project builds a full-stack web application where students can view available slots and submit booking requests, while faculty/lab admins can approve, reject, and monitor bookings with conflict prevention.

## 2) Objective
Build a complete working system using React + backend APIs + database, with role-based access and end-to-end integration.

## 3) Users and Roles
- **Student**: browse labs/slots, create booking request, cancel own pending request, view own booking history.
- **Lab Admin/Staff**: create/manage lab resources and slots, approve/reject requests, mark usage status.
- **System Admin (optional in MVP)**: manage users/roles and view system-wide reports.

## 4) Core Features (MVP)
1. **Authentication and Role-based Access**
   - Signup/login (JWT token)
   - Role guards for student/admin routes
2. **Lab and Slot Management**
   - Create/update/delete labs
   - Define slot windows (date, start/end time, capacity, lab)
3. **Booking Flow**
   - Student submits request for a slot
   - Admin approves/rejects request
   - Status lifecycle: `PENDING -> APPROVED/REJECTED -> COMPLETED/CANCELLED`
4. **Conflict and Capacity Validation**
   - Prevent overlapping bookings for same student and timeslot
   - Enforce slot capacity (max seats)
5. **Dashboard and Search**
   - Student dashboard: upcoming and past bookings
   - Admin dashboard: pending approvals, utilization summary
   - Filters by date, lab, and status

## 5) Suggested Technical Stack
- **Frontend**: React + React Router + Axios + simple state management (Context or Redux Toolkit)
- **Backend**: Node.js + Express (microservice-style split)
- **Database**: MongoDB (Mongoose)
- **API Docs**: Postman collection or Swagger

## 6) Microservice-Oriented Backend (Simple)
- **Auth Service**
  - user registration/login
  - token generation/validation
- **Booking Service**
  - labs, slots, bookings, approval workflow

> Optional: add API Gateway route aggregation if time permits. Not mandatory for MVP.

## 7) API Outline (Minimum)
- `POST /auth/register`
- `POST /auth/login`
- `GET /labs`
- `POST /labs` (admin)
- `PUT /labs/:id` (admin)
- `DELETE /labs/:id` (admin)
- `GET /slots?date=&labId=`
- `POST /slots` (admin)
- `POST /bookings` (student)
- `GET /bookings/me` (student)
- `GET /bookings?status=` (admin)
- `PATCH /bookings/:id/approve` (admin)
- `PATCH /bookings/:id/reject` (admin)
- `PATCH /bookings/:id/cancel` (student/admin)

## 8) Data Model (Minimal)
- **User**: `id, name, email, passwordHash, role, createdAt`
- **Lab**: `id, name, location, totalSeats, equipmentTags[]`
- **Slot**: `id, labId, date, startTime, endTime, capacity, isActive`
- **Booking**: `id, studentId, slotId, purpose, status, reviewedBy, reviewedAt, createdAt`

## 9) UI Pages (MVP)
- Login/Register
- Student: Browse Slots, My Bookings
- Admin: Labs Management, Slot Management, Booking Approval Queue

## 10) Validation & Quality Checklist
- Input validation on all write APIs
- Proper HTTP status codes and error responses
- Protected routes on frontend and backend
- Duplicate/overlap booking prevention tested
- README setup steps + API documentation included

## 11) Demo Plan (Video Flow)
1. Login as admin and create lab + slots
2. Login as student and request a slot
3. Login as admin and approve request
4. Show student dashboard with approved slot
5. Show one rejection/conflict scenario

## 12) Scope Control (to finish on time)
- Keep notifications, analytics charts, and advanced reports out of MVP
- Focus on correctness of booking workflow and integration
