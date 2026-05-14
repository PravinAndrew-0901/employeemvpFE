import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { Briefcase, MapPin, Search, ChevronRight, CheckCircle, Info, Sparkles, Filter } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const PublicJobs = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await api.get('/jobs/public');
            setJobs(res.data);
        } catch (err) {
            console.error('Failed to fetch jobs', err);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (jobId) => {
        if (!user) {
            navigate('/login', { state: { from: '/job-list' } });
            return;
        }
        
        try {
            setApplying(jobId);
            await api.post(`/applications/apply/${jobId}`);
            alert("Application submitted successfully!");
            // Refresh or update state to show applied
        } catch (err) {
            alert(err.response?.data?.detail || "Failed to apply");
        } finally {
            setApplying(null);
        }
    };

    const filteredJobs = jobs.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        job.client_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
            {/* Header / Navbar section could be here, but using simple layout for now */}
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="mb-16 text-center">
                    <h1 className="text-5xl font-black tracking-tighter mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">Explore <span className="text-blue-500">Opportunities</span></h1>
                    <p className="text-[var(--muted-text)] font-medium text-lg max-w-2xl mx-auto">Find your next career move with top clients and innovative projects.</p>
                </div>

                <div className="glass-panel p-8 rounded-[2.5rem] border border-[var(--border-color)] bg-[var(--panel-bg)] shadow-2xl mb-12">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--muted-text)]" />
                            <input 
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-14 pr-6 py-4 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl font-bold focus:ring-2 focus:ring-blue-500/50 shadow-inner"
                                placeholder="Search by Job Title, Role or Company..."
                            />
                        </div>
                        <button className="px-8 py-4 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl flex items-center justify-center font-black uppercase tracking-widest text-[10px] text-[var(--muted-text)] hover:text-blue-500 hover:border-blue-500 transition-all">
                            <Filter className="h-4 w-4 mr-2" />
                            Filters
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-80 glass-panel rounded-[2rem] border border-[var(--border-color)] bg-[var(--panel-bg)] animate-pulse"></div>
                        ))}
                    </div>
                ) : filteredJobs.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-xl font-black text-[var(--muted-text)]">No matching jobs found at the moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredJobs.map(job => (
                            <div key={job.id} className="glass-panel rounded-[2rem] border border-[var(--border-color)] bg-[var(--panel-bg)] p-8 hover:border-blue-500/50 transition-all group relative overflow-hidden flex flex-col h-full shadow-xl">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                
                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    <div className="h-14 w-14 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shadow-lg">
                                        <Briefcase className="h-7 w-7" />
                                    </div>
                                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase tracking-widest rounded-full border border-emerald-500/20">
                                        Active
                                    </span>
                                </div>

                                <h3 className="text-xl font-black mb-2 group-hover:text-blue-500 transition-colors line-clamp-2">{job.title}</h3>
                                <p className="text-xs font-bold text-[var(--muted-text)] uppercase tracking-widest mb-6">{job.client_name || 'Premium Client'}</p>

                                <div className="space-y-3 mb-8 flex-1">
                                    <div className="flex items-center text-xs font-bold text-[var(--muted-text)]">
                                        <MapPin className="h-4 w-4 mr-2 text-rose-500/50" /> {job.location || 'Remote'}
                                    </div>
                                    <div className="flex items-center text-xs font-bold text-[var(--muted-text)]">
                                        < Sparkles className="h-4 w-4 mr-2 text-amber-500/50" /> {job.experience_range || 'Entry Level'}
                                    </div>
                                    <div className="flex items-center text-xs font-bold text-[var(--muted-text)]">
                                        <Info className="h-4 w-4 mr-2 text-blue-500/50" /> {job.work_mode || 'Full-time'}
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-[var(--border-color)] flex gap-4">
                                    <button 
                                        onClick={() => handleApply(job.id)}
                                        disabled={applying === job.id}
                                        className="flex-1 px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center"
                                    >
                                        {applying === job.id ? 'Applying...' : 'Apply Now'}
                                        {applying !== job.id && <ChevronRight className="h-4 w-4 ml-2" />}
                                    </button>
                                    <Link 
                                        to={`/jobs/${job.id}`}
                                        className="p-4 bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--muted-text)] hover:text-blue-500 rounded-2xl transition-all"
                                    >
                                        <Info className="h-5 w-5" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-20 p-10 rounded-[3rem] bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-[-50%] right-[-10%] w-[60%] h-[150%] bg-white/10 skew-x-[-30deg] group-hover:translate-x-[-20%] transition-transform duration-1000"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="max-w-xl">
                            <h2 className="text-4xl font-black tracking-tighter mb-4">Don't see the right role?</h2>
                            <p className="text-blue-100 font-medium text-lg">Create a profile and let our recruiters find the best opportunities for you.</p>
                        </div>
                        <Link to="/register" className="px-10 py-5 bg-white text-blue-600 rounded-2xl font-black uppercase tracking-[0.1em] text-xs shadow-2xl hover:scale-105 transition-all">
                            Register Now
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicJobs;
