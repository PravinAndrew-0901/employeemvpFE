import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import RequirePermission from './components/rbac/RequirePermission';
import AdminLayout from './components/layout/AdminLayout';

// Core Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CandidateRegistration from './pages/CandidateRegistration';

// Recruitment Pages
import CandidateList from './pages/CandidateList';
import JobsList from './pages/JobsList';
import CandidateDetails from './pages/CandidateDetails';
import Upload from './pages/Upload';
import PublicJobs from './pages/PublicJobs';
import CandidatePortal from './pages/CandidatePortal';

// HR & Enterprise Pages
import StaffList from './pages/StaffList';
import PayrollList from './pages/PayrollList';
import LeaveManagement from './pages/LeaveManagement';
import TicketSupport from './pages/TicketSupport';
import AttendanceLog from './pages/AttendanceLog';
import NoticeBoard from './pages/NoticeBoard';
import PerformanceReview from './pages/PerformanceReview';

// System Pages
import RolesList from './pages/RolesList';
import UserList from './pages/UserList';
import SystemSettings from './pages/SystemSettings';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<CandidateRegistration />} />
          <Route path="/job-list" element={<PublicJobs />} />
          
          {/* Admin / Corporate / HR Layout */}
          <Route element={<AdminLayout />}>
            <Route 
              path="/dashboard" 
              element={
                <RequirePermission>
                  <Dashboard />
                </RequirePermission>
              } 
            />
            
            {/* Recruitment Modules */}
            <Route path="/jobs" element={<RequirePermission permission="view_candidates"><JobsList /></RequirePermission>} />
            <Route path="/candidates" element={<RequirePermission permission="view_candidates"><CandidateList /></RequirePermission>} />
            <Route path="/candidates/:id" element={<RequirePermission permission="view_candidates"><CandidateDetails /></RequirePermission>} />
            <Route path="/upload" element={<RequirePermission permission="bulk_upload_cv"><Upload /></RequirePermission>} />
            
            {/* HR Modules */}
            <Route path="/staff" element={<RequirePermission permission="manage_users"><StaffList /></RequirePermission>} />
            <Route path="/attendance" element={<AttendanceLog />} />
            <Route path="/leaves" element={<LeaveManagement />} />
            <Route path="/performance" element={<PerformanceReview />} />
            
            {/* Finance & Operations Modules */}
            <Route path="/payroll" element={<RequirePermission permission="manage_payroll"><PayrollList /></RequirePermission>} />
            <Route path="/tickets" element={<TicketSupport />} />
            <Route path="/announcements" element={<NoticeBoard />} />
            <Route path="/reports-center" element={<RequirePermission permission="view_reports"><div className="p-10 font-black text-2xl uppercase tracking-tighter">Reports Center <span className="text-blue-500">Coming Soon</span></div></RequirePermission>} />
            <Route path="/positions" element={<RequirePermission permission="manage_settings"><div className="p-10 font-black text-2xl uppercase tracking-tighter">Org Structure & Positions <span className="text-blue-500">Coming Soon</span></div></RequirePermission>} />

            {/* System Admin Modules */}
            <Route path="/users" element={<RequirePermission permission="manage_users"><UserList /></RequirePermission>} />
            <Route path="/roles" element={<RequirePermission permission="manage_roles"><RolesList /></RequirePermission>} />
            <Route path="/settings" element={<RequirePermission permission="manage_settings"><SystemSettings /></RequirePermission>} />
          </Route>

          {/* Candidate Specific Portal */}
          <Route path="/portal" element={<CandidatePortal />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
