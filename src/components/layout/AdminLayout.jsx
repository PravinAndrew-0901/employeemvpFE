import React, { useContext } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
    LayoutDashboard, Users, UploadCloud, Settings, LogOut, 
    Briefcase, UserCog, Sun, Moon, Sliders, Shield, 
    UserCheck, CreditCard, CalendarClock, MessageSquareText, 
    PieChart, Network, Building2, Ticket
} from 'lucide-react';

const AdminLayout = () => {
    const { user, logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();

    const navGroups = [
        {
            label: 'Talent Acquisition',
            items: [
                { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, permission: null },
                { path: '/jobs', label: 'Jobs & Requisitions', icon: Briefcase, permission: 'view_candidates' },
                { path: '/candidates', label: 'Candidate Pool', icon: Users, permission: 'view_candidates' },
                { path: '/upload', label: 'Bulk Upload CV', icon: UploadCloud, permission: 'bulk_upload_cv' },
            ]
        },
        {
            label: 'Human Resources',
            items: [
                { path: '/staff', label: 'Staff Directory', icon: UserCheck, permission: 'manage_users' },
                { path: '/leaves', label: 'Leave & Attendance', icon: CalendarClock, permission: null },
                { path: '/positions', label: 'Org Structure', icon: Network, permission: 'manage_settings' },
            ]
        },
        {
            label: 'Finance & Operations',
            items: [
                { path: '/payroll', label: 'Payroll & Slips', icon: CreditCard, permission: 'manage_payroll' },
                { path: '/tickets', label: 'Internal Helpdesk', icon: Ticket, permission: null },
                { path: '/reports-center', label: 'Reports Center', icon: PieChart, permission: 'view_reports' },
            ]
        },
        {
            label: 'System Admin',
            items: [
                { path: '/users', label: 'User Access', icon: UserCog, permission: 'manage_users' },
                { path: '/roles', label: 'RBAC Config', icon: Shield, permission: 'manage_roles' },
                { path: '/settings', label: 'Master Config', icon: Sliders, permission: 'manage_settings' },
            ]
        }
    ];

    return (
        <div className="flex h-screen bg-[var(--background)] overflow-hidden text-[var(--foreground)] transition-colors duration-300">
            {/* Sidebar */}
            <aside className="w-72 glass-panel border-r border-[var(--border-color)] flex flex-col hidden md:flex z-20 relative rounded-none shadow-2xl">
                <div className="h-20 flex items-center px-6 border-b border-[var(--border-color)] shrink-0 bg-blue-600/5">
                    <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg mr-3">
                        <Building2 className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-black tracking-tighter">Corp<span className="text-blue-500">Suite</span> <span className="text-[10px] bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full ml-1">ERP</span></span>
                </div>
                
                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-8 custom-scrollbar">
                    {navGroups.map((group, gIdx) => {
                        const visibleItems = group.items.filter(item => !item.permission || user?.permissions?.includes(item.permission));
                        if (visibleItems.length === 0) return null;

                        return (
                            <div key={gIdx} className="space-y-1">
                                <div className="text-[10px] font-black text-[var(--muted-text)] uppercase tracking-[0.2em] mb-4 px-4 opacity-50">{group.label}</div>
                                {visibleItems.map((item) => {
                                    const isActive = location.pathname.startsWith(item.path);
                                    const Icon = item.icon;
                                    
                                    return (
                                        <Link 
                                            key={item.path} 
                                            to={item.path}
                                            className={`flex items-center px-4 py-3 rounded-2xl transition-all duration-200 group ${
                                                isActive 
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                                                : 'text-[var(--muted-text)] hover:bg-blue-500/10 hover:text-blue-500'
                                            }`}
                                        >
                                            <Icon className={`h-4.5 w-4.5 mr-3 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-white' : ''}`} />
                                            <span className="font-bold text-[13px] tracking-tight">{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-[var(--border-color)] shrink-0 space-y-4">
                    <div className="flex items-center px-4 py-3 rounded-2xl bg-[var(--input-bg)] border border-[var(--border-color)] shadow-sm">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-slate-700 to-slate-900 flex items-center justify-center text-sm font-bold text-white mr-3 border border-slate-600 shadow-inner">
                            {user?.sub?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-[11px] font-black truncate uppercase tracking-tighter text-blue-500">Corporate User</p>
                            <p className="text-xs text-[var(--foreground)] truncate font-black uppercase tracking-tight">{user?.sub || 'User'}</p>
                        </div>
                    </div>
                    
                    <div className="flex gap-2">
                        <button 
                            onClick={toggleTheme}
                            className="flex-1 flex items-center justify-center h-12 rounded-2xl bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--muted-text)] hover:text-blue-500 transition-all"
                        >
                            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>
                        <button 
                            onClick={logout}
                            className="flex-1 flex items-center justify-center h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 transition-all hover:text-white"
                        >
                            <LogOut className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col relative z-10 overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar relative">
                    <Outlet />
                    {theme === 'dark' && (
                        <div className="fixed top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/5 blur-[120px] mix-blend-screen pointer-events-none z-0 animate-pulse"></div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
