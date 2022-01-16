import React, {useState, useContext, createContext} from 'react';
import {authorize} from 'react-native-app-auth';

import Spinner from '../components/Spinner';

// TODO get from env
// dropbox app config
const config = {
  clientId: '60ellsh0ff9g521',
  clientSecret: 'drjbv9o7w9enwtq',
  redirectUrl: 'com.dropboxfileexplorer://oauth',
  scopes: [],
  serviceConfiguration: {
    authorizationEndpoint: 'https://www.dropbox.com/oauth2/authorize',
    tokenEndpoint: 'https://www.dropbox.com/oauth2/token',
  },
  useNonce: false,
  usePKCE: true,
};

const authContext = createContext();

export function ProvideAuth({children}) {
  const auth = useProvideAuth();
  return (
    <authContext.Provider value={auth}>
      {auth.isLoading ? <Spinner /> : children}
    </authContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(authContext);
};

export function useProvideAuth() {
  const [token, setToken] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const signIn = () => {
    setLoading(true);
    setError(false);

    authorize(config)
      .then(result => {
        setToken(result.accessToken);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  };

  const signOut = () => {
    setToken(false);
  };

  return {
    token,
    signIn,
    signOut,
    isLoading,
    error,
  };
}
