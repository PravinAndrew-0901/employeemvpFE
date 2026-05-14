import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { Timer, MapPin, CheckCircle, XCircle, Clock, Calendar, Search, Building2 } from 'lucide-react';

const AttendanceLog = () => {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ present: 0, late: 0, absent: 0 });

    useEffect(() => {
        fetchAttendance();
    }, []);

    const fetchAttendance = async () => {
        try {
            const res = await api.get('/attendance/');
            setAttendance(res.data);
            // Mock stats
            setStats({ present: res.data.length, late: 2, absent: 5 });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckIn = async () => {
        try {
            await api.post('/attendance/check-in', { work_location: 'Office' });
            alert("Checked in successfully!");
            fetchAttendance();
        } catch (err) {
            alert(err.response?.data?.detail || "Check-in failed");
        }
    };

    const handleCheckOut = async () => {
        try {
            await api.post('/attendance/check-out');
            alert("Checked out successfully!");
            fetchAttendance();
        } catch (err) {
            alert(err.response?.data?.detail || "Check-out failed");
        }
    };

    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter">Daily <span className="text-blue-500">Attendance</span></h1>
                    <p className="text-[var(--muted-text)] font-medium mt-1">Track employee check-ins and working hours</p>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={handleCheckIn}
                        className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-emerald-500/20 flex items-center transition-all"
                    >
                        <Clock className="h-4 w-4 mr-2" />
                        Check In
                    </button>
                    <button 
                        onClick={handleCheckOut}
                        className="px-8 py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-rose-500/20 flex items-center transition-all"
                    >
                        <Timer className="h-4 w-4 mr-2" />
                        Check Out
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="glass-panel p-8 rounded-[2.5rem] border border-emerald-500/20 bg-emerald-500/5 shadow-xl">
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Present Today</p>
                    <h2 className="text-3xl font-black">{stats.present}</h2>
                </div>
                <div className="glass-panel p-8 rounded-[2.5rem] border border-amber-500/20 bg-amber-500/5 shadow-xl">
                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2">Late Comers</p>
                    <h2 className="text-3xl font-black">{stats.late}</h2>
                </div>
                <div className="glass-panel p-8 rounded-[2.5rem] border border-rose-500/20 bg-rose-500/5 shadow-xl">
                    <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-2">Absent</p>
                    <h2 className="text-3xl font-black">{stats.absent}</h2>
                </div>
            </div>

            <div className="glass-panel rounded-[2.5rem] border border-[var(--border-color)] bg-[var(--panel-bg)] shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-[var(--border-color)] flex flex-col md:flex-row gap-4 bg-blue-600/5">
                    <div className="relative flex-1">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-text)]" />
                        <input 
                            type="text"
                            placeholder="Search by employee name..."
                            className="w-full pl-12 pr-6 py-4 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl font-bold shadow-inner"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[var(--border-color)]">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-text)]">Employee</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-text)]">Date</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-text)]">Check In</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-text)]">Check Out</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-text)]">Location</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-text)]">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)]">
                            {attendance.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-8 py-20 text-center text-[var(--muted-text)] font-bold italic">No attendance records for today.</td>
                                </tr>
                            ) : (
                                attendance.map((rec) => (
                                    <tr key={rec.id} className="hover:bg-blue-500/5 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-black mr-4 shadow-lg">
                                                    {rec.employee_name.charAt(0)}
                                                </div>
                                                <span className="font-black text-sm">{rec.employee_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-sm font-bold text-[var(--muted-text)]">
                                            {new Date(rec.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center text-emerald-500 font-black text-sm">
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                {new Date(rec.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            {rec.check_out ? (
                                                <div className="flex items-center text-rose-500 font-black text-sm">
                                                    <XCircle className="h-4 w-4 mr-2" />
                                                    {new Date(rec.check_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            ) : (
                                                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-text)] bg-[var(--input-bg)] px-3 py-1 rounded-full">Active</span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center text-xs font-bold text-[var(--muted-text)]">
                                                <MapPin className="h-3.5 w-3.5 mr-2 text-blue-500/50" />
                                                {rec.work_location}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                                {rec.status}
                                            </span>
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

export default AttendanceLog;
