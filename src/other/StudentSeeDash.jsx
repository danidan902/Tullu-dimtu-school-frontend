import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import bg from '../assets/tullulogo.png';
import axios from 'axios';


// Configure axios base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Custom hook for email authentication
const useEmailAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const requestOTP = async (email) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/auth/email/request-otp', { email });
      const data = response.data;
      
      if (!data.success) throw new Error(data.message);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Request failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (email, otp) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/auth/email/verify-otp', { email, otp });
      const data = response.data;
      
      if (!data.success) throw new Error(data.message);
      
      // Store user and token
      if (data.token && data.user) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Verification failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  return { 
    requestOTP, 
    verifyOTP, 
    logout,
    loading, 
    error, 
    user,
    token,
    isAuthenticated: !!token 
  };
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.9 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: "easeOut" },
  },
};

// Main component
function EmailVerification() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('email'); // 'email' or 'otp'
  
  const auth = useEmailAuth();
  const { 
    requestOTP, 
    verifyOTP, 
    logout, 
    loading, 
    error, 
    user, 
    isAuthenticated 
  } = auth;

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    try {
      await requestOTP(email);
      setStep('otp');
    } catch (err) {
      console.error('OTP Request Error:', err);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      await verifyOTP(email, otp);
      // Redirect to home page after successful verification
      navigate('/student-see-profile');
    } catch (err) {
      console.error('OTP Verification Error:', err);
    }
  };

  const handleResendOTP = async () => {
    try {
      await requestOTP(email);
      alert('New OTP sent to your email!');
    } catch (err) {
      console.error('Resend OTP Error:', err);
    }
  };

  // If user is authenticated, show welcome message
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50 p-4">
        <Helmet>
          <title>Welcome - Tullu Dimtu School System</title>
        </Helmet>
        
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Welcome back!</h2>
            <p className="text-gray-600 mt-2">You have successfully logged in</p>
          </div>
          
          <div className="bg-teal-50 rounded-xl p-6 mb-6">
            <p className="text-gray-700">
              <span className="font-medium">Email:</span> {user.email}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Session active • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          
          <div className="space-y-4">
            <button 
              onClick={() => navigate('/home')}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg"
            >
              Go to Dashboard
            </button>
            
            <button 
              onClick={logout}
              className="w-full border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 py-3 rounded-lg font-semibold transition-all duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Login - Tullu Dimtu School System</title>
      </Helmet>
      
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-1">
        <motion.div
          className="flex items-center justify-center bg-white px-4 py-8 md:px-6 md:py-0"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: "easeOut" }}
        >
          <div className="w-full max-w-sm md:max-w-md text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
           
         <div className="mb-6">
    <img 
      src={bg}
      alt="School Logo"
      className="w-52 h-52 rounded-full p-3 "
    />
  </div>
             
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r"
                >
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </motion.div>
              )}

              {step === 'email' ? (
                
                <motion.form
                  onSubmit={handleRequestOTP}
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div>
                    <label htmlFor="email" className="block text-left text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@example.com"
                      required
                      disabled={loading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-300 disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  
                  <motion.button
                    type="submit"
                    disabled={loading || !email}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg mb-16 font-semibold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending OTP...
                      </span>
                    ) : 'Send OTP'}
                  </motion.button>
                </motion.form>
              ) : (
                
                <motion.form
                  onSubmit={handleVerifyOTP}
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div>
                    <label htmlFor="otp" className="block text-left text-sm font-medium text-gray-700 mb-2">
                      Enter 6-digit OTP
                    </label>
                    <input
                      type="text"
                      id="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="123456"
                      maxLength="6"
                      required
                      disabled={loading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-300 text-center text-xl tracking-widest disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />
                    <p className="text-sm text-gray-500 mt-2 text-left">
                      OTP sent to: <span className="font-medium">{email}</span>
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <motion.button
                      type="submit"
                      disabled={loading || otp.length !== 6}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-semibold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Verifying...
                        </span>
                      ) : 'Verify OTP'}
                    </motion.button>
                    
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => setStep('email')}
                        disabled={loading}
                        className="flex-1 border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 py-3 rounded-lg font-medium transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Change Email
                      </button>
                      
                      <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={loading}
                        className="flex-1 border border-teal-200 hover:border-teal-300 text-teal-700 hover:text-teal-800 py-3 rounded-lg font-medium transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Resend OTP
                      </button>
                    </div>
                  </div>
                </motion.form>
              )}

              
             
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default EmailVerification;
