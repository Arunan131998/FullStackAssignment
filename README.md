# Lab Slot Booking System

Monorepo scaffold for a full-stack assignment project using React frontend and Node.js microservice-style backend.

## Structure

- `frontend` - React app (Vite)
- `backend/api-gateway` - API gateway proxy
- `backend/services/auth-service` - Auth and user endpoints
- `backend/services/booking-service` - Labs, slots, bookings endpoints
- `docs` - architecture, schema, and API notes

## Quick Start

1. Start MongoDB locally and ensure it's available at `mongodb://127.0.0.1:27017/lab-slot-booking`.
2. `.env` files are already scaffolded for local development. Update `JWT_SECRET` for production-like runs.
3. Install dependencies:
   - `npm install`
   - `npm --prefix frontend install`
   - `npm --prefix backend/api-gateway install`
   - `npm --prefix backend/services/auth-service install`
   - `npm --prefix backend/services/booking-service install`
4. Start all services:
   - `npm run dev`
5. Seed demo users:
   - `npm run seed:users`

## Default Ports

- API Gateway: `4000`
- Auth Service: `4001`
- Booking Service: `4002`
- Frontend (Vite): `5173`

## Features

### Authentication
- ✅ Role-based login (Student/Admin account type selector)
- ✅ Account type validation (prevents role mismatch)
- ✅ Demo credential auto-fill for quick testing
- ✅ JWT token-based session management
- ✅ Session-only auth (cleared on browser close)

### Lab Management (Admin)
- ✅ Create labs with name, location, total seats, equipment tags
- ✅ View all labs and their details
- ✅ Future: Edit and delete labs

### Slot Management (Admin)
- ✅ Create time slots for specific labs
- ✅ Prevent creating past slots (backend + frontend date validation)
- ✅ Prevent overlapping time slots for same lab on same date
- ✅ Validate time range (startTime < endTime)
- ✅ View all slots with lab and capacity info
- ✅ Future: Edit and delete slots

### Student Booking
- ✅ Browse all available lab slots by date and time
- ✅ Book a slot with purpose/reason
- ✅ Validation: Cannot book past slots
- ✅ Validation: Cannot book same slot twice (duplicate prevention)
- ✅ Validation: Cannot have overlapping bookings on same date (time conflict prevention)
- ✅ Validation: Cannot exceed slot capacity
- ✅ View "My Bookings" with all personal bookings and their statuses
- ✅ Cancel pending bookings (status=PENDING only)

### Admin Booking Management
- ✅ View pending booking requests queue
- ✅ Approve pending bookings (transitions to APPROVED status)
- ✅ Reject pending bookings (transitions to REJECTED status)
- ✅ View approved bookings queue
- ✅ Cancel any approved or pending booking if needed
- ✅ Track who approved/rejected and when

### Business Rules
- ✅ No past slot creation or booking
- ✅ No overlapping time slots on same lab/date
- ✅ No student double-booking on same date/time
- ✅ Capacity management (cannot over-book slots)
- ✅ Status workflow enforcement:
  - PENDING → APPROVED/REJECTED or CANCELLED
  - APPROVED → CANCELLED (admin only)
  - Students can only cancel PENDING bookings they own
  - Admins can cancel PENDING or APPROVED bookings

### UI/UX
- ✅ Modern, responsive design (mobile-friendly)
- ✅ Form-level error messages (specific, actionable feedback)
- ✅ Status badges color-coded (PENDING, APPROVED, REJECTED, CANCELLED)
- ✅ Role-based navigation (student vs. admin dashboards)
- ✅ Real-time updates after actions (book, cancel, approve, reject)
- ✅ Clean hero login layout with role selector

## Demo Credentials

- Admin: `admin@example.com` / `Admin@123`
- Student: `student@example.com` / `Student@123`

Both credentials are auto-filled in the login form for quick testing. Select the appropriate account type (Admin/User) before logging in.

## Postman Demo

- Import collection: `docs/postman/LabSlotBooking_Demo.postman_collection.json`
- Import environment: `docs/postman/LabSlotBooking_Local.postman_environment.json`
- Run requests in order to demonstrate login, lab/slot creation, booking, and approval workflow.

## Documentation

- **[API_OVERVIEW.md](docs/API_OVERVIEW.md)** - Complete API endpoint documentation with request/response examples and validation rules
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - System architecture, component interactions, and workflows
- **[DB_SCHEMA.md](docs/DB_SCHEMA.md)** - MongoDB schema definitions, relationships, and constraints

