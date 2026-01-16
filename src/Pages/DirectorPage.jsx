
import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import NewsCard from '../components/NewsCard';
import axios from 'axios';
import { Home } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import logo from '../assets/tullulogo.png'
import { Helmet } from "react-helmet-async";

const DirectorPage = () => {
  const [news, setNews] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Announcement',
    author: '',
    image: null,
    imagePreview: ''
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

  useEffect(() => {
    const savedNews = localStorage.getItem('schoolNews');
    const savedAuthors = localStorage.getItem('newsAuthors');
    
    if (savedNews) {
      const parsedNews = JSON.parse(savedNews);
      setNews(parsedNews);
      updateStats(parsedNews);
    }
    
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
  }, []);

  // NEW: Function to handle image upload
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

  // NEW: Function to remove uploaded image
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

  // NEW: Function to convert image to base64 for storage
  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  // Function to publish to Live Announcements
  const publishToLiveAnnouncements = async (newsItem) => {
    try {
      console.log('📤 Publishing to live announcements:', newsItem.title);
      
      let priority = 'normal';
      if (newsItem.category === 'Urgent') priority = 'high';
      if (newsItem.category === 'Academic') priority = 'medium';

      const response = await axios.post('http://localhost:5000/api/announcements', {
        title: newsItem.title,
        message: newsItem.content,
        priority: priority,
        from: newsItem.author,
        category: newsItem.category,
        newsId: newsItem.id,
        date: newsItem.date,
        timestamp: newsItem.timestamp || Date.now(),
        imageUrl: newsItem.imageUrl // Add image URL to live announcement
      });

      console.log('✅ Live announcement published successfully:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Failed to publish live announcement:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || error.message 
      };
    }
  };

  // Function to delete from Live Announcements
  const deleteFromLiveAnnouncements = async (newsItem) => {
    try {
      console.log('🗑️ Attempting to delete from live announcements:', newsItem.title);
      
      const searchResponse = await axios.get(`http://localhost:5000/api/announcements?newsId=${newsItem.id}`);
      
      if (searchResponse.data && searchResponse.data.length > 0) {
        const deletePromises = searchResponse.data.map(async (announcement) => {
          try {
            await axios.delete(`http://localhost:5000/api/announcements/${announcement._id}`);
            console.log(`✅ Deleted announcement: ${announcement.title}`);
            return { success: true, announcementId: announcement._id };
          } catch (deleteError) {
            console.error(`❌ Failed to delete announcement ${announcement._id}:`, deleteError);
            return { success: false, error: deleteError.message };
          }
        });
        
        const results = await Promise.all(deletePromises);
        const successCount = results.filter(r => r.success).length;
        const failCount = results.filter(r => !r.success).length;
        
        return { 
          success: true, 
          message: `Deleted ${successCount} announcement(s) from live feed${failCount > 0 ? `, ${failCount} failed` : ''}` 
        };
      } else {
        console.log('ℹ️ No matching announcements found in live feed');
        return { success: true, message: 'No matching announcements found in live feed' };
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
      categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
      authorCount[item.author] = (authorCount[item.author] || 0) + 1;
      
      const newsDate = new Date(item.date);
      const today = new Date();
      const diffTime = Math.abs(today - newsDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays <= 7) recentCount++;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim() || !formData.author) {
      setNotification('Please fill in all required fields');
      setTimeout(() => setNotification(''), 3000);
      return;
    }

    let imageUrl = '';
    // NEW: Convert image to base64 if exists
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

    const newNewsItem = {
      id: editingId || Date.now(),
      title: formData.title.trim(),
      content: formData.content.trim(),
      category: formData.category,
      author: formData.author,
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now(),
      status: 'published',
      imageUrl: imageUrl // Add image URL to news item
    };

    // Publish to Live Announcements FIRST
    const liveResult = await publishToLiveAnnouncements(newNewsItem);
    
    let updatedNews;
    let notificationMessage = '';
    
    if (editingId) {
      const oldNewsItem = news.find(item => item.id === editingId);
      if (oldNewsItem) {
        await deleteFromLiveAnnouncements(oldNewsItem);
      }
      
      updatedNews = news.map(item => 
        item.id === editingId ? newNewsItem : item
      );
      notificationMessage = 'News updated successfully!';
      
      await publishToLiveAnnouncements(newNewsItem);
    } else {
      updatedNews = [newNewsItem, ...news];
      
      if (liveResult.success) {
        notificationMessage = '✅ News published! Live announcement sent successfully.';
      } else {
        notificationMessage = '⚠️ News saved locally, but failed to send to live announcements.';
      }
    }

    // Update local state
    setNews(updatedNews);
    updateStats(updatedNews);
    localStorage.setItem('schoolNews', JSON.stringify(updatedNews));
    
    // Reset form
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
    
    // Show notification
    setNotification(notificationMessage);
    setTimeout(() => setNotification(''), 4000);
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
      
      const liveDeleteResult = await deleteFromLiveAnnouncements(newsItem);
      
      const updatedNews = news.filter(item => item.id !== id);
      setNews(updatedNews);
      updateStats(updatedNews);
      localStorage.setItem('schoolNews', JSON.stringify(updatedNews));
      
      let notificationMessage = 'News deleted successfully!';
      if (liveDeleteResult.success) {
        notificationMessage += ' ' + liveDeleteResult.message;
      } else {
        notificationMessage += ' (Could not delete from live announcements)';
      }
      
      setNotification(notificationMessage);
      setSelectedNews(selectedNews.filter(itemId => itemId !== id));
      setTimeout(() => setNotification(''), 3000);
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
    let liveDeleteResults = [];
    
    for (const item of itemsToDelete) {
      const result = await deleteFromLiveAnnouncements(item);
      liveDeleteResults.push(result);
    }
    
    const successCount = liveDeleteResults.filter(r => r.success).length;
    const failCount = liveDeleteResults.filter(r => !r.success).length;
    
    const updatedNews = news.filter(item => !selectedNews.includes(item.id));
    setNews(updatedNews);
    updateStats(updatedNews);
    localStorage.setItem('schoolNews', JSON.stringify(updatedNews));
    
    setSelectedNews([]);
    setShowDeleteModal(false);
    
    let notificationMessage = `${selectedNews.length} news items deleted successfully!`;
    if (successCount > 0) {
      notificationMessage += ` ${successCount} removed from live announcements.`;
    }
    if (failCount > 0) {
      notificationMessage += ` ${failCount} failed to remove from live announcements.`;
    }
    
    setNotification(notificationMessage);
    setTimeout(() => setNotification(''), 4000);
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

    let updatedNews = [...news];
    let message = '';
    
    switch (action) {
      case 'archive':
        updatedNews = updatedNews.map(item =>
          selectedNews.includes(item.id) ? { ...item, status: 'archived' } : item
        );
        message = 'News items archived';
        break;
      case 'publish':
        updatedNews = updatedNews.map(item =>
          selectedNews.includes(item.id) ? { ...item, status: 'published' } : item
        );
        message = 'News items published';
        break;
      case 'draft':
        updatedNews = updatedNews.map(item =>
          selectedNews.includes(item.id) ? { ...item, status: 'draft' } : item
        );
        message = 'News items moved to draft';
        break;
      case 'live':
        const selectedItems = filteredNews.filter(newsItem => selectedNews.includes(newsItem.id));
        let successCount = 0;
        let failCount = 0;
        
        for (const item of selectedItems) {
          const result = await publishToLiveAnnouncements(item);
          if (result.success) {
            successCount++;
          } else {
            failCount++;
          }
        }
        
        message = `Sent to live: ${successCount} success, ${failCount} failed`;
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

    if (action !== 'live' && action !== 'remove-from-live') {
      setNews(updatedNews);
      updateStats(updatedNews);
      localStorage.setItem('schoolNews', JSON.stringify(updatedNews));
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
      setNotification(`❌ Failed: "${newsItem.title}" - ${result.error}`);
    }
    setTimeout(() => setNotification(''), 4000);
  };

  const removeFromLiveAnnouncements = async (newsItem) => {
    const result = await deleteFromLiveAnnouncements(newsItem);
    if (result.success) {
      setNotification(`✅ "${newsItem.title}" removed from live announcements!`);
    } else {
      setNotification(`❌ Failed to remove: "${newsItem.title}" - ${result.error}`);
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
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (

   <>
   
   <Helmet>
     <title>Tullu Dimtu Secondary School</title>
        </Helmet>
   
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
       <div className="fixed top-2 left-2 right-2 z-10 md:top-4 md:left-4 md:right-auto">
              <button
                onClick={() => navigate('/')}
                className="flex items-center justify-center space-x-2 w-full md:w-auto px-3 py-2 md:px-4 md:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md text-sm md:text-base"
              >
                <Home className="w-4 h-4 md:w-5 md:h-5" />
                <span className="truncate">Back to Home Page</span>
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
              : notification.includes('❌') || notification.includes('⚠️')
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-school-blue"
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
                    className="flex-1 px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-school-blue"
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

              {/* NEW: Image Upload Section */}
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-school-blue"
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
                <i className="fas fa-lightbulb text-school-blue mr-2"></i>
                Publishing Tips
              </h4>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                  Keep titles clear and concise
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                  "Urgent" category will be highlighted in Live Announcements
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                  Use appropriate categories for better organization
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                  Add images to make your news more engaging
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                  Review content before publishing
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                  News will appear instantly in Live Announcements panel
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                  Deleting news here will also remove it from live announcements
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
                  <p className="text-2xl font-bold text-school-blue">{stats.total}</p>
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
                            className="bg-school-blue h-2 rounded-full"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-school-blue"
                />
                <i className="fas fa-search absolute right-3 top-3 text-gray-400"></i>
              </div>
              
              <select
                value={bulkAction}
                onChange={(e) => {
                  setBulkAction(e.target.value);
                  if (e.target.value) handleBulkAction(e.target.value);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-school-blue"
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
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-school-blue">
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
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-school-blue"
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