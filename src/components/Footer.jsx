import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaYoutube,
  FaGraduationCap,
} from "react-icons/fa";
import React, { useState } from 'react';
import { toast } from "react-toastify";

function Footer() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    formData.append("access_key", "1a714604-528e-4a2d-8a7c-fd07f475de73");
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("subject", "Newsletter Subscription");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Thank you for subscribing to our newsletter!", {
          position: "top-right",
          autoClose: 3000,
        });
        setName(""); setEmail(""); setPhone("");
      } else {
        toast.error("Something went wrong. Please try again.", { position: "top-right" });
      }
    } catch (error) {
      toast.error("Network error. Please check your connection.", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#04395E] via-[#04395E]/120 to-transparent text-white pt-14 pb-10 w-full">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">

          {/* School Identity Section */}
          <div className="space-y-5">
            <div className="flex items-center space-x-3">
              <FaGraduationCap className="w-9 h-9 text-yellow-400" />
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight leading-tight">
                  Tullu Dimtu 
                </h3>
                <h4 className="text-lg font-semibold text-yellow-400 leading-tight">
                  Secondary School
                </h4>
              </div>
            </div>
            <p className="text-gray-200 leading-relaxed text-sm font-light">
              Excellence in Education Since 1995. Shaping future leaders through innovative teaching and holistic development.
            </p>
            <div className="flex space-x-2 pt-1">
              {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <Icon className="w-4 h-4 text-white hover:text-yellow-400" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-semibold mb-5 text-white relative pb-2 after:absolute after:left-0 after:bottom-0 after:w-10 after:h-0.5 after:bg-yellow-400">
              Quick Links
            </h4>
            <ul className="flex flex-wrap gap-x-3 gap-y-1.5 text-sm md:flex-col md:gap-y-2.5">
              {[
                { name: "Home", path: "/" },
                { name: "About Us", path: "/about/chairman-welcome" },
                { name: "Academics", path: "/ourschool/overview" },
                { name: "Admissions", path: "/admission" },
                { name: "Faculty", path: "/faculty" },
                { name: "News & Events", path: "/news" },
                { name: "Contact", path: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.path}
                    className="text-gray-200 hover:text-yellow-400 transition-colors duration-300 text-sm hover:underline underline-offset-2"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-base font-semibold mb-5 text-white relative pb-2 after:absolute after:left-0 after:bottom-0 after:w-10 after:h-0.5 after:bg-yellow-400">
              Contact Info
            </h4>
            <ul className="space-y-3.5">
              {[
                { icon: FaMapMarkerAlt, text: "123 Education Street\nAddis Ababa, Ethiopia\nP.O. Box 1234" },
                { icon: FaPhone, text: "+251 123 456 789" },
                { icon: FaEnvelope, text: "info@tulludimtu.edu.et" },
                { icon: FaClock, text: "Mon-Fri: 8:00 AM - 5:00 PM\nSat: 9:00 AM - 1:00 PM" },
              ].map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <div className="p-1.5 bg-white/10 rounded-lg mr-3 mt-0.5">
                    <item.icon className="text-yellow-400 w-3.5 h-3.5" />
                  </div>
                  <span className="text-gray-200 text-xs leading-snug whitespace-pre-line">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div>
            <h4 className="text-base font-semibold mb-5 text-white relative pb-2 after:absolute after:left-0 after:bottom-0 after:w-10 after:h-0.5 after:bg-yellow-400">
              Stay Updated
            </h4>
            <p className="text-gray-200 mb-5 text-xs leading-relaxed">
              Subscribe to our newsletter for the latest school updates, events, and academic announcements.
            </p>
            <form onSubmit={onSubmit} className="space-y-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm backdrop-blur-sm"
                required
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm backdrop-blur-sm"
                required
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number (Optional)"
                className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm backdrop-blur-sm"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-blue-900 font-medium rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm"
              >
                {loading ? "Processing..." : "Subscribe Now"}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-7">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-5 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-300 text-xs">
                &copy; {new Date().getFullYear()} Tullu Dimtu Secondary School. All rights reserved.
              </p>
              <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                Developed with ❤️ by Daniel Sheleme • Accredited by Ethiopian Ministry of Education
              </p>
            </div>
        
            <div className="flex flex-wrap justify-center md:justify-end gap-3 md:gap-5">
              {["Privacy Policy", "Terms of Service", "Sitemap", "Contact"].map((link, idx) => (
                <a
                  key={idx}
                  href={idx === 0 ? "/tuludimtuschool-policy" : 
                        idx === 1 ? "/school-terms" : 
                        `/${link.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-gray-200 hover:text-yellow-400 text-xs transition-colors duration-300 hover:underline underline-offset-2"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-white/20 text-center">
            <div className="inline-flex items-center space-x-2 text-gray-400 text-xs">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span className="text-xs">Fully Accredited • ISO 9001:2015 Certified • Member of Ethiopian Schools Association</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;