import useAuthStore from '@/store/authStore';
import axios from 'axios'; // Adjust import path as needed

// const baseUrl = 'https://kormart-api.onrender.com/api/v1';
const baseUrl = 'https://jokopaul-001-site5.stempurl.com/api/v1';
// Use environment variable if available
// import.meta.REACT_APP_API_URL ||
// Create axios instance
export const apiWithAuth = axios.create({
 baseURL: baseUrl,
//  timeout: 30000,
 headers: {
  'Content-Type': 'application/json',
 },
});

export const apiWithoutAuth = axios.create({
 baseURL: baseUrl,
//  timeout: 30000,
 headers: {
  'Content-Type': 'application/json',
 },
});

// Request interceptor for adding auth token
apiWithAuth.interceptors.request.use(
 (config) => {
  // Access store state directly using getState() - this is not a React hook
  const token = useAuthStore.getState().accessToken;
  if (token) {
   config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
 },
 (error) => Promise.reject(error),
);

// Response interceptor for handling token refresh
apiWithAuth.interceptors.response.use(
 (response) => response,
 async (error) => {
  const originalRequest = error.config;

  // If error is 401 and we haven't tried to refresh token yet
  if (error.response?.status === 401 && !originalRequest._retry) {
   originalRequest._retry = true;

   try {
    // Access store state directly using getState()
    const refreshTokenValue = useAuthStore.getState().refreshToken;

    if (!refreshTokenValue) {
     // No refresh token available, logout user
     useAuthStore.getState().logout();
     window.location.href = '/login';
     return Promise.reject(error);
    }

    // Try to refresh the token
    const { data: response } = await axios.post(
     `${baseUrl}/auth/refresh-token`,
     { refreshToken: refreshTokenValue },
    );

    // If token refresh was successful
    if (response.accessToken) {
     // Update tokens in the store
     if (response.refreshToken) {
      useAuthStore
       .getState()
       .setTokens(response.accessToken, response.refreshToken);
     } else {
      useAuthStore.getState().setAccessToken(response.accessToken);
     }

     // Update the authorization header
     originalRequest.headers.Authorization = `Bearer ${response.accessToken}`;
     return api(originalRequest);
    }
   } catch (refreshError) {
    // If refresh token is expired or invalid, logout user
    console.error('Token refresh failed:', refreshError);
    useAuthStore.getState().logout();
    window.location.href = '/login';
    return Promise.reject(refreshError);
   }
  }

  return Promise.reject(error);
 },
);

export default apiWithAuth;
