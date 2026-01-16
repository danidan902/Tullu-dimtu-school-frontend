
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { FaGraduationCap, FaUsers, FaTrophy, FaChartLine } from 'react-icons/fa';
import schoolImage from '../assets/bulding.jpg';
import studentsImage from '../assets/Student.jpg';
import Footer from '../components/Footer';
import Bg from '../assets/bulding.jpg';
import { Helmet } from "react-helmet-async";


   
const SchoolOverview = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const stats = [
    { icon: <FaGraduationCap />, value: "25+", label: "Years of Excellence" },
    { icon: <FaUsers />, value: "1,200+", label: "Students Enrolled" },
    { icon: <FaTrophy />, value: "50+", label: "National Awards" },
    { icon: <FaChartLine />, value: "98%", label: "Pass Rate" }
  ];

  return (
   <>
   <Helmet>
    <title>Overview | Tullu Dimtu Secondary School</title>
      </Helmet>

    <div className="min-h-screen py-12 px-4 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9)), url(${Bg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
    
    >
      {/* Hero Section with Parallax Effect */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative h-screen max-h-[450px] overflow-hidden"
      >
       

        <div className="relative z-10 h-full flex items-end pb-20">
          <div className="container mx-auto px-6 text-center">
            <motion.h1
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            >
              Welcome to <span className="text-yellow-300">Tullu Dimtu</span>
            </motion.h1>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '200px' }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="h-1.5 bg-yellow-400 mx-auto mb-8 rounded-full"
            />
            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto"
            >
              A premier institution nurturing future leaders through academic excellence and character development
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* About Section */}
      <section ref={ref} className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="flex flex-col lg:flex-row gap-16 items-center mb-28"
          >
            <div className="lg:w-1/2">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl h-96">
                <motion.img
                  initial={{ scale: 1.1 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ duration: 1.2 }}
                  src={studentsImage}
                  alt="Students at Tullu Dimtu"
                  className="w-full h-full object-cover"
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="absolute -bottom-6 -right-6 bg-yellow-500 w-24 h-24 rounded-xl flex items-center justify-center shadow-xl rotate-6"
                >
                  <FaGraduationCap className="text-white text-3xl" />
                </motion.div>
              </div>
            </div>

            <div className="lg:w-1/2">
              <motion.h2
                initial={{ x: -30, opacity: 0 }}
                animate={isInView ? { x: 0, opacity: 1 } : {}}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-4xl font-bold text-gray-900 mb-8"
              >
                Our <span className="text-blue-600">Educational Legacy</span>
              </motion.h2>
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={isInView ? { y: 0, opacity: 1 } : {}}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-gray-700 leading-relaxed text-lg mb-6"
              >
                Established in 1995, Tullu Dimtu Secondary School has grown from humble beginnings to become a beacon of academic excellence, recognized nationally for our innovative teaching methodologies and holistic approach to education.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="grid grid-cols-2 gap-6 mt-12"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5 }}
                    className="bg-blue-50 p-6 rounded-xl text-center border border-blue-100"
                  >
                    <div className="text-blue-600 mb-3 text-3xl">{stat.icon}</div>
                    <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-gray-600 mt-2">{stat.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div> 

          {/* Mission Statement */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-3xl p-14 text-white relative overflow-hidden"
          >
            <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-white/5"></div>
            <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-yellow-400/10"></div>
            
            <div className="relative z-10 max-w-4xl mx-auto text-center">
              <h3 className="text-3xl md:text-4xl font-bold mb-8">
                Our <span className="text-yellow-300">Mission</span>
              </h3>
              <div className="w-24 h-1 bg-yellow-400 mx-auto mb-10 rounded-full"></div>
              <p className="text-xl leading-relaxed mb-10">
                To empower students with knowledge, skills, and values to become innovative thinkers, ethical leaders, and responsible global citizens who contribute meaningfully to society.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold rounded-xl transition-all duration-300 shadow-lg inline-flex items-center gap-3"
              >
                <FaGraduationCap />
                Learn About Our Programs
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
   <Footer/>
   </>
  );
};

export default SchoolOverview;