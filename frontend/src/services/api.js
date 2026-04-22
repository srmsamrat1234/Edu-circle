import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ============ AUTH APIs ============

export const register = (userData) => API.post('/auth/register', userData);
export const login = (credentials) => API.post('/auth/login', credentials);
export const getProfile = () => API.get('/auth/profile');

// ============ TUTOR APIs ============

// Get all tutors with filters
// Usage: getAllTutors({ subject: 'Mathematics', minPrice: 300, maxPrice: 800 })
export const getAllTutors = (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  return API.get(`/tutors${queryParams ? `?${queryParams}` : ''}`);
};

// Get single tutor by ID
export const getTutorById = (id) => API.get(`/tutors/${id}`);

// Update tutor profile (Tutor only)
export const updateTutorProfile = (data) => API.put('/tutors/profile', data);

// Add review/rating to tutor
export const addReview = (id, data) => API.post(`/tutors/${id}/review`, data);

// Get available subjects list
export const getSubjects = () => API.get('/tutors/subjects');

// Get tutors by availability
export const getAvailableTutors = (day, time) => 
  API.get(`/tutors/available?day=${day}&time=${time}`);

export default API;