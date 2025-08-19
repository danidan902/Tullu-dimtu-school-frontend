
import { FaChevronDown, FaChevronLeft, FaChevronRight, } from 'react-icons/fa';
import { useState } from 'react';
import BackgroundImageForSchool from '../assets/Student.jpg'
import Images from '../assets/StudentImage.jpg'
import SchoolAchivment from '../assets/ImageChild.jpg'
import SchoolsStudent from '../assets/pag.jpg'
import Footer from '../components/Footer';

const SchoolAchievements = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const achievements = [
    {
            year: "2024",
            title: "Top Performing University Students.",
            descraption: "Top promoted student from our region.",
            image: BackgroundImageForSchool,
     },
    {
      year: "2023",
      title: "STEM Innovation Award",
      description: "Recognized for our advanced science and technology programs",
      image: SchoolAchivment
    },
    {
      year: "2022",
      title: "Top Performing School",
      description: "Ranked #1 in regional academic performance",
      image: SchoolsStudent
    },
    {
      year: "2021",
      title: "Community Service Honors",
      description: "Awarded for outstanding student volunteer work",
      image: Images
    }
  ];

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === achievements.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? achievements.length - 1 : prev - 1));
  };

  return (
   
   <>
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our <span className="text-blue-600">Proud Moments</span>
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Navigation Arrows */}
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-md hover:bg-gray-100 transition-colors"
          >
            <FaChevronLeft className="text-gray-700" />
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-md hover:bg-gray-100 transition-colors"
          >
            <FaChevronRight className="text-gray-700" />
          </button>

          {/* Achievement Slides */}
          <div className="overflow-hidden rounded-xl shadow-xl">
            <div 
              className="relative h-96 bg-cover bg-center transition-all duration-500"
              style={{ backgroundImage: `url(${achievements[activeIndex].image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/30"></div>
              <div className="absolute bottom-0 left-0 right-0 p-10 text-white">
                <div className="max-w-2xl mx-auto">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    {achievements[activeIndex].year}
                  </span>
                  <h3 className="text-3xl font-bold mt-4 mb-2">{achievements[activeIndex].title}</h3>
                  <p className="text-lg">{achievements[activeIndex].description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {achievements.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full ${activeIndex === index ? 'bg-blue-600' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-16 bg-white rounded-xl shadow-md p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "25+", label: "Years of Excellence" },
              { value: "1500+", label: "Successful Graduates" },
              { value: "50+", label: "Qualified Teachers" },
              { value: "98%", label: "Satisfaction Rate" }
            ].map((stat, index) => (
              <div key={index} className="text-center p-4 border border-gray-100 rounded-lg">
                <p className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
   
  <Footer/>
   </>
  );
};

export default SchoolAchievements




      
