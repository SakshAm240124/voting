import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logoutAction } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutAction();
    setMenuOpen(false);
    navigate('/login');
  };

  const close = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-brand" onClick={close}>
          SakshamVote
        </Link>

        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span><span></span><span></span>
        </button>

        <ul className={`nav-links ${menuOpen ? 'show' : ''}`}>
          <li><Link to="/" onClick={close}>Home</Link></li>
          <li><Link to="/results" onClick={close}>Results</Link></li>

          {user && user.role === 'voter' && (
            <li><Link to="/candidates" onClick={close}>Vote</Link></li>
          )}

          {user && user.role === 'admin' && (
            <li><Link to="/admin" onClick={close}>Dashboard</Link></li>
          )}

          {user ? (
            <>
              <li><Link to="/profile" onClick={close}>Profile</Link></li>
              <li><button className="nav-logout" onClick={handleLogout}>Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login" onClick={close}>Login</Link></li>
              <li><Link to="/signup" className="btn btn-primary btn-small" onClick={close}>Sign Up</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
