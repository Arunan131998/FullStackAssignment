import { useState } from 'react';
import { apiClient } from '../api/client';

function AdminDashboard() {
  const [name, setName] = useState('Computer Networks Lab');
  const [location, setLocation] = useState('Block A, Floor 2');
  const [totalSeats, setTotalSeats] = useState(30);
  const [message, setMessage] = useState('');

  async function handleCreateLab(event) {
    event.preventDefault();
    setMessage('');
    try {
      await apiClient.post('/booking/labs', { name, location, totalSeats });
      setMessage('Lab created successfully');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to create lab');
    }
  }

  return (
    <section>
      <h2>Admin Dashboard</h2>
      <form className="card form" onSubmit={handleCreateLab}>
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
      {message && <p>{message}</p>}
    </section>
  );
}

export default AdminDashboard;
