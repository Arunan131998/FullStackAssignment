# Lab Slot Booking System

Monorepo scaffold for a full-stack assignment project using React frontend and Node.js microservice-style backend.

## Structure

- `frontend` - React app (Vite)
- `backend/api-gateway` - API gateway proxy
- `backend/services/auth-service` - Auth and user endpoints
- `backend/services/booking-service` - Labs, slots, bookings endpoints
- `docs` - architecture, schema, and API notes

## Quick Start

1. Start MongoDB (pick one):
   - Local MongoDB on `mongodb://127.0.0.1:27017/lab-slot-booking`, or
   - `docker compose up -d`
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

## MongoDB via Docker

`docker compose up -d`

This starts MongoDB on port `27017` with a named volume.

## Demo Credentials

- Admin: `admin@example.com` / `Admin@123`
- Student: `student@example.com` / `Student@123`

## Postman Demo

- Import collection: `docs/postman/LabSlotBooking_Demo.postman_collection.json`
- Import environment: `docs/postman/LabSlotBooking_Local.postman_environment.json`
- Run requests in order to demonstrate login, lab/slot creation, booking, and approval workflow.

