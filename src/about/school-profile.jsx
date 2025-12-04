import { useState } from "react";
import { FaSchool, FaUsers, FaAward, FaBook, FaGraduationCap, FaChalkboardTeacher, FaChevronDown } from 'react-icons/fa';
import { motion } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';
import schoolImage from '../assets/cerimony2.jpg';
import studentsImage from '../assets/Children.jpg';
import Footer from '../components/Footer';

const SchoolProfile = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const features = [
    {
      icon: <FaBook className="text-4xl text-blue-700" />,
      title: "Academic Programs",
      shortDesc: "Comprehensive curriculum from grades 7-12 with STEM focus",
      fullDesc: "Our comprehensive curriculum from grades 7-12 includes advanced STEM programs with dedicated science and computer labs. We offer specialized tracks in Mathematics, Physics, Chemistry, Biology, and Computer Science, with Advanced Placement (AP) courses available for high-achieving students. Our curriculum is regularly updated to meet national standards while incorporating international best practices in education.",
      highlight: "Advanced Placement courses available"
    },
    {
      icon: <FaGraduationCap className="text-4xl text-blue-700" />,
      title: "University Preparation",
      shortDesc: "Dedicated counseling for college applications nationwide",
      fullDesc: "Our comprehensive university preparation program begins in grade 9 with career guidance and continues through grade 12 with intensive college application support. We offer personalized counseling sessions, assistance with application essays, and guidance on scholarship opportunities. Our alumni have been accepted to prestigious Ethiopian universities with a 70% placement rate.",
      highlight: "70% university placement rate"
    },
    {
      icon: <FaUsers className="text-4xl text-blue-700" />,
      title: "Extracurriculars",
      shortDesc: "30+ clubs and activities for holistic development",
      fullDesc: "With over 30 clubs and extracurricular activities, students can explore their interests beyond academics. Our offerings include sports teams (football, basketball, volleyball, track and field), arts clubs (music, drama, visual arts), academic clubs (debate, science club, mathematics Olympiad), and community service organizations. We have championship-winning sports teams and award-winning arts programs that compete at regional and national levels.",
      highlight: "Championship sports teams"
    }
  ];

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <>
      {/* Hero Section */}
      <div className="relative h-[90vh] w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: `url(${schoolImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-blue-900/30"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 h-full flex flex-col justify-center text-center px-6"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            <span className="text-yellow-300">Tullu Dimtu</span> Secondary School
          </h1>
          <div className="w-48 h-1.5 bg-yellow-400 mx-auto mb-8 rounded-full"></div>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Excellence in Education Since 1995
          </p>

          {/* Scroll Down Arrow */}
          <div
            className="absolute bottom-12 animate-bounce text-white text-4xl cursor-pointer mx-auto left-1/2 transform -translate-x-1/2"
            onClick={() => {
              document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <FaChevronDown />
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <section className="py-24 bg-white">
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
                <div className="relative rounded-2xl overflow-hidden shadow-2xl h-96">
                  <img 
                    src={studentsImage} 
                    alt="Students at Tullu Dimtu" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute -bottom-6 -right-6 bg-yellow-500 w-24 h-24 rounded-xl flex items-center justify-center shadow-xl rotate-6">
                    <FaSchool className="text-white text-3xl" />
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
                  Our <span className="text-yellow-500">School Profile</span>
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg mb-6">
                  Established in 1995, Tullu Dimtu Secondary School has grown from humble beginnings to become 
                  one of the region's most respected educational institutions. Our commitment to academic 
                  excellence and holistic development has produced generations of successful alumni.
                </p>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Located on a spacious 10-acre campus, our school combines modern facilities with a nurturing 
                  environment that encourages students to explore their potential and develop lifelong skills.
                </p>

                <div className="mt-12 grid grid-cols-2 gap-6">
                  {[
                    { icon: <FaUsers className="text-2xl" />, value: "1,200+", label: "Students" },
                    { icon: <FaChalkboardTeacher className="text-2xl" />, value: "85+", label: "Faculty" },
                    { icon: <FaGraduationCap className="text-2xl" />, value: "20+", label: "Years" },
                    { icon: <FaAward className="text-2xl" />, value: "70%", label: "Pass Rate" }
                  ].map((stat, index) => (
                    <motion.div 
                      key={index}
                      whileHover={{ y: -5 }}
                      className="bg-blue-50 p-6 rounded-xl text-center"
                    >
                      <div className="text-blue-700 mb-2">{stat.icon}</div>
                      <p className="text-3xl font-bold text-blue-900">{stat.value}</p>
                      <p className="text-gray-600">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </ScrollReveal>

          {/* Features Section with Animated Read More */}
          <ScrollReveal delay={0.2}>
            <div className="mb-28" id="features">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">
                  Our <span className="text-yellow-500">Key Features</span>
                </h2>
                <div className="w-32 h-1.5 bg-yellow-500 mx-auto rounded-full"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {features.map((feature, index) => {
                  const isExpanded = expandedIndex === index;

                  return (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.15 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -10 }}
                      className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-yellow-400"
                    >
                      <div className="bg-blue-100 w-20 h-20 rounded-xl flex items-center justify-center mx-auto mb-6">
                        {feature.icon}
                      </div>
                      
                      <h3 className="text-2xl font-bold text-center text-blue-900 mb-4">{feature.title}</h3>
                      
                      <motion.p 
                        animate={{ height: isExpanded ? "auto" : "3rem" }}
                        className="text-gray-700 text-center mb-4 overflow-hidden"
                      >
                        {isExpanded ? feature.fullDesc : feature.shortDesc}
                      </motion.p>
                      
                      <div className="text-center">
                        <motion.button
                          onClick={() => toggleExpand(index)}
                          whileTap={{ scale: 0.95 }}
                          className="mt-2 text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors duration-200"
                        >
                          {isExpanded ? "Read Less" : "Read More"}
                        </motion.button>
                      </div>
                      
                      <p className="text-yellow-600 font-semibold text-center text-sm mt-4">
                        {feature.highlight}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* Footer */}
      <Footer/>
    </>
  );
};

export default SchoolProfile;
