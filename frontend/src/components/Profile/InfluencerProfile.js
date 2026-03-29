import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import api from '../../services/api';
import toast from 'react-hot-toast';
import {
  Edit3, Save, X, Users, TrendingUp, DollarSign, Instagram, Youtube,
  MessageCircle, Camera, Sparkles, Award, MapPin, Upload, Link as LinkIcon,
  Globe, Target, Briefcase, Star, Heart, Eye, Play
} from 'lucide-react';

const InfluencerProfile = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  
  // File upload states
  const [latestReviewCoverFile, setLatestReviewCoverFile] = useState(null);
  const [latestReviewCoverPreview, setLatestReviewCoverPreview] = useState(null);
  const [mostViewedCoverFile, setMostViewedCoverFile] = useState(null);
  const [mostViewedCoverPreview, setMostViewedCoverPreview] = useState(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  
  // Profile picture upload state
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);

  // Scroll to top when component mounts
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: profile, isLoading } = useQuery(
    'influencer-profile',
    () => api.get('/auth/influencer-profile/').then(res => res.data)
  );

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Handle cover image file upload
  const handleCoverImageUpload = async (file, type) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploadingCover(true);
      const response = await api.post('/auth/upload-image/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.url;
    } catch (error) {
      toast.error('Failed to upload cover image');
      return null;
    } finally {
      setUploadingCover(false);
    }
  };

  // Handle file selection for latest review cover
  const handleLatestReviewCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLatestReviewCoverFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLatestReviewCoverPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle file selection for most viewed cover
  const handleMostViewedCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMostViewedCoverFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMostViewedCoverPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle profile picture selection
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      setProfilePicFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateProfileMutation = useMutation(
    async (data) => {
      // Upload profile picture if file is selected
      if (profilePicFile) {
        const formData = new FormData();
        formData.append('image', profilePicFile);
        
        try {
          const response = await api.post('/auth/upload-image/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          data.profile_image = response.data.url;
        } catch (error) {
          console.error('Failed to upload profile picture:', error);
        }
      }
      
      // Upload cover images if files are selected
      if (latestReviewCoverFile) {
        const coverUrl = await handleCoverImageUpload(latestReviewCoverFile, 'latest_review');
        if (coverUrl) {
          data.latest_product_review_cover = coverUrl;
        }
      }
      
      if (mostViewedCoverFile) {
        const coverUrl = await handleCoverImageUpload(mostViewedCoverFile, 'most_viewed');
        if (coverUrl) {
          data.most_viewed_content_cover = coverUrl;
        }
      }

      return api.put('/auth/influencer-profile/', data);
    },
    {
      onMutate: async (newData) => {
        // Cancel outgoing refetches
        await queryClient.cancelQueries('influencer-profile');
        
        // Snapshot previous value
        const previousProfile = queryClient.getQueryData('influencer-profile');
        
        // Optimistically update to new value
        queryClient.setQueryData('influencer-profile', old => ({
          ...old,
          ...newData
        }));
        
        return { previousProfile };
      },
      onSuccess: (response) => {
        queryClient.setQueryData('influencer-profile', response.data);
        toast.dismiss(); // Dismiss "Saving..." message
        toast.success('Profile updated!');
        // Clear file states
        setProfilePicFile(null);
        setProfilePicPreview(null);
        setLatestReviewCoverFile(null);
        setLatestReviewCoverPreview(null);
        setMostViewedCoverFile(null);
        setMostViewedCoverPreview(null);
      },
      onError: (error, newData, context) => {
        // Rollback on error
        if (context?.previousProfile) {
          queryClient.setQueryData('influencer-profile', context.previousProfile);
        }
        toast.dismiss(); // Dismiss "Saving..." message
        toast.error('Failed to update profile');
        setIsEditing(true); // Re-enable editing on error
      }
    }
  );

  const onSubmit = (data) => {
    console.log('InfluencerProfile - Form submitted with data:', data);
    
    // Immediately exit edit mode for instant feedback
    setIsEditing(false);
    
    // Show optimistic success message
    toast.success('Saving profile...');
    
    // Submit in background
    updateProfileMutation.mutate(data);
  };

  const handleEdit = () => {
    setIsEditing(true);
    reset(profile);
    // Clear file uploads
    setLatestReviewCoverFile(null);
    setLatestReviewCoverPreview(null);
    setMostViewedCoverFile(null);
    setMostViewedCoverPreview(null);
    setProfilePicFile(null);
    setProfilePicPreview(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  // Helper function to format numbers
  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {!isEditing ? (
        /* MODERN PORTFOLIO VIEW */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-12 mb-8"
          >
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
              {/* Profile Image */}
              <div className="relative flex-shrink-0">
                <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden ring-4 ring-primary-100 shadow-xl">
                  {profile?.profile_image ? (
                    <img
                      src={profile.profile_image}
                      alt={profile?.user?.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                      <span className="text-5xl sm:text-6xl font-black text-white">
                        {profile?.user?.username?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                </div>
                {/* Status Badge */}
                <div className="absolute bottom-2 right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white shadow-lg"></div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center lg:text-left">
                <div className="mb-4">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                    {profile?.user?.username || 'Influencer'}
                  </h1>
                  <p className="text-lg sm:text-xl text-gray-600 font-medium">
                    @{profile?.user?.username || 'username'}
                  </p>
                </div>

                {/* Bio */}
                <p className="text-gray-700 text-base sm:text-lg leading-relaxed max-w-3xl mb-6">
                  {profile?.bio || 'Professional content creator and influencer. Passionate about creating engaging content and building meaningful connections with my audience.'}
                </p>

                {/* Quick Info */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-6">
                  {profile?.category && (
                    <span className="inline-flex items-center px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">
                      <Target className="w-4 h-4 mr-2" />
                      {profile.category.charAt(0).toUpperCase() + profile.category.slice(1)}
                    </span>
                  )}
                  {profile?.location && (
                    <span className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                      <MapPin className="w-4 h-4 mr-2" />
                      {profile.location}
                    </span>
                  )}
                </div>

                {/* Social Media Links */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                  {profile?.instagram_handle && (
                    <a
                      href={`https://instagram.com/${profile.instagram_handle.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <Instagram className="w-4 h-4 mr-2" />
                      Instagram
                    </a>
                  )}
                  {profile?.youtube_channel && (
                    <a
                      href={profile.youtube_channel}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <Youtube className="w-4 h-4 mr-2" />
                      YouTube
                    </a>
                  )}
                </div>
              </div>

              {/* Edit Button */}
              <button
                onClick={handleEdit}
                className="flex-shrink-0 inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-lg"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
            </div>
          </motion.div>

          {/* Performance Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Total Followers</p>
              <p className="text-3xl font-bold text-gray-900">{formatNumber(profile?.followers_count || 0)}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-accent-50 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-accent-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Engagement Rate</p>
              <p className="text-3xl font-bold text-gray-900">{profile?.engagement_rate || 0}%</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Campaigns</p>
              <p className="text-3xl font-bold text-gray-900">12</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Profile Score</p>
              <p className="text-3xl font-bold text-gray-900">85</p>
            </div>
          </motion.div>

          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-10 mb-8"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">About Me</h2>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  {profile?.bio || 'No bio provided yet. Click "Edit Profile" to add your story and let brands know what makes you unique!'}
                </p>
                
                {/* Additional Info */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {profile?.category && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Target className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Niche</p>
                        <p className="font-semibold text-gray-900">{profile.category.charAt(0).toUpperCase() + profile.category.slice(1)}</p>
                      </div>
                    </div>
                  )}
                  {profile?.location && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-accent-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-accent-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="font-semibold text-gray-900">{profile.location}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Rates Card */}
              <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-6 border border-primary-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-primary-600" />
                  Rates & Pricing
                </h3>
                <div className="space-y-3">
                  {profile?.rate_per_post > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Per Post</span>
                      <span className="font-bold text-primary-600">₹{profile.rate_per_post.toLocaleString()}</span>
                    </div>
                  )}
                  {profile?.rate_per_story > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Per Story</span>
                      <span className="font-bold text-primary-600">₹{profile.rate_per_story.toLocaleString()}</span>
                    </div>
                  )}
                  {profile?.rate_per_reel > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Per Reel</span>
                      <span className="font-bold text-primary-600">₹{profile.rate_per_reel.toLocaleString()}</span>
                    </div>
                  )}
                  {(!profile?.rate_per_post && !profile?.rate_per_story && !profile?.rate_per_reel) && (
                    <p className="text-gray-600 text-sm">No rates set yet</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Featured Content */}
          {(profile?.latest_product_review_link || profile?.most_viewed_content_link) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-10 mb-8"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Featured Content</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {profile?.latest_product_review_link && (
                  <a
                    href={profile.latest_product_review_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative bg-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    <div className="aspect-video relative">
                      {profile?.latest_product_review_cover ? (
                        <img
                          src={profile.latest_product_review_cover}
                          alt="Latest Review"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                          <Play className="w-16 h-16 text-white" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Play className="w-12 h-12 text-white" />
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 mb-2">Latest Product Review</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {formatNumber(profile?.latest_product_review_views || 0)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {formatNumber(profile?.latest_product_review_likes || 0)}
                        </span>
                      </div>
                    </div>
                  </a>
                )}

                {profile?.most_viewed_content_link && (
                  <a
                    href={profile.most_viewed_content_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative bg-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    <div className="aspect-video relative">
                      {profile?.most_viewed_content_cover ? (
                        <img
                          src={profile.most_viewed_content_cover}
                          alt="Most Viewed"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-accent-500 to-primary-500 flex items-center justify-center">
                          <Play className="w-16 h-16 text-white" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Play className="w-12 h-12 text-white" />
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 mb-2">Most Viewed Content</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {formatNumber(profile?.most_viewed_content_views || 0)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {formatNumber(profile?.most_viewed_content_likes || 0)}
                        </span>
                      </div>
                    </div>
                  </a>
                )}
              </div>
            </motion.div>
          )}
        </div>
      ) : (
          /* MODERN EDIT FORM */
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-12">
              {/* Form Header */}
              <div className="mb-8 pb-6 border-b border-gray-200">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Edit Profile</h1>
                <p className="text-gray-600">Update your portfolio information and showcase your best work</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Profile Picture Upload */}
              <div className="pb-8 border-b border-gray-200">
                <label className="block text-lg font-bold text-gray-900 mb-4">
                  <Camera className="w-5 h-5 inline mr-2" />
                  Profile Picture
                </label>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  {/* Current/Preview Image */}
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-gray-200 shadow-lg">
                      {profilePicPreview || profile?.profile_image ? (
                        <img
                          src={profilePicPreview || profile?.profile_image}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                          <span className="text-4xl font-black text-white">
                            {profile?.user?.username?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Remove button */}
                    {(profilePicPreview || profile?.profile_image) && (
                      <button
                        type="button"
                        onClick={() => {
                          setProfilePicFile(null);
                          setProfilePicPreview(null);
                        }}
                        className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Upload Button */}
                  <div className="flex-1">
                    <input
                      id="profile-pic-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePicChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById('profile-pic-upload').click()}
                      className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors shadow-md font-medium"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      <span>Upload New Photo</span>
                    </button>
                    <p className="text-sm text-gray-600 mt-3">
                      JPG, PNG or GIF. Max size 5MB. Recommended: 400x400px
                    </p>
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              <div className="pb-8 border-b border-gray-200">
                <label className="block text-lg font-bold text-gray-900 mb-4">
                  <MessageCircle className="w-5 h-5 inline mr-2" />
                  Bio
                </label>
                <textarea
                  {...register('bio', { required: 'Bio is required' })}
                  rows={5}
                  className="w-full px-5 py-4 border border-gray-300 rounded-2xl resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="Tell your audience about yourself, your content style, and what makes you unique..."
                />
                {errors.bio && <p className="text-red-500 text-sm mt-2">{errors.bio.message}</p>}
              </div>

              {/* Basic Info Section */}
              <div className="pb-8 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Category</label>
                    <select 
                      {...register('category')} 
                      className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select Category</option>
                      <option value="fashion">Fashion</option>
                      <option value="beauty">Beauty</option>
                      <option value="fitness">Fitness</option>
                      <option value="food">Food</option>
                      <option value="travel">Travel</option>
                      <option value="tech">Technology</option>
                      <option value="lifestyle">Lifestyle</option>
                      <option value="gaming">Gaming</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Location
                    </label>
                    <input
                      type="text"
                      {...register('location')}
                      className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="City, Country"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      <Users className="w-4 h-4 inline mr-1" />
                      Total Followers
                    </label>
                    <input
                      type="number"
                      {...register('followers_count')}
                      className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      <TrendingUp className="w-4 h-4 inline mr-1" />
                      Engagement Rate (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register('engagement_rate')}
                      className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              {/* Rates & Pricing Section */}
              <div className="pb-8 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-primary-600" />
                  Rates & Pricing (₹)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Rate per Post</label>
                    <input 
                      type="number" 
                      {...register('rate_per_post')} 
                      className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" 
                      placeholder="5000" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Rate per Story</label>
                    <input 
                      type="number" 
                      {...register('rate_per_story')} 
                      className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" 
                      placeholder="2000" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Rate per Reel</label>
                    <input 
                      type="number" 
                      {...register('rate_per_reel')} 
                      className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" 
                      placeholder="8000" 
                    />
                  </div>
                </div>
              </div>

              {/* Social Media Section */}
              <div className="pb-8 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Social Media Handles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      <Instagram className="w-4 h-4 inline mr-1" />
                      Instagram Handle
                    </label>
                    <input 
                      type="text" 
                      {...register('instagram_handle')} 
                      className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" 
                      placeholder="@username" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      <Youtube className="w-4 h-4 inline mr-1" />
                      YouTube Channel
                    </label>
                    <input 
                      type="text" 
                      {...register('youtube_channel')} 
                      className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" 
                      placeholder="Channel URL" 
                    />
                  </div>
                </div>
              </div>

              {/* Featured Content Section */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Featured Content</h3>
                <div className="space-y-6">
                  {/* Latest Product Review */}
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                    <h4 className="text-base font-bold text-gray-900 mb-4">Latest Product Review</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Video Link
                        </label>
                        <input 
                          type="url" 
                          {...register('latest_product_review_link')} 
                          className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" 
                          placeholder="https://youtube.com/..." 
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Cover Image
                        </label>
                        
                        {/* Tab buttons for URL or Upload */}
                        <div className="flex space-x-2 mb-3">
                          <button
                            type="button"
                            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-xl bg-primary-100 text-primary-700 border border-primary-200"
                          >
                            <LinkIcon className="w-4 h-4" />
                            <span>URL</span>
                          </button>
                          <button
                            type="button"
                            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-xl bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 transition-colors"
                            onClick={() => document.getElementById('latest-review-cover-upload').click()}
                          >
                            <Upload className="w-4 h-4" />
                            <span>Upload File</span>
                          </button>
                        </div>

                        {/* URL Input */}
                        <input 
                          type="url" 
                          {...register('latest_product_review_cover')} 
                          className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all mb-2" 
                          placeholder="https://... or leave empty for auto" 
                        />

                        {/* File Upload (Hidden) */}
                        <input
                          id="latest-review-cover-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleLatestReviewCoverChange}
                          className="hidden"
                        />

                        {/* Preview */}
                        {latestReviewCoverPreview && (
                          <div className="mt-3 relative">
                            <img 
                              src={latestReviewCoverPreview} 
                              alt="Cover preview" 
                              className="w-full h-40 object-cover rounded-xl"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setLatestReviewCoverFile(null);
                                setLatestReviewCoverPreview(null);
                              }}
                              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}

                        <p className="text-sm text-gray-600 mt-2">
                          Enter URL, upload an image, or leave empty to auto-fetch from YouTube
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          View Count
                        </label>
                        <input 
                          type="number" 
                          {...register('latest_product_review_views', { valueAsNumber: true })} 
                          className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" 
                          placeholder="125000"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Like Count
                        </label>
                        <input 
                          type="number" 
                          {...register('latest_product_review_likes', { valueAsNumber: true })} 
                          className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" 
                          placeholder="8500"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Most Viewed Content */}
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                    <h4 className="text-base font-bold text-gray-900 mb-4">Most Viewed Content</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Video Link
                        </label>
                        <input 
                          type="url" 
                          {...register('most_viewed_content_link')} 
                          className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" 
                          placeholder="https://youtube.com/..." 
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Cover Image
                        </label>
                        
                        {/* Tab buttons for URL or Upload */}
                        <div className="flex space-x-2 mb-3">
                          <button
                            type="button"
                            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-xl bg-primary-100 text-primary-700 border border-primary-200"
                          >
                            <LinkIcon className="w-4 h-4" />
                            <span>URL</span>
                          </button>
                          <button
                            type="button"
                            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-xl bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 transition-colors"
                            onClick={() => document.getElementById('most-viewed-cover-upload').click()}
                          >
                            <Upload className="w-4 h-4" />
                            <span>Upload File</span>
                          </button>
                        </div>

                        {/* URL Input */}
                        <input 
                          type="url" 
                          {...register('most_viewed_content_cover')} 
                          className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all mb-2" 
                          placeholder="https://... or leave empty for auto" 
                        />

                        {/* File Upload (Hidden) */}
                        <input
                          id="most-viewed-cover-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleMostViewedCoverChange}
                          className="hidden"
                        />

                        {/* Preview */}
                        {mostViewedCoverPreview && (
                          <div className="mt-3 relative">
                            <img 
                              src={mostViewedCoverPreview} 
                              alt="Cover preview" 
                              className="w-full h-40 object-cover rounded-xl"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setMostViewedCoverFile(null);
                                setMostViewedCoverPreview(null);
                              }}
                              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}

                        <p className="text-sm text-gray-600 mt-2">
                          Enter URL, upload an image, or leave empty to auto-fetch from YouTube
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          View Count
                        </label>
                        <input 
                          type="number" 
                          {...register('most_viewed_content_views', { valueAsNumber: true })} 
                          className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" 
                          placeholder="156000"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Like Count
                        </label>
                        <input 
                          type="number" 
                          {...register('most_viewed_content_likes', { valueAsNumber: true })} 
                          className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" 
                          placeholder="12000"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6">
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)} 
                  className="inline-flex items-center justify-center px-8 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={updateProfileMutation.isLoading} 
                  className="inline-flex items-center justify-center px-8 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updateProfileMutation.isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfluencerProfile;
