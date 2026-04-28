import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setMessage(`No ${accountTypeLabel} account found with those credentials`);
        return;
      }

      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
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
    <section>
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="card form">
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
      </form>
      {message && <p>{message}</p>}
    </section>
  );
}

export default LoginPage;
