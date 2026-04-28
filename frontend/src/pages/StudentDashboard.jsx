import { useEffect, useState } from 'react';
import { apiClient } from '../api/client';

function StudentDashboard() {
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [activeCancelId, setActiveCancelId] = useState('');

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

  async function handleCancelBooking(bookingId) {
    setError('');
    setMessage('');
    setActiveCancelId(bookingId);
    try {
      await apiClient.patch(`/booking/bookings/${bookingId}/cancel`);
      setMessage('Booking cancelled successfully');
      await Promise.all([fetchSlots(), fetchMyBookings()]);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to cancel booking');
    } finally {
      setActiveCancelId('');
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
      <div className="section-heading">
        <div>
          <p className="eyebrow">Student workspace</p>
          <h2>Student Dashboard</h2>
          <p className="muted-text">View current slots and track every booking request in one place.</p>
        </div>
      </div>
      {error && <p className="alert alert-error">{error}</p>}
      {message && <p className="alert alert-success">{message}</p>}
      <div className="dashboard-grid two-column-grid">
      <div className="card">
        <h3>Available Slots</h3>
        <ul className="clean-list">
          {slots.map((slot) => (
            <li key={slot._id} className="slot-row list-item-card">
              <div>
                <strong>{slot.labId?.name || 'Lab slot'}</strong>
                <div className="muted-text">{slot.date} | {slot.startTime} - {slot.endTime}</div>
                <div className="muted-text">Capacity: {slot.capacity}</div>
              </div>
              <button type="button" onClick={() => handleBookSlot(slot._id)} disabled={isBooking}>
                {isBooking ? 'Booking...' : 'Book Slot'}
              </button>
            </li>
          ))}
          {!slots.length && <li className="empty-state">No slots available yet.</li>}
        </ul>
      </div>
      <div className="card">
        <h3>My Bookings</h3>
        <ul className="clean-list">
          {bookings.map((booking) => (
            <li key={booking._id} className="list-item-card booking-row">
              <div>
                <strong>{renderBookingSlot(booking)}</strong>
                <div className="muted-text">Submitted booking request</div>
              </div>
              <div className="inline-actions">
                <span className={`status-badge status-${booking.status?.toLowerCase()}`}>{booking.status}</span>
                {booking.status === 'PENDING' && (
                  <button
                    type="button"
                    className="danger-button"
                    disabled={activeCancelId === booking._id}
                    onClick={() => handleCancelBooking(booking._id)}
                  >
                    {activeCancelId === booking._id ? 'Cancelling...' : 'Cancel'}
                  </button>
                )}
              </div>
            </li>
          ))}
          {!bookings.length && <li className="empty-state">No bookings yet.</li>}
        </ul>
      </div>
      </div>
    </section>
  );
}

export default StudentDashboard;
