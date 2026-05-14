import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { UserPlus, Edit2, Trash2, Shield, X, Check } from 'lucide-react';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(null);
    const [userForm, setUserForm] = useState({ name: '', email: '', mobile: '', password: '', role_id: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [usersRes, rolesRes] = await Promise.all([
                api.get('/users/'),
                api.get('/roles/')
            ]);
            setUsers(usersRes.data);
            setRoles(rolesRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCreate = () => {
        setUserForm({ name: '', email: '', mobile: '', password: '', role_id: roles[0]?.id || '' });
        setIsEditing(null);
        setIsCreating(true);
    };

    const handleOpenEdit = (user) => {
        setUserForm({
            name: user.name,
            email: user.email,
            mobile: user.mobile || '',
            password: '', // Don't pre-fill password
            role_id: user.role_id || ''
        });
        setIsCreating(false);
        setIsEditing(user.id);
    };

    const handleSaveUser = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                const res = await api.put(`/users/${isEditing}`, userForm);
                setUsers(users.map(u => u.id === isEditing ? res.data : u));
            } else {
                const res = await api.post('/users/', userForm);
                setUsers([...users, res.data]);
            }
            setIsCreating(false);
            setIsEditing(null);
        } catch (err) {
            alert(err.response?.data?.detail || "Failed to save user");
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await api.delete(`/users/${id}`);
            setUsers(users.filter(u => u.id !== id));
        } catch (err) {
            alert(err.response?.data?.detail || "Failed to delete user");
        }
    };

    return (
        <div className="w-full h-full relative z-10 pb-10">
            <div className="max-w-7xl mx-auto pb-4 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-[var(--foreground)]">User Management</h1>
                        <p className="text-[var(--muted-text)] font-medium mt-1">Manage internal HR and Recruiter accounts</p>
                    </div>
                    {!isCreating && !isEditing && (
                        <button onClick={handleOpenCreate} className="flex items-center px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl transition-all shadow-xl shadow-blue-500/20 font-black text-xs uppercase tracking-widest">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Add Internal User
                        </button>
                    )}
                </div>

                {(isCreating || isEditing) && (
                    <div className="glass-panel rounded-[2rem] p-10 mb-10 border border-[var(--border-color)] bg-[var(--panel-bg)] shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-black uppercase tracking-tight text-[var(--foreground)]">{isEditing ? 'Edit User' : 'Create New User'}</h3>
                            <button onClick={() => { setIsCreating(false); setIsEditing(null); }} className="text-[var(--muted-text)] hover:text-rose-500 transition-colors">
                                <X className="h-7 w-7" />
                            </button>
                        </div>
                        <form onSubmit={handleSaveUser}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                <div>
                                    <label className="block text-[10px] font-black text-[var(--muted-text)] uppercase mb-3 tracking-widest">Full Name</label>
                                    <input 
                                        type="text" required 
                                        value={userForm.name} onChange={e => setUserForm({...userForm, name: e.target.value})}
                                        className="w-full px-6 py-4 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl text-[var(--foreground)] placeholder-[var(--muted-text)] font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-inner" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-[var(--muted-text)] uppercase mb-3 tracking-widest">Email Address</label>
                                    <input 
                                        type="email" required 
                                        value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})}
                                        className="w-full px-6 py-4 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl text-[var(--foreground)] placeholder-[var(--muted-text)] font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-inner" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-[var(--muted-text)] uppercase mb-3 tracking-widest">Mobile</label>
                                    <input 
                                        type="text" 
                                        value={userForm.mobile} onChange={e => setUserForm({...userForm, mobile: e.target.value})}
                                        className="w-full px-6 py-4 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl text-[var(--foreground)] placeholder-[var(--muted-text)] font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-inner" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-[var(--muted-text)] uppercase mb-3 tracking-widest">Assign Role</label>
                                    <select
                                        required
                                        value={userForm.role_id}
                                        onChange={e => setUserForm({...userForm, role_id: e.target.value})}
                                        className="w-full px-6 py-4 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl text-[var(--foreground)] font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-inner appearance-none"
                                    >
                                        <option value="">Select a Role</option>
                                        {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-[var(--muted-text)] uppercase mb-3 tracking-widest">Password {isEditing && '(Leave blank to keep current)'}</label>
                                    <input 
                                        type="password" required={!isEditing}
                                        value={userForm.password} onChange={e => setUserForm({...userForm, password: e.target.value})}
                                        className="w-full px-6 py-4 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl text-[var(--foreground)] font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-inner" 
                                    />
                                </div>
                            </div>
                            
                            <div className="flex justify-end space-x-4">
                                <button type="button" onClick={() => { setIsCreating(false); setIsEditing(null); }} className="px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-[var(--muted-text)] hover:text-white hover:bg-slate-800 transition-all border border-[var(--border-color)]">Cancel</button>
                                <button type="submit" className="px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20">
                                    {isEditing ? 'Update User' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="glass-panel rounded-[2.5rem] overflow-hidden border border-[var(--border-color)] shadow-2xl bg-[var(--panel-bg)]">
                    <table className="min-w-full divide-y divide-[var(--border-color)]">
                        <thead className="bg-[var(--panel-bg)]">
                            <tr>
                                <th className="px-8 py-6 text-left text-xs font-black text-[var(--muted-text)] uppercase tracking-widest">User</th>
                                <th className="px-8 py-6 text-left text-xs font-black text-[var(--muted-text)] uppercase tracking-widest">Role</th>
                                <th className="px-8 py-6 text-left text-xs font-black text-[var(--muted-text)] uppercase tracking-widest">Mobile</th>
                                <th className="px-8 py-6 text-right text-xs font-black text-[var(--muted-text)] uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)]">
                            {loading ? (
                                <tr><td colSpan="4" className="p-16 text-center text-[var(--muted-text)] font-bold animate-pulse">Loading users...</td></tr>
                            ) : (
                                users.map(user => {
                                    const userRole = roles.find(r => r.id === user.role_id);
                                    return (
                                        <tr key={user.id} className="hover:bg-blue-500/5 transition-colors group">
                                            <td className="px-8 py-5 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border border-white/10 text-white font-black shadow-lg">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="ml-5">
                                                        <div className="text-sm font-black text-[var(--foreground)] group-hover:text-blue-500 transition-colors">{user.name}</div>
                                                        <div className="text-[10px] text-[var(--muted-text)] font-bold">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 whitespace-nowrap">
                                                <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${userRole?.is_system_role ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                                                    {userRole?.name || 'No Role'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 whitespace-nowrap text-sm text-[var(--muted-text)] font-bold">
                                                {user.mobile || '—'}
                                            </td>
                                            <td className="px-8 py-5 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end gap-3">
                                                    <button onClick={() => handleOpenEdit(user)} className="p-3 rounded-xl bg-[var(--input-bg)] text-[var(--muted-text)] hover:text-blue-500 hover:bg-blue-500/10 border border-[var(--border-color)] transition-all">
                                                        <Edit2 className="h-4 w-4" />
                                                    </button>
                                                    <button onClick={() => handleDeleteUser(user.id)} className="p-3 rounded-xl bg-[var(--input-bg)] text-rose-500/50 hover:text-rose-500 hover:bg-rose-500/10 border border-[var(--border-color)] transition-all">
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserList;
