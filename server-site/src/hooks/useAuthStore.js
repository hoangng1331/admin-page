import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { persist, createJSONStorage } from 'zustand/middleware';
import { axiosClient } from '../libraries/axiosClient';

export const useAuthStore = create(
  devtools(
    persist(
      (set, get) => ({
        auth: null,
        login: ({ username, password, role }) => {
          // AXIOS: Call 1 api login => user
          axiosClient
            .post('/auth/login-jwt', {
              username,
              password,
              role,
            })
            .then((response) => {
              window.location.reload();
              return set({ auth: response.data }, false, { type: 'auth/login-success' });
            })
            .catch((err) => {
              return set({ auth: null }, false, { type: 'auth/login-error' });
            });
        },
        logout: () => {
          // AXIOS: Call 1 api login => user
          return set({ auth: null }, false, { type: 'auth/logout-success' });
        },
      }),
      {
        name: 'onlineshop-storage', // unique name
        storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      },
    ),
  ),
);
