// import React, { useState, useRef } from 'react';
// import { Upload as UploadIcon, AlertCircle, CheckCircle, X, FileUp, Loader2, FileText, Home } from 'lucide-react';
// import Bg from '../assets/bulding.jpg';
// import { Helmet } from "react-helmet-async";
// import { useNavigate } from 'react-router-dom';

// const Upload = () => {
//   const [files, setFiles] = useState([]);
//   const [uploading, setUploading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [upload, setUploadedFiles] = useState('');
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [isDragging, setIsDragging] = useState(false);
//   const fileInputRef = useRef(null);
//   const navigate = useNavigate();

//   // Add AbortController for cancel functionality
//   const abortControllerRef = useRef(null);

//   const fetchFiles = async () => {
//     try {
//       const res = await fetch('http://localhost:5000/api/files');
//       const data = await res.json();

//       if (!res.ok) throw new Error(data.error);

//       setUploadedFiles(data.files);
//     } catch (err) {
//       console.error('Fetch error:', err);
//     }
//   };

//   const handleCancelUpload = () => {
//     if (abortControllerRef.current) {
//       abortControllerRef.current.abort();
//       setUploading(false);
//       setUploadProgress(0);
//       setError('Upload cancelled');
//       setFiles([]);
//     }
//   };

//   const handleFileSelect = (selectedFiles) => {
//     if (selectedFiles.length === 0) return;

//     const filesArray = Array.from(selectedFiles).map(file => ({
//       file,
//       id: Date.now() + Math.random(),
//       name: file.name,
//       size: file.size,
//       type: file.type,
//       preview: URL.createObjectURL(file),
//       status: 'pending'
//     }));

//     setFiles(filesArray);
//     setError('');
//     setSuccess('');
//   };

//   const handleFileInputChange = (e) => {
//     handleFileSelect(e.target.files);
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     setIsDragging(true);
//   };

//   const handleDragLeave = (e) => {
//     e.preventDefault();
//     setIsDragging(false);
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setIsDragging(false);
//     handleFileSelect(e.dataTransfer.files);
//   };

//   const removeFile = (id) => {
//     setFiles(prev => prev.filter(file => file.id !== id));
//   };

//   const formatFileSize = (bytes) => {
//     if (bytes === 0) return '0 Bytes';
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//   };

//   const getFileIcon = (type) => {
//     if (type.includes('image')) return '🖼️';
//     if (type.includes('pdf')) return '📄';
//     if (type.includes('word')) return '📝';
//     if (type.includes('excel') || type.includes('spreadsheet')) return '📊';
//     if (type.includes('video')) return '🎬';
//     if (type.includes('audio')) return '🎵';
//     return '📎';
//   };

//   const handleFileUpload = async () => {
//     if (files.length === 0) {
//       setError('No files selected');
//       return;
//     }

//     // Create new AbortController for this upload
//     abortControllerRef.current = new AbortController();

//     setUploading(true);
//     setError('');
//     setSuccess('');
//     setUploadProgress(0);

//     try {
//       const formData = new FormData();
//       files.forEach(fileObj => {
//         formData.append('files', fileObj.file);
//       });

//       // Simulate progress updates
//       const progressInterval = setInterval(() => {
//         setUploadProgress(prev => {
//           if (prev >= 90) {
//             clearInterval(progressInterval);
//             return prev;
//           }
//           return prev + 10;
//         });
//       }, 300);

//       const res = await fetch('http://localhost:5000/api/files/upload', {
//         method: 'POST',
//         body: formData,
//         headers: { 'Accept': 'application/json' },
//         signal: abortControllerRef.current.signal
//       });

//       clearInterval(progressInterval);
//       setUploadProgress(100);

//       if (!res.ok) {
//         const data = await res.json();
//         throw new Error(data.error || `Upload failed with status ${res.status}`);
//       }

//       const data = await res.json();
//       setSuccess(data.message || `Successfully uploaded ${files.length} file(s)`);
      
//       // Clear files after successful upload
//       setFiles([]);
//       if (fileInputRef.current) {
//         fileInputRef.current.value = '';
//       }

//       // Reset progress after 2 seconds
//       setTimeout(() => setUploadProgress(0), 2000);

//     } catch (err) {
//       if (err.name === 'AbortError') {
//         console.log('Upload was cancelled');
//         return;
//       }
//       console.error('Upload error:', err);
//       setError(`Upload failed: ${err.message}`);
//       setUploadProgress(0);
//     } finally {
//       setUploading(false);
//       abortControllerRef.current = null;
//     }
//   };

//   return (
//     <>
//       <Helmet>
//         <title>Tullu Dimtu Secondary School - Upload</title>
//       </Helmet>

//       <div 
//         className="min-h-screen py-12 px-4 bg-cover bg-center bg-fixed"
//         style={{
//           backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9)), url(${Bg})`,
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//           backgroundAttachment: 'fixed'
//         }}
//       >
//         <div className="max-w-4xl mx-auto">
//           <div className="fixed top-4 left-4 z-10">
//             <button
//               onClick={() => navigate('/')}
//               className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
//             >
//               <Home className="w-5 h-5" />
//               <span>Back to Home Page</span>
//             </button>
//           </div>

//           <div className="bg-white/10 rounded-2xl shadow-2xl p-8 mt-24 border border-white/20 backdrop-blur-sm">
//             <div className="text-center mb-10">
//               <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
//                 <FileUp className="w-8 h-8 text-white" />
//               </div>
//               <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
//                 Teacher Attendance Upload
//               </h1>
//               <p className="text-white/80 text-lg">Upload your attendance files securely</p>
//             </div>

//             {/* Upload Area */}
//             <div
//               className={`border-3 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
//                 isDragging 
//                   ? 'border-green-400 bg-green-500/10 scale-[1.02]' 
//                   : 'border-white/30 bg-white/5'
//               } hover:bg-white/10 hover:border-white/40 cursor-pointer mb-8`}
//               onClick={() => fileInputRef.current.click()}
//               onDragOver={handleDragOver}
//               onDragLeave={handleDragLeave}
//               onDrop={handleDrop}
//             >
//               <div className="max-w-md mx-auto">
//                 <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-500/80 to-purple-600/80 rounded-full flex items-center justify-center shadow-xl">
//                   <UploadIcon className="w-12 h-12 text-white" />
//                 </div>
                
//                 <h3 className="text-xl font-semibold text-white mb-3">
//                   {isDragging ? 'Drop files here' : 'Drag & drop files'}
//                 </h3>
                
//                 <p className="text-white/80 mb-2">or click to browse files</p>
//                 <p className="text-white/60 text-sm">Supports all file types</p>

//                 <button
//                   className="mt-6 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:scale-[1.02] transition-all duration-200 shadow-md"
//                   disabled={uploading}
//                 >
//                   {uploading ? (
//                     <span className="flex items-center justify-center">
//                       <Loader2 className="w-5 h-5 mr-2 animate-spin" />
//                       Uploading...
//                     </span>
//                   ) : (
//                     'Choose Files'
//                   )}
//                 </button>
//               </div>

//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 multiple
//                 onChange={handleFileInputChange}
//                 className="hidden"
//                 accept="*"
//               />
//             </div>

//             {/* File List Preview */}
//             {files.length > 0 && (
//               <div className="mb-8">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="text-xl font-semibold text-white flex items-center">
//                     <FileText className="w-5 h-5 mr-2" />
//                     Selected Files ({files.length})
//                   </h3>
//                   <button
//                     onClick={() => setFiles([])}
//                     className="text-white/70 hover:text-white text-sm flex items-center"
//                   >
//                     <X className="w-4 h-4 mr-1" />
//                     Clear all
//                   </button>
//                 </div>
                
//                 <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
//                   {files.map((file) => (
//                     <div 
//                       key={file.id}
//                       className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors group"
//                     >
//                       <div className="flex items-center flex-1 min-w-0">
//                         <span className="text-2xl mr-3">{getFileIcon(file.type)}</span>
//                         <div className="min-w-0 flex-1">
//                           <p className="text-white font-medium truncate">{file.name}</p>
//                           <p className="text-white/60 text-sm">{formatFileSize(file.size)}</p>
//                         </div>
//                       </div>
//                       <button
//                         onClick={() => removeFile(file.id)}
//                         className="p-2 text-white/50 hover:text-red-400 hover:bg-red-500/20 rounded-full transition-colors opacity-0 group-hover:opacity-100"
//                       >
//                         <X className="w-4 h-4" />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Upload Progress */}
//             {uploading && (
//               <div className="mb-8">
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="text-white font-medium">Uploading...</span>
//                   <span className="text-white/80">{uploadProgress}%</span>
//                 </div>
//                 <div className="h-3 bg-white/10 rounded-full overflow-hidden">
//                   <div 
//                     className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-300 rounded-full"
//                     style={{ width: `${uploadProgress}%` }}
//                   />
//                 </div>
//               </div>
//             )}

//             {/* Action Buttons */}
//             {(files.length > 0 || uploading) && (
//               <div className="flex gap-4 mb-8">
//                 <button
//                   onClick={handleFileUpload}
//                   disabled={uploading || files.length === 0}
//                   className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center"
//                 >
//                   {uploading ? (
//                     <>
//                       <Loader2 className="w-5 h-5 mr-3 animate-spin" />
//                       Uploading...
//                     </>
//                   ) : (
//                     <>
//                       <UploadIcon className="w-5 h-5 mr-3" />
//                       Upload {files.length} file{files.length !== 1 ? 's' : ''}
//                     </>
//                   )}
//                 </button>
                
//                 {uploading && (
//                   <button
//                     onClick={handleCancelUpload}
//                     className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 shadow-md flex items-center justify-center"
//                   >
//                     <X className="w-5 h-5 mr-3" />
//                     Cancel Upload
//                   </button>
//                 )}
//               </div>
//             )}

//             {/* Error Message */}
//             {error && (
//               <div className="mb-8 p-4 backdrop-blur-sm bg-red-500/10 border border-red-500/30 rounded-xl animate-pulse">
//                 <div className="flex items-center">
//                   <AlertCircle className="w-5 h-5 text-red-300 mr-3 flex-shrink-0" />
//                   <span className="text-red-100">{error}</span>
//                 </div>
//               </div>
//             )}
            
//             {/* Success Message */}
//             {success && (
//               <div className="mb-8 p-4 backdrop-blur-sm bg-green-500/10 border border-green-500/30 rounded-xl animate-bounce">
//                 <div className="flex items-center">
//                   <CheckCircle className="w-5 h-5 text-green-300 mr-3 flex-shrink-0" />
//                   <span className="text-green-100">{success}</span>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Upload;



import React, { useState, useRef } from 'react';
import { Upload as UploadIcon, AlertCircle, CheckCircle, X, FileUp, Loader2, FileText, Home } from 'lucide-react';
import Bg from '../assets/bulding.jpg';
import { Helmet } from "react-helmet-async";
import { useNavigate } from 'react-router-dom';

const Upload = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Cloudinary Configuration
  const cloudName = 'duz0kwsrd';
  const uploadPreset = 'teachers-material';
  const folderPath = 'teacher-attendance';

  const handleCancelUpload = () => {
    setUploading(false);
    setUploadProgress(0);
    setError('Upload cancelled');
    setFiles([]);
  };

  const handleFileSelect = (selectedFiles) => {
    if (selectedFiles.length === 0) return;

    const filesArray = Array.from(selectedFiles).map(file => ({
      file,
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      preview: URL.createObjectURL(file),
      status: 'pending'
    }));

    setFiles(filesArray);
    setError('');
    setSuccess('');
  };

  const handleFileInputChange = (e) => {
    handleFileSelect(e.target.files);
  };

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
    setFiles(prev => prev.filter(file => file.id !== id));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type.includes('image')) return '🖼️';
    if (type.includes('pdf')) return '📄';
    if (type.includes('word')) return '📝';
    if (type.includes('excel') || type.includes('spreadsheet')) return '📊';
    if (type.includes('video')) return '🎬';
    if (type.includes('audio')) return '🎵';
    return '📎';
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('timestamp', Date.now().toString());
    
    // Add folder information
    if (folderPath) {
      formData.append('folder', folderPath);
    }

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return await response.json();
  };

  const saveFileToLocalStorage = (fileInfo) => {
    try {
      // Get existing files from localStorage
      const existingFiles = JSON.parse(localStorage.getItem('cloudinaryFiles') || '[]');
      
      // Check if file already exists
      const fileExists = existingFiles.some(f => f.publicId === fileInfo.publicId);
      
      if (!fileExists) {
        // Add new file to the beginning
        existingFiles.unshift(fileInfo);
        
        // Keep only last 100 files
        const updatedFiles = existingFiles.slice(0, 100);
        
        // Save back to localStorage
        localStorage.setItem('cloudinaryFiles', JSON.stringify(updatedFiles));
        
        console.log('File saved to localStorage:', fileInfo.name);
      }
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  const handleFileUpload = async () => {
    if (files.length === 0) {
      setError('No files selected');
      return;
    }

    if (!cloudName || !uploadPreset) {
      setError('Please configure Cloudinary settings.');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');
    setUploadProgress(0);

    try {
      const uploadedFiles = [];
      let completedCount = 0;

      for (const fileObj of files) {
        try {
          setFiles(prev => prev.map(f => 
            f.id === fileObj.id ? { ...f, status: 'uploading' } : f
          ));

          // Simulate progress
          const progressInterval = setInterval(() => {
            setUploadProgress(prev => {
              if (prev >= 90) {
                clearInterval(progressInterval);
                return prev;
              }
              return prev + (10 / files.length);
            });
          }, 300);

          // Upload to Cloudinary
          const cloudinaryResponse = await uploadToCloudinary(fileObj.file);
          
          clearInterval(progressInterval);
          completedCount++;
          setUploadProgress((completedCount / files.length) * 100);

          setFiles(prev => prev.map(f => 
            f.id === fileObj.id ? { ...f, status: 'uploaded' } : f
          ));

          // Create file info object
          const fileInfo = {
            id: cloudinaryResponse.public_id || `file-${Date.now()}`,
            publicId: cloudinaryResponse.public_id,
            name: fileObj.name,
            size: fileObj.size,
            type: cloudinaryResponse.resource_type,
            format: cloudinaryResponse.format,
            url: cloudinaryResponse.secure_url,
            uploadedAt: new Date().toISOString(),
            width: cloudinaryResponse.width,
            height: cloudinaryResponse.height,
            folder: folderPath
          };

          uploadedFiles.push(fileInfo);
          
          // Save to localStorage
          saveFileToLocalStorage(fileInfo);

        } catch (err) {
          console.error(`Failed to upload ${fileObj.name}:`, err);
          setFiles(prev => prev.map(f => 
            f.id === fileObj.id ? { ...f, status: 'error' } : f
          ));
        }
      }

      setUploadProgress(100);

      if (uploadedFiles.length > 0) {
        const successMsg = `Successfully uploaded ${uploadedFiles.length} file(s) to Cloudinary`;
        setSuccess(successMsg);
        
        // Save success notification
        localStorage.setItem('lastUpload', JSON.stringify({
          message: successMsg,
          count: uploadedFiles.length,
          timestamp: new Date().toISOString()
        }));
        
        // Clear files after successful upload
        setFiles([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        // Reset progress after 2 seconds
        setTimeout(() => setUploadProgress(0), 2000);
      } else {
        setError('Failed to upload any files. Please try again.');
      }

    } catch (err) {
      console.error('Upload error:', err);
      setError(`Upload failed: ${err.message}`);
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  // Rest of your JSX remains the same...
  return (
    <>
      <Helmet>
        <title>Tullu Dimtu Secondary School - Upload</title>
      </Helmet>

      <div 
        className="min-h-screen py-12 px-4 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9)), url(${Bg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="fixed top-4 left-4 z-10">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              <Home className="w-5 h-5" />
              <span>Back to Home Page</span>
            </button>
          </div>

          <div className="bg-white/10 rounded-2xl shadow-2xl p-8 mt-24 border border-white/20 backdrop-blur-sm">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
                <FileUp className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
                Teacher Attendance Upload
              </h1>
              <p className="text-white/80 text-lg">Upload directly to Cloudinary folder: {folderPath}</p>
            </div>

            {/* Upload Area */}
            <div
              className={`border-3 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                isDragging 
                  ? 'border-green-400 bg-green-500/10 scale-[1.02]' 
                  : 'border-white/30 bg-white/5'
              } hover:bg-white/10 hover:border-white/40 cursor-pointer mb-8`}
              onClick={() => fileInputRef.current.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-500/80 to-purple-600/80 rounded-full flex items-center justify-center shadow-xl">
                  <UploadIcon className="w-12 h-12 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-3">
                  {isDragging ? 'Drop files here' : 'Drag & drop files'}
                </h3>
                
                <p className="text-white/80 mb-2">or click to browse files</p>
                <p className="text-white/60 text-sm">Files will be saved in Cloudinary folder: {folderPath}</p>

                <button
                  className="mt-6 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:scale-[1.02] transition-all duration-200 shadow-md"
                  disabled={uploading}
                >
                  {uploading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Uploading...
                    </span>
                  ) : (
                    'Choose Files'
                  )}
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileInputChange}
                className="hidden"
                accept="*"
              />
            </div>

            {/* File List Preview */}
            {files.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Selected Files ({files.length})
                  </h3>
                  <button
                    onClick={() => setFiles([])}
                    className="text-white/70 hover:text-white text-sm flex items-center"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear all
                  </button>
                </div>
                
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                  {files.map((file) => (
                    <div 
                      key={file.id}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-colors group ${
                        file.status === 'uploading' 
                          ? 'bg-blue-500/10 border-blue-500/30' 
                          : file.status === 'uploaded'
                          ? 'bg-green-500/10 border-green-500/30'
                          : file.status === 'error'
                          ? 'bg-red-500/10 border-red-500/30'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center flex-1 min-w-0">
                        <span className="text-2xl mr-3">{getFileIcon(file.type)}</span>
                        <div className="min-w-0 flex-1">
                          <p className="text-white font-medium truncate">{file.name}</p>
                          <p className="text-white/60 text-sm">{formatFileSize(file.size)}</p>
                          {file.status === 'uploading' && (
                            <p className="text-blue-300 text-xs mt-1">Uploading to Cloudinary...</p>
                          )}
                          {file.status === 'uploaded' && (
                            <p className="text-green-300 text-xs mt-1">Uploaded successfully</p>
                          )}
                          {file.status === 'error' && (
                            <p className="text-red-300 text-xs mt-1">Upload failed</p>
                          )}
                        </div>
                      </div>
                      {file.status !== 'uploading' && (
                        <button
                          onClick={() => removeFile(file.id)}
                          className="p-2 text-white/50 hover:text-red-400 hover:bg-red-500/20 rounded-full transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Progress */}
            {uploading && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">Uploading to Cloudinary...</span>
                  <span className="text-white/80">{Math.round(uploadProgress)}%</span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-300 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {(files.length > 0 || uploading) && (
              <div className="flex gap-4 mb-8">
                <button
                  onClick={handleFileUpload}
                  disabled={uploading || files.length === 0}
                  className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                      Uploading to Cloudinary...
                    </>
                  ) : (
                    <>
                      <UploadIcon className="w-5 h-5 mr-3" />
                      Upload {files.length} file{files.length !== 1 ? 's' : ''} to Cloudinary
                    </>
                  )}
                </button>
                
                {uploading && (
                  <button
                    onClick={handleCancelUpload}
                    className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 shadow-md flex items-center justify-center"
                  >
                    <X className="w-5 h-5 mr-3" />
                    Cancel Upload
                  </button>
                )}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-8 p-4 backdrop-blur-sm bg-red-500/10 border border-red-500/30 rounded-xl">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-300 mr-3 flex-shrink-0" />
                  <span className="text-red-100">{error}</span>
                </div>
              </div>
            )}
            
            {/* Success Message */}
            {success && (
              <div className="mb-8 p-4 backdrop-blur-sm bg-green-500/10 border border-green-500/30 rounded-xl">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-300 mr-3 flex-shrink-0" />
                  <span className="text-green-100">{success}</span>
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