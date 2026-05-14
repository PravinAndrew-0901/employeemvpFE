import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { Wallet, Plus, Search, Filter, CheckCircle, XCircle, Clock, FileText, DollarSign } from 'lucide-react';

const ExpenseTracker = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            const res = await api.get('/expenses/');
            setExpenses(res.data);
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
                    <h1 className="text-4xl font-black tracking-tighter">Expense <span className="text-blue-500">Tracker</span></h1>
                    <p className="text-[var(--muted-text)] font-medium mt-1">Manage employee reimbursement claims and business expenses</p>
                </div>
                <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-blue-500/20 flex items-center transition-all">
                    <Plus className="h-4 w-4 mr-2" />
                    New Claim
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="glass-panel p-10 rounded-[2.5rem] border border-[var(--border-color)] bg-[var(--panel-bg)] shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Wallet className="h-16 w-16" />
                    </div>
                    <p className="text-[10px] font-black text-[var(--muted-text)] uppercase tracking-widest mb-2">Total Claimed (MTD)</p>
                    <h2 className="text-4xl font-black tracking-tighter">${expenses.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}</h2>
                    <div className="mt-4 flex items-center text-[10px] font-bold text-emerald-500">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Updated just now
                    </div>
                </div>

                <div className="glass-panel p-10 rounded-[2.5rem] border border-amber-500/20 bg-amber-500/5 shadow-xl">
                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2">Pending Approval</p>
                    <h2 className="text-4xl font-black tracking-tighter">{expenses.filter(e => e.status === 'Pending').length}</h2>
                    <p className="text-xs text-[var(--muted-text)] mt-2 font-medium">Claims needing your review</p>
                </div>

                <div className="glass-panel p-10 rounded-[2.5rem] border border-blue-500/20 bg-blue-500/5 shadow-xl">
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">Average Claim</p>
                    <h2 className="text-4xl font-black tracking-tighter">${expenses.length ? (expenses.reduce((acc, curr) => acc + curr.amount, 0) / expenses.length).toFixed(0) : 0}</h2>
                    <p className="text-xs text-[var(--muted-text)] mt-2 font-medium">Per employee request</p>
                </div>
            </div>

            <div className="glass-panel rounded-[2.5rem] border border-[var(--border-color)] bg-[var(--panel-bg)] shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-[var(--border-color)] flex flex-col md:flex-row gap-4 bg-blue-600/5">
                    <div className="relative flex-1">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-text)]" />
                        <input 
                            type="text"
                            placeholder="Search by claim title or employee name..."
                            className="w-full pl-12 pr-6 py-4 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl font-bold shadow-inner"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[var(--border-color)]">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-text)]">Claim Details</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-text)]">Category</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-text)]">Amount</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-text)]">Employee</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-text)]">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-text)]">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)]">
                            {expenses.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-8 py-20 text-center text-[var(--muted-text)] font-bold italic">No expense claims submitted yet.</td>
                                </tr>
                            ) : (
                                expenses.map((exp) => (
                                    <tr key={exp.id} className="hover:bg-blue-500/5 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="font-black text-sm group-hover:text-blue-500 transition-colors">{exp.title}</span>
                                                <span className="text-[10px] font-bold text-[var(--muted-text)] uppercase">{new Date(exp.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-xs font-bold uppercase tracking-widest text-[var(--muted-text)] px-3 py-1 bg-[var(--input-bg)] rounded-lg">{exp.category}</span>
                                        </td>
                                        <td className="px-8 py-6 font-black text-sm text-blue-500">
                                            ${exp.amount.toLocaleString()}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center text-sm font-bold">
                                                <div className="h-8 w-8 rounded-full bg-[var(--input-bg)] border border-[var(--border-color)] flex items-center justify-center text-[10px] font-black mr-3 shadow-inner">
                                                    {exp.employee_name.charAt(0)}
                                                </div>
                                                {exp.employee_name}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border
                                                ${exp.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                                                  exp.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                                                  'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
                                                {exp.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <button className="flex items-center px-4 py-2 bg-blue-600/10 hover:bg-blue-600 hover:text-white text-blue-500 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">
                                                <FileText className="h-3.5 w-3.5 mr-2" />
                                                Review
                                            </button>
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

export default ExpenseTracker;
