import io from 'socket.io-client';
import React, { createContext, useContext } from 'react';

const AuthContext = createContext();

const getAuthContextAPI = () => {
  const providers = {
    Slack: 'slack',
    Google: 'google'
  };

  const serverOrigin = process.env.GATSBY_SERVER_ENDPOINT;
  let socket;

  const setupSocket = (token) => {
    socket = io(process.env.GATSBY_SOCKET_ENDPOINT, {
      query: {
        token
      }
    });
    socket.emit('msg', 'Hello');
  }

  const login = (provider) => {
    return new Promise((resolve, reject) => {
      // if not complete in a minute, reject.
      const timeout = setTimeout(reject, 60000);

      const messageHandler = (event) => {
        console.log('message', event);
        clearTimeout(timeout);
        if (!socket && event.origin === serverOrigin) {
          event.source.close();
          window.removeEventListener('message', messageHandler);
          setupSocket(event.data);
          return resolve(event.data);
        }
        window.removeEventListener('message', messageHandler);
        event.source.close();
        reject();
      }

      window.addEventListener('message', messageHandler);

      switch (provider) {
        case providers.Google:
          window.open(`${serverOrigin}/auth/google`);
          break;
        default:
          window.open(`${serverOrigin}/auth/google`);
      }
    });
  };

  const me = async () => {
    const res = await window.fetch(`${origin}/me`);
    console.log('me', res);
    return res;
  };

  return {
    providers,
    login,
    me
  };
}

const AuthProvider = ({ children }) => {
  const api = getAuthContextAPI();
  return (
    <AuthContext.Provider value={api}>
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => useContext(AuthContext);

export {
  AuthContext,
  AuthProvider,
  useAuth
};
