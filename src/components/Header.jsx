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

  const handleSignOut = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRole');
    setIsSignedIn(false);
    setUser(null);
    navigate('/');
  };

  useEffect(() => {
    setOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

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
    { name: "Home", path: "/" },
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
      className="absolute top-full left-0 mt-1 bg-[#04395E] shadow-2xl py-2 w-56 z-50 border border-blue-400/30"
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
            className="block px-4 py-2.5 text-[12px] font-medium text-white bg-[#04395E] hover:text-yellow-200 hover:bg-[#033150] transition-all duration-300 tracking-wide"
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
          className="block py-1 text-[13px] text-blue-100 hover:text-white font-medium transition-colors duration-300 tracking-wide"
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
    <header className="fixed top-0 left-0 right-0 z-50 w-full">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-float { animation: float linear infinite; }
        .animate-gradient-x { background-size: 200% auto; animation: gradient-x 3s linear infinite; }
        .animate-marquee { animation: marquee 30s linear infinite; }
        .animate-marquee:hover { animation-play-state: paused; }
        .animate-shimmer {
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        .font-smooth { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
      `}</style>

      {/* ===== MAIN NAV — SOLID BLUE, FULL WIDTH, SQUARE ===== */}
      <motion.nav
        initial={{ y: 0 }}
        animate={{
          y: showHeader ? 0 : -200,
        }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
          y: { type: "spring", stiffness: 300, damping: 30 },
        }}
        className={`relative w-full bg-[#04395E] ${hasScrolled ? '' : ''}`}
      >
        <div className="w-full px-3 sm:px-4 lg:px-6">
          {/* Nav height bumped a little so the bigger logo fits nicely */}
          <div className="flex items-center justify-between h-[64px] sm:h-[72px] lg:h-[80px]">
            {/* ===== LOGO — LARGER & MORE VISIBLE ===== */}
            <div className="flex-shrink-0">
              <Link to="/" className="relative flex items-center gap-2.5 sm:gap-3 lg:gap-4 group">
                <div className="relative">
                  {/* Bigger white container + ring for visibility */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl flex items-center justify-center bg-white ring-2 ring-white/40 shadow-lg shadow-black/20 group-hover:ring-yellow-300/70 transition-all duration-300">
                    <img 
                      src={logo} 
                      alt="Tullu Dimtu School" 
                      className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 object-contain rounded-lg"
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  {/* Bigger school name */}
                  <span 
                    className="text-lg sm:text-xl lg:text-2xl xl:text-[26px] font-black tracking-tight leading-none text-white drop-shadow-sm"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    Tullu Dimtu
                  </span>
                  {/* Bigger subtitle */}
                  <span 
                    className="text-[9px] sm:text-[10px] lg:text-[11px] xl:text-[12px] font-bold text-yellow-300 tracking-[0.25em] uppercase mt-1"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    School
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation — WHITE SMALL LINKS */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item, index) => (
                <div key={index} className="relative">
                  {item.path ? (
                    <Link to={item.path} className="relative group px-3 xl:px-4 py-2.5 block">
                      <span className="relative flex items-center">
                        <span 
                          className="text-[12px] xl:text-[13px] font-medium transition-all duration-300 tracking-wide text-white group-hover:text-yellow-200"
                          style={{ 
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            letterSpacing: '0.02em'
                          }}
                        >
                          {item.name}
                        </span>
                        <span
                          className={`absolute -bottom-1.5 left-0 right-0 h-[2px] bg-yellow-300 transform origin-left transition-transform duration-500 ${
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
                      <span className="relative flex items-center gap-1">
                        <span 
                          className="text-[12px] xl:text-[13px] font-medium transition-all duration-300 tracking-wide text-white group-hover:text-yellow-200"
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
                          className="text-white"
                        >
                          <ChevronDown size={13} strokeWidth={2.5} />
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
              <div className="flex items-center gap-2 xl:gap-3 ml-3 xl:ml-5 pl-3 xl:pl-5 border-l border-white/30">
                <Link to="https://tuludimtuschoolerp.vercel.app/">
                  <button className="group relative flex items-center gap-1 overflow-hidden px-4 xl:px-5 py-2 font-semibold text-[12px] xl:text-[13px] text-white transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:rounded-xl active:scale-95">
                    <span className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 opacity-0 transition-all duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:h-[220px] group-hover:w-[220px] group-hover:opacity-100" />
                    <span className="relative z-10">
                      Sign In
                    </span>
                  </button>
                </Link>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link to="/admission">
                    <button className="group relative flex items-center gap-1 overflow-hidden rounded-lg px-4 xl:px-5 py-2 bg-white font-semibold text-[12px] xl:text-[13px] text-[#04395E] transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:rounded-xl active:scale-95 shadow-md">
                      <span className="relative z-10">
                        Apply Now
                      </span>
                    </button>
                  </Link>
                </motion.div>

                {isSignedIn && user && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 xl:gap-3 ml-2 xl:ml-3 pl-2 xl:pl-3 border-l border-white/30"
                  >
                    <div className="text-right hidden xl:block">
                      <p className="text-[9px] font-medium text-blue-200 tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Welcome back,
                      </p>
                      <p className="text-[11px] font-semibold text-white truncate max-w-[100px] tracking-wide" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {user.firstName || user.username || user.email || 'Student'}
                      </p>
                    </div>
                    <motion.div whileHover={{ scale: 1.1 }} className="relative cursor-pointer">
                      <div className="w-8 h-8 xl:w-9 xl:h-9 rounded-lg bg-white/20 flex items-center justify-center text-white">
                        <User size={16} strokeWidth={2} />
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 xl:w-2.5 xl:h-2.5 bg-green-400 rounded-full border-2 border-[#04395E]" />
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={() => setOpen(!open)}
                className="relative p-2 text-white hover:text-yellow-200 transition-colors duration-300 rounded-lg hover:bg-white/10"
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

      {/* Mobile Menu Drawer — SOLID BLUE */}
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
            className="fixed right-0 top-0 bottom-0 w-[85vw] max-w-sm h-screen bg-[#04395E] z-40 lg:hidden overflow-y-auto shadow-2xl"
          >
            <div className="sticky top-0 bg-[#033150] border-b border-blue-900/50 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-50">
              <div className="flex items-center gap-2.5">
                {/* Bigger logo in mobile drawer */}
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white ring-2 ring-white/40 flex items-center justify-center">
                  <img src={logo} alt="Tullu" className="w-7 h-7 sm:w-8 sm:h-8 object-contain rounded" />
                </div>
                <span className="text-sm sm:text-base font-bold text-white">Menu</span>
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
                      className={`block px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl transition-all duration-300 font-medium text-[13px] sm:text-[14px] tracking-wide ${
                        location.pathname === item.path
                          ? 'bg-white/20 text-yellow-200'
                          : 'text-white hover:bg-white/10'
                      }`}
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <>
                      <motion.button
                        onClick={() => toggleDropdown(index)}
                        className={`w-full px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl transition-all duration-300 flex items-center justify-between font-medium text-[13px] sm:text-[14px] tracking-wide ${
                          activeDropdown === index
                            ? 'bg-white/20 text-yellow-200'
                            : 'text-white hover:bg-white/10'
                        }`}
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        <span>{item.name}</span>
                        <motion.span
                          animate={{ rotate: activeDropdown === index ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="text-white"
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
                                    className="block px-3 sm:px-4 py-2.5 rounded-lg text-[12px] sm:text-[13px] text-blue-100 hover:text-white hover:bg-white/10 transition-all duration-300 font-medium tracking-wide"
                                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                  >
                                    <span className="flex items-center gap-2">
                                      <span className="w-1 h-1 bg-white rounded-full" />
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

            <div className="mx-3 sm:mx-4 my-3 sm:my-4 h-[1px] bg-white/20" />

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
                className="block w-full px-4 sm:px-5 py-3 sm:py-3.5 text-center text-[13px] sm:text-[14px] font-semibold text-white rounded-xl hover:bg-white/10 transition-all duration-300 tracking-wide border border-white/30"
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
                  className="block w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-white rounded-xl text-center font-bold text-[#04395E] shadow-lg transition-all duration-300 tracking-wide relative overflow-hidden group text-[13px] sm:text-[14px]"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
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
                  className="block w-full px-4 sm:px-5 py-3 sm:py-3.5 text-center text-[13px] sm:text-[14px] font-semibold text-red-200 hover:text-white rounded-xl hover:bg-red-500/20 transition-all duration-300 tracking-wide border border-red-300/40"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  <span className="flex items-center justify-center gap-2">
                    <LogOut size={16} />
                    Sign Out
                  </span>
                </motion.button>
              )}
            </motion.div>

            <div className="px-3 sm:px-4 py-3 sm:py-4 border-t border-white/20">
              <div className="text-center">
                <p className="text-[10px] sm:text-xs text-blue-200 tracking-wider">
                  <span className="text-white">Tullu Dimtu School</span>
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
