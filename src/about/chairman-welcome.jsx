import { FaQuoteLeft, FaLinkedin, FaEnvelope, FaGraduationCap, FaLightbulb, FaHandsHelping } from "react-icons/fa";
import { IoIosSchool } from "react-icons/io";
import ScrollReveal from "../components/ScrollReveal";
import chairman from '../assets/dir.jpg';
import Footer from "../components/Footer";
import schoolBgImage from '../assets/tul8.jpg';
import { Helmet } from "react-helmet-async";

const DirectorMessage = () => {
  return (
   <>
       <Helmet>
          <title>School ChairMan</title>
         </Helmet> 
   
    <div className="min-h-screen bg-white">
      {/* Hero Section with Welcome Message */}
      <div className="text-center">
          <div className="bg-cover bg-center bg-fixed relative overflow-hidden w-full h-[90vh]"
   style={{ backgroundImage: `url(${schoolBgImage})` }}>
              {/* Overlay gradients */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-transparent z-10"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent z-10"></div>
              
              {/* Welcome Message Content */}
              <div className="relative z-20 flex flex-col items-center justify-center h-full px-4">
                  <div className="max-w-3xl">
                      <h1 className="text-white text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
                          Welcome Message
                      </h1>
                      <div className="w-32 h-1 bg-blue-600 mx-auto mb-8"></div>
                      <h2 className="text-blue-300 text-2xl md:text-3xl font-semibold mb-4">
                          From the Director
                      </h2>
                      <p className="text-gray-200 text-lg md:text-xl">
                          Tulu Dimtu School
                      </p>
                      <div className="mt-8 flex justify-center">
                          <FaQuoteLeft className="text-white/50 text-3xl" />
                      </div>
                  </div>
              </div>
     <div className="absolute bottom-0 left-0 w-full h-[80px] sm:h-[120px] md:h-[150px] z-30">
  
  {/* solid background overlap */}
  <div className="absolute bottom-0 left-0 w-full h-[6px] bg-white"></div>

  {/* wave */}
  <svg
    className="absolute bottom-0 left-0 block w-full h-full scale-y-[-1]"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1200 120"
    preserveAspectRatio="none"
  >
    <path
      d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
      fill="white"
    />
  </svg>
</div>






          </div>
      </div>

      {/* Phone Director Image - Full width on mobile */}
      <div className="block lg:hidden p-4 mt-16">
        <img 
          src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
          alt="Director, Tulu Dimtu School"
          className="w-full h-auto"
        />
        <div className="mt-4 text-center p-4">
          <p className="text-xl font-semibold text-gray-800">
            Dr. Rajesh Desai
          </p>
          <p className="text-gray-600">
            Director, Tulu Dimtu School
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Message on Left */}
            <div className="lg:w-2/3">
              <div className="space-y-6">
                <p className="text-blue-700 text-xg">
                  Dear Students, Parents, and Well-wishers,
                </p>

                <p className="text-gray-700 text-lg">
                  It is with great pleasure that I address you as the Director of Tulu Dimtu School. 
                  Our institution has always been committed to providing quality education that 
                  nurtures both the mind and character of our students.
                </p>

                <p className="text-gray-700 text-lg">
                  At Tulu Dimtu, we believe in creating an environment where every student can 
                  discover their unique potential. Our dedicated faculty works tirelessly to 
                  ensure that each child receives the attention and guidance they need to excel 
                  academically and personally.
                </p>

                <p className="text-gray-700 text-lg">
                  Education today is not just about acquiring knowledge; it is about developing 
                  critical thinking, creativity, and the ability to adapt to a rapidly changing 
                  world. We have designed our curriculum to meet these challenges while 
                  maintaining strong ethical values.
                </p>

                <p className="text-gray-700 text-lg">
                  Our approach combines traditional teaching methods with modern educational 
                  techniques. We emphasize hands-on learning, collaborative projects, and 
                  real-world applications of classroom concepts. This holistic approach ensures 
                  our students are well-prepared for higher education and future careers.
                </p>

                <p className="text-gray-700 text-lg">
                  Beyond academics, we place great importance on extracurricular activities. 
                  Sports, arts, music, and community service are integral parts of our 
                  educational program. These activities help develop leadership skills, 
                  teamwork, and social responsibility.
                </p>

                <p className="text-gray-700 text-lg">
                  The partnership between school and parents is crucial for a child's success. 
                  I encourage parents to actively participate in their child's educational 
                  journey and work closely with our teachers to provide the best support 
                  system for our students.
                </p>

                <p className="text-gray-700 text-lg">
                  As we look to the future, we remain committed to continuous improvement. 
                  We are constantly upgrading our facilities, enhancing our teaching 
                  methodologies, and expanding our programs to provide the best possible 
                  education for our students.
                </p>

                <p className="text-gray-700 text-lg">
                  I am proud of the achievements of our students and alumni, who have 
                  excelled in various fields and made significant contributions to society. 
                  Their success is a testament to the strong foundation they received at 
                  Tulu Dimtu School.
                </p>

                <p className="text-gray-700 text-lg">
                  I extend my heartfelt gratitude to our teachers for their dedication, 
                  to our parents for their trust, and to our students for their hard work 
                  and enthusiasm. Together, we can continue to build an institution that 
                  truly makes a difference in the lives of young people.
                </p>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-xl font-semibold text-gray-800">
                    Warm regards,
                  </p>
                  <p className="text-lg text-gray-700">
                    The Director<br />
                    Tulu Dimtu School
                  </p>
                </div>
              </div>
            </div>

            {/* Director Image on Right - Only visible on desktop */}
            <div className="lg:w-1/3 hidden lg:block">
              <div className="sticky top-8">
                <img 
                  src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Director, Tulu Dimtu School"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
                <div className="mt-4 text-center">
                  <p className="text-xl font-semibold text-gray-800">
                    Dr. Rajesh Desai
                  </p>
                  <p className="text-gray-600">
                    Director, Tulu Dimtu School
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

<Footer/>
   </>
  );
};

export default DirectorMessage;