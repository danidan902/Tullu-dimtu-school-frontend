import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const ContactForm = () => {
  const { user, isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('contactFormData');
    return savedData ? JSON.parse(savedData) : {
      name: '',
      email: '',
      password: ''
    };
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [hasPendingSubmission, setHasPendingSubmission] = useState(false);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    if (formData.name || formData.email || formData.password) {
      localStorage.setItem('contactFormData', JSON.stringify(formData));
    }
  }, [formData]);

  // Clear saved data on successful submission
  useEffect(() => {
    if (isSubmitted) {
      localStorage.removeItem('contactFormData');
      setHasPendingSubmission(false);
    }
  }, [isSubmitted]);

  // Initialize form with user data if signed in
  useEffect(() => {
    if (isSignedIn && user) {
      const userName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
      const userEmail = user.primaryEmailAddress?.emailAddress || '';
      
      setFormData(prev => ({
        name: userName || prev.name,
        email: userEmail || prev.email,
        password: prev.password // Keep existing password
      }));
    }
  }, [isSignedIn, user]);

  // FIXED: Auto-submit after authentication
  useEffect(() => {
    const autoSubmitAfterAuth = async () => {
      // Only auto-submit if we have pending submission and user just signed in
      if (isSignedIn && hasPendingSubmission) {
        const savedData = localStorage.getItem('contactFormData');
        
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          
          if (parsedData.name && parsedData.email && parsedData.password) {
            console.log('🔄 AUTO-SUBMITTING SAVED FORM DATA AFTER AUTHENTICATION...', parsedData);
            
            // Small delay to ensure component is ready
            setTimeout(async () => {
              await submitToBackend(parsedData);
            }, 1000);
          }
        }
      }
    };

    autoSubmitAfterAuth();
  }, [isSignedIn, hasPendingSubmission]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    console.log('📝 FORM SUBMISSION STARTED:', {
      isSignedIn,
      formData,
      hasPendingSubmission
    });

    if (!isSignedIn) {
      try {
        // Save form data and mark that we have a pending submission
        localStorage.setItem('contactFormData', JSON.stringify(formData));
        setHasPendingSubmission(true);
        
        console.log('🔐 REDIRECTING TO SIGN IN...');
        
        await openSignIn({
          redirectUrl: window.location.href, // This will redirect back after sign-in
        });
        
        // Don't submit here - wait for the redirect back and auto-submit
        return;
      } catch (err) {
        console.error('Sign-in error:', err);
        setError('Sign-in failed. Please try again.');
        setHasPendingSubmission(false);
      }
      return;
    }

    // If already signed in, submit directly
    console.log('🚀 USER IS SIGNED IN - SUBMITTING DIRECTLY');
    await submitToBackend(formData);
  };

  const submitToBackend = async (dataToSubmit = formData) => {
    setIsSubmitting(true);
    setError('');

    try {
      console.log('🔵 SUBMITTING TO BACKEND:', {
        url: 'https://tullu-dimtu-school-backend.onrender.com/api/users/submit',
        data: dataToSubmit,
        userSignedIn: isSignedIn,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        timestamp: new Date().toISOString()
      });
      
      const response = await axios.post(
        'https://tullu-dimtu-school-backend.onrender.com/api/users/submit', 
        dataToSubmit, 
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 15000,
        }
      );

      console.log('🟢 BACKEND RESPONSE SUCCESS:', {
        status: response.status,
        data: response.data,
        message: response.data.message
      });
      
      // Accept multiple success responses
      if (response.data.message === "User submitted successfully" || 
          response.status === 200 || 
          response.status === 201 ||
          response.data.success) {
        console.log('✅ SUBMISSION CONFIRMED BY BACKEND - DATA SAVED TO MONGODB');
        setIsSubmitting(false);
        setIsSubmitted(true);
        setHasPendingSubmission(false);
        
        // Navigate after successful submission
        setTimeout(() => {
          navigate('/success');
        }, 1000);
        
        // Clear form and localStorage on success
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '',
            email: user?.primaryEmailAddress?.emailAddress || '',
            password: ''
          });
          localStorage.removeItem('contactFormData');
        }, 3000);
      } else {
        console.log('🟡 UNEXPECTED RESPONSE:', response.data);
        setError(`Unexpected response: ${JSON.stringify(response.data)}`);
        setIsSubmitting(false);
        setHasPendingSubmission(false);
      }
    } catch (err) {
      console.error('🔴 SUBMISSION ERROR - FULL DETAILS:', {
        name: err.name,
        message: err.message,
        code: err.code,
        response: err.response?.data,
        status: err.response?.status,
        config: {
          url: err.config?.url,
          method: err.config?.method,
          data: err.config?.data
        }
      });
      
      setIsSubmitting(false);
      setHasPendingSubmission(false);
      
      if (err.response) {
        if (err.response.status === 404) {
          setError('Submit endpoint not found (404). Please contact support.');
        } else if (err.response.status === 400 && err.response.data.error?.includes('Email already exists')) {
          setError('This email is already registered. Please use a different email address.');
        } else if (err.response.status === 409) {
          setError('This email is already registered. Please use a different email address.');
        } else if (err.response.status === 500) {
          setError('Server error. Please try again later.');
        } else {
          setError(`Server error: ${err.response.status} - ${err.response.data?.error || err.response.data?.message || 'Unknown error'}`);
        }
      } else if (err.request) {
        setError('Cannot connect to backend server. Please check your internet connection.');
      } else {
        setError(`Request error: ${err.message}`);
      }
    }
  };

  // Test backend connection
  const testBackendConnection = async () => {
    try {
      console.log('🧪 TESTING BACKEND CONNECTION...');
      
      const response = await axios.get('https://tullu-dimtu-school-backend.onrender.com/api/users/health', {
        timeout: 10000
      });
      
      console.log('✅ BACKEND TEST SUCCESS:', response.data);
      alert(`✅ Backend is working!\nStatus: ${response.data.status}\nMessage: ${response.data.message}\nDatabase: ${response.data.database}`);
    } catch (err) {
      console.error('❌ BACKEND CONNECTION TEST FAILED:', {
        error: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      if (err.response) {
        alert(`❌ Backend error (${err.response.status}): ${JSON.stringify(err.response.data, null, 2)}`);
      } else if (err.request) {
        alert(`❌ Cannot connect to backend. Make sure:\n1. Backend is deployed\n2. URL is correct\n3. CORS is configured`);
      } else {
        alert(`❌ Error: ${err.message}`);
      }
    }
  };

  const clearForm = () => {
    setFormData({
      name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '',
      email: user?.primaryEmailAddress?.emailAddress || '',
      password: ''
    });
    localStorage.removeItem('contactFormData');
    setError('');
    setHasPendingSubmission(false);
  };

  // Debug function to check current state
  const debugState = () => {
    console.log('🔍 DEBUG STATE:', {
      isSignedIn,
      user: user?.primaryEmailAddress?.emailAddress,
      formData,
      hasPendingSubmission,
      localStorage: localStorage.getItem('contactFormData'),
      isSubmitting,
      isSubmitted
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full blur-3xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-3xl opacity-70 animate-bounce"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full blur-3xl opacity-50 animate-spin-slow"></div>
        
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-30 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${10 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>

        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-gradient-to-br from-transparent via-white to-transparent bg-[length:50px_50px] animate-grid-flow"></div>
        </div>
      </div>

      <div className="max-w-lg w-full relative z-10">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 hover:border-white/30 transition-all duration-500 hover:shadow-3xl">
          <div className="p-8">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2 animate-pulse">
                Welcome Back
              </h1>
              <p className="text-cyan-200 text-lg">Our Tulu Dimtu School</p>
              
              <div className="mt-6">
                {isSignedIn ? (
                  <div className="flex items-center justify-center space-x-2 bg-green-500/20 border border-green-500/50 rounded-full py-2 px-4">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-green-300 text-sm">Signed in as {user?.primaryEmailAddress?.emailAddress}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2 bg-yellow-500/20 border border-yellow-500/50 rounded-full py-2 px-4">
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span className="text-yellow-300 text-sm">Sign in required to submit form</span>
                  </div>
                )}
              </div>

              {hasPendingSubmission && (
                <div className="mt-4 flex items-center justify-center space-x-2 bg-blue-500/20 border border-blue-500/50 rounded-full py-2 px-4">
                  <svg className="w-5 h-5 text-blue-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-blue-300 text-sm">Form data saved - submit after sign in</span>
                </div>
              )}

              <div className="mt-6 flex gap-3 justify-center">
                <button
                  onClick={clearForm}
                  className="text-sm bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Clear Form
                </button>
                <button
                  onClick={testBackendConnection}
                  className="text-sm bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Test Backend
                </button>
                <button
                  onClick={debugState}
                  className="text-sm bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800 text-white px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Debug
                </button>
              </div>
            </div>

            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                  Success!
                </h3>
                <p className="text-cyan-200">Your information has been submitted successfully to MongoDB.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Message */}
                {error && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 animate-shake">
                    <p className="text-red-200 text-sm">{error}</p>
                    <button 
                      type="button"
                      onClick={() => setError('')}
                      className="mt-2 text-red-300 hover:text-white text-xs underline"
                    >
                      Clear Error
                    </button>
                  </div>
                )}

                <div className="relative group">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 disabled:opacity-50 group-hover:border-cyan-400/50 backdrop-blur-sm"
                    placeholder="Your Name"
                  />
                  <svg className="w-5 h-5 text-cyan-300 absolute right-5 top-1/2 transform -translate-y-1/2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>

                <div className="relative group">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-cyan-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 disabled:opacity-50 group-hover:border-purple-400/50 backdrop-blur-sm"
                    placeholder="Your Email"
                  />
                  <svg className="w-5 h-5 text-purple-300 absolute right-5 top-1/2 transform -translate-y-1/2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>

                <div className="relative group">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-cyan-200 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300 disabled:opacity-50 group-hover:border-pink-400/50 backdrop-blur-sm"
                    placeholder="Your Password"
                  />
                  <svg className="w-5 h-5 text-pink-300 absolute right-5 top-1/2 transform -translate-y-1/2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>

                {!isSignedIn ? (
                  <button
                    type="submit"
                    className="w-full py-4 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-2xl hover:shadow-3xl animate-pulse-slow"
                  >
                    Sign In & Submit
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 px-6 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-2xl hover:shadow-3xl ${
                      isSubmitting 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting to MongoDB...
                      </span>
                    ) : (
                      'Submit Information to MongoDB'
                    )}
                  </button>
                )}
              </form>
            )}
          </div>
          
          <div className="bg-black/20 py-6 px-8 border-t border-white/10">
            <div className="flex justify-center space-x-8">
              {[
                { icon: 'facebook', color: 'blue' },
                { icon: 'twitter', color: 'cyan' },
                { icon: 'pinterest', color: 'red' },
                { icon: 'linkedin', color: 'blue' }
              ].map((social, index) => (
                <a 
                  key={index}
                  href="#" 
                  className={`text-${social.color}-300 hover:text-${social.color}-100 transition-all duration-300 transform hover:scale-125 hover:rotate-12`}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    {social.icon === 'facebook' && <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>}
                    {social.icon === 'twitter' && <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.016 10.016 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>}
                    {social.icon === 'pinterest' && <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.017 12.017 0z"/>}
                    {social.icon === 'linkedin' && <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>}
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-cyan-300 text-sm opacity-80">© 2025 Tullu Dimtu Secondary School. All rights reserved.Developed by Daniel Sheleme.</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes grid-flow {
          0% { transform: translateY(0px) translateX(0px); }
          100% { transform: translateY(-50px) translateX(-50px); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-grid-flow {
          animation: grid-flow 20s linear infinite;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        .hover\\:shadow-3xl:hover {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
};

export default ContactForm;
