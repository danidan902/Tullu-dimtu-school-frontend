import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from "react-helmet-async";
import axios from 'axios';
import {
  FileText, Download, Trash2, Upload, FolderOpen,
  Search, Filter, 
  AlertCircle, Copy,
  Grid, List, 
  Star, StarOff, RefreshCw, Maximize2,
  Database, Clock, File, Image, Video, Music,
  ChevronLeft
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
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    show: false,
    type: 'single',
    fileId: null,
    fileName: null,
    count: 0
  });
  const navigate = useNavigate();

  const API_BASE_URL = "https://tullu-dimtu-school-backend-1.onrender.com/api/upload";

  useEffect(() => {
    fetchFilesFromMongoDB();
  }, []);

  const fetchFilesFromMongoDB = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_BASE_URL);
      
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid response from MongoDB API');
      }
      
      // Transform MongoDB data to our file format
      const mongoFiles = response.data.map(file => ({
        id: file._id,
        name: file.name || file.filename,
        url: file.url || file.path,
        format: file.format || getFileFormat(file.name),
        size: file.size || 0,
        uploadedAt: file.uploadedAt || file.createdAt || new Date().toISOString(),
        type: getFileTypeFromName(file.name),
        favorite: file.favorite || false,
        tags: file.tags || [],
        mongoData: file
      }));
      
      // Sort by upload date (newest first)
      const sortedFiles = mongoFiles.sort((a, b) => 
        new Date(b.uploadedAt) - new Date(a.uploadedAt)
      );
      
      setFiles(sortedFiles);
      setFilteredFiles(sortedFiles);
      
      setNotifications(prev => [{
        id: Date.now(),
        message: `Loaded ${sortedFiles.length} files from MongoDB`,
        time: 'Just now',
        type: 'success'
      }, ...prev.slice(0, 9)]);
      
    } catch (error) {
      console.error('Error fetching from MongoDB:', error);
      
      setFiles([]);
      setFilteredFiles([]);
      
      setNotifications(prev => [{
        id: Date.now(),
        message: `Failed to fetch from MongoDB. Error: ${error.message}`,
        time: 'Just now',
        type: 'error'
      }, ...prev.slice(0, 9)]);
    } finally {
      setIsLoading(false);
    }
  };

  const getFileFormat = (filename) => {
    if (!filename) return '';
    const parts = filename.split('.');
    return parts.length > 1 ? parts.pop().toLowerCase() : '';
  };

  const getFileTypeFromName = (filename) => {
    const format = getFileFormat(filename);
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(format)) return 'image';
    if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv'].includes(format)) return 'document';
    if (['mp4', 'mov', 'avi', 'mkv', 'webm', 'wmv', 'flv'].includes(format)) return 'video';
    if (['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac'].includes(format)) return 'audio';
    return 'other';
  };

  const refreshFiles = () => {
    fetchFilesFromMongoDB();
    setNotifications(prev => [{
      id: Date.now(),
      message: 'Refreshing files from MongoDB...',
      time: 'Just now',
      type: 'info'
    }, ...prev.slice(0, 9)]);
  };

  useEffect(() => {
    filterAndSortFiles();
  }, [files, searchTerm, selectedCategory, sortBy, sortOrder]);

  useEffect(() => {
    calculateStats();
  }, [files]);

  const IMAGE_EXT = /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i;
  const DOC_EXT = /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv)$/i;
  const PDF_EXT = /\.pdf$/i;
  const VIDEO_EXT = /\.(mp4|mov|avi|mkv|webm|wmv|flv)$/i;
  const AUDIO_EXT = /\.(mp3|wav|ogg|m4a|flac|aac)$/i;

  const isImage = (file) => {
    const name = (file.name || "").toLowerCase();
    const format = (file.format || "").toLowerCase();
    const type = file.type;
    
    return IMAGE_EXT.test(name) || 
           ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(format) ||
           type === 'image';
  };

  const isDocument = (file) => {
    const name = (file.name || "").toLowerCase();
    const format = (file.format || "").toLowerCase();
    const type = file.type;
    
    return DOC_EXT.test(name) || 
           ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv'].includes(format) ||
           type === 'document';
  };

  const isPDF = (file) => {
    const name = (file.name || "").toLowerCase();
    const format = (file.format || "").toLowerCase();
    return PDF_EXT.test(name) || format === 'pdf';
  };

  const isVideo = (file) => {
    const name = (file.name || "").toLowerCase();
    const format = (file.format || "").toLowerCase();
    const type = file.type;
    
    return VIDEO_EXT.test(name) || 
           ['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(format) ||
           type === 'video';
  };

  const isAudio = (file) => {
    const name = (file.name || "").toLowerCase();
    const format = (file.format || "").toLowerCase();
    const type = file.type;
    
    return AUDIO_EXT.test(name) || 
           ['mp3', 'wav', 'ogg', 'm4a', 'flac'].includes(format) ||
           type === 'audio';
  };

  const calculateStats = () => {
    if (!Array.isArray(files)) return;

    let images = 0;
    let documents = 0;
    let videos = 0;
    let audio = 0;
    let totalSize = 0;

    files.forEach(file => {
      totalSize += Number(file.size) || 0;

      if (isImage(file)) {
        images++;
      } else if (isDocument(file)) {
        documents++;
      } else if (isVideo(file)) {
        videos++;
      } else if (isAudio(file)) {
        audio++;
      }
    });

    setStats({
      totalFiles: files.length,
      totalSize,
      images,
      documents,
      videos,
      audio,
      others: files.length - images - documents - videos - audio
    });
  };

  const filterAndSortFiles = () => {
    let result = [...files];

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(file =>
        file.name.toLowerCase().includes(term) ||
        (file.format && file.format.toLowerCase().includes(term)) ||
        (file.tags && file.tags.some(tag => tag.toLowerCase().includes(term)))
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
          case 'video':
            return isVideo(file);
          case 'audio':
            return isAudio(file);
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

      if (diffDays === 0) return 'Today';
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

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Unknown date/time';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
    } catch (error) {
      return 'Invalid date/time';
    }
  };

  const getFileIcon = (file) => {
    if (isImage(file)) return <Image className="w-5 h-5 text-blue-500" />;
    if (isPDF(file)) return <FileText className="w-5 h-5 text-red-500" />;
    if (isDocument(file)) {
      const format = (file.format || '').toLowerCase();
      if (['doc', 'docx'].includes(format)) return <FileText className="w-5 h-5 text-blue-600" />;
      if (['xls', 'xlsx', 'csv'].includes(format)) return <FileText className="w-5 h-5 text-green-600" />;
      if (['ppt', 'pptx'].includes(format)) return <FileText className="w-5 h-5 text-orange-600" />;
      return <FileText className="w-5 h-5 text-gray-500" />;
    }
    if (isVideo(file)) return <Video className="w-5 h-5 text-purple-500" />;
    if (isAudio(file)) return <Music className="w-5 h-5 text-pink-500" />;
    return <File className="w-5 h-5 text-gray-500" />;
  };

  const showDeleteConfirmation = (type, fileId = null, fileName = null, count = 0) => {
    setDeleteConfirmation({
      show: true,
      type,
      fileId,
      fileName,
      count
    });
  };








  // DELETE METHOD for single file
  const deleteFileFromMongoDB = async (fileId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/${fileId}`);
      
      if (response.status === 200 || response.status === 204) {
        return { success: true, data: response.data };
      } else {
        throw new Error(`Failed to delete file: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting from MongoDB:', error);
      throw error;
    }
  };



  // BULK DELETE METHOD for multiple files
  const deleteMultipleFilesFromMongoDB = async (fileIds) => {
    try {
      // If your backend supports bulk delete, use this endpoint
      // Otherwise, delete one by one
      const deletePromises = fileIds.map(id => 
        axios.delete(`${API_BASE_URL}/${id}`)
      );
      
      const results = await Promise.all(deletePromises);
      return { success: true, results };
    } catch (error) {
      console.error('Error deleting multiple files:', error);
      throw error;
    }
  };








  







  const handleDeleteConfirmed = async () => {
    const { type, fileId } = deleteConfirmation;

    try {
      setIsLoading(true);

      if (type === 'single' && fileId) {
        // Find the file to delete
        const fileToDelete = files.find(f => f.id === fileId);
        
        if (fileToDelete) {
          // Delete from MongoDB using DELETE method
          await deleteFileFromMongoDB(fileId);
          
          // Update local state
          const updatedFiles = files.filter(file => file.id !== fileId);
          setFiles(updatedFiles);
          setSelectedFiles(selectedFiles.filter(id => id !== fileId));

          setNotifications(prev => [{
            id: Date.now(),
            message: `Successfully deleted file: ${fileToDelete.name}`,
            time: 'Just now',
            type: 'success'
          }, ...prev.slice(0, 9)]);
        }
      } else if (type === 'multiple') {
        // Delete multiple files from MongoDB
        const filesToDelete = files.filter(file => selectedFiles.includes(file.id));
        
        // Use bulk delete or individual delete
        await deleteMultipleFilesFromMongoDB(selectedFiles);
        
        // Update local state
        const updatedFiles = files.filter(file => !selectedFiles.includes(file.id));
        setFiles(updatedFiles);
        setSelectedFiles([]);

        setNotifications(prev => [{
          id: Date.now(),
          message: `Successfully deleted ${selectedFiles.length} files`,
          time: 'Just now',
          type: 'success'
        }, ...prev.slice(0, 9)]);
      }
    } catch (error) {
      console.error('Error deleting files:', error);
      setNotifications(prev => [{
        id: Date.now(),
        message: `Failed to delete files: ${error.message}`,
        time: 'Just now',
        type: 'error'
      }, ...prev.slice(0, 9)]);
    } finally {
      setIsLoading(false);
      setDeleteConfirmation({
        show: false,
        type: 'single',
        fileId: null,
        fileName: null,
        count: 0
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmation({
      show: false,
      type: 'single',
      fileId: null,
      fileName: null,
      count: 0
    });
  };

  const handleDownload = (file) => {
    if (!file.url) {
      setNotifications(prev => [{
        id: Date.now(),
        message: `No download available for ${file.name}`,
        time: 'Just now',
        type: 'warning'
      }, ...prev.slice(0, 9)]);
      return;
    }

    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name || 'download';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setNotifications(prev => [{
      id: Date.now(),
      message: `Downloading: ${file.name}`,
      time: 'Just now',
      type: 'success'
    }, ...prev.slice(0, 9)]);
  };

  const handleOpenFile = (file) => {
    if (!file.url) {
      setNotifications(prev => [{
        id: Date.now(),
        message: `Cannot open file: ${file.name}`,
        time: 'Just now',
        type: 'warning'
      }, ...prev.slice(0, 9)]);
      return;
    }

    window.open(file.url, '_blank', 'noopener,noreferrer');
    
    setNotifications(prev => [{
      id: Date.now(),
      message: `Opened file: ${file.name}`,
      time: 'Just now',
      type: 'info'
    }, ...prev.slice(0, 9)]);
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

  const copyFileLink = (file) => {
    const link = file.url || '';
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

  const handleFavorite = async (id) => {
    try {
      const fileToUpdate = files.find(f => f.id === id);
      if (!fileToUpdate) return;

      const updatedFavoriteStatus = !fileToUpdate.favorite;
      
      // Update in MongoDB using PATCH method
      const response = await axios.patch(`${API_BASE_URL}/${id}`, {
        favorite: updatedFavoriteStatus
      });
      
      if (response.status === 200) {
        const updatedFiles = files.map(file =>
          file.id === id ? { ...file, favorite: updatedFavoriteStatus } : file
        );
        setFiles(updatedFiles);
        
        setNotifications(prev => [{
          id: Date.now(),
          message: updatedFavoriteStatus ? 'Added to favorites' : 'Removed from favorites',
          time: 'Just now',
          type: 'success'
        }, ...prev.slice(0, 9)]);
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
      setNotifications(prev => [{
        id: Date.now(),
        message: 'Failed to update favorite status',
        time: 'Just now',
        type: 'error'
      }, ...prev.slice(0, 9)]);
    }
  };

  const categories = [
    { id: 'all', name: 'All Files', icon: <FolderOpen className="w-4 h-4" />, count: files.length },
    { id: 'image', name: 'Images', icon: <Image className="w-4 h-4" />, count: stats.images },
    { id: 'document', name: 'Documents', icon: <FileText className="w-4 h-4" />, count: stats.documents },
    { id: 'video', name: 'Videos', icon: <Video className="w-4 h-4" />, count: stats.videos || 0 },
    { id: 'audio', name: 'Audio', icon: <Music className="w-4 h-4" />, count: stats.audio || 0 },
    { id: 'other', name: 'Others', icon: <File className="w-4 h-4" />, count: stats.others },
  ];

  return (
    <>
      <Helmet>
        <title>Tullu Dimtu Secondary School - Admin Dashboard</title>
      </Helmet>

      {deleteConfirmation.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-red-100 p-3 rounded-full">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-center text-gray-800 mb-3">
              Are you sure you want to delete?
            </h3>
            
            <p className="text-gray-600 text-center mb-6">
              {deleteConfirmation.type === 'single' 
                ? `"${deleteConfirmation.fileName}" will be permanently deleted from the database. This action cannot be undone.`
                : `${deleteConfirmation.count} files will be permanently deleted from the database. This action cannot be undone.`
              }
            </p>
            
            <div className="flex space-x-4">
              <button
                onClick={handleDeleteCancel}
                className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
              >
                No, Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
                disabled={isLoading}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {isLoading ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50">
        <div className="fixed left-2 sm:left-4 top-2 sm:top-4 z-20">
          <button
            onClick={() => navigate('/admin-control')}
            className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        </div>

        <div className="p-4 md:p-6 pt-20">
          <div className="border-b border-gray-200 pb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 ml-16">File Management Dashboard</h1>
            <p className="text-gray-600 mt-2 ml-16">Manage files uploaded to database</p>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <Database className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
              <div>
                <p className="text-blue-800 font-medium">Connected to MongoDB Database</p>
                <p className="text-blue-700 text-sm mt-1">
                  Files are fetched directly from your MongoDB database. 
                  All operations (GET, DELETE, PATCH) are performed on the server.
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center mt-2 space-y-2 sm:space-y-0 sm:space-x-4">
                  <button
                    onClick={refreshFiles}
                    disabled={isLoading}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm w-full sm:w-auto"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>{isLoading ? 'Loading...' : 'Refresh Files'}</span>
                  </button>
                  <span className="text-blue-600 text-sm text-center sm:text-left">
                    {files.length} file{files.length !== 1 ? 's' : ''} loaded from database
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8 mt-6 md:mt-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 md:p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Files</p>
                  <h3 className="text-2xl md:text-3xl font-bold mt-2">{stats.totalFiles}</h3>
                </div>
                <FolderOpen className="w-8 h-8 md:w-10 md:h-10 opacity-80" />
              </div>
              <div className="mt-4 pt-4 border-t border-blue-400">
                <p className="text-xs md:text-sm text-blue-100">Storage: {formatFileSize(stats.totalSize)}</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 md:p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Images</p>
                  <h3 className="text-2xl md:text-3xl font-bold mt-2">{stats.images}</h3>
                </div>
                <Image className="w-8 h-8 md:w-10 md:h-10 opacity-80" />
              </div>
              <div className="mt-4 pt-4 border-t border-green-400">
                <p className="text-xs md:text-sm text-green-100">Photos and graphics</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 md:p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Documents</p>
                  <h3 className="text-2xl md:text-3xl font-bold mt-2">{stats.documents}</h3>
                </div>
                <FileText className="w-8 h-8 md:w-10 md:h-10 opacity-80" />
              </div>
              <div className="mt-4 pt-4 border-t border-purple-400">
                <p className="text-xs md:text-sm text-purple-100">PDFs, Docs, Sheets</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 md:p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Others</p>
                  <h3 className="text-2xl md:text-3xl font-bold mt-2">{stats.others}</h3>
                </div>
                <File className="w-8 h-8 md:w-10 md:h-10 opacity-80" />
              </div>
              <div className="mt-4 pt-4 border-t border-orange-400">
                <p className="text-xs md:text-sm text-orange-100">Audio, Video, Archives</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-4 md:mb-6">
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
                        <span className={`mr-3 ${selectedCategory === category.id ? 'text-blue-500' : 'text-gray-500'}`}>
                          {category.icon}
                        </span>
                        <span className="text-sm md:text-base">{category.name}</span>
                      </div>
                      <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="mt-6 md:mt-8">
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
                        <span className="capitalize text-sm md:text-base">{sort}</span>
                        {sortBy === sort && (
                          <span className="text-xs font-medium">
                            {sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-4 md:p-6 border-b border-gray-200">
                  <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          placeholder="Search files by name, type, or tags..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 md:space-x-4">
                      <div className="flex items-center bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => setViewMode('grid')}
                          className={`p-2 rounded-md ${viewMode === 'grid'
                              ? 'bg-white shadow-sm text-blue-600'
                              : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                          <Grid className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                        <button
                          onClick={() => setViewMode('list')}
                          className={`p-2 rounded-md ${viewMode === 'list'
                              ? 'bg-white shadow-sm text-blue-600'
                              : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                          <List className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                      </div>

                      {selectedFiles.length > 0 && (
                        <div className="flex items-center space-x-2">
                          <span className="text-xs md:text-sm text-gray-600 hidden sm:inline">
                            {selectedFiles.length} selected
                          </span>
                          <button
                            onClick={() => showDeleteConfirmation('multiple', null, null, selectedFiles.length)}
                            className="flex items-center space-x-1 md:space-x-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm"
                          >
                            <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                            <span className="hidden md:inline">Delete</span>
                          </button>
                          <button
                            onClick={() => selectedFiles.forEach(id => {
                              const file = files.find(f => f.id === id);
                              if (file) handleDownload(file);
                            })}
                            className="flex items-center space-x-1 md:space-x-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm"
                          >
                            <Download className="w-3 h-3 md:w-4 md:h-4" />
                            <span className="hidden md:inline">Download</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={handleSelectAll}
                        className="text-xs md:text-sm text-gray-600 hover:text-gray-800"
                      >
                        {selectedFiles.length === filteredFiles.length
                          ? 'Deselect All'
                          : 'Select All'
                        }
                      </button>
                      {selectedFiles.length > 0 && (
                        <button
                          onClick={() => setSelectedFiles([])}
                          className="text-xs md:text-sm text-gray-600 hover:text-gray-800"
                        >
                          Clear Selection
                        </button>
                      )}
                    </div>

                    <div className="text-xs md:text-sm text-gray-500">
                      Showing {filteredFiles.length} of {files.length} files
                    </div>
                  </div>
                </div>

                <div className="p-4 md:p-6">
                  {isLoading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-4 text-gray-600">Loading files from database...</p>
                    </div>
                  ) : filteredFiles.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                        <FolderOpen className="w-10 h-10 md:w-12 md:h-12 text-gray-400" />
                      </div>
                      <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-2">No files found</h3>
                      <p className="text-gray-500 mb-6 text-sm md:text-base">
                        {searchTerm || selectedCategory !== 'all'
                          ? 'Try changing your search or filter criteria'
                          : 'No files found in your database. Upload files to get started.'
                        }
                      </p>
                      <button
                        onClick={() => navigate('/upload')}
                        className="inline-flex items-center space-x-2 px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all text-sm md:text-base"
                      >
                        <Upload className="w-4 h-4 md:w-5 md:h-5" />
                        <span>Go to Upload Page</span>
                      </button>
                    </div>
                  ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                      {filteredFiles.map(file => (
                        <div
                          key={file.id}
                          className={`group relative border rounded-xl overflow-hidden transition-all duration-200 ${selectedFiles.includes(file.id)
                              ? 'border-blue-500 ring-2 ring-blue-100'
                              : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                            }`}
                        >
                          <div className="absolute top-2 left-2 z-10">
                            <input
                              type="checkbox"
                              checked={selectedFiles.includes(file.id)}
                              onChange={() => handleSelectFile(file.id)}
                              className="w-4 h-4 md:w-5 md:h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </div>

                          <div className="absolute top-2 right-2 z-10 flex space-x-1">
                            <button
                              onClick={() => handleFavorite(file.id)}
                              className="p-1 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white"
                            >
                              {file.favorite ? (
                                <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-500 fill-yellow-500" />
                              ) : (
                                <StarOff className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
                              )}
                            </button>
                            <button
                              onClick={() => handleOpenFile(file)}
                              className="p-1 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white"
                            >
                              <Maximize2 className="w-3 h-3 md:w-4 md:h-4 text-gray-700" />
                            </button>
                          </div>

                          {isImage(file) && file.url ? (
                            <div className="h-40 md:h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center cursor-pointer"
                                 onClick={() => handleOpenFile(file)}>
                              <img
                                src={file.url}
                                alt={file.name}
                                className="max-h-full max-w-full object-contain p-4"
                                loading="lazy"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.parentElement.innerHTML = `
                                    <div class="text-center p-4 w-full">
                                      ${getFileIcon(file)}
                                      <p class="mt-2 text-xs md:text-sm text-gray-600">Image preview unavailable</p>
                                    </div>
                                  `;
                                }}
                              />
                            </div>
                          ) : isPDF(file) && file.url ? (
                            <div className="h-40 md:h-48 bg-gradient-to-br from-red-50 to-pink-50 flex flex-col items-center justify-center p-4 md:p-6 cursor-pointer"
                                 onClick={() => handleOpenFile(file)}>
                              <div className="text-3xl md:text-4xl mb-3 md:mb-4 text-red-500">
                                <FileText className="w-12 h-12 md:w-16 md:h-16" />
                              </div>
                              <div className="text-center">
                                <p className="font-medium text-gray-800 text-sm mb-1 line-clamp-1">
                                  {file.name}
                                </p>
                                <p className="text-xs text-red-500 font-medium">PDF Document</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatFileSize(file.size)}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="h-40 md:h-48 bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center p-4 md:p-6 cursor-pointer"
                                 onClick={() => handleOpenFile(file)}>
                              <div className="text-3xl md:text-4xl mb-3 md:mb-4">
                                {getFileIcon(file)}
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

                          <div className="p-3 md:p-4 border-t border-gray-100">
                            <div className="mb-2 flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Clock className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                                <span className="text-xs text-gray-500" title={formatDateTime(file.uploadedAt)}>
                                  {formatDate(file.uploadedAt)}
                                </span>
                              </div>
                              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                {file.format ? file.format.toUpperCase() : 'FILE'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="text-xs text-gray-400 truncate mr-2">
                                Uploaded: {formatDateTime(file.uploadedAt)}
                              </div>
                              <div className="flex items-center space-x-1 md:space-x-2 shrink-0">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownload(file);
                                  }}
                                  className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                                  title="Download file"
                                >
                                  <Download className="w-3 h-3 md:w-4 md:h-4" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyFileLink(file);
                                  }}
                                  className="p-1 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded"
                                  title="Copy link"
                                >
                                  <Copy className="w-3 h-3 md:w-4 md:h-4" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    showDeleteConfirmation('single', file.id, file.name, 1);
                                  }}
                                  className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                                >
                                  <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2 md:space-y-3">
                      {filteredFiles.map(file => (
                        <div
                          key={file.id}
                          className={`flex flex-col sm:flex-row sm:items-center p-3 md:p-4 rounded-lg border transition-all ${selectedFiles.includes(file.id)
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                          <div className="flex items-center flex-1 min-w-0 mb-3 sm:mb-0">
                            <input
                              type="checkbox"
                              checked={selectedFiles.includes(file.id)}
                              onChange={() => handleSelectFile(file.id)}
                              className="mr-3 w-4 h-4 md:w-5 md:h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <div className="flex items-center space-x-3 md:space-x-4 flex-1 min-w-0">
                              <div className="p-2 md:p-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg">
                                {getFileIcon(file)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0">
                                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                                    <p className="font-medium text-gray-800 truncate text-sm md:text-base">
                                      {file.name}
                                    </p>
                                    {file.favorite && (
                                      <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-500 fill-yellow-500 shrink-0" />
                                    )}
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                      {file.format ? file.format.toUpperCase() : 'UNKNOWN'}
                                    </span>
                                    <span className="text-xs text-gray-500 hidden md:inline">
                                      {formatFileSize(file.size)}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500">
                                  <div className="flex items-center space-x-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{formatDate(file.uploadedAt)}</span>
                                  </div>
                                  <span className="hidden sm:inline">•</span>
                                  <span className="text-gray-400" title={formatDateTime(file.uploadedAt)}>
                                    {formatDateTime(file.uploadedAt)}
                                  </span>
                                  <span className="md:hidden">•</span>
                                  <span className="md:hidden text-gray-500">
                                    {formatFileSize(file.size)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-end sm:justify-start space-x-1 md:space-x-2 mt-3 sm:mt-0">
                            <button
                              onClick={() => handleFavorite(file.id)}
                              className="p-1.5 md:p-2 text-gray-500 hover:text-yellow-500 hover:bg-yellow-50 rounded-lg"
                              title="Toggle favorite"
                            >
                              {file.favorite ? (
                                <Star className="w-3 h-3 md:w-4 md:h-4 fill-yellow-500" />
                              ) : (
                                <StarOff className="w-3 h-3 md:w-4 md:h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => handleOpenFile(file)}
                              className="p-1.5 md:p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg"
                              title="Open in new tab"
                            >
                              <Maximize2 className="w-3 h-3 md:w-4 md:h-4" />
                            </button>
                            <button
                              onClick={() => handleDownload(file)}
                              className="p-1.5 md:p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg"
                              title="Download"
                            >
                              <Download className="w-3 h-3 md:w-4 md:h-4" />
                            </button>
                            <button
                              onClick={() => copyFileLink(file)}
                              className="p-1.5 md:p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg"
                              title="Copy link"
                            >
                              <Copy className="w-3 h-3 md:w-4 md:h-4" />
                            </button>
                            <button
                              onClick={() => showDeleteConfirmation('single', file.id, file.name, 1)}
                              className="p-1.5 md:p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                              title="Delete"
                            >
                              <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPage;