import { useState } from 'react';
import { FaChalkboardTeacher, FaMusic, FaPaintBrush, FaMicroscope, FaLaptopCode, FaUsers, FaCalendarAlt } from 'react-icons/fa';
import { GiBookshelf, GiTeacher, GiSoccerBall } from 'react-icons/gi';
import { MdScience, MdTheaterComedy } from 'react-icons/md';
import { IoIosArrowForward } from 'react-icons/io';
import studentLifeHero from '../assets/studentlife.jpg';
import clubMeeting from '../assets/.jpg';
import sportsDay from '../assets/sport.jpg';
import culturalEvent from '../assets/culture.jpg';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { Helmet } from "react-helmet-async";


// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8 }
  }
};

const slideUp = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6 }
  }
};

const scaleUp = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

const StudentLife = () => {
  const [activeTab, setActiveTab] = useState('clubs');
  const [expandedEvent, setExpandedEvent] = useState(null);

  const studentLifeData = {
    clubs: {
      title: "Student Clubs",
      icon: <FaUsers className="text-3xl text-green-700" />,
      items: [
        {
          name: "Science Club",
          icon: <FaMicroscope className="text-2xl" />,
          description: "Explore scientific concepts through experiments and research projects",
          schedule: "Every Tuesday, 3:30 PM"
        },
        {
          name: "Debate Society",
          icon: <FaChalkboardTeacher className="text-2xl" />,
          description: "Develop public speaking and critical thinking skills",
          schedule: "Every Thursday, 4:00 PM"
        },
        {
          name: "Cultural Arts",
          icon: <FaPaintBrush className="text-2xl" />,
          description: "Celebrate Oromo traditions through art, music, and dance",
          schedule: "Every Monday, 3:00 PM"
        },
        {
          name: "Tech Innovators",
          icon: <FaLaptopCode className="text-2xl" />,
          description: "Learn coding, robotics, and digital creativity",
          schedule: "Every Wednesday, 4:30 PM"
        }
      ]
    },
    events: {
      title: "Annual Events",
      icon: <FaCalendarAlt className="text-3xl text-yellow-600" />,
      items: [
        {
          name: "Cultural Heritage Day",
          date: "March 15, 2024",
          description: "Celebration of Oromo traditions with performances, food, and exhibitions",
          image: culturalEvent
        },
        {
          name: "Science & Innovation Fair",
          date: "May 22, 2026",
          description: "Showcase of student research projects and inventions",
          image: clubMeeting
        },
        {
          name: "Sports Championship",
          date: "July 7-12, 2026",
          description: "Inter-school competitions in football, athletics, and volleyball",
          image: sportsDay
        }
      ]
    },
    leadership: {
      title: "Leadership",
      icon: <GiTeacher className="text-3xl text-blue-600" />,
      items: [
        {
          name: "Student Council",
          description: "Elected representatives who voice student concerns and organize activities"
        },
        {
          name: "Peer Mentors",
          description: "Senior students who guide and support incoming students"
        },
        {
          name: "Community Service Leaders",
          description: "Organize volunteer projects and outreach programs"
        }
      ]
    }
  };

  const testimonials = [
    {
      quote: "The debate club helped me find my voice and confidence to speak in public.",
      author: "Amina Mohammed, Grade 11"
    },
    {
      quote: "Through the science club, I discovered my passion for environmental research.",
      author: "Dawit Abebe, Grade 12"
    },
    {
      quote: "Cultural arts taught me to appreciate our Oromo heritage in new ways.",
      author: "Bontu Tadesse, Grade 10"
    }
  ];

  return (
    <>
    <Helmet>
      <title>Student Life | Tulu Dimtu School</title>
          </Helmet>
      <div className="font-sans min-h-screen bg-gray-50">
       
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="relative h-[90vh] bg-fixed w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${studentLifeHero})`,}}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/40 to-transparent" />
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
            <motion.div 
              variants={slideUp}
              className="text-center text-white px-4"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Student Life <span className='text-yellow-500'>at Tullu Dimtu</span></h1>
              <p className="text-xl md:text-2xl max-w-2xl mx-auto">
                Where learning extends beyond the classroom
              </p>
            </motion.div>
          </div>
        </motion.div>

      
        <div className="container mx-auto px-4 py-12">
         
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-wrap justify-center mb-12 gap-2"
          >
            {Object.keys(studentLifeData).map((tab) => (
              <motion.button
                key={tab}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-full flex items-center transition-all ${activeTab === tab ? 'bg-green-800 text-white' : 'bg-white text-green-800 hover:bg-green-100'}`}
              >
                <span className="mr-2">{studentLifeData[tab].icon}</span>
                {studentLifeData[tab].title}
              </motion.button>
            ))}
          </motion.div>

          
          <section className="mb-16">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {studentLifeData[activeTab].items.map((item, index) => (
                <motion.div 
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {item.image && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="h-48 overflow-hidden"
                    >
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      {item.icon && <div className="mr-3 text-green-700">{item.icon}</div>}
                      <h3 className="text-xl font-bold">{item.name}</h3>
                    </div>
                    {item.date && (
                      <div className="flex items-center text-yellow-600 mb-2">
                        <FaCalendarAlt className="mr-2" />
                        <span>{item.date}</span>
                      </div>
                    )}
                    <p className="text-gray-600 mb-4">{item.description}</p>
                    {item.schedule && (
                      <div className="text-sm text-gray-500">
                        <span className="font-medium">Meeting Time:</span> {item.schedule}
                      </div>
                    )}
                    {activeTab === 'events' && (
                      <motion.button 
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setExpandedEvent(expandedEvent === index ? null : index)}
                        className="mt-4 text-green-800 font-medium flex items-center"
                      >
                        {expandedEvent === index ? 'Show Less' : 'Learn More'}
                        <IoIosArrowForward className={`ml-1 transition-transform ${expandedEvent === index ? 'rotate-90' : ''}`} />
                      </motion.button>
                    )}
                    {expandedEvent === index && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 p-4 bg-green-50 rounded-lg"
                      >
                        <h4 className="font-bold mb-2">Event Details:</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Open to all students and community members</li>
                          <li>Traditional dress encouraged</li>
                          <li>Food and craft vendors</li>
                          <li>Performances throughout the day</li>
                        </ul>
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="mt-3 w-full bg-green-800 text-white py-2 rounded-lg font-medium hover:bg-green-900 transition-colors"
                        >
                           <a href='/form' >Register to Participate</a>
                        </motion.button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Daily Life Section */}
          <motion.section 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={scaleUp}
            className="bg-white rounded-xl shadow-md p-8 mb-16"
          >
            <h2 className="text-3xl font-bold text-center text-green-900 mb-8">
              A Day at <span className="text-yellow-600">Tullu Dimtu</span>
            </h2>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-5 gap-6 text-center"
            >
              {[
                { icon: <GiBookshelf className="text-2xl text-green-800" />, title: "Morning Classes", time: "2:30 AM - 6:30 Am", bg: "bg-green-100" },
                { icon: <FaMusic className="text-2xl text-yellow-600" />, title: "Lunch & Activities", time: "6:30 PM - 7:30 PM", bg: "bg-yellow-100" },
                { icon: <MdScience className="text-2xl text-blue-600" />, title: "Afternoon Classes", time: "7:30 PM - 9:00 PM", bg: "bg-blue-100" },
                { icon: <MdTheaterComedy className="text-2xl text-purple-600" />, title: "Clubs & Sports", time: "9:30 PM - 11:00 PM", bg: "bg-purple-100" },
                { icon: <GiSoccerBall className="text-2xl text-red-600" />, title: "Evening Study", time: "11:30 PM - 2:00 PM", bg: "bg-red-100" }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  className="p-4"
                >
                  <div className={`${item.bg} w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3`}>
                    {item.icon}
                  </div>
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.time}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          {/* Testimonials */}
          <section className="mb-16">
            <motion.h2 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideUp}
              className="text-3xl font-bold text-center text-green-900 mb-8"
            >
              Student <span className="text-yellow-600">Voices</span>
            </motion.h2>
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="grid md:grid-cols-3 gap-8"
            >
              {testimonials.map((testimonial, index) => (
                <motion.div 
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="bg-white p-6 rounded-xl shadow-md"
                >
                  <div className="text-yellow-500 text-4xl mb-4">"</div>
                  <p className="text-gray-700 italic mb-4">{testimonial.quote}</p>
                  <p className="font-medium text-green-800">{testimonial.author}</p>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Call to Action */}
          <motion.section 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={scaleUp}
            className="bg-gradient-to-r from-green-800 to-green-600 text-white rounded-xl p-8 md:p-12 text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Join Our Community?</h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Discover how you can get involved in Tullu Dimtu's vibrant student life
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-green-900 font-bold rounded-lg transition-colors"
              >
                <a href='/studentlife'>Explore Clubs</a>
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white hover:bg-gray-100 text-green-800 font-bold rounded-lg transition-colors"
              >
                  <a href='/form'>Apply</a>
              </motion.button>
            </div>
          </motion.section>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default StudentLife;