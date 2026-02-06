import { useState, useEffect } from "react";
import { FaSchool, FaUsers, FaAward, FaBook, FaGraduationCap, FaChalkboardTeacher, FaChevronDown, FaStar, FaCalendarAlt, } from 'react-icons/fa';
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from '../components/ScrollReveal';
import schoolImage from '../assets/tullu.png';
import studentsImage from '../assets/badhasa.jpg';
import studentsImage1 from '../assets/gal1.jpg';
import campusImage from '../assets/lo.jpg';
import labImage from '../assets/loc.jpg';
import Footer from '../components/Footer';
import { Helmet } from "react-helmet-async";
import logo from '../assets/tullulogo.png'

const SchoolProfile = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [activeStat, setActiveStat] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  // Auto-rotate statistics
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStat((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <FaBook className="text-4xl text-blue-700" />,
      title: "Academic Programs",
      shortDesc: "Our institution offers a diverse range of academic programs designed to cater to the varied interests and career goals of our students. From foundational courses to advanced specialized studies, each program is structured to provide both theoretical knowledge and practical skills...",
      fullDesc: "Our comprehensive curriculum from grades 9-12 includes advanced STEM programs with dedicated science and computer labs. We offer specialized tracks in Mathematics, Physics, Chemistry, Biology, and Other Social Science, with Advanced Placement (AP) courses available for high-achieving students. Our curriculum is regularly updated to meet national standards while incorporating  best practices in education.",
      highlight: "Advanced Placement courses available",
      stats: ["12+ AP Courses", "1:15 Teacher Ratio", "95% Exam Pass Rate"],
      image: labImage
    },
    {
      icon: <FaGraduationCap className="text-4xl text-blue-700" />,
      title: "University Preparation",
      shortDesc: "Our University Preparation programs are designed to equip students with the knowledge, skills, and confidence needed to succeed in higher education. Through focused guidance, comprehensive coursework, and personalized support, students develop strong academic foundations, effective study habits, and critical thinking abilities...",
      fullDesc: "Our comprehensive university preparation program begins in grade 9 with career guidance and continues through grade 12 with intensive college application support. We offer personalized counseling sessions, assistance with application essays, and guidance on scholarship opportunities. Our alumni have been accepted to prestigious Ethiopian universities with a 70% placement rate.",
      highlight: "80% university placement rate",
      stats: [" Alumni Network", " Partner Universities", " Scholarship Rate"],
      image: campusImage
    },
    {
      icon: <FaUsers className="text-4xl text-blue-700" />,
      title: "Extracurriculars",
      shortDesc: "Our Extracurricular Programs provide students with opportunities to explore their interests, develop new skills, and build lasting friendships beyond the classroom. From sports and arts to clubs and community service, these activities encourage teamwork, leadership, and creativity...",
      fullDesc: "With over 10 clubs and extracurricular activities, students can explore their interests beyond academics. Our offerings include sports teams (football, basketball, volleyball, track and field), arts clubs (music, drama, visual arts), academic clubs (debate, science club, mathematics Olympiad), and community service organizations. We have championship-winning sports teams and award-winning arts programs that compete at regional and national levels.",
      highlight: "Championship sports teams",
      stats: ["15 Sports Teams", "25+ Annual Events", "500+ Community Hours"],
      image: studentsImage1
    }
  ];

  const schoolStats = [
    { icon: <FaUsers className="text-2xl" />, value: "2,013+", label: "Students", description: "Active enrolled students" },
    { icon: <FaChalkboardTeacher className="text-2xl" />, value: "97+", label: "Faculty", description: "Certified educators" },
    { icon: <FaGraduationCap className="text-2xl" />, value: "10+", label: "Years", description: "Of educational excellence" },
    { icon: <FaAward className="text-2xl" />, value: "85%", label: "Pass Rate", description: "National exam success" }
  ];

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Helmet>
        <title>School Profile | Tullu Dimtu Secondary School</title>
        <meta name="description" content="Discover Tullu Dimtu Secondary School - Excellence in education since 2009. Explore our academic programs, campus facilities, and student achievements." />
      </Helmet>

      

      {/* Hero Section */}

      <div className="relative bg-gradient-to-r from-blue-800 to-blue-600 text-white py-12">
  <div className="absolute inset-0 bg-black opacity-40"></div>
  <div className="relative container mx-auto px-4 text-center">
    
  </div>
</div>
     
       <div className="relative h-screen w-full overflow-hidden">
      
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${schoolImage})` }}
      >
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="relative z-10 h-full container mx-auto px-6 flex items-center"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full">

          {/* Left Logo / Emblem */}
          <div className="flex justify-center md:justify-start opacity-80">
            <img
              src={logo}
              alt="School Logo"
              className="w-56 md:w-72 lg:w-80"
            />
          </div>

          {/* Right Text */}
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-blue-900 leading-tight">
              COMMUNITY
              <br />
              <span className="text-blue-700 font-semibold">
                OF LEARNING
              </span>
            </h1>

            <div className="w-20 h-1 bg-cyan-500 my-6 md:mx-0 mx-auto"></div>

            <p className="text-lg md:text-xl text-blue-800 max-w-xl">
              A safe and supportive environment where students grow in
              academics, leadership, creativity, and character.
            </p>
          </div>

        </div>
      </motion.div>
    </div>

      {/* Main Content */}
      <section className="py-24 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-6">
          {/* About Section */}
          <ScrollReveal>
            <div className="max-w-6xl mx-auto mb-28 flex flex-col lg:flex-row gap-16 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="lg:w-1/2"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl h-96 group">
                  <img 
                    src={studentsImage} 
                    alt="Students at Tullu Dimtu" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent"></div>
                  <div className="absolute -bottom-6 -right-6 bg-yellow-500 w-28 h-28 rounded-xl flex items-center justify-center shadow-2xl rotate-6 group-hover:rotate-12 transition-transform duration-300">
                    <FaSchool className="text-white text-4xl" />
                  </div>
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <p className="text-blue-900 font-bold">Since 2009</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="lg:w-1/2"
              >
                <h2 className="text-4xl font-bold text-blue-900 mb-8">
                  Our <span className="text-yellow-500">Educational Legacy</span>
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg mb-6">
                  Established in 2009, Tullu Dimtu Secondary School has grown from humble beginnings to become 
                  one of the region's most respected educational institutions. Our commitment to academic 
                  excellence and holistic development has produced generations of successful alumni who 
                  contribute meaningfully to society.
                </p>
                <p className="text-gray-700 leading-relaxed text-lg mb-8">
                  Located on  our school combines modern facilities 
                  with a nurturing environment that encourages students to explore their potential, develop 
                  critical thinking skills, and cultivate lifelong learning habits.
                </p>

                <div className="mt-12 grid grid-cols-2 gap-6" id="stats">
                  {schoolStats.map((stat, index) => (
                    <motion.div 
                      key={index}
                      whileHover={{ y: -8, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-400 hover:shadow-xl transition-all duration-300 cursor-pointer"
                      onClick={() => setActiveStat(index)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-blue-100 p-3 rounded-lg">
                          <div className="text-blue-700">{stat.icon}</div>
                        </div>
                        <div>
                          <p className="text-3xl font-bold text-blue-900">{stat.value}</p>
                          <p className="text-gray-600 font-medium">{stat.label}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </ScrollReveal>

          {/* Features Section */}
          <ScrollReveal delay={0.2}>
            <div className="mb-28" id="features">
              <div className="text-center mb-16">
                <div className="inline-block mb-4">
                  <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                    OUR OFFERINGS
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">
                  Comprehensive <span className="text-yellow-500">Education</span>
                </h2>
                <div className="w-32 h-1.5 bg-yellow-500 mx-auto rounded-full"></div>
                <p className="text-gray-600 max-w-2xl mx-auto mt-6 text-lg">
                  We provide a balanced educational experience that prepares students for academic success and personal growth
                </p>
              </div>
              
              <div className="space-y-12">
                {features.map((feature, index) => {
                  const isExpanded = expandedIndex === index;

                  return (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className={`flex flex-col lg:flex-row gap-10 items-center p-8 rounded-2xl ${
                        isExpanded ? 'bg-blue-50 shadow-2xl' : 'bg-white shadow-lg'
                      } transition-all duration-500`}
                    >
                      <div className="lg:w-2/5">
                        <div className="relative rounded-xl overflow-hidden h-64 lg:h-80">
                          <img 
                            src={feature.image} 
                            alt={feature.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-transparent"></div>
                        </div>
                      </div>

                      <div className="lg:w-3/5">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="bg-blue-100 p-4 rounded-xl">
                            {feature.icon}
                          </div>
                          <h3 className="text-2xl font-bold text-blue-900">{feature.title}</h3>
                        </div>
                        
                        <AnimatePresence>
                          <motion.div
                            key={isExpanded ? 'expanded' : 'collapsed'}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <p className="text-gray-700 leading-relaxed mb-6">
                              {isExpanded ? feature.fullDesc : feature.shortDesc}
                            </p>
                          </motion.div>
                        </AnimatePresence>

                        <div className="flex flex-wrap gap-3 mb-6">
                          {feature.stats.map((stat, statIndex) => (
                            <span key={statIndex} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                              {stat}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-yellow-600 font-semibold text-sm">
                            <FaStar className="inline mr-1" />
                            {feature.highlight}
                          </p>
                          
                          <motion.button
                            onClick={() => toggleExpand(index)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                          >
                            {isExpanded ? (
                              <>
                                Show Less
                                <FaChevronDown className="inline ml-2 rotate-180" />
                              </>
                            ) : (
                              <>
                                Learn More
                                <FaChevronDown className="inline ml-2" />
                              </>
                            )}
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </ScrollReveal>

          {/* Call to Action */}
          <ScrollReveal>
            <div className="max-w-4xl mx-auto text-center p-12 bg-gradient-to-r from-blue-900 to-blue-700 rounded-3xl shadow-2xl" id="contact">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Join Our Community?
              </h2>
              <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
                Schedule a campus tour or speak with our admissions team to learn more about enrollment opportunities.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <motion.a
                  href="/schedule-visit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center gap-3"
                >
                  <FaCalendarAlt />
                  Schedule Visit
                </motion.a>
                <motion.a
                  href="/contact"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
                >
                  Contact 
                </motion.a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default SchoolProfile;