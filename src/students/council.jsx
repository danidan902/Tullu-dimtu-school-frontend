import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import counsl from '../assets/bulding.jpg'
import Footer from '../components/Footer';
import life from '../assets/life2.jpg'
import axios from 'axios'
import { toast } from "react-toastify";

const CounselingPage = () => {
    const [ loading, setLoading ] = useState(false);
    const [activeSection, setActiveSection] = useState("welcome");
    const [formData, setFormData] = useState({
      name: "",
      studentId: "",
      concern: "",
      urgency: "medium",
      details: ""
    });
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = async (e) => {
      setLoading(true);
      e.preventDefault();
      try {
        // send data to backend
        const res = await axios.post("https://tullu-dimtu-school-backend.onrender.com/api/concerns", formData);
        console.log("✅ Concern submitted:", res.data);
  
        toast.success("Your counseling request has been submitted successfully!");
  
        // reset form
        setFormData({
          name: "",
          studentId: "",
          concern: "",
          urgency: "medium",
          details: ""
        });
  
        setActiveSection("confirmation");
      } catch (error) {
        toast.error("❌ Error submitting concern:", error);
        toast.error("Something went wrong. Please try again.");
      }

      setLoading(false);
    };
  
    const concerns = [
      { id: "academic", title: "Academic Support", icon: "📚", color: "bg-blue-100 text-blue-600" },
      { id: "career", title: "Career Guidance", icon: "💼", color: "bg-purple-100 text-purple-600" },
      { id: "personal", title: "Personal Issues", icon: "🧠", color: "bg-green-100 text-green-600" },
      { id: "university", title: "University Prep", icon: "🎓", color: "bg-amber-100 text-amber-600" },
      { id: "emergency", title: "Emergency Help", icon: "🆘", color: "bg-red-100 text-red-600" },
    ];

  return (
  <>
  
   <div className="min-h-screen mt-16  bg-gradient-to-br from-indigo-50 to-blue-100">
     

       <motion.div
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: `url(${counsl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/40 to-transparent" />
        </motion.div>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100,
              y: Math.random() * 100,
              opacity: 0.3,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{
              y: [null, (Math.random() - 0.5) * 50],
              x: [null, (Math.random() - 0.5) * 50],
              transition: {
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut'
              }
            }}
            className={`absolute rounded-full ${i % 3 === 0 ? 'bg-indigo-200' : i % 3 === 1 ? 'bg-blue-200' : 'bg-purple-200'}`}
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-20 h-20  rounded-2xl shadow-lg mx-auto mb-3 flex items-center justify-center"
          >
            <span className="text-4xl"></span>
          </motion.div>
          <h1 className="text-4xl text-white font-bold  mb-3">
            Student <span className="text-indigo-600">Counseling</span> Center
          </h1>
          <p className="text-xl text-white">
            Confidential support for your academic and personal growth
          </p>
        </motion.header>


   <motion.section 
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.3 }}
  className="bg-white rounded-3xl shadow-xl overflow-hidden mb-16"
>
  <div className="md:flex">
    <div className="md:w-1/2 bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center min-h-64">
      
      <div className="text-white text-5xl p-10 text-center">
        <span className="block mb-4">
          <img src={life}/>
        </span>
        <p className="text-xl font-medium">Tullu Dimtu Secondary School</p>
      </div>
    </div>
    <div className="md:w-1/2 p-8 md:p-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Wellbeing Matters</h2>
      <p className="text-gray-600 mb-4">
        At Tullu Dimtu Secondary School, we understand that academic success goes hand-in-hand with emotional wellbeing. Our counseling center provides a safe, confidential space where you can discuss any challenges you're facing.
      </p>
      <p className="text-gray-600 mb-6">
        Whether you're struggling with coursework, planning your future, or dealing with personal issues, our professional counselors are here to listen and help you develop strategies for success.
      </p>
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setActiveSection('welcome')}
        className="bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
      >
        Request Counseling Session
      </motion.button>
    </div>
  </div>
</motion.section>


        <AnimatePresence mode='wait'>
        
          {activeSection === 'welcome' && (
            <motion.section
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl shadow-xl overflow-hidden mb-16"
            >
              <div className="p-8 md:p-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">How can we help you today?</h2>
                    <p className="text-gray-600">Select the type of support you need</p>
                  </div>
                  <motion.div
                    whileHover={{ rotate: 15 }}
                    className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center"
                  >
                    <span className="text-xl">👋</span>
                  </motion.div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                  {concerns.map((concern) => (
                    <motion.button
                      key={concern.id}
                      whileHover={{ y: -5, scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setFormData(prev => ({ ...prev, concern: concern.id }));
                        setActiveSection('form');
                      }}
                      className={`${concern.color} rounded-xl p-4 text-center shadow-md hover:shadow-lg transition-all`}
                    >
                      <span className="text-3xl block mb-2">{concern.icon}</span>
                      <span className="font-medium">{concern.title}</span>
                    </motion.button>
                  ))}
                </div>

                
                <div className="bg-indigo-50 rounded-xl p-6 mb-8">
                  <div className="md:flex items-center">
                    <div className="md:w-1/3 mb-4 md:mb-0 md:pr-6">
                      <div className="bg-gradient-to-br from-blue-500 to-indigo-700 rounded-xl aspect-square flex items-center justify-center text-white text-7xl">
                        👩‍🏫
                      </div>
                    </div>
                    <div className="md:w-2/3">
                      <h3 className="text-xl font-bold text-gray-800 mb-3">Meet Our Professional Counselors</h3>
                      <p className="text-gray-600 mb-3">
                        Our team consists of qualified professionals with expertise in educational psychology, career guidance, and adolescent development. They provide evidence-based support tailored to your individual needs.
                      </p>
                      <p className="text-gray-600">
                        All counseling sessions are confidential and conducted in a safe, non-judgmental environment.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                    <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">!</span>
                    Need immediate help?
                  </h3>
                  <p className="text-gray-600 mb-3">
                    If you're in crisis or need urgent support, please contact:
                  </p>
                  <button 
                    onClick={() => {
                      setFormData(prev => ({ ...prev, concern: 'emergency', urgency: 'high' }));
                      setActiveSection('form');
                    }}
                    className="w-full bg-red-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center justify-center"
                  >
                    <span className="mr-2">🆘</span> Emergency Assistance
                  </button>
                </div>
              </div>
            </motion.section>
          )}

         
          {activeSection === 'form' && (
            <motion.section
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl shadow-xl overflow-hidden mb-16"
            >
              <div className="p-8 md:p-10">
                <button 
                  onClick={() => setActiveSection('welcome')}
                  className="flex items-center text-indigo-600 mb-6"
                >
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back
                </button>

                <div className="md:flex items-start mb-8">
                  <div className="md:w-1/2 md:pr-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Request Counseling Session</h2>
                    <p className="text-gray-600 mb-4">
                      Complete this form to schedule a confidential session with one of our counselors. We'll respond within 24 hours to confirm your appointment.
                    </p>
                    <div className="bg-blue-50 rounded-xl p-4 mb-6">
                      <h4 className="font-medium text-gray-800 mb-2">What to expect:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          <span>50-minute confidential session</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          <span>Personalized support</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          <span>Follow-up resources</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="md:w-1/2 bg-gradient-to-br from-green-100 to-blue-100 rounded-xl p-6 flex items-center justify-center min-h-48">
                    <motion.div
                      animate={{ 
                        rotate: [0, 10, -10, 0],
                        transition: { repeat: Infinity, duration: 2 }
                      }}
                      className="text-6xl"
                    >
                      ✏️
                    </motion.div>
                  </div>
                </div>

               


<form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
  <div className="space-y-8 mb-8">
   
    <div className="text-center mb-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Counseling Request</h2>
      <p className="text-gray-600">Please fill out this form to schedule your session</p>
    </div>

   
    <div className="relative group">
      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 ml-1">Full Name</label>
      <div className="relative">
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 shadow-sm group-hover:shadow-md"
          placeholder="John Doe"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>

   
    <div className="relative group">
      <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1 ml-1">Student ID</label>
      <div className="relative">
        <input
          type="text"
          id="studentId"
          name="studentId"
          value={formData.studentId}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 shadow-sm group-hover:shadow-md"
          placeholder="12345678"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
          </svg>
        </div>
      </div>
    </div>

    
    <div className="relative group">
      <label htmlFor="concern" className="block text-sm font-medium text-gray-700 mb-1 ml-1">Type of Concern</label>
      <div className="relative">
        <select
          id="concern"
          name="concern"
          value={formData.concern}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none transition-all duration-200 shadow-sm group-hover:shadow-md bg-white"
        >
          <option value="">Select concern type</option>
          {concerns.map(concern => (
            <option key={concern.id} value={concern.id}>{concern.title}</option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>

   
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">Urgency Level</label>
      <div className="grid grid-cols-3 gap-3">
        {[
          { value: 'low', label: 'Low', color: 'bg-green-50 text-green-800', icon: 'M5 12a7 7 0 1114 0 7 7 0 01-14 0z' },
          { value: 'medium', label: 'Medium', color: 'bg-amber-50 text-amber-800', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
          { value: 'high', label: 'High', color: 'bg-red-50 text-red-800', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' }
        ].map(option => (
          <motion.label
            key={option.value}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className={`${option.color} ${
              formData.urgency === option.value 
                ? 'ring-2 ring-offset-1 ring-indigo-500 shadow-md' 
                : 'shadow-sm'
            } rounded-xl p-4 text-center cursor-pointer transition-all duration-200 flex flex-col items-center`}
          >
            <input
              type="radio"
              name="urgency"
              value={option.value}
              checked={formData.urgency === option.value}
              onChange={handleInputChange}
              className="sr-only"
            />
            <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={option.icon} />
            </svg>
            {option.label}
          </motion.label>
        ))}
      </div>
    </div>

    
    <div className="relative group">
      <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1 ml-1">Details (Optional)</label>
      <textarea
        id="details"
        name="details"
        rows="5"
        value={formData.details}
        onChange={handleInputChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 shadow-sm group-hover:shadow-md resize-none"
        placeholder="Please share any details that might help us prepare for your session..."
      ></textarea>
      <div className="absolute bottom-3 right-3 text-xs text-gray-400">
        {formData.details.length}/500
      </div>
    </div>
  </div>

  
  <div className="flex items-start mb-8">
    <div className="flex items-center h-5">
      <input
        type="checkbox"
        id="consent"
        name="consent"
        required
        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
      />
    </div>
    <label htmlFor="consent" className="ml-3 text-sm text-gray-700">
      I understand this service is confidential (except in cases of risk of harm)
    </label>
  </div>

  {/* Submit Button */}
  <motion.button
    type="submit"
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-medium hover:shadow-lg transition-all duration-300 shadow-md flex items-center justify-center"
  
    >
    <span>Submit Request</span>
    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
    </svg>
  </motion.button>
</form>

              </div>
            </motion.section>
          )}

          {/* Confirmation Section */}
          {activeSection === 'confirmation' && (
            <motion.section
              key="confirmation"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl shadow-xl overflow-hidden text-center p-12 mb-16"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 10, -10, 0],
                  transition: { duration: 1.5 }
                }}
                className="w-24 h-24 bg-green-100 rounded-2xl mx-auto mb-8 flex items-center justify-center"
              >
                <span className="text-5xl">✅</span>
              </motion.div>
              
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Request Received!</h2>
              <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
                Thank you for reaching out. A counselor will contact you within 24 hours to schedule your session.
              </p>
              
              <div className="bg-blue-50 rounded-xl p-6 mb-8 text-left max-w-2xl mx-auto">
                <h3 className="font-bold text-gray-800 mb-3">What to expect next:</h3>
                <ul className="space-y-2">
                  <motion.li 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-start"
                  >
                    <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0">1</span>
                    <span>You'll receive a confirmation email with next steps</span>
                  </motion.li>
                  <motion.li 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-start"
                  >
                    <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0">2</span>
                    <span>A counselor will contact you to schedule a meeting time</span>
                  </motion.li>
                  <motion.li 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-start"
                  >
                    <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0">3</span>
                    <span>Prepare any questions or topics you'd like to discuss</span>
                  </motion.li>
                </ul>
              </div>

              {/* Additional Resources Section */}
              <div className="bg-indigo-50 rounded-xl p-6 mb-8 max-w-2xl mx-auto">
                <h3 className="font-bold text-gray-800 mb-3 text-center">While You Wait</h3>
                <p className="text-gray-600 mb-4 text-center">
                  Explore these resources that might be helpful:
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { title: "Study Tips", icon: "📖" },
                    { title: "Stress Relief", icon: "🧘‍♂️" },
                    { title: "Career Tests", icon: "🔍" },
                    { title: "Self-Care", icon: "💖" }
                  ].map((item, index) => (
                    <motion.div
                      key={item.title}
                      whileHover={{ y: -3 }}
                      className="bg-white rounded-lg p-3 text-center shadow-sm hover:shadow-md transition-all"
                    >
                      <span className="text-2xl block mb-1">{item.icon}</span>
                      <span className="text-sm font-medium">{item.title}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <motion.button
                onClick={() => setActiveSection('welcome')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-indigo-600 text-white py-3 px-8 rounded-lg font-medium hover:bg-indigo-700 transition-colors inline-flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Request
              </motion.button>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Testimonial Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden mb-16"
        >
          <div className="md:flex">
            <div className="md:w-1/3 bg-gradient-to-br from-purple-500 to-indigo-700 p-8 flex items-center justify-center">
              <div className="text-white text-center">
                <span className="text-6xl block mb-4">🌟</span>
                <h3 className="text-xl font-bold mb-2">Student Testimonials</h3>
                <p>Hear from your peers</p>
              </div>
            </div>
            <div className="md:w-2/3 p-8">
              <div className="space-y-6">
                <div className="border-l-4 border-indigo-500 pl-4">
                  <p className="text-gray-600 italic mb-2">
                    "The counseling center helped me improve my study habits and manage exam stress. I went from C's to A's in just one semester!"
                  </p>
                  <p className="text-gray-800 font-medium">- Alemitu, Grade 11</p>
                </div>
                <div className="border-l-4 border-indigo-500 pl-4">
                  <p className="text-gray-600 italic mb-2">
                    "I was unsure about my career path, but after talking with the counselor, I now have a clear plan for university applications."
                  </p>
                  <p className="text-gray-800 font-medium">- Tewodros, Grade 12</p>
                </div>
                <div className="border-l-4 border-indigo-500 pl-4">
                  <p className="text-gray-600 italic mb-2">
                    "The personal counseling sessions gave me tools to handle anxiety and build better relationships with my classmates."
                  </p>
                  <p className="text-gray-800 font-medium">- Selam, Grade 10</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      
      </div>
    </div>
  
<Footer/>

  </> 
  );
};

export default CounselingPage;
