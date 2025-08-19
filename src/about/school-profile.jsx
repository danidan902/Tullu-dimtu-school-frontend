
import { FaSchool, FaUsers, FaAward, FaBook, FaGraduationCap, FaChalkboardTeacher } from 'react-icons/fa';
import { motion } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';
import schoolImage from '../assets/cerimony2.jpg';
import studentsImage from '../assets/Children.jpg';
import Footer from '../components/Footer';

const SchoolProfile = () => {
  return (
    <>
      {/* Hero Section */}
      <div className="relative h-[90vh] w-full overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: `url(${schoolImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-blue-900/30"></div>
        </div>
        
        {/* Hero Content */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 h-full flex flex-col justify-center text-center px-6"
        >
          <div className="max-w-5xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              <span className="text-yellow-300">Tullu Dimtu</span> Secondary School
            </h1>
            <div className="w-48 h-1.5 bg-yellow-400 mx-auto mb-8 rounded-full"></div>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Excellence in Education Since 1995
            </p>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          {/* About Section */}
          <ScrollReveal>
            <div className="max-w-6xl mx-auto mb-28">
              <div className="flex flex-col lg:flex-row gap-16 items-center">
                {/* School Image */}
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

                {/* About Content */}
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
                  
                  <div className="space-y-6">
                    <p className="text-gray-700 leading-relaxed text-lg">
                      Established in 1995, Tullu Dimtu Secondary School has grown from humble beginnings to become 
                      one of the region's most respected educational institutions. Our commitment to academic 
                      excellence and holistic development has produced generations of successful alumni.
                    </p>
                    
                    <p className="text-gray-700 leading-relaxed text-lg">
                      Located on a spacious 10-acre campus, our school combines modern facilities with a nurturing 
                      environment that encourages students to explore their potential and develop lifelong skills.
                    </p>
                  </div>

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
            </div>
          </ScrollReveal>

          {/* Features Section */}
          <ScrollReveal delay={0.2}>
            <div className="mb-28">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">
                  Our <span className="text-yellow-500">Key Features</span>
                </h2>
                <div className="w-32 h-1.5 bg-yellow-500 mx-auto rounded-full"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {[
                  {
                    icon: <FaBook className="text-4xl" />,
                    title: "Academic Programs",
                    description: "Comprehensive curriculum from grades 7-12 with STEM focus",
                    highlight: "Advanced Placement courses available"
                  },
                  {
                    icon: <FaGraduationCap className="text-4xl" />,
                    title: "University Preparation",
                    description: "Dedicated counseling for college applications worldwide",
                    highlight: "70% university placement rate"
                  },
                  {
                    icon: <FaUsers className="text-4xl" />,
                    title: "Extracurriculars",
                    description: "30+ clubs and activities for holistic development",
                    highlight: "Championship sports teams"
                  }
                ].map((feature, index) => (
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
                    <p className="text-gray-700 text-center mb-6">{feature.description}</p>
                    <p className="text-yellow-600 font-semibold text-center text-sm">{feature.highlight}</p>

                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Testimonials Section */}
          <ScrollReveal delay={0.4}>
            <div className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-3xl p-14 text-white overflow-hidden relative">
              <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-white/5"></div>
              <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-yellow-400/10"></div>
              
              <div className="relative z-10 text-center max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold mb-8">
                  Why <span className="text-yellow-300">Parents Choose</span> Us
                </h2>
                <div className="w-32 h-1.5 bg-yellow-400 mx-auto mb-12 rounded-full"></div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
                  {[
                    {
                      quote: "Tullu Dimtu provided my child with both academic excellence and strong values. The teachers go above and beyond.",
                      author: "Mrs. Kebede, Parent"
                    },
                    {
                      quote: "The university counseling program helped my daughter get into her dream school with a scholarship.",
                      author: "Mr. Teshome, Alumni Parent"
                    }
                  ].map((testimonial, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.2 }}
                      viewport={{ once: true }}
                      className="bg-white/10 p-8 rounded-xl backdrop-blur-sm"
                    >
                      <p className="italic mb-6">"{testimonial.quote}"</p>
                      <p className="font-semibold text-yellow-300">{testimonial.author}</p>
                    </motion.div>
                  ))}
                </div>
                
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-12 py-5 bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold rounded-xl transition-all duration-300 shadow-lg"
                >
                  Schedule a Campus Tour
                </motion.button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

    <Footer/>
    </>
  );
};

export default SchoolProfile;