import './App.css';                     
import Header from './components/Header'; 
import { Routes, Route, Navigate } from 'react-router-dom';  
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

// Beautiful Loading Component
function BeautifulLoader() {
  const [colorIndex, setColorIndex] = useState(0);
  const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];

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
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-xl font-semibold">Loading...</p>
      </div>
    </div>
  );
}

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

// Main App Content
function AppContent() {
  const { isSignedIn } = useAuth();

  return (
    <>
      
      {isSignedIn && <Header />}
      
      <div className="">
        <Routes>
          
          <Route 
            path='/' 
            element={
              <PublicRoute>
                <ContactForm />
              </PublicRoute>
            } 
          />
          
          
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          
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
          
          {/* Redirect root to auth page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ToastContainer />
      </div>
    </>
  );
}


function App() {
  const clerkPubKey = "pk_test_aW5maW5pdGUtc29sZS05LmNsZXJrLmFjY291bnRzLmRldiQ";

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <AppContent />
    </ClerkProvider>
  );
}

export default App;