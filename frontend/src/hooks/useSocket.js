import { useEffect, useCallback } from 'react';
import { useSocket } from '../context/SocketContext';

export const useNoteSocket = (noteId, { onUpdate, onUserJoined, onUserLeft, onTyping } = {}) => {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket || !noteId) return;

    socket.emit('join-note', noteId);

    if (onUpdate) socket.on('note:update', onUpdate);
    if (onUserJoined) socket.on('user-joined', onUserJoined);
    if (onUserLeft) socket.on('user-left', onUserLeft);
    if (onTyping) socket.on('note:typing', onTyping);

    return () => {
      socket.emit('leave-note', noteId);
      socket.off('note:update', onUpdate);
      socket.off('user-joined', onUserJoined);
      socket.off('user-left', onUserLeft);
      socket.off('note:typing', onTyping);
    };
  }, [socket, noteId]);

  const emitEdit = useCallback((title, content) => {
    if (socket && noteId) {
      socket.emit('note:edit', { noteId, title, content });
    }
  }, [socket, noteId]);

  const emitTyping = useCallback(() => {
    if (socket && noteId) {
      socket.emit('note:typing', { noteId });
    }
  }, [socket, noteId]);

  return { emitEdit, emitTyping };
};
