import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, RefreshCcw, Bell } from 'lucide-react';
import { useSubjects } from '../hooks/useSubjects';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';

export default function Timer() {
    const { user } = useAuth();
    const { subjects, loading } = useSubjects();

    const [selectedSubject, setSelectedSubject] = useState('');
    const [mode, setMode] = useState('pomodoro');
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [sessionNotes, setSessionNotes] = useState('');
    const [showEndModal, setShowEndModal] = useState(false);
    const [sessionStartTime, setSessionStartTime] = useState(null);

    const timerRef = useRef(null);

    const MODES = {
        pomodoro: 25 * 60,
        shortBreak: 5 * 60,
        longBreak: 15 * 60,
        custom: 60 * 60,
    };

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            handleComplete();
        }
        return () => clearInterval(timerRef.current);
    }, [isActive, timeLeft]);

    const toggleTimer = () => {
        if (!isActive && !sessionStartTime && mode === 'pomodoro') {
            setSessionStartTime(new Date().toISOString());
        }
        if (!isActive && !selectedSubject && mode === 'pomodoro') {
            alert("Please select a subject first!");
            return;
        }
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(MODES[mode]);
        setSessionStartTime(null);
    };

    const changeMode = (newMode) => {
        setIsActive(false);
        setMode(newMode);
        setTimeLeft(MODES[newMode]);
    };

    const endSessionEarly = () => {
        if (mode === 'pomodoro') {
            handleComplete();
        } else {
            resetTimer();
        }
    };

    const handleComplete = () => {
        setIsActive(false);
        clearInterval(timerRef.current);

        try {
            const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
            audio.play().catch(e => console.log('Audio play failed', e));
        } catch (e) { }

        if (mode === 'pomodoro' && selectedSubject) {
            setShowEndModal(true);
        } else {
            if (Notification.permission === 'granted') {
                new Notification('Break Finished!', { body: "Time to get back to work." });
            }
        }
    };

    const saveSession = async () => {
        try {
            const durationMins = Math.round((MODES.pomodoro - timeLeft) / 60) || 25;

            await supabase.from('sessions').insert({
                user_id: user.id,
                subject_id: selectedSubject,
                start_time: sessionStartTime || new Date().toISOString(),
                end_time: new Date().toISOString(),
                duration_mins: durationMins,
                notes: sessionNotes,
                date: new Date().toISOString().split('T')[0]
            });

            setShowEndModal(false);
            setSessionNotes('');
            changeMode('shortBreak');
        } catch (err) {
            alert('Failed to save session');
        }
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        if (Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    }, []);

    return (
        <div className="p-6 h-full flex flex-col items-center justify-center relative">
            <div className="max-w-xl w-full">

                {/* Mode Selector */}
                <div className="bg-white/5 backdrop-blur-sm p-2 rounded-2xl border border-white/10 flex gap-2 mb-8 mx-auto w-fit">
                    <button onClick={() => changeMode('pomodoro')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${mode === 'pomodoro' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-white/50 hover:bg-white/5'}`}>Pomodoro</button>
                    <button onClick={() => changeMode('shortBreak')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${mode === 'shortBreak' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-white/50 hover:bg-white/5'}`}>Short Break</button>
                    <button onClick={() => changeMode('longBreak')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${mode === 'longBreak' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-white/50 hover:bg-white/5'}`}>Long Break</button>
                </div>

                {/* Timer Card */}
                <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-10 border border-white/10 text-center relative overflow-hidden">

                    <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                        <div className="h-full bg-emerald-500 transition-all duration-1000 ease-linear" style={{ width: `${((MODES[mode] - timeLeft) / MODES[mode]) * 100}%` }} />
                    </div>

                    {!loading && mode === 'pomodoro' && (
                        <div className="mb-8">
                            <select
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                                className="bg-white/5 border border-white/10 text-white text-sm rounded-xl focus:ring-2 focus:ring-emerald-500/50 block w-full p-3 font-semibold mx-auto max-w-xs outline-none"
                            >
                                <option value="" disabled className="bg-[#0f0f0f]">Select a subject to study</option>
                                {subjects.map(sub => (
                                    <option key={sub.id} value={sub.id} className="bg-[#0f0f0f]">{sub.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="text-[6rem] md:text-[8rem] font-black tabular-nums tracking-tighter text-white leading-none mb-10">
                        {formatTime(timeLeft)}
                    </div>

                    <div className="flex items-center justify-center gap-4">
                        <button
                            onClick={toggleTimer}
                            className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer ${isActive ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-500/20'}`}
                        >
                            {isActive ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current ml-2" />}
                        </button>

                        <div className="flex flex-col gap-2">
                            <button onClick={resetTimer} className="p-3 bg-white/5 text-white/50 rounded-xl hover:bg-white/10 transition-colors border border-white/10 cursor-pointer" title="Reset">
                                <RefreshCcw className="w-6 h-6" />
                            </button>
                            {(isActive || timeLeft < MODES[mode]) && mode === 'pomodoro' && (
                                <button onClick={endSessionEarly} className="p-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors border border-red-500/20 cursor-pointer" title="End Session">
                                    <Square className="w-6 h-6 fill-current" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Session Complete Modal */}
            {showEndModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#1a1a1a] rounded-3xl w-full max-w-md p-8 shadow-2xl border border-white/10">
                        <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                            <Bell className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold text-center text-white mb-2">Session Complete!</h2>
                        <p className="text-center text-white/50 mb-6">Great work! Add a note to remember what you covered.</p>

                        <textarea
                            value={sessionNotes}
                            onChange={(e) => setSessionNotes(e.target.value)}
                            placeholder="What did you study during this session?"
                            className="w-full h-32 p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:ring-2 focus:ring-emerald-500/50 outline-none resize-none mb-6"
                        />

                        <div className="flex gap-3">
                            <button
                                onClick={() => { setShowEndModal(false); changeMode('shortBreak'); }}
                                className="flex-1 py-3 px-4 font-semibold text-white/60 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/10 cursor-pointer"
                            >
                                Discard
                            </button>
                            <button
                                onClick={saveSession}
                                className="flex-[2] py-3 px-4 font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                            >
                                Save to Subject
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
