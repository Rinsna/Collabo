import React, { useState } from 'react';
import { useQuery } from 'react-query';
import api from '../../services/api';
import { DollarSign, Users, Calendar, Star, TrendingUp, Award, Heart, BarChart3, Link2 } from 'lucide-react';
import ProfileSetup from '../Profile/InfluencerProfile';
import CollaborationList from '../Collaborations/CollaborationList';
import InfluencerAnalytics from '../Analytics/InfluencerAnalytics';
import InfluencerHero from '../Influencer/InfluencerHero';

const InfluencerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const { data: profile } = useQuery('influencer-profile', () =>
    api.get('/auth/influencer-profile/').then(res => {
      console.log('InfluencerDashboard - Profile data received:', res.data);
      console.log('InfluencerDashboard - Profile image field:', res.data?.profile_image);
      return res.data;
    })
  );

  const { data: earnings } = useQuery('earnings', () =>
    api.get('/payments/earnings/').then(res => res.data)
  );

  const { data: collaborations } = useQuery('collaborations', () =>
    api.get('/collaborations/collaborations/').then(res => res.data)
  );

  // Handle tab change with scroll to top
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const tabs = [
    { id: 'overview', label: 'Home', icon: TrendingUp },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: Users },
    { id: 'collaborations', label: 'My Collaborations', icon: Heart },
    { id: 'affiliate', label: 'Affiliated Marketing', icon: Link2 },
  ];

  const stats = [
    {
      name: 'Total Earnings',
      value: `₹${earnings?.total_earnings || 0}`,
      icon: DollarSign,
      gradient: 'from-primary-600 to-primary-500',
      bgGradient: 'from-primary-50 to-primary-100',
      change: '+12%',
      changeType: 'positive'
    },
    {
      name: 'Pending Earnings',
      value: `₹${earnings?.pending_earnings || 0}`,
      icon: Calendar,
      gradient: 'from-gray-500 to-gray-600',
      bgGradient: 'from-gray-50 to-gray-100',
      change: '+5%',
      changeType: 'positive'
    },
    {
      name: 'Followers',
      value: profile?.followers_count?.toLocaleString() || 0,
      icon: Users,
      gradient: 'from-primary-500 to-primary-600',
      bgGradient: 'from-primary-50 to-primary-100',
      change: '+8%',
      changeType: 'positive'
    },
    {
      name: 'Engagement Rate',
      value: `${profile?.engagement_rate || 0}%`,
      icon: Star,
      gradient: 'from-gray-600 to-gray-700',
      bgGradient: 'from-gray-50 to-gray-100',
      change: '+2%',
      changeType: 'positive'
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Compact Header Section with Navigation */}
      <div className="relative bg-gradient-to-br from-primary-50 via-white to-accent-50 border-b border-gray-200 overflow-hidden w-full sticky top-0 z-10 shadow-sm">
        <div className="relative w-full px-4 sm:px-6 lg:px-12 xl:px-16 py-2">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Welcome Section */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-lg">
                {profile?.user?.first_name?.charAt(0)?.toUpperCase() || 'I'}
              </div>
              <div>
                <h1 className="text-xs sm:text-sm lg:text-base font-bold text-gray-900">
                  Welcome, {profile?.user?.first_name || 'Influencer'}
                </h1>
                <p className="text-xs text-gray-600 flex items-center space-x-1">
                  <span className="hidden sm:inline text-xs">Manage your collaborations</span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-semibold bg-primary-100 text-primary-700">
                    Pro
                  </span>
                </p>
              </div>
            </div>

            {/* Center: Navigation Tabs */}
            <nav className="flex-1 flex items-center justify-center overflow-x-auto scrollbar-hide">
              <div className="flex space-x-2 min-w-max">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`flex items-center space-x-1.5 px-2 sm:px-2.5 py-2.5 font-medium text-sm transition-all duration-200 border-b-2 whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'border-primary-600 text-primary-600'
                          : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="hidden md:inline">{tab.label}</span>
                      <span className="md:hidden">{tab.label.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* Right: Badge */}
            <div className="flex items-center flex-shrink-0">
              <div className="bg-white border border-gray-200 px-2 py-1 rounded-lg text-xs font-medium text-gray-700 shadow-sm">
                <Award className="w-3 h-3 inline mr-1 text-primary-600" />
                <span className="hidden sm:inline">Influencer</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Premium Hero Section - Full Width, No Padding */}
          {(() => {
            // Handle profile image - check if it's base64 or URL
            let profileImageUrl = null;
            if (profile?.profile_image) {
              // If it's already a data URL, use as-is
              if (profile.profile_image.startsWith('data:')) {
                profileImageUrl = profile.profile_image;
              }
              // If it's a full URL, use as-is
              else if (profile.profile_image.startsWith('http')) {
                profileImageUrl = profile.profile_image;
              }
              // If it's a relative path, prepend API URL
              else if (profile.profile_image.startsWith('/')) {
                profileImageUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}${profile.profile_image}`;
              }
              // Otherwise, it might be just a filename
              else {
                profileImageUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/media/profiles/${profile.profile_image}`;
              }
            }
            
            const heroData = {
              username: profile?.user?.username || 'Creative Influencer',
              tagline: `${profile?.category || 'Lifestyle'} Content Creator`,
              bio: profile?.bio || 'Passionate about creating authentic content that inspires and connects.',
              profile_image: profileImageUrl,
              category: profile?.category,
            };
            
            console.log('InfluencerDashboard - Passing to Hero:', heroData);
            console.log('InfluencerDashboard - Original profile_image:', profile?.profile_image);
            console.log('InfluencerDashboard - Constructed profile_image:', heroData.profile_image);
            
            return (
              <InfluencerHero 
                influencer={heroData}
                onViewAnalytics={() => handleTabChange('analytics')}
                onViewProfile={() => handleTabChange('profile')}
              />
            );
          })()}
          
          {/* Rest of Overview Content - With Padding */}
          <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 py-6 sm:py-8">
            <div className="space-y-6 sm:space-y-8 animate-fadeIn">
              {/* Modern SaaS Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {stats.map((stat, index) => {
                const StatIcon = stat.icon;
                return (
                  <div
                    key={stat.name}
                    className="bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition-shadow duration-300"
                  >
                    {/* Card Header */}
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className={`p-2 sm:p-3 rounded-lg bg-gradient-to-br ${stat.gradient}`}>
                        <StatIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div className={`text-xs font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full ${
                        stat.changeType === 'positive' 
                          ? 'text-primary-600 bg-primary-50' 
                          : 'text-gray-700 bg-gray-100'
                      }`}>
                        {stat.change}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="flex-1">
                      <h3 className="text-xs sm:text-sm font-medium text-gray-600 mb-1 uppercase tracking-wide">
                        {stat.name}
                      </h3>
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-600">
                        vs last month
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modern Activity and Quick Actions Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">Recent Activity</h3>
                  <button className="text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors duration-200">
                    View All
                  </button>
                </div>
                
                {collaborations?.results?.length > 0 ? (
                  <div className="space-y-4">
                    {collaborations.results.slice(0, 5).map((collaboration, index) => (
                      <div
                        key={collaboration.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 border border-gray-200"
                      >
                        <div className="flex items-center space-x-4 flex-1 min-w-0">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Heart className="w-5 h-5 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-gray-900 line-clamp-1 text-base">
                              {collaboration.campaign_title}
                            </p>
                            <p className="text-sm text-gray-600">
                              Status: <span className={`font-medium ${
                                collaboration.status === 'accepted' ? 'text-primary-600' :
                                collaboration.status === 'pending' ? 'text-gray-700' :
                                'text-gray-700'
                              }`}>
                                {collaboration.status}
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="text-lg font-bold text-primary-600">
                            ₹{collaboration.final_rate}
                          </span>
                          <p className="text-xs text-gray-600">Rate</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-900 text-lg font-semibold">No recent activity</p>
                    <p className="text-gray-600 text-sm">Start applying to campaigns to see your activity here</p>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
                <div className="space-y-4">
                  <button
                    onClick={() => handleTabChange('analytics')}
                    className="w-full bg-primary-600 text-white p-4 rounded-lg hover:bg-primary-700 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
                  >
                    <BarChart3 className="w-5 h-5 mx-auto mb-2" />
                    <span>View Analytics</span>
                  </button>
                  
                  <button
                    onClick={() => handleTabChange('profile')}
                    className="w-full bg-gray-700 text-white p-4 rounded-lg hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
                  >
                    <Users className="w-5 h-5 mx-auto mb-2" />
                    <span>Update Profile</span>
                  </button>
                  
                  <button
                    onClick={() => handleTabChange('collaborations')}
                    className="w-full bg-gray-800 text-white p-4 rounded-lg hover:bg-gray-900 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
                  >
                    <Heart className="w-5 h-5 mx-auto mb-2" />
                    <span>My Collaborations</span>
                  </button>
                </div>

                {/* Profile Completion */}
                <div className="mt-6 p-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg border border-primary-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-900">Profile Completion</span>
                    <span className="text-sm font-bold text-primary-600">85%</span>
                  </div>
                  <div className="w-full bg-white rounded-full h-2">
                    <div className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <p className="text-xs text-gray-700 mt-2">Complete your profile to get more opportunities!</p>
                </div>
              </div>
            </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'analytics' && (
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 py-6 sm:py-8">
          <InfluencerAnalytics />
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 py-6 sm:py-8">
          <ProfileSetup />
        </div>
      )}
      
      {activeTab === 'collaborations' && (
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 py-6 sm:py-8">
          <CollaborationList />
        </div>
      )}

      {activeTab === 'affiliate' && (
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 py-6 sm:py-8">
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
                    <Link2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Affiliated Marketing</h2>
                    <p className="text-sm text-gray-600">Earn commissions by promoting products</p>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-4 border border-primary-200">
                    <div className="text-sm text-gray-700 mb-1">Total Clicks</div>
                    <div className="text-3xl font-bold text-gray-900">0</div>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
                    <div className="text-sm text-gray-700 mb-1">Conversions</div>
                    <div className="text-3xl font-bold text-gray-900">0</div>
                  </div>
                  <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-4 border border-primary-200">
                    <div className="text-sm text-gray-700 mb-1">Commission Earned</div>
                    <div className="text-3xl font-bold text-gray-900">₹0</div>
                  </div>
                </div>

                {/* Affiliate Links Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Your Affiliate Links</h3>
                  
                  {/* Empty State */}
                  <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <Link2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No Affiliate Links Yet</h4>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Start earning commissions by creating affiliate links for products you love and share them with your audience.
                    </p>
                    <button className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium">
                      Create Affiliate Link
                    </button>
                  </div>
                </div>

                {/* How It Works */}
                <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">How Affiliate Marketing Works</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Create Link</h4>
                        <p className="text-sm text-gray-600">Generate unique affiliate links for products</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Share & Promote</h4>
                        <p className="text-sm text-gray-600">Share links with your audience on social media</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Earn Commission</h4>
                        <p className="text-sm text-gray-600">Get paid when people purchase through your link</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      )}
    </div>
  );
};

export default InfluencerDashboard;