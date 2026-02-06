import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import bg from "../assets/tullulogo.png";
import axios from "axios";


const api = axios.create({
  baseURL: "https://tullu-dimtu-school-backend-1.onrender.com/api/techs", // your backend route
  headers: { "Content-Type": "application/json" },
});


function EmailVerification() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true); // toggle login/signu



  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/signin", { email }); // email only
      const data = res.data;

      if (!data.success) {
        setError(data.message);
        return;
      }

      // Redirect to profile/dashboard
      navigate("/other/teacher-attendance");
    } catch (err) {
      if (err.response?.data?.message) setError(err.response.data.message);
      else setError("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };


  
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/signup", { email, password }); // email + password
      const data = res.data;

      if (!data.success) {
        setError(data.message);
        return;
      }

      // Redirect to profile/dashboard
      navigate("/other/teacher-attendance");
    } catch (err) {
      if (err.response?.data?.message) setError(err.response.data.message);
      else setError("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{isLogin ? "Login" : "Signup"} - Tullu Dimtu School System</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className=" p-8 w-full max-w-md text-center"
        >
          {/* Logo */}
          <div className="mb-6">
            <img
              src={bg}
              alt="School Logo"
              className="w-40 h-40 rounded-full mx-auto"
            />
          </div>

         

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
          )}

          {/* Form */}
          <form
            onSubmit={isLogin ? handleLogin : handleSignup}
            className="space-y-5"
          >
            {/* Email */}
            <div>
              <label className="block text-left mb-1 text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 bg-transparent"
              />
            </div>

            {/* Password (only for signup) */}
            {!isLogin && (
              <div>
                <label className="block text-left mb-1 text-sm font-medium">
                  Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 bg-transparent"
                />
              </div>
            )}

            {/* Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
            >
              {loading
                ? isLogin
                  ? "Logging in..."
                  : "Signing up..."
                : isLogin
                ? "Login"
                : "Signup"}
            </motion.button>
          </form>

          {/* Toggle */}
          <p className="mt-4 text-sm text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-teal-600 font-medium underline"
            >
              {isLogin ? "Signup" : "Login"}
            </button>
          </p>
        </motion.div>
      </div>
    </>
  );
}

export default EmailVerification;
