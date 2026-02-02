import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, Download, Trash2, AlertCircle, Mail, User, Calendar, MessageSquare, } from 'lucide-react';

const ContactDashboard = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  // API Base URL
  const API_BASE = 'http://localhost:5000/api';

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/dashboard`);
      setContacts(response.data);
      setError('');
    } catch (err) {
      console.error('Fetch error:', err);
      setError(`Failed to load contacts: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Delete single contact
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    try {
      await axios.delete(`${API_BASE}/${id}`);
      // Remove from state
      setContacts(contacts.filter(contact => contact._id !== id));
      // Remove from selected rows
      const newSelected = new Set(selectedRows);
      newSelected.delete(id);
      setSelectedRows(newSelected);
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete contact');
    }
  };

  // Delete selected contacts
  const handleDeleteSelected = async () => {
    if (selectedRows.size === 0) {
      alert('Please select contacts to delete');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedRows.size} contact(s)?`)) {
      return;
    }

    try {
      const deletePromises = Array.from(selectedRows).map(id =>
        axios.delete(`${API_BASE}/${id}`)
      );
      
      await Promise.all(deletePromises);
      
      // Remove deleted contacts from state
      setContacts(contacts.filter(contact => !selectedRows.has(contact._id)));
      // Clear selection
      setSelectedRows(new Set());
    } catch (err) {
      console.error('Bulk delete error:', err);
      alert('Failed to delete some contacts');
    }
  };

  // Download data as JSON
  const handleDownloadJSON = () => {
    const dataToDownload = selectedRows.size > 0
      ? contacts.filter(contact => selectedRows.has(contact._id))
      : contacts;

    if (dataToDownload.length === 0) {
      alert('No data to download');
      return;
    }

    const dataStr = JSON.stringify(dataToDownload, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `contacts-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Download data as CSV
  const handleDownloadCSV = () => {
    const dataToDownload = selectedRows.size > 0
      ? contacts.filter(contact => selectedRows.has(contact._id))
      : contacts;

    if (dataToDownload.length === 0) {
      alert('No data to download');
      return;
    }

    // Create CSV headers and rows
    const headers = ['Name', 'Email', 'Message', 'Date'];
    const rows = dataToDownload.map(contact => [
      `"${(contact.name || contact.contactPerson || '').replace(/"/g, '""')}"`,
      `"${(contact.email || '').replace(/"/g, '""')}"`,
      `"${(contact.message || '').replace(/"/g, '""')}"`,
      `"${new Date(contact.createdAt || contact.date).toLocaleDateString()}"`
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `contacts-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Select/deselect all rows
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = new Set(contacts.map(contact => contact._id));
      setSelectedRows(allIds);
    } else {
      setSelectedRows(new Set());
    }
  };

  // Toggle single row selection
  const handleSelectRow = (id) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  // Filter contacts based on search term
  const filteredContacts = contacts.filter(contact => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (contact.name && contact.name.toLowerCase().includes(searchLower)) ||
      (contact.contactPerson && contact.contactPerson.toLowerCase().includes(searchLower)) ||
      (contact.email && contact.email.toLowerCase().includes(searchLower)) ||
      (contact.message && contact.message.toLowerCase().includes(searchLower))
    );
  });

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg font-semibold text-blue-600">
          Loading dashboard data...
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
      {/* Back Button - Adjusted for mobile */}
      <div className="fixed left-2 sm:left-4 top-2 sm:top-4 z-20">
        <button
          onClick={() => navigate('/admin-control')}
          className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
      </div>

      {/* Header */}
      <div className="pt-12 sm:pt-0 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center sm:text-left">
            Contacts School <span className='text-blue-600'>Dashboard</span>
          </h1>
          <div className="text-sm text-gray-500 text-center sm:text-right">
            Total: <span className="font-semibold">{contacts.length}</span> contacts
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-3 rounded mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm sm:text-base">{error}</span>
            </div>
            <button
              onClick={fetchContacts}
              className="bg-red-100 hover:bg-red-200 text-red-800 font-semibold py-1 px-3 rounded text-sm w-full sm:w-auto"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="bg-white rounded-lg shadow p-3 sm:p-4 mb-4 sm:mb-6">
        <div className="flex flex-col gap-4">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full text-sm sm:text-base"
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              </div>
              <div className="text-xs sm:text-sm text-gray-600 mt-2">
                {filteredContacts.length} of {contacts.length} shown
              </div>
            </div>
            
            <div className="flex items-center space-x-2 self-end">
              <div className="text-xs sm:text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                {selectedRows.size} selected
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
            <div className="text-xs sm:text-sm text-gray-600 hidden sm:block">
              {selectedRows.size > 0 ? `${selectedRows.size} contact(s) selected` : 'Select contacts to perform actions'}
            </div>
            
            <div className="grid grid-cols-2 sm:flex gap-2">
              <button
                onClick={handleDownloadJSON}
                disabled={selectedRows.size === 0 && contacts.length === 0}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-3 sm:py-2 sm:px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-xs sm:text-sm flex-1"
              >
                <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="truncate">JSON</span>
              </button>
              
              <button
                onClick={handleDownloadCSV}
                disabled={selectedRows.size === 0 && contacts.length === 0}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-3 sm:py-2 sm:px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-xs sm:text-sm flex-1"
              >
                <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="truncate">CSV</span>
              </button>
              
              <button
                onClick={handleDeleteSelected}
                disabled={selectedRows.size === 0}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 sm:py-2 sm:px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-xs sm:text-sm col-span-2 sm:col-span-1"
              >
                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span>Delete Selected</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contacts List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredContacts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl sm:text-6xl mb-4">📭</div>
            <p className="text-gray-500 text-base sm:text-lg">No contacts found</p>
            {searchTerm && (
              <p className="text-gray-400 mt-2 text-sm">Try a different search term</p>
            )}
          </div>
        ) : (
          <>
            {/* Mobile View - Card Layout */}
            <div className="sm:hidden">
              <div className="p-3 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selectedRows.size === filteredContacts.length && filteredContacts.length > 0}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                    />
                    <span className="text-xs text-gray-600">Select all</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {selectedRows.size} selected
                  </span>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {filteredContacts.map((contact) => (
                  <div 
                    key={contact._id} 
                    className={`p-3 ${selectedRows.has(contact._id) ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(contact._id)}
                        onChange={() => handleSelectRow(contact._id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <h3 className="font-medium text-gray-900 truncate">
                              {contact.name || contact.contactPerson || 'N/A'}
                            </h3>
                          </div>
                          <button
                            onClick={() => handleDelete(contact._id)}
                            className="text-red-600 hover:text-red-900 text-xs font-medium"
                          >
                            Delete
                          </button>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-gray-600 truncate">
                              {contact.email || 'N/A'}
                            </span>
                          </div>
                          
                          <div className="flex items-start space-x-2">
                            <MessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <p className="text-gray-600 line-clamp-2">
                                {contact.message || 'No message'}
                              </p>
                              {contact.message && contact.message.length > 50 && (
                                <button
                                  onClick={() => {
                                    const fullMessage = contact.message;
                                    alert(`Full Message:\n\n${fullMessage}`);
                                  }}
                                  className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                                >
                                  View full message
                                </button>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-gray-500 text-xs">
                              {formatDate(contact.createdAt || contact.date)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop View - Table Layout */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="w-12 px-6 py-3">
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={selectedRows.size === filteredContacts.length && filteredContacts.length > 0}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Message
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
                  {filteredContacts.map((contact) => (
                    <tr 
                      key={contact._id} 
                      className={`hover:bg-gray-50 ${selectedRows.has(contact._id) ? 'bg-blue-50' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedRows.has(contact._id)}
                          onChange={() => handleSelectRow(contact._id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {contact.name || contact.contactPerson || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {contact.email || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-md">
                          <div className="truncate" title={contact.message}>
                            {contact.message || 'No message'}
                          </div>
                          {contact.message && contact.message.length > 100 && (
                            <button
                              onClick={() => {
                                const fullMessage = contact.message;
                                alert(`Full Message:\n\n${fullMessage}`);
                              }}
                              className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                            >
                              View full message
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(contact.createdAt || contact.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleDelete(contact._id)}
                          className="text-red-600 hover:text-red-900 font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        
        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
            <div className="text-xs sm:text-sm text-gray-500">
              Showing {filteredContacts.length} of {contacts.length} contacts
            </div>
            <div className="text-xs sm:text-sm text-gray-500">
              {selectedRows.size} contact(s) selected
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Action Bar */}
      {selectedRows.size > 0 && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-3 z-10">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gray-700">
              {selectedRows.size} selected
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleDeleteSelected}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center text-sm"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactDashboard;