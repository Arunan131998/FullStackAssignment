import { useEffect, useState } from 'react';
import { apiClient } from '../api/client';

function StudentDashboard() {
  const [slots, setSlots] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchSlots() {
      try {
        const response = await apiClient.get('/booking/slots');
        setSlots(response.data?.data || []);
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to load slots');
      }
    }
    fetchSlots();
  }, []);

  return (
    <section>
      <h2>Student Dashboard</h2>
      {error && <p>{error}</p>}
      <div className="card">
        <h3>Available Slots</h3>
        <ul>
          {slots.map((slot) => (
            <li key={slot._id}>{slot.date} | {slot.startTime} - {slot.endTime} | Capacity: {slot.capacity}</li>
          ))}
          {!slots.length && <li>No slots available yet.</li>}
        </ul>
      </div>
    </section>
  );
}

export default StudentDashboard;
