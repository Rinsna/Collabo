import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import toast from 'react-hot-toast';
import {
  Users, Heart, Eye, Briefcase, TrendingUp, TrendingDown,
  ThumbsUp, MessageCircle, Share2, BarChart3, Shirt, Smartphone,
  Camera, Sun, RefreshCw, AlertCircle, DollarSign, Target,
  Zap, Award, Activity, X
} from 'lucide-react';
import ConnectAccounts from '../SocialMedia/ConnectAccounts';

const InfluencerAnalytics = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState('6months');
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [animatedValues, setAnimatedValues] = useState({
    totalFollowers: 0,
    engagementRate: 0,
    totalViews: 0,
    totalEarnings: 0
  });

  // Fetch influencer profile data
  const { data: profile } = useQuery('influencer-profile', async () => {
    const response = await api.get('/auth/influencer-profile/');
    return response.data;
  });

  // Fetch collaborations data
  const { data: collaborationsData } = useQuery('influencer-collaborations', async () => {
    const response = await api.get('/collaborations/collaborations/');
    return response.data;
  });

  // Fetch real-time analytics data
  const { 
    data: analyticsData, 
    isLoading: analyticsLoading, 
    error: analyticsError,
    refetch: refetchAnalytics 
  } = useQuery(
    'influencer-analytics-realtime',
    async () => {
      const response = await api.get('/social-media/analytics/influencer/');
      return response.data;
    },
    {
      refetchInterval: 300000,
      refetchOnWindowFocus: true,
      staleTime: 240000,
      retry: 2,
      onError: (error) => {
        console.log('Analytics API error:', error?.response?.data || error.message);
      }
    }
  );

  const noAccountsConnected = analyticsError?.response?.status === 404 && 
    analyticsError?.response?.data?.error === 'No connected social media accounts found';

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await api.post('/social-media/analytics/refresh/');
      toast.success('Refreshing analytics data...');
      setTimeout(async () => {
        await refetchAnalytics();
        setIsRefreshing(false);
        toast.success('Analytics data updated!');
      }, 30000);
    } catch (error) {
      setIsRefreshing(false);
      toast.error('Failed to refresh analytics');
    }
  };

  const collaborations = collaborationsData?.results || [];
  const realTimeData = analyticsData?.data;

  const performanceMetrics = {
    totalFollowers: realTimeData?.kpi?.total_followers || profile?.followers_count || 35600,
    engagementRate: realTimeData?.kpi?.engagement_rate || parseFloat(profile?.engagement_rate) || 5.3,
    totalViews: realTimeData?.kpi?.total_reach || 1250000,
    totalCollaborations: realTimeData?.collaboration_stats?.active_collaborations || collaborations.length,
    totalEarnings: 135000,
    followersChange: realTimeData?.kpi?.follower_growth || 8.5,
    engagementChange: realTimeData?.kpi?.engagement_change || 3.2,
    viewsChange: 15.7,
    earningsChange: 22.5
  };

  // Demo data for charts (use when real data unavailable)
  const growthData = realTimeData?.growth_trends?.slice(-6).map((trend, index) => ({
    month: new Date(trend.date).toLocaleDateString('en-US', { month: 'short' }),
    followers: trend.followers || 0,
    engagement: parseFloat(trend.engagement_rate) || 0,
    earnings: 0
  })) || [
    { month: 'Jan', followers: 12500, engagement: 2.8, earnings: 18000 },
    { month: 'Feb', followers: 14200, engagement: 3.1, earnings: 26000 },
    { month: 'Mar', followers: 17800, engagement: 3.6, earnings: 42000 },
    { month: 'Apr', followers: 22400, engagement: 4.2, earnings: 68000 },
    { month: 'May', followers: 28900, engagement: 4.8, earnings: 95000 },
    { month: 'Jun', followers: 35600, engagement: 5.3, earnings: 135000 }
  ];

  const topContent = analyticsData?.top_content?.slice(0, 4).map((content, index) => ({
    id: content.id || index + 1,
    title: content.title || content.caption?.substring(0, 50) || 'Untitled Content',
    type: content.media_type || 'Post',
    icon: content.media_type === 'VIDEO' || content.media_type === 'REEL' ? Camera : 
          content.media_type === 'CAROUSEL_ALBUM' ? Smartphone : Sun,
    views: content.impressions || content.reach || 0,
    likes: content.like_count || 0,
    comments: content.comments_count || 0,
    shares: content.shares_count || 0
  })) || [
    { id: 1, title: 'Summer Fashion Lookbook 2024', type: 'Reel', icon: Shirt, views: 125000, likes: 8500, comments: 420, shares: 1200 },
    { id: 2, title: 'Product Review: Latest Tech Gadget', type: 'Post', icon: Smartphone, views: 98000, likes: 6200, comments: 380, shares: 890 },
    { id: 3, title: 'Behind the Scenes - Photoshoot', type: 'Reel', icon: Camera, views: 156000, likes: 12000, comments: 650, shares: 1500 },
    { id: 4, title: 'Daily Routine & Lifestyle Tips', type: 'Post', icon: Sun, views: 87000, likes: 5800, comments: 290, shares: 720 }
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
        totalFollowers: Math.floor(performanceMetrics.totalFollowers * progress),
        engagementRate: parseFloat((performanceMetrics.engagementRate * progress).toFixed(1)),
        totalViews: Math.floor(performanceMetrics.totalViews * progress),
        totalEarnings: Math.floor(performanceMetrics.totalEarnings * progress)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedValues({
          totalFollowers: performanceMetrics.totalFollowers,
          engagementRate: performanceMetrics.engagementRate,
          totalViews: performanceMetrics.totalViews,
          totalEarnings: performanceMetrics.totalEarnings
        });
      }
    }, interval);

    return () => clearInterval(timer);
  }, [performanceMetrics.totalFollowers, performanceMetrics.engagementRate, performanceMetrics.totalViews, performanceMetrics.totalEarnings]);

  if (analyticsLoading && !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-violet-50 via-cyan-50 to-lime-50">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-violet-600 animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

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
            <p className="text-neutral-500">
              {realTimeData ? 'Live data from connected accounts' : 'Track your performance and growth'}
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-cyan-500 text-white rounded-xl hover:from-violet-700 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed">
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="font-medium">{isRefreshing ? 'Refreshing...' : 'Refresh Data'}</span>
          </motion.button>
        </motion.div>

        {/* Alert if no social accounts connected */}
        {noAccountsConnected && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-orange-50 border-2 border-orange-300 rounded-xl p-5 flex items-start gap-4 shadow-sm">
            <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-orange-900 mb-1">Connect Your Social Media Accounts</h3>
              <p className="text-sm text-orange-800 mb-4">
                You haven't connected any social media accounts yet. Connect Instagram or YouTube to unlock real-time analytics, follower tracking, and engagement insights.
              </p>
              <button
                onClick={() => setShowConnectModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <Share2 className="w-4 h-4" />
                Connect Account Now
              </button>
            </div>
          </motion.div>
        )}

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
            title="Total Followers"
            value={animatedValues.totalFollowers.toLocaleString()}
            change={performanceMetrics.followersChange}
            icon={Users}
            gradient="from-violet-600 to-cyan-500"
          />
          <KPICard
            title="Engagement Rate"
            value={`${animatedValues.engagementRate.toFixed(1)}%`}
            change={performanceMetrics.engagementChange}
            icon={Heart}
            gradient="from-cyan-500 to-lime-500"
          />
          <KPICard
            title="Total Views"
            value={`${(animatedValues.totalViews / 1000000).toFixed(1)}M`}
            change={performanceMetrics.viewsChange}
            icon={Eye}
            gradient="from-lime-500 to-violet-600"
          />
          <KPICard
            title="Total Earnings"
            value={`₹${(animatedValues.totalEarnings / 1000).toFixed(0)}K`}
            change={performanceMetrics.earningsChange}
            icon={DollarSign}
            gradient="from-orange-500 to-violet-600"
          />
        </motion.div>

        {/* Main Growth Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
          className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-neutral-800 mb-1">Follower Growth</h2>
              <p className="text-sm text-neutral-500">Track your audience growth over time</p>
            </div>
          </div>

          <GrowthChart data={growthData} />
        </motion.div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Engagement Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
            className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-neutral-800 mb-1">Engagement Breakdown</h3>
                <p className="text-sm text-neutral-500">Average interactions per post</p>
              </div>
              <Activity className="w-6 h-6 text-violet-600" />
            </div>
            
            <div className="space-y-4">
              <EngagementBar
                label="Likes"
                value={7600}
                max={10000}
                color="cyan"
                icon={ThumbsUp}
              />
              <EngagementBar
                label="Comments"
                value={435}
                max={1000}
                color="lime"
                icon={MessageCircle}
              />
              <EngagementBar
                label="Shares"
                value={1100}
                max={2000}
                color="violet"
                icon={Share2}
              />
              <EngagementBar
                label="Saves"
                value={2800}
                max={5000}
                color="orange"
                icon={Award}
              />
            </div>
          </motion.div>

          {/* Performance Score */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
            className="bg-gradient-to-br from-violet-600 to-cyan-500 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold mb-1">Performance Score</h3>
                <p className="text-violet-100 text-sm">Overall account health</p>
              </div>
              <Zap className="w-6 h-6 text-violet-200" />
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="text-5xl font-bold mb-2">92/100</div>
                <div className="flex items-center gap-2 text-violet-100">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">Excellent performance</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-violet-400/30">
                <div>
                  <p className="text-violet-200 text-sm mb-1">Content Quality</p>
                  <p className="text-2xl font-bold">95%</p>
                </div>
                <div>
                  <p className="text-violet-200 text-sm mb-1">Consistency</p>
                  <p className="text-2xl font-bold">88%</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Top Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
          className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-neutral-800 mb-1">Top Performing Content</h3>
              <p className="text-sm text-neutral-500">Your best posts this month</p>
            </div>
            <Target className="w-5 h-5 text-violet-600" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topContent.map((content, index) => {
              const IconComponent = content.icon;
              return (
                <motion.div
                  key={content.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.3, ease: "easeOut" }}
                  className="flex items-center gap-4 p-4 bg-gradient-to-br from-neutral-50 to-white rounded-xl border border-neutral-100 hover:border-violet-200 hover:shadow-md transition-all cursor-pointer group">
                  <div className="relative flex-shrink-0">
                    <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-violet-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-neutral-800 truncate mb-1 group-hover:text-violet-600 transition-colors">
                      {content.title}
                    </h4>
                    <p className="text-xs text-neutral-500 mb-2">{content.type}</p>
                    <div className="flex items-center gap-3 text-xs text-neutral-600">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {(content.views / 1000).toFixed(0)}K
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" />
                        {(content.likes / 1000).toFixed(1)}K
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {content.comments}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Monthly Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5, ease: "easeOut" }}
          className="bg-gradient-to-br from-violet-600 via-cyan-500 to-lime-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold mb-1">Monthly Highlights</h3>
              <p className="text-violet-100 text-sm">Your achievements this month</p>
            </div>
            <Award className="w-6 h-6 text-violet-200" />
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-white/80 text-xs mb-1">New Followers</p>
              <p className="text-2xl font-bold">+{((profile?.followers_count || 35600) - 28900).toLocaleString()}</p>
              <p className="text-xs text-white/70 mt-1">+23.2%</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-white/80 text-xs mb-1">Avg. Engagement</p>
              <p className="text-2xl font-bold">{parseFloat(profile?.engagement_rate || 5.3).toFixed(1)}%</p>
              <p className="text-xs text-white/70 mt-1">+10.4%</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-white/80 text-xs mb-1">Total Reach</p>
              <p className="text-2xl font-bold">1.2M</p>
              <p className="text-xs text-white/70 mt-1">+15.7%</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-white/80 text-xs mb-1">Active Collabs</p>
              <p className="text-2xl font-bold">{collaborations.length}</p>
              <p className="text-xs text-white/70 mt-1">+25%</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Connect Accounts Modal */}
      <AnimatePresence>
        {showConnectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowConnectModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-neutral-200 bg-gradient-to-r from-violet-50 to-cyan-50">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-800">Connect Social Accounts</h2>
                  <p className="text-sm text-neutral-600 mt-1">Link your social media to track analytics</p>
                </div>
                <button
                  onClick={() => setShowConnectModal(false)}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-neutral-600" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-88px)]">
                <ConnectAccounts />
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

// Growth Chart Component
const GrowthChart = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.followers));
  const minValue = Math.min(...data.map(d => d.followers));

  return (
    <div className="relative h-80">
      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 bottom-12 flex flex-col justify-between text-xs text-neutral-500 pr-2">
        <span>{(maxValue / 1000).toFixed(0)}K</span>
        <span>{((maxValue * 0.75) / 1000).toFixed(0)}K</span>
        <span>{((maxValue * 0.5) / 1000).toFixed(0)}K</span>
        <span>{((maxValue * 0.25) / 1000).toFixed(0)}K</span>
        <span>0</span>
      </div>

      {/* Chart area */}
      <div className="ml-12 h-full relative">
        {/* Grid lines */}
        <div className="absolute inset-0 bottom-12 flex flex-col justify-between">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="border-t border-neutral-100"></div>
          ))}
        </div>

        {/* SVG Chart */}
        <svg className="absolute inset-0 bottom-12 w-full h-full">
          <defs>
            <linearGradient id="followerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Calculate points */}
          {(() => {
            const points = data.map((item, index) => {
              const x = (index / (data.length - 1)) * 100;
              const y = 100 - ((item.followers - minValue) / (maxValue - minValue)) * 100;
              return { x, y, ...item };
            });

            const linePoints = points.map(p => `${p.x},${p.y}`).join(' ');
            const areaPoints = `0,100 ${linePoints} 100,100`;

            return (
              <>
                {/* Area */}
                <motion.polygon
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  points={areaPoints}
                  fill="url(#followerGradient)"
                />

                {/* Line */}
                <motion.polyline
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  points={linePoints}
                  fill="none"
                  stroke="#7c3aed"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Points */}
                {points.map((point, index) => (
                  <g key={index} className="group">
                    <circle
                      cx={`${point.x}%`}
                      cy={`${point.y}%`}
                      r="20"
                      fill="transparent"
                      className="cursor-pointer"
                    />
                    <motion.circle
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.5 + index * 0.1, duration: 0.3 }}
                      cx={`${point.x}%`}
                      cy={`${point.y}%`}
                      r="4"
                      fill="white"
                      stroke="#7c3aed"
                      strokeWidth="3"
                      className="transition-all duration-200 group-hover:r-6"
                    />
                    <foreignObject
                      x={`${point.x - 15}%`}
                      y={`${point.y - 25}%`}
                      width="120"
                      height="80"
                      className="pointer-events-none">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="bg-neutral-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg whitespace-nowrap">
                          <div className="font-semibold">{point.month}</div>
                          <div className="text-neutral-300">{(point.followers / 1000).toFixed(1)}K followers</div>
                          <div className="text-neutral-300">{point.engagement}% engagement</div>
                        </div>
                      </div>
                    </foreignObject>
                  </g>
                ))}
              </>
            );
          })()}
        </svg>

        {/* X-axis labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between">
          {data.map((item, index) => (
            <div key={index} className="text-xs text-neutral-600 font-medium">
              {item.month}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Engagement Bar Component
const EngagementBar = ({ label, value, max, color, icon: Icon }) => {
  const percentage = (value / max) * 100;
  const colorClasses = {
    cyan: 'from-cyan-500 to-cyan-600',
    lime: 'from-lime-500 to-lime-600',
    violet: 'from-violet-500 to-violet-600',
    orange: 'from-orange-500 to-orange-600'
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-neutral-600" />
          <span className="text-neutral-700 font-medium">{label}</span>
        </div>
        <span className="text-neutral-800 font-bold">{value.toLocaleString()}</span>
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

export default InfluencerAnalytics;
