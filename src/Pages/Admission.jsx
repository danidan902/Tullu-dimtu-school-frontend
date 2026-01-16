import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { 
  FaCalendarAlt, 
  FaCheckCircle, 
  FaPhoneAlt,    
  FaDownload,
} from 'react-icons/fa';
import { FiArrowRight } from 'react-icons/fi';
import schoolHero from '../assets/tul8.jpg'; 
import Tilt from 'react-parallax-tilt';
import Footer from '../components/Footer';
import { Helmet } from "react-helmet-async";

const AdmissionPortal = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [darkMode, setDarkMode] = useState(true);
  const [flippedCard, setFlippedCard] = useState(null);

  const admissionData = {
    code: "TDS-ADM-2024-XYZ",
    deadline: "August 30, 2024",
    examDate: "September 15, 2024",
    requirements: [
      "Completed application form",
      "Previous school reports (2 years)",
      "Birth certificate copy",
      "2 passport photos",
      "Medical clearance certificate"
    ],
    contact: {
      email: "admissions@tulludimtu.edu.et",
      phone: "+251 921 225 887",
      address: "Tullu Dimtu, Oromia, Ethiopia"
    }
  };

  const processSteps = [
    {
      title: "1. Application",
      description: "Submit online or physical application form",
      icon: ""
    },
    {
      title: "2. Document Review",
      description: "Verification of academic records",
      icon: ""
    },
    {
      title: "3. Entrance Exam",
      description: "Written assessment for Grades 5-12",
      icon: ""
    },
    {
      title: "4. Interview",
      description: "Family interview with academic board",
      icon: ""
    },
    {
      title: "5. Admission Offer",
      description: "Formal acceptance letter issued",
      icon: ""
    }
  ];

  return (
    <>
      <Helmet>
        <title>Admission | Tullu Dimtu Secondary School</title>
      </Helmet>
      <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-blue-50 to-gray-50 text-gray-900'}`}>
        
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className={`fixed top-20 right-6 z-50 p-3 rounded-full ${darkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-white'} shadow-lg transition-all`}
          aria-label="Toggle dark mode"
        >
          {/* {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />} */}
        </button>

        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative h-screen max-h-[800px] overflow-hidden"
        >
          <motion.div      
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${schoolHero})`,
              filter: darkMode ? 'brightness(0.7)' : 'none'
            }}
          />
        
          <div className={`absolute inset-0 ${darkMode ? 'bg-black/60' : 'bg-gradient-to-t from-blue-900/80 via-blue-800/40 to-transparent'}`} />

          <div className="relative z-10 h-full flex items-center justify-center">
            <div className="container mx-auto px-6 text-center">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="backdrop-blur-sm bg-white/10 dark:bg-black/20 p-8 sm:p-12 rounded-3xl border border-white/20 shadow-2xl inline-block"
              >
                <motion.h1   
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                  className="text-4xl sm:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600"
                >
                  Admissions 2026
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className={`text-xl sm:text-2xl mb-8 ${darkMode ? 'text-gray-300' : 'text-white'}`}
                >
                  Excellence in Education Since 2000
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.6 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <Tilt tiltMaxAngleX={15} tiltMaxAngleY={15} scale={1.05} className="inline-block mx-3">
                    <motion.a
                      href="https://tulludimturegistration.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`block px-8 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2 transition-colors ${
                        darkMode
                          ? "bg-yellow-500 text-gray-900 hover:bg-yellow-400 focus:ring-yellow-400"
                          : "bg-white text-blue-800 hover:bg-blue-100 focus:ring-blue-300"
                      }`}
                    >
                      Apply Online 
                      <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                    </motion.a>
                  </Tilt>

                  <Tilt tiltMaxAngleX={15} tiltMaxAngleY={15} scale={1.05} className="inline-block mx-3">
                    <motion.a
                      href="/contact"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`block px-8 py-3 rounded-xl font-bold border-2 flex items-center gap-2 transition-colors ${
                        darkMode
                          ? "border-yellow-400 text-yellow-400 hover:bg-yellow-400/10"
                          : "border-white text-white hover:bg-white/10"
                      }`}
                    >
                      Contact Us 
                      <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                    </motion.a>
                  </Tilt>
                </motion.div>
              </motion.div>
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-10 left-0 right-0 flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-8 h-8 border-r-2 border-b-2 border-white rounded-sm transform rotate-45"
            />
          </motion.div>
        </motion.section>

        <section ref={ref} className="py-20 relative">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <motion.div
              animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
              transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
              className={`absolute top-20 left-10 w-40 h-40 rounded-full ${darkMode ? 'bg-yellow-400/10' : 'bg-blue-400/10'} blur-xl`}
            />
            <motion.div
              animate={{ x: [0, -80, 0], y: [0, -30, 0] }}
              transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
              className={`absolute bottom-10 right-20 w-60 h-60 rounded-full ${darkMode ? 'bg-purple-500/10' : 'bg-purple-300/10'} blur-xl`}
            />
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className={`mb-20 p-1 rounded-2xl ${darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-white to-gray-100'} shadow-2xl`}
            >
              <div className={`p-8 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} relative overflow-hidden`}>
                <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-yellow-400/10 blur-xl" />
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                  <div>
                    <motion.h2 
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : {}}
                      transition={{ delay: 0.3 }}
                      className={`text-2xl sm:text-3xl font-bold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}
                    >
                      Your Admission Code
                    </motion.h2>
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : {}}
                      transition={{ delay: 0.5 }}
                      className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                    >
                      Required for all admission communications
                    </motion.p>
                  </div>
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ delay: 0.7, type: 'spring' }}
                    className={`p-4 px-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'} border ${darkMode ? 'border-gray-600' : 'border-blue-200'} min-w-[250px] text-center`}
                  >
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-blue-600'} mb-1`}>Tullu Dimtu Secondary</p>
                    <p className={`text-2xl font-mono font-bold tracking-wider ${darkMode ? 'text-yellow-400' : 'text-blue-700'}`}>
                      {admissionData.code}
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>

          

            {/* Admission Process Section - Beautifully Styled */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
              className={`mb-20 p-8 rounded-3xl ${darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-white to-gray-50'} shadow-2xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
            >
              <div className="text-center mb-12">
                <motion.h2 
                  initial={{ scale: 0.95 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ type: 'spring' }}
                  className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}
                >
                  Our <span className="text-yellow-500">Admission Philosophy</span>
                </motion.h2>
                <div className="w-24 h-1 bg-yellow-500 mx-auto mb-8 rounded-full"></div>
              </div>

              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.7 }}
                  className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800/50' : 'bg-blue-50/50'} backdrop-blur-sm`}
                >
                  <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <span className="text-yellow-500">Inclusive</span> Education
                  </h3>
                  <p className={`text-lg leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <span className="italic font-serif">Tulu Dimtu School welcomes applications from all students, regardless of background, ethnicity, religion, gender, or ability.</span> We believe that every child deserves access to a quality education and the opportunity to reach their full potential.
                  </p>
                  <p className={`mt-4 text-lg leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Our goal is to create a <span className="font-semibold italic">diverse and inclusive learning environment</span> where all students feel valued and respected. We encourage applicants with a variety of strengths, interests, and learning styles to apply.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.8 }}
                  className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800/50' : 'bg-green-50/50'} backdrop-blur-sm`}
                >
                  <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    What We <span className="text-yellow-500">Prioritize</span>
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <span className={`text-yellow-500 mr-3 mt-1 font-bold`}>•</span>
                      <span className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        <span className="italic font-semibold">A genuine desire to learn and grow:</span> We welcome students who are curious, motivated, and eager to engage with new ideas and challenges.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className={`text-yellow-500 mr-3 mt-1 font-bold`}>•</span>
                      <span className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        <span className="italic font-semibold">A commitment to respect and collaboration:</span> We promote a positive and supportive learning environment where students treat each other with kindness and understanding, and work together effectively.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className={`text-yellow-500 mr-3 mt-1 font-bold`}>•</span>
                      <span className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        <span className="italic font-semibold">A willingness to adapt and embrace new experiences:</span> We encourage students to step outside their comfort zones, explore new interests, and learn from diverse perspectives.
                      </span>
                    </li>
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.9 }}
                  className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800/50' : 'bg-red-50/50'} backdrop-blur-sm`}
                >
                  <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Applicants We <span className="text-yellow-500">May Not Accept</span>
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className={`text-red-400 mr-3 mt-1`}>✗</span>
                      <span className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Students who <span className="italic">lack academic motivation</span> and struggle with basic learning concepts.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className={`text-red-400 mr-3 mt-1`}>✗</span>
                      <span className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Individuals who exhibit <span className="italic">disruptive behavior, disrespect towards others</span>, or a lack of commitment to the school community.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className={`text-red-400 mr-3 mt-1`}>✗</span>
                      <span className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Students who are <span className="italic">unwilling to adapt</span> to the school's expectations and requirements.
                      </span>
                    </li>
                  </ul>
                  <p className={`mt-4 text-lg italic ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Dandii Boru School offers a <span className="font-semibold">rigorous academic program</span> and expects students to be dedicated to their studies.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 1.0 }}
                  className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800/50' : 'bg-purple-50/50'} backdrop-blur-sm border ${darkMode ? 'border-yellow-500/20' : 'border-yellow-400/20'}`}
                >
                  <h3 className={`text-2xl font-bold mb-6 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <span className="text-yellow-500">Admission Process</span> Overview
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {processSteps.map((step, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 1.1 + index * 0.1 }}
                        className={`p-4 rounded-xl text-center ${darkMode ? 'bg-gray-700/50' : 'bg-white/80'}`}
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${darkMode ? 'bg-yellow-500/20' : 'bg-yellow-100'}`}>
                          <span className={`text-xl font-bold ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                            {index + 1}
                          </span>
                        </div>
                        <h4 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {step.title.split('. ')[1]}
                        </h4>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {step.description}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                  <div className={`mt-8 p-4 rounded-lg ${darkMode ? 'bg-gray-700/30' : 'bg-gray-100/50'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                    <p className={`text-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <span className="font-semibold italic">Note:</span> Complete the application form and submit in-person all required documents, including transcripts, 4 Recent Passport Size Photo, Parent or Guardian ID, Vaccination card, Birth Certificate, and recommendation letters (Optional).
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20"
            >
              {/* Existing cards remain unchanged */}
              <Tilt options={{ max: 10, scale: 1.03 }}>
                <motion.div 
                  whileHover={{ y: -5 }}
                  onClick={() => setFlippedCard(flippedCard === 1 ? null : 1)}
                  className={`h-full cursor-pointer rounded-2xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
                >
                  <AnimatePresence>
                    {flippedCard !== 1 ? (
                      <motion.div
                        key="front"
                        initial={{ rotateY: 0 }}
                        animate={{ rotateY: 0 }}
                        exit={{ rotateY: -180 }}
                        transition={{ duration: 0.6 }}
                        className="p-6 h-full"
                      >
                        <div className="flex items-center gap-4 mb-6">
                          <div className={`p-3 rounded-full ${darkMode ? 'bg-yellow-400/20' : 'bg-blue-100'}`}>
                            <FaCalendarAlt className={`text-xl ${darkMode ? 'text-yellow-400' : 'text-blue-600'}`} />
                          </div>
                          <h3 className={`text-xl font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Key Dates</h3>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Application Deadline</p>
                            <p className={`font-medium ${darkMode ? 'text-yellow-400' : 'text-blue-700'}`}>{admissionData.deadline}</p>
                          </div>
                          <div>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Entrance Exam</p>
                            <p className={`font-medium ${darkMode ? 'text-yellow-400' : 'text-blue-700'}`}>{admissionData.examDate}</p>
                          </div>
                        </div>
                        <motion.div  
                          whileHover={{ x: 5 }}
                          className={`flex items-center gap-2 mt-6 ${darkMode ? 'text-yellow-400' : 'text-blue-600'} font-medium`}
                        >
                          View details <FiArrowRight />
                        </motion.div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="back"
                        initial={{ rotateY: 180 }}
                        animate={{ rotateY: 0 }}
                        exit={{ rotateY: 180 }}
                        transition={{ duration: 0.6 }}
                        className={`p-6 h-full ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}
                      >
                        <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Full Timeline</h3>
                        <ul className="space-y-3">
                          {processSteps.map((step, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <span className={`mt-1 ${darkMode ? 'text-yellow-400' : 'text-blue-600'}`}>{step.icon}</span>
                              <div>
                                <p className={`font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{step.title}</p>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{step.description}</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setFlippedCard(null);
                          }}
                          className={`mt-4 flex items-center gap-2 ${darkMode ? 'text-yellow-400' : 'text-blue-600'} font-medium`}
                        >
                          <FiArrowRight className="transform rotate-180" /> Back
                        </button>
                      </motion.div>
                    )}  
                  </AnimatePresence>
                </motion.div>
              </Tilt>

              <Tilt options={{ max: 10, scale: 1.03 }}>
                <motion.div 
                  whileHover={{ y: -5 }}
                  className={`h-full rounded-2xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
                >
                  <div className="p-6 h-full">
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`p-3 rounded-full ${darkMode ? 'bg-green-400/20' : 'bg-green-100'}`}>
                        <FaCheckCircle className={`text-xl ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                      </div>
                      <h3 className={`text-xl font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Requirements</h3>
                    </div>
                    <ul className="space-y-3 mb-6">
                      {admissionData.requirements.map((item, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={isInView ? { opacity: 1, x: 0 } : {}}
                          transition={{ delay: 0.1 * i }}
                          className="flex items-start gap-2"
                        >
                          <span className={`mt-1.5 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>✓</span>
                          <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className={`w-full mt-4 py-2 rounded-lg flex items-center justify-center gap-2 ${darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white font-medium transition-colors`}
                    >
                      <FaDownload /> Download Checklist
                    </motion.button>
                  </div>
                </motion.div>
              </Tilt>

              <Tilt options={{ max: 10, scale: 1.03 }}>
                <motion.div 
                  whileHover={{ y: -5 }}
                  className={`h-full rounded-2xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
                >
                  <div className="p-6 h-full">
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`p-3 rounded-full ${darkMode ? 'bg-purple-400/20' : 'bg-purple-100'}`}>
                        <FaPhoneAlt className={`text-xl ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                      </div>
                      <h3 className={`text-xl font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Contact Us</h3>
                    </div>
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                          <FiArrowRight className={`${darkMode ? 'text-yellow-400' : 'text-blue-600'}`} />
                        </div>
                        <div>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Email</p>
                          <p className={`${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{admissionData.contact.email}</p>
                        </div>
                      </div>    
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                          <FiArrowRight className={`${darkMode ? 'text-yellow-400' : 'text-blue-600'}`} />
                        </div>
                        <div>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Phone</p>
                          <p className={`${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{admissionData.contact.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                          <FiArrowRight className={`${darkMode ? 'text-yellow-400' : 'text-blue-600'}`} />
                        </div>
                        <div>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Address</p>
                          <p className={`${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{admissionData.contact.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Tilt>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8 }}
              className={`text-center p-12 rounded-3xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl`}
            >
              <motion.h2
                initial={{ scale: 0.95 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ type: 'spring' }}
                className={`text-3xl sm:text-4xl font-bold mb-6 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}
              >
                Begin Your Journey to Excellence
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.3 }}
                className={`text-xl mb-8 max-w-3xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
              >
                Limited seats available for the 2025/2026 academic year. Apply today to secure your spot.
              </motion.p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Tilt options={{ max: 15, scale: 1.05 }}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-8 py-4 rounded-xl font-bold shadow-lg flex items-center gap-2 ${darkMode ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                  >
                    <a href='https://tulludimturegistration.vercel.app/' target='_blank' rel="noopener noreferrer">Start Application</a> <FiArrowRight />
                  </motion.button>
                </Tilt>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
      <Footer/>
    </> 
  );
};

export default AdmissionPortal;