const BASE = '';

async function request(url, options = {}) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(BASE + url, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw { status: res.status, ...(typeof data === 'object' ? data : { error: data }) };
  return data;
}

// Auth
export const signup = (body) => request('/user/signup', { method: 'POST', body: JSON.stringify(body) });
export const login = (adaharcardnumber, password) =>
  request('/user/login', { method: 'POST', body: JSON.stringify({ adaharcardnumber, password }) });
export const getProfile = () => request('/user/profile');
export const changePassword = (currentPassword, newPassword) =>
  request('/user/profile/password', { method: 'PUT', body: JSON.stringify({ currentPassword, newPassword }) });

// Candidates
export const getCandidates = () => request('/candidate/');
export const createCandidate = (body) =>
  request('/candidate/', { method: 'POST', body: JSON.stringify(body) });
export const updateCandidate = (id, body) =>
  request(`/candidate/${id}`, { method: 'PUT', body: JSON.stringify(body) });
export const deleteCandidate = (id) =>
  request(`/candidate/${id}`, { method: 'DELETE' });

// Voting
export const voteForCandidate = (id) => request(`/candidate/vote/${id}`);
export const getVoteCounts = () => request('/candidate/vote/count');
