import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login, getProfile } from '../api/api';
import './Auth.css';

export default function Login() {
  const [aadhaar, setAadhaar] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginAction } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!/^\d{12}$/.test(aadhaar)) {
      setError('Aadhaar number must be exactly 12 digits');
      return;
    }

    setLoading(true);
    try {
      const data = await login(Number(aadhaar), password);
      localStorage.setItem('token', data.token);
      const profile = await getProfile();
      loginAction(profile.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="auth-container">
        <div className="auth-card card">
          <h1>Login</h1>
          <p className="auth-subtitle">Sign in with your Aadhaar number</p>

          {error && <div className="msg-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Aadhaar Number</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={12}
                placeholder="Enter 12-digit Aadhaar"
                value={aadhaar}
                onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ''))}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>

          <p className="auth-footer">
            Don&apos;t have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
