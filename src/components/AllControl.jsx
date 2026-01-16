import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FaEye  } from 'react-icons/fa';
import logo from '../assets/tullulogo.png'

const GlassCards = () => {
  const navigate = useNavigate();
  
  const cards = [
    {
      id: 1,
      title: "Teacher Upload Attendance $ Mark List",
      description: "Admin can access Teacher upload attendance records, enter marks, manage class schedules, and communicate with students and parents efficiently.",
      stats: "Attendance & Marks",
      buttons: [
        {
          text: "View Upload Attendance",
          action: () => navigate('/components/admin-dashboard'),
          type: 'secondary'
        },
      ]
    },
    {
      id: 2,
      title: "Student Academics Registered",
      description: "Registered students can view their academic records, attendance, marks, download study materials, and track their academic progress.",
      stats: "Academic Tracking",
      buttons: [
        {
          text: "View Student Academics",
          action: () => navigate('/acadamics-dashboard'),
          type: 'accent'
        },
      ]
    },
    {
      id: 3,
      title: "Student Council Registered",
      description: "Student council members can manage events, post announcements, gather feedback, and coordinate extracurricular activities.",
      stats: "Student Leadership",
      buttons: [
        {
          text: "",
          action: () => navigate('/manage-events'),
          type: 'info'
        },
      ]
    },
    {
      id: 4,
      title: "School Contact Registered",
      description: "Centralized contact information for departments, staff, and administration. Parents can submit inquiries and schedule meetings.",
      stats: "Communication Hub",
      buttons: [
        {
          text: "View School Contact",
          action: () => navigate('/contact-directory'),
          type: 'warning'
        },
      ]
    },
    {
      id: 5,
      title: "School Visitor Registered",
      description: "Visitor management system for logging guest entries, scheduling appointments, and maintaining campus security records.",
      stats: "Visitor Management",
      buttons: [
        {
          text: "View School Visitor",
          action: () => navigate('/dashbord-visitor'),
          type: 'success'
        },
      ]
    },
    {
      id: 6,
      title: "Director News Portal",
      description: "Administrators can access all system modules, manage user permissions, oversee school operations, and generate comprehensive reports.",
      stats: "Upload News & Announcment",
      buttons: [
        {
          text: "Admin Dashboard",
          action: () => navigate('/news-event'),
          type: 'primary'
        },
      ]
    },
  ];


  const getButtonClass = (type) => {
    const baseClasses = "px-4 py-3 rounded-lg font-medium w-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg";
    
    switch(type) {
      case 'primary':
        return `${baseClasses} bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700`;
      case 'secondary':
        return `${baseClasses} bg-gradient-to-r from-blue-400 to-blue-500 text-white hover:from-blue-500 hover:to-blue-600`;
      case 'accent':
        return `${baseClasses} bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800`;
      case 'info':
        return `${baseClasses} bg-gradient-to-r from-blue-300 to-blue-400 text-white hover:from-blue-400 hover:to-blue-500`;
      case 'warning':
        return `${baseClasses} bg-gradient-to-r from-blue-700 to-blue-800 text-white hover:from-blue-800 hover:to-blue-900`;
      case 'success':
        return `${baseClasses} bg-gradient-to-r from-blue-800 to-blue-900 text-white hover:from-blue-900 hover:to-indigo-900`;
      default:
        return `${baseClasses} bg-gradient-to-r from-blue-500 to-blue-600 text-white`;
    }
  };

  return (
   <>

     <div className="relative bg-gradient-to-r from-blue-800 to-blue-600 text-white py-16">
                <div className="fixed top-2 left-2 right-2 z-10 md:top-4 md:left-4 md:right-auto">
                            <button
                              onClick={() => navigate('/')}
                              className="flex items-center justify-center space-x-2 w-full md:w-auto px-3 py-2 md:px-4 md:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md text-sm md:text-base"
                            >
                              <Home className="w-4 h-4 md:w-5 md:h-5" />
                              <span className="truncate">Back to Home Page</span>
                            </button>
                          </div>
              <div className="absolute inset-0 bg-black opacity-40"></div>
              <div className="flex justify-center mb-4 md:mb-6 mt-4 md:mt-0">
                           <div className="bg-blue-100 rounded-2xl max-w-[200px] md:max-w-none">
                             <img src={logo} alt='Tuludimtu School Logo' className='w-56 h-56'/>
                           </div>
                         </div>
              <div className="relative container mx-auto px-4 text-center">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">School Management System</h2>
                <p className="text-xl opacity-90 max-w-2xl mx-auto">
                  The Admin Portal of Tullu Dimtu School is designed to manage core academic operations securely and efficiently. Through this portal, administrators can register students, manage teachers, upload attendance records and mark lists, and handle school visitor access and contact requests.
                </p>
              </div>
            </div>
   
    <div className="min-h-screen relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
                
          

      {/* Content Container */}
      <div className="relative z-10 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          

         

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {cards.map((card) => (
              <div 
                key={card.id}
                className="relative group"
              >
                {/* Glass Effect Card */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 h-full flex flex-col">
                  
                  {/* Card Header */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-3 shadow-lg">
                          <span className="text-white font-bold text-lg">
                            {card.id}
                          </span>
                        </div>
                      </div>
                      
                      {/* Stats Badge */}
                      <div className="px-3 py-1 bg-blue-900/50 backdrop-blur-sm rounded-full text-sm text-blue-100 font-medium border border-blue-400/30">
                        {card.stats}
                      </div>
                    </div>
                  </div>
                  
                  {/* Card Content */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-3">
                      {card.title}
                    </h3>
                    <p className="text-blue-100 mb-6 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                  
                  {/* Buttons Container */}
                  <div className="mt-6 pt-6 border-t border-blue-400/20 space-y-3">
  {card.buttons.map((button, index) => (
    <button
      key={index}
      onClick={button.action}
      className={`${getButtonClass(button.type)} flex items-center justify-center gap-2`}
    >
      <FaEye className="text-lg" />
      <span>{button.text}</span>
    </button>
  ))}
</div>  
    </div>

                <div className={`absolute -inset-0.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-20 blur transition duration-500 -z-10`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
   
   </>
  );
};

export default GlassCards;