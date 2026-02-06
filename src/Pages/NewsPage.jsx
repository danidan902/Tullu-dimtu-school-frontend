import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import NewsCard from '../components/NewsCard';
import Footer from '../components/Footer';
import { Helmet } from "react-helmet-async";
import axios from 'axios';

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Backend API URL - Change this to your actual backend URL
  const BACKEND_URL = 'https://tullu-dimtu-school-backend-1.onrender.com/api';

  useEffect(() => {
    const fetchNewsFromBackend = async () => {
      try {
        setLoading(true);
        console.log('Fetching news from:', `${BACKEND_URL}/posts`);
        
        const response = await axios.get(`${BACKEND_URL}/posts`);
        console.log('Backend response:', response.data);
        
        if (response.data.success) {
          // Transform backend data to match frontend structure
          const newsData = response.data.posts.map(post => ({
            id: post.newsId || post._id,
            title: post.title || 'No Title',
            content: post.content || 'No content available',
            category: post.category || 'Announcement',
            date: post.date || new Date(post.createdAt).toISOString().split('T')[0],
            author: post.author || 'School Administration',
            imageUrl: post.imageUrl || '',
            status: post.status || 'published',
            excerpt: post.excerpt,
            readTime: post.readTime || 0,
            views: post.views || 0,
            timestamp: post.timestamp || post.createdAt
          })).filter(post => post.status === 'published'); // Only show published posts
          
          // Sort by date (newest first)
          newsData.sort((a, b) => {
            const dateA = new Date(a.timestamp || a.date);
            const dateB = new Date(b.timestamp || b.date);
            return dateB - dateA;
          });
          
          console.log('Transformed news data:', newsData);
          setNews(newsData);
          
          if (newsData.length === 0) {
            setError('No news available. Check back later!');
          }
        } else {
          console.error('Backend returned error:', response.data);
          setError('Failed to load news. Please try again later.');
        }
      } catch (err) {
        console.error('Error fetching news from backend:', err);
        console.error('Error details:', err.response?.data || err.message);
        setError(`Failed to connect to server. Please check if backend is running at ${BACKEND_URL}`);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsFromBackend();
  }, []);

  const categories = ['All', 'Academic', 'Sports', 'Event', 'Announcement', 'Urgent', 'General'];

  const filteredNews = news.filter(item => {
    const matchesCategory = filter === 'All' || item.category === filter;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.author && item.author.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Function to retry fetching
  const retryFetch = () => {
    window.location.reload();
  };

  return (
    <>
      <Helmet>
        <title>Tulu Dimtu School News & Announcements</title>
      </Helmet>
        
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
        <div className="relative bg-gradient-to-r from-blue-800 to-blue-600 text-white py-28">
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="relative container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mt-16 mb-8">Tulu Dimtu School <span className='text-yellow-500'>News & Announcements</span></h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Stay updated with everything happening at Tulu Dimtu School
            </p>
          </div>
        </div>
      
        <Header isDirectorPage={false} />
      
        <main className="container mx-auto px-4 py-8">
          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600">Loading news ...</p>
              {/* <p className="text-gray-400 text-sm mt-2">Fetching from: {BACKEND_URL}</p> */}
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 mb-8 text-center max-w-2xl mx-auto">
              <i className="fas fa-exclamation-triangle text-yellow-500 text-4xl mb-4"></i>
              <h3 className="text-xl font-semibold text-yellow-800 mb-2">Could not load news</h3>
              <p className="text-yellow-700 mb-6">{error}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={retryFetch}
                  className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition duration-300"
                >
                  <i className="fas fa-redo mr-2"></i> Retry
                </button>
                <button 
                  onClick={() => setError(null)}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition duration-300"
                >
                  Continue Anyway
                </button>
              </div>
              <div className="mt-6 text-sm text-gray-500">
               
              </div>
            </div>
          )}

          {/* Search and Filter (only show if not loading and no critical error) */}
          {!loading && !error && (
            <>
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="w-full md:w-1/2">
                    <div className="relative">
                      <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                      <input
                        type="text"
                        placeholder="Search news by title, content, or author..."
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 justify-center md:justify-end">
                    {categories.map(category => (
                      <button
                        key={category}
                        className={`px-4 py-2 rounded-lg font-medium transition duration-300 ${
                          filter === category 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                        onClick={() => setFilter(category)}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Stats */}
                <div className="mt-4 flex justify-between items-center text-gray-600 text-sm">
                  <div>
                    {/* Showing <span className="font-semibold"></span> of <span className="font-semibold">{news.length}</span> news items
                    {filter !== 'All' && <span> in <span className="font-semibold">{filter}</span></span>}
                    {searchTerm && <span> matching "<span className="font-semibold">{searchTerm}</span>"</span>} */}
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-database text-blue-500"></i>
                   
                  </div>
                </div>
              </div>

              {/* News Grid */}
              {filteredNews.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                  {filteredNews.map(item => (
                    <NewsCard key={item.id} news={item} />
                  ))}
                </div>
              ) : news.length > 0 ? (
                <div className="text-center py-12">
                  <i className="fas fa-search text-6xl text-gray-300 mb-4"></i>
                  <h3 className="text-2xl font-semibold text-gray-600 mb-2">No matching news found</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilter('All');
                    }}
                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition duration-300"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="text-center py-12">
                  <i className="fas fa-newspaper text-6xl text-gray-300 mb-4"></i>
                  <h3 className="text-2xl font-semibold text-gray-600 mb-2">No news available yet</h3>
                  <p className="text-gray-500 mb-4">Check back later for announcements and updates</p>
                  <div className="max-w-md mx-auto bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">Want to add news?</h4>
                    <p className="text-blue-700 text-sm">
                      School administrators can add news through the Director's Portal.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Debug info - remove in production */}
         
        </main>

        <Footer />
      </div>
    </>
  );
};

export default NewsPage;