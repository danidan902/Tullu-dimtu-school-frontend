import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Search, Eye, CheckCircle,
  XCircle, Trash2, ChevronLeft, ChevronRight,
  Loader, Mail, Phone, Users, Calendar, AlertCircle,Home
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'https://tullu-dimtu-school-backend-1.onrender.com/api';

const AdminDashboard = () => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const navigate = useNavigate();


  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/visits`);
      if (response.data.success) {
        setVisits(response.data.data);
        setError('');
      }
    } catch (err) {
      console.error('Error fetching visits:', err);
      setError('Failed to load visits. Please check the server.');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    setUpdatingStatus(id);
    try {
      const response = await axios.patch(`${API_BASE_URL}/visits/${id}/status`, { status });
      
      if (response.data.success) {
        // Update local state
        setVisits(prevVisits =>
          prevVisits.map(visit =>
            visit._id === id ? { ...visit, status } : visit
          )
        );
        alert(`✓ Visit status updated to ${status}`);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update status';
      alert(`✗ ${errorMsg}`);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const deleteVisit = async (id) => {
    if (window.confirm('Are you sure you want to delete this visit request?')) {
      try {
        const response = await axios.delete(`${API_BASE_URL}/visits/${id}`);
        if (response.data.success) {
          setVisits(prevVisits => prevVisits.filter(visit => visit._id !== id));
          alert('✓ Visit deleted successfully');
        }
      } catch (err) {
        console.error('Failed to delete:', err);
        alert('✗ Failed to delete visit');
      }
    }
  };


 
  



  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPurposeLabel = (purpose) => {
    const labels = {
      'prospective-student': 'Prospective',
      'educational-partner': 'Educational',
      'research': 'Research',
      'community-partner': 'Community',
      'other': 'Other'
    };
    return labels[purpose] || purpose;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredVisits = visits.filter(visit => {
    const matchesSearch = searchTerm === '' ||
      visit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || visit.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredVisits.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVisits = filteredVisits.slice(startIndex, startIndex + itemsPerPage);

  const ViewDetailsModal = ({ visit, onClose }) => {
    if (!visit) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
         
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold text-gray-900">Visit Details</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Visitor Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{visit.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{visit.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{visit.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Organization</p>
                    <p className="font-medium">{visit.organization || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-700 mb-2">Visit Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Visit Date</p>
                    <p className="font-medium">{formatDate(visit.visitDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Number of Visitors</p>
                    <p className="font-medium">{visit.numberOfVisitors}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Purpose</p>
                    <p className="font-medium">{getPurposeLabel(visit.purpose)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(visit.status)}`}>
                      {visit.status.charAt(0).toUpperCase() + visit.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {visit.message && (
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Message</h3>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded">{visit.message}</p>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => {
                    updateStatus(visit._id, 'cancelled');
                    onClose();
                  }}
                  className="px-4 py-2 border border-red-300 text-red-700 rounded hover:bg-red-50 transition"
                >
                  Cancel Visit
                </button>
                <button
                  onClick={() => {
                    updateStatus(visit._id, 'confirmed');
                    onClose();
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Confirm Visit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
          <button
            onClick={fetchVisits}
            className="mt-2 text-sm text-red-600 hover:text-red-800"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
         <div className="fixed top-4 left-4 right-4 z-10 flex justify-between items-center">
         
            <button
              onClick={() => navigate('/admin-control')}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              <Home className="w-5 h-5" />
              <span className="hidden sm:inline">Back to Home</span>
            </button>
          </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 ml-24 lg:ml-40">School Visits Dashboard</h1>
            <p className="text-gray-600 lg:ml-40">Total: {visits.length} visits</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            >
              Print
            </button>
            <button
              onClick={fetchVisits}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-2"
            >
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Visitor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Visit Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Loader className="h-8 w-8 animate-spin text-blue-600 mb-4" />
                      <p className="text-gray-600">Loading visits...</p>
                    </div>
                  </td>
                </tr>
              ) : paginatedVisits.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <AlertCircle className="h-12 w-12 mb-4" />
                      <p className="text-lg">No visits found</p>
                      <p className="text-sm">Try adjusting your search</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedVisits.map((visit) => (
                  <tr key={visit._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{visit.name}</p>
                        {visit.organization && (
                          <p className="text-sm text-gray-500">{visit.organization}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <span className="text-sm text-blue-600">{visit.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span className="text-sm text-gray-600">{visit.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <span className="text-sm">{formatDate(visit.visitDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-3 w-3 text-gray-400" />
                          <span className="text-sm">{visit.numberOfVisitors} visitors</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(visit.status)}`}>
                        {visit.status.charAt(0).toUpperCase() + visit.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedVisit(visit);
                            setShowModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => updateStatus(visit._id, 'confirmed')}
                          disabled={updatingStatus === visit._id || visit.status === 'confirmed'}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Confirm Visit"
                        >
                          {updatingStatus === visit._id ? (
                            <Loader className="h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => updateStatus(visit._id, 'cancelled')}
                          disabled={updatingStatus === visit._id || visit.status === 'cancelled'}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Cancel Visit"
                        >
                          {updatingStatus === visit._id ? (
                            <Loader className="h-4 w-4 animate-spin" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => deleteVisit(visit._id)}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition"
                          title="Delete Visit"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredVisits.length)} of {filteredVisits.length} visits
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-50 transition"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="px-3 py-1 bg-blue-600 text-white rounded">{currentPage}</span>
                <span className="px-2">of {totalPages}</span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-50 transition"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Total Visits</p>
          <p className="text-2xl font-bold">{visits.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">
            {visits.filter(v => v.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Confirmed</p>
          <p className="text-2xl font-bold text-blue-600">
            {visits.filter(v => v.status === 'confirmed').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Cancelled</p>
          <p className="text-2xl font-bold text-red-600">
            {visits.filter(v => v.status === 'cancelled').length}
          </p>
        </div>
      </div>


      {/* Modal */}
      {showModal && (
        <ViewDetailsModal
          visit={selectedVisit}
          onClose={() => {
            setShowModal(false);
            setSelectedVisit(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
