
import React from "react";
import { motion } from "framer-motion";
import logo from "../assets/tullulogo.png";
import bg from '../assets/lo.jpg'
import { Helmet } from "react-helmet-async";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.9 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: "easeOut" },
  },
};

const AdmissionPage = () => {
  return (
   <>
      <Helmet>
              <title>Login</title>
            </Helmet>
   
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
       <div className="absolute bottom-0 left-0 w-full h-[80px] sm:h-[120px] md:h-[180px] z-30">
  
  {/* solid background overlap */}
  <div className="absolute bottom-0 left-0 w-full h-[px] bg-white"></div>

  {/* wave */}
  <svg
    className="absolute bottom-0 left-0 block w-full h-full scale-y-[-1]"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1200 120"
    preserveAspectRatio="none"
  >
    <path
      d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
      fill="teal"
    />
  </svg>
</div>

      {/* LEFT SECTION - IMAGE WITH TEXT OVERLAY */}
      <motion.div
        className="relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9 }}
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={bg} 
            alt="School Background"
            className="w-full h-full object-cover object-center"
          />
          {/* Gradient Overlay - Left to Right */}
        
          
          {/* Additional subtle gradient for depth */}
         <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent z-10"></div>
          
        </div>

        {/* Content Overlay - Positioned on left side */}
        <div className="relative z-10 min-h-screen flex flex-col justify-between px-5 py-8 md:px-10 md:py-12">
          <motion.div
            className="max-w-lg"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* <motion.img
              src={logo}
              alt="School Logo"
              className="w-28 md:w-36 mb-8"
              variants={itemVariants}
            /> */}
           
           


       <motion.div
  className="flex flex-col items-center text-center"
  variants={itemVariants}
>
  <motion.h1
    className="font-[Playfair_Display] 
               text-4xl sm:text-5xl md:text-6xl 
               font-bold tracking-tight 
               text-white mb-3 mt-20"
  >
    Welcome <span className="text-teal-400">Back</span>
  </motion.h1>

  <motion.h2
    className="font-[Inter] 
               text-base sm:text-lg md:text-xl 
               font-medium 
               text-blue-100 
               max-w-xl leading-relaxed"
  >
    Tullu Dimtu Secondary School
  </motion.h2>
</motion.div>

           

        

           
          </motion.div>

          {/* Footer */}
        
        </div>
      </motion.div>

      {/* RIGHT SECTION - FORM */}
      <motion.div
        className="flex items-center justify-center bg-white px-4 py-8 md:px-6 md:py-0"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, ease: "easeOut" }}
      >
        <div className="w-full max-w-sm md:max-w-md text-center">
          <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-2">
            Start your journey with us today
          </h1>

          <p className="text-sm md:text-base text-gray-500 mb-10 md:mb-12">
            
          </p>

          <div className="space-y-4 md:space-y-6">
            <motion.a
              href="/online-admission"
              className="block"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <button className="w-full bg-teal-200 hover:bg-teal-300
                                 text-teal-900 py-3 rounded-lg font-semibold">
                New admission
              </button>
            </motion.a>
  
            <motion.a
              href="/logIn"
              className="block"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <button className="w-full bg-teal-600 hover:bg-teal-700
                                 text-white py-3 rounded-lg font-semibold">
                Login
              </button>
            </motion.a>

        
          </div>

          {/* Additional info */}
          <div className="mt-10 pt-6 border-t border-gray-200">
            {/* <p className="text-xs text-gray-500">
              Need assistance? Contact us at: admissions@tuludimtu.edu
            </p> */}
          </div>
        </div>
      </motion.div>
    </div>
   
   </>
  );
};

export default AdmissionPage;