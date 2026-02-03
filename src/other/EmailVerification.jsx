
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bg from  '../assets/tullulogo.png'

function Email() {
  const [currentForm, setCurrentForm] = useState('login'); // 'login', 'register', 'verify'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const navigate = useNavigate()

  // Mock API URL - replace with your actual backend URL
  const API_URL = process.env.REACT_APP_API_URL || 'https://tullu-dimtu-school-backend-1.onrender.com/api';

  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setMessage({ text: 'Passwords do not match', type: 'error' });
      return;
    }

    // Validate password strength
    if (password.length < 6) {
      setMessage({ text: 'Password must be at least 6 characters', type: 'error' });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage({ text: data.message, type: 'success' });
        setUserEmail(email);
        setCurrentForm('verify');
      } else {
        setMessage({ text: data.message, type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Error connecting to server. Please try again.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage({ text: 'Login successful! Redirecting...', type: 'success' });
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect to dashboard
        setTimeout(() => {
          navigate('/studentstudy-dashboard');
        }, 1500);
        
        
      } else if (data.requiresVerification) {
        setMessage({ text: data.message, type: 'warning' });
        setUserEmail(email);
        setCurrentForm('verify');
      } else {
        setMessage({ text: data.message, type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Error connecting to server. Please try again.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle email verification
  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    
    if (verificationCode.length !== 6) {
      setMessage({ text: 'Please enter a valid 6-digit code', type: 'error' });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: userEmail, 
          verificationCode 
        })
      });

      const data = await response.json();
      
     if (data.success) {
  setMessage({ text: 'Email verified successfully! Redirecting...', type: 'success' });
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  
  // Get student data from temp storage and save to main storage
  const tempStudentData = localStorage.getItem('tempStudentData');
  if (tempStudentData) {
    const studentInfo = JSON.parse(tempStudentData);
    localStorage.setItem('studentInfo', JSON.stringify(studentInfo));
    localStorage.removeItem('tempStudentData');
  }
  
  // Redirect to student info form first
  setTimeout(() => {
    navigate('/studentstudy-dashboard');
  }, 1500);
}
    } catch (error) {
      setMessage({ text: 'Error connecting to server. Please try again.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend verification code
  const handleResendCode = async () => {
    setMessage({ text: '', type: '' });
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail })
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage({ text: 'New verification code sent to your email!', type: 'success' });
      } else {
        setMessage({ text: data.message, type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Error connecting to server. Please try again.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // Render login form
  const renderLoginForm = () => (
    <div className="w-full max-w-md">
      <div className="  overflow-hidden">
        <div className="px-8 pt-8 pb-6">
         
          <form onSubmit={handleLogin} className="space-y-5">
           <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Email Address
  </label>

  <input
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="w-full px-4 py-3 border bg-transparent border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
    placeholder="Enter your email"
    required
  />
</div>

            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border bg-transparent border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="Enter your password"
                required
              />
            </div>
            
            
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-semibold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => setCurrentForm('register')}
                className="text-blue-600 font-medium hover:text-blue-800 transition duration-200"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
        
       
      </div>
    </div>
  );

  // Render registration form
  const renderRegisterForm = () => (
    <div className="w-full max-w-md">
      <div className=" overflow-hidden">
        <div className="px-8 pt-8 pb-6">
         
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border bg-transparent border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border bg-transparent border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="Create a password (min. 6 characters)"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border bg-transparent border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="Confirm your password"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-semibold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => setCurrentForm('login')}
                className="text-blue-600 font-medium hover:text-blue-800 transition duration-200"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
        
      
      </div>
    </div>
  );

  // Render verification form
  const renderVerificationForm = () => (
    <div className="w-full max-w-md bg-white rounded-xl shadow-xl">
      <div className=" overflow-hidden">
        <div className="px-8 pt-8 pb-6">
          <div className="text-center mb-6">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Verify Your Email</h2>
            <p className="text-gray-600 mt-2">
              We sent a verification code to:
            </p>
            <p className="text-lg font-medium text-blue-600 mt-1">{userEmail}</p>
          </div>
          
          <form onSubmit={handleVerifyEmail} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Verification Code
              </label>
             <div className="flex justify-center space-x-2 sm:space-x-3">
  {[...Array(6)].map((_, index) => (
    <input
      key={index}
      type="text"
      maxLength="1"
      className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-xl sm:text-2xl text-center border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
      value={verificationCode[index] || ''}
      onChange={(e) => {
        const newCode = verificationCode.split('');
        newCode[index] = e.target.value;
        setVerificationCode(newCode.join('').slice(0, 6));
        
        // Auto-focus next input
        if (e.target.value && index < 5) {
          const inputs = document.querySelectorAll('input[type="text"]');
          if (inputs[index + 1]) {
            inputs[index + 1].focus();
          }
        }
      }}
      onKeyDown={(e) => {
        // Handle backspace
        if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
          const inputs = document.querySelectorAll('input[type="text"]');
          if (inputs[index - 1]) {
            inputs[index - 1].focus();
          }
        }
      }}
      onPaste={(e) => {
        // Handle paste
        const pastedData = e.clipboardData.getData('text').slice(0, 6);
        if (/^\d+$/.test(pastedData)) {
          setVerificationCode(pastedData);
          e.preventDefault();
          
          // Focus the last input
          const inputs = document.querySelectorAll('input[type="text"]');
          const focusIndex = Math.min(pastedData.length, 5);
          if (inputs[focusIndex]) {
            inputs[focusIndex].focus();
          }
        }
      }}
      required
    />
  ))}
</div>
              <p className="text-sm text-gray-500 text-center mt-3">
                Enter the 6-digit code sent to your email
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-semibold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </span>
                ) : 'Verify Email'}
              </button>
              
              <button
                type="button"
                onClick={handleResendCode}
                disabled={isLoading}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-semibold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Resend Code
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            
            
            <button
              onClick={() => {
                setCurrentForm('login');
                setMessage({ text: '', type: '' });
              }}
              className="mt-4 text-gray-600 hover:text-gray-800 transition duration-200"
            >
              ← Back to Sign In
            </button>
          </div>
        </div>
        
        <div className="px-8 py-4 bg-blue-50 border-t border-blue-100">
          <div className="flex items-center justify-center space-x-2">
            <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            
          </div>
        </div>
      </div>
    </div>
  );

  return (
   <>
   
   
   
    <div className="min-h-screen flex flex-col items-center justify-start pt-10 px-4">
          <div className="mb-6">
    <img 
      src={bg}
      alt="School Logo"
      className="w-52 h-52 rounded-full p-3 "
    />
  </div>

      {/* Message Display */}
      {message.text && (
        <div className={`w-full max-w-md mb-6 rounded-lg p-4 ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : message.type === 'error' ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-yellow-50 border border-yellow-200 text-yellow-700'}`}>
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
        </div>
      )}

      {/* Form Container */}
      {currentForm === 'login' && renderLoginForm()}
      {currentForm === 'register' && renderRegisterForm()}
      {currentForm === 'verify' && renderVerificationForm()}

      
    </div>
   
   </>
  );
}

export default Email;



