import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaRunning, FaFutbol, FaVolleyballBall, FaTrophy, FaMedal } from 'react-icons/fa';
import { GiSoccerBall, GiTennisBall } from 'react-icons/gi';
import { MdSportsHandball } from 'react-icons/md';
import { IoMdStopwatch } from 'react-icons/io';
import teamPhoto from '../assets/bascket1.jpg';
import matchAction from '../assets/stadium.jpg';
import trophy from '../assets/hand1.jpg';
import Trophy1 from '../assets/bascket2.jpg';
import Prinsipal1 from '../assets/tennis.jpg';
import Footer from '../components/Footer';
import tennis from '../assets/foot2.jpg';
import foot1 from '../assets/foot1.jpg'


const fadeUp = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const scaleIn = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "backOut"
    }
  }
};

const rotateIn = {
  hidden: { rotate: -5, opacity: 0 },
  visible: {
    rotate: 0,
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: "easeOut"
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const TulluDimtuSportsClub = () => {
  const [activeTab, setActiveTab] = useState('football');
  const [showGallery, setShowGallery] = useState(false);

  const sportsData = {
    football: {
      title: "Football Team",
      icon: <FaFutbol className="text-4xl" />,
      description: "Our football team competes in regional school tournaments and has won the Oromia Inter-School Championship three times. We emphasize teamwork, discipline, and sportsmanship.",
      achievements: [
        "2023 Regional Champions",
        "2022 Fair Play Award",
        "2019 Tournament Finalists"
      ],
      schedule: [
        { day: "Monday", time: "4:00 PM", activity: "Skills Training" },
        { day: "Wednesday", time: "4:00 PM", activity: "Tactical Session" },
        { day: "Friday", time: "3:30 PM", activity: "Friendly Match" }
      ]
    },
    athletics: {
      title: "Athletics Program",
      icon: <FaRunning className="text-4xl" />,
      description: "Our athletics program develops speed, endurance, and jumping skills. Many of our athletes have progressed to national-level competitions in middle and long-distance running.",
      achievements: [
        "2023 Cross Country Regional Winners",
        "5 students selected for National Youth Athletics",
        "School record in 1500m (4:12)"
      ],
      schedule: [
        { day: "Tuesday", time: "5:00 AM", activity: "Morning Run" },
        { day: "Thursday", time: "4:30 PM", activity: "Track Training" },
        { day: "Saturday", time: "7:00 AM", activity: "Hill Training" }
      ]
    },
    volleyball: {
      title: "HandBall Team",
      icon: <FaVolleyballBall className="text-4xl" />,
      description: "At Tullu Dimtu Secondary School, handball promotes physical fitness, discipline, and team spirit among students. It also helps build important skills such as coordination, quick thinking, and communication. Handball is not only a fun and exciting sport but also a great way to stay active and healthy.",
      achievements: [
        "2023 Undefeated Season",
        "Best Setter Award 2022",
        "3 players in Regional Youth Team"
      ],
      schedule: [
        { day: "Monday", time: "5:00 PM", activity: "Serve Practice" },
        { day: "Wednesday", time: "5:00 PM", activity: "Game Strategy" },
        { day: "Saturday", time: "9:00 AM", activity: "Strength Training" }
      ]
    }
  };

  const allSports = [
    { id: 'football', name: 'Football', icon: <GiSoccerBall /> },
    { id: 'athletics', name: 'Athletics', icon: <FaRunning /> },
    { id: 'volleyball', name: 'Handball', icon: <MdSportsHandball /> },
    { id: 'tennis', name: 'Tennis', icon: <GiTennisBall /> },
  ];

  const upcomingEvents = [
    { date: "15 Oct 2023", event: "Inter-School Football Tournament", time: "9:00 AM" },
    { date: "22 Oct 2023", event: "Regional Athletics Meet", time: "7:00 AM" },
    { date: "5 Nov 2023", event: "Volleyball Championship Finals", time: "2:00 PM" },
    { date: "12 Nov 2023", event: "Sports Day Celebration", time: "8:00 AM" }
  ];

  const galleryImages = [
    teamPhoto,
    matchAction,
    trophy,
    Trophy1,
    Prinsipal1,
    tennis,
    foot1
  ];
 

  return (
    <>
      <div className="font-sans min-h-screen">
        
        <div 
          className="relative h-[90vh] bg-fixed w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${matchAction})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/40 to-transparent" />
          <div className="relative z-10 h-full flex items-center justify-center">
            <div className="container mx-auto px-4 text-center">
              <motion.h1 
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="text-4xl md:text-5xl font-bold mb-4 text-white"
              >
                Tullu Dimtu <span className="text-yellow-400">Sports Club</span>
              </motion.h1>
              <motion.p 
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                transition={{ delay: 0.2 }}
                className="text-xl text-white max-w-3xl mx-auto"
              >
                Developing champions on the field and in life through sports education and competition
              </motion.p>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={scaleIn}
                transition={{ delay: 0.4 }}
                className="mt-8"
              >
                <button className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg shadow-lg transform hover:scale-105 transition-all">
                   <a href='/register' >Join Our Team</a>
                </button>
              </motion.div>
            </div>
          </div>
        </div>

        
        <div className="container mx-auto px-4 py-12">
          
          <section className="mb-16">
            <motion.h2 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={rotateIn}
              className="text-3xl font-bold text-center text-green-900 mb-8"
            >
              Our <span className="text-yellow-600">Sports Programs</span>
            </motion.h2>
            
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="flex overflow-x-auto pb-2 mb-8 scrollbar-hide"
            >
              <div className="flex space-x-2 mx-auto">
                {allSports.map((sport, index) => (
                  <motion.button
                    key={sport.id}
                    variants={scaleIn}
                    whileHover={{ y: -5, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab(sport.id)}
                    className={`px-6 py-3 rounded-full flex items-center space-x-2 transition-all ${activeTab === sport.id ? 'bg-green-800 text-white' : 'bg-white text-green-800 hover:bg-green-100'}`}
                  >
                    <span className="text-lg">{sport.icon}</span>
                    <span>{sport.name}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
            {sportsData[activeTab] && (
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="md:flex">
                  <motion.div 
                    variants={rotateIn}
                    className="md:w-1/3 bg-green-800 text-white p-8 flex flex-col items-center justify-center"
                  >
                    <motion.div 
                      whileHover={{ rotate: 10 }}
                      className="mb-4 text-yellow-400"
                    >
                      {sportsData[activeTab].icon}
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-4 text-center">{sportsData[activeTab].title}</h3>
                    <div className="bg-green-700 p-4 rounded-lg w-full">
                      <h4 className="font-semibold mb-2 flex items-center">
                        <FaTrophy className="mr-2" /> Achievements
                      </h4>
                      <ul className="space-y-1">
                        {sportsData[activeTab].achievements.map((item, index) => (
                          <motion.li 
                            key={index}
                            initial={{ x: -20, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="flex items-start"
                          >
                            <FaMedal className="text-yellow-400 mr-2 mt-1 flex-shrink-0" />
                            <span>{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                  <motion.div 
                    variants={fadeUp}
                    transition={{ delay: 0.2 }}
                    className="md:w-2/3 p-8"
                  >
                    <p className="text-lg mb-6">{sportsData[activeTab].description}</p>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                      <motion.div variants={fadeUp}>
                        <h4 className="font-bold text-green-800 mb-3 flex items-center">
                          <IoMdStopwatch className="mr-2" /> Training Schedule
                        </h4>
                        <ul className="space-y-3">
                          {sportsData[activeTab].schedule.map((session, index) => (
                            <motion.li 
                              key={index}
                              initial={{ y: 20, opacity: 0 }}
                              whileInView={{ y: 0, opacity: 1 }}
                              transition={{ delay: index * 0.1 }}
                              viewport={{ once: true }}
                              className="bg-green-50 p-3 rounded-lg"
                            >
                              <div className="font-medium">{session.day}</div>
                              <div className="text-sm text-gray-600">{session.time} - {session.activity}</div>
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                      <motion.div 
                        variants={scaleIn}
                        transition={{ delay: 0.3 }}
                      >
                        <motion.div 
                          whileHover={{ scale: 1.02 }}
                          className="h-48 bg-gray-200 rounded-lg overflow-hidden"
                        >
                          <img 
                            src={activeTab === 'football' ? matchAction : 
                                 activeTab === 'volleyball' ? teamPhoto : 
                                 trophy} 
                            alt={sportsData[activeTab].title}
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                        <motion.button 
                          whileHover={{ x: 5 }}
                          onClick={() => setShowGallery(true)}
                          className="mt-3 text-sm text-green-800 font-medium hover:underline"
                        >
                          View more photos →
                        </motion.button>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </section>

          {/* Upcoming Events */}
          <section className="mb-16">
            <motion.h2 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={rotateIn}
              className="text-3xl font-bold text-center text-green-900 mb-8"
            >
              Upcoming <span className="text-yellow-600">Sports Events</span>
            </motion.h2>
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {upcomingEvents.map((event, index) => (
                <motion.div 
                  key={index}
                  variants={scaleIn}
                  whileHover={{ y: -10, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                >
                  <div className="bg-green-800 text-white p-4 text-center">
                    <div className="text-xl font-bold">{event.date.split(' ')[0]}</div>
                    <div className="text-sm">{event.date.split(' ').slice(1).join(' ')}</div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2">{event.event}</h3>
                    <div className="flex items-center text-gray-600">
                      <IoMdStopwatch className="mr-2" />
                      <span>{event.time}</span>
                    </div>
                  <a href='/register'>
                      <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg font-medium transition-colors"
                    >
                       Register Team
                    </motion.button>
                    
                  </a>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Sports Gallery Preview */}
          <section>
            <motion.h2 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={rotateIn}
              className="text-3xl font-bold text-center text-green-900 mb-8"
            >
              Sports <span className="text-yellow-600">Gallery</span>
            </motion.h2>
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {galleryImages.slice(0, 4).map((image, index) => (
                <motion.div 
                  key={index}
                  variants={fadeUp}
                  whileHover={{ scale: 1.05 }}
                  className="relative group cursor-pointer"
                  onClick={() => setShowGallery(true)}
                >
                  <img 
                    src={image} 
                    alt={`Sports gallery ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white font-medium">View</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            <div className="text-center mt-6">
              <motion.button 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={scaleIn}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowGallery(true)}
                className="px-6 py-3 bg-green-800 hover:bg-green-900 text-white rounded-lg font-medium transition-colors"
              >
                View Full Gallery
              </motion.button>
            </div>
          </section>
        </div>

        {/* Gallery Modal */}
        {showGallery && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-6xl">
              <motion.button 
                whileHover={{ rotate: 90 }}
                onClick={() => setShowGallery(false)}
                className="absolute top-4 right-4 text-white text-4xl z-10 hover:text-yellow-400 transition-transform"
              >
                &times;
              </motion.button>
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-lg overflow-hidden"
              >
                <div className="p-4 bg-green-800 text-white">
                  <h3 className="text-xl font-bold">Tullu Dimtu Sports Gallery</h3>
                </div>
                <motion.div 
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.1
                      }
                    }
                  }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 max-h-[80vh] overflow-y-auto"
                >
                  {galleryImages.map((image, index) => (
                    <motion.div 
                      key={index}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 }
                      }}
                      whileHover={{ scale: 1.03 }}
                      className="overflow-hidden rounded-lg"
                    >
                      <img 
                        src={image} 
                        alt={`Sports gallery ${index + 1}`}
                        className="w-full h-64 object-cover transition-transform cursor-pointer"
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>

      <Footer/>
    </>
  );
};

export default TulluDimtuSportsClub;
