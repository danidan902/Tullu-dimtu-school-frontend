
import { FaChevronDown, FaChevronLeft, FaChevronRight, FaTrophy, FaChartLine, FaGraduationCap, FaUsers,  FaStar, FaMedal } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackgroundImageForSchool from '../assets/dir1.png'
import Images from '../assets/dir2.jpg'
import SchoolAchivment from '../assets/lab.png'
import SchoolsStudent from '../assets/lo.jpg' 
import Footer from '../components/Footer';
import { Helmet } from "react-helmet-async";
const SchoolAchievements = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  const achievements = [
    {
      year: "2024",
      title: "Top Performing School Students",
      description: "Our graduates achieved highest promotion rates from our region to prestigious universities",
      image: BackgroundImageForSchool,
      icon: <FaGraduationCap className="text-3xl" />,
      color: "from-blue-600 to-indigo-600"
    },
    {
      year: "2023",
      title: "STEM Innovation Award",
      description: "Recognized for pioneering science and technology programs that inspire young innovators",
      image: SchoolAchivment,
      icon: <FaChartLine className="text-3xl" />,
      color: "from-emerald-600 to-green-600"
    },
    {
      year: "2022",
      title: "Regional Academic Excellence",
      description: "Ranked #1 in comprehensive academic performance across all regional assessments",
      image: SchoolsStudent,
      icon: <FaTrophy className="text-3xl" />,
      color: "from-amber-600 to-orange-600"
    },
    {
      year: "2021",
      title: "Community Service Honors",
      description: "Awarded for outstanding student-led initiatives that positively impact our community",
      image: Images,
      icon: <FaUsers className="text-3xl" />,
      color: "from-purple-600 to-pink-600"
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === achievements.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? achievements.length - 1 : prev - 1));
  };

  return (
    <>
<Helmet>
     <title>School Achivment </title>
     </Helmet>

      {/* Hero Section */}
      <div className="relative   pt-20 pb-80">
        <div className="absolute inset-0 ">
          <div className="absolute inset-0" style={{
            backgroundImage: `url(${BackgroundImageForSchool})`,
            // backgroundSize: '60px 60px'
          }}></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-blue-500/80 via-blue-500/40 to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
           
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 mt-24 ">
              Celebrating <span className="bg-gradient-to-r from-yellow-300 to-amber-300 bg-clip-text text-transparent">Excellence</span>
            </h1>
            
            <p className="text-xl text-white/80 md:text-2xl max-w-3xl mx-auto mb-10">
              Our journey of academic distinction, innovative programs, and outstanding student achievements
            </p>
            
            <div className="w-40 h-1 bg-gradient-to-r from-yellow-400 to-amber-400 mx-auto rounded-full mb-12"></div>
            
            <div className="animate-bounce mt-8">
              <FaChevronDown className="text-white/50 text-2xl mx-auto" />
            </div>
          </motion.div>
        </div>        
      </div>

      {/* Achievements Carousel */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="inline-block"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Our <span className="relative">
                  <span className="relative z-10">Proud Moments</span>
                  <span className="absolute bottom-0 left-0 w-full h-3 bg-yellow-200/40 -z-10"></span>
                </span>
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full"></div>
            </motion.div>
          </div>

          <div className="relative max-w-6xl mx-auto">
          
            <button 
              onClick={prevSlide}
              onMouseEnter={() => setIsAutoPlaying(false)}
              className="absolute left-4 md:-left-6 top-1/2 transform -translate-y-1/2 z-20 bg-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-blue-50 border border-gray-100"
            >
              <FaChevronLeft className="text-gray-700 text-lg" />
            </button>
            
            <button 
              onClick={nextSlide}
              onMouseEnter={() => setIsAutoPlaying(false)}
              className="absolute right-4 md:-right-6 top-1/2 transform -translate-y-1/2 z-20 bg-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-blue-50 border border-gray-100"
            >
              <FaChevronRight className="text-gray-700 text-lg" />
            </button>

            {/* Achievement Slides */}
            <div className="overflow-hidden rounded-2xl shadow-2xl">
              <AnimatePresence mode='wait'>
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="relative h-[500px] md:h-[600px] bg-cover bg-center"
                  style={{ backgroundImage: `url(${achievements[activeIndex].image})` }}
                >
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${achievements[activeIndex].color}/90 via-transparent to-transparent`}></div>
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
                    <div className="max-w-3xl mx-auto">
                      <div className="flex items-center mb-6">
                        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl mr-4">
                          {achievements[activeIndex].icon}
                        </div>
                        <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                          {achievements[activeIndex].year}
                        </span>
                      </div>
                      
                      <h3 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                        {achievements[activeIndex].title}
                      </h3>
                      
                      <p className="text-xl text-white/90 max-w-2xl">
                        {achievements[activeIndex].description}
                      </p>
                      
                      {/* Progress Indicator */}
                      <div className="mt-8">
                        <div className="h-1 bg-white/30 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 5, ease: "linear" }}
                            className="h-full bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Thumbnail Indicators */}
            <div className="flex justify-center mt-8 space-x-3">
              {achievements.map((achievement, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setActiveIndex(index);
                    setIsAutoPlaying(false);
                  }}
                  className="relative group"
                >
                  <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    activeIndex === index 
                      ? 'bg-blue-600 scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`} />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    {achievement.year} - {achievement.title}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Stats Bar - Enhanced */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-20 bg-gradient-to-r from-white to-gray-50 rounded-2xl shadow-xl p-8 border border-gray-100"
          >
            <div className="text-center mb-10">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Our Legacy in Numbers</h3>
              <p className="text-gray-600">Years of dedicated service and remarkable achievements</p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { 
                  value: "25+", 
                  label: "Years of Excellence",
                  icon: <FaStar className="text-2xl text-amber-500" />,
                  gradient: "from-amber-50 to-yellow-50"
                },
                { 
                  value: "1500+", 
                  label: "Successful Graduates",
                  icon: <FaGraduationCap className="text-2xl text-blue-500" />,
                  gradient: "from-blue-50 to-cyan-50"
                },
                { 
                  value: "50+", 
                  label: "Qualified Teachers",
                  icon: <FaUsers className="text-2xl text-emerald-500" />,
                  gradient: "from-emerald-50 to-green-50"
                },
                { 
                  value: "98%", 
                  label: "Satisfaction Rate",
                  icon: <FaMedal className="text-2xl text-purple-500" />,
                  gradient: "from-purple-50 to-pink-50"
                }
              ].map((stat, index) => (
                <div 
                  key={index} 
                  className={`bg-gradient-to-br ${stat.gradient} p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow duration-300 text-center`}
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-white rounded-full shadow-sm mb-4">
                    {stat.icon}
                  </div>
                  <p className="text-5xl font-bold text-gray-900 mb-2">{stat.value}</p>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Additional Awards Section */}
      <section className="py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Additional <span className="text-blue-600">Honors & Awards</span>
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Recognition for our commitment to educational excellence and community service
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { year: "2020", title: "Best School Infrastructure", category: "Facilities" },
              { year: "2019", title: "Environmental Leadership", category: "Sustainability" },
              { year: "2018", title: "Sports Excellence", category: "Athletics" }
            ].map((award, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    {award.year}
                  </span>
                  <span className="text-sm text-gray-500">{award.category}</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{award.title}</h4>
                <p className="text-gray-600">
                  Recognized for outstanding contributions and achievements in this category
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default SchoolAchievements;