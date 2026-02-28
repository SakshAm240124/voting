import { useState, useEffect } from 'react';
import { getVoteCounts } from '../api/api';
import VoteBar from '../components/VoteBar';
import LoadingSpinner from '../components/LoadingSpinner';
import './Results.css';

export default function Results() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchResults = () => {
    getVoteCounts()
      .then((data) => { setResults(data); setError(''); })
      .catch(() => setError('Failed to load results'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchResults();
    const interval = setInterval(fetchResults, 15000);
    return () => clearInterval(interval);
  }, []);

  const maxCount = results.length > 0 ? Math.max(...results.map((r) => r.count)) : 0;
  const totalVotes = results.reduce((sum, r) => sum + r.count, 0);

  if (loading) return <div className="page"><LoadingSpinner /></div>;

  return (
    <div className="page">
      <div className="results-header">
        <h1>Live Results</h1>
        <span className="results-total">Total votes: {totalVotes}</span>
      </div>

      {error && <div className="msg-error">{error}</div>}

      <div className="results-card card">
        {results.length === 0 ? (
          <p className="empty-msg">No votes recorded yet.</p>
        ) : (
          results.map((r, i) => (
            <VoteBar key={i} party={r.party} count={r.count} maxCount={maxCount} />
          ))
        )}
      </div>

      <p className="results-note">Results refresh automatically every 15 seconds.</p>
    </div>
  );
}
