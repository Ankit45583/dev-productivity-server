const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const get = async (path) => {
  const res  = await fetch(`${BASE_URL}${path}`);
  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.error || `HTTP ${res.status}`);
  }
  return json.data;
};

export const fetchMetrics  = () => get('/metrics');
export const fetchInsights = () => get('/insights');