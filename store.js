import { create } from 'zustand';

export const useJwtStore = create(set => ({
    accessToken: '',
    setAccessToken: (accessToken) => set({ accessToken }),
    refreshToken: '',
    setRefreshToken: (refreshToken) => set({ refreshToken }),
    isAccessTokenExpired: false,
    setIsAccessTokenExpired: (expired) => set({ expired })
}));

export const usePhishmeStore = create(set => ({
    userInfo: {},
    setUserInfo: (userInfo) => set({ userInfo })
}));