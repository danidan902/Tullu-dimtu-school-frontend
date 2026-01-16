import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Search, Filter, Download, RefreshCw, X, 
  FileText, Video, Image, Music, Presentation,
  Grid, List, FileSpreadsheet, Archive,
  Star, Users, XCircle, Maximize2,Home
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const StudentDashboardStudy = () => {
  // State
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFileType, setSelectedFileType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState({});
  const [viewMode, setViewMode] = useState('grid');
  const [downloadProgress, setDownloadProgress] = useState({});
  const [recentDownloads, setRecentDownloads] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [previewMedia, setPreviewMedia] = useState(null);
  const [sortBy, setSortBy] = useState('newest'); 
  const navigate = useNavigate();

  
  const grades = ['Grade 9','Grade 10','Grade 11','Grade 12'];
  const subjects = ['Mathematics','Science','Physics','Chemistry','Biology','English','Literature','History','Geography','Social Studies','Programming','Physical Education','Economics',];
  const categories = ['lecture', 'assignment', 'video', 'presentation', 'quiz', 'resource', 'project'];
  const fileTypes = ['pdf', 'video', 'image', 'audio', 'document', 'presentation', 'spreadsheet', 'archive'];

  const fileTypeIcons = {
    pdf: <FileText className="w-5 h-5 text-red-500" />,
    video: <Video className="w-5 h-5 text-purple-500" />,
    image: <Image className="w-5 h-5 text-green-500" />,
    audio: <Music className="w-5 h-5 text-yellow-500" />,
    document: <FileText className="w-5 h-5 text-blue-500" />,
    presentation: <Presentation className="w-5 h-5 text-orange-500" />,
    spreadsheet: <FileSpreadsheet className="w-5 h-5 text-emerald-500" />,
    archive: <Archive className="w-5 h-5 text-gray-500" />
  };

  // Initialize
  useEffect(() => { 
    fetchAllMaterials();
    loadRecentDownloads();
  }, []);

  // Filter and sort materials
  useEffect(() => {
    let filtered = [...materials];
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(m => 
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Subject filter
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(m => m.subject === selectedSubject);
    }
    
    // Grade filter
    if (selectedGrade !== 'all') {
      filtered = filtered.filter(m => m.grade === selectedGrade);
    }
    
    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(m => m.category === selectedCategory);
    }
    
    // File type filter
    if (selectedFileType !== 'all') {
      filtered = filtered.filter(m => m.fileType === selectedFileType);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch(sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'popular':
          return (b.views + b.downloads) - (a.views + a.downloads);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
    
    setFilteredMaterials(filtered);
  }, [materials, searchTerm, selectedSubject, selectedGrade, selectedCategory, selectedFileType, sortBy]);

  // Handle image/video click to open preview
  const handleMediaClick = (material, event) => {
    // Only for image and video types
    if (material.fileType === 'image' || material.fileType === 'video') {
      event.preventDefault();
      event.stopPropagation();
      setPreviewMedia(material);
    }
  };

  // Close preview
  const closePreview = () => {
    setPreviewMedia(null);
  };

  // Real Download Function
  const handleRealDownload = async (material) => {
    const materialId = material._id;
    
    setDownloading(prev => ({ ...prev, [materialId]: true }));
    setDownloadProgress(prev => ({ ...prev, [materialId]: 0 }));
    
    try {
      // Generate proper filename
      let fileName = material.fileName || 
        `${material.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}`;
      
      const extensions = {
        pdf: '.pdf',
        video: '.mp4',
        image: '.jpg',
        audio: '.mp3',
        document: '.docx',
        presentation: '.pptx',
        spreadsheet: '.xlsx',
        archive: '.zip'
      };
      
      if (material.fileType && !fileName.includes('.')) {
        fileName += extensions[material.fileType] || '.file';
      }
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => {
          const current = prev[materialId] || 0;
          if (current >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return { ...prev, [materialId]: current + 10 };
        });
      }, 100);
      
      // METHOD 1: Using fetch with File API
      const response = await fetch(material.fileUrl);
      const blob = await response.blob();
      
      // Create object URL
      const url = window.URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      
      // Append to body
      document.body.appendChild(link);
      
      // Trigger download
      link.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
      
      clearInterval(progressInterval);
      setDownloadProgress(prev => ({ ...prev, [materialId]: 100 }));
      
      // Save to recent downloads
      saveRecentDownload(material);
      
      // Update download count
      updateDownloadCount(materialId);
      
    } catch (error) {
      console.error('Download error:', error);
      
      // Fallback to traditional method
      try {
        const link = document.createElement('a');
        link.href = material.fileUrl;
        link.download = material.fileName || material.title;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        saveRecentDownload(material);
        updateDownloadCount(materialId);
      } catch (fallbackError) {
        console.error('Fallback download failed:', fallbackError);
      }
    } finally {
      setTimeout(() => {
        setDownloading(prev => ({ ...prev, [materialId]: false }));
        setDownloadProgress(prev => ({ ...prev, [materialId]: 0 }));
      }, 1500);
    }
  };

  const updateDownloadCount = async (materialId) => {
    try {
      await axios.put(`${API_BASE_URL}/materials/${materialId}`, {
        downloads: (materials.find(m => m._id === materialId)?.downloads || 0) + 1
      });
      
      setMaterials(prev => prev.map(m => 
        m._id === materialId ? { ...m, downloads: (m.downloads || 0) + 1 } : m
      ));
    } catch (apiError) {
      console.warn('Failed to update download count:', apiError);
    }
  };

  const saveRecentDownload = (material) => {
    const download = {
      ...material,
      downloadedAt: new Date().toISOString(),
      localPath: `Downloads/${material.fileName || material.title}`
    };
    
    const updated = [download, ...recentDownloads.filter(d => d._id !== material._id)].slice(0, 5);
    setRecentDownloads(updated);
    localStorage.setItem('recentDownloads', JSON.stringify(updated));
  };

  const loadRecentDownloads = () => {
    const saved = localStorage.getItem('recentDownloads');
    if (saved) {
      setRecentDownloads(JSON.parse(saved));
    }
  };

  const fetchAllMaterials = async () => {
    try {
      setLoading(true);
      
      const res = await axios.get(`${API_BASE_URL}/materials`);
      
      if (res.data.success) {
        const fetchedMaterials = res.data.data || [];
        setMaterials(fetchedMaterials);
      }
    } catch (e) { 
      console.warn('Using mock data:', e.message);
      const mockMaterials = getMockMaterials();
      setMaterials(mockMaterials);
    } finally { 
      setLoading(false); 
    }
  };

  const getMockMaterials = () => {
    return [
      {
        _id: '1',
        title: 'Advanced Calculus Concepts',
        description: 'Complete guide to advanced calculus with practical examples.',
        subject: 'Mathematics',
        grade: 'University',
        category: 'lecture',
        fileType: 'pdf',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&h=450&fit=crop',
        fileSize: '2.5 MB',
        views: 320,
        downloads: 210,
        createdAt: '2024-01-25T10:30:00Z',
        isPublic: true,
        fileName: 'calculus-guide.pdf',
        rating: 4.8,
        pages: 45
      },
      {
        _id: '2',
        title: 'Physics Experiments Video',
        description: 'Video demonstration of advanced physics laboratory experiments.',
        subject: 'Physics',
        grade: 'Grade 11',
        category: 'video',
        fileType: 'video',
        fileUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=450&fit=crop',
        fileSize: '45.2 MB',
        views: 540,
        downloads: 310,
        createdAt: '2024-01-24T14:20:00Z',
        isPublic: true,
        fileName: 'physics-experiments.mp4',
        rating: 4.9,
        duration: '15:30'
      },
      {
        _id: '3',
        title: 'Chemistry Lab Images',
        description: 'High-quality images of chemical reactions and lab setups.',
        subject: 'Chemistry',
        grade: 'Grade 12',
        category: 'resource',
        fileType: 'image',
        fileUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=450&fit=crop',
        fileSize: '8.7 MB',
        views: 210,
        downloads: 150,
        createdAt: '2024-01-23T09:15:00Z',
        isPublic: true,
        fileName: 'chemistry-lab-images.zip',
        rating: 4.5
      },
      {
        _id: '4',
        title: 'English Grammar Audio Guide',
        description: 'Audio lessons covering all aspects of English grammar.',
        subject: 'English',
        grade: 'Grade 9',
        category: 'lecture',
        fileType: 'audio',
        fileUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        thumbnailUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=450&fit=crop',
        fileSize: '15.3 MB',
        views: 180,
        downloads: 120,
        createdAt: '2024-01-22T11:45:00Z',
        isPublic: true,
        fileName: 'english-grammar.mp3',
        rating: 4.3,
        duration: '25:10'
      },
      {
        _id: '5',
        title: 'Biology Presentation Slides',
        description: 'PowerPoint presentation on human anatomy and physiology.',
        subject: 'Biology',
        grade: 'College',
        category: 'presentation',
        fileType: 'presentation',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        thumbnailUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&h=450&fit=crop',
        fileSize: '5.8 MB',
        views: 290,
        downloads: 195,
        createdAt: '2024-01-21T13:10:00Z',
        isPublic: true,
        fileName: 'biology-presentation.pptx',
        rating: 4.7,
        slides: 42
      },
      {
        _id: '6',
        title: 'English Literature Timeline',
        description: 'Complete timeline of English literature from medieval to modern periods.',
        subject: 'Literature',
        grade: 'College',
        category: 'document',
        fileType: 'document',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&h=450&fit=crop',
        fileSize: '3.2 MB',
        views: 156,
        downloads: 102,
        createdAt: '2024-01-20T16:20:00Z',
        isPublic: true,
        fileName: 'english-literature-timeline.docx',
        rating: 4.6,
        pages: 85
      },
      {
        _id: '7',
        title: 'Computer Science Data Sheet',
        description: 'Excel spreadsheet with programming algorithms and data structures.',
        subject: 'Computer Science',
        grade: 'University',
        category: 'assignment',
        fileType: 'spreadsheet',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=450&fit=crop',
        fileSize: '1.8 MB',
        views: 245,
        downloads: 178,
        createdAt: '2024-01-19T08:45:00Z',
        isPublic: true,
        fileName: 'cs-data.xlsx',
        rating: 4.4
      },
      {
        _id: '8',
        title: 'History Project Archive',
        description: 'ZIP file containing all historical documents and resources.',
        subject: 'History',
        grade: 'Grade 10',
        category: 'project',
        fileType: 'archive',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        thumbnailUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&h=450&fit=crop',
        fileSize: '12.5 MB',
        views: 195,
        downloads: 145,
        createdAt: '2024-01-18T15:30:00Z',
        isPublic: true,
        fileName: 'history-project.zip',
        rating: 4.2
      }
    ];
  };

  // Media Preview Modal
  const MediaPreview = () => {
    if (!previewMedia) return null;

    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="relative max-w-7xl w-full h-full flex flex-col ">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-black/50 text-white">
            <div className="flex items-center space-x-3">
              {previewMedia.fileType === 'image' ? (
                <Image className="w-6 h-6" />
              ) : (
                <Video className="w-6 h-6" />
              )}
              <div>
                <h3 className="font-bold text-lg">{previewMedia.title}</h3>
                <p className="text-sm text-gray-300">{previewMedia.subject} • {previewMedia.grade}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleRealDownload(previewMedia)}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={closePreview}
                className="p-2 hover:bg-white/10 rounded-lg transition"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Media Content */}
          <div className="flex-1 flex items-center justify-center p-4">
            {previewMedia.fileType === 'image' ? (
              <img
                src={previewMedia.fileUrl}
                alt={previewMedia.title}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
            ) : (
              <video
                controls
                autoPlay
                className="max-w-full max-h-full rounded-lg shadow-2xl"
              >
                <source src={previewMedia.fileUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>

          {/* Footer Info */}
          <div className="p-4 bg-black/50 text-white text-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-300">{previewMedia.description}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    {previewMedia.rating}
                  </span>
                  <span>•</span>
                  <span>{previewMedia.fileSize}</span>
                  <span>•</span>
                  <span>{previewMedia.downloads || 0} downloads</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Maximize2 className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400">Click on media to interact</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Enhanced Material Card
  const MaterialCard = ({ material }) => {
    const isDownloading = downloading[material._id];
    const progress = downloadProgress[material._id] || 0;

    // Check if this is image or video type
    const isMediaType = material.fileType === 'image' || material.fileType === 'video';

    return (
      <div className="group relative bg-white rounded-2xl shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 overflow-hidden h-[460px] flex flex-col hover:-translate-y-1">
        {/* Top Badge */}
        <div className="absolute top-4 left-4 z-10">
          <div className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-semibold rounded-full shadow-lg">
            {material.category?.toUpperCase()}
          </div>
        </div>
        
        {/* Image/Thumbnail Section - Clickable for images/videos */}
        <div className="h-64 relative overflow-hidden">
          {material.thumbnailUrl ? (
            <>
              <img
                src={material.thumbnailUrl}
                alt={material.title}
                className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${
                  isMediaType ? 'cursor-pointer' : ''
                }`}
                onClick={(e) => handleMediaClick(material, e)}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              {/* Overlay for media types */}
              {isMediaType && (
                <div 
                  className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all duration-300 cursor-pointer"
                  onClick={(e) => handleMediaClick(material, e)}
                >
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    {material.fileType === 'image' ? (
                      <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                        <Image className="w-6 h-6 text-white" />
                      </div>
                    ) : (
                      <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                        <Video className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div 
              className={`w-full h-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center ${
                isMediaType ? 'cursor-pointer' : ''
              }`}
              onClick={(e) => isMediaType && handleMediaClick(material, e)}
            >
              <div className="text-5xl text-blue-500"></div>
            </div>
          )}
          
          {/* Progress Bar for Download */}
          {isDownloading && progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-200">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-300 shadow-lg"
                style={{ width: `${progress}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-white">
                  {progress}%
                </span>
              </div>
            </div>
          )}
          
          {/* File Type Badge */}
          <div className="absolute bottom-4 left-4">
            <div className="flex items-center space-x-2 px-4 py-2 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg">
              {fileTypeIcons[material.fileType] || <FileText className="w-5 h-5 text-gray-600" />}
              <span className="text-sm font-semibold text-gray-700">
                {material.fileType?.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Title & Subject */}
          <div className="mb-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-gray-900 text-xl line-clamp-1">
                {material.title}
              </h3>
              {material.rating && (
                <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-50 to-orange-50 px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-bold">{material.rating}</span>
                </div>
              )}
            </div>
            <div className="flex items-center text-sm text-blue-600 font-semibold">
              {material.subject}
              <span className="mx-2">•</span>
              <Users className="w-4 h-4 mr-1" />
              {material.grade}
            </div>
          </div>
          
          {/* Description */}
          <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-1">
            {material.description}
          </p>
          
          {/* Stats & Action Bar */}
          <div className="pt-5 border-t flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {isMediaType && (
                <button
                  onClick={(e) => handleMediaClick(material, e)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
                >
                  {material.fileType === 'image' ? (
                    <>
                      <Image className="w-4 h-4 mr-1" />
                      View Image
                    </>
                  ) : (
                    <>
                      <Video className="w-4 h-4 mr-1" />
                      Play Video
                    </>
                  )}
                </button>
              )}
            </div>
            
            <button
              onClick={() => handleRealDownload(material)}
              disabled={isDownloading}
              className={`px-5 py-2.5 rounded-xl transition-all flex items-center space-x-2 min-w-[120px] justify-center ${
                isDownloading
                  ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              {isDownloading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span className="text-sm font-medium">{progress}%</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span className="text-sm font-medium">Download</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // List View Component
  const MaterialListItem = ({ material }) => {
    const isDownloading = downloading[material._id];
    const progress = downloadProgress[material._id] || 0;
    const isMediaType = material.fileType === 'image' || material.fileType === 'video';

    return (
      <div className="group bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden">
        <div className="flex">
          {/* Thumbnail */}
          <div className="w-48 relative">
            {material.thumbnailUrl ? (
              <div 
                className="h-full cursor-pointer"
                onClick={(e) => isMediaType && handleMediaClick(material, e)}
              >
                <img
                  src={material.thumbnailUrl}
                  alt={material.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center">
                {fileTypeIcons[material.fileType] || <FileText className="w-8 h-8 text-blue-500" />}
              </div>
            )}
          </div>
          
          {/* Content */}
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">{material.title}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {material.grade}
                  </span>
                  <span>•</span>
                  <span className="font-medium text-blue-600">{material.subject}</span>
                  <span>•</span>
                  <span className="px-2 py-1 bg-gray-100 rounded-lg text-xs">
                    {material.fileType?.toUpperCase()}
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs">
                    {material.category?.toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{material.description}</p>
              </div>
              
              {material.rating && (
                <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-50 to-orange-50 px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-bold">{material.rating}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                {isMediaType && (
                  <button
                    onClick={(e) => handleMediaClick(material, e)}
                    className="text-blue-600 hover:text-blue-700 font-medium flex items-center text-sm"
                  >
                    {material.fileType === 'image' ? (
                      <>
                        <Image className="w-4 h-4 mr-2" />
                        Preview Image
                      </>
                    ) : (
                      <>
                        <Video className="w-4 h-4 mr-2" />
                        Play Video
                      </>
                    )}
                  </button>
                )}  
                <span className="text-sm text-gray-500">{material.fileSize}</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleRealDownload(material)}
                  disabled={isDownloading}
                  className={`px-6 py-3 rounded-xl transition-all flex items-center space-x-2 ${
                    isDownloading
                      ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700'
                      : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isDownloading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span className="font-medium">{progress}%</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      <span className="font-medium">Download</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen  ">
      {/* Media Preview Modal */}
      <MediaPreview />
      
      {/* Header */}
     <header className="sticky top-0 z-40 shadow-lg bg-blue-400">
  {/* Top Buttons */}
  <div className="fixed top-4 left-4 right-4 z-10 flex justify-between items-center">
    <button
      onClick={() => navigate('/studentstudy-dashboard')}
      className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
    >
      <Home className="w-5 h-5" />
      <span className="hidden sm:inline">Back to Home</span>
    </button>
  </div>

  {/* Main Header */}
  <div className="w-full px-4 lg:px-8">
    <div className="flex items-center justify-between h-20">
      
      {/* Logo Placeholder */}
      <div className="flex items-center space-x-4">
        <div>
          {/* <h1 className="text-2xl font-bold text-dark-400 bg-clip-text text-transparent">
            StudyHub Pro
          </h1> */}
        </div>
      </div>

      {/* Search Bar */}
      <div className="hidden lg:block flex-1 max-w-2xl mx-8">
  <div className="relative">
    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search study materials..."
      className="w-full pl-12 pr-4 py-3.5 bg-gray-100/80 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-inner"
    />
  </div>
</div>


      {/* User & Actions */}
      <div className="flex items-center space-x-4">
        <button
          onClick={fetchAllMaterials}
          className="p-2.5 hover:bg-gray-100 rounded-xl transition"
          title="Refresh"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

    </div>
  </div>
</header>


      {/* Mobile Search */}
      <div className="lg:hidden px-4 pt-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search materials..."
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="w-full px-4 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sticky top-28">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <Filter className="w-5 h-5 mr-3" />
                  Filter Materials
                </h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-8">
                {/* Sort By */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Sort by
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-inner"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="popular">Most Popular</option>
                    <option value="title">Title A-Z</option>
                  </select>
                </div>

                {/* Grade Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Grade Level
                  </label>
                  <select
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(e.target.value)}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-inner"
                  >
                    <option value="all">All Grades</option>
                    {grades.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>

                {/* Subject Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Subject
                  </label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-inner"
                  >
                    <option value="all">All Subjects</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-inner"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</option>
                    ))}
                  </select>
                </div>

                {/* File Type Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    File Type
                  </label>
                  <select
                    value={selectedFileType}
                    onChange={(e) => setSelectedFileType(e.target.value)}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-inner"
                  >
                    <option value="all">All File Types</option>
                    {fileTypes.map(type => (
                      <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                    ))}
                  </select>
                </div>

                {/* Quick Actions */}
                <div className="pt-6 border-t space-y-4">
                  <button
                    onClick={fetchAllMaterials}
                    className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 font-medium"
                  >
                    <RefreshCw className="w-5 h-5" />
                    <span>Refresh Materials</span>
                  </button>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedSubject('all');
                      setSelectedGrade('all');
                      setSelectedCategory('all');
                      setSelectedFileType('all');
                      setSortBy('newest');
                    }}
                    className="w-full py-3.5 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center space-x-2 font-medium"
                  >
                    <X className="w-5 h-5" />
                    <span>Clear All Filters</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="mb-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-6 bg-gradient-to-r from-blue-600 via-purple-500 to-indigo-600 text-transparent bg-clip-text">
  Student <span className="text-blue-500">Study Portal</span>
</h2>

<div className="flex justify-center">
  <div className="relative max-w-4xl w-full rounded-2xl border border-white/20 bg-white/30 backdrop-blur-xl shadow-2xl p-8 transition-all duration-300 hover:scale-[1.02]">
    
    <div className="absolute -top-3 -right-3 w-20 h-20 bg-blue-400/30 rounded-full blur-2xl"></div>
    <div className="absolute -bottom-3 -left-3 w-24 h-24 bg-purple-400/30 rounded-full blur-2xl"></div>

    <p className="text-sm md:text-base text-gray-800 leading-relaxed font-medium">
      A modern and interactive learning platform built exclusively for 
      <span className="text-blue-600 font-semibold"> Tullu Dimtu School students</span>. 
      Access digital textbooks, read PDFs, complete assignments, and explore smart learning tools — all in one secure place.
      This portal empowers students to study efficiently, stay organized, and build strong academic foundations for the future.
    </p>
  </div>
</div>



                  <p className="text-xl font-bold text-gray-900">
                    {filteredMaterials.length} Learning Materials
                  </p>
                  <p className="text-gray-600 mt-2">
                    {selectedSubject !== 'all' && `Subject: ${selectedSubject} • `}
                    {selectedGrade !== 'all' && `Grade: ${selectedGrade} • `}
                    {selectedCategory !== 'all' && `Category: ${selectedCategory} • `}
                    {selectedFileType !== 'all' && `File Type: ${selectedFileType}`}
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowFilters(true)}
                    className="lg:hidden px-5 py-2.5 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center space-x-2 font-medium"
                  >
                    <Filter className="w-5 h-5" />
                    <span>Filters</span>
                  </button>
                  
                  {/* Grid/List Toggle */}
                  <div className="flex bg-gray-100 p-1.5 rounded-xl">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-3 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-lg' : 'hover:bg-white/50'}`}
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-3 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-lg' : 'hover:bg-white/50'}`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Materials Display */}
            {loading ? (
              <div className="w-full py-24">
                <div className="inline-flex items-center justify-center">
                  <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin shadow-lg"></div>
                </div>
                <p className="mt-6 text-gray-600 font-medium">Loading study materials...</p>
              </div>
            ) : filteredMaterials.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                  {filteredMaterials.map(material => (
                    <MaterialCard key={material._id} material={material} />
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredMaterials.map(material => (
                    <MaterialListItem key={material._id} material={material} />
                  ))}
                </div>
              )
            ) : (
              <div className="w-full py-20 bg-gradient-to-br from-white to-blue-50 rounded-2xl border-2 border-dashed border-blue-200 shadow-inner">
                <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center shadow-lg">
                  <FileText className="w-12 h-12 text-blue-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No materials found</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Try adjusting your search terms or filters to find what you need
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedSubject('all');
                    setSelectedGrade('all');
                    setSelectedCategory('all');
                    setSelectedFileType('all');
                  }}
                  className="px-8 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl font-medium"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboardStudy;