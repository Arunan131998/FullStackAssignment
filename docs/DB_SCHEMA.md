# DB Schema (MVP)

## User

- `name: string`
- `email: string (unique)`
- `passwordHash: string`
- `role: student | admin`

## Lab

- `name: string`
- `location: string`
- `totalSeats: number`
- `equipmentTags: string[]`

## Slot

- `labId: ObjectId -> Lab`
- `date: string (YYYY-MM-DD)`
- `startTime: string (HH:mm)`
- `endTime: string (HH:mm)`
- `capacity: number`
- `isActive: boolean`

## Booking

- `studentId: string`
- `slotId: ObjectId -> Slot`
- `purpose: string`
- `status: PENDING | APPROVED | REJECTED | CANCELLED | COMPLETED`
- `reviewedBy: string | null`
- `reviewedAt: Date | null`
