import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import bg from '../assets/tullulogo.png';
// API URL
const API_URL =
  process.env.REACT_APP_API_URL || "https://tullu-dimtu-school-backend-1.onrender.com/api/auth";

function EmailVerification() {
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* =========================
     SUBMIT FORM
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      let res;

      // SIGN UP
      if (isSignup) {
        res = await axios.post(`${API_URL}/signup`, {
          name,
          email,
          password,
        });
      }

      // SIGN IN
      else {
        res = await axios.post(`${API_URL}/signin`, {
          email,
          password,
        });
      }

      const data = res.data;

      if (!data.success) {
        setError(data.message);
        setLoading(false);
        return;
      }

      // Save login
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect
      navigate("/studentstudy-dashboard");

    } catch (err) {
      console.log(err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Server error. Try again.");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className=" p-8  w-full max-w-md bg-transparent">

          <div className="mb-6">
    <img 
      src={bg}
      alt="School Logo"
      className="w-52 h-52 rounded-full p-4 md:ml-24 ml-16 "
    />
  </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name (Signup Only) */}
          {isSignup && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-3 rounded bg-transparent"
            />
          )}

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-3 rounded bg-transparent"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            minLength={6}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-3 rounded bg-transparent"
          />

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 text-white p-3 rounded hover:bg-teal-700"
          >
            {loading
              ? "Please wait..."
              : isSignup
              ? "Sign Up"
              : "Login"}
          </button>
        </form>

        {/* Switch */}
        <p className="text-center mt-4 text-gray-600">
          {isSignup ? "Already have an account?" : "No account?"}

          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-teal-600 ml-2 font-semibold"
          >
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>

      </div>
    </div>
  );
}

export default EmailVerification;
