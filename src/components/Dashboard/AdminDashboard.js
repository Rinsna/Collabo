import React, { useState } from 'react';
import { Users, DollarSign, TrendingUp, Shield, Settings, BarChart3, Activity, CheckCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'campaigns', label: 'Campaign Management', icon: TrendingUp },
    { id: 'payments', label: 'Payment Management', icon: DollarSign },
    { id: 'settings', label: 'Platform Settings', icon: Settings },
  ];

  const stats = [
    {
      name: 'Total Users',
      value: '2,847',
      icon: Users,
      gradient: 'from-primary-600 to-accent-500',
      bgGradient: 'from-primary-50 to-accent-50',
      change: '+12%',
      changeType: 'positive',
      description: '1,234 Influencers, 567 Companies'
    },
    {
      name: 'Active Campaigns',
      value: '156',
      icon: TrendingUp,
      gradient: 'from-accent-500 to-primary-600',
      bgGradient: 'from-accent-50 to-primary-50',
      change: '+8%',
      changeType: 'positive',
      description: '89 Running, 67 Pending'
    },
    {
      name: 'Platform Revenue',
      value: '₹45,678',
      icon: DollarSign,
      gradient: 'from-primary-500 to-accent-600',
      bgGradient: 'from-primary-50 to-accent-50',
      change: '+25%',
      changeType: 'positive',
      description: 'This month'
    },
    {
      name: 'Success Rate',
      value: '94.2%',
      icon: CheckCircle,
      gradient: 'from-accent-600 to-primary-500',
      bgGradient: 'from-accent-50 to-primary-50',
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

  return (
    <div className="min-h-screen saas-background connection-lines">
      {/* Header Section */}
      <div className="glass-card border-b border-white/20 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gradient-primary">
                Admin Dashboard 🛡️
              </h1>
              <p className="text-gray-900 mt-1">Monitor and manage the Collabo platform.</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-primary-600 to-accent-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                <Shield className="w-4 h-4 inline mr-2" />
                Super Admin
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Tab Navigation */}
        <nav className="px-6">
          <div className="flex space-x-1 bg-gray-100/50 rounded-xl p-1">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-900 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Modern SaaS Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {stats.map((stat, index) => {
                const StatIcon = stat.icon;
                return (
                  <div
                    key={stat.name}
                    className="glass-card rounded-xl p-6 h-full flex flex-col justify-between card-hover animate-slideUp"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Card Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.gradient}`}>
                        <StatIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                        stat.changeType === 'positive' 
                          ? 'text-primary-400 bg-primary-500/10' 
                          : 'text-gray-900 bg-gray-500/10'
                      }`}>
                        {stat.change}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900 mb-2 uppercase tracking-wide">
                        {stat.name}
                      </h3>
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900 font-data mb-1">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-900">
                        {stat.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Recent Activities and System Health */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-xl font-heading text-gray-900 mb-6">Recent Activities</h3>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-dark-700/30 rounded-lg border border-white/5">
                      <div className="w-8 h-8 rounded-full bg-primary-600/20 flex items-center justify-center">
                        <Activity className="w-4 h-4 text-primary-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-900">{activity.user} • {activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-xl p-6">
                <h3 className="text-xl font-heading text-gray-900 mb-6">System Health</h3>
                <div className="space-y-4">
                  {systemHealth.map((metric, index) => (
                    <div key={index} className="p-4 bg-dark-700/30 rounded-xl border border-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">{metric.name}</span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary-500/20 text-primary-400">
                          {metric.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900 font-data">{metric.value}</span>
                        <span className="text-xs text-gray-900">Target: {metric.target}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="glass-card rounded-xl p-6 animate-fadeIn">
            <h3 className="text-xl font-heading text-gray-900 mb-4">User Management</h3>
            <p className="text-gray-900">
              User management interface would include user search, filtering, role management, 
              account status controls, and detailed user analytics.
            </p>
          </div>
        )}

        {activeTab === 'campaigns' && (
          <div className="glass-card rounded-xl p-6 animate-fadeIn">
            <h3 className="text-xl font-heading text-gray-900 mb-4">Campaign Management</h3>
            <p className="text-gray-900">
              Campaign oversight interface would include campaign approval workflows, 
              performance monitoring, dispute resolution, and compliance checking.
            </p>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="glass-card rounded-xl p-6 animate-fadeIn">
            <h3 className="text-xl font-heading text-gray-900 mb-4">Payment Management</h3>
            <p className="text-gray-900">
              Payment processing interface would handle transaction monitoring, 
              dispute resolution, refund processing, and financial reporting.
            </p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="glass-card rounded-xl p-6 animate-fadeIn">
            <h3 className="text-xl font-heading text-gray-900 mb-4">Platform Settings</h3>
            <p className="text-gray-900">
              Platform configuration interface would include system settings, 
              feature flags, API configurations, and security settings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;