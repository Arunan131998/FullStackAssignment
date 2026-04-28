import { useEffect, useState } from 'react';
import { apiClient } from '../api/client';

function StudentDashboard() {
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  async function fetchSlots() {
    const response = await apiClient.get('/booking/slots');
    setSlots(response.data?.data || []);
  }

  async function fetchMyBookings() {
    const response = await apiClient.get('/booking/bookings/me');
    setBookings(response.data?.data || []);
  }

  useEffect(() => {
    async function loadData() {
      setError('');
      try {
        await Promise.all([fetchSlots(), fetchMyBookings()]);
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to load student dashboard');
      }
    }
    loadData();
  }, []);

  async function handleBookSlot(slotId) {
    setError('');
    setMessage('');
    setIsBooking(true);
    try {
      await apiClient.post('/booking/bookings', { slotId });
      setMessage('Booking request submitted successfully');
      await Promise.all([fetchSlots(), fetchMyBookings()]);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to create booking');
    } finally {
      setIsBooking(false);
    }
  }

  function renderBookingSlot(booking) {
    const slot = booking.slotId;
    if (!slot || typeof slot === 'string') {
      return 'Slot details unavailable';
    }
    const labName = slot.labId?.name ? ` | ${slot.labId.name}` : '';
    return `${slot.date} | ${slot.startTime} - ${slot.endTime}${labName}`;
  }

  return (
    <section>
      <h2>Student Dashboard</h2>
      {error && <p>{error}</p>}
      {message && <p>{message}</p>}
      <div className="card">
        <h3>Available Slots</h3>
        <ul>
          {slots.map((slot) => (
            <li key={slot._id} className="slot-row">
              <span>
                {slot.date} | {slot.startTime} - {slot.endTime} | Capacity: {slot.capacity}
                {slot.labId?.name ? ` | Lab: ${slot.labId.name}` : ''}
              </span>
              <button type="button" onClick={() => handleBookSlot(slot._id)} disabled={isBooking}>
                {isBooking ? 'Booking...' : 'Book Slot'}
              </button>
            </li>
          ))}
          {!slots.length && <li>No slots available yet.</li>}
        </ul>
      </div>
      <div className="card">
        <h3>My Bookings</h3>
        <ul>
          {bookings.map((booking) => (
            <li key={booking._id}>
              {renderBookingSlot(booking)} | Status: {booking.status}
            </li>
          ))}
          {!bookings.length && <li>No bookings yet.</li>}
        </ul>
      </div>
    </section>
  );
}

export default StudentDashboard;
