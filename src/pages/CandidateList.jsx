import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { Search, Briefcase, Filter, LayoutList, Columns, ChevronDown, ChevronUp, X, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const CandidateList = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('list');
    const [showAdvanced, setShowAdvanced] = useState(false);
    
    // Master data
    const [masterSkills, setMasterSkills] = useState([]);
    const [noticePeriods, setNoticePeriods] = useState([]);
    const [experienceRanges, setExperienceRanges] = useState([]);

    // Filtering states
    const [filters, setFilters] = useState({
        search: '',
        skill: '',
        status: '',
        minExp: '',
        maxExp: '',
        location: '',
        role: '',
        noticePeriod: ''
    });

    const STATUS_OPTIONS = ['New', 'Profile Reviewed', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected', 'On Hold'];
    const PIPELINE_STAGES = ['New', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Joined'];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [candRes, skillsRes, noticeRes, expRes] = await Promise.all([
                api.get('/candidates'),
                api.get('/settings/skills'),
                api.get('/settings/filters/notice_period'),
                api.get('/settings/filters/experience_range')
            ]);
            setCandidates(candRes.data.items);
            setMasterSkills(skillsRes.data);
            setNoticePeriods(noticeRes.data);
            setExperienceRanges(expRes.data);
        } catch (err) {
            console.error('Failed to fetch data', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            skill: '',
            status: '',
            minExp: '',
            maxExp: '',
            location: '',
            role: '',
            noticePeriod: ''
        });
    };

    const filteredCandidates = candidates.filter(c => {
        if (filters.search) {
            const term = filters.search.toLowerCase();
            const inName = c.full_name?.toLowerCase().includes(term);
            const inEmail = c.email?.toLowerCase().includes(term);
            const inSkills = Array.isArray(c.skills) ? c.skills.some(s => s.toLowerCase().includes(term)) : false;
            if (!inName && !inEmail && !inSkills) return false;
        }
        if (filters.skill) {
            const hasSkill = Array.isArray(c.skills) && c.skills.some(s => s.toLowerCase() === filters.skill.toLowerCase());
            if (!hasSkill) return false;
        }
        if (filters.status && c.status !== filters.status) return false;
        if (filters.minExp && (c.total_experience || 0) < parseFloat(filters.minExp)) return false;
        if (filters.maxExp && (c.total_experience || 0) > parseFloat(filters.maxExp)) return false;
        if (filters.location && !c.current_location?.toLowerCase().includes(filters.location.toLowerCase())) return false;
        if (filters.role && !c.applied_role?.toLowerCase().includes(filters.role.toLowerCase())) return false;
        if (filters.noticePeriod && c.notice_period !== filters.noticePeriod) return false;
        return true;
    });

    const getCandidatesByStage = (stage) => {
        return filteredCandidates.filter(c => c.status === stage);
    };

    return (
        <div className="w-full h-full relative z-10 pb-10">
            <div className="max-w-full mx-auto pb-8 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Candidate Directory</h1>
                        <p className="text-[var(--muted-text)] font-medium mt-1">Advanced search and pipeline management</p>
                    </div>
                    
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button 
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className={`flex items-center px-6 py-3 rounded-2xl border transition-all text-xs font-black uppercase tracking-widest ${showAdvanced ? 'bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-500/20' : 'bg-[var(--panel-bg)] border-[var(--border-color)] text-[var(--muted-text)] hover:text-blue-500 hover:border-blue-500/30'}`}
                        >
                            <Filter className="h-4 w-4 mr-2" />
                            Filters
                            {showAdvanced ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
                        </button>

                        <div className="flex bg-[var(--panel-bg)] p-1.5 rounded-2xl border border-[var(--border-color)] shadow-xl ml-auto md:ml-0">
                            <button 
                                onClick={() => setViewMode('list')}
                                className={`p-2.5 rounded-xl flex items-center transition-all ${viewMode === 'list' ? 'bg-blue-600 text-white shadow-lg' : 'text-[var(--muted-text)] hover:text-blue-400'}`}
                            >
                                <LayoutList className="h-4 w-4" />
                            </button>
                            <button 
                                onClick={() => setViewMode('kanban')}
                                className={`p-2.5 rounded-xl flex items-center transition-all ${viewMode === 'kanban' ? 'bg-blue-600 text-white shadow-lg' : 'text-[var(--muted-text)] hover:text-blue-400'}`}
                            >
                                <Columns className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="glass-panel rounded-[2.5rem] p-8 mb-8 border border-[var(--border-color)] shadow-2xl bg-[var(--panel-bg)]">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="md:col-span-2 relative">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-[var(--muted-text)]" />
                            </div>
                            <input
                                type="text"
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                className="block w-full pl-14 pr-6 py-4 border border-[var(--border-color)] rounded-2xl bg-[var(--input-bg)] text-[var(--foreground)] placeholder-[var(--muted-text)] font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm shadow-inner"
                                placeholder="Search Name, Email, or Skills..."
                            />
                        </div>

                        <select
                            value={filters.skill}
                            onChange={(e) => handleFilterChange('skill', e.target.value)}
                            className="block w-full px-6 py-4 border border-[var(--border-color)] rounded-2xl bg-[var(--input-bg)] text-[var(--foreground)] font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm shadow-inner appearance-none"
                        >
                            <option value="">All Skills</option>
                            {masterSkills.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                        </select>

                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="block w-full px-6 py-4 border border-[var(--border-color)] rounded-2xl bg-[var(--input-bg)] text-[var(--foreground)] font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm shadow-inner appearance-none"
                        >
                            <option value="">All Statuses</option>
                            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    {showAdvanced && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mt-8 pt-8 border-t border-[var(--border-color)] animate-in fade-in slide-in-from-top-4 duration-300">
                            <div>
                                <label className="block text-[10px] font-black text-[var(--muted-text)] uppercase mb-3 tracking-widest ml-1">Experience Range</label>
                                <div className="flex gap-3">
                                    <input 
                                        type="number" placeholder="Min"
                                        value={filters.minExp} onChange={e => handleFilterChange('minExp', e.target.value)}
                                        className="w-1/2 px-4 py-3 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl text-[var(--foreground)] text-sm font-bold shadow-inner" 
                                    />
                                    <input 
                                        type="number" placeholder="Max"
                                        value={filters.maxExp} onChange={e => handleFilterChange('maxExp', e.target.value)}
                                        className="w-1/2 px-4 py-3 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl text-[var(--foreground)] text-sm font-bold shadow-inner" 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-[var(--muted-text)] uppercase mb-3 tracking-widest ml-1">Applied Role</label>
                                <input 
                                    type="text" placeholder="e.g. Frontend"
                                    value={filters.role} onChange={e => handleFilterChange('role', e.target.value)}
                                    className="w-full px-4 py-3 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl text-[var(--foreground)] text-sm font-bold shadow-inner" 
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-[var(--muted-text)] uppercase mb-3 tracking-widest ml-1">Location</label>
                                <input 
                                    type="text" placeholder="e.g. Bangalore"
                                    value={filters.location} onChange={e => handleFilterChange('location', e.target.value)}
                                    className="w-full px-4 py-3 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl text-[var(--foreground)] text-sm font-bold shadow-inner" 
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-[var(--muted-text)] uppercase mb-3 tracking-widest ml-1">Notice Period</label>
                                <select 
                                    value={filters.noticePeriod} onChange={e => handleFilterChange('noticePeriod', e.target.value)}
                                    className="w-full px-4 py-3 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl text-[var(--foreground)] text-sm font-bold shadow-inner"
                                >
                                    <option value="">Any Notice</option>
                                    {noticePeriods.map(n => <option key={n.id} value={n.value}>{n.label || n.value}</option>)}
                                </select>
                            </div>
                        </div>
                    )}

                    {Object.values(filters).some(v => v !== '') && (
                        <div className="flex justify-between items-center mt-8 pt-6 border-t border-[var(--border-color)]">
                            <span className="text-[10px] text-[var(--muted-text)] font-black uppercase tracking-widest">Showing {filteredCandidates.length} Matches</span>
                            <button 
                                onClick={clearFilters}
                                className="text-[10px] font-black text-rose-500 hover:text-rose-400 transition-colors uppercase tracking-widest flex items-center"
                            >
                                <X className="h-3.5 w-3.5 mr-2" />
                                Clear All Filters
                            </button>
                        </div>
                    )}
                </div>

                {viewMode === 'list' ? (
                    <div className="glass-panel rounded-[2.5rem] overflow-hidden border border-[var(--border-color)] shadow-2xl bg-[var(--panel-bg)]">
                        <div className="overflow-x-auto">
                            {loading ? (
                                <div className="p-24 text-center text-[var(--muted-text)] font-bold animate-pulse">Scanning candidate database...</div>
                            ) : filteredCandidates.length === 0 ? (
                                <div className="p-24 text-center">
                                    <p className="text-lg font-black text-[var(--muted-text)] uppercase tracking-tight">No candidates found</p>
                                    <p className="text-xs text-[var(--muted-text)] mt-2 font-bold opacity-60">Try adjusting your filters or search terms.</p>
                                </div>
                            ) : (
                                <table className="min-w-full divide-y divide-[var(--border-color)]">
                                    <thead className="bg-[var(--panel-bg)]">
                                        <tr>
                                            <th className="px-8 py-6 text-left text-xs font-black text-[var(--muted-text)] uppercase tracking-widest">Candidate</th>
                                            <th className="px-8 py-6 text-left text-xs font-black text-[var(--muted-text)] uppercase tracking-widest">Experience / Role</th>
                                            <th className="px-8 py-6 text-left text-xs font-black text-[var(--muted-text)] uppercase tracking-widest">Skills</th>
                                            <th className="px-8 py-6 text-left text-xs font-black text-[var(--muted-text)] uppercase tracking-widest">Status</th>
                                            <th className="px-8 py-6 text-right text-xs font-black text-[var(--muted-text)] uppercase tracking-widest">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--border-color)]">
                                        {filteredCandidates.map((candidate) => (
                                            <tr key={candidate.id} className="hover:bg-blue-500/5 transition-colors group">
                                                <td className="px-8 py-6 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 border border-white/10 flex items-center justify-center text-white font-black shadow-lg">
                                                            {candidate.full_name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="ml-5">
                                                            <div className="text-sm font-black text-[var(--foreground)] group-hover:text-blue-500 transition-colors">{candidate.full_name}</div>
                                                            <div className="text-[10px] text-[var(--muted-text)] mt-1 font-bold">{candidate.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 whitespace-nowrap">
                                                    <div className="text-sm text-[var(--foreground)] font-black">{candidate.total_experience || 0} Years</div>
                                                    <div className="text-[10px] text-[var(--muted-text)] mt-1 font-bold uppercase tracking-widest">{candidate.applied_role || 'General'}</div>
                                                </td>
                                                <td className="px-8 py-6 whitespace-nowrap">
                                                    <div className="flex flex-wrap gap-2 max-w-[300px]">
                                                        {candidate.skills && Array.isArray(candidate.skills) ? (
                                                            candidate.skills.slice(0, 3).map((s, i) => (
                                                                <span key={i} className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 text-[10px] font-black uppercase tracking-tight">
                                                                    {s}
                                                                </span>
                                                            ))
                                                        ) : <span className="text-[var(--muted-text)] text-[10px] font-bold">None</span>}
                                                        {candidate.skills?.length > 3 && (
                                                            <span className="text-[var(--muted-text)] text-[10px] font-black self-center">+{candidate.skills.length - 3}</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 whitespace-nowrap">
                                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm
                                                        ${candidate.status === 'New' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 
                                                          candidate.status === 'Shortlisted' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                                                          candidate.status === 'Rejected' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                                                          'bg-slate-500/10 text-[var(--muted-text)] border-slate-500/20'}`}>
                                                        {candidate.status}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 whitespace-nowrap text-right">
                                                    <Link to={`/candidates/${candidate.id}`} className="px-6 py-2.5 rounded-xl bg-[var(--input-bg)] hover:bg-blue-600 border border-[var(--border-color)] hover:border-blue-500 text-[var(--foreground)] hover:text-white transition-all text-[10px] font-black uppercase tracking-widest shadow-lg">
                                                        Review
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex gap-8 overflow-x-auto pb-10 pt-2 h-[calc(100vh-320px)] custom-scrollbar px-2">
                        {loading ? (
                            <div className="w-full text-center py-24 text-[var(--muted-text)] font-black uppercase tracking-[0.2em] animate-pulse">Loading Pipeline...</div>
                        ) : (
                            PIPELINE_STAGES.map(stage => {
                                const stageCandidates = getCandidatesByStage(stage);
                                return (
                                    <div key={stage} className="min-w-[360px] w-96 flex flex-col bg-[var(--panel-bg)] rounded-[2.5rem] border border-[var(--border-color)] overflow-hidden shrink-0 shadow-2xl relative">
                                        <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--panel-bg)] sticky top-0 z-10">
                                            <h3 className="font-black text-[var(--foreground)] text-xs uppercase tracking-[0.2em]">{stage}</h3>
                                            <span className="bg-[var(--input-bg)] text-blue-500 text-[10px] py-1.5 px-4 rounded-full font-black border border-[var(--border-color)] shadow-inner">{stageCandidates.length}</span>
                                        </div>
                                        <div className="p-6 flex-1 overflow-y-auto space-y-5 custom-scrollbar">
                                            {stageCandidates.map(c => (
                                                <div key={c.id} className="bg-[var(--background)] border border-[var(--border-color)] rounded-[2rem] p-6 hover:border-blue-500/50 transition-all shadow-xl hover:shadow-blue-500/10 cursor-pointer group relative overflow-hidden">
                                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                    <div className="flex justify-between items-start mb-5 relative z-10">
                                                        <div className="font-black text-[var(--foreground)] text-base group-hover:text-blue-500 transition-colors tracking-tight">{c.full_name}</div>
                                                        <span className="text-[9px] bg-[var(--input-bg)] text-[var(--muted-text)] px-3 py-1 rounded-full border border-[var(--border-color)] font-black uppercase">#{c.id}</span>
                                                    </div>
                                                    <div className="text-[11px] text-[var(--muted-text)] space-y-3 mb-6 relative z-10 font-bold">
                                                        <div className="flex items-center"><Briefcase className="h-4 w-4 mr-3 text-blue-500/50" /> {c.applied_role || 'General'}</div>
                                                        <div className="flex items-center"><Check className="h-4 w-4 mr-3 text-emerald-500/50" /> {c.total_experience || 0} Years Experience</div>
                                                    </div>
                                                    <div className="flex justify-between items-center pt-6 border-t border-[var(--border-color)] relative z-10">
                                                        <div className="text-[9px] text-[var(--muted-text)] font-black uppercase tracking-widest opacity-60">
                                                            {new Date(c.created_at || Date.now()).toLocaleDateString()}
                                                        </div>
                                                        <Link to={`/candidates/${c.id}`} className="text-[10px] text-blue-500 hover:text-white font-black uppercase tracking-widest flex items-center group/btn">
                                                            Profile
                                                            <ChevronDown className="h-4 w-4 ml-2 -rotate-90 group-hover/btn:translate-x-1 transition-transform" />
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                            {stageCandidates.length === 0 && (
                                                <div className="py-12 text-center text-[var(--muted-text)] font-bold text-xs opacity-50 uppercase tracking-widest">Empty Stage</div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CandidateList;
