import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiSend, FiCheckCircle, FiClock, FiUser, FiMessageSquare } from 'react-icons/fi';
import {  FaGraduationCap } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import Footer from '../components/Footer';
import { Helmet } from "react-helmet-async";


const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const formRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await axios.post('https://tullu-dimtu-school-backend-1.onrender.com/api/contact', formData);
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
      <Helmet>
        <title>Contact | Tulu Dimtu</title>
      </Helmet>

      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-blue-800 to-blue-600 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative container mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            Get in Touch
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90"
          >
            Connect with Tullu Dimtu Secondary School - Your journey to excellence starts here
          </motion.p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Floating Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-blue-100 opacity-10"
              style={{
                width: Math.random() * 120 + 30,
                height: Math.random() * 120 + 30,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, Math.random() * 100 - 50],
                x: [0, Math.random() * 60 - 30],
                opacity: [0.05, 0.15, 0.05],
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
          {/* Contact Information Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16"
          >
            {/* Contact Card 1: Location */}
            <motion.div 
              className=" bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-500"
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-5 rounded-2xl mb-6">
                  <FiMapPin className="text-blue-600 text-4xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Our Campus</h3>
                <p className="text-gray-600 mb-4 text-lg">
                  Tullu Dimtu, Oromia Region<br />
                  Ethiopia
                </p>
                <div className="w-full h-40 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center mt-4">
                  <FaGraduationCap className="text-blue-400 text-5xl" />
                </div>
              </div>
            </motion.div>

            {/* Contact Card 2: Phone */}
            <motion.div 
              className=" bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-500 delay-100"
            
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-gradient-to-br from-green-100 to-teal-100 p-5 rounded-2xl mb-6">
                  <FiPhone className="text-green-600 text-4xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Call Us</h3>
                <p className="text-gray-600 mb-2 text-lg">
                  <span className="font-semibold">Main Office:</span><br />
                  +251 921 225 889
                </p>
                <p className="text-gray-600 text-lg">
                  <span className="font-semibold">Admissions:</span><br />
                  +251 921 225 889
                </p>
                <div className="w-full h-40 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl flex items-center justify-center mt-4">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md mb-3">
                      <FiPhone className="text-green-500 text-2xl" />
                    </div>
                    <p className="text-green-600 font-medium text-sm">Available 24/7</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Card 3: Email */}
            <motion.div 
              className=" bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-500 delay-200"
              
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-5 rounded-2xl mb-6">
                  <FiMail className="text-purple-600 text-4xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Email Us</h3>
                <p className="text-gray-600 mb-2 text-lg">
                  <span className="font-semibold">General Inquiries:</span><br />
                  info@tulludimtu.edu.et
                </p>
                <p className="text-gray-600 text-lg">
                  <span className="font-semibold">Admissions:</span><br />
                  admissions@tulludimtu.edu.et
                </p>
                <div className="w-full h-40 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl flex items-center justify-center mt-4">
                  <FiMail className="text-purple-400 text-5xl" />
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Combined Layout: Contact Form + Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
                <h2 className="text-3xl font-bold mb-2">Send Us a Message</h2>
                <p className="opacity-90">We typically respond within 24 hours</p>
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
                          Thank you for contacting us. We'll get back to you soon.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiUser className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiMail className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Message
                    </label>
                    <div className="relative">
                      <div className="absolute top-4 left-4">
                        <FiMessageSquare className="text-gray-400" />
                      </div>
                      <textarea
                        id="message"
                        name="message"
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg resize-none"
                        placeholder="Tell us how we can help you..."
                      ></textarea>
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex items-center justify-center px-8 py-5 rounded-xl font-semibold text-white text-lg ${
                      isSubmitting ? 'bg-blue-400' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                    } transition-all duration-300 shadow-lg hover:shadow-xl`}
                    whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <FiSend className="mr-3" />
                        Send Message
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>

            {/* Map & Hours Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="space-y-8"
            >
              {/* Map Container */}
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="p-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center">
                    <FiMapPin className="text-blue-600 mr-3" />
                    Our Location
                  </h2>
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
                  </div>
                </div>
              </div>

              {/* Visiting Hours */}
              <div className="bg-white rounded-3xl shadow-2xl p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                  <FiClock className="text-blue-600 mr-3" />
                  Visiting Hours
                </h2>
                <div className="space-y-4">
                  {[
                    { day: 'Monday - Friday', time: '7:30 AM - 4:30 PM' },
                    { day: 'Saturday', time: '8:00 AM - 12:00 PM' },
                    { day: 'Sunday', time: 'Closed' },
                  ].map((schedule, index) => (
                    <motion.div
                      key={schedule.day}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex justify-between items-center py-4 border-b border-gray-100 last:border-0"
                    >
                      <span className="text-lg font-medium text-gray-700">{schedule.day}</span>
                      <span className="text-lg font-semibold text-blue-600">{schedule.time}</span>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-8 p-4 bg-blue-50 rounded-xl">
                  <p className="text-blue-700 text-center">
                    <span className="font-semibold">Note:</span> Please contact us in advance for appointments
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quick Info Banner */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl"
          >
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0 md:mr-8">
                <h3 className="text-2xl font-bold mb-2">Need Immediate Assistance?</h3>
                <p className="opacity-90">Call our emergency line for urgent matters</p>
              </div>
              <div className="flex items-center">
                <FiPhone className="text-3xl mr-4" />
                <div>
                  <p className="text-sm opacity-90">Emergency Contact</p>
                  <p className="text-2xl font-bold">+251 921 225 889</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ContactPage;
