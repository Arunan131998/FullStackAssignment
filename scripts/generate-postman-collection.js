const fs = require('fs');
const path = require('path');

const auth = (token) => [{ key: 'Authorization', value: `Bearer {{${token}}}` }];
const json = (token) => [{ key: 'Content-Type', value: 'application/json' }, ...auth(token)];
const url = (raw, ...segments) => ({ raw, host: ['{{baseUrl}}'], path: segments });
const urlQ = (raw, pathArr, query) => ({ raw, host: ['{{baseUrl}}'], path: pathArr, query });
const captureTest = (status, varName, expr) => [{
  listen: 'test',
  script: {
    type: 'text/javascript',
    exec: [
      `pm.test("Status ${status}", () => pm.response.to.have.status(${status}));`,
      'const body = pm.response.json();',
      `pm.collectionVariables.set("${varName}", ${expr});`,
    ],
  },
}];

const collection = {
  info: {
    _postman_id: 'lab-slot-booking-demo-v2',
    name: 'Lab Slot Booking Demo',
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
    description: 'Complete API demo. Run folders in order: Auth > Labs > Slots > Bookings > User Management.',
  },
  variable: [
    { key: 'baseUrl', value: 'http://localhost:4000' },
    { key: 'adminEmail', value: 'admin@example.com' },
    { key: 'adminPassword', value: 'Admin@123' },
    { key: 'studentEmail', value: 'student@example.com' },
    { key: 'studentPassword', value: 'Student@123' },
    { key: 'adminToken', value: '' },
    { key: 'studentToken', value: '' },
    { key: 'labId', value: '' },
    { key: 'slotId', value: '' },
    { key: 'bookingId', value: '' },
    { key: 'userId', value: '' },
  ],
  item: [
    {
      name: '0 - Health',
      item: [
        {
          name: 'Gateway Health',
          request: { method: 'GET', header: [], url: url('{{baseUrl}}/health', 'health') },
        },
      ],
    },
    {
      name: '1 - Auth',
      item: [
        {
          name: 'Register - Student',
          request: {
            method: 'POST',
            header: [{ key: 'Content-Type', value: 'application/json' }],
            body: {
              mode: 'raw',
              raw: JSON.stringify({ name: 'New Student', email: 'newstudent@example.com', password: 'Student@123', role: 'student' }, null, 2),
              options: { raw: { language: 'json' } },
            },
            url: url('{{baseUrl}}/auth/register', 'auth', 'register'),
          },
        },
        {
          name: 'Login - Admin',
          event: captureTest(200, 'adminToken', 'body.token'),
          request: {
            method: 'POST',
            header: [{ key: 'Content-Type', value: 'application/json' }],
            body: {
              mode: 'raw',
              raw: JSON.stringify({ email: '{{adminEmail}}', password: '{{adminPassword}}' }, null, 2),
              options: { raw: { language: 'json' } },
            },
            url: url('{{baseUrl}}/auth/login', 'auth', 'login'),
          },
        },
        {
          name: 'Login - Student',
          event: captureTest(200, 'studentToken', 'body.token'),
          request: {
            method: 'POST',
            header: [{ key: 'Content-Type', value: 'application/json' }],
            body: {
              mode: 'raw',
              raw: JSON.stringify({ email: '{{studentEmail}}', password: '{{studentPassword}}' }, null, 2),
              options: { raw: { language: 'json' } },
            },
            url: url('{{baseUrl}}/auth/login', 'auth', 'login'),
          },
        },
        {
          name: 'Get Current User (me)',
          request: {
            method: 'GET',
            header: auth('studentToken'),
            url: url('{{baseUrl}}/auth/me', 'auth', 'me'),
          },
        },
      ],
    },
    {
      name: '2 - Labs (Admin)',
      item: [
        {
          name: 'List All Labs',
          request: { method: 'GET', header: [], url: url('{{baseUrl}}/booking/labs', 'booking', 'labs') },
        },
        {
          name: 'Create Lab',
          event: captureTest(201, 'labId', 'body.data._id'),
          request: {
            method: 'POST',
            header: json('adminToken'),
            body: {
              mode: 'raw',
              raw: JSON.stringify({ name: 'Computer Networks Lab', location: 'Block A - Floor 2', totalSeats: 30, equipmentTags: ['routers', 'switches'] }, null, 2),
              options: { raw: { language: 'json' } },
            },
            url: url('{{baseUrl}}/booking/labs', 'booking', 'labs'),
          },
        },
        {
          name: 'Edit Lab',
          request: {
            method: 'PATCH',
            header: json('adminToken'),
            body: {
              mode: 'raw',
              raw: JSON.stringify({ name: 'Advanced Networks Lab', location: 'Block B - Floor 1', totalSeats: 35 }, null, 2),
              options: { raw: { language: 'json' } },
            },
            url: url('{{baseUrl}}/booking/labs/{{labId}}', 'booking', 'labs', '{{labId}}'),
          },
        },
        {
          name: 'Delete Lab',
          request: {
            method: 'DELETE',
            header: auth('adminToken'),
            url: url('{{baseUrl}}/booking/labs/{{labId}}', 'booking', 'labs', '{{labId}}'),
          },
        },
      ],
    },
    {
      name: '3 - Slots (Admin)',
      item: [
        {
          name: 'List All Slots',
          request: { method: 'GET', header: auth('studentToken'), url: url('{{baseUrl}}/booking/slots', 'booking', 'slots') },
        },
        {
          name: 'List Slots by Lab',
          request: {
            method: 'GET',
            header: [],
            url: urlQ('{{baseUrl}}/booking/slots?labId={{labId}}', ['booking', 'slots'], [{ key: 'labId', value: '{{labId}}' }]),
          },
        },
        {
          name: 'Create Slot',
          event: captureTest(201, 'slotId', 'body.data._id'),
          request: {
            method: 'POST',
            header: json('adminToken'),
            body: {
              mode: 'raw',
              raw: JSON.stringify({ labId: '{{labId}}', date: '2026-05-10', startTime: '10:00', endTime: '12:00', capacity: 10 }, null, 2),
              options: { raw: { language: 'json' } },
            },
            url: url('{{baseUrl}}/booking/slots', 'booking', 'slots'),
          },
        },
        {
          name: 'Edit Slot',
          request: {
            method: 'PATCH',
            header: json('adminToken'),
            body: {
              mode: 'raw',
              raw: JSON.stringify({ date: '2026-05-10', startTime: '09:00', endTime: '11:00', capacity: 12 }, null, 2),
              options: { raw: { language: 'json' } },
            },
            url: url('{{baseUrl}}/booking/slots/{{slotId}}', 'booking', 'slots', '{{slotId}}'),
          },
        },
        {
          name: 'Delete Slot',
          request: {
            method: 'DELETE',
            header: auth('adminToken'),
            url: url('{{baseUrl}}/booking/slots/{{slotId}}', 'booking', 'slots', '{{slotId}}'),
          },
        },
      ],
    },
    {
      name: '4 - Bookings',
      item: [
        {
          name: 'Create Booking - Student',
          event: captureTest(201, 'bookingId', 'body.data._id'),
          request: {
            method: 'POST',
            header: json('studentToken'),
            body: {
              mode: 'raw',
              raw: JSON.stringify({ slotId: '{{slotId}}', purpose: 'Assignment preparation' }, null, 2),
              options: { raw: { language: 'json' } },
            },
            url: url('{{baseUrl}}/booking/bookings', 'booking', 'bookings'),
          },
        },
        {
          name: 'My Bookings - Student',
          request: { method: 'GET', header: auth('studentToken'), url: url('{{baseUrl}}/booking/bookings/me', 'booking', 'bookings', 'me') },
        },
        {
          name: 'List Pending Bookings - Admin',
          request: {
            method: 'GET',
            header: auth('adminToken'),
            url: urlQ('{{baseUrl}}/booking/bookings?status=PENDING', ['booking', 'bookings'], [{ key: 'status', value: 'PENDING' }]),
          },
        },
        {
          name: 'List Approved Bookings - Admin',
          request: {
            method: 'GET',
            header: auth('adminToken'),
            url: urlQ('{{baseUrl}}/booking/bookings?status=APPROVED', ['booking', 'bookings'], [{ key: 'status', value: 'APPROVED' }]),
          },
        },
        {
          name: 'List All Bookings - Admin',
          request: { method: 'GET', header: auth('adminToken'), url: url('{{baseUrl}}/booking/bookings', 'booking', 'bookings') },
        },
        {
          name: 'Approve Booking - Admin',
          request: {
            method: 'PATCH',
            header: auth('adminToken'),
            url: url('{{baseUrl}}/booking/bookings/{{bookingId}}/approve', 'booking', 'bookings', '{{bookingId}}', 'approve'),
          },
        },
        {
          name: 'Reject Booking - Admin',
          request: {
            method: 'PATCH',
            header: auth('adminToken'),
            url: url('{{baseUrl}}/booking/bookings/{{bookingId}}/reject', 'booking', 'bookings', '{{bookingId}}', 'reject'),
          },
        },
        {
          name: 'Cancel Booking - Student',
          request: {
            method: 'PATCH',
            header: auth('studentToken'),
            url: url('{{baseUrl}}/booking/bookings/{{bookingId}}/cancel', 'booking', 'bookings', '{{bookingId}}', 'cancel'),
          },
        },
      ],
    },
    {
      name: '5 - User Management (Admin)',
      item: [
        {
          name: 'List All Users',
          event: [{
            listen: 'test',
            script: {
              type: 'text/javascript',
              exec: [
                'const body = pm.response.json();',
                'if (body.data && body.data.length > 0) { pm.collectionVariables.set("userId", body.data[0]._id); }',
              ],
            },
          }],
          request: { method: 'GET', header: auth('adminToken'), url: url('{{baseUrl}}/auth/users', 'auth', 'users') },
        },
        {
          name: 'Delete User by ID - Admin',
          request: {
            method: 'DELETE',
            header: auth('adminToken'),
            url: url('{{baseUrl}}/auth/users/{{userId}}', 'auth', 'users', '{{userId}}'),
          },
        },
        {
          name: 'Delete Own Account - Student',
          request: {
            method: 'DELETE',
            header: auth('studentToken'),
            url: url('{{baseUrl}}/auth/users/{{userId}}', 'auth', 'users', '{{userId}}'),
          },
        },
      ],
    },
  ],
};

const outPath = path.join(__dirname, '..', 'docs', 'postman', 'LabSlotBooking_Demo.postman_collection.json');
fs.writeFileSync(outPath, JSON.stringify(collection, null, 2), 'utf8');
console.log('Collection written to', outPath);
