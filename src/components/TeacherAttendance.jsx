import React, { useState, useRef } from 'react';
import { Upload as UploadIcon, AlertCircle, CheckCircle, X, FileUp, Loader2, Home } from 'lucide-react';
import Bg from '../assets/bulding.jpg';
import { Helmet } from "react-helmet-async";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import JSZip from 'jszip';

const Upload = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const API_URL = 'https://tullu-dimtu-school-backend-1.onrender.com/api';

  // -------------------------
  // Aggressive Compression Function
  // -------------------------
  
  const compressImageToMax = async (file) => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
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
          
          // MAX compression settings - ultra aggressive
          const maxWidth = 800;
          const maxHeight = 800;
          
          // Calculate new dimensions while maintaining aspect ratio
          let width = img.width;
          let height = img.height;
          
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.floor(width * ratio);
            height = Math.floor(height * ratio);
          }
          
          // For very large images, make even smaller
          if (file.size > 5 * 1024 * 1024) { // If original > 5MB
            width = Math.max(400, width);
            height = Math.max(400, height);
          }
          
          canvas.width = width;
          canvas.height = height;
          
          ctx.drawImage(img, 0, 0, width, height);
          
          // Use low quality for maximum compression
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                resolve(file);
                return;
              }
              
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              
              resolve(compressedFile);
            },
            'image/jpeg',
            0.3 // Low quality for high compression
          );
        };
        
        img.onerror = () => {
          resolve(file);
        };
      };
      
      reader.onerror = () => {
        resolve(file);
      };
    });
  };

  const compressWithZip = async (file) => {
    return new Promise((resolve) => {
      const zip = new JSZip();
      
      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target.result;
        
        zip.file(file.name, arrayBuffer, {
          compression: "DEFLATE",
          compressionOptions: {
            level: 9
          }
        });
        
        const content = await zip.generateAsync({
          type: "blob",
          compression: "DEFLATE",
          compressionOptions: {
            level: 9
          }
        });
        
        const compressedFile = new File([content], file.name + '.zip', {
          type: 'application/zip',
          lastModified: Date.now(),
        });
        
        resolve(compressedFile);
      };
      
      reader.readAsArrayBuffer(file);
    });
  };

  const compressFile = async (file) => {
    try {
      let compressedFile = file;
      
      if (file.type.startsWith('image/')) {
        compressedFile = await compressImageToMax(file);
      }
      
      // Always apply zip compression for extra reduction
      const zipFile = await compressWithZip(compressedFile);
      return {
        file: zipFile,
        originalSize: file.size,
        compressionRatio: ((file.size - zipFile.size) / file.size * 100).toFixed(1)
      };
      
    } catch (err) {
      console.error('Compression error:', err);
      return {
        file: file,
        originalSize: file.size,
        compressionRatio: 0
      };
    }
  };

  const handleFileSelect = async (selectedFiles) => {
    if (!selectedFiles || selectedFiles.length === 0) return;
    
    setError('');
    setSuccess('');
    setUploading(true);
    
    const filesArray = [];
    const totalFiles = Array.from(selectedFiles);
    
    for (let i = 0; i < totalFiles.length; i++) {
      const file = totalFiles[i];
      
      try {
        setFiles(prev => [...prev, {
          file,
          id: Date.now() + Math.random(),
          name: file.name,
          size: file.size,
          originalSize: file.size,
          type: file.type,
          status: 'compressing'
        }]);
        
        const compressionResult = await compressFile(file);
        
        setFiles(prev => {
          const newFiles = [...prev];
          const fileIndex = newFiles.findIndex(f => f.name === file.name && f.status === 'compressing');
          
          if (fileIndex !== -1) {
            newFiles[fileIndex] = {
              ...compressionResult,
              id: Date.now() + Math.random(),
              name: compressionResult.file.name,
              size: compressionResult.file.size,
              type: compressionResult.file.type,
              status: 'pending',
              compressed: compressionResult.originalSize !== compressionResult.file.size
            };
          }
          
          return newFiles;
        });
        
      } catch (err) {
        console.error('Error processing file:', err);
        setFiles(prev => [...prev.filter(f => !(f.name === file.name && f.status === 'compressing'))]);
      }
    }
    
    setUploading(false);
  };

  const handleFileInputChange = (e) => handleFileSelect(e.target.files);
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => { e.preventDefault(); setIsDragging(false); handleFileSelect(e.dataTransfer.files); };
  
  const removeFile = (id) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== id);
    });
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
    const compressedTotal = files.reduce((sum, f) => sum + f.size, 0);
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
    const pendingFiles = files.filter(f => f.status === 'pending');
    if (pendingFiles.length === 0) return setError('No files to upload');

    const formData = new FormData();
    pendingFiles.forEach(f => formData.append('files', f.file));

    try {
      setUploading(true);
      
      setFiles(prev => prev.map(f => 
        f.status === 'pending' ? { ...f, status: 'uploading' } : f
      ));

      const res = await axios.post(`${API_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => setUploadProgress((e.loaded / e.total) * 100)
      });

      setFiles(prev => prev.map(f => 
        f.status === 'uploading' ? { ...f, status: 'uploaded' } : f
      ));

      setSuccess(`Uploaded ${res.data.uploadedFiles?.length || pendingFiles.length} file(s) successfully`);
      setUploadProgress(100);

      setTimeout(() => {
        setFiles([]);
        setUploadProgress(0);
      }, 2000);

    } catch (err) {
      console.error('Upload failed:', err);
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
      
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
  };

  // -------------------------
  // JSX
  // -------------------------
  const stats = getCompressionStats();
  
  return (
    <>
      <Helmet><title>Tullu Dimtu Secondary School - Upload</title></Helmet>
      <div
        className="min-h-screen py-12 px-4 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url(${Bg})`
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="fixed top-4 left-4 z-10">
            <button onClick={() => navigate('/')} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Home className="w-5 h-5" />
              <span>Back to Home Page</span>
            </button>
          </div>

          <div className="bg-white/10 rounded-2xl shadow-2xl p-8 mt-24 border border-white/20 backdrop-blur-sm">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
                <FileUp className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">Teacher Attendance Upload</h1>
              <p className="text-white/70 mb-2">
                Files are automatically compressed for optimal upload
              </p>
            </div>

            {/* Compression Stats */}
            {files.length > 0 && stats.saved > 0 && (
              <div className="mb-6 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="flex items-center justify-between text-green-300">
                  <div className="flex items-center gap-2">
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
              className={`border-3 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${isDragging ? 'border-green-400 bg-green-500/10' : 'border-white/30 bg-white/5'} hover:bg-white/10 cursor-pointer mb-8`}
              onClick={() => fileInputRef.current.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <UploadIcon className="w-12 h-12 text-white mx-auto mb-3" />
              <p className="text-white/80">Drag & drop files or click to browse</p>
              <p className="text-white/60 text-sm mt-2">All files will be compressed automatically</p>
              <input 
                ref={fileInputRef} 
                type="file" 
                multiple 
                onChange={handleFileInputChange} 
                className="hidden" 
                accept="*/*"
              />
            </div>

            {/* File list */}
            {files.length > 0 && (
              <div className="mb-8">
                {files.map(file => (
                  <div key={file.id} className={`p-3 rounded mb-2 ${file.status === 'compressing' ? 'bg-blue-500/10' : 
                    file.status === 'uploading' ? 'bg-yellow-500/10' : 
                    file.status === 'uploaded' ? 'bg-green-500/10' : 
                    file.status === 'error' ? 'bg-red-500/10' : 'bg-white/5'}`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{getFileIcon(file)}</span>
                        <div>
                          <div className="text-white">{file.name}</div>
                          <div className="text-white/60 text-sm flex items-center gap-2">
                            <span>{formatFileSize(file.size)}</span>
                            {file.compressed && file.originalSize && (
                              <>
                                <span className="text-green-400">↓</span>
                                <span className="line-through">{formatFileSize(file.originalSize)}</span>
                              </>
                            )}
                            <span className="text-white/40">
                              {file.status === 'compressing' ? 'Compressing...' : 
                               file.status === 'uploading' ? 'Uploading...' : 
                               file.status === 'uploaded' ? 'Uploaded' : 
                               file.status === 'error' ? 'Error' : 'Ready'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFile(file.id)} 
                        className="text-red-400 hover:text-red-300"
                        disabled={file.status === 'uploading'}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Progress */}
            {uploading && (
              <div className="mb-4">
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 transition-all" style={{ width: `${uploadProgress}%` }}></div>
                </div>
                <p className="text-white mt-1">{Math.round(uploadProgress)}%</p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4">
              <button 
                onClick={handleFileUpload} 
                disabled={uploading || files.filter(f => f.status === 'pending').length === 0} 
                className="flex-1 py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-800 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <UploadIcon className="w-5 h-5" />
                    Upload {files.filter(f => f.status === 'pending').length} files
                  </>
                )}
              </button>
              {uploading && (
                <button 
                  onClick={handleCancelUpload} 
                  className="py-3 px-6 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>

            {/* Messages */}
            {error && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex items-center gap-2 text-red-300">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              </div>
            )}
            
            {success && (
              <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center gap-2 text-green-300">
                  <CheckCircle className="w-5 h-5" />
                  <span>{success}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Upload;
