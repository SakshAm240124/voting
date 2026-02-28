import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signup } from '../api/api';
import './Auth.css';

export default function Signup() {
  const [form, setForm] = useState({
    name: '', age: '', email: '', address: '', adaharcardnumber: '', password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginAction } = useAuth();
  const navigate = useNavigate();

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!/^\d{12}$/.test(form.adaharcardnumber)) {
      setError('Aadhaar number must be exactly 12 digits');
      return;
    }
    if (Number(form.age) < 18) {
      setError('You must be at least 18 years old to register');
      return;
    }

    setLoading(true);
    try {
      const body = { ...form, age: Number(form.age), adaharcardnumber: Number(form.adaharcardnumber) };
      const data = await signup(body);
      loginAction(data.response, data.token);
      navigate('/');
    } catch (err) {
      setError(err.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="auth-container">
        <div className="auth-card card">
          <h1>Create Account</h1>
          <p className="auth-subtitle">Register to participate in voting</p>

          {error && <div className="msg-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="Enter your name" value={form.name} onChange={set('name')} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Age</label>
                <input type="number" placeholder="Age" min="1" value={form.age} onChange={set('age')} required />
              </div>
              <div className="form-group">
                <label>Email (optional)</label>
                <input type="email" placeholder="Email" value={form.email} onChange={set('email')} />
              </div>
            </div>
            <div className="form-group">
              <label>Address</label>
              <input type="text" placeholder="Enter your address" value={form.address} onChange={set('address')} required />
            </div>
            <div className="form-group">
              <label>Aadhaar Number</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={12}
                placeholder="12-digit Aadhaar number"
                value={form.adaharcardnumber}
                onChange={(e) => setForm({ ...form, adaharcardnumber: e.target.value.replace(/\D/g, '') })}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Choose a password" value={form.password} onChange={set('password')} required />
            </div>
            <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
