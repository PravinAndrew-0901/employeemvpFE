import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { Ticket, Search, Filter, Plus, MessageSquare, AlertCircle, Clock, CheckCircle2, MoreVertical } from 'lucide-react';

const TicketSupport = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const res = await api.get('/tickets/');
            setTickets(res.data);
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
                    <h1 className="text-4xl font-black tracking-tighter">Support <span className="text-blue-500">Tickets</span></h1>
                    <p className="text-[var(--muted-text)] font-medium mt-1">Internal employee helpdesk and issue tracking</p>
                </div>
                <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-blue-500/20 flex items-center transition-all">
                    <Plus className="h-4 w-4 mr-2" />
                    New Ticket
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="glass-panel p-8 rounded-[2.5rem] border border-blue-500/20 bg-blue-500/5 shadow-xl flex items-center">
                    <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 mr-5">
                        <Ticket className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Open Tickets</p>
                        <h2 className="text-2xl font-black">{tickets.filter(t => t.status === 'Open').length}</h2>
                    </div>
                </div>
                <div className="glass-panel p-8 rounded-[2.5rem] border border-amber-500/20 bg-amber-500/5 shadow-xl flex items-center">
                    <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 mr-5">
                        <Clock className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">In Progress</p>
                        <h2 className="text-2xl font-black">{tickets.filter(t => t.status === 'In Progress').length}</h2>
                    </div>
                </div>
                <div className="glass-panel p-8 rounded-[2.5rem] border border-emerald-500/20 bg-emerald-500/5 shadow-xl flex items-center">
                    <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mr-5">
                        <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Resolved (MTD)</p>
                        <h2 className="text-2xl font-black">24</h2>
                    </div>
                </div>
            </div>

            <div className="glass-panel rounded-[2.5rem] border border-[var(--border-color)] bg-[var(--panel-bg)] shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-[var(--border-color)] flex flex-col md:flex-row gap-4 bg-blue-600/5">
                    <div className="relative flex-1">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-text)]" />
                        <input 
                            type="text"
                            placeholder="Search tickets by ID, title or creator..."
                            className="w-full pl-12 pr-6 py-4 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl font-bold focus:ring-2 focus:ring-blue-500/50 shadow-inner"
                        />
                    </div>
                    <div className="flex gap-4">
                        <select className="px-6 py-4 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl font-black text-[10px] uppercase tracking-widest text-[var(--muted-text)] focus:ring-2 focus:ring-blue-500/50 outline-none">
                            <option>All Categories</option>
                            <option>IT Support</option>
                            <option>HR Queries</option>
                            <option>Finance</option>
                        </select>
                        <button className="p-4 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl text-[var(--muted-text)] hover:text-blue-500 transition-all">
                            <Filter className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[var(--border-color)]">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-text)]">ID & Title</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-text)]">Priority</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-text)]">Category</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-text)]">Requested By</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-text)]">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-text)]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)]">
                            {tickets.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-8 py-20 text-center text-[var(--muted-text)] font-bold italic">No active support tickets found.</td>
                                </tr>
                            ) : (
                                tickets.map((t) => (
                                    <tr key={t.id} className="hover:bg-blue-500/5 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-blue-500 mb-1">#TKT-{t.id}</span>
                                                <span className="font-black text-sm group-hover:text-blue-500 transition-colors truncate max-w-[200px]">{t.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`flex items-center text-xs font-black uppercase tracking-tight
                                                ${t.priority === 'High' || t.priority === 'Urgent' ? 'text-rose-500' : 
                                                  t.priority === 'Medium' ? 'text-amber-500' : 'text-blue-500'}`}>
                                                <AlertCircle className="h-3 w-3 mr-1.5" />
                                                {t.priority}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 font-bold text-xs text-[var(--muted-text)] uppercase tracking-widest">
                                            {t.category || 'General'}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 rounded-lg bg-[var(--input-bg)] border border-[var(--border-color)] flex items-center justify-center text-[10px] font-black mr-3">
                                                    {t.created_by_name.charAt(0)}
                                                </div>
                                                <span className="text-sm font-bold">{t.created_by_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border
                                                ${t.status === 'Open' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 
                                                  t.status === 'In Progress' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                                                  'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}`}>
                                                {t.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center gap-3">
                                                <button className="flex items-center px-4 py-2 bg-blue-600/10 hover:bg-blue-600 hover:text-white text-blue-500 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">
                                                    <MessageSquare className="h-3.5 w-3.5 mr-2" />
                                                    Reply
                                                </button>
                                                <button className="p-2.5 text-[var(--muted-text)] hover:text-[var(--foreground)]">
                                                    <MoreVertical className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TicketSupport;
