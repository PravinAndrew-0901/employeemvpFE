import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { Settings, Shield, Plus, Check, Edit2, X } from 'lucide-react';

const RolesList = () => {
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(null);
    const [roleForm, setRoleForm] = useState({ name: '', description: '', permission_ids: [] });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [rolesRes, permsRes] = await Promise.all([
                api.get('/roles/'),
                api.get('/roles/permissions')
            ]);
            setRoles(rolesRes.data);
            setPermissions(permsRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCreate = () => {
        setRoleForm({ name: '', description: '', permission_ids: [] });
        setIsEditing(null);
        setIsCreating(true);
    };

    const handleOpenEdit = (role) => {
        setRoleForm({
            name: role.name,
            description: role.description,
            permission_ids: role.permissions.map(p => p.id)
        });
        setIsCreating(false);
        setIsEditing(role.id);
    };

    const handleSaveRole = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                const res = await api.put(`/roles/${isEditing}`, roleForm);
                setRoles(roles.map(r => r.id === isEditing ? res.data : r));
            } else {
                const res = await api.post('/roles/', roleForm);
                setRoles([...roles, res.data]);
            }
            setIsCreating(false);
            setIsEditing(null);
        } catch (err) {
            alert(err.response?.data?.detail || "Failed to save role");
        }
    };

    const togglePermission = (id) => {
        if (roleForm.permission_ids.includes(id)) {
            setRoleForm({ ...roleForm, permission_ids: roleForm.permission_ids.filter(p => p !== id) });
        } else {
            setRoleForm({ ...roleForm, permission_ids: [...roleForm.permission_ids, id] });
        }
    };

    return (
        <div className="w-full h-full relative z-10 pb-10">
            <div className="max-w-7xl mx-auto pb-4 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Roles & Permissions</h1>
                        <p className="text-[var(--muted-text)] font-medium mt-1">Manage system access control for HR and Admin teams</p>
                    </div>
                    {!isCreating && !isEditing && (
                        <button onClick={handleOpenCreate} className="flex items-center px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl transition-all shadow-xl shadow-blue-500/20 font-black text-xs uppercase tracking-widest">
                            <Plus className="h-4 w-4 mr-2" />
                            Create Custom Role
                        </button>
                    )}
                </div>

                {(isCreating || isEditing) && (
                    <div className="glass-panel rounded-[2rem] p-10 mb-10 border border-[var(--border-color)] bg-[var(--panel-bg)] shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-black uppercase tracking-tight">{isEditing ? 'Edit Role' : 'Create New Role'}</h3>
                            <button onClick={() => { setIsCreating(false); setIsEditing(null); }} className="text-[var(--muted-text)] hover:text-rose-500 transition-colors">
                                <X className="h-7 w-7" />
                            </button>
                        </div>
                        <form onSubmit={handleSaveRole}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                <div>
                                    <label className="block text-[10px] font-black text-[var(--muted-text)] uppercase mb-3 tracking-widest">Role Name</label>
                                    <input 
                                        type="text" required 
                                        value={roleForm.name} onChange={e => setRoleForm({...roleForm, name: e.target.value})}
                                        className="w-full px-6 py-4 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl text-[var(--foreground)] placeholder-[var(--muted-text)] font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-inner" 
                                        placeholder="e.g. Junior Recruiter" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-[var(--muted-text)] uppercase mb-3 tracking-widest">Description</label>
                                    <input 
                                        type="text" 
                                        value={roleForm.description} onChange={e => setRoleForm({...roleForm, description: e.target.value})}
                                        className="w-full px-6 py-4 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl text-[var(--foreground)] placeholder-[var(--muted-text)] font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-inner" 
                                        placeholder="Brief description of responsibilities" 
                                    />
                                </div>
                            </div>
                            
                            <h4 className="text-xs font-black text-blue-500 uppercase tracking-widest mb-6">Assign Permissions</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-10">
                                {permissions.map(perm => (
                                    <div 
                                        key={perm.id} 
                                        onClick={() => togglePermission(perm.id)}
                                        className={`p-6 rounded-2xl border cursor-pointer transition-all flex items-start space-x-4 
                                            ${roleForm.permission_ids.includes(perm.id) 
                                                ? 'bg-blue-600/10 border-blue-500 shadow-xl shadow-blue-500/10' 
                                                : 'bg-[var(--input-bg)] border-[var(--border-color)] hover:border-blue-500/50'}`}
                                    >
                                        <div className={`mt-0.5 shrink-0 h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all
                                            ${roleForm.permission_ids.includes(perm.id) ? 'bg-blue-600 border-blue-600 rotate-0' : 'border-[var(--border-color)] bg-transparent'}`}>
                                            {roleForm.permission_ids.includes(perm.id) && <Check className="h-4 w-4 text-white" />}
                                        </div>
                                        <div>
                                            <p className={`text-sm font-black tracking-tight ${roleForm.permission_ids.includes(perm.id) ? 'text-blue-500' : 'text-[var(--foreground)]'}`}>{perm.name}</p>
                                            <p className="text-[10px] text-[var(--muted-text)] mt-1.5 font-bold leading-relaxed">{perm.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="flex justify-end space-x-4">
                                <button type="button" onClick={() => { setIsCreating(false); setIsEditing(null); }} className="px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-[var(--muted-text)] hover:text-white hover:bg-slate-800 transition-all border border-[var(--border-color)]">Cancel</button>
                                <button type="submit" disabled={roleForm.name === ''} className="px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50">
                                    {isEditing ? 'Update Role' : 'Save Role'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {loading ? (
                        <div className="text-[var(--muted-text)] animate-pulse font-bold">Loading system roles...</div>
                    ) : (
                        roles.map(role => (
                            <div key={role.id} className="glass-panel rounded-[2.5rem] p-8 border border-[var(--border-color)] hover:border-blue-500/50 transition-all group relative overflow-hidden bg-[var(--panel-bg)] shadow-xl">
                                <div className="absolute top-0 right-0 p-6 flex gap-2">
                                    <button 
                                        onClick={() => handleOpenEdit(role)}
                                        className="p-3 rounded-xl bg-[var(--input-bg)] text-[var(--muted-text)] hover:text-blue-500 hover:bg-blue-500/10 border border-[var(--border-color)] transition-all"
                                        title="Edit Role"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                    {role.is_system_role && (
                                        <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
                                            <Shield className="h-4 w-4" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center mb-8">
                                    <div className={`h-16 w-16 rounded-[1.25rem] flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110 duration-500
                                        ${role.is_system_role ? 'bg-gradient-to-br from-purple-500 to-pink-600' : 'bg-gradient-to-br from-blue-500 to-cyan-600'}`}>
                                        <Settings className="h-8 w-8 text-white" />
                                    </div>
                                    <div className="ml-6 pr-12">
                                        <h3 className="text-2xl font-black flex items-center tracking-tight">
                                            {role.name}
                                            {role.is_system_role && <span className="ml-4 px-3 py-1 text-[9px] uppercase font-black bg-purple-500/10 text-purple-500 border border-purple-500/20 rounded-full tracking-widest shadow-sm">System</span>}
                                        </h3>
                                        <p className="text-xs text-[var(--muted-text)] mt-1.5 font-bold">{role.description}</p>
                                    </div>
                                </div>
                                
                                <div className="mt-8 pt-8 border-t border-[var(--border-color)]">
                                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-5">Active Permissions</p>
                                    <div className="flex flex-wrap gap-2.5">
                                        {role.permissions.map(p => (
                                            <span key={p.id} className="px-4 py-2 rounded-xl bg-[var(--input-bg)] text-[var(--foreground)] border border-[var(--border-color)] text-[10px] font-black uppercase tracking-tight shadow-sm transition-colors group-hover:border-blue-500/20">
                                                {p.name}
                                            </span>
                                        ))}
                                        {role.permissions.length === 0 && <span className="text-[var(--muted-text)] text-xs font-bold italic">No permissions assigned</span>}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default RolesList;
