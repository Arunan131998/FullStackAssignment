import { useEffect } from 'react';
import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { setAuthToken } from './api/client';

function ProtectedRoute({ children, role }) {
  const token = sessionStorage.getItem('token');
  const userRole = sessionStorage.getItem('role');
  if (!token) return <Navigate to="/" replace />;
  if (role && userRole !== role) return <Navigate to="/" replace />;
  return children;
}

function App() {
  const navigate = useNavigate();
  const isLoggedIn = !!sessionStorage.getItem('token');
  const userRole = sessionStorage.getItem('role');

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    setAuthToken(token);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }, []);

  function handleLogout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    setAuthToken(null);
    navigate('/');
  }

  return (
    <div className="container">
      <header className="app-header">
        <div>
          <p className="eyebrow">Campus Resource Manager</p>
          <h1>Lab Slot Booking</h1>
        </div>
        <nav className="nav-actions">
          {!isLoggedIn && <Link to="/">Login</Link>}
          {isLoggedIn && userRole === 'student' && <Link to="/student">Student</Link>}
          {isLoggedIn && userRole === 'admin' && <Link to="/admin">Admin</Link>}
          {isLoggedIn && <button className="secondary-button" onClick={handleLogout}>Logout</button>}
        </nav>
      </header>

      <main className="page-shell">
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn
                ? <Navigate to={userRole === 'admin' ? '/admin' : '/student'} replace />
                : <LoginPage />
            }
          />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/student" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
