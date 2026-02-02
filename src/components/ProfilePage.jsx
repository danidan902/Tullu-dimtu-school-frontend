
import { motion } from "framer-motion";
import bg from '../assets/take1.jpg'
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

const CambridgeAcademy = () => {
  return (
   <>
      <Helmet>
              <title>Login</title>
            </Helmet>
   
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">

     
      <motion.div
        className="relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9 }}
      >
       
        <div className="absolute inset-0">
          <img 
            src={bg} 
            alt="School Background"
            className="w-full h-full object-cover object-center"
          />
         
         
        
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 min-h-screen flex flex-col justify-between px-5 py-8 md:px-10 md:py-12">
          <motion.div
            className="max-w-lg"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
        
           
            <motion.h1
  className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 text-center leading-tight mt-20 md:mt-0"
  variants={itemVariants}
>
  LogIn
</motion.h1>

            <motion.div
              className="mt-8 pt-6 border-t border-white/30 max-w-md"
              variants={itemVariants}
            >
              <p className="text-sm md:text-base text-white/80 leading-relaxed">

              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="flex items-center justify-center bg-white px-4 py-8 md:px-6 md:py-0"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, ease: "easeOut" }}
      >
        <div className="w-full max-w-sm md:max-w-md text-center">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
  Explore Our Digital Library
</h1>

<p className="text-sm md:text-lg text-gray-600 max-w-xl mx-auto leading-relaxed mb-10 md:mb-12">
  Log in to access a wide range of academic resources, textbooks, and study materials.
</p>


          <div className="space-y-4 md:space-y-6">
            <motion.a
              href="/signIn"
              className="block"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <button className="w-full bg-teal-200 hover:bg-teal-300 text-teal-900 py-3 rounded-lg font-semibold transition-colors duration-300">
                Admin Login
              </button>
            </motion.a>
  
            <motion.a
              href="/email-verification"
              className="block"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >          
              <button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-semibold transition-colors duration-300">
                Student Login
              </button>
            </motion.a>

        
          </div>


          <div className="mt-10 pt-6 border-t border-gray-200">

          </div>
        </div>
      </motion.div>
    </div>
   
   </>
  );
};

export default CambridgeAcademy;