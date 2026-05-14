import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useTheme } from '../context/ThemeContext';
import { Briefcase, UploadCloud, ChevronRight, Sun, Moon, Check } from 'lucide-react';

const CandidateRegistration = () => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        mobile: '',
        password: '',
        current_location: '',
        total_experience: '',
        notice_period: ''
    });
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [cvFile, setCvFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Master data
    const [masterSkills, setMasterSkills] = useState([]);
    const [noticePeriods, setNoticePeriods] = useState([]);

    useEffect(() => {
        fetchMasterData();
    }, []);

    const fetchMasterData = async () => {
        try {
            const [skillsRes, filtersRes] = await Promise.all([
                api.get('/settings/skills'),
                api.get('/settings/filters/notice_period')
            ]);
            setMasterSkills(skillsRes.data);
            setNoticePeriods(filtersRes.data);
            if (filtersRes.data.length > 0) {
                setFormData(prev => ({...prev, notice_period: filtersRes.data[0].value}));
            }
        } catch (err) {
            console.error("Failed to fetch master data", err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleSkill = (skillName) => {
        if (selectedSkills.includes(skillName)) {
            setSelectedSkills(selectedSkills.filter(s => s !== skillName));
        } else {
            setSelectedSkills([...selectedSkills, skillName]);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setCvFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!cvFile) {
            setError('Please upload your CV (PDF format).');
            return;
        }

        setLoading(true);
        setError('');

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });
        data.append('skills', JSON.stringify(selectedSkills));
        data.append('cv_file', cvFile);

        try {
            await api.post('/candidates/register', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("Registration successful! You can now log in.");
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.detail || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--background)] flex flex-col justify-center py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300">
            {/* Background elements - only in dark mode */}
            {theme === 'dark' && (
                <div className="fixed top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-900/10 blur-[150px] mix-blend-screen pointer-events-none"></div>
            )}
            
            {/* Theme Toggle */}
            <button 
                onClick={toggleTheme}
                className="fixed top-8 right-8 p-3 rounded-2xl bg-[var(--panel-bg)] border border-[var(--border-color)] text-[var(--muted-text)] hover:text-emerald-500 transition-all z-20"
            >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <div className="sm:mx-auto sm:w-full sm:max-w-3xl relative z-10">
                <div className="text-center mb-10">
                    <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-xl mb-8 transform hover:-rotate-3 transition-transform">
                        <Briefcase className="h-10 w-10 text-white" />
                    </div>
                    <h2 className="text-4xl font-black text-[var(--foreground)] tracking-tight">Join Our Talent Pool</h2>
                    <p className="mt-3 text-[var(--muted-text)] font-medium">Create your profile and get matched with top opportunities.</p>
                </div>

                <div className="glass-panel p-10 sm:p-12 rounded-[2.5rem] shadow-2xl border border-[var(--border-color)] bg-[var(--panel-bg)]">
                    <form onSubmit={handleSubmit} className="space-y-10">
                        {error && (
                            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-black p-4 rounded-2xl text-center uppercase tracking-widest">
                                {error}
                            </div>
                        )}
                        
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                            <div>
                                <label className="block text-[10px] font-black text-[var(--muted-text)] uppercase mb-2 tracking-widest ml-1">Full Name *</label>
                                <input type="text" name="full_name" required value={formData.full_name} onChange={handleChange}
                                    className="w-full px-6 py-4 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl text-[var(--foreground)] placeholder-[var(--muted-text)] font-bold focus:ring-2 focus:ring-emerald-500/50 transition-all shadow-inner" placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-[var(--muted-text)] uppercase mb-2 tracking-widest ml-1">Email Address *</label>
                                <input type="email" name="email" required value={formData.email} onChange={handleChange}
                                    className="w-full px-6 py-4 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl text-[var(--foreground)] placeholder-[var(--muted-text)] font-bold focus:ring-2 focus:ring-emerald-500/50 transition-all shadow-inner" placeholder="john@example.com" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-[var(--muted-text)] uppercase mb-2 tracking-widest ml-1">Mobile Number *</label>
                                <input type="tel" name="mobile" required value={formData.mobile} onChange={handleChange}
                                    className="w-full px-6 py-4 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl text-[var(--foreground)] placeholder-[var(--muted-text)] font-bold focus:ring-2 focus:ring-emerald-500/50 transition-all shadow-inner" placeholder="+1 234 567 8900" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-[var(--muted-text)] uppercase mb-2 tracking-widest ml-1">Password *</label>
                                <input type="password" name="password" required value={formData.password} onChange={handleChange}
                                    className="w-full px-6 py-4 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl text-[var(--foreground)] placeholder-[var(--muted-text)] font-bold focus:ring-2 focus:ring-emerald-500/50 transition-all shadow-inner" placeholder="••••••••" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-[var(--muted-text)] uppercase mb-2 tracking-widest ml-1">Location</label>
                                <input type="text" name="current_location" value={formData.current_location} onChange={handleChange}
                                    className="w-full px-6 py-4 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl text-[var(--foreground)] placeholder-[var(--muted-text)] font-bold focus:ring-2 focus:ring-emerald-500/50 transition-all shadow-inner" placeholder="New York, NY" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-[var(--muted-text)] uppercase mb-2 tracking-widest ml-1">Total Experience (Years)</label>
                                <input type="number" step="0.1" name="total_experience" value={formData.total_experience} onChange={handleChange}
                                    className="w-full px-6 py-4 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl text-[var(--foreground)] placeholder-[var(--muted-text)] font-bold focus:ring-2 focus:ring-emerald-500/50 transition-all shadow-inner" placeholder="3.5" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-[var(--muted-text)] uppercase mb-2 tracking-widest ml-1">Notice Period</label>
                                <select name="notice_period" value={formData.notice_period} onChange={handleChange}
                                    className="w-full px-6 py-4 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl text-[var(--foreground)] font-bold focus:ring-2 focus:ring-emerald-500/50 transition-all shadow-inner appearance-none">
                                    {noticePeriods.map(p => (
                                        <option key={p.id} value={p.value}>{p.label || p.value}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Skills Selection */}
                        <div>
                            <label className="block text-[10px] font-black text-[var(--muted-text)] uppercase mb-4 tracking-widest ml-1">Key Skills *</label>
                            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-4 bg-[var(--input-bg)] rounded-3xl border border-[var(--border-color)] shadow-inner custom-scrollbar">
                                {masterSkills.map(skill => {
                                    const isSelected = selectedSkills.includes(skill.name);
                                    return (
                                        <button
                                            key={skill.id}
                                            type="button"
                                            onClick={() => toggleSkill(skill.name)}
                                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center border ${
                                                isSelected 
                                                ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-500/20' 
                                                : 'bg-[var(--background)] text-[var(--muted-text)] border-[var(--border-color)] hover:border-emerald-500/50'
                                            }`}
                                        >
                                            {isSelected && <Check className="h-3 w-3 mr-1.5" />}
                                            {skill.name}
                                        </button>
                                    );
                                })}
                            </div>
                            {selectedSkills.length === 0 && <p className="text-[9px] text-rose-500 mt-2 font-bold uppercase tracking-widest ml-1">Please select at least one skill</p>}
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-[var(--muted-text)] uppercase mb-3 tracking-widest ml-1">Upload Resume / CV (PDF) *</label>
                            <div className="mt-1 flex justify-center px-10 pt-10 pb-10 border-2 border-[var(--border-color)] border-dashed rounded-3xl hover:border-emerald-500/50 transition-all bg-[var(--input-bg)] group relative overflow-hidden">
                                <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="space-y-3 text-center relative z-10">
                                    <UploadCloud className="mx-auto h-16 w-16 text-emerald-500/30 group-hover:text-emerald-500 transition-all group-hover:scale-110" />
                                    <div className="flex text-sm text-[var(--muted-text)] justify-center font-bold">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-black text-emerald-500 hover:text-emerald-400 focus-within:outline-none uppercase tracking-widest text-[10px]">
                                            <span>Upload a file</span>
                                            <input id="file-upload" name="file-upload" type="file" accept=".pdf" className="sr-only" onChange={handleFileChange} />
                                        </label>
                                        <p className="pl-1 uppercase tracking-widest text-[10px]">or drag and drop</p>
                                    </div>
                                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-tighter">
                                        {cvFile ? cvFile.name : 'PDF format up to 5MB'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || selectedSkills.length === 0}
                            className="w-full flex justify-center items-center py-5 px-6 rounded-2xl text-xs font-black uppercase tracking-widest text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition-all shadow-2xl shadow-emerald-500/20 disabled:opacity-50"
                        >
                            {loading ? 'Submitting Application...' : 'Create Account & Submit Profile'}
                            {!loading && <ChevronRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />}
                        </button>
                        
                        <div className="text-center mt-10 pt-10 border-t border-[var(--border-color)]">
                            <p className="text-xs font-bold text-[var(--muted-text)]">
                                Already have an account? <Link to="/login" className="font-black text-emerald-500 hover:text-emerald-400 uppercase tracking-widest ml-2">Sign in instead</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CandidateRegistration;
