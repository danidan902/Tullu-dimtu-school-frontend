import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Eye, Download, ChevronLeft, Menu, X } from 'lucide-react';

const API_URL = 'https://tullu-dimtu-school-backend-1.onrender.com/api/registrations';

const Dashboard = () => {
  const [registrations, setRegistrations] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterProgram, setFilterProgram] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const roleOptions = ['Student', 'Mentor', 'Instructor', 'Program Coordinator', 'Volunteer', 'Guest Speaker'];
  
  // Program options
  const programOptions = ['STEM Program', 'Leadership Program', 'Technology and Innovation', 'Arts and Humanities', 'Cultural Day'];

  // Fetch data on component mount
  useEffect(() => {
    fetchRegistrations();
    fetchStatistics();
  }, []);

  // Fetch registrations from backend
  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      if (response.data.success) {
        setRegistrations(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
      setError('Failed to load registrations');
    } finally {
      setLoading(false);
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

  // Handle view registration details
  const handleView = (registration) => {
    setSelectedRegistration(registration);
    setShowViewModal(true);
  };

  // Handle download selected registrations as CSV
  const handleDownloadSelectedCSV = () => {
    if (selectedRows.length === 0) {
      alert('Please select registrations to download');
      return;
    }

    const selectedRegistrations = registrations.filter(reg => selectedRows.includes(reg.id));
    downloadAsCSV(selectedRegistrations, `selected_registrations_${selectedRows.length}`);
  };

  // Handle download all filtered registrations as CSV
  const handleDownloadAllCSV = () => {
    if (filteredRegistrations.length === 0) {
      alert('No registrations to download');
      return;
    }

    downloadAsCSV(filteredRegistrations, `all_registrations_${filteredRegistrations.length}`);
  };

  // Common function to download as CSV
  const downloadAsCSV = (data, filenamePrefix) => {
    const headers = ['Full Name', 'Role', 'Program', 'Grade', 'Phone', 'Email', 'Registration Date', 'Program Day', 'Additional Info'];
    
    const csvContent = [
      headers.join(','),
      ...data.map(reg => [
        `"${reg.fullName}"`,
        `"${reg.role}"`,
        `"${reg.program}"`,
        `"${reg.grade}"`,
        `"${reg.phone}"`,
        `"${reg.email || ''}"`,
        `"${formatDateForCSV(reg.registrationDate)}"`,
        `"${formatDateForCSV(reg.day)}"`,
        `"${(reg.additionalInfo || '').replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const dataUri = 'data:text/csv;charset=utf-8,'+ encodeURIComponent(csvContent);
    
    const exportFileDefaultName = `${filenamePrefix}_${new Date().toISOString().split('T')[0]}.csv`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Helper function to format date for CSV
  const formatDateForCSV = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle delete registration
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this registration?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        // Remove from local state
        setRegistrations(registrations.filter(reg => reg.id !== id));
        // Refresh statistics
        fetchStatistics();
      } catch (error) {
        console.error('Error deleting registration:', error);
        alert('Failed to delete registration');
      }
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) {
      alert('Please select registrations to delete');
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${selectedRows.length} registration(s)?`)) {
      try {
        // Delete each selected registration
        for (const id of selectedRows) {
          await axios.delete(`${API_URL}/${id}`);
        }
        // Refresh data
        fetchRegistrations();
        fetchStatistics();
        setSelectedRows([]);
      } catch (error) {
        console.error('Error bulk deleting:', error);
        alert('Failed to delete registrations');
      }
    }
  };

  // Handle row selection
  const handleRowSelect = (id) => {
    setSelectedRows(prev => {
      if (prev.includes(id)) {
        return prev.filter(rowId => rowId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedRows.length === filteredRegistrations.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredRegistrations.map(reg => reg.id));
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format datetime
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter registrations based on search and filters
  const filteredRegistrations = registrations.filter(registration => {
    const matchesSearch = searchTerm === '' || 
      registration.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.phone.includes(searchTerm) ||
      registration.program.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === '' || registration.role === filterRole;
    const matchesProgram = filterProgram === '' || registration.program === filterProgram;
    
    return matchesSearch && matchesRole && matchesProgram;
  });

  // Calculate statistics for filtered data
  const filteredStats = {
    total: filteredRegistrations.length,
    byRole: filteredRegistrations.reduce((acc, reg) => {
      acc[reg.role] = (acc[reg.role] || 0) + 1;
      return acc;
    }, {}),
    byProgram: filteredRegistrations.reduce((acc, reg) => {
      acc[reg.program] = (acc[reg.program] || 0) + 1;
      return acc;
    }, {})
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Toggle */}
      <div className="md:hidden fixed top-4 right-4 z-30">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* View Details Modal */}
      {showViewModal && selectedRegistration && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-2 sm:mx-4">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  Registration Details
                </h3>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="px-4 sm:px-6 py-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Full Name</label>
                    <p className="mt-1 text-gray-900">{selectedRegistration.fullName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Role</label>
                    <p className="mt-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${
                        selectedRegistration.role === 'Student' 
                          ? 'bg-blue-100 text-blue-800'
                          : selectedRegistration.role === 'Mentor'
                          ? 'bg-green-100 text-green-800'
                          : selectedRegistration.role === 'Instructor'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedRegistration.role}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Program</label>
                    <p className="mt-1 text-gray-900">{selectedRegistration.program}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Grade</label>
                    <p className="mt-1 text-gray-900">{selectedRegistration.grade}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="mt-1 text-gray-900">{selectedRegistration.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="mt-1 text-gray-900">{selectedRegistration.email || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Registration Date</label>
                    <p className="mt-1 text-gray-900">{formatDateTime(selectedRegistration.registrationDate)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Program Day</label>
                    <p className="mt-1 text-gray-900">{formatDate(selectedRegistration.day)}</p>
                  </div>
                </div>
                {selectedRegistration.additionalInfo && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Additional Information</label>
                    <p className="mt-1 text-gray-900 whitespace-pre-wrap">{selectedRegistration.additionalInfo}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => downloadAsCSV([selectedRegistration], `registration_${selectedRegistration.fullName.replace(/\s+/g, '_')}`)}
                className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 w-full sm:w-auto"
              >
                <Download className="w-4 h-4 mr-2" />
                Download as CSV
              </button>
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 w-full sm:w-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-gray-500 bg-opacity-75 z-40" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* Mobile Menu */}
      <div className={`md:hidden fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
        isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="space-y-4">
            <button
              onClick={() => {
                handleDownloadAllCSV();
                setIsMobileMenuOpen(false);
              }}
              disabled={filteredRegistrations.length === 0}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition ${filteredRegistrations.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}
            >
              <Download className="w-4 h-4 mr-2" />
              Download All ({filteredRegistrations.length})
            </button>
            <button
              onClick={() => {
                fetchRegistrations();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center w-full px-4 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition"
            >
              Refresh Data
            </button>
            <button
              onClick={() => {
                navigate('/admin-control');
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Admin
            </button>
          </div>
        </div>
      </div>

      <div className="fixed left-2 sm:left-4 top-2 sm:top-4 z-20">
        <button
          onClick={() => navigate('/admin-control')}
          className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
      </div>

      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="mb-4 md:mb-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 md:ml-24 text-center md:text-left">
                Student Academics <span className='text-blue-700'>Registration Dashboard </span>
              </h1>
              <p className="text-gray-600 mt-1 md:mt-2 md:ml-24 text-center md:text-left text-sm sm:text-base">
                Manage all program registrations in one place
              </p>
            </div>
            <div className="hidden md:flex space-x-4">
              <div className="flex space-x-2">
                <button
                  onClick={handleDownloadAllCSV}
                  disabled={filteredRegistrations.length === 0}
                  className={`flex items-center px-4 py-2 rounded-lg transition ${filteredRegistrations.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download All ({filteredRegistrations.length})
                </button>
              </div>
              <button
                onClick={fetchRegistrations}
                className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl shadow p-3 sm:p-6">
            <div className="text-gray-500 text-xs sm:text-sm font-medium mb-1 sm:mb-2">Total Registrations</div>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{registrations.length}</div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-3 sm:p-6">
            <div className="text-gray-500 text-xs sm:text-sm font-medium mb-1 sm:mb-2">Students</div>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600">
              {registrations.filter(r => r.role === 'Student').length}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-3 sm:p-6">
            <div className="text-gray-500 text-xs sm:text-sm font-medium mb-1 sm:mb-2">Staff</div>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600">
              {registrations.filter(r => ['Mentor', 'Instructor', 'Program Coordinator'].includes(r.role)).length}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-3 sm:p-6">
            <div className="text-gray-500 text-xs sm:text-sm font-medium mb-1 sm:mb-2">Today</div>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-600">
              {registrations.filter(r => {
                const today = new Date().toDateString();
                const regDate = new Date(r.registrationDate).toDateString();
                return today === regDate;
              }).length}
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, phone, or program..."
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              >
                <option value="">All Roles</option>
                {roleOptions.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Program</label>
              <select
                value={filterProgram}
                onChange={(e) => setFilterProgram(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              >
                <option value="">All Programs</option>
                {programOptions.map(program => (
                  <option key={program} value={program}>{program}</option>
                ))}
              </select>
            </div>
            
            <div className="md:col-start-4 flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterRole('');
                  setFilterProgram('');
                }}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm sm:text-base"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedRows.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center">
                <span className="text-blue-700 font-medium text-sm sm:text-base">
                  {selectedRows.length} registration(s) selected
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleDownloadSelectedCSV}
                  className="flex items-center px-3 py-2 bg-green-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-green-700 transition flex-1 sm:flex-none justify-center"
                >
                  <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Download Selected
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-2 bg-red-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-red-700 transition flex-1 sm:flex-none justify-center"
                >
                  Delete Selected
                </button>
                <button
                  onClick={() => setSelectedRows([])}
                  className="px-3 py-2 bg-gray-200 text-gray-700 text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-300 transition flex-1 sm:flex-none justify-center"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Registrations Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {loading ? (
            <div className="p-8 sm:p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-500">Loading registrations...</p>
            </div>
          ) : error ? (
            <div className="p-8 sm:p-12 text-center">
              <div className="text-red-600 mb-4">⚠️ {error}</div>
              <button
                onClick={fetchRegistrations}
                className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
              >
                Try Again
              </button>
            </div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="p-8 sm:p-12 text-center">
              <p className="text-gray-500 text-base sm:text-lg">No registrations found</p>
              <p className="text-gray-400 mt-2 text-sm sm:text-base">Create your first registration or adjust your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-2 sm:mx-0">
              <div className="min-w-full inline-block align-middle">
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-2 sm:px-4 py-3 text-left">
                          <input
                            type="checkbox"
                            checked={selectedRows.length === filteredRegistrations.length && filteredRegistrations.length > 0}
                            onChange={handleSelectAll}
                            className="h-4 w-4 text-blue-600 rounded"
                          />
                        </th>
                        <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                          Role
                        </th>
                        <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                          Program
                        </th>
                        <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                          Grade
                        </th>
                        <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                          Contact
                        </th>
                        <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                          Date
                        </th>
                        <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredRegistrations.map((registration) => (
                        <tr 
                          key={registration.id} 
                          className={`hover:bg-gray-50 transition ${selectedRows.includes(registration.id) ? 'bg-blue-50' : ''}`}
                        >
                          <td className="px-2 sm:px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selectedRows.includes(registration.id)}
                              onChange={() => handleRowSelect(registration.id)}
                              className="h-4 w-4 text-blue-600 rounded"
                            />
                          </td>
                          <td className="px-2 sm:px-4 py-3">
                            <div className="text-sm font-medium text-gray-900">
                              {registration.fullName}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              <div className="sm:hidden">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mb-1 ${
                                  registration.role === 'Student' 
                                    ? 'bg-blue-100 text-blue-800'
                                    : registration.role === 'Mentor'
                                    ? 'bg-green-100 text-green-800'
                                    : registration.role === 'Instructor'
                                    ? 'bg-purple-100 text-purple-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {registration.role}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500">
                                Registered: {formatDateTime(registration.registrationDate)}
                              </div>
                              <div className="sm:hidden mt-1">
                                <div className="text-xs text-gray-700">Program: {registration.program}</div>
                                <div className="text-xs text-gray-700 mt-1">Grade: {registration.grade}</div>
                                <div className="text-xs text-gray-700 mt-1">Phone: {registration.phone}</div>
                                <div className="text-xs text-gray-700 mt-1">Date: {formatDate(registration.day)}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-2 sm:px-4 py-3 hidden sm:table-cell">
                            <span className={`inline-flex px-2 sm:px-3 py-1 text-xs font-semibold rounded-full ${
                              registration.role === 'Student' 
                                ? 'bg-blue-100 text-blue-800'
                                : registration.role === 'Mentor'
                                ? 'bg-green-100 text-green-800'
                                : registration.role === 'Instructor'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {registration.role}
                            </span>
                          </td>
                          <td className="px-2 sm:px-4 py-3 hidden md:table-cell">
                            <div className="text-sm text-gray-900">{registration.program}</div>
                          </td>
                          <td className="px-2 sm:px-4 py-3 hidden lg:table-cell">
                            <div className="text-sm text-gray-900">{registration.grade}</div>
                          </td>
                          <td className="px-2 sm:px-4 py-3 hidden sm:table-cell">
                            <div className="text-sm text-gray-900">{registration.phone}</div>
                          </td>
                          <td className="px-2 sm:px-4 py-3 hidden md:table-cell">
                            <div className="text-sm text-gray-900">{formatDate(registration.day)}</div>
                          </td>
                          <td className="px-2 sm:px-4 py-3">
                            <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-1 sm:space-y-0">
                              <button
                                onClick={() => handleView(registration)}
                                className="flex items-center text-blue-600 hover:text-blue-900 text-xs sm:text-sm font-medium"
                                title="View Details"
                              >
                                <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                View
                              </button>
                              <button
                                onClick={() => downloadAsCSV([registration], `registration_${registration.fullName.replace(/\s+/g, '_')}`)}
                                className="flex items-center text-green-600 hover:text-green-900 text-xs sm:text-sm font-medium"
                                title="Download CSV"
                              >
                                <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                Download
                              </button>
                              <button
                                onClick={() => handleDelete(registration.id)}
                                className="text-red-600 hover:text-red-900 text-xs sm:text-sm font-medium"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Summary Footer */}
        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center text-xs sm:text-sm text-gray-500 space-y-2 sm:space-y-0">
          <div>
            Showing {filteredRegistrations.length} of {registrations.length} registrations
          </div>
          <div className="flex flex-wrap gap-2">
            {filterRole && (
              <span className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm">
                Role: {filterRole}
              </span>
            )}
            {filterProgram && (
              <span className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm">
                Program: {filterProgram}
              </span>
            )}
          </div>
        </div>

        {/* Program Distribution */}
        <div className="mt-6 sm:mt-8">
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Program Distribution</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {programOptions.map(program => {
              const count = registrations.filter(r => r.program === program).length;
              const percentage = registrations.length > 0 ? (count / registrations.length) * 100 : 0;
              
              return (
                <div key={program} className="bg-white rounded-lg shadow p-3 sm:p-4">
                  <div className="flex justify-between items-center mb-1 sm:mb-2">
                    <span className="text-xs sm:text-sm font-medium text-gray-700 truncate mr-2">{program}</span>
                    <span className="text-sm font-bold text-gray-900">{count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                    <div 
                      className="bg-blue-600 h-1.5 sm:h-2 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 sm:mt-2">
                    {percentage.toFixed(1)}% of total
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Floating Action Button */}
      <div className="md:hidden fixed bottom-4 right-4 z-20">
        <button
          onClick={handleDownloadAllCSV}
          disabled={filteredRegistrations.length === 0}
          className={`flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition ${filteredRegistrations.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}
          title="Download All"
        >
          <Download className="w-6 h-6" />
        </button>
      </div>

      {/* Add responsive styles */}
      <style jsx>{`
        @media (max-width: 640px) {
          /* Improve table readability on mobile */
          table {
            font-size: 0.875rem;
          }
          
          /* Better touch targets */
          button, input[type="checkbox"], select {
            min-height: 44px;
            min-width: 44px;
          }
          
          /* Prevent text overflow in cards */
          .truncate {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        
        @media (max-width: 768px) {
          /* Adjust modal for mobile */
          .modal-content {
            margin: 1rem;
            max-height: calc(100vh - 2rem);
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
