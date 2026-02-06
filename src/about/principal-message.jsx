import schoolBgImage from '../assets/pres.png';
import { Helmet } from "react-helmet-async";
import Footer from '../components/Footer';
import schoolEvent from '../assets/saq.jpg';

const PrincipalMessage = () => {
  return (
   <>
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Principal's Message - Tulu Dimtu School</title>
        <meta name="description" content="Read the inspiring message from our Principal, Mrs. Anjali Sharma, about Tulu Dimtu School's vision and educational philosophy." />
      </Helmet>
      
      {/* Hero Section with Background Image */}
      <div className="text-center relative">
        <div className="bg-cover bg-center bg-fixed relative overflow-hidden w-full h-[90vh]"
           style={{ backgroundImage: `url(${schoolBgImage})` }}>
          {/* Overlay gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent z-10"></div>
          
          {/* Welcome Message Content */}
          <div className="relative z-20 flex flex-col items-center justify-center h-full px-4">
            <div className="max-w-3xl">
              <h1 className="text-white text-4xl md:text-6xl font-bold mb-6">
                Principal's Message
              </h1>
              <div className="w-32 h-1 bg-green-600 mx-auto mb-8"></div>
              <h2 className="text-green-300 text-2xl md:text-3xl font-semibold mb-4">
                From the Principal
              </h2>
              <p className="text-gray-200 text-lg md:text-xl">
                Tulu Dimtu School
              </p>
            </div>
          </div>

          {/* Waveform Bottom Border */}
    

          
          {/* Alternative Waveform Style (Uncomment to use) */}
     

        </div>
      </div>

      {/* Phone Principal Image - Full width on mobile */}
      <div className="block lg:hidden w-full p-8">
        <img 
          src={schoolEvent}
          className='w-full h-[50vh] rounded-xl'
        />
        <div className="mt-4 text-center p-4">
          <p className="text-xl font-semibold text-gray-800">
            Mrs. Saqata
          </p>
          <p className="text-gray-600">
            Principal, Tulu Dimtu School
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
                <h2 className='text-3xl font-bold'>Principal's Message - <span className='text-blue-800'>Tulu Dimtu School</span></h2>

                <p className="text-gray-700 text-lg">
                  It gives me immense pleasure to welcome you to another academic year at 
                  Tulu Dimtu School. As Principal, I am honored to lead an institution that 
                  has consistently set benchmarks in academic excellence and holistic development.
                </p>

                <p className="text-gray-700 text-lg">
                  Our school's philosophy is built on the foundation that every child is unique 
                  and possesses immense potential. Our role as educators is to identify, nurture, 
                  and guide this potential to help each student achieve their personal best.
                </p>

                <p className="text-gray-700 text-lg">
                  At Tulu Dimtu, we focus on creating a balanced educational experience. While 
                  academic rigor remains our priority, we equally emphasize character building, 
                  ethical values, and social responsibility. We believe that true education 
                  prepares students not just for examinations, but for life's challenges.
                </p>

                <p className="text-gray-700 text-lg">
                  Our dedicated team of educators is our greatest strength. Each teacher brings 
                  passion, expertise, and innovation to the classroom, creating dynamic learning 
                  environments that stimulate curiosity and critical thinking. We continuously 
                  invest in professional development to ensure our teaching methodologies remain 
                  contemporary and effective.
                </p>

                <p className="text-gray-700 text-lg">
                  The school's infrastructure is designed to support diverse learning needs. 
                  Our well-equipped laboratories, extensive library, sports facilities, and 
                  technology-enabled classrooms provide students with resources to explore 
                  their interests and develop multiple intelligences.
                </p>

                <p className="text-gray-700 text-lg">
                  We place great importance on extracurricular activities as they play a 
                  crucial role in personality development. Our various clubs, sports teams, 
                  cultural programs, and community service initiatives help students discover 
                  their passions beyond textbooks.
                </p>

                <p className="text-gray-700 text-lg">
                  Parental involvement is a key component of our educational approach. We 
                  encourage open communication and collaboration between parents and teachers 
                  to create a supportive network for our students. Regular parent-teacher 
                  meetings, workshops, and school events provide opportunities for meaningful 
                  engagement.
                </p>

                <p className="text-gray-700 text-lg">
                  In today's rapidly evolving world, we are committed to preparing students 
                  with 21st-century skills. Our curriculum integrates digital literacy, 
                  environmental awareness, and global perspectives to ensure our students are 
                  ready to thrive in an interconnected world.
                </p>

                <p className="text-gray-700 text-lg">
                  I am proud of our students' achievements, both academic and non-academic. 
                  Their success in various competitions, board examinations, and social 
                  initiatives reflects the comprehensive education they receive at Tulu Dimtu.
                </p>

                <p className="text-gray-700 text-lg">
                  As we move forward, we remain focused on continuous improvement. We welcome 
                  feedback and suggestions from all stakeholders as we work towards making 
                  Tulu Dimtu School an even better place for learning and growth.
                </p>

                <p className="text-gray-700 text-lg">
                  I look forward to working closely with students, parents, and staff to 
                  create memorable learning experiences and build a strong school community.
                </p>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-xl font-semibold text-gray-800">
                    With warm regards,
                  </p>
                  <p className="text-lg text-gray-700">
                    Mrs. Saqata<br />
                    Principal, Tulu Dimtu School
                  </p>
                </div>
              </div>
            </div>

            {/* Principal Image on Right - Only visible on desktop */}
            <div className="lg:w-1/3 hidden lg:block">
              <div className="sticky top-8 py-8">
                <img 
                  src={schoolEvent}
                  className="w-full h-[70vh] rounded-lg shadow-lg "
                />
                <div className="mt-4 text-center">
                  <p className="text-xl font-semibold text-gray-800">
                    Mrs. Saqata
                  </p>
                  <p className="text-gray-600">
                    Principal, Tulu Dimtu School
                  </p>
                  <div className="mt-4 space-y-2">
                   
                    <p className="text-gray-600 text-sm">
                      9+ Years in Education
                    </p>
                    <p className="text-gray-600 text-sm">
                      Email: principal@tuludimtu.edu
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-3xl p-8 md:p-14 text-white text-center relative overflow-hidden m-4 md:m-8">
        <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-white/5"></div>
        <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-yellow-400/10"></div>
        
        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 md:mb-8">
            Experience <span className="text-yellow-300">Tullu Dimtu</span>
          </h2>
          <p className="text-lg md:text-xl mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed">
            Join our community of learners and discover how we nurture academic excellence, character, and innovation.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
            <button className="px-8 md:px-12 py-4 md:py-5 bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold rounded-xl transition-all duration-300 shadow-lg flex items-center justify-center gap-2">
              <a href='/schedule-visit'>Schedule a Visit</a>
            </button>
            <button className="px-8 md:px-12 py-4 md:py-5 border-2 border-white text-white hover:bg-white/10 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2">
              <a href="/admission">Apply Now</a>
            </button>
          </div>
        </div>
      </div>
    </div>
   <Footer />
   
   </>
  );
};

export default PrincipalMessage;