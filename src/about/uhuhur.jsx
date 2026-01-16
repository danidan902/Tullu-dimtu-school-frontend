  <section className="py-20 bg-gradient-to-br from-blue-900 to-purple-900 overflow-hidden">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Our <span className="text-yellow-300">Student Life Program</span>
              </h2>
              <p className="text-white/80 text-lg max-w-2xl mx-auto">
                Discover our exceptional academic offerings through this interactive showcase
              </p>
            </div>
          </ScrollReveal>

          {/* Crazy Interactive Carousel Container */}
          <div className="relative h-[700px] md:h-[700px] mb-12 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-800/20 to-purple-800/20 backdrop-blur-sm border border-white/10">
            {/* Background Elements - Crazy Effects */}
            <div className="absolute inset-0">
              {/* Floating shapes */}
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-yellow-400/10 rounded-full blur-md animate-float-slow"></div>
              <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-blue-400/10 rounded-full blur-md animate-float-slower"></div>
              <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-purple-400/10 rounded-full blur-md animate-float"></div>
              
              {/* Grid pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="grid grid-cols-12 grid-rows-12 h-full">
                  {Array.from({ length: 144 }).map((_, i) => (
                    <div key={i} className="border border-white/5"></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Carousel */}
            <div 
              ref={carouselRef}
              className="relative h-full flex items-center justify-center px-4 md:px-12"
            >
              {animationCard.map((card, index) => {
                // Calculate position based on active index
                const position = index - activeCardIndex;
                const isActive = position === 0;
                const isLeft = position < 0;
                const isRight = position > 0;
                
                // Responsive positioning
                let translateX = 0;
                let scale = 0.8;
                let opacity = 0.4;
                let zIndex = 10;
                
                if (isActive) {
                  translateX = 0;
                  scale = 1;
                  opacity = 1;
                  zIndex = 50;
                } else if (isLeft) {
                  // For mobile: stack vertically, for desktop: stack horizontally
                  translateX = window.innerWidth < 768 
                    ? `0px` 
                    : `${position * 60 - 40}%`;
                  scale = 0.7;
                  opacity = 0.3;
                  zIndex = position * -1;
                } else if (isRight) {
                  translateX = window.innerWidth < 768 
                    ? `0px` 
                    : `${position * 60 + 40}%`;
                  scale = 0.7;
                  opacity = 0.3;
                  zIndex = position * -1;
                }

                // Mobile specific adjustments
                if (window.innerWidth < 768) {
                  if (isActive) {
                    translateX = 0;
                  } else {
                    // Hide non-active cards on mobile
                    translateX = position < 0 ? '-100%' : '100%';
                  }
                }

                return (
                  <div
                    key={card.id}
                    className={`absolute transition-all duration-700 ease-in-out rounded-2xl overflow-hidden shadow-2xl ${
                      isActive 
                        ? 'cursor-default' 
                        : 'cursor-pointer hover:scale-90'
                    }`}
                    style={{
                      transform: `translateX(${translateX}) scale(${scale})`,
                      opacity: opacity,
                      zIndex: zIndex,
                      width: window.innerWidth < 768 ? '100%' : '400px',
                      maxWidth: '100%',
                    }}
                    onClick={() => !isActive && selectCard(index)}
                  >
                    {/* Card with crazy effects */}
                    <div className="relative overflow-hidden">
                      {/* Glowing border effect for active card */}
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-blue-400 to-purple-400 rounded-2xl animate-pulse p-1">
                          <div className="bg-gradient-to-br from-blue-900 to-purple-900 rounded-xl h-full"></div>
                        </div>
                      )}
                      
                      <div className="relative bg-gradient-to-br from-white to-blue-50 rounded-xl overflow-hidden">
                        {/* Image with overlay */}
                        <div className="h-48 relative overflow-hidden">
                          <img 
                            src={card.image} 
                            alt={card.title}
                            className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110"
                          />
                          <div className={`absolute inset-0 bg-gradient-to-t ${card.color} opacity-40`}></div>
                          
                          {/* Animated title overlay */}
                          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                              {card.icon}
                              <span className="bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent">
                                {card.title}
                              </span>
                            </h3>
                          </div>
                        </div>
                        
                        {/* Card content */}
                        <div className="p-6">
                          <p className="text-gray-700 mb-4">
                            {isActive ? card.fullDescription : card.shortDescription}
                          </p>
                          
                          {isActive && (
                            <>
                              {/* Stats in a cool layout */}
                              <div className="grid grid-cols-3 gap-2 mb-4">
                                {Object.entries(card.stats).map(([key, value], i) => (
                                  <div key={i} className="text-center p-2 bg-gradient-to-br from-blue-100 to-white rounded-lg">
                                    <div className="text-sm font-bold text-blue-900">{value}</div>
                                    <div className="text-xs text-gray-500">{key}</div>
                                  </div>
                                ))}
                              </div>
                              
                              {/* Features with checkmarks */}
                              <div className="space-y-2">
                                {card.features.slice(0, 3).map((feature, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <FaCheckCircle className="text-green-500 flex-shrink-0" />
                                    <span className="text-sm text-gray-600">{feature}</span>
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
               <div className="absolute bottom-8  left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-50">
                         <button
                           onClick={prevCard}
                           className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110 mt-24"
                           aria-label="Previous card"
                         >
                           <FaArrowLeft className="text-white text-xl" />
                         </button>
                         
                         <button
                           onClick={() => setAutoRotate(!autoRotate)}
                           className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110 mt-24"
                           aria-label={autoRotate ? "Stop rotation" : "Start rotation"}
                         >
                           {autoRotate ? (
                             <FaPause className="text-white text-xl" />
                           ) : (
                             <FaPlay className="text-white text-xl" />
                           )}
                         </button>
                         
                         <button
                           onClick={nextCard}
                           className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110 mt-24"
                           aria-label="Next card"
                         >
                           <FaArrowRight className="text-white text-xl" />
                         </button>
                       </div>
            </div>
            

             
          </div>

           
        
         <div className="flex justify-center">
             <a href="/students/life">
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:scale-105 hover:from-purple-600 hover:to-blue-500 transition-all duration-300">
            Explore Programs
            </button>
             </a>
            
            </div>


        </div>
        
      </section>



 const animationCard = [
        {
      id: 1,
      image: card1,
      title: "Library & Reading Programs",
      shortDescription: "Advanced Science, Technology, Physics, and Mathematics curriculum",
      fullDescription: "The school library provides a quiet, well-organized space with academic books, reference materials, and reading resources for all grade levels. Through guided reading programs, book clubs, and independent study time, students develop critical thinking and research skills.",
      // icon: <FaFlask className="text-2xl" />,
      color: "from-blue-500 to-cyan-500",
      stats: {
        labs: "1 Modern Library",
        success: "100% Student Use Library",
        students: "100% Reading Habits"
      },
      features: [
        
      ]
    },
      {
      id: 2,
      image: card2,
      title: "Student Leadership & Councils",
      shortDescription: "Advanced Science, Technology, Physics, and Mathematics curriculum",
      fullDescription: "Through student councils and leadership programs, learners develop responsibility, communication skills, and confidence while representing their peers. These platforms encourage teamwork, decision-making, and active participation in shaping a positive and inclusive school community.",
      // icon: <FaFlask className="text-2xl" />,
      color: "from-blue-500 to-cyan-500",
      stats: {
        labs: "Leadership Roles",
        success: "leadership Skills",
        students: "100% Participation"
      },
      features: [
      
      ]
    },

    {
      id: 3,
      image: bg1,
      title: "Events & Celebrations",
      shortDescription: "Advanced Science, Technology, Physics, and Mathematics curriculum",
      fullDescription: "at Tullu Dimtu Secondary School are a vibrant part of student life. Throughout the academic year, students take part in school events, cultural days. These events help students build confidence, teamwork, leadership skills, and cultural awareness",
      // icon: <FaFlask className="text-2xl" />,
      color: "from-blue-500 to-cyan-500",
      stats: {
        labs: "Event Halls",
        success: " Active Participation",
        students: "100% Involvement"
      },
      features: [
       
      ]
    },
     
      {
      id: 4,
      image: bg2,
      title: "Competitions & Achievements",
      shortDescription: "Advanced Science, Technology, Physics, and Mathematics curriculum",
      fullDescription: "Our Student By participating in school, inter-school, and regional competitions, students build confidence, discipline, and a spirit of excellence. Their achievements reflect the school’s commitment to nurturing skill, creativity, and academic success",
      // icon: <FaFlask className="text-2xl" />,
      color: "from-blue-500 to-cyan-500",
      stats: {
        labs: "Competitive Events",
        success: "Numerous Awards",
        students: "Active Participants"
      },
      features: [
       
      ]
    },
      {
      id: 5,
      image: bg3,
      title: "Community Service & Leadership",
      shortDescription: "Advanced Science, Technology, Physics, and Mathematics curriculum",
      fullDescription: "Tullu Dimtu Secondary School encourage students to become responsible and compassionate citizens. Through volunteer activities, environmental initiatives, and social outreach programs, students learn the value of service, teamwork, and leadership.",
      // icon: <FaFlask className="text-2xl" />,
      color: "from-blue-500 to-cyan-500",
      stats: {
        labs: "Community Projects",
        success: "Positive Impact",
        students: "100% Engagement"
      },
      features: [
      
      ]
    },
      {
      id: 6,
      image: card1,
      title: "Cultural Day & Diversity",
      shortDescription: "Advanced Science, Technology, Physics, and Mathematics curriculum",
      fullDescription: "Tullu Dimtu Secondary School celebrate the rich traditions, languages, and customs of all students. Through performances, exhibitions, and interactive activities, students gain a deeper appreciation for different cultures while promoting inclusivity and respect. This event fosters unity, cultural awareness, and a vibrant, welcoming school environment.",
      // icon: <FaFlask className="text-2xl" />,
      color: "from-blue-500 to-cyan-500",
      stats: {
           labs: "Cultural Events",
           success: "Cultural Awareness",
           students: "Celebrated Diversity"
      },
      features: [
       
      ]
    },
  ]




    <div className="fixed inset-0 -z-10">
    {carouselImages.map((img, index) => (
      <div
        key={index}
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out ${
          index === currentBgIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
        }`}
        style={{ 
          backgroundImage: `url(${img})`,
          // backgroundAttachment: 'fixed'
        }}
      />
    ))}
  </div>


 const nextSlide = () => {
    setCurrentBgIndex((prevIndex) => 
      prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
    );
  };