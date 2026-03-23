import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Ticket, Clock, CheckCircle, XCircle, AlertCircle,
  Search, Filter, Eye, MessageSquare, Calendar, Send,
  User, Activity, X
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminSupportTickets = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [newStatus, setNewStatus] = useState('');

  const { data: ticketsData, isLoading } = useQuery(
    ['admin-support-tickets', statusFilter, priorityFilter],
    async () => {
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (priorityFilter !== 'all') params.priority = priorityFilter;
      const response = await api.get('/support/tickets/', { params });
      return response.data;
    }
  );

  // Handle both paginated and non-paginated responses
  const tickets = Array.isArray(ticketsData) ? ticketsData : (ticketsData?.results || []);

  const { data: stats } = useQuery('admin-ticket-stats', async () => {
    const response = await api.get('/support/tickets/statistics/');
    return response.data;
  });

  const replyMutation = useMutation(
    async ({ ticketId, reply, status }) => {
      const payload = {
        admin_reply: reply,
      };
      
      // Only include status if it's provided and not empty
      if (status && status.trim() !== '') {
        payload.status = status;
      }
      
      const response = await api.post(`/support/tickets/${ticketId}/reply/`, payload);
      return response.data;
    },
    {
      onSuccess: () => {
        toast.success('Reply sent successfully!');
        queryClient.invalidateQueries('admin-support-tickets');
        queryClient.invalidateQueries('admin-ticket-stats');
        setSelectedTicket(null);
        setReplyText('');
        setNewStatus('');
      },
      onError: (error) => {
        console.error('Reply error:', error.response?.data);
        const errorMessage = error.response?.data?.admin_reply?.[0] || 
                           error.response?.data?.status?.[0] ||
                           error.response?.data?.message || 
                           'Failed to send reply';
        toast.error(errorMessage);
      },
    }
  );

  const updateStatusMutation = useMutation(
    async ({ ticketId, status }) => {
      const response = await api.patch(`/support/tickets/${ticketId}/update_status/`, {
        status,
      });
      return response.data;
    },
    {
      onSuccess: () => {
        toast.success('Status updated successfully!');
        queryClient.invalidateQueries('admin-support-tickets');
        queryClient.invalidateQueries('admin-ticket-stats');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update status');
      },
    }
  );

  const getStatusConfig = (status) => {
    const configs = {
      open: {
        label: 'Open',
        color: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: AlertCircle,
      },
      in_progress: {
        label: 'In Progress',
        color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        icon: Clock,
      },
      resolved: {
        label: 'Resolved',
        color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        icon: CheckCircle,
      },
      closed: {
        label: 'Closed',
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: XCircle,
      },
    };
    return configs[status] || configs.open;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'text-gray-600 bg-gray-100',
      medium: 'text-blue-600 bg-blue-100',
      high: 'text-red-600 bg-red-100',
    };
    return colors[priority] || colors.medium;
  };

  const filteredTickets = (tickets || []).filter((ticket) =>
    ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.ticket_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.user_details?.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleReply = () => {
    if (!replyText.trim()) {
      toast.error('Please enter a reply message');
      return;
    }

    if (replyText.trim().length < 10) {
      toast.error('Reply must be at least 10 characters long');
      return;
    }

    replyMutation.mutate({
      ticketId: selectedTicket.id,
      reply: replyText,
      status: newStatus || undefined,
    });
  };

  const handleStatusChange = (ticketId, status) => {
    updateStatusMutation.mutate({ ticketId, status });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Support Tickets Management</h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
          Manage and respond to user support requests
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <Ticket className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total_tickets}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Tickets</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.status_breakdown?.open || 0}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Open</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-indigo-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.status_breakdown?.in_progress || 0}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.status_breakdown?.resolved || 0}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Resolved</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.average_response_time_hours ? `${stats.average_response_time_hours}h` : 'N/A'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Avg Response</p>
          </motion.div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-w-40"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div className="relative">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="pl-4 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-w-32"
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
        {filteredTickets.length === 0 ? (
          <div className="text-center py-12 px-4">
            <Ticket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No tickets found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery ? 'Try adjusting your search or filters' : 'No support tickets yet'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredTickets.map((ticket, index) => {
              const statusConfig = getStatusConfig(ticket.status);
              const StatusIcon = statusConfig.icon;

              return (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors cursor-pointer"
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Ticket className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                              {ticket.subject}
                            </h3>
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                              <StatusIcon className="w-3 h-3" />
                              {statusConfig.label}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                              {ticket.priority.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            Ticket #{ticket.ticket_number}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                            <span className="inline-flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {ticket.user_details?.username || 'Unknown User'}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(ticket.created_at).toLocaleDateString()}
                            </span>
                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full">
                              {ticket.category.charAt(0).toUpperCase() + ticket.category.slice(1)}
                            </span>
                            {ticket.response_time && (
                              <span className="text-green-600 dark:text-green-400 font-medium">
                                Responded in {ticket.response_time}h
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 ml-13">
                        {ticket.message}
                      </p>
                      {ticket.admin_reply && (
                        <div className="mt-3 ml-13 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-semibold text-blue-900 dark:text-blue-300">Your Reply</span>
                          </div>
                          <p className="text-sm text-blue-800 dark:text-blue-200 line-clamp-2">{ticket.admin_reply}</p>
                        </div>
                      )}
                    </div>
                    <button className="flex-shrink-0 p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors">
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Ticket Detail Modal */}
      <AnimatePresence>
        {selectedTicket && (
          <TicketDetailModal
            ticket={selectedTicket}
            onClose={() => {
              setSelectedTicket(null);
              setReplyText('');
              setNewStatus('');
            }}
            replyText={replyText}
            setReplyText={setReplyText}
            newStatus={newStatus}
            setNewStatus={setNewStatus}
            onReply={handleReply}
            onStatusChange={handleStatusChange}
            isSubmitting={replyMutation.isLoading || updateStatusMutation.isLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Ticket Detail Modal Component
const TicketDetailModal = ({
  ticket,
  onClose,
  replyText,
  setReplyText,
  newStatus,
  setNewStatus,
  onReply,
  onStatusChange,
  isSubmitting,
}) => {
  const statusConfig = {
    open: { label: 'Open', color: 'bg-amber-100 text-amber-800', icon: AlertCircle },
    in_progress: { label: 'In Progress', color: 'bg-indigo-100 text-indigo-800', icon: Clock },
    resolved: { label: 'Resolved', color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle },
    closed: { label: 'Closed', color: 'bg-gray-100 text-gray-800', icon: XCircle },
  }[ticket.status];

  const StatusIcon = statusConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-50 to-accent-50 dark:from-gray-900 dark:to-gray-800">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{ticket.subject}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Ticket #{ticket.ticket_number}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-88px)]">
          {/* Status and Info */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${statusConfig.color}`}>
              <StatusIcon className="w-4 h-4" />
              {statusConfig.label}
            </span>
            <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
              {ticket.category.charAt(0).toUpperCase() + ticket.category.slice(1)}
            </span>
            <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
              ticket.priority === 'high' ? 'bg-red-100 text-red-700' :
              ticket.priority === 'medium' ? 'bg-blue-100 text-blue-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)} Priority
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              User: <span className="font-medium">{ticket.user_details?.username}</span>
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Created: {new Date(ticket.created_at).toLocaleString()}
            </span>
          </div>

          {/* Quick Status Change */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Quick Status Change
            </label>
            <div className="flex gap-2">
              {['open', 'in_progress', 'resolved', 'closed'].map((status) => (
                <button
                  key={status}
                  onClick={() => onStatusChange(ticket.id, status)}
                  disabled={ticket.status === status || isSubmitting}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    ticket.status === status
                      ? 'bg-primary-600 text-white cursor-not-allowed'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                  }`}
                >
                  {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* User Message */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">User Message</h3>
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{ticket.message}</p>
            </div>
          </div>

          {/* Screenshot */}
          {ticket.screenshot && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Screenshot</h3>
              <img
                src={ticket.screenshot}
                alt="Ticket screenshot"
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700"
              />
            </div>
          )}

          {/* Existing Admin Reply */}
          {ticket.admin_reply && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Previous Response</h3>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-300">
                    Replied on {new Date(ticket.admin_replied_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-blue-900 dark:text-blue-200 whitespace-pre-wrap">{ticket.admin_reply}</p>
              </div>
            </div>
          )}

          {/* Reply Form */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {ticket.admin_reply ? 'Send Another Reply' : 'Send Reply'}
              </h3>
              <span className={`text-sm ${
                replyText.length < 10 ? 'text-red-600' : 'text-gray-600 dark:text-gray-400'
              }`}>
                {replyText.length} / 10 min
              </span>
            </div>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your response to the user... (minimum 10 characters)"
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            />
            {replyText.length > 0 && replyText.length < 10 && (
              <p className="text-sm text-red-600 mt-1">
                Please enter at least {10 - replyText.length} more character{10 - replyText.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Status Change on Reply */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Change Status (Optional)
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            >
              <option value="">Keep current status</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium disabled:opacity-50"
            >
              Close
            </button>
            <button
              onClick={onReply}
              disabled={isSubmitting || !replyText.trim() || replyText.trim().length < 10}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-500 text-white rounded-xl hover:from-primary-700 hover:to-accent-600 transition-all font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Send Reply</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminSupportTickets;
