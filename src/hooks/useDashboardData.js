import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './useAuth';

export function useDashboardData() {
    const { user, profile } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        if (!user) return;
        setLoading(true);

        try {
            const today = new Date().toISOString().split('T')[0];

            // Get today's sessions
            const { data: todaySessions } = await supabase
                .from('sessions')
                .select(`*, subjects(name, color)`)
                .eq('user_id', user.id)
                .eq('date', today)
                .order('start_time', { ascending: false });

            // Get this week's hours (basic summation for simplicity)
            const { data: allSessions } = await supabase
                .from('sessions')
                .select('duration_mins')
                .eq('user_id', user.id);

            const totalWeeklyMinutes = allSessions?.reduce((acc, s) => acc + (s.duration_mins || 0), 0) || 0;

            // Get pending tasks
            const { count: pendingTasksCount } = await supabase
                .from('tasks')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .eq('is_complete', false);

            // Get current streak
            const { data: streakData } = await supabase
                .from('streaks')
                .select('current_streak, longest_streak')
                .eq('user_id', user.id)
                .single();

            const todayMins = todaySessions?.reduce((acc, s) => acc + (s.duration_mins || 0), 0) || 0;
            const todayHours = +(todayMins / 60).toFixed(1);
            const dailyGoal = profile?.daily_goal_hrs || 2;
            const progressPercent = Math.min((todayHours / dailyGoal) * 100, 100);

            setData({
                todaySessions: todaySessions || [],
                todayHours,
                progressPercent,
                totalWeeklyHours: +(totalWeeklyMinutes / 60).toFixed(1),
                sessionsCompleted: allSessions?.length || 0,
                pendingTasks: pendingTasksCount || 0,
                currentStreak: streakData?.current_streak || 0,
            });

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [user, profile]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, refresh: fetchData };
}
