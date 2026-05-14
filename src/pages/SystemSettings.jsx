import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { Plus, Trash2, Sliders, BrainCircuit, Filter, Check, X } from 'lucide-react';

const SystemSettings = () => {
    const [skills, setSkills] = useState([]);
    const [filters, setFilters] = useState([]);
    const [activeTab, setActiveTab] = useState('skills');
    const [loading, setLoading] = useState(true);

    // Form states
    const [newSkill, setNewSkill] = useState({ name: '', category: 'General' });
    const [newFilter, setNewFilter] = useState({ category: 'notice_period', value: '', label: '', sort_order: 0 });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [skillsRes, filtersRes] = await Promise.all([
                api.get('/settings/skills'),
                api.get('/settings/filters')
            ]);
            setSkills(skillsRes.data);
            setFilters(filtersRes.data);
        } catch (err) {
            console.error('Failed to fetch settings', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSkill = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/settings/skills', newSkill);
            setSkills([...skills, res.data]);
            setNewSkill({ name: '', category: 'General' });
        } catch (err) {
            alert(err.response?.data?.detail || "Failed to add skill");
        }
    };

    const handleAddFilter = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/settings/filters', newFilter);
            setFilters([...filters, res.data]);
            setNewFilter({ category: 'notice_period', value: '', label: '', sort_order: 0 });
        } catch (err) {
            alert(err.response?.data?.detail || "Failed to add filter option");
        }
    };

    const handleDeleteSkill = async (id) => {
        if (!window.confirm("Delete this skill?")) return;
        try {
            await api.delete(`/settings/skills/${id}`);
            setSkills(skills.filter(s => s.id !== id));
        } catch (err) {
            alert("Failed to delete skill");
        }
    };

    const handleDeleteFilter = async (id) => {
        if (!window.confirm("Delete this filter option?")) return;
        try {
            await api.delete(`/settings/filters/${id}`);
            setFilters(filters.filter(f => f.id !== id));
        } catch (err) {
            alert("Failed to delete filter option");
        }
    };

    return (
        <div className="w-full h-full relative z-10 pb-10">
            <div className="max-w-7xl mx-auto pb-4 relative z-10">
                <div className="mb-10">
                    <h1 className="text-3xl font-black tracking-tight">System Configuration</h1>
                    <p className="text-[var(--muted-text)] font-medium">Manage master data, skills, and application filters</p>
                </div>

                {/* Tabs */}
                <div className="flex space-x-2 mb-8 bg-[var(--panel-bg)] p-1.5 rounded-2xl border border-[var(--border-color)] w-fit shadow-xl">
                    <button 
                        onClick={() => setActiveTab('skills')}
                        className={`flex items-center px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'skills' ? 'bg-blue-600 text-white shadow-lg' : 'text-[var(--muted-text)] hover:text-[var(--foreground)]'}`}
                    >
                        <BrainCircuit className="h-4 w-4 mr-2" />
                        Skills Master
                    </button>
                    <button 
                        onClick={() => setActiveTab('filters')}
                        className={`flex items-center px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'filters' ? 'bg-blue-600 text-white shadow-lg' : 'text-[var(--muted-text)] hover:text-[var(--foreground)]'}`}
                    >
                        <Filter className="h-4 w-4 mr-2" />
                        Filter Options
                    </button>
                </div>

                {activeTab === 'skills' ? (
                    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
                        {/* Skill Form */}
                        <div className="glass-panel rounded-3xl p-8 border border-[var(--border-color)] bg-[var(--panel-bg)] shadow-2xl">
                            <h3 className="text-sm font-black uppercase tracking-widest text-blue-500 mb-6">Add New Skill</h3>
                            <form onSubmit={handleAddSkill} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <input 
                                    type="text" required placeholder="Skill Name (e.g. React Native)"
                                    value={newSkill.name} onChange={e => setNewSkill({...newSkill, name: e.target.value})}
                                    className="px-6 py-3.5 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl text-[var(--foreground)] font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                />
                                <input 
                                    type="text" placeholder="Category (e.g. Mobile)"
                                    value={newSkill.category} onChange={e => setNewSkill({...newSkill, category: e.target.value})}
                                    className="px-6 py-3.5 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl text-[var(--foreground)] font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                />
                                <button type="submit" className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all">
                                    Add to Master
                                </button>
                            </form>
                        </div>

                        {/* Skills List */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {loading ? (
                                <div className="col-span-full py-10 text-center text-[var(--muted-text)] font-bold">Loading skills...</div>
                            ) : skills.map(skill => (
                                <div key={skill.id} className="glass-panel p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--panel-bg)] group flex justify-between items-center hover:border-blue-500/30 transition-all shadow-md">
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-black truncate">{skill.name}</p>
                                        <p className="text-[9px] text-[var(--muted-text)] font-bold uppercase tracking-tighter">{skill.category || 'General'}</p>
                                    </div>
                                    <button onClick={() => handleDeleteSkill(skill.id)} className="opacity-0 group-hover:opacity-100 p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all">
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        {/* Filter Form */}
                        <div className="glass-panel rounded-3xl p-8 border border-[var(--border-color)] bg-[var(--panel-bg)] shadow-2xl">
                            <h3 className="text-sm font-black uppercase tracking-widest text-emerald-500 mb-6">Add Filter Option</h3>
                            <form onSubmit={handleAddFilter} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                <select 
                                    value={newFilter.category} onChange={e => setNewFilter({...newFilter, category: e.target.value})}
                                    className="px-4 py-3.5 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl text-[var(--foreground)] font-bold"
                                >
                                    <option value="notice_period">Notice Period</option>
                                    <option value="work_mode">Work Mode</option>
                                    <option value="experience_range">Experience Range</option>
                                </select>
                                <input 
                                    type="text" required placeholder="Value (e.g. 15 Days)"
                                    value={newFilter.value} onChange={e => setNewFilter({...newFilter, value: e.target.value})}
                                    className="px-4 py-3.5 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl text-[var(--foreground)] font-bold"
                                />
                                <input 
                                    type="text" placeholder="Label (optional)"
                                    value={newFilter.label} onChange={e => setNewFilter({...newFilter, label: e.target.value})}
                                    className="px-4 py-3.5 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl text-[var(--foreground)] font-bold"
                                />
                                <input 
                                    type="number" placeholder="Order"
                                    value={newFilter.sort_order} onChange={e => setNewFilter({...newFilter, sort_order: parseInt(e.target.value)})}
                                    className="px-4 py-3.5 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl text-[var(--foreground)] font-bold"
                                />
                                <button type="submit" className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20 transition-all">
                                    Save Option
                                </button>
                            </form>
                        </div>

                        {/* Filters List */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {['notice_period', 'work_mode', 'experience_range'].map(cat => (
                                <div key={cat} className="glass-panel rounded-3xl border border-[var(--border-color)] bg-[var(--panel-bg)] overflow-hidden shadow-xl">
                                    <div className="p-5 border-b border-[var(--border-color)] bg-blue-500/5">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-blue-500">{cat.replace('_', ' ')}</h4>
                                    </div>
                                    <div className="p-4 space-y-2">
                                        {filters.filter(f => f.category === cat).map(option => (
                                            <div key={option.id} className="flex justify-between items-center p-3 rounded-xl bg-[var(--input-bg)] border border-[var(--border-color)] group">
                                                <div className="flex items-center">
                                                    <span className="text-[10px] font-black bg-[var(--background)] border border-[var(--border-color)] px-2 py-0.5 rounded mr-3 opacity-50">{option.sort_order}</span>
                                                    <span className="text-sm font-bold">{option.label || option.value}</span>
                                                </div>
                                                <button onClick={() => handleDeleteFilter(option.id)} className="opacity-0 group-hover:opacity-100 p-1 text-rose-500 hover:bg-rose-500/10 rounded transition-all">
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SystemSettings;
