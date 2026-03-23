import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Ticket, Clock, CheckCircle, XCircle, AlertCircle,
  Search, Filter, Eye, MessageSquare, Calendar, Plus
} from 'lucide-react';
import api from '../../services/api';
import ContactSupportModal from './ContactSupportModal';

const MySupportTickets = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);

  const { data: tickets, isLoading, refetch } = useQuery(
    ['my-support-tickets', statusFilter],
    async () => {
      const params = statusFilter !== 'all' ? { status: statusFilter } : {};
      const response = await api.get('/support/tickets/my_tickets/', { params });
      return response.data;
    }
  );

  const { data: stats } = useQuery('ticket-stats', async () => {
    const response = await api.get('/support/stats/');
    return response.data;
  });

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
      low: 'text-gray-600',
      medium: 'text-blue-600',
      high: 'text-red-600',
    };
    return colors[priority] || colors.medium;
  };

  const filteredTickets = tickets?.filter((ticket) =>
    ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.ticket_number.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleCloseModal = () => {
    setShowContactModal(false);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Support Tickets</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Track and manage your support requests</p>
        </div>
        <button
          onClick={() => setShowContactModal(true)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-500 text-white rounded-xl hover:from-primary-700 hover:to-accent-600 transition-all font-medium shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          <span>New Ticket</span>
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Ticket className="w-5 h-5 text-gray-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-600">Total Tickets</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.open}</p>
            <p className="text-sm text-gray-600">Open</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-indigo-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.in_progress}</p>
            <p className="text-sm text-gray-600">In Progress</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
            <p className="text-sm text-gray-600">Resolved</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <XCircle className="w-5 h-5 text-gray-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.closed}</p>
            <p className="text-sm text-gray-600">Closed</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white min-w-40"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200">
        {filteredTickets.length === 0 ? (
          <div className="text-center py-12 px-4">
            <Ticket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No tickets found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? 'Try adjusting your search or filters'
                : 'Create your first support ticket to get help'}
            </p>
            <button
              onClick={() => setShowContactModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              <span>Create Ticket</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredTickets.map((ticket, index) => {
              const statusConfig = getStatusConfig(ticket.status);
              const StatusIcon = statusConfig.icon;

              return (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Ticket className="w-5 h-5 text-primary-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {ticket.subject}
                            </h3>
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                              <StatusIcon className="w-3 h-3" />
                              {statusConfig.label}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            Ticket #{ticket.ticket_number}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(ticket.created_at).toLocaleDateString()}
                            </span>
                            <span className={`font-medium ${getPriorityColor(ticket.priority)}`}>
                              {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)} Priority
                            </span>
                            <span className="px-2 py-0.5 bg-gray-100 rounded-full">
                              {ticket.category.charAt(0).toUpperCase() + ticket.category.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2 ml-13">
                        {ticket.message}
                      </p>
                      {ticket.admin_reply && (
                        <div className="mt-3 ml-13 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <MessageSquare className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-semibold text-blue-900">Admin Reply</span>
                          </div>
                          <p className="text-sm text-blue-800 line-clamp-2">{ticket.admin_reply}</p>
                        </div>
                      )}
                    </div>
                    <button className="flex-shrink-0 p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
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
            onClose={() => setSelectedTicket(null)}
          />
        )}
      </AnimatePresence>

      {/* Contact Support Modal */}
      <ContactSupportModal
        isOpen={showContactModal}
        onClose={handleCloseModal}
      />
    </div>
  );
};

// Ticket Detail Modal Component
const TicketDetailModal = ({ ticket, onClose }) => {
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
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-accent-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{ticket.subject}</h2>
            <p className="text-sm text-gray-600 mt-1">Ticket #{ticket.ticket_number}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XCircle className="w-6 h-6 text-gray-600" />
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
            <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
              {ticket.category.charAt(0).toUpperCase() + ticket.category.slice(1)}
            </span>
            <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)} Priority
            </span>
            <span className="text-sm text-gray-600">
              Created: {new Date(ticket.created_at).toLocaleString()}
            </span>
          </div>

          {/* Message */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Message</h3>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-gray-700 whitespace-pre-wrap">{ticket.message}</p>
            </div>
          </div>

          {/* Screenshot */}
          {ticket.screenshot && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Screenshot</h3>
              <img
                src={ticket.screenshot}
                alt="Ticket screenshot"
                className="w-full rounded-xl border border-gray-200"
              />
            </div>
          )}

          {/* Admin Reply */}
          {ticket.admin_reply && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Admin Response</h3>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">
                    Replied on {new Date(ticket.admin_replied_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-blue-900 whitespace-pre-wrap">{ticket.admin_reply}</p>
              </div>
            </div>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MySupportTickets;
