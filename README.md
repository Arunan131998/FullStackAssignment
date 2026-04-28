# Lab Slot Booking System

**Course:** SE ZG503 Full Stack Application Development
**Student:** Arunan S | **ID** 2025TM93064 | **EMAIL** 2025tm93064@wilp.bits-pilani.ac.in

Full-stack lab slot booking application with a React frontend and Node.js microservice backend (API Gateway + Auth Service + Booking Service).

## What this project includes

- JWT-based authentication with role-aware login (admin/student)
- Admin lab management (create, edit, delete)
- Admin slot management (create, edit, delete) with overlap/date/capacity validation
- Student booking flow (book, view, cancel own pending bookings)
- Admin booking review flow (approve, reject, cancel)
- User management with last-admin deletion safeguard
- Swagger docs via gateway at `/api-docs`

## Tech Stack

- Frontend: React 18, Vite, React Router, Axios
- Backend: Express, Mongoose, JWT, bcrypt
- Database: MongoDB
- Dev tooling: Nodemon, Concurrently

## Monorepo Structure

- `frontend/` - React app
- `backend/api-gateway/` - Gateway and Swagger UI host
- `backend/services/auth-service/` - Auth and user APIs
- `backend/services/booking-service/` - Lab, slot, booking APIs
- `docs/` - API and architecture documentation

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB running locally or remotely

## Environment Setup

1. Copy `.env.example` to `.env` in the project root.
2. Update values as needed:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `AUTH_SERVICE_PORT`
   - `BOOKING_SERVICE_PORT`
   - `API_GATEWAY_PORT`
   - `VITE_API_BASE_URL`

Default local values are configured for:

- API Gateway: `4000`
- Auth Service: `4001`
- Booking Service: `4002`
- Frontend: `5173`

## Install

```bash
npm install
npm --prefix frontend install
npm --prefix backend/api-gateway install
npm --prefix backend/services/auth-service install
npm --prefix backend/services/booking-service install
```

## Run (all services)

```bash
npm run dev
```

This starts:

- Frontend (`http://localhost:5173`)
- API Gateway (`http://localhost:4000`)
- Auth Service (`http://localhost:4001`)
- Booking Service (`http://localhost:4002`)

## Seed Demo Users

```bash
npm run seed:users
```

Demo credentials:

- Admin: `admin@example.com` / `Admin@123`
- Student: `student@example.com` / `Student@123`

## API and Docs

- Swagger UI: `http://localhost:4000/api-docs`
- OpenAPI spec: `docs/openapi.yaml`

## Available Root Commands

- `npm run dev` - start frontend + all backend services
- `npm run dev:frontend` - start frontend only
- `npm run dev:gateway` - start API gateway only
- `npm run dev:auth` - start auth service only
- `npm run dev:booking` - start booking service only
- `npm run seed:users` - seed demo users

## Additional Documentation

- `docs/API_OVERVIEW.md`
- `docs/ARCHITECTURE.md`
- `docs/DB_SCHEMA.md`

