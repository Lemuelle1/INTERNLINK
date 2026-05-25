const BASE_URL = 'http://localhost:5000/api'; // change to production URL when deploying

const getToken = () => localStorage.getItem('token');

const api = {
  get: (endpoint) =>
    fetch(`${BASE_URL}${endpoint}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    }).then((r) => r.json()),

  post: (endpoint, data) =>
    fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  put: (endpoint, data) =>
    fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  patch: (endpoint, data) =>
    fetch(`${BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  delete: (endpoint) =>
    fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getToken()}` },
    }).then((r) => r.json()),

  upload: (endpoint, formData) =>
    fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    }).then((r) => r.json()),
};

export default api;
