import { useContext, createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const tokenLocalStorageKey = 'access_token_tyewasd';

const initialAuthState: {
  accessToken: string | null;
  loggedIn: boolean;
  username: null | string;
  email: null | string;
  id: number | null;
} = {
  accessToken: null,
  username: null,
  email: null,
  loggedIn: false,
  id: null,
};

export const AuthContext = createContext({
  authState: { ...initialAuthState },
  login: (
    {
      accessToken,
      email,
      username,
      id,
    }: { accessToken: string; email: string; username: string; id: number },
    saveToStorage = true
  ) => {},
  logout: (message?: string) => {},
});

export const useAuthContext = () => useContext(AuthContext);

export function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authState, setAuthState] = useState({ ...initialAuthState });
  const navigate = useNavigate();

  useEffect(() => {
    let isSubscribed = true;
    try {
      const tokenFromStorage = localStorage.getItem(tokenLocalStorageKey);
      if (tokenFromStorage && tokenFromStorage.length > 20) {
        fetch(process.env.REACT_APP_BACKEND_URL + '/api/auth/check-token/', {
          headers: {
            authentication: `Bearer ${tokenFromStorage}`,
          },
        })
          .then((res) => {
            if (res.status === 404) throw new Error('404');
            if (res.status !== 200) throw new Error('Internal Error');
            return res.json();
          })
          .then((res) => {
            if (!isSubscribed) return;
            const { accessToken, username, email, id, loggedIn } = res.data;
            if (!loggedIn) throw new Error('no data');
            login({ accessToken, username, email, id }, false, false);
          })
          .catch((err) => {
            if (!isSubscribed) return;
            logout('User session expired, please log in again');
          });
      }
    } catch (err: any) {
      if(err.message === "404"){
        toast.error('Service is not available at this moment');
      }else{
        logout('Please log in');
      }
      
    }

    return () => {
      isSubscribed = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (
    {
      accessToken,
      email,
      username,
      id,
    }: { accessToken: string; email: string; username: string; id: number },
    saveToStorage = true,
    redirect = true
  ) => {
    if (!accessToken) return;
    setAuthState({
      accessToken,
      loggedIn: true,
      email,
      username,
      id,
    });

    if (saveToStorage) {
      localStorage.setItem(tokenLocalStorageKey, accessToken);
    }

    toast.success(`Logged in as ${username}`);
    if (redirect) {
      navigate('/', { replace: true });
    }
  };

  const logout = (message: string = 'User was logged out') => {
    setAuthState({ ...initialAuthState });
    localStorage.removeItem(tokenLocalStorageKey);
    setTimeout(() => {
      navigate('/login', { replace: true });
    }, 100);
    toast.error(message);
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
