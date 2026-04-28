import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient, setAuthToken } from '../api/client';

function RegistrationPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountType, setAccountType] = useState('student');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();

  const accountTypeLabel = accountType === 'admin' ? 'admin' : 'user';

  function validateForm() {
    if (!name.trim()) {
      setMessage('Name is required');
      setMessageType('error');
      return false;
    }

    if (!email.trim()) {
      setMessage('Email is required');
      setMessageType('error');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage('Please enter a valid email address');
      setMessageType('error');
      return false;
    }

    if (!password) {
      setMessage('Password is required');
      setMessageType('error');
      return false;
    }

    if (password.length < 8) {
      setMessage('Password must be at least 8 characters');
      setMessageType('error');
      return false;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      setMessageType('error');
      return false;
    }

    return true;
  }

  async function handleRegister(event) {
    event.preventDefault();
    setMessage('');

    if (!validateForm()) {
      return;
    }

    try {
      const response = await apiClient.post('/auth/register', {
        name,
        email,
        password,
        role: accountType,
      });

      setMessage('Registration successful! Logging you in...', 'success');
      setMessageType('success');

      // Auto-login after registration
      const loginResponse = await apiClient.post('/auth/login', { email, password });
      const token = loginResponse.data?.token;
      const role = loginResponse.data?.user?.role;

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
      if (status === 409) {
        setMessage('Email already in use. Please try another email or login.');
        setMessageType('error');
        return;
      }
      setMessage(error.response?.data?.message || 'Registration failed');
      setMessageType('error');
    }
  }

  return (
    <section className="hero-layout">
      <div className="hero-copy">
        <p className="eyebrow">Join us</p>
        <h2>Create your account and start booking lab sessions.</h2>
        <p className="muted-text">
          Register as a student to book available lab slots or as an admin to manage labs and bookings.
        </p>
      </div>

      <form onSubmit={handleRegister} className="card form auth-card">
        <h3>Create Account</h3>
        <p className="muted-text">Fill in your details to get started. Already have an account? <Link to="/">Login here</Link></p>

        <label>
          Full Name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="John Doe"
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />
        </label>

        <label>
          Account Type
          <select value={accountType} onChange={(event) => setAccountType(event.target.value)}>
            <option value="student">Student/User</option>
            <option value="admin">Admin</option>
          </select>
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Min. 8 characters"
            required
          />
        </label>

        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Confirm password"
            required
          />
        </label>

        <button type="submit">Create Account</button>

        {message && <p className={`alert alert-${messageType}`}>{message}</p>}

        <p className="muted-text text-center" style={{ marginTop: '1.5rem', fontSize: '0.9rem' }}>
          By registering, you agree to our terms of service
        </p>
      </form>
    </section>
  );
}

export default RegistrationPage;
