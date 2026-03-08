import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import ChatPanel from './ChatPanel';

export default function AppLayout() {
    return (
        <div className="flex h-screen bg-[#0a0a0a] overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col relative w-full h-full">
                <main className="flex-1 overflow-y-auto pb-16 md:pb-0 scroll-smooth">
                    <Outlet />
                </main>
                <BottomNav />
            </div>
            <ChatPanel />
        </div>
    );
}
