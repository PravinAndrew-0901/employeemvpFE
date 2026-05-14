import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { CreditCard, Download, Eye, Plus, Calendar, DollarSign, Search, Filter } from 'lucide-react';

const PayrollList = () => {
    const [slips, setSlips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSlips();
    }, []);

    const fetchSlips = async () => {
        try {
            const res = await api.get('/payroll/slips');
            setSlips(res.data);
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
                    <h1 className="text-4xl font-black tracking-tighter">Payroll <span className="text-blue-500">Center</span></h1>
                    <p className="text-[var(--muted-text)] font-medium mt-1">Generate and manage employee pay slips</p>
                </div>
                <div className="flex gap-4">
                    <button className="px-8 py-4 bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--muted-text)] rounded-2xl font-black uppercase tracking-widest text-[10px] hover:text-blue-500 transition-all flex items-center">
                        <Download className="h-4 w-4 mr-2" />
                        Bulk Export
                    </button>
                    <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-blue-500/20 flex items-center transition-all">
                        <Plus className="h-4 w-4 mr-2" />
                        Generate Slips
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
                <div className="glass-panel p-8 rounded-[2.5rem] border border-blue-500/20 bg-blue-500/5 shadow-xl">
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">Total Payroll (MTD)</p>
                    <h2 className="text-3xl font-black text-[var(--foreground)]">$154,200</h2>
                </div>
                <div className="glass-panel p-8 rounded-[2.5rem] border border-emerald-500/20 bg-emerald-500/5 shadow-xl">
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Processed</p>
                    <h2 className="text-3xl font-black text-[var(--foreground)]">45 Slips</h2>
                </div>
                <div className="glass-panel p-8 rounded-[2.5rem] border border-amber-500/20 bg-amber-500/5 shadow-xl">
                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2">Pending Review</p>
                    <h2 className="text-3xl font-black text-[var(--foreground)]">12 Slips</h2>
                </div>
                <div className="glass-panel p-8 rounded-[2.5rem] border border-purple-500/20 bg-purple-500/5 shadow-xl">
                    <p className="text-[10px] font-black text-purple-500 uppercase tracking-widest mb-2">Next Run</p>
                    <h2 className="text-3xl font-black text-[var(--foreground)]">June 1st</h2>
                </div>
            </div>

            <div className="glass-panel rounded-[2.5rem] border border-[var(--border-color)] bg-[var(--panel-bg)] shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[var(--border-color)] bg-blue-600/5">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-text)]">Employee</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-text)]">Period</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-text)]">Net Salary</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-text)]">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-text)]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)]">
                            {slips.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center text-[var(--muted-text)] font-bold italic">No slips generated for the current period.</td>
                                </tr>
                            ) : (
                                slips.map((slip) => (
                                    <tr key={slip.id} className="hover:bg-blue-500/5 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-xl bg-[var(--input-bg)] border border-[var(--border-color)] flex items-center justify-center text-blue-500 mr-4 font-black shadow-inner">
                                                    {slip.employee_name.charAt(0)}
                                                </div>
                                                <span className="font-black text-sm group-hover:text-blue-500 transition-colors">{slip.employee_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center text-sm font-bold text-[var(--muted-text)]">
                                                <Calendar className="h-4 w-4 mr-2 opacity-50" />
                                                {new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(2024, slip.month - 1))} {slip.year}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 font-black text-sm">
                                            ${slip.net_salary.toLocaleString()}
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                                {slip.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <button className="p-3 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl text-[var(--muted-text)] hover:text-blue-500 hover:border-blue-500 transition-all shadow-sm">
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                <button className="p-3 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl text-[var(--muted-text)] hover:text-emerald-500 hover:border-emerald-500 transition-all shadow-sm">
                                                    <Download className="h-4 w-4" />
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

export default PayrollList;
