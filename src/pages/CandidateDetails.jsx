import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { 
    ChevronLeft, User, Phone, Mail, MapPin, Briefcase, 
    Calendar, MessageSquare, Clock, CheckCircle, FileText, 
    UserPlus, X, DollarSign, Building2, ShieldCheck
} from 'lucide-react';

const CANDIDATE_STATUSES = [
    'New', 'Profile Reviewed', 'Shortlisted', 'Rejected', 'Duplicate',
    'Contacted', 'Not Responding', 'Interested', 'Not Interested',
    'Interview Scheduled', 'Interview Completed', 'Selected', 'Offer Released', 'Joined', 'On Hold'
];

const CandidateDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [candidate, setCandidate] = useState(null);
    const [followUps, setFollowUps] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form states
    const [newStatus, setNewStatus] = useState('');
    const [statusUpdating, setStatusUpdating] = useState(false);

    const [followUpData, setFollowUpData] = useState({
        type: 'Call',
        remarks: '',
        next_follow_up_date: ''
    });
    const [followUpAdding, setFollowUpAdding] = useState(false);

    // Hiring Modal States
    const [showHireModal, setShowHireModal] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [hiringData, setHiringData] = useState({
        employee_code: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
        department_id: '',
        designation_id: '',
        base_salary: '',
        joining_date: new Date().toISOString().split('T')[0]
    });
    const [hiring, setHiring] = useState(false);

    useEffect(() => {
        fetchData();
        fetchOrgData();
    }, [id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [candRes, followRes] = await Promise.all([
                api.get(`/candidates/${id}`),
                api.get(`/follow-ups/candidate/${id}`)
            ]);
            setCandidate(candRes.data);
            setNewStatus(candRes.data.status);
            setFollowUps(followRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrgData = async () => {
        try {
            const [deptRes, desigRes] = await Promise.all([
                api.get('/settings/departments'),
                api.get('/settings/designations')
            ]);
            setDepartments(deptRes.data);
            setDesignations(desigRes.data);
        } catch (err) {
            console.error("Failed to fetch org data", err);
        }
    };

    const handleStatusUpdate = async () => {
        try {
            setStatusUpdating(true);
            await api.put(`/candidates/${id}/status`, { status: newStatus });
            setCandidate(prev => ({ ...prev, status: newStatus }));
            if (newStatus === 'Joined') {
                // If manually set to joined, maybe prompt hire? 
                // Better to use the dedicated Hire button
            }
        } catch (err) {
            console.error(err);
            alert("Failed to update status");
        } finally {
            setStatusUpdating(false);
        }
    };

    const handleHire = async (e) => {
        e.preventDefault();
        try {
            setHiring(true);
            const payload = {
                candidate_id: parseInt(id),
                ...hiringData,
                base_salary: parseFloat(hiringData.base_salary),
                joining_date: new Date(hiringData.joining_date).toISOString()
            };
            await api.post('/employees/hire', payload);
            alert("Candidate successfully hired and employee record created!");
            setShowHireModal(false);
            navigate('/staff');
        } catch (err) {
            console.error(err);
            alert("Failed to hire candidate. Check if employee code is unique.");
        } finally {
            setHiring(false);
        }
    };

    const handleAddFollowUp = async (e) => {
        e.preventDefault();
        try {
            setFollowUpAdding(true);
            const payload = {
                candidate_id: parseInt(id),
                type: followUpData.type,
                remarks: followUpData.remarks,
                next_follow_up_date: followUpData.next_follow_up_date ? new Date(followUpData.next_follow_up_date).toISOString() : null
            };
            const res = await api.post('/follow-ups/', payload);
            setFollowUps([res.data, ...followUps]);
            setFollowUpData({ type: 'Call', remarks: '', next_follow_up_date: '' });
        } catch (err) {
            console.error(err);
            alert("Failed to add follow-up");
        } finally {
            setFollowUpAdding(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
    );

    if (!candidate) return <div className="text-[var(--foreground)] text-center mt-20">Candidate not found</div>;

    return (
        <div className="w-full h-full relative z-10 pb-10">
            {/* Hire Modal */}
            {showHireModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="glass-panel w-full max-w-xl rounded-[2.5rem] p-10 border border-blue-500/30 bg-[var(--panel-bg)] shadow-2xl relative">
                        <button onClick={() => setShowHireModal(false)} className="absolute top-8 right-8 p-2 hover:bg-rose-500/10 hover:text-rose-500 transition-colors rounded-xl text-[var(--muted-text)]">
                            <X className="h-6 w-6" />
                        </button>

                        <div className="flex items-center mb-10">
                            <div className="h-14 w-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white mr-5 shadow-lg shadow-blue-600/30">
                                <UserPlus className="h-7 w-7" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black tracking-tight">Hire Candidate</h3>
                                <p className="text-sm font-bold text-[var(--muted-text)] uppercase tracking-widest text-blue-500/70">Convert {candidate.full_name} to Employee</p>
                            </div>
                        </div>

                        <form onSubmit={handleHire} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-[var(--muted-text)] uppercase mb-2 tracking-widest">Employee Code</label>
                                    <input 
                                        required
                                        type="text"
                                        value={hiringData.employee_code}
                                        onChange={e => setHiringData({...hiringData, employee_code: e.target.value})}
                                        className="w-full px-5 py-4 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl font-bold shadow-inner"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-[var(--muted-text)] uppercase mb-2 tracking-widest">Joining Date</label>
                                    <input 
                                        required
                                        type="date"
                                        value={hiringData.joining_date}
                                        onChange={e => setHiringData({...hiringData, joining_date: e.target.value})}
                                        className="w-full px-5 py-4 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl font-bold shadow-inner"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-[var(--muted-text)] uppercase mb-2 tracking-widest">Department</label>
                                    <select 
                                        required
                                        value={hiringData.department_id}
                                        onChange={e => setHiringData({...hiringData, department_id: e.target.value})}
                                        className="w-full px-5 py-4 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl font-bold shadow-inner"
                                    >
                                        <option value="">Select Dept</option>
                                        {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-[var(--muted-text)] uppercase mb-2 tracking-widest">Designation</label>
                                    <select 
                                        required
                                        value={hiringData.designation_id}
                                        onChange={e => setHiringData({...hiringData, designation_id: e.target.value})}
                                        className="w-full px-5 py-4 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl font-bold shadow-inner"
                                    >
                                        <option value="">Select Role</option>
                                        {designations.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-[var(--muted-text)] uppercase mb-2 tracking-widest">Base Salary (Annual)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-text)]" />
                                    <input 
                                        required
                                        type="number"
                                        placeholder="e.g. 75000"
                                        value={hiringData.base_salary}
                                        onChange={e => setHiringData({...hiringData, base_salary: e.target.value})}
                                        className="w-full pl-12 pr-6 py-4 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl font-bold shadow-inner"
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={hiring}
                                    className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-500/30 flex items-center justify-center transition-all"
                                >
                                    <ShieldCheck className="h-5 w-5 mr-3" />
                                    {hiring ? 'Processing...' : 'Complete Hire & Create Profile'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto pb-4 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
                    <div className="flex items-center space-x-4">
                        <Link to="/candidates" className="p-3 rounded-2xl bg-[var(--panel-bg)] hover:bg-blue-500/10 border border-[var(--border-color)] transition-all group">
                            <ChevronLeft className="h-5 w-5 text-[var(--muted-text)] group-hover:text-blue-500 group-hover:-translate-x-1 transition-all" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight">Candidate Profile</h1>
                            <p className="text-[var(--muted-text)] font-medium">Detailed view and pipeline tracking</p>
                        </div>
                    </div>

                    {(candidate.status === 'Selected' || candidate.status === 'Offer Released') && (
                        <button 
                            onClick={() => setShowHireModal(true)}
                            className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-emerald-500/20 flex items-center transition-all animate-bounce-subtle"
                        >
                            <UserPlus className="h-4 w-4 mr-2" />
                            Hire Candidate
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Column - Details */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="glass-panel rounded-[2rem] p-10 border border-[var(--border-color)] relative overflow-hidden shadow-2xl bg-[var(--panel-bg)]">
                            <div className="absolute top-0 right-0 p-8">
                                <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border bg-[var(--background)] text-[var(--muted-text)] border-[var(--border-color)]">
                                    ID: #{candidate.id}
                                </span>
                            </div>
                            <div className="flex items-center mb-10">
                                <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-xl shadow-blue-500/20 text-4xl font-black text-white border-2 border-white/10">
                                    {candidate.full_name.charAt(0).toUpperCase()}
                                </div>
                                <div className="ml-8">
                                    <h2 className="text-4xl font-black group-hover:text-blue-500 transition-colors">{candidate.full_name}</h2>
                                    <p className="text-blue-500 font-bold uppercase tracking-widest text-xs mt-2">{candidate.applied_role || 'General Application'}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-center text-[var(--foreground)] bg-[var(--input-bg)] p-5 rounded-2xl border border-[var(--border-color)] shadow-sm">
                                    <Mail className="h-5 w-5 mr-4 text-blue-500" />
                                    <span className="font-bold text-sm">{candidate.email}</span>
                                </div>
                                <div className="flex items-center text-[var(--foreground)] bg-[var(--input-bg)] p-5 rounded-2xl border border-[var(--border-color)] shadow-sm">
                                    <Phone className="h-5 w-5 mr-4 text-emerald-500" />
                                    <span className="font-bold text-sm">{candidate.mobile}</span>
                                </div>
                                <div className="flex items-center text-[var(--foreground)] bg-[var(--input-bg)] p-5 rounded-2xl border border-[var(--border-color)] shadow-sm">
                                    <MapPin className="h-5 w-5 mr-4 text-rose-500" />
                                    <span className="font-bold text-sm">{candidate.current_location || 'Location not provided'}</span>
                                </div>
                                <div className="flex items-center text-[var(--foreground)] bg-[var(--input-bg)] p-5 rounded-2xl border border-[var(--border-color)] shadow-sm">
                                    <Briefcase className="h-5 w-5 mr-4 text-purple-500" />
                                    <span className="font-bold text-sm">{candidate.total_experience ? `${candidate.total_experience} Years Experience` : 'Fresher'}</span>
                                </div>
                            </div>

                            {candidate.cv_file_path && (
                                <div className="mt-10 pt-10 border-t border-[var(--border-color)]">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-blue-500 mb-6">Resume / CV</h3>
                                    <a 
                                        href={`http://localhost:8000/${candidate.cv_file_path}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-8 py-4 rounded-2xl font-black text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 group uppercase tracking-widest text-xs"
                                    >
                                        <FileText className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                                        View Uploaded Resume
                                    </a>
                                </div>
                            )}

                            <div className="mt-10 pt-10 border-t border-[var(--border-color)]">
                                <h3 className="text-sm font-black uppercase tracking-widest text-purple-500 mb-6">Skills & Keywords</h3>
                                <div className="flex flex-wrap gap-2.5">
                                    {candidate.skills && candidate.skills.length > 0 ? (
                                        candidate.skills.map((skill, i) => (
                                            <span key={i} className="px-4 py-2 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 text-xs font-black uppercase tracking-tight shadow-sm">
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-[var(--muted-text)] font-bold italic">No skills extracted</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Status Update Card */}
                        <div className="glass-panel rounded-[2rem] p-10 border border-[var(--border-color)] bg-[var(--panel-bg)] shadow-2xl">
                            <h3 className="text-sm font-black uppercase tracking-widest text-blue-500 mb-8">Pipeline Status</h3>
                            <div className="flex flex-col sm:flex-row gap-6 items-center">
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="w-full sm:w-2/3 px-6 py-4 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl text-[var(--foreground)] font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-inner appearance-none"
                                >
                                    {CANDIDATE_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                <button
                                    onClick={handleStatusUpdate}
                                    disabled={statusUpdating || newStatus === candidate.status}
                                    className="w-full sm:w-1/3 py-4 px-6 rounded-2xl font-black text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50 uppercase tracking-widest text-xs"
                                >
                                    {statusUpdating ? 'Updating...' : 'Update Status'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Follow-ups */}
                    <div className="space-y-8">
                        <div className="glass-panel rounded-[2rem] p-8 border border-[var(--border-color)] bg-[var(--panel-bg)] shadow-2xl">
                            <h3 className="text-sm font-black uppercase tracking-widest text-blue-500 mb-8 flex items-center">
                                <MessageSquare className="h-5 w-5 mr-3" />
                                Add Follow-up
                            </h3>
                            <form onSubmit={handleAddFollowUp} className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-[var(--muted-text)] uppercase mb-2 tracking-widest">Interaction Type</label>
                                    <select
                                        value={followUpData.type}
                                        onChange={e => setFollowUpData({ ...followUpData, type: e.target.value })}
                                        className="w-full px-6 py-4 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl text-[var(--foreground)] font-bold shadow-inner"
                                    >
                                        <option value="Call">Call</option>
                                        <option value="Email">Email</option>
                                        <option value="WhatsApp">WhatsApp</option>
                                        <option value="Interview">Interview</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-[var(--muted-text)] uppercase mb-2 tracking-widest">Scheduled For (Optional)</label>
                                    <input
                                        type="datetime-local"
                                        value={followUpData.next_follow_up_date}
                                        onChange={e => setFollowUpData({ ...followUpData, next_follow_up_date: e.target.value })}
                                        className="w-full px-6 py-4 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl text-[var(--foreground)] font-bold shadow-inner"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-[var(--muted-text)] uppercase mb-2 tracking-widest">Remarks</label>
                                    <textarea
                                        required
                                        rows="4"
                                        value={followUpData.remarks}
                                        onChange={e => setFollowUpData({ ...followUpData, remarks: e.target.value })}
                                        className="w-full px-6 py-4 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl text-[var(--foreground)] font-bold shadow-inner placeholder-[var(--muted-text)]"
                                        placeholder="Enter discussion details..."
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    disabled={followUpAdding}
                                    className="w-full py-5 rounded-2xl font-black text-white bg-slate-800 hover:bg-blue-600 transition-all border border-[var(--border-color)] uppercase tracking-widest text-xs shadow-lg"
                                >
                                    {followUpAdding ? 'Saving...' : 'Save Follow-up'}
                                </button>
                            </form>
                        </div>

                        <div className="glass-panel rounded-[2rem] p-8 border border-[var(--border-color)] bg-[var(--panel-bg)] shadow-2xl">
                            <h3 className="text-sm font-black uppercase tracking-widest text-purple-500 mb-8 flex items-center">
                                <Clock className="h-5 w-5 mr-3" />
                                Interaction Timeline
                            </h3>
                            <div className="space-y-8 max-h-[600px] overflow-y-auto pr-3 custom-scrollbar">
                                {followUps.length === 0 ? (
                                    <p className="text-[var(--muted-text)] text-sm font-bold italic">No follow-up history yet.</p>
                                ) : (
                                    followUps.map((f, i) => (
                                        <div key={i} className="relative pl-8 border-l-2 border-[var(--border-color)] last:border-transparent pb-8 last:pb-0">
                                            <div className="absolute left-[-9px] top-0 h-4 w-4 rounded-full bg-blue-500 shadow-lg shadow-blue-500/40 border-2 border-[var(--background)]"></div>
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-sm font-black text-[var(--foreground)] uppercase tracking-tight">{f.type}</span>
                                                <span className="text-[10px] font-bold text-[var(--muted-text)] uppercase">{new Date(f.follow_up_date).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-sm text-[var(--muted-text)] font-medium leading-relaxed">{f.remarks}</p>
                                            {f.next_follow_up_date && (
                                                <div className="mt-4 text-[10px] font-black uppercase bg-purple-500/10 text-purple-500 inline-block px-3 py-1.5 rounded-xl border border-purple-500/20 shadow-sm">
                                                    Next: {new Date(f.next_follow_up_date).toLocaleString()}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CandidateDetails;
