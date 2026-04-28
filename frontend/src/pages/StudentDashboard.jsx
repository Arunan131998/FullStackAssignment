import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient, setAuthToken } from '../api/client';

function StudentDashboard() {
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [activeCancelId, setActiveCancelId] = useState('');
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();

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

  async function handleDeleteAccount() {
    setIsDeletingAccount(true);
    setError('');
    try {
      const meResponse = await apiClient.get('/auth/me');
      const userId = meResponse.data?.data?._id;
      await apiClient.delete(`/auth/users/${userId}`);
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('role');
      setAuthToken(null);
      navigate('/');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to delete account');
      setIsDeletingAccount(false);
      setShowDeleteConfirm(false);
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

  const slotsByLab = slots.reduce((groups, slot) => {
    const labId = slot.labId?._id || 'unknown-lab';
    const existingGroup = groups[labId] || {
      labName: slot.labId?.name || 'Unassigned lab',
      location: slot.labId?.location || '',
      totalSlots: 0,
      openSlots: 0,
      totalRemainingSeats: 0,
      slots: [],
    };

    existingGroup.totalSlots += 1;
    existingGroup.totalRemainingSeats += slot.remainingCapacity || 0;
    if (slot.isAvailable) {
      existingGroup.openSlots += 1;
    }
    existingGroup.slots.push(slot);
    groups[labId] = existingGroup;
    return groups;
  }, {});

  const labGroups = Object.values(slotsByLab);

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
      <div className="card">
        <h3>Availability by Lab</h3>
        <ul className="clean-list">
          {labGroups.map((lab) => (
            <li key={lab.labName} className="list-item-card lab-summary-card">
              <div>
                <strong>{lab.labName}</strong>
                {lab.location && <div className="muted-text">{lab.location}</div>}
              </div>
              <div className="summary-badges">
                <span className="status-badge neutral-badge">Open slots: {lab.openSlots}/{lab.totalSlots}</span>
                <span className="status-badge status-approved">Seats left: {lab.totalRemainingSeats}</span>
              </div>
            </li>
          ))}
          {!labGroups.length && <li className="empty-state">No lab availability yet.</li>}
        </ul>
      </div>
      <div className="dashboard-grid two-column-grid">
      <div className="card">
        <h3>Available Slots</h3>
        <div className="lab-slot-groups">
          {labGroups.map((lab) => (
            <div key={lab.labName} className="lab-slot-group">
              <div className="lab-slot-header">
                <div>
                  <strong>{lab.labName}</strong>
                  {lab.location && <div className="muted-text">{lab.location}</div>}
                </div>
                <span className="status-badge neutral-badge">Available slots: {lab.openSlots}</span>
              </div>
              <ul className="clean-list">
                {lab.slots.map((slot) => (
                  <li key={slot._id} className="slot-row list-item-card">
                    <div>
                      <strong>{slot.date} | {slot.startTime} - {slot.endTime}</strong>
                      <div className="muted-text">Capacity: {slot.capacity} | Approved: {slot.approvedCount || 0}</div>
                      <div className="muted-text">Remaining seats: {slot.remainingCapacity || 0}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleBookSlot(slot._id)}
                      disabled={isBooking || !slot.isAvailable}
                    >
                      {slot.isAvailable ? (isBooking ? 'Booking...' : 'Book Slot') : 'Full'}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {!labGroups.length && <p className="empty-state">No slots available yet.</p>}
        </div>
      </div>
      <div className="card">
        <h3>My Active Bookings</h3>
        <ul className="clean-list">
          {bookings.filter((b) => b.status === 'PENDING' || b.status === 'APPROVED').map((booking) => (
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
          {!bookings.filter((b) => b.status === 'PENDING' || b.status === 'APPROVED').length && (
            <li className="empty-state">No active bookings.</li>
          )}
        </ul>
      </div>
      </div>

      <div className="card">
        <h3>Booking History</h3>
        <ul className="clean-list">
          {bookings.filter((b) => b.status === 'REJECTED' || b.status === 'CANCELLED').map((booking) => (
            <li key={booking._id} className="list-item-card booking-row">
              <div>
                <strong>{renderBookingSlot(booking)}</strong>
                <div className="muted-text">
                  {booking.reviewedAt ? `Reviewed: ${new Date(booking.reviewedAt).toLocaleDateString()}` : `Submitted: ${new Date(booking.createdAt).toLocaleDateString()}`}
                </div>
              </div>
              <span className={`status-badge status-${booking.status?.toLowerCase()}`}>{booking.status}</span>
            </li>
          ))}
          {!bookings.filter((b) => b.status === 'REJECTED' || b.status === 'CANCELLED').length && (
            <li className="empty-state">No past bookings.</li>
          )}
        </ul>
      </div>
      <div className="card danger-zone">
        <h3>Account</h3>
        <p className="muted-text">Permanently delete your account. This cannot be undone.</p>
        {!showDeleteConfirm ? (
          <button type="button" className="danger-button delete-account-btn" onClick={() => setShowDeleteConfirm(true)}>
            Delete My Account
          </button>
        ) : (
          <div className="delete-confirm">
            <p className="alert alert-error">Are you sure? All your bookings will remain in the system but your account will be gone.</p>
            <div className="inline-actions">
              <button
                type="button"
                className="danger-button"
                disabled={isDeletingAccount}
                onClick={handleDeleteAccount}
              >
                {isDeletingAccount ? 'Deleting...' : 'Yes, Delete Account'}
              </button>
              <button type="button" className="secondary-button" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default StudentDashboard;
