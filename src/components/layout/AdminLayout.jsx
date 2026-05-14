import React, { useContext } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { LayoutDashboard, Users, UploadCloud, Settings, LogOut, Briefcase, UserCog, Sun, Moon, Sliders, Shield } from 'lucide-react';

const AdminLayout = () => {
    const { user, logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, permission: null },
        { path: '/jobs', label: 'Jobs', icon: Briefcase, permission: 'view_candidates' },
        { path: '/candidates', label: 'Candidates', icon: Users, permission: 'view_candidates' },
        { path: '/upload', label: 'Bulk Upload', icon: UploadCloud, permission: 'bulk_upload_cv' },
        { path: '/users', label: 'Team', icon: UserCog, permission: 'manage_users' },
        { path: '/settings', label: 'System Config', icon: Sliders, permission: 'manage_settings' },
        { path: '/roles', label: 'Permissions', icon: Shield, permission: 'manage_roles' },
    ];

    return (
        <div className="flex h-screen bg-[var(--background)] overflow-hidden text-[var(--foreground)] transition-colors duration-300">
            {/* Sidebar */}
            <aside className="w-64 glass-panel border-r border-[var(--border-color)] flex flex-col hidden md:flex z-20 relative rounded-none shadow-2xl">
                <div className="h-20 flex items-center px-6 border-b border-[var(--border-color)] shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg mr-3">
                        <Briefcase className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-wide">Recruit<span className="text-blue-500">Pro</span></span>
                </div>
                
                <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-2">
                    <div className="text-[10px] font-black text-[var(--muted-text)] uppercase tracking-widest mb-6 px-4">Main Menu</div>
                    {navItems.map((item) => {
                        if (item.permission && !user?.permissions?.includes(item.permission)) return null;
                        
                        const isActive = location.pathname.startsWith(item.path);
                        const Icon = item.icon;
                        
                        return (
                            <Link 
                                key={item.path} 
                                to={item.path}
                                className={`flex items-center px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                                    isActive 
                                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30' 
                                    : 'text-[var(--muted-text)] hover:bg-blue-500/10 hover:text-blue-400'
                                }`}
                            >
                                <Icon className={`h-5 w-5 mr-3 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-white' : ''}`} />
                                <span className="font-bold text-sm tracking-tight">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-[var(--border-color)] shrink-0 space-y-4">
                    {/* Theme Toggle */}
                    <button 
                        onClick={toggleTheme}
                        className="flex items-center w-full px-4 py-3 rounded-2xl bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--muted-text)] hover:text-blue-400 transition-all group"
                    >
                        {theme === 'dark' ? (
                            <><Sun className="h-5 w-5 mr-3 group-hover:rotate-45 transition-transform" /> <span className="text-sm font-bold">Light Mode</span></>
                        ) : (
                            <><Moon className="h-5 w-5 mr-3 group-hover:-rotate-12 transition-transform" /> <span className="text-sm font-bold">Dark Mode</span></>
                        )}
                    </button>

                    <div className="flex items-center px-4 py-3 rounded-2xl bg-[var(--input-bg)] border border-[var(--border-color)] shadow-sm">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-slate-700 to-slate-900 flex items-center justify-center text-sm font-bold text-white mr-3 border border-slate-600 shadow-inner">
                            {user?.sub?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-black truncate uppercase tracking-tighter">{user?.sub || 'User'}</p>
                            <p className="text-[10px] text-[var(--muted-text)] truncate font-bold uppercase">Administrator</p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={logout}
                        className="flex items-center w-full px-4 py-3 text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all group"
                    >
                        <LogOut className="h-5 w-5 mr-3 group-hover:translate-x-1 transition-transform" />
                        <span className="font-bold text-sm">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col relative z-10 overflow-hidden">
                {/* Mobile Header */}
                <header className="h-16 glass-panel border-b border-[var(--border-color)] flex items-center justify-between px-6 md:hidden z-20 rounded-none shrink-0 shadow-lg">
                    <div className="flex items-center">
                        <Briefcase className="h-6 w-6 text-blue-500 mr-2" />
                        <span className="text-lg font-bold">RecruitPro</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={toggleTheme} className="text-[var(--muted-text)]">
                            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>
                        <button onClick={logout} className="text-rose-500">
                            <LogOut className="h-5 w-5" />
                        </button>
                    </div>
                </header>
                
                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar relative">
                    <div className="relative z-10">
                        <Outlet />
                    </div>
                    {/* Ambient Background Blur - Only show in dark mode for better look */}
                    {theme === 'dark' && (
                        <div className="fixed top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/5 blur-[120px] mix-blend-screen pointer-events-none z-0 animate-pulse"></div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
