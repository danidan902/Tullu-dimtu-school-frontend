
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const ConcernsDashboard = () => {
  const [concerns, setConcerns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUrgency, setFilterUrgency] = useState('all');
  const [stats, setStats] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'
  const navigate = useNavigate();

  const API_BASE = 'https://tullu-dimtu-school-backend-1.onrender.com/api/concerns';

  useEffect(() => {
    fetchConcerns();
    fetchStats();
  }, []);

  const fetchConcerns = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_BASE);
      setConcerns(response.data);
      setError('');
    } catch (err) {
      console.error('Fetch error:', err);
      setError(`Failed to load concerns: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_BASE}/stats`);
      setStats(response.data);
    } catch (err) {
      console.error('Stats error:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this concern?')) {
      return;
    }

    try {
      await axios.delete(`${API_BASE}/${id}`);
      setConcerns(concerns.filter(concern => concern._id !== id));
      const newSelected = new Set(selectedRows);
      newSelected.delete(id);
      setSelectedRows(newSelected);
      fetchStats(); // Refresh stats
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete concern');
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedRows.size === 0) {
      alert('Please select concerns to delete');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedRows.size} concern(s)?`)) {
      return;
    }

    try {
      const deletePromises = Array.from(selectedRows).map(id =>
        axios.delete(`${API_BASE}/${id}`)
      );
      
      await Promise.all(deletePromises);
      setConcerns(concerns.filter(concern => !selectedRows.has(concern._id)));
      setSelectedRows(new Set());
      fetchStats();
    } catch (err) {
      console.error('Bulk delete error:', err);
      alert('Failed to delete some concerns');
    }
  };

  const handleDownloadJSON = () => {
    const dataToDownload = selectedRows.size > 0
      ? concerns.filter(concern => selectedRows.has(concern._id))
      : concerns;

    if (dataToDownload.length === 0) {
      alert('No data to download');
      return;
    }

    const dataStr = JSON.stringify(dataToDownload, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `concerns-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadCSV = () => {
    const dataToDownload = selectedRows.size > 0
      ? concerns.filter(concern => selectedRows.has(concern._id))
      : concerns;

    if (dataToDownload.length === 0) {
      alert('No data to download');
      return;
    }

    const headers = ['Name', 'Student ID', 'Concern', 'Urgency', 'Details', 'Status', 'Date'];
    const rows = dataToDownload.map(concern => [
      `"${(concern.name || '').replace(/"/g, '""')}"`,
      `"${(concern.studentId || '').replace(/"/g, '""')}"`,
      `"${(concern.concern || '').replace(/"/g, '""')}"`,
      concern.urgency,
      `"${(concern.details || '').replace(/"/g, '""')}"`,
      concern.status || 'pending',
      `"${new Date(concern.createdAt).toLocaleDateString()}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `concerns-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = new Set(filteredConcerns.map(concern => concern._id));
      setSelectedRows(allIds);
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (id) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredConcerns = concerns.filter(concern => {
    const matchesSearch = searchTerm === '' || 
      concern.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      concern.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      concern.concern.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (concern.details && concern.details.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesUrgency = filterUrgency === 'all' || concern.urgency === filterUrgency;
    
    return matchesSearch && matchesUrgency;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg font-semibold text-blue-600">Loading concerns...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">

         <div className="fixed left-2 sm:left-4 top-2 sm:top-4 z-20">
                <button
                  onClick={() => navigate('/admin-control')}
                  className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                  aria-label="Go back"
                >
                  <ChevronLeft  className="w-6 h-6 sm:w-8 sm:h-8" />
                </button>
              </div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Student Concerns Dashboard</h1>
          <p className="text-gray-600 mt-1">Track and manage student concerns</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-800">{concerns.length}</div>
            <div className="text-sm text-gray-500">Total Concerns</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-800">{stats.highUrgency}</div>
                <div className="text-sm text-gray-500">High Urgency</div>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-bold">!</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-800">{stats.mediumUrgency}</div>
                <div className="text-sm text-gray-500">Medium Urgency</div>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 font-bold">!</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-800">{stats.lowUrgency}</div>
                <div className="text-sm text-gray-500">Low Urgency</div>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">✓</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
                <div className="text-sm text-gray-500">Total</div>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">📋</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={fetchConcerns}
              className="bg-red-100 hover:bg-red-200 text-red-800 font-semibold py-1 px-3 rounded text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search concerns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
              />
              <div className="absolute left-3 top-2.5 text-gray-400">🔍</div>
            </div>
            
            <select
              value={filterUrgency}
              onChange={(e) => setFilterUrgency(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Urgency</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <div className="text-sm text-gray-600">
              {filteredConcerns.length} of {concerns.length} shown
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-600">
              {selectedRows.size} selected
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode(viewMode === 'table' ? 'card' : 'table')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg flex items-center"
              >
                {viewMode === 'table' ? 'Switch to Card View' : 'Switch to Table View'}
              </button>
              
              <button
                onClick={handleDownloadJSON}
                disabled={selectedRows.size === 0 && concerns.length === 0}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Download JSON
              </button>
              
              <button
                onClick={handleDownloadCSV}
                disabled={selectedRows.size === 0 && concerns.length === 0}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Download CSV
              </button>
              
              <button
                onClick={handleDeleteSelected}
                disabled={selectedRows.size === 0}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredConcerns.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📭</div>
              <p className="text-gray-500 text-lg">No concerns found</p>
              {searchTerm && <p className="text-gray-400 mt-2">Try a different search term</p>}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="w-12 px-6 py-3">
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={selectedRows.size === filteredConcerns.length && filteredConcerns.length > 0}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Concern
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Urgency
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredConcerns.map((concern) => (
                    <tr key={concern._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedRows.has(concern._id)}
                          onChange={() => handleSelectRow(concern._id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{concern.name}</div>
                          <div className="text-sm text-gray-500">ID: {concern.studentId}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{concern.concern}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getUrgencyColor(concern.urgency)}`}>
                          {concern.urgency.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs">
                          <div className="truncate">{concern.details || 'No additional details'}</div>
                          {concern.details && concern.details.length > 50 && (
                            <button
                              onClick={() => alert(`Full Details:\n\n${concern.details}`)}
                              className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                            >
                              View details
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(concern.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleDelete(concern._id)}
                          className="text-red-600 hover:text-red-900 font-medium mr-3"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Card View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConcerns.map((concern) => (
            <div key={concern._id} className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{concern.name}</h3>
                  <p className="text-sm text-gray-500">ID: {concern.studentId}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(concern._id)}
                    onChange={() => handleSelectRow(concern._id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getUrgencyColor(concern.urgency)}`}>
                    {concern.urgency.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-1">Concern</h4>
                <p className="text-gray-900">{concern.concern}</p>
              </div>
              
              {concern.details && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Details</h4>
                  <p className="text-gray-900 text-sm">{concern.details}</p>
                </div>
              )}
              
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-500">
                  {formatDate(concern.createdAt)}
                </div>
                <button
                  onClick={() => handleDelete(concern._id)}
                  className="text-red-600 hover:text-red-900 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 text-center text-gray-500 text-sm">
        Showing {filteredConcerns.length} of {concerns.length} concerns
        {selectedRows.size > 0 && ` • ${selectedRows.size} selected`}
      </div>
    </div>
  );
};

export default ConcernsDashboard;
