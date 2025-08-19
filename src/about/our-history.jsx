import { FaCalendarAlt, FaSchool, FaUsers, FaAward } from 'react-icons/fa';
import ScrollReveal from '../components/ScrollReveal';
import historyImage from '../assets/ImageChild.jpg';
import schoolHeroImage from '../assets/Children.jpg'; // Add your hero image
import Footer from '../components/Footer';

const OurHistory = () => {
  const timeline = [
    {
      year: "1995",
      title: "Foundation",
      description: "Tullu Dimtu Secondary School was established with a vision to provide quality education in the region.",
      icon: <FaSchool className="text-2xl" />
    },
    {
      year: "2002",
      title: "First Graduating Class",
      description: "Our first batch of students graduated with outstanding academic results, setting a high standard.",
      icon: <FaUsers className="text-2xl" />
    },
    {
      year: "2010",
      title: "National Recognition",
      description: "Recognized as one of the top performing schools in the national examinations.",
      icon: <FaAward className="text-2xl" />
    },
    {
      year: "2020",
      title: "Modern Facilities",
      description: "Completed construction of new science labs and computer centers to enhance STEM education.",
      icon: <FaSchool className="text-2xl" />
    },
    {
      year: "Present",
      title: "Continuing Excellence",
      description: "Maintaining our tradition of academic excellence while innovating for the future of education.",
      icon: <FaCalendarAlt className="text-2xl" />
    }
  ];

  return (
    <>
      {/* Hero Section with Full-width Background Image */}
      <div className="relative h-[90vh] w-full overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: `url(${schoolHeroImage})` }}
        >
          <div className="absolute inset-0 bg-blue-900/60"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col justify-center text-center px-6">
          <ScrollReveal>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Our <span className="text-yellow-300">History</span>
            </h1>
            <div className="w-40 h-1 bg-yellow-400 mx-auto mb-8"></div>
            <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto">
              Celebrating decades of academic excellence and student success
            </p>
          </ScrollReveal>
        </div>
      </div>

      
      <section className="py-20 bg-gradient-to-b from-white to-blue-50 -mt-16 relative z-20">
        <div className="container mx-auto px-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <ScrollReveal delay={0.2}>
              <div className="relative rounded-xl overflow-hidden shadow-2xl h-96">
                <img 
                  src={historyImage} 
                  alt="School History" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-800/80 to-transparent flex items-end p-8">
                  <h3 className="text-3xl font-bold text-white">25+ Years of Educational Excellence</h3>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-blue-900">Our Humble <span className='text-yellow-500 '>Beginnings</span></h2>
                <p className="text-gray-700 leading-relaxed">
                  Founded in 1995 with just 120 students and 8 teachers, Tullu Dimtu Secondary School 
                  began as a small community initiative to bring quality education to the region. 
                  Through the dedication of our staff and support from the community, we've grown 
                  into one of the most respected institutions in the country.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Today, we serve over 1,200 students with a faculty of 85 highly qualified educators, 
                  maintaining our commitment to academic excellence while adapting to the changing 
                  needs of 21st century education.
                </p>
                <div className="flex items-center space-x-4 pt-4">
                  <div className="bg-yellow-500 text-white p-3 rounded-full">
                    <FaUsers className="text-xl" />
                  </div>
                  <div>
                    <p className="font-bold text-blue-900">1,200+ Students</p>
                    <p className="text-sm text-gray-600">Currently enrolled</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Timeline Section */}
          <ScrollReveal delay={0.6}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
              <h2 className="text-3xl font-bold text-center text-blue-900 mb-8 sm:mb-12">
                Milestone <span className="text-yellow-500">Timeline</span>
              </h2>
              
              <div className="relative">
                <div className="hidden md:block absolute left-1/2 h-full w-1 bg-yellow-400 transform -translate-x-1/2"></div>
                
                <div className="space-y-8 sm:space-y-12">
                  {timeline.map((item, index) => (
                    <div 
                      key={index} 
                      className="relative flex flex-col md:flex-row items-start md:items-center"
                    >
                      <div className="w-full md:w-1/2 px-4 py-3 md:px-6 md:py-3 order-1">
                        <div className={`p-4 rounded-lg shadow-md w-full md:w-auto ${
                          index % 2 === 0 
                            ? 'bg-blue-100 text-blue-900 md:ml-auto' 
                            : 'bg-yellow-100 text-yellow-900 md:mr-auto'
                        }`}>
                          <h3 className="text-xl font-bold text-center md:text-left">{item.year}</h3>
                        </div>
                      </div>
                      
                      <div className="absolute left-1/2 md:left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white border-4 border-yellow-500 rounded-full flex items-center justify-center z-10 top-[60px] md:top-1/2 md:-translate-y-1/2">
                        <div className="text-yellow-600">
                          {item.icon}
                        </div>
                      </div>
                      
                      <div className="w-full md:w-1/2 px-4 py-3 md:px-6 md:py-3 order-3 mt-4 md:mt-0">
                        <div className={`p-6 rounded-xl shadow-lg ${
                          index % 2 === 0 
                            ? 'bg-white md:mr-6' 
                            : 'bg-blue-50 md:ml-6'
                        }`}>
                          <h4 className="text-xl font-bold text-blue-900 mb-2">{item.title}</h4>
                          <p className="text-gray-700">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Legacy Section */}
          <ScrollReveal delay={0.8}>
            <div className="mt-24 bg-gradient-to-r from-blue-700 to-blue-900/90 rounded-2xl p-10 md:p-12 text-white">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Building a Lasting Legacy</h2>
                <p className="text-lg md:text-xl leading-relaxed mb-6">
                  Our history is not just about dates and buildings - it's about the thousands of lives 
                  transformed through education. The Tullu Dimtu story continues to be written by each 
                  student who walks through our doors.
                </p>
                <div className="w-32 h-1 bg-yellow-400 mx-auto"></div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default OurHistory;