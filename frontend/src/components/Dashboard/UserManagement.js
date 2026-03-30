import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Search, Filter, Mail, Phone, Calendar, 
  Shield, UserCheck, UserX, Trash2, Eye, MoreVertical,
  ArrowRight, Building2, User, Instagram, Youtube, MapPin, 
  Languages, IndianRupee, PieChart, ExternalLink, Briefcase,
  KeyRound, EyeOff, X, CheckCircle2
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [resetPasswordTarget, setResetPasswordTarget] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [userTypeFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const url = userTypeFilter === 'all' 
        ? '/auth/admin/all-users/' 
        : `/auth/admin/all-users/?user_type=${userTypeFilter}`;
      const response = await api.get(url);
      setUsers(response.data.results || response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await api.delete(`/auth/admin/delete-influencer/${userId}/`);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const openResetPasswordModal = (user, e) => {
    e.stopPropagation();
    setResetPasswordTarget(user);
    setNewPassword('');
    setConfirmPassword('');
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setIsResetPasswordModalOpen(true);
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    setResetLoading(true);
    try {
      const response = await api.post(`/auth/admin/reset-password/${resetPasswordTarget.id}/`, {
        new_password: newPassword
      });
      toast.success(response.data.message || 'Password reset successfully!');
      setIsResetPasswordModalOpen(false);
      setResetPasswordTarget(null);
    } catch (error) {
      const msg = error.response?.data?.error || 'Failed to reset password.';
      toast.error(msg);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage all influencers and companies on the platform</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 w-full md:w-64"
            />
          </div>
          <select
            value={userTypeFilter}
            onChange={(e) => setUserTypeFilter(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-violet-500"
          >
            <option value="all">All Roles</option>
            <option value="influencer">Influencers</option>
            <option value="company">Companies</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredUsers.map((user) => (
                  <tr 
                    key={user.id} 
                    onClick={() => { setSelectedUser(user); setIsDetailModalOpen(true); }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white bg-gradient-to-br ${user.user_type === 'influencer' ? 'from-violet-500 to-purple-600' : 'from-blue-500 to-cyan-600'}`}>
                          {user.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{user.username}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1.5">
                        {user.user_type === 'influencer' ? (
                          <User className="w-3.5 h-3.5 text-violet-500" />
                        ) : (
                          <Building2 className="w-3.5 h-3.5 text-blue-500" />
                        )}
                        <span className={`text-xs font-medium capitalize ${user.user_type === 'influencer' ? 'text-violet-600 dark:text-violet-400' : 'text-blue-600 dark:text-blue-400'}`}>
                          {user.user_type}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        user.is_approved 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                      }`}>
                        {user.approval_status || (user.is_verified ? 'Verified' : 'Active')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-600 dark:text-gray-400">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => { setSelectedUser(user); setIsDetailModalOpen(true); }}
                          className="p-2 text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      <AnimatePresence>
        {isDetailModalOpen && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              <div className={`p-6 bg-gradient-to-r ${selectedUser.user_type === 'influencer' ? 'from-violet-600 to-purple-600' : 'from-blue-600 to-cyan-600'} text-white`}>
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl font-bold">
                      {selectedUser.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{selectedUser.username}</h3>
                      <p className="text-white/80 flex items-center">
                        <Mail className="w-3 h-3 mr-1.5" /> {selectedUser.email}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsDetailModalOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <UserX className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-8 overflow-y-auto max-h-[70vh]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column: Core Account & Profile */}
                  <div className="space-y-8">
                    {/* Account Basics */}
                    <div>
                      <h4 className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
                        <Shield className="w-3 h-3 mr-2 text-violet-500" />
                        Account Verification
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-2xl border border-gray-100 dark:border-gray-600">
                           <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Status</p>
                           <p className="text-sm font-black text-gray-900 dark:text-white capitalize">{selectedUser.approval_status || 'Active'}</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-2xl border border-gray-100 dark:border-gray-600">
                           <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">User Type</p>
                           <p className="text-sm font-black text-gray-900 dark:text-white capitalize">{selectedUser.user_type}</p>
                        </div>
                      </div>
                    </div>

                    {/* Influencer Specific Details */}
                    {selectedUser.user_type === 'influencer' && selectedUser.influencer_profile && (
                      <div className="space-y-8">
                        <div>
                          <h4 className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
                            <PieChart className="w-3 h-3 mr-2 text-purple-500" />
                            Performance & REACH
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800">
                              <p className="text-[10px] text-violet-400 font-bold uppercase mb-1">Followers</p>
                              <p className="text-lg font-black text-violet-700 dark:text-violet-300">
                                {selectedUser.influencer_profile.followers_count?.toLocaleString()}
                              </p>
                            </div>
                            <div className="p-4 rounded-2xl bg-fuchsia-50 dark:bg-fuchsia-900/20 border border-fuchsia-100 dark:border-fuchsia-800">
                              <p className="text-[10px] text-fuchsia-400 font-bold uppercase mb-1">Engagement</p>
                              <p className="text-lg font-black text-fuchsia-700 dark:text-fuchsia-300">
                                {selectedUser.influencer_profile.engagement_rate}%
                              </p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
                            <Instagram className="w-3 h-3 mr-2 text-pink-500" />
                            SOCIAL CONNECTIONS
                          </h4>
                          <div className="space-y-2">
                             {selectedUser.influencer_profile.instagram_handle && (
                               <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30">
                                 <span className="text-xs font-bold text-gray-500 uppercase">Instagram</span>
                                 <span className="text-sm font-black text-gray-900 dark:text-white">@{selectedUser.influencer_profile.instagram_handle}</span>
                               </div>
                             )}
                             {selectedUser.influencer_profile.youtube_channel && (
                               <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30">
                                 <span className="text-xs font-bold text-gray-500 uppercase">YouTube</span>
                                 <span className="text-sm font-black text-gray-900 dark:text-white">{selectedUser.influencer_profile.youtube_channel}</span>
                               </div>
                             )}
                          </div>
                        </div>

                        <div>
                          <h4 className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
                            <IndianRupee className="w-3 h-3 mr-2 text-emerald-500" />
                            RATE CARD (ESTIMATED)
                          </h4>
                          <div className="grid grid-cols-2 gap-3">
                            {[
                              { label: 'Post', val: selectedUser.influencer_profile.rate_per_post },
                              { label: 'Story', val: selectedUser.influencer_profile.rate_per_story },
                              { label: 'Reel', val: selectedUser.influencer_profile.rate_per_reel },
                              { label: 'Video', val: selectedUser.influencer_profile.rate_per_video },
                            ].map(rate => (
                              <div key={rate.label} className="p-3 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                                <p className="text-[9px] text-gray-400 font-black uppercase mb-1">{rate.label}</p>
                                <p className="text-sm font-black text-gray-900 dark:text-white">₹{rate.val}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Company Specific Details */}
                    {selectedUser.user_type === 'company' && selectedUser.company_profile && (
                      <div className="space-y-8">
                        <div>
                          <h4 className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
                            <Briefcase className="w-3 h-3 mr-2 text-blue-500" />
                            Business Profile
                          </h4>
                          <div className="space-y-3">
                             <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30">
                               <span className="text-xs font-bold text-gray-500 uppercase">Industry</span>
                               <span className="text-sm font-black text-gray-900 dark:text-white capitalize">{selectedUser.company_profile.industry}</span>
                             </div>
                             <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30">
                               <span className="text-xs font-bold text-gray-500 uppercase">Company Size</span>
                               <span className="text-sm font-black text-gray-900 dark:text-white capitalize">{selectedUser.company_profile.company_size || 'N/A'}</span>
                             </div>
                             <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30">
                               <span className="text-xs font-bold text-gray-500 uppercase">Website</span>
                               <a href={selectedUser.company_profile.website} target="_blank" rel="noreferrer" className="text-sm font-black text-blue-600 flex items-center hover:underline">
                                 Visit site <ExternalLink className="w-3 h-3 ml-1" />
                               </a>
                             </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
                            <IndianRupee className="w-3 h-3 mr-2 text-blue-500" />
                            Financial Overview
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                              <p className="text-[10px] text-blue-400 font-bold uppercase mb-1">Total Spend</p>
                              <p className="text-lg font-black text-blue-700 dark:text-blue-300">
                                ₹{selectedUser.company_profile.total_spend?.toLocaleString()}
                              </p>
                            </div>
                            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800">
                              <p className="text-[10px] text-amber-400 font-bold uppercase mb-1">Pending</p>
                              <p className="text-lg font-black text-amber-700 dark:text-amber-300">
                                ₹{selectedUser.company_profile.pending_payment?.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Bio, Contact & Actions */}
                  <div className="space-y-8">
                    <div>
                      <h4 className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
                        <User className="w-3 h-3 mr-2 text-violet-500" />
                        ABOUT / DESCRIPTION
                      </h4>
                      <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-700/30 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed border border-gray-100 dark:border-gray-600">
                        {selectedUser.user_type === 'influencer' 
                          ? (selectedUser.influencer_profile?.bio || 'No bio provided.')
                          : (selectedUser.company_profile?.description || 'No description provided.')}
                      </div>
                    </div>

                    <div>
                      <h4 className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
                        <MapPin className="w-3 h-3 mr-2 text-violet-500" />
                        LOCATION & LANGUAGES
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                           <MapPin className="w-4 h-4 mr-3 text-gray-400" />
                           <span className="font-bold">{selectedUser.influencer_profile?.location || selectedUser.company_profile?.location || 'Unknown'}</span>
                        </div>
                        {selectedUser.user_type === 'influencer' && selectedUser.influencer_profile?.languages && (
                          <div className="flex flex-wrap gap-2">
                            {selectedUser.influencer_profile.languages.map((lang, idx) => (
                              <span key={idx} className="px-3 py-1 bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 rounded-lg text-xs font-bold uppercase tracking-wider">
                                {lang}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-[2rem] p-6 border border-gray-100 dark:border-gray-600 border-dashed">
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Administrative Controls</h4>
                      <div className="space-y-3">
                        <button 
                          onClick={(e) => openResetPasswordModal(selectedUser, e)}
                          className="w-full py-3 px-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-2xl text-xs font-black text-gray-700 dark:text-gray-200 hover:border-violet-500 hover:text-violet-500 transition-all flex items-center justify-between group"
                        >
                          <span className="flex items-center gap-2"><KeyRound className="w-3.5 h-3.5" /> RESET USER PASSWORD</span>
                          <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                        </button>
                        <button className="w-full py-3 px-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-2xl text-xs font-black text-gray-700 dark:text-gray-200 hover:border-amber-500 hover:text-amber-500 transition-all flex items-center justify-between group">
                          <span>SUSPEND ACCOUNT</span>
                          <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                        </button>
                        <button 
                          onClick={() => { setIsDetailModalOpen(false); handleDeleteUser(selectedUser.id); }}
                          className="w-full py-3 px-5 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl text-xs font-black text-red-600 hover:bg-red-100 transition-all flex items-center justify-between group"
                        >
                          <span>DELETE PERMANENTLY</span>
                          <Trash2 className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reset Password Modal */}
      <AnimatePresence>
        {isResetPasswordModalOpen && resetPasswordTarget && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-violet-600 to-purple-600 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <KeyRound className="w-5 h-5" />
                      <h3 className="text-lg font-bold">Reset Password</h3>
                    </div>
                    <p className="text-white/70 text-sm">For: <span className="font-bold text-white">{resetPasswordTarget.username}</span> ({resetPasswordTarget.email})</p>
                  </div>
                  <button
                    onClick={() => setIsResetPasswordModalOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                {/* New Password */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="mt-1.5 text-xs text-red-500 font-medium">Passwords do not match</p>
                  )}
                  {confirmPassword && newPassword === confirmPassword && newPassword.length >= 6 && (
                    <p className="mt-1.5 text-xs text-green-500 font-medium flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Passwords match</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setIsResetPasswordModalOpen(false)}
                    className="flex-1 py-3 px-4 border border-gray-200 dark:border-gray-600 text-sm font-bold text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleResetPassword}
                    disabled={resetLoading || !newPassword || !confirmPassword}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-bold rounded-xl hover:from-violet-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    {resetLoading ? (
                      <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> Resetting...</>
                    ) : (
                      <><KeyRound className="w-4 h-4" /> Reset Password</>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserManagement;
