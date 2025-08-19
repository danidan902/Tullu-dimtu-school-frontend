import { FaBullseye, FaEye, FaLightbulb, FaHandsHelping, FaGraduationCap, FaUsers } from 'react-icons/fa';
import ScrollReveal from '../components/ScrollReveal';
import schoolBgImage from '../assets/logo.png'; // Your background image path
import Footer from '../components/Footer';

const VisionMission = () => {
  return (
    <>
    <div className="bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section with Fixed Height */}
      <div className="relative h-[87vh] w-full overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: `url(${schoolBgImage})` }}
        >
          <div className="absolute inset-0 bg-blue-900/60"></div>
        </div>
        
        {/* Content Centered Vertically */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="container mx-auto px-6 text-center">
            <ScrollReveal>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Our <span className="text-yellow-300">Vision & Mission</span>
              </h1>
              <div className="w-32 h-1 bg-yellow-400 mx-auto"></div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* Main Content Container with Proper Spacing */}
      <section className="py-16 -mt-16 relative z-20">
        <div className="container mx-auto px-6">
          {/* Vision & Mission Cards with Extra Margin */}
          <ScrollReveal delay={0.2}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 mt-24">
              {/* Vision Card */}
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <FaEye className="text-blue-700 text-2xl" />
                  </div>
                  <h2 className="text-3xl font-bold text-blue-900">Our Vision</h2>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">
                  To be a premier institution of academic excellence that nurtures 
                  innovative thinkers and ethical leaders who will transform society 
                  through knowledge, creativity, and service.
                </p>
              </div>

              {/* Mission Card */}
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="bg-yellow-100 p-3 rounded-full mr-4">
                    <FaBullseye className="text-yellow-600 text-2xl" />
                  </div>
                  <h2 className="text-3xl font-bold text-blue-900">Our Mission</h2>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">
                  To provide holistic education that combines rigorous academics with 
                  character development, empowering students to achieve their full 
                  potential and become responsible global citizens.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Core Values Section */}
          <ScrollReveal delay={0.4}>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">
                Our <span className="text-yellow-500">Core Values</span>
              </h2>
              <div className="w-24 h-1 bg-yellow-500 mx-auto mb-10"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { 
                    icon: <FaLightbulb className="text-3xl" />, 
                    title: "Excellence", 
                    desc: "Pursuing the highest standards in all we do" 
                  },
                  { 
                    icon: <FaHandsHelping className="text-3xl" />, 
                    title: "Integrity", 
                    desc: "Upholding honesty and ethical conduct" 
                  },
                  { 
                    icon: <FaGraduationCap className="text-3xl" />, 
                    title: "Innovation", 
                    desc: "Encouraging creative thinking and problem-solving" 
                  },
                  { 
                    icon: <FaUsers className="text-3xl" />, 
                    title: "Community", 
                    desc: "Fostering collaboration and social responsibility" 
                  }
                ].map((value, index) => (
                  <div 
                    key={index} 
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
                  >
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-700">
                      {value.icon}
                    </div>
                    <h3 className="text-xl font-bold text-blue-900 mb-3">{value.title}</h3>
                    <p className="text-gray-600">{value.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Philosophy Section */}
          <ScrollReveal delay={0.6}>
            <div className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-2xl p-10 text-white">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Educational Philosophy</h2>
                <p className="text-lg md:text-xl leading-relaxed mb-6">
                  At Tullu Dimtu Secondary School, we believe education should ignite curiosity, 
                  cultivate character, and inspire lifelong learning. Our student-centered approach 
                  balances intellectual growth with emotional and social development.
                </p>
                <div className="w-32 h-1 bg-yellow-400 mx-auto"></div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>

   <Footer/>
    
    </>
  );
};

export default VisionMission;