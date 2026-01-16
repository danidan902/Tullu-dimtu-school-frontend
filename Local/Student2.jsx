


import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { PDFDocument } from 'pdf-lib';
import imageCompression from 'browser-image-compression';

// ========== HYPER-FAST COMPRESSION SYSTEM ==========
const FAST_COMPRESS_CONFIG = {
  pdf: { targetMB: 5, quality: 0.8 },
  video: { targetMB: 20, quality: 0.6 },
  image: { targetMB: 1, quality: 0.7, maxWidth: 1200 },
  skipThreshold: 2 * 1024 * 1024,
  maxFileSize: 500 * 1024 * 1024
};

const fastCompressPDF = async (file) => {
  if (file.size < FAST_COMPRESS_CONFIG.skipThreshold) return file;
  
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    pdfDoc.setTitle('');
    pdfDoc.setAuthor('');
    pdfDoc.setSubject('');
    
    const compressedBytes = await pdfDoc.save({
      useObjectStreams: true,
      compress: true
    });
    
    return new File([compressedBytes], file.name, { type: 'application/pdf' });
  } catch (e) {
    console.warn('Fast PDF compression failed, using original');
    return file;
  }
};

const fastCompressImage = async (file) => {
  if (file.size < FAST_COMPRESS_CONFIG.skipThreshold) return file;
  
  try {
    const options = {
      maxSizeMB: FAST_COMPRESS_CONFIG.image.targetMB,
      maxWidthOrHeight: FAST_COMPRESS_CONFIG.image.maxWidth,
      quality: FAST_COMPRESS_CONFIG.image.quality,
      useWebWorker: true,
      initialQuality: 0.8
    };
    
    const compressed = await imageCompression(file, options);
    return new File([compressed], file.name, { type: file.type });
  } catch (e) {
    console.warn('Fast image compression failed, using original');
    return file;
  }
};

const detectFileType = (file) => {
  const ext = file.name.split('.').pop().toLowerCase();
  const mime = file.type;
  
  if (mime === 'application/pdf' || ext === 'pdf') return 'pdf';
  if (mime.startsWith('image/')) return 'image';
  if (mime.startsWith('video/')) return 'video';
  if (mime.startsWith('audio/')) return 'audio';
  return 'document';
};

const processFileUltraFast = async (file, onProgress) => {
  console.log(`Processing: ${file.name} (${(file.size / 1024 / 1024).toFixed(1)}MB)`);
  
  if (file.size > FAST_COMPRESS_CONFIG.maxFileSize) {
    throw new Error(`File exceeds ${FAST_COMPRESS_CONFIG.maxFileSize / 1024 / 1024}MB limit`);
  }
  
  if (onProgress) onProgress(10);
  
  const fileType = detectFileType(file);
  let processedFile = file;
  
  if (fileType === 'pdf') {
    if (onProgress) onProgress(30);
    processedFile = await fastCompressPDF(file);
  } else if (fileType === 'image') {
    if (onProgress) onProgress(40);
    processedFile = await fastCompressImage(file);
  }
  
  if (onProgress) onProgress(80);
  
  const sizeReduction = ((file.size - processedFile.size) / file.size * 100).toFixed(1);
  console.log(`Processed: ${(processedFile.size / 1024 / 1024).toFixed(1)}MB (${sizeReduction}% reduction)`);
  
  if (onProgress) onProgress(100);
  return { file: processedFile, originalSize: file.size, compressedSize: processedFile.size, reduction: sizeReduction };
};

// ========== CLOUDINARY UPLOAD ==========
const CLOUD_NAME = 'duz0kwsrd';
const UPLOAD_PRESET = 'study_materials';

const uploadToCloudinaryFast = async (file, isThumbnail, onProgress) => {
  const folder = isThumbnail ? 'study_materials/thumbnails' : 'study_materials';
  
  if (file.size > 20 * 1024 * 1024) {
    return await uploadChunked(file, folder, onProgress);
  }
  
  return await uploadDirect(file, folder, onProgress);
};

const uploadDirect = async (file, folder, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', folder);
  
  const response = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, formData, {
    onUploadProgress: (e) => {
      if (e.total && onProgress) onProgress(Math.round((e.loaded * 100) / e.total));
    },
    timeout: 300000,
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  
  return {
    url: response.data.secure_url,
    publicId: response.data.public_id,
    bytes: response.data.bytes
  };
};

const uploadChunked = async (file, folder, onProgress) => {
  const CHUNK_SIZE = 10 * 1024 * 1024;
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', folder);
  formData.append('chunk_size', CHUNK_SIZE);
  
  const response = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, formData, {
    onUploadProgress: (e) => {
      if (e.total && onProgress) {
        const progress = Math.round((e.loaded * 100) / e.total);
        onProgress(progress);
      }
    },
    timeout: 600000,
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  
  return {
    url: response.data.secure_url,
    publicId: response.data.public_id,
    bytes: response.data.bytes
  };
};

// ========== STUDENT DASHBOARD COMPONENT ==========
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const StudentDashboard = () => {
  // State
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState(null);
  const [fileTypeStats, setFileTypeStats] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [playerVisible, setPlayerVisible] = useState(false);
  const [playerUrl, setPlayerUrl] = useState('');
  const [playerType, setPlayerType] = useState('');
  const [selectedFileType, setSelectedFileType] = useState('all');

  // Data
  const grades = ['Kindergarten','Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7','Grade 8','Grade 9','Grade 10','Grade 11','Grade 12','College','University','Graduate'];
  const subjects = ['Mathematics','Science','Physics','Chemistry','Biology','English','Literature','History','Geography','Social Studies','Computer Science','Programming','Art','Music','Physical Education','Foreign Languages','Economics','Business','Psychology','Philosophy'];
  const categories = ['lecture', 'assignment', 'video', 'presentation', 'quiz', 'resource', 'project'];
  const fileTypes = ['pdf', 'video', 'image', 'audio', 'document', 'presentation', 'spreadsheet', 'archive'];
  
  const categoryColors = {
    lecture: 'bg-blue-100 text-blue-800',
    assignment: 'bg-green-100 text-green-800',
    video: 'bg-red-100 text-red-800',
    presentation: 'bg-purple-100 text-purple-800',
    quiz: 'bg-yellow-100 text-yellow-800',
    resource: 'bg-indigo-100 text-indigo-800',
    project: 'bg-teal-100 text-teal-800'
  };
  
  const categoryNames = {
    lecture: 'Lecture Notes',
    assignment: 'Assignments',
    video: 'Video Lessons',
    presentation: 'Presentations',
    quiz: 'Quizzes & Tests',
    resource: 'Resources',
    project: 'Project Guides'
  };
  
  const fileTypeColors = {
    pdf: 'bg-red-100 text-red-800',
    video: 'bg-blue-100 text-blue-800',
    image: 'bg-green-100 text-green-800',
    audio: 'bg-purple-100 text-purple-800',
    document: 'bg-yellow-100 text-yellow-800',
    presentation: 'bg-indigo-100 text-indigo-800',
    spreadsheet: 'bg-teal-100 text-teal-800',
    archive: 'bg-gray-100 text-gray-800'
  };
  
  const fileTypeNames = {
    pdf: 'PDF Documents',
    video: 'Video Files',
    image: 'Images',
    audio: 'Audio Files',
    document: 'Documents',
    presentation: 'Presentations',
    spreadsheet: 'Spreadsheets',
    archive: 'Archives'
  };
  
  const fileTypeIcons = {
    pdf: '📄',
    video: '🎬',
    image: '🖼️',
    audio: '🎵',
    document: '📝',
    presentation: '📊',
    spreadsheet: '📈',
    archive: '📦'
  };

  // Initialize
  useEffect(() => { 
    fetchMaterials();
    fetchStatistics();
    calculateFileTypeStats();
  }, [materials]);

  // Filter materials
  useEffect(() => {
    let filtered = [...materials];
    
    if (searchTerm) {
      filtered = filtered.filter(m => 
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.tags && m.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }
    
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(m => m.subject === selectedSubject);
    }
    
    if (selectedGrade !== 'all') {
      filtered = filtered.filter(m => m.grade === selectedGrade);
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(m => m.category === selectedCategory);
    }
    
    if (selectedFileType !== 'all') {
      filtered = filtered.filter(m => m.fileType === selectedFileType);
    }
    
    // Apply tab filters
    switch (activeTab) {
      case 'recent':
        filtered = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'popular':
        filtered = filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'downloaded':
        filtered = filtered.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
        break;
    }
    
    setFilteredMaterials(filtered);
  }, [materials, searchTerm, selectedSubject, selectedGrade, selectedCategory, selectedFileType, activeTab]);

  // API calls
  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/materials/student`);
      if (res.data.success) {
        const fetchedMaterials = res.data.data || [];
        setMaterials(fetchedMaterials);
        setFilteredMaterials(fetchedMaterials);
      }
    } catch (e) { 
      console.error('Fetch error:', e); 
    } finally { 
      setLoading(false); 
    }
  };

  const fetchStatistics = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/materials/stats/summary`);
      if (res.data.success) setStatistics(res.data.data);
    } catch (e) { 
      console.error('Stats error:', e); 
    }
  };

  const calculateFileTypeStats = () => {
    if (materials.length === 0) return;
    
    const stats = {
      pdf: { count: 0, views: 0, downloads: 0, size: 0 },
      video: { count: 0, views: 0, downloads: 0, size: 0 },
      image: { count: 0, views: 0, downloads: 0, size: 0 },
      audio: { count: 0, views: 0, downloads: 0, size: 0 },
      document: { count: 0, views: 0, downloads: 0, size: 0 },
      presentation: { count: 0, views: 0, downloads: 0, size: 0 },
      spreadsheet: { count: 0, views: 0, downloads: 0, size: 0 },
      archive: { count: 0, views: 0, downloads: 0, size: 0 }
    };
    
    materials.forEach(material => {
      const fileType = material.fileType || 'document';
      if (stats[fileType]) {
        stats[fileType].count++;
        stats[fileType].views += material.views || 0;
        stats[fileType].downloads += material.downloads || 0;
        
        // Parse file size if available
        if (material.fileSize) {
          const sizeMatch = material.fileSize.match(/(\d+\.?\d*)/);
          if (sizeMatch) {
            stats[fileType].size += parseFloat(sizeMatch[1]);
          }
        }
      }
    });
    
    setFileTypeStats(stats);
  };

  const handleViewMaterial = async (material) => {
    try {
      // Increment view count
      await axios.put(`${API_BASE_URL}/materials/${material._id}`, {
        views: (material.views || 0) + 1
      });
      
      // Update local state
      setMaterials(prev => prev.map(m => 
        m._id === material._id ? { ...m, views: (m.views || 0) + 1 } : m
      ));
      
      // Set selected material
      setSelectedMaterial(material);
      
      // Open appropriate viewer
      if (material.fileType === 'video' || (material.mimeType && material.mimeType.startsWith('video/'))) {
        setPlayerType('video');
        setPlayerUrl(material.fileUrl);
        setPlayerVisible(true);
      } else if (material.fileType === 'pdf' || material.fileUrl.includes('.pdf')) {
        setPlayerType('pdf');
        setPlayerUrl(material.fileUrl);
        setPlayerVisible(true);
      } else if (material.fileType === 'image' || (material.mimeType && material.mimeType.startsWith('image/'))) {
        setPlayerType('image');
        setPlayerUrl(material.fileUrl);
        setPlayerVisible(true);
      } else {
        window.open(material.fileUrl, '_blank');
      }
    } catch (error) {
      console.error('View error:', error);
    }
  };

  const handleDownload = async (material) => {
    try {
      // Increment download count
      await axios.put(`${API_BASE_URL}/materials/${material._id}`, {
        downloads: (material.downloads || 0) + 1
      });
      
      // Update local state
      setMaterials(prev => prev.map(m => 
        m._id === material._id ? { ...m, downloads: (m.downloads || 0) + 1 } : m
      ));
      
      // Download file
      const link = document.createElement('a');
      link.href = material.fileUrl;
      link.download = material.fileName || material.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const handleBookmark = async (material) => {
    try {
      const newBookmarked = !material.bookmarked;
      await axios.put(`${API_BASE_URL}/materials/${material._id}`, {
        bookmarked: newBookmarked
      });
      
      setMaterials(prev => prev.map(m => 
        m._id === material._id ? { ...m, bookmarked: newBookmarked } : m
      ));
    } catch (error) {
      console.error('Bookmark error:', error);
    }
  };

  const formatFileSize = (size) => {
    if (!size) return 'N/A';
    const mb = parseFloat(size);
    if (isNaN(mb)) return size;
    return `${mb.toFixed(1)} MB`;
  };

  // Player component
  const MediaPlayer = () => {
    if (!playerVisible) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">
              {selectedMaterial?.title}
            </h3>
            <button
              onClick={() => setPlayerVisible(false)}
              className="text-gray-500 hover:text-gray-700 text-lg font-bold px-3 py-1 rounded hover:bg-gray-100"
            >
              Close
            </button>
          </div>
          
          <div className="flex-1 overflow-auto p-4">
            {playerType === 'video' ? (
              <div className="h-full">
                <video
                  controls
                  autoPlay
                  className="w-full h-full max-h-[70vh] rounded-lg"
                  src={playerUrl}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : playerType === 'pdf' ? (
              <div className="h-full">
                <iframe
                  src={`${playerUrl}#view=fitH`}
                  className="w-full h-full min-h-[70vh] rounded-lg border"
                  title="PDF Viewer"
                />
              </div>
            ) : playerType === 'image' ? (
              <div className="h-full flex items-center justify-center">
                <img
                  src={playerUrl}
                  alt={selectedMaterial?.title}
                  className="max-w-full max-h-[70vh] rounded-lg object-contain"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <a
                  href={playerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Open in New Tab
                </a>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t bg-gray-50">
            <div className="flex flex-wrap gap-4 justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{selectedMaterial?.title}</h4>
                <p className="text-sm text-gray-600">{selectedMaterial?.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${fileTypeColors[selectedMaterial?.fileType] || 'bg-gray-100 text-gray-800'}`}>
                    {fileTypeNames[selectedMaterial?.fileType] || selectedMaterial?.fileType}
                  </span>
                  <span className="text-xs text-gray-500">
                    Size: {formatFileSize(selectedMaterial?.fileSize)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleDownload(selectedMaterial)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Material card component - Enhanced
  const MaterialCard = ({ material }) => (
    <div className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col">
      {/* Card Header with File Type */}
      <div className={`p-3 ${fileTypeColors[material.fileType] || 'bg-gray-100'}`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{fileTypeIcons[material.fileType] || '📎'}</span>
            <span className="text-xs font-semibold uppercase">
              {material.fileType || 'File'}
            </span>
          </div>
          <button
            onClick={() => handleBookmark(material)}
            className={`p-1 rounded-full ${material.bookmarked ? 'text-yellow-500 bg-white bg-opacity-30' : 'text-white text-opacity-70 hover:text-yellow-300'}`}
          >
            {material.bookmarked ? '★' : '☆'}
          </button>
        </div>
      </div>
      
      {/* Thumbnail/Preview Area */}
      <div 
        className="h-40 bg-gradient-to-br from-gray-50 to-blue-50 cursor-pointer relative group overflow-hidden"
        onClick={() => handleViewMaterial(material)}
      >
        {material.thumbnailUrl ? (
          <img
            src={material.thumbnailUrl}
            alt={material.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className={`text-4xl mb-2 ${material.fileType === 'pdf' ? 'text-red-400' : material.fileType === 'video' ? 'text-blue-400' : material.fileType === 'image' ? 'text-green-400' : 'text-gray-400'}`}>
              {fileTypeIcons[material.fileType] || '📎'}
            </div>
            <div className="text-xs font-medium text-gray-500 text-center">
              {fileTypeNames[material.fileType] || 'Document'}
            </div>
          </div>
        )}
        
        {/* Play Button for Videos */}
        {material.fileType === 'video' && (
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
              <div className="w-0 h-0 border-t-4 border-b-4 border-l-6 border-transparent border-l-blue-600 ml-0.5"></div>
            </div>
          </div>
        )}
      </div>
      
      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Category Badge */}
        <div className="mb-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[material.category] || 'bg-gray-100 text-gray-800'}`}>
            {categoryNames[material.category] || material.category}
          </span>
        </div>
        
        {/* Title */}
        <h3 
          className="font-bold text-gray-900 text-sm mb-2 cursor-pointer hover:text-blue-600 line-clamp-2"
          onClick={() => handleViewMaterial(material)}
          title={material.title}
        >
          {material.title}
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 text-xs mb-3 line-clamp-2 flex-1" title={material.description}>
          {material.description || 'No description available'}
        </p>
        
        {/* Metadata */}
        <div className="space-y-1 mb-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-gray-700">Subject:</span>
            <span className="text-gray-600">{material.subject || 'Not specified'}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-gray-700">Grade:</span>
            <span className="text-gray-600">{material.grade || 'Not specified'}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-gray-700">Size:</span>
            <span className="text-gray-600">{formatFileSize(material.fileSize)}</span>
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <span className="text-gray-400">👁️</span>
              <span>{material.views || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-gray-400">⬇️</span>
              <span>{material.downloads || 0}</span>
            </div>
          </div>
          <span className="text-xs">{new Date(material.createdAt).toLocaleDateString()}</span>
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-2 mt-auto">
          <button
            onClick={() => handleViewMaterial(material)}
            className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition text-xs font-medium"
          >
            {material.fileType === 'video' ? 'Watch' : 
             material.fileType === 'pdf' ? 'Read PDF' : 
             material.fileType === 'image' ? 'View Image' : 'Open'}
          </button>
          <button
            onClick={() => handleDownload(material)}
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-xs"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Student Learning Portal</h1>
              <p className="text-gray-600">Access study materials, videos, PDFs, images and resources</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-semibold text-gray-900">Welcome Back</p>
                <p className="text-sm text-gray-600">Student Dashboard</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                S
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Overview */}
      <div className="container mx-auto px-4 py-6">
        {/* Overall Statistics */}
        {statistics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow p-4">
              <div className="text-2xl font-bold text-blue-600">{statistics.totalMaterials || 0}</div>
              <div className="text-sm text-gray-600">Total Materials</div>
            </div>
            <div className="bg-white rounded-xl shadow p-4">
              <div className="text-2xl font-bold text-green-600">{statistics.totalViews || 0}</div>
              <div className="text-sm text-gray-600">Total Views</div>
            </div>
            <div className="bg-white rounded-xl shadow p-4">
              <div className="text-2xl font-bold text-purple-600">{statistics.totalDownloads || 0}</div>
              <div className="text-sm text-gray-600">Total Downloads</div>
            </div>
            <div className="bg-white rounded-xl shadow p-4">
              <div className="text-2xl font-bold text-yellow-600">{filteredMaterials.length}</div>
              <div className="text-sm text-gray-600">Currently Showing</div>
            </div>
          </div>
        )}
        
        {/* File Type Statistics */}
        {fileTypeStats && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Content by File Type</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
              {Object.entries(fileTypeStats).map(([type, stats]) => (
                stats.count > 0 && (
                  <div 
                    key={type}
                    className={`bg-white rounded-xl shadow-sm border p-3 cursor-pointer hover:shadow-md transition-shadow ${selectedFileType === type ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => setSelectedFileType(selectedFileType === type ? 'all' : type)}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="text-2xl mb-1">{fileTypeIcons[type]}</div>
                      <div className="text-sm font-semibold text-gray-900">{stats.count}</div>
                      <div className="text-xs text-gray-600 truncate w-full">
                        {fileTypeNames[type].split(' ')[0]}
                      </div>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        )}
        
        {/* File Type Details */}
        {fileTypeStats && selectedFileType !== 'all' && (
          <div className="bg-white rounded-xl shadow p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900">
                {fileTypeNames[selectedFileType]} Details
              </h3>
              <button
                onClick={() => setSelectedFileType('all')}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Show All Types
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">{fileTypeStats[selectedFileType].count}</div>
                <div className="text-xs text-gray-600">Files</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-600">{fileTypeStats[selectedFileType].views}</div>
                <div className="text-xs text-gray-600">Views</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-purple-600">{fileTypeStats[selectedFileType].downloads}</div>
                <div className="text-xs text-gray-600">Downloads</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-6">
              <h2 className="font-bold text-gray-900 text-lg mb-4">Filters</h2>
              
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search materials..."
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {/* File Type Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">File Type</label>
                <select
                  value={selectedFileType}
                  onChange={(e) => setSelectedFileType(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All File Types</option>
                  {fileTypes.map(type => (
                    <option key={type} value={type}>
                      {fileTypeNames[type]}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Subject Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Subjects</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
              
              {/* Grade Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level</label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Grades</option>
                  {grades.map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
              </div>
              
              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {categoryNames[category] || category}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* View Mode */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">View Mode</label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex-1 py-2 border rounded-lg ${viewMode === 'grid' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex-1 py-2 border rounded-lg ${viewMode === 'list' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                  >
                    List
                  </button>
                </div>
              </div>
              
              {/* Reset Filters */}
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSubject('all');
                  setSelectedGrade('all');
                  setSelectedCategory('all');
                  setSelectedFileType('all');
                }}
                className="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Reset All Filters
              </button>
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="lg:w-3/4">
            {/* Tabs and Stats */}
            <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'all' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                  >
                    All Materials
                  </button>
                  <button
                    onClick={() => setActiveTab('recent')}
                    className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'recent' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                  >
                    Recently Added
                  </button>
                  <button
                    onClick={() => setActiveTab('popular')}
                    className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'popular' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                  >
                    Most Popular
                  </button>
                  <button
                    onClick={() => setActiveTab('downloaded')}
                    className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'downloaded' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                  >
                    Most Downloaded
                  </button>
                </div>
                <div className="text-sm text-gray-600">
                  {searchTerm && `Search: "${searchTerm}"`}
                </div>
              </div>
              
              {/* Results Header */}
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900">
                  {filteredMaterials.length} Study Materials Found
                </h2>
                <div className="text-sm text-gray-500">
                  {selectedFileType !== 'all' && `${fileTypeNames[selectedFileType]} • `}
                  {selectedSubject !== 'all' && `${selectedSubject} • `}
                  {selectedCategory !== 'all' && `${categoryNames[selectedCategory]} • `}
                  Sorted by {activeTab === 'recent' ? 'Newest' : activeTab === 'popular' ? 'Popular' : activeTab === 'downloaded' ? 'Downloads' : 'Default'}
                </div>
              </div>
            </div>
            
            {/* Materials Grid/List */}
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Loading materials...</p>
              </div>
            ) : filteredMaterials.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMaterials.map(material => (
                    <MaterialCard key={material._id} material={material} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredMaterials.map(material => (
                    <div key={material._id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div 
                          className="w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex flex-col items-center justify-center cursor-pointer flex-shrink-0"
                          onClick={() => handleViewMaterial(material)}
                        >
                          <div className={`text-3xl mb-1 ${material.fileType === 'pdf' ? 'text-red-400' : material.fileType === 'video' ? 'text-blue-400' : material.fileType === 'image' ? 'text-green-400' : 'text-gray-400'}`}>
                            {fileTypeIcons[material.fileType] || '📎'}
                          </div>
                          <div className="text-xs font-medium text-gray-600 text-center px-1">
                            {material.fileType?.toUpperCase() || 'FILE'}
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 
                                className="font-bold text-gray-900 text-lg mb-1 cursor-pointer hover:text-blue-600"
                                onClick={() => handleViewMaterial(material)}
                              >
                                {material.title}
                              </h3>
                              <p className="text-gray-600 text-sm mb-2 line-clamp-2">{material.description}</p>
                            </div>
                            <button
                              onClick={() => handleBookmark(material)}
                              className={`p-1 ${material.bookmarked ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                            >
                              {material.bookmarked ? '★' : '☆'}
                            </button>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[material.category] || 'bg-gray-100 text-gray-800'}`}>
                              {categoryNames[material.category] || material.category}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${fileTypeColors[material.fileType] || 'bg-gray-100 text-gray-800'}`}>
                              {fileTypeNames[material.fileType] || material.fileType}
                            </span>
                            <span>{material.subject}</span>
                            <span>•</span>
                            <span>{material.grade}</span>
                            <span>•</span>
                            <span>{formatFileSize(material.fileSize)}</span>
                          </div>
                          
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <div className="flex items-center space-x-1">
                                <span>👁️</span>
                                <span>{material.views || 0} views</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <span>⬇️</span>
                                <span>{material.downloads || 0} downloads</span>
                              </div>
                              <span>Uploaded: {new Date(material.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewMaterial(material)}
                              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition text-sm"
                            >
                              {material.fileType === 'video' ? 'Watch Video' : 
                               material.fileType === 'pdf' ? 'Open PDF' : 
                               material.fileType === 'image' ? 'View Image' : 'Open File'}
                            </button>
                            <button
                              onClick={() => handleDownload(material)}
                              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
                            >
                              Download
                            </button>
                            <button
                              onClick={() => window.open(material.fileUrl, '_blank')}
                              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
                            >
                              Open in New Tab
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border">
                <div className="text-5xl text-gray-300 mb-4">📚</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No materials found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedSubject('all');
                    setSelectedGrade('all');
                    setSelectedCategory('all');
                    setSelectedFileType('all');
                    setActiveTab('all');
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition shadow-md"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Media Player Modal */}
      <MediaPlayer />

      {/* Footer */}
      <div className="mt-12 bg-white border-t py-6">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Student Learning Portal • Access PDFs, Videos, Images, Documents and more
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Total Materials: {materials.length} • Last Updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;