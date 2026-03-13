import api from './axiosInstance';

export const fetchNotes = () => api.get('/notes');
export const fetchNoteById = (id) => api.get(`/notes/${id}`);
export const createNote = (data) => api.post('/notes', data);
export const updateNote = (id, data) => api.patch(`/notes/${id}`, data);
export const deleteNote = (id) => api.delete(`/notes/${id}`);

// Collaborators
export const getCollaborators = (noteId) => api.get(`/notes/${noteId}/collaborators`);
export const addCollaborator = (noteId, data) => api.post(`/notes/${noteId}/collaborators`, data);
export const removeCollaborator = (noteId, userId) => api.delete(`/notes/${noteId}/collaborators/${userId}`);

// Activity
export const getActivity = (noteId) => api.get(`/notes/${noteId}/activity`);

// Share
export const getShareLink = (noteId) => api.get(`/notes/${noteId}/share`);
export const regenerateShare = (noteId) => api.post(`/notes/${noteId}/share/regenerate`);
export const getNoteByToken = (token) => api.get(`/shared/${token}`);

// All users (for collaborator search)
export const getAllUsers = () => api.get('/users');
