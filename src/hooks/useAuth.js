import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import useAppStore from '../store/useAppStore';

export function useAuth() {
    const setUser = useAppStore((s) => s.setUser);
    const setSession = useAppStore((s) => s.setSession);
    const setProfile = useAppStore((s) => s.setProfile);
    const setIsLoading = useAppStore((s) => s.setIsLoading);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setIsLoading(false);
            }
        }).catch((err) => {
            console.error('Failed to get session:', err);
            setIsLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setProfile(null);
                setIsLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (!error && data) {
                setProfile(data);
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Return individual selectors to avoid creating new object references
    const user = useAppStore((s) => s.user);
    const profile = useAppStore((s) => s.profile);
    const session = useAppStore((s) => s.session);
    const isLoading = useAppStore((s) => s.isLoading);

    return { user, profile, session, isLoading };
}
