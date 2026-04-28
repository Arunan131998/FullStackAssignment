import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { setAuthToken } from './api/client';

function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  if (!token) return <Navigate to="/" replace />;
  if (role && userRole !== role) return <Navigate to="/" replace />;
  return children;
}

function App() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setAuthToken(null);
    navigate('/');
  }

  return (
    <div className="container">
      <header>
        <h1>Lab Slot Booking</h1>
        <nav>
          {!isLoggedIn && <Link to="/">Login</Link>}
          {isLoggedIn && <Link to="/student">Student</Link>}
          {isLoggedIn && <Link to="/admin">Admin</Link>}
          {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/student" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
