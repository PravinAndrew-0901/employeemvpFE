import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../api/axiosConfig';
import { LogOut, Briefcase, FileText, CheckCircle, User, Sun, Moon, Clock, ChevronRight, LayoutList, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const CandidatePortal = () => {
    const { logout, user } = useContext(AuthContext);
    const { theme, toggleTheme } = useTheme();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const res = await api.get('/applications/my-applications');
            setApplications(res.data);
        } catch (err) {
            console.error('Failed to fetch applications', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--background)] relative overflow-hidden transition-colors duration-300">
            {/* Background elements - only in dark mode */}
            {theme === 'dark' && (
                <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-900/10 blur-[150px] mix-blend-screen pointer-events-none"></div>
            )}
            
            <nav className="glass-panel border-b border-[var(--border-color)] sticky top-0 z-50 bg-[var(--panel-bg)] shadow-lg rounded-none transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 sm:px-10">
                    <div className="flex justify-between h-20 items-center">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center justify-center h-11 w-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-xl shadow-emerald-500/20">
                                <Briefcase className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-2xl font-black tracking-tighter">Candidate<span className="text-emerald-500">Portal</span></span>
                        </div>
                        <div className="flex items-center space-x-6">
                            <Link to="/job-list" className="hidden md:block text-xs font-black uppercase tracking-widest text-[var(--muted-text)] hover:text-emerald-500 transition-colors">Find Jobs</Link>
                            
                            {/* Theme Toggle */}
                            <button 
                                onClick={toggleTheme}
                                className="p-3 rounded-2xl bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--muted-text)] hover:text-emerald-500 transition-all shadow-sm"
                            >
                                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                            </button>

                            <button
                                onClick={logout}
                                className="flex items-center px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500/10 transition-all border border-rose-500/20 shadow-sm"
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto py-16 px-6 relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-10 mb-16">
                    <div className="h-28 w-28 rounded-[2rem] bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center border-4 border-white/10 shadow-2xl shrink-0">
                        <User className="h-14 w-14 text-white" />
                    </div>
                    <div className="text-center md:text-left">
                        <h2 className="text-4xl font-black mb-2 tracking-tighter">Welcome back, {user?.sub || 'Candidate'}</h2>
                        <p className="text-[var(--muted-text)] font-medium text-lg">Your talent dashboard and career progress.</p>
                    </div>
                    <div className="md:ml-auto flex gap-4">
                        <Link to="/job-list" className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-500/20 transition-all flex items-center">
                            Browse New Jobs
                            <ChevronRight className="h-4 w-4 ml-2" />
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Column - Applications List */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="glass-panel rounded-[2.5rem] p-10 border border-[var(--border-color)] bg-[var(--panel-bg)] shadow-2xl relative overflow-hidden">
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-emerald-500 mb-10 flex items-center">
                                <LayoutList className="h-5 w-5 mr-3" />
                                My Applications
                            </h3>

                            {loading ? (
                                <div className="space-y-4 animate-pulse">
                                    {[1, 2].map(i => <div key={i} className="h-32 bg-[var(--input-bg)] rounded-3xl border border-[var(--border-color)]"></div>)}
                                </div>
                            ) : applications.length === 0 ? (
                                <div className="text-center py-16 bg-[var(--input-bg)] rounded-[2rem] border border-[var(--border-color)] shadow-inner">
                                    <div className="h-20 w-20 rounded-2xl bg-[var(--background)] flex items-center justify-center mx-auto mb-6 border border-[var(--border-color)]">
                                        <Briefcase className="h-10 w-10 text-[var(--muted-text)] opacity-20" />
                                    </div>
                                    <p className="text-xl font-black text-[var(--muted-text)] uppercase tracking-tight">No applications yet</p>
                                    <p className="text-xs text-[var(--muted-text)] mt-2 font-bold opacity-60">Apply for jobs to see them tracked here.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {applications.map(app => (
                                        <div key={app.id} className="p-8 bg-[var(--input-bg)] hover:bg-[var(--background)] border border-[var(--border-color)] rounded-[2rem] transition-all group shadow-sm hover:shadow-lg">
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                                                <div>
                                                    <h4 className="text-xl font-black text-[var(--foreground)] group-hover:text-emerald-500 transition-colors mb-1">{app.job_title}</h4>
                                                    <div className="flex items-center text-[10px] text-[var(--muted-text)] font-black uppercase tracking-widest gap-4">
                                                        <span className="flex items-center"><Clock className="h-3 w-3 mr-1.5" /> Applied: {new Date(app.applied_at).toLocaleDateString()}</span>
                                                        <span className="flex items-center"><CheckCircle className="h-3 w-3 mr-1.5" /> ID: #{app.id}</span>
                                                    </div>
                                                </div>
                                                <div className="shrink-0">
                                                    <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm
                                                        ${app.status === 'New' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 
                                                          app.status === 'Shortlisted' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                                                          app.status === 'Rejected' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                                                          'bg-slate-500/10 text-[var(--muted-text)] border-slate-500/20'}`}>
                                                        {app.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Profile Actions */}
                    <div className="space-y-8">
                        <div className="glass-panel rounded-[2.5rem] p-10 border border-[var(--border-color)] bg-[var(--panel-bg)] shadow-2xl">
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-blue-500 mb-8 flex items-center">
                                <FileText className="h-5 w-5 mr-3" />
                                Resume & Files
                            </h3>
                            <div className="bg-[var(--input-bg)] p-6 rounded-[1.5rem] border border-[var(--border-color)] shadow-inner mb-6">
                                <p className="text-[10px] font-black text-[var(--muted-text)] uppercase tracking-widest mb-3">Primary Resume</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold truncate pr-4">resume_v1.pdf</span>
                                    <button className="text-emerald-500 hover:text-emerald-400">
                                        <ExternalLink className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                            <button className="w-full py-4 bg-[var(--background)] border border-[var(--border-color)] rounded-2xl text-[10px] font-black uppercase tracking-widest text-[var(--muted-text)] hover:text-emerald-500 hover:border-emerald-500/50 transition-all shadow-md">
                                Replace Profile PDF
                            </button>
                        </div>

                        <div className="glass-panel rounded-[2.5rem] p-10 border border-emerald-500/20 bg-emerald-500/5 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full transition-transform group-hover:scale-150"></div>
                            <h3 className="text-lg font-black tracking-tight mb-4 relative z-10">Job Alerts</h3>
                            <p className="text-xs text-[var(--muted-text)] font-medium mb-8 leading-relaxed relative z-10">Get notified when new jobs matching your skills are published.</p>
                            <div className="flex items-center space-x-3 relative z-10">
                                <div className="h-6 w-11 bg-emerald-600 rounded-full relative cursor-pointer border border-emerald-500/30">
                                    <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full shadow-lg"></div>
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest">Notifications Active</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CandidatePortal;
