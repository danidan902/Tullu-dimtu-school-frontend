

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft} from 'lucide-react';
import logo from '../assets/tullulogo.png'
import { Helmet } from "react-helmet-async";
const TermsOfService = () => {
  const [openSections, setOpenSections] = useState({
    introduction: false,
    acceptance: false,
    accounts: false,
    conduct: false,
    content: false,
    privacy: false,
    termination: false,
    liability: false,
    changes: false
  });

  const navigate = useNavigate();

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const termsData = [
    {
      id: 'introduction',
      title: 'Introduction',
      content: `Welcome to Tuludimtu School's digital platforms. These Terms of Service govern your use of our website, learning management system, mobile applications, and all related services (collectively, the "Services"). By accessing or using our Services, you agree to be bound by these Terms.`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
      )
    },
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      content: `By registering for an account or using any of our Services, you affirm that you are at least 13 years old (or the minimum age in your jurisdiction to consent to online services) and fully capable of entering into these Terms. If you are under 18, you confirm that your parent or guardian has reviewed and agreed to these Terms on your behalf.`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      )
    },
    {
      id: 'accounts',
      title: 'User Accounts & Responsibilities',
      content: `You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must:
      • Provide accurate and complete information during registration
      • Notify us immediately of any unauthorized access
      • Not share your account credentials with others
      • Maintain only one account unless expressly permitted`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      )
    },
    {
      id: 'conduct',
      title: 'Acceptable Use & Code of Conduct',
      content: `Users must adhere to our School Code of Conduct while using our Services. Prohibited activities include:
      • Harassment, bullying, or discrimination
      • Sharing inappropriate or harmful content
      • Attempting to disrupt platform functionality
      • Violating intellectual property rights
      • Using services for commercial purposes without authorization
      • Circumventing security measures`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      )
    },
    {
      id: 'content',
      title: 'Educational Content & Intellectual Property',
      content: `All educational materials, course content, software, logos, and trademarks are the property of Tuludimtu School or our licensors. You are granted a limited, non-exclusive license to access and use educational content for personal, non-commercial educational purposes only. You may not reproduce, distribute, modify, or create derivative works without explicit permission.`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
      )
    },
    {
      id: 'privacy',
      title: 'Privacy & Data Protection',
      content: `Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your personal information. By using our Services, you consent to our data practices as described in the Privacy Policy, which complies with applicable data protection laws including FERPA and COPPA.`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      )
    },
    {
      id: 'termination',
      title: 'Termination & Suspension',
      content: `Tuludimtu School reserves the right to suspend or terminate your access to the Services at any time for violations of these Terms or for conduct detrimental to our educational community. Upon termination, your right to use the Services will immediately cease.`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
      )
    },
    {
      id: 'liability',
      title: 'Limitation of Liability',
      content: `To the maximum extent permitted by law, Tuludimtu School shall not be liable for any indirect, incidental, special, or consequential damages resulting from your use or inability to use our Services. Our total liability shall not exceed the amount paid by you, if any, for accessing the Services in the six months prior to the claim.`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
      )
    },
    {
      id: 'changes',
      title: 'Modifications to Terms',
      content: `We may update these Terms periodically to reflect changes in our Services or legal requirements. We will notify users of significant changes through our platform or via email. Continued use of our Services after changes constitutes acceptance of the modified Terms.`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      )
    }
  ];

  const lastUpdated = "December 1, 2024";








        {/* Logo Container - Mobile Responsive */}
       








  return (
   <>
      <Helmet>
         <title> School Term</title>
           </Helmet>
   
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
             <div className="fixed left-2 sm:left-4 top-2 sm:top-4 z-20">
              <button
                onClick={() => navigate('/')}
                className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                aria-label="Go back"
              >
                <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
            </div>
  
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4 md:mb-6 mt-14 md:mt-0">
          <div className="bg-blue-100 rounded-2xl max-w-[300px] md:max-w-none">
            <img src={logo} alt='Tuludimtu School Logo' className='w-full h-auto'/>
          </div>
        </div> 
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Tuludimtu School Terms of Service
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
            These terms govern your use of Tuludimtu School's digital platforms, 
            educational resources, and online services.
          </p>
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
            Last Updated: {lastUpdated}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
                Quick Navigation
              </h2>
              <nav className="space-y-2">
                {termsData.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      document.getElementById(section.id)?.scrollIntoView({ 
                        behavior: 'smooth' 
                      });
                    }}
                    className="flex items-center gap-3 w-full text-left p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200 group"
                  >
                    <span className="text-blue-600">{section.icon}</span>
                    <span className="font-medium text-gray-700 group-hover:text-blue-700">
                      {section.title}
                    </span>
                  </button>
                ))}
              </nav>
              
              {/* Contact Info */}
              <div className="mt-10 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Questions?
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Contact our administrative office for clarifications regarding these terms.
                </p>
                <div className="space-y-3">
                  <a 
                    href="mailto:admin@tuludimtuschool.edu" 
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    admin@tuludimtuschool.edu
                  </a>
                  <a 
                    href="tel:+1234567890" 
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    +1 (234) 567-890
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Terms Sections */}
          <div className="lg:col-span-3 space-y-6">
            {/* Important Notice */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Important Notice
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      By accessing or using Tuludimtu School's digital platforms, 
                      you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. 
                      If you do not agree, please discontinue use immediately.
                    </p>
                  </div>
                </div>
              </div>
            </div>
 
            {/* Terms Sections */}
            {termsData.map((section) => (
              <div 
                key={section.id} 
                id={section.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-2xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                      {section.icon}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                      {section.title}
                    </h2>
                  </div>
                  {openSections[section.id] ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="18 15 12 9 6 15"></polyline>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  )}
                </button>
                
                <div className={`px-6 overflow-hidden transition-all duration-300 ${
                  openSections[section.id] ? 'pb-6 max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="border-t border-gray-200 pt-6">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {section.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            

            
          </div>
        </div>
      </div>
    </div>

   </>
  );
};

export default TermsOfService;