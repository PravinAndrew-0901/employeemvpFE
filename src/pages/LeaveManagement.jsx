import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { CalendarClock, CheckCircle, XCircle, Clock, Plus, User, FileText } from 'lucide-react';

const LeaveManagement = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await api.get('/leaves/requests');
            setRequests(res.data);
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
                    <h1 className="text-4xl font-black tracking-tighter">Leave <span className="text-blue-500">Management</span></h1>
                    <p className="text-[var(--muted-text)] font-medium mt-1">Review and approve employee leave requests</p>
                </div>
                <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-blue-500/20 flex items-center transition-all">
                    <Plus className="h-4 w-4 mr-2" />
                    Apply For Leave
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Request Feed */}
                <div className="space-y-6">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-blue-500 mb-6 flex items-center">
                        <Clock className="h-5 w-5 mr-3" />
                        Pending Approvals
                    </h3>

                    {loading ? (
                        <div className="animate-pulse space-y-4">
                            {[1, 2].map(i => <div key={i} className="h-40 bg-[var(--input-bg)] rounded-[2rem] border border-[var(--border-color)]"></div>)}
                        </div>
                    ) : requests.length === 0 ? (
                        <div className="glass-panel p-16 rounded-[2.5rem] border border-[var(--border-color)] bg-[var(--panel-bg)] text-center shadow-xl">
                            <CalendarClock className="h-16 w-16 text-[var(--muted-text)] opacity-20 mx-auto mb-6" />
                            <p className="text-xl font-black text-[var(--muted-text)] uppercase tracking-tight">No pending requests</p>
                            <p className="text-xs text-[var(--muted-text)] mt-2 font-bold opacity-60">All leave applications have been processed.</p>
                        </div>
                    ) : (
                        requests.map((req) => (
                            <div key={req.id} className="glass-panel rounded-[2.5rem] p-8 border border-[var(--border-color)] bg-[var(--panel-bg)] shadow-xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8">
                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm
                                        ${req.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                                          req.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                                          'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
                                        {req.status}
                                    </span>
                                </div>

                                <div className="flex items-center mb-6">
                                    <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-blue-500 font-black shadow-inner mr-4">
                                        {req.employee_name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black tracking-tight">{req.employee_name}</h4>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-500/70">{req.leave_type}</p>
                                    </div>
                                </div>

                                <div className="bg-[var(--input-bg)] p-6 rounded-2xl border border-[var(--border-color)] mb-8 shadow-inner">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center text-xs font-bold text-[var(--muted-text)]">
                                            <CalendarClock className="h-4 w-4 mr-2 text-blue-500/50" />
                                            {new Date(req.start_date).toLocaleDateString()} — {new Date(req.end_date).toLocaleDateString()}
                                        </div>
                                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">
                                            {Math.ceil((new Date(req.end_date) - new Date(req.start_date)) / (1000 * 60 * 60 * 24)) + 1} Days
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium text-[var(--muted-text)] leading-relaxed line-clamp-2 italic">
                                        "{req.reason || 'No reason provided'}"
                                    </p>
                                </div>

                                {req.status === 'Pending' && (
                                    <div className="flex gap-4">
                                        <button className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center">
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Approve
                                        </button>
                                        <button className="flex-1 py-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center">
                                            <XCircle className="h-4 w-4 mr-2" />
                                            Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Right Column - Stats & Balances */}
                <div className="space-y-8">
                    <div className="glass-panel p-10 rounded-[2.5rem] border border-[var(--border-color)] bg-[var(--panel-bg)] shadow-2xl">
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-purple-500 mb-8 flex items-center">
                            <PieChart className="h-5 w-5 mr-3" />
                            Department Overview
                        </h3>
                        <div className="space-y-6">
                            {[
                                { name: 'IT Development', count: 3, color: 'bg-blue-500' },
                                { name: 'Human Resources', count: 1, color: 'bg-emerald-500' },
                                { name: 'Finance', count: 0, color: 'bg-amber-500' },
                            ].map((dept, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-black uppercase tracking-tight">{dept.name}</span>
                                        <span className="text-[10px] font-bold text-[var(--muted-text)]">{dept.count} on leave</span>
                                    </div>
                                    <div className="w-full bg-[var(--input-bg)] h-2 rounded-full overflow-hidden border border-[var(--border-color)] shadow-inner">
                                        <div className={`${dept.color} h-full rounded-full transition-all duration-1000`} style={{ width: `${(dept.count / 10) * 100}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-panel p-10 rounded-[2.5rem] border border-blue-500/20 bg-blue-500/5 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-blue-500/10 blur-3xl rounded-full transition-transform group-hover:scale-150"></div>
                        <h3 className="text-lg font-black tracking-tight mb-4 relative z-10">Holiday Calendar</h3>
                        <p className="text-xs text-[var(--muted-text)] font-medium mb-8 leading-relaxed relative z-10">Next public holiday is Memorial Day on May 27th.</p>
                        <button className="relative z-10 w-full py-4 bg-[var(--background)] border border-[var(--border-color)] rounded-2xl text-[10px] font-black uppercase tracking-widest text-[var(--muted-text)] hover:text-blue-500 hover:border-blue-500/50 transition-all shadow-md">
                            View Full Calendar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Import missing PieChart icon from lucide-react if needed, or replace with another
const PieChart = ({ className }) => <FileText className={className} />;

export default LeaveManagement;
