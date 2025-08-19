import logo from "../assets/logo.png";
import schoolBuilding from "../assets/bulding.jpg";
import students from "../assets/Student.jpg";
import Footer from "../components/Footer";
import ScrollReveal from "../components/ScrollReveal";
import { FaGraduationCap, FaBook, FaChalkboardTeacher, FaAward } from "react-icons/fa";

function Secondary() {
  // School data
  const schoolData = {
    name: "Tullu Dimtu Secondary School",
    motto: "Empowering minds, shaping futures through excellence in education",
    established: 1995,
    features: [
      { icon: <FaGraduationCap className="text-4xl mb-4" />, title: "Academic Excellence", desc: "Consistent top performance in regional examinations" },
      { icon: <FaBook className="text-4xl mb-4" />, title: "Holistic Curriculum", desc: "Balanced education covering academics and Ethiopian values" },
      { icon: <FaChalkboardTeacher className="text-4xl mb-4" />, title: "Expert Faculty", desc: "Highly qualified local teaching staff" },
      { icon: <FaAward className="text-4xl mb-4" />, title: "Community Recognition", desc: "Alumni contributing to local development" }
    ],
    facilities: [
      "Modern science and computer labs",
      "Extensive library with local language resources",
      "Sports facilities for football and athletics",
      "Cultural programs celebrating Ethiopian heritage"
    ],
    testimonials: [
      { 
        quote: "The education I received at Tullu Dimtu prepared me for university and life. The teachers truly care.", 
        author: "Alemayehu Kebede",
        role: "Alumnus, Addis Ababa University" 
      },
      { 
        quote: "As a parent, I value how the school maintains our cultural values while providing modern education.", 
        author: "W/ro. Tigist Mekonnen",
        role: "Parent Council Member" 
      },
      { 
        quote: "Our school's commitment to serving the local community sets us apart.", 
        author: "Ato. Getachew Assefa",
        role: "School Board Chairman" 
      }
    ]
  };

  return (
    <div className="relative w-full font-sans antialiased bg-gray-50">
      {/* Hero Section */}
      <section className="relative w-full h-screen overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: `url(${schoolBuilding})` }}
        ></div>
        
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-green-900/80"></div>

        <div className="relative z-20 flex flex-col items-center justify-center h-full px-4 text-center">
          <ScrollReveal delay={0.2}>
            <img 
              src={logo} 
              alt="School Logo" 
              className="h-32 w-32 mb-8 object-contain"
            />
          </ScrollReveal>
          
          <ScrollReveal delay={0.4}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-100">
                {schoolData.name}
              </span>
            </h1>
          </ScrollReveal>
          
          <ScrollReveal delay={0.6}>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mb-10">
              {schoolData.motto}
            </p>
          </ScrollReveal>
          
          <ScrollReveal delay={0.8}>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                Our Academic Programs
              </button>
              <button className="px-8 py-3 border-2 border-white text-white hover:bg-white/20 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105">
                Visit Our Campus
              </button>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={1}>
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </ScrollReveal>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
                Why Choose <span className="text-yellow-500">Our School?</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Discover what makes Tullu Dimtu the preferred choice for quality education in our region
              </p>
              <div className="w-24 h-1 bg-yellow-500 mx-auto mt-4"></div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {schoolData.features.map((feature, index) => (
                <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 group border border-gray-100">
                  <div className="text-blue-700 group-hover:text-yellow-500 transition-colors duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <div className="relative rounded-xl overflow-hidden shadow-2xl border-4 border-white">
                <img 
                  src={students} 
                  alt="Students at Tullu Dimtu" 
                  className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute -bottom-4 -right-4 bg-yellow-500 text-blue-900 p-6 rounded-lg shadow-lg">
                  <span className="block text-3xl font-bold">{new Date().getFullYear() - schoolData.established}+</span>
                  <span className="block text-sm">Years of Service</span>
                </div>
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={0.2}>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">
                  Nurturing <span className="text-yellow-500">Ethiopian Excellence</span>
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Established in {schoolData.established}, Tullu Dimtu Secondary School has been a cornerstone of education in our community. We blend modern teaching methods with Ethiopian cultural values to develop well-rounded citizens.
                </p>
                <div className="space-y-4 mb-8">
                  {schoolData.facilities.map((item, index) => (
                    <div key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-yellow-500 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <p className="text-gray-700">{item}</p>
                    </div>
                  ))}
                </div>
                <button className="px-8 py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md flex items-center gap-2 mx-auto lg:mx-0">
                  <span>Learn About Our History</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-green-900 text-white">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Community <span className="text-yellow-300">Testimonials</span>
              </h2>
              <p className="text-white/80 max-w-2xl mx-auto">
                Hear from those who have experienced Tullu Dimtu firsthand
              </p>
              <div className="w-24 h-1 bg-yellow-300 mx-auto mt-4"></div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {schoolData.testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white/10 p-8 rounded-xl backdrop-blur-sm hover:backdrop-blur-md transition-all duration-300 border border-white/20">
                  <svg className="w-8 h-8 text-yellow-300 mb-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"></path>
                  </svg>
                  <p className="italic mb-6 text-white/90">"{testimonial.quote}"</p>
                  <div className="border-t border-white/20 pt-4">
                    <p className="font-bold">{testimonial.author}</p>
                    <p className="text-sm text-white/70">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <ScrollReveal>
          <div className="container mx-auto px-6">
            <div className="bg-gradient-to-r from-blue-600 to-green-700 rounded-2xl p-8 md:p-12 text-center shadow-xl relative overflow-hidden">
              {/* Replaced the non-existent pattern with a simple background */}
              <div className="absolute inset-0 opacity-10 bg-gray-300"></div>
              
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Ready to Join Tullu Dimtu?
                </h2>
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                  Enrollment for the {new Date().getFullYear() + 1} academic year is now open. Limited spaces available.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button className="px-8 py-3 bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2">
                    <span>Apply Now</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </button>
                  <button className="px-8 py-3 border-2 border-white text-white hover:bg-white/20 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                    <span>Contact Us</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <ScrollReveal>
       
      </ScrollReveal>
    </div>
  );
}

export default Secondary;