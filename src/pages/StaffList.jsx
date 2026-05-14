import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { UserCheck, Mail, Building2, Calendar, Phone, Search, Filter, Plus, ChevronRight } from 'lucide-react';

const StaffList = () => {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            const res = await api.get('/employees/');
            setStaff(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredStaff = staff.filter(emp => 
        emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employee_code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter">Staff <span className="text-blue-500">Directory</span></h1>
                    <p className="text-[var(--muted-text)] font-medium mt-1">Manage and view all corporate employees</p>
                </div>
                <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-blue-500/20 flex items-center transition-all">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Employee
                </button>
            </div>

            <div className="glass-panel p-6 rounded-[2rem] border border-[var(--border-color)] bg-[var(--panel-bg)] shadow-xl mb-10">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-text)]" />
                        <input 
                            type="text"
                            placeholder="Search by name, code or department..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl font-bold focus:ring-2 focus:ring-blue-500/50 shadow-inner"
                        />
                    </div>
                    <button className="px-6 py-4 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl font-black text-[10px] uppercase tracking-widest text-[var(--muted-text)] flex items-center hover:text-blue-500 transition-colors">
                        <Filter className="h-4 w-4 mr-2" />
                        More Filters
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredStaff.map((emp) => (
                        <div key={emp.id} className="glass-panel rounded-[2.5rem] p-8 border border-[var(--border-color)] bg-[var(--panel-bg)] hover:border-blue-500/50 transition-all group shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6">
                                <span className="px-3 py-1 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-full text-[9px] font-black uppercase tracking-widest">
                                    {emp.employee_code}
                                </span>
                            </div>

                            <div className="flex items-center mb-8">
                                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-500/20 mr-5">
                                    {emp.full_name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-black tracking-tight group-hover:text-blue-500 transition-colors">{emp.full_name}</h3>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500/70">{emp.designation_title || 'Designation Pending'}</p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center text-sm font-bold text-[var(--muted-text)]">
                                    <Building2 className="h-4 w-4 mr-3 text-blue-500/50" />
                                    {emp.department_name || 'General'}
                                </div>
                                <div className="flex items-center text-sm font-bold text-[var(--muted-text)]">
                                    <Mail className="h-4 w-4 mr-3 text-emerald-500/50" />
                                    {emp.email}
                                </div>
                                <div className="flex items-center text-sm font-bold text-[var(--muted-text)]">
                                    <Calendar className="h-4 w-4 mr-3 text-amber-500/50" />
                                    Joined: {new Date(emp.joining_date).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-[var(--border-color)] flex items-center justify-between">
                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border
                                    ${emp.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                                    {emp.status}
                                </span>
                                <button className="p-3 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl text-[var(--muted-text)] hover:text-blue-500 hover:border-blue-500 transition-all">
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StaffList;
