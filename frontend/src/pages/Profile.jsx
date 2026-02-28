import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { changePassword } from '../api/api';
import './Profile.css';

export default function Profile() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const maskAadhaar = (num) => {
    const s = String(num);
    if (s.length <= 4) return s;
    return 'XXXX-XXXX-' + s.slice(-4);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword.length < 4) {
      setError('New password must be at least 4 characters');
      return;
    }

    setLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      setSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setError(err.error || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="page">
      <h1>Profile</h1>

      <div className="profile-grid">
        <div className="card profile-info">
          <h2>Personal Information</h2>
          <div className="profile-field">
            <span className="profile-label">Name</span>
            <span>{user.name}</span>
          </div>
          <div className="profile-field">
            <span className="profile-label">Age</span>
            <span>{user.age}</span>
          </div>
          <div className="profile-field">
            <span className="profile-label">Aadhaar</span>
            <span>{maskAadhaar(user.adaharcardnumber)}</span>
          </div>
          <div className="profile-field">
            <span className="profile-label">Address</span>
            <span>{user.address}</span>
          </div>
          {user.email && (
            <div className="profile-field">
              <span className="profile-label">Email</span>
              <span>{user.email}</span>
            </div>
          )}
          <div className="profile-field">
            <span className="profile-label">Role</span>
            <span className="role-badge">{user.role}</span>
          </div>
          <div className="profile-field">
            <span className="profile-label">Vote Status</span>
            <span>{user.isvoted ? 'Voted' : 'Not yet voted'}</span>
          </div>
        </div>

        <div className="card">
          <h2>Change Password</h2>

          {error && <div className="msg-error">{error}</div>}
          {success && <div className="msg-success">{success}</div>}

          <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
