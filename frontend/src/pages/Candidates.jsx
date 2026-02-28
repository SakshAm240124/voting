import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getCandidates, voteForCandidate } from '../api/api';
import CandidateCard from '../components/CandidateCard';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import './Candidates.css';

export default function Candidates() {
  const { user, markVoted } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selected, setSelected] = useState(null);
  const [voting, setVoting] = useState(false);

  useEffect(() => {
    getCandidates()
      .then(setCandidates)
      .catch(() => setError('Failed to load candidates'))
      .finally(() => setLoading(false));
  }, []);

  const handleVote = async () => {
    if (!selected) return;
    setVoting(true);
    try {
      await voteForCandidate(selected._id);
      markVoted();
      setSuccess(`Vote recorded for ${selected.name}!`);
      setSelected(null);
    } catch (err) {
      setError(err.message || err.error || 'Vote failed');
    } finally {
      setVoting(false);
    }
  };

  if (loading) return <div className="page"><LoadingSpinner /></div>;

  const hasVoted = user?.isvoted;

  return (
    <div className="page">
      <h1>Candidates</h1>

      {hasVoted && <div className="msg-success">You have already cast your vote. Thank you!</div>}
      {error && <div className="msg-error">{error}</div>}
      {success && <div className="msg-success">{success}</div>}

      {user?.role === 'admin' && (
        <div className="msg-error">Admins are not allowed to vote.</div>
      )}

      <div className="candidates-grid">
        {candidates.map((c) => (
          <CandidateCard
            key={c._id}
            candidate={c}
            onVote={setSelected}
            disabled={voting || user?.role === 'admin'}
            hasVoted={hasVoted}
          />
        ))}
      </div>

      {candidates.length === 0 && !loading && (
        <p className="empty-msg">No candidates registered yet.</p>
      )}

      {selected && (
        <Modal
          title="Confirm Vote"
          message={`Are you sure you want to vote for ${selected.name} (${selected.party})? This action cannot be undone.`}
          confirmLabel={voting ? 'Voting...' : 'Cast Vote'}
          onConfirm={handleVote}
          onCancel={() => setSelected(null)}
        />
      )}
    </div>
  );
}
