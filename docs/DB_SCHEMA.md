# Database Schema

## User Collection

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique, lowercase),
  passwordHash: String (required, bcrypt-hashed),
  role: String (enum: ['student', 'admin'], required),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes:**
- `email` (unique): enables fast login lookups

**Example Document:**
```json
{
  "_id": "65e1a2b3c4d5e6f7g8h9i0j0",
  "name": "Admin User",
  "email": "admin@example.com",
  "passwordHash": "$2b$10$...",
  "role": "admin",
  "createdAt": "2026-01-01T00:00:00Z",
  "updatedAt": "2026-01-01T00:00:00Z"
}
```

---

## Lab Collection

```javascript
{
  _id: ObjectId,
  name: String (required),
  location: String (required),
  totalSeats: Number (required, min: 1),
  equipmentTags: [String],
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes:**
- `name`: for searching labs by name

**Example Document:**
```json
{
  "_id": "65e1a2b3c4d5e6f7g8h9i0j2",
  "name": "Computer Lab A",
  "location": "Building 3, Floor 2",
  "totalSeats": 30,
  "equipmentTags": ["Desktop", "GPU", "Dual Monitor"],
  "createdAt": "2026-01-05T10:30:00Z",
  "updatedAt": "2026-01-05T10:30:00Z"
}
```

---

## Slot Collection

```javascript
{
  _id: ObjectId,
  labId: ObjectId (ref: Lab, required),
  date: String (format: YYYY-MM-DD, required),
  startTime: String (format: HH:mm, required),
  endTime: String (format: HH:mm, required),
  capacity: Number (required, min: 1, max: 100),
  isActive: Boolean (default: true),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes:**
- `labId`: for filtering slots by lab
- `date`: for filtering slots by date
- `labId + date`: compound index for checking slot overlaps

**Constraints:**
- `startTime < endTime` (validated at application level)
- `date` must be today or in future (no past slots)
- No overlapping time slots for same lab on same date

**Example Document:**
```json
{
  "_id": "65e1a2b3c4d5e6f7g8h9i0j5",
  "labId": "65e1a2b3c4d5e6f7g8h9i0j2",
  "date": "2026-05-01",
  "startTime": "10:00",
  "endTime": "11:30",
  "capacity": 25,
  "isActive": true,
  "createdAt": "2026-04-28T09:00:00Z",
  "updatedAt": "2026-04-28T09:00:00Z"
}
```

---

## Booking Collection

```javascript
{
  _id: ObjectId,
  studentId: String (required, email of student),
  slotId: ObjectId (ref: Slot, required),
  purpose: String (required),
  status: String (enum: ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'COMPLETED'], default: 'PENDING'),
  reviewedBy: String (email of admin, nullable),
  reviewedAt: Date (nullable),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes:**
- `studentId`: for filtering bookings by student
- `slotId`: for checking if student already booked slot
- `status`: for quick filtering by booking state
- `studentId + status`: compound index for student's active bookings

**Status Workflow:**
```
PENDING ──approve──> APPROVED ──admin-cancel──> CANCELLED
   │                    │
rejected           (student can't cancel)
   │
REJECTED
   │
(can't approve/reject/cancel)

PENDING ──student-cancel──> CANCELLED
   │
(can't cancel approved)

APPROVED ──completion──> COMPLETED (future feature)
```

**Validation Rules:**
- Student can only cancel PENDING bookings they own
- Admin can cancel PENDING or APPROVED bookings
- Status transitions are strictly enforced
- Student cannot book:
  - Same slot twice (duplicate)
  - Overlapping time slots on same date
  - Past slots
  - Full slots (approved count ≥ capacity)

**Example Document:**
```json
{
  "_id": "65e1a2b3c4d5e6f7g8h9i0j7",
  "studentId": "student@example.com",
  "slotId": "65e1a2b3c4d5e6f7g8h9i0j5",
  "purpose": "Database assignment",
  "status": "APPROVED",
  "reviewedBy": "admin@example.com",
  "reviewedAt": "2026-04-28T11:00:00Z",
  "createdAt": "2026-04-28T10:00:00Z",
  "updatedAt": "2026-04-28T11:00:00Z"
}
```

---

## Relationships

```
User (student account)
  │
  └─────── Booking (many: one user to many bookings)
       │
       └─────── Slot
            │
            └─────── Lab

User (admin account)
  └─────── Reviews Bookings (admin field: reviewedBy)
```

## Aggregation Examples

### Get all bookings for a slot (with student details)
```javascript
db.bookings.aggregate([
  { $match: { slotId: ObjectId("...") } },
  { $lookup: {
      from: "users",
      let: { studentId: "$studentId" },
      pipeline: [
        { $match: { $expr: { $eq: ["$email", "$$studentId"] } } }
      ],
      as: "student"
    }
  },
  { $unwind: "$student" }
])
```

### Get approved booking count for a slot
```javascript
db.bookings.countDocuments({
  slotId: ObjectId("..."),
  status: "APPROVED"
})
```

### Check for overlapping bookings on same date
```javascript
db.bookings.findOne({
  studentId: "student@example.com",
  status: { $in: ["PENDING", "APPROVED"] },
  slotId: { $in: [/* slot IDs for same date */] }
})
```
