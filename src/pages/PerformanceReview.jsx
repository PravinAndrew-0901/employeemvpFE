import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { Target, Star, TrendingUp, Award, User, ChevronRight, PieChart, CheckCircle2 } from 'lucide-react';

const PerformanceReview = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            // Placeholder for now as we just added the model
            // const res = await api.get('/performance/');
            // setReviews(res.data);
            setReviews([]);
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
                    <h1 className="text-4xl font-black tracking-tighter">Performance <span className="text-blue-500">Center</span></h1>
                    <p className="text-[var(--muted-text)] font-medium mt-1">Manage employee goals, KRAs and appraisals</p>
                </div>
                <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-blue-500/20 flex items-center transition-all">
                    <Target className="h-4 w-4 mr-2" />
                    Start Review Cycle
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
                <div className="glass-panel p-8 rounded-[2.5rem] border border-blue-500/20 bg-blue-500/5 shadow-xl">
                    <TrendingUp className="h-8 w-8 text-blue-500 mb-4" />
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Company Rating</p>
                    <h2 className="text-3xl font-black">4.2 / 5.0</h2>
                </div>
                <div className="glass-panel p-8 rounded-[2.5rem] border border-emerald-500/20 bg-emerald-500/5 shadow-xl">
                    <CheckCircle2 className="h-8 w-8 text-emerald-500 mb-4" />
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Goals Completed</p>
                    <h2 className="text-3xl font-black">78%</h2>
                </div>
                <div className="glass-panel p-8 rounded-[2.5rem] border border-purple-500/20 bg-purple-500/5 shadow-xl">
                    <Award className="h-8 w-8 text-purple-500 mb-4" />
                    <p className="text-[10px] font-black text-purple-500 uppercase tracking-widest mb-1">Pending Appraisals</p>
                    <h2 className="text-3xl font-black">12</h2>
                </div>
                <div className="glass-panel p-8 rounded-[2.5rem] border border-amber-500/20 bg-amber-500/5 shadow-xl">
                    <Star className="h-8 w-8 text-amber-500 mb-4" />
                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Top Performers</p>
                    <h2 className="text-3xl font-black">5</h2>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="glass-panel rounded-[2.5rem] p-10 border border-[var(--border-color)] bg-[var(--panel-bg)] shadow-2xl">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-blue-500 mb-8">Active Appraisals</h3>
                    {reviews.length === 0 ? (
                        <div className="text-center py-20 bg-[var(--input-bg)] rounded-[2rem] border border-dashed border-[var(--border-color)]">
                            <PieChart className="h-16 w-16 text-[var(--muted-text)] opacity-20 mx-auto mb-6" />
                            <p className="text-sm font-black text-[var(--muted-text)] uppercase tracking-tight">No active cycles found</p>
                            <p className="text-xs text-[var(--muted-text)] mt-2 font-bold opacity-60">Initialize a review cycle to see progress here.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* List of reviews would go here */}
                        </div>
                    )}
                </div>

                <div className="space-y-8">
                    <div className="glass-panel p-10 rounded-[2.5rem] border border-[var(--border-color)] bg-[var(--panel-bg)] shadow-2xl">
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-emerald-500 mb-8">Key Performance Indicators</h3>
                        <div className="space-y-8">
                            {[
                                { name: 'Customer Satisfaction', value: 92, color: 'bg-emerald-500' },
                                { name: 'Development Velocity', value: 85, color: 'bg-blue-500' },
                                { name: 'Employee Retention', value: 96, color: 'bg-purple-500' },
                                { name: 'Project Delivery', value: 74, color: 'bg-amber-500' },
                            ].map((kpi, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-xs font-black uppercase tracking-tight">{kpi.name}</span>
                                        <span className="text-[10px] font-black text-blue-500">{kpi.value}%</span>
                                    </div>
                                    <div className="w-full h-3 bg-[var(--input-bg)] rounded-full overflow-hidden border border-[var(--border-color)] shadow-inner">
                                        <div 
                                            className={`${kpi.color} h-full rounded-full transition-all duration-1000`}
                                            style={{ width: `${kpi.value}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PerformanceReview;
