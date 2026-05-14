import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { Megaphone, Plus, Calendar, User, Bell, ArrowRight, AlertTriangle } from 'lucide-react';

const NoticeBoard = () => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            const res = await api.get('/announcements/');
            setNotices(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter">Notice <span className="text-blue-500">Board</span></h1>
                    <p className="text-[var(--muted-text)] font-medium mt-1">Company-wide announcements and updates</p>
                </div>
                <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-blue-500/20 flex items-center transition-all">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Announcement
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Featured / High Priority */}
                <div className="lg:col-span-2 space-y-8">
                    {loading ? (
                        <div className="animate-pulse space-y-6">
                            {[1, 2].map(i => <div key={i} className="h-48 bg-[var(--input-bg)] rounded-[2.5rem] border border-[var(--border-color)]"></div>)}
                        </div>
                    ) : notices.length === 0 ? (
                        <div className="glass-panel p-20 rounded-[3rem] border border-[var(--border-color)] text-center shadow-xl">
                            <Megaphone className="h-20 w-20 text-[var(--muted-text)] opacity-20 mx-auto mb-8" />
                            <h3 className="text-2xl font-black text-[var(--muted-text)] uppercase tracking-tight">No active announcements</h3>
                            <p className="text-sm text-[var(--muted-text)] mt-4 font-bold opacity-60">Everything is quiet for now. New updates will appear here.</p>
                        </div>
                    ) : (
                        notices.map((notice) => (
                            <div key={notice.id} className="glass-panel rounded-[2.5rem] p-10 border border-[var(--border-color)] bg-[var(--panel-bg)] shadow-2xl relative overflow-hidden group">
                                <div className={`absolute top-0 left-0 w-2 h-full ${notice.priority === 'High' ? 'bg-rose-500' : notice.priority === 'Medium' ? 'bg-blue-500' : 'bg-slate-400'}`}></div>
                                
                                <div className="flex justify-between items-start mb-6">
                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border
                                        ${notice.priority === 'High' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 
                                          notice.priority === 'Medium' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 
                                          'bg-slate-500/10 text-slate-500 border-slate-500/20'}`}>
                                        {notice.priority} Priority
                                    </span>
                                    <span className="text-[10px] font-black text-[var(--muted-text)] uppercase tracking-widest flex items-center">
                                        <Calendar className="h-3 w-3 mr-2" />
                                        {new Date(notice.created_at).toLocaleDateString()}
                                    </span>
                                </div>

                                <h2 className="text-2xl font-black mb-4 group-hover:text-blue-500 transition-colors tracking-tight">{notice.title}</h2>
                                <p className="text-[var(--muted-text)] font-medium leading-relaxed mb-8 whitespace-pre-line">
                                    {notice.content}
                                </p>

                                <div className="flex items-center justify-between pt-8 border-t border-[var(--border-color)]">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-slate-700 to-slate-900 flex items-center justify-center text-white text-xs font-black mr-4 shadow-lg border border-slate-600">
                                            {notice.creator_name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-tighter text-blue-500">Posted By</p>
                                            <p className="text-xs font-black uppercase tracking-tight">{notice.creator_name}</p>
                                        </div>
                                    </div>
                                    <button className="flex items-center text-[10px] font-black uppercase tracking-widest text-blue-500 hover:translate-x-2 transition-transform">
                                        Read More <ArrowRight className="h-3.5 w-3.5 ml-2" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Sidebar - Quick Stats & Alerts */}
                <div className="space-y-8">
                    <div className="glass-panel p-10 rounded-[2.5rem] border border-blue-500/20 bg-blue-500/5 shadow-2xl">
                        <div className="flex items-center mb-8">
                            <Bell className="h-6 w-6 text-blue-500 mr-4 animate-swing" />
                            <h3 className="text-xl font-black tracking-tight">Recent Alerts</h3>
                        </div>
                        <div className="space-y-6">
                            {[
                                { title: 'New HR Policy PDF', time: '2h ago' },
                                { title: 'Holiday List 2024', time: '1d ago' },
                                { title: 'Server Maintenance', time: '3d ago' },
                            ].map((alert, i) => (
                                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-[var(--background)] border border-[var(--border-color)] shadow-sm hover:border-blue-500/30 transition-all cursor-pointer">
                                    <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-tight">{alert.title}</p>
                                        <p className="text-[10px] text-[var(--muted-text)] font-bold">{alert.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-panel p-10 rounded-[2.5rem] border border-amber-500/20 bg-amber-500/5 shadow-2xl relative overflow-hidden group">
                        <AlertTriangle className="h-24 w-24 text-amber-500/10 absolute -right-6 -bottom-6 rotate-12 group-hover:scale-125 transition-transform" />
                        <h3 className="text-lg font-black tracking-tight mb-4">Critical Updates</h3>
                        <p className="text-xs text-[var(--muted-text)] font-medium mb-8 leading-relaxed">Ensure your bank details are updated in the payroll portal before the 25th of this month.</p>
                        <button className="w-full py-4 bg-[var(--background)] border border-[var(--border-color)] rounded-2xl text-[10px] font-black uppercase tracking-widest text-[var(--muted-text)] hover:text-amber-500 hover:border-amber-500/50 transition-all shadow-md">
                            Go to Payroll
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoticeBoard;
