import { create } from 'zustand';

const useAppStore = create((set) => ({
    user: null,
    profile: null,
    session: null,
    isLoading: true,

    setUser: (user) => set({ user }),
    setProfile: (profile) => set({ profile }),
    setSession: (session) => set({ session }),
    setIsLoading: (isLoading) => set({ isLoading }),
}));

export default useAppStore;
