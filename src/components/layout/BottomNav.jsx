import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Book, Timer, TrendingUp, ListTodo } from 'lucide-react';

const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Planner', path: '/planner', icon: Calendar },
    { name: 'Timer', path: '/timer', icon: Timer },
    { name: 'Subjects', path: '/subjects', icon: Book },
    { name: 'Progress', path: '/progress', icon: TrendingUp },
    { name: 'Routine', path: '/routine', icon: ListTodo },
];

export default function BottomNav() {
    const location = useLocation();

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0f0f0f]/95 backdrop-blur-xl border-t border-white/5 pb-safe z-50">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname.startsWith(item.path);
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive ? 'text-emerald-400' : 'text-white/40 hover:text-white/70'
                                }`}
                        >
                            <Icon className={`w-6 h-6 ${isActive && item.name === 'Timer' ? 'animate-pulse' : ''}`} />
                            <span className="text-[10px] font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
