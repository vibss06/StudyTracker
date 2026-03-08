import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Loader2, Sparkles, Brain, BarChart3, Lightbulb, Rocket, Zap } from 'lucide-react';

function FloatingIcon({ icon: Icon, className, style }) {
    return (
        <div className={`absolute pointer-events-none ${className}`} style={style}>
            <Icon className="w-6 h-6 text-emerald-400/20" />
        </div>
    );
}

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password
        });

        if (authError) {
            setError(authError.message);
            setLoading(false);
            return;
        }

        if (authData?.user) {
            const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                    id: authData.user.id,
                    name,
                    daily_goal_hrs: 2
                });

            if (profileError) {
                console.error('Profile creation warning:', profileError);
            }

            navigate('/dashboard');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Gradient mesh background */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/3 rounded-full blur-3xl" />
            </div>

            {/* Floating study icons */}
            <FloatingIcon icon={Sparkles} className="animate-bounce" style={{ top: '8%', left: '12%', animationDuration: '5s', animationDelay: '0s' }} />
            <FloatingIcon icon={Brain} className="animate-bounce" style={{ top: '15%', right: '18%', animationDuration: '4s', animationDelay: '1.5s' }} />
            <FloatingIcon icon={BarChart3} className="animate-bounce" style={{ bottom: '20%', left: '8%', animationDuration: '6s', animationDelay: '0.5s' }} />
            <FloatingIcon icon={Lightbulb} className="animate-bounce" style={{ bottom: '30%', right: '12%', animationDuration: '5.5s', animationDelay: '2s' }} />
            <FloatingIcon icon={Rocket} className="animate-bounce" style={{ top: '50%', left: '6%', animationDuration: '4.5s', animationDelay: '1s' }} />
            <FloatingIcon icon={Zap} className="animate-bounce" style={{ top: '40%', right: '6%', animationDuration: '5s', animationDelay: '3s' }} />

            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-[0.02]" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                backgroundSize: '60px 60px'
            }} />

            {/* Register Card */}
            <div className="w-full max-w-md relative z-10">
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="p-8 text-center border-b border-white/10">
                        <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-purple-500/20">
                            <Sparkles className="w-8 h-8 text-purple-400" />
                        </div>
                        <h1 className="text-3xl font-bold text-white">Create Account</h1>
                        <p className="mt-2 text-white/50">Start your productivity journey</p>
                    </div>

                    {/* Form */}
                    <div className="p-8">
                        <form onSubmit={handleRegister} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-2">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-white/30" />
                                    </div>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 sm:text-sm outline-none transition-all"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-2">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-white/30" />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 sm:text-sm outline-none transition-all"
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-2">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-white/30" />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 sm:text-sm outline-none transition-all"
                                        placeholder="Min 6 characters"
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-500/10 text-red-400 p-3 rounded-lg text-sm border border-red-500/20">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0a0a] focus:ring-emerald-500 transition-all disabled:opacity-70 mt-4 cursor-pointer shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 active:scale-[0.98]"
                            >
                                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Sign Up'}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-white/40">
                            Already have an account?{' '}
                            <Link to="/login" className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
                                Log in
                            </Link>
                        </p>
                    </div>
                </div>

                <p className="mt-4 text-center">
                    <Link to="/welcome" className="text-sm text-white/30 hover:text-white/60 transition-colors">
                        ← Back to home
                    </Link>
                </p>
            </div>
        </div>
    );
}
