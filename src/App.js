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

// Beautiful Loading Component with the new loader
function BeautifulLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div style={{ position: 'relative', width: '160px', height: '100px' }}>
        <div className="loader"></div>
        <div className="loader"></div>
        <div className="loader"></div>
        <p className="absolute bottom-[-40px] left-1/2 transform -translate-x-1/2 text-gray-600 font-medium">
          Loading...
        </p>
      </div>
    </div>
  );
}

const Layout = ({ children }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time or wait for content to load
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // Adjust time as needed

    return () => clearTimeout(timer);
  }, [location.pathname]); // Re-run when route changes

  // Routes where header should be hidden
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
  
  const shouldShowHeader = !hideHeaderRoutes.includes(location.pathname);

  if (loading) {
    return <BeautifulLoader />;
  }

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
    <TeacherDataContext.Provider value={teacherData}>
      <Layout>
        <Routes>
          {/* ContactForm */}
          <Route path='/' element={<Home />} />
          <Route path='/studet-see-dash' element={<EmailStudent/>} />
          <Route path='/student-see-profile' element={<StudentSeeProfile />} />
          <Route path='/student-councle-port' element={<ConcernsDashboard />} />
          <Route path='/contact-school-port' element={<ContactDashboard />} />
          <Route path='/student-note11' element={<StudentNotes3 />} />
          <Route path='/student-note10' element={<StudentNotes2 />} />
          <Route path='/student-note9' element={<StudentNotes1 />} />
          <Route path='/student-note' element={<StudentNotes />} />
          <Route path='/grade12' element={<EthiopianUniversityEntranceExam />} />
          <Route path='/logIn' element={<AdminSignInPage />} />
          <Route path='/admission-portal' element={<AdminDashboardPage />} />
          <Route path='/online-admission' element={<AdmissionFormOnline />} />
          <Route path='/admission-Page' element={<AdmissionPage/>} />
          <Route path='/grade11' element={<EthiopianGrade11Quiz/>} />
          <Route path='/grade10' element={<Grade10/>} />
          <Route path='/grade9' element={<Grade9/>} />
          <Route path='/admin-control' element={<GlassCards />} />
          <Route path='/school-Calendar' element={<SchoolCalendar/>} />
          <Route path='/acadamics-dashboard' element={<Dashboard />} />
          <Route path='/dashbord-visitor' element={<AdminDashboard />} />
          <Route path='/teachersupload-platform' element={<TeacherUploadPlatform/>} />
          <Route path='/studentgetstudy-material' element={<StudentDashboardStudy />} />
          <Route path='/studentstudy-dashboard' element={<StudentStudyPlace />} />
          <Route path='/profile-page' element={<CambridgeAcademy/>} />
          <Route path='/schedule-visit' element={<SchoolVisit/>} />
          <Route path='/teacher-email' element={<TeacherEmail />} />
          <Route path='/student-dashbord' element={<StudentDashboard />} />
          <Route path='/youtube-titorial' element={<YouTubeCards />} />
          <Route path='/email-verification' element={<Email />} />
          <Route path='/school-terms' element={<TermsOfService/>} />
          <Route path='/teacher-profile' element={<AdminTeacher />} />
          <Route path='/school-news' element={<NewsPage/>} />
          <Route path='/director-news' element={<DirectorPage />} />
          <Route path='/gallery' element={<Gallery/>} />
          <Route path='/tuludimtuschool-policy' element={<TuludimtuSchoolPolicy/>} />
          <Route path='/signIn' element={<AdminSignIn />} />
          <Route path='/news-event' element={<AdminUser />} />
          <Route path='/components/admin-dashboard' element={<AdminPage />} />
          <Route path="/home" element={<Home />} />
          <Route path='/other/teacher-attendance' element={<TeacherAttendance />} />
          <Route path="/other/teacher-profile" element={<TeacherUploadForm />} />
          <Route path="/other/teacher-list" element={<TeacherList />} />
          <Route path="/about/chairman-welcome" element={<ChairmanWelcome />} />
          <Route path='/about/mission-vision' element={<MissionVision/>} />
          <Route path='/about/our-history' element={<OurHistory/>} />
          <Route path='/about/principal-message' element={<PrincipalMessage/>} />
          <Route path='/about/school-profile' element={<SchoolProfile/>} />
          <Route path='/about/school-achievements' element={<SchoolAchievements/>} />
          <Route path='/ourschool/overview' element={<SchoolOverview/>} />
          <Route path='/ourschool/curriculum' element={<CurriculumShowcase/>} />
          <Route path='/ourschool/secondary' element={<Secondary/>} />
          <Route path='/ourschool/community' element={<TulluDimtuSchool/>} />
          <Route path='/ourschool/sport' element={<TulluDimtuSportsClub/>} />
          <Route path='/students/life' element={<StudentLife/>} />
          <Route path='/students/rules' element={<TulluDimtuSchoolRules/>} />
          <Route path='/students/council' element={<CounselingPage/>} />
          <Route path='/contact' element={<Contact/>} />
          <Route path='/admission' element={<AdmissionPortal/>} />
          <Route path='/register' element={<RegistrationForm/>} />
          <Route path='/studentlife' element={<StudentEvent/>} />
          <Route path='/form' element={<Registration/>} />
          <Route path="/verify-phone" element={<PhoneVerification />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ToastContainer />
      </Layout>
      <ChatBot/>
    </TeacherDataContext.Provider>
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
  return <AppContent />;
}

export default App;