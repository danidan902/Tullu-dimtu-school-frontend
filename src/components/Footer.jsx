// Footer.jsx (create this as a new component)
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaTruckLoading,
} from "react-icons/fa";
import React, {useState} from 'react'
import { toast } from "react-toastify";

 function Footer () {
   const [loading, setLoading] = useState(false);
   const [result, setResult] = React.useState("");

  const onSubmit = async (event) => {
    setLoading(true)
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);

    formData.append("access_key", "1a714604-528e-4a2d-8a7c-fd07f475de73");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      toast.success("Thank you for Subscribe!", {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
});

      event.target.reset();
    } else {
      toast.error("Something went wrong. Please try again.", {
      position: "top-right",
      autoClose: 3000,
});

      setResult(data.message);
    }
    setLoading(false)

  };
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* School Info */}
          <div className="space-y-5">
            <h3 className="text-2xl font-bold text-yellow-400 mb-4">
              Tullu Dimtu Secondary School
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Empowering minds and shaping futures through excellence in
              education since 1995.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-yellow-400 transition-colors duration-300"
              >
                <FaFacebook className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-yellow-400 transition-colors duration-300"
              >
                <FaTwitter className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-yellow-400 transition-colors duration-300"
              >
                <FaInstagram className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-yellow-400 transition-colors duration-300"
              >
                <FaLinkedin className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold mb-6 text-white border-b border-yellow-400 pb-2 inline-block">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="/"
                  className="text-gray-300 hover:text-yellow-400 transition-colors duration-300"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/about/chairman-welcome"
                  className="text-gray-300 hover:text-yellow-400 transition-colors duration-300"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/ourschool/overview"
                  className="text-gray-300 hover:text-yellow-400 transition-colors duration-300"
                >
                  Academics
                </a>
              </li>
              <li>
                <a
                  href="/admission"
                  className="text-gray-300 hover:text-yellow-400 transition-colors duration-300"
                >
                  Admissions
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-yellow-400 transition-colors duration-300"
                >
                  News & Events
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-gray-300 hover:text-yellow-400 transition-colors duration-300"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-semibold mb-6 text-white border-b border-yellow-400 pb-2 inline-block">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-yellow-400 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-300">
                  123 Education Street, Addis Ababa, Ethiopia
                </span>
              </li>
              <li className="flex items-center">
                <FaPhone className="text-yellow-400 mr-3" />
                <span className="text-gray-300">+251 123 456 789</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="text-yellow-400 mr-3" />
                <span className="text-gray-300">info@tulludimtu.edu.et</span>
              </li>
              <li className="flex items-center">
                <FaClock className="text-yellow-400 mr-3" />
                <span className="text-gray-300">
                  Mon-Fri: 8:00 AM - 5:00 PM
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xl font-semibold mb-6 text-white border-b border-yellow-400 pb-2 inline-block">
              Newsletter
            </h4>
            <p className="text-gray-300 mb-4">
              Subscribe to our newsletter to receive updates on school news and
              events.
            </p>
            <form onSubmit={onSubmit} className="space-y-3">
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Enter Your Name..."
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                required
              />
              <input
                type="phone"
                name="phone"
                id="phone"
                placeholder="Enter Your Phone..."
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                required
              />
              <input
                type="email"
                placeholder="Your email address..."
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                required
                name="email"
                id="email"
              />
              
              <button
                disabled={loading}
                type="submit"
                className="px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold rounded-lg transition-colors duration-300 w-full"
              >
                {loading ? 'Loading...' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Tullu Dimtu Secondary School. All
            rights reserved.Developed by Daniel Sheleme.
          </p>
          <div className="flex space-x-6">
            <a
              href="#"
              className="text-gray-400 hover:text-yellow-400 text-sm transition-colors duration-300"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-yellow-400 text-sm transition-colors duration-300"
            >
              Terms of Service
            </a>
            <a 
            href="#"
              className="text-gray-400 hover:text-yellow-400 text-sm transition-colors duration-300"
            >
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
 

export default Footer
