// A helper function to automatically add the auth token to fetch requests
export const fetchWithAuth = (url, options = {}) => {
  const token = localStorage.getItem('accessToken');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers, // Allow other headers to be passed
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(url, { ...options, headers });
};
