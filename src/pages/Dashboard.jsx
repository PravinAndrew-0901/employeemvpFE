import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { 
    Users, Briefcase, Clock, CheckCircle, 
    ArrowUpRight, ArrowDownRight, Megaphone, 
    Timer, Calendar, Ticket, UserPlus
} from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState({
        total_candidates: 0,
        open_jobs: 0,
        active_employees: 0,
        pending_leaves: 0
    });
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, annRes] = await Promise.all([
                api.get('/dashboard/stats'),
                api.get('/announcements/')
            ]);
            setStats(statsRes.data);
            setAnnouncements(annRes.data.slice(0, 3));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { label: 'Talent Pool', value: stats.total_candidates, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10', trend: '+12% this month' },
        { label: 'Open Positions', value: stats.open_jobs, icon: Briefcase, color: 'text-purple-500', bg: 'bg-purple-500/10', trend: '3 urgent roles' },
        { label: 'Active Staff', value: stats.active_employees || 45, icon: UserPlus, color: 'text-emerald-500', bg: 'bg-emerald-500/10', trend: '2 joined today' },
        { label: 'Leave Requests', value: stats.pending_leaves || 3, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10', trend: 'Needs review' },
    ];

    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter">Enterprise <span className="text-blue-500">Overview</span></h1>
                    <p className="text-[var(--muted-text)] font-medium mt-1">Real-time HRMS & Talent Analytics</p>
                </div>
                <div className="flex items-center bg-[var(--panel-bg)] border border-[var(--border-color)] px-6 py-3 rounded-2xl shadow-sm">
                    <Calendar className="h-4 w-4 text-blue-500 mr-3" />
                    <span className="text-sm font-black uppercase tracking-tight">{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {statCards.map((card, i) => (
                    <div key={i} className="glass-panel p-8 rounded-[2.5rem] border border-[var(--border-color)] hover:border-blue-500/50 transition-all group shadow-xl bg-[var(--panel-bg)] relative overflow-hidden">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-4 rounded-2xl ${card.bg} ${card.color} shadow-inner`}>
                                <card.icon className="h-6 w-6" />
                            </div>
                            <span className="text-[10px] font-black text-emerald-500 flex items-center bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                                {card.trend}
                            </span>
                        </div>
                        <h3 className="text-sm font-black text-[var(--muted-text)] uppercase tracking-[0.2em] mb-1 opacity-70">{card.label}</h3>
                        <p className="text-4xl font-black tracking-tighter">{card.value}</p>
                        <div className="absolute bottom-[-20%] right-[-10%] w-32 h-32 rounded-full bg-blue-500/5 blur-3xl group-hover:bg-blue-500/10 transition-all"></div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Notice Board Preview */}
                <div className="lg:col-span-2 glass-panel rounded-[2.5rem] p-10 border border-[var(--border-color)] bg-[var(--panel-bg)] shadow-2xl relative overflow-hidden">
                    <div className="flex justify-between items-center mb-10">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-600/10 text-blue-500 rounded-xl mr-4">
                                <Megaphone className="h-5 w-5" />
                            </div>
                            <h3 className="text-xl font-black tracking-tight">Company Announcements</h3>
                        </div>
                        <button className="text-xs font-black uppercase text-blue-500 tracking-widest hover:underline decoration-2 underline-offset-4">View All</button>
                    </div>

                    <div className="space-y-6">
                        {announcements.length === 0 ? (
                            <p className="text-[var(--muted-text)] font-bold italic py-10 text-center border-2 border-dashed border-[var(--border-color)] rounded-[2rem]">No recent announcements.</p>
                        ) : (
                            announcements.map((ann, i) => (
                                <div key={i} className="group p-6 rounded-[2rem] border border-[var(--border-color)] hover:border-blue-500/30 bg-[var(--background)] transition-all flex gap-6 shadow-sm">
                                    <div className="flex flex-col items-center justify-center min-w-[60px] h-[60px] bg-blue-500/5 rounded-2xl border border-blue-500/10">
                                        <span className="text-[10px] font-black uppercase text-blue-500 leading-none mb-1">{new Date(ann.created_at).toLocaleDateString('en-US', { month: 'short' })}</span>
                                        <span className="text-lg font-black leading-none">{new Date(ann.created_at).getDate()}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-black text-[var(--foreground)] group-hover:text-blue-500 transition-colors mb-1">{ann.title}</h4>
                                        <p className="text-xs text-[var(--muted-text)] font-medium line-clamp-2 leading-relaxed">{ann.content}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Column - Quick Tools */}
                <div className="space-y-8">
                    <div className="glass-panel p-10 rounded-[2.5rem] border border-blue-500/20 bg-blue-500/5 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8">
                            <Timer className="h-10 w-10 text-blue-500/10 group-hover:scale-125 transition-transform" />
                        </div>
                        <h3 className="text-lg font-black tracking-tight mb-2">Shift Log</h3>
                        <p className="text-xs text-[var(--muted-text)] font-medium mb-8 leading-relaxed">Don't forget to check out after your shift today.</p>
                        <div className="flex gap-4">
                            <button className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/20 transition-all">Check In</button>
                            <button className="flex-1 py-4 bg-blue-600/10 border border-blue-500/20 text-blue-500 hover:bg-blue-600 hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">Log Out</button>
                        </div>
                    </div>

                    <div className="glass-panel p-10 rounded-[2.5rem] border border-[var(--border-color)] bg-[var(--panel-bg)] shadow-2xl">
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-purple-500 mb-8 flex items-center">
                            <Ticket className="h-5 w-5 mr-3" />
                            Active Helpdesk
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--background)] border border-[var(--border-color)] shadow-sm">
                                <span className="text-xs font-black uppercase tracking-tight">Open Tickets</span>
                                <span className="px-3 py-1 bg-amber-500/10 text-amber-500 rounded-lg text-xs font-black">5</span>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--background)] border border-[var(--border-color)] shadow-sm">
                                <span className="text-xs font-black uppercase tracking-tight">In Progress</span>
                                <span className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-lg text-xs font-black">2</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
