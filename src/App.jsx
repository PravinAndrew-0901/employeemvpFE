import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import RequirePermission from './components/rbac/RequirePermission';
import AdminLayout from './components/layout/AdminLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import CandidateRegistration from './pages/CandidateRegistration';
import Dashboard from './pages/Dashboard';
import CandidateList from './pages/CandidateList';
import JobsList from './pages/JobsList';
import CandidateDetails from './pages/CandidateDetails';
import Upload from './pages/Upload';
import RolesList from './pages/RolesList';
import UserList from './pages/UserList';
import SystemSettings from './pages/SystemSettings';
import PublicJobs from './pages/PublicJobs';
import CandidatePortal from './pages/CandidatePortal';

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
          
          {/* Admin / HR Routes */}
          <Route element={<AdminLayout />}>
            <Route 
              path="/dashboard" 
              element={
                <RequirePermission>
                  <Dashboard />
                </RequirePermission>
              } 
            />
            <Route 
              path="/jobs" 
              element={
                <RequirePermission permission="view_candidates">
                  <JobsList />
                </RequirePermission>
              } 
            />
            <Route 
              path="/candidates" 
              element={
                <RequirePermission permission="view_candidates">
                  <CandidateList />
                </RequirePermission>
              } 
            />
            <Route 
              path="/candidates/:id" 
              element={
                <RequirePermission permission="view_candidates">
                  <CandidateDetails />
                </RequirePermission>
              } 
            />
            <Route 
              path="/upload" 
              element={
                <RequirePermission permission="bulk_upload_cv">
                  <Upload />
                </RequirePermission>
              } 
            />
            <Route 
              path="/roles" 
              element={
                <RequirePermission permission="manage_roles">
                  <RolesList />
                </RequirePermission>
              } 
            />
            <Route 
              path="/users" 
              element={
                <RequirePermission permission="manage_users">
                  <UserList />
                </RequirePermission>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <RequirePermission permission="manage_settings">
                  <SystemSettings />
                </RequirePermission>
              } 
            />
          </Route>

          {/* Candidate Portal Route */}
          <Route path="/portal" element={<CandidatePortal />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
