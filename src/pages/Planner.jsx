import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';
import { Calendar as CalendarIcon, CheckSquare, Plus, Clock } from 'lucide-react';

export default function Planner() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const currentBlockDate = new Date();
    const weekStart = new Date(currentBlockDate.setDate(currentBlockDate.getDate() - currentBlockDate.getDay()));
    const weekDays = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(weekStart);
        d.setDate(d.getDate() + i);
        return d;
    });

    const [newTaskTitle, setNewTaskTitle] = useState('');

    useEffect(() => {
        if (user) fetchTasks();
    }, [user]);

    const fetchTasks = async () => {
        setLoading(true);
        const { data } = await supabase.from('tasks').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
        setTasks(data || []);
        setLoading(false);
    };

    const addTask = async (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;
        await supabase.from('tasks').insert({ user_id: user.id, title: newTaskTitle });
        setNewTaskTitle('');
        fetchTasks();
    };

    const toggleTask = async (id, is_complete) => {
        await supabase.from('tasks').update({ is_complete: !is_complete }).eq('id', id);
        fetchTasks();
    };

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto h-full flex flex-col gap-6">
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h1 className="text-3xl font-bold text-white">Planner</h1>
                    <p className="text-white/40 mt-1">Schedule your week and manage daily tasks</p>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">

                {/* Calendar View */}
                <div className="lg:col-span-3 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/3">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <CalendarIcon className="w-6 h-6 text-emerald-400" />
                            Weekly Schedule
                        </h2>
                        <span className="font-semibold text-white/40">
                            {weekStart.toLocaleDateString([], { month: 'long' })} {weekStart.getFullYear()}
                        </span>
                    </div>

                    <div className="flex-1 overflow-x-auto">
                        <div className="min-w-[800px] h-full flex">
                            {weekDays.map((date, i) => {
                                const isToday = new Date().toDateString() === date.toDateString();
                                return (
                                    <div key={i} className="flex-1 border-r border-white/5 last:border-0 flex flex-col">
                                        <div className={`p-4 text-center border-b border-white/5 ${isToday ? 'bg-emerald-500/10 border-b-emerald-500/30' : ''}`}>
                                            <div className={`text-sm font-bold ${isToday ? 'text-emerald-400' : 'text-white/40 uppercase'}`}>
                                                {date.toLocaleDateString([], { weekday: 'short' })}
                                            </div>
                                            <div className={`text-2xl font-black mt-1 ${isToday ? 'text-emerald-300' : 'text-white'}`}>
                                                {date.getDate()}
                                            </div>
                                        </div>
                                        <div className="flex-1 bg-white/[0.02] p-2 space-y-2 overflow-y-auto">
                                            {isToday && (
                                                <div className="bg-emerald-500/10 text-emerald-400 p-3 rounded-xl border border-emerald-500/20 text-xs font-semibold cursor-pointer">
                                                    <Clock className="w-3 h-3 inline mr-1" />
                                                    10:00 AM - Physics
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Task List Sidebar */}
                <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 flex flex-col overflow-hidden max-h-full">
                    <div className="p-6 border-b border-white/10 flex items-center gap-2 bg-white/3">
                        <CheckSquare className="w-6 h-6 text-emerald-400" />
                        <h2 className="text-xl font-bold text-white">To-Do List</h2>
                    </div>

                    <div className="p-4 border-b border-white/10">
                        <form onSubmit={addTask} className="relative">
                            <input
                                type="text"
                                value={newTaskTitle}
                                onChange={e => setNewTaskTitle(e.target.value)}
                                placeholder="Add a new task..."
                                className="w-full pl-4 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
                            />
                            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 cursor-pointer">
                                <Plus className="w-4 h-4" />
                            </button>
                        </form>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {loading ? (
                            <div className="text-center py-4"><div className="w-5 h-5 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mx-auto" /></div>
                        ) : tasks.length === 0 ? (
                            <p className="text-center text-white/30 text-sm mt-4">No tasks pending</p>
                        ) : (
                            tasks.map(task => (
                                <div key={task.id} className="flex items-start gap-3 group">
                                    <input
                                        type="checkbox"
                                        checked={task.is_complete}
                                        onChange={() => toggleTask(task.id, task.is_complete)}
                                        className="mt-1 w-5 h-5 rounded-md border-white/20 bg-white/5 text-emerald-500 focus:ring-emerald-500 cursor-pointer accent-emerald-500"
                                    />
                                    <span className={`text-sm leading-relaxed ${task.is_complete ? 'text-white/30 line-through' : 'text-white/80 font-medium'}`}>
                                        {task.title}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
