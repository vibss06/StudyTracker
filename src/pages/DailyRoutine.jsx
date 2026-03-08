import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRoutine } from '../hooks/useRoutine';
import { Plus, CheckCircle2, Circle, Clock, Trash2, X, ListTodo, Activity } from 'lucide-react';

const PRESET_COLORS = [
    '#22c55e', '#3b82f6', '#8b5cf6', '#f97316',
    '#14b8a6', '#ec4899', '#ef4444', '#eab308',
];

const HOURS = Array.from({ length: 18 }, (_, i) => i + 6);

function formatTime(hour, minute) {
    const h = hour % 12 || 12;
    const ampm = hour < 12 ? 'AM' : 'PM';
    return `${h}:${String(minute).padStart(2, '0')} ${ampm}`;
}

function formatHourLabel(hour) {
    const h = hour % 12 || 12;
    const ampm = hour < 12 ? 'AM' : 'PM';
    return `${h} ${ampm}`;
}

export default function DailyRoutine() {
    const { profile } = useAuth();
    const { blocks, loading, addBlock, toggleComplete, deleteBlock } = useRoutine();
    const [showModal, setShowModal] = useState(false);
    const [currentTimePos, setCurrentTimePos] = useState(0);
    const [showCurrentTime, setShowCurrentTime] = useState(false);

    const [form, setForm] = useState({
        title: '', startHour: 8, startMinute: 0, endHour: 9, endMinute: 0, color: PRESET_COLORS[0],
    });

    const todayStr = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date());

    useEffect(() => {
        const update = () => {
            const now = new Date();
            const totalMin = now.getHours() * 60 + now.getMinutes();
            const startMin = 6 * 60, endMin = 23 * 60;
            if (totalMin >= startMin && totalMin <= endMin) {
                setCurrentTimePos(((totalMin - startMin) / (endMin - startMin)) * 100);
                setShowCurrentTime(true);
            } else { setShowCurrentTime(false); }
        };
        update();
        const interval = setInterval(update, 60000);
        return () => clearInterval(interval);
    }, []);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    const completedCount = blocks.filter((b) => b.is_complete).length;
    const completionPercent = blocks.length > 0 ? Math.round((completedCount / blocks.length) * 100) : 0;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title.trim()) return;
        try {
            await addBlock({ title: form.title, start_hour: form.startHour, start_minute: form.startMinute, end_hour: form.endHour, end_minute: form.endMinute, color: form.color });
            setForm({ title: '', startHour: 8, startMinute: 0, endHour: 9, endMinute: 0, color: PRESET_COLORS[0] });
            setShowModal(false);
        } catch (err) { console.error('Error adding block:', err); }
    };

    const getBlockPosition = (block) => {
        const startMin = 6 * 60, endMin = 23 * 60, totalRange = endMin - startMin;
        const blockStart = block.start_hour * 60 + block.start_minute;
        const blockEnd = block.end_hour * 60 + block.end_minute;
        const top = ((blockStart - startMin) / totalRange) * 100;
        const height = ((blockEnd - blockStart) / totalRange) * 100;
        return { top: `${top}%`, height: `${Math.max(height, 2)}%` };
    };

    if (loading) return <div className="p-8 flex justify-center"><div className="w-8 h-8 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" /></div>;

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold text-white/40 uppercase tracking-wide">{todayStr}</p>
                    <h1 className="text-3xl font-bold text-white mt-1">
                        {getGreeting()},{' '}
                        <span className="text-emerald-400">{profile?.name?.split(' ')[0] || 'Student'}</span>!
                    </h1>
                </div>
                <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-xl hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-500/20 font-semibold w-fit active:scale-95 cursor-pointer">
                    <Plus className="w-5 h-5" />
                    Add Block
                </button>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 flex items-center gap-4 hover:bg-white/8 transition-all">
                    <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center border border-blue-500/20">
                        <ListTodo className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-white/40">Total Blocks</p>
                        <p className="text-2xl font-bold text-white">{blocks.length}</p>
                    </div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 flex items-center gap-4 hover:bg-white/8 transition-all">
                    <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center border border-emerald-500/20">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-white/40">Completed</p>
                        <p className="text-2xl font-bold text-white">{completedCount}</p>
                    </div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 flex items-center gap-4 hover:bg-white/8 transition-all">
                    <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-xl flex items-center justify-center border border-purple-500/20">
                        <Activity className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-white/40">Completion</p>
                        <div className="flex items-center gap-3">
                            <p className="text-2xl font-bold text-white">{completionPercent}%</p>
                            <svg className="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
                                <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                                <circle cx="18" cy="18" r="14" fill="none" stroke="#8b5cf6" strokeWidth="3" strokeDasharray={`${completionPercent * 0.88} 88`} strokeLinecap="round" className="transition-all duration-700" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Timeline */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/10 bg-white/3 flex items-center gap-2">
                    <Clock className="w-6 h-6 text-emerald-400" />
                    <h2 className="text-xl font-bold text-white">Today's Routine</h2>
                </div>

                <div className="relative p-6" style={{ minHeight: '700px' }}>
                    {HOURS.map((hour) => {
                        const pos = ((hour - 6) / 17) * 100;
                        return (
                            <div key={hour} className="absolute left-0 right-0" style={{ top: `calc(${pos}% + 24px)` }}>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-semibold text-white/30 w-14 text-right shrink-0">{formatHourLabel(hour)}</span>
                                    <div className="flex-1 border-t border-white/5" />
                                </div>
                            </div>
                        );
                    })}

                    {showCurrentTime && (
                        <div className="absolute left-16 right-6 flex items-center z-20 pointer-events-none" style={{ top: `calc(${currentTimePos}% + 24px)` }}>
                            <div className="w-3 h-3 rounded-full bg-red-500 shadow-md shadow-red-500/30 -ml-1.5" />
                            <div className="flex-1 border-t-2 border-red-500" />
                        </div>
                    )}

                    {blocks.map((block) => {
                        const style = getBlockPosition(block);
                        return (
                            <div key={block.id}
                                className={`absolute left-20 right-6 rounded-xl px-4 py-3 flex items-start justify-between gap-2 group transition-all duration-200 hover:scale-[1.01] cursor-pointer z-10 ${block.is_complete ? 'opacity-50' : ''}`}
                                style={{
                                    top: `calc(${style.top} + 24px)`, height: style.height, minHeight: '48px',
                                    background: `linear-gradient(135deg, ${block.color}22, ${block.color}11)`,
                                    borderLeft: `4px solid ${block.color}`, border: `1px solid ${block.color}30`,
                                    borderLeftWidth: '4px',
                                }}
                            >
                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                    <button onClick={() => toggleComplete(block.id, block.is_complete)} className="mt-0.5 shrink-0 transition-transform hover:scale-110 cursor-pointer">
                                        {block.is_complete ? <CheckCircle2 className="w-5 h-5" style={{ color: block.color }} /> : <Circle className="w-5 h-5 text-white/30 hover:text-white/60" />}
                                    </button>
                                    <div className="min-w-0">
                                        <h4 className={`font-bold text-sm truncate ${block.is_complete ? 'line-through text-white/30' : 'text-white'}`}>{block.title}</h4>
                                        <p className="text-xs text-white/40 mt-0.5">{formatTime(block.start_hour, block.start_minute)} – {formatTime(block.end_hour, block.end_minute)}</p>
                                    </div>
                                </div>
                                <button onClick={() => deleteBlock(block.id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 shrink-0 cursor-pointer">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        );
                    })}

                    {blocks.length === 0 && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10">
                                <ListTodo className="w-8 h-8 text-white/20" />
                            </div>
                            <p className="text-white/40 font-medium">No routine blocks yet</p>
                            <p className="text-white/30 text-sm mt-1">Tap "Add Block" to plan your day</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Block Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1a1a1a] rounded-2xl shadow-2xl w-full max-w-md border border-white/10" style={{ animation: 'slideUp 0.25s ease-out' }}>
                        <div className="p-6 border-b border-white/10 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-white">Add Routine Block</h3>
                            <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-white/5 text-white/40 transition-colors cursor-pointer"><X className="w-5 h-5" /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-white/60 mb-1.5">Activity Title</label>
                                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Physics Study"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all" autoFocus />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-white/60 mb-1.5">Start Time</label>
                                <div className="flex gap-2">
                                    <select value={form.startHour} onChange={(e) => setForm({ ...form, startHour: Number(e.target.value) })} className="flex-1 px-3 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:ring-2 focus:ring-emerald-500/50 outline-none">
                                        {Array.from({ length: 18 }, (_, i) => i + 6).map((h) => (<option key={h} value={h} className="bg-[#1a1a1a]">{formatHourLabel(h)}</option>))}
                                    </select>
                                    <select value={form.startMinute} onChange={(e) => setForm({ ...form, startMinute: Number(e.target.value) })} className="w-24 px-3 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:ring-2 focus:ring-emerald-500/50 outline-none">
                                        {[0, 15, 30, 45].map((m) => (<option key={m} value={m} className="bg-[#1a1a1a]">:{String(m).padStart(2, '0')}</option>))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-white/60 mb-1.5">End Time</label>
                                <div className="flex gap-2">
                                    <select value={form.endHour} onChange={(e) => setForm({ ...form, endHour: Number(e.target.value) })} className="flex-1 px-3 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:ring-2 focus:ring-emerald-500/50 outline-none">
                                        {Array.from({ length: 18 }, (_, i) => i + 6).map((h) => (<option key={h} value={h} className="bg-[#1a1a1a]">{formatHourLabel(h)}</option>))}
                                    </select>
                                    <select value={form.endMinute} onChange={(e) => setForm({ ...form, endMinute: Number(e.target.value) })} className="w-24 px-3 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:ring-2 focus:ring-emerald-500/50 outline-none">
                                        {[0, 15, 30, 45].map((m) => (<option key={m} value={m} className="bg-[#1a1a1a]">:{String(m).padStart(2, '0')}</option>))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-white/60 mb-2">Color</label>
                                <div className="flex gap-3 flex-wrap">
                                    {PRESET_COLORS.map((c) => (
                                        <button key={c} type="button" onClick={() => setForm({ ...form, color: c })}
                                            className={`w-9 h-9 rounded-full transition-all duration-150 cursor-pointer ${form.color === c ? 'ring-2 ring-offset-2 ring-offset-[#1a1a1a] scale-110' : 'hover:scale-110 opacity-70 hover:opacity-100'}`}
                                            style={{ backgroundColor: c, ringColor: c }} />
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl text-white/50 font-semibold hover:bg-white/5 transition-colors cursor-pointer">Cancel</button>
                                <button type="submit" className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-500 transition-all active:scale-95 shadow-lg shadow-emerald-500/20 cursor-pointer">Add Block</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
