import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Conference Registration APIs
export const registerForConference = async (data) => {
  const response = await apiClient.post('/registrations/conference', data);
  return response.data;
};

export const getAllRegistrations = async () => {
  const response = await apiClient.get('/registrations');
  return response.data;
};

export const updateRegistrationStatus = async (registrationId, status) => {
  const response = await apiClient.put(`/registrations/${registrationId}/status`, null, {
    params: { status }
  });
  return response.data;
};

// Payment APIs
export const initializePayment = async (data) => {
  const response = await apiClient.post('/payments/initialize', data);
  return response.data;
};

export const verifyPayment = async (reference) => {
  const response = await apiClient.post('/payments/verify', { reference });
  return response.data;
};

// Contact Form APIs
export const submitContactForm = async (data) => {
  const response = await apiClient.post('/contact', data);
  return response.data;
};

export const getAllMessages = async () => {
  const response = await apiClient.get('/contact');
  return response.data;
};

export const updateMessageStatus = async (messageId, status) => {
  const response = await apiClient.put(`/contact/${messageId}/status`, null, {
    params: { status }
  });
  return response.data;
};

// Authentication APIs
export const adminLogin = async (credentials) => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};

export const verifyAuth = async () => {
  const response = await apiClient.get('/auth/verify');
  return response.data;
};

// Dashboard APIs
export const getDashboardStats = async () => {
  const response = await apiClient.get('/admin/stats');
  return response.data;
};

export default apiClient;
