import { useEffect, useState } from 'react';
import { apiClient } from '../api/client';

function AdminDashboard() {
  const [labs, setLabs] = useState([]);
  const [slots, setSlots] = useState([]);
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

  useEffect(() => {
    async function loadDashboardData() {
      setError('');
      try {
        await Promise.all([fetchLabs(), fetchSlots()]);
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
    try {
      await apiClient.post('/booking/labs', { name, location, totalSeats });
      setMessage('Lab created successfully');
      await fetchLabs();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create lab');
    }
  }

  async function handleCreateSlot(event) {
    event.preventDefault();
    setMessage('');
    setError('');
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
      setError(requestError.response?.data?.message || 'Failed to create slot');
    }
  }

  return (
    <section>
      <h2>Admin Dashboard</h2>
      {error && <p>{error}</p>}
      {message && <p>{message}</p>}
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
            <input type="date" value={date} onChange={(event) => setDate(event.target.value)} required />
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
          {!labs.length && <p>Create a lab first before adding slots.</p>}
        </form>
      </div>

      <div className="card">
        <h3>Existing Labs</h3>
        <ul>
          {labs.map((lab) => (
            <li key={lab._id}>
              {lab.name} | {lab.location} | Seats: {lab.totalSeats}
            </li>
          ))}
          {!labs.length && <li>No labs created yet.</li>}
        </ul>
      </div>

      <div className="card">
        <h3>Existing Slots</h3>
        <ul>
          {slots.map((slot) => (
            <li key={slot._id}>
              {slot.labId?.name ? `${slot.labId.name} | ` : ''}
              {slot.date} | {slot.startTime} - {slot.endTime} | Capacity: {slot.capacity}
            </li>
          ))}
          {!slots.length && <li>No slots created yet.</li>}
        </ul>
      </div>
    </section>
  );
}

export default AdminDashboard;
