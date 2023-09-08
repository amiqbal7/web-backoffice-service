import { useMemo } from 'react';
import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import { useApi } from './api';

type Token = string | null;
type User = {
  id: number;
  avatar: null | {
    name: string;
    url: string;
  }
  name: string;
  email: string;
  phone: string | null;
  role: null;
} | null;

interface LoginForm {
  email: string;
  password: string;
}

// interface UpdateProfileInfoForm {
//   avatar?: FileList;
//   name: string;
//   email: string;
//   phone?: string;
// }

// interface UpdateProfilePasswordForm {
//   current_password: string;
//   password: string;
// }

interface Auth {
  token: Token;
  user: User;
  setToken: (token: Token) => void;
  setUser: (user: User) => void;
  isAuthenticated: () => boolean;
}

export const useAuth = create<Auth>()(
  devtools(
    persist((set, get) => ({
      token: null,
      user: null,
      setToken: (newToken) => set({ token: newToken }),
      setUser: (newUser) => set({ user: newUser }),
      isAuthenticated: () => !!get().token,
    }), { name: 'auth', storage: createJSONStorage(() => localStorage) })
  )
);

export function useLogin() {
  const [{ loading: loginLoading, error }, execute] = useApi({
    url: '/auth/login',
    method: 'post'
  });
  const [{ loading: getProfileInfoLoading }, getProfileInfo] = useApi({
    url: '/profile/info',
    method: 'get'
  });
  const { setToken, setUser } = useAuth();

  const login = async (data: LoginForm) => {
    const { data: { token } } = await execute({ data });
    const { data: user } = await getProfileInfo({
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setToken(token);
    setUser(user);
  };

  const loading = useMemo(() => {
    return loginLoading || getProfileInfoLoading;
  }, [loginLoading, getProfileInfoLoading]);

  return { login, loading, error };
}

export function useLogout() {
  const [{ loading, error }, execute] = useApi({
    url: '/auth/logout',
    method: 'post'
  });
  const { token, setToken, setUser } = useAuth();

  const logout = async () => {
    execute({
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setToken(null);
    setUser(null);
  };

  return { logout, loading, error };
}
