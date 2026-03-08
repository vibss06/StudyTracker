import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './useAuth';

export function useRoutine(date = null) {
    const { user } = useAuth();
    const [blocks, setBlocks] = useState([]);
    const [loading, setLoading] = useState(true);

    const todayStr = (date || new Date()).toISOString().split('T')[0];

    const fetchBlocks = useCallback(async () => {
        if (!user) return;
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('routine_blocks')
                .select('*')
                .eq('user_id', user.id)
                .eq('date', todayStr)
                .order('start_hour', { ascending: true })
                .order('start_minute', { ascending: true });

            if (error) throw error;
            setBlocks(data || []);
        } catch (err) {
            console.error('Error fetching routine blocks:', err.message);
        } finally {
            setLoading(false);
        }
    }, [user, todayStr]);

    useEffect(() => {
        fetchBlocks();
    }, [fetchBlocks]);

    const addBlock = async (blockData) => {
        const { data, error } = await supabase
            .from('routine_blocks')
            .insert([{ ...blockData, user_id: user.id, date: todayStr }])
            .select()
            .single();
        if (error) throw error;
        await fetchBlocks();
        return data;
    };

    const updateBlock = async (id, updates) => {
        const { data, error } = await supabase
            .from('routine_blocks')
            .update(updates)
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single();
        if (error) throw error;
        await fetchBlocks();
        return data;
    };

    const toggleComplete = async (id, currentState) => {
        await supabase
            .from('routine_blocks')
            .update({ is_complete: !currentState })
            .eq('id', id)
            .eq('user_id', user.id);
        await fetchBlocks();
    };

    const deleteBlock = async (id) => {
        const { error } = await supabase
            .from('routine_blocks')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);
        if (error) throw error;
        await fetchBlocks();
    };

    return { blocks, loading, addBlock, updateBlock, toggleComplete, deleteBlock, refresh: fetchBlocks };
}
