
import { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import NewsCard from '../components/NewsCard';
import axios from 'axios';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/tullulogo.png';
import { Helmet } from "react-helmet-async";

const DirectorPage = () => {
  const [news, setNews] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Announcement',
    author: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [notification, setNotification] = useState('');
  const [selectedNews, setSelectedNews] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bulkAction, setBulkAction] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAuthorModal, setShowAuthorModal] = useState(false);
  const [newAuthor, setNewAuthor] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    byCategory: {},
    byAuthor: {},
    recentCount: 0
  });

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // BACKEND API CONFIGURATION
  const BACKEND_URL = 'https://tullu-dimtu-school-backend-1.onrender.com/api'; // Change to your backend URL
  const LIVE_ANNOUNCEMENTS_URL = 'https://tullu-dimtu-school-backend-1.onrender.com/api/announcements';

  // Backend API Functions
  const backendAPI = {
    // Fetch all news from backend
    async fetchNews() {
      try {
        const response = await axios.get(`${BACKEND_URL}/posts`);
        if (response.data.success) {
          return response.data.posts || [];
        }
        return [];
      } catch (error) {
        console.error('Error fetching news from backend:', error);
        return [];
      }
    },

    // Save news to backend
    async saveNews(newsData) {
      try {
        const response = await axios.post(`${BACKEND_URL}/posts`, newsData);
        return response.data;
      } catch (error) {
        console.error('Error saving news to backend:', error);
        throw error;
      }
    },

    // Update news in backend
    async updateNews(id, newsData) {
      try {
        const response = await axios.put(`${BACKEND_URL}/posts/${id}`, newsData);
        return response.data;
      } catch (error) {
        console.error('Error updating news in backend:', error);
        throw error;
      }
    },

    // Delete news from backend
    async deleteNews(id) {
      try {
        const response = await axios.delete(`${BACKEND_URL}/posts/${id}`);
        return response.data;
      } catch (error) {
        console.error('Error deleting news from backend:', error);
        throw error;
      }
    },

    // Bulk delete from backend
    async bulkDelete(ids) {
      try {
        const response = await axios.post(`${BACKEND_URL}/posts/bulk/delete`, { ids });
        return response.data;
      } catch (error) {
        console.error('Error bulk deleting from backend:', error);
        throw error;
      }
    },

    // Get stats from backend
    async getStats() {
      try {
        const response = await axios.get(`${BACKEND_URL}/posts/stats/overview`);
        return response.data;
      } catch (error) {
        console.error('Error getting stats from backend:', error);
        throw error;
      }
    }
  };

  useEffect(() => {
    // Load news from backend
    const loadNewsFromBackend = async () => {
      const newsData = await backendAPI.fetchNews();
      if (newsData.length > 0) {
        setNews(newsData);
        updateStats(newsData);
      }
    };

    // Load authors (keeping localStorage for authors as it's separate from news)
    const savedAuthors = localStorage.getItem('newsAuthors');
    if (savedAuthors) {
      setAuthors(JSON.parse(savedAuthors));
    } else {
      const defaultAuthors = [
        'Dr. Sarah Johnson',
        'Principal Office',
        'Academic Department',
        'Sports Committee',
        'Event Coordinator'
      ];
      setAuthors(defaultAuthors);
      localStorage.setItem('newsAuthors', JSON.stringify(defaultAuthors));
    }

    loadNewsFromBackend();
  }, []);

  // Function to handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setNotification('Please upload an image file (JPG, PNG, GIF, etc.)');
        setTimeout(() => setNotification(''), 3000);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setNotification('Image size should be less than 5MB');
        setTimeout(() => setNotification(''), 3000);
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      
      setFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: previewUrl
      }));
    }
  };

  // Function to remove uploaded image
  const removeImage = () => {
    if (formData.imagePreview) {
      URL.revokeObjectURL(formData.imagePreview);
    }
    
    setFormData(prev => ({
      ...prev,
      image: null,
      imagePreview: ''
    }));
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Function to convert image to base64 for storage
  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  // FIXED: Function to publish to Live Announcements
  const publishToLiveAnnouncements = async (newsItem) => {
    try {
      console.log('📤 Publishing to live announcements:', newsItem.title);
      
      let priority = 'normal';
      if (newsItem.category === 'Urgent') priority = 'high';
      if (newsItem.category === 'Academic') priority = 'medium';

      // Prepare the data structure that matches what live announcements backend expects
      const announcementData = {
        title: newsItem.title || '',
        message: newsItem.content || '',
        priority: priority,
        from: newsItem.author || 'School Administration',
        category: newsItem.category || 'Announcement',
        newsId: newsItem.id ? newsItem.id.toString() : Date.now().toString(),
        date: newsItem.date || new Date().toISOString().split('T')[0],
        timestamp: newsItem.timestamp || Date.now(),
        imageUrl: newsItem.imageUrl || ''
      };

      console.log('📤 Sending to live announcements:', announcementData);

      const response = await axios.post(LIVE_ANNOUNCEMENTS_URL, announcementData, {
        timeout: 10000, // 10 second timeout
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('✅ Live announcement published successfully:', response.data);
      return { 
        success: true, 
        data: response.data,
        message: 'Sent to live announcements successfully!' 
      };
    } catch (error) {
      console.error('❌ Failed to publish live announcement:', error);
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      // Return more detailed error message
      let errorMessage = 'Failed to send to live announcements';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { 
        success: false, 
        error: errorMessage,
        retry: true // Indicate this can be retried
      };
    }
  };

  // FIXED: Function to delete from Live Announcements
  const deleteFromLiveAnnouncements = async (newsItem) => {
    try {
      console.log('🗑️ Attempting to delete from live announcements:', newsItem.title);
      
      // Try to find by newsId
      const searchResponse = await axios.get(`${LIVE_ANNOUNCEMENTS_URL}?newsId=${newsItem.id}`, {
        timeout: 5000
      });
      
      if (searchResponse.data && searchResponse.data.length > 0) {
        const deletePromises = searchResponse.data.map(async (announcement) => {
          try {
            await axios.delete(`${LIVE_ANNOUNCEMENTS_URL}/${announcement._id}`, {
              timeout: 5000
            });
            console.log(`✅ Deleted announcement: ${announcement.title}`);
            return { success: true, announcementId: announcement._id };
          } catch (deleteError) {
            console.error(`❌ Failed to delete announcement ${announcement._id}:`, deleteError);
            return { 
              success: false, 
              error: deleteError.message,
              announcementId: announcement._id 
            };
          }
        });
        
        const results = await Promise.all(deletePromises);
        const successCount = results.filter(r => r.success).length;
        const failCount = results.filter(r => !r.success).length;
        
        return { 
          success: successCount > 0,
          message: `Deleted ${successCount} announcement(s) from live feed${failCount > 0 ? `, ${failCount} failed` : ''}`,
          results
        };
      } else {
        console.log('ℹ️ No matching announcements found in live feed');
        return { 
          success: true, 
          message: 'No matching announcements found in live feed' 
        };
      }
    } catch (error) {
      console.error('❌ Error searching/deleting from live announcements:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || error.message || 'Failed to delete from live announcements'
      };
    }
  };

  const updateStats = (newsData) => {
    const categoryCount = {};
    const authorCount = {};
    let recentCount = 0;
    
    newsData.forEach(item => {
      if (item.category) {
        categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
      }
      if (item.author) {
        authorCount[item.author] = (authorCount[item.author] || 0) + 1;
      }
      
      if (item.date) {
        const newsDate = new Date(item.date);
        const today = new Date();
        const diffTime = Math.abs(today - newsDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays <= 7) recentCount++;
      }
    });
    
    setStats({
      total: newsData.length,
      byCategory: categoryCount,
      byAuthor: authorCount,
      recentCount
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // FIXED: Main submit handler with better error handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      setNotification('Please enter a news title');
      setTimeout(() => setNotification(''), 3000);
      return;
    }
    
    if (!formData.content.trim()) {
      setNotification('Please enter news content');
      setTimeout(() => setNotification(''), 3000);
      return;
    }
    
    if (!formData.author) {
      setNotification('Please select an author');
      setTimeout(() => setNotification(''), 3000);
      return;
    }

    let imageUrl = '';
    // Convert image to base64 if exists
    if (formData.image) {
      try {
        imageUrl = await convertImageToBase64(formData.image);
      } catch (error) {
        console.error('Error converting image:', error);
        setNotification('Failed to process image');
        setTimeout(() => setNotification(''), 3000);
        return;
      }
    }

    // Prepare news item
    const newNewsItem = {
      id: editingId || Date.now(),
      title: formData.title.trim(),
      content: formData.content.trim(),
      category: formData.category,
      author: formData.author,
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now(),
      status: 'published',
      imageUrl: imageUrl
    };

    let updatedNews = [...news];
    let notificationMessage = '';
    let liveAnnouncementSuccess = false;

    try {
      // First, save/update in local backend
      if (editingId) {
        // Update existing news
        await backendAPI.updateNews(editingId, newNewsItem);
        updatedNews = news.map(item => 
          item.id === editingId ? newNewsItem : item
        );
        notificationMessage = 'News updated successfully!';
        
        // Delete old announcement and send new one
        const oldNewsItem = news.find(item => item.id === editingId);
        if (oldNewsItem) {
          await deleteFromLiveAnnouncements(oldNewsItem);
        }
        
        // Send to live announcements
        const liveResult = await publishToLiveAnnouncements(newNewsItem);
        if (liveResult.success) {
          liveAnnouncementSuccess = true;
          notificationMessage += ' Sent to live announcements!';
        }
      } else {
        // Create new news - Save to backend first
        await backendAPI.saveNews(newNewsItem);
        updatedNews = [newNewsItem, ...news];
        
        // Then send to live announcements
        const liveResult = await publishToLiveAnnouncements(newNewsItem);
        if (liveResult.success) {
          liveAnnouncementSuccess = true;
          notificationMessage = '✅ News published! Sent to live announcements successfully.';
        } else {
          notificationMessage = '⚠️ News saved locally, but failed to send to live announcements.';
        }
      }

      // Update local state
      setNews(updatedNews);
      updateStats(updatedNews);
      
      // Show appropriate notification
      if (liveAnnouncementSuccess) {
        setNotification(notificationMessage);
      } else {
        // Show warning but don't fail the operation
        setNotification(notificationMessage);
      }

    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setNotification('❌ Failed to save news. Please try again.');
    } finally {
      // Reset form regardless of success
      setFormData({
        title: '',
        content: '',
        category: 'Announcement',
        author: '',
        image: null,
        imagePreview: ''
      });
      setEditingId(null);
      setSelectedNews([]);
      
      // Clean up image preview URL
      if (formData.imagePreview) {
        URL.revokeObjectURL(formData.imagePreview);
      }
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Auto-hide notification
      setTimeout(() => setNotification(''), 5000);
    }
  };

  const handleEdit = (newsItem) => {
    setFormData({
      title: newsItem.title,
      content: newsItem.content,
      category: newsItem.category,
      author: newsItem.author,
      image: null,
      imagePreview: newsItem.imageUrl || ''
    });
    setEditingId(newsItem.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this news item? This will also remove it from live announcements.')) {
      const newsItem = news.find(item => item.id === id);
      
      try {
        // First delete from live announcements
        const liveDeleteResult = await deleteFromLiveAnnouncements(newsItem);
        
        // Then delete from backend
        await backendAPI.deleteNews(id);
        
        // Update local state
        const updatedNews = news.filter(item => item.id !== id);
        setNews(updatedNews);
        updateStats(updatedNews);
        
        // Update selected news
        setSelectedNews(selectedNews.filter(itemId => itemId !== id));
        
        // Show notification
        let notificationMessage = 'News deleted successfully!';
        if (liveDeleteResult.success) {
          notificationMessage += ' ' + liveDeleteResult.message;
        } else if (liveDeleteResult.error) {
          notificationMessage += ` (Live announcements: ${liveDeleteResult.error})`;
        }
        
        setNotification(notificationMessage);
        setTimeout(() => setNotification(''), 4000);
      } catch (error) {
        console.error('Error deleting news:', error);
        setNotification('❌ Failed to delete news. Please try again.');
        setTimeout(() => setNotification(''), 4000);
      }
    }
  };

  const handleBulkDelete = () => {
    if (selectedNews.length === 0) {
      setNotification('Please select news items to delete');
      setTimeout(() => setNotification(''), 3000);
      return;
    }
    
    setShowDeleteModal(true);
  };

  const confirmBulkDelete = async () => {
    const itemsToDelete = news.filter(item => selectedNews.includes(item.id));
    
    try {
      let liveDeleteResults = [];
      
      // Delete from live announcements first
      for (const item of itemsToDelete) {
        const result = await deleteFromLiveAnnouncements(item);
        liveDeleteResults.push(result);
      }
      
      // Then delete from backend
      await backendAPI.bulkDelete(selectedNews);
      
      // Update local state
      const updatedNews = news.filter(item => !selectedNews.includes(item.id));
      setNews(updatedNews);
      updateStats(updatedNews);
      
      setSelectedNews([]);
      setShowDeleteModal(false);
      
      // Calculate success/fail counts
      const successCount = liveDeleteResults.filter(r => r.success).length;
      const failCount = liveDeleteResults.filter(r => !r.success).length;
      
      // Show notification
      let notificationMessage = `${selectedNews.length} news items deleted successfully!`;
      if (successCount > 0) {
        notificationMessage += ` ${successCount} removed from live announcements.`;
      }
      if (failCount > 0) {
        notificationMessage += ` ${failCount} failed to remove from live announcements.`;
      }
      
      setNotification(notificationMessage);
      setTimeout(() => setNotification(''), 5000);
    } catch (error) {
      console.error('Error in bulk delete:', error);
      setNotification('❌ Failed to delete news items. Please try again.');
      setShowDeleteModal(false);
      setTimeout(() => setNotification(''), 4000);
    }
  };

  const handleSelectNews = (id) => {
    setSelectedNews(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedNews.length === filteredNews.length) {
      setSelectedNews([]);
    } else {
      setSelectedNews(filteredNews.map(item => item.id));
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedNews.length === 0) {
      setNotification('Please select news items first');
      setTimeout(() => setNotification(''), 3000);
      return;
    }

    let message = '';
    
    switch (action) {
      case 'archive':
        // Update each item in backend
        for (const id of selectedNews) {
          const item = news.find(item => item.id === id);
          if (item) {
            await backendAPI.updateNews(id, { ...item, status: 'archived' });
          }
        }
        // Update local state
        setNews(prev => prev.map(item =>
          selectedNews.includes(item.id) ? { ...item, status: 'archived' } : item
        ));
        message = 'News items archived';
        break;
        
      case 'publish':
        // Update each item in backend
        for (const id of selectedNews) {
          const item = news.find(item => item.id === id);
          if (item) {
            await backendAPI.updateNews(id, { ...item, status: 'published' });
          }
        }
        // Update local state
        setNews(prev => prev.map(item =>
          selectedNews.includes(item.id) ? { ...item, status: 'published' } : item
        ));
        message = 'News items published';
        break;
        
      case 'draft':
        // Update each item in backend
        for (const id of selectedNews) {
          const item = news.find(item => item.id === id);
          if (item) {
            await backendAPI.updateNews(id, { ...item, status: 'draft' });
          }
        }
        // Update local state
        setNews(prev => prev.map(item =>
          selectedNews.includes(item.id) ? { ...item, status: 'draft' } : item
        ));
        message = 'News items moved to draft';
        break;
        
      case 'live':
        const selectedItems = filteredNews.filter(newsItem => selectedNews.includes(newsItem.id));
        let liveSuccessCount = 0;
        let liveFailCount = 0;
        
        for (const item of selectedItems) {
          const result = await publishToLiveAnnouncements(item);
          if (result.success) {
            liveSuccessCount++;
          } else {
            liveFailCount++;
          }
        }
        
        message = `Sent to live: ${liveSuccessCount} success, ${liveFailCount} failed`;
        break;
        
      case 'remove-from-live':
        const itemsToRemove = filteredNews.filter(newsItem => selectedNews.includes(newsItem.id));
        let removeSuccessCount = 0;
        let removeFailCount = 0;
        
        for (const item of itemsToRemove) {
          const result = await deleteFromLiveAnnouncements(item);
          if (result.success) {
            removeSuccessCount++;
          } else {
            removeFailCount++;
          }
        }
        
        message = `Removed from live: ${removeSuccessCount} success, ${removeFailCount} failed`;
        break;
        
      default:
        return;
    }

    // Refresh stats if status changed
    if (['archive', 'publish', 'draft'].includes(action)) {
      updateStats(news);
    }
    
    setNotification(`${message} successfully!`);
    setBulkAction('');
    setTimeout(() => setNotification(''), 4000);
  };

  const resendToLiveAnnouncements = async (newsItem) => {
    const result = await publishToLiveAnnouncements(newsItem);
    if (result.success) {
      setNotification(`✅ "${newsItem.title}" sent to live announcements!`);
    } else {
      setNotification(`⚠️ Failed to send "${newsItem.title}" to live announcements: ${result.error}`);
    }
    setTimeout(() => setNotification(''), 4000);
  };

  const removeFromLiveAnnouncements = async (newsItem) => {
    const result = await deleteFromLiveAnnouncements(newsItem);
    if (result.success) {
      setNotification(`✅ "${newsItem.title}" removed from live announcements!`);
    } else {
      setNotification(`⚠️ Failed to remove "${newsItem.title}" from live announcements: ${result.error}`);
    }
    setTimeout(() => setNotification(''), 4000);
  };

  const handleAddAuthor = () => {
    if (!newAuthor.trim()) return;
    
    const updatedAuthors = [...authors, newAuthor.trim()];
    setAuthors(updatedAuthors);
    localStorage.setItem('newsAuthors', JSON.stringify(updatedAuthors));
    setNewAuthor('');
    setShowAuthorModal(false);
    setNotification('Author added successfully!');
    setTimeout(() => setNotification(''), 3000);
  };

  const handleRemoveAuthor = (authorToRemove) => {
    if (authorToRemove === 'Dr. Sarah Johnson') {
      setNotification('Cannot remove default author');
      setTimeout(() => setNotification(''), 3000);
      return;
    }
    
    const updatedAuthors = authors.filter(author => author !== authorToRemove);
    setAuthors(updatedAuthors);
    localStorage.setItem('newsAuthors', JSON.stringify(updatedAuthors));
    setNotification('Author removed successfully!');
    setTimeout(() => setNotification(''), 3000);
  };

  const categories = ['Academic', 'Sports', 'Event', 'Announcement', 'Urgent', 'General'];

  const filteredNews = news.filter(item =>
    item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Director's Portal</title>
      </Helmet>
   
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
        <div className="fixed left-2 sm:left-4 top-2 sm:top-4 z-20">
          <button
            onClick={() => navigate('/')}
            className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        </div>

        <div className="relative bg-gradient-to-r from-blue-800 to-blue-600 text-white py-28">
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="flex justify-center mb-4 md:mb-6 mt-4 md:mt-0">
            <div className="bg-blue-100 rounded-2xl max-w-[200px] md:max-w-none">
              <img src={logo} alt='Tuludimtu School Logo' className='w-56 h-56'/>
            </div>
          </div>
          <div className="relative container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Director's News Portal</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Welcome back, Dr. Johnson. Publish and manage school news announcements here.
            </p>
          </div>
        </div>

        <Header isDirectorPage={true} />
      
        <main className="container mx-auto px-4 py-8">
          {/* Notification */}
          {notification && (
            <div className={`px-6 py-4 rounded-lg mb-8 flex justify-between items-center ${
              notification.includes('✅') 
                ? 'bg-green-100 border border-green-400 text-green-700'
                : notification.includes('❌')
                ? 'bg-red-100 border border-red-400 text-red-700'
                : notification.includes('⚠️')
                ? 'bg-yellow-100 border border-yellow-400 text-yellow-700'
                : 'bg-blue-100 border border-blue-400 text-blue-700'
            }`}>
              <span className="flex items-center">
                {notification}
              </span>
              <button onClick={() => setNotification('')} className="ml-4">
                <i className="fas fa-times"></i>
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - News Form */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                {editingId ? 'Edit News Item' : 'Create New News'}
              </h3>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">
                    News Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter news title..."
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Author <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Author</option>
                      {authors.map(author => (
                        <option key={author} value={author}>{author}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowAuthorModal(true)}
                      className="px-4 py-3 bg-blue-200 hover:bg-gray-300 rounded-lg transition duration-300"
                    >
                      Edit Author
                    </button>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map(category => (
                      <button
                        key={category}
                        type="button"
                        className={`px-4 py-3 rounded-lg font-medium transition duration-300 ${
                          formData.category === category 
                          ? 'bg-blue-800 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, category }))}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Image Upload Section */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">
                    News Image (Optional)
                  </label>
                  <div className="space-y-4">
                    {formData.imagePreview ? (
                      <div className="relative">
                        <img 
                          src={formData.imagePreview} 
                          alt="Preview" 
                          className="w-full h-48 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        >
                          <i className="fas fa-times text-sm"></i>
                        </button>
                      </div>
                    ) : (
                      <div 
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <i className="fas fa-image text-4xl text-gray-400 mb-4"></i>
                        <p className="text-gray-600">Click to upload an image</p>
                        <p className="text-gray-400 text-sm mt-2">Supports JPG, PNG, GIF (Max 5MB)</p>
                      </div>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="flex justify-between items-center">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        {formData.imagePreview ? 'Change Image' : 'Browse...'}
                      </button>
                      {formData.imagePreview && (
                        <button
                          type="button"
                          onClick={removeImage}
                          className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          Remove Image
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-gray-700 font-semibold mb-2">
                    News Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows="8"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Write the news content here..."
                    required
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center"
                  >
                    <i className="fas fa-paper-plane mr-2"></i>
                    {editingId ? 'Update News' : 'Publish News'}
                  </button>
                  
                  {editingId && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          title: '',
                          content: '',
                          category: 'Announcement',
                          author: '',
                          image: null,
                          imagePreview: ''
                        });
                        setEditingId(null);
                      }}
                      className="flex-1 bg-blue-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center"
                    >
                      <i className="fas fa-times mr-2"></i>
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>

              {/* Form Tips */}
              <div className="mt-10 p-6 bg-blue-50 rounded-lg">
                <h4 className="font-bold text-lg text-gray-800 mb-3 flex items-center">
                  <i className="fas fa-lightbulb text-blue-600 mr-2"></i>
                  Publishing Tips
                </h4>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                    News is automatically sent to live announcements
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                    "Urgent" category appears as high priority in live feed
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                    Images make announcements more engaging
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                    Deleting news also removes it from live announcements
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column - Recent News & Stats */}
            <div>
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">News Overview</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                    <p className="text-gray-600 text-sm">Total News</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{stats.recentCount}</p>
                    <p className="text-gray-600 text-sm">This Week</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">
                      {Object.keys(stats.byAuthor || {}).length}
                    </p>
                    <p className="text-gray-600 text-sm">Authors</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">
                      {Object.keys(stats.byCategory || {}).length}
                    </p>
                    <p className="text-gray-600 text-sm">Categories</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-lg text-gray-800 mb-4">Category Distribution</h4>
                  <div className="space-y-3">
                    {Object.entries(stats.byCategory || {}).map(([category, count]) => (
                      <div key={category} className="flex items-center justify-between">
                        <span className="text-gray-700">{category}</span>
                        <div className="flex items-center">
                          <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${(count / stats.total) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Preview Section */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Live Preview</h3>
                {formData.title || formData.content || formData.imagePreview ? (
                  <NewsCard 
                    news={{
                      ...formData,
                      id: 'preview',
                      date: new Date().toISOString().split('T')[0],
                      author: formData.author || 'Select Author',
                      imageUrl: formData.imagePreview
                    }} 
                    isCompact={true}
                  />
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <i className="fas fa-newspaper text-4xl text-gray-300 mb-4"></i>
                    <p className="text-gray-500">Start writing to see a preview here</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* All News List */}
          <div className="bg-white rounded-xl shadow-lg p-8 mt-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h3 className="text-2xl font-bold text-gray-800">All Published News</h3>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <input
                    type="text"
                    placeholder="Search news..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <i className="fas fa-search absolute right-3 top-3 text-gray-400"></i>
                </div>
                
                <select
                  value={bulkAction}
                  onChange={(e) => {
                    setBulkAction(e.target.value);
                    if (e.target.value) handleBulkAction(e.target.value);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Bulk Actions</option>
                  <option value="publish">Publish Selected</option>
                  <option value="archive">Archive Selected</option>
                  <option value="draft">Move to Draft</option>
                  <option value="live">Send to Live Announcements</option>
                  <option value="remove-from-live">Remove from Live Announcements</option>
                </select>
                
                <button
                  onClick={handleBulkDelete}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition duration-300 flex items-center justify-center"
                >
                  <i className="fas fa-trash mr-2"></i>
                  Delete Selected
                </button>
              </div>
            </div>
            
            {filteredNews.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="text-left p-4 w-12">
                        <input
                          type="checkbox"
                          checked={selectedNews.length === filteredNews.length && filteredNews.length > 0}
                          onChange={handleSelectAll}
                          className="rounded"
                        />
                      </th>
                      <th className="text-left p-4">Title</th>
                      <th className="text-left p-4">Category</th>
                      <th className="text-left p-4">Author</th>
                      <th className="text-left p-4">Date</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-left p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredNews.map(item => (
                      <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-4">
                          <input
                            type="checkbox"
                            checked={selectedNews.includes(item.id)}
                            onChange={() => handleSelectNews(item.id)}
                            className="rounded"
                          />
                        </td>
                        <td className="p-4 font-medium">{item.title}</td>
                        <td className="p-4">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                            {item.category}
                          </span>
                        </td>
                        <td className="p-4 text-gray-600">{item.author}</td>
                        <td className="p-4 text-gray-600">{item.date}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            item.status === 'published' 
                              ? 'bg-green-100 text-green-800'
                              : item.status === 'draft'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {item.status}
                          </span>
                          {item.imageUrl && (
                            <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded">
                              <i className="fas fa-image mr-1"></i> Has Image
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleEdit(item)}
                              className="text-blue-600 hover:text-blue-800"
                              title="Edit"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              onClick={() => resendToLiveAnnouncements(item)}
                              className="text-green-600 hover:text-green-800"
                              title="Send to Live Announcements"
                            >
                              <i className="fas fa-broadcast-tower"></i>
                            </button>
                            <button
                              onClick={() => removeFromLiveAnnouncements(item)}
                              className="text-orange-600 hover:text-orange-800"
                              title="Remove from Live Announcements"
                            >
                              <i className="fas fa-minus-circle"></i>
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-red-500 hover:text-red-700"
                              title="Delete"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                            <button
                              onClick={() => window.open('/', '_blank')}
                              className="text-purple-600 hover:text-purple-800"
                              title="View"
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <i className="fas fa-newspaper text-5xl text-gray-300 mb-4"></i>
                <h4 className="text-xl font-semibold text-gray-600 mb-2">
                  {searchTerm ? 'No news found' : 'No news published yet'}
                </h4>
                <p className="text-gray-500">
                  {searchTerm ? 'Try a different search term' : 'Use the form to publish your first news item'}
                </p>
              </div>
            )}
          </div>
        </main>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Confirm Delete</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete {selectedNews.length} selected news item(s)?
                This will also remove them from live announcements. This action cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBulkDelete}
                  className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Author Management Modal */}
        {showAuthorModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Manage Authors
              </h3>

              <div className="mb-6">
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="Enter new author name"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleAddAuthor}
                    className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition duration-300"
                  >
                    Add
                  </button>
                </div>

                <div className="max-h-60 overflow-y-auto">
                  <h4 className="font-semibold text-gray-700 mb-2">Current Authors:</h4>
                  <ul className="space-y-2">
                    {authors.map((author) => (
                      <li
                        key={author}
                        className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
                      >
                        <span className="text-gray-700">{author}</span>
                        {author !== 'Dr. Sarah Johnson' && (
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete "${author}"?`)) {
                                handleRemoveAuthor(author);
                              }
                            }}
                            className="text-red-500 hover:text-red-700 transition"
                          >
                            ❌
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setShowAuthorModal(false)}
                  className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DirectorPage;
