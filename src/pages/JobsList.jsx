import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { Briefcase, MapPin, Search, Plus, Filter, Calendar, X, Check } from 'lucide-react';

const JobsList = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    
    // Master data
    const [masterSkills, setMasterSkills] = useState([]);
    const [expRanges, setExpRanges] = useState([]);
    const [workModes, setWorkModes] = useState([]);

    // Form state
    const [jobForm, setJobForm] = useState({
        title: '',
        client_name: '',
        experience_range: '',
        location: '',
        work_mode: 'Remote',
        budget: '',
        number_of_positions: 1,
        description: '',
        skills_required: []
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [jobsRes, skillsRes, expRes, modeRes] = await Promise.all([
                api.get('/jobs'),
                api.get('/settings/skills'),
                api.get('/settings/filters/experience_range'),
                api.get('/settings/filters/work_mode')
            ]);
            setJobs(jobsRes.data);
            setMasterSkills(skillsRes.data);
            setExpRanges(expRes.data);
            setWorkModes(modeRes.data);
            
            if (expRes.data.length > 0) {
                setJobForm(prev => ({...prev, experience_range: expRes.data[0].value}));
            }
        } catch (err) {
            console.error('Failed to fetch jobs', err);
        } finally {
            setLoading(false);
        }
    };

    const toggleSkill = (skillName) => {
        if (jobForm.skills_required.includes(skillName)) {
            setJobForm({...jobForm, skills_required: jobForm.skills_required.filter(s => s !== skillName)});
        } else {
            setJobForm({...jobForm, skills_required: [...jobForm.skills_required, skillName]});
        }
    };

    const handleCreateJob = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/jobs', jobForm);
            setJobs([res.data, ...jobs]);
            setShowCreateModal(false);
            setJobForm({
                title: '', client_name: '', experience_range: expRanges[0]?.value || '', 
                location: '', work_mode: 'Remote', budget: '', 
                number_of_positions: 1, description: '', skills_required: []
            });
        } catch (err) {
            alert("Failed to create job");
        }
    };

    return (
        <div className="w-full h-full relative z-10 pb-10">
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-[var(--foreground)]">Job Openings</h1>
                        <p className="text-[var(--muted-text)] font-medium mt-1">Manage all your active and closed job requisitions</p>
                    </div>
                    <button 
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl transition-all shadow-xl shadow-blue-500/20 font-black text-xs uppercase tracking-widest"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Create New Job
                    </button>
                </div>

                {/* CREATE MODAL */}
                {showCreateModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
                        <div className="glass-panel w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[var(--panel-bg)] rounded-[2.5rem] border border-[var(--border-color)] shadow-2xl p-10 custom-scrollbar relative animate-in zoom-in-95 duration-300">
                            <button onClick={() => setShowCreateModal(false)} className="absolute top-8 right-8 text-[var(--muted-text)] hover:text-rose-500 transition-colors">
                                <X className="h-7 w-7" />
                            </button>
                            
                            <h2 className="text-3xl font-black mb-8 tracking-tighter">New Job Requisition</h2>
                            
                            <form onSubmit={handleCreateJob} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-[10px] font-black text-[var(--muted-text)] uppercase mb-2 tracking-widest ml-1">Job Title *</label>
                                        <input type="text" required value={jobForm.title} onChange={e => setJobForm({...jobForm, title: e.target.value})}
                                            className="w-full px-6 py-4 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl text-[var(--foreground)] font-bold focus:ring-2 focus:ring-blue-500/50 shadow-inner" placeholder="e.g. Senior Frontend Engineer" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-[var(--muted-text)] uppercase mb-2 tracking-widest ml-1">Client Name</label>
                                        <input type="text" value={jobForm.client_name} onChange={e => setJobForm({...jobForm, client_name: e.target.value})}
                                            className="w-full px-6 py-4 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl text-[var(--foreground)] font-bold focus:ring-2 focus:ring-blue-500/50 shadow-inner" placeholder="e.g. Google Cloud" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-[var(--muted-text)] uppercase mb-2 tracking-widest ml-1">Exp. Range</label>
                                        <select value={jobForm.experience_range} onChange={e => setJobForm({...jobForm, experience_range: e.target.value})}
                                            className="w-full px-6 py-4 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl text-[var(--foreground)] font-bold appearance-none">
                                            {expRanges.map(r => <option key={r.id} value={r.value}>{r.label || r.value}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-[var(--muted-text)] uppercase mb-2 tracking-widest ml-1">Work Mode</label>
                                        <select value={jobForm.work_mode} onChange={e => setJobForm({...jobForm, work_mode: e.target.value})}
                                            className="w-full px-6 py-4 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl text-[var(--foreground)] font-bold appearance-none">
                                            {workModes.map(m => <option key={m.id} value={m.value}>{m.label || m.value}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-[var(--muted-text)] uppercase mb-2 tracking-widest ml-1">Location</label>
                                        <input type="text" value={jobForm.location} onChange={e => setJobForm({...jobForm, location: e.target.value})}
                                            className="w-full px-6 py-4 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl text-[var(--foreground)] font-bold shadow-inner" placeholder="e.g. Remote / Bangalore" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-[var(--muted-text)] uppercase mb-2 tracking-widest ml-1">Budget / Salary</label>
                                        <input type="text" value={jobForm.budget} onChange={e => setJobForm({...jobForm, budget: e.target.value})}
                                            className="w-full px-6 py-4 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl text-[var(--foreground)] font-bold shadow-inner" placeholder="e.g. 15-25 LPA" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-[var(--muted-text)] uppercase mb-4 tracking-widest ml-1">Required Skills *</label>
                                    <div className="flex flex-wrap gap-2 p-5 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-3xl shadow-inner max-h-40 overflow-y-auto custom-scrollbar">
                                        {masterSkills.map(skill => {
                                            const isSelected = jobForm.skills_required.includes(skill.name);
                                            return (
                                                <button key={skill.id} type="button" onClick={() => toggleSkill(skill.name)}
                                                    className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${isSelected ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20' : 'bg-[var(--background)] text-[var(--muted-text)] border-[var(--border-color)] hover:border-blue-500/50'}`}>
                                                    {skill.name}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-[var(--muted-text)] uppercase mb-2 tracking-widest ml-1">Job Description</label>
                                    <textarea rows="4" value={jobForm.description} onChange={e => setJobForm({...jobForm, description: e.target.value})}
                                        className="w-full px-6 py-4 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl text-[var(--foreground)] font-medium shadow-inner focus:ring-2 focus:ring-blue-500/50" placeholder="Paste JD or enter responsibilities..."></textarea>
                                </div>

                                <div className="flex justify-end space-x-6 pt-4">
                                    <button type="button" onClick={() => setShowCreateModal(false)} className="px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-[var(--muted-text)] hover:text-white hover:bg-slate-800 transition-all border border-[var(--border-color)]">Cancel</button>
                                    <button type="submit" className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/30 transition-all">
                                        Publish Requisition
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="glass-panel rounded-[2rem] overflow-hidden border border-[var(--border-color)] shadow-2xl bg-[var(--panel-bg)]">
                    <div className="p-8 border-b border-[var(--border-color)] flex flex-col md:flex-row justify-between items-center bg-[var(--panel-bg)] gap-6">
                        <div className="relative w-full md:w-1/2">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--muted-text)]" />
                            <input
                                type="text"
                                className="w-full pl-14 pr-6 py-4 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl text-sm text-[var(--foreground)] placeholder-[var(--muted-text)] font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-inner"
                                placeholder="Search jobs by title or client..."
                            />
                        </div>
                        <button className="flex items-center px-6 py-4 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl text-xs font-black uppercase tracking-widest text-[var(--muted-text)] hover:text-blue-500 hover:border-blue-500/50 transition-all shadow-sm">
                            <Filter className="h-4 w-4 mr-2" />
                            Filter Options
                        </button>
                    </div>

                    <div className="divide-y divide-[var(--border-color)]">
                        {loading ? (
                            <div className="p-20 text-center text-[var(--muted-text)] font-bold animate-pulse">Loading job requisitions...</div>
                        ) : jobs.length === 0 ? (
                            <div className="p-20 text-center">
                                <div className="h-24 w-24 rounded-[2rem] bg-[var(--input-bg)] flex items-center justify-center mx-auto mb-8 border border-[var(--border-color)] shadow-inner">
                                    <Briefcase className="h-10 w-10 text-[var(--muted-text)]" />
                                </div>
                                <p className="text-xl text-[var(--foreground)] font-black uppercase tracking-tight mb-2">No job openings found</p>
                                <p className="text-sm text-[var(--muted-text)] font-bold">Click "Create New Job" to add a requisition.</p>
                            </div>
                        ) : (
                            jobs.map(job => (
                                <div key={job.id} className="p-8 hover:bg-blue-500/5 transition-all flex flex-col md:flex-row items-center justify-between group">
                                    <div className="flex-1 w-full">
                                        <div className="flex flex-wrap items-center gap-3 mb-3">
                                            <h3 className="text-xl font-black text-[var(--foreground)] group-hover:text-blue-500 transition-colors">{job.title}</h3>
                                            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm
                                                ${job.status === 'Open' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-500/10 text-[var(--muted-text)] border-slate-500/20'}`}>
                                                {job.status}
                                            </span>
                                            {job.client_name && (
                                                <span className="text-[10px] font-black uppercase tracking-widest text-purple-500 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full">
                                                    {job.client_name}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap items-center text-xs text-[var(--muted-text)] gap-y-2 gap-x-8 font-bold">
                                            <div className="flex items-center"><MapPin className="h-4 w-4 mr-2 text-rose-500/50" /> {job.location || 'Remote'}</div>
                                            <div className="flex items-center"><Briefcase className="h-4 w-4 mr-2 text-blue-500/50" /> {job.experience_range || 'Entry Level'}</div>
                                            <div className="flex items-center font-mono uppercase tracking-tighter opacity-70"><Calendar className="h-4 w-4 mr-2" /> Created: {new Date(job.created_at).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-10 mt-6 md:mt-0 w-full md:w-auto border-t md:border-t-0 pt-6 md:pt-0 border-[var(--border-color)]">
                                        <div className="text-center bg-[var(--input-bg)] px-6 py-3 rounded-2xl border border-[var(--border-color)] shadow-inner">
                                            <div className="text-2xl font-black text-blue-500">{job.number_of_positions || 1}</div>
                                            <div className="text-[9px] text-[var(--muted-text)] font-black uppercase tracking-widest">Openings</div>
                                        </div>
                                        <button className="px-6 py-3 bg-[var(--background)] border border-[var(--border-color)] text-[var(--foreground)] font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all shadow-lg flex-1 md:flex-none">
                                            View Candidates
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobsList;
