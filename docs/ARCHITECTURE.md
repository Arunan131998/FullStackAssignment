# Architecture (MVP)

## Components

- React frontend (Vite)
- API Gateway (single entry point)
- Auth service
- Booking service
- MongoDB

## Request Flow

1. Frontend calls API Gateway
2. Gateway routes `/auth/*` to Auth service
3. Gateway routes `/booking/*` to Booking service
4. Services read/write data in MongoDB
