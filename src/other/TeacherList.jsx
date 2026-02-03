import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Mail, Phone, MapPin, Calendar, 
  Briefcase, GraduationCap, Printer, Download, 
  BookOpen, Award, Clock, User, ChevronDown, ChevronUp,
  X, Loader2, Eye, EyeOff
} from 'lucide-react';
import Footer from '../components/Footer';
import Bg from '../assets/tech1.jpg';
import axios from 'axios';
// import anim7 from '../assets/gal5.jpg';
import { Helmet } from "react-helmet-async";

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [expandedTeacherId, setExpandedTeacherId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Load teachers from localStorage



useEffect(() => {
  const fetchTeachers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://tullu-dimtu-school-backend-1.onrender.com/api/teachers');
      setTeachers(response.data); // ✅ Axios stores JSON in response.data
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchTeachers();
}, []);




  // Get unique departments
  const departments = ['all', ...new Set(teachers.map(t => t.department).filter(Boolean))];

  // Sort teachers
  const sortedTeachers = [...teachers].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'name':
        aValue = a.fullName?.toLowerCase() || '';
        bValue = b.fullName?.toLowerCase() || '';
        break;
      case 'experience':
        aValue = parseInt(a.yearsOfExperience) || 0;
        bValue = parseInt(b.yearsOfExperience) || 0;
        break;
      case 'department':
        aValue = a.department?.toLowerCase() || '';
        bValue = b.department?.toLowerCase() || '';
        break;
      case 'joining':
        aValue = new Date(a.joiningDate);
        bValue = new Date(b.joiningDate);
        break;
      default:
        aValue = a.fullName?.toLowerCase() || '';
        bValue = b.fullName?.toLowerCase() || '';
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Filter teachers
  const filteredTeachers = sortedTeachers.filter(teacher => {
    const matchesSearch = 
      teacher.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.currentSubjects?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.highestDegree?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.university?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDept = filterDept === 'all' || teacher.department === filterDept;
    return matchesSearch && matchesDept;
  });

  // Calculate statistics
  const totalTeachers = teachers.length;
  const totalDepartments = departments.length - 1;
  const avgExperience = teachers.length > 0 
    ? (teachers.reduce((sum, t) => sum + (parseInt(t.yearsOfExperience) || 0), 0) / teachers.length).toFixed(1)
    : 0;
  const maleTeachers = teachers.filter(t => t.gender?.toLowerCase() === 'male').length;
  const femaleTeachers = teachers.filter(t => t.gender?.toLowerCase() === 'female').length;

  // Toggle teacher details
  const toggleTeacherDetails = (teacherId) => {
    setExpandedTeacherId(expandedTeacherId === teacherId ? null : teacherId);
  };

  // View full profile
  const viewFullProfile = (teacher) => {
    setSelectedTeacher(teacher);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTeacher(null);
  };

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  // Export to CSV
  const exportToCSV = () => {
    if (filteredTeachers.length === 0) return;
    
    const headers = [
      'Name', 'Email', 'Phone', 'Employee ID', 'Department', 'Position', 
      'Experience', 'Joining Date', 'Date of Birth', 'Address', 'Gender',
      'Highest Degree', 'University', 'Graduation Year', 'Specialization',
      'Current Subjects', 'Additional Qualifications'
    ];
    
    const csvData = filteredTeachers.map(t => [
      t.fullName || '',
      t.email || '',
      t.phone || '',
      t.employeeId || '',
      t.department || '',
      t.position || '',
      t.yearsOfExperience || '',
      t.joiningDate || '',
      t.dateOfBirth || '',
      t.address || '',
      t.gender || '',
      t.highestDegree || '',
      t.university || '',
      t.graduationYear || '',
      t.specialization || '',
      t.currentSubjects || '',
      t.additionalQualifications || ''
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `teachers-complete-list-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Print function
  const printList = () => {
    window.print();
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setFilterDept('all');
    setSortBy('name');
    setSortOrder('asc');
  };

  return (
    <>
  <Helmet>
        <title>Teacher List | Tullu Dimtu Secondary School</title>
          </Helmet>

      {/* Enhanced Background with Parallax Effect */}
      <div className="fixed inset-0 z-[-2] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${Bg})`,
            backgroundAttachment: 'fixed',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: 'scale(1.05)',
            filter: 'brightness(0.4) sepia(0.3) hue-rotate(15deg)'
          }}
        />
        
        {/* Multiple Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-purple-900/30 to-blue-900/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-gray-900/60" />
        
        {/* Animated Particles */}
        <div className="absolute inset-0">
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-float"
              style={{
                width: `${Math.random() * 4 + 1}px`,
                height: `${Math.random() * 4 + 1}px`,
                background: `rgba(255, 255, 255, ${Math.random() * 0.3})`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${15 + Math.random() * 20}s`,
              }}
            />
          ))}
        </div>
        
        {/* Grid Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(to right, #ccc 1px, transparent 1px),
                              linear-gradient(to bottom, #ccc 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-transparent border-t-white rounded-full animate-spin"></div>
              <div className="absolute inset-4 border-4 border-white/10 rounded-full"></div>
              <div className="absolute inset-8 border-4 border-transparent border-b-white rounded-full animate-ping"></div>
            </div>
            <p className="text-white text-xl font-semibold animate-pulse">Loading Teacher Directory...</p>
            <p className="text-white/60 mt-2">Please wait while we prepare the data</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 print:bg-white print:py-4 relative">
      

      
        <div className="max-w-7xl mx-auto">
          
          <div className="mb-10 mt-12 sm:mt-16 text-center">
            <div className="inline-block p-8 sm:p-10 mb-6  shadow-2xl relative overflow-hidden group">
              {/* Animated Border */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              
               <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white ">
                    Teacher List
                  </h1>

            </div>
          </div>




          {/* Enhanced Statistics Cards */}
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
              { 
                title: 'Total Faculty', 
                value: totalTeachers, 
                icon: User, 
                color: 'from-blue-500 to-cyan-500',
                bg: 'bg-blue-500/10'
              },
              { 
                title: 'Departments', 
                value: totalDepartments, 
                icon: GraduationCap, 
                color: 'from-purple-500 to-pink-500',
                bg: 'bg-purple-500/10'
              },
              { 
                title: 'Avg Experience', 
                value: `${avgExperience} years`, 
                icon: Clock, 
                color: 'from-green-500 to-emerald-500',
                bg: 'bg-green-500/10'
              },
              { 
                title: 'Gender Ratio', 
                value: `${maleTeachers}M : ${femaleTeachers}F`, 
                icon: User, 
                color: 'from-orange-500 to-red-500',
                bg: 'bg-orange-500/10'
              }
            ].map((stat, index) => (
              <div 
                key={index}
                className="backdrop-blur-lg bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 group overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm font-medium mb-2">{stat.title}</p>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                  </div>
                  <div className={`w-14 h-14 rounded-xl ${stat.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`text-white`} size={24} />
                  </div>
                </div>
                <div className="mt-4 h-1 bg-gradient-to-r opacity-30 group-hover:opacity-70 transition-opacity duration-300" />
              </div>
            ))}
          </div> */}






          {/* Enhanced Search and Filter Section */}
          <div className=" bg-white/5 rounded-3xl shadow-2xl p-6 sm:p-8 mb-10 border border-white/10 print:hidden">
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative">
                  <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-white/60 group-hover:text-white/80 transition-colors" size={22} />
                  <input
                    type="text"
                    placeholder="Search teachers by name, email, ID, subjects, or qualifications..."
                    className="w-full pl-14 pr-12 py-4 bg-white/10 text-white placeholder-white/50 rounded-xl focus:ring-2 focus:ring-blue-400 focus:bg-white/15 focus:outline-none transition-all duration-300 border border-white/20 hover:border-white/30"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              </div>

              {/* Filters and Controls */}
              <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                <div className="flex flex-wrap gap-4 items-center">
                  {/* Department Filter */}
                  <div className="relative group">
                    <div className="flex items-center gap-3 backdrop-blur-sm bg-white/10 rounded-xl p-3 border border-white/20 group-hover:border-white/30 transition-colors">
                      <Filter size={20} className="text-white/60 group-hover:text-white/80" />
                      <select
                        className="bg-transparent text-white border-none focus:outline-none focus:ring-0 cursor-pointer"
                        value={filterDept}
                        onChange={(e) => setFilterDept(e.target.value)}
                      >
                        {departments.map(dept => (
                          <option key={dept} value={dept} className="bg-gray-900">
                            {dept === 'all' ? 'All Departments' : dept}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Sort Options */}
                  <div className="relative group">
                    <div className="flex items-center gap-3 backdrop-blur-sm bg-white/10 rounded-xl p-3 border border-white/20 group-hover:border-white/30 transition-colors">
                      <button
                        onClick={toggleSortOrder}
                        className="text-white/60 hover:text-white transition-colors"
                        title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                      >
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </button>
                      <select
                        className="bg-transparent text-white border-none focus:outline-none focus:ring-0 cursor-pointer"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <option value="name" className="bg-gray-900">Sort by Name</option>
                        <option value="experience" className="bg-gray-900">Sort by Experience</option>
                        <option value="department" className="bg-gray-900">Sort by Department</option>
                        <option value="joining" className="bg-gray-900">Sort by Joining Date</option>
                      </select>
                    </div>
                  </div>

                  {/* View Toggle */}
                  <div className="flex backdrop-blur-sm bg-white/10 rounded-xl overflow-hidden border border-white/20">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`px-4 py-2 transition-all flex items-center gap-2 ${viewMode === 'grid' ? 'bg-white/20 text-white' : 'text-white/60 hover:bg-white/5'}`}
                    >
                      <div className="grid grid-cols-2 gap-0.5">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="w-2 h-2 bg-current rounded-sm" />
                        ))}
                      </div>
                      Grid
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`px-4 py-2 transition-all flex items-center gap-2 ${viewMode === 'list' ? 'bg-white/20 text-white' : 'text-white/60 hover:bg-white/5'}`}
                    >
                      <div className="space-y-1">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="w-4 h-0.5 bg-current rounded-full" />
                        ))}
                      </div>
                      List
                    </button>
                  </div>

                  <a href='/teacher-profile'>
                <button className={`px-4 py-2 rounded-lg font-medium transition duration-300 bg-blue-200 text-gray-700 hover:bg-gray-300`}>
                  New Teacher
                </button>
               </a>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  {(searchTerm || filterDept !== 'all') && (
                    <button
                      onClick={clearFilters}
                      className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl flex items-center gap-2 transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-white/20"
                    >
                      <X size={18} />
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Teachers Display Section */}
          <div className="relative">
            {/* Results Count */}
            <div className="mb-6 flex items-center justify-between">
              <div className="text-white">
                <h2 className="text-2xl font-bold">Faculty Members</h2>
                <p className="text-gray-300 mt-1">
                  Showing <span className="font-bold text-white">{filteredTeachers.length}</span> of{' '}
                  <span className="font-bold text-white">{teachers.length}</span> teachers
                  {filterDept !== 'all' && (
                    <span className="ml-3">
                      in <span className="font-semibold text-blue-300">{filterDept}</span>
                    </span>
                  )}
                </p>
              </div>
              <div className="text-white/60 text-sm print:hidden">
                {viewMode === 'grid' ? 'Grid View' : 'List View'}
              </div>
            </div>

            {/* Teachers Grid/List */}
            {filteredTeachers.length > 0 ? (
              <>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredTeachers.map((teacher, index) => (
                      <div 
                        key={teacher.id}
                        className="backdrop-blur-lg bg-white/5 rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] border border-white/10 hover:border-white/20 group"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {/* Teacher Card Header */}
                        <div className="relative h-56 overflow-hidden">
                          {/* Background Gradient */}
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20"></div>
                          
                          {/* Profile Section */}
                          <div className="relative p-6 h-full flex flex-col">
                            {/* Profile Image and Badges */}
                            <div className="flex items-start justify-between mb-4">
                              <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-md opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
                                <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-white/30 group-hover:border-white/50 transition-all duration-300">
                                  {teacher.profileImage ? (
                                    <img 
                                      src={teacher.profileImage} 
                                      alt={teacher.fullName}
                                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-blue-200 to-purple-300 flex items-center justify-center">
                                      <User className="text-blue-600" size={32} />
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {/* Status Badge */}
                              <div className="px-3 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-full border border-green-500/30">
                                <span className="text-green-300 text-sm font-medium">Active</span>
                              </div>
                            </div>
                            
                            {/* Name and Title */}
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-white group-hover:text-white/90 mb-2">
                                {teacher.fullName}
                              </h3>
                              <p className="text-gray-300 mb-4">{teacher.position}</p>
                              
                              {/* Department and ID */}
                              <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 bg-white/10 text-white text-xs font-medium rounded-full backdrop-blur-sm border border-white/20">
                                  {teacher.department}
                                </span>
                                <span className="px-3 py-1 bg-white/10 text-white text-xs font-medium rounded-full backdrop-blur-sm border border-white/20">
                                  ID: {teacher.employeeId}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-6">
                          {/* Quick Info */}
                          <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="space-y-1">
                              <p className="text-gray-400 text-xs">Experience</p>
                              <p className="text-white font-semibold">{teacher.yearsOfExperience || '0'} years</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-gray-400 text-xs">Joined</p>
                              <p className="text-white font-semibold">{teacher.joiningDate || 'N/A'}</p>
                            </div>
                          </div>

                          {/* Contact Info */}
                          <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                                <Mail size={14} className="text-blue-300" />
                              </div>
                              <span className="text-white/90 truncate text-sm">{teacher.email}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                                <Phone size={14} className="text-green-300" />
                              </div>
                              <span className="text-white/90 text-sm">{teacher.phone}</span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-3">
                            <button
                              onClick={() => toggleTeacherDetails(teacher.id)}
                              className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl flex items-center justify-center gap-2 transition-all duration-300 group"
                            >
                              {expandedTeacherId === teacher.id ? (
                                <>
                                  <EyeOff size={18} />
                                  Less
                                </>
                              ) : (
                                <>
                                  <Eye size={18} />
                                  Details
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => viewFullProfile(teacher)}
                              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 group"
                            >
                              <span className="group-hover:scale-110 transition-transform">View</span>
                            </button>
                          </div>
                        </div>

                        {/* Expanded Details */}
                        {expandedTeacherId === teacher.id && (
                          <div className="px-6 pb-6 animate-slideDown">
                            <div className="pt-6 border-t border-white/10">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <h4 className="text-white font-semibold flex items-center gap-2">
                                    <GraduationCap size={18} className="text-blue-300" />
                                    Education
                                  </h4>
                                  <div className="space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-white/70 text-sm">Degree</span>
                                      <span className="text-white font-medium">{teacher.highestDegree}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-white/70 text-sm">University</span>
                                      <span className="text-white font-medium">{teacher.university}</span>
                                    </div>
                                    {teacher.specialization && (
                                      <div className="flex justify-between">
                                        <span className="text-white/70 text-sm">Specialization</span>
                                        <span className="text-white font-medium">{teacher.specialization}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="space-y-4">
                                  <h4 className="text-white font-semibold flex items-center gap-2">
                                    <BookOpen size={18} className="text-green-300" />
                                    Teaching
                                  </h4>
                                  <div className="space-y-2">
                                    <div>
                                      <p className="text-white/70 text-sm mb-1">Subjects</p>
                                      <p className="text-white">{teacher.currentSubjects || 'Not specified'}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  /* List View */
                  <div className="space-y-6">
                    {filteredTeachers.map((teacher, index) => (
                      <div 
                        key={teacher.id}
                        className="backdrop-blur-lg bg-white/5 rounded-2xl shadow-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 group"
                      >
                        <div className="p-6">
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            {/* Left Section - Profile */}
                            <div className="flex items-center gap-6">
                              <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                                <div className="relative w-20 h-20 rounded-full overflow-hidden border-3 border-white/20 group-hover:border-white/30 transition-colors">
                                  {teacher.profileImage ? (
                                    <img 
                                      src={teacher.profileImage} 
                                      alt={teacher.fullName}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-blue-200 to-purple-200 flex items-center justify-center">
                                      <User className="text-blue-600" size={28} />
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div>
                                <h3 className="text-xl font-bold text-white mb-2">
                                  {teacher.fullName}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                  <span className="px-3 py-1 bg-white/10 text-white text-sm font-medium rounded-full">
                                    {teacher.department}
                                  </span>
                                  <span className="px-3 py-1 bg-white/10 text-white text-sm font-medium rounded-full">
                                    {teacher.position}
                                  </span>
                                  <span className="px-3 py-1 bg-white/10 text-white text-sm font-medium rounded-full">
                                    ID: {teacher.employeeId}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Right Section - Actions */}
                            <div className="flex items-center gap-4">
                              <div className="text-right hidden lg:block">
                                <p className="text-white font-semibold">{teacher.yearsOfExperience || '0'} years exp</p>
                                <p className="text-gray-300 text-sm">Joined {teacher.joiningDate}</p>
                              </div>
                              <button
                                onClick={() => toggleTeacherDetails(teacher.id)}
                                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl flex items-center gap-2 transition-colors"
                              >
                                {expandedTeacherId === teacher.id ? 'Hide Details' : 'View Details'}
                                {expandedTeacherId === teacher.id ? (
                                  <ChevronUp size={20} />
                                ) : (
                                  <ChevronDown size={20} />
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Expanded Details */}
                          {expandedTeacherId === teacher.id && (
                            <div className="mt-6 pt-6 border-t border-white/10">
                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="space-y-4">
                                  <h4 className="text-white font-semibold">Contact Information</h4>
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                      <Mail size={18} className="text-blue-300" />
                                      <span className="text-white">{teacher.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <Phone size={18} className="text-green-300" />
                                      <span className="text-white">{teacher.phone}</span>
                                    </div>
                                    {teacher.address && (
                                      <div className="flex items-start gap-3">
                                        <MapPin size={18} className="text-red-300 mt-0.5" />
                                        <span className="text-white">{teacher.address}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="space-y-4">
                                  <h4 className="text-white font-semibold">Education</h4>
                                  <div className="space-y-3">
                                    <div>
                                      <p className="text-white/70 text-sm">Highest Degree</p>
                                      <p className="text-white font-medium">{teacher.highestDegree}</p>
                                    </div>
                                    <div>
                                      <p className="text-white/70 text-sm">University</p>
                                      <p className="text-white font-medium">{teacher.university}</p>
                                    </div>
                                    {teacher.graduationYear && (
                                      <div>
                                        <p className="text-white/70 text-sm">Graduation Year</p>
                                        <p className="text-white font-medium">{teacher.graduationYear}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="space-y-4">
                                  <h4 className="text-white font-semibold">Professional Details</h4>
                                  <div className="space-y-3">
                                    <div>
                                      <p className="text-white/70 text-sm">Current Subjects</p>
                                      <p className="text-white">{teacher.currentSubjects || 'Not specified'}</p>
                                    </div>
                                    {teacher.additionalQualifications && (
                                      <div>
                                        <p className="text-white/70 text-sm">Qualifications</p>
                                        <p className="text-white text-sm">{teacher.additionalQualifications}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* No Results */}
                {filteredTeachers.length === 0 && (
                  <div className="text-center py-20 backdrop-blur-lg bg-white/5 rounded-3xl border border-white/10">
                    <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-white/5 to-white/10 rounded-full flex items-center justify-center">
                      <Search className="text-white/30" size={64} />
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-3">No Matching Teachers Found</h3>
                    <p className="text-white/60 text-lg max-w-md mx-auto mb-8">
                      Try adjusting your search criteria or browse all teachers
                    </p>
                    <button
                      onClick={clearFilters}
                      className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
                    >
                      View All Teachers
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Empty State */
              <div className="text-center py-20 backdrop-blur-lg bg-white/5 rounded-3xl border border-white/10">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-white/5 to-white/10 rounded-full flex items-center justify-center">
                  <User className="text-white/30" size={64} />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">No Teachers Available</h3>
                <p className="text-white/60 text-lg max-w-md mx-auto mb-8">
                  No teacher profiles have been added yet. Start by adding the first teacher.
                </p>
                <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg">
                  Add First Teacher
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Teacher Detail Modal */}
      {isModalOpen && selectedTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div 
            className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-b from-gray-900 to-transparent p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur"></div>
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-4 border-white/30">
                      {selectedTeacher.profileImage ? (
                        <img 
                          src={selectedTeacher.profileImage} 
                          alt={selectedTeacher.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-200 to-purple-300 flex items-center justify-center">
                          <User className="text-blue-600" size={28} />
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedTeacher.fullName}</h2>
                    <p className="text-gray-300">{selectedTeacher.position} • {selectedTeacher.department}</p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="text-white" size={24} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-8">
                  <div className="bg-white/5 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Personal Information</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-400 text-sm">Employee ID</p>
                          <p className="text-white font-medium">{selectedTeacher.employeeId}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Gender</p>
                          <p className="text-white font-medium">{selectedTeacher.gender || 'N/A'}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Date of Birth</p>
                        <p className="text-white font-medium">{selectedTeacher.dateOfBirth || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Address</p>
                        <p className="text-white">{selectedTeacher.address || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <BookOpen size={20} />
                      Teaching Details
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-gray-400 text-sm">Current Subjects</p>
                        <p className="text-white">{selectedTeacher.currentSubjects || 'Not specified'}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-400 text-sm">Experience</p>
                          <p className="text-white font-medium">{selectedTeacher.yearsOfExperience || '0'} years</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Joined On</p>
                          <p className="text-white font-medium">{selectedTeacher.joiningDate || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                  <div className="bg-white/5 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <GraduationCap size={20} />
                      Education
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-400 text-sm">Highest Degree</p>
                          <p className="text-white font-medium">{selectedTeacher.highestDegree}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">University</p>
                          <p className="text-white font-medium">{selectedTeacher.university}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-400 text-sm">Graduation Year</p>
                          <p className="text-white font-medium">{selectedTeacher.graduationYear || 'N/A'}</p>
                        </div>
                        {selectedTeacher.specialization && (
                          <div>
                            <p className="text-gray-400 text-sm">Specialization</p>
                            <p className="text-white font-medium">{selectedTeacher.specialization}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <Award size={20} />
                      Contact & Additional Info
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-gray-400 text-sm">Email</p>
                        <p className="text-white">{selectedTeacher.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Phone</p>
                        <p className="text-white">{selectedTeacher.phone}</p>
                      </div>
                      {selectedTeacher.additionalQualifications && (
                        <div>
                          <p className="text-gray-400 text-sm">Additional Qualifications</p>
                          <p className="text-white text-sm">{selectedTeacher.additionalQualifications}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gradient-to-t from-gray-900 to-transparent p-6 border-t border-white/10">
              <div className="flex justify-end gap-4">
                <button
                  onClick={closeModal}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    // Add contact action
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all"
                >
                  Contact Teacher
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Footer */}
      <Footer />
      
      {/* Custom Styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideDown {
          from { max-height: 0; opacity: 0; }
          to { max-height: 500px; opacity: 1; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        
        .animate-float {
          animation: float infinite linear;
        }
        
        /* Hide scrollbar but allow scrolling */
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        /* Print styles */
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          
          body {
            background: white !important;
            color: black !important;
          }
          
          .bg-transparent {
            background: white !important;
          }
        }
      `}</style>
    </>
  );
};

export default TeacherList;
