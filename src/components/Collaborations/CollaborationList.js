import React, { useState } from 'react';
import { useQuery } from 'react-query';
import api from '../../services/api';
import { 
  Calendar, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  PlayCircle, 
  Filter, 
  Search,
  Building2,
  FileText,
  TrendingUp,
  Eye,
  MoreHorizontal
} from 'lucide-react';

const CollaborationList = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: collaborations, isLoading } = useQuery('collaborations', () =>
    api.get('/collaborations/collaborations/').then(res => res.data)
  );

  const { data: requests, isLoading: requestsLoading } = useQuery('collaboration-requests', () =>
    api.get('/collaborations/requests/').then(res => res.data)
  );

  if (isLoading || requestsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your collaborations...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-gray-500/10 text-gray-800 border-gray-500/20',
      accepted: 'bg-primary-500/10 text-primary-400 border-primary-500/20',
      rejected: 'bg-gray-600/10 text-gray-800 border-gray-600/20',
      in_progress: 'bg-primary-600/10 text-primary-500 border-primary-600/20',
      completed: 'bg-primary-500/10 text-primary-400 border-primary-500/20',
      cancelled: 'bg-gray-500/10 text-gray-800 border-gray-500/20'
    };
    return colors[status] || 'bg-gray-500/10 text-gray-800 border-gray-500/20';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock className="w-4 h-4" />,
      accepted: <CheckCircle className="w-4 h-4" />,
      rejected: <XCircle className="w-4 h-4" />,
      in_progress: <PlayCircle className="w-4 h-4" />,
      completed: <CheckCircle className="w-4 h-4" />,
      cancelled: <XCircle className="w-4 h-4" />
    };
    return icons[status] || <AlertCircle className="w-4 h-4" />;
  };

  const tabs = [
    { id: 'active', label: 'Active Collaborations', count: collaborations?.results?.length || 0 },
    { id: 'pending', label: 'Pending Applications', count: requests?.results?.filter(req => req.status === 'pending').length || 0 },
    { id: 'history', label: 'History', count: requests?.results?.filter(req => req.status !== 'pending').length || 0 }
  ];

  const filteredRequests = requests?.results?.filter(request => {
    const matchesSearch = request.campaign_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const filteredCollaborations = collaborations?.results?.filter(collaboration => {
    const matchesSearch = collaboration.campaign_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         collaboration.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  }) || [];

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="w-full">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">My Collaborations</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage your collaboration requests and active partnerships</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto scrollbar-hide" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 py-3 sm:py-4 px-3 sm:px-6 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'border-primary-600 text-primary-400'
                      : 'border-transparent text-gray-800 hover:text-gray-900 hover:border-gray-600'
                  }`}
                >
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">
                    {tab.id === 'active' ? 'Active' : tab.id === 'pending' ? 'Pending' : 'History'}
                  </span>
                  {tab.count > 0 && (
                    <span className={`ml-1 sm:ml-2 py-0.5 px-1.5 sm:px-2 rounded-full text-xs ${
                      activeTab === tab.id
                        ? 'bg-primary-600/20 text-primary-400'
                        : 'bg-gray-600/20 text-gray-800'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Filters */}
          <div className="p-4 sm:p-6 border-b border-white/10">
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Search collaborations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2 text-sm sm:text-base bg-dark-700/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary-600/50 focus:border-primary-600 text-gray-900 placeholder-gray-800 transition-all duration-300"
                />
              </div>
              {(activeTab === 'pending' || activeTab === 'history') && (
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 w-4 h-4 sm:w-5 sm:h-5" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-9 sm:pl-10 pr-8 py-2 text-sm sm:text-base bg-dark-700/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary-600/50 focus:border-primary-600 appearance-none text-gray-900 min-w-32 sm:min-w-40 transition-all duration-300"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200">
          {activeTab === 'active' && (
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Active Collaborations</h2>
                <span className="text-sm text-gray-600">{filteredCollaborations.length} collaborations</span>
              </div>
              
              {filteredCollaborations.length > 0 ? (
                <div className="grid gap-4 sm:gap-6">
                  {filteredCollaborations.map((collaboration) => (
                    <div key={collaboration.id} className="bg-gray-50 rounded-xl p-4 sm:p-6 hover:shadow-md transition-shadow duration-300 border border-gray-200">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                            <h3 className="text-base font-semibold text-gray-900">
                              {collaboration.campaign_title}
                            </h3>
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border self-start ${getStatusColor(collaboration.status)}`}>
                              {getStatusIcon(collaboration.status)}
                              {collaboration.status.replace('_', ' ')}
                            </span>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <Building2 className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span className="truncate">{collaboration.company_name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span className="font-semibold text-primary-600">₹{collaboration.final_rate?.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span className="text-xs">
                                {new Date(collaboration.start_date).toLocaleDateString()} - {new Date(collaboration.end_date).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          
                          {collaboration.notes && (
                            <div className="mt-3 p-3 bg-dark-700/30 rounded-lg border border-white/5">
                              <p className="text-xs sm:text-sm text-gray-800">{collaboration.notes}</p>
                            </div>
                          )}
                        </div>
                        
                        <button className="mt-3 sm:mt-0 sm:ml-4 p-2 text-gray-800 hover:text-gray-900 rounded-lg hover:bg-white/5 self-start transition-all duration-200">
                          <MoreHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <PlayCircle className="w-10 h-10 sm:w-12 sm:h-12 text-gray-800 mx-auto mb-4" />
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No active collaborations</h3>
                  <p className="text-sm sm:text-base text-gray-800">Your accepted collaborations will appear here</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'pending' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-dashboard-section text-gray-900">Pending Applications</h2>
                <span className="text-sm text-gray-800">
                  {filteredRequests.filter(req => req.status === 'pending').length} pending
                </span>
              </div>
              
              {filteredRequests.filter(req => req.status === 'pending').length > 0 ? (
                <div className="grid gap-4 sm:gap-6">
                  {filteredRequests
                    .filter(req => req.status === 'pending')
                    .map((request) => (
                    <div key={request.id} className="glass-card-dark rounded-xl p-6 card-hover border border-white/10">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-dashboard-card text-gray-900">
                              {request.campaign_title}
                            </h3>
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                              {getStatusIcon(request.status)}
                              {request.status}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-800 mb-3">
                            <div className="flex items-center gap-1">
                              <Building2 className="w-4 h-4" />
                              {request.company_name}
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              <span>Proposed: <span className="font-data text-primary-400">₹{request.proposed_rate?.toLocaleString()}</span></span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Applied: {new Date(request.created_at).toLocaleDateString()}
                            </div>
                          </div>
                          
                          {request.message && (
                            <div className="mt-3 p-3 bg-dark-700/30 rounded-lg border border-white/5">
                              <p className="text-sm text-gray-800">{request.message}</p>
                            </div>
                          )}
                        </div>
                        
                        <button className="p-2 text-gray-800 hover:text-gray-900 rounded-lg hover:bg-white/5 transition-all duration-200">
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Clock className="w-12 h-12 text-gray-800 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No pending applications</h3>
                  <p className="text-gray-800">Your pending collaboration requests will appear here</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-dashboard-section text-gray-900">Application History</h2>
                <span className="text-sm text-gray-800">
                  {filteredRequests.filter(req => req.status !== 'pending').length} applications
                </span>
              </div>
              
              {filteredRequests.filter(req => req.status !== 'pending').length > 0 ? (
                <div className="grid gap-4 sm:gap-6">
                  {filteredRequests
                    .filter(req => req.status !== 'pending')
                    .map((request) => (
                    <div key={request.id} className="glass-card-dark rounded-xl p-6 card-hover border border-white/10">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-dashboard-card text-gray-900">
                              {request.campaign_title}
                            </h3>
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                              {getStatusIcon(request.status)}
                              {request.status}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-800 mb-3">
                            <div className="flex items-center gap-1">
                              <Building2 className="w-4 h-4" />
                              {request.company_name}
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              <span>Proposed: <span className="font-data text-primary-400">₹{request.proposed_rate?.toLocaleString()}</span></span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Applied: {new Date(request.created_at).toLocaleDateString()}
                            </div>
                          </div>
                          
                          {request.message && request.message.includes('[REJECTION REASON]') && (
                            <div className="mt-3 p-3 bg-gray-500/10 border-l-4 border-gray-500/30 rounded-lg">
                              <p className="text-sm text-gray-800">
                                <strong>Rejection Reason:</strong> {request.message.split('[REJECTION REASON]:')[1]?.trim()}
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <button className="p-2 text-gray-800 hover:text-gray-900 rounded-lg hover:bg-white/5 transition-all duration-200">
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-800 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No application history</h3>
                  <p className="text-gray-800">Your completed and rejected applications will appear here</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 sm:mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 rounded-lg bg-gradient-to-br from-primary-600 to-accent-500">
                  <PlayCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Active</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{collaborations?.results?.length || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 rounded-lg bg-gradient-to-br from-gray-500 to-gray-600">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Pending</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {requests?.results?.filter(req => req.status === 'pending').length || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 rounded-lg bg-gradient-to-br from-primary-500 to-accent-600">
                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Completed</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {requests?.results?.filter(req => req.status === 'completed').length || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition-shadow duration-300 col-span-2 lg:col-span-1">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 rounded-lg bg-gradient-to-br from-accent-500 to-primary-600">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-lg sm:text-2xl font-bold text-primary-600">
                  ₹{collaborations?.results?.reduce((sum, col) => sum + (col.final_rate || 0), 0).toLocaleString() || '0'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborationList;