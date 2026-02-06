// Gallery.jsx - Modern Professional Gallery with Crazy Effects
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronLeft, ChevronRight, Download, Maximize2, Grid, Loader } from 'lucide-react';
import Footer from '../components/Footer';
import { Helmet } from "react-helmet-async";
import gal from '../assets/po1.jpg';
import pot from '../assets/po2.jpg';
import pot1 from '../assets/gal2.jpg';
import anim1 from '../assets/mekdes.jpg';
import anim2 from '../assets/gal.jpg';
import anim3 from '../assets/pot1.jpg';
import anim4 from '../assets/gal1.jpg';
import anim5 from '../assets/gal3.jpg';
import anim6 from '../assets/gal4.jpg';
import anim7 from '../assets/tech1.jpg';
import anim8 from '../assets/gal6.jpg';
import anim9 from '../assets/gal7.jpg';
import anim10 from '../assets/gal8.jpg';
import anim11 from '../assets/lab.png';
import anim12 from '../assets/hom1.jpg';
import anim13 from '../assets/gal11.jpg';
import anim14 from '../assets/hom2.jpg';
import anim15 from '../assets/gal13.jpg';
import anim16 from '../assets/lib.jpg';
import anim17 from '../assets/gal15.jpg';
import anim19 from '../assets/gal16.jpg';
import anim20 from '../assets/gal17.jpg';
import anim21 from '../assets/gal18.jpg';
import anim22 from '../assets/gal19.jpg';
import anim23 from '../assets/lib1.jpg';
import anim24 from '../assets/chem.jpg';
import anim25 from '../assets/ibs.jpg';
import anim26 from '../assets/gal20.jpg';
import anim27 from '../assets/gal21.jpg';
import anim28 from '../assets/gal22.jpg';
import anim29 from '../assets/gal23.jpg';
import anim30 from '../assets/gal24.jpg';
import anim31 from '../assets/gal25.jpg';
import anim32 from '../assets/poto.png';
import anim33 from '../assets/gal27.jpg';
import anim34 from '../assets/gal28.jpg';
import anim35 from '../assets/gal29.jpg';
import anim36 from '../assets/gal31.jpg';
import anim37 from '../assets/gal32.jpg';
import anim38 from '../assets/gal33.jpg';

import anim18 from '../assets/chem.png';
import schoolBgImage from '../assets/tul8.jpg';
import dir1 from '../assets/dir1.png'
import loc from '../assets/local.jpg'
import loc2 from '../assets/gala.jpg'
import anim40 from '../assets/pres.png'
const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [crazyMode, setCrazyMode] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const lightboxRef = useRef(null);
  const galleryRef = useRef(null);

  const galleryData = [
    {
      id: 4,
      title: "Library Reading Session",
      category: "academics",
      description: "Students engaged in reading activities",
      image: pot1,
      date: "2024-02-05",
      tags: ["library", "reading", "education"],
      color: "from-green-500 to-teal-500"
    },
    {
      id: 7,
      title: "Teacher's Day Celebration",
      category: "events",
      description: "Students honoring their teachers",
      image: anim14,
      date: "2023-09-05",
      tags: ["teachers", "celebration", "appreciation"],
      color: "from-pink-500 to-rose-500"
    },
    {
      id: 5,
      title: "Art Competition",
      category: "arts",
      description: "Student artwork display and competition",
      image: anim1,
      date: "2024-01-30",
      tags: ["art", "creativity", "painting"],
      color: "from-yellow-500 to-amber-500"
    },
      {
      id: 7,
      title: "Teacher's Day Celebration",
      category: "events",
      description: "Students honoring their teachers",
      image: dir1,
      date: "2023-09-05",
      tags: ["teachers", "celebration", "appreciation"],
      color: "from-pink-500 to-rose-500"
    },
    {
      id: 4,
      title: "Computer Lab Sessions",
      category: "academics",
      description: "Students learning computer skills",
      image: loc,
      date: "2024-02-10",
      tags: ["technology", "computers", "learning"],
      color: "from-cyan-500 to-blue-500"
    },
    {
      id: 8,
      title: "Student Life At School",
      category: "academics",
      description: "Students learning computer skills",
      image: loc2,
      date: "2024-02-10",
      tags: ["technology", "computers", "learning"],
      color: "from-cyan-500 to-blue-500"
    },
       {
      id: 7,
      title: "Student At School",
      category: "events",
      description: "Students honoring their teachers",
      image: anim40,
      date: "2023-09-05",
      tags: ["teachers", "celebration", "appreciation"],
      color: "from-pink-500 to-rose-500"
    },
    {
      id: 8,
      title: "Computer Lab Sessions",
      category: "academics",
      description: "Students learning computer skills",
      image: anim6,
      date: "2024-02-10",
      tags: ["technology", "computers", "learning"],
      color: "from-cyan-500 to-blue-500"
    },
    {
      id: 7,
      title: "Teacher's Day Celebration",
      category: "events",
      description: "Students honoring their teachers",
      image: anim12,
      date: "2023-09-05",
      tags: ["teachers", "celebration", "appreciation"],
      color: "from-pink-500 to-rose-500"
    },
    {
      id: 6,
      title: "School Infrastructure",
      category: "campus",
      description: "Modern classrooms and facilities",
      image: anim2,
      date: "2024-02-01",
      tags: ["infrastructure", "classrooms", "facilities"],
      color: "from-indigo-500 to-blue-500"
    },
    {
      id: 6,
      title: "School Infrastructure",
      category: "campus",
      description: "Modern classrooms and facilities",
      image: anim8,
      date: "2024-02-01",
      tags: ["infrastructure", "classrooms", "facilities"],
      color: "from-indigo-500 to-blue-500"
    },  
    {
      id: 7,
      title: "Teacher's Day Celebration",
      category: "events",
      description: "Students honoring their teachers",
      image: anim11,
      date: "2023-09-05",
      tags: ["teachers", "celebration", "appreciation"],
      color: "from-pink-500 to-rose-500"
    },
    {
      id: 8,
      title: "Computer Lab Sessions",
      category: "academics",
      description: "Students learning computer skills",
      image: anim5,
      date: "2024-02-10",
      tags: ["technology", "computers", "learning"],
      color: "from-cyan-500 to-blue-500"
    },
   
    {
      id: 8,
      title: "Computer Lab Sessions",
      category: "academics",
      description: "Students learning computer skills",
      image: anim4,
      date: "2024-02-10",
      tags: ["technology", "computers", "learning"],
      color: "from-cyan-500 to-blue-500"
    },
    
    {
      id: 2,
      title: "Science Exhibition",
      category: "academics",
      description: "Students showcasing their science projects",
      image: gal,
      date: "2024-01-20",
      tags: ["science", "projects", "innovation"],
      color: "from-purple-500 to-pink-500"
    },
    {
      id: 2,
      title: "Science Exhibition",
      category: "academics",
      description: "Students showcasing their science projects",
      image: anim7,
      date: "2024-01-20",
      tags: ["science", "projects", "innovation"],
      color: "from-purple-500 to-pink-500"
    },
    // {
    //   id: 3,
    //   title: "Cultural Festival",
    //   category: "cultural",
    //   description: "Traditional dance performances by students",
    //   image: pot,
    //   date: "2023-12-10",
    //   tags: ["dance", "culture", "performance"],
    //   color: "from-orange-500 to-red-500"
    // },
    {
      id: 7,
      title: "Teacher's Day Celebration",
      category: "events",
      description: "Students honoring their teachers",
      image: anim3,
      date: "2023-09-05",
      tags: ["teachers", "celebration", "appreciation"],
      color: "from-pink-500 to-rose-500"
    },
    {
      id: 7,
      title: "Teacher's Day Celebration",
      category: "events",
      description: "Students honoring their teachers",
      image: anim18,
      date: "2023-09-05",
      tags: ["teachers", "celebration", "appreciation"],
      color: "from-pink-500 to-rose-500"
    },
    {
      id: 7,
      title: "Teacher's Day Celebration",
      category: "events",
      description: "Students honoring their teachers",
      image: anim10,
      date: "2023-09-05",
      tags: ["teachers", "celebration", "appreciation"],
      color: "from-pink-500 to-rose-500"
    },
    // {
    //   id: 7,
    //   title: "Teacher's Day Celebration",
    //   category: "events",
    //   description: "Students honoring their teachers",
    //   image: anim11,
    //   date: "2023-09-05",
    //   tags: ["teachers", "celebration", "appreciation"],
    //   color: "from-pink-500 to-rose-500"
    // },
    {
      id: 7,
      title: "Teacher's Day Celebration",
      category: "events",
      description: "Students honoring their teachers",
      image: anim13,
      date: "2023-09-05",
      tags: ["teachers", "celebration", "appreciation"],
      color: "from-pink-500 to-rose-500"
    },
    {
      id: 7,
      title: "Teacher's Day Celebration",
      category: "events",
      description: "Students honoring their teachers",
      image: anim15,
      date: "2023-09-05",
      tags: ["teachers", "celebration", "appreciation"],
      color: "from-pink-500 to-rose-500"
    },
    {
      id: 7,
      title: "Teacher's Day Celebration",
      category: "events",
      description: "Students honoring their teachers",
      image: anim16,
      date: "2023-09-05",
      tags: ["teachers", "celebration", "appreciation"],
      color: "from-pink-500 to-rose-500"
    },
      {
      id: 7,
      title: "Teacher's Day Celebration",
      category: "events",
      description: "Students honoring their teachers",
      image: anim17,
      date: "2023-09-05",
      tags: ["teachers", "celebration", "appreciation"],
      color: "from-pink-500 to-rose-500"
    },
     {
      id: 7,
      title: "Teacher's Day Celebration",
      category: "events",
      description: "Students honoring their teachers",
      image: anim19,
      date: "2023-09-05",
      tags: ["teachers", "celebration", "appreciation"],
      color: "from-pink-500 to-rose-500"
    },
    {
      id: 7,
      title: "Teacher's Day Celebration",
      category: "events",
      description: "Students honoring their teachers",
      image: anim20,
      date: "2023-09-05",
      tags: ["teachers", "celebration", "appreciation"],
      color: "from-pink-500 to-rose-500"
    },
     {
      id: 7,
      title: "Teacher's Day Celebration",
      category: "events",
      description: "Students honoring their teachers",
      image: anim21,
      date: "2023-09-05",
      tags: ["teachers", "celebration", "appreciation"],
      color: "from-pink-500 to-rose-500"
    },
       {
      id: 7,
      title: "Teacher's Day Celebration",
      category: "events",
      description: "Students honoring their teachers",
      image: anim22,
      date: "2023-09-05",
      tags: ["teachers", "celebration", "appreciation"],
      color: "from-pink-500 to-rose-500"
    },
       {
      id: 7,
      title: "Teacher's Day Celebration",
      category: "events",
      description: "Students honoring their teachers",
      image: anim23,
      date: "2023-09-05",
      tags: ["teachers", "celebration", "appreciation"],
      color: "from-pink-500 to-rose-500"
    },
     {
      id: 7,
      title: "Teacher's Day Celebration",
      category: "events",
      description: "Students honoring their teachers",
      image: anim24,
      date: "2023-09-05",
      tags: ["teachers", "celebration", "appreciation"],
      color: "from-pink-500 to-rose-500"
    },
   
     {
      id: 7,
      title: "Teacher's Day Celebration",
      category: "events",
      description: "Students honoring their teachers",
      image: anim25,
      date: "2023-09-05",
      tags: ["teachers", "celebration", "appreciation"],
      color: "from-pink-500 to-rose-500"
    },
     {
      id: 7,
      title: "Teacher's Day Celebration",
      category: "events",
      description: "Students honoring their teachers",
      image: anim26,
      date: "2023-09-05",
      tags: ["teachers", "celebration", "appreciation"],
      color: "from-pink-500 to-rose-500"
    },
    {
      id: 7,
      title: "Teacher's Day Celebration",
      category: "events",
      description: "Students honoring their teachers",
      image: anim27,
      date: "2023-09-05",
      tags: ["teachers", "celebration", "appreciation"],
      color: "from-pink-500 to-rose-500"
    },
    {
      id: 7,
      title: "Teacher's Day Celebration",
      category: "events",
      description: "Students honoring their teachers",
      image: anim28,
      date: "2023-09-05",
      tags: ["teachers", "celebration", "appreciation"],
      color: "from-pink-500 to-rose-500"
    },
    {
      id: 7,
      title: "Teacher's Day Celebration",
      category: "events",
      description: "Students honoring their teachers",
      image: anim29,
      date: "2023-09-05",
      tags: ["teachers", "celebration", "appreciation"],
      color: "from-pink-500 to-rose-500"
    },
      {
      id: 7,
      title: "Teacher's Day Celebration",
      category: "events",
      description: "Students honoring their teachers",
      image: anim30,
      date: "2023-09-05",
      tags: ["teachers", "celebration", "appreciation"],
      color: "from-pink-500 to-rose-500"
    },
      {
      id: 7,
      title: "Teacher's Day Celebration",
      category: "events",
      description: "Students honoring their teachers",
      image: anim31,
      date: "2023-09-05",
      tags: ["teachers", "celebration", "appreciation"],
      color: "from-pink-500 to-rose-500"
    },
      {
      id: 7,
      title: "Teacher's Day Celebration",
      category: "events",
      description: "Students honoring their teachers",
      image: anim32,
      date: "2023-09-05",
      tags: ["teachers", "celebration", "appreciation"],
      color: "from-pink-500 to-rose-500"
    },
       {
      id: 7,
      title: "Teacher's Day Celebration",
      category: "events",
      description: "Students honoring their teachers",
      image: anim33,
      date: "2023-09-05",
      tags: ["teachers", "celebration", "appreciation"],
      color: "from-pink-500 to-rose-500"
    },
     {
      id: 7,
      title: "Teacher's Day Celebration",
      category: "events",
      description: "Students honoring their teachers",
      image: anim34,
      date: "2023-09-05",
      tags: ["teachers", "celebration", "appreciation"],
      color: "from-pink-500 to-rose-500"
    },
    {
      id: 7,
      title: "Teacher's Day Celebration",
      category: "events",
      description: "Students honoring their teachers",
      image: anim35,
      date: "2023-09-05",
      tags: ["teachers", "celebration", "appreciation"],
      color: "from-pink-500 to-rose-500"
    },
     {
      id: 7,
      title: "Teacher's Day Celebration",
      category: "events",
      description: "Students honoring their teachers",
      image: anim36,
      date: "2023-09-05",
      tags: ["teachers", "celebration", "appreciation"],
      color: "from-pink-500 to-rose-500"
    },
     {
      id: 7,
      title: "Teacher's Day Celebration",
      category: "events",
      description: "Students honoring their teachers",
      image: anim37,
      date: "2023-09-05",
      tags: ["teachers", "celebration", "appreciation"],
      color: "from-pink-500 to-rose-500"
    },
    {
      id: 7,
      title: "Teacher's Day Celebration",
      category: "events",
      description: "Students honoring their teachers",
      image: anim38,
      date: "2023-09-05",
      tags: ["teachers", "celebration", "appreciation"],
      color: "from-pink-500 to-rose-500"
    },
  ];

  const categories = [
    { id: 'all', name: 'All', count: galleryData.length },
    { id: 'events', name: 'Events', count: galleryData.filter(img => img.category === 'events').length },
    { id: 'academics', name: 'Academics', count: galleryData.filter(img => img.category === 'academics').length },
    { id: 'cultural', name: 'Cultural', count: galleryData.filter(img => img.category === 'cultural').length },
    { id: 'arts', name: 'Arts', count: galleryData.filter(img => img.category === 'arts').length },
    { id: 'campus', name: 'Campus', count: galleryData.filter(img => img.category === 'campus').length }
  ];

  useEffect(() => {
    setTimeout(() => {
      setImages(galleryData);
      setIsLoading(false);
    }, 800);
  }, []);

  const filteredImages = images.filter(image => {
    const matchesCategory = selectedCategory === 'all' || image.category === selectedCategory;
    const matchesSearch = image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const openLightbox = (image) => {
    const imageIndex = filteredImages.findIndex(img => img.id === image.id);
    setCurrentImageIndex(imageIndex);
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  const navigateImage = (direction) => {
    if (!selectedImage || filteredImages.length === 0) return;
    
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentImageIndex + 1) % filteredImages.length;
    } else {
      newIndex = currentImageIndex - 1 < 0 ? filteredImages.length - 1 : currentImageIndex - 1;
    }
    
    setCurrentImageIndex(newIndex);
    setSelectedImage(filteredImages[newIndex]);
  };

  const downloadImage = async () => {
    if (!selectedImage) return;
    
    try {
      const response = await fetch(selectedImage.image);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `tullu-dimtu-${selectedImage.title.toLowerCase().replace(/\s+/g, '-')}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedImage) return;
      
      switch(e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          navigateImage('prev');
          break;
        case 'ArrowRight':
          navigateImage('next');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, currentImageIndex, filteredImages]);

  const getCardTransform = (index) => {
    if (!crazyMode || !hoveredCard) return '';
    
    const distance = Math.abs(index - hoveredCard);
    if (distance === 0) return 'scale(1.05)';
    if (distance === 1) return 'scale(1.02)';
    return '';
  };

  const getCardRotation = (index) => {
    if (!crazyMode) return '';
    return `rotate(${Math.sin(Date.now() / 1000 + index) * 3}deg)`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center">
          <Loader className="animate-spin mx-auto text-white mb-4" size={48} />
          <div className="text-white text-lg font-light">Loading Gallery...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title> Gallery - Tullu Dimtu</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
        {/* Header */}
        <div className="relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-fixed"
            style={{ backgroundImage: `url(${anim1})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
          </div>
          
          <div className="container mx-auto px-4 py-20 relative">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 mt-24 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
                Visual Journey
              </h1>
              <p className="text-xl text-white mb-52 font-light">
                Moments that define our legacy, captured in time
              </p>
              
              {/* Search Bar */}
             
            </div>
          </div>
        </div>

        {/* Gallery Controls */}
        <div className="container mx-auto px-4 mb-12">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            {/* Categories */}
                {/* Soft base gradient */}


            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-full transition-all duration-300 flex items-center gap-2 backdrop-blur-sm border ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-500/30 text-white shadow-lg shadow-cyan-500/20'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  {category.name}
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    selectedCategory === category.id
                      ? 'bg-cyan-500/30 text-white'
                      : 'bg-white/10 text-gray-400'
                  }`}>
                    {category.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Crazy Mode Toggle */}
            <button
              onClick={() => setCrazyMode(!crazyMode)}
              className={`px-6 py-3 rounded-full transition-all duration-300 flex items-center gap-2 ${
                crazyMode
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
              }`}
            >
              <Grid size={20} />
              {crazyMode ? 'Normal View' : 'Crazy Gallery'}
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="container mx-auto px-4 pb-20">
          <div className="flex justify-between items-center mb-8">
            {/* <div className="text-3xl font-light text-gray-300">
              {filteredImages.length} Moments
            </div> */}
            <div className="text-sm text-gray-400">
              {selectedCategory === 'all' ? 'All Collections' : 
               categories.find(c => c.id === selectedCategory)?.name}
            </div>
          </div>

          {filteredImages.length === 0 ? (
            <div className="text-center py-32">
              <div className="text-gray-500 mb-6">
                <Search size={80} className="mx-auto opacity-50" />
              </div>
              <h3 className="text-2xl font-light text-gray-400 mb-3">No moments found</h3>
              <p className="text-gray-500 max-w-md mx-auto">Try different search terms or categories</p>
            </div>
          ) : (
            <div 
              ref={galleryRef}
              className={`grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 transition-all duration-700 ${
                crazyMode ? 'opacity-90' : 'opacity-100'
              }`}
            >
              {filteredImages.map((image, index) => (
                <div
                  key={image.id}
                  className={`relative group overflow-hidden rounded-2xl transition-all duration-500 ${
                    crazyMode ? 'hover:z-50' : ''
                  }`}
                  style={{
                    transform: `${getCardTransform(index)} ${getCardRotation(index)}`,
                    transition: crazyMode ? 'all 0.3s ease' : 'all 0.5s ease'
                  }}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => openLightbox(image)}
                >
                  {/* Gradient Border */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${image.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
                  
                  {/* Image Container */}
                  <div className="relative h-[500px] overflow-hidden">
                    <img
                      src={image.image}
                      alt={image.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute bottom-0 left-0 right-0 p-8">
                        <h3 className="text-2xl font-bold mb-3">{image.title}</h3>
                        <p className="text-gray-300 mb-4 line-clamp-2">{image.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {image.tags.map((tag, tagIndex) => (
                            <span key={tagIndex} className="text-xs bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-400">{image.date}</span>
                          <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-sm">
                            {categories.find(c => c.id === image.category)?.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox - UPDATED FOR RESPONSIVENESS */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4">
          <div 
            className="absolute inset-0 bg-black/95 backdrop-blur-sm"
            onClick={closeLightbox}
          ></div>
          
          <div 
            ref={lightboxRef}
            className="relative z-10 w-full max-w-7xl h-full max-h-[90vh] md:max-h-[85vh] overflow-hidden rounded-none md:rounded-2xl"
          >
            {/* Navigation Arrows - Mobile Friendly */}
            {filteredImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage('prev');
                  }}
                  className="absolute left-2 md:left-6 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 md:p-4 rounded-full backdrop-blur-lg transition-all duration-300 hover:scale-110 z-20"
                >
                  <ChevronLeft size={24} className="md:w-8 md:h-8" />
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage('next');
                  }}
                  className="absolute right-2 md:right-6 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 md:p-4 rounded-full backdrop-blur-lg transition-all duration-300 hover:scale-110 z-20"
                >
                  <ChevronRight size={24} className="md:w-8 md:h-8" />
                </button>
              </>
            )}

            {/* Close Button - Mobile Friendly */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 md:top-6 md:right-6 bg-black/50 hover:bg-black/70 text-white p-2 md:p-3 rounded-full backdrop-blur-lg transition-all duration-300 hover:scale-110 z-20"
            >
              <X size={20} className="md:w-6 md:h-6" />
            </button>

            {/* IMAGE DISPLAY SECTION - FIXED FOR RESPONSIVENESS */}
            <div className="relative h-[calc(100%-200px)] md:h-[calc(100%-180px)] flex items-center justify-center bg-black">
              <div className="relative w-full h-full flex items-center justify-center p-2 md:p-4">
                <img
                  src={selectedImage.image}
                  alt={selectedImage.title}
                  className="max-h-full max-w-full object-contain"
                  style={{
                    width: 'auto',
                    height: 'auto',
                    maxWidth: '100%',
                    maxHeight: '100%'
                  }}
                />
              </div>
            </div>

            {/* Bottom Panel - Mobile Optimized */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent p-4 md:p-8">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 md:gap-6">
                <div className="flex-1">
                  <h2 className="text-xl md:text-3xl font-bold mb-2">{selectedImage.title}</h2>
                  <p className="text-sm md:text-base text-gray-300 mb-3 md:mb-4">{selectedImage.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedImage.tags.map((tag, index) => (
                      <span key={index} className="text-xs md:text-sm px-2 md:px-4 py-1 md:py-2 rounded-full bg-white/10 backdrop-blur-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 md:gap-4 mt-4 md:mt-0">
                  <button
                    onClick={downloadImage}
                    className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-full flex items-center gap-1 md:gap-2 transition-all duration-300 hover:scale-105 text-sm md:text-base"
                  >
                    <Download size={16} className="md:w-5 md:h-5" />
                    <span className="hidden sm:inline">Download</span>
                  </button>
                  <button
                    onClick={() => window.open(selectedImage.image, '_blank')}
                    className="px-4 md:px-6 py-2 md:py-3 bg-white/10 hover:bg-white/20 rounded-full flex items-center gap-1 md:gap-2 backdrop-blur-sm transition-all duration-300 text-sm md:text-base"
                  >
                    <Maximize2 size={16} className="md:w-5 md:h-5" />
                    <span className="hidden sm:inline">Fullscreen</span>
                  </button>
                </div>
              </div>
              
              {/* Image Counter - Mobile Optimized */}
              {filteredImages.length > 1 && (
                <div className="text-center mt-4 md:mt-6">
                  <div className="inline-flex items-center gap-3 md:gap-4 px-4 md:px-6 py-2 bg-black/50 rounded-full backdrop-blur-sm">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateImage('prev');
                      }}
                      className="hover:text-cyan-400 transition-colors"
                    >
                      <ChevronLeft size={20} className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                    <span className="text-base md:text-lg font-medium">
                      {currentImageIndex + 1} / {filteredImages.length}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateImage('next');
                      }}
                      className="hover:text-cyan-400 transition-colors"
                    >
                      <ChevronRight size={20} className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Gallery;