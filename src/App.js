import './App.css';                     
import Header from './components/Header'; 
import { Routes, Route } from 'react-router-dom';  
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




function App() {
  return (
    <>
      <Header />
     <div className="">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about/chairman-welcome" element={<ChairmanWelcome />} />
          <Route path='/about/mission-vision' element={<MissionVision/>} />
          <Route path='/about/our-history' element={<OurHistory/>} />
          <Route path='/about/principal-message' element={<PrincipalMessage/>} />
          <Route path='/about/school-profile' element={<SchoolProfile/>} />
          <Route path='/about/school-achievements' element={<SchoolAchievements/>}/>
          <Route path='/ourschool/overview' element={<SchoolOverview/>} />
          <Route path='/ourschool/curriculum' element={<CurriculumShowcase/>} />
          <Route path='/ourschool/secondary' element={<Secondary/>} />
          <Route path='/ourschool/community' element={<TulluDimtuSchool/>} />
          <Route path='/ourschool/sport' element={<TulluDimtuSportsClub/>} />
          <Route path='/students/life' element={<StudentLife/>}/>
          <Route path='/students/rules' element={<TulluDimtuSchoolRules/>} />
          <Route path='/students/council' element={<CounselingPage/>} />
          <Route path='/contact' element={<Contact/>} />
          <Route path='/admission' element={<AdmissionPortal/>} />
          <Route path='/register' element={<RegistrationForm/>}/>
          <Route path='/studentlife' element={<StudentEvent/>} />

        </Routes>
        <ToastContainer />
      </div>
    </>
  );
}

export default App;
