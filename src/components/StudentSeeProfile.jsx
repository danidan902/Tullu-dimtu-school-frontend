import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import studentLifeHero from '../assets/por.jpg';
// import Footer from './Footer';
import { FaEdit, FaSave, FaTimes, FaUser, FaGraduationCap, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCalendarAlt, FaVenusMars, FaFlag, FaHeart, FaIdCard, FaSearch, FaUserCheck, FaUserFriends } from 'react-icons/fa';
import {useNavigate} from 'react-router-dom';
import { ChevronLeft} from 'lucide-react';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const StudentSeeProfile = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [emailSearch, setEmailSearch] = useState('');
  const [nameSearch, setNameSearch] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [viewMode, setViewMode] = useState('table');
  const [sortConfig, setSortConfig] = useState({ key: 'firstName', direction: 'asc' });
  const [emailSearchResult, setEmailSearchResult] = useState(null);
  const [nameSearchResults, setNameSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchMode, setSearchMode] = useState('email'); // 'email' or 'name'
  
  // Edit mode states
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [updateMessage, setUpdateMessage] = useState({ type: '', text: '' });

  const navigate = useNavigate();

  // Don't fetch on initial load - only fetch when searched
  useEffect(() => {
    // Empty initial load - no fetch
  }, []);

  // Function to search by email only
  const searchByEmail = async () => {
    if (!emailSearch.trim()) {
      setError('Please enter an email address');
      return;
    }
    
    setLoading(true);
    setError(null);
    setHasSearched(true);
    setNameSearchResults([]);
    setSelectedAdmission(null);
    
    try {
      const emailLower = emailSearch.toLowerCase().trim();
      const response = await axios.get(`${API_URL}/api/admissions`, { timeout: 10000 });
      
      if (response.data.success) {
        const allAdmissions = response.data.data || [];
        setAdmissions(allAdmissions);
        
        const foundStudent = allAdmissions.find(admission => 
          admission.parentEmail?.toLowerCase() === emailLower || 
          admission.email?.toLowerCase() === emailLower
        );
        
        if (foundStudent) {
          setEmailSearchResult(foundStudent);
          setSelectedAdmission(foundStudent);
          setError(null);
          setSearchTerm('');
          setSelectedGrade('all');
        } else {
          setEmailSearchResult(null);
          setSelectedAdmission(null);
          setError(`No student found with email: ${emailSearch}`);
        }
      } else {
        setError('Failed to fetch admissions');
      }
    } catch (error) {
      console.error('Search error:', error);
      setError(`Failed to connect to server. Please check if backend is running at ${API_URL}`);
    } finally {
      setLoading(false);
    }
  };

  // NEW: Function to search by name
  const searchByName = async () => {
    if (!nameSearch.trim()) {
      setError('Please enter a name to search');
      return;
    }
    
    setLoading(true);
    setError(null);
    setHasSearched(true);
    setEmailSearchResult(null);
    setSelectedAdmission(null);
    
    try {
      const searchLower = nameSearch.toLowerCase().trim();
      const response = await axios.get(`${API_URL}/api/admissions`, { timeout: 10000 });
      
      if (response.data.success) {
        const allAdmissions = response.data.data || [];
        setAdmissions(allAdmissions);
        
        // Search by first name, last name, or full name
        const results = allAdmissions.filter(admission => {
          const fullName = `${admission.firstName} ${admission.lastName}`.toLowerCase();
          const firstNameMatch = admission.firstName?.toLowerCase().includes(searchLower);
          const lastNameMatch = admission.lastName?.toLowerCase().includes(searchLower);
          const fullNameMatch = fullName.includes(searchLower);
          const grandParentMatch = admission.grandParentName?.toLowerCase().includes(searchLower);
          
          return firstNameMatch || lastNameMatch || fullNameMatch || grandParentMatch;
        });
        
        if (results.length > 0) {
          setNameSearchResults(results);
          setError(null);
          setSelectedAdmission(results[0]); // Select the first result
          // Show all results in the table
          setEmailSearchResult(null);
        } else {
          setNameSearchResults([]);
          setSelectedAdmission(null);
          setError(`No students found with name: ${nameSearch}`);
        }
      } else {
        setError('Failed to fetch admissions');
      }
    } catch (error) {
      console.error('Search error:', error);
      setError(`Failed to connect to server. Please check if backend is running at ${API_URL}`);
    } finally {
      setLoading(false);
    }
  };

  // Clear all searches
  const clearAllSearches = () => {
    setEmailSearch('');
    setNameSearch('');
    setEmailSearchResult(null);
    setNameSearchResults([]);
    setSelectedAdmission(null);
    setError(null);
    setHasSearched(false);
    setAdmissions([]);
    setSearchTerm('');
    setSelectedGrade('all');
  };

  // Clear email search
  const clearEmailSearch = () => {
    setEmailSearch('');
    setEmailSearchResult(null);
    if (nameSearchResults.length === 0) {
      setSelectedAdmission(null);
      setError(null);
      setHasSearched(false);
      setAdmissions([]);
    }
  };

  // Clear name search
  const clearNameSearch = () => {
    setNameSearch('');
    setNameSearchResults([]);
    if (!emailSearchResult) {
      setSelectedAdmission(null);
      setError(null);
      setHasSearched(false);
      setAdmissions([]);
    }
  };

  const getFileUrl = (filePath) => {
    if (!filePath) return null;
    if (filePath.startsWith('http')) return filePath;
    if (filePath.startsWith('/')) return `${API_URL}${filePath}`;
    return `${API_URL}/uploads/${filePath}`;
  };

  const getStudentPhotoUrl = (admission) => {
    if (!admission) return null;
    if (admission.photo?.secure_url) return admission.photo.secure_url;
    if (admission.photo?.url) return admission.photo.url;
    if (admission.photo && typeof admission.photo === 'string') return getFileUrl(admission.photo);
    if (admission.studentPhoto) return getFileUrl(admission.studentPhoto);
    return null;
  };

  const getInitials = (firstName, lastName) => {
    const first = firstName?.[0]?.toUpperCase() || '?';
    const last = lastName?.[0]?.toUpperCase() || '?';
    return first + last;
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      accepted: 'bg-gradient-to-r from-green-500 to-green-700 text-white',
      pending: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white',
      rejected: 'bg-gradient-to-r from-red-500 to-rose-600 text-white',
      waiting: 'bg-gradient-to-r from-gray-400 to-gray-500 text-white',
      registered: 'bg-gradient-to-r from-blue-500 to-blue-700 text-white'
    };
    
    const defaultClass = 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800';
    const statusClass = statusMap[status?.toLowerCase()] || defaultClass;
    
    return `${statusClass} px-3 py-1 rounded-full text-xs font-medium shadow-sm`;
  };

  const gradeMatches = (grade, selectedGradeValue) => {
    if (!grade) return false;
    const gradeStr = grade.toString().toLowerCase();
    const map = {
      '9': ['9', 'nine', 'grade 9', '9th'],
      '10': ['10', 'ten', 'grade 10', '10th'],
      '11': ['11', 'eleven', 'grade 11', '11th'],
      '12': ['12', 'twelve', 'grade 12', '12th']
    };
    return map[selectedGradeValue]?.some(val => gradeStr.includes(val)) || false;
  };

  const getGradeBadge = (grade) => {
    if (gradeMatches(grade, '9')) return { label: 'Grade 9', bg: 'bg-cyan-100 text-cyan-800' };
    if (gradeMatches(grade, '10')) return { label: 'Grade 10', bg: 'bg-emerald-100 text-emerald-800' };
    if (gradeMatches(grade, '11')) return { label: 'Grade 11', bg: 'bg-violet-100 text-violet-800' };
    if (gradeMatches(grade, '12')) return { label: 'Grade 12', bg: 'bg-amber-100 text-amber-800' };
    return { label: grade || 'N/A', bg: 'bg-gray-100 text-gray-800' };
  };

  // Start editing
  const handleEditClick = () => {
    if (selectedAdmission) {
      setEditFormData({
        firstName: selectedAdmission.firstName || '',
        lastName: selectedAdmission.lastName || '',
        grandParentName: selectedAdmission.grandParentName || '',
        gender: selectedAdmission.gender || '',
        dob: selectedAdmission.dob ? selectedAdmission.dob.split('T')[0] : '',
        age: selectedAdmission.age || '',
        applyingGrade: selectedAdmission.applyingGrade || '',
        lastSchool: selectedAdmission.lastSchool || '',
        lastGrade: selectedAdmission.lastGrade || '',
        parentName: selectedAdmission.parentName || '',
        parentPhone: selectedAdmission.parentPhone || '',
        parentEmail: selectedAdmission.parentEmail || '',
        relationship: selectedAdmission.relationship || '',
        address: selectedAdmission.address || '',
        nationality: selectedAdmission.nationality || '',
        religion: selectedAdmission.religion || '',
        gradeAverage: selectedAdmission.gradeAverage || '',
        condition: selectedAdmission.condition || '',
        fayida: selectedAdmission.fayida || '',
        program: selectedAdmission.program || '',
        field: selectedAdmission.field || ''
      });
      setIsEditing(true);
      setUpdateMessage({ type: '', text: '' });
    }
  };

  // Handle form input changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  // Submit edit
  const handleEditSubmit = async () => {
    if (!selectedAdmission) return;
    
    setEditLoading(true);
    setUpdateMessage({ type: '', text: '' });
    
    try {
      const response = await axios.put(
        `${API_URL}/api/admissions/${selectedAdmission._id}`,
        editFormData,
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 30000
        }
      );
      
      if (response.data.success) {
        const updatedAdmission = response.data.data;
        setAdmissions(prev => prev.map(ad => 
          ad._id === selectedAdmission._id ? updatedAdmission : ad
        ));
        setSelectedAdmission(updatedAdmission);
        if (emailSearchResult && emailSearchResult._id === selectedAdmission._id) {
          setEmailSearchResult(updatedAdmission);
        }
        // Update name search results if any
        if (nameSearchResults.length > 0) {
          setNameSearchResults(prev => prev.map(ad => 
            ad._id === selectedAdmission._id ? updatedAdmission : ad
          ));
        }
        setIsEditing(false);
        setUpdateMessage({ type: 'success', text: 'Profile updated successfully!' });
        
        setTimeout(() => setUpdateMessage({ type: '', text: '' }), 3000);
      } else {
        setUpdateMessage({ type: 'error', text: response.data.message || 'Update failed' });
      }
    } catch (error) {
      console.error('Edit error:', error);
      let errorMsg = 'Failed to update profile. ';
      if (error.response?.data?.message) {
        errorMsg += error.response.data.message;
      } else if (error.message === 'Network Error') {
        errorMsg += 'Please check your internet connection.';
      } else {
        errorMsg += 'Please try again later.';
      }
      setUpdateMessage({ type: 'error', text: errorMsg });
    } finally {
      setEditLoading(false);
    }
  };

  // Cancel editing
  const handleEditCancel = () => {
    setIsEditing(false);
    setEditFormData({});
    setUpdateMessage({ type: '', text: '' });
  };

  // Filtered admissions - show email result or name search results
  const filteredAdmissions = useMemo(() => {
    if (emailSearchResult) {
      return [emailSearchResult];
    }
    if (nameSearchResults.length > 0) {
      return nameSearchResults;
    }
    return [];
  }, [emailSearchResult, nameSearchResults]);

  const requestSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Show initial state (no data loaded)
  if (!hasSearched && !loading && !emailSearchResult && nameSearchResults.length === 0) {
    return (
      <>

           <div className="text-center relative">
             
            
             
              <div className="bg-cover bg-center bg-fixed relative overflow-hidden w-full h-[50vh]"
                 style={{ backgroundImage: `url(${studentLifeHero})` }}>
                  
                {/* Overlay gradients */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-transparent z-10"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent z-10"></div>
                
                {/* Welcome Message Content */}
                <div className="relative z-20 flex flex-col items-center justify-center h-full px-4">
                  <div className="max-w-3xl">
                      <div className="fixed top-2 left-2 right-2 z-10 md:top-4 md:left-4 md:right-auto bg-white/80  rounded-full shadow-md p-2 flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer">
                              
                                <ChevronLeft onClick={() => navigate('/')} className="w-8 h-8" />
                               Back to Home
                             
                            </div>
                    <h1 className="text-white text-4xl md:text-6xl font-bold mb-6">
                     Student Profile Search
                    </h1>
                    <div className="w-32 h-1 bg-green-600 mx-auto mb-8"></div>
                    <h2 className="text-green-300 text-2xl md:text-3xl font-semibold mb-4">
                     Search your profile by email or name to view your details
                    </h2>
                    <p className="text-gray-200 text-lg md:text-xl">
                      Tulu Dimtu School
                    </p>
                  </div>
                </div>
      
              </div>
            </div>
      
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 px-4 md:px-8 py-12 justify-center items-center flex flex-col">
            
          <div className="max-w-7xl mx-auto">
            {/* Search Section - Email and Name */}
            <div className="bg-[#04395E] via-[#04395E]/120 to-transparent backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border border-white/50">
              {/* Search Mode Toggle */}
              <div className="flex gap-2 mb-6 bg-slate-100 rounded-xl p-1 max-w-xs mx-auto">
                <button
                  onClick={() => setSearchMode('email')}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold transition ${
                    searchMode === 'email' 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <FaEnvelope className="inline mr-2" /> Email
                </button>
                <button
                  onClick={() => setSearchMode('name')}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold transition ${
                    searchMode === 'name' 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <FaUserFriends className="inline mr-2" /> Name
                </button>
              </div>

              {/* Email Search */}
              {searchMode === 'email' && (
                <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
                  <div className="flex items-center gap-2 mb-4">
                    <FaEnvelope className="text-indigo-600 text-xl" />
                    <h3 className="text-xl font-bold text-indigo-800">Find Your Profile by Email</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Enter your registered email address to access your profile</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                      <input
                        type="email"
                        placeholder="Enter your registered email address..."
                        value={emailSearch}
                        onChange={(e) => setEmailSearch(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && searchByEmail()}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 text-lg"
                      />
                      <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 text-xl" />
                    </div>
                    <button
                      onClick={searchByEmail}
                      disabled={loading}
                      className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 text-lg"
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      ) : (
                        <FaSearch />
                      )}
                      {loading ? 'Searching...' : 'Search My Profile'}
                    </button>
                  </div>
                </div>
              )}

              {/* Name Search - NEW */}
              {searchMode === 'name' && (
                <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                  <div className="flex items-center gap-2 mb-4">
                    <FaUserFriends className="text-emerald-600 text-xl" />
                    <h3 className="text-xl font-bold text-emerald-800">Search Your Profile </h3>
                  </div>
                  <p className="text-gray-600 mb-4">Enter your first name, last name, or full name to search</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder="Enter your name (e.g., John, Jane, or John Doe)..."
                        value={nameSearch}
                        onChange={(e) => setNameSearch(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && searchByName()}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-emerald-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700 text-lg"
                      />
                      <FaUserFriends className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400 text-xl" />
                    </div>
                    <button
                      onClick={searchByName}
                      disabled={loading}
                      className="px-8 py-4 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 text-lg"
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      ) : (
                        <FaSearch />
                      )}
                      {loading ? 'Searching...' : 'Search by Name'}
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-4 p-4 bg-rose-50 border-l-4 border-rose-500 rounded-lg">
                  <p className="text-rose-700">{error}</p>
                </div>
              )}

              {/* Clear All button */}
              {(emailSearchResult || nameSearchResults.length > 0) && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={clearAllSearches}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition flex items-center gap-2"
                  >
                    <FaTimes /> Clear All Results
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
      </>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-indigo-200 border-t-indigo-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 bg-indigo-600 rounded-full animate-ping opacity-75"></div>
            </div>
          </div>
          <p className="mt-8 text-lg font-semibold text-slate-700 tracking-wide">Searching for profiles...</p>
          <p className="text-sm text-slate-500 mt-1">Please wait while we find your information</p>
        </div>
      </div>
    );
  }

  // Get result count message
  const getResultMessage = () => {
    if (emailSearchResult) {
      return `Profile found for: ${emailSearchResult.firstName} ${emailSearchResult.lastName}`;
    }
    if (nameSearchResults.length > 0) {
      return `Found ${nameSearchResults.length} student(s) matching "${nameSearch}"`;
    }
    return '';
  };

  // Get result count badge color
  const getResultBadgeColor = () => {
    if (emailSearchResult) return 'bg-green-50 border-green-200 text-green-700';
    if (nameSearchResults.length > 0) return 'bg-blue-50 border-blue-200 text-blue-700';
    return 'bg-gray-50 border-gray-200 text-gray-700';
  };

  return (
    <>
     

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 px-4 md:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Controls */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border border-white/50">
            {/* Search Mode Toggle */}
            <div className="flex gap-2 mb-6 bg-slate-100 rounded-xl p-1 max-w-xs mx-auto">
              <button
                onClick={() => setSearchMode('email')}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition ${
                  searchMode === 'email' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <FaEnvelope className="inline mr-2" /> Email
              </button>
              <button
                onClick={() => setSearchMode('name')}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition ${
                  searchMode === 'name' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <FaUserFriends className="inline mr-2" /> Name
              </button>
            </div>

            {/* Search Inputs */}
            <div className="flex flex-col gap-4">
              {searchMode === 'email' ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="email"
                      placeholder="Enter your registered email address..."
                      value={emailSearch}
                      onChange={(e) => setEmailSearch(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && searchByEmail()}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
                    />
                    <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" />
                  </div>
                  <button
                    onClick={searchByEmail}
                    disabled={loading}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                  >
                    {loading ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div> : <FaSearch />}
                    {loading ? 'Searching...' : 'Search by Email'}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Enter student name..."
                      value={nameSearch}
                      onChange={(e) => setNameSearch(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && searchByName()}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-emerald-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700"
                    />
                    <FaUserFriends className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
                  </div>
                  <button
                    onClick={searchByName}
                    disabled={loading}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                  >
                    {loading ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div> : <FaSearch />}
                    {loading ? 'Searching...' : 'Search by Name'}
                  </button>
                </div>
              )}
            </div>

            {/* Results Summary */}
            {(emailSearchResult || nameSearchResults.length > 0) && (
              <div className={`mt-4 p-3 rounded-lg border flex items-center justify-between ${getResultBadgeColor()}`}>
                <div className="flex items-center gap-2">
                  <FaUserCheck />
                  <span className="font-medium">{getResultMessage()}</span>
                </div>
                {nameSearchResults.length > 1 && (
                  <span className="text-sm bg-white/50 px-3 py-1 rounded-full">
                    {nameSearchResults.length} students found
                  </span>
                )}
                <button
                  onClick={clearAllSearches}
                  className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center gap-1"
                >
                  <FaTimes /> Clear
                </button>
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-rose-50 border-l-4 border-rose-500 rounded-lg">
                <p className="text-rose-700 text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Main Content - Show only searched profiles */}
          {(emailSearchResult || nameSearchResults.length > 0) && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50/80">
                    <tr>
                      {['Photo', 'Full Name', 'Phone', 'Email', 'Student ID', 'Grade', 'Status', 'Actions'].map((header, idx) => (
                        <th key={idx} className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                          {header === 'Full Name' ? (
                            <button onClick={() => requestSort('firstName')} className="hover:text-indigo-600 flex items-center gap-1">
                              {header} {sortConfig.key === 'firstName' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </button>
                          ) : header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAdmissions.map((admission) => {
                      const photoUrl = getStudentPhotoUrl(admission);
                      const gradeBadge = getGradeBadge(admission.applyingGrade);
                      return (
                        <tr key={admission._id} className="hover:bg-indigo-50/30 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="h-12 w-12 rounded-full overflow-hidden bg-gradient-to-br from-indigo-100 to-indigo-200 shadow-md">
                              {photoUrl ? (
                                <img src={photoUrl} alt="" className="h-full w-full object-cover" />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-indigo-700 font-bold text-lg">
                                  {getInitials(admission.firstName, admission.lastName)}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-800">{admission.firstName} {admission.lastName}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{admission.gender || 'Not specified'}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-700 font-mono">{admission.parentPhone || '—'}</td>
                          <td className="px-6 py-4 text-sm text-slate-600 max-w-[180px] truncate">{admission.parentEmail || '—'}</td>
                          <td className="px-6 py-4 text-sm font-mono text-slate-600">{admission.studentId || admission.admissionId || '—'}</td>
                          <td className="px-2 py-2 sm:px-6 sm:py-4">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs sm:text-sm font-bold ${gradeBadge.bg}`}>
                              {gradeBadge.label}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={getStatusBadge(admission.status)}>
                              {admission.status || 'Pending'}
                            </span>
                          </td>
                          <td className="px-2 py-2 sm:px-6 sm:py-4 text-center">
                            <button 
                              onClick={() => setSelectedAdmission(admission)} 
                              className="px-2 py-1 sm:px-4 sm:py-1.5 bg-indigo-600 text-white rounded-lg text-xs sm:text-sm font-semibold hover:bg-indigo-700 transition"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {/* Result count footer */}
              <div className="px-6 py-3 bg-slate-50 border-t border-slate-200">
                <p className="text-sm text-slate-600">
                  Showing {filteredAdmissions.length} result(s)
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal with Edit Functionality */}
      {selectedAdmission && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            {/* Header with Edit Button */}
            <div className="relative bg-[#04395E] via-[#04395E]/120 to-transparent p-8 rounded-t-3xl">
              <button onClick={() => { setSelectedAdmission(null); setIsEditing(false); }} className="absolute right-6 top-6 text-white/80 hover:text-white text-3xl leading-none">×</button>
              
              {/* Update Message */}
              {updateMessage.text && (
                <div className={`absolute top-20 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg ${
                  updateMessage.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                }`}>
                  {updateMessage.text}
                </div>
              )}
              
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <div className="h-44 w-40 border-4 border-white shadow-xl overflow-hidden bg-white relative group cursor-pointer">
                  {getStudentPhotoUrl(selectedAdmission) ? (
                    <img src={getStudentPhotoUrl(selectedAdmission)} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-indigo-200 flex items-center justify-center text-indigo-800 text-3xl font-bold">
                      {getInitials(selectedAdmission.firstName, selectedAdmission.lastName)}
                    </div>
                  )}
                </div>
                <div className="text-center md:text-left text-white flex-1">
                  {!isEditing ? (
                    <>
                      <h2 className="text-3xl font-black">{selectedAdmission.firstName} {selectedAdmission.lastName}</h2>
                      <p className="text-indigo-200 mt-1">Student ID: {selectedAdmission.studentId || selectedAdmission.admissionId || 'Not assigned'}</p>
                      <p className="text-indigo-200 text-sm mt-1 flex items-center gap-1 justify-center md:justify-start"><FaEnvelope /> {selectedAdmission.parentEmail || 'No email'}</p>
                    </>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <input type="text" name="firstName" value={editFormData.firstName} onChange={handleEditChange} placeholder="First Name" className="px-3 py-2 rounded-lg text-gray-800 w-36" />
                        <input type="text" name="lastName" value={editFormData.lastName} onChange={handleEditChange} placeholder="Last Name" className="px-3 py-2 rounded-lg text-gray-800 w-36" />
                      </div>
                      <input type="text" name="grandParentName" value={editFormData.grandParentName} onChange={handleEditChange} placeholder="Grand Parent Name" className="px-3 py-2 rounded-lg text-gray-800" />
                    </div>
                  )}
                  <div className="flex gap-2 mt-2 justify-center md:justify-start">
                    {!isEditing ? (
                      <>
                        <span className="px-3 py-1 bg-white/20 rounded-full text-sm">{selectedAdmission.gender || 'Gender not specified'}</span>
                        <span className={`px-3 py-1 rounded-full text-sm ${getGradeBadge(selectedAdmission.applyingGrade).bg} text-gray-800`}>
                          {getGradeBadge(selectedAdmission.applyingGrade).label}
                        </span>
                        <span className={getStatusBadge(selectedAdmission.status)}>
                          {selectedAdmission.status || 'Pending'}
                        </span>
                      </>
                    ) : (
                      <>
                        <select name="gender" value={editFormData.gender} onChange={handleEditChange} className="px-3 py-1 rounded-full text-sm text-gray-800">
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        <select name="applyingGrade" value={editFormData.applyingGrade} onChange={handleEditChange} className="px-3 py-1 rounded-full text-sm text-gray-800">
                          <option value="">Select Grade</option>
                          <option value="Grade 9">Grade 9</option>
                          <option value="Grade 10">Grade 10</option>
                          <option value="Grade 11">Grade 11</option>
                          <option value="Grade 12">Grade 12</option>
                        </select>
                      </>
                    )}
                  </div>
                </div>
                {/* Edit/Save/Cancel Buttons */}
                <div className="flex gap-2">
                  {!isEditing ? (
                    <button onClick={handleEditClick} className="px-4 py-2 bg-yellow-500 text-white rounded-xl font-semibold hover:bg-yellow-600 transition flex items-center gap-2">
                      <FaEdit /> Edit Profile
                    </button>
                  ) : (
                    <>
                      <button onClick={handleEditSubmit} disabled={editLoading} className="px-4 py-2 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition flex items-center gap-2">
                        {editLoading ? 'Saving...' : <><FaSave /> Save</>}
                      </button>
                      <button onClick={handleEditCancel} className="px-4 py-2 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition flex items-center gap-2">
                        <FaTimes /> Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* Editable Form Fields */}
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Personal Details */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 border-b-2 border-indigo-200 pb-2 flex items-center gap-2">
                      <FaUser className="text-indigo-600" /> Personal Details
                    </h3>
                    <div className="mt-4 space-y-3">
                      {!isEditing ? (
                        <>
                          <div className="flex justify-between"><span className="text-slate-500">Full name</span><span className="font-medium">{selectedAdmission.firstName} {selectedAdmission.lastName} {selectedAdmission.grandParentName}</span></div>
                          <div className="flex justify-between"><span className="text-slate-500">Gender</span><span>{selectedAdmission.gender || '—'}</span></div>
                          <div className="flex justify-between"><span className="text-slate-500">Date of Birth</span><span>{selectedAdmission.dob ? new Date(selectedAdmission.dob).toLocaleDateString() : '—'}</span></div>
                          <div className="flex justify-between"><span className="text-slate-500">Age</span><span>{selectedAdmission.age || '—'} years</span></div>
                          <div className="flex justify-between"><span className="text-slate-500">Nationality</span><span>{selectedAdmission.nationality || '—'}</span></div>
                          <div className="flex justify-between"><span className="text-slate-500">Religion</span><span>{selectedAdmission.religion || '—'}</span></div>
                        </>
                      ) : (
                        <>
                          <div><label className="block text-sm font-medium text-slate-700">Date of Birth</label><input type="date" name="dob" value={editFormData.dob} onChange={handleEditChange} className="mt-1 w-full px-3 py-2 border rounded-lg" /></div>
                          <div><label className="block text-sm font-medium text-slate-700">Age</label><input type="number" name="age" value={editFormData.age} onChange={handleEditChange} className="mt-1 w-full px-3 py-2 border rounded-lg" /></div>
                          <div><label className="block text-sm font-medium text-slate-700">Nationality</label><input type="text" name="nationality" value={editFormData.nationality} onChange={handleEditChange} className="mt-1 w-full px-3 py-2 border rounded-lg" /></div>
                          <div><label className="block text-sm font-medium text-slate-700">Religion</label><input type="text" name="religion" value={editFormData.religion} onChange={handleEditChange} className="mt-1 w-full px-3 py-2 border rounded-lg" /></div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Contact Information */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 border-b-2 border-indigo-200 pb-2 flex items-center gap-2">
                      <FaPhone className="text-indigo-600" /> Contact Information
                    </h3>
                    <div className="mt-4 space-y-3">
                      {!isEditing ? (
                        <>
                          <div className="flex justify-between"><span className="text-slate-500">Phone</span><span className="font-mono">{selectedAdmission.parentPhone || '—'}</span></div>
                          <div className="flex justify-between"><span className="text-slate-500">Email</span><span className="break-all">{selectedAdmission.parentEmail || '—'}</span></div>
                          <div className="flex justify-between"><span className="text-slate-500">Parent/Guardian</span><span>{selectedAdmission.parentName || '—'} ({selectedAdmission.relationship || '—'})</span></div>
                          <div className="flex justify-between"><span className="text-slate-500">Address</span><span>{selectedAdmission.address || '—'}</span></div>
                        </>
                      ) : (
                        <>
                          <div><label className="block text-sm font-medium text-slate-700">Parent Name</label><input type="text" name="parentName" value={editFormData.parentName} onChange={handleEditChange} className="mt-1 w-full px-3 py-2 border rounded-lg" /></div>
                          <div><label className="block text-sm font-medium text-slate-700">Relationship</label><input type="text" name="relationship" value={editFormData.relationship} onChange={handleEditChange} className="mt-1 w-full px-3 py-2 border rounded-lg" /></div>
                          <div><label className="block text-sm font-medium text-slate-700">Phone</label><input type="tel" name="parentPhone" value={editFormData.parentPhone} onChange={handleEditChange} className="mt-1 w-full px-3 py-2 border rounded-lg" /></div>
                          <div><label className="block text-sm font-medium text-slate-700">Email</label><input type="email" name="parentEmail" value={editFormData.parentEmail} onChange={handleEditChange} className="mt-1 w-full px-3 py-2 border rounded-lg" /></div>
                          <div><label className="block text-sm font-medium text-slate-700">Address</label><textarea name="address" value={editFormData.address} onChange={handleEditChange} rows="2" className="mt-1 w-full px-3 py-2 border rounded-lg"></textarea></div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 border-b-2 border-indigo-200 pb-2 flex items-center gap-2">
                      <FaGraduationCap className="text-indigo-600" /> Academic Information
                    </h3>
                    <div className="mt-4 space-y-3">
                      {!isEditing ? (
                        <>
                          <div className="flex justify-between"><span className="text-slate-500">Applying for</span><span className="font-semibold">{selectedAdmission.applyingGrade || '—'}</span></div>
                          <div className="flex justify-between"><span className="text-slate-500">Previous school</span><span>{selectedAdmission.lastSchool || '—'}</span></div>
                          <div className="flex justify-between"><span className="text-slate-500">Previous Grade</span><span>{selectedAdmission.lastGrade || '—'}</span></div>
                          <div className="flex justify-between"><span className="text-slate-500">Grade Average</span><span>{selectedAdmission.gradeAverage || '—'}%</span></div>
                          <div className="flex justify-between"><span className="text-slate-500">Condition</span><span>{selectedAdmission.condition || '—'}</span></div>
                        </>
                      ) : (
                        <>
                          <div><label className="block text-sm font-medium text-slate-700">Previous School</label><input type="text" name="lastSchool" value={editFormData.lastSchool} onChange={handleEditChange} className="mt-1 w-full px-3 py-2 border rounded-lg" /></div>
                          <div><label className="block text-sm font-medium text-slate-700">Previous Grade</label><input type="text" name="lastGrade" value={editFormData.lastGrade} onChange={handleEditChange} className="mt-1 w-full px-3 py-2 border rounded-lg" /></div>
                          <div><label className="block text-sm font-medium text-slate-700">Grade Average (%)</label><input type="number" name="gradeAverage" value={editFormData.gradeAverage} onChange={handleEditChange} className="mt-1 w-full px-3 py-2 border rounded-lg" /></div>
                          <div><label className="block text-sm font-medium text-slate-700">Condition</label><input type="text" name="condition" value={editFormData.condition} onChange={handleEditChange} placeholder="e.g., Regular, Conditional" className="mt-1 w-full px-3 py-2 border rounded-lg" /></div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 border-b-2 border-indigo-200 pb-2 flex items-center gap-2">
                      <FaIdCard className="text-indigo-600" /> Additional Information
                    </h3>
                    <div className="mt-4 space-y-3">
                      {!isEditing ? (
                        <>
                          <div className="flex justify-between"><span className="text-slate-500">FAN/FIN Number</span><span>{selectedAdmission.fayida || '—'}</span></div>
                          <div className="flex justify-between"><span className="text-slate-500">Program</span><span>{selectedAdmission.program || '—'}</span></div>
                          <div className="flex justify-between"><span className="text-slate-500">Field of Study</span><span>{selectedAdmission.field || '—'}</span></div>
                          <div className="flex justify-between"><span className="text-slate-500">Applied on</span><span>{selectedAdmission.createdAt ? new Date(selectedAdmission.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}</span></div>
                        </>
                      ) : (
                        <>
                          <div><label className="block text-sm font-medium text-slate-700">FAN/FIN Number</label><input type="text" name="fayida" value={editFormData.fayida} onChange={handleEditChange} className="mt-1 w-full px-3 py-2 border rounded-lg" /></div>
                          <div><label className="block text-sm font-medium text-slate-700">Program</label><input type="text" name="program" value={editFormData.program} onChange={handleEditChange} className="mt-1 w-full px-3 py-2 border rounded-lg" /></div>
                          <div><label className="block text-sm font-medium text-slate-700">Field of Study</label><input type="text" name="field" value={editFormData.field} onChange={handleEditChange} className="mt-1 w-full px-3 py-2 border rounded-lg" /></div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-5 bg-slate-50 rounded-b-3xl flex justify-between items-center">
              <div className="text-sm text-slate-500">
                Last updated: {selectedAdmission.updatedAt ? new Date(selectedAdmission.updatedAt).toLocaleDateString() : 'N/A'}
              </div>
              <button onClick={() => { setSelectedAdmission(null); setIsEditing(false); }} className="px-6 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-100 transition">Close</button>
            </div>
          </div>
        </div>
      )}

    </>
  );
};
       
export default StudentSeeProfile;