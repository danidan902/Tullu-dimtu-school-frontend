import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import bulding from '../assets/por.jpg'
import Footer from '../components/Footer';
import { Helmet } from "react-helmet-async";
const TulluDimtuSchoolRules = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [isHovering, setIsHovering] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const rules = {
    general: [
      {
        title: "School Hours",
        content: "All students must arrive by 7:45 AM. Latecomers will need a valid reason and parent note. School ends at 3:30 PM except on early dismissal days."
      },
      {
        title: "Attendance Policy",
        content: "Regular attendance is mandatory. Absences require written explanation from parents/guardians. More than 5 unexcused absences may result in disciplinary action."
      },
      {
        title: "Uniform Requirements",
        content: "Complete school uniform must be worn properly at all times. This includes proper shoes, tucked-in shirts, and school ID visibly displayed."
      }
    ],
    academics: [
      {
        title: "Homework Policy",
        content: "Homework must be completed and submitted on time. Late submissions will receive grade penalties. Plagiarism results in automatic zero."
      },
      {
        title: "Examination Rules",
        content: "No talking during exams. All materials must be put away unless specified. Cheating results in exam disqualification and disciplinary action."
      },
      {
        title: "Grading System",
        content: "Grades are based on exams (60%), assignments (25%), and participation (15%). Report cards are issued quarterly with parent-teacher conferences."
      }
    ],
    conduct: [
      {
        title: "Behavior Expectations",
        content: "Respect for all staff and students is required. Bullying, harassment, or violence will not be tolerated. Disruptive behavior affects classroom learning."
      },
      {
        title: "Disciplinary Actions",
        content: "Progressive discipline includes warnings, detention, suspension, and possible expulsion for severe/repeated violations. Parents will be notified."
      },
      {
        title: "Electronic Devices",
        content: "Phones must be turned off and kept in lockers during school hours. Emergency exceptions require administrative approval. Confiscation may occur."
      }
    ],
    facilities: [
      {
        title: "Library Rules",
        content: "Silence must be maintained. Books must be checked out properly. Damage/loss results in replacement fees. No food or drinks allowed."
      },
      {
        title: "Computer Lab",
        content: "No unauthorized software or websites. Equipment must be treated carefully. Printing is for schoolwork only. Internet use is monitored."
      },
      {
        title: "Cafeteria Policy",
        content: "Queue orderly. Clean your eating area. No sharing of food due to allergies. Outside food must meet nutritional guidelines."
      }
    ]
  };

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const cardVariants = {
    hover: { 
      scale: 1.03,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { duration: 0.3 }
    },
    tap: { scale: 0.98 }
  };

  return (
   <>
    <Helmet>
      <title>Community | Tullu Dimtu Secondary School</title>
      </Helmet>

    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="relative   h-[90vh] w-full overflow-hidden bg-fixed">
        <motion.div
                 initial={{ scale: 1.2 }}
                 animate={{ scale: 1 }}
                 transition={{ duration: 1.2, ease: "easeOut" }}
                 className="absolute inset-0 bg-cover bg-center bg-fixed"
                 style={{ backgroundImage: `url(${bulding})` }}
               >
                 <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/40 to-transparent" />
               </motion.div>
        
        
        <div className="absolute inset-0 bg-indigo-900 bg-opacity-10 z-1"></div>
        
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 h-full flex flex-col justify-center items-center text-white"
        >
          <h1 className="text-4xl font-extrabold sm:text-5xl sm:tracking-tight lg:text-6xl text-center">
            Tullu Dimtu <span className='text-yellow-600'>Secondary School</span>
          </h1>
          <div className='bg-yellow-600 mx-auto h-1 w-60'></div>
          <p className="mt-2 text-xl">
            Rules, Policies & Behavioral Guidelines
          </p>
        </motion.div>
      </div>

      
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto -mt-10">
        <div className="flex flex-wrap justify-center mb-10 gap-2">
          {['general', 'academics', 'conduct', 'facilities'].map((tab) => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-full font-medium text-sm sm:text-base capitalize transition-all duration-300 ${
                activeTab === tab 
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
              }`}
            >
              {tab}
            </motion.button>
          ))}
        </div>

       
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={tabVariants}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {rules[activeTab].map((rule, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
                onMouseEnter={() => setIsHovering(index)}
                onMouseLeave={() => setIsHovering(null)}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-lg mr-4 ${
                      activeTab === 'general' ? 'bg-blue-100 text-blue-600' :
                      activeTab === 'academics' ? 'bg-green-100 text-green-600' :
                      activeTab === 'conduct' ? 'bg-red-100 text-red-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        {index === 0 ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        ) : index === 1 ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        )}
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{rule.title}</h3>
                  </div>
                  <motion.p 
                    className="text-gray-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {rule.content}
                  </motion.p>
                </div>
                {isHovering === index && (
                  <motion.div 
                    className={`h-1 w-full ${
                      activeTab === 'general' ? 'bg-blue-500' :
                      activeTab === 'academics' ? 'bg-green-500' :
                      activeTab === 'conduct' ? 'bg-red-500' :
                      'bg-purple-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
 
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 bg-white rounded-xl shadow-lg p-8 border border-gray-200"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Philosophy</h2>
          <p className="text-gray-600 mb-6">
            At Tullu Dimtu Secondary School, we believe that clear rules and consistent policies create an environment where all students can thrive. Our guidelines are designed to promote academic excellence, personal responsibility, and mutual respect among all members of our school community.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Parental Involvement</h3>
              <p className="text-gray-600">
                We encourage parents to review these policies with their children and reinforce them at home. Regular communication between school and home is essential for student success. Parent-teacher meetings are held quarterly to discuss student progress and address any concerns.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Continuous Improvement</h3>
              <p className="text-gray-600">
                Our policies are reviewed annually to ensure they remain relevant and effective. We welcome feedback from students, parents, and staff through our policy review committee. Changes are communicated clearly before implementation.
              </p>
            </div>
          </div>
        </motion.div>

       
      </div>
    </div>
   
   <Footer/>
   
   </>
  );
};

export default TulluDimtuSchoolRules;