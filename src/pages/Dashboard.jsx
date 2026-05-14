import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Users, FileText, Settings, LogOut, Briefcase, TrendingUp, Download } from 'lucide-react';
import api from '../api/axiosConfig';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/dashboard/summary');
                setStats(res.data);
            } catch (err) {
                console.error("Failed to load dashboard stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const handleExport = async () => {
        try {
            const response = await api.get('/reports/candidates/export', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Candidates_Report.xlsx');
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Export failed', error);
        }
    };

    return (
        <div className="w-full h-full relative z-10">
            <main className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-black mb-1 tracking-tight">Overview</h1>
                        <p className="text-[var(--muted-text)] font-medium">Manage your candidates, workflows, and configurations.</p>
                    </div>
                    {user?.permissions.includes('view_candidates') && (
                        <button onClick={handleExport} className="flex items-center px-6 py-3 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-2xl hover:bg-emerald-500/20 transition-all shadow-lg font-bold text-sm">
                            <Download className="h-4 w-4 mr-2" />
                            Export Excel Report
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="text-[var(--muted-text)] animate-pulse mb-10 font-bold uppercase tracking-widest text-xs">Loading real-time analytics...</div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                        <div className="glass-panel p-8 rounded-3xl border-l-4 border-l-blue-500 hover:scale-[1.02] transition-all cursor-default">
                            <p className="text-[var(--muted-text)] text-[10px] font-black uppercase tracking-widest">Total Candidates</p>
                            <p className="text-4xl font-black mt-3">{stats?.total_candidates || 0}</p>
                        </div>
                        <div className="glass-panel p-8 rounded-3xl border-l-4 border-l-purple-500 hover:scale-[1.02] transition-all cursor-default">
                            <p className="text-[var(--muted-text)] text-[10px] font-black uppercase tracking-widest">New CVs</p>
                            <p className="text-4xl font-black mt-3">{stats?.new_cvs || 0}</p>
                        </div>
                        <div className="glass-panel p-8 rounded-3xl border-l-4 border-l-emerald-500 hover:scale-[1.02] transition-all cursor-default">
                            <p className="text-[var(--muted-text)] text-[10px] font-black uppercase tracking-widest">Shortlisted</p>
                            <p className="text-4xl font-black mt-3">{stats?.shortlisted || 0}</p>
                        </div>
                        <div className="glass-panel p-8 rounded-3xl border-l-4 border-l-orange-500 hover:scale-[1.02] transition-all cursor-default">
                            <p className="text-[var(--muted-text)] text-[10px] font-black uppercase tracking-widest">Interviews</p>
                            <p className="text-4xl font-black mt-3">{stats?.interview_scheduled || 0}</p>
                        </div>
                    </div>
                )}
                
                <h2 className="text-xl font-black mb-8 uppercase tracking-widest text-blue-500">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {user?.permissions.includes('view_candidates') && (
                        <Link to="/candidates" className="glass-card rounded-3xl p-8 group block relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-3xl rounded-full group-hover:scale-150 transition-transform"></div>
                            <div className="flex items-start justify-between mb-6 relative z-10">
                                <div className="bg-blue-500/10 p-4 rounded-2xl border border-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                                    <Users className="h-7 w-7 text-blue-500" />
                                </div>
                                <TrendingUp className="h-5 w-5 text-[var(--muted-text)] group-hover:text-blue-500 transition-colors" />
                            </div>
                            <h2 className="text-xl font-black mb-2 relative z-10 group-hover:text-blue-500 transition-colors">Candidates Directory</h2>
                            <p className="text-[var(--muted-text)] text-sm leading-relaxed relative z-10 font-medium">Search, filter, and track applicants through your pipeline.</p>
                        </Link>
                    )}

                    {user?.permissions.includes('bulk_upload_cv') && (
                        <Link to="/upload" className="glass-card rounded-3xl p-8 group block relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-3xl rounded-full group-hover:scale-150 transition-transform"></div>
                            <div className="flex items-start justify-between mb-6 relative z-10">
                                <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20 group-hover:scale-110 transition-transform duration-500">
                                    <FileText className="h-7 w-7 text-emerald-500" />
                                </div>
                                <TrendingUp className="h-5 w-5 text-[var(--muted-text)] group-hover:text-emerald-500 transition-colors" />
                            </div>
                            <h2 className="text-xl font-black mb-2 relative z-10 group-hover:text-emerald-500 transition-colors">Bulk CV Upload</h2>
                            <p className="text-[var(--muted-text)] text-sm leading-relaxed relative z-10 font-medium">Instantly parse and import multiple resumes at once.</p>
                        </Link>
                    )}

                    {user?.permissions.includes('manage_roles') && (
                        <Link to="/roles" className="glass-card rounded-3xl p-8 group block relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 blur-3xl rounded-full group-hover:scale-150 transition-transform"></div>
                            <div className="flex items-start justify-between mb-6 relative z-10">
                                <div className="bg-purple-500/10 p-4 rounded-2xl border border-purple-500/20 group-hover:scale-110 transition-transform duration-500">
                                    <Settings className="h-7 w-7 text-purple-500" />
                                </div>
                                <TrendingUp className="h-5 w-5 text-[var(--muted-text)] group-hover:text-purple-500 transition-colors" />
                            </div>
                            <h2 className="text-xl font-black mb-2 relative z-10 group-hover:text-purple-500 transition-colors">Access Control</h2>
                            <p className="text-[var(--muted-text)] text-sm leading-relaxed relative z-10 font-medium">Configure dynamic roles and system permissions.</p>
                        </Link>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
