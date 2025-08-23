 import logo from "../assets/tullulogo.png";
import schoolBuilding from "../assets/logo.png"; 
import students from "../assets/life2.jpg"; 
import Footer from "../components/Footer";
import ScrollReveal from "../components/ScrollReveal";
import { FaGraduationCap, FaBook, FaChalkboardTeacher, FaAward } from "react-icons/fa";

function Home() {
    return (
        <div className="relative h-[87vh] w-full font-sans antialiased">

            <section className="relative  w-full h-screen overflow-hidden">

                <div
                    className="absolute inset-0 bg-cover bg-center bg-fixed"
                    style={{ backgroundImage: `url(${schoolBuilding})` }}
                ></div>


                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/80"></div>


                <div className="relative z-20 flex flex-col items-center justify-center h-full px-4 text-center">
                    <ScrollReveal delay={0.2}>
                        <img
                            src={logo}
                            alt="School Logo"
                            className="h-32 w-32 mb-8 object-contain animate-pulse"
                        />
                    </ScrollReveal>

                    <ScrollReveal delay={0.4}>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-100">
                Tullu Dimtu Secondary School
              </span>
                        </h1>
                    </ScrollReveal>

                    <ScrollReveal delay={0.6}>
                        <p className="text-xl md:text-2xl text-white/90 max-w-3xl mb-10">
                            Empowering minds, shaping futures through excellence in education
                        </p>
                    </ScrollReveal>
                    <ScrollReveal delay={0.8}>
                        <div className="flex flex-col sm:flex-row gap-4">

                                       <a 
  href="/admission" 
  rel="noopener noreferrer"
>
<button className="px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
    Apply Now
    </button>                 
</a>
             <a 
              href='/'
              rel='noopener noreferrer'
              >
             <button className="px-8 py-3 border-2 border-white text-white hover:bg-white/20 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105">
                               Take a Virtual Tour
                            </button>
             </a>               
            </div>
               </ScrollReveal>


                    <ScrollReveal delay={1}>
                        <div className="absolute bottom-12 animate-bounce">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                            </svg>
                        </div>
                    </ScrollReveal>
                </div>
            </section>


            <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
                <div className="container mx-auto px-6">
                    <ScrollReveal>
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
                                Why Choose <span className="text-yellow-500">Tullu Dimtu?</span>
                            </h2>
                            <div className="w-24 h-1 bg-yellow-500 mx-auto"></div>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal delay={0.2}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { icon: <FaGraduationCap className="text-4xl mb-4" />, title: "Academic Excellence", desc: "Consistent top performance in national examinations" },
                                { icon: <FaBook className="text-4xl mb-4" />, title: "Holistic Curriculum", desc: "Balanced education covering academics, sports, and arts" },
                                { icon: <FaChalkboardTeacher className="text-4xl mb-4" />, title: "Expert Faculty", desc: "Highly qualified and dedicated teaching staff" },
                                { icon: <FaAward className="text-4xl mb-4" />, title: "National Recognition", desc: "Alumni excelling in top universities worldwide" }
                            ].map((feature, index) => (
                                <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 group">
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


            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <ScrollReveal>
                            <div className="relative rounded-xl overflow-hidden shadow-2xl">
                                <img
                                    src={students}
                                    alt="Students at Tullu Dimtu"
                                    className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
                                />
                                <div className="absolute -bottom-4 -right-4 bg-yellow-500 text-blue-900 p-6 rounded-lg shadow-lg">
                                    <span className="block text-3xl font-bold">25+</span>
                                    <span className="block text-sm">Years of Excellence</span>
                                </div>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal delay={0.2}>
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">
                                    Nurturing <span className="text-yellow-500">Future Leaders</span>
                                </h2>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    Established in 1995, Tullu Dimtu Secondary School has consistently ranked among the top educational institutions in the region. Our commitment to academic rigor, character development, and innovative teaching methodologies sets us apart.
                                </p>
                                <div className="space-y-4 mb-8">
                                    {[
                                        "State-of-the-art science and computer labs",
                                        "Comprehensive extracurricular programs",
                                        "University placement counseling",
                                        "International exchange programs"
                                    ].map((item, index) => (
                                        <div key={index} className="flex items-start">
                                            <svg className="h-5 w-5 text-yellow-500 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                            <p className="text-gray-700">{item}</p>
                                        </div>
                                    ))}
                                </div>
                                <button className="px-8 py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md">
                                     <a href='/about/our-history'>Our History & Achievements</a>
                                </button>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>


            <section className="py-20 bg-gradient-to-r from-blue-900 to-purple-900 text-white">
                <div className="container mx-auto px-6">
                    <ScrollReveal>
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                What Our <span className="text-yellow-300">Community Says</span>
                            </h2>
                            <div className="w-24 h-1 bg-yellow-300 mx-auto"></div>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal delay={0.2}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    quote: "Tullu Dimtu provided the perfect environment for my academic and personal growth. The teachers go above and beyond.",
                                    author: "Sarah Johnson",
                                    role: "Alumna, Harvard University"
                                },
                                {
                                    quote: "As a parent, I appreciate the school's commitment to both academic excellence and character building.",
                                    author: "Michael Kebede",
                                    role: "Parent"
                                },
                                {
                                    quote: "The innovative teaching methods and facilities here prepare students for real-world challenges.",
                                    author: "Dr. Alem Teklu",
                                    role: "Board Member"
                                }
                            ].map((testimonial, index) => (
                                <div key={index} className="bg-white/10 p-8 rounded-xl backdrop-blur-sm hover:backdrop-blur-md transition-all duration-300">
                                    <svg className="w-8 h-8 text-yellow-300 mb-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"></path>
                                    </svg>
                                    <p className="italic mb-6 text-white/90">"{testimonial.quote}"</p>
                                    <div>
                                        <p className="font-bold">{testimonial.author}</p>
                                        <p className="text-sm text-white/70">{testimonial.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollReveal>
                </div>
            </section>


            <section className="py-20 bg-white">
                <ScrollReveal>
                    <div className="container mx-auto px-6">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-12 text-center shadow-xl">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                Ready to Join Our Community?
                            </h2>
                            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                                Applications for the 2025 academic year are now open. Limited spaces available.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <button className="px-8 py-3 bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                                     <a href='/admission'>Apply Now</a>
                                </button>
                                <button className="px-8 py-3 border-2 border-white text-white hover:bg-white/20 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105">
                                     <a href='/contact'>Contact Admissions</a>
                                </button>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>
            </section>

            <ScrollReveal>
                <Footer/>
            </ScrollReveal>
        </div>
    );
}

export default Home;
