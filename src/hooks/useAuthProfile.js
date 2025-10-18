import { useEffect, useState } from 'react';
import { fetchCurrentUser } from '../api/auth.js';
import { getStoredToken, setStoredToken } from '../api/client.js';

const LOGIN_URL = import.meta.env.VITE_LOGIN_URL || 'http://localhost:3020/main/login';

const DEFAULT_PROFILE = {
  name: 'Guest',
  email: '',
  tenantId: null,
  billing: null
};

const composeProfile = (apiProfile = {}) => ({
  ...DEFAULT_PROFILE,
  ...apiProfile,
  billing: apiProfile.billing || DEFAULT_PROFILE.billing
});

export const useAuthProfile = () => {
  const [state, setState] = useState({ status: 'loading', profile: null, error: '' });

  const fetchProfile = async () => {
    try {
      const apiProfile = await fetchCurrentUser();
      const composed = composeProfile(apiProfile);
      setState({ status: 'authenticated', profile: composed, error: '' });
    } catch (error) {
      console.warn('Unable to load current user', error);
      setStoredToken(null);
      setState({ status: 'unauthenticated', profile: null, error: error.message || 'Login required.' });
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get('token');
    if (tokenFromUrl) {
      setStoredToken(tokenFromUrl);
      params.delete('token');
      const newSearch = params.toString();
      const newUrl = `${window.location.pathname}${newSearch ? `?${newSearch}` : ''}${window.location.hash}`;
      window.history.replaceState({}, '', newUrl);
    }

    const token = getStoredToken();
    if (!token) {
      setState({ status: 'unauthenticated', profile: null, error: '' });
      return;
    }

    fetchProfile();
  }, []);

  const logout = () => {
    setStoredToken(null);
    window.location.href = LOGIN_URL;
  };

  const refreshProfile = () => fetchProfile();

  return { ...state, profile: state.profile ?? composeProfile(), loginUrl: LOGIN_URL, logout, refreshProfile };
};
