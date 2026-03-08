import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Book, Timer, TrendingUp, Target, Settings, LogOut, ListTodo } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import { supabase } from '../../lib/supabaseClient';

const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Planner', path: '/planner', icon: Calendar },
    { name: 'Subjects', path: '/subjects', icon: Book },
    { name: 'Timer', path: '/timer', icon: Timer },
    { name: 'Progress', path: '/progress', icon: TrendingUp },
    { name: 'Goals', path: '/goals', icon: Target },
    { name: 'Routine', path: '/routine', icon: ListTodo },
];

export default function Sidebar() {
    const location = useLocation();
    const profile = useAppStore((state) => state.profile);

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <aside className="hidden md:flex flex-col w-64 h-screen bg-[#0f0f0f] border-r border-white/5">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-emerald-400 flex items-center gap-2">
                    <Book className="w-6 h-6" />
                    StudyTracker
                </h1>
            </div>

            <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname.startsWith(item.path);
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                    ? 'bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20'
                                    : 'text-white/50 hover:bg-white/5 hover:text-white/80'
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-white/30'}`} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/5">
                <Link
                    to="/settings"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/50 hover:bg-white/5 hover:text-white/80 transition-all mb-1"
                >
                    <Settings className="w-5 h-5 text-white/30" />
                    Settings
                </Link>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/50 hover:bg-white/5 hover:text-white/80 transition-all"
                >
                    <LogOut className="w-5 h-5 text-white/30" />
                    Log Out
                </button>
                <div className="mt-4 flex items-center gap-3 px-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold overflow-hidden">
                        {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            profile?.name?.charAt(0) || 'U'
                        )}
                    </div>
                    <div className="flex-col hidden lg:flex">
                        <span className="text-sm font-semibold text-white/90 truncate max-w-[120px]">
                            {profile?.name || 'User'}
                        </span>
                        <span className="text-xs text-white/40">Student</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
