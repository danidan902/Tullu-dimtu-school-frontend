import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiSend, FiCheckCircle, FiClock, FiUser, FiMessageSquare } from 'react-icons/fi';
import { FaSchool, FaGraduationCap } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import schoolImage from '../assets/bulding.jpg';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('contact');
  const formRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await axios.post('http://localhost:5001/api/contact', formData);
      toast.success(res.data.message);
      setFormData({ name: '', email: '', message: '' });
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const elements = document.querySelectorAll('.float-element');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-float');
        }
      });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
    return () => elements.forEach(el => observer.unobserve(el));
  }, []);

  return (
    <>
    
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
                  <motion.div
                            initial={{ scale: 1.2 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className="absolute inset-0 bg-cover bg-center bg-fixed"
                            style={{ backgroundImage: `url(${schoolImage})` }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/40 to-transparent" />
                          </motion.div>
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-indigo-100 opacity-20"
            style={{
              width: Math.random() * 120 + 30,
              height: Math.random() * 120 + 30,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              x: [0, Math.random() * 60 - 30],
              opacity: [0.1, 0.25, 0.1],
            }}
            transition={{
              duration: Math.random() * 15 + 15,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
       
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut'
            }}
            className="inline-block mb-3"
          >
           
          </motion.div>
          <h1 className="text-5xl font-extrabold text-gray-900 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Contact Our School
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're here to help you with any questions about admissions, programs, or school life at Tullu Dimtu Secondary.
          </p>
        </motion.div>

        {/* Tab navigation */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white rounded-full p-1 shadow-md">
            <button
              onClick={() => setActiveTab('contact')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === 'contact' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:text-indigo-600'}`}
            >
              Contact Info
            </button>
            <button
              onClick={() => setActiveTab('form')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === 'form' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:text-indigo-600'}`}
            >
              Send Message
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === 'map' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:text-indigo-600'}`}
            >
              Location Map
            </button>
          </div>
        </div>

        {/* Content based on active tab */}
        <AnimatePresence mode="wait">
          {activeTab === 'contact' && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <motion.div 
                className="float-element bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-500"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-start mb-6">
                  <div className="bg-indigo-100 p-3 rounded-xl mr-4">
                    <FiMapPin className="text-indigo-600 text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Our Campus</h3>
                    <p className="text-gray-600">Tullu Dimtu, Oromia Region</p>
                    <p className="text-gray-600">Ethiopia</p>
                  </div>
                </div>
                <div className="h-40 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                  <FaGraduationCap className="text-indigo-400 text-5xl" />
                </div>
              </motion.div>

              <motion.div 
                className="float-element bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-500 delay-100"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-start mb-6">
                  <div className="bg-green-100 p-3 rounded-xl mr-4">
                    <FiPhone className="text-green-600 text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Call Us</h3>
                    <p className="text-gray-600">Main Office: +251 921 225 889</p>
                    <p className="text-gray-600">Admissions: +251 921 225 889</p>
                  </div>
                </div>
                <div className="h-40 bg-gradient-to-r from-green-100 to-teal-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md mb-3">
                      <FiPhone className="text-green-500 text-2xl" />
                    </div>
                    <p className="text-green-600 font-medium">24/7 Support Line</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="float-element bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-500 delay-200"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-start mb-6">
                  <div className="bg-purple-100 p-3 rounded-xl mr-4">
                    <FiMail className="text-purple-600 text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Email Us</h3>
                    <p className="text-gray-600">info@tulludimtu.edu.et</p>
                    <p className="text-gray-600">admissions@tulludimtu.edu.et</p>
                  </div>
                </div>
                <div className="h-40 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                  <div className="animate-envelope">
                    <svg width="60" height="48" viewBox="0 0 60 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M54 0H6C2.68629 0 0 2.68629 0 6V42C0 45.3137 2.68629 48 6 48H54C57.3137 48 60 45.3137 60 42V6C60 2.68629 57.3137 0 54 0Z" fill="#EDE9FE"/>
                      <path d="M30 27.88L54 9V6C54 2.68629 51.3137 0 48 0H12C8.68629 0 6 2.68629 6 6V9L30 27.88Z" fill="#DDD6FE"/>
                      <path d="M6 9V42C6 45.3137 8.68629 48 12 48H48C51.3137 48 54 45.3137 54 42V9L30 27.88L6 9Z" fill="#C4B5FD"/>
                    </svg>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
                  <h2 className="text-3xl font-bold mb-2">Get in Touch</h2>
                  <p className="opacity-90">We'll respond to your message within 24 hours</p>
                </div>
                
                <div className="p-8">
                  <AnimatePresence>
                    {submitSuccess && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200 flex items-start"
                      >
                        <FiCheckCircle className="text-green-500 text-xl mr-3 mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-medium text-green-800">Message Sent Successfully!</h3>
                          <p className="text-green-600 text-sm mt-1">
                            Thank you for contacting Tullu Dimtu Secondary School. Our team will get back to you soon.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiUser className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiMail className="text-gray-400" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Message
                      </label>
                      <div className="relative">
                        <div className="absolute top-3 left-3">
                          <FiMessageSquare className="text-gray-400" />
                        </div>
                        <textarea
                          id="message"
                          name="message"
                          rows="5"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                          placeholder="Tell us how we can help..."
                        ></textarea>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full flex items-center justify-center px-6 py-4 rounded-xl font-medium text-white ${isSubmitting ? 'bg-indigo-400' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'} transition-all duration-300 shadow-md`}
                        whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                        whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending Your Message...
                          </>
                        ) : (
                          <>
                            <FiSend className="mr-2" />
                            Send Message
                          </>
                        )}
                      </motion.button>
                    </motion.div>
                  </form>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'map' && (
            <motion.div
              key="map"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Our Location</h2>
                <p className="text-gray-600 mb-6">Visit our campus in Tullu Dimtu</p>
                
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/3">
                    <div className="bg-indigo-50 rounded-xl p-6 h-full">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <FiMapPin className="text-indigo-600 mr-2" />
                        Campus Address
                      </h3>
                      <p className="text-gray-700 mb-6">Tullu Dimtu Secondary School<br/>Oromia Region, Ethiopia<br/>P.O. Box 1234</p>
                      
                      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <FiClock className="text-indigo-600 mr-2" />
                        Visiting Hours
                      </h3>
                      <div className="space-y-2 text-gray-700">
                        <div className="flex justify-between">
                          <span>Monday - Friday</span>
                          <span className="font-medium">7:30 AM - 4:30 PM</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Saturday</span>
                          <span className="font-medium">8:00 AM - 12:00 PM</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Sunday</span>
                          <span className="font-medium">Closed</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="md:w-2/3">
  <div className="h-96 rounded-xl overflow-hidden relative">
    
    <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3958.1221508593304!2d38.8226041!3d8.8718506!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b77a96983ae91%3A0x34fd65815773fa9d!2sTulu%20Dimtu%20Secondary%20And%20Preparatory%20School!5e0!3m2!1sen!2set!4v1699023484420!5m2!1sen!2set"
      width="100%"
      height="100%"
      style={{ border: 0 }}
      allowFullScreen=""
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className="rounded-xl"
      title="Tullu Dimtu Secondary School Location"
    ></iframe>
    
    {/* Map overlay with school info */}
    <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 px-4 py-3 rounded-lg shadow-md">
      <div className="flex items-center">
        <FiMapPin className="text-red-500 text-xl mr-2" />
        <div>
          <h3 className="font-bold text-gray-800">Tullu Dimtu Secondary School</h3>
          <p className="text-sm text-gray-600">Oromia Region, Ethiopia</p>
        </div>
      </div>
    </div>
  </div>
</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating animation styles */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-envelope {
          animation: float 4s ease-in-out infinite;
        }
        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </div>
    

    </>
  );
};

export default ContactPage;