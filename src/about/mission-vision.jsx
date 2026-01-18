import { useState } from "react";
import { FaBullseye, FaEye, FaLightbulb, FaHandsHelping, FaGraduationCap, FaUsers } from 'react-icons/fa';
import ScrollReveal from '../components/ScrollReveal';
import schoolBgImage from '../assets/mis1.jpg';
import Footer from '../components/Footer';
import { Helmet } from "react-helmet-async";

const VisionMission = () => {
  const [expandedVision, setExpandedVision] = useState(false);
  const [expandedMission, setExpandedMission] = useState(false);
  const [expandedValues, setExpandedValues] = useState(Array(4).fill(false));
  const [expandedPhilosophy, setExpandedPhilosophy] = useState(false);

  const toggleValue = (index) => {
    const newExpandedValues = [...expandedValues];
    newExpandedValues[index] = !newExpandedValues[index];
    setExpandedValues(newExpandedValues);
  };

  const coreValues = [
    { 
      icon: <FaLightbulb className="text-3xl" />, 
      title: "Excellence", 
      shortDesc: "Pursuing the highest standards in all we do...",
      fullDesc: "Excellence is at the core of everything we do at Tullu Dimtu. We are committed to maintaining the highest standards in academic instruction, student support, and institutional operations. Our faculty undergoes regular professional development to stay current with educational best practices, while our curriculum is continuously reviewed and enhanced. We measure excellence not just by academic results, but by the holistic development of each student—their critical thinking skills, creativity, character growth, and readiness for future challenges. This commitment to excellence extends beyond the classroom to our sports programs, arts initiatives, and community engagement activities."
    },
    { 
      icon: <FaHandsHelping className="text-3xl" />, 
      title: "Integrity", 
      shortDesc: "Upholding honesty and ethical conduct...",
      fullDesc: "Integrity forms the moral foundation of our educational community. We cultivate an environment where honesty, transparency, and ethical behavior are expected and celebrated. Students learn that true success comes not from shortcuts or compromises, but from hard work, honesty, and respect for others. Our honor code, implemented across all grade levels, teaches students to take responsibility for their actions and decisions. We model integrity through fair assessment practices, transparent communication with parents, and equitable treatment of all community members. This value extends to academic work, interpersonal relationships, and participation in school activities, preparing students to be trustworthy leaders in society."
    },
    { 
      icon: <FaGraduationCap className="text-3xl" />, 
      title: "Innovation", 
      shortDesc: "Encouraging creative thinking and problem-solving...",
      fullDesc: "Innovation drives our approach to education in an ever-changing world. We foster a culture of curiosity, creativity, and forward-thinking that prepares students for the challenges of the 21st century. Our classrooms incorporate project-based learning, technology integration, and real-world problem-solving activities. We have established innovation labs where students can experiment with robotics, coding, and scientific inquiry. Teachers are encouraged to implement creative teaching methodologies that engage different learning styles. Annual science fairs, innovation challenges, and entrepreneurship programs provide platforms for students to showcase their inventive ideas. We believe that nurturing innovation today creates the problem-solvers and change-makers of tomorrow."
    },
    { 
      icon: <FaUsers className="text-3xl" />, 
      title: "Community", 
      shortDesc: "Fostering collaboration and social responsibility...",
      fullDesc: "Community is the heartbeat of Tullu Dimtu Secondary School. We believe that education thrives in a supportive, collaborative environment where every member feels valued and connected. Our school functions as an extended family where students, teachers, parents, and staff work together towards common goals. We foster this through regular community service projects, collaborative learning activities, and school-wide events that build relationships. Our mentorship programs pair older students with younger ones, creating bonds across grade levels. Parent involvement is actively encouraged through workshops, volunteer opportunities, and advisory committees. Beyond our school walls, we engage with the local community through outreach programs, environmental initiatives, and cultural exchanges, teaching students the importance of social responsibility and global citizenship."
    }
  ];

  return (
    <>
 
   <Helmet>
      <title>School Mission | Tullu Dimtu School</title>
    </Helmet>

      <div className="bg-gradient-to-b from-white to-blue-50">
        {/* Hero Section with Fixed Height */}
   <div className="relative h-[87vh] w-full overflow-hidden">
  
  {/* Background Image */}
  <div
    className="absolute inset-0 bg-cover bg-center bg-fixed"
    style={{ backgroundImage: `url(${schoolBgImage})` }}
  >
    {/* Enhanced Overlay with Strong Bottom Gradient */}
     <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/55 to-black/85"></div>
  </div>

  {/* Content */}
  <div className="relative z-10 h-full flex items-center justify-center">
    <div className="container mx-auto px-6 text-center">
      <ScrollReveal>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Our <span className="text-yellow-300">Vision & Mission</span>
        </h1>

        <div className="w-32 h-1 bg-yellow-400 mx-auto mb-6 rounded-full"></div>

        <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-200 leading-relaxed">
          At <span className="font-semibold text-yellow-200">Tullu Dimtu Secondary School</span>,
          we are committed to nurturing responsible, confident, and academically excellent students.
        </p>

        <p className="mt-4 max-w-2xl mx-auto text-base md:text-lg text-gray-300">
          We believe education builds character, creativity, and prepares students
          to positively impact their community and nation.
        </p>
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
                  <p className="text-gray-700 text-lg leading-relaxed mb-4">
                    To be a premier institution of academic excellence that nurtures 
                    innovative thinkers and ethical leaders who will transform society 
                    through knowledge, creativity, and service.
                  </p>
                  {expandedVision && (
                    <div className="space-y-3 mb-4">
                      <p className="text-gray-700 text-lg leading-relaxed">
                        We envision Tullu Dimtu as a beacon of educational excellence that transcends traditional learning boundaries. Our vision extends beyond academic success to encompass the development of well-rounded individuals who are prepared to address complex global challenges with wisdom, compassion, and innovation.
                      </p>
                      <p className="text-gray-700 text-lg leading-relaxed">
                        In the coming decade, we aim to establish partnerships with international educational institutions, create cutting-edge research facilities for students, and become a model for sustainable school operations in our region. Our vision includes expanding our campus to include innovation centers, performing arts theaters, and sports academies that will serve both our students and the wider community.
                      </p>
                    </div>
                  )}
                  <button 
                    onClick={() => setExpandedVision(!expandedVision)}
                    className="text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors duration-200"
                  >
                    {expandedVision ? "Read Less" : "Read More"}
                  </button>
                </div>

                {/* Mission Card */}
                <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <div className="bg-yellow-100 p-3 rounded-full mr-4">
                      <FaBullseye className="text-yellow-600 text-2xl" />
                    </div>
                    <h2 className="text-3xl font-bold text-blue-900">Our Mission</h2>
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed mb-4">
                    To provide holistic education that combines rigorous academics with 
                    character development, empowering students to achieve their full 
                    potential and become responsible global citizens.
                  </p>
                  {expandedMission && (
                    <div className="space-y-3 mb-4">
                      <p className="text-gray-700 text-lg leading-relaxed">
                        Our mission is achieved through a comprehensive educational approach that addresses intellectual, emotional, social, and physical development. We implement this through our "Four Pillars of Education": Academic Excellence, Character Building, Leadership Development, and Community Engagement. Each pillar is supported by specific programs, activities, and assessment methods that ensure balanced growth.
                      </p>
                      <p className="text-gray-700 text-lg leading-relaxed">
                        We are committed to creating inclusive learning environments that recognize and nurture diverse talents and learning styles. Our mission includes providing scholarships for underprivileged students, implementing assistive technologies for students with special needs, and creating mentorship programs that connect students with successful alumni and community leaders.
                      </p>
                      <p className="text-gray-700 text-lg leading-relaxed">
                        Through partnerships with universities, businesses, and non-profit organizations, we ensure that our curriculum remains relevant and that our students have access to real-world learning opportunities, internships, and career guidance that prepare them for success beyond secondary education.
                      </p>
                    </div>
                  )}
                  <button 
                    onClick={() => setExpandedMission(!expandedMission)}
                    className="text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors duration-200"
                  >
                    {expandedMission ? "Read Less" : "Read More"}
                  </button>
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
                  {coreValues.map((value, index) => (
                    <div 
                      key={index} 
                      className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
                    >
                      <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-700">
                        {value.icon}
                      </div>
                      <h3 className="text-xl font-bold text-blue-900 mb-3">{value.title}</h3>
                      <p className="text-gray-600 mb-3">
                        {expandedValues[index] ? value.fullDesc : value.shortDesc}
                      </p>
                      <button 
                        onClick={() => toggleValue(index)}
                        className="text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors duration-200"
                      >
                        {expandedValues[index] ? "Read Less" : "Read More"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Philosophy Section */}
            <ScrollReveal delay={0.6}>
              <div className="bg-[#04395E] via-[#04395E]/90 to-transparent md:bg-gradient-to-r from-[#04395E] via-[#04395E]/90 to-transparent rounded-2xl p-10 text-white">
                <div className="max-w-4xl mx-auto text-center">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Educational Philosophy</h2>
                  <p className="text-lg md:text-xl leading-relaxed mb-6">
                    At Tullu Dimtu Secondary School, we believe education should ignite curiosity, 
                    cultivate character, and inspire lifelong learning. Our student-centered approach 
                    balances intellectual growth with emotional and social development.
                  </p>
                  
                  {expandedPhilosophy && (
                    <div className="space-y-4 mb-6">
                      <p className="text-lg md:text-xl leading-relaxed">
                        We embrace the philosophy that every student is unique and possesses distinct talents, learning styles, and potential. Our educational approach is built on the understanding that effective teaching must be differentiated to meet individual needs while maintaining high expectations for all. We integrate multiple intelligences theory into our curriculum design, ensuring that students can learn through various modalities—visual, auditory, kinesthetic, and social.
                      </p>
                      <p className="text-lg md:text-xl leading-relaxed">
                        Our philosophical foundation rests on constructivist principles where students actively build knowledge through exploration, experimentation, and collaboration. Rather than passive recipients of information, students are engaged as co-creators of their learning journey. Teachers serve as facilitators and mentors, guiding students to ask meaningful questions, conduct research, and apply knowledge to real-world contexts.
                      </p>
                      <p className="text-lg md:text-xl leading-relaxed">
                        We believe that education should prepare students not just for exams, but for life. Our philosophy emphasizes the development of transferable skills such as critical thinking, communication, collaboration, and creativity—often called the "4Cs" of 21st-century education. We also prioritize socio-emotional learning, helping students develop self-awareness, empathy, resilience, and responsible decision-making abilities.
                      </p>
                    </div>
                  )}
                  
                  <div className="w-32 h-1 bg-yellow-400 mx-auto mb-6"></div>
                  <button 
                    onClick={() => setExpandedPhilosophy(!expandedPhilosophy)}
                    className="text-yellow-300 hover:text-yellow-200 font-semibold text-sm transition-colors duration-200"
                  >
                    {expandedPhilosophy ? "Read Less About Our Philosophy" : "Read More About Our Philosophy"}
                  </button>
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