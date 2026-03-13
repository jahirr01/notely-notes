import api from './axiosInstance';

export const searchNotes = (q) => api.get(`/search?q=${encodeURIComponent(q)}`);
