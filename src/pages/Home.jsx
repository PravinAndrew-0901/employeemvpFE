import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Briefcase, ArrowRight, ShieldCheck, Users, LayoutDashboard, BrainCircuit, Sun, Moon, Sparkles } from 'lucide-react';

const Home = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="min-h-screen bg-[var(--background)] relative overflow-x-hidden flex flex-col font-sans text-[var(--foreground)] transition-colors duration-300">
            {/* Background elements - only in dark mode */}
            {theme === 'dark' && (
                <>
                    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px] mix-blend-screen pointer-events-none"></div>
                    <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/5 blur-[120px] mix-blend-screen pointer-events-none"></div>
                </>
            )}
            
            {/* Navbar */}
            <nav className="glass-panel border-b border-[var(--border-color)] sticky top-0 z-50 backdrop-blur-xl bg-[var(--panel-bg)] shadow-lg rounded-none transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20 items-center">
                        <div className="flex items-center space-x-3 group cursor-pointer">
                            <div className="flex items-center justify-center h-11 w-11 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-xl shadow-blue-500/20 group-hover:rotate-6 transition-transform">
                                <Briefcase className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-2xl font-black tracking-tighter">Recruit<span className="text-blue-500">Pro</span></span>
                        </div>
                        <div className="flex items-center space-x-8">
                            <Link to="/job-list" className="hidden md:block text-xs font-black uppercase tracking-widest text-blue-500 hover:text-blue-400 transition-colors">Browse Jobs</Link>
                            <a href="#features" className="hidden md:block text-xs font-black uppercase tracking-widest text-[var(--muted-text)] hover:text-blue-500 transition-colors">Features</a>
                            
                            {/* Theme Toggle */}
                            <button 
                                onClick={toggleTheme}
                                className="p-2.5 rounded-xl bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--muted-text)] hover:text-blue-500 transition-all shadow-sm"
                            >
                                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                            </button>

                            <Link to="/login" className="text-xs font-black uppercase tracking-widest text-[var(--muted-text)] hover:text-blue-500 transition-colors">Sign In</Link>
                            <Link to="/register" className="hidden sm:block px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20">
                                Apply Now
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 pt-24 pb-32 lg:pt-40 lg:pb-56">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-20">
                    <div className="lg:w-1/2 text-center lg:text-left">
                        <div className="inline-flex items-center px-5 py-2.5 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-500 font-black text-[10px] uppercase tracking-widest mb-10 shadow-sm animate-bounce-slow">
                            <ShieldCheck className="h-4 w-4 mr-2" />
                            Next-Generation ATS Platform
                        </div>
                        <h1 className="text-6xl lg:text-8xl font-black tracking-tighter mb-10 leading-[0.9]">
                            Hire Faster.<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-500">Scale Better.</span>
                        </h1>
                        <p className="text-lg text-[var(--muted-text)] mb-12 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
                            The intelligent platform for modern recruiters. Automate CV parsing, manage your pipeline via interactive Kanban boards, and build a unified talent pool.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-6">
                            <Link to="/job-list" className="px-10 py-5 rounded-2xl text-sm font-black uppercase tracking-widest text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-2xl shadow-blue-500/30 flex items-center justify-center group">
                                Explore Jobs
                                <Sparkles className="ml-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                            </Link>
                            <Link to="/register" className="px-10 py-5 rounded-2xl text-sm font-black uppercase tracking-widest text-[var(--foreground)] bg-[var(--input-bg)] border border-[var(--border-color)] hover:bg-blue-500/10 hover:border-blue-500/50 transition-all flex items-center justify-center shadow-lg">
                                Join Talent Pool
                            </Link>
                        </div>
                    </div>
                    
                    <div className="lg:w-1/2 relative hidden lg:block">
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full pointer-events-none"></div>
                            <div className="glass-panel p-3 rounded-[2.5rem] border border-[var(--border-color)] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] transform rotate-3 hover:rotate-0 transition-all duration-700 relative z-10 bg-[var(--panel-bg)]">
                                <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80" alt="Dashboard Preview" className="rounded-3xl opacity-90 brightness-75 grayscale hover:grayscale-0 hover:brightness-100 transition-all duration-700" />
                            </div>
                            <div className="absolute -bottom-10 -left-10 glass-panel p-8 rounded-[2rem] border border-emerald-500/30 flex items-center gap-6 bg-[var(--panel-bg)] shadow-2xl transform -rotate-6 hover:rotate-0 transition-all duration-500 z-20">
                                <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                    <Users className="h-8 w-8 text-emerald-500" />
                                </div>
                                <div>
                                    <p className="text-3xl font-black text-[var(--foreground)] tracking-tighter">10k+</p>
                                    <p className="text-[10px] text-[var(--muted-text)] uppercase font-black tracking-widest">Candidates Processed</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-32 bg-[var(--panel-bg)] border-y border-[var(--border-color)] relative z-10 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-24">
                        <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-4">Core Ecosystem</h2>
                        <h3 className="text-4xl md:text-5xl font-black tracking-tighter text-[var(--foreground)]">Everything you need to build your empire</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {/* Feature 1 */}
                        <div className="glass-panel p-10 rounded-[2.5rem] border border-[var(--border-color)] hover:border-blue-500/50 transition-all hover:-translate-y-2 bg-[var(--input-bg)] shadow-xl">
                            <div className="h-16 w-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-8 border border-blue-500/20">
                                <BrainCircuit className="h-8 w-8 text-blue-500" />
                            </div>
                            <h4 className="text-2xl font-black text-[var(--foreground)] mb-4 tracking-tight">AI-CV Parsing</h4>
                            <p className="text-[var(--muted-text)] leading-relaxed font-medium">
                                Bulk upload hundreds of CVs. Our engine automatically extracts skills, experience, and contact details to create rich, searchable profiles.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="glass-panel p-10 rounded-[2.5rem] border border-[var(--border-color)] hover:border-emerald-500/50 transition-all hover:-translate-y-2 bg-[var(--input-bg)] shadow-xl">
                            <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-8 border border-emerald-500/20">
                                <LayoutDashboard className="h-8 w-8 text-emerald-500" />
                            </div>
                            <h4 className="text-2xl font-black text-[var(--foreground)] mb-4 tracking-tight">Visual Pipelines</h4>
                            <p className="text-[var(--muted-text)] leading-relaxed font-medium">
                                Track your entire hiring process at a glance. Move candidates from New to Hired with our interactive, drag-and-drop Kanban board view.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="glass-panel p-10 rounded-[2.5rem] border border-[var(--border-color)] hover:border-purple-500/50 transition-all hover:-translate-y-2 bg-[var(--input-bg)] shadow-xl">
                            <div className="h-16 w-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-8 border border-purple-500/20">
                                <ShieldCheck className="h-8 w-8 text-purple-500" />
                            </div>
                            <h4 className="text-2xl font-black text-[var(--foreground)] mb-4 tracking-tight">Custom RBAC</h4>
                            <p className="text-[var(--muted-text)] leading-relaxed font-medium">
                                Create custom roles like Screener or Manager. You decide exactly who can view, edit, or upload candidates within your organization.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it Works Section */}
            <section id="how-it-works" className="py-40 relative z-10 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-24">
                        <div className="lg:w-1/2">
                            <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-4">Precision Workflow</h2>
                            <h3 className="text-4xl md:text-5xl font-black tracking-tighter text-[var(--foreground)] mb-12">Streamline hiring in 3 steps</h3>
                            
                            <div className="space-y-12">
                                <div className="flex group">
                                    <div className="flex-shrink-0 mr-8">
                                        <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-blue-600 text-white font-black text-xl border-4 border-[var(--background)] shadow-xl group-hover:scale-110 transition-transform">1</div>
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-black text-[var(--foreground)] mb-2 tracking-tight group-hover:text-blue-500 transition-colors">Sourcing & Uploading</h4>
                                        <p className="text-[var(--muted-text)] font-medium leading-relaxed">Candidates apply through your public portal, or your team drops batches of resumes directly into the AI engine.</p>
                                    </div>
                                </div>
                                <div className="flex group">
                                    <div className="flex-shrink-0 mr-8">
                                        <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-blue-600 text-white font-black text-xl border-4 border-[var(--background)] shadow-xl group-hover:scale-110 transition-transform">2</div>
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-black text-[var(--foreground)] mb-2 tracking-tight group-hover:text-blue-500 transition-colors">Filtering & Review</h4>
                                        <p className="text-[var(--muted-text)] font-medium leading-relaxed">Instantly filter your database by extracted skills (React, Python). Shortlist the best fits for your active requisitions.</p>
                                    </div>
                                </div>
                                <div className="flex group">
                                    <div className="flex-shrink-0 mr-8">
                                        <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-blue-600 text-white font-black text-xl border-4 border-[var(--background)] shadow-xl group-hover:scale-110 transition-transform">3</div>
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-black text-[var(--foreground)] mb-2 tracking-tight group-hover:text-blue-500 transition-colors">Interviewing & Hiring</h4>
                                        <p className="text-[var(--muted-text)] font-medium leading-relaxed">Log calls, schedule interviews, and move candidates across the board until you extend an offer.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-1/2 w-full">
                            <div className="glass-panel p-10 rounded-[3rem] border border-[var(--border-color)] shadow-2xl bg-[var(--panel-bg)] relative overflow-hidden">
                                <div className="absolute top-[-10%] right-[-10%] w-40 h-40 bg-blue-500/10 blur-3xl rounded-full"></div>
                                <div className="space-y-6 relative z-10">
                                    <div className="flex items-center justify-between p-6 bg-[var(--input-bg)] rounded-[1.5rem] border border-[var(--border-color)] shadow-sm hover:scale-[1.02] transition-transform cursor-default">
                                        <div className="flex items-center gap-5">
                                            <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-black">JD</div>
                                            <div>
                                                <p className="text-sm font-black text-[var(--foreground)]">John Doe</p>
                                                <p className="text-[10px] text-[var(--muted-text)] font-black uppercase tracking-widest">Frontend Lead</p>
                                            </div>
                                        </div>
                                        <span className="px-4 py-1.5 text-[10px] font-black bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20 uppercase tracking-widest">Shortlisted</span>
                                    </div>
                                    <div className="flex items-center justify-between p-6 bg-[var(--input-bg)] rounded-[1.5rem] border border-[var(--border-color)] shadow-sm hover:scale-[1.02] transition-transform cursor-default">
                                        <div className="flex items-center gap-5">
                                            <div className="h-12 w-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-black">SM</div>
                                            <div>
                                                <p className="text-sm font-black text-[var(--foreground)]">Sarah Miller</p>
                                                <p className="text-[10px] text-[var(--muted-text)] font-black uppercase tracking-widest">Product Manager</p>
                                            </div>
                                        </div>
                                        <span className="px-4 py-1.5 text-[10px] font-black bg-blue-500/10 text-blue-500 rounded-full border border-blue-500/20 uppercase tracking-widest">Interviewing</span>
                                    </div>
                                    <div className="flex items-center justify-between p-6 bg-[var(--input-bg)] rounded-[1.5rem] border border-[var(--border-color)] shadow-sm opacity-50">
                                        <div className="flex items-center gap-5">
                                            <div className="h-12 w-12 rounded-xl bg-slate-500/10 text-[var(--muted-text)] flex items-center justify-center font-black">RJ</div>
                                            <div>
                                                <p className="text-sm font-black text-[var(--foreground)]">Robert Jones</p>
                                                <p className="text-[10px] text-[var(--muted-text)] font-black uppercase tracking-widest">DevOps Engineer</p>
                                            </div>
                                        </div>
                                        <span className="px-4 py-1.5 text-[10px] font-black bg-slate-500/10 text-[var(--muted-text)] rounded-full border border-slate-500/20 uppercase tracking-widest">On Hold</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 relative z-10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="glass-panel p-16 rounded-[3.5rem] border border-blue-500/30 bg-gradient-to-br from-[var(--panel-bg)] to-blue-500/5 text-center shadow-[0_50px_100px_-30px_rgba(59,130,246,0.3)] relative overflow-hidden">
                        <div className="absolute top-[-50%] left-[-10%] w-[50%] h-[150%] bg-blue-500/5 blur-[80px] rotate-12 pointer-events-none"></div>
                        <h2 className="text-4xl md:text-6xl font-black text-[var(--foreground)] mb-10 relative z-10 tracking-tighter leading-none">Ready to transform your recruitment?</h2>
                        <p className="text-xl text-[var(--muted-text)] mb-12 max-w-2xl mx-auto relative z-10 font-medium">
                            Stop managing spreadsheets and emails. Centralize your candidate tracking and pipelines today.
                        </p>
                        <div className="flex justify-center relative z-10">
                            <Link to="/job-list" className="px-12 py-6 rounded-2xl text-sm font-black uppercase tracking-[0.2em] text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-2xl shadow-blue-500/40 hover:scale-105 transform active:scale-95">
                                Access Job Board
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-[var(--border-color)] bg-[var(--panel-bg)] py-20 relative z-10 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                                <Briefcase className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-[var(--foreground)]">Recruit<span className="text-blue-500">Pro</span></span>
                        </div>
                        <div className="flex space-x-10">
                            <a href="#" className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-text)] hover:text-blue-500 transition-colors">Privacy</a>
                            <a href="#" className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-text)] hover:text-blue-500 transition-colors">Terms</a>
                            <a href="#" className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-text)] hover:text-blue-500 transition-colors">Contact</a>
                        </div>
                    </div>
                    <div className="mt-12 text-center md:text-left text-[var(--muted-text)] text-[10px] font-black uppercase tracking-[0.2em] opacity-50">
                        &copy; {new Date().getFullYear()} RecruitPro ATS MVP. Built for high-performance teams.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
