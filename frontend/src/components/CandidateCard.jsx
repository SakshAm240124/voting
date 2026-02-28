import './CandidateCard.css';

export default function CandidateCard({ candidate, onVote, disabled, hasVoted }) {
  return (
    <div className="candidate-card card">
      <div className="candidate-info">
        <h3 className="candidate-name">{candidate.name}</h3>
        <span className="party-badge">{candidate.party}</span>
      </div>
      <button
        className="btn btn-primary btn-small"
        onClick={() => onVote(candidate)}
        disabled={disabled || hasVoted}
      >
        {hasVoted ? 'Voted' : 'Vote'}
      </button>
    </div>
  );
}
