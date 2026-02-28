import { useState, useEffect } from 'react';
import { getCandidates, createCandidate, updateCandidate, deleteCandidate } from '../api/api';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import './AdminDashboard.css';

const emptyForm = { name: '', party: '', age: '' };

export default function AdminDashboard() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    getCandidates()
      .then(setCandidates)
      .catch(() => setError('Failed to load candidates'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    const body = { ...form, age: Number(form.age) };
    try {
      if (editingId) {
        await updateCandidate(editingId, body);
        setSuccess('Candidate updated!');
      } else {
        await createCandidate(body);
        setSuccess('Candidate added!');
      }
      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.error || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (c) => {
    setEditingId(c._id);
    setForm({ name: c.name, party: c.party, age: c.age || '' });
    setError('');
    setSuccess('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setError('');
    setSuccess('');
    try {
      await deleteCandidate(deleteTarget._id);
      setSuccess('Candidate deleted!');
      setDeleteTarget(null);
      load();
    } catch (err) {
      setError(err.error || 'Delete failed');
    }
  };

  if (loading) return <div className="page"><LoadingSpinner /></div>;

  return (
    <div className="page">
      <h1>Admin Dashboard</h1>

      {error && <div className="msg-error">{error}</div>}
      {success && <div className="msg-success">{success}</div>}

      <div className="admin-grid">
        <div className="card admin-form-card">
          <h2>{editingId ? 'Edit Candidate' : 'Add Candidate'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input type="text" value={form.name} onChange={set('name')} required />
            </div>
            <div className="form-group">
              <label>Party</label>
              <input type="text" value={form.party} onChange={set('party')} required />
            </div>
            <div className="form-group">
              <label>Age</label>
              <input type="number" min="1" value={form.age} onChange={set('age')} required />
            </div>
            <div className="admin-form-actions">
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Saving...' : editingId ? 'Update' : 'Add Candidate'}
              </button>
              {editingId && (
                <button type="button" className="btn btn-secondary" onClick={cancelEdit}>Cancel</button>
              )}
            </div>
          </form>
        </div>

        <div className="admin-list">
          <h2>Candidates ({candidates.length})</h2>
          {candidates.length === 0 ? (
            <p className="empty-msg">No candidates yet.</p>
          ) : (
            candidates.map((c) => (
              <div key={c._id} className="admin-candidate card">
                <div>
                  <strong>{c.name}</strong>
                  <span className="party-badge">{c.party}</span>
                </div>
                <div className="admin-candidate-actions">
                  <button className="btn btn-secondary btn-small" onClick={() => startEdit(c)}>Edit</button>
                  <button className="btn btn-danger btn-small" onClick={() => setDeleteTarget(c)}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {deleteTarget && (
        <Modal
          title="Delete Candidate"
          message={`Are you sure you want to delete ${deleteTarget.name} (${deleteTarget.party})?`}
          confirmLabel="Delete"
          danger
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
