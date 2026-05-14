import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { Laptop, Search, Plus, Filter, Monitor, Smartphone, Cpu, MoreVertical, User, CheckCircle2, Clock } from 'lucide-react';

const AssetManagement = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAssets();
    }, []);

    const fetchAssets = async () => {
        try {
            const res = await api.get('/assets/');
            setAssets(res.data);
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
                    <h1 className="text-4xl font-black tracking-tighter">Asset <span className="text-blue-500">Inventory</span></h1>
                    <p className="text-[var(--muted-text)] font-medium mt-1">Manage and track company-issued hardware and equipment</p>
                </div>
                <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-blue-500/20 flex items-center transition-all">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Asset
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <div className="glass-panel p-8 rounded-[2.5rem] border border-[var(--border-color)] bg-[var(--panel-bg)] shadow-xl">
                    <p className="text-[10px] font-black text-[var(--muted-text)] uppercase tracking-widest mb-2">Total Assets</p>
                    <h2 className="text-3xl font-black">{assets.length}</h2>
                </div>
                <div className="glass-panel p-8 rounded-[2.5rem] border border-emerald-500/20 bg-emerald-500/5 shadow-xl">
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Assigned</p>
                    <h2 className="text-3xl font-black text-[var(--foreground)]">{assets.filter(a => a.status === 'Assigned').length}</h2>
                </div>
                <div className="glass-panel p-8 rounded-[2.5rem] border border-blue-500/20 bg-blue-500/5 shadow-xl">
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">In Stock</p>
                    <h2 className="text-3xl font-black text-[var(--foreground)]">{assets.filter(a => a.status === 'Available').length}</h2>
                </div>
                <div className="glass-panel p-8 rounded-[2.5rem] border border-rose-500/20 bg-rose-500/5 shadow-xl">
                    <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-2">Under Repair</p>
                    <h2 className="text-3xl font-black text-[var(--foreground)]">0</h2>
                </div>
            </div>

            <div className="glass-panel rounded-[2.5rem] border border-[var(--border-color)] bg-[var(--panel-bg)] shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-[var(--border-color)] flex flex-col md:flex-row gap-4 bg-blue-600/5">
                    <div className="relative flex-1">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-text)]" />
                        <input 
                            type="text"
                            placeholder="Search by serial number, name or type..."
                            className="w-full pl-12 pr-6 py-4 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl font-bold shadow-inner"
                        />
                    </div>
                    <button className="px-6 py-4 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-2xl font-black text-[10px] uppercase tracking-widest text-[var(--muted-text)] flex items-center hover:text-blue-500 transition-colors">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter Category
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[var(--border-color)]">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-text)]">Asset Name</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-text)]">Type</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-text)]">Serial No.</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-text)]">Assigned To</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-text)]">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted-text)]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)]">
                            {assets.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-8 py-20 text-center text-[var(--muted-text)] font-bold italic">No assets found in the inventory.</td>
                                </tr>
                            ) : (
                                assets.map((asset) => (
                                    <tr key={asset.id} className="hover:bg-blue-500/5 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-xl bg-[var(--input-bg)] border border-[var(--border-color)] flex items-center justify-center text-blue-500 mr-4 shadow-inner">
                                                    {asset.asset_type === 'Laptop' ? <Monitor className="h-5 w-5" /> : <Smartphone className="h-5 w-5" />}
                                                </div>
                                                <span className="font-black text-sm group-hover:text-blue-500 transition-colors">{asset.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-xs font-bold uppercase tracking-widest text-[var(--muted-text)]">{asset.asset_type}</span>
                                        </td>
                                        <td className="px-8 py-6 font-mono text-xs font-bold">
                                            {asset.serial_number}
                                        </td>
                                        <td className="px-8 py-6">
                                            {asset.assigned_employee_name ? (
                                                <div className="flex items-center text-sm font-bold">
                                                    <User className="h-4 w-4 mr-2 text-blue-500/50" />
                                                    {asset.assigned_employee_name}
                                                </div>
                                            ) : (
                                                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-text)] opacity-50">Unassigned</span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border
                                                ${asset.status === 'Available' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                                                {asset.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <button className="p-3 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-xl text-[var(--muted-text)] hover:text-blue-500 transition-all shadow-sm">
                                                <MoreVertical className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AssetManagement;
