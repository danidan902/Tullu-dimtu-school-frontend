import React, { useState, useRef } from 'react';
import { Upload as UploadIcon, AlertCircle, CheckCircle, X, FileUp, Loader2, Home } from 'lucide-react';
import Bg from '../assets/bulding.jpg';
import { Helmet } from "react-helmet-async";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Upload = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Use relative path or environment variable
  const API_URL = process.env.REACT_APP_API_URL || 'https://tullu-dimtu-school-backend-1.onrender.com/api';

  // -------------------------
  // Simplified Image Compression Function
  // -------------------------
  const compressImage = async (file) => {
    return new Promise((resolve) => {
      // Only compress image files
      if (!file.type.startsWith('image/') || file.size < 102400) { // Skip small files < 100KB
        resolve(file);
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Set maximum dimensions
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          
          let width = img.width;
          let height = img.height;
          
          // Resize if image is larger than max dimensions
          if (width > MAX_WIDTH || height > MAX_HEIGHT) {
            const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
            width = Math.floor(width * ratio);
            height = Math.floor(height * ratio);
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Fill canvas with white background for transparent images
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          
          // Draw image
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to blob with reasonable quality
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                resolve(file); // Fallback to original
                return;
              }
              
              // Only use compressed version if it's actually smaller
              if (blob.size < file.size * 0.9) { // At least 10% smaller
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                resolve(file);
              }
            },
            'image/jpeg',
            0.7 // Reasonable quality
          );
        };
        
        img.onerror = () => {
          console.warn('Image loading error, using original file');
          resolve(file);
        };
      };
      
      reader.onerror = () => {
        console.warn('File reading error, using original file');
        resolve(file);
      };
    });
  };

  // -------------------------
  // File Processing
  // -------------------------
  const handleFileSelect = async (selectedFiles) => {
    if (!selectedFiles || selectedFiles.length === 0) return;
    
    // Clear previous messages
    setError('');
    setSuccess('');
    
    // Validate file count
    if (selectedFiles.length > 20) {
      setError('Maximum 20 files allowed at once');
      return;
    }
    
    const filesArray = Array.from(selectedFiles);
    let newFiles = [];
    
    setUploading(true);
    
    try {
      for (const file of filesArray) {
        // Validate file size (max 50MB per file)
        if (file.size > 50 * 1024 * 1024) {
          setError(`File "${file.name}" exceeds 50MB limit`);
          continue;
        }
        
        // Create file object
        const fileObj = {
          id: Date.now() + Math.random(),
          name: file.name,
          size: file.size,
          originalSize: file.size,
          type: file.type,
          status: 'processing',
          compressed: false
        };
        
        newFiles.push(fileObj);
        setFiles(prev => [...prev, fileObj]);
        
        // Process image compression
        const processedFile = await compressImage(file);
        
        // Update file object with processed file
        setFiles(prev => prev.map(f => 
          f.id === fileObj.id 
            ? { 
                ...f, 
                file: processedFile,
                size: processedFile.size,
                status: 'pending',
                compressed: processedFile.size < file.size
              } 
            : f
        ));
      }
    } catch (err) {
      console.error('Error processing files:', err);
      setError('Error processing files. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = (e) => handleFileSelect(e.target.files);
  
  const handleDragOver = (e) => { 
    e.preventDefault(); 
    setIsDragging(true); 
  };
  
  const handleDragLeave = (e) => { 
    e.preventDefault(); 
    setIsDragging(false); 
  };
  
  const handleDrop = (e) => { 
    e.preventDefault(); 
    setIsDragging(false); 
    handleFileSelect(e.dataTransfer.files); 
  };
  
  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file) => {
    const type = file.type || '';
    if (type.includes('image')) return '🖼️';
    if (type.includes('pdf')) return '📄';
    if (type.includes('word')) return '📝';
    if (type.includes('excel') || type.includes('spreadsheet')) return '📊';
    if (type.includes('zip')) return '🗜️';
    return '📎';
  };

  const getCompressionStats = () => {
    const originalTotal = files.reduce((sum, f) => sum + (f.originalSize || f.size), 0);
    const compressedTotal = files.reduce((sum, f) => sum + (f.size || 0), 0);
    const saved = originalTotal - compressedTotal;
    const percentage = originalTotal > 0 ? (saved / originalTotal * 100).toFixed(1) : 0;
    
    return {
      originalTotal,
      compressedTotal,
      saved,
      percentage
    };
  };

  // -------------------------
  // Upload to backend
  // -------------------------
  const handleFileUpload = async () => {
    const pendingFiles = files.filter(f => f.status === 'pending' && f.file);
    
    if (pendingFiles.length === 0) {
      setError('No files ready to upload');
      return;
    }

    // Create FormData
    const formData = new FormData();
    pendingFiles.forEach(f => {
      if (f.file) {
        formData.append('files', f.file);
      }
    });

    try {
      setUploading(true);
      setError('');
      setSuccess('');
      
      // Update file status to uploading
      setFiles(prev => prev.map(f => 
        f.status === 'pending' ? { ...f, status: 'uploading' } : f
      ));

      // Make API call
      const res = await axios.post(`${API_URL}/upload`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = (progressEvent.loaded / progressEvent.total) * 100;
            setUploadProgress(progress);
          }
        },
        timeout: 300000, // 5 minute timeout for large files
      });

      // Update file status to uploaded
      setFiles(prev => prev.map(f => 
        f.status === 'uploading' ? { ...f, status: 'uploaded' } : f
      ));

      // Show success message
      const uploadedCount = res.data.uploadedFiles?.length || pendingFiles.length;
      setSuccess(`Successfully uploaded ${uploadedCount} file(s)`);
      
      // Reset after delay
      setTimeout(() => {
        setFiles([]);
        setUploadProgress(0);
      }, 3000);

    } catch (err) {
      console.error('Upload error:', err);
      
      // Set appropriate error message
      let errorMessage = 'Upload failed. Please try again.';
      
      if (err.response) {
        // Server responded with error
        errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
      } else if (err.request) {
        // No response received
        errorMessage = 'No response from server. Check your connection.';
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please try smaller files.';
      } else if (err.message.includes('Network Error')) {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      setError(errorMessage);
      
      // Update file status to error
      setFiles(prev => prev.map(f => 
        f.status === 'uploading' ? { ...f, status: 'error' } : f
      ));
      
    } finally {
      setUploading(false);
    }
  };

  const handleCancelUpload = () => {
    setUploading(false);
    setUploadProgress(0);
    setFiles([]);
    setError('Upload cancelled');
    setSuccess('');
  };

  // Calculate statistics
  const stats = getCompressionStats();
  const pendingFilesCount = files.filter(f => f.status === 'pending').length;
  
  return (
    <>
      <Helmet>
        <title>Tullu Dimtu Secondary School - Upload</title>
      </Helmet>
      
      <div
        className="min-h-screen py-12 px-4 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url(${Bg})`
        }}
      >
        <div className="max-w-4xl mx-auto">
          {/* Home Button */}
          <div className="fixed top-4 left-4 z-10">
            <button 
              onClick={() => navigate('/')} 
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
          </div>

          {/* Main Upload Container */}
          <div className="bg-white/10 rounded-2xl shadow-2xl p-6 md:p-8 mt-20 md:mt-24 border border-white/20 backdrop-blur-sm">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
                <FileUp className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                Teacher Attendance Upload
              </h1>
              <p className="text-white/70 mb-2">
                Images are automatically compressed for faster upload
              </p>
              <p className="text-white/50 text-sm">
                Maximum 20 files, 50MB each
              </p>
            </div>

            {/* Compression Stats */}
            {files.length > 0 && stats.saved > 0 && (
              <div className="mb-6 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="flex flex-col md:flex-row md:items-center justify-between text-green-300 gap-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Size reduced by {formatFileSize(stats.saved)} ({stats.percentage}%)</span>
                  </div>
                  <span className="text-sm">
                    {formatFileSize(stats.compressedTotal)} / {formatFileSize(stats.originalTotal)}
                  </span>
                </div>
              </div>
            )}

            {/* Upload Area */}
            <div
              className={`border-3 border-dashed rounded-2xl p-8 md:p-12 text-center transition-all duration-300 ${
                isDragging 
                  ? 'border-green-400 bg-green-500/10 scale-[1.02]' 
                  : 'border-white/30 bg-white/5 hover:bg-white/10'
              } cursor-pointer mb-8`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <UploadIcon className="w-12 h-12 text-white mx-auto mb-3" />
              <p className="text-white/80 text-lg mb-2">Drag & drop files or click to browse</p>
              <p className="text-white/60 text-sm">Images are compressed automatically</p>
              <input 
                ref={fileInputRef} 
                type="file" 
                multiple 
                onChange={handleFileInputChange} 
                className="hidden" 
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.zip"
              />
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-white font-medium">Selected Files ({files.length})</h3>
                  <button 
                    onClick={() => setFiles([])} 
                    className="text-red-400 hover:text-red-300 text-sm"
                    disabled={uploading}
                  >
                    Clear All
                  </button>
                </div>
                
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                  {files.map(file => (
                    <div 
                      key={file.id} 
                      className={`p-3 rounded-lg transition-colors ${
                        file.status === 'processing' ? 'bg-blue-500/10 border border-blue-500/20' : 
                        file.status === 'uploading' ? 'bg-yellow-500/10 border border-yellow-500/20' : 
                        file.status === 'uploaded' ? 'bg-green-500/10 border border-green-500/20' : 
                        file.status === 'error' ? 'bg-red-500/10 border border-red-500/20' : 
                        'bg-white/5 border border-white/10'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-xl flex-shrink-0">{getFileIcon(file)}</span>
                          <div className="min-w-0">
                            <div className="text-white truncate">{file.name}</div>
                            <div className="text-white/60 text-sm flex items-center gap-2 flex-wrap">
                              <span>{formatFileSize(file.size || 0)}</span>
                              {file.compressed && file.originalSize && (
                                <>
                                  <span className="text-green-400 text-xs">↓</span>
                                  <span className="line-through text-xs">{formatFileSize(file.originalSize)}</span>
                                </>
                              )}
                              <span className={`text-xs px-2 py-0.5 rounded ${
                                file.status === 'processing' ? 'bg-blue-500/20 text-blue-300' :
                                file.status === 'uploading' ? 'bg-yellow-500/20 text-yellow-300' :
                                file.status === 'uploaded' ? 'bg-green-500/20 text-green-300' :
                                file.status === 'error' ? 'bg-red-500/20 text-red-300' :
                                'bg-white/10 text-white/70'
                              }`}>
                                {file.status === 'processing' ? 'Processing...' : 
                                 file.status === 'uploading' ? 'Uploading...' : 
                                 file.status === 'uploaded' ? 'Uploaded ✓' : 
                                 file.status === 'error' ? 'Error' : 'Ready'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeFile(file.id)} 
                          className="text-red-400 hover:text-red-300 flex-shrink-0 ml-2"
                          disabled={file.status === 'uploading' || file.status === 'processing'}
                          title="Remove file"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Progress Bar */}
            {uploading && (
              <div className="mb-6">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300 ease-out" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-white/70">
                  <span>Uploading...</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleFileUpload} 
                disabled={uploading || pendingFilesCount === 0} 
                className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <UploadIcon className="w-5 h-5" />
                    Upload {pendingFilesCount} file{pendingFilesCount !== 1 ? 's' : ''}
                  </>
                )}
              </button>
              
              {(uploading || files.length > 0) && (
                <button 
                  onClick={handleCancelUpload} 
                  className="py-3 px-6 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {uploading ? 'Cancel Upload' : 'Clear All'}
                </button>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg animate-fadeIn">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-300 font-medium mb-1">Upload Error</p>
                    <p className="text-red-400/80 text-sm">{error}</p>
                    {error.includes('connection') && (
                      <p className="text-red-400/60 text-xs mt-2">
                        Please check your internet connection and try again.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Success Message */}
            {success && (
              <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg animate-fadeIn">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <div>
                    <p className="text-green-300 font-medium">Success!</p>
                    <p className="text-green-400/80 text-sm">{success}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Info Box */}
            <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="text-blue-400">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-blue-300 text-sm font-medium mb-1">Upload Tips</p>
               
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Upload;
