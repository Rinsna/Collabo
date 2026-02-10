import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Sparkles,
  Users,
  Building2,
  CheckCircle
} from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    password_confirm: '',
    user_type: 'influencer'
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.password_confirm) {
      toast.error('Password Mismatch', 'Passwords do not match. Please try again.');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Weak Password', 'Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);

    const result = await register(formData);

    if (result.success) {
      toast.success('Account Created!', 'Welcome to Collabo. Your account has been created successfully.');
      navigate('/');
    } else {
      toast.error('Registration Failed', result.error || 'Unable to create account. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen saas-background connection-lines flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-accent-500 to-primary-600 rounded-full opacity-15 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-primary-600 to-accent-500 rounded-full opacity-15 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-primary-700 to-accent-600 rounded-full opacity-10 blur-3xl"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-accent-500 to-primary-600 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-dark-100 to-dark-200 bg-clip-text text-transparent">
            Create your account
          </h2>
          <p className="mt-2 text-dark-200">
            Join thousands of brands and influencers
          </p>
        </div>

        {/* Register Form */}
        <div className="glass-card rounded-2xl shadow-xl border border-dark-100/10 p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* User Type Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-dark-100">
                I am a
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, user_type: 'influencer' })}
                  className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${formData.user_type === 'influencer'
                      ? 'border-accent-500 bg-accent-500/10'
                      : 'border-dark-100/20 bg-dark-700/30 hover:bg-dark-700/50'
                    }`}
                >
                  {formData.user_type === 'influencer' && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <Users className={`w-8 h-8 mb-2 ${formData.user_type === 'influencer' ? 'text-accent-500' : 'text-dark-300'
                    }`} />
                  <span className={`text-sm font-medium ${formData.user_type === 'influencer' ? 'text-dark-100' : 'text-dark-200'
                    }`}>
                    Influencer
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, user_type: 'company' })}
                  className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${formData.user_type === 'company'
                      ? 'border-primary-600 bg-primary-600/10'
                      : 'border-dark-100/20 bg-dark-700/30 hover:bg-dark-700/50'
                    }`}
                >
                  {formData.user_type === 'company' && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <Building2 className={`w-8 h-8 mb-2 ${formData.user_type === 'company' ? 'text-primary-600' : 'text-dark-300'
                    }`} />
                  <span className={`text-sm font-medium ${formData.user_type === 'company' ? 'text-dark-100' : 'text-dark-200'
                    }`}>
                    Company
                  </span>
                </button>
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-dark-100">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-dark-300" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-dark-100/20 rounded-xl text-dark-100 placeholder-dark-300 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-200 bg-dark-700/50 hover:bg-dark-700/70 focus:bg-dark-700"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Username Field */}
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-dark-100">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-dark-300" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-dark-100/20 rounded-xl text-dark-100 placeholder-dark-300 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-200 bg-dark-700/50 hover:bg-dark-700/70 focus:bg-dark-700"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-dark-100">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-dark-300" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="block w-full pl-10 pr-12 py-3 border border-dark-100/20 rounded-xl text-dark-100 placeholder-dark-300 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-200 bg-dark-700/50 hover:bg-dark-700/70 focus:bg-dark-700"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-dark-300 hover:text-dark-200" />
                  ) : (
                    <Eye className="h-5 w-5 text-dark-300 hover:text-dark-200" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label htmlFor="password_confirm" className="text-sm font-medium text-dark-100">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-dark-300" />
                </div>
                <input
                  id="password_confirm"
                  name="password_confirm"
                  type={showPassword2 ? 'text' : 'password'}
                  required
                  className="block w-full pl-10 pr-12 py-3 border border-dark-100/20 rounded-xl text-dark-100 placeholder-dark-300 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-200 bg-dark-700/50 hover:bg-dark-700/70 focus:bg-dark-700"
                  placeholder="Confirm your password"
                  value={formData.password_confirm}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword2(!showPassword2)}
                >
                  {showPassword2 ? (
                    <EyeOff className="h-5 w-5 text-dark-300 hover:text-dark-200" />
                  ) : (
                    <Eye className="h-5 w-5 text-dark-300 hover:text-dark-200" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-primary-600 to-accent-500 hover:from-accent-500 hover:to-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating account...
                </div>
              ) : (
                <div className="flex items-center">
                  Create account
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dark-100/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-dark-700 text-dark-200">Already have an account?</span>
              </div>
            </div>
          </div>

          {/* Login Link */}
          <div className="mt-6">
            <Link
              to="/login"
              className="w-full flex justify-center items-center py-3 px-4 border border-dark-100/20 text-sm font-medium rounded-xl text-dark-100 bg-dark-700/30 hover:bg-dark-700/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] group"
            >
              Sign in instead
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-dark-300">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-accent-500 hover:text-accent-400">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-accent-500 hover:text-accent-400">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
