import axios from 'axios';
import { dummyIdeas, dummyComments, demoUser } from './dummyData';

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL || ''}/api`,
  headers: { 'Content-Type': 'application/json' },
});

// In-memory demo data so CRUD reflects instantly without a backend
let ideas = [...dummyIdeas];
const commentsMap = { ...dummyComments };
const bookmarks = new Set();
let currentDemoUser = { ...demoUser };

export const setDemoUser = (updates) => {
  currentDemoUser = { ...currentDemoUser, ...updates };
};

const sleep = (ms = 600) => new Promise((resolve) => setTimeout(resolve, ms));

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Run once on client to restore token from storage
if (typeof window !== 'undefined') {
  const saved = localStorage.getItem('ideavault_token');
  if (saved) setAuthToken(saved);
}

export const getJWT = async (firebaseToken) => {
  try {
    const { data } = await api.post('/auth/jwt', { firebaseToken });
    return data;
  } catch (error) {
    // Fallback to demo if backend is not available
    await sleep(500);
    return {
      token: 'demo-jwt-token',
      user: { ...currentDemoUser },
    };
  }
};

export const getUserProfile = async () => {
  try {
    const { data } = await api.get('/users/me');
    return data;
  } catch (error) {
    // Fallback to demo if backend is not available
    await sleep(300);
    return { ...currentDemoUser };
  }
};

export const updateUserProfile = async (updates) => {
  try {
    const { data } = await api.put('/users/profile', updates);
    return data;
  } catch (error) {
    // Fallback to demo if backend is not available
    await sleep(500);
    currentDemoUser = { ...currentDemoUser, ...updates };
    return { ...currentDemoUser };
  }
};

const filterIdeas = (params) => {
  let result = [...ideas];
  if (params.search) {
    const q = params.search.toLowerCase();
    result = result.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.shortDescription.toLowerCase().includes(q)
    );
  }
  if (params.category) {
    result = result.filter((i) => i.category === params.category);
  }
  if (params.start || params.end) {
    const start = params.start ? new Date(params.start) : null;
    const end = params.end ? new Date(params.end) : null;
    result = result.filter((i) => {
      const d = new Date(i.createdAt);
      if (start && d < start) return false;
      if (end && d > end) return false;
      return true;
    });
  }
  return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const getIdeas = async (params = {}) => {
  try {
    const { data } = await api.get('/ideas', { params });
    return data;
  } catch (error) {
    // Fallback to demo if backend is not available
    await sleep(700);
    return filterIdeas(params);
  }
};

export const getTrendingIdeas = async (limit = 6) => {
  try {
    const { data } = await api.get('/ideas/trending', { params: { limit } });
    return data;
  } catch (error) {
    // Fallback to demo if backend is not available
    await sleep(700);
    const now = new Date();
    const score = (idea) => {
      const days = Math.max(1, (now - new Date(idea.createdAt)) / 86400000);
      return idea.likes * 10 + idea.commentsCount * 5 - days;
    };
    return [...ideas]
      .sort((a, b) => score(b) - score(a))
      .slice(0, limit);
  }
};

export const getIdea = async (id) => {
  try {
    const { data } = await api.get(`/ideas/${id}`);
    return data;
  } catch (error) {
    // Fallback to demo if backend is not available
    await sleep(500);
    const idea = ideas.find((i) => i._id === id);
    if (!idea) throw new Error('Idea not found');
    return idea;
  }
};

export const createIdea = async (payload, user) => {
  try {
    const { data } = await api.post('/ideas', payload);
    return data;
  } catch (error) {
    // Fallback to demo if backend is not available
    await sleep(700);
    const newIdea = {
      ...payload,
      _id: `idea-${Date.now()}`,
      authorId: user?.uid || 'guest',
      authorName: user?.displayName || 'Anonymous',
      authorPhoto: user?.photoURL || '',
      likes: 0,
      commentsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    ideas.unshift(newIdea);
    return newIdea;
  }
};

export const updateIdea = async (id, payload) => {
  try {
    const { data } = await api.put(`/ideas/${id}`, payload);
    return data;
  } catch (error) {
    // Fallback to demo if backend is not available
    await sleep(600);
    const idx = ideas.findIndex((i) => i._id === id);
    if (idx === -1) throw new Error('Idea not found');
    ideas[idx] = { ...ideas[idx], ...payload, updatedAt: new Date().toISOString() };
    return ideas[idx];
  }
};

export const deleteIdea = async (id) => {
  try {
    const { data } = await api.delete(`/ideas/${id}`);
    return data;
  } catch (error) {
    // Fallback to demo if backend is not available
    await sleep(500);
    ideas = ideas.filter((i) => i._id !== id);
    delete commentsMap[id];
    return { deleted: true };
  }
};

export const getMyIdeas = async (userId) => {
  try {
    const { data } = await api.get('/ideas/my');
    return data;
  } catch (error) {
    // Fallback to demo if backend is not available
    await sleep(600);
    return ideas
      .filter((i) => i.authorId === (userId || currentDemoUser.uid))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
};

export const getMyInteractions = async (userId) => {
  try {
    const { data } = await api.get('/users/interactions');
    return data;
  } catch (error) {
    // Fallback to demo if backend is not available
    await sleep(600);
    const commentedIdeaIds = new Set();
    Object.entries(commentsMap).forEach(([ideaId, comments]) => {
      if (comments.some((c) => c.authorId === (userId || currentDemoUser.uid))) {
        commentedIdeaIds.add(ideaId);
      }
    });
    return ideas
      .filter((i) => commentedIdeaIds.has(i._id))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
};

export const getComments = async (ideaId) => {
  try {
    const { data } = await api.get(`/ideas/${ideaId}/comments`);
    return data;
  } catch (error) {
    // Fallback to demo if backend is not available
    await sleep(400);
    return commentsMap[ideaId] || [];
  }
};

export const addComment = async (ideaId, text, user) => {
  try {
    const { data } = await api.post(`/ideas/${ideaId}/comments`, { text });
    return data;
  } catch (error) {
    // Fallback to demo if backend is not available
    await sleep(400);
    const comment = {
      _id: `c-${Date.now()}`,
      ideaId,
      authorId: user?.uid || 'guest',
      authorName: user?.displayName || 'Anonymous',
      text,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    if (!commentsMap[ideaId]) commentsMap[ideaId] = [];
    commentsMap[ideaId].push(comment);
    const idea = ideas.find((i) => i._id === ideaId);
    if (idea) idea.commentsCount += 1;
    return comment;
  }
};

export const updateComment = async (ideaId, commentId, text) => {
  try {
    const { data } = await api.put(`/ideas/${ideaId}/comments/${commentId}`, { text });
    return data;
  } catch (error) {
    // Fallback to demo if backend is not available
    await sleep(400);
    const list = commentsMap[ideaId] || [];
    const idx = list.findIndex((c) => c._id === commentId);
    if (idx === -1) throw new Error('Comment not found');
    list[idx] = { ...list[idx], text, updatedAt: new Date().toISOString() };
    return list[idx];
  }
};

export const deleteComment = async (ideaId, commentId) => {
  try {
    const { data } = await api.delete(`/ideas/${ideaId}/comments/${commentId}`);
    return data;
  } catch (error) {
    // Fallback to demo if backend is not available
    await sleep(400);
    const list = commentsMap[ideaId] || [];
    commentsMap[ideaId] = list.filter((c) => c._id !== commentId);
    const idea = ideas.find((i) => i._id === ideaId);
    if (idea) idea.commentsCount = Math.max(0, idea.commentsCount - 1);
    return { deleted: true };
  }
};

export const toggleLike = async (ideaId) => {
  try {
    const { data } = await api.post(`/ideas/${ideaId}/like`);
    return data;
  } catch (error) {
    // Fallback to demo if backend is not available
    await sleep(300);
    const idea = ideas.find((i) => i._id === ideaId);
    if (!idea) throw new Error('Idea not found');
    idea.likes += 1;
    return { likes: idea.likes };
  }
};

export const toggleBookmark = async (ideaId) => {
  try {
    const { data } = await api.post(`/bookmarks/${ideaId}`);
    return data;
  } catch (error) {
    // Fallback to demo if backend is not available
    await sleep(300);
    if (bookmarks.has(ideaId)) bookmarks.delete(ideaId);
    else bookmarks.add(ideaId);
    return { bookmarked: bookmarks.has(ideaId) };
  }
};

export const getBookmarks = async () => {
  try {
    const { data } = await api.get('/bookmarks');
    return data;
  } catch (error) {
    // Fallback to demo if backend is not available
    await sleep(400);
    return ideas.filter((i) => bookmarks.has(i._id));
  }
};

export default api;
