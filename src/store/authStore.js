import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
 persist(
  (set, get) => ({
   user: null,
   accessToken: null,
   refreshToken: null,
   isAuthenticated: false,
   accountSetupComplete: false,
   currentSetupStep: 2,
   verifyEmail: '',

   // Get access token (convenience method)
   getAccessToken: () => get().accessToken,

   // Get refresh token (convenience method)
   getRefreshToken: () => get().refreshToken,

   // Update setup step
   updateSetupStep: (step) => {
    set({ currentSetupStep: step });
   },

   // Complete account setup
   completeSetup: () => {
    set({ accountSetupComplete: true });
   },

   // Update user and isAuthenticated together
   updateUserAndAuth: (user, isAuthenticated) => {
    // Also update wallet existence from user object
    const isWalletExist = user?.is_wallet_exist || false;
    set({ user, isAuthenticated, isWalletExist });
   },

  

   // Set access token with better naming
   setAccessToken: (accessToken) => {
    set({ accessToken });
   },

   // Set refresh token with better naming
   setRefreshToken: (refreshToken) => {
    set({ refreshToken });
   },

   // Set both tokens at once (useful after login/refresh)
   setTokens: (accessToken, refreshToken) => {
    set({ accessToken, refreshToken });
   },

   // Set both tokens at once (useful after login/refresh)
   setVerifyEmail: (email) => {
    set({ verifyEmail: email });
   },

   // Logout action - clear all auth-related state
   logout: () => {
    set({
     user: null,
     isAuthenticated: false,
     accountSetupComplete: false,
     currentSetupStep: 0,
     accessToken: null,
     refreshToken: null,
    });
   },
  }),
  {
   name: 'auth-storage',
   partialize: (state) => {
    // Only persist these specific fields to storage
    const {
     user,
     isAuthenticated,
     accountSetupComplete,
     currentSetupStep,
     accessToken,
     refreshToken,
    } = state;
    return {
     user,
     isAuthenticated,
     accountSetupComplete,
     currentSetupStep,
     accessToken,
     refreshToken,
    };
   },
  },
 ),
);

export default useAuthStore;
