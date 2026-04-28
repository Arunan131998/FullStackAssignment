import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient, setAuthToken } from '../api/client';

function LoginPage() {
  const [email, setEmail] = useState('student@example.com');
  const [password, setPassword] = useState('Student@123');
  const [accountType, setAccountType] = useState('student');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const accountTypeLabel = accountType === 'admin' ? 'admin' : 'user';

  useEffect(() => {
    if (accountType === 'admin') {
      setEmail('admin@example.com');
      setPassword('Admin@123');
      return;
    }
    setEmail('student@example.com');
    setPassword('Student@123');
  }, [accountType]);

  async function handleLogin(event) {
    event.preventDefault();
    setMessage('');
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const token = response.data?.token;
      const role = response.data?.user?.role;

      if (role !== accountType) {
        setAuthToken(null);
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('role');
        setMessage(`No ${accountTypeLabel} account found with those credentials`);
        return;
      }

      if (token) {
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('role', role);
        setAuthToken(token);
      }
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/student');
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 401) {
        setMessage(`No ${accountTypeLabel} account found with those credentials`);
        return;
      }
      setMessage(error.response?.data?.message || 'Login failed');
    }
  }

  return (
    <section className="hero-layout">
      <div className="hero-copy">
        <p className="eyebrow">Smart scheduling</p>
        <h2>Login to manage lab bookings with less confusion.</h2>
        <p className="muted-text">
          Students can book available sessions and admins can organise labs, create slots, and avoid timing clashes.
        </p>
      </div>

      <form onSubmit={handleLogin} className="card form auth-card">
        <h3>Welcome back</h3>
        <p className="muted-text">Choose your account type and continue with the demo credentials or your own account. <Link to="/register">Create a new account</Link></p>
        <label>
          Login as
          <select value={accountType} onChange={(event) => setAccountType(event.target.value)}>
            <option value="student">User</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <label>
          Email
          <input value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </label>
        <button type="submit">Login</button>
        {message && <p className="alert alert-error">{message}</p>}
        <p className="muted-text text-center" style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </section>
  );
}

export default LoginPage;
