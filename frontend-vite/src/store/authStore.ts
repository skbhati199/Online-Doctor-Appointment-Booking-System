import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

// Define JWT token payload structure
interface JwtPayload {
  sub: string;
  exp: number;
  iat: number;
  roles: string[];
  email: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'PATIENT' | 'DOCTOR' | 'ADMIN';
}

// State types
type AuthState = {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  tokenExpiry: number | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
};

// Actions types
type AuthActions = {
  login: (token: string, refreshToken: string | null, user: User) => void;
  refreshAuth: (newToken: string, newExpiry: number) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  shouldRefreshToken: () => boolean;
};

/**
 * Extract token expiration timestamp from JWT token
 */
const getTokenExpiry = (token: string): number | null => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.exp;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

// Define initial state
const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  tokenExpiry: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

// Create store with Zustand
export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // Login action - store auth data
      login: (token, refreshToken, user) => {
        const tokenExpiry = getTokenExpiry(token);
        set({ 
          token, 
          refreshToken,
          tokenExpiry,
          user, 
          isAuthenticated: true,
          error: null
        });
      },

      // Update token while maintaining session
      refreshAuth: (newToken, newExpiry) => {
        set({ 
          token: newToken, 
          tokenExpiry: newExpiry,
          error: null
        });
      },

      // Remove all auth data
      logout: () => set(initialState),

      // Check if token needs refreshing (5 min buffer)
      shouldRefreshToken: () => {
        const { token, tokenExpiry } = get();
        if (!token || !tokenExpiry) return false;
        
        const currentTime = Math.floor(Date.now() / 1000);
        const fiveMinutesInSeconds = 5 * 60;
        
        return tokenExpiry - currentTime < fiveMinutesInSeconds;
      },

      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        tokenExpiry: state.tokenExpiry,
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

/**
 * Helper to verify JWT token validity
 */
export const verifyToken = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp > currentTime;
  } catch (error) {
    console.error('Error verifying token:', error);
    return false;
  }
};

/**
 * Usage example:
 * 
 * // Login
 * const { login } = useAuthStore();
 * login(token, refreshToken, user);
 * 
 * // Get auth state
 * const { user, isAuthenticated } = useAuthStore();
 * 
 * // Refresh token
 * const { refreshAuth } = useAuthStore();
 * refreshAuth(newToken, newExpiry);
 * 
 * // Logout
 * const { logout } = useAuthStore();
 * logout();
 */
