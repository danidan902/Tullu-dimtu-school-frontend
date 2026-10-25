import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, ChevronUp, LogOut, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from '../assets/tullulogo.png';
import LiveAnnouncements from "./LiveAnnouncements";

function Header() {
  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is signed in from localStorage on component mount
  useEffect(() => {
    const checkAuthStatus = () => {
      const userData = localStorage.getItem('userData');
      const token = localStorage.getItem('userToken');
      
      if (userData && token) {
        try {
          setUser(JSON.parse(userData));
          setIsSignedIn(true);
        } catch (error) {
          console.error('Error parsing user data:', error);
          setIsSignedIn(false);
          setUser(null);
        }
      } else {
        setIsSignedIn(false);
        setUser(null);
      }
    };

    checkAuthStatus();

    window.addEventListener('storage', checkAuthStatus);
    return () => window.removeEventListener('storage', checkAuthStatus);
  }, []);

  // Handle sign out
  const handleSignOut = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRole');
    setIsSignedIn(false);
    setUser(null);
    navigate('/');
  };

  // Close menu when location changes
  useEffect(() => {
    setOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  // Check if current path is the sign-in page
  const isSignInPage = location.pathname === "/signIn";
  const isAdminSignInPage = location.pathname === "/admin/signIn";
  const isDirectorNewsPage = location.pathname.startsWith("/director-news");
  const isTeacherUploadPage = location.pathname === "/teacher-profile";
  const isTeacherListPage = location.pathname === "/other/teacher-profile";
  const isTuluDimtuPolicyPage = location.pathname === "/tuludimtuschool-policy";
  const isStudentFormPage = location.pathname === "/form";
  const isSchoolTermsPage = location.pathname === "/school-terms";
  const isEmailVerification = location.pathname === "/email-verification";
  const isYoutubePage = location.pathname === "/youtube-titorial";
  const isTeacherEmail = location.pathname === "/teacher-email";
  const isTeacherUploads = location.pathname === "/other/teacher-attendance";
  const isProfleName = location.pathname === "/profile-page";
  const isStudyPlaceRmove = location.pathname === "/studentstudy-dashboard";
  const isStudentStudyMaterial = location.pathname === "/studentgetstudy-material";
  const isTeacherUploadsPlatform = location.pathname === "/teachersupload-platform";
  const isVisitorBookTaur = location.pathname === "/dashbord-visitor";
  const isAllAdminControll = location.pathname === "/admin-control";
  const isAcadamicsPlatform = location.pathname === "/acadamics-dashboard";
  const isGrade9 = location.pathname === "/grade9";
  const isGrade10 = location.pathname === "/grade10";
  const isGrade11 = location.pathname === "/grade11";
  const isPage = location.pathname === "/admission-Page";
  const isAdmissionPage = location.pathname === "/online-admission";
  const isLogInPage = location.pathname === "/logIn";
  const isAdminPortalPage = location.pathname === "/admission-portal";
  const isGrade12Pge = location.pathname === "/grade12";  
  const isContactSchool = location.pathname === "/contact-school-port";
  const isConcernsStudent = location.pathname === "/student-councle-port";
  const isSeeProfileDash = location.pathname === "/studet-see-dash";
  const isShowprofilestudent = location.pathname === "/student-see-profile";

  const isActive = (path) => location.pathname === path;

  // Scroll effect for navbar visibility and background color
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      
      if (scrollPosition > lastScrollY && scrollPosition > 100) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      setLastScrollY(scrollPosition);
      
      if (scrollPosition > 20) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navItems = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "About Us",
      subItems: [
        { name: "Chairman's Welcome", path: "/about/chairman-welcome" },
        { name: "Mission & Vision", path: "/about/mission-vision" },
        { name: "Our History", path: "/about/our-history" },
        { name: "Principal's Message", path: "/about/principal-message" },
        { name: "School Profile", path: "/about/school-profile" },
        { name: "School Achievements", path: "/about/school-achievements" },
      ],
    },
    {
      name: "Our School",
      subItems: [
        { name: "Our Curriculum", path: "/ourschool/curriculum" },
        { name: "Our Community", path: "/ourschool/community" },
        { name: "Sport", path: "/ourschool/sport" },
        { name: "School Announcement", path: "/school-news" },
        { name: "School Gallery", path: "/gallery" },
        { name: "School Calendar", path: '/school-Calendar' },
        { name: "Teacher Attendance Upload", path: "/teacher-email" },
      ],
    },
    {
      name: "Students",
      subItems: [
        { name: "Rules & Policies", path: "/students/rules" },
        { name: "Student Council", path: "/students/council" },
      ],
    },
    { name: "Contact Us", path: "/contact" },
  ]; 

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const renderDesktopDropdown = (subItems) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute top-full left-0 mt-2 bg-[#0f172a] rounded-xl shadow-2xl py-3 w-64 z-50 border border-blue-400/20 backdrop-blur-xl"
    >
      {subItems.map(({ name, path }, idx) => (
        <motion.div
          key={name}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.05 }}
        >
          <Link
            to={path}
            className="block px-5 py-3 text-[14px] font-medium text-blue-100 hover:text-white hover:bg-blue-600/20 transition-all duration-300 tracking-wide"
            onClick={() => setActiveDropdown(null)}
          >
            {name}
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );

  const renderMobileDropdown = (subItems, isOpen) => (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
      className="overflow-hidden pl-6"
    >
      {subItems.map(({ name, path }) => (
        <Link
          to={path}
          key={name}
          className="block py-1 text-[14px] text-blue-100 hover:text-white font-medium transition-colors duration-300 tracking-wide"
          onClick={() => setOpen(false)}
        >
          {name}
        </Link>
      ))}
    </motion.div>
  );
  
  if (
    isSignInPage ||
    isAdminSignInPage ||
    isDirectorNewsPage ||
    isTeacherUploadPage ||
    isTeacherListPage ||
    isTuluDimtuPolicyPage ||
    isStudentFormPage ||
    isSchoolTermsPage ||
    isEmailVerification ||
    isYoutubePage ||
    isTeacherEmail ||
    isTeacherUploads ||
    isProfleName ||
    isStudyPlaceRmove ||
    isStudentStudyMaterial ||
    isTeacherUploadsPlatform ||
    isVisitorBookTaur ||
    isAllAdminControll ||
    isAcadamicsPlatform ||
    isGrade9 ||
    isGrade10 ||
    isGrade11 ||
    isPage ||
    isAdmissionPage ||   
    isLogInPage || 
    isAdminPortalPage ||
    isGrade12Pge || 
    isContactSchool ||
    isConcernsStudent || 
    isSeeProfileDash ||
    isShowprofilestudent
  ) { 
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 1;
          }
        }
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 5px rgba(59, 130, 246, 0.5);
          }
          50% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.8), 0 0 40px rgba(59, 130, 246, 0.4);
          }
        }
        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }
        .animate-float {
          animation: float linear infinite;
        }
        .animate-gradient-x {
          background-size: 200% auto;
          animation: gradient-x 3s linear infinite;
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        .animate-shimmer {
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        .font-smooth {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>

      {/* ===== BLUE NEWS BOARD / ANNOUNCEMENT BAR AT THE TOP ===== */}
      <AnimatePresence>
        {showAnnouncement && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="relative bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 border-b border-blue-400/40 overflow-hidden"
          >
            {/* Animated background pattern */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA4KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white/40 rounded-full animate-float"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${3 + Math.random() * 4}s`,
                  }}
                />
              ))}
            </div>

            {/* Scrolling marquee content */}
            <div className="relative flex animate-marquee whitespace-nowrap py-2 sm:py-2.5">
              {[...Array(8)].map((_, index) => (
                <span
                  key={index}
                  className="inline-flex items-center text-[11px] sm:text-xs md:text-sm font-semibold mx-4 sm:mx-6 font-smooth"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  <span className="flex items-center gap-2 sm:gap-3 text-yellow-300 tracking-wider">
                    <span className="text-base sm:text-lg">🎓</span>
                    <span className="bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-200 bg-clip-text text-transparent animate-gradient-x font-extrabold tracking-[0.1em] uppercase">
                      Welcome to Tullu Dimtu School
                    </span>
                  </span>
                  
                  <span className="mx-3 sm:mx-6 flex items-center gap-2 text-white tracking-wide">
                    <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-200 rounded-full" />
                    <span className="font-medium">Admissions Open 2019/2026</span>
                  </span>
                  
                  <span className="mx-3 sm:mx-6 flex items-center gap-2 text-blue-50 tracking-wide">
                    <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-300 rounded-full" />
                    <span className="font-medium">Join Our Academic Community Today</span>
                  </span>
                  
                  <span className="mx-3 sm:mx-6 flex items-center gap-2 text-green-200 tracking-wide">
                    <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-yellow-300 rounded-full" />
                    <span className="font-semibold">Apply Now For Early Enrollment</span>
                  </span>
                  
                  <span className="mx-3 sm:mx-6 flex items-center gap-2 text-yellow-300 tracking-wider">
                    <span className="text-base sm:text-lg">⚡</span>
                    <span className="bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-200 bg-clip-text text-transparent animate-gradient-x font-extrabold tracking-[0.1em] uppercase">
                      Limited Seats Available
                    </span>
                  </span>
                </span>
              ))}
            </div>

            {/* Close button */}
            <button
              onClick={() => setShowAnnouncement(false)}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 hover:bg-white/20 rounded-full transition-all duration-300 z-10 group"
              aria-label="Close announcement"
            >
              <X size={14} className="text-white/80 group-hover:text-white transition-colors sm:w-4 sm:h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Navigation - Midnight Blue Theme */}
      <motion.nav
        initial={{ y: 0 }}
        animate={{
          y: showHeader ? 0 : -200,
          backgroundColor: hasScrolled
            ? "rgba(15, 23, 42, 0.98)"
            : "rgba(15, 23, 42, 1)",
          backdropFilter: hasScrolled ? "blur(24px)" : "blur(0px)",
          boxShadow: hasScrolled 
            ? "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(59, 130, 246, 0.1)" 
            : "none",
        }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
          y: { type: "spring", stiffness: 300, damping: 30 },
        }}
        className="relative rounded-full mx-2 sm:mx-4 mt-3 sm:mt-4 lg:mx-8 border border-blue-400/20 backdrop-blur-xl"
        style={{ backgroundColor: '#0f172a' }}
      >
        {/* Animated border gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-400/10 to-transparent" />

        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${4 + Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-[60px] sm:h-[68px] lg:h-[72px]">
            {/* Logo Section */}
            <div className="flex-shrink-0">
              <Link to="/" className="relative flex items-center gap-2 sm:gap-3 group">
                <div className="relative">
                  <div className="w-9 h-9 sm:w-11 sm:h-11 lg:w-[52px] lg:h-[52px] rounded-2xl flex items-center justify-center">
                    <img 
                      src={logo} 
                      alt="Tullu Dimtu School" 
                      className="w-9 h-9 sm:w-10 sm:h-10 lg:w-10 lg:h-10 rounded-xl"
                    />
                  </div>
                </div>

                {/* School Name */}
                <div className="flex flex-col">
                  <span 
                    className="text-base sm:text-xl lg:text-2xl font-black tracking-tight leading-none"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    <span className="bg-gradient-to-r from-blue-300 via-blue-200 to-blue-400 bg-clip-text text-transparent animate-gradient-x">
                      Tullu
                    </span>
                    <span className="text-white ml-1 sm:ml-2">
                      Dimtu
                    </span>
                  </span>
                  <span 
                    className="text-[8px] sm:text-[10px] lg:text-[11px] font-semibold text-blue-400/70 tracking-[0.2em] sm:tracking-[0.25em] uppercase mt-0.5"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    School
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item, index) => (
                <div key={index} className="relative">
                  {item.path ? (
                    <Link to={item.path} className="relative group px-3 xl:px-4 py-2.5 block">
                      <div className="absolute inset-1 bg-gradient-to-r from-blue-500/0 via-blue-600/10 to-blue-500/0 rounded-lg transition-all duration-500 opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100" />
                      <span className="relative flex items-center">
                        <span 
                          className="text-[13px] xl:text-[14px] font-semibold transition-all duration-300 tracking-wide"
                          style={{ 
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            letterSpacing: '0.02em'
                          }}
                        >
                          <span className={`${
                            location.pathname === item.path
                              ? 'text-blue-300'
                              : 'text-slate-300 group-hover:text-white'
                          }`}>
                            {item.name}
                          </span>
                        </span>
                        <span
                          className={`absolute -bottom-1.5 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-400 to-blue-600 transform origin-left transition-transform duration-500 rounded-full ${
                            location.pathname === item.path
                              ? 'scale-x-100'
                              : 'scale-x-0 group-hover:scale-x-100'
                          }`}
                        />
                      </span>
                    </Link>
                  ) : (
                    <button
                      className="relative group px-3 xl:px-4 py-2.5"
                      onClick={() => toggleDropdown(index)}
                    >
                      <div className={`absolute inset-1 bg-gradient-to-r from-blue-500/0 via-blue-600/10 to-blue-500/0 rounded-lg transition-all duration-500 ${
                        activeDropdown === index ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                      }`} />
                      <span className="relative flex items-center gap-1">
                        <span 
                          className={`text-[13px] xl:text-[14px] font-semibold transition-all duration-300 tracking-wide ${
                            activeDropdown === index
                              ? 'text-blue-300'
                              : 'text-slate-300 group-hover:text-white'
                          }`}
                          style={{ 
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            letterSpacing: '0.02em'
                          }}
                        >
                          {item.name}
                        </span>
                        <motion.span
                          animate={{ rotate: activeDropdown === index ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className={`${activeDropdown === index ? 'text-blue-300' : 'text-slate-400'}`}
                        >
                          <ChevronDown size={14} strokeWidth={2.5} />
                        </motion.span>
                      </span>
                    </button>
                  )}
                  {item.subItems && activeDropdown === index && (
                    <div className="absolute" onMouseLeave={() => setActiveDropdown(null)}>
                      {renderDesktopDropdown(item.subItems)}
                    </div>
                  )}
                </div>
              ))}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 xl:gap-3 ml-3 xl:ml-6 pl-3 xl:pl-6 border-l border-slate-700/50">
                <Link to="https://tuludimtuschoolerp.vercel.app/">
                  <button
                    className="group relative flex items-center gap-1 overflow-hidden px-4 xl:px-6 py-2 xl:py-2.5 font-semibold text-[13px] xl:text-[15px] text-white transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:rounded-xl hover:text-white hover:shadow-[0_0_0_12px_transparent] active:scale-95 active:shadow-[0_0_0_4px_#04395E]"
                  >
                    <span className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#04395E] opacity-0 transition-all duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:h-[220px] group-hover:w-[220px] group-hover:opacity-100" />
                    <svg className="absolute left-[-25%] z-10 h-5 w-5 fill-[#04395E] transition-all duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:left-3 group-hover:fill-white" viewBox="0 0 24 24">
                      <path d="M13.172 12L8.222 7.05l1.414-1.414L16 12l-6.364 6.364-1.414-1.414z" />
                    </svg>
                    <span className="relative z-10 -translate-x-2 transition-all duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-2">
                      Sign In
                    </span>
                    <svg className="absolute right-3 z-10 h-5 w-5 fill-[#04395E] transition-all duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:right-[-25%] group-hover:fill-white" viewBox="0 0 24 24">
                      <path d="M13.172 12L8.222 7.05l1.414-1.414L16 12l-6.364 6.364-1.414-1.414z" />
                    </svg>
                  </button>
                </Link>

                {/* Apply Now Button */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link to="/admission">
                    <button
                      className="group relative flex items-center gap-1 overflow-hidden rounded-lg border-2 border-transparent px-4 xl:px-6 py-2 xl:py-2.5 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 font-semibold text-[13px] xl:text-[15px] text-white transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:rounded-xl hover:text-white hover:shadow-[0_0_0_12px_transparent] active:scale-95 active:shadow-[0_0_0_4px_#04395E]"
                    >
                      <span className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#04395E] opacity-0 transition-all duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:h-[220px] group-hover:w-[220px] group-hover:opacity-100" />
                      <svg className="absolute left-[-25%] z-10 h-5 w-5 fill-[#04395E] transition-all duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:left-3 group-hover:fill-white" viewBox="0 0 24 24">
                        <path d="M13.172 12L8.222 7.05l1.414-1.414L16 12l-6.364 6.364-1.414-1.414z" />
                      </svg>
                      <span className="relative z-10 -translate-x-2 transition-all duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-2">
                        Apply Now
                      </span>
                      <svg className="absolute right-3 z-10 h-5 w-5 fill-[#04395E] transition-all duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:right-[-25%] group-hover:fill-white" viewBox="0 0 24 24">
                        <path d="M13.172 12L8.222 7.05l1.414-1.414L16 12l-6.364 6.364-1.414-1.414z" />
                      </svg>
                    </button>
                  </Link>
                </motion.div>

                {/* User Profile */}
                {isSignedIn && user && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 xl:gap-3 ml-2 xl:ml-3 pl-2 xl:pl-3 border-l border-slate-700/50"
                  >
                    <div className="text-right hidden xl:block">
                      <p className="text-[10px] font-medium text-slate-400 tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Welcome back,
                      </p>
                      <p className="text-[12px] font-semibold text-white truncate max-w-[110px] tracking-wide" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {user.firstName || user.username || user.email || 'Student'}
                      </p>
                    </div>
                    <motion.div whileHover={{ scale: 1.1 }} className="relative cursor-pointer">
                      <div className="w-8 h-8 xl:w-9 xl:h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                        <User size={16} strokeWidth={2} />
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 xl:w-2.5 xl:h-2.5 bg-green-400 rounded-full border-2 border-[#0f172a]" />
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={() => setOpen(!open)}
                className="relative p-2 text-slate-300 hover:text-white transition-colors duration-300 rounded-lg hover:bg-white/5"
                aria-label="Toggle menu"
              >
                <div className="relative w-5 h-5">
                  <span className={`absolute inset-0 transition-all duration-500 ${open ? 'rotate-45 opacity-0' : 'rotate-0 opacity-100'}`}>
                    <Menu size={20} strokeWidth={2.5} />
                  </span>
                  <span className={`absolute inset-0 transition-all duration-500 ${open ? 'rotate-0 opacity-100' : '-rotate-45 opacity-0'}`}>
                    <X size={20} strokeWidth={2.5} />
                  </span>
                </div>
              </button>
            </div>

            <LiveAnnouncements />
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu Drawer - Slides from Right */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ 
              type: "spring",
              damping: 20,
              stiffness: 300,
              mass: 0.5
            }}
            className="fixed right-0 top-0 bottom-0 w-[85vw] max-w-sm h-screen bg-gradient-to-b from-[#0f172a] to-[#1a2a4a] z-40 lg:hidden overflow-y-auto shadow-2xl border-l border-blue-400/20"
          >
            {/* Header with close button */}
            <div className="sticky top-0 bg-gradient-to-b from-[#0f172a] to-[#1a2a4a]/50 backdrop-blur-xl border-b border-blue-400/20 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-50">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <img src={logo} alt="Tullu" className="w-5 h-5 sm:w-6 sm:h-6 rounded" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-blue-300">Menu</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X size={22} className="text-white" strokeWidth={2} />
              </motion.button>
            </div>

            {/* Navigation Items */}
            <div className="px-3 sm:px-4 py-4 sm:py-6 space-y-1">
              {navItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  {item.path ? (
                    <Link
                      to={item.path}
                      onClick={() => setOpen(false)}
                      className={`block px-4 sm:px-5 py-3 sm:py-4 rounded-xl transition-all duration-300 font-semibold text-[14px] sm:text-[15px] tracking-wide ${
                        location.pathname === item.path
                          ? 'bg-blue-600/20 text-blue-300 border-l-2 border-blue-500'
                          : 'text-slate-300 hover:text-white hover:bg-slate-700/30'
                      }`}
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <>
                      <motion.button
                        onClick={() => toggleDropdown(index)}
                        className={`w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl transition-all duration-300 flex items-center justify-between font-semibold text-[14px] sm:text-[15px] tracking-wide ${
                          activeDropdown === index
                            ? 'bg-blue-600/20 text-blue-300'
                            : 'text-slate-300 hover:text-white hover:bg-slate-700/30'
                        }`}
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        <span>{item.name}</span>
                        <motion.span
                          animate={{ rotate: activeDropdown === index ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className={activeDropdown === index ? 'text-blue-300' : 'text-slate-400'}
                        >
                          <ChevronDown size={18} strokeWidth={2.5} />
                        </motion.span>
                      </motion.button>
                      
                      <AnimatePresence>
                        {activeDropdown === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-3 sm:pl-4 space-y-1 pt-2">
                              {item.subItems.map((subItem, subIdx) => (
                                <motion.div
                                  key={subItem.path}
                                  initial={{ opacity: 0, x: 10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: subIdx * 0.05 }}
                                >
                                  <Link
                                    to={subItem.path}
                                    onClick={() => setOpen(false)}
                                    className="block px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-[13px] sm:text-[14px] text-blue-100 hover:text-white hover:bg-blue-600/15 transition-all duration-300 font-medium tracking-wide"
                                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                  >
                                    <span className="flex items-center gap-2">
                                      <span className="w-1 h-1 bg-blue-400 rounded-full" />
                                      {subItem.name}
                                    </span>
                                  </Link>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Divider */}
            <div className="mx-3 sm:mx-4 my-3 sm:my-4 h-[1px] bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: navItems.length * 0.1 + 0.2 }}
              className="px-3 sm:px-4 space-y-2.5 sm:space-y-3 pb-6"
            >
              <motion.a 
                href="https://tuludimtuschoolerp.vercel.app"
                onClick={() => setOpen(false)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="block w-full px-4 sm:px-5 py-3 sm:py-4 text-center text-[14px] sm:text-[15px] font-semibold text-slate-300 hover:text-white rounded-xl hover:bg-slate-700/30 transition-all duration-300 tracking-wide border border-slate-600/30"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                <span className="flex items-center justify-center gap-2">
                  <User size={16} />
                  Sign In
                </span>
              </motion.a>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/admission"
                  onClick={() => setOpen(false)}
                  className="block w-full px-4 sm:px-5 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl text-center font-bold text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 tracking-wide relative overflow-hidden group text-[14px] sm:text-[15px]"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  <div className="absolute inset-0 animate-shimmer opacity-50" />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Apply Now
                  </span>
                </Link>
              </motion.div>

              {isSignedIn && user && (
                <motion.button
                  onClick={() => {
                    handleSignOut();
                    setOpen(false);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="block w-full px-4 sm:px-5 py-3 sm:py-4 text-center text-[14px] sm:text-[15px] font-semibold text-red-300 hover:text-red-200 rounded-xl hover:bg-red-500/10 transition-all duration-300 tracking-wide border border-red-500/30"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  <span className="flex items-center justify-center gap-2">
                    <LogOut size={16} />
                    Sign Out
                  </span>
                </motion.button>
              )}
            </motion.div>

            {/* Bottom decorative element */}
            <div className="px-3 sm:px-4 py-3 sm:py-4 border-t border-blue-400/20">
              <div className="text-center">
                <p className="text-[10px] sm:text-xs text-slate-400 tracking-wider">
                  <span className="text-blue-400">Tullu Dimtu School</span>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}   

export default Header;
