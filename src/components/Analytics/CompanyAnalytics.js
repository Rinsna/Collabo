import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import toast from 'react-hot-toast';
import {
  TrendingUp, TrendingDown, DollarSign, Users, Target, Activity,
  Calendar, Download, Filter, BarChart3, Award, Eye, Heart,
  MessageCircle, Share2, ChevronDown, FileText, FileSpreadsheet,
  X, CheckCircle, CreditCard, Briefcase, Zap, ArrowUpRight
} from 'lucide-react';

const CompanyAnalytics = () => {
  const queryClient = useQueryClient();
  const [dateRange, setDateRange] = useState('30days');
  const [selectedCampaign, setSelectedCampaign] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCampaignDetails, setSelectedCampaignDetails] = useState(null);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [markingPayment, setMarkingPayment] = useState(false);
  const [animatedValues, setAnimatedValues] = useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalSpend: 0,
    totalReach: 0
  });

  // Fetch campaigns data
  const { data: campaignsData } = useQuery('company-campaigns', async () => {
    const response = await api.get('/collaborations/campaigns/');
    return response.data;
  });

  // Fetch company profile for payment tracking
  const { data: companyProfile } = useQuery('company-profile', async () => {
    const response = await api.get('/auth/company-profile/');
    return response.data;
  });

  const campaigns = campaignsData?.results || [];

  // Mark payment as completed mutation
  const markPaymentCompletedMutation = useMutation(
    (campaignId) => api.post(`/collaborations/campaigns/${campaignId}/mark-payment-completed/`),
    {
      onSuccess: (response) => {
        toast.success('Payment marked as completed');
        setSelectedCampaignDetails(response.data.campaign);
        queryClient.invalidateQueries('company-campaigns');
        queryClient.invalidateQueries('company-profile');
        setMarkingPayment(false);
      },
      onError: (error) => {
        const errorMessage = error.response?.data?.error || 'Failed to mark payment as completed';
        toast.error(errorMessage);
        setMarkingPayment(false);
      }
    }
  );

  const handleMarkPaymentCompleted = async (campaignId) => {
    if (markingPayment) return;
    setMarkingPayment(true);
    markPaymentCompletedMutation.mutate(campaignId);
  };

  // Analytics data
  const kpiData = {
    totalCampaigns: campaigns.length,
    activeCampaigns: campaigns.filter(c => c.status === 'active').length,
    totalSpend: campaigns.reduce((sum, c) => {
      const budget = parseFloat(c.budget) || 0;
      return sum + budget;
    }, 0),
    totalReach: 2450000,
    engagementRate: 4.8,
    roi: 195,
    reachChange: 12.5,
    engagementChange: -2.3,
    roiChange: 18.7,
    spendChange: 8.3
  };

  // Debug: Log the total spend calculation
  useEffect(() => {
    if (campaigns.length > 0) {
      console.log('Campaigns:', campaigns.length);
      console.log('Campaign budgets:', campaigns.map(c => ({ title: c.title, budget: c.budget })));
      console.log('Total Spend:', kpiData.totalSpend);
    }
  }, [campaigns, kpiData.totalSpend]);

  // Demo data for charts (use when real data unavailable)
  const campaignPerformance = [
    { name: 'Jan', reach: 180000, engagement: 8500, conversions: 450, spend: 60000 },
    { name: 'Feb', reach: 220000, engagement: 10200, conversions: 580, spend: 85000 },
    { name: 'Mar', reach: 280000, engagement: 13400, conversions: 720, spend: 120000 },
    { name: 'Apr', reach: 310000, engagement: 14800, conversions: 850, spend: 180000 },
    { name: 'May', reach: 350000, engagement: 16800, conversions: 920, spend: 240000 },
    { name: 'Jun', reach: 420000, engagement: 20200, conversions: 1100, spend: 310000 }
  ];

  const roiData = [
    { name: 'Jan', roi: 120 },
    { name: 'Feb', roi: 135 },
    { name: 'Mar', roi: 148 },
    { name: 'Apr', roi: 162 },
    { name: 'May', roi: 178 },
    { name: 'Jun', roi: 195 }
  ];

  const campaignStatus = {
    completed: 42,
    active: 9,
    pending: 6
  };

  const topInfluencers = [
    { name: 'Sarah Johnson', reach: 450000, engagement: 5.2, roi: 320, avatar: 'S', category: 'Fashion' },
    { name: 'Mike Chen', reach: 380000, engagement: 4.8, roi: 295, avatar: 'M', category: 'Tech' },
    { name: 'Emma Davis', reach: 320000, engagement: 5.5, roi: 310, avatar: 'E', category: 'Lifestyle' },
    { name: 'Alex Kumar', reach: 290000, engagement: 4.2, roi: 265, avatar: 'A', category: 'Fitness' },
    { name: 'Lisa Wang', reach: 250000, engagement: 4.9, roi: 280, avatar: 'L', category: 'Beauty' }
  ];

  // Animate numbers on mount
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setAnimatedValues({
        totalCampaigns: Math.floor(kpiData.totalCampaigns * progress),
        activeCampaigns: Math.floor(kpiData.activeCampaigns * progress),
        totalSpend: Math.floor(kpiData.totalSpend * progress),
        totalReach: Math.floor(kpiData.totalReach * progress)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedValues({
          totalCampaigns: kpiData.totalCampaigns,
          activeCampaigns: kpiData.activeCampaigns,
          totalSpend: kpiData.totalSpend,
          totalReach: kpiData.totalReach
        });
      }
    }, interval);

    return () => clearInterval(timer);
  }, [kpiData.totalCampaigns, kpiData.activeCampaigns, kpiData.totalSpend, kpiData.totalReach]);

  const handleExport = (format) => {
    if (format === 'csv') {
      toast.success('Exporting to CSV...');
    } else if (format === 'pdf') {
      toast.success('Exporting to PDF...');
    }
  };

  const handleCampaignClick = (campaign) => {
    setSelectedCampaignDetails(campaign);
    setShowCampaignModal(true);
  };

  const closeCampaignModal = () => {
    setShowCampaignModal(false);
    setSelectedCampaignDetails(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-cyan-50 to-lime-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-neutral-800 mb-2">Analytics Dashboard</h1>
            <p className="text-neutral-500">Track your campaign performance and ROI</p>
          </div>
          
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-200 text-neutral-700 rounded-xl hover:bg-neutral-50 transition-colors shadow-sm">
              <Filter className="w-4 h-4" />
              <span className="font-medium">Filters</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </motion.button>
            
            <div className="relative group">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-cyan-500 text-white rounded-xl hover:from-violet-700 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl">
                <Download className="w-4 h-4" />
                <span className="font-medium">Export</span>
              </motion.button>
              
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-neutral-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <button
                  onClick={() => handleExport('csv')}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors rounded-t-xl">
                  <FileSpreadsheet className="w-4 h-4 text-violet-600" />
                  <span className="text-neutral-800 font-medium">Export as CSV</span>
                </button>
                <button
                  onClick={() => handleExport('pdf')}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors rounded-b-xl">
                  <FileText className="w-4 h-4 text-violet-600" />
                  <span className="text-neutral-800 font-medium">Export as PDF</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Date Range</label>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-800 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all">
                    <option value="7days">Last 7 days</option>
                    <option value="30days">Last 30 days</option>
                    <option value="90days">Last 90 days</option>
                    <option value="1year">Last year</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Campaign</label>
                  <select
                    value={selectedCampaign}
                    onChange={(e) => setSelectedCampaign(e.target.value)}
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-800 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all">
                    <option value="all">All Campaigns</option>
                    {campaigns.map(campaign => (
                      <option key={campaign.id} value={campaign.id}>{campaign.title}</option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* KPI Cards */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total Campaigns"
            value={animatedValues.totalCampaigns}
            icon={BarChart3}
            gradient="from-violet-600 to-cyan-500"
          />
          <KPICard
            title="Active Campaigns"
            value={animatedValues.activeCampaigns}
            icon={Activity}
            gradient="from-cyan-500 to-lime-500"
          />
          <KPICard
            title="Total Reach"
            value={`${(animatedValues.totalReach / 1000000).toFixed(1)}M`}
            change={kpiData.reachChange}
            icon={Users}
            gradient="from-lime-500 to-violet-600"
          />
          <KPICard
            title="Total Spend"
            value={
              animatedValues.totalSpend >= 100000 
                ? `₹${(animatedValues.totalSpend / 100000).toFixed(1)}L`
                : animatedValues.totalSpend >= 1000
                ? `₹${(animatedValues.totalSpend / 1000).toFixed(1)}K`
                : `₹${animatedValues.totalSpend}`
            }
            change={kpiData.spendChange}
            icon={DollarSign}
            gradient="from-orange-500 to-violet-600"
          />
        </motion.div>

        {/* Main Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
          className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-neutral-800 mb-1">Campaign Performance</h2>
              <p className="text-sm text-neutral-500">Monthly spend and ROI trends</p>
            </div>
          </div>

          <PerformanceChart data={campaignPerformance} roiData={roiData} />
        </motion.div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Campaign Status */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
            className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-neutral-800 mb-1">Campaign Status</h3>
                <p className="text-sm text-neutral-500">Distribution overview</p>
              </div>
              <Target className="w-6 h-6 text-violet-600" />
            </div>
            
            <div className="space-y-4">
              <StatusBar label="Completed" value={campaignStatus.completed} total={57} color="lime" />
              <StatusBar label="Active" value={campaignStatus.active} total={57} color="cyan" />
              <StatusBar label="Pending" value={campaignStatus.pending} total={57} color="orange" />
            </div>
          </motion.div>

          {/* ROI Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
            className="bg-gradient-to-br from-violet-600 to-cyan-500 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold mb-1">Return on Investment</h3>
                <p className="text-violet-100 text-sm">Overall campaign ROI</p>
              </div>
              <Zap className="w-6 h-6 text-violet-200" />
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-5xl font-bold mb-2">{kpiData.roi}%</div>
                <div className="flex items-center gap-2 text-violet-100">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">+{kpiData.roiChange}% from last period</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-violet-400/30">
                <div>
                  <p className="text-violet-200 text-sm mb-1">Avg per Campaign</p>
                  <p className="text-2xl font-bold">{Math.floor(kpiData.roi / kpiData.totalCampaigns)}%</p>
                </div>
                <div>
                  <p className="text-violet-200 text-sm mb-1">Engagement Rate</p>
                  <p className="text-2xl font-bold">{kpiData.engagementRate}%</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Top Influencers & Campaigns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Influencers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
            className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-neutral-800 mb-1">Top Influencers</h3>
                <p className="text-sm text-neutral-500">Best performers</p>
              </div>
              <Award className="w-5 h-5 text-violet-600" />
            </div>
            
            <div className="space-y-3">
              {topInfluencers.slice(0, 5).map((influencer, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + idx * 0.1, duration: 0.3, ease: "easeOut" }}
                  className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors cursor-pointer">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {influencer.avatar}
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-violet-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                      {idx + 1}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-neutral-800 truncate">{influencer.name}</h4>
                    <p className="text-xs text-neutral-500">{influencer.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-neutral-800">{(influencer.reach / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-neutral-500">{influencer.engagement}%</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent Campaigns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5, ease: "easeOut" }}
            className="lg:col-span-2 bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-neutral-800 mb-1">Recent Campaigns</h3>
                <p className="text-sm text-neutral-500">Click to view details</p>
              </div>
              <Briefcase className="w-5 h-5 text-violet-600" />
            </div>
            
            <div className="space-y-3">
              {campaigns.slice(0, 5).map((campaign, idx) => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + idx * 0.1, duration: 0.3, ease: "easeOut" }}
                  onClick={() => handleCampaignClick(campaign)}
                  className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-all cursor-pointer group">
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-neutral-800 mb-1 group-hover:text-violet-600 transition-colors">
                      {campaign.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-neutral-500">
                      <span className="capitalize">{campaign.campaign_type}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(campaign.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-bold text-neutral-800">₹{(campaign.budget / 1000).toFixed(0)}K</p>
                      <p className="text-xs text-neutral-500">Budget</p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-lg ${
                      campaign.status === 'active' ? 'bg-lime-100 text-lime-700' :
                      campaign.status === 'completed' ? 'bg-neutral-200 text-neutral-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {campaign.status}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-violet-600 transition-colors" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Campaign Details Modal */}
      <AnimatePresence>
        {showCampaignModal && selectedCampaignDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={closeCampaignModal}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-800">{selectedCampaignDetails.title}</h2>
                  <p className="text-sm text-neutral-500 capitalize">{selectedCampaignDetails.campaign_type.replace('_', ' ')}</p>
                </div>
                <button
                  onClick={closeCampaignModal}
                  className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-neutral-100 transition-colors">
                  <X className="w-5 h-5 text-neutral-600" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-violet-50 to-cyan-50 rounded-xl p-4 border border-violet-100">
                    <div className="text-sm text-violet-900 mb-1">Status</div>
                    <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-lg ${
                      selectedCampaignDetails.status === 'active' ? 'bg-lime-100 text-lime-700' :
                      selectedCampaignDetails.status === 'completed' ? 'bg-neutral-200 text-neutral-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {selectedCampaignDetails.status}
                    </span>
                  </div>
                  <div className="bg-gradient-to-br from-cyan-50 to-lime-50 rounded-xl p-4 border border-cyan-100">
                    <div className="text-sm text-cyan-900 mb-1">Budget</div>
                    <div className="text-xl font-bold text-cyan-900">₹{selectedCampaignDetails.budget?.toLocaleString() || 0}</div>
                  </div>
                  <div className="bg-gradient-to-br from-lime-50 to-violet-50 rounded-xl p-4 border border-lime-100">
                    <div className="text-sm text-lime-900 mb-1">Payment</div>
                    <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-lg ${
                      selectedCampaignDetails.payment_status === 'paid' ? 'bg-lime-100 text-lime-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {selectedCampaignDetails.payment_status === 'paid' ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-violet-50 rounded-xl p-4 border border-orange-100">
                    <div className="text-sm text-orange-900 mb-1">ROI</div>
                    <div className="text-xl font-bold text-orange-900">{Math.floor(Math.random() * 200 + 150)}%</div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-neutral-800 mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-violet-600" />
                    Description
                  </h3>
                  <p className="text-neutral-700 leading-relaxed">{selectedCampaignDetails.description}</p>
                </div>

                {/* Performance Metrics */}
                <div>
                  <h3 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-violet-600" />
                    Performance Metrics
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-violet-50 rounded-xl p-4 border border-violet-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Eye className="w-4 h-4 text-violet-600" />
                        <span className="text-sm text-violet-900">Impressions</span>
                      </div>
                      <div className="text-2xl font-bold text-violet-900">{Math.floor(Math.random() * 1000 + 500)}K</div>
                    </div>
                    <div className="bg-cyan-50 rounded-xl p-4 border border-cyan-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Heart className="w-4 h-4 text-cyan-600" />
                        <span className="text-sm text-cyan-900">Likes</span>
                      </div>
                      <div className="text-2xl font-bold text-cyan-900">{Math.floor(Math.random() * 50 + 20)}K</div>
                    </div>
                    <div className="bg-lime-50 rounded-xl p-4 border border-lime-200">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageCircle className="w-4 h-4 text-lime-600" />
                        <span className="text-sm text-lime-900">Comments</span>
                      </div>
                      <div className="text-2xl font-bold text-lime-900">{Math.floor(Math.random() * 5 + 2)}K</div>
                    </div>
                    <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Share2 className="w-4 h-4 text-orange-600" />
                        <span className="text-sm text-orange-900">Shares</span>
                      </div>
                      <div className="text-2xl font-bold text-orange-900">{Math.floor(Math.random() * 3 + 1)}K</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-neutral-50 border-t border-neutral-200 px-6 py-4 flex items-center justify-between gap-3 rounded-b-2xl">
                <div>
                  {selectedCampaignDetails.status === 'completed' && 
                   selectedCampaignDetails.payment_status === 'pending' && (
                    <button
                      onClick={() => handleMarkPaymentCompleted(selectedCampaignDetails.id)}
                      disabled={markingPayment}
                      className={`px-6 py-2.5 rounded-lg transition-colors font-medium flex items-center gap-2 ${
                        markingPayment
                          ? 'bg-neutral-400 cursor-not-allowed'
                          : 'bg-lime-600 hover:bg-lime-700 text-white'
                      }`}>
                      <CreditCard className="w-4 h-4" />
                      {markingPayment ? 'Processing...' : 'Mark Payment Completed'}
                    </button>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={closeCampaignModal}
                    className="px-6 py-2.5 bg-white border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors font-medium">
                    Close
                  </button>
                  <button
                    className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-cyan-500 text-white rounded-lg hover:from-violet-700 hover:to-cyan-600 transition-colors font-medium flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export Report
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// KPI Card Component
const KPICard = ({ title, value, change, icon: Icon, gradient }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    whileHover={{ y: -4, scale: 1.02 }}
    className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm hover:shadow-md transition-all">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-lg`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      {change !== undefined && (
        <div className={`flex items-center gap-1 text-sm font-medium ${
          change > 0 ? 'text-lime-600' : 'text-red-600'
        }`}>
          {change > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span>{Math.abs(change)}%</span>
        </div>
      )}
    </div>
    <h3 className="text-3xl font-bold text-neutral-800 mb-1">{value}</h3>
    <p className="text-sm text-neutral-500 font-medium">{title}</p>
  </motion.div>
);

// Performance Chart Component
const PerformanceChart = ({ data, roiData }) => {
  const maxSpend = Math.max(...data.map(d => d.spend));
  const maxROI = Math.max(...roiData.map(d => d.roi));

  return (
    <div className="relative h-80">
      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 bottom-12 flex flex-col justify-between text-xs text-neutral-500 pr-2">
        <span>₹{(maxSpend / 1000).toFixed(0)}K</span>
        <span>₹{(maxSpend * 0.75 / 1000).toFixed(0)}K</span>
        <span>₹{(maxSpend * 0.5 / 1000).toFixed(0)}K</span>
        <span>₹{(maxSpend * 0.25 / 1000).toFixed(0)}K</span>
        <span>₹0</span>
      </div>

      {/* Chart area */}
      <div className="ml-12 h-full relative">
        {/* Grid lines */}
        <div className="absolute inset-0 bottom-12 flex flex-col justify-between">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="border-t border-neutral-100"></div>
          ))}
        </div>

        {/* SVG for area chart */}
        <svg className="absolute inset-0 bottom-12 w-full h-full">
          <defs>
            <linearGradient id="spendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Area */}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            d={`M 0,${100 - (data[0].spend / maxSpend * 100)} 
                ${data.map((d, i) => 
                  `L ${(i / (data.length - 1)) * 100},${100 - (d.spend / maxSpend * 100)}`
                ).join(' ')}
                L 100,100 L 0,100 Z`}
            fill="url(#spendGradient)"
            vectorEffect="non-scaling-stroke"
            style={{ transform: 'scale(0.98)', transformOrigin: 'center' }}
          />

          {/* Line */}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            d={`M 0,${100 - (data[0].spend / maxSpend * 100)} 
                ${data.map((d, i) => 
                  `L ${(i / (data.length - 1)) * 100},${100 - (d.spend / maxSpend * 100)}`
                ).join(' ')}`}
            fill="none"
            stroke="#7c3aed"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            style={{ transform: 'scale(0.98)', transformOrigin: 'center' }}
          />
        </svg>

        {/* Data points */}
        <div className="absolute inset-0 bottom-12 flex items-end justify-between">
          {data.map((item, index) => {
            const heightPercentage = (item.spend / maxSpend) * 100;
            
            return (
              <div 
                key={index} 
                className="flex-1 flex flex-col items-center relative group"
                style={{ height: '100%' }}>
                {/* Tooltip */}
                <div 
                  className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 bg-neutral-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg whitespace-nowrap"
                  style={{ bottom: `${heightPercentage}%`, marginBottom: '12px' }}>
                  <div className="font-semibold mb-1">{item.name}</div>
                  <div>Spend: ₹{(item.spend / 1000).toFixed(0)}K</div>
                  <div>ROI: {roiData[index]?.roi}%</div>
                </div>

                {/* Point */}
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.5 + index * 0.1, duration: 0.3 }}
                  className="absolute w-3 h-3 bg-white border-2 border-violet-600 rounded-full group-hover:w-4 group-hover:h-4 transition-all duration-200 cursor-pointer shadow-lg"
                  style={{ bottom: `${heightPercentage}%` }}>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* X-axis labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between">
          {data.map((item, index) => (
            <div key={index} className="text-xs text-neutral-600 font-medium">
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Status Bar Component
const StatusBar = ({ label, value, total, color }) => {
  const percentage = (value / total) * 100;
  const colorClasses = {
    lime: 'from-lime-500 to-lime-600',
    cyan: 'from-cyan-500 to-cyan-600',
    orange: 'from-orange-500 to-orange-600'
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-neutral-700 font-medium">{label}</span>
        <span className="text-neutral-800 font-bold">{value}</span>
      </div>
      <div className="relative h-2.5 bg-neutral-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${colorClasses[color]} rounded-full`}
        />
      </div>
    </div>
  );
};

export default CompanyAnalytics;
