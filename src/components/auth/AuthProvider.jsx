import { createContext, useContext } from 'react';
import { useAuthProfile } from '../../hooks/useAuthProfile.js';

const AuthContext = createContext({
  status: 'loading',
  profile: null,
  error: '',
  loginUrl: '',
  logout: () => {},
  refreshProfile: () => {}
});

export const AuthProvider = ({ children }) => {
  const auth = useAuthProfile();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
