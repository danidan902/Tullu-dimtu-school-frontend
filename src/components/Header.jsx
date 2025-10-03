import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown, ChevronUp, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { UserButton, useUser, SignOutButton } from '@clerk/clerk-react';
import logo from '../assets/tullulogo.png'

function Header() {
  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { isSignedIn, user } = useUser();

  const navItems = [
    { name: "", path: "/" },
    {
      name: "About Us",
      subItems: [
        { name: "Chairman's Welcome", path: "/about/chairman-welcome" },
        { name: "Mission & Vision", path: "/about/mission-vision" },
        { name: "Our History", path: "/about/our-history" },
        { name: "Principal's Message", path: "/about/principal-message" },
        { name: "School Profile", path: "/about/school-profile" },
        { name: "School Achievements", path: "/about/school-achievements" },
        { name: "Core Values", path: "/about/core-values" },
        { name: "Campus Tour / Facilities", path: "/about/campus" },
      ],
    },
    {
      name: "Our School",
      subItems: [
        { name: "Overview", path: "/ourschool/overview" },
        { name: "Our Curriculum", path: "/ourschool/curriculum" },
        { name: "Our Secondary School", path: "/ourschool/secondary" },
        { name: "Our Community", path: "/ourschool/community" },
        { name: "Sport", path: "/ourschool/sport" },
      ],
    },
    {
      name: "Students",
      subItems: [
        { name: "Student Life", path: "/students/life" },
        { name: "Rules & Policies", path: "/students/rules" },
        { name: "Student Council", path: "/students/council" },
      ],
    },
    { name: "Contact Us", path: "/contact" },
  ];

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const navLinkClass = `
    relative after:absolute after:bottom-0 after:left-1/2 
    after:w-0 after:h-[2px] after:bg-blue-600 
    after:transition-all after:duration-300 after:-translate-x-1/2
    hover:after:w-[80%] hover:text-blue-600
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
          className={`block px-4 py-2.5 text-sm text-indigo-700 hover:text-blue-600 transition-colors ${navLinkClass}`}
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
          className={`block py-2.5 text-sm text-indigo-700 hover:text-blue-600 ${navLinkClass}`}
          onClick={() => setOpen(false)}
        >
          {name}
        </Link>
      ))}
    </motion.div>
  );

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md text-gray-800 z-50 shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center group"
        >
          <img 
            src={logo} 
            alt="Tullu Dimtu School Logo" 
            className="h-16 w-16 ml-12" 
          />
        </Link>

        <nav className="hidden md:flex items-center mr-10 gap-10">
          {navItems.map((item, index) => (
            <div key={index} className="relative">
              {item.path ? (
                <Link
                  to={item.path}
                  className={`text-sm font-medium text-indigo-700 py-2 ${navLinkClass}`}
                >
                  {item.name}
                </Link>
              ) : (
                <button
                  className={`text-sm font-medium text-indigo-700 py-2 flex items-center gap-1 ${navLinkClass} ${
                    activeDropdown === index ? "text-blue-600" : ""
                  }`}
                  onClick={() => toggleDropdown(index)}
                  onMouseEnter={() => setActiveDropdown(index)}
                >
                  {item.name}
                </button>
              )}
              {item.subItems && activeDropdown === index && (
                <div
                  className="absolute left-0"
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {renderDesktopDropdown(item.subItems)}
                </div>
              )}
            </div>
          ))}

           <div className="relative group ml-2">
            <div className="absolute -inset-0.5 bg-yellow-400 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-200 animate-pulse"></div>
            <Link
              to="/admission"     
              className="relative px-6 py-2.5 bg-yellow-400 rounded-full text-sm font-semibold text-gray-900 group-hover:bg-yellow-500 transition duration-200 border-2 border-yellow-500 hover:border-yellow-600 shadow-lg hover:shadow-yellow-200/50"
            >
              Apply Now
              <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
            </Link>
          </div>

          {/* User Section for Desktop */}
          {isSignedIn && (
            <div className="flex items-center gap-4 ml-4">
              {/* Welcome Message */}
              <span className="text-sm font-medium text-indigo-700">
                Welcome, {user.firstName || user.username}
              </span>
              
              {/* User Button with Dropdown */}
              <div className="relative">
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8 border-2 border-blue-500",
                      rootBox: "flex items-center"
                    }
                  }}
                />
              </div>

              {/* Alternative Sign Out Button */}
              {/* <SignOutButton>
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                  <LogOut size={16} />
                  Sign Out
                </button>
              </SignOutButton> */}
            </div>
          )}

          {/* Vibrant Yellow Apply Now Button */}
         
        </nav>

        {/* Enhanced Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden relative p-3 group focus:outline-none"
          aria-label="Toggle menu"
        >
          <motion.div
            className="absolute inset-0 border-2 border-gray-200 rounded-xl group-hover:border-blue-400"
            initial={false}
            animate={{
              borderColor: open ? "rgba(59, 130, 246, 1)" : "rgba(229, 231, 235, 1)",
              backgroundColor: open ? "rgba(219, 234, 254, 0.5)" : "rgba(255, 255, 255, 0)"
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
                className="text-gray-600 group-hover:text-blue-600 transition-colors"
              />
            )}
          </motion.div>
        </button>
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

            {/* User Info for Mobile */}
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
                    <p className="text-xs text-blue-600">Welcome back!</p>
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
                      className={`block py-3 px-2 text-indigo-700 font-medium ${navLinkClass}`}
                      onClick={() => setOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <>
                      <button
                        className={`w-full flex justify-between items-center py-3 px-2 text-indigo-700 font-medium ${navLinkClass} ${
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

              {/* Mobile Yellow Apply Now Button */}
              <div className="mt-6">
                <Link
                  to="/admission" 
                  className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-md text-gray-900 bg-yellow-400 hover:bg-yellow-500 transition-all duration-300 transform hover:-translate-y-0.5 border-2 border-yellow-500"
                  onClick={() => setOpen(false)}
                >
                  Apply Now
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;
