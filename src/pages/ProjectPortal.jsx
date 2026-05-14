import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { Rocket, Plus, Search, Calendar, Users, Briefcase, ChevronRight, PieChart, Layout } from 'lucide-react';

const ProjectPortal = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            // Placeholder for now
            // const res = await api.get('/projects/');
            // setProjects(res.data);
            setProjects([]);
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
                    <h1 className="text-4xl font-black tracking-tighter">Project <span className="text-blue-500">Portal</span></h1>
                    <p className="text-[var(--muted-text)] font-medium mt-1">Manage cross-functional teams and enterprise project delivery</p>
                </div>
                <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-blue-500/20 flex items-center transition-all">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Project
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-8">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-blue-500 mb-6 flex items-center">
                        <Layout className="h-5 w-5 mr-3" />
                        Active Initiatives
                    </h3>

                    {projects.length === 0 ? (
                        <div className="glass-panel p-20 rounded-[3rem] border border-[var(--border-color)] text-center shadow-xl bg-[var(--panel-bg)]">
                            <Rocket className="h-20 w-20 text-[var(--muted-text)] opacity-20 mx-auto mb-8" />
                            <h3 className="text-2xl font-black text-[var(--muted-text)] uppercase tracking-tight">No active projects</h3>
                            <p className="text-sm text-[var(--muted-text)] mt-4 font-bold opacity-60">Ready to launch? Start by creating your first enterprise project.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Project cards would go here */}
                        </div>
                    )}
                </div>

                <div className="space-y-8">
                    <div className="glass-panel p-10 rounded-[2.5rem] border border-[var(--border-color)] bg-[var(--panel-bg)] shadow-2xl relative overflow-hidden">
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-purple-500 mb-10 flex items-center">
                            <PieChart className="h-5 w-5 mr-3" />
                            Resource Allocation
                        </h3>
                        
                        <div className="space-y-8">
                            {[
                                { name: 'IT Development', value: 85, color: 'bg-blue-500' },
                                { name: 'Marketing & Sales', value: 45, color: 'bg-purple-500' },
                                { name: 'Product Design', value: 65, color: 'bg-emerald-500' },
                                { name: 'HR Operations', value: 30, color: 'bg-amber-500' },
                            ].map((item, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-xs font-black uppercase tracking-tight">{item.name}</span>
                                        <span className="text-[10px] font-black text-blue-500">{item.value}% Utilization</span>
                                    </div>
                                    <div className="w-full h-2.5 bg-[var(--input-bg)] rounded-full overflow-hidden border border-[var(--border-color)] shadow-inner">
                                        <div 
                                            className={`${item.color} h-full rounded-full transition-all duration-1000`}
                                            style={{ width: `${item.value}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 p-8 bg-blue-500/5 rounded-3xl border border-blue-500/20">
                            <div className="flex items-center mb-4">
                                <Users className="h-5 w-5 text-blue-500 mr-3" />
                                <h4 className="text-sm font-black uppercase tracking-tight">Active Team Members</h4>
                            </div>
                            <p className="text-2xl font-black tracking-tighter">142 Employees</p>
                            <p className="text-xs text-[var(--muted-text)] font-medium mt-1">Assigned across 12 projects</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectPortal;
