import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { FaBookOpen, FaFlask, FaCalculator, FaGlobeAfrica, FaHistory, FaLanguage, FaRunning, FaSearch } from 'react-icons/fa';
import Footer from '../components/Footer';
import Over from '../assets/bulding.jpg'

const CurriculumShowcase = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityBg = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPrograms, setFilteredPrograms] = useState([]);

  // Ethiopian government secondary school curriculum structure
  const programs = [
    {
      icon: <FaBookOpen className="text-4xl" />,
      title: "Languages",
      description: "Developing communication skills in multiple languages",
      color: "from-green-600 to-green-800",
      courses: ["English", "Amharic", "Local Language", "Literature"]
    },
    {
      icon: <FaCalculator className="text-4xl" />,
      title: "Mathematics",
      description: "Building analytical and problem-solving skills",
      color: "from-blue-600 to-blue-800",
      courses: ["Algebra", "Geometry", "Statistics", "Calculus"]
    },
    {
      icon: <FaFlask className="text-4xl" />,
      title: "Natural Sciences",
      description: "Exploring the physical and biological world",
      color: "from-purple-600 to-purple-800",
      courses: ["Physics", "Chemistry", "Biology", "Environmental Science"]
    },
    {
      icon: <FaGlobeAfrica className="text-4xl" />,
      title: "Social Sciences",
      description: "Understanding society and human relationships",
      color: "from-yellow-600 to-yellow-800",
      courses: ["Geography", "Economics", "Civics", "Ethical Education"]
    },
    {
      icon: <FaHistory className="text-4xl" />,
      title: "History & Culture",
      description: "Preserving Ethiopian heritage and global perspectives",
      color: "from-red-600 to-red-800",
      courses: ["Ethiopian History", "World History", "Cultural Studies"]
    },
    {
      icon: <FaRunning className="text-4xl" />,
      title: "Physical Education",
      description: "Promoting health and physical development",
      color: "from-orange-600 to-orange-800",
      courses: ["Sports", "Health Education", "Fitness Training"]
    }
  ];

  const specialPrograms = [
    "National Exam Preparation",
    "ICT Skills Development",
    "Entrepreneurship Training",
    "Agricultural Science Program",
    "Traditional Arts Preservation",
    "Community Service Initiatives"
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
    <div className="bg-gray-50 overflow-hidden" ref={ref}>
      {/* Animated Header with Ethiopian colors */}
      <div className="relative h-[60vh] min-h-[500px] overflow-hidden">
        <motion.div 
          style={{ y: yBg, opacity: opacityBg }}
          className="absolute inset-0 bg-gradient-to-br from-green-600 to-yellow-500"
        >
          <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-white/10 to-white/20">
          
          </div>
        </motion.div>
        
        <div className="relative z-10 h-full flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center px-6"
          >
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">Tullu Dimtu Secondary School</h2>
              <div className="w-20 h-1 bg-white mx-auto"></div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              National <span className="text-yellow-300">Curriculum</span> Program
            </h1>
            <div className="w-32 h-1.5 bg-yellow-400 mx-auto mb-8 rounded-full"></div>
            <p className="text-lg text-white/90 max-w-3xl mx-auto">
              Ministry of Education approved curriculum for grades 9-12
            </p>
          </motion.div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative z-20 bg-white py-8 shadow-sm">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="Search subjects..."
              className="w-full py-3 px-4 pr-12 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-lg"
              value={searchTerm}
              onChange={handleSearch}
            />
            <FaSearch className="absolute right-4 top-4 text-blue-600" />
          </div>
        </div>
      </div>

      
      <section className="relative z-20 py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          {filteredPrograms.length > 0 && (
            <div className="mb-8 text-center">
              <h4 className="text-2xl font-semibold text-gray-800">
                Showing results for: <span className="text-green-600">"{searchTerm}"</span>
              </h4>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setFilteredPrograms([]);
                }}
                className="mt-2 text-green-600 hover:text-green-800 text-sm"
              >
                Clear search
              </button>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {(filteredPrograms.length > 0 ? filteredPrograms : programs).map((program, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -5 }}
                className={`bg-gradient-to-br ${program.color} text-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300`}
              >
                <div className="p-6">
                  <div className="bg-white/20 w-14 h-14 rounded-lg flex items-center justify-center mb-4 backdrop-blur-sm">
                    {program.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{program.title}</h3>
                  <p className="mb-4 opacity-90 text-sm">{program.description}</p>
                  
                  <div className="pt-3 border-t border-white/20">
                    <h4 className="font-semibold mb-2 text-sm">Subjects:</h4>
                    <ul className="space-y-1 text-sm">
                      {program.courses.map((course, i) => (
                        <li key={i} className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-white rounded-full mr-2"></span>
                          {course}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

         
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-16 bg-white rounded-xl p-8 border border-gray-200 shadow-sm"
          >
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              <div className="lg:w-1/2">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  <span className="text-green-600">Special</span> Programs
                </h3>
                <div className="space-y-4">
                  <p className="text-gray-700 text-sm">
                    Tullu Dimtu Secondary School offers additional programs aligned with national education goals:
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {specialPrograms.map((item, i) => (
                      <li key={i} className="flex items-start text-sm">
                        <span className="text-green-500 mr-2 mt-1">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="lg:w-1/2 relative">
                <div className="relative rounded-lg overflow-hidden shadow-md h-56">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-yellow-500 opacity-90"></div>
                  <div className="relative z-10 p-6 h-full flex flex-col justify-center text-white">
                    <h4 className="text-xl font-bold mb-3">National Standards</h4>
                    <p className="text-sm">
                      Our curriculum meets all Ethiopian Ministry of Education requirements while preparing students for university and vocational paths.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

         
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-12 bg-blue-50 rounded-xl p-6 border border-blue-100"
          >
            <h3 className="text-xl font-semibold text-blue-800 mb-4">National Examination Preparation</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-blue-700 mb-2">Grade 10 National Exam</h4>
                <ul className="space-y-2 text-sm text-blue-900">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">✓</span>
                    Comprehensive review of all core subjects
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">✓</span>
                    Mock exam practice sessions
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">✓</span>
                    Individualized performance analysis
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-700 mb-2">Grade 12 University Entrance</h4>
                <ul className="space-y-2 text-sm text-blue-900">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">✓</span>
                    Advanced subject specialization
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">✓</span>
                    Test-taking strategies
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">✓</span>
                    University application guidance
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>

    <Footer/>
    </>
  );
};

export default CurriculumShowcase;


