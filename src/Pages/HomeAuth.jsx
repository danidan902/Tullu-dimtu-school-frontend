import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import leftBgImage from '../assets/local.jpg';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

const ContactForm = () => {
  const { user, isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isSignedIn) {
      try {
        await openSignIn({
          redirectUrl: window.location.href,
        });
      } catch (err) {
        setMessage({ text: 'Sign-in failed. Please try again.', type: 'error' });
      }
      return;
    }

    await submitToBackend();
  };

  const submitToBackend = async () => {
    setIsSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      const userData = {
        email: user?.primaryEmailAddress?.emailAddress,
        clerkUserId: user?.id,
        firstName: user?.firstName,
        lastName: user?.lastName
      };

      console.log('🔵 SUBMITTING TO BACKEND:', {
        url: 'https://tullu-dimtu-school-backend-1.onrender.com/api/users/submit',
        data: userData,
        timestamp: new Date().toISOString()
      });
      
      const response = await axios.post('https://tullu-dimtu-school-backend-1.onrender.com/api/users/submit', userData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });

      console.log('🟢 BACKEND RESPONSE SUCCESS:', {
        status: response.status,
        data: response.data,
        message: response.data.message
      });
      
      if (response.data.message === "User submitted successfully") {
        console.log('✅ SUBMISSION CONFIRMED BY BACKEND - DATA SAVED TO MONGODB');
        setIsSubmitting(false);
        setIsSubmitted(true);
        setMessage({ text: 'Data submitted successfully!', type: 'success' });
        
        setTimeout(() => {
          navigate('/some');
        }, 1500);
        
        setTimeout(() => {
          setIsSubmitted(false);
        }, 3000);
      } else {
        console.log('🟡 UNEXPECTED RESPONSE:', response.data);
        setMessage({ text: `Unexpected response: ${JSON.stringify(response.data)}`, type: 'error' });
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('🔴 SUBMISSION ERROR:', {
        name: err.name,
        message: err.message,
        code: err.code,
        response: err.response?.data,
        status: err.response?.status
      });
      
      setIsSubmitting(false);
      
      if (err.response) {
        if (err.response.status === 400 && err.response.data.error?.includes('Email already exists')) {
          setMessage({ text: 'This email is already registered. Please use a different email address.', type: 'error' });
        } else {
          setMessage({ text: `Server error: ${err.response.status} - ${err.response.data?.error || err.response.data?.message || 'Unknown error'}`, type: 'error' });
        }
      } else if (err.request) {
        setMessage({ text: 'Cannot connect to backend server. Make sure it\'s running on port 5000.', type: 'error' });
      } else {
        setMessage({ text: `Request error: ${err.message}`, type: 'error' });
      }
    }
  };

  const clearForm = () => {
    setIsSubmitted(false);
    setMessage({ text: '', type: '' });
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <motion.div
        className="
          relative flex flex-col justify-center md:justify-between
          px-5 py-8 md:px-10 md:py-10
          overflow-hidden
          rounded-b-[10%]
          md:rounded-none md:rounded-r-[30%]
        "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${leftBgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 87%, 85% 100%, 0% 100%)',
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/80 via-blue-900/50 to-transparent" />

        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-400/10 via-transparent to-transparent" />

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        <div className="absolute top-10 right-10 flex space-x-2">
          {[1, 2, 3].map((i) => (
            <div 
              key={i}
              className="w-2 h-2 rounded-full"
              style={{
                background: `rgba(255, 255, 255, ${0.3 + i * 0.1})`,
                animation: `pulse 2s ease-in-out infinite ${i * 0.3}s`,
              }}
            />
          ))}
        </div>
        
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(10px, -10px) scale(1.05); }
            66% { transform: translate(-5px, 5px) scale(0.95); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
          }
        `}</style>
        
        <motion.div
          className="relative z-10 max-w-md mx-auto md:mx-0 text-center md:text-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            className="text-3xl md:text-4xl font-bold mb-6 text-white"
            variants={itemVariants}
          >
            Welcome to <span className="text-yellow-500 italic">Tulu Dimtu School</span> 
          </motion.h1>

          <motion.p
            className="text-lg mb-8 leading-relaxed text-blue-200/90 p-6"
            variants={itemVariants}
          >
            At Tulu Dimtu School, we are dedicated to nurturing young minds through quality education, 
            strong values, and modern learning approaches.
          </motion.p>
        </motion.div>
      </motion.div>

      <motion.div
        className="flex items-center justify-center bg-white px-4 py-8 md:px-6 md:py-0"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="w-full max-w-md">
          {message.text && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`w-full mb-6 rounded-lg p-4 ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : message.type === 'error' ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-yellow-50 border border-yellow-200 text-yellow-700'}`}
            >
              <div className="flex items-center">
                {message.type === 'success' && (
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                {message.type === 'error' && (
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                {message.type === 'warning' && (
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                )}
                <span>{message.text}</span>
              </div>
            </motion.div>
          )}

          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="px-8 pt-8 pb-6">
              <div className="mb-6 text-center">
                <div className="mt-4">
                  {isSignedIn ? (
                    <div className="inline-flex items-center space-x-2 bg-emerald-500/20 backdrop-blur-sm rounded-full py-1.5 px-4 border border-emerald-500/20">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                      <span className="text-emerald-700 text-sm font-medium truncate max-w-[200px]">
                        Welcome, {user?.firstName || user?.primaryEmailAddress?.emailAddress}
                      </span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center space-x-2 bg-amber-500/20 backdrop-blur-sm rounded-full py-1.5 px-4 border border-amber-500/20 animate-pulse">
                      <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <span className="text-amber-700 text-sm font-medium">Sign In Required</span>
                    </div>
                  )}
                </div>
              </div>

              {isSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="relative inline-block mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto shadow-md">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <div className="absolute -inset-2 bg-emerald-500/10 rounded-full blur"></div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Submission Successful!</h3>
                  <div className="mt-6">
                    <button
                      onClick={clearForm}
                      className="inline-flex items-center space-x-2 text-blue-600 font-medium hover:text-blue-800 transition duration-200"
                    >
                      <span>Submit another response</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  <div className="pt-2">
                    {!isSignedIn ? (
                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-br from-teal-600 via-teal-500 to-teal-700 opacity-95 text-white py-3 px-4 rounded-lg font-medium hover:from-teal-700 hover:via-teal-600 hover:to-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Signing In...
                          </span>
                        ) : 'Sign In to Continue'}
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Securing Data...
                          </span>
                        ) : 'Submit Your Information'}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="px-8 py-4 bg-blue-50 border-t border-blue-100 shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <motion.div
                  className="relative z-10 mt-4 md:mt-0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  <p className="text-center justify-center text-gray-400 text-sm">
                    © {new Date().getFullYear()} Tulu Dimtu School. All rights reserved. Developed with ❤️ by Daniel Sheleme.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactForm;
