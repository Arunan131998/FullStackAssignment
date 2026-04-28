# API Overview

Base URL through gateway: `http://localhost:4000`

## Auth

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

## Booking

- `GET /booking/labs`
- `POST /booking/labs` (admin)
- `GET /booking/slots`
- `POST /booking/slots` (admin)
- `POST /booking/bookings` (student)
- `GET /booking/bookings/me` (student)
- `GET /booking/bookings` (admin)
- `PATCH /booking/bookings/:id/approve` (admin)
- `PATCH /booking/bookings/:id/reject` (admin)
