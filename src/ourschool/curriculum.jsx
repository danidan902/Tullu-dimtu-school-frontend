

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { FaBookOpen, FaFlask, FaCalculator, FaGlobeAfrica, FaHistory, FaLanguage, FaRunning, FaSearch, FaChevronRight, FaGraduationCap, FaChalkboardTeacher } from 'react-icons/fa';
import Footer from '../components/Footer';
import schoolBgImage from '../assets/tullu.png';
import { Helmet } from "react-helmet-async";
const CurriculumShowcase = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  // Enhanced parallax effects
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacityBg = useTransform(scrollYProgress, [0, 0.9], [1, 0]);
  const scaleBg = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPrograms, setFilteredPrograms] = useState([]);

  // Updated color palette with professional blue and black theme
  const programs = [
    {
      icon: <FaBookOpen className="text-3xl" />,
      title: "Languages",
      description: "Developing multilingual communication and literary analysis skills",
      color: "from-blue-600 to-blue-800",
      bgColor: "bg-blue-50",
      textColor: "text-blue-900",
      courses: ["English", "Amharic", "Local Language", "Literature", "Communication Skills"],
      gradient: "bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800"
    },
    {
      icon: <FaCalculator className="text-3xl" />,
      title: "Mathematics",
      description: "Building analytical thinking and quantitative problem-solving abilities",
      color: "from-indigo-600 to-indigo-800",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-900",
      courses: ["Algebra", "Geometry", "Statistics", "Calculus", "Applied Mathematics"],
      gradient: "bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800"
    },
    {
      icon: <FaFlask className="text-3xl" />,
      title: "Natural Sciences",
      description: "Scientific inquiry and understanding of natural phenomena",
      color: "from-cyan-600 to-cyan-800",
      bgColor: "bg-cyan-50",
      textColor: "text-cyan-900",
      courses: ["Physics", "Chemistry", "Biology", "Environmental Science", "Laboratory Practice"],
      gradient: "bg-gradient-to-br from-cyan-600 via-cyan-700 to-cyan-800"
    },
    {
      icon: <FaGlobeAfrica className="text-3xl" />,
      title: "Social Sciences",
      description: "Critical analysis of society, economy, and governance",
      color: "from-slate-600 to-slate-800",
      bgColor: "bg-slate-50",
      textColor: "text-slate-900",
      courses: ["Geography", "Economics", "Civics", "Ethical Education", "Social Studies"],
      gradient: "bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800"
    },
    {
      icon: <FaHistory className="text-3xl" />,
      title: "History & Culture",
      description: "Preserving heritage while embracing global perspectives",
      color: "from-blue-700 to-blue-900",
      bgColor: "bg-blue-100",
      textColor: "text-blue-900",
      courses: ["Ethiopian History", "World History", "Cultural Studies", "Heritage Conservation"],
      gradient: "bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900"
    },
    {
      icon: <FaRunning className="text-3xl" />,
      title: "Physical Education",
      description: "Holistic health, fitness, and sports development",
      color: "from-teal-600 to-teal-800",
      bgColor: "bg-teal-50",
      textColor: "text-teal-900",
      courses: ["Sports", "Health Education", "Fitness Training", "Recreational Activities"],
      gradient: "bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800"
    }
  ];

  const specialPrograms = [
    { name: "National Exam Preparation", icon: <FaGraduationCap /> },
    { name: "ICT Skills Development", icon: <FaChalkboardTeacher /> },
    { name: "Entrepreneurship Training", icon: <FaChalkboardTeacher /> },
    { name: "Agricultural Science Program", icon: <FaChalkboardTeacher /> },
    { name: "Traditional Arts Preservation", icon: <FaChalkboardTeacher /> },
    { name: "Community Service Initiatives", icon: <FaChalkboardTeacher /> }
  ];

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (!term.trim()) {
      setFilteredPrograms([]);
      return;
    }

    const results = programs.map(program => ({
      ...program,
      courses: program.courses.filter(course => 
        course.toLowerCase().includes(term)
      )
    })).filter(program => program.courses.length > 0);

    setFilteredPrograms(results);
  };

  return (
    <>
   
      <Helmet>
        <title>Curriculum | Tullu Dimtu Secondary School</title>
        </Helmet>

      <div className="  overflow-hidden" ref={ref}>
        {/* Enhanced Animated Header with professional blue gradient */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative h-[70vh] min-h-[600px] overflow-hidden"
        >
          {/* Background with professional blue gradient and parallax */}
          <motion.div 
            style={{ y: yBg, opacity: opacityBg, scale: scaleBg }}
            className="absolute inset-0 bg-gradient-to-r from-[#04395E] to-[#04395E]/85 "
          > 
            {/* Subtle geometric pattern overlay */}
            <div className="absolute inset-0 opacity-10 ">
              <div className="absolute inset-0" style=
              {{ backgroundImage: `url(${schoolBgImage})` }} 
              ></div>
            </div>
            
            {/* Additional gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
          </motion.div>

          {/* Floating particles animation */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/20 rounded-full"
                initial={{ y: -100, x: Math.random() * 100 }}
                animate={{ 
                  y: window.innerHeight + 100,
                  x: Math.random() * 100 - 50
                }}
                transition={{
                  duration: 15 + Math.random() * 10,
                  repeat: Infinity,
                  delay: Math.random() * 5
                }}
              />
            ))}
          </div>

          {/* Header Content */}
          <div className="relative z-10 h-full flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 1,
                ease: [0.6, 0.05, 0.01, 0.9]
              }}
              className="text-center max-w-6xl mx-auto"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100px" }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="h-0.5 bg-gradient-to-r from-transparent via-blue-300 to-transparent mx-auto mb-8"
              />
              
              <h2 className="text-lg font-medium text-blue-200 tracking-wider mb-4 uppercase">
                Tullu Dimtu Secondary School
              </h2>
              
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-300">
                  Curriculum
                </span>
                <br />
                <span className="text-3xl md:text-5xl font-light text-blue-100">
                  Excellence Program
                </span>
              </h1>
              
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="w-48 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 mx-auto mb-8 rounded-full origin-left"
              />
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-xl text-blue-100/90 max-w-3xl mx-auto leading-relaxed"
              >
                Ministry of Education approved curriculum for grades 9-12, 
                designed to foster academic excellence and holistic development
              </motion.p>
            </motion.div>
          </div>

          {/* Scroll indicator */}
         
        </motion.div>

        {/* Enhanced Search Bar */}
        <div className="relative z-20 -mt-12">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search subjects, courses, or programs..."
                  className="w-full py-4 px-6 pr-12 rounded-2xl border-2 border-gray-200 bg-white/95 backdrop-blur-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 shadow-xl text-gray-900 placeholder-gray-500"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <FaSearch className="absolute right-6 top-1/2 transform -translate-y-1/2 text-blue-600 group-focus-within:text-blue-700 transition-colors" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-focus-within:opacity-10 blur transition-opacity duration-300 -z-10"></div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <section className="relative z-20 py-24 bg-gradient-to-b from-white via-gray-50 to-white">
          <div className="container mx-auto px-6">
            {/* Search Results Header */}
            {filteredPrograms.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 text-center"
              >
                <h3 className="text-2xl font-semibold text-gray-900">
                  Showing results for: <span className="text-blue-600 font-bold">"{searchTerm}"</span>
                </h3>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setFilteredPrograms([]);
                  }}
                  className="mt-3 inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  <span>Clear search</span>
                  <FaChevronRight className="rotate-90" />
                </button>
              </motion.div>
            )}

            {/* Program Cards */}
            <div className="mb-20">
              <motion.h2
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-4xl font-bold text-gray-900 mb-4 text-center"
              >
                Core <span className="text-blue-600">Tulu Dimtu School</span> Programs
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="text-gray-700 text-center mb-12 max-w-2xl mx-auto"
              >
                Comprehensive curriculum designed to meet national standards and prepare students for future success
              </motion.p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(filteredPrograms.length > 0 ? filteredPrograms : programs).map((program, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: 60, opacity: 0, scale: 0.95 }}
                    whileInView={{ y: 0, opacity: 1, scale: 1 }}
                    transition={{ 
                      delay: index * 0.1, 
                      duration: 0.6,
                      ease: "backOut"
                    }}
                    viewport={{ once: true, margin: "-50px" }}
                    whileHover={{ 
                      y: -8,
                      transition: { duration: 0.2 }
                    }}
                    className="group relative"
                  >
                    {/* Card glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-300 opacity-0 group-hover:opacity-100 blur-xl"></div>
                    
                    <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200 group-hover:border-blue-200 transition-all duration-300">
                      {/* Gradient header */}
                      <div className={`${program.gradient} h-2 w-full`}></div>
                      
                      <div className="p-8">
                        <div className="flex items-start justify-between mb-6">
                          <div className={`p-3 rounded-xl ${program.bgColor} ${program.textColor} shadow-sm`}>
                            {program.icon}
                          </div>
                          <motion.span 
                            initial={{ x: -20, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 + 0.3 }}
                            className="text-sm font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-800"
                          >
                            {program.courses.length} subjects
                          </motion.span>
                        </div>
                        
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">{program.title}</h3>
                        <p className="text-gray-700 mb-6 leading-relaxed">{program.description}</p>
                        
                        <div className="pt-6 border-t border-gray-200">
                          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            Course Subjects
                          </h4>
                          <ul className="space-y-3">
                            {program.courses.map((course, i) => (
                              <motion.li
                                key={i}
                                initial={{ x: -10, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex items-center text-gray-800 group/item"
                              >
                                <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center mr-3 group-hover/item:bg-blue-100 transition-colors">
                                  <FaChevronRight className="text-xs text-blue-400 group-hover/item:text-blue-600" />
                                </div>
                                {course}
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Special Programs Section */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-20"
            >
              <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-12">
                  <div className="flex flex-col lg:flex-row gap-12 items-center">
                    <div className="lg:w-1/2">
                      <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                        <span className="text-sm text-white/90">Special Initiatives</span>
                      </div>
                      
                      <h3 className="text-3xl font-bold text-white mb-6">
                        Beyond the <span className="text-blue-300">Curriculum</span>
                      </h3>
                      
                      <p className="text-blue-100 mb-8 leading-relaxed">
                        Supplementary programs designed to enhance student development and align with Ethiopia's educational vision for the 21st century.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {specialPrograms.map((item, i) => (
                          <motion.div
                            key={i}
                            initial={{ x: -20, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ x: 5 }}
                            className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                          >
                            <div className="text-blue-300 group-hover:scale-110 transition-transform">
                              {item.icon}
                            </div>
                            <span className="text-white font-medium">{item.name}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="lg:w-1/2">
                      <div className="relative">
                        {/* Animated statistic cards */}
                        <motion.div
                          initial={{ rotate: -2 }}
                          whileInView={{ rotate: 0 }}
                          transition={{ delay: 0.2 }}
                          className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-8 shadow-xl"
                        >
                          <div className="text-white">
                            <h4 className="text-xl font-bold mb-4">Academic Excellence</h4>
                            <div className="grid grid-cols-2 gap-6 mb-6">
                              <div className="text-center">
                                <div className="text-4xl font-bold mb-2">98%</div>
                                <div className="text-sm text-white/80">Pass Rate</div>
                              </div>
                              <div className="text-center">
                                <div className="text-4xl font-bold mb-2">100%</div>
                                <div className="text-sm text-white/80">Curriculum Coverage</div>
                              </div>
                            </div>
                            <p className="text-sm text-white/90 leading-relaxed">
                              Our curriculum meets all Ethiopian Ministry of Education standards while exceeding international benchmarks for comprehensive education.
                            </p>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Exam Preparation Section */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-blue-50 to-slate-100 rounded-2xl p-10 shadow-lg border border-blue-200"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-3">
                    National <span className="text-blue-700">Examination</span> Excellence
                  </h3>
                  <p className="text-gray-700">
                    Comprehensive preparation strategies for national assessments and university entrance
                  </p>
                </div>
                <div className="px-6 py-3 bg-blue-100 rounded-full text-blue-800 font-semibold">
                  Grade 9-12 Support
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl p-8 shadow-lg border border-blue-300"
                >
                  <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-800 px-4 py-2 rounded-full mb-6">
                    <FaGraduationCap />
                    <span className="font-medium">Grade 9-11 School Exam</span>
                  </div>
                  <ul className="space-y-4">
                    {[
                      "Comprehensive review of all core subjects",
                      "Weekly mock exam practice sessions",
                      "Individualized performance analysis",
                      "Stress management workshops",
                      "Time management strategies"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                        </div>
                        <span className="text-gray-800">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl p-8 shadow-lg border border-blue-300"
                >
                  <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-900 px-4 py-2 rounded-full mb-6">
                    <FaChalkboardTeacher />
                    <span className="font-medium">Grade 12 University Entrance Exam</span>
                  </div>
                  <ul className="space-y-4">
                    {[
                      "Advanced subject specialization tracks",
                      "University-specific test preparation",
                      "Comprehensive application guidance",
                      "Interview preparation sessions",
                      "Career pathway counseling"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-blue-700"></div>
                        </div>
                        <span className="text-gray-800">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>

              {/* Progress indicator */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 1.5 }}
                className="mt-10 h-2 bg-gradient-to-r from-blue-500 via-blue-600 to-slate-700 rounded-full"
              />
            </motion.div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default CurriculumShowcase;