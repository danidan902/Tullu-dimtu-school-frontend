import { FaQuoteLeft, FaChalkboardTeacher, FaGraduationCap, FaUsers, FaHandshake } from 'react-icons/fa';
import { motion } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';
import principalImage from '../assets/Prinsipal.jpg';
import schoolBuilding from '../assets/pre.jpg';
import Footer from '../components/Footer';

const PrincipalMessage = () => {
  return (
    <>
      
      <div className="relative h-[90vh] w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: `url(${schoolBuilding})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-blue-900/30"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 h-full flex flex-col justify-center text-center px-6"
        >
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Principal's <span className="text-yellow-300">Visionary</span> Leadership
            </h1>
            <div className="w-48 h-1.5 bg-yellow-400 mx-auto mb-8 rounded-full"></div>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Guiding Tullu Dimtu towards educational excellence and innovation
            </p>
          </div>
        </motion.div>
      </div>

      
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          
          <div className="max-w-7xl mx-auto mb-28">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative lg:w-2/5 flex justify-center"
              >
                <div className="relative w-80 h-80 rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src={principalImage} 
                    alt="Principal" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 border-8 border-white/30"></div>
                </div>
                <div className="absolute -bottom-8 -right-8 bg-yellow-500 w-24 h-24 rounded-xl flex items-center justify-center shadow-xl rotate-6">
                  <FaChalkboardTeacher className="text-white text-3xl" />
                </div>
              </motion.div>

              
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="lg:w-3/5"
              >
                <div className="bg-white p-10 rounded-3xl shadow-xl relative">
                  <div className="absolute -top-6 -left-6 w-16 h-16 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                    <FaQuoteLeft className="text-white text-2xl" />
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8 pl-8">
                    A Message from Our Principal
                  </h2>
                  
                  <div className="space-y-6 pl-2">
                    <p className="text-gray-700 leading-relaxed text-lg border-l-4 border-yellow-400 pl-6">
                      At Tullu Dimtu Secondary School, we are committed to creating an environment where 
                      academic rigor meets character development. Our holistic approach ensures students 
                      not only excel academically but also grow as responsible global citizens.
                    </p>
                    
                    <p className="text-gray-700 leading-relaxed text-lg border-l-4 border-blue-400 pl-6">
                      Through our innovative curriculum and dedicated faculty, we empower students to 
                      think critically, solve complex problems, and develop the resilience needed to 
                      thrive in our rapidly evolving world.
                    </p>
                  </div>

                  <div className="mt-12 pt-6 border-t border-gray-200">
                    <p className="font-bold text-blue-900 text-2xl">Dr. Alemitu Kebede</p>
                    <p className="text-gray-600 text-lg">Principal & Academic Director</p>
                    <p className="text-sm text-gray-500 mt-1">Tullu Dimtu Secondary School</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          
          <ScrollReveal delay={0.2}>
            <div className="mb-28">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">
                  Our <span className="text-yellow-500">Educational Philosophy</span>
                </h2>
                <div className="w-32 h-1.5 bg-yellow-500 mx-auto rounded-full"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {[
                  {
                    icon: <FaGraduationCap className="text-4xl" />,
                    title: "Academic Excellence",
                    description: "Rigorous curriculum with 98% university placement rate",
                    stats: "25+ National Awards"
                  },
                  {
                    icon: <FaHandshake className="text-4xl" />,
                    title: "Character Development",
                    description: "Leadership programs fostering integrity and social responsibility",
                    stats: "100+ Community Projects"
                  },
                  {
                    icon: <FaUsers className="text-4xl" />,
                    title: "Inclusive Community",
                    description: "Diverse environment where every student thrives",
                    stats: "30+ Student Clubs"
                  }
                ].map((item, index) => (
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
                      {item.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-center text-blue-900 mb-4">{item.title}</h3>
                    <p className="text-gray-700 text-center mb-6">{item.description}</p>
                    <p className="text-yellow-600 font-semibold text-center text-sm">{item.stats}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          
          <ScrollReveal delay={0.4}>
            <div className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-3xl p-14 text-white text-center relative overflow-hidden">
              <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-white/5"></div>
              <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-yellow-400/10"></div>
              
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold mb-8">
                  Experience <span className="text-yellow-300">Tullu Dimtu</span>
                </h2>
                <p className="text-xl mb-12 max-w-3xl mx-auto leading-relaxed">
                  Join our community of learners and discover how we nurture academic excellence, character, and innovation.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-12 py-5 bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold rounded-xl transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                  >
                    <FaChalkboardTeacher />
                     <a href='/'>Schedule a Visit</a>
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-12 py-5 border-2 border-white text-white hover:bg-white/10 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <FaGraduationCap />
                    <a href="/admission" >Apply Now</a>
                  </motion.button>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer/>
    </>
  );
};

export default PrincipalMessage;