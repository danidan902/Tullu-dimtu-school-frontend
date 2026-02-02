import { useState } from 'react';
const NewsDetailModal = ({ news, isOpen, onClose }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  const getCategoryColor = (category) => {
    switch(category) {
      case 'Academic': return 'bg-gradient-to-r from-blue-500 to-blue-600';
      case 'Sports': return 'bg-gradient-to-r from-emerald-500 to-emerald-600';
      case 'Event': return 'bg-gradient-to-r from-purple-500 to-purple-600';
      case 'Announcement': return 'bg-gradient-to-r from-amber-500 to-amber-600';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-80 transition-opacity backdrop-blur-lg"
        onClick={onClose}
      >
        {/* Close button on backdrop */}
       
      </div>
      
      {/* Modal */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden transform transition-all duration-500 scale-95 opacity-0 animate-modal-in">
          {/* Modal header with gradient */}
          <div className={`relative h-2 ${getCategoryColor(news.category)}`}></div>
          
          <div className="overflow-y-auto max-h-[88vh]">
            {/* Header */}
            <div className="p-8 md:p-10 bg-gradient-to-b from-white to-gray-50">
              <div className="flex flex-col lg:flex-row lg:items-start gap-6 mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`inline-block ${getCategoryColor(news.category)} text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full shadow-lg`}>
                      {news.category}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                      BREAKING
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                    {news.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2">
                      <i className="far fa-calendar text-blue-500"></i>
                      <span className="font-semibold">{formatDate(news.date)}</span>
                    </div>
                    {news.author && (
                      <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2">
                        <i className="far fa-user text-purple-500"></i>
                        <span className="font-semibold">{news.author}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 md:p-10">
              {/* Featured image if available - Centered with fixed max dimensions */}
              {news.imageUrl && (
                <div className="mb-10 flex justify-center">
                  <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl shadow-2xl">
                    <img 
                      src={news.imageUrl} 
                      alt={news.title}
                      className="w-full h-auto max-h-[500px] object-contain"
                    />  
                    {/* Optional gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                  </div>  
                </div>    
              )}
              
              {/* News content */}
              <div className="mb-10">
                <div className="prose prose-lg max-w-none">
                  <p className="text-xl md:text-2xl text-gray-800 leading-relaxed mb-8 font-medium">
                    {news.content}
                  </p>
                  
                  {/* Extended content if available */}
                  {news.extendedContent && (
                    <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
                      {news.extendedContent.split('\n\n').map((paragraph, index) => (
                        <p key={index} className="mb-4">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Additional information */}
              {news.highlights && news.highlights.length > 0 && (
                <div className="mb-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200">
                  <h3 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-3">
                    <i className="fas fa-star text-yellow-500"></i>
                    Key Highlights
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {news.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-start gap-3 bg-white/70 rounded-xl p-4">
                        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
                          {index + 1}
                        </div>
                        <p className="text-gray-800">{highlight}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
                          
              {/* Tags if available */}
              {news.tags && news.tags.length > 0 && (
                <div className="mt-10 pt-10 border-t border-gray-200">
                  <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <i className="fas fa-tags text-gray-500"></i>
                    Related Topics
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {news.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-5 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300 font-semibold rounded-xl text-sm transition-all duration-300 hover:scale-105 shadow-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-8 md:p-10 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
              <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-4">
                  
                  <div>
                    <p className="font-bold text-gray-900 text-xl">Official News</p>
                    <p className="text-gray-600">Trusted Information Source Tulu dimtu School</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                {/* this name   */}
                     <button
          onClick={onClose}
          className="flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
        >
         Close
        </button>
                 
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes modalIn {
          0% {
            transform: scale(0.95);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-modal-in {
          animation: modalIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

const NewsCard = ({ news, isCompact = false }) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'Academic': return 'from-blue-500 to-blue-600';
      case 'Sports': return 'from-emerald-500 to-emerald-600';
      case 'Event': return 'from-purple-500 to-purple-600';
      case 'Announcement': return 'from-amber-500 to-amber-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    setIsDetailOpen(true);
  };

  // Get preview text (first 150 characters)
  const previewText = news.content.length > 150 
    ? news.content.substring(0, 150) + '...' 
    : news.content;

  // Fixed height class for compact mode
  const imageHeightClass = isCompact ? 'h-48' : 'h-64 md:h-72';

  return (
    <>
      <div 
        className={`relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group ${isCompact ? 'mb-6' : 'mb-8'}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleViewDetails}
      >
        {/* Elegant gradient border effect */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(news.category)} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
        
        {/* Image Section - If image exists */}
        {news.imageUrl && (
          <div className={`relative w-full ${imageHeightClass} overflow-hidden bg-gray-100`}>
            <div className="relative w-full h-full">
              <img 
                src={news.imageUrl} 
                alt={news.title}
                className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            {/* Gradient overlay on image */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
            {/* Category badge on image */}
            <div className="absolute top-4 left-4">
              <span className={`bg-gradient-to-r ${getCategoryColor(news.category)} text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full shadow-lg`}>
                {news.category}
              </span>
            </div>
            {/* View overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                <span className="text-gray-800 text-sm font-semibold flex items-center gap-2">
                  <i className="fas fa-expand-alt"></i>
                  View Image
                </span>
              </div>
            </div>
          </div>
        )}
        
        {/* Main content */}
        <div className={`relative ${news.imageUrl ? 'p-6' : 'p-8'}`}>
          {/* Category and date row - Only show if no image */}
          {!news.imageUrl && (
            <div className="flex items-center justify-between mb-6">
              <span className={`bg-gradient-to-r ${getCategoryColor(news.category)} text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full shadow-lg`}>
                {news.category}
              </span>
              <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                <i className="far fa-clock"></i>
                <span>{formatDate(news.date)}</span>
              </div>
            </div>
          )}
          
          {/* Title with hover effect */}
          <h3 className={`font-bold text-gray-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors duration-300 ${isCompact ? 'text-xl' : news.imageUrl ? 'text-xl md:text-2xl' : 'text-2xl'}`}>
            {news.title}
          </h3>
          
          {/* Date row for cards with images */}
          {news.imageUrl && (
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
              <i className="far fa-calendar"></i>
              <span>{formatDate(news.date)}</span>
              {news.author && (
                <>
                  <span className="text-gray-300 mx-2">•</span>
                  <i className="far fa-user"></i>
                  <span>{news.author}</span>
                </>
              )}
            </div>
          )}
          
          {/* Preview content with fade effect */}
          <div className="relative mb-6">
            <p className={`text-gray-600 leading-relaxed ${isCompact ? 'text-sm' : news.imageUrl ? 'text-sm md:text-base' : 'text-lg'} transition-all duration-300 ${isHovered ? 'opacity-80' : 'opacity-100'}`}>
              {previewText}
            </p>
            
            {/* Fade gradient overlay */}
            {news.content.length > 150 && (
              <div className={`absolute bottom-0 left-0 right-0 ${news.imageUrl ? 'h-8' : 'h-12'} bg-gradient-to-t from-white to-transparent pointer-events-none`}></div>
            )}
          </div>
          
          {/* Author and action section */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4">
              {/* Author avatar - Only show if no image or if author is specified */}
              {!news.imageUrl && news.author && (
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transform -rotate-6 scale-105 opacity-60"></div>
                    <div className="relative w-10 h-10 bg-white rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-md">
                        <i className="fas fa-user text-white text-sm"></i>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Author</p>
                    <p className="font-semibold text-gray-900 text-sm">{news.author}</p>
                  </div>
                </div>
              )}
              
              {/* Show author name only for cards with images */}
              {news.imageUrl && news.author && (
                <div className="text-gray-600 text-sm">
                  <i className="far fa-user mr-1"></i>
                  {news.author}
                </div>
              )}
            </div>
            
            {/* View Details button with animation */}
            <button 
              onClick={handleViewDetails}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${isHovered 
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform -translate-y-0.5' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>Read More</span>
              <i className={`fas fa-arrow-right text-xs transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}></i>
            </button>
          </div>
        </div>
        
        {/* Bottom accent bar with animation */}
        <div className={`h-1 bg-gradient-to-r ${getCategoryColor(news.category)} transform origin-left transition-transform duration-700 ${isHovered ? 'scale-x-100' : 'scale-x-0'}`}></div>
      </div>

      {/* News Detail Modal */}
      <NewsDetailModal 
        news={news}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </>
  );
};

export default NewsCard; 