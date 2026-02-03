
import './App.css';   
import React from 'react';              
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';  
import Home from './Pages/Home';
import ChairmanWelcome from './about/chairman-welcome';
import MissionVision from './about/mission-vision';
import OurHistory from './about/our-history';
import PrincipalMessage from './about/principal-message';
import SchoolProfile from './about/school-profile';
import SchoolAchievements from './about/school-achievements';
import SchoolOverview from './ourschool/overview';
import CurriculumShowcase from './ourschool/curriculum';
import Secondary from './ourschool/secondary';
import TulluDimtuSchool from './ourschool/community';
import TulluDimtuSportsClub from './ourschool/sport';
import StudentLife from './students/life';
import TulluDimtuSchoolRules from './students/rules';
import CounselingPage from './students/council';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Contact from './Pages/Contact';
import AdmissionPortal from './Pages/Admission';
import RegistrationForm from './Pages/Registration';
import StudentEvent from "./Pages/Studentlife";
import ContactForm from './Pages/HomeAuth';
import { ClerkProvider, useAuth } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import TeacherList from './other/TeacherList';
import TeacherUploadForm from './other/TeacherProfileUpload';
import TeacherAttendance from './components/TeacherAttendance';
import AdminPage from './components/Admin';
import AdminSignIn from './components/AdminSign';
import Header from './components/Header';
import Registration from './components/RegistrationForm';
import NewsPage from './Pages/NewsPage';
import DirectorPage from './Pages/DirectorPage';
import Gallery from './other/Galary';
import ChatBot from './components/ChatBot';
import PhoneVerification from './components/PhoneVerification';
import AdminUser from './other/AdminSign';
import TuludimtuSchoolPolicy from './other/TuludimtuPolicy';
import AdminTeacher from './students/AdminSign';
import TermsOfService from './other/SchoolTerm';
import Email from './other/EmailVerification';
import YouTubeCards from './other/TitorialVedio';
import TeacherEmail from './components/TeacherEmail';
import SchoolVisit from './components/SecheduleVisiot';
import CambridgeAcademy from './components/ProfilePage';
import StudentDashboard from './components/StudentDashboard';
import StudentStudyPlace from './components/ProfationalStudy';
import StudentDashboardStudy from './components/StudentDashboard';
import TeacherUploadPlatform from './components/TeachersStudyPlatform';
import AdminDashboard from './components/AdminDashboardVisitor';
import Dashboard from './components/Dashboard';
import SchoolCalendar from './components/SchoolCalander';
import GlassCards from './components/AllControl';
import Grade9 from './exams/Grade9';
import Grade10 from './exams/Grade10';
import EthiopianGrade11Quiz from './exams/Grade11';
import AdmissionPage from './Pages/ProfilePage';
import AdmissionFormOnline from './Admission/Addmision';
import AdminDashboardPage from './Admission/AdminDashboard';
import AdminSignInPage from './Admission/AdminSign';
import EthiopianUniversityEntranceExam from './exams/Grade12';
import StudentNotes from './Pages/StudentNotes';
import StudentNotes1 from './Pages/StudentNote1';
import StudentNotes2 from './Pages/StudentNote2';
import StudentNotes3 from './Pages/StudentNote3';
import ContactDashboard from './components/SchoolContactDash';
import ConcernsDashboard from './components/StudentCounsleDash';
import StudentSeeProfile from './components/StudentSeeProfile';
import EmailStudent from './other/StudentSeeDash';




const useTeacherData = () => {
  const [chatUserName, setChatUserName] = useState("")
  const [teachers, setTeachers] = useState(() => {
    const saved = localStorage.getItem('schoolTeachers');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('schoolTeachers', JSON.stringify(teachers));
  }, [teachers]);

  const addTeacherProfile = (newTeacher) => {
    const teacherWithId = {
      ...newTeacher,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    setTeachers([...teachers, teacherWithId]);
    return teacherWithId;
  };

  const updateTeacherProfile = (id, updatedData) => {
    setTeachers(teachers.map(teacher => 
      teacher.id === id ? { ...teacher, ...updatedData } : teacher
    ));
  };

  const deleteTeacherProfile = (id) => {
    setTeachers(teachers.filter(teacher => teacher.id !== id));
  };

  const getTeacherById = (id) => {
    return teachers.find(teacher => teacher.id === id);
  };

  return {
    teachers,
    addTeacherProfile,
    updateTeacherProfile,
    deleteTeacherProfile,
    getTeacherById
  };
};

// Create a context to share teacher data
const TeacherDataContext = React.createContext();

// Beautiful Loading Component
function BeautifulLoader() {
  const [colorIndex, setColorIndex] = useState(0);
  const colors = ['#f2faff', ];

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % colors.length);
    }, 800);

    return () => clearInterval(interval);
  }, [colors.length]);

  return (
    <div 
      className="min-h-screen flex items-center justify-center transition-all duration-500 ease-in-out"
      style={{ 
        backgroundColor: colors[colorIndex],
        background: `linear-gradient(135deg, ${colors[colorIndex]} 0%, ${colors[(colorIndex + 1) % colors.length]} 100%)`
      }}
    >
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-black text-xl font-semibold">Loading...</p>
      </div>
    </div>
  );
}

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isSignedIn, isLoaded } = useAuth();
  
  if (!isLoaded) {
    return <BeautifulLoader />; 
  }
  
  return isSignedIn ? children : <Navigate to="/" replace />;
}

// Public Route Component (redirect to home if already authenticated)
function PublicRoute({ children }) {
  const { isSignedIn, isLoaded } = useAuth();
  
  if (!isLoaded) {
    return <BeautifulLoader />;
  }
  
  return !isSignedIn ? children : <Navigate to="/home" replace />;
}


const Layout = ({ children }) => {
  const location = useLocation();
  const { isSignedIn } = useAuth();
  
 
  const hideHeaderRoutes = [
    '/components/admin-dashboard',
    '/news-event',
    '/signIn',
    '/director-news',
    '/teacher-profile',
    '/other/teacher-profile',
    '/tuludimtuschool-policy',
    '/form',
    '/school-terms',
    '/email-verification',
    '/youtube-titorial',
    '/teacher-email',
    '/other/teacher-attendance',
     '/profile-page',
     '/studentstudy-dashboard',
     '/studentgetstudy-material',
     '/teachersupload-platform',
     '/dashbord-visitor',
     '/admin-control',
     '/acadamics-dashboard',
     '/grade9',
     '/grade10',
      '/grade11',
      '/admission-Page',
      '/online-admission',
      '/logIn',
      '/admission-portal',
      '/grade12',
      '/contact-school-port',
      '/student-councle-port',
      '/studet-see-dash',
      '/student-see-profile'
     
  ];
  
  const shouldShowHeader = isSignedIn && !hideHeaderRoutes.includes(location.pathname);
  
   


  return (
    <>
      {shouldShowHeader && <Header />}
      <div className="w-full min-h-screen block">
  {children}
</div>
    </>
  );
};

// Main App Content with Teacher Data Provider
function AppContent() {
  const teacherData = useTeacherData();
 
  return (
    <>
    
    <TeacherDataContext.Provider value={teacherData}>
      <Layout>
        <Routes>
          <Route 
          path='/studet-see-dash'
          element={
            <ProtectedRoute>
               <EmailStudent/>
            </ProtectedRoute>
          }
          />
       
        
           <Route 
           path='/student-see-profile'
           element={
            <ProtectedRoute>
              <StudentSeeProfile />
            </ProtectedRoute>
           }
           />
          <Route 
          path='/student-councle-port'
          element={
            <ProtectedRoute >
              <ConcernsDashboard />
            </ProtectedRoute>
          }
          />
          <Route 
          path='/contact-school-port'
          element={
            <ProtectedRoute>
              <ContactDashboard />
            </ProtectedRoute>
          }
          />
          <Route 
          path='/student-note11'
            element={
              <ProtectedRoute>
                <StudentNotes3 />
              </ProtectedRoute>
            }
          />
           <Route 
           path='/student-note10'
           element={
            <ProtectedRoute>
              <StudentNotes2 />
            </ProtectedRoute>
           }
           />
          <Route 
           path='/student-note9'
            element={
              <ProtectedRoute>
                <StudentNotes1 />
              </ProtectedRoute>
            } />
   
       <Route 
       path='/student-note'
        element={
          <ProtectedRoute>
            <StudentNotes />
          </ProtectedRoute>
        } />

          <Route 
           path='/grade12'
           element={
            <ProtectedRoute>
              <EthiopianUniversityEntranceExam />
            </ProtectedRoute>
           }
          />
          <Route 
          path='/logIn'
            element={
              <ProtectedRoute>
                <AdminSignInPage />
              </ProtectedRoute>
            }
          />
          <Route 
          path='/admission-portal'
            element={
              <ProtectedRoute>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
           <Route 
           path='/online-admission'
            element={
              <ProtectedRoute>
                <AdmissionFormOnline />
              </ProtectedRoute>
            }
           />
           
          <Route 
          path='/admission-Page'
          element={
            <ProtectedRoute>
              <AdmissionPage/>
            </ProtectedRoute>
          }
          />
          <Route 
          path='/grade11'
          element={
            <ProtectedRoute>
              <EthiopianGrade11Quiz/>
            </ProtectedRoute>
          }
          />
          <Route
           path='/grade10'
           element={
            <ProtectedRoute>
              <Grade10/>
            </ProtectedRoute> }/>
           

          <Route 
          path='/grade9'
          element={
            <ProtectedRoute>
              <Grade9/>
            </ProtectedRoute>
          }
          />
       
    
       <Route 
       path='/admin-control'
       element={
        <ProtectedRoute>
          <GlassCards />
        </ProtectedRoute>
       }
       />

          <Route 
          path='/school-Calendar'
          element={
            <ProtectedRoute>
              <SchoolCalendar/>
            </ProtectedRoute>
          }
          />
          <Route 
          path='/acadamics-dashboard'
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
          />
    
         <Route 
         path='/dashbord-visitor'
         element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
         }
         />

          <Route 
          path='/teachersupload-platform' 
          element={
            <ProtectedRoute>
              <TeacherUploadPlatform/>
            </ProtectedRoute>
          }

          />
          <Route 
          path='/studentgetstudy-material'
          element={
            <ProtectedRoute>
              <StudentDashboardStudy />
            </ProtectedRoute>
          }
          />

          <Route 
          path='/studentstudy-dashboard'
          element={
            <ProtectedRoute>
              <StudentStudyPlace />
            </ProtectedRoute>
          }
          />

          <Route 
          path='/profile-page'
          element={
            <ProtectedRoute>
              <CambridgeAcademy/>
            </ProtectedRoute>
          }
          />

          <Route 
          path='/schedule-visit'
           element={
            <ProtectedRoute>
              <SchoolVisit/>
            </ProtectedRoute>
           }
          />
  
         <Route 
           path='/teacher-email'
           element={
            <ProtectedRoute>
              <TeacherEmail />
            </ProtectedRoute>
           }
         />
             <Route 
              path='/student-dashbord'
                element={
                  <ProtectedRoute>
                    <StudentDashboard />
               </ProtectedRoute>
                } 
                  />

          {/* Public Route - Landing Page */}
          <Route 
            path='/youtube-titorial'
            element={
              <ProtectedRoute>
                <YouTubeCards />
              </ProtectedRoute>
            }
          />
          <Route 
            path='/' 
            element={
              <PublicRoute>
                <ContactForm />
              </PublicRoute>
            } 
          />
          <Route 
          path='/email-verification'
          element={
            <ProtectedRoute>
              <Email />
            </ProtectedRoute>
          }
          />
           <Route 
            path='/school-terms'
            element={
              <ProtectedRoute>
                <TermsOfService/>
              </ProtectedRoute>
            } 
          />

          <Route
           path='/teacher-profile'
            element={
              <ProtectedRoute>
                 <AdminTeacher />
              </ProtectedRoute>
            }
             />


          <Route
           path='/school-news'
            element={
              <ProtectedRoute>
                 <NewsPage/>
              </ProtectedRoute>
            }
             />

             <Route 
               path='/director-news'
                 element={
                  <ProtectedRoute>
                     <DirectorPage />
                  </ProtectedRoute>
                 }
              />
            <Route 
              path='/gallery'
               element={
                <ProtectedRoute>
                  <Gallery/>
                </ProtectedRoute>
               }
               />

            <Route 
              path='/tuludimtuschool-policy'
                element={
                  <ProtectedRoute>
                    <TuludimtuSchoolPolicy/>
                  </ProtectedRoute>
                }
              />

          {/* Admin Routes without Header */}
          <Route 
            path='/signIn'
            element={
              <AdminSignIn />
            }
          />


   
         <Route 
            path='/news-event'
            element={
              <ProtectedRoute>
                <AdminUser />
              </ProtectedRoute> }
           />




          <Route
            path='/components/admin-dashboard'
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>  
            } 
          />

          {/* Main Dashboard/Home */}
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />

          {/* Other Program Routes */}
          <Route 
            path='/other/teacher-attendance'
            element={
              <ProtectedRoute>
                <TeacherAttendance />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/other/teacher-profile" 
            element={
              <ProtectedRoute>
                <TeacherUploadForm />
              </ProtectedRoute>
            } 
          />
         
          <Route 
            path="/other/teacher-list" 
            element={
              <ProtectedRoute>
                <TeacherList />
              </ProtectedRoute>
            } 
          />

          {/* About Us Routes */}
          <Route 
            path="/about/chairman-welcome" 
            element={
              <ProtectedRoute>
                <ChairmanWelcome />
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/about/mission-vision' 
            element={
              <ProtectedRoute>
                <MissionVision/>
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/about/our-history' 
            element={
              <ProtectedRoute>
                <OurHistory/>
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/about/principal-message' 
            element={
              <ProtectedRoute>
                <PrincipalMessage/>
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/about/school-profile' 
            element={
              <ProtectedRoute>
                <SchoolProfile/>
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/about/school-achievements' 
            element={
              <ProtectedRoute>
                <SchoolAchievements/>
              </ProtectedRoute>
            }
          />

          {/* Our School Routes */}
          <Route 
            path='/ourschool/overview' 
            element={
              <ProtectedRoute>
                <SchoolOverview/>
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/ourschool/curriculum' 
            element={
              <ProtectedRoute>
                <CurriculumShowcase/>
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/ourschool/secondary' 
            element={
              <ProtectedRoute>
                <Secondary/>
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/ourschool/community' 
            element={
              <ProtectedRoute>
                <TulluDimtuSchool/>
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/ourschool/sport' 
            element={
              <ProtectedRoute>
                <TulluDimtuSportsClub/>
              </ProtectedRoute>
            } 
          />

          {/* Students Routes */}
          <Route 
            path='/students/life' 
            element={
              <ProtectedRoute>
                <StudentLife/>
              </ProtectedRoute>
            }
          />
          <Route 
            path='/students/rules' 
            element={
              <ProtectedRoute>
                <TulluDimtuSchoolRules/>
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/students/council' 
            element={
              <ProtectedRoute>
                <CounselingPage/>
              </ProtectedRoute>
            } 
          />

          {/* Contact and Admission Routes */}
          <Route 
            path='/contact' 
            element={
              <ProtectedRoute>
                <Contact/>
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/admission' 
            element={
              <ProtectedRoute>
                <AdmissionPortal/>
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/register' 
            element={
              <ProtectedRoute>
                <RegistrationForm/>
              </ProtectedRoute>
            }
          />
          <Route 
            path='/studentlife' 
            element={
              <ProtectedRoute>
                <StudentEvent/>
              </ProtectedRoute>
            } 
          />
           
           
       
        <Route 
           path='/form'
           element={
            <ProtectedRoute>
              <Registration/>
            </ProtectedRoute>
           } 
           />

           <Route path="/verify-phone" 
           element={<ProtectedRoute>
            <PhoneVerification />
            </ProtectedRoute>} />

            
    
               
          
          
          {/* Catch-all route - redirect to landing page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ToastContainer />
        
      </Layout>
      
    </TeacherDataContext.Provider>
    
     <ChatBot/>

     

   
    </>
  );
}

// Custom hook to use teacher data
export const useTeacherDataContext = () => {
  const context = React.useContext(TeacherDataContext);
  if (!context) {
    throw new Error('useTeacherDataContext must be used within TeacherDataProvider');
  }
  return context;
};

// Main App Component
function App() {
  const clerkPubKey = "pk_test_aW5maW5pdGUtc29sZS05LmNsZXJrLmFjY291bnRzLmRldiQ";

  return (
    <ClerkProvider publishableKey={clerkPubKey} className="app-root">
      <AppContent />
    </ClerkProvider>
  );
}

export default App;







