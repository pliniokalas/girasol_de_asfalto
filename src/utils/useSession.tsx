import { createContext, useContext, useState } from 'react';
import axios from 'utils/axios';
import { IUser } from 'utils/interfaces';
import { setSessionCookie, removeSessionCookie } from 'utils/cookies';

const SessionContext = createContext({} as any);

function SessionContextProvider(props: any) {
  const { children } = props;
  const [user, setUser] = useState({} as IUser);

  async function rehydrate() {
    const resp = await axios.get('/api/users');
    setUser(resp.data);
  }

  async function login(email: string, password: string) {
    const { data } = await axios.post('/api/users/login', { email, password });
    setSessionCookie(data.token);
    await rehydrate();
  }

  function logout() {
    setUser({} as IUser);
    removeSessionCookie();
  }

  const value = {
    user,
    login,
    logout,
    rehydrate,
    setUser,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

function useSession() {
  return useContext(SessionContext);
}

export { SessionContextProvider, useSession };
