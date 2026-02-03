import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const floatingLabel = {
  initial: { top: "1rem", fontSize: "1rem", color: "#9CA3AF" },
  active: { top: "-0.5rem", fontSize: "0.75rem", color: "#3B82F6" },
};

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    emailOrPhone: "",
    studentId: "",
    title: "",
    day: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [activeField, setActiveField] = useState(null);

  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const validateForm = () => {
    let tempErrors = {};
    if (!formData.fullName) tempErrors.fullName = "Full Name is required";
    if (!formData.emailOrPhone) tempErrors.emailOrPhone = "Email or Phone is required";
    if (!formData.studentId) tempErrors.studentId = "Student ID is required";
    if (!formData.title) tempErrors.title = "Title is required";
    if (!formData.day) tempErrors.day = "Date is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post("https://tullu-dimtu-school-backend-1.onrender.com/api/users", {
        fullname: formData.fullName,
        email: formData.emailOrPhone,
        studentId: formData.studentId,
        title: formData.title,
        day: formData.day,
      });

      setIsSuccess(true);
      setFormData({
        fullName: "",
        emailOrPhone: "",
        studentId: "",
        title: "",
        day: "",
      });

      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      console.error("Submission error:", error);
      alert(error.response?.data?.error || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md mt-20 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
        >
          
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-center">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center mb-3"
            >
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                  <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </motion.div>
            <motion.h1
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-2xl font-bold text-white mb-1"
            >
              Register Now
            </motion.h1>
            <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-blue-100 text-sm"
            >
              Join our tullu dimtu sport club in seconds
            </motion.p>
          </div>

          <AnimatePresence>
            {isSuccess && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-green-50 text-green-700 px-4 py-3 text-sm flex items-center justify-center"
                >
                  Registration successful! Redirecting...
                </motion.div>
            )}
          </AnimatePresence>

         
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
           
            <div className="relative">
              <motion.label
                  htmlFor="fullName"
                  initial="initial"
                  animate={activeField === "fullName" || formData.fullName ? "active" : "initial"}
                  variants={floatingLabel}
                  className="absolute left-3 px-1 bg-white text-gray-500 pointer-events-none origin-left"
              >
                Full Name
              </motion.label>
              <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  onFocus={() => setActiveField("fullName")}
                  onBlur={() => setActiveField(null)}
                  className={`w-full px-4 py-3 rounded-lg border ${
                      errors.fullName ? "border-red-300" : "border-gray-200 hover:border-blue-300"
                  } focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition`}
              />
              <AnimatePresence>
                {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
              </AnimatePresence>
            </div>

           
            <div className="relative">
              <motion.label
                  htmlFor="emailOrPhone"
                  initial="initial"
                  animate={activeField === "emailOrPhone" || formData.emailOrPhone ? "active" : "initial"}
                  variants={floatingLabel}
                  className="absolute left-3 px-1 bg-white text-gray-500 pointer-events-none origin-left"
              >
                Email or Phone
              </motion.label>
              <input
                  type="text"
                  id="emailOrPhone"
                  name="emailOrPhone"
                  value={formData.emailOrPhone}
                  onChange={handleChange}
                  onFocus={() => setActiveField("emailOrPhone")}
                  onBlur={() => setActiveField(null)}
                  className={`w-full px-4 py-3 rounded-lg border ${
                      errors.emailOrPhone ? "border-red-300" : "border-gray-200 hover:border-blue-300"
                  } focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition`}
              />
              <AnimatePresence>
                {errors.emailOrPhone && <p className="mt-1 text-xs text-red-500">{errors.emailOrPhone}</p>}
              </AnimatePresence>
            </div>

           
            <div className="relative">
              <motion.label
                  htmlFor="studentId"
                  initial="initial"
                  animate={activeField === "studentId" || formData.studentId ? "active" : "initial"}
                  variants={floatingLabel}
                  className="absolute left-3 px-1 bg-white text-gray-500 pointer-events-none origin-left"
              >
                Student ID
              </motion.label>
              <input
                  type="text"
                  id="studentId"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  onFocus={() => setActiveField("studentId")}
                  onBlur={() => setActiveField(null)}
                  className={`w-full px-4 py-3 rounded-lg border ${
                      errors.studentId ? "border-red-300" : "border-gray-200 hover:border-blue-300"
                  } focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition`}
              />
              <AnimatePresence>
                {errors.studentId && <p className="mt-1 text-xs text-red-500">{errors.studentId}</p>}
              </AnimatePresence>
            </div>

            <div className="grid grid-cols-2 gap-4">
          
              <div className="relative">
                <motion.label
                    htmlFor="title"
                    initial="initial"
                    animate={activeField === "title" || formData.title ? "active" : "initial"}
                    variants={floatingLabel}
                    className="absolute left-3 px-1 bg-white text-gray-500 pointer-events-none origin-left"
                >
                  Title
                </motion.label>
                <select
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    onFocus={() => setActiveField("title")}
                    onBlur={() => setActiveField(null)}
                    className={`w-full px-4 py-3 rounded-lg border ${
                        errors.title ? "border-red-300" : "border-gray-200 hover:border-blue-300"
                    } focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition appearance-none`}
                >
                  <option value=""></option>
                  <option value="Football">Football</option>
                  <option value="Handball">Handball</option>
                  <option value="Athletics">Athletics</option>
                  <option value="Tennis">Tennis</option>
                </select>
                <AnimatePresence>
                  {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
                </AnimatePresence>
              </div>
              <div className="relative">
                <motion.label
                    htmlFor="day"
                    initial="initial"
                    animate={activeField === "day" || formData.day ? "active" : "initial"}
                    variants={floatingLabel}
         
                className="absolute left-3 px-1 bg-white text-gray-500 pointer-events-none origin-left"
                >
                  Date
                </motion.label>
                <input
                    type="date"
                    id="day"
                    name="day"
                    value={formData.day}
                    onChange={handleChange}
                    onFocus={() => setActiveField("day")}
                    onBlur={() => setActiveField(null)}
                    className={`w-full px-4 py-3 rounded-lg border ${
                        errors.day ? "border-red-300" : "border-gray-200 hover:border-blue-300"
                    } focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition`}
                />
                <AnimatePresence>
                  {errors.day && <p className="mt-1 text-xs text-red-500">{errors.day}</p>}
                </AnimatePresence>
              </div>
            </div>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
                    isSubmitting ? "bg-blue-400" : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                } focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all`}
            >
              {isSubmitting ? "Processing..." : "Register Now"}
            </motion.button>
          </form>

        
          <div className="px-6 py-4 border-t border-gray-100 text-center bg-gray-50">
            <p className="text-xs text-gray-500">
              Already have an account?{" "}
              <a href="#" className="text-blue-600 hover:underline font-medium">
                Sign in  
              </a>   
            </p>
          </div>
        </motion.div>
      </div>
  );
};

export default RegistrationForm;
