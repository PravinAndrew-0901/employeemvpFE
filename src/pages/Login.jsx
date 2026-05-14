import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, Link } from 'react-router-dom';
import { Briefcase, ChevronRight, Sun, Moon } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const payload = await login(email, password);
            if (payload.permissions && (payload.permissions.includes('view_candidates') || payload.permissions.includes('manage_roles'))) {
                navigate('/dashboard');
            } else {
                navigate('/portal');
            }
        } catch (err) {
            setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[var(--background)] transition-colors duration-300">
            {/* Ambient Backgrounds - only in dark mode */}
            {theme === 'dark' && (
                <>
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] mix-blend-screen animate-pulse"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px] mix-blend-screen animate-pulse" style={{ animationDelay: '2s' }}></div>
                </>
            )}

            {/* Theme Toggle in Login */}
            <button 
                onClick={toggleTheme}
                className="fixed top-8 right-8 p-3 rounded-2xl bg-[var(--panel-bg)] border border-[var(--border-color)] text-[var(--muted-text)] hover:text-blue-500 transition-all z-20"
            >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <div className="max-w-md w-full space-y-8 glass-panel p-12 rounded-[2.5rem] relative z-10 m-4 shadow-2xl border border-[var(--border-color)]">
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-xl shadow-blue-500/30 mb-8 transform hover:rotate-6 transition-transform">
                        <Briefcase className="h-10 w-10 text-white" />
                    </div>
                    <h2 className="text-4xl font-black tracking-tight text-[var(--foreground)] mb-2">
                        Welcome back
                    </h2>
                    <p className="text-[var(--muted-text)] font-bold uppercase tracking-widest text-[10px] mb-8">
                        Sign in to the RecruitPro portal
                    </p>
                </div>
                
                <form className="space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="text-rose-500 text-xs font-black text-center bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl backdrop-blur-sm uppercase tracking-widest">
                            {error}
                        </div>
                    )}
                    
                    <div className="space-y-5">
                        <div>
                            <label className="text-[10px] font-black text-[var(--muted-text)] uppercase tracking-widest ml-1 mb-2 block">Email address</label>
                            <input
                                type="email"
                                required
                                className="w-full px-6 py-4 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl text-[var(--foreground)] placeholder-[var(--muted-text)] font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-inner"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-[var(--muted-text)] uppercase tracking-widest ml-1 mb-2 block">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full px-6 py-4 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl text-[var(--foreground)] placeholder-[var(--muted-text)] font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-inner"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center items-center py-5 px-6 rounded-2xl text-xs font-black uppercase tracking-widest text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all shadow-2xl shadow-blue-500/20"
                        >
                            {isLoading ? 'Authenticating...' : 'Sign in to Portal'}
                            {!isLoading && <ChevronRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </div>
                </form>

                <div className="text-center mt-10 pt-10 border-t border-[var(--border-color)]">
                    <p className="text-xs font-bold text-[var(--muted-text)]">
                        Are you a new candidate? <Link to="/register" className="font-black text-blue-500 hover:text-blue-400 transition-colors uppercase tracking-widest ml-2">Apply Now</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
