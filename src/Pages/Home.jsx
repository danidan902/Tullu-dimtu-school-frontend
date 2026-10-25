import { useState, useEffect } from "react";
import students from "../assets/gal3.jpg"; 
import Footer from "../components/Footer";
import ScrollReveal from "../components/ScrollReveal";
import { Helmet } from "react-helmet-async";
import anim from '../assets/studentlife.jpg';
import anim1 from '../assets/por.jpg'
import anim2 from '../assets/local.jpg'
import anim5 from '../assets/tul6.jpg'
import anim6 from '../assets/stu1.jpg'
import anim7 from '../assets/lab.png'
import lib1 from '../assets/lib1.jpg'
import { Link } from "react-router-dom";
import schoolHeroImage from '../assets/gal31.jpg';
import Bg from '../assets/tech1.jpg';
import bg from '../assets/lab.png';
import loc from '../assets/local.jpg'
import { 
  FaGraduationCap, 
  FaBook, 
  FaChalkboardTeacher, 
  FaAward,   
  FaChevronUp,
  FaChevronRight,
  FaChevronDown,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";

import card1 from "../assets/lab.jpg";
import card5 from "../assets/cro.png";
import card6 from "../assets/tech.jpg";

import animMobile1 from '../assets/system.jpg';
import animMobile3 from '../assets/localname.jpg';
import animMobile4 from '../assets/crop.png';

import campus1 from '../assets/life4.jpg';
import campus2 from '../assets/red.jpg';
import campus3 from '../assets/hom1.jpg';
import campus4 from '../assets/gal31.jpg';

function Home() {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [expandedCards, setExpandedCards] = useState({});
  
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  
  const [animateText, setAnimateText] = useState(false);
  const [textStage, setTextStage] = useState(0);
  
  const [counters, setCounters] = useState({
    students: 0,
    staff: 0,
    passRate: 0,  
    years: 0,
  });

  const carouselData = [
   {
  mobileImage: animMobile1,
  desktopImage: anim,
  title: (
    <div className="text-white">
      Welcome to{" "}
      <span className="text-yellow-400">
        Tullu Dimtu
      </span>
    </div>
  ),
  subtitle: "A Legacy of Excellence Since 2009",
  description: "At Tullu Dimtu School, we are committed to excellence in education and the holistic development of every student. ",
  titleStyle: "text-4xl md:text-3xl lg:text-6xl font-bold drop-shadow-lg",
  subtitleStyle: "text-xl md:text-2xl text-yellow-300 font-semibold drop-shadow",
  descStyle: "text-lg md:text-lg text-gray-200",
},
  {
      mobileImage: animMobile3,
      desktopImage: anim2,
      title: (
        <div className="text-white">
          Academic <span className="text-yellow-400">Excellence</span>
        </div>
      ),
      subtitle: "Consistent Top Performers",
      description: "70%+ pass rate in national examinations",
      titleStyle: "text-4xl md:text-3xl lg:text-6xl font-bold text-white tracking-wide drop-shadow-lg",
      subtitleStyle: "text-xl md:text-2xl text-yellow-300",
      descStyle: "text-lg md:text-lg text-gray-200",
    },

    {
      mobileImage: anim1,
      desktopImage: anim1,
      title: (
        <div className="text-white">
          Nurturing <span className="text-yellow-400">Future Leaders</span>
        </div>
      ),
      subtitle: "Holistic Education Approach",
      description: "Developing minds, building character, shaping destinies",
      titleStyle: "text-4xl md:text-3xl lg:text-6xl font-bold text-white italic drop-shadow-md",
      subtitleStyle: "text-xl md:text-2xl text-yellow-300",
      descStyle: "text-lg md:text-lg text-gray-200",
    },
    
    {
      mobileImage: animMobile4,
      desktopImage: Bg,
      title: (
        <div className="text-white">
         Modern <span className="text-yellow-400">Facilities</span>
        </div>
      ),
      subtitle: "State-of-the-Art Infrastructure",
      description: "Equipped for 21st century learning",
      titleStyle: "text-4xl md:text-3xl lg:text-6xl font-bold text-white uppercase drop-shadow-md",
      subtitleStyle: "text-xl md:text-2xl text-yellow-300  font-semibold",
      descStyle: "text-lg md:text-lg text-gray-200",
    },
   
    {
      mobileImage: anim6,
      desktopImage: anim6,
      title: (
        <div className="text-white">
          Our Study <span className="text-yellow-400">Portal</span>
        </div>
      ),
      subtitle: "Join Us ",
      description: "School provides students with easy access to learning resources, assignments, and interactive study materials.",
      titleStyle: "text-4xl md:text-3xl lg:text-6xl font-bold text-white drop-shadow-xl",
      subtitleStyle: "text-xl md:text-2xl text-yellow-300 font-bold",
      descStyle: "text-lg md:text-lg text-white",
    },
    {
      mobileImage: schoolHeroImage,
      desktopImage: anim7,
     title: (
        <div className="text-white">
          Our Digital <span className="text-yellow-400">Library</span>
        </div>
      ),
      subtitle: "Tullu Dimtu Digital Library",
      description: "It provides a modern, convenient way to study, explore new topics, and conduct research from anywhere.",
      titleStyle: "text-4xl md:text-3xl lg:text-6xl font-bold text-white drop-shadow-xl",
      subtitleStyle: "text-xl md:text-2xl text-yellow-300 font-bold",
      descStyle: "text-lg md:text-lg text-white",
    },
     {
      mobileImage: anim5,
      desktopImage: anim5,
     title: (
        <div className="text-white">
          Join Our <span className="text-yellow-400">Community</span>
        </div>
      ),
      subtitle: "Admissions Open 2025",
      description: "Limited seats available - Apply now!",
      titleStyle: "text-4xl md:text-3xl lg:text-6xl font-bold text-white drop-shadow-xl",
      subtitleStyle: "text-xl md:text-2xl text-yellow-300 font-bold",
      descStyle: "text-lg md:text-lg text-white",
    },
  ];

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setTextStage(0);
        setTimeout(() => {
          setCurrentBgIndex((prevIndex) => 
            prevIndex === carouselData.length - 1 ? 0 : prevIndex + 1
          );
          setTimeout(() => {
            setTextStage(1);
          }, 300);
          setTimeout(() => {
            setTextStage(2);
          }, 1300);
        }, 0);
      }, 6000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, carouselData.length]);

  useEffect(() => {
    setTimeout(() => {
      setTextStage(1);
      setTimeout(() => {
        setTextStage(2);
      }, 1000);
    }, 500);
  }, []);

  useEffect(() => {
    const duration = 10000;
    const steps = 60;
    const interval = duration / steps;

    const targetValues = {
      students: 2013,
      staff: 97,
      passRate: 85.9,
      years: 10,
    };

    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setCounters({
        students: Math.round(targetValues.students * progress),
        staff: Math.round(targetValues.staff * progress),
        passRate: Number((targetValues.passRate * progress).toFixed(1)),
        years: Math.round(targetValues.years * progress),
      });
      if (step >= steps) {
        setCounters(targetValues);
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleCardExpansion = (id) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const features = [
    { 
      icon: <FaGraduationCap className="text-4xl mb-4" />, 
      title: "Academic Excellence", 
      desc: "Tullu Dimtu Secondary School takes great pride in its long-standing tradition of academic excellence. Year after year, our students consistently achieve outstanding results in national examinations, placing our school among the top-performing institutions in the region. This success is a reflection of our dedicated teachers, rigorous curriculum, and the strong work ethic of our students. We believe that high achievement is not by chance—it is the result of commitment, discipline, and a supportive learning environment." 
    },
    { 
      icon: <FaBook className="text-4xl mb-4" />, 
      title: "Holistic Curriculum", 
      desc: "Our commitment to a holistic curriculum means that students receive a comprehensive education that extends beyond the classroom. While excelling in core academic subjects, students are encouraged to explore their talents in sports, music, drama, and visual arts. This balanced approach develops critical thinking, teamwork, creativity, and leadership skills, preparing learners for both personal and professional success." 
    },
    { 
      icon: <FaChalkboardTeacher className="text-4xl mb-4" />, 
      title: "Expert Faculty", 
      desc: "Tullu Dimtu's highly qualified teaching staff embodies excellence, commitment, and inspiration. With a blend of expertise, experience, and passion, our faculty guides students through a challenging curriculum while encouraging creativity, critical thinking, and personal growth. Their dedication is the driving force behind the school's consistent academic success and well-rounded student development." 
    },
    { 
      icon: <FaAward className="text-4xl mb-4" />, 
      title: "National Recognition", 
      desc: "Our alumni are a testament to Tullu Dimtu's commitment to excellence. Many have graduated from prestigious Ethiopian universities, earning honors, scholarships, and leadership positions. Their achievements bring pride to the school and serve as motivation for current students to strive for academic and personal success." 
    }
  ];

  const programCards = [
    {
      id: 1,
      image: bg,
      title: "STEM Program",
      shortDescription: "STEM Program empowers students to explore Science, Technology,  and Mathematics through hands-on projects and experiments...",
      fullDescription: "Our STEM program integrates cutting-edge technology with hands-on learning. Students work in modern laboratories equipped with printers, robotics kits, and computing systems. The curriculum follows international standards and includes project-based learning, research opportunities, and partnerships with tech companies.",
      stats: {
        labs: "3 Modern Labs",
        success: "70% University Placement",
        students: "150+ Enrolled"
      },
    features: [
    "Hands-On Science Experiments",
    "Innovation Projects",
    "Mathematics & Problem-Solving Challenges",
    "National STEM Competitions Preparation",
    "Research & Innovation Projects"
]
,
    },
    {
      id: 5,
      image: loc,
      title: "National competitive",
      shortDescription: "Our school encourages students to take part in national competitions in academics.These activities help students build confidence and skill...",
      fullDescription: "Our national Programme prepares students for global citizenship with a rigorous, internationally recognized curriculum. The program emphasizes critical thinking, research skills, and intercultural understanding. Students consistently achieve above-world-average scores and gain admission to top universities worldwide.",
      stats: {
    competitions: "10+ National Comp-",
    awards: "15+ Student Achiev-",
    training: "5+ Prep Programs"
}
,
      features: [
         "National Competitive Preparation",
        "Student Achievement Recognition",
        "Inter-School & National Level Participation",
        "Theory of Knowledge Excellence",
        "Academic Excellence & Ranking Support",
       
      ]
    },
    {
      id: 6,
      image: card6,
      title: "Technology & Innovation",
      shortDescription: "School emphasizes Technology & Innovation, giving students the tools and guidance to explore modern digital solutions and innovative projects, students develop creativity, problem-solving, and technical skills...",
      fullDescription: "Our Technology & Innovation program prepares students for the digital future with courses in coding, cybersecurity, data science, and IoT. Students work on real-world projects, participate in hackathons, and intern with tech companies. The program includes state-of-the-art computer labs and maker spaces.",
      stats: {
        labs: "6 Tech Labs",
        certifications: "Advanced Tech",
        startups: "Student-led Startups"
      },
      features: [
        "Robotics Projects",
        "Web Development",
        "Team Work Projects"
      ]
    }
  ];

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };  

  const nextSlide = () => {
    setTextStage(0);
    setTimeout(() => {
      setCurrentBgIndex((prevIndex) => 
        prevIndex === carouselData.length - 1 ? 0 : prevIndex + 1
      );
      setTimeout(() => {
        setTextStage(1);
        setTimeout(() => {
          setTextStage(2);
        }, 1000);
      }, 300);
    }, 500);
  };

  const prevSlide = () => {
    setTextStage(0);
    setTimeout(() => {
      setCurrentBgIndex((prevIndex) => 
        prevIndex === 0 ? carouselData.length - 1 : prevIndex - 1
      );
      setTimeout(() => {
        setTextStage(1);
        setTimeout(() => {
          setTextStage(2);
        }, 3000);
      }, 300);
    }, 500);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const getTextAnimationClass = (delay = 0) => {
    switch(textStage) {
      case 0:
        return "opacity-0 -translate-x-10 blur-sm";
      case 1:
        return `opacity-100 translate-x-0 blur-none transition-all duration-1000 delay-${delay}`;
      case 2:
        return "opacity-100 translate-x-0 blur-none";
      default:
        return "opacity-0";
    }
  };

  return (
    <>
      <Helmet>
        <title>Home</title>
       <meta
          name="description"
          content="Tullu Dimtu Secondary School provides quality education in Ethiopia. Online registration, student portal, and academic excellence."
        />
         <meta
          name="keywords"
          content="Tullu Dimtu Secondary School, secondary school in Ethiopia, student portal, online registration"
        />
      </Helmet>

      <div className="relative w-full font-sans antialiased bg-gray-50">
        {/* Hero Section */}
        <section className="relative w-full h-screen overflow-hidden">
          <div className="absolute inset-0 ">
            {carouselData.map((item, index) => (
              <div
                key={index}
                className={`
                  absolute inset-0
                  transition-all duration-1000 ease-in-out
                  ${index === currentBgIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"}
                `}
              >
                <div
                  className="md:hidden absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
                  style={{ backgroundImage: `url(${item.mobileImage})` }}
                />
                <div
                  className="hidden md:block absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
                  style={{
                    backgroundImage: `url(${item.desktopImage})`,
                    transform: index === currentBgIndex ? 'scale(1)' : 'scale(1.05)'
                  }}
                />
              </div>
            ))}
          </div>

          {/* Hero overlay - solid blue to transparent */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#04395E] to-transparent" />

          {/* Hero Content */}
          <div className="relative z-20 flex flex-col items-start justify-center h-full px-4 md:px-8 lg:px-16 text-left">
            <div className="max-w-3xl">
              <div className={`${getTextAnimationClass(0)}`}>
                <h1 className={`${carouselData[currentBgIndex].titleStyle} leading-tight mb-4`}>
                  {carouselData[currentBgIndex].title}
                </h1>
              </div>

              <div className={`${getTextAnimationClass(100)}`}>
                <h2 className={`${carouselData[currentBgIndex].subtitleStyle} mb-4`}>
                  {carouselData[currentBgIndex].subtitle}
                </h2>
              </div>

              <div className={`${getTextAnimationClass(200)}`}>
                <p className={`${carouselData[currentBgIndex].descStyle} mb-8 max-w-2xl`}>
                  {carouselData[currentBgIndex].description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4 sm:flex sm:flex-row sm:gap-4">
              <Link to="/admission">
                <button className="
                  px-5 py-2.5 sm:px-8 sm:py-3
                  bg-yellow-400 hover:bg-yellow-300
                  text-[#04395E] font-bold
                  rounded-lg
                  transition-all duration-300
                  w-full sm:w-auto
                  text-sm sm:text-base
                ">
                  Start Application
                </button>
              </Link>

              <Link to="/schedule-visit">
                <button className="
                  px-5 py-2.5 sm:px-8 sm:py-3
                  border-2 border-white
                  text-white hover:bg-white/20
                  font-semibold
                  rounded-lg
                  transition-all duration-300
                  backdrop-blur-sm
                  w-full sm:w-auto
                  text-sm sm:text-base
                ">
                  Book a Tour
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-[#04395E] mb-4">
                  <span className="text-yellow-500">Tullu Dimtu</span> in Numbers
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  Our journey of excellence measured through achievement and impact
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { number: counters.students, label: "Students Enrolled", suffix: "+" },
                  { number: counters.staff, label: "Qualified Staff", suffix: "+" },
                  { number: counters.passRate.toFixed(1), label: "Pass Rate", suffix: "%" },
                  { number: counters.years, label: "Years of Excellence", suffix: "+" }
                ].map((stat, index) => (
                  <div 
                    key={index} 
                    className="text-center p-6 rounded-xl bg-blue-50 hover:bg-blue-100 transition-all duration-300"
                  >
                    <div className="text-3xl md:text-4xl font-bold text-[#04395E] mb-2">
                      {stat.number}{stat.suffix}
                    </div>
                    <div className="text-gray-700 font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gradient-to-b from-blue-50 via-white to-blue-50">
          <div className="container mx-auto px-6">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-[#04395E] mb-4">
                  Why Choose <span className="text-yellow-500">Tullu Dimtu?</span>
                </h2>
                <div className="w-24 h-1 bg-yellow-400 mx-auto"></div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => {
                  const isExpanded = expandedIndex === index;
                  const shortDesc = feature.desc.slice(0, 150) + "...";

                  return (
                    <div 
                      key={index} 
                      className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-500 transform hover:-translate-y-1 group relative overflow-hidden border border-gray-100"
                    >
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#04395E] to-yellow-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                      <div className="text-[#04395E] group-hover:text-yellow-500 transition-all duration-500 transform group-hover:scale-110">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-[#04395E] transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">
                        {isExpanded ? feature.desc : shortDesc}
                      </p>
                      <button 
                        onClick={() => toggleExpand(index)}
                        className="mt-4 text-[#04395E] hover:text-yellow-600 font-semibold flex items-center transition-all duration-300 group"
                      >
                        {isExpanded ? "Read Less" : "Read More"}
                        <svg 
                          className={`w-4 h-4 ml-2 transform transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>
            </ScrollReveal>
            
            {/* Digital Library Section */}
            <section>
              <ScrollReveal delay={0.2}>
                <div className="w-full min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 flex items-center justify-center mt-16 px-4 sm:px-6 py-10">
                  <div className="relative w-full max-w-6xl">
                    <div 
                      className="relative w-full h-[500px] sm:h-[240px] md:h-[280px] lg:h-[490px] overflow-hidden rounded-2xl sm:rounded-3xl group shadow-md"
                    >
                      <div className="relative w-full h-full">
                        <img
                          src={lib1}
                          alt="Digital Library"
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                          loading="lazy"
                          decoding="async"
                          fetchpriority="low"
                        />

                        <div className="absolute inset-0 bg-gradient-to-tr from-[#04395E]/85 via-[#04395E]/55 to-[#04395E]/25"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-[#04395E]/30 to-transparent"></div>

                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-300 to-transparent opacity-50"></div>
                      </div>

                      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 z-20">
                        <h2 
                          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight"
                        >
                          <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-300 via-white to-blue-200 drop-shadow-2xl">
                            Our Digital Library
                          </span>
                        </h2>
                        
                        <p 
                          className="text-slate-200 italic text-base sm:text-lg md:text-xl mb-6 leading-relaxed max-w-2xl"
                        >
                          <span className="font-bold text-cyan-300">Tulu Dimtu Digital Library</span>, 
                          a modern learning platform designed to support students in their academic journey. 
                          Access textbooks, class notes, past exam papers, and educational resources anytime, anywhere.
                        </p>

                        <div className="flex flex-wrap gap-4">
                          <a href="/email-verification">
                            <button className="px-8 py-3.5 bg-[#04395E] hover:bg-[#04395E]/90 text-white font-bold rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-3">
                              Explore Digital Library
                            </button>
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Overlapping Card */}
                    <div 
                      className="relative md:absolute md:top-20 md:right-0 mt-10 md:mt-0 md:translate-x-4 lg:translate-x-10 w-full md:w-[380px] lg:w-[420px] p-6 md:p-8 rounded-2xl bg-gradient-to-br from-[#04395E] via-[#033150] to-[#022a45] border border-white/10 backdrop-blur-md shadow-lg"
                    >
                      <div className="relative z-10">
                        <div className="flex items-center mb-6">
                          <div className="w-3 h-10 bg-gradient-to-b from-cyan-300 to-blue-400 rounded-full mr-4"></div>
                          <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-cyan-200 to-sky-300">
                            Digital Library Access
                          </h1>
                        </div>

                        <p className="text-slate-200 mb-6 leading-relaxed text-sm sm:text-base">
                          Access the <span className="font-semibold text-cyan-300">Tulu Dimtu Digital Library</span> anytime and anywhere. 
                          Our platform provides easy access to learning materials, smart search features, 
                          and a smooth reading experience across all devices to support every student's success.
                        </p>

                        <p className="text-slate-300 mb-8 text-sm leading-relaxed italic border-l-4 border-cyan-400/60 pl-4 py-2">
                          "The only thing that you absolutely have to know, is the location of the <span className="text-cyan-300">Digital Library</span>." 
                          <span className="block text-xs mt-2 text-slate-400">- Albert Einstein (Digital Edition)</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </section>
          </div>
        </section>

        {/* Programs Section */}
        <section className="py-20 bg-gradient-to-br from-white to-blue-50">
          <div className="container mx-auto px-6">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-[#04395E] mb-4">
                  Our <span className="text-yellow-500">Academic Programs</span>
                </h2>
                <p className="text-gray-600 text-xl max-w-3xl mx-auto">
                  Comprehensive educational programs designed for 21st-century global leaders
                </p>
                <div className="w-32 h-1 bg-gradient-to-r from-[#04395E] to-yellow-400 mx-auto mt-6 rounded-full"></div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {programCards.map((card, index) => (
                  <div 
                    key={card.id} 
                    className="group cursor-pointer"
                  >
                    <div className={`relative overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 bg-white ${
                      expandedCards[card.id] ? 'h-auto' : 'h-full'
                    }`}>
                      <div className="h-48 overflow-hidden relative">
                        <img 
                          src={card.image} 
                          alt={card.title}
                          className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105 p-2"
                          loading="lazy"
                          decoding="async"
                          fetchpriority="low"
                        />
                      </div>
                      
                      <div className="p-6 bg-white">
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">{card.title}</h3>
                        <p className="text-gray-600 mb-4">
                          {expandedCards[card.id] ? card.fullDescription : card.shortDescription}
                        </p>
                        
                        {expandedCards[card.id] && (
                          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-white rounded-xl">
                            <div className="grid grid-cols-3 gap-4 text-center">
                              {Object.entries(card.stats).map(([key, value], index) => (
                                <div key={index}>
                                  <div className="text-lg font-bold text-[#04395E]">{value}</div>
                                  <div className="text-xs text-gray-500 uppercase">{key}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {expandedCards[card.id] && (
                          <div className="mb-6">
                            <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                              <FaCheckCircle className="text-green-500" />
                              Program Features
                            </h4>
                            <ul className="space-y-2">
                              {card.features.map((feature, index) => (
                                <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#04395E]"></div>
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <button
                          onClick={() => toggleCardExpansion(card.id)}
                          className="w-full flex items-center justify-center gap-2 text-[#04395E] font-semibold hover:text-yellow-600 transition-colors duration-200 py-3 rounded-lg hover:bg-blue-50"
                        >
                          {expandedCards[card.id] ? (
                            <>
                              <FaChevronDown />
                              Show Less
                            </>
                          ) : (
                            <>
                              <FaChevronRight />
                              Read More Details
                            </>
                          )}
                        </button>
                        
                        {expandedCards[card.id] && (
                          <div>
                            <a href="/form">
                              <button className="w-full mt-3 px-6 py-3 bg-[#04395E] hover:bg-[#033150] text-white font-semibold rounded-lg transition-all duration-200">
                                Apply to This Program
                              </button>
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Campus Section */}
       <ScrollReveal delay={0.2}>
           <div 
          className="mt-40 mb-32 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl "
        >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-10">
              <div>
                <h2 className="text-4xl lg:text-5xl font-bold text-[#04395E] mb-6">
                  Our <span className="text-yellow-500">Student Life </span>
                </h2>
              </div>
              
              <div className="space-y-6 text-gray-700 text-lg">
                <p className="leading-relaxed">
                Student life at Tullu Dimtu Secondary School is enriched by both academic learning and vibrant celebrations. 
                Along with regular classes, students actively participate in special events such as Cultural Day, where different traditions, foods, music, and traditional clothing are proudly displayed.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
                  {[
                    { name: "Science Labs", count: "4" },
                    { name: "Sports Facilities", count: "6+" },
                    { name: "Smart Classrooms", count: "10" },
                    { name: "Art Studios", count: "4" }
                  ].map((facility, idx) => (
                    <div 
                      key={idx} 
                      className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
                    >
                      <div className="text-2xl font-bold text-[#04395E] mb-1">{facility.count}</div>
                      <div className="text-sm text-gray-600">{facility.name}</div>
                    </div>
                  ))}
                </div>
                
                <p className="leading-relaxed pt-6">
                 These events help students appreciate diversity and strengthen unity among the school community. 
                 Other celebration days, including academic award ceremonies, sports days, and national events, bring students together in joy and teamwork.
                </p>
              </div>
              
              <div>
               <a href="./students/life">
                 <button className="inline-flex items-center gap-3 bg-[#04395E] hover:bg-[#033150] text-white px-8 py-4 rounded-md font-semibold transition-all duration-300 hover:gap-4 group">
                  Explore 
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
               </a>
              </div>
            </div>
            
            {/* Image Gallery Grid */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-4 sm:space-y-6">
                {[campus1, campus2].map((imageSrc, index) => (
                  <div 
                    key={index}
                    className="relative rounded-2xl overflow-hidden group"
                  >
                    <img 
                      src={imageSrc}
                      alt="Campus facility"
                      className="w-full h-48 sm:h-64 object-cover"
                      loading="lazy"
                      decoding="async"
                      fetchpriority="low"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                ))}
              </div>
              <div className="space-y-4 sm:space-y-6 pt-8 sm:pt-12">
                {[campus3, campus4].map((imageSrc, index) => (
                  <div 
                    key={index}
                    className="relative rounded-2xl overflow-hidden group"
                  >
                    <img 
                      src={imageSrc}
                      alt="Campus facility"
                      className="w-full h-56 sm:h-80 object-cover"
                      loading="lazy"
                      decoding="async"
                      fetchpriority="low"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
       </ScrollReveal>

        {/* About Section */}
       <ScrollReveal delay={0.2}>
         <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative rounded-lg overflow-hidden shadow-sm">
                <img
                  src={students}
                  alt="Students at Tullu Dimtu"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                  decoding="async"
                  fetchpriority="low"
                />
                <div className="absolute -bottom-4 -right-4 bg-yellow-400 text-[#04395E] p-4 rounded-lg">
                  <span className="block text-2xl font-bold">10+</span>
                  <span className="block text-xs">Years of Excellence</span>
                </div>
              </div>

              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#04395E] mb-6">
                  Nurturing <span className="text-yellow-500">Future Leaders</span>
                </h2>
                <p className="text-gray-600 mb-6">
                  Established in 2009, Tullu Dimtu Secondary School has consistently ranked among the top educational institutions in the region.
                </p>
                <div className="space-y-3 mb-8">
                  {[
                    "State-of-the-art science and computer labs",
                    "Comprehensive extracurricular programs",
                    "University placement counseling",
                    "National Exchange Programs",
                    "School Community Programs"
                  ].map((item, index) => (
                    <div 
                      key={index} 
                      className="flex items-start"
                    >
                      <svg className="h-5 w-5 text-yellow-500 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <p className="text-gray-700">{item}</p>
                    </div>
                  ))}
                </div>
                <Link to="/about/our-history">
                  <button className="px-6 py-3 bg-[#04395E] hover:bg-[#033150] text-white font-semibold rounded-lg transition-all duration-300">
                    Learn More About Us
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
       </ScrollReveal>

        {/* Testimonials Section */}
        <section className="py-20 bg-[#04395E] text-white mb-12">
          <div className="container mx-auto px-6">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  What Our <span className="text-yellow-300">Community Says</span>
                </h2>
                <div className="w-24 h-1 bg-yellow-300 mx-auto"></div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    quote: "Tullu Dimtu School provided the perfect environment for my academic and personal growth. The teachers go above and beyond.",
                    author: "Nuhamin Taye",
                    role: "Student, Tullu Dimtu School"
                  },
                  {
                    quote: "As a parent, I appreciate the school's commitment to both academic excellence and character building.",
                    author: "Michael Kebede",
                    role: "Parent"
                  },
                  {
                    quote: "The innovative teaching methods and facilities here prepare students for real-world challenges.",
                    author: "Dr. Alem Teklu",
                    role: "Board Member"
                  }
                ].map((testimonial, index) => (
                  <div 
                    key={index} 
                    className="bg-white/10 p-8 rounded-xl backdrop-blur-sm hover:bg-white/15 transition-all duration-300"
                  >
                    <svg className="w-8 h-8 text-yellow-300 mb-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"></path>
                    </svg>
                    <p className="italic mb-6 text-white/90">"{testimonial.quote}"</p>
                    <div>
                      <p className="font-bold">{testimonial.author}</p>
                      <p className="text-sm text-white/70">{testimonial.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-white">
          <ScrollReveal>
            <div className="container mx-auto px-6">
              <div className="bg-[#04395E] rounded-2xl p-12 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Ready to Join Our Community?
                </h2>
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                  Applications for the 2025 academic year are now open. Limited spaces available.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button className="px-8 py-3 bg-yellow-400 hover:bg-yellow-300 text-[#04395E] font-bold rounded-lg transition-all duration-300 transform hover:scale-105">
                    <a href='/admission'>Apply Now</a>
                  </button>
                  <button className="px-8 py-3 border-2 border-white text-white hover:bg-white/20 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105">
                    <a href='/contact'>Contact Admissions</a>
                  </button>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        <Footer />

        {showScrollTop && (
          <button
  onClick={scrollToTop}
  className="fixed bottom-8 right-32 z-50 w-12 h-12 bg-yellow-400 text-[#04395E] rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
  aria-label="Scroll to top"
>
  <FaChevronUp className="text-xl" />
</button>
        )}
      </div>
    </>
  );
}

export default Home;
