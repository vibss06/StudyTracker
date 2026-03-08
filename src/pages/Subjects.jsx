import { useState } from 'react';
import { useSubjects } from '../hooks/useSubjects';
import { Plus, BookOpen, Clock, Trash2, X } from 'lucide-react';

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];

export default function Subjects() {
    const { subjects, loading, addSubject, deleteSubject } = useSubjects();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [color, setColor] = useState(COLORS[0]);
    const [goal, setGoal] = useState(5);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addSubject({ name, color, weekly_goal_hrs: parseFloat(goal) });
            setIsModalOpen(false);
            setName(''); setColor(COLORS[0]); setGoal(5);
        } catch (err) {
            alert('Error creating subject');
        }
    };

    if (loading) return <div className="p-8 flex justify-center"><div className="w-8 h-8 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" /></div>;

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Subjects</h1>
                    <p className="text-white/40 mt-1">Manage your study topics and weekly goals</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-500/20 font-semibold cursor-pointer"
                >
                    <Plus className="w-5 h-5" />
                    <span className="hidden sm:inline">Add Subject</span>
                </button>
            </div>

            {subjects.length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/20">
                    <BookOpen className="w-16 h-16 text-white/20 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white">No subjects yet</h3>
                    <p className="text-white/40 mt-2 max-w-sm mx-auto">Create your first subject to start tracking your study sessions and progress.</p>
                    <button onClick={() => setIsModalOpen(true)} className="mt-6 text-emerald-400 font-semibold hover:text-emerald-300 cursor-pointer">
                        Create Subject →
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subjects.map((sub) => {
                        const progress = Math.min((sub.total_hours_studied / (sub.weekly_goal_hrs || 1)) * 100, 100);
                        return (
                            <div key={sub.id} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/8 transition-all group relative hover:border-white/15">
                                <button title="Delete" onClick={() => deleteSubject(sub.id)} className="absolute top-4 right-4 p-2 text-white/30 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity bg-white/5 rounded-full cursor-pointer">
                                    <Trash2 className="w-4 h-4" />
                                </button>

                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-sm" style={{ backgroundColor: sub.color }}>
                                        {sub.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">{sub.name}</h3>
                                        <p className="text-sm text-white/40 flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5" />
                                            {sub.weekly_goal_hrs}h weekly goal
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-semibold text-white/60">{sub.total_hours_studied}h studied</span>
                                        <span className="text-white/40">{Math.round(progress)}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%`, backgroundColor: sub.color }} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add Subject Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#1a1a1a] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-white/10">
                        <div className="flex justify-between items-center p-6 border-b border-white/10">
                            <h2 className="text-xl font-bold text-white">New Subject</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white/70 bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-white/60 mb-2">Subject Name</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all" placeholder="e.g. Mathematics" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white/60 mb-2">Weekly Goal (Hours)</label>
                                <div className="flex items-center gap-4">
                                    <input type="range" min="1" max="40" step="0.5" value={goal} onChange={(e) => setGoal(e.target.value)} className="flex-1 accent-emerald-500" />
                                    <span className="font-bold text-white w-12 text-right">{goal}h</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white/60 mb-3">Color Theme</label>
                                <div className="flex flex-wrap gap-3">
                                    {COLORS.map((c) => (
                                        <button key={c} type="button" onClick={() => setColor(c)} className={`w-10 h-10 rounded-full transition-transform outline-none cursor-pointer ${color === c ? 'scale-110 ring-2 ring-offset-2 ring-offset-[#1a1a1a] ring-white/40' : 'hover:scale-105'}`} style={{ backgroundColor: c }} />
                                    ))}
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer">Create Subject</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
