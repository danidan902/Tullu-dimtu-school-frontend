
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { PDFDocument } from 'pdf-lib';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

// ========== HYPER-FAST COMPRESSION SYSTEM ==========
const FAST_COMPRESS_CONFIG = {
  pdf: { targetMB: 5, quality: 0.8 },
  video: { targetMB: 20, quality: 0.6 },
  image: { targetMB: 1, quality: 0.7, maxWidth: 1200 },
  skipThreshold: 2 * 1024 * 1024, // Skip files < 2MB
  maxFileSize: 500 * 1024 * 1024
};

// Cloudinary Configuration
const CLOUD_NAME = 'duz0kwsrd';
const UPLOAD_PRESET = 'study_materials';

// Intelligent PDF compression
const fastCompressPDF = async (file) => {
  if (file.size < FAST_COMPRESS_CONFIG.skipThreshold) return file;
  
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    // Quick metadata removal
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

// Smart image compression using Canvas
const fastCompressImage = async (file) => {
  if (file.size < FAST_COMPRESS_CONFIG.skipThreshold) return file;
  
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = FAST_COMPRESS_CONFIG.image.maxWidth;
        const scale = Math.min(MAX_WIDTH / img.width, 1);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          const compressedFile = new File([blob], file.name, { 
            type: 'image/jpeg',
            lastModified: Date.now()
          });
          resolve(compressedFile);
        }, 'image/jpeg', FAST_COMPRESS_CONFIG.image.quality);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

// Quick file type detection
const detectFileType = (file) => {
  const mime = file.type;
  if (mime === 'application/pdf') return 'pdf';
  if (mime.startsWith('image/')) return 'image';
  if (mime.startsWith('video/')) return 'video';
  if (mime.startsWith('audio/')) return 'audio';
  return 'document';
};

// Ultra-fast file processor
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
  
  const sizeReduction = file.size > 0 ? 
    ((file.size - processedFile.size) / file.size * 100).toFixed(1) : '0';
  
  console.log(`Processed: ${(processedFile.size / 1024 / 1024).toFixed(1)}MB (${sizeReduction}% reduction)`);
  
  if (onProgress) onProgress(100);
  return { 
    file: processedFile, 
    originalSize: file.size, 
    compressedSize: processedFile.size, 
    reduction: sizeReduction 
  };
};

// ========== CLOUDINARY UPLOAD ==========
const uploadToCloudinary = async (file, isThumbnail, onProgress) => {
  const folder = isThumbnail ? 'study_materials/thumbnails' : 'study_materials';
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', folder);
  
  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
      formData,
      {
        onUploadProgress: (e) => {
          if (e.total && onProgress) {
            const progress = Math.round((e.loaded * 100) / e.total);
            onProgress(progress);
          }
        },
        timeout: 300000,
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    );
    
    return {
      url: response.data.secure_url,
      publicId: response.data.public_id,
      bytes: response.data.bytes
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error.response?.data || error.message);
    throw new Error(`Upload failed: ${error.response?.data?.error?.message || error.message}`);
  }
};

// ========== MAIN APP COMPONENT ==========
const API_BASE_URL = 'https://tullu-dimtu-school-backend-1.onrender.com/api';

const TeacherUploadPlatform = () => {
  // State
  const [formData, setFormData] = useState({
    title: '', description: '', subject: '', grade: '',
    category: 'lecture', tags: [],
    isPublic: true, allowComments: true, accessLevel: 'all_students'
  });
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedMaterials, setUploadedMaterials] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upload');
  const [statistics, setStatistics] = useState(null);
  const [compressionStats, setCompressionStats] = useState(null);

  const fileInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);
  const navigate = useNavigate();


  const grades = ['Grade 9','Grade 10','Grade 11','Grade 12',];
  const subjects = ['Mathematics','Science','Physics','Chemistry','Biology','English','Literature','History','Geography','Social Studies','Programming','Physical Education','Economics'];
  const categories = [
    { id: 'lecture', name: 'Lecture Notes', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { id: 'assignment', name: 'Assignments', color: 'bg-green-50 text-green-700 border-green-200' },
    { id: 'video', name: 'Video Lesson', color: 'bg-red-50 text-red-700 border-red-200' },
    { id: 'presentation', name: 'Presentation', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { id: 'quiz', name: 'Quiz/Test', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    { id: 'resource', name: 'Resource', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    { id: 'project', name: 'Project Guide', color: 'bg-teal-50 text-teal-700 border-teal-200' }
  ];

  // Fetch materials on mount
  useEffect(() => { 
    fetchMaterials();
    fetchStatistics();
  }, []);

  // API calls
  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/materials`);
      if (res.data && res.data.success) {
        setUploadedMaterials(res.data.data || []);
      }
    } catch (e) { 
      console.error('Fetch error:', e);
      setError('Failed to load materials');
    } finally { 
      setLoading(false); 
    }
  };

  const fetchStatistics = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/materials/stats/summary`);
      if (res.data && res.data.success) {
        setStatistics(res.data.data);
      }
    } catch (e) { 
      console.error('Stats error:', e);
    }
  };

  // File handling
  const handleFileSelect = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.size > FAST_COMPRESS_CONFIG.maxFileSize) {
      alert(`File is too large. Maximum size: ${FAST_COMPRESS_CONFIG.maxFileSize / 1024 / 1024}MB`);
      return;
    }

    setIsProcessing(true);
    setCompressionProgress(0);
    setCompressionStats(null);

    try {
      const result = await processFileUltraFast(selectedFile, setCompressionProgress);
      setFile(result.file);
      setCompressionStats({
        original: (selectedFile.size / 1024 / 1024).toFixed(1),
        compressed: (result.compressedSize / 1024 / 1024).toFixed(1),
        reduction: result.reduction
      });

      // Create preview
      if (result.file.type.startsWith('image/') || result.file.type.startsWith('video/')) {
        const url = URL.createObjectURL(result.file);
        setPreviewUrl(url);
      }

    } catch (e) {
      console.error('Processing error:', e);
      alert('File processing failed');
      setFile(selectedFile);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleThumbnailSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Thumbnail must be less than 5MB');
        return;
      }
      setThumbnail(file);
      setThumbnailUrl(URL.createObjectURL(file));
    }
  };

  // Handle tag input
  const handleAddTag = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault();
      const tag = e.target.value.trim();
      if (!formData.tags.includes(tag)) {
        setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
      }
      e.target.value = '';
    }
  };

  const removeTag = (tag) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  // Main upload handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim() || !formData.subject || !formData.grade || !file) {
      alert('Please fill all required fields');
      return;
    }

    const startTime = Date.now();
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      console.log('Starting upload...');
      
      // Upload main file
      const fileResult = await uploadToCloudinary(file, false, (progress) => {
        setUploadProgress(progress * 0.7); // 70% for file
      });
      
      // Upload thumbnail if exists
      let thumbResult = null;
      if (thumbnail) {
        thumbResult = await uploadToCloudinary(thumbnail, true, null);
      }

      // Prepare data for backend
      const fileType = detectFileType(file);
      const materialData = {
        title: formData.title,
        description: formData.description,
        subject: formData.subject,
        grade: formData.grade,
        category: formData.category,
        tags: formData.tags,
        isPublic: formData.isPublic,
        allowComments: formData.allowComments,
        accessLevel: formData.accessLevel,
        fileUrl: fileResult.url,
        thumbnailUrl: thumbResult ? thumbResult.url : null,
        fileName: file.name,
        fileSize: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        fileType: fileType,
        mimeType: file.type,
        cloudinaryPublicId: fileResult.publicId,
        cloudinaryThumbnailId: thumbResult ? thumbResult.publicId : null,
        compressionStats: compressionStats
      };

      // Save to backend
      const saveResponse = await axios.post(
        `${API_BASE_URL}/materials`,
        materialData,
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      // Update UI
      if (saveResponse.data && saveResponse.data.success) {
        const savedMaterial = saveResponse.data.data;
        setUploadedMaterials(prev => [savedMaterial, ...prev]);
        
        // Reset form
        setFormData({
          title: '', description: '', subject: '', grade: '',
          category: 'lecture', tags: [],
          isPublic: true, allowComments: true, accessLevel: 'all_students'
        });
        setFile(null);
        setThumbnail(null);
        setPreviewUrl(null);
        setCompressionStats(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';

        // Update stats
        fetchStatistics();

        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(1);
        alert(`Upload successful! (${duration}s)`);
      }

    } catch (error) {
      console.error('Upload failed:', error);
      setError(error.message);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Helper functions
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const deleteMaterial = async (id) => {
    if (!window.confirm('Are you sure you want to delete this material?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/materials/${id}`);
      setUploadedMaterials(prev => prev.filter(m => m._id !== id));
      fetchStatistics();
      alert('Deleted successfully');
    } catch (e) { 
      console.error('Delete error:', e);
      alert('Delete failed'); 
    }
  };

  const handleDownload = async (material) => {
    try {
      // Update download count
      await axios.put(`${API_BASE_URL}/materials/${material._id}`, {
        downloads: (material.downloads || 0) + 1
      });
      
      // Trigger download
      const link = document.createElement('a');
      link.href = material.fileUrl;
      link.download = material.fileName || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Update local state
      setUploadedMaterials(prev => prev.map(m => 
        m._id === material._id ? { ...m, downloads: (m.downloads || 0) + 1 } : m
      ));
    } catch (e) { 
      console.error('Download error:', e); 
    }
  };

  const getFileIcon = (type) => {
    const icons = {
      pdf: '',
      video: '',
      audio: '',
      image: '',
      document: '',
      presentation: '',
      spreadsheet: '',
      archive: ''
    };
    return icons[type] || '📎';
  };

  const renderFilePreview = () => {
    if (!file) return null;
    
    if (file.type.startsWith('image/')) {
      return (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-900 mb-2">Preview:</p>
          <img src={previewUrl} alt="Preview" className="max-w-full h-48 object-contain rounded-lg border" />
        </div>
      );
    }
    
    if (file.type.startsWith('video/')) {
      return (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-900 mb-2">Preview:</p>
          <video src={previewUrl} controls className="max-w-full h-48 rounded-lg border" />
        </div>
      );
    }
    
    const fileType = detectFileType(file);
    return (
      <div className="mt-4 p-4 bg-gray-50 border rounded-lg">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">{getFileIcon(fileType)}</span>
          <div>
            <p className="font-medium text-gray-900">{file.name}</p>
            <p className="text-sm text-gray-600">{(file.size / (1024 * 1024)).toFixed(1)} MB</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
         <div className="fixed top-4 left-4 right-4 z-10 flex justify-between items-center">
            <button
              onClick={() => navigate('/other/teacher-profile')}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              <Home className="w-5 h-5" />
              <span className="hidden sm:inline">Back to Home</span>
            </button>
          </div>
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 sm:mb-0">
             
              <div className=''>
                <h1 className="text-xl font-bold text-gray-900 items-center ml-28">Upload Study <span className='text-blue-400'>Material For Students.</span></h1>
                {/* <p className="text-gray-600 text-sm ml-28">Fast file processing and upload</p> */}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-semibold text-gray-900">Teacher Portal</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="container mx-auto px-4 py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <span className="text-red-600 mr-3">⚠️</span>
              <div>
                <h3 className="font-medium text-red-800">Error</h3>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compression Stats */}
      {compressionStats && (
        <div className="container mx-auto px-4 py-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900">Compression Complete</h3>
                <p className="text-sm text-gray-600">
                  Reduced by {compressionStats.reduction}%
                </p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-green-600">
                  {compressionStats.original}MB → {compressionStats.compressed}MB
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        {statistics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-blue-600">{statistics.totalMaterials || 0}</div>
              <div className="text-sm text-gray-600">Total Files</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-green-600">{statistics.totalViews || 0}</div>
              <div className="text-sm text-gray-600">Views</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-purple-600">{statistics.totalDownloads || 0}</div>
              <div className="text-sm text-gray-600">Downloads</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-yellow-600">{uploadedMaterials.length}</div>
              <div className="text-sm text-gray-600">Loaded</div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button 
            onClick={() => setActiveTab('upload')} 
            className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'upload' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-white text-gray-600 border border-gray-200'}`}
          >
            Upload
          </button>
          <button 
            onClick={() => { setActiveTab('materials'); fetchMaterials(); }} 
            className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'materials' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-white text-gray-600 border border-gray-200'}`}
          >
            Files ({uploadedMaterials.length})
          </button>
        </div>

        {activeTab === 'upload' ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-blue-600 px-8 py-6">
              <h2 className="text-2xl font-bold text-white">Upload Study Material For Students.</h2>
              <p className="text-blue-100 text-sm mt-1">Fast processing and upload</p>
            </div>

            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Title *</label>
                    <input 
                      type="text" 
                      value={formData.title} 
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} 
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                      placeholder="File title" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Subject *</label>
                    <select 
                      value={formData.subject} 
                      onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))} 
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                      required
                    >
                      <option value="">Select Subject</option>
                      {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Grade *</label>
                    <select 
                      value={formData.grade} 
                      onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))} 
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                      required
                    >
                      <option value="">Select Grade</option>
                      {grades.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Category</label>
                    <select 
                      value={formData.category} 
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))} 
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Description</label>
                  <textarea 
                    value={formData.description} 
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} 
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                    placeholder="Description..." 
                    rows="3" 
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">File * (Up to 500MB)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400">
                    {isProcessing ? (
                      <div className="mb-4">
                        <div className="text-lg font-medium text-gray-900 mb-2">Optimizing...</div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${compressionProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">Preparing for upload</p>
                      </div>
                    ) : file ? (
                      <div className="mb-4">
                        <div className="text-lg font-medium text-green-600 mb-1">Ready to upload</div>
                        <p className="text-gray-600">{file.name}</p>
                        <p className="text-sm text-gray-500">{(file.size / (1024 * 1024)).toFixed(1)} MB</p>
                      </div>
                    ) : (
                      <div>
                        <div className="text-4xl mb-3 text-gray-300">📤</div>
                        <p className="text-gray-600 mb-2">Click to select file</p>
                        <p className="text-xs text-gray-500 mb-4">Auto-compression enabled</p>
                      </div>
                    )}

                    <input ref={fileInputRef} type="file" onChange={handleFileSelect} className="hidden" />
                    <button 
                      type="button" 
                      onClick={() => fileInputRef.current.click()} 
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
                    >
                      {file ? 'Change File' : 'Select File'}
                    </button>
                  </div>
                  {renderFilePreview()}
                </div>

                {/* Thumbnail */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Thumbnail (Optional)</label>
                  <div className="flex items-center space-x-6">
                    {thumbnailUrl ? (
                      <div className="relative">
                        <img src={thumbnailUrl} alt="Thumb" className="w-32 h-24 object-cover rounded-lg border" />
                        <button 
                          type="button" 
                          onClick={() => { 
                            setThumbnail(null); 
                            setThumbnailUrl(''); 
                            if (thumbnailInputRef.current) thumbnailInputRef.current.value = ''; 
                          }} 
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="w-32 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">🖼️</div>
                    )}
                    <div>
                      <input ref={thumbnailInputRef} type="file" accept="image/*" onChange={handleThumbnailSelect} className="hidden" />
                      <button 
                        type="button" 
                        onClick={() => thumbnailInputRef.current.click()} 
                        className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                      >
                        {thumbnail ? 'Change' : 'Add Thumbnail'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Tags (Enter to add)</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.tags.map(tag => (
                      <span key={tag} className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {tag}
                        <button 
                          type="button" 
                          onClick={() => removeTag(tag)} 
                          className="ml-1.5"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <input 
                    type="text" 
                    onKeyDown={handleAddTag} 
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                    placeholder="Type tag and press Enter..." 
                  />
                </div>

                {/* Upload Progress */}
                {isUploading && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <div>
                          <p className="font-semibold text-blue-900">Uploading...</p>
                          <p className="text-sm text-blue-600">Please wait</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-blue-700">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-500 h-2.5 rounded-full" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-6 border-t">
                  <button 
                    type="submit" 
                    disabled={isUploading || isProcessing || !file} 
                    className={`w-full py-4 px-6 rounded-lg font-bold text-lg ${isUploading || isProcessing || !file ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white shadow-lg'}`}
                  >
                    {isUploading ? 'Uploading...' : isProcessing ? 'Processing...' : 'Upload Material'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-8 py-6 border-b">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Uploaded Materials</h2>
                  <p className="text-gray-600">All uploaded files</p>
                </div>
                <div className="flex space-x-3 mt-4 sm:mt-0">
                  <button onClick={fetchMaterials} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Refresh</button>
                  <button onClick={() => setActiveTab('upload')} className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium">+ New Upload</button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Loading...</p>
              </div>
            ) : uploadedMaterials.length > 0 ? (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {uploadedMaterials.map(material => (
                    <div key={material._id} className="border rounded-lg overflow-hidden hover:shadow-lg">
                      <div className="h-32 bg-gray-100 flex items-center justify-center">
                        {material.thumbnailUrl ? (
                          <img src={material.thumbnailUrl} alt={material.title} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-4xl">{getFileIcon(material.fileType)}</span>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between mb-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {material.category?.toUpperCase() || 'LECTURE'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(material.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1 truncate">{material.title}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{material.description}</p>
                        
                        <div className="text-xs text-gray-500 mb-3">
                          <div className="flex"><span className="font-medium w-16">Subject:</span><span>{material.subject}</span></div>
                          <div className="flex"><span className="font-medium w-16">Grade:</span><span>{material.grade}</span></div>
                          <div className="flex"><span className="font-medium w-16">Size:</span><span>{material.fileSize}</span></div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleDownload(material)} 
                            className="flex-1 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600"
                          >
                            Download ({material.downloads || 0})
                          </button>
                          <button 
                            onClick={() => window.open(material.fileUrl, '_blank')} 
                            className="px-3 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600"
                          >
                            🔗
                          </button>
                          <button 
                            onClick={() => copyToClipboard(material.fileUrl)} 
                            className="px-3 py-2 border text-sm rounded-lg hover:bg-gray-50"
                          >
                            📋
                          </button>
                          <button 
                            onClick={() => deleteMaterial(material._id)} 
                            className="px-3 py-2 bg-red-50 text-red-600 text-sm rounded-lg hover:bg-red-100"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-gray-300 text-6xl mb-4">📚</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No files uploaded yet</h3>
                <p className="text-gray-500 mb-6">Upload your first study material</p>
                <button 
                  onClick={() => setActiveTab('upload')} 
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-md font-medium"
                >
                  Start Upload
                </button>
              </div>
            )}
          </div>
        )}
      </div>


    </div>
  );
};

export default TeacherUploadPlatform;
