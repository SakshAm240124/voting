import './VoteBar.css';

export default function VoteBar({ party, count, maxCount }) {
  const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
  return (
    <div className="vote-bar-row">
      <div className="vote-bar-label">
        <span className="vote-bar-party">{party}</span>
        <span className="vote-bar-count">{count} vote{count !== 1 ? 's' : ''}</span>
      </div>
      <div className="vote-bar-track">
        <div className="vote-bar-fill" style={{ width: `${pct}%` }}></div>
      </div>
    </div>
  );
}
