import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, UserCheck, UserX, Clock, TrendingUp, 
  CheckCircle, XCircle, Search, Filter, Mail,
  Calendar, Eye, AlertCircle, Shield, Settings, 
  BarChart3, Activity, DollarSign, Layout
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import AdminSupportTickets from '../Support/AdminSupportTickets';
import LandingContentManager from './LandingContentManager';
import UserManagement from './UserManagement';
import CampaignManagement from './CampaignManagement';
import PaymentManagement from './PaymentManagement';
import PlatformSettings from './PlatformSettings';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [influencers, setInfluencers] = useState([]);
  const [analytics, setAnalytics] = useState({
    total_influencers: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInfluencer, setSelectedInfluencer] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [approvalTab, setApprovalTab] = useState('pending');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'approvals', label: 'Influencer Approvals', icon: UserCheck },
    { id: 'landing', label: 'Landing Page', icon: Layout },
    { id: 'support', label: 'Support Tickets', icon: AlertCircle },
    { id: 'campaigns', label: 'Campaign Management', icon: TrendingUp },
    { id: 'payments', label: 'Payment Management', icon: DollarSign },
    { id: 'settings', label: 'Platform Settings', icon: Settings },
  ];

  const stats = [
    {
      name: 'Total Users',
      value: '2,847',
      icon: Users,
      gradient: 'from-violet-600 to-purple-500',
      bgGradient: 'from-violet-50 to-purple-50',
      change: '+12%',
      changeType: 'positive',
      description: '1,234 Influencers, 567 Companies'
    },
    {
      name: 'Active Campaigns',
      value: '156',
      icon: TrendingUp,
      gradient: 'from-cyan-500 to-blue-600',
      bgGradient: 'from-cyan-50 to-blue-50',
      change: '+8%',
      changeType: 'positive',
      description: '89 Running, 67 Pending'
    },
    {
      name: 'Platform Revenue',
      value: '₹45,678',
      icon: DollarSign,
      gradient: 'from-lime-500 to-green-600',
      bgGradient: 'from-lime-50 to-green-50',
      change: '+25%',
      changeType: 'positive',
      description: 'This month'
    },
    {
      name: 'Success Rate',
      value: '94.2%',
      icon: CheckCircle,
      gradient: 'from-orange-500 to-red-600',
      bgGradient: 'from-orange-50 to-red-50',
      change: '+2%',
      changeType: 'positive',
      description: 'Campaign completion rate'
    },
  ];

  const recentActivities = [
    { type: 'user', action: 'New influencer registered', user: 'Sarah Johnson', time: '2 minutes ago', status: 'success' },
    { type: 'campaign', action: 'Campaign approved', user: 'TechCorp Inc.', time: '15 minutes ago', status: 'success' },
    { type: 'payment', action: 'Payment processed', user: 'Mike Chen', time: '1 hour ago', status: 'success' },
    { type: 'alert', action: 'Suspicious activity detected', user: 'System Alert', time: '2 hours ago', status: 'warning' },
    { type: 'user', action: 'Company profile updated', user: 'Fashion Brand Co.', time: '3 hours ago', status: 'info' },
  ];

  const systemHealth = [
    { name: 'API Response Time', value: '245ms', status: 'good', target: '< 500ms' },
    { name: 'Database Performance', value: '98.5%', status: 'excellent', target: '> 95%' },
    { name: 'Payment Gateway', value: '99.9%', status: 'excellent', target: '> 99%' },
    { name: 'Email Delivery', value: '97.2%', status: 'good', target: '> 95%' },
  ];

  useEffect(() => {
    if (activeTab === 'approvals') {
      fetchAnalytics();
      fetchInfluencers(approvalTab);
    }
  }, [activeTab, approvalTab]);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/auth/admin/approval-stats/');
      setAnalytics(response.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  };

  const fetchInfluencers = async (status) => {
    setLoading(true);
    try {
      const response = await api.get(`/auth/admin/all-influencers/?status=${status}`);
      // Handle both paginated (results array) and non-paginated responses
      const data = response.data.results || response.data;
      setInfluencers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch influencers:', error);
      toast.error('Failed to load influencers');
      setInfluencers([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await api.post(`/auth/admin/approve-influencer/${userId}/`);
      toast.success('Influencer approved successfully!');
      fetchAnalytics();
      fetchInfluencers(approvalTab);
      setShowConfirmModal(false);
    } catch (error) {
      console.error('Failed to approve influencer:', error);
      toast.error('Failed to approve influencer');
    }
  };

  const handleReject = async (userId) => {
    try {
      await api.post(`/auth/admin/reject-influencer/${userId}/`);
      toast.success('Influencer rejected');
      fetchAnalytics();
      fetchInfluencers(approvalTab);
      setShowConfirmModal(false);
    } catch (error) {
      console.error('Failed to reject influencer:', error);
      toast.error('Failed to reject influencer');
    }
  };

  const openConfirmModal = (influencer, action) => {
    setSelectedInfluencer(influencer);
    setConfirmAction(action);
    setShowConfirmModal(true);
  };

  const approvalRate = analytics.total_influencers > 0 
    ? ((analytics.approved / analytics.total_influencers) * 100).toFixed(1)
    : 0;

  const filteredInfluencers = influencers.filter(inf => 
    inf.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inf.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header Section - Non-sticky */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                Admin Dashboard 🛡️
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">Monitor and manage the Collabo platform.</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-3 py-1.5 rounded-full text-xs font-medium">
                <Shield className="w-3 h-3 inline mr-1.5" />
                Super Admin
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation - Sticky */}
      <nav className="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700 sticky top-14 z-10 shadow-sm p-1">
        <div className="flex space-x-1 overflow-x-auto">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium text-xs transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-600 text-violet-600 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-600/50'
                }`}
              >
                <IconComponent className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="p-4 pt-3">
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Modern SaaS Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {stats.map((stat, index) => {
                const StatIcon = stat.icon;
                return (
                  <motion.div
                    key={stat.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
                  >
                    {/* Card Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.gradient}`}>
                        <StatIcon className="w-4 h-4 text-white" />
                      </div>
                      <div className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        stat.changeType === 'positive'
                          ? 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200'
                          : 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {stat.change}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="flex-1">
                      <h3 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wide">
                        {stat.name}
                      </h3>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {stat.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Recent Activities and System Health */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Activities</h3>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                      <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
                        <Activity className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">{activity.action}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{activity.user} • {activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">System Health</h3>
                <div className="space-y-4">
                  {systemHealth.map((metric, index) => (
                    <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{metric.name}</span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          {metric.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">{metric.value}</span>
                        <span className="text-xs text-gray-600 dark:text-gray-400">Target: {metric.target}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <UserManagement />
        )}

        {activeTab === 'approvals' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Approval Analytics Cards - Matching Overview Style */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-violet-600 to-purple-500">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wide">
                    Total Influencers
                  </h3>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {analytics.total_influencers}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    All registered influencers
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-600">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-xs font-medium px-2 py-0.5 rounded-full text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-200">
                    Pending
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wide">
                    Pending Approvals
                  </h3>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {analytics.pending}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Awaiting review
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600">
                    <UserCheck className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-xs font-medium px-2 py-0.5 rounded-full text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200">
                    Active
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wide">
                    Approved
                  </h3>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {analytics.approved}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Active influencers
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-pink-600">
                    <UserX className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wide">
                    Rejected
                  </h3>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {analytics.rejected}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Not approved
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-xs font-medium px-2 py-0.5 rounded-full text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200">
                    +{approvalRate}%
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wide">
                    Approval Rate
                  </h3>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {approvalRate}%
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Success rate
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Approval Management Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Influencer Approvals</h3>
              
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                {/* Approval Tabs */}
                <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                  {['pending', 'approved', 'rejected'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setApprovalTab(tab)}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                        approvalTab === tab
                          ? 'bg-white dark:bg-gray-600 text-violet-600 dark:text-white shadow-sm'
                          : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-600/50'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-full md:w-80"
                  />
                </div>
              </div>

              {/* Influencers Table */}
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
                </div>
              ) : filteredInfluencers.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    No {approvalTab} influencers found
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Profile</th>
                        <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Email</th>
                        <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Followers</th>
                        <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Category</th>
                        <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Joined</th>
                        <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Status</th>
                        <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {filteredInfluencers.map((influencer, index) => (
                          <InfluencerRow
                            key={influencer.id}
                            influencer={influencer}
                            index={index}
                            onApprove={() => openConfirmModal(influencer, 'approve')}
                            onReject={() => openConfirmModal(influencer, 'reject')}
                            activeTab={approvalTab}
                          />
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'campaigns' && (
          <CampaignManagement />
        )}

        {activeTab === 'payments' && (
          <PaymentManagement />
        )}

        {activeTab === 'support' && (
          <AdminSupportTickets />
        )}

        {activeTab === 'landing' && (
          <LandingContentManager />
        )}

        {activeTab === 'settings' && (
          <PlatformSettings />
        )}
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <ConfirmationModal
            influencer={selectedInfluencer}
            action={confirmAction}
            onConfirm={() => {
              if (confirmAction === 'approve') {
                handleApprove(selectedInfluencer.id);
              } else {
                handleReject(selectedInfluencer.id);
              }
            }}
            onCancel={() => {
              setShowConfirmModal(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Influencer Row Component
const InfluencerRow = ({ influencer, index, onApprove, onReject, activeTab }) => {
  const statusColors = {
    pending: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  };

  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.05 }}
      className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
    >
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-semibold">
            {influencer.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{influencer.username}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{influencer.influencer_profile?.category || 'N/A'}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-4 text-gray-700 dark:text-gray-300">{influencer.email}</td>
      <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
        {influencer.influencer_profile?.followers_count?.toLocaleString() || 0}
      </td>
      <td className="py-4 px-4">
        <span className="px-3 py-1 rounded-full text-sm bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200">
          {influencer.influencer_profile?.category || 'N/A'}
        </span>
      </td>
      <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
        {new Date(influencer.created_at).toLocaleDateString()}
      </td>
      <td className="py-4 px-4">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[influencer.approval_status]}`}>
          {influencer.approval_status}
        </span>
      </td>
      <td className="py-4 px-4">
        <div className="flex gap-2">
          {activeTab === 'pending' && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onApprove}
                className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                title="Approve"
              >
                <CheckCircle className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onReject}
                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                title="Reject"
              >
                <XCircle className="w-5 h-5" />
              </motion.button>
            </>
          )}
          {activeTab === 'rejected' && influencer.rejection_reason && (
            <button
              className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              title={influencer.rejection_reason}
            >
              <Eye className="w-5 h-5" />
            </button>
          )}
        </div>
      </td>
    </motion.tr>
  );
};

// Confirmation Modal Component
const ConfirmationModal = ({ influencer, action, onConfirm, onCancel }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          {action === 'approve' ? (
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          )}
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {action === 'approve' ? 'Approve Influencer' : 'Reject Influencer'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {influencer?.username}
            </p>
          </div>
        </div>

        <p className="text-gray-700 dark:text-gray-300 mb-6">
          {action === 'approve'
            ? 'Are you sure you want to approve this influencer? They will gain access to the platform and their profile will be visible to companies.'
            : 'Are you sure you want to reject this influencer? They will see a standard rejection message and can contact support for clarification.'}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 rounded-lg text-white transition-colors font-medium ${
              action === 'approve'
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            {action === 'approve' ? 'Approve' : 'Reject'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboard;
