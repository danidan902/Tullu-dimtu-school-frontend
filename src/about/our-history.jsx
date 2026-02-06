import { FaCalendarAlt, FaSchool, FaUsers, FaAward, FaChevronDown, FaStar, FaLightbulb, FaRocket, FaHandshake } from 'react-icons/fa';
import ScrollReveal from '../components/ScrollReveal';
import historyImage from '../assets/prin.jpg';
import schoolHeroImage from '../assets/tech1.jpg';
import Footer from '../components/Footer';
import { Helmet } from "react-helmet-async";
import { motion } from 'framer-motion';
import  { useEffect, useRef, useState } from 'react';
import { FiArrowRight, FiTrendingUp, FiTarget, FiX, FiChevronRight, FiChevronLeft, FiExternalLink} from 'react-icons/fi';
import { AnimatePresence } from 'framer-motion';
import anim14 from '../assets/hom2.jpg';
import anim18 from '../assets/chem.png';
import anim24 from '../assets/chem.jpg';
import anim25 from '../assets/ibs.jpg';
import anim12 from '../assets/hom1.jpg';
import doc from '../assets/lab.png'

import dir1 from '../assets/dir1.png'
import visitor from '../assets/visitor.png'

const timelineDetails = {
  "2009": {
    title: "Foundation & Early Years",
    subtitle: "The Beginning of an Educational Legacy",
    images: [
     visitor
    ],
    content: [
      {
        title: "The Vision",
        text: "Founded in 1995 by a group of passionate educators and community leaders, Tullu Dimtu Secondary School started with a simple yet powerful vision: to provide accessible, quality education to children in the region. The founders believed that education was the key to transforming lives and communities."
      },
      {
        title: "Early Challenges",
        text: "The school began operations with minimal facilities. Initial enrollment was 700 students across all grades, taught by just 20 dedicated teachers who often went beyond their duties to ensure students received comprehensive education."
      },
      {
        title: "Community Support",
        text: "Local communities rallied around the school, contributing resources and volunteering time. This strong community foundation became one of our core strengths and continues to define our approach to education."
      }
    ],
    achievements: [
      "First campus established ",
      "Initial enrollment: 700 students",
      "20 founding teachers",
      "Community-funded library established"
    ],
    quote: "Education is not preparation for life; education is life itself.",
    author: "John Dewey"
  },


  
  "2010": {
    title: "First Graduating Class & National Recognition",
    subtitle: "Setting New Standards of Excellence",
    images: [schoolHeroImage],
    content: [
      {
        title: "Historic Graduation",
        text: "The first batch of 45 students graduated in 2002, achieving a remarkable 95% pass rate in national examinations. This success immediately positioned Tullu Dimtu as a rising educational institution in the region."
      },
      {
        title: "Academic Excellence",
        text: "Three students from this class secured positions in the national top 100 rankings, setting a precedent for academic excellence that would become our hallmark."
      },
      {
        title: "Expanding Horizons",
        text: "The success of our first graduates attracted attention from educational authorities and led to increased enrollment and support for infrastructure development."
      }
    ],
    achievements: [
      "95% pass rate in national exams",
      "3 students in national top 100",
      "First school computer lab established",
      "Sports program launched"
    ],
    quote: "The beautiful thing about learning is that no one can take it away from you.",
    author: "B.B. King"
  },
  "2015": {
    title: "National Recognition & Expansion",
    subtitle: "Becoming a National Leader in Education",
    images: [
      dir1
    ],
    content: [
      {
        title: "Top 10 Ranking",
        text: "In 2010, Tullu Dimtu Secondary School was officially recognized as one of the top 10 performing schools in national examinations, a milestone that validated our teaching methodologies and student support systems."
      },
      {
        title: "Infrastructure Development",
        text: "This period saw significant expansion with the construction of new science laboratories, a modern library, and additional classrooms to accommodate growing student numbers."
      },
      {
        title: "Teacher Development",
        text: "We established our Teacher Development Center, providing continuous professional development for educators and adopting innovative teaching strategies."
      }
    ],
    achievements: [
      "Ranked among top 10 schools nationally",
      "New science complex constructed",
      "Digital library established",
      "International exchange programs launched"
    ],
    quote: "Education is the most powerful weapon which you can use to change the world.",
    author: "Nelson Mandela"
  },
  "2017": {
    title: "Modernization & Digital Transformation",
    subtitle: "Embracing 21st Century Learning",
      images:[
         doc
      ],
    content: [
      {
        title: "STEM Facilities",
        text: "We completed construction of state-of-the-art science, technology, engineering, and mathematics (STEM) laboratories, equipped with the latest technology and resources."
      },
      {
        title: "Digital Learning",
        text: "The school implemented a comprehensive digital learning platform, providing students with access to online resources, virtual classrooms, and interactive learning tools."
      },
      {
        title: "Sustainability Initiatives",
        text: "Launched our Green Campus initiative with solar panel installations, rainwater harvesting systems, and environmental education programs."
      }
    ],
    achievements: [
      "15+ modern laboratories established",
      "1:1 device program launched",
      "Solar power system installed",
      "Innovation hub created"
    ],
    quote: "The future belongs to those who learn more skills and combine them in creative ways.",
    author: "Robert Greene"
  },
  "Present": {
    title: "Continuing Excellence & Future Vision",
    subtitle: "Leading Educational Innovation Today",
     images: [anim12],
    content: [
      {
        title: "Current Excellence",
        text: "Today, Tullu Dimtu Secondary School serves over 1,200 students with a faculty of 85 highly qualified educators. We continue to maintain our tradition of academic excellence while innovating for the future of education."
      },
      {
        title: "Innovation Programs",
        text: "Our current initiatives include AI and robotics programs, entrepreneurship incubators, and global virtual exchange partnerships that connect students with peers worldwide."
      },
      {
        title: "Community Impact",
        text: "Beyond academics, we're deeply involved in community development projects, environmental conservation, and social responsibility programs that teach students the value of giving back."
      }
    ],
    achievements: [
      "2013+ current students",
      "85 faculty members",
      "15+ community partnerships",
      "Multiple innovation awards"
    ],
    quote: "Education is not the filling of a pail, but the lighting of a fire.",
    author: "William Butler Yeats"
  }
};

// LearnMoreModal Component
const LearnMoreModal = ({ isOpen, onClose, year }) => {
  const details = timelineDetails[year];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!details) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % details.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + details.images.length) % details.images.length);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="relative h-64 md:h-80 overflow-hidden">
                <img
                  src={details.images[currentImageIndex]}
                  alt={details.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Image Navigation */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <button
                      onClick={prevImage}
                      className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
                    >
                      <FiChevronLeft size={20} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
                    >
                      <FiChevronRight size={20} />
                    </button>
                  </div>
                </div>
                
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
                >
                  <FiX size={24} />
                </button>
                
                {/* Header Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                      {year}
                    </span>
                    <span className="text-white/80">• Milestone Details</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-2">{details.title}</h2>
                  <p className="text-lg text-white/90">{details.subtitle}</p>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 md:p-8 overflow-y-auto max-h-[calc(90vh-16rem)]">
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Main Content */}
                  <div className="lg:col-span-2 space-y-8">
                    {details.content.map((section, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="space-y-4"
                      >
                        <h3 className="text-2xl font-bold text-gray-900">{section.title}</h3>
                        <p className="text-gray-700 leading-relaxed">{section.text}</p>
                      </motion.div>
                    ))}

                    {/* Quote */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-100"
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-4xl text-blue-400">"</div>
                        <div>
                          <p className="text-xl italic text-gray-800 mb-3">{details.quote}</p>
                          <p className="text-gray-600 font-medium">— {details.author}</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-8">
                   
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="space-y-3"
                    >
                     <a href='/gallery'>
                       <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                        <FiExternalLink size={20} />
                        View Gallery 
                      </button>
                     </a>
                      
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="text-gray-600">
                    <span className="font-medium">Related Resources:</span>
                    <div className="flex gap-4 mt-2">
                      <button className="text-blue-600 hover:text-blue-700 font-medium">
                        Annual Report 
                      </button>
                      <button className="text-blue-600 hover:text-blue-700 font-medium">
                        Photo Archive
                      </button>
                      <button className="text-blue-600 hover:text-blue-700 font-medium">
                        Alumni Stories
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={onClose}
                      className="px-6 py-2 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                    >
                      Close
                    </button>
                    <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity">
                      Share This Story
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Main OurHistory Component
const OurHistory = () => {
  // State variables for modal
  const [selectedYear, setSelectedYear] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const timeline = [
    {
      year: "2009",
      title: "Foundation",
      description: "Our school was established in 2009 with a strong commitment to providing quality education for the community. At the beginning, the school started with only 51 students, including 24 male students and 27 female students in the elementary class.",
      icon: <FaSchool className="text-2xl" />,
      color: "bg-blue-500",
      stats: "51 Students, 8 Teachers"
    },
    {
      year: "2010",
      title: "First Secondary School",
      description: "In 2010, the school expanded its academic program and began offering secondary school education, marking an important milestone in its development.",
      icon: <FaUsers className="text-2xl" />,
      color: "bg-emerald-500",
      stats: "95% Pass Rate"
    },
    {
      year: "2011",
      title: "National Recognition",
      description: "Recognized as one of the top performing schools in the national examinations.",
      icon: <FaAward className="text-2xl" />,
      color: "bg-amber-500",
      stats: "Top 10 Nationally"
    },
    {
      year: "2015",
      title: "Modern Facilities",
      description: "Completed construction of new science labs and computer centers to enhance STEM education.",
      icon: <FaSchool className="text-2xl" />,
      color: "bg-purple-500",
      stats: "15+ Labs Built"
    },
    {
      year: "Present",
      title: "Continuing Excellence",
      description: "Maintaining our tradition of academic excellence while innovating for the future of education.",
      icon: <FaCalendarAlt className="text-2xl" />,
      color: "bg-rose-500",
      stats: "2,013+ Students"
    }
  ];

  // Stats counter animation
  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [yearCount, setYearCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const animateCounter = (setter, target, duration = 4000) => {
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
          start += increment;
          if (start >= target) {
            setter(target);
            clearInterval(timer);
          } else {
            setter(Math.floor(start));
          }
        }, 16);
      };

      animateCounter(setStudentCount, 2013);
      animateCounter(setTeacherCount, 97);
      animateCounter(setYearCount, 10);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Function to handle opening the modal
  const handleLearnMore = (year) => {
    setSelectedYear(year);
    setIsModalOpen(true);
  };

  const campusRef = useRef(null);
  const futureRef = useRef(null);
  return (
    <>
      <Helmet>
        <title>Our History </title>
      </Helmet>

      {/* Enhanced Hero Section with Parallax and Gradient Overlay */}
      <motion.div 
        className="relative h-screen w-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 opacity-90"></div>
        
        {/* Parallax Background Image */}
        <motion.div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${schoolHeroImage})` }}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          {/* Animated Gradient Overlay */}
         <div className="absolute inset-0 bg-black/30 z-10"></div>

<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10"></div>

<div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-black/35 z-10"></div>

          {/* Animated Particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-yellow-300 rounded-full"
                initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }}
                animate={{ 
                  y: [null, window.innerHeight],
                  opacity: [0.5, 1, 0]
                }}
                transition={{
                  y: {
                    repeat: Infinity,
                    duration: Math.random() * 3 + 2,
                    ease: "linear"
                  },
                  opacity: {
                    repeat: Infinity,
                    duration: Math.random() * 2 + 1,
                    ease: "easeInOut"
                  }
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Hero Content with Enhanced Typography */}
        <div className="relative z-20 h-full flex flex-col  px-6">





          
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-flex  mb-6 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <FaStar className="text-yellow-300 mr-2" />
              <span className="text-white/90 font-medium">Since 2009</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight  mt-20">
             Our <span className="bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300 bg-clip-text text-transparent">
                 History
              </span>
            </h1>
            
          <motion.div 
  className="w-48 h-1.5 bg-gradient-to-r from-yellow-400 to-amber-500 mb-8 rounded-full self-start"
  initial={{ width: 0 }}
  animate={{ width: "12rem" }}
  transition={{ delay: 0.5, duration: 1 }}
/>

            
            <p className="text-2xl md:text-3xl text-white/90 max-w-4xl mb-10 font-light text-left">
  Decades of <span className="font-bold text-yellow-300">Excellence</span>, 
  Innovation <span className="font-bold text-yellow-300">&</span> Legacy
</p>

            
            {/* Animated Stats Bar */}
            <motion.div 
              className="flex  gap-8 mb-12"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {[
                { value: studentCount, label: "Students", suffix: "+", icon: <FaUsers /> },
                { value: teacherCount, label: "Teachers", suffix: "+", icon: <FaSchool /> },
                { value: yearCount, label: "Years", suffix: "+", icon: <FaCalendarAlt /> }
              ].map((stat, idx) => (
                <div key={idx} className="">
                  <div className="flex  gap-2 mb-2">
                    <div className="text-yellow-300">{stat.icon}</div>
                    <div className="text-3xl md:text-4xl font-bold text-white">
                      {stat.value}{stat.suffix}
                    </div>
                  </div>
                  <div className="text-white/70 text-sm font-medium">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div 
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <FaChevronDown className="text-white/60 text-2xl" />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced Main Content Section */}
      <section className="py-24 bg-gradient-to-b from-slate-50 via-white to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Founding Story with Glass Morphism */}
          <motion.div 
            className="grid lg:grid-cols-2 gap-16 items-center mb-28"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition duration-500"></div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[500px] transform group-hover:scale-[1.02] transition duration-500">
                <img 
                  src={historyImage} 
                  alt="School History" 
                  className="w-full h-full object-cover"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-800/40 to-transparent flex items-end p-8">
                  <div>
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                      <FiTarget className="text-yellow-300" />
                      <span className="text-white font-medium">Since 2000</span>
                    </div>
                    <h3 className="text-4xl font-bold text-white leading-tight">Building Futures Since Day One</h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="inline-block">
                <div className="flex items-center gap-2 text-blue-600 font-semibold mb-4">
                  <FaHandshake className="text-xl" />
                  <span>OUR STORY</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  From Humble <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Beginnings</span>
                </h2>
              </div>
              
              <div className="space-y-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Founded in 2009 with just 51 students (24 male and 27 female) and 8 passionate teachers, Tullu Dimtu Secondary School began as a small community initiative. In 2010, the school expanded its academic program and started offering secondary school education, marking an important milestone in its growth. What started as a modest dream has blossomed into one of the most respected educational institutions in the country. 
                  Through dedication, hard work, and a commitment to quality education, the school has continued to nurture talented students who contribute positively to society.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Through decades of dedication, innovation, and community support, we've transformed into a 
                  beacon of academic excellence, now serving over 2,013 students with a faculty of 85 highly 
                  qualified educators who are committed to shaping tomorrow's leaders.
                </p>
              </div>

              {/* Feature Cards */}
              <div className="grid sm:grid-cols-2 gap-6 pt-6">
                {[
                  { icon: <FaLightbulb />, title: "Innovation", desc: "Pioneering modern education methods" },
                  { icon: <FiTrendingUp />, title: "Growth", desc: "Continuous improvement & expansion" },
                  { icon: <FaRocket />, title: "Excellence", desc: "Consistent academic achievements" },
                  { icon: <FaHandshake />, title: "Community", desc: "Strong parental involvement" }
                ].map((feature, idx) => (
                  <motion.div 
                    key={idx}
                    className="bg-white p-5 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                    whileHover={{ y: -5 }}
                  >
                    <div className="text-blue-600 text-2xl mb-3">{feature.icon}</div>
                    <h4 className="font-bold text-gray-900 mb-1">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Enhanced Timeline Section */}
          <ScrollReveal>
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 text-blue-600 font-semibold mb-4">
                  <FaAward className="text-xl" />
                  <span>OUR JOURNEY</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                  Milestone <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Timeline</span>
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  Follow our journey through the years, marked by significant achievements and growth
                </p>
              </div>
              
              {/* Interactive Timeline Navigation */}
              <div className="flex justify-center gap-4 mb-12 overflow-x-auto pb-4">
                {timeline.map((item) => (
                  <button
                    key={item.year}
                    onClick={() => handleLearnMore(item.year)}
                    className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 whitespace-nowrap ${
                      selectedYear === item.year
                        ? `${item.color} text-white shadow-lg transform scale-105`
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {item.year}
                  </button>
                ))}
              </div>

              {/* Enhanced Timeline Visualization */}
              <div className="relative">
                {/* Timeline Line */}
                <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 transform -translate-x-1/2"></div>
                
                <div className="space-y-20">
                  {timeline.map((item, index) => (
                    <motion.div 
                      key={index} 
                      className={`relative flex flex-col lg:flex-row items-start ${
                        index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                      }`}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      {/* Year Badge */}
                      <div className="w-full lg:w-2/5 px-6 py-4">
                        <motion.div 
                          className={`p-6 rounded-2xl shadow-xl backdrop-blur-sm border border-white/20 ${
                            index % 2 === 0 
                              ? 'lg:ml-auto bg-gradient-to-r from-blue-50 to-white' 
                              : 'lg:mr-auto bg-gradient-to-l from-purple-50 to-white'
                          }`}
                          whileHover={{ scale: 1.05 }}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className={`${item.color} text-white p-3 rounded-full`}>
                              {item.icon}
                            </div>
                            <span className="text-4xl font-bold text-gray-900">{item.year}</span>
                          </div>
                          <div className="text-sm font-semibold text-gray-600 px-2 py-1 bg-gray-100 rounded-lg inline-block">
                            {item.stats}
                          </div>
                        </motion.div>
                      </div>
                      
                      {/* Timeline Node */}
                      <div className="absolute left-1/2 lg:left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white rounded-full border-4 border-white shadow-xl flex items-center justify-center z-10 top-16 lg:top-1/2 lg:-translate-y-1/2">
                        <div className={`w-6 h-6 ${item.color.replace('bg-', 'bg-gradient-to-br from-')} to-white rounded-full`}></div>
                      </div>
                      
                      {/* Content Card */}
                      <div className="w-full lg:w-3/5 px-6 py-4 mt-8 lg:mt-0">
                        <motion.div 
                          className={`p-8 rounded-2xl shadow-lg border border-gray-100 transform transition-all duration-300 hover:shadow-2xl ${
                            index % 2 === 0 
                              ? 'lg:mr-12 bg-white' 
                              : 'lg:ml-12 bg-gradient-to-br from-white to-gray-50'
                          }`}
                          whileHover={{ y: -5 }}
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <div className={`w-3 h-3 ${item.color} rounded-full`}></div>
                            <h4 className="text-2xl font-bold text-gray-900">{item.title}</h4>
                          </div>
                          <p className="text-gray-700 leading-relaxed mb-6">{item.description}</p>
                          <button 
                            onClick={() => handleLearnMore(item.year)}
                            className="flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all duration-300 group"
                          >
                            Explore Details 
                            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                          </button>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>

          <motion.div 
            ref={campusRef}
            className="mt-40 mb-32"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-10">
                <div>
                  <div className="inline-flex items-center gap-2 text-emerald-600 font-semibold mb-4">
                    <FaSchool className="text-xl" />
                    <span>OUR SCHOOL</span>
                  </div>
                  <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                    State-of-the-Art <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Learning Environment</span>
                  </h2>
                </div>
                
                <div className="space-y-6 text-gray-700 text-lg">
                  <p className="leading-relaxed">
                    Our 15-acre campus is a living laboratory designed to inspire creativity and innovation. 
                    Every space is intentionally crafted to enhance the learning experience and foster collaboration.
                  </p>
                  
                  {/* Facilities Grid */}
                  <div className="grid grid-cols-2 gap-6 pt-6">
                    {[
                      { name: "Science Labs", count: "4" },
                      { name: "Sports Facilities", count: "8+" },
                      { name: "Smart Classrooms", count: "20" },
                      { name: "Art Studios", count: "2" }
                    ].map((facility, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
                        <div className="text-2xl font-bold text-emerald-600 mb-1">{facility.count}</div>
                        <div className="text-sm text-gray-600">{facility.name}</div>
                      </div>
                    ))}
                  </div>
                  
                  <p className="leading-relaxed pt-6">
                    From solar-powered classrooms to our fully-equipped innovation hub, we're committed to 
                    sustainable, forward-thinking education that prepares students for tomorrow's challenges.
                  </p>
                </div>
                
               <a href='/schedule-visit'>
                 <button className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl transition-all duration-300 hover:gap-4 group">
                  Schedule For Visit 
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
               </a>
              </div>
              
              {/* Image Gallery Grid with Hover Effects */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  {[
                    anim14,
                    anim25,

                    
                  ].map((src, index) => (
                    <motion.div 
                      key={index}
                      className="relative rounded-2xl overflow-hidden group"
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img 
                        src={src}
                        alt="Campus facility"
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </motion.div>
                  ))}
                </div>
                <div className="space-y-6 pt-12">
                  {[
                    anim18,
                    anim24
                  ].map((src, index) => (
                    <motion.div 
                      key={index}
                      className="relative rounded-2xl overflow-hidden group"
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img 
                        src={src}
                        alt="Campus facility"
                        className="w-full h-80 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          

          {/* Enhanced Future Vision Section */}
          <motion.div 
            ref={futureRef}
            className="relative rounded-3xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Animated Background */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-purple-900/90 to-pink-900/90"></div>
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-20"
                style={{
                  backgroundImage: `url(${anim12})`
                }}
              />
              {/* Animated Grid Overlay */}
              <div className="absolute inset-0 opacity-10">
                <div className="h-full w-full" style={{
                  backgroundImage: `linear-gradient(to right, white 1px, transparent 1px),
                    linear-gradient(to bottom, white 1px, transparent 1px)`,
                  backgroundSize: '50px 50px'
                }}></div>
              </div>
            </div>
            
            
          </motion.div>
        </div>
      </section>
   
      <LearnMoreModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        year={selectedYear}
      />

      <Footer />
    </>
  );
};

export default OurHistory;