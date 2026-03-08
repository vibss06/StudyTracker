import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';
import { Target, Plus, CheckCircle2, Circle, Trash2, X } from 'lucide-react';

export default function Goals() {
    const { user } = useAuth();
    const [goals, setGoals] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [subjectId, setSubjectId] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [urgency, setUrgency] = useState('Medium');

    useEffect(() => { fetchGoalsAndSubjects(); }, [user]);

    const fetchGoalsAndSubjects = async () => {
        if (!user) return;
        try {
            setLoading(true);
            const [goalsRes, subRes] = await Promise.all([
                supabase.from('goals').select('*, subjects(name, color)').eq('user_id', user.id).order('due_date', { ascending: true }),
                supabase.from('subjects').select('id, name').eq('user_id', user.id)
            ]);
            setGoals(goalsRes.data || []);
            setSubjects(subRes.data || []);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    const handleAddGoal = async (e) => {
        e.preventDefault();
        try {
            await supabase.from('goals').insert({ user_id: user.id, title, subject_id: subjectId || null, due_date: dueDate || null, urgency });
            setIsModalOpen(false);
            setTitle(''); setSubjectId(''); setDueDate(''); setUrgency('Medium');
            fetchGoalsAndSubjects();
        } catch (err) { alert("Failed to add goal"); }
    };

    const toggleComplete = async (id, currentStatus) => {
        await supabase.from('goals').update({ is_complete: !currentStatus }).eq('id', id);
        fetchGoalsAndSubjects();
    };

    const deleteGoal = async (id) => {
        await supabase.from('goals').delete().eq('id', id);
        fetchGoalsAndSubjects();
    };

    const getUrgencyColor = (urg) => {
        if (urg === 'High') return 'text-red-400 bg-red-500/10 border-red-500/20';
        if (urg === 'Low') return 'text-green-400 bg-green-500/10 border-green-500/20';
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    };

    if (loading) return <div className="p-8 flex justify-center"><div className="w-8 h-8 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" /></div>;

    const incompleteGoals = goals.filter(g => !g.is_complete);
    const completeGoals = goals.filter(g => g.is_complete);

    return (
        <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Goals</h1>
                    <p className="text-white/40 mt-1">Set targets and track your milestones</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-500/20 font-semibold cursor-pointer">
                    <Plus className="w-5 h-5" />
                    <span className="hidden sm:inline">New Goal</span>
                </button>
            </div>

            <div className="grid gap-6">
                <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Target className="w-6 h-6 text-emerald-400" />
                        Active Goals
                    </h2>
                    {incompleteGoals.length === 0 ? (
                        <p className="text-white/40 text-center py-6">No active goals. Time to set some new targets!</p>
                    ) : (
                        <div className="space-y-4">
                            {incompleteGoals.map(goal => {
                                const isOverdue = goal.due_date && new Date(goal.due_date) < new Date() && new Date(goal.due_date).getDate() !== new Date().getDate();
                                return (
                                    <div key={goal.id} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group">
                                        <button onClick={() => toggleComplete(goal.id, goal.is_complete)} className="mt-1 text-white/30 hover:text-emerald-400 transition-colors cursor-pointer">
                                            <Circle className="w-6 h-6" />
                                        </button>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-white text-lg">{goal.title}</h3>
                                            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
                                                {goal.subjects && (
                                                    <span className="flex items-center gap-1.5 font-medium px-2.5 py-1 rounded-lg bg-white/5" style={{ color: goal.subjects.color }}>
                                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: goal.subjects.color }} />
                                                        {goal.subjects.name}
                                                    </span>
                                                )}
                                                <span className={`px-2.5 py-1 rounded-lg border font-medium ${getUrgencyColor(goal.urgency)}`}>{goal.urgency} Priority</span>
                                                {goal.due_date && (
                                                    <span className={`px-2.5 py-1 rounded-lg font-medium ${isOverdue ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-white/5 text-white/50'}`}>
                                                        Due: {new Date(goal.due_date).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <button onClick={() => deleteGoal(goal.id)} className="p-2 text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity bg-white/5 hover:bg-red-500/10 rounded-xl cursor-pointer">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {completeGoals.length > 0 && (
                    <div className="bg-white/3 rounded-3xl p-6 border border-white/5">
                        <h2 className="text-xl font-bold text-white/60 mb-6 flex items-center gap-2">
                            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                            Completed Goals
                        </h2>
                        <div className="space-y-4">
                            {completeGoals.map(goal => (
                                <div key={goal.id} className="flex items-start gap-4 p-4 rounded-2xl opacity-50 hover:opacity-80 transition-opacity group">
                                    <button onClick={() => toggleComplete(goal.id, goal.is_complete)} className="mt-1 text-emerald-500 transition-colors cursor-pointer">
                                        <CheckCircle2 className="w-6 h-6" />
                                    </button>
                                    <div className="flex-1 line-through text-white/40">
                                        <h3 className="font-bold text-lg">{goal.title}</h3>
                                    </div>
                                    <button onClick={() => deleteGoal(goal.id)} className="p-2 text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity bg-white/5 hover:bg-red-500/10 rounded-xl cursor-pointer">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#1a1a1a] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-white/10">
                        <div className="flex justify-between items-center p-6 border-b border-white/10">
                            <h2 className="text-xl font-bold text-white">New Goal</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white/70 bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors cursor-pointer"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleAddGoal} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-white/60 mb-2">Goal Title</label>
                                <input type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Finish Chapter 4" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:ring-2 focus:ring-emerald-500/50 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white/60 mb-2">Link to Subject (Optional)</label>
                                <select value={subjectId} onChange={e => setSubjectId(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-emerald-500/50 outline-none">
                                    <option value="" className="bg-[#1a1a1a]">None</option>
                                    {subjects.map(s => <option key={s.id} value={s.id} className="bg-[#1a1a1a]">{s.name}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-white/60 mb-2">Due Date</label>
                                    <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-emerald-500/50 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/60 mb-2">Urgency</label>
                                    <select value={urgency} onChange={e => setUrgency(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-emerald-500/50 outline-none">
                                        <option value="Low" className="bg-[#1a1a1a]">Low</option>
                                        <option value="Medium" className="bg-[#1a1a1a]">Medium</option>
                                        <option value="High" className="bg-[#1a1a1a]">High</option>
                                    </select>
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-500/20 mt-2 cursor-pointer">Save Goal</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
