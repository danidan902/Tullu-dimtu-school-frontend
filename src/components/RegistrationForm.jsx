import  { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'vhttps://tullu-dimtu-school-backend-1.onrender.com/api/registrations';

const Registration = () => {
  // State for form fields
  const [formData, setFormData] = useState({
    fullName: '',
    day: '',
    grade: '',
    role: '',
    program: '',
    phone: ''
  });

  // State for form submission
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState(null);

  const programOptions = [
    'STEM Program',
    'Leadership Program',
    'Technology and Innovation',
    'Arts and Humanities',
    'Cultural Day',
    'Mini Media',
    "Sports"
  ];

  // Grade options for dropdown
  const gradeOptions = [
    '9th Grade',
    '10th Grade',
    '11th Grade',
    '12th Grade',
  ];

  // Role options for dropdown
  const roleOptions = [
    'Student',
    'Mentor',
    'Instructor',
    'Program Coordinator',
    'Volunteer',
    'Guest Speaker'
  ];

  // Fetch all submissions on component mount
  useEffect(() => {
    fetchSubmissions();
    fetchStatistics();
  }, []);

  // Fetch all submissions from backend
  const fetchSubmissions = async () => {
    try {
      const response = await axios.get(API_URL);
      if (response.data.success) {
        setSubmissions(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
      setError('Failed to load submissions');
    }
  };

  // Fetch statistics from backend
  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`${API_URL}/stats/summary`);
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  // Handle form submission to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await axios.post(API_URL, formData);
      
      if (response.data.success) {
        setIsSubmitted(true);
        setSuccessMessage(response.data.message || 'Registration successful!');
        
        // Reset form
        setFormData({
          fullName: '',
          day: '',
          grade: '',
          role: '',
          program: '',
          phone: ''
        });
        
        // Refresh submissions list
        fetchSubmissions();
        fetchStatistics();
        
        // Auto hide success message after 5 seconds
        setTimeout(() => {
          setIsSubmitted(false);
          setSuccessMessage('');
        }, 5000);
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response) {
        // Server responded with error
        setError(error.response.data.message || 'Registration failed');
      } else if (error.request) {
        // Request made but no response
        setError('Network error. Please check your connection.');
      } else {
        // Other errors
        setError('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle clearing all submissions from backend
  const handleClearAllSubmissions = async () => {
    if (window.confirm('Are you sure you want to delete ALL submissions? This action cannot be undone.')) {
      try {
        // Delete all submissions one by one (or implement bulk delete in backend)
        for (const submission of submissions) {
          await axios.delete(`${API_URL}/${submission.id}`);
        }
        setSubmissions([]);
        setStats(null);
        setSuccessMessage('All submissions cleared successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error('Error clearing submissions:', error);
        setError('Failed to clear submissions');
      }
    }
  };

  // Handle deleting single submission
  const handleDeleteSubmission = async (id) => {
    if (window.confirm('Are you sure you want to delete this submission?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        // Remove from local state
        setSubmissions(submissions.filter(sub => sub.id !== id));
        // Refresh statistics
        fetchStatistics();
        setSuccessMessage('Submission deleted successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting submission:', error);
        setError('Failed to delete submission');
      }
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Full screen background with pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 z-0"></div>
      
      {/* Main centered container */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center py-8 px-4">
        <div className="w-full max-w-6xl">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Program Registration System
            </h1>
            <p className="text-blue-200 text-lg">
              Register for upcoming programs and events
            </p>
          </div>
          
          {/* Stats Overview */}
        
          
          {/* Main Content */}
          <div className="flex flex-col  gap-8">
            {/* Registration Form */}
            <div className="">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-6 md:p-8">
                {/* Success Message */}
                {isSubmitted && successMessage && (
                  <div className="mb-6 p-4 bg-green-500/20 border border-green-400 rounded-xl text-green-100 text-center">
                    <p className="font-semibold">✓ {successMessage}</p>
                    <p className="text-sm mt-1">Thank you for registration for this programs.</p>
                  </div>
                )}
                
                {/* Error Message */}
                {error && (
                  <div className="mb-6 p-4 bg-red-500/20 border border-red-400 rounded-xl text-red-100">
                    <p className="font-semibold">⚠️ {error}</p>
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  {/* Full Name */}
                  <div className="mb-6">
                    <label className="block text-white text-sm font-medium mb-2">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="Enter your full name"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  {/* Phone */}
                  <div className="mb-6">
                    <label className="block text-white text-sm font-medium mb-2">
                      Phone <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="+250 78X XXX XXX"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Day Selection */}
                    <div className="mb-6">
                      <label className="block text-white text-sm font-medium mb-2">
                        Day <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="date"
                        name="day"
                        value={formData.day}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        required
                        disabled={isLoading}
                      />
                    </div>
                    
                    {/* Grade Selection */}
                    <div className="mb-6">
                      <label className="block text-white text-sm font-medium mb-2">
                        Grade/Level <span className="text-red-400">*</span>
                      </label>
                      <select
                        name="grade"
                        value={formData.grade}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        required
                        disabled={isLoading}
                      >
                        <option value="" disabled>Select your grade</option>
                        {gradeOptions.map((grade, index) => (
                          <option key={index} value={grade} className="bg-gray-800 text-white">
                            {grade}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Role Selection */}
                    <div className="mb-6">
                      <label className="block text-white text-sm font-medium mb-2">
                        Role <span className="text-red-400">*</span>
                      </label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        required
                        disabled={isLoading}
                      >
                        <option value="" disabled>Select your role</option>
                        {roleOptions.map((role, index) => (
                          <option key={index} value={role} className="bg-gray-800 text-white">
                            {role}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Program Selection */}
                    <div className="mb-6">
                      <label className="block text-white text-sm font-medium mb-2">
                        Program <span className="text-red-400">*</span>
                      </label>
                      <select
                        name="program"
                        value={formData.program}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        required
                        disabled={isLoading}
                      >
                        <option value="" disabled>Select your program</option>
                        {programOptions.map((program, index) => (
                          <option key={index} value={program} className="bg-gray-800 text-white">
                            {program}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  {/* Submit Button */}
                  <div className="mt-10 text-center">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full md:w-auto px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-xl shadow-lg transition duration-300 transform hover:-translate-y-1 ${
                        isLoading 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'hover:from-blue-700 hover:to-purple-700 hover:shadow-xl'
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        'Register Now'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            
           
                
             
              
             
          </div>
          
        
         
        </div>
      </div>
    </div>
  );
};

export default Registration;
