import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="page">
      <section className="hero">
        <h1 className="hero-title">SakshamVote</h1>
        <p className="hero-subtitle">
          A secure, transparent, and modern digital voting platform.
          Exercise your democratic right with confidence.
        </p>

        {!user && (
          <div className="hero-actions">
            <Link to="/signup" className="btn btn-primary">Get Started</Link>
            <Link to="/login" className="btn btn-secondary">Login</Link>
          </div>
        )}
      </section>

      <div className="home-cards">
        {user && user.role === 'voter' && !user.isvoted && (
          <Link to="/candidates" className="home-card card">
            <h3>Cast Your Vote</h3>
            <p>View candidates and cast your ballot securely.</p>
          </Link>
        )}

        {user && user.role === 'voter' && user.isvoted && (
          <div className="home-card card">
            <h3>Thank You!</h3>
            <p>You have already voted. Check the live results.</p>
          </div>
        )}

        {user && user.role === 'admin' && (
          <Link to="/admin" className="home-card card">
            <h3>Admin Dashboard</h3>
            <p>Manage candidates and oversee the election.</p>
          </Link>
        )}

        <Link to="/results" className="home-card card">
          <h3>Live Results</h3>
          <p>View real-time election results as votes come in.</p>
        </Link>

        {user && (
          <Link to="/profile" className="home-card card">
            <h3>Your Profile</h3>
            <p>View your information and manage your account.</p>
          </Link>
        )}
      </div>
    </div>
  );
}
