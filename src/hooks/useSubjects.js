import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './useAuth';

export function useSubjects() {
    const { user } = useAuth();
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSubjects = useCallback(async () => {
        if (!user) return;
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('subjects')
                .select(`
          *,
          sessions ( duration_mins, date )
        `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Calculate weekly progress for each subject
            // In a real app we'd filter sessions by current week, but for now we sum all
            const processed = data.map(sub => {
                const totalMins = sub.sessions?.reduce((acc, curr) => acc + (curr.duration_mins || 0), 0) || 0;
                return {
                    ...sub,
                    total_hours_studied: +(totalMins / 60).toFixed(1)
                };
            });

            setSubjects(processed);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchSubjects();
    }, [fetchSubjects]);

    const addSubject = async (subjectData) => {
        const { data, error } = await supabase
            .from('subjects')
            .insert([{ ...subjectData, user_id: user.id }])
            .select()
            .single();
        if (error) throw error;
        await fetchSubjects();
        return data;
    };

    const updateSubject = async (id, updates) => {
        const { data, error } = await supabase
            .from('subjects')
            .update(updates)
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single();
        if (error) throw error;
        await fetchSubjects();
        return data;
    };

    const deleteSubject = async (id) => {
        const { error } = await supabase
            .from('subjects')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);
        if (error) throw error;
        await fetchSubjects();
    };

    return { subjects, loading, error, addSubject, updateSubject, deleteSubject, refresh: fetchSubjects };
}
