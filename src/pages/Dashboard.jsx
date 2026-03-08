import { useDashboardData } from '../hooks/useDashboardData';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, CalendarCheck, CheckSquare, Flame, Play, Target } from 'lucide-react';
import AnimatedGenerateButton from '../components/ui/animated-generate-button';

export default function Dashboard() {
    const { profile } = useAuth();
    const { data, loading } = useDashboardData();
    const navigate = useNavigate();

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    const todayStr = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date());

    if (loading || !data) {
        return <div className="p-8 flex justify-center"><div className="w-8 h-8 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" /></div>;
    }

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 relative">
            {/* Subtle gradient mesh */}
            <div className="fixed top-0 right-0 w-96 h-96 bg-emerald-500/3 rounded-full blur-3xl pointer-events-none" />
            <div className="fixed bottom-0 left-1/3 w-96 h-96 bg-blue-500/3 rounded-full blur-3xl pointer-events-none" />

            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
                <div>
                    <h1 className="text-3xl font-bold text-white">
                        {getGreeting()}, <span className="text-emerald-400">{profile?.name?.split(' ')[0] || 'Student'}</span>!
                    </h1>
                    <p className="text-white/40 mt-1 font-medium">{todayStr}</p>
                </div>
                <AnimatedGenerateButton
                    labelIdle="Start Session"
                    labelActive="Starting..."
                    highlightHueDeg={140}
                    onClick={() => navigate('/timer')}
                />
            </div>

            {/* Daily Goal & Streak */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
                <div className="lg:col-span-2 bg-white/5 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-white/10 relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex justify-between items-end mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-white/90 flex items-center gap-2">
                                    <Target className="w-5 h-5 text-emerald-400" />
                                    Daily Goal
                                </h3>
                                <p className="text-4xl font-black text-white mt-2">
                                    {data.todayHours} <span className="text-lg text-white/40 font-medium">/ {profile?.daily_goal_hrs || 2}h</span>
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-bold text-emerald-400">{Math.round(data.progressPercent)}%</span>
                            </div>
                        </div>

                        <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-1000 ease-out shadow-sm shadow-emerald-500/30"
                                style={{ width: `${data.progressPercent}%` }}
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 rounded-3xl p-6 border border-orange-500/20 flex flex-col justify-center items-center text-center backdrop-blur-sm">
                    <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center border border-orange-500/20 mb-3">
                        <Flame className="w-8 h-8 text-orange-400 fill-current" />
                    </div>
                    <h3 className="text-lg font-bold text-orange-300">Current Streak</h3>
                    <p className="text-3xl font-black text-orange-400 mt-1">{data.currentStreak} <span className="text-base font-medium text-orange-300/60">days</span></p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 flex items-center gap-4 hover:bg-white/8 transition-all hover:border-white/15">
                    <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center border border-blue-500/20">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-white/40">Weekly Hours</p>
                        <p className="text-2xl font-bold text-white">{data.totalWeeklyHours}h</p>
                    </div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 flex items-center gap-4 hover:bg-white/8 transition-all hover:border-white/15">
                    <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center border border-emerald-500/20">
                        <CalendarCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-white/40">Total Sessions</p>
                        <p className="text-2xl font-bold text-white">{data.sessionsCompleted}</p>
                    </div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 flex items-center gap-4 hover:bg-white/8 transition-all hover:border-white/15">
                    <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-xl flex items-center justify-center border border-purple-500/20">
                        <CheckSquare className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-white/40">Pending Tasks</p>
                        <p className="text-2xl font-bold text-white">{data.pendingTasks}</p>
                    </div>
                </div>
            </div>

            {/* Today's Sessions List */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden relative z-10">
                <div className="px-6 py-5 border-b border-white/10 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-white">Today's Sessions</h2>
                    <Link to="/progress" className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors">View All</Link>
                </div>
                <div className="divide-y divide-white/5">
                    {data.todaySessions.length === 0 ? (
                        <div className="p-8 text-center text-white/40">
                            No sessions logged today yet. Open the timer to start!
                        </div>
                    ) : (
                        data.todaySessions.map(session => (
                            <div key={session.id} className="p-6 flex items-center justify-between hover:bg-white/3 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-3 h-12 rounded-full" style={{ backgroundColor: session.subjects?.color || '#555' }} />
                                    <div>
                                        <h4 className="font-bold text-white">{session.subjects?.name || 'Deleted Subject'}</h4>
                                        <p className="text-sm text-white/40">{new Date(session.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {session.duration_mins} mins</p>
                                    </div>
                                </div>
                                {session.notes && (
                                    <div className="hidden md:block text-sm text-white/30 max-w-sm truncate">
                                        "{session.notes}"
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
