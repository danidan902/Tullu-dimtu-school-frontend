
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from "react-helmet-async";
import {
  FileText, Download, Trash2, Upload, FolderOpen,
  Eye, Search, Filter, Calendar, FileType, HardDrive,
  Users, BarChart3, Settings, Home, User, Bell,
  ChevronRight, CheckCircle, AlertCircle, X, Copy,
  ExternalLink, Grid, List, MoreVertical, Share2,
  Star, StarOff, Archive, RefreshCw, ZoomIn, Maximize2
} from 'lucide-react';

const AdminPage = () => {
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalSize: 0,
    images: 0,
    documents: 0,
    others: 0
  });
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New file uploaded successfully', time: '2 min ago', type: 'success' },
    { id: 2, message: 'Storage usage is at 85%', time: '1 hour ago', type: 'warning' },
    { id: 3, message: 'Backup completed', time: '3 hours ago', type: 'info' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('files');
  const [previewFile, setPreviewFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/files');
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to fetch files');

      // Format the data from backend
      const formattedFiles = data.files.map(file => ({
        id: file.publicId || file._id || Date.now().toString(),
        name: file.originalName || file.name || 'Unknown File',
        size: file.bytes || file.size || 0,
        type: file.resourceType || file.type || 'unknown',
        data: file.url || file.data || '',
        url: file.url || '',
        uploadedAt: file.createdAt || file.uploadedAt || new Date().toISOString(),
        favorite: file.favorite || false
      }));

      setFiles(formattedFiles);
      setFilteredFiles(formattedFiles);
    } catch (error) {
      console.error('Failed to fetch files:', error);
      // Fallback to localStorage if API fails
      loadFilesFromLocalStorage();
    } finally {
      setIsLoading(false);
    }
  };

  const loadFilesFromLocalStorage = () => {
    try {
      const storedFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
      setFiles(storedFiles);
      setFilteredFiles(storedFiles);
    } catch (error) {
      console.error('Error loading files from localStorage:', error);
    }
  };

  useEffect(() => {
    filterAndSortFiles();
  }, [files, searchTerm, selectedCategory, sortBy, sortOrder]);

  useEffect(() => {
    calculateStats();
  }, [files]);







  // const calculateStats = () => {
  //   const totalSize = files.reduce((total, file) => total + (file.size || 0), 0);
  //   const images = files.filter(f => f.type && f.type.includes('image')).length;
  //   const documents = files.filter(f => {
  //     if (!f.type) return false;
  //     const type = f.type.toLowerCase();
  //     return type.includes('pdf') ||
  //       type.includes('document') ||
  //       type.includes('msword') ||
  //       type.includes('word') ||
  //       type.includes('excel') ||
  //       type.includes('sheet') ||
  //       type.includes('text');
  //   }).length;

  //   setStats({
  //     totalFiles: files.length,
  //     totalSize,
  //     images,
  //     documents,
  //     others: files.length - images - documents
  //   });
  // };



const IMAGE_EXT = /\.(jpg|jpeg|png|gif|webp|bmp)$/i;
const DOC_EXT = /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt)$/i;

const isImage = (file) => {
  const name = (file.name || "").toLowerCase();
  const url = (file.url || "").toLowerCase();
  return IMAGE_EXT.test(name) || IMAGE_EXT.test(url);
};

const isDocument = (file) => {
  const name = (file.name || "").toLowerCase();
  const url = (file.url || "").toLowerCase();
  return DOC_EXT.test(name) || DOC_EXT.test(url);
};





const calculateStats = () => {
  if (!Array.isArray(files)) return;

  let images = 0;
  let documents = 0;
  let totalSize = 0;

  files.forEach(file => {
    totalSize += Number(file.size) || 0;

    if (isImage(file)) {
      images++;
      return;
    }

    if (isDocument(file)) {
      documents++;
    }
  });

  setStats({
    totalFiles: files.length,
    totalSize,
    images,
    documents,
    others: files.length - images - documents
  });
};











  const filterAndSortFiles = () => {
    let result = [...files];

    // Filter by search
    if (searchTerm) {
      result = result.filter(file =>
        file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (file.type && file.type.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
  if (selectedCategory !== 'all') {
  result = result.filter(file => {
    switch (selectedCategory) {
      case 'image':
        return isImage(file);

      case 'document':
        return isDocument(file);

      case 'audio':
        return /\.(mp3|wav|ogg|m4a)$/i.test(file.name || '');

      case 'video':
        return /\.(mp4|mov|avi|mkv|webm)$/i.test(file.name || '');

      default:
        return true;
    }
  });
}


    // Sort files
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = (a.name || '').localeCompare(b.name || '');
          break;
        case 'size':
          comparison = (a.size || 0) - (b.size || 0);
          break;
        case 'date':
          comparison = new Date(b.uploadedAt || 0) - new Date(a.uploadedAt || 0);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredFiles(result);
  };




  








  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getFileIcon = (fileType) => {
    if (!fileType) return <FileText className="w-5 h-5 text-gray-500" />;

    const type = fileType.toLowerCase();
    if (type.includes('image')) return (
      <div className="relative">
        <FileText className="w-5 h-5 text-blue-500" />
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
      </div>
    );
    if (type.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
    if (type.includes('word') || type.includes('document') || type.includes('msword')) return <FileText className="w-5 h-5 text-blue-600" />;
    if (type.includes('excel') || type.includes('sheet')) return <FileText className="w-5 h-5 text-green-600" />;
    if (type.includes('audio')) return <FileText className="w-5 h-5 text-purple-500" />;
    if (type.includes('video')) return <FileText className="w-5 h-5 text-orange-500" />;
    return <FileText className="w-5 h-5 text-gray-500" />;
  };

  const handleDeleteFile = (id) => {
    const updatedFiles = files.filter(file => file.id !== id);
    setFiles(updatedFiles);
    localStorage.setItem('uploadedFiles', JSON.stringify(updatedFiles));
    setSelectedFiles(selectedFiles.filter(fileId => fileId !== id));

    // Add notification
    const deletedFile = files.find(f => f.id === id);
    setNotifications(prev => [{
      id: Date.now(),
      message: `Deleted file: ${deletedFile?.name || 'Unknown'}`,
      time: 'Just now',
      type: 'info'
    }, ...prev.slice(0, 9)]);
  };

  const handleDeleteMultiple = () => {
    const updatedFiles = files.filter(file => !selectedFiles.includes(file.id));
    setFiles(updatedFiles);
    localStorage.setItem('uploadedFiles', JSON.stringify(updatedFiles));
    setSelectedFiles([]);

    setNotifications(prev => [{
      id: Date.now(),
      message: `Deleted ${selectedFiles.length} files`,
      time: 'Just now',
      type: 'info'
    }, ...prev.slice(0, 9)]);
  };






const handleDownload = (file) => {
  if (!file.data && !file.url) {
    setNotifications(prev => [{
      id: Date.now(),
      message: `No download available for ${file.name}`,
      time: 'Just now',
      type: 'warning'
    }, ...prev.slice(0, 9)]);
    return;
  }

  let downloadUrl = file.data || file.url;

  // If it's an image from Cloudinary, force attachment
  if (downloadUrl.includes("cloudinary")) {
    downloadUrl = downloadUrl.replace("/upload/", "/upload/fl_attachment/");
  }

  // Create a temporary link to download
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = file.name || 'download';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setNotifications(prev => [{
    id: Date.now(),
    message: `Downloaded: ${file.name}`,
    time: 'Just now',
    type: 'success'
  }, ...prev.slice(0, 9)]);
};


  const handleDownloadMultiple = () => {
    selectedFiles.forEach(fileId => {
      const file = files.find(f => f.id === fileId);
      if (file) handleDownload(file);
    });
  };

  // New function: Open image in new tab
  const handleOpenImage = (file) => {
    if (!file.data && !file.url) {
      setNotifications(prev => [{
        id: Date.now(),
        message: `Cannot open image: ${file.name}`,
        time: 'Just now',
        type: 'warning'
      }, ...prev.slice(0, 9)]);
      return;
    }

    const imageUrl = file.data || file.url;
    window.open(imageUrl, '_blank', 'noopener,noreferrer');
    
    setNotifications(prev => [{
      id: Date.now(),
      message: `Opened image: ${file.name}`,
      time: 'Just now',
      type: 'info'
    }, ...prev.slice(0, 9)]);
  };

  // New function: Handle image click (both open and download options)
  const handleImageClick = (file, event) => {
    // If Ctrl key is pressed, open in new tab
    if (event.ctrlKey || event.metaKey) {
      handleOpenImage(file);
      return;
    }
    
    // If Shift key is pressed, download
    if (event.shiftKey) {
      handleDownload(file);
      return;
    }
    
    // Default: show preview modal
    setPreviewFile(file);
  };

  const handleSelectFile = (id) => {
    setSelectedFiles(prev =>
      prev.includes(id)
        ? prev.filter(fileId => fileId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedFiles.length === filteredFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredFiles.map(f => f.id));
    }
  };

  const clearAllFiles = () => {
    setFiles([]);
    localStorage.setItem('uploadedFiles', '[]');
    setSelectedFiles([]);

    setNotifications(prev => [{
      id: Date.now(),
      message: 'All files cleared',
      time: 'Just now',
      type: 'warning'
    }, ...prev.slice(0, 9)]);
  };

  const refreshFiles = () => {
    fetchFiles();
    setNotifications(prev => [{
      id: Date.now(),
      message: 'Files refreshed',
      time: 'Just now',
      type: 'info'
    }, ...prev.slice(0, 9)]);
  };

  const copyFileLink = (file) => {
    const link = file.data || file.url || '';
    if (!link) {
      setNotifications(prev => [{
        id: Date.now(),
        message: 'No link available to copy',
        time: 'Just now',
        type: 'warning'
      }, ...prev.slice(0, 9)]);
      return;
    }

    navigator.clipboard.writeText(link);
    setNotifications(prev => [{
      id: Date.now(),
      message: 'Link copied to clipboard',
      time: 'Just now',
      type: 'success'
    }, ...prev.slice(0, 9)]);
  };

  const handleFavorite = (id) => {
    const updatedFiles = files.map(file =>
      file.id === id ? { ...file, favorite: !file.favorite } : file
    );
    setFiles(updatedFiles);
    localStorage.setItem('uploadedFiles', JSON.stringify(updatedFiles));
  };

  const categories = [
    { id: 'all', name: 'All Files', icon: <FolderOpen className="w-4 h-4" />, count: files.length },
    { id: 'image', name: 'Images', icon: <FileType className="w-4 h-4" />, count: stats.images },
    { id: 'document', name: 'Documents', icon: <FileText className="w-4 h-4" />, count: stats.documents },
    { id: 'video', name: 'Others', icon: <FileType className="w-4 h-4" />, count: stats.others },
  ];

  return (
   <>
   
    <Helmet>
         <title>Tullu Dimtu Secondary School</title>
           </Helmet>
   

    <div className="min-h-screen bg-gray-50">
      {/* Back to Home Page Button */}
      <div className="fixed top-4 left-4 z-10">
        <button
          onClick={() => navigate('/admin-control')}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          <Home className="w-5 h-5" />
          <span>Back to Home Page</span>
        </button>
      </div>

      <div className="p-6">
        <div className="pt-6 px-6 mt-4 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800">Manage student attendance and mark List</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Files</p>
                <h3 className="text-3xl font-bold mt-2">{stats.totalFiles}</h3>
              </div>
              <FolderOpen className="w-10 h-10 opacity-80" />
            </div>
            <div className="mt-4 pt-4 border-t border-blue-400">
              <p className="text-sm text-blue-100">Storage used: {formatFileSize(stats.totalSize)}</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Images</p>
                <h3 className="text-3xl font-bold mt-2">{stats.images}</h3>
              </div>
              <FileType className="w-10 h-10 opacity-80" />
            </div>
            <div className="mt-4 pt-4 border-t border-green-400">
              <p className="text-sm text-green-100">Visual content files</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Documents</p>
                <h3 className="text-3xl font-bold mt-2">{stats.documents}</h3>
              </div>
              <FileText className="w-10 h-10 opacity-80" />
            </div>
            <div className="mt-4 pt-4 border-t border-purple-400">
              <p className="text-sm text-purple-100">PDFs, Docs, Sheets</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Others</p>
                <h3 className="text-3xl font-bold mt-2">{stats.others}</h3>
              </div>
              <FileType className="w-10 h-10 opacity-80" />
            </div>
            <div className="mt-4 pt-4 border-t border-orange-400">
              <p className="text-sm text-orange-100">Audio, Video, Archives</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Categories and Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Categories
              </h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center justify-between w-full p-3 rounded-lg transition-all ${selectedCategory === category.id
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'hover:bg-gray-50 text-gray-700'
                      }`}
                  >
                    <div className="flex items-center">
                      <span className={`mr-3 ${selectedCategory === category.id ? 'text-blue-500' : 'text-gray-500'
                        }`}>
                        {category.icon}
                      </span>
                      <span>{category.name}</span>
                    </div>
                    <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-8">
                <h3 className="font-semibold text-gray-800 mb-4">Sort By</h3>
                <div className="space-y-2">
                  {['date', 'name', 'size'].map(sort => (
                    <button
                      key={sort}
                      onClick={() => {
                        if (sortBy === sort) {
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        } else {
                          setSortBy(sort);
                          setSortOrder('desc');
                        }
                      }}
                      className={`flex items-center justify-between w-full p-3 rounded-lg transition-all ${sortBy === sort
                          ? 'bg-blue-50 text-blue-600 border border-blue-200'
                          : 'hover:bg-gray-50 text-gray-700'
                        }`}
                    >
                      <span className="capitalize">{sort}</span>
                      {sortBy === sort && (
                        <span className="text-xs font-medium">
                          {sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={refreshFiles}
                  className="flex items-center justify-center w-full p-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Files
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Toolbar */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                  <div className="flex-1">
                    <div className="relative max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search files by name or type..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-md ${viewMode === 'grid'
                            ? 'bg-white shadow-sm text-blue-600'
                            : 'text-gray-600 hover:text-gray-800'
                          }`}
                      >
                        <Grid className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-md ${viewMode === 'list'
                            ? 'bg-white shadow-sm text-blue-600'
                            : 'text-gray-600 hover:text-gray-800'
                          }`}
                      >
                        <List className="w-5 h-5" />
                      </button>
                    </div>

                    {selectedFiles.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">
                          {selectedFiles.length} selected
                        </span>
                        <button
                          onClick={handleDeleteMultiple}
                          className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                        <button
                          onClick={handleDownloadMultiple}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handleSelectAll}
                      className="text-sm text-gray-600 hover:text-gray-800"
                    >
                      {selectedFiles.length === filteredFiles.length
                        ? 'Deselect All'
                        : 'Select All'
                      }
                    </button>
                    {selectedFiles.length > 0 && (
                      <button
                        onClick={() => setSelectedFiles([])}
                        className="text-sm text-gray-600 hover:text-gray-800"
                      >
                        Clear Selection
                      </button>
                    )}
                  </div>

                  <div className="text-sm text-gray-500">
                    Showing {filteredFiles.length} of {files.length} files
                  </div>
                </div>
              </div>

              {/* Files Display */}
              <div className="p-6">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading files...</p>
                  </div>
                ) : filteredFiles.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                      <FolderOpen className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No files found</h3>
                    <p className="text-gray-500 mb-6">
                      {searchTerm || selectedCategory !== 'all'
                        ? 'Try changing your search or filter criteria'
                        : 'Upload some files to get started'
                      }
                    </p>
                    <button
                      onClick={() => navigate('/')}
                      className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all"
                    >
                      <Upload className="w-5 h-5" />
                      <span>Upload Files</span>
                    </button>
                  </div>
                ) : viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredFiles.map(file => (
                      <div
                        key={file.id}
                        className={`group relative border rounded-xl overflow-hidden transition-all duration-200 ${selectedFiles.includes(file.id)
                            ? 'border-blue-500 ring-2 ring-blue-100'
                            : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                          }`}
                      >
                        <div className="absolute top-3 left-3 z-10">
                          <input
                            type="checkbox"
                            checked={selectedFiles.includes(file.id)}
                            onChange={() => handleSelectFile(file.id)}
                            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </div>

                        <div className="absolute top-3 right-3 z-10 flex space-x-1">
                          <button
                            onClick={() => handleFavorite(file.id)}
                            className="p-1.5 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white"
                          >
                            {file.favorite ? (
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            ) : (
                              <StarOff className="w-4 h-4 text-gray-500" />
                            )}
                          </button>
                          <button
                            onClick={() => setPreviewFile(file)}
                            className="p-1.5 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white"
                          >
                            <Eye className="w-4 h-4 text-gray-700" />
                          </button>
                        </div>

                        {(file.type && file.type.includes('image')) || (file.url && /\.(jpg|jpeg|png|gif|webp)$/i.test(file.url)) ? (
                          <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <div className="relative w-full h-full group/image-container">
                              <img
                                src={file.data || file.url}
                                alt={file.name}
                                className="max-h-full max-w-full object-contain p-4 cursor-pointer"
                                onClick={(e) => handleImageClick(file, e)}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.parentElement.innerHTML = `
                                    <div class="text-center p-4 w-full">
                                      ${getFileIcon(file.type)}
                                      <p class="mt-2 text-sm text-gray-600">Image preview unavailable</p>
                                    </div>
                                  `;
                                }}
                              />
                              {/* Image action overlay */}
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image-container:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-2">
                                <button
                                  onClick={() => handleOpenImage(file)}
                                  className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                                  title="Open in new tab (Ctrl+Click)"
                                >
                                  <Maximize2 className="w-5 h-5 text-gray-700" />
                                </button>
                                <button
                                  onClick={() => handleDownload(file)}
                                  className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                                  title="Download image (Shift+Click)"
                                >
                                  <Download className="w-5 h-5 text-gray-700" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center p-6">
                            <div className="text-4xl mb-4">
                              {getFileIcon(file.type)}
                            </div>
                            <div className="text-center">
                              <p className="font-medium text-gray-800 text-sm mb-1 line-clamp-1">
                                {file.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatFileSize(file.size)}
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="p-4 border-t border-gray-100">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                {file.type ? (file.type.split('/')[1] || file.type).toUpperCase() : 'FILE'}
                              </span>
                              <span className="text-xs text-gray-400">
                                {formatDate(file.uploadedAt)}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleDownload(file)}
                                className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                                title="Download file"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteFile(file.id)}
                                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          
                          {/* Image click hint */}
                          {(file.type && file.type.includes('image')) && (
                            <div className="mt-2 text-xs text-gray-500 flex items-center space-x-2">
                              <span className="inline-flex items-center">
                                <Eye className="w-3 h-3 mr-1" />
                                Click image to preview
                              </span>
                              <span className="inline-flex items-center">
                                <Maximize2 className="w-3 h-3 mr-1" />
                                Ctrl+Click to open
                              </span>
                              <span className="inline-flex items-center">
                                <Download className="w-3 h-3 mr-1" />
                                Shift+Click to download
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredFiles.map(file => (
                      <div
                        key={file.id}
                        className={`flex items-center p-4 rounded-lg border transition-all ${selectedFiles.includes(file.id)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:bg-gray-50'
                          }`}
                      >
                        <div className="flex items-center flex-1 min-w-0">
                          <input
                            type="checkbox"
                            checked={selectedFiles.includes(file.id)}
                            onChange={() => handleSelectFile(file.id)}
                            className="mr-4 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="flex items-center space-x-4 flex-1 min-w-0">
                            <div className="p-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg">
                              {getFileIcon(file.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <p className="font-medium text-gray-800 truncate">
                                  {file.name}
                                </p>
                                {file.favorite && (
                                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                )}
                              </div>
                              <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                                <span>{formatFileSize(file.size)}</span>
                                <span>•</span>
                                <span className="font-medium bg-gray-100 px-2 py-0.5 rounded">
                                  {file.type ? (file.type.split('/')[1] || file.type).toUpperCase() : 'UNKNOWN'}
                                </span>
                                <span>•</span>
                                <span>{formatDate(file.uploadedAt)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleFavorite(file.id)}
                            className="p-2 text-gray-500 hover:text-yellow-500 hover:bg-yellow-50 rounded-lg"
                          >
                            {file.favorite ? (
                              <Star className="w-4 h-4 fill-yellow-500" />
                            ) : (
                              <StarOff className="w-4 h-4" />
                            )}
                          </button>
                          {(file.type && file.type.includes('image')) && (
                            <button
                              onClick={() => handleOpenImage(file)}
                              className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg"
                              title="Open image in new tab"
                            >
                              <Maximize2 className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => setPreviewFile(file)}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDownload(file)}
                            className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteFile(file.id)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {filteredFiles.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                      <div className="text-sm text-gray-500">
                        Total storage: {formatFileSize(stats.totalSize)}
                      </div>
                      <button
                        onClick={clearAllFiles}
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Clear All Files</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* File Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getFileIcon(previewFile.type)}
                <div>
                  <h3 className="font-semibold text-gray-800">{previewFile.name}</h3>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(previewFile.size)} • Uploaded {formatDate(previewFile.uploadedAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {previewFile.type && previewFile.type.includes('image') && (
                  <button
                    onClick={() => handleOpenImage(previewFile)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                    title="Open in new tab"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={() => handleDownload(previewFile)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={() => copyFileLink(previewFile)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Copy className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setPreviewFile(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 max-h-[calc(90vh-120px)] overflow-auto">
              {previewFile.type && previewFile.type.includes('image') ? (
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    <img
                      src={previewFile.data || previewFile.url}
                      alt={previewFile.name}
                      className="max-w-full max-h-[60vh] rounded-lg shadow-lg cursor-pointer"
                      onClick={() => handleOpenImage(previewFile)}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `
                          <div class="text-center py-12">
                            <div class="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                              ${getFileIcon(previewFile.type).props ? '📁' : getFileIcon(previewFile.type)}
                            </div>
                            <p class="text-gray-600">Image preview failed to load</p>
                            <button
                              onclick="(${() => handleDownload(previewFile)})()"
                              class="mt-4 inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                              <Download class="w-5 h-5" />
                              <span>Download to View</span>
                            </button>
                          </div>
                        `;
                      }}
                    />
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Click image to open in new tab
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-center space-x-4">
                    <button
                      onClick={() => handleOpenImage(previewFile)}
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Maximize2 className="w-4 h-4" />
                      <span>Open in New Tab</span>
                    </button>
                    <button
                      onClick={() => handleDownload(previewFile)}
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Image</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                    {getFileIcon(previewFile.type)}
                  </div>
                  <p className="text-gray-600">Preview not available for this file type</p>
                  <button
                    onClick={() => handleDownload(previewFile)}
                    className="mt-4 inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download to View</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
   
   </>
  );
};

export default AdminPage;


