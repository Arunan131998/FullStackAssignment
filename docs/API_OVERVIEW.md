# API Overview

Base URL through gateway: `http://localhost:4000`

## Authentication Endpoints

### POST /auth/register
Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass@123",
  "role": "student"
}
```

**Response (200):**
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "65e1a2b3c4d5e6f7g8h9i0j1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

**Error (400):** Duplicate email or invalid role

---

### POST /auth/login
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "student@example.com",
  "password": "Student@123",
  "role": "student"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "65e1a2b3c4d5e6f7g8h9i0j1",
    "email": "student@example.com",
    "role": "student",
    "name": "Demo Student"
  }
}
```

**Errors:**
- `401 Unauthorized` - Invalid credentials
- `400 Bad Request` - Role mismatch (account type doesn't match login role)

---

### GET /auth/me
Retrieve authenticated user profile.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "_id": "65e1a2b3c4d5e6f7g8h9i0j1",
  "email": "student@example.com",
  "role": "student",
  "name": "Demo Student"
}
```

---

## Lab Management Endpoints

### GET /booking/labs
List all available labs.

**Query Parameters:**
- `page` (optional): Page number for pagination
- `limit` (optional): Items per page

**Response (200):**
```json
[
  {
    "_id": "65e1a2b3c4d5e6f7g8h9i0j2",
    "name": "Computer Lab A",
    "location": "Building 3, Floor 2",
    "totalSeats": 30,
    "equipmentTags": ["Desktop", "GPU"]
  },
  {
    "_id": "65e1a2b3c4d5e6f7g8h9i0j3",
    "name": "Robotics Lab",
    "location": "Building 5, Floor 1",
    "totalSeats": 20,
    "equipmentTags": ["Robots", "Sensors"]
  }
]
```

---

### POST /booking/labs
Create a new lab. **Admin only.**

**Headers:** `Authorization: Bearer <admin-token>`

**Request Body:**
```json
{
  "name": "New Lab",
  "location": "Building 4, Floor 3",
  "totalSeats": 25,
  "equipmentTags": ["Laptop", "Projector"]
}
```

**Response (201):**
```json
{
  "_id": "65e1a2b3c4d5e6f7g8h9i0j4",
  "name": "New Lab",
  "location": "Building 4, Floor 3",
  "totalSeats": 25,
  "equipmentTags": ["Laptop", "Projector"]
}
```

**Errors:**
- `401 Unauthorized` - No/invalid token
- `403 Forbidden` - User is not an admin

---

## Slot Management Endpoints

### GET /booking/slots
List all available slots with optional filters.

**Query Parameters:**
- `labId` (optional): Filter by lab ID
- `date` (optional): Filter by date (YYYY-MM-DD)
- `includeExpired` (optional): Include past slots (default: false)

**Response (200):**
```json
[
  {
    "_id": "65e1a2b3c4d5e6f7g8h9i0j5",
    "labId": {
      "_id": "65e1a2b3c4d5e6f7g8h9i0j2",
      "name": "Computer Lab A"
    },
    "date": "2026-05-01",
    "startTime": "10:00",
    "endTime": "11:30",
    "capacity": 20,
    "isActive": true,
    "approvedCount": 5
  }
]
```

---

### POST /booking/slots
Create a new slot for a lab. **Admin only.**

**Validation Rules:**
- Slot date must be today or later (no past slots)
- startTime must be < endTime
- Time range must not overlap with existing slots for the same lab on same date

**Headers:** `Authorization: Bearer <admin-token>`

**Request Body:**
```json
{
  "labId": "65e1a2b3c4d5e6f7g8h9i0j2",
  "date": "2026-05-01",
  "startTime": "14:00",
  "endTime": "15:30",
  "capacity": 25
}
```

**Response (201):**
```json
{
  "_id": "65e1a2b3c4d5e6f7g8h9i0j6",
  "labId": "65e1a2b3c4d5e6f7g8h9i0j2",
  "date": "2026-05-01",
  "startTime": "14:00",
  "endTime": "15:30",
  "capacity": 25,
  "isActive": true
}
```

**Errors:**
- `400 Bad Request` - Past slot, invalid time range, or overlapping time slot
  - Messages:
    - `"Cannot create slot for past dates"`
    - `"Invalid time range: startTime must be before endTime"`
    - `"Time slot overlaps with existing slot in lab"`
- `403 Forbidden` - User is not an admin

---

## Booking Endpoints

### POST /booking/bookings
Student books a slot.

**Validation Rules:**
- Student cannot book a slot that's already fully booked (approved count ≥ capacity)
- Student cannot book the same slot twice (duplicate check)
- Student cannot have overlapping bookings on the same date (time conflict prevention)
- Student cannot book past slots

**Headers:** `Authorization: Bearer <student-token>`

**Request Body:**
```json
{
  "slotId": "65e1a2b3c4d5e6f7g8h9i0j5",
  "purpose": "Database assignment"
}
```

**Response (201):**
```json
{
  "_id": "65e1a2b3c4d5e6f7g8h9i0j7",
  "studentId": "65e1a2b3c4d5e6f7g8h9i0j1",
  "slotId": "65e1a2b3c4d5e6f7g8h9i0j5",
  "purpose": "Database assignment",
  "status": "PENDING",
  "createdAt": "2026-04-28T10:00:00Z"
}
```

**Errors:**
- `409 Conflict` - Slot fully booked
  - Message: `"Slot is fully booked"`
- `409 Conflict` - Already booked this slot
  - Message: `"You have already booked this slot"`
- `409 Conflict` - Time overlap on same date
  - Message: `"You already have a booking on 2026-04-30 from 10:00 to 11:00"`
- `400 Bad Request` - Booking past slot
  - Message: `"Cannot book a slot in the past"`

---

### GET /booking/bookings/me
Get all bookings for the authenticated student.

**Headers:** `Authorization: Bearer <student-token>`

**Response (200):**
```json
[
  {
    "_id": "65e1a2b3c4d5e6f7g8h9i0j7",
    "studentId": "65e1a2b3c4d5e6f7g8h9i0j1",
    "slotId": {
      "_id": "65e1a2b3c4d5e6f7g8h9i0j5",
      "date": "2026-05-01",
      "startTime": "10:00",
      "endTime": "11:30",
      "labId": {
        "name": "Computer Lab A"
      }
    },
    "purpose": "Database assignment",
    "status": "PENDING",
    "createdAt": "2026-04-28T10:00:00Z"
  }
]
```

---

### GET /booking/bookings
Get all bookings with optional filters. **Admin only.**

**Headers:** `Authorization: Bearer <admin-token>`

**Query Parameters:**
- `status` (optional): Filter by status (PENDING, APPROVED, REJECTED, CANCELLED, COMPLETED)
- `slotId` (optional): Filter by slot ID

**Response (200):** Array of booking objects with same structure as GET /booking/bookings/me

---

### PATCH /booking/bookings/:id/approve
Approve a pending booking. **Admin only.**

**Headers:** `Authorization: Bearer <admin-token>`

**Request Body:** (empty)

**Response (200):**
```json
{
  "_id": "65e1a2b3c4d5e6f7g8h9i0j7",
  "status": "APPROVED",
  "reviewedBy": "65e1a2b3c4d5e6f7g8h9i0j0",
  "reviewedAt": "2026-04-28T11:00:00Z"
}
```

**Error (400):** Cannot approve non-PENDING booking

---

### PATCH /booking/bookings/:id/reject
Reject a pending booking. **Admin only.**

**Headers:** `Authorization: Bearer <admin-token>`

**Request Body:** (empty)

**Response (200):**
```json
{
  "_id": "65e1a2b3c4d5e6f7g8h9i0j7",
  "status": "REJECTED",
  "reviewedBy": "65e1a2b3c4d5e6f7g8h9i0j0",
  "reviewedAt": "2026-04-28T11:00:00Z"
}
```

**Error (400):** Cannot reject non-PENDING booking

---

### PATCH /booking/bookings/:id/cancel
Cancel a booking.

**Access Rules:**
- Students can cancel their own PENDING bookings only
- Admins can cancel any PENDING or APPROVED booking

**Headers:** `Authorization: Bearer <token>`

**Request Body:** (empty)

**Response (200):**
```json
{
  "_id": "65e1a2b3c4d5e6f7g8h9i0j7",
  "status": "CANCELLED",
  "cancelledAt": "2026-04-28T12:00:00Z"
}
```

**Errors:**
- `403 Forbidden` - Student trying to cancel another student's booking or approved booking
- `400 Bad Request` - Booking already cancelled, rejected, or completed

