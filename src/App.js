import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider, useToast } from './contexts/ToastContext';
import ToastContainer from './components/Notifications/ToastContainer';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import InfluencerDashboard from './components/Dashboard/InfluencerDashboard';
import CompanyDashboard from './components/Dashboard/CompanyDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import Layout from './components/Layout/Layout';
import LandingPage from './components/Landing/LandingPage';
import InfluencerDetailPage from './components/Landing/InfluencerDetailPage';
import OAuthCallback from './components/SocialMedia/OAuthCallback';

function ProtectedRoute({ children, allowedUserTypes }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (allowedUserTypes && !allowedUserTypes.includes(user.user_type)) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
      <Route path="/influencer/:id" element={<InfluencerDetailPage />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
      <Route path="/forgot-password" element={user ? <Navigate to="/dashboard" /> : <ForgotPassword />} />
      
      {/* OAuth Callback Routes */}
      <Route path="/auth/:platform/callback" element={
        <ProtectedRoute>
          <OAuthCallback />
        </ProtectedRoute>
      } />
      
      {/* Dashboard Route */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout>
            {user?.user_type === 'influencer' && <InfluencerDashboard />}
            {user?.user_type === 'company' && <CompanyDashboard />}
            {user?.user_type === 'admin' && <AdminDashboard />}
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/influencer/*" element={
        <ProtectedRoute allowedUserTypes={['influencer']}>
          <Layout>
            <InfluencerDashboard />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/company/*" element={
        <ProtectedRoute allowedUserTypes={['company']}>
          <Layout>
            <CompanyDashboard />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/*" element={
        <ProtectedRoute allowedUserTypes={['admin']}>
          <Layout>
            <AdminDashboard />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/unauthorized" element={
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Unauthorized</h1>
            <p className="mt-2">You don't have permission to access this page.</p>
          </div>
        </div>
      } />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="App">
            <AppRoutes />
            <ToastContainerWrapper />
            {/* React Hot Toast for standard notifications */}
            <Toaster
              position="top-right"
              reverseOrder={false}
              gutter={8}
              containerStyle={{
                top: 20,
                right: 20,
              }}
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#363636',
                  color: '#fff',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  maxWidth: '90vw',
                  wordBreak: 'break-word',
                },
                success: {
                  duration: 3000,
                  style: {
                    background: '#10B981',
                  },
                  iconTheme: {
                    primary: '#fff',
                    secondary: '#10B981',
                  },
                },
                error: {
                  duration: 4000,
                  style: {
                    background: '#EF4444',
                  },
                  iconTheme: {
                    primary: '#fff',
                    secondary: '#EF4444',
                  },
                },
                loading: {
                  style: {
                    background: '#3B82F6',
                  },
                  iconTheme: {
                    primary: '#fff',
                    secondary: '#3B82F6',
                  },
                },
              }}
            />
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

// Toast Container Wrapper Component
function ToastContainerWrapper() {
  const { toasts, removeToast } = useToast();
  return <ToastContainer toasts={toasts} removeToast={removeToast} />;
}

export default App;