import { useEffect, useState } from 'react';
import { apiClient } from '../api/client';

function AdminDashboard() {
  const [labs, setLabs] = useState([]);
  const [slots, setSlots] = useState([]);
  const [pendingBookings, setPendingBookings] = useState([]);
  const [approvedBookings, setApprovedBookings] = useState([]);
  const [name, setName] = useState('Computer Networks Lab');
  const [location, setLocation] = useState('Block A, Floor 2');
  const [totalSeats, setTotalSeats] = useState(30);
  const [selectedLabId, setSelectedLabId] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [capacity, setCapacity] = useState(10);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [labError, setLabError] = useState('');
  const [slotError, setSlotError] = useState('');
  const [activeBookingId, setActiveBookingId] = useState('');
  const today = new Date().toISOString().split('T')[0];

  async function fetchLabs() {
    const response = await apiClient.get('/booking/labs');
    const labList = response.data?.data || [];
    setLabs(labList);
    setSelectedLabId((current) => current || labList[0]?._id || '');
  }

  async function fetchSlots() {
    const response = await apiClient.get('/booking/slots');
    setSlots(response.data?.data || []);
  }

  async function fetchPendingBookings() {
    const response = await apiClient.get('/booking/bookings', { params: { status: 'PENDING' } });
    setPendingBookings(response.data?.data || []);
  }

  async function fetchApprovedBookings() {
    const response = await apiClient.get('/booking/bookings', { params: { status: 'APPROVED' } });
    setApprovedBookings(response.data?.data || []);
  }

  useEffect(() => {
    async function loadDashboardData() {
      setError('');
      try {
        await Promise.all([fetchLabs(), fetchSlots(), fetchPendingBookings(), fetchApprovedBookings()]);
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Failed to load admin dashboard');
      }
    }
    loadDashboardData();
  }, []);

  async function handleCreateLab(event) {
    event.preventDefault();
    setMessage('');
    setError('');
    setLabError('');
    try {
      await apiClient.post('/booking/labs', { name, location, totalSeats });
      setMessage('Lab created successfully');
      await fetchLabs();
    } catch (requestError) {
      setLabError(requestError.response?.data?.message || 'Failed to create lab');
    }
  }

  async function handleCreateSlot(event) {
    event.preventDefault();
    setMessage('');
    setError('');
    setSlotError('');
    try {
      await apiClient.post('/booking/slots', {
        labId: selectedLabId,
        date,
        startTime,
        endTime,
        capacity,
      });
      setMessage('Slot created successfully');
      setDate('');
      setStartTime('09:00');
      setEndTime('10:00');
      setCapacity(10);
      await fetchSlots();
    } catch (requestError) {
      setSlotError(requestError.response?.data?.message || 'Failed to create slot');
    }
  }

  async function handleBookingDecision(bookingId, decision) {
    setError('');
    setMessage('');
    setActiveBookingId(bookingId);
    try {
      await apiClient.patch(`/booking/bookings/${bookingId}/${decision}`);
      setMessage(`Booking ${decision}d successfully`);
      await Promise.all([fetchPendingBookings(), fetchApprovedBookings()]);
    } catch (requestError) {
      setError(requestError.response?.data?.message || `Failed to ${decision} booking`);
    } finally {
      setActiveBookingId('');
    }
  }

  async function handleCancelBooking(bookingId) {
    setError('');
    setMessage('');
    setActiveBookingId(bookingId);
    try {
      await apiClient.patch(`/booking/bookings/${bookingId}/cancel`);
      setMessage('Booking cancelled successfully');
      await Promise.all([fetchPendingBookings(), fetchApprovedBookings()]);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setActiveBookingId('');
    }
  }

  function renderPendingBookingSlot(booking) {
    const slot = booking.slotId;
    if (!slot || typeof slot === 'string') {
      return 'Slot details unavailable';
    }
    const labName = slot.labId?.name ? ` | ${slot.labId.name}` : '';
    return `${slot.date} | ${slot.startTime} - ${slot.endTime}${labName}`;
  }

  const availabilityByLab = labs.map((lab) => {
    const labSlots = slots.filter((slot) => {
      const slotLabId = typeof slot.labId === 'string' ? slot.labId : slot.labId?._id;
      return slotLabId === lab._id;
    });

    return {
      ...lab,
      totalSlots: labSlots.length,
      openSlots: labSlots.filter((slot) => slot.isAvailable).length,
      totalRemainingSeats: labSlots.reduce((sum, slot) => sum + (slot.remainingCapacity || 0), 0),
    };
  });

  return (
    <section>
      <div className="section-heading">
        <div>
          <p className="eyebrow">Admin workspace</p>
          <h2>Admin Dashboard</h2>
          <p className="muted-text">Manage labs, create slots, and review what is already scheduled before adding new sessions.</p>
        </div>
      </div>
      {error && <p className="alert alert-error">{error}</p>}
      {message && <p className="alert alert-success">{message}</p>}
      <div className="card">
        <h3>Slot Availability by Lab</h3>
        <ul className="clean-list">
          {availabilityByLab.map((lab) => (
            <li key={lab._id} className="list-item-card lab-summary-card">
              <div>
                <strong>{lab.name}</strong>
                <div className="muted-text">{lab.location}</div>
              </div>
              <div className="summary-badges">
                <span className="status-badge neutral-badge">Open slots: {lab.openSlots}/{lab.totalSlots}</span>
                <span className="status-badge status-approved">Seats left: {lab.totalRemainingSeats}</span>
              </div>
            </li>
          ))}
          {!availabilityByLab.length && <li className="empty-state">No labs created yet.</li>}
        </ul>
      </div>
      <div className="dashboard-grid">
        <form className="card form" onSubmit={handleCreateLab}>
          <h3>Create Lab</h3>
          <label>
            Lab Name
            <input value={name} onChange={(event) => setName(event.target.value)} required />
          </label>
          <label>
            Location
            <input value={location} onChange={(event) => setLocation(event.target.value)} required />
          </label>
          <label>
            Total Seats
            <input
              type="number"
              min="1"
              value={totalSeats}
              onChange={(event) => setTotalSeats(Number(event.target.value))}
              required
            />
          </label>
          <button type="submit">Create Lab</button>
          {labError && <p className="alert alert-error form-alert">{labError}</p>}
        </form>

        <form className="card form" onSubmit={handleCreateSlot}>
          <h3>Create Slot</h3>
          <label>
            Lab
            <select value={selectedLabId} onChange={(event) => setSelectedLabId(event.target.value)} required>
              <option value="">Select a lab</option>
              {labs.map((lab) => (
                <option key={lab._id} value={lab._id}>
                  {lab.name} - {lab.location}
                </option>
              ))}
            </select>
          </label>
          <label>
            Date
            <input type="date" min={today} value={date} onChange={(event) => setDate(event.target.value)} required />
          </label>
          <label>
            Start Time
            <input type="time" value={startTime} onChange={(event) => setStartTime(event.target.value)} required />
          </label>
          <label>
            End Time
            <input type="time" value={endTime} onChange={(event) => setEndTime(event.target.value)} required />
          </label>
          <label>
            Capacity
            <input
              type="number"
              min="1"
              value={capacity}
              onChange={(event) => setCapacity(Number(event.target.value))}
              required
            />
          </label>
          <button type="submit" disabled={!labs.length}>Create Slot</button>
          {slotError && <p className="alert alert-error form-alert">{slotError}</p>}
          {!labs.length && <p>Create a lab first before adding slots.</p>}
        </form>
      </div>

      <div className="card">
        <h3>Existing Labs</h3>
        <ul className="clean-list">
          {labs.map((lab) => (
            <li key={lab._id} className="list-item-card">
              <div>
                <strong>{lab.name}</strong>
                <div className="muted-text">{lab.location}</div>
              </div>
              <div className="summary-badges">
                <span className="status-badge neutral-badge">Seats: {lab.totalSeats}</span>
                <span className="status-badge neutral-badge">Slots: {availabilityByLab.find((entry) => entry._id === lab._id)?.totalSlots || 0}</span>
              </div>
            </li>
          ))}
          {!labs.length && <li className="empty-state">No labs created yet.</li>}
        </ul>
      </div>

      <div className="card">
        <h3>Existing Slots</h3>
        <ul className="clean-list">
          {slots.map((slot) => (
            <li key={slot._id} className="list-item-card">
              <div>
                <strong>{slot.labId?.name || 'Lab slot'}</strong>
                <div className="muted-text">{slot.date} | {slot.startTime} - {slot.endTime}</div>
              </div>
              <div className="summary-badges">
                <span className="status-badge neutral-badge">Capacity: {slot.capacity}</span>
                <span className={`status-badge ${slot.isAvailable ? 'status-approved' : 'status-cancelled'}`}>
                  Remaining: {slot.remainingCapacity || 0}
                </span>
              </div>
            </li>
          ))}
          {!slots.length && <li className="empty-state">No slots created yet.</li>}
        </ul>
      </div>

      <div className="card">
        <h3>Pending Booking Requests</h3>
        <ul className="clean-list">
          {pendingBookings.map((booking) => (
            <li key={booking._id} className="list-item-card">
              <div>
                <strong>{renderPendingBookingSlot(booking)}</strong>
                <div className="muted-text">Student ID: {booking.studentId}</div>
                {booking.purpose && <div className="muted-text">Purpose: {booking.purpose}</div>}
              </div>
              <div className="inline-actions">
                <button
                  type="button"
                  disabled={activeBookingId === booking._id}
                  onClick={() => handleBookingDecision(booking._id, 'approve')}
                >
                  Approve
                </button>
                <button
                  type="button"
                  className="danger-button"
                  disabled={activeBookingId === booking._id}
                  onClick={() => handleBookingDecision(booking._id, 'reject')}
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
          {!pendingBookings.length && <li className="empty-state">No pending booking requests.</li>}
        </ul>
      </div>

      <div className="card">
        <h3>Approved Bookings</h3>
        <ul className="clean-list">
          {approvedBookings.map((booking) => (
            <li key={booking._id} className="list-item-card">
              <div>
                <strong>{renderPendingBookingSlot(booking)}</strong>
                <div className="muted-text">Student ID: {booking.studentId}</div>
                {booking.purpose && <div className="muted-text">Purpose: {booking.purpose}</div>}
              </div>
              <div className="inline-actions">
                <span className="status-badge status-approved">APPROVED</span>
                <button
                  type="button"
                  className="danger-button"
                  disabled={activeBookingId === booking._id}
                  onClick={() => handleCancelBooking(booking._id)}
                >
                  Cancel
                </button>
              </div>
            </li>
          ))}
          {!approvedBookings.length && <li className="empty-state">No approved bookings yet.</li>}
        </ul>
      </div>
    </section>
  );
}

export default AdminDashboard;
