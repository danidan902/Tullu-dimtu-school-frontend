 import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, ChevronUp, LogOut, Lock, ExternalLink, Shield,  } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { UserButton, useUser, SignOutButton, SignInButton } from '@clerk/clerk-react';
import logo from '../assets/tullulogo.png'
import LiveAnnouncements from "./LiveAnnouncements";

function Header() {
  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const { isSignedIn, user } = useUser();
  const location = useLocation();

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
  const isShowprofilestudent = location.pathname === "/student-see-profile"





  const isActive = (path) => location.pathname === path;

  // Scroll effect for background color
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 20) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    {
      name: "Home",
      path: "/",
      // icon: <Home size={16} className="mr-1" />
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
        // { name: "Core Values", path: "/about/core-values" },
        // { name: "Campus Tour / Facilities", path: "/about/campus" },
      ],
    },
    {
      name: "Our School",
      subItems: [
        // { name: "Overview", path: "/ourschool/overview" },
        { name: "Our Curriculum", path: "/ourschool/curriculum" },
        // { name: "Our Secondary School", path: "/ourschool/secondary" },
        { name: "Our Community", path: "/ourschool/community" },
        { name: "Sport", path: "/ourschool/sport" },
      ],
    },
    {
      name: "Students",
      subItems: [
        // { name: "Student Life", path: "/students/life" },
        { name: "Rules & Policies", path: "/students/rules" },
        { name: "Student Council", path: "/students/council" },
        // { name: "Study Material Resources", path: '/email-verification'},
        
      ],
    },
    { name: "Contact Us", path: "/contact" },
    {
      name: "Other Programs",
      subItems: [
        // { name: "Teacher Form", path: "/other/teacher-profile" },
       
        { name: "Teacher Attendance Upload", path: "/teacher-email" },
        //  { name: "Form", path: "/form"},
        //  {name: "CreateNews", path: "/director-news"},
         {name: "School Announcement", path: "/school-news"},
          { name: "Teacher List", path: "/other/teacher-list" },
         {name: "School Gallary", path: "/gallery"},
         { name: "School Calendar", path: '/school-Calendar'},
         { name: "Phone", path: "/verify-phone"},
        //  { name: "Notes gade", path: "/student-note"},
        //  { name: "Notes Grade 9", path: "/student-note9"},
        //  { name: "Gadre 10 Notes", path: "/student-note10"},
        //  { name: "Gadre 11 Notes", path: "/student-note11"},
        //  { name: "Student", path: "/student-dashbord"}
        //  { name: "School Visit", path: "/schedule-visit"}
        // { name: "Teachers", path: "/teachersupload-platform"},
        // { name: "Study Material", path: "/youtube-titorial"}
        // { name: "Dshbord", path: '/dashbord-visitor'},
        // { name: "Acadamics", path: '/acadamics-dashboard'},
        //  {name: "Admin Cont", path: '/admin-control'}
        
      ]
    },
   
   
  ]; 

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const navLinkClass = `
    relative after:absolute after:bottom-0 after:left-1/2 
    after:w-0 after:h-[2px] 
    after:transition-all after:duration-300 after:-translate-x-1/2
    hover:after:w-[80%]
  `;

  const renderDesktopDropdown = (subItems) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl py-2 w-56 z-50 border border-gray-100"
    >
      {subItems.map(({ name, path }) => (
        <Link
          to={path}
          key={name}
          className={`block px-4 py-2.5 text-sm text-indigo-700 hover:text-blue-600 transition-colors ${navLinkClass} after:bg-blue-600`}
          onClick={() => setActiveDropdown(null)}
        >
          {name}
        </Link>
      ))}
    </motion.div>
  );

  const renderMobileDropdown = (subItems, isOpen) => (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
      className="overflow-hidden pl-4"
    >
      {subItems.map(({ name, path }) => (
        <Link
          to={path}
          key={name}
          className={`block py-2.5 text-sm text-indigo-700 hover:text-blue-600 ${navLinkClass} after:bg-blue-600`}
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
    <motion.header
     initial={{
  backgroundColor: "rgba(209, 213, 219, 0)",
  backdropFilter: "blur(0px)"
}}
animate={{
  backgroundColor: hasScrolled
    ? "rgba(209, 213, 219, 1)"
    : "rgba(209, 213, 219, 0)",
  backdropFilter: hasScrolled ? "blur(10px)" : "blur(0px)",
  boxShadow: hasScrolled ? "0 10px 30px rgba(0, 0, 0, 0.1)" : "none",
  borderBottom: hasScrolled
    ? "1px solid rgba(156, 163, 175, 0.6)"
    : "1px solid rgba(156, 163, 175, 0)"
}}
transition={{
  duration: 0.5,
  ease: "easeInOut",
  backgroundColor: { duration: 0.4 },
  backdropFilter: { duration: 0.3 }
}}
className="fixed top-0 left-0 right-0 z-50 text-gray-800"

    >
      {/* Animated gradient background effect on scroll */}
      <motion.div
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{
          opacity: hasScrolled ? 0.4 : 0,
          scaleY: hasScrolled ? 1 : 0,
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/20 to-white pointer-events-none"
      />
      
      {/* Glow effect on scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: hasScrolled ? 0.8 : 0 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100/20 to-transparent pointer-events-none"
      />
      
      {/* Floating particles effect */}
      {hasScrolled && (
        <>
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 0.1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="absolute top-2 left-1/4 w-1 h-1 bg-blue-400 rounded-full"
          />
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 0.1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="absolute top-4 right-1/3 w-1 h-1 bg-blue-400 rounded-full"
          />
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 0.1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="absolute top-3 left-2/3 w-1 h-1 bg-blue-400 rounded-full"
          />
        </>
      )}

     <div className="relative w-full px-6 lg:px-12 py-3 flex justify-between items-center">


        {/* Logo with Home Link */}
        <Link
          to="/"
          className="flex items-center group relative z-10"
        >
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <img 
              src={logo} 
              alt="Tullu Dimtu School Logo" 
              className="h-16 w-16 hidden md:block"
            />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: hasScrolled ? 1 : 0 }}
              className="absolute -inset-2 bg-blue-100/30 rounded-full blur-md"
            />
          </motion.div>
        </Link>

        <nav className="hidden md:flex items-center gap-[24px] font-semibold ml-20">
          {navItems.map((item, index) => (
            <div key={index} className="relative">
              {item.path ? (
                <motion.div
                  whileHover={{ scale: index === 0 ? 1.05 : 1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Link
                    to={item.path}
                    className={`
                      text-sm font-bold py-2 ${navLinkClass}
                      ${index === 0 ? 
                        `flex items-center px-4 py-2.5 rounded-lg transition-all duration-300 
                         ${hasScrolled ? 
                           "text-blue-600 font-bold hover:text-blue-700 hover:bg-blue-50/50 after:bg-blue-600" 
                           : 
                           "text-white font-bold hover:text-white/90 after:bg-white"
                         }`
                        : 
                        `text-indigo-700 hover:text-blue-600 after:bg-blue-600
                         ${hasScrolled ? "" : "text-white hover:text-white/90 after:bg-white"}`
                      }
                    `}
                  >
                    {index === 0 && item.icon}
                    {item.name}
                    {index === 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: hasScrolled ? 1 : 0 }}
                        className="absolute -inset-2 bg-blue-100/20 rounded-lg blur-sm -z-10"
                      />
                    )}
                  </Link>
                </motion.div>
              ) : (
                <button
                  className={`
                    text-sm font-bold py-2 flex items-center gap-1 ${navLinkClass} 
                    ${activeDropdown === index ? "text-blue-600" : ""}
                    ${hasScrolled ? 
                      "text-indigo-700 hover:text-blue-600 after:bg-blue-600" 
                      : 
                      "text-white hover:text-white/90 after:bg-white"
                    }
                  `}
                  onClick={() => toggleDropdown(index)}
                  onMouseEnter={() => setActiveDropdown(index)}
                >
                  {item.name}
                  {activeDropdown === index ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              )}
              {item.subItems && activeDropdown === index && (
                <div
                  className="absolute"
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {renderDesktopDropdown(item.subItems)}
                </div>
              )}
            </div>
          ))}

          {/* Action Buttons Container */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Apply Now Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              <motion.div
                animate={{
                  scale: [1, 1.02, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-teal-500 to-blue-600 rounded-xl blur opacity-50"
              />
              <Link
                to="/admission"
                className="relative flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white shadow-lg transition-all duration-300 bg-gradient-to-r from-blue-700 to-teal-600   active:translate-y-0.5"
              >
                Apply Now
                <motion.span
                  animate={{ x: [0, 3, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  →
                </motion.span>
              </Link>
            </motion.div>

            {/* User Profile */}
            {isSignedIn && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center space-x-3 ml-2 pl-3 border-l border-neutral-200"
              >
                <div className="text-right hidden xl:block">
                  <p className="text-xs font-medium text-neutral-500">
                    Welcome,
                  </p>
                  <p className="text-sm font-semibold text-neutral-900 truncate max-w-[120px]">
                    {user.firstName || user.username}
                  </p>
                </div>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full blur opacity-0 hover:opacity-30 transition duration-500"></div>
                  <UserButton 
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10 border-2 border-white shadow-lg",
                        rootBox: "relative z-10"
                      }
                    }}
                  />
                </motion.div>
              </motion.div>
            )}

            {/* Sign In Button - Wrap with SignInButton for Clerk authentication */}
            <div className="relative group flex items-center space-x-3 ml-2 pl-3 border-l border-neutral-200">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-teal-500 rounded-lg blur opacity-0 group-hover:opacity-15 transition duration-500"></div>
              <SignInButton mode="modal">
                <a href="/profile-page">
                  <button className="relative flex items-center gap-2 px-5 py-2.5 bg-white rounded-lg border border-neutral-200 text-sm font-medium text-neutral-700 hover:text-blue-700 hover:border-blue-300 transition-all duration-300 group-hover:shadow-md group-hover:shadow-blue/10">
                  <Shield size={16} className="text-blue-600 group-hover:text-blue-700" />
                  Sign In
                  <ExternalLink size={12} className="opacity-60 group-hover:opacity-80" />
                </button>
                </a>
              </SignInButton>
            </div>
          </div>
        </nav>


    

        {/* Enhanced Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2 mr-auto">
          <motion.button
            onClick={() => setOpen(!open)}
            className="relative p-3 group focus:outline-none z-10"
            aria-label="Toggle menu"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              className="absolute inset-0 border-2 rounded-xl group-hover:border-blue-400 "
              initial={false}
              animate={{
                borderColor: open ? "rgba(59, 130, 246, 1)" : hasScrolled ? "rgba(99, 102, 241, 0.5)" : "rgba(255, 255, 255, 0.5)",
                backgroundColor: open ? "rgba(219, 234, 254, 0.5)" : hasScrolled ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.1)"
              }}
              transition={{ duration: 0.3 }}
            />

            <motion.div
              animate={{
                rotate: open ? 90 : 0,
                scale: open ? 1.1 : 1
              }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              {open ? (
                <X
                  size={30}
                  className="text-blue-600 group-hover:text-blue-800 transition-colors"
                />
              ) : (
                <Menu
                  size={30}
                  className={hasScrolled ? "text-blue-600 group-hover:text-blue-800" : "text-white group-hover:text-white/80 transition-colors"}
                />
              )}
            </motion.div>
          </motion.button>
        </div>

        <LiveAnnouncements />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed top-0 right-0 h-screen w-80 bg-white shadow-2xl z-50 p-6 overflow-y-auto border-l border-gray-100"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-blue-800">Menu</h2> 
                
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            

          
            {isSignedIn && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <UserButton 
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10 border-2 border-blue-500"
                      }
                    }}
                  />
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      {user.firstName || user.username}
                    </p>
                    <p className="text-xs text-gray-600">Welcome back!</p>
                  </div>
                </div>
                
                {/* Mobile Sign Out Button */}
                <SignOutButton>
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-red-200">
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </SignOutButton>
              </div>
            )}

            <div className="space-y-2">
              {navItems.map((item, index) => (
                <div key={index} className="border-b border-gray-100 pb-2">
                  {item.path ? (
                    <Link
                      to={item.path}
                      className={`
                        block py-3 px-2 font-medium ${navLinkClass}
                        ${index === 0 ? 
                          "text-blue-600 bg-blue-50 rounded-lg px-4 font-semibold flex items-center after:bg-blue-600" 
                          : 
                          "text-indigo-700 after:bg-blue-600"
                        }
                      `}
                      onClick={() => setOpen(false)}
                    >
                      {index === 0 && item.icon}
                      {item.name}
                    </Link>
                  ) : (
                    <>
                      <button
                        className={`w-full flex justify-between items-center py-3 px-2 text-indigo-700 font-medium ${navLinkClass} after:bg-blue-600 ${
                          activeDropdown === index ? "text-blue-600" : ""
                        }`}
                        onClick={() => toggleDropdown(index)}
                      >
                        {item.name}
                        {activeDropdown === index ? (
                          <ChevronUp size={18} />
                        ) : (
                          <ChevronDown size={18} />
                        )}
                      </button>
                      {renderMobileDropdown(
                        item.subItems,
                        activeDropdown === index
                      )}
                    </>
                  )}
                </div>
              ))}

              {/* Mobile Sign In Button - Wrap with SignInButton */}
             

              {/* Mobile Apply Now Button */}
              <div className="mt-4">
                <Link
                  to="/admission" 
                  className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-md text-gray-900 bg-yellow-400 hover:bg-yellow-500 transition-all duration-300 transform hover:-translate-y-0.5 border-2 border-yellow-500"
                  onClick={() => setOpen(false)}
                >
                  Apply Now
                </Link>
              </div>

               <div className="mt-4">
              
                 <a href="/profile-page">
                   <button className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-blue-600 text-base font-medium rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition-all duration-300">
                    <Lock size={18} />
                    Sign In
                  </button>
                  </a>
              
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>     
    </motion.header>
  );
}   

export default Header;

