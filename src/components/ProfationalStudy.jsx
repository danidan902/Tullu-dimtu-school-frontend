import  { useState, useEffect } from 'react';
import { FaBook, FaBookOpen, FaGraduationCap, FaHome, FaRegAddressBook, } from 'react-icons/fa';
import { FiHome,  FiDownload, FiStar,  FiHash, FiUpload, FiSettings,  FiSearch, FiFileText, FiVideo, FiFile, FiClipboard, FiBookOpen, FiAward, FiEye, FiPrinter, FiMaximize2, FiX, FiMoon, FiSun, FiUser, FiLogOut, FiEdit2, FiSave, FiPlay, FiCamera, FiMenu } from 'react-icons/fi';
import {  FileArchiveIcon,  } from 'lucide-react';
import sheger from '../assets/sheger3.png'
import logo from '../assets/tullulogo.png'
import sheger2 from '../assets/lo.jpg';
import { useNavigate } from 'react-router-dom';
import sheg from '../assets/lo.jpg'
import pot from '../assets/gal2.jpg';
import anim16 from '../assets/lib.jpg';
import anim12 from '../assets/hom1.jpg';
import bg from '../assets/lab.png';
import bg1 from '../assets/gal11.jpg';

const StudentStudyPlace = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : true;
  });
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfTitle, setPdfTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [activeCategory, setActiveCategory] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('john.smith@studysync.com');
  const [profileImage, setProfileImage] = useState('');
  const [tempUserName, setTempUserName] = useState('');
  const [tempProfileImage, setTempProfileImage] = useState('');
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const naviget = useNavigate();


  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarOpen && window.innerWidth < 1024) {
        const sidebar = document.querySelector('aside');
        if (sidebar && !sidebar.contains(event.target) && 
            !document.querySelector('.mobile-menu-button')?.contains(event.target)) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen]);

  // Handle video card click - opens video in modal
  const handleVideoCardClick = (url, title) => {
    setVideoUrl(url);
    setVideoTitle(title);
    setShowVideoPlayer(true);
    document.body.style.overflow = 'hidden';
    setSidebarOpen(false);
  };

  const handleViewPdf = (url, title) => {
    setPdfUrl(url);
    setPdfTitle(title);
    setShowPdfViewer(true);
    document.body.style.overflow = 'hidden';
    setSidebarOpen(false);
  };

  const handleViewVideo = (url, title) => {
    setVideoUrl(url);
    setVideoTitle(title);
    setShowVideoPlayer(true);
    document.body.style.overflow = 'hidden';
    setSidebarOpen(false);
  };

  const closePdfViewer = () => {
    setShowPdfViewer(false);
    document.body.style.overflow = '';
  };

  const closeVideoPlayer = () => {
    setShowVideoPlayer(false);
    document.body.style.overflow = '';
  };

  const handleNavClick = (section) => {
    setActiveSection(section);
    setActiveCategory(null);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setActiveSection('dashboard');
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
    setActiveSection('dashboard');
    setActiveCategory(null);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
    if (!showProfileDropdown) {
      setEditingProfile(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const startEditingProfile = () => {
    setTempUserName(userName);
    setTempProfileImage(profileImage);
    setEditingProfile(true);
  };

  const saveProfile = () => {
    if (tempUserName.trim()) {
      setUserName(tempUserName);
    }
    if (tempProfileImage) {
      setProfileImage(tempProfileImage);
    }
    setEditingProfile(false);
    alert('Profile updated successfully! 🎉');
  };

  const cancelEdit = () => {
    setEditingProfile(false);
    setTempUserName(userName);
    setTempProfileImage(profileImage);
  };

  const handleLogout = () => {
    alert('Logging out...');
    setShowProfileDropdown(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      if (!file.type.match('image.*')) {
        alert('Please select an image file');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setTempProfileImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadFile = async (url, filename, type) => {
    try {
      setDownloading(true);
      setDownloadProgress(0);
      
      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      let blob;
      if (type === 'pdf') {
        const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/Resources <<
/Font <<
/F1 4 0 R
>>
>>
/MediaBox [0 0 612 792]
/Contents 5 0 R
>>
endobj
4 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj
5 0 obj
<<
/Length 44
>>
stream
BT
/F1 24 Tf
100 700 Td
(${filename}) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000053 00000 n 
0000000101 00000 n 
0000000208 00000 n 
0000000308 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
404
%%EOF`;
        
        blob = new Blob([pdfContent], { type: 'application/pdf' });
      } else if (type === 'video') {
        const videoData = `WEBVTT

00:00:00.000 --> 00:00:05.000
${filename}

00:00:05.000 --> 00:00:10.000
Sample educational video content

00:00:10.000 --> 00:00:15.000
Downloaded from StudySync Dashboard`;
        
        blob = new Blob([videoData], { type: 'text/vtt' });
      } else {
        blob = new Blob([`${filename}\n\nThis is a sample ${type} file downloaded from StudySync.\n\nDate: ${new Date().toLocaleString()}\nSubject: Educational Resource`], { 
          type: type === 'pdf' ? 'application/pdf' : 
                 type === 'video' ? 'video/mp4' : 
                 'text/plain' 
        });
      }

      await new Promise(resolve => setTimeout(resolve, 1500));
      
      clearInterval(progressInterval);
      setDownloadProgress(100);

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${filename.replace(/\s+/g, '_')}.${type === 'pdf' ? 'pdf' : type === 'video' ? 'mp4' : 'txt'}`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(downloadUrl);

      setTimeout(() => {
        setDownloading(false);
        setDownloadProgress(0);
        alert(`✅ ${filename} downloaded successfully to your Downloads folder!`);
      }, 500);

    } catch (error) {
      console.error('Download error:', error);
      setDownloading(false);
      setDownloadProgress(0);
      alert('❌ Download failed. Please try again.');
    }
  };

  const handleDownload = (title, type) => {
    downloadFile('', title, type);
  };


  const categories = [
    { icon: <FiFileText />, label: 'Lecture Notes', color: 'blue', key: 'notes' },
    { icon: <FiVideo />, label: 'Videos', color: 'green', key: 'videos' },
    { icon: <FiFile />, label: 'PDFs', color: 'purple', key: 'pdfs' },
    { icon: <FiClipboard />, label: 'Assignments', color: 'red', key: 'assignments' },
    { icon: <FiBookOpen />, label: 'Textbooks', color: 'yellow', key: 'textbooks' },
    { icon: <FiAward />, label: 'Exams', color: 'indigo', key: 'exams' }
  ];

  const recentResources = [
   {
    title: 'Photosynthesis-Diagram',
    type: 'image',
    subject: 'Biology',
    date: '',
    downloads: '23',
    thumbnail: 'https://sciencenotes.org/wp-content/uploads/2025/11/Photosynthesis-Diagram-1024x683.png',
    category: 'notes',
    url: 'https://sciencenotes.org/wp-content/uploads/2025/11/Photosynthesis-Diagram-1024x683.png',
    videoUrl: ''
  },



{ 
  title: '2017 Biology Entrance Exam With Answer',
  type: 'video',
  subject: 'Biology',
  date: 'Unknown Date',         
  downloads: '89',     
  thumbnail: 'https://img.youtube.com/vi/EkRLs1NUvTo/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=EkRLs1NUvTo&list=PLMwcYNErqmSzm6mOBFQyFGsOJ6ygKDuJP&index=6',
  videoUrl: 'https://www.youtube.com/watch?v=EkRLs1NUvTo'
},
{ 
  title: '2017 Chemistry Entrance Examination Answers with Explanations',
  type: 'video',
  subject: 'Chemistry',
  date: '',          
  downloads: '55',     
  thumbnail: 'https://img.youtube.com/vi/4qIIZHuyMZo/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=4qIIZHuyMZo',
  videoUrl: 'https://www.youtube.com/watch?v=4qIIZHuyMZo'
},
{ 
  title: '2017 Economics Entrance exam Answers 2017 part 2 Economics Entrance Examination',
  type: 'video',
  subject: 'Economics',
  date: '',          
  downloads: '89',   
  thumbnail: 'https://img.youtube.com/vi/yPAByXB_Iy4/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=yPAByXB_Iy4&list=PLMwcYNErqmSzm6mOBFQyFGsOJ6ygKDuJP',
  videoUrl: 'https://www.youtube.com/watch?v=yPAByXB_Iy4'
},
{ 
  title: '2017 Mathematics Entrance Examination Answers with Explanations',
  type: 'video',
  subject: 'Mathematics',
  date: '',           
  downloads: '34',     
  thumbnail: 'https://img.youtube.com/vi/UTj3lBpDSpw/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=UTj3lBpDSpw',
  videoUrl: 'https://www.youtube.com/watch?v=UTj3lBpDSpw'
},
{ 
  title: '2017 English Entrance Examination Answers with Explanations',
  type: 'video',
  subject: 'English',
  date: '',          
  downloads: '90',     
  thumbnail: 'https://img.youtube.com/vi/xUNsN6TfSCY/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=xUNsN6TfSCY',
  videoUrl: 'https://www.youtube.com/watch?v=xUNsN6TfSCY'
},
{ 
  title: '2017 Geography Entrance Examination Answers with Explanations',
  type: 'video',
  subject: 'Geography',
  date: '',          
  downloads: '89',  
  thumbnail: 'https://img.youtube.com/vi/Ck7mMhceiNA/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=Ck7mMhceiNA',
  videoUrl: 'https://www.youtube.com/watch?v=Ck7mMhceiNA'
},
{ 
  title: '2017 History Entrance Examination Answers with Explanations',
  type: 'video',
  subject: 'History',
  date: '',         
  downloads: '78',    
  thumbnail: 'https://img.youtube.com/vi/id3GfRWGUIw/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=id3GfRWGUIw',
  videoUrl: 'https://www.youtube.com/watch?v=id3GfRWGUIw'
},
{ 
  title: '2017 Physics Entrance Examination Answers with Explanations',
  type: 'video',
  subject: 'Physics',
  date: '',          
  downloads: '99',    
  thumbnail: 'https://img.youtube.com/vi/jCm5Apazh40/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=jCm5Apazh40',
  videoUrl: 'https://www.youtube.com/watch?v=jCm5Apazh40'
},

  {
  title: 'Maths 2017 Entrance Exam (first round) | Ethiopia | EUEE | Maths EUEE',     // 📌 replace with the actual video title
  type: 'video',
  subject: 'Entrance ',       // 📌 replace with appropriate subject
  date: '',             // 📌 replace with actual publish date
  downloads: '30',                   // 📌 replace with view/download count if desired
  thumbnail: 'https://img.youtube.com/vi/Nwrg32sWs_Q/maxresdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=Nwrg32sWs_Q&list=PLUf24gkZq8wK6ZfO10GI7esj6WXH8kdiU',
  videoUrl: 'https://www.youtube.com/watch?v=Nwrg32sWs_Q'
},
{
  title: 'Part 3 of 4 | Maths Entrance Exam Prep | Grade 11 Maths',
  type: 'video',
  subject: 'Maths',
  date: 'Unknown Date',
  downloads: '8k',
  thumbnail: 'https://img.youtube.com/vi/fY40sb93hdo/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=fY40sb93hdo&list=PLUf24gkZq8wK6ZfO10GI7esj6WXH8kdiU&index=5',
  videoUrl: 'https://www.youtube.com/watch?v=fY40sb93hdo'
},
{
  title: 'English 2016 Entrance Exam | Ethiopia | EUEE | Saquama',
  type: 'video',
  subject: 'English',
  date: '',          // 📌 replace with actual publish date if needed
  downloads: '5k',    // 📌 replace with actual view/download count if desired
  thumbnail: 'https://img.youtube.com/vi/u3mXSTmxPFU/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=u3mXSTmxPFU',
  videoUrl: 'https://www.youtube.com/watch?v=u3mXSTmxPFU'
},
{
  title: 'ENTRANCE English Scholastic Aptitude Test (Exam Prep)',
  type: 'video',
  subject: 'English',
  date: '',        // 📌 replace with actual publish date if you want
  downloads: '3k',  // 📌 replace with actual view/downloads if desired
  thumbnail: 'https://img.youtube.com/vi/RU9LTsvVoRo/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=RU9LTsvVoRo',
  videoUrl: 'https://www.youtube.com/watch?v=RU9LTsvVoRo'
},
{
  title: 'እንደፈረንጅ እንዴት እንናገር | Get',  
  type: 'video',
  subject: 'English',
  date: '',        // 📌 replace with actual publish date if you want
  downloads: '2k',  // 📌 replace with actual view count if desired
  thumbnail: 'https://img.youtube.com/vi/FppRGOlHPUg/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=FppRGOlHPUg',
  videoUrl: 'https://www.youtube.com/watch?v=FppRGOlHPUg'
},
{
  title: 'እንግሊዝኛን በአቋራጭ ለጀማሪዎች (shortcut grammar part 1)',
  type: 'video',
  subject: 'English',
  date: 'Unknown Date',        // 📌 replace with actual publish date if you want
  downloads: '1k',  // 📌 replace with actual view/download stats if desired
  thumbnail: 'https://img.youtube.com/vi/DNGcTmTj7Dc/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=DNGcTmTj7Dc',
  videoUrl: 'https://www.youtube.com/watch?v=DNGcTmTj7Dc'
}
,
{
  title: '2017 History Entrance Examination Answers with Explanations',
  type: 'video',
  subject: 'History',
  date: 'Unknown Date',       
  downloads: '23.2k', 
  thumbnail: 'https://img.youtube.com/vi/id3GfRWGUIw/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=id3GfRWGUIw',
  videoUrl: 'https://www.youtube.com/watch?v=id3GfRWGUIw'
}
,
{
  title: 'Ethiopian Grade 12 Maths 1#1 Sequences and Series',
  type: 'video',
  subject: 'Maths',
  date: 'Unknown Date',       
  downloads: '1.1k',  
  thumbnail: 'https://img.youtube.com/vi/nX2tT_SwZWY/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=nX2tT_SwZWY&list=PLN5XUISsXgLb65VWelPyR-6ostDeed-fT',
  videoUrl: 'https://www.youtube.com/watch?v=nX2tT_SwZWY'
},
{
  title: 'Ethiopian Grade 12 Maths 1#7 The Sigma Notation',
  type: 'video',
  subject: 'Maths',
  date: 'Unknown Date',       
  downloads: '2.9k',  
  thumbnail: 'https://img.youtube.com/vi/IfYaW_zv3g4/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=IfYaW_zv3g4&list=PLN5XUISsXgLb65VWelPyR-6ostDeed-fT&index=7',
  videoUrl: 'https://www.youtube.com/watch?v=IfYaW_zv3g4'
},
{
  title: 'Ethiopian Grade 12 Maths 1#12 Recurring Sequences',
  type: 'video',
  subject: 'Maths',
  date: 'Unknown Date',        
  downloads: '1.2k',  
  thumbnail: 'https://img.youtube.com/vi/-nPh4LM6VEM/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=-nPh4LM6VEM&list=PLN5XUISsXgLb65VWelPyR-6ostDeed-fT&index=12',
  videoUrl: 'https://www.youtube.com/watch?v=-nPh4LM6VEM'
},
{
  title: 'Grade 12 Chemistry Unit 1: Bronsted‑Lowry Concept of Acids & Bases',
  type: 'video',
  subject: 'Chemistry',
  date: 'Unknown Date',        
  downloads: '78',  
  thumbnail: 'https://img.youtube.com/vi/oEoA9C1QBuk/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=oEoA9C1QBuk&list=PLhXdcrTaVuV_BdB2H4BfIFgfBARjzXFzb&index=2',
  videoUrl: 'https://www.youtube.com/watch?v=oEoA9C1QBuk'
},
{
  title: 'Grade 12 Chemistry Unit 1: The Common Ion Effect',
  type: 'video',
  subject: 'Chemistry',
  date: '',       
  downloads: '98',  
  thumbnail: 'https://img.youtube.com/vi/eVcI0I6jVSI/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=eVcI0I6jVSI&list=PLhXdcrTaVuV_BdB2H4BfIFgfBARjzXFzb&index=13',
  videoUrl: 'https://www.youtube.com/watch?v=eVcI0I6jVSI'
},
{
  title: 'Grade 11 Maths Unit 1: Introduction and Learning Objectives',
  type: 'video',
  subject: 'Maths',
  date: '',       
  downloads: '78',
  thumbnail: 'https://img.youtube.com/vi/w-IZ38kTQkQ/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=w-IZ38kTQkQ&list=PLhXdcrTaVuV-naaUVHaXQAuNnuuhZzFbZ',
  videoUrl: 'https://www.youtube.com/watch?v=w-IZ38kTQkQ'
},
{
  title: 'Grade 11 Maths Unit 1: Modulus (Absolute Value) Function',
  type: 'video',
  subject: 'Maths',
  date: '',        
  downloads: '', 
  thumbnail: 'https://img.youtube.com/vi/-vi6DrptG0Y/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=-vi6DrptG0Y&list=PLhXdcrTaVuV-naaUVHaXQAuNnuuhZzFbZ&index=12',
  videoUrl: 'https://www.youtube.com/watch?v=-vi6DrptG0Y'
},
{
  title: 'Grade 11 Maths Unit 1: Entrance Exam Questions',
  type: 'video',
  subject: 'Maths',
  date: '',       
  downloads: '',  
  thumbnail: 'https://img.youtube.com/vi/SJmcLIamXgE/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=SJmcLIamXgE&list=PLhXdcrTaVuV-naaUVHaXQAuNnuuhZzFbZ&index=36',
  videoUrl: 'https://www.youtube.com/watch?v=SJmcLIamXgE'
},
{
  title: 'Grade 11 Physics Unit 1: 1.1 Introduction',
  type: 'video',
  subject: 'Physics',
  date: '',
  downloads: '90',
  thumbnail: 'https://img.youtube.com/vi/Yaz1hd9byb0/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=Yaz1hd9byb0&list=PLhXdcrTaVuV_TqHn8dQixOKr6L0V8IGrf',
  videoUrl: 'https://www.youtube.com/watch?v=Yaz1hd9byb0'
},
{
  title: 'Grade 11 Physics Unit 1: 1.5 The Mission of Physics and Career Awareness',         
  type: 'video',
  subject: 'Physics',     
  date: '',           
  downloads: '23',     
  thumbnail: 'https://img.youtube.com/vi/wdZogMNcqCo/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=wdZogMNcqCo&list=PLhXdcrTaVuV_TqHn8dQixOKr6L0V8IGrf&index=5',
  videoUrl: 'https://www.youtube.com/watch?v=wdZogMNcqCo'
},
{
  title: 'Grade 11 Physics 3#5 Acceleration Time graph',
  type: 'video',
  subject: 'Physics',
  date: 'Unknown Date',        
  downloads: 'Unknown Views',  
  thumbnail: 'https://img.youtube.com/vi/hNStzw0fmbI/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=hNStzw0fmbI&list=PLN5XUISsXgLYu7YqiXJh6bTyvxDBJrIVV&index=5',
  videoUrl: 'https://www.youtube.com/watch?v=hNStzw0fmbI'
},
{
  title: ' Grade 11 Biology 3#1 Enzymes',
  type: 'video',
  subject: 'Biology',
  date: '',        
  downloads: '44',  
  thumbnail: 'https://img.youtube.com/vi/bXRNhb_N2h8/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=bXRNhb_N2h8&list=PLN5XUISsXgLYxX8yYkNDJIQH5yVogSK-c',
  videoUrl: 'https://www.youtube.com/watch?v=bXRNhb_N2h8'
},
{
  title: ' Grade 11 Biology 3#3 Enzyme Substrate Model',
  type: 'video',
  subject: 'Biology',
  date: '',        
  downloads: '34', 
  thumbnail: 'https://img.youtube.com/vi/sJSp3KxJQ0Q/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=sJSp3KxJQ0Q&list=PLN5XUISsXgLYxX8yYkNDJIQH5yVogSK-c&index=3',
  videoUrl: 'https://www.youtube.com/watch?v=sJSp3KxJQ0Q'
},
{
  title: 'Grade 11 Economics 3#1 National Income Accounting',
  type: 'video',
  subject: 'Economics',
  date: '',        
  downloads: '89',  
  thumbnail: 'https://img.youtube.com/vi/H3hWDFZ_CXc/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=H3hWDFZ_CXc&list=PLN5XUISsXgLbzre3ZWvY2aVC2I3DdlKVD',
  videoUrl: 'https://www.youtube.com/watch?v=H3hWDFZ_CXc'
},
{
  title: 'Grade 11 Economics 3#2 Approaches of Measuring National Income',
  type: 'video',
  subject: 'Economics',
  date: 'Unknown Date',        // 📌 replace with actual publish date if desired
  downloads: 'Unknown Views',  // 📌 replace with actual view/download count if desired
  thumbnail: 'https://img.youtube.com/vi/a2wybcaGGB0/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=a2wybcaGGB0&list=PLN5XUISsXgLbzre3ZWvY2aVC2I3DdlKVD&index=2',
  videoUrl: 'https://www.youtube.com/watch?v=a2wybcaGGB0'
},
{
  title: 'Grade 11 history unit 9 part 4 | The Age Evolution | The Period of Napoleon Bonaparte',
  type: 'video',
  subject: 'History',
  date: '',       
  downloads: '45', 
  thumbnail: 'https://img.youtube.com/vi/YTs8TgKqGt0/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=YTs8TgKqGt0&list=PLfXpdCfxjXmZgw93PwvFD_aFGUv87QeHC',
  videoUrl: 'https://www.youtube.com/watch?v=YTs8TgKqGt0'
},
{
  title: 'Grade 11 history unit 9 part 3 | The Age of Revolution | The French Revolution',
  type: 'video',
  subject: 'History',
  date: 'Unknown Date',       
  downloads: '22',  
  thumbnail: 'https://img.youtube.com/vi/8pP3yngQ8X8/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=8pP3yngQ8X8&list=PLfXpdCfxjXmZgw93PwvFD_aFGUv87QeHC&index=2',
  videoUrl: 'https://www.youtube.com/watch?v=8pP3yngQ8X8'
},
{
  title: 'Grade 11 history unit 8 Peoples and States of Southern, Western and Eastern Ethiopia',      
  type: 'video',
  subject: 'History',           
  date: 'Unknown Date',       
  downloads: '45',   
  thumbnail: 'https://img.youtube.com/vi/VFKTJ3GaBXE/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=VFKTJ3GaBXE&list=PLfXpdCfxjXmZgw93PwvFD_aFGUv87QeHC&index=10',
  videoUrl: 'https://www.youtube.com/watch?v=VFKTJ3GaBXE'
},
{
  title: 'Grade 11 history unit 8 part 1 | Peoples and States of Southern, Western and Eastern Ethiopia',
  type: 'video',
  subject: 'History',
  date: 'Unknown Date',       
  downloads: 'Unknown Views',  
  thumbnail: 'https://img.youtube.com/vi/OcZ-BZoDBP8/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=OcZ-BZoDBP8&list=PLfXpdCfxjXmZgw93PwvFD_aFGUv87QeHC&index=11',
  videoUrl: 'https://www.youtube.com/watch?v=OcZ-BZoDBP8'
},
{
  title: 'Grade 11 History unit 2 part 3 | major spots of ancient world civilization up to 500AD | Mesopotamia',
  type: 'video',
  subject: 'History',
  date: 'Unknown Date',        
  downloads: 'Unknown Views', 
  thumbnail: 'https://img.youtube.com/vi/qU3Q98VhMm4/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=qU3Q98VhMm4&list=PLfXpdCfxjXmZgw93PwvFD_aFGUv87QeHC&index=49',
  videoUrl: 'https://www.youtube.com/watch?v=qU3Q98VhMm4'
},
{
  title: 'Ethiopian Grade 11 Geography 3#1 Natural Resources',
  type: 'video',
  subject: 'Geography',
  date: '',       
  downloads: '45',  
  thumbnail: 'https://img.youtube.com/vi/9jhmHj88ZPM/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=9jhmHj88ZPM&list=PLN5XUISsXgLbUwR_ySjNvk_sqUes_tXAd',
  videoUrl: 'https://www.youtube.com/watch?v=9jhmHj88ZPM'
},
{
  title: 'Ethiopian Grade 11 Geography 3#2 Land Resource Depletion',
  type: 'video',
  subject: 'Geography',
  date: '',     
  downloads: '12',  
  thumbnail: 'https://img.youtube.com/vi/Nu_6jOPSud0/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=Nu_6jOPSud0',
  videoUrl: 'https://www.youtube.com/watch?v=Nu_6jOPSud0'
},
{
  title: 'Grade 10 Geography unit 8 part 4 | Advances in Mapmaking and the Birth of Geographic Information Sys',
  type: 'video',
  subject: 'Geography',
  date: '',       
  downloads: '32',
  thumbnail: 'https://img.youtube.com/vi/3dx0iocxw78/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=3dx0iocxw78&list=PLfXpdCfxjXmYXuf73oC6k9xvakjdwE9P-',
  videoUrl: 'https://www.youtube.com/watch?v=3dx0iocxw78'
},
{
  title: 'Grade 10 Geography unit 7 part 2 | Migration – Factors and Impacts on Africa',
  type: 'video',
  subject: 'Geography',
  date: '',        
  downloads: '32',  
  thumbnail: 'https://img.youtube.com/vi/4eg-AqDTgd4/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=4eg-AqDTgd4&list=PLfXpdCfxjXmYXuf73oC6k9xvakjdwE9P-&index=5',
  videoUrl: 'https://www.youtube.com/watch?v=4eg-AqDTgd4'
},
{
  title: 'Grade 10 Maths Unit 2: Review Exercise Unit 2: Polynomial Functions',
  type: 'video',
  subject: 'Maths',
  date: '',        
  downloads: '23',  
  thumbnail: 'https://img.youtube.com/vi/8xwFLHMlT-g/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=8xwFLHMlT-g&list=PLUf24gkZq8wLP8y8_3OWC4ek92KaIjIRi',
  videoUrl: 'https://www.youtube.com/watch?v=8xwFLHMlT-g'
},
{
  title: 'Grade 10 Maths Unit 2: 2.5 Graphs of Polynomial Functions',
  type: 'video',
  subject: 'Maths',
  date: '1',        
  downloads: '23',  
  thumbnail: 'https://img.youtube.com/vi/Ocy_INtPC9A/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=Ocy_INtPC9A&list=PLUf24gkZq8wLP8y8_3OWC4ek92KaIjIRi&index=5',
  videoUrl: 'https://www.youtube.com/watch?v=Ocy_INtPC9A'
},
{
  title: 'Grade 10 Maths Unit 2: 2.4 Zeros of a Polynomial Function',
  type: 'video',
  subject: 'Maths',
  date: 'Unknown Date',        // 📌 replace with actual publish date if desired
  downloads: 'Unknown Views',  // 📌 replace with actual view/download count if desired
  thumbnail: 'https://img.youtube.com/vi/qF1x3dpC1Oo/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=qF1x3dpC1Oo&list=PLUf24gkZq8wLP8y8_3OWC4ek92KaIjIRi&index=11',
  videoUrl: 'https://www.youtube.com/watch?v=qF1x3dpC1Oo'
},
{ 
  title: 'Grade 10 Physics 3#1 Elasticity',
  type: 'video',
  subject: 'Physics',
  date: '',        
  downloads: '56',  
  thumbnail: 'https://img.youtube.com/vi/65txtnQgOng/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=65txtnQgOng&list=PLN5XUISsXgLZNz7WKAFqQnDWPlJ4aN4NW',
  videoUrl: 'https://www.youtube.com/watch?v=65txtnQgOng'
},
{ 
  title: 'Grade 10 physics 3#3 Stress and strain',
  type: 'video',
  subject: 'Physics',              
  date: '',           
  downloads: '34',     
  thumbnail: 'https://img.youtube.com/vi/SevfOoCStKY/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=SevfOoCStKY&list=PLN5XUISsXgLZNz7WKAFqQnDWPlJ4aN4NW&index=3',
  videoUrl: 'https://www.youtube.com/watch?v=SevfOoCStKY'
},
{ 
  title: 'Grade 10 Biology unit 1 part 1 | Sub-fields of Biology',
  type: 'video',
  subject: 'Biology',
  date: '22',          
  downloads: '12',    
  thumbnail: 'https://img.youtube.com/vi/rj5RiNtmoQk/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=rj5RiNtmoQk&list=PLfXpdCfxjXmaZKO1cz8tk4l7rWThyCL8Z',
  videoUrl: 'https://www.youtube.com/watch?v=rj5RiNtmoQk'
},
{ 
  title: 'Grade 10 unit 1 part 3 | Handling and using a light microscope', // copy the exact video title
  type: 'video',
  subject: 'Biology',                         
  date: '',                      
  downloads: '45',                 
  thumbnail: 'https://img.youtube.com/vi/1NC-X91QpOI/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=1NC-X91QpOI&list=PLfXpdCfxjXmaZKO1cz8tk4l7rWThyCL8Z&index=3',
  videoUrl: 'https://www.youtube.com/watch?v=1NC-X91QpOI'
},
{ 
  title: 'Grade 10 biology unit 2 part 1 | plants | Characteristics of ...',
  type: 'video',
  subject: 'Biology',
  date: '',           
  downloads: '89',   
  thumbnail: 'https://img.youtube.com/vi/H9scIzPrBAs/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=H9scIzPrBAs&list=PLfXpdCfxjXmaZKO1cz8tk4l7rWThyCL8Z&index=5',
  videoUrl: 'https://www.youtube.com/watch?v=H9scIzPrBAs'
},
{ 
  title: 'Chemistry grade 10 unit 1 part 1 | Chemical reaction and stoichiometry | Chemical Equations',
  type: 'video',
  subject: 'Chemistry',
  date: '',           
  downloads: '56',     
  thumbnail: 'https://img.youtube.com/vi/98AVGjRipKg/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=98AVGjRipKg&list=PLfXpdCfxjXmaGRYZ7g9AFJFxRJzcH5oid',
  videoUrl: 'https://www.youtube.com/watch?v=98AVGjRipKg'
},
{ 
  title: 'Chemistry grade 10 unit 1 part 3 | Oxidation and Reduction',
  type: 'video',
  subject: 'Chemistry',
  date: '',          
  downloads: '45',    
  thumbnail: 'https://img.youtube.com/vi/CtElDRt5DZA/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=CtElDRt5DZA&list=PLfXpdCfxjXmaGRYZ7g9AFJFxRJzcH5oid&index=3',
  videoUrl: 'https://www.youtube.com/watch?v=CtElDRt5DZA'
},
{ 
  title: 'Chemistry grade 10 unit 1 part 9 | Types of Chemical Reactions',
  type: 'video',
  subject: 'Chemistry',
  date: '',          
  downloads: '23',   
  thumbnail: 'https://img.youtube.com/vi/EcPwU81ObRY/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=EcPwU81ObRY&list=PLfXpdCfxjXmaGRYZ7g9AFJFxRJzcH5oid&index=9',
  videoUrl: 'https://www.youtube.com/watch?v=EcPwU81ObRY'
},
{ 
  title: 'Grade 10 chemistry unit 3 part 5 | Solutions | Solubility as an Equilibrium process',
  type: 'video',
  subject: 'Chemistry',
  date: '',          
  downloads: '34',    
  thumbnail: 'https://img.youtube.com/vi/R6uhZGtBVq4/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=R6uhZGtBVq4&list=PLfXpdCfxjXmaGRYZ7g9AFJFxRJzcH5oid&index=13',
  videoUrl: 'https://www.youtube.com/watch?v=R6uhZGtBVq4'
},
{ 
  title: 'Grade 10 chemistry unit 2 part 6 | Solutions | ways of expressing the concentration of solutions',
  type: 'video',
  subject: 'Chemistry',
  date: '',         
  downloads: '34',     
  thumbnail: 'https://img.youtube.com/vi/A1308_xusMw/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=A1308_xusMw&list=PLfXpdCfxjXmaGRYZ7g9AFJFxRJzcH5oid&index=14',
  videoUrl: 'https://www.youtube.com/watch?v=A1308_xusMw'
},
{ 
  title: 'Chemistry grade 9 unit 1 part 4 | Some common chemical industries in Ethiopia',
  type: 'video',
  subject: 'Chemistry',
  date: '',         
  downloads: '89',   
  thumbnail: 'https://img.youtube.com/vi/LwTG7GDNmJg/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=LwTG7GDNmJg&list=PLfXpdCfxjXmZwwwfNAd_U6b_PMy-zBn00',
  videoUrl: 'https://www.youtube.com/watch?v=LwTG7GDNmJg'
},
{ 
  title: 'Chemistry Grade 9 unit 3 part 1 | Historical Development of Atomic Theories of matter',
  type: 'video',
  subject: 'Chemistry',
  date: '',        
  downloads: '',   
  thumbnail: 'https://img.youtube.com/vi/U4SG1FHM0WE/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=U4SG1FHM0WE&list=PLfXpdCfxjXmZwwwfNAd_U6b_PMy-zBn00&index=9',
  videoUrl: 'https://www.youtube.com/watch?v=U4SG1FHM0WE'
},
{ 
  title: 'Chemistry grade 9 unit 3 part 5 | Structure of the atom | composition of the atom and isotopes',
  type: 'video',
  subject: 'Chemistry',
  date: '',           
  downloads: '33',    
  thumbnail: 'https://img.youtube.com/vi/wVx0vkvqHls/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=wVx0vkvqHls&list=PLfXpdCfxjXmZwwwfNAd_U6b_PMy-zBn00&index=12',
  videoUrl: 'https://www.youtube.com/watch?v=wVx0vkvqHls'
},
{ 
  title: 'Mathematics Grade 9 unit 1 Part 2 | Operation on Sets', 
  type: 'video',
  subject: 'math',               
  date: '',                      
  downloads: '23',                  
  thumbnail: 'https://img.youtube.com/vi/HA_-yhh8Yx8/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=HA_-yhh8Yx8&list=PLfXpdCfxjXmZooKjB88nHk8FCjnNxSsJ6',
  videoUrl: 'https://www.youtube.com/watch?v=HA_-yhh8Yx8'
},
{ 
  title: 'Grade 9 Mathematics unit 1 part 1 | The number system | Revision on natural number and integers',
  type: 'video',
  subject: 'Mathematics',
  date: '',         
  downloads: '45',   
  thumbnail: 'https://img.youtube.com/vi/7l7BuINCktg/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=7l7BuINCktg&list=PLfXpdCfxjXmZooKjB88nHk8FCjnNxSsJ6&index=3',
  videoUrl: 'https://www.youtube.com/watch?v=7l7BuINCktg'
},
{ 
  title: 'Grade 9 mathematics unit 1 part 9 | Limit of Accuracy',
  type: 'video',
  subject: 'Mathematics',
  date: '',           
  downloads: '78',   
  thumbnail: 'https://img.youtube.com/vi/BLaIFwCsVV4/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=BLaIFwCsVV4&list=PLfXpdCfxjXmZooKjB88nHk8FCjnNxSsJ6&index=11',
  videoUrl: 'https://www.youtube.com/watch?v=BLaIFwCsVV4'
},
{ 
  title: 'Grade 9 Biology Unit 1: 1.1 Definition of Biology | GlobeDock Academy',
  type: 'video',
  subject: 'Biology',
  date: '',          
  downloads: '67',   
  thumbnail: 'https://img.youtube.com/vi/jvdG-FMTINY/hqdefault.jpg',
  category: 'videos',
  url: 'https://www.youtube.com/watch?v=jvdG-FMTINY&list=PLhXdcrTaVuV_n2ZxzahFH6qTJyB6aLYwX&index=2',
  videoUrl: 'https://www.youtube.com/watch?v=jvdG-FMTINY'
},

 
  { 
    title: 'Algebra Basics', 
    type: 'video', 
    subject: 'Maths', 
    date: '2 days ago', 
    downloads: '93',
    thumbnail: 'https://img.youtube.com/vi/NybHckSEQBI/maxresdefault.jpg',
    category: 'videos',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    videoUrl: 'https://www.youtube.com/watch?v=NybHckSEQBI&t=11s'
  },
   {
    title: 'DNA Replication',
    type: 'image',
    subject: 'Biology',
    date: '',
    downloads: '0',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/5/50/0323_DNA_Replication.jpg',
    category: 'notes',
    url: 'https://upload.wikimedia.org/wikipedia/commons/5/50/0323_DNA_Replication.jpg',
    videoUrl: ''
  },
  { 
    title: 'Algebra Basics: Solving 2-Step Equations', 
    type: 'video', 
    subject: 'Mathematics', 
    date: '2 days ago', 
    downloads: '93',
    thumbnail: 'https://img.youtube.com/vi/LDIiYKYvvdA/maxresdefault.jpg',
    category: 'videos',
    url: 'https://www.youtube.com/watch?v=LDIiYKYvvdA',
    videoUrl: 'https://www.youtube.com/watch?v=LDIiYKYvvdA'
  },
  {
    grade: '12',
    title: 'Grade 9 Mathematics Textbook (PDF)',
    type: 'pdf',
    subject: 'Mathematics – Grade 9',
    date: '2023 Curriculum',
    downloads: '2',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg',
    category: 'textbooks',
    url: 'https://selectacademy.edu.et/wp-content/uploads/2025/01/G9-Mathematics-STB-2023-web.pdf?utm_source=chatgpt.com',
    videoUrl: ''
  },
  { 
    title: '', 
    type: 'video', 
    subject: 'Mathematics', 
    date: '2 days ago', 
    downloads: '93',
    thumbnail: 'https://img.youtube.com/vi/l3XzepN03KQ/maxresdefault.jpg',
    category: 'videos',
    url: 'https://www.youtube.com/watch?v=l3XzepN03KQ',
    videoUrl: 'https://www.youtube.com/watch?v=l3XzepN03KQ'
  },
  {
    title: 'Algebra Basics: Solving Basic Equations Part 2',
    type: 'video',
    subject: 'Math / Algebra',
    date: 'YouTube',
    downloads: '12',
    thumbnail: 'https://img.youtube.com/vi/Qyd_v3DGzTM/hqdefault.jpg',
    category: 'videos',
    url: '',
    videoUrl: 'https://www.youtube.com/watch?v=Qyd_v3DGzTM'
  },
  {
    title: 'Convert Fractions to Decimals',
    type: 'video',
    subject: 'Math / Fractions & Decimals',
    date: 'YouTube',
    downloads: '23',
    thumbnail: 'https://img.youtube.com/vi/do_IbHId2Os/hqdefault.jpg',
    category: 'videos',
    url: '',
    videoUrl: 'https://www.youtube.com/watch?v=do_IbHId2Os'
  },
  {
  title: 'C4 Photosynthesis',
  type: 'image', // note: if it's SVG, it’s not really a PDF
  subject: 'Research',
  date: '1 week ago',
  downloads: '23',
  thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Figure_08_01_06.jpg',
  category: 'notes',
  url: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Figure_08_01_06.jpg',
  videoUrl: null
},
 {
    title: 'C4 Photosynthesis',
    type: 'image',
    subject: 'Research',
    date: '1 week ago',
    downloads: 23,
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/C4_photosynthesis.svg',
    category: 'notes',
    url: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/C4_photosynthesis.svg',
    videoUrl: null
  },
 {
  title: 'Simple Photosynthesis Overview',
  type: 'image', // if it’s an image, not really a PDF
  subject: 'Research',
  date: '1 week ago',
  downloads: '23',
  thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Simple_photosynthesis_overview.PNG',
  category: 'notes',
  url: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Simple_photosynthesis_overview.PNG',
  videoUrl: null
},
   {
    title: 'Prokaryotic vs eukaryotic cell',
    type: 'image',
    subject: 'Biology',
    date: '',
    downloads: '0',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Prokaryotic_vs_eukaryotic_cell.png',
    category: 'notes',
    url: 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Prokaryotic_vs_eukaryotic_cell.png',
    videoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Prokaryotic_vs_eukaryotic_cell.png'
  },
   {
    title: 'Electrolysis of Water',
    type: 'image',
    subject: 'Chemistry',
    date: '',
    downloads: '12',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Electrolysis_of_Water.png',
    category: 'notes',
    url: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Electrolysis_of_Water.png',
    videoUrl: ''
  },
  {
    title: 'Arithmetic Progression Class 10',
    type: 'video',
    subject: 'Math – Arithmetic Progression',
    date: 'YouTube',
    downloads: '34',
    thumbnail: 'https://img.youtube.com/vi/YqP5TuwtEdg/hqdefault.jpg',
    category: 'videos',
    url: '',
    videoUrl: 'https://www.youtube.com/watch?v=YqP5TuwtEdg'
  },
 
  {
    title: 'Mathematics Textbook – High School',
    type: 'pdf',
    subject: 'Mathematics – High School',
    date: 'Free High School Science Texts',
    downloads: '90',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg',
    category: 'pdfs',
    url: 'https://fhsst.nongnu.org/fhsstmaths.pdf',
    videoUrl: ''
  },
  {
    grade: '12',
    title: 'Grade 12 Biology Entrance Model Exam',
    type: 'exam',
    subject: 'Biology',
    date: '2023 GC / 2015 EC',
    downloads: '23',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg',
    category: 'exams',
    url: 'https://kehulum.com/ethio-exam/entrance-model-exams/biology-model-exam/biology-model-exam-270',
    videoUrl: ''
  },
  {
    grade: '12',
    title: 'Ethiopian Grade 12 Physics Textbook (PDF)',
    type: 'pdf',
    subject: 'Physics – Grade 12',
    date: 'EuEE Curriculum',
    downloads: '34',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg',
    category: 'textbooks',
    url: 'https://www.examgalaxy.com/books/physics/grade12physics.pdf',
    videoUrl: ''
  },
  {
    grade: '12',
    title: 'Ethiopian Grade 12 Chemistry Textbook',
    type: 'pdf',
    subject: 'Chemistry – Grade 12',
    date: 'New Curriculum',
    downloads: '33',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg',
    category: 'textbooks',
    url: 'https://www.examgalaxy.com/books/chemistry/grade12chemistry.pdf',
    videoUrl: ''
  },
  {
    grade: '12',
    title: 'Ethiopian Grade 12 Biology Textbook (PDF)',
    type: 'pdf',
    subject: 'Biology – Grade 12',
    date: 'New Curriculum (EuEE)',
    downloads: '45',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg',
    category: 'textbooks',
    url: 'https://www.examgalaxy.com/books/biology/grade12biology.pdf',
    videoUrl: ''
  },
  {
    grade: '12',
    title: 'Ethiopian Grade 12 Geography Textbook (PDF)',
    type: 'pdf',
    subject: 'Geography – Grade 12',
    date: 'New Curriculum (EuEE)',
    downloads: '78',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg',
    category: 'textbooks',
    url: 'https://www.examgalaxy.com/books/geography/grade12geography.pdf',
    videoUrl: ''
  },
  { 
    grade: '12',
    title: 'Ethiopian Grade 12 History Textbook (PDF)',
    type: 'pdf',
    subject: 'History – Grade 12',
    date: 'New Curriculum (EuEE)',
    downloads: '29',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg',
    category: 'textbooks',
    url: 'https://www.examgalaxy.com/books/history/grade12history.pdf',
    videoUrl: ''
  },
  {
    title: 'Ethiopian Grade 12 Economics Textbook (PDF)',
    type: 'pdf',
    subject: 'Economics – Grade 12',
    date: 'New Curriculum (EuEE)',
    downloads: '0',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg',
    category: 'textbooks',
    url: 'https://www.examgalaxy.com/books/economics/grade12economics.pdf',
    videoUrl: ''
  },
  {
    title: 'Ethiopian Grade 12 English Textbook (PDF)',
    type: 'pdf',
    subject: 'English – Grade 12',
    date: 'New Curriculum',
    downloads: '0',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg',
    category: 'textbooks',
    url: 'https://www.examgalaxy.com/books/english/grade12english.pdf',
    videoUrl: ''
  },
  {
    title: 'Ethiopian Grade 9 Physics Textbook (PDF)',
    type: 'pdf',
    subject: 'Physics – Grade 9',
    date: 'New Curriculum',
    downloads: '0',
    thumbnail: 'https://cdn-icons-png.flaticon.com/512/337/337946.png',
    category: 'textbooks',
    url: 'https://www.examgalaxy.com/books/physics/grade9physics.pdf',
    videoUrl: ''
  },
  {
    title: 'Ethiopian Grade 9 Biology Textbook (PDF)',
    type: 'pdf',
    subject: 'Biology – Grade 9',
    date: 'New Curriculum',
    downloads: '0',
    thumbnail: 'https://cdn-icons-png.flaticon.com/512/337/337946.png',
    category: 'textbooks',
    url: 'https://www.examgalaxy.com/books/biology/grade9biology.pdf',
    videoUrl: ''
  },
  {
    title: 'Ethiopian Grade 9 English Textbook (PDF)',
    type: 'pdf',
    subject: 'English – Grade 9',
    date: 'New Curriculum',
    downloads: '0',
    thumbnail: 'https://cdn-icons-png.flaticon.com/512/337/337946.png',
    category: 'textbooks',
    url: 'https://www.examgalaxy.com/books/english/grade9english.pdf',
    videoUrl: ''
  },
  {
    title: 'Ethiopian Grade 9 History Textbook (PDF)',
    type: 'pdf',
    subject: 'History – Grade 9',
    date: 'New Curriculum',
    downloads: '0',
    thumbnail: 'https://cdn-icons-png.flaticon.com/512/337/337946.png',
    category: 'textbooks',
    url: 'https://www.examgalaxy.com/books/history/grade9history.pdf',
    videoUrl: ''
  },
  {
    title: 'Ethiopian Grade 9 Geography Textbook (PDF)',
    type: 'pdf',
    subject: 'Geography – Grade 9',
    date: 'New Curriculum',
    downloads: '0',
    thumbnail: 'https://cdn-icons-png.flaticon.com/512/337/337946.png',
    category: 'textbooks',
    url: 'https://www.examgalaxy.com/books/geography/grade9geography.pdf',
    videoUrl: ''
  },
  {
    title: 'Ethiopian Grade 9 Economics Textbook (PDF)',
    type: 'pdf',
    subject: 'Economics – Grade 9',
    date: 'New Curriculum',
    downloads: '0',
    thumbnail: 'https://cdn-icons-png.flaticon.com/512/337/337946.png',
    category: 'textbooks',
    url: 'https://www.examgalaxy.com/books/economics/grade9economics.pdf',
    videoUrl: ''
  },
  {
    title: 'Ethiopian Grade 10 Physics Textbook (PDF)',
    type: 'pdf',
    subject: 'Physics – Grade 10',
    date: 'New Curriculum',
    downloads: '0',
    thumbnail: 'https://api.iconify.design/mdi:file-pdf-box.svg?color=%23E53E3E',
    category: 'textbooks',
    url: 'https://www.examgalaxy.com/books/physics/grade10physics.pdf',
    videoUrl: ''
  },
  {
    title: 'Ethiopian Grade 10 Chemistry Textbook (PDF)',
    type: 'pdf',
    subject: 'Chemistry – Grade 10',
    date: 'New Curriculum',
    downloads: '0',
    thumbnail: 'https://api.iconify.design/mdi:file-pdf-box.svg?color=%23E53E3E',
    category: 'textbooks',
    url: 'https://www.examgalaxy.com/books/chemistry/grade10chemistry.pdf',
    videoUrl: ''
  },
  {
    title: 'Ethiopian Grade 10 Biology Textbook (PDF)',
    type: 'pdf',
    subject: 'Biology – Grade 10',
    date: 'New Curriculum',
    downloads: '0',
    thumbnail: 'https://api.iconify.design/mdi:file-pdf-box.svg?color=%23E53E3E',
    category: 'textbooks',
    url: 'https://www.examgalaxy.com/books/biology/grade10biology.pdf',
    videoUrl: ''
  },
  {
    title: 'Ethiopian Grade 10 English Textbook (PDF)',
    type: 'pdf',
    subject: 'English – Grade 10',
    date: 'New Curriculum',
    downloads: '20',
    thumbnail: 'https://api.iconify.design/mdi:file-pdf-box.svg?color=%23E53E3E',
    category: 'textbooks',
    url: 'https://www.examgalaxy.com/books/english/grade10english.pdf',
    videoUrl: ''
  },
  {
    title: 'Ethiopian Grade 10 Economics Textbook (PDF)',
    type: 'pdf',
    subject: 'Economics – Grade 10',
    date: 'New Curriculum',
    downloads: '40',
    thumbnail: 'https://api.iconify.design/mdi:file-pdf-box.svg?color=%23E53E3E',
    category: 'textbooks',
    url: 'https://www.examgalaxy.com/books/economics/grade10economics.pdf',
    videoUrl: ''
  },
  {
    title: 'Ethiopian Grade 11 Physics Textbook (PDF)',
    type: 'pdf',
    subject: 'Physics – Grade 11',
    date: 'New Curriculum',
    downloads: '20',
    thumbnail: 'https://cdn-icons-png.flaticon.com/512/337/337932.png',
    category: 'textbooks',
    url: 'https://www.examgalaxy.com/books/physics/grade11physics.pdf',
    videoUrl: ''
  },
  {
    title: 'Ethiopian Grade 11 Chemistry Textbook (PDF)',
    type: 'pdf',
    subject: 'Chemistry – Grade 11',
    date: 'New Curriculum',
    downloads: '0',
    thumbnail: 'https://cdn-icons-png.flaticon.com/512/337/337932.png',
    category: 'textbooks',
    url: 'https://www.examgalaxy.com/books/chemistry/grade11chemistry.pdf',
    videoUrl: ''
  },
  {
    title: 'Ethiopian Grade 11 Biology Textbook (PDF)',
    type: 'pdf',
    subject: 'Biology – Grade 11',
    date: 'New Curriculum',
    downloads: '10',
    thumbnail: 'https://cdn-icons-png.flaticon.com/512/337/337932.png',
    category: 'textbooks',
    url: 'https://www.examgalaxy.com/books/biology/grade11biology.pdf',
    videoUrl: ''
  },
  {
    title: 'Ethiopian Grade 11 English Textbook (PDF)',
    type: 'pdf',
    subject: 'English – Grade 11',
    date: 'New Curriculum',
    downloads: '0',
    thumbnail: 'https://cdn-icons-png.flaticon.com/512/337/337932.png',
    category: 'textbooks',
    url: 'https://www.examgalaxy.com/books/english/grade11english.pdf',
    videoUrl: ''
  },
  {
    title: 'Ethiopian Grade 11 History Textbook (PDF)',
    type: 'pdf',
    subject: 'History – Grade 11',
    date: 'New Curriculum',
    downloads: '90',
    thumbnail: 'https://cdn-icons-png.flaticon.com/512/337/337932.png',
    category: 'textbooks',
    url: 'https://www.examgalaxy.com/books/history/grade11history.pdf',
    videoUrl: ''
  },
  {
    title: 'Ethiopian Grade 11 Geography Textbook (PDF)',
    type: 'pdf',
    subject: 'Geography – Grade 11',
    date: 'New Curriculum',
    downloads: '0',
    thumbnail: 'https://cdn-icons-png.flaticon.com/512/337/337932.png',
    category: 'textbooks',
    url: 'https://www.examgalaxy.com/books/geography/grade11geography.pdf',
    videoUrl: ''
  },
  {
    title: 'Ethiopian Grade 11 Economics Textbook (PDF)',
    type: 'pdf',
    subject: 'Economics – Grade 11',
    date: 'New Curriculum',
    downloads: '10',
    thumbnail: 'https://cdn-icons-png.flaticon.com/512/337/337932.png',
    category: 'textbooks',
    url: 'https://www.examgalaxy.com/books/economics/grade11economics.pdf',
    videoUrl: ''
  },
    {
    title: '',
    type: 'image',
    subject: '',
    date: '',
    downloads: '20',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/7/77/Body_Cavities_Lateral_view.jpg',
    category: 'notes',
    url: 'https://upload.wikimedia.org/wikipedia/commons/7/77/Body_Cavities_Lateral_view.jpg',
    videoUrl: ''
  },
   { 
      title: 'Anatomy diagram', 
      type: 'image', 
      subject: 'Biology anatomy diagram', 
      date: 'Yesterday', 
      downloads: '12',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Female_template_with_organs.svg',
      category: 'notes',
      url: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Female_template_with_organs.svg',
      videoUrl: null
    },
    { 
      title: 'My Programming Tutorial', 
      type: 'image', 
      subject: 'Computer Science', 
      date: '3 days ago', 
      downloads: '45',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/3/35/Schema_della_fotosintesi.png',
      category: 'videos',
      url: 'https://upload.wikimedia.org/wikipedia/commons/3/35/Schema_della_fotosintesi.png',
      videoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/35/Schema_della_fotosintesi.png'
    },

   {
    title: 'balancing chemical reaction',
    type: 'image',
    subject: 'Chemistry',
    date: '',
    downloads: '23',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/8/81/Combustion_of_propane_-_balancing_chemical_reaction.png',
    category: 'notes',
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/81/Combustion_of_propane_-_balancing_chemical_reaction.png',
    videoUrl: ''
  },
   {
    title: 'Polar Covalent Bonds in a Water Molecule',
    type: 'image',
    subject: 'Chemistry',
    date: '',
    downloads: '34',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/9/99/209_Polar_Covalent_Bonds_in_a_Water_Molecule.jpg',
    category: 'notes',
    url: 'https://upload.wikimedia.org/wikipedia/commons/9/99/209_Polar_Covalent_Bonds_in_a_Water_Molecule.jpg',
    videoUrl: ''
  },
   {
    title: 'Covalent bonding',
    type: 'image',
    subject: 'Chemistry',
    date: '',
    downloads: '67',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/7/78/Covalent_bonding.JPG',
    category: 'notes',
    url: 'https://upload.wikimedia.org/wikipedia/en/7/78/Covalent_bonding.JPG',
    videoUrl: ''
  },
   {
    title: 'Animal Cell and Components',
    type: 'image',
    subject: 'Animal Cell and Components',
    date: '',
    downloads: '56',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/0312_Animal_Cell_and_Components.jpg',
    category: 'notes',
    url: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/0312_Animal_Cell_and_Components.jpg',
    videoUrl: ''
  },
   {
    title: 'Animal Cell and Components',
    type: 'image',
    subject: '',
    date: '',
    downloads: '80',
    thumbnail: 'https://easy-peasy.ai/cdn-cgi/image/quality=95,format=auto,width=800/https://media.easy-peasy.ai/27feb2bb-aeb4-4a83-9fb6-8f3f2a15885e/22b0fb38-1fe2-47f8-9af1-2f872d0b9799.png',
    category: 'notes',
    url: 'https://easy-peasy.ai/cdn-cgi/image/quality=95,format=auto,width=800/https://media.easy-peasy.ai/27feb2bb-aeb4-4a83-9fb6-8f3f2a15885e/22b0fb38-1fe2-47f8-9af1-2f872d0b9799.png',
    videoUrl: ''
  },
   {
    title: 'Animal Cell and Components',
    type: 'image',
    subject: '',
    date: '',
    downloads: '78',
    thumbnail: 'https://easy-peasy.ai/cdn-cgi/image/quality=95,format=auto,width=800/https://media.easy-peasy.ai/27feb2bb-aeb4-4a83-9fb6-8f3f2a15885e/f5847001-136d-479f-ad0f-1fb364fad395.png',
    category: 'notes',
    url: 'https://easy-peasy.ai/cdn-cgi/image/quality=95,format=auto,width=800/https://media.easy-peasy.ai/27feb2bb-aeb4-4a83-9fb6-8f3f2a15885e/f5847001-136d-479f-ad0f-1fb364fad395.png',
    videoUrl: ''
  },
  
   {
    title: 'Hydraulic press',
    type: 'image',
    subject: 'Physics',
    date: '',
    downloads: '34',
    thumbnail: 'https://static.wixstatic.com/media/9282ac_d67228d57c2b4c4492482fb6079d3819~mv2.jpg/v1/fill/w_740,h_502,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/9282ac_d67228d57c2b4c4492482fb6079d3819~mv2.jpg',
    category: 'notes',
    url: 'https://static.wixstatic.com/media/9282ac_d67228d57c2b4c4492482fb6079d3819~mv2.jpg/v1/fill/w_740,h_502,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/9282ac_d67228d57c2b4c4492482fb6079d3819~mv2.jpg',
    videoUrl: 'https://static.wixstatic.com/media/9282ac_d67228d57c2b4c4492482fb6079d3819~mv2.jpg/v1/fill/w_740,h_502,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/9282ac_d67228d57c2b4c4492482fb6079d3819~mv2.jpg'
  },
   {
    title: 'Derivation of acoustic wave equation',
    type: 'image',
    subject: 'Physics',
    date: '',
    downloads: '10',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/en/5/55/Derivation_of_acoustic_wave_equation.png',
    category: 'notes',
    url: 'https://upload.wikimedia.org/wikipedia/en/5/55/Derivation_of_acoustic_wave_equation.png',
    videoUrl: ''
  },
   {
    title: 'Local wavelength',
    type: 'image',
    subject: 'Physics',
    date: '',
    downloads: '20',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Local_wavelength.JPG',
    category: 'notes',
    url: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Local_wavelength.JPG',
    videoUrl: ''
  },
    {
    title: 'Photorespiration',
    type: 'image',
    subject: 'Biology',
    date: '',
    downloads: '23',
    thumbnail: 'https://www.sciencefacts.net/wp-content/uploads/2021/08/Photorespiration.jpg',
    category: 'notes',
    url: 'https://www.sciencefacts.net/wp-content/uploads/2021/08/Photorespiration.jpg',
    videoUrl: ''
  },
   {
    title: 'Photosynthesis-Diagram',
    type: 'image',
    subject: 'Biology',
    date: '',
    downloads: '23',
    thumbnail: 'https://sciencenotes.org/wp-content/uploads/2025/11/Photosynthesis-Diagram-1024x683.png',
    category: 'notes',
    url: 'https://sciencenotes.org/wp-content/uploads/2025/11/Photosynthesis-Diagram-1024x683.png',
    videoUrl: ''
  },
   {
    title: 'Photosynthesis-Diagram',
    type: 'image',
    subject: 'Biology',
    date: '',
    downloads: '23',
    thumbnail: 'https://www.vedantu.com/seo/content-images/7ac45a3e-4403-41b1-bac1-fcc9aaad9f97_Photosynthesis_diagram.png',
    category: 'notes',
    url: 'https://www.vedantu.com/seo/content-images/7ac45a3e-4403-41b1-bac1-fcc9aaad9f97_Photosynthesis_diagram.png',
    videoUrl: ''
  },
   {
    title: 'Photosynthesis-Diagram',
    type: 'image',
    subject: 'Biology',
    date: '',
    downloads: '23',
    thumbnail: 'https://static.vecteezy.com/system/resources/previews/003/448/985/non_2x/diagram-showing-process-of-photosynthesis-in-plant-free-vector.jpg',
    category: 'notes',
    url: 'https://static.vecteezy.com/system/resources/previews/003/448/985/non_2x/diagram-showing-process-of-photosynthesis-in-plant-free-vector.jpg',
    videoUrl: ''
  },
   {
    title: 'Photosynthesis-Diagram',
    type: 'image',
    subject: 'Biology',
    date: '',
    downloads: '23',
    thumbnail: 'https://img.freepik.com/premium-vector/diagram-photosynthesis-biology-life-science-education_1639-48069.jpg',
    category: 'notes',
    url: 'https://img.freepik.com/premium-vector/diagram-photosynthesis-biology-life-science-education_1639-48069.jpg',
    videoUrl: ''
  },
 
]




  const myResources = [
    { 
      title: 'Anatomy diagram', 
      type: 'image', 
      subject: 'Biology anatomy diagram', 
      date: 'Yesterday', 
      downloads: '12',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Female_template_with_organs.svg',
      category: 'notes',
      url: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Female_template_with_organs.svg',
      videoUrl: null
    },
    { 
      title: 'My Programming Tutorial', 
      type: 'image', 
      subject: 'Computer Science', 
      date: '3 days ago', 
      downloads: '45',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/3/35/Schema_della_fotosintesi.png',
      category: 'videos',
      url: 'https://upload.wikimedia.org/wikipedia/commons/3/35/Schema_della_fotosintesi.png',
      videoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/35/Schema_della_fotosintesi.png'
    },
{
  title: 'C4 Photosynthesis',
  type: 'image', // note: if it's SVG, it’s not really a PDF
  subject: 'Research',
  date: '1 week ago',
  downloads: '23',
  thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Figure_08_01_06.jpg',
  category: 'textbooks',
  url: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Figure_08_01_06.jpg',
  videoUrl: null
},
 {
    title: 'C4 Photosynthesis',
    type: 'image',
    subject: 'Research',
    date: '1 week ago',
    downloads: 23,
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/C4_photosynthesis.svg',
    category: 'textbooks',
    url: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/C4_photosynthesis.svg',
    videoUrl: null
  },
 {
  title: 'Simple Photosynthesis Overview',
  type: 'image', // if it’s an image, not really a PDF
  subject: 'Research',
  date: '1 week ago',
  downloads: '23',
  thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Simple_photosynthesis_overview.PNG',
  category: 'textbooks',
  url: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Simple_photosynthesis_overview.PNG',
  videoUrl: null
},




  {
    title: '',
    type: 'image',
    subject: '',
    date: '',
    downloads: '0',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Carbon_uptake_and_photosynthesis_in_a_seagrass_meadow.png',
    category: 'notes',
    url: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Carbon_uptake_and_photosynthesis_in_a_seagrass_meadow.png',
    videoUrl: ''
  },
   {
    title: '',
    type: 'image',
    subject: '',
    date: '',
    downloads: '90',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Electronegative.jpg',
    category: 'notes',
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Electronegative.jpg',
    videoUrl: ''
  },
   {
    title: '',
    type: 'image',
    subject: '',
    date: '',
    downloads: '10',
    thumbnail: 'https://lab.learnbin.net/wp-content/uploads/2025/10/Aufbau-Principle-Electron-Filling-Order.jpg',
    category: 'notes',
    url: 'https://lab.learnbin.net/wp-content/uploads/2025/10/Aufbau-Principle-Electron-Filling-Order.jpg',
    videoUrl: ''
  },
 
  

  ];



  const getAllSubjects = () => {
    const subjectsSet = new Set();
    recentResources.forEach(resource => subjectsSet.add(resource.subject));
    myResources.forEach(resource => subjectsSet.add(resource.subject));
    return Array.from(subjectsSet).sort();
  };

  const allSubjects = getAllSubjects();

  const navLinks = [
    { icon: <FiHome />, label: 'Dashboard', key: 'dashboard' },
    { icon: <FaBookOpen/>, label: 'Study Portal ', key: 'studyportal' },
    { icon: <FileArchiveIcon />, label: 'Study Resource', key: 'liberay'},
    { icon: <FaBook />, label: 'Access Teacher Upload Material', key: 'teacher', },
    { icon: <FaRegAddressBook />, label: 'Sheger Digital Library', key: 'sheger'},
    { icon: <FaGraduationCap />, label: 'Start Exam', key: 'exam'},
  

  ];

  const subjectLinks = [
    { icon: <FiHash />, label: 'All Subjects', key: 'all' },
    ...allSubjects.map(subject => ({
      icon: <FiHash />,
      label: subject,
      key: subject.toLowerCase().replace(/\s+/g, '-')
    }))
  ];

  const toolLinks = [
    { icon: <FiUpload />, label: 'Upload', key: 'upload' },
    { icon: <FiSettings />, label: 'Settings', key: 'settings' }
  ];

  const filterResourcesBySubject = (resources) => {
    if (selectedSubject === 'all') {
      return resources;
    }
    return resources.filter(resource => resource.subject === selectedSubject);
  };

  const renderContent = () => {
    switch (activeSection) {



case 'teacher':
  return (
    <div className='mb-8'>
      <div className='bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden shadow-xl border border-green-100 dark:border-gray-700'>
        <div className='md:flex flex-col md:flex-row items-center'>
          {/* Mobile-first: Button at top */}
          <div className='md:hidden w-full p-6'>
            <a href='/studentgetstudy-material'>
                <button className='px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-lg flex items-center justify-center gap-3 w-full md:w-auto'>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Access Study Materials
                </button>
              </a>
          </div>
          
          {/* Mobile-first: Image at top (after button) */}
          <div className='md:w-1/2 w-full p-6 md:p-8 flex items-center justify-center bg-gradient-to-b from-green-100 to-teal-100 dark:from-green-900/20 dark:to-teal-900/20 min-h-[300px] md:min-h-[400px] order-1 md:order-2'>
            <img 
              src={pot} 
              alt="Student accessing study materials on laptop"
              className='w-full h-full object-cover rounded-xl shadow-2xl border-4 border-white dark:border-gray-800'
            />
          </div>
          
          {/* Content section */}
          <div className='md:w-1/2 w-full p-6 md:p-8 order-2 md:order-1'>
            <h2 className='text-3xl font-bold text-gray-800 dark:text-white mb-4'>
              Access Study Materials Instantly
            </h2>
            
            <div className='space-y-4 mb-6'>
              <p className='text-gray-600 dark:text-gray-300 text-lg'>
                As a student, you get immediate access to assignments, homework, PDFs, images, and videos 
                <span className="font-semibold text-green-600 dark:text-green-400"> as soon as your teacher uploads them</span>. 
                Never miss important study materials with real-time updates and notifications.
              </p>
              
              <p className='text-gray-600 dark:text-gray-300 text-lg'>
                When your teacher uploads new materials, <span className="font-semibold text-green-600 dark:text-green-400">you'll instantly have access</span> 
                to view, download, and engage with the content. Every student in your class receives the same 
                high-quality materials simultaneously, ensuring equal learning opportunities for everyone.
              </p>
              
              <p className='text-gray-600 dark:text-gray-300 text-lg'>
                Access math worksheets, science project briefs, history video lectures, and more - all organized 
                by subject and date. Find what you need quickly with our intuitive search and filter system.
              </p>
              
              <p className='text-gray-600 dark:text-gray-300 text-lg'>
                Submit assignments directly through the platform, track your progress, and stay organized 
                with all your study materials in one convenient location. Focus on learning while we handle 
                the accessibility.
              </p>
              
              <div className='bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800 mt-6'>
                <h3 className='font-bold text-green-800 dark:text-green-300 mb-2 flex items-center gap-2'>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  Real-time Updates
                </h3>
                <p className='text-green-700 dark:text-green-400 text-sm'>
                  Get notified immediately when new study materials are uploaded by your teacher
                </p>
              </div>
            </div> 
            
            {/* Desktop button (hidden on mobile) */}
            <div className='mt-8 hidden md:block'>
              <a href='/studentgetstudy-material'>
                <button className='px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-lg flex items-center justify-center gap-3 w-full md:w-auto'>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Access Study Materials
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )



  
case 'liberay':
  return (
    <div className='mb-8'>
      {/* Main Container with Glass Effect */}
      <div className='relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl md:rounded-3xl overflow-hidden shadow-xl md:shadow-2xl border border-white/20 dark:border-gray-700/30'>
        
        {/* Premium Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${anim16})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-emerald-500/10 dark:from-gray-900/90 dark:via-gray-900/85 dark:to-gray-900/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-white/20 dark:from-gray-900/50 dark:via-transparent dark:to-gray-900/70" />
        </div>

        {/* Content */}
        <div className='relative z-10'>
          {/* Header Section */}
          <div className='p-6 md:p-10'>
            <div className='max-w-4xl'>
              <span className='inline-block px-4 py-2 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-semibold mb-4 border border-blue-200/30 dark:border-blue-500/20'>
                📚 Tulu Dimtu Secondary School
              </span>
              
              <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6 leading-tight'>
                Your Gateway to
                <span className='block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400'> Academic Excellence</span>
              </h1>
              
              <p className='text-base md:text-lg lg:text-xl text-gray-700 dark:text-gray-300 mb-6 md:mb-8 leading-relaxed'>
                Access a comprehensive collection of premium educational resources designed to elevate your learning journey and just you can access any material related with coding. Improve your educational status
              </p>
              
              <div className='bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 md:p-6 mb-6 backdrop-blur-sm border border-gray-200/30 dark:border-gray-700/30'>
                <div className='grid grid-cols-2 gap-3 md:gap-4'>
                  <div className='flex items-center'>
                    <div className='w-2 h-2 rounded-full bg-blue-500 mr-2 md:mr-3'></div>
                    <span className='text-sm md:text-base text-gray-700 dark:text-gray-300'>Grade 12 Entrance Exams</span>
                  </div>
                  <div className='flex items-center'>
                    <div className='w-2 h-2 rounded-full bg-purple-500 mr-2 md:mr-3'></div>
                    <span className='text-sm md:text-base text-gray-700 dark:text-gray-300'>Video Tutorials</span>
                  </div>
                  <div className='flex items-center'>
                    <div className='w-2 h-2 rounded-full bg-emerald-500 mr-2 md:mr-3'></div>
                    <span className='text-sm md:text-base text-gray-700 dark:text-gray-300'>Coding Resources</span>
                  </div>
                  <div className='flex items-center'>
                    <div className='w-2 h-2 rounded-full bg-orange-500 mr-2 md:mr-3'></div>
                    <span className='text-sm md:text-base text-gray-700 dark:text-gray-300'>PDF Guides</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Resource Grid - Mobile Optimized */}
          <div className='px-4 md:px-6 lg:px-10 pb-6 md:pb-10'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8'>


           
           
           
           
              <div className='group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/95 to-purple-50/95 dark:from-gray-800/95 dark:to-gray-900/95 backdrop-blur-sm border border-white/40 dark:border-gray-700/40 shadow-lg hover:shadow-xl md:hover:shadow-2xl transition-all duration-500 hover:-translate-y-1'>
  <div className='absolute inset-0'>
    <div 
      className='absolute inset-0 opacity-5 group-hover:opacity-20 transition-opacity duration-500'
      style={{
        backgroundImage: `url(${anim16})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    />
  </div>
  
  <div className='relative p-5 md:p-6 lg:p-8'>
    <div className='flex items-start justify-between mb-4 md:mb-6'>
      <div className='flex-1'>
        <span className='inline-block px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs md:text-sm font-medium border border-purple-200/50 dark:border-purple-700/30'>
          Student Portal
        </span>
        <h3 className='text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-3 md:mt-4 mb-2 md:mb-3'>
          Tulu Dimtu Student Access
        </h3>
      </div>
      
    </div>
    
   <p className='text-sm md:text-base text-gray-700 dark:text-gray-300 mb-4 md:mb-6 leading-relaxed'>
  Exclusive learning platform for Tullu Dimtu students, offering seamless access to course materials, assignments, announcements, and digital resources. Stay organized, track your progress, and learn smarter through one secure and easy-to-use dashboard.
</p>

    
    <div className='flex items-center space-x-3 md:space-x-4 mb-4'>
      <div className='flex-1 text-center p-2 md:p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-200/30 dark:border-gray-700/30'>
        <div className='text-lg md:text-2xl font-bold text-purple-600 dark:text-purple-400'>24/7</div>
        <div className='text-xs md:text-sm text-gray-600 dark:text-gray-400'>Access</div>
      </div>
      <div className='flex-1 text-center p-2 md:p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-200/30 dark:border-gray-700/30'>
        <div className='text-lg md:text-2xl font-bold text-purple-600 dark:text-purple-400'>Secure</div>
        <div className='text-xs md:text-sm text-gray-600 dark:text-gray-400'>Portal</div>
      </div>
    </div>
    
    <div className='mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200/50 dark:border-gray-700/50'>
      <a href='/youtube-titorial'>
        <button className='w-full py-3 px-4 md:px-6 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold text-sm md:text-base transition-all duration-300 active:scale-95'>
          Access Student Portal
        </button>
      </a>
    </div>
  </div>
</div>
              
              {/* Exam Resources Card */}
              <div className='group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/95 to-blue-50/95 dark:from-gray-800/95 dark:to-gray-900/95 backdrop-blur-sm border border-white/40 dark:border-gray-700/40 shadow-lg hover:shadow-xl md:hover:shadow-2xl transition-all duration-500 hover:-translate-y-1'>
                <div className='absolute inset-0'>
                  <div 
                    className='absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500'
                    style={{
                      backgroundImage: `url(${anim12})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />
                </div>
                
                <div className='relative p-5 md:p-6 lg:p-8'>
                  <div className='flex items-start justify-between mb-4 md:mb-6'>
                    <div className='flex-1'>
                      <span className='inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs md:text-sm font-medium border border-blue-200/50 dark:border-blue-700/30'>
                        Exam Preparation
                      </span>
                      <h3 className='text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-3 md:mt-4 mb-2 md:mb-3'>
                        Entrance Exam Preparation 
                      </h3>
                    </div>
                 
                  </div>
                  
                 <p className='text-sm md:text-base text-gray-700 dark:text-gray-300 mb-4 md:mb-6 leading-relaxed'>
  Access 2006 years of curated past papers, interactive video lessons, digital textbooks, and mock exams designed specifically for Tullu Dimtu School students to enhance learning, improve exam performance, and prepare confidently for national and entrance examinations.
</p>
    <div className='flex items-center space-x-3 md:space-x-4 mb-4'>
      <div className='flex-1 text-center p-2 md:p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-200/30 dark:border-gray-700/30'>
        <div className='text-lg md:text-2xl font-bold text-purple-600 dark:text-purple-400'>24/7</div>
        <div className='text-xs md:text-sm text-gray-600 dark:text-gray-400'>Access</div>
      </div>
      <div className='flex-1 text-center p-2 md:p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-200/30 dark:border-gray-700/30'>
        <div className='text-lg md:text-2xl font-bold text-purple-600 dark:text-purple-400'>Secure</div>
        <div className='text-xs md:text-sm text-gray-600 dark:text-gray-400'>Portal</div>
      </div>
    </div>
                  
                
                  
                  <div className='mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200/50 dark:border-gray-700/50'>
                    <a href='/youtube-titorial'>
                      <button className='w-full py-3 px-4 md:px-6 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold text-sm md:text-base transition-all duration-300 active:scale-95'>
                      Start Exam Prep
                    </button>
                    </a>
                  </div>
                </div>
              </div>

              {/* Coding & Development Card */}
              <div className='group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/95 to-emerald-50/95 dark:from-gray-800/95 dark:to-gray-900/95 backdrop-blur-sm border border-white/40 dark:border-gray-700/40 shadow-lg hover:shadow-xl md:hover:shadow-2xl transition-all duration-500 hover:-translate-y-1'>
                <div className='absolute inset-0'>
                  <div 
                    className='absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500'
                    style={{
                      backgroundImage: 'url("https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80")',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />
                </div>
                
                <div className='relative p-5 md:p-6 lg:p-8'>
                  <div className='flex items-start justify-between mb-4 md:mb-6'>
                    <div className='flex-1'>
                      <span className='inline-block px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs md:text-sm font-medium border border-emerald-200/50 dark:border-emerald-700/30'>
                        Tech Learning
                      </span>
                      <h3 className='text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-3 md:mt-4 mb-2 md:mb-3'>
                        Code & Create
                      </h3>
                    </div>
                    
                  </div>

                  
                 <p className='text-sm md:text-base text-gray-700 dark:text-gray-300 mb-4 md:mb-6 leading-relaxed'>
  Learn the fundamentals of coding and programming languages designed especially for Tullu Dimtu School students. Build problem-solving skills, understand modern technology, and start your journey into the world of software development.
</p>

                  
                 
                  
                  <div className='mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200/50 dark:border-gray-700/50'>
                   <a href='/youtube-titorial'>
                     <button className='w-full py-3 px-4 md:px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold text-sm md:text-base transition-all duration-300 active:scale-95'>
                      Start Coding
                    </button>
                   </a>
                  </div>
                </div>
              </div>




              {/* PDF & Study Material Card */}
              <div className='group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/95 to-orange-50/95 dark:from-gray-800/95 dark:to-gray-900/95 backdrop-blur-sm border border-white/40 dark:border-gray-700/40 shadow-lg hover:shadow-xl md:hover:shadow-2xl transition-all duration-500 hover:-translate-y-1'>
                <div className='absolute inset-0'>
                  <div 
                    className='absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500'
                    style={{
                      backgroundImage: 'url("https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80")',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />
                </div>



                
                <div className='relative p-5 md:p-6 lg:p-8'>
                  <div className='flex items-start justify-between mb-4 md:mb-6'>
                    <div className='flex-1'>
                      <span className='inline-block px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs md:text-sm font-medium border border-orange-200/50 dark:border-orange-700/30'>
                        Study Resources
                      </span>
                      <h3 className='text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-3 md:mt-4 mb-2 md:mb-3'>
                        Digital Study Materials
                      </h3>
                    </div>
                    <div className='w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ml-4'>
                      <span className='text-white font-bold text-sm md:text-base'>PDF</span>
                    </div>
                  </div>
                  
                 <p className='text-sm md:text-base text-gray-700 dark:text-gray-300 mb-4 md:mb-6 leading-relaxed'>
  Download comprehensive study guides, digital textbooks, and research materials carefully designed to support effective learning, exam preparation, and academic success for Tullu Dimtu School students.
</p>

                  
                 
                  
                  <div className='mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200/50 dark:border-gray-700/50'>
                   <a href='/studentgetstudy-material'>
                     <button className='w-full py-3 px-4 md:px-6 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-sm md:text-base transition-all duration-300 active:scale-95'>
                      Access Materials
                    </button>
                   </a>
                  </div>
                </div>
              </div>

            </div>

            {/* Features Banner - Mobile Optimized */}
            <div className='mt-8 md:mt-12 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-emerald-500/10 dark:from-blue-500/5 dark:via-purple-500/5 dark:to-emerald-500/5 rounded-xl md:rounded-2xl p-5 md:p-8 border border-white/30 dark:border-gray-700/30 backdrop-blur-sm'>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8 text-center'>
                <div className='p-3 md:p-4'>
                  <div className='text-xl md:text-2xl lg:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1 md:mb-2'>24/7</div>
                  <div className='text-xs md:text-sm text-gray-700 dark:text-gray-300 font-medium'>Unlimited Access</div>
                </div>
                <div className='p-3 md:p-4'>
                  <div className='text-xl md:text-2xl lg:text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1 md:mb-2'>100%</div>
                  <div className='text-xs md:text-sm text-gray-700 dark:text-gray-300 font-medium'>Premium Content</div>
                </div>
                <div className='p-3 md:p-4'>
                  <div className='text-xl md:text-2xl lg:text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1 md:mb-2'>100+</div>
                  <div className='text-xs md:text-sm text-gray-700 dark:text-gray-300 font-medium'>Resources</div>
                </div>
                <div className='p-3 md:p-4'>
                  <div className='text-xl md:text-2xl lg:text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1 md:mb-2'>∞</div>
                  <div className='text-xs md:text-sm text-gray-700 dark:text-gray-300 font-medium'>Learning Paths</div>
                </div>
              </div>
            </div>

            {/* Mobile-Only Quick Access Buttons */}
            <div className='md:hidden mt-6 space-y-3'>
              <div className='flex items-center justify-center space-x-3'>
                <button className='flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold text-sm transition-all duration-300 active:scale-95'>
                  Quick Search
                </button>
                <button className='flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-gray-700 to-gray-800 dark:from-gray-600 dark:to-gray-700 text-white font-semibold text-sm transition-all duration-300 active:scale-95'>
                  View All
                </button>
              </div>
              
              <div className='text-center pt-4 border-t border-gray-200/50 dark:border-gray-700/50'>
                <p className='text-xs text-gray-600 dark:text-gray-400'>
                  Swipe horizontally to see more resources • All materials available offline
                </p>
              </div>
            </div>

            {/* Tablet & Desktop Additional Info */}
            <div className='hidden md:block mt-8 text-center'>
              <div className='inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400'>
                <div className='w-2 h-2 rounded-full bg-green-500 animate-pulse'></div>
                <span className='text-sm'>All resources available for download • Updated weekly</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )



  case 'sheger':
  return (
    <div className='relative min-h-screen overflow-hidden'>
      {/* Animated Particle Background */}
      <div className='absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950'>
        {/* Animated Grid */}
        <div className='absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]'></div>
        
        {/* Floating Particles */}
        <div className='absolute inset-0'>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className='absolute rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20'
              style={{
                width: `${Math.random() * 30 + 10}px`,
                height: `${Math.random() * 30 + 10}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 20 + 20}s infinite linear`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>

        {/* Animated Orbs */}
        <div className='absolute top-1/4 -left-20 w-96 h-96 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 rounded-full blur-3xl animate-orb-float'></div>
        <div className='absolute bottom-1/4 -right-20 w-96 h-96 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full blur-3xl animate-orb-float animation-delay-3000'></div>
      </div>

      <div className='relative z-10 max-w-7xl mx-auto px-4 py-12'>
        {/* Header with Animated Typography */}
        <div className='text-center mb-16'>
          <div className='inline-block mb-6'>
            <div className='relative'>
              {/* Logo Container */}
              <div className='absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-50'></div>
              <div className='relative bg-gradient-to-br from-gray-900 to-slate-900 p-8 rounded-xl border border-gray-800 shadow-2xl'>
                <div className='flex items-center justify-center space-x-8'>
                  {/* School Logo */}

                   
                 <div className='relative group'>
  <div className='absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000'></div>
  
  <div className='relative w-24 h-24 rounded-full bg-white flex items-center justify-center border border-gray-800'>
    <img 
      src={sheger}
      className='w-16 h-16 object-contain'
    />
  </div>
</div>

                  
                  {/* Divider */}
                  <div className='h-16 w-px bg-gradient-to-b from-transparent via-gray-700 to-transparent'></div>
                  
                  {/* Library Logo */}
                 <div className='relative group'>
  <div className='absolute -inset-1  group-hover:opacity-100 transition duration-1000'></div>

  <div className='relative w-24 h-24 rounded-full bg-white flex items-center justify-center border border-gray-800'>
    <img 
      src={logo}
      className='w-28 h-28 object-contain'
    />
  </div>
</div>

                </div>
              </div>
            </div>
          </div>
         
          <h1 className='text-5xl md:text-7xl font-bold mb-6'>
            <span className='bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent animate-gradient-x'>
              Sheger Digital Library
            </span>
          </h1>
          
          <div className='max-w-3xl mx-auto'>
            <p className='text-xl text-gray-300 mb-4 leading-relaxed'>
              Exclusive Digital Knowledge Platform for Tuludimtu School
            </p>
            
            {/* ADDED PARAGRAPH - Tullu Dimtu School Access */}
            <div className='mb-8 p-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-2xl border border-blue-800/30 border-purple-800/30'>
              <p className='text-lg text-gray-200 leading-relaxed'>
                All Tullu Dimtu School students now have exclusive access to the Sheger Digital Library. 
                This privileged access provides every student with unlimited digital resources, premium learning materials, 
                and cutting-edge educational tools to enhance their academic journey and achieve excellence.
              </p>
            </div>
            
            <div className='h-1 w-32 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full mb-8'></div>

            <a href='http://196.188.63.62:3002/' target=''>  

        <button className='relative px-10 py-4 bg-gradient-to-br from-gray-900 to-slate-900 rounded-full text-white font-bold text-lg tracking-wide shadow-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-blue-500/25 group justify-between '>
  {/* Animated gradient border */}
  <div className='absolute -inset-[2px] bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full opacity-80 animate-spin-slow'></div>
  
  {/* Glowing outer effect */}
  <div className='absolute -inset-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full blur-xl opacity-30 group-hover:opacity-50 animate-pulse-glow transition-opacity duration-500'></div>
  
  {/* Shimmer background */}
  <div className='absolute inset-0 bg-gradient-to-r from-blue-600/0 via-purple-600/20 to-pink-600/0 group-hover:via-purple-600/40 transition-all duration-500 animate-shimmer'></div>
  
  {/* Ripple shine effect */}
  <div className='absolute -inset-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 animate-shine'></div>
  
  {/* Button text with gradient */}
  <span className='relative bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent font-bold text-xl'>
    Access Digital Library
  </span>
  
  {/* Animated dot */}
  <div className='absolute right-6 w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full animate-ping '></div>
  
  {/* Floating particles */}
  <div className='absolute inset-0'>
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className='absolute w-1 h-1 bg-white rounded-full'
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `particle-float ${Math.random() * 2 + 1}s infinite`,
          animationDelay: `${Math.random() * 1}s`,
          opacity: 0
        }}
      />
    ))}
  </div>

  <style jsx>{`
    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes pulse-glow {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 0.5; }
    }
    @keyframes shimmer {
      0% { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes shine {
      0% { transform: translateX(-100%) rotate(45deg); }
      100% { transform: translateX(200%) rotate(45deg); }
    }
    @keyframes particle-float {
      0% { transform: translateY(0) scale(0); opacity: 0; }
      50% { opacity: 1; transform: translateY(-10px) scale(1); }
      100% { transform: translateY(-20px) scale(0); opacity: 0; }
    }
    @keyframes ping {
      75%, 100% {
        transform: scale(2);
        opacity: 0;
      }
    }
    .animate-spin-slow {
      animation: spin-slow 8s linear infinite;
    }
    .animate-pulse-glow {
      animation: pulse-glow 2s ease-in-out infinite;
    }
    .animate-shimmer {
      background-size: 200% auto;
      animation: shimmer 3s linear infinite;
    }
    .animate-shine {
      animation: shine 1.5s ease-in-out infinite;
    }
    .animate-ping {
      animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  `}</style>
</button>

            </a>
          </div>

          
        </div>



        {/* Main Content Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16'>
          {/* Hero Image Card */}
          <div className='relative group'>
            <div className='absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition duration-500'></div>
            <div className='relative h-full rounded-2xl overflow-hidden border border-gray-800 bg-gradient-to-br from-gray-900 to-slate-900 shadow-2xl'>
              <div className='relative h-80 overflow-hidden'>
                <img 
                  src={sheger2}
                  alt='Modern Digital Library Interface'
                  className='w-full h-full object-cover transform group-hover:scale-105 transition duration-700'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent'></div>
                <div className='absolute bottom-0 left-0 right-0 p-6'>
                  <span className='inline-block px-4 py-2 bg-gradient-to-r from-blue-600/80 to-purple-600/80 backdrop-blur-sm rounded-full text-sm font-medium'>
                    Interactive Learning Environment
                  </span>
                </div>
              </div>
              
              <div className='p-8'>
                <h3 className='text-2xl font-bold text-white mb-4'>
                  Immersive Digital Experience
                </h3>
                <p className='text-gray-400 leading-relaxed'>
                  Step into a cutting-edge virtual library designed specifically for Tuludimtu School students. 
                  Experience seamless navigation through thousands of academic resources with an interface that 
                  adapts to your learning style and preferences.
                </p>
                
                <div className='mt-6 pt-6 mb-6 border-t border-gray-800'>
                  <div className='flex items-center space-x-4'>
                    <div className='flex-1'>
                      <div className='text-sm text-gray-500 mb-1'>Resources Available</div>
                      <div className='text-2xl font-bold text-white'>10,000+</div>
                    </div>
                    <div className='h-10 w-px bg-gray-800'></div>
                    <div className='flex-1'>
                      <div className='text-sm text-gray-500 mb-1'>Active Users</div>
                      <div className='text-2xl font-bold text-white'>5,000+</div>
                    </div>
                    
                  </div>

                  
                </div>

                
              </div>

              <a href='http://196.188.63.62:3002/'>
               <button className='relative px-10 py-4  bg-gradient-to-br from-gray-900 to-slate-900 rounded-full text-white font-bold text-lg tracking-wide shadow-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-blue-500/25 group justify-between '>
  {/* Animated gradient border */}
  <div className='absolute -inset-[2px] bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full opacity-80 animate-spin-slow'></div>
  
  {/* Glowing outer effect */}
  <div className='absolute -inset-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full blur-xl opacity-30 group-hover:opacity-50 animate-pulse-glow transition-opacity duration-500'></div>
  
  {/* Shimmer background */}
  <div className='absolute inset-0 bg-gradient-to-r from-blue-600/0 via-purple-600/20 to-pink-600/0 group-hover:via-purple-600/40 transition-all duration-500 animate-shimmer'></div>
  
  {/* Ripple shine effect */}
  <div className='absolute -inset-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 animate-shine'></div>
  
  {/* Button text with gradient */}
  <span className='relative bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent font-bold text-xl'>
    Access Digital Library
  </span>
  
  {/* Animated dot */}
  <div className='absolute right-6 w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full animate-ping '></div>
  
  {/* Floating particles */}
  <div className='absolute inset-0'>
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className='absolute w-1 h-1 bg-white rounded-full'
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `particle-float ${Math.random() * 2 + 1}s infinite`,
          animationDelay: `${Math.random() * 1}s`,
          opacity: 0
        }}
      />
    ))}
  </div>

  <style jsx>{`
    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes pulse-glow {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 0.5; }
    }
    @keyframes shimmer {
      0% { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes shine {
      0% { transform: translateX(-100%) rotate(45deg); }
      100% { transform: translateX(200%) rotate(45deg); }
    }
    @keyframes particle-float {
      0% { transform: translateY(0) scale(0); opacity: 0; }
      50% { opacity: 1; transform: translateY(-10px) scale(1); }
      100% { transform: translateY(-20px) scale(0); opacity: 0; }
    }
    @keyframes ping {
      75%, 100% {
        transform: scale(2);
        opacity: 0;
      }
    }
    .animate-spin-slow {
      animation: spin-slow 8s linear infinite;
    }
    .animate-pulse-glow {
      animation: pulse-glow 2s ease-in-out infinite;
    }
    .animate-shimmer {
      background-size: 200% auto;
      animation: shimmer 3s linear infinite;
    }
    .animate-shine {
      animation: shine 1.5s ease-in-out infinite;
    }
    .animate-ping {
      animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  `}</style>
</button>
              </a>

            </div>

            
          </div>

          {/* Library Description Card */}
          <div className='relative group'>
            <div className='absolute -inset-1 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition duration-500'></div>
            <div className='relative h-full rounded-2xl p-8 border border-gray-800 bg-gradient-to-br from-gray-900 to-slate-900 shadow-2xl'>
              <h2 className='text-3xl font-bold text-white mb-6'>
                About Sheger Digital Library
              </h2>
              
              <div className='space-y-6'>
                <div className='relative pl-6'>
                  <div className='absolute left-0 top-2 w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full'></div>
                  <p className='text-gray-300 leading-relaxed'>
                    Sheger Digital Library represents Ethiopia's most advanced educational technology initiative, 
                    providing for tuludimtu School students with unprecedented access to global knowledge resources. 
                    This platform bridges traditional education with digital innovation.
                  </p>
                </div>
                
                <div className='relative pl-6'>
                  <div className='absolute left-0 top-2 w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-400 rounded-full'></div>
                  <p className='text-gray-300 leading-relaxed'>
                    With intelligent content curation and personalized learning pathways, the library adapts to 
                    individual academic needs while maintaining alignment with Ethiopia's national curriculum 
                    standards and Fuludimtu School's educational philosophy.
                  </p>
                </div>
                
                <div className='relative pl-6'>
                  <div className='absolute left-0 top-2 w-2 h-2 bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full'></div>
                  <p className='text-gray-300 leading-relaxed'>
                    The platform features advanced search capabilities, collaborative tools, and progress tracking 
                    systems that empower students to take control of their learning journey and achieve academic 
                    excellence.
                  </p>
                </div>
              </div>
              
              {/* ADDED PARAGRAPH - Tullu Dimtu School Access */}
              <div className='mt-8 p-6 bg-gradient-to-r from-gray-800/40 to-slate-800/40 rounded-xl border border-gray-700'>
                <p className='text-gray-200 leading-relaxed'>
                  All Tullu Dimtu School students are granted full access to the Sheger Digital Library, 
                  enabling them to leverage these advanced features and resources for their academic success 
                  and personal growth.
                </p>
              </div>
              
              {/* Features Grid */}
              <div className='mt-10 grid grid-cols-2 gap-4'>
                <div className='bg-gradient-to-br from-gray-800/50 to-slate-800/50 p-4 rounded-xl border border-gray-800'>
                  <div className='text-sm text-gray-400 mb-1'>Available Formats</div>
                  <div className='text-lg font-semibold text-white'>PDF, Video, Audio</div>
                </div>
                <div className='bg-gradient-to-br from-gray-800/50 to-slate-800/50 p-4 rounded-xl border border-gray-800'>
                  <div className='text-sm text-gray-400 mb-1'>Access Period</div>
                  <div className='text-lg font-semibold text-white'>24/7</div>
                </div>
              </div>
            </div>
          </div>


        </div>

        {/* Features Section with Card Images */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-16'>
          {/* Feature 1 */}
          <div className='relative group'>
            <div className='absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500'></div>
            <div className='relative rounded-xl overflow-hidden border border-gray-800 bg-gradient-to-b from-gray-900 to-slate-900'>
              <div className='h-48 overflow-hidden'>
                <img 
                  src={sheg}
                  alt='Curriculum Resources'
                  className='w-full h-full object-cover transform group-hover:scale-110 transition duration-700'
                />
              </div>
              <div className='p-6'>
                <h3 className='text-xl font-bold text-white mb-3'>
                  Comprehensive Curriculum
                </h3>
                <p className='text-gray-400 text-sm leading-relaxed'>
                  Fully aligned with Fuludimtu School's academic program, featuring interactive textbooks, 
                  lesson plans, and supplementary materials curated by education experts.
                </p>
                
                {/* ADDED PARAGRAPH - Tullu Dimtu School Access */}
                <div className='mt-4 pt-4 border-t border-gray-800'>
                  <p className='text-sm text-blue-300'>
                    Available to all Tullu Dimtu School students as part of their academic resources.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className='relative group'>
            <div className='absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500'></div>
            <div className='relative rounded-xl overflow-hidden border border-gray-800 bg-gradient-to-b from-gray-900 to-slate-900'>
              <div className='h-48 overflow-hidden'>
                <img 
                  src={bg}
                  alt='Interactive Learning'
                  className='w-full h-full object-cover transform group-hover:scale-110 transition duration-700'
                />
              </div>
              <div className='p-6'>
                <h3 className='text-xl font-bold text-white mb-3'>
                  Interactive Modules
                </h3>
                <p className='text-gray-400 text-sm leading-relaxed'>
                  Engaging learning experiences with interactive quizzes, virtual labs, and multimedia content 
                  that transform complex concepts into understandable knowledge.
                </p>
                
                {/* ADDED PARAGRAPH - Tullu Dimtu School Access */}
                <div className='mt-4 pt-4 border-t border-gray-800'>
                  <p className='text-sm text-purple-300'>
                    Exclusive interactive access granted to Tullu Dimtu School students.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className='relative group'>
            <div className='absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-blue-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500'></div>
            <div className='relative rounded-xl overflow-hidden border border-gray-800 bg-gradient-to-b from-gray-900 to-slate-900'>
              <div className='h-48 overflow-hidden'>
                <img 
                  src={bg1}
                  alt='Analytics Dashboard'
                  className='w-full h-full object-cover transform group-hover:scale-110 transition duration-700'
                />
              </div>
              <div className='p-6'>
                <h3 className='text-xl font-bold text-white mb-3'>
                  Performance Analytics
                </h3>
                <p className='text-gray-400 text-sm leading-relaxed'>
                  Advanced tracking system providing detailed insights into learning progress, knowledge gaps, 
                  and personalized improvement recommendations.
                </p>
                
                {/* ADDED PARAGRAPH - Tullu Dimtu School Access */}
                <div className='mt-4 pt-4 border-t border-gray-800'>
                  <p className='text-sm text-cyan-300'>
                    Premium analytics feature accessible to all Tullu Dimtu School students.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className='relative mb-16'>
          <div className='text-center mb-12'>
            <h2 className='text-4xl font-bold text-white mb-4'>
              Get Started in Minutes
            </h2>
            <p className='text-gray-400 text-lg'>
              Simple steps to unlock the world of digital knowledge
            </p>
          </div>

          <div className='relative'>
            {/* Connecting Line */}
            <div className='absolute left-8 right-8 top-8 h-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 md:block hidden'></div>
            
            <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
              {[
                {
                  step: '01',
                  title: 'Register',
                  desc: 'Use your Fuludimtu School credentials',
                  color: 'from-blue-600 to-cyan-500'
                },
                {
                  step: '02',
                  title: 'Verify',
                  desc: 'Confirm your student status via email',
                  color: 'from-cyan-600 to-purple-500'
                },
                {
                  step: '03',
                  title: 'Explore',
                  desc: 'Browse curated collections and subjects',
                  color: 'from-purple-600 to-pink-500'
                },
                {
                  step: '04',
                  title: 'Learn',
                  desc: 'Access resources and track progress',
                  color: 'from-pink-600 to-rose-500'
                }
              ].map((item, index) => (
                <div key={index} className='relative group'>
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${item.color} rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500`}></div>
                  <div className='relative bg-gradient-to-br from-gray-900 to-slate-900 rounded-xl p-6 border border-gray-800 text-center'>
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${item.color} text-white text-2xl font-bold mb-4`}>
                      {item.step}
                    </div>
                    <h3 className='text-xl font-bold text-white mb-2'>{item.title}</h3>
                    <p className='text-gray-400 text-sm'>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* ADDED PARAGRAPH - Tullu Dimtu School Access */}
          <div className='mt-12 p-8 bg-gradient-to-r from-gray-900/60 to-slate-900/60 rounded-2xl border border-gray-800'>
            <p className='text-center text-lg text-gray-200 leading-relaxed'>
              All Tullu Dimtu School students can complete these simple steps to gain full access to the Sheger Digital Library. 
              This exclusive access is part of our commitment to providing Tullu Dimtu students with the best digital learning 
              resources available in Ethiopia.
            </p>
          </div>
        </div>

        {/* Testimonial Section */}
        <div className='relative group'>
          <div className='absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition duration-500'></div>
          <div className='relative rounded-2xl overflow-hidden border border-gray-800 bg-gradient-to-br from-gray-900 to-slate-900 p-8'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-center'>
              <div>
                 <img 
                  src={sheger2}
                  alt='Modern Digital Library Interface'
                  className='w-full h-full object-cover transform group-hover:scale-105 transition duration-700'
                />
              </div>
              <div>
                <blockquote className='text-2xl text-white font-light mb-6 leading-relaxed'>
                  "The Sheger Digital Library transformed how I approach learning. The resources helped me achieve top marks in national exams."
                </blockquote>
                <div>
                  <div className='text-lg font-semibold text-white'>Melat and Nuhamin</div>
                  <div className='text-gray-400'>Tuludimtu School Student</div>
                  <div className='mt-4 flex space-x-1'>
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className='w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full'></div>
                    ))}
                  </div>
                </div>
                
                {/* ADDED PARAGRAPH - Tullu Dimtu School Access */}
                <div className='mt-8 pt-8 border-t border-gray-800'>
                  <p className='text-gray-300'>
                    "As a Tullu Dimtu School student, having access to this library gave me an incredible advantage 
                    in my studies. Every student should make the most of this opportunity."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes orb-float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(50px, -30px) scale(1.1); }
          50% { transform: translate(20px, 40px) scale(0.9); }
          75% { transform: translate(-30px, -20px) scale(1.05); }
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
        .animate-orb-float {
          animation: orb-float 15s ease-in-out infinite;
        }
        .animate-gradient-x {
          background-size: 200% auto;
          animation: gradient-x 3s ease infinite;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
      `}</style>
    </div>
  )



  


   case 'studyportal':
     return(
     <div className='mb-8'>
  <h2 className='text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center'>Start <span className='text-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#581c87]'>Study </span></h2>
     <p className="max-w-3xl mx-auto text-center text-lg md:text-xl leading-relaxed text-gray-600 dark:text-gray-300">
  Choose your grade and start studying. Learn with{" "}
  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-semibold">
    clear lessons
  </span>
  ,{" "}
  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-semibold">
    structured notes
  </span>
  , and{" "}
  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-semibold">
    trusted materials
  </span>{" "}
  that make studying easier, faster, and more effective.
</p>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 shadow-xl">

    <a href='/student-note9'>
      <button className="group relative overflow-hidden px-8 py-6 w-full rounded-xl bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#581c87] text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
      <div className="flex items-center justify-center gap-3">
        <span>Grade 9</span>
      </div>
      <span className="absolute bottom-0 left-0 w-full h-1 bg-white/30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
      </button>
    </a>

    <a href='/student-note10'>
      <button className="group relative overflow-hidden px-8 py-6 w-full rounded-xl bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#581c87] text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
      <div className="flex items-center justify-center gap-3">
        <span>Grade 10</span>
      </div>
      </button>
    </a>

    <a href='/student-note11'>
      <button className="group relative overflow-hidden px-8 py-6 w-full rounded-xl bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#581c87] text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
      <div className="flex items-center justify-center gap-3">
        <span>Grade 11</span>
      </div>
      </button>
    </a>

    <a href='/student-note'>
      <button className="group relative overflow-hidden px-8 py-6 w-full rounded-xl bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#581c87] text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
      <div className="flex items-center justify-center gap-3">
        <span>Grade 12</span>
      </div>
      </button>
    </a>
  </div>
</div>
     )


  case 'exam':
     return(
     <div className='mb-8'>
  <h2 className='text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center'>Start <span className='text-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#581c87]'>Your Exam</span></h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 shadow-xl">
    
    <a href='/grade9'>
      <button className="group relative overflow-hidden px-8 py-6 w-full rounded-xl bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#581c87] text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
      <div className="flex items-center justify-center gap-3">
        <span>Grade 9</span>
      </div>
      <span className="absolute bottom-0 left-0 w-full h-1 bg-white/30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
      </button>
    </a>

    <a href='/grade10'>
      <button className="group relative overflow-hidden px-8 py-6 w-full rounded-xl bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#581c87] text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
      <div className="flex items-center justify-center gap-3">
        <span>Grade 10</span>
      </div>
      </button>
    </a>

    <a href='/grade11'>
      <button className="group relative overflow-hidden px-8 py-6 w-full rounded-xl bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#581c87] text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
      <div className="flex items-center justify-center gap-3">
        <span>Grade 11</span>
      </div>
      </button>
    </a>

    <a href='/grade12'>
      <button className="group relative overflow-hidden px-8 py-6 w-full rounded-xl bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#581c87] text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
      <div className="flex items-center justify-center gap-3">
        <span>Grade 12</span>
      </div>
      </button>
    </a>
  </div>
</div>
     )





    

      default:
        const filteredDashboardResources = filterResourcesBySubject(
          activeCategory 
            ? recentResources.filter(r => r.category === activeCategory)
            : recentResources
        );

        return (
          <>
            {/* Dashboard Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
              <div className="flex-1">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">Tulu Dimtu Students <span className='text-blue-500'>Study Dashboard</span></h1>
                {/* <p className="text-gray-600 dark:text-gray-400">Dear Students Access all your learning resources in one place</p> */}
                <div className="mt-2 flex items-center flex-wrap gap-2">






                  {activeCategory && (
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                      Category: {categories.find(c => c.key === activeCategory)?.label}
                    </span>
                  )}
                  {selectedSubject !== 'all' && (
                    <span className="text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full">
                      Subject: {selectedSubject}
                    </span>
                  )}
                  {(activeCategory || selectedSubject !== 'all') && (
                    <button 
                      onClick={() => {
                        setActiveCategory(null);
                        setSelectedSubject('all');
                      }}
                      className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      × Clear all filters
                    </button>
                  )}
                </div>
              </div>
              <div className="relative w-full lg:w-auto">
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full lg:w-80 pl-10 pr-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                />
                <FiSearch className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500" />
              </div>
            </div>
            
            
            {/* Resource Categories */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg lg:text-xl font-semibold text-gray-800 dark:text-white">Categories</h2>
                <button 
                  onClick={() => {
                    setActiveCategory(null);
                    setSelectedSubject('all');
                  }}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  View all
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
                {categories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => handleCategoryClick(category.key)}
                    className={`bg-white dark:bg-gray-700 p-3 lg:p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600 text-center hover:shadow-md transition-all duration-200 ${activeCategory === category.key ? 'ring-2 ring-blue-500 transform scale-105' : ''}`}
                  >
                    <div className={`w-10 h-10 lg:w-12 lg:h-12 ${category.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : category.color === 'green' ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' : category.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' : category.color === 'red' ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400' : category.color === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400' : 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'} rounded-full flex items-center justify-center mx-auto mb-2`}>
                      {category.icon}
                    </div>
                    <p className="font-medium text-sm lg:text-base text-gray-800 dark:text-white">{category.label}</p>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Recent Resources */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg lg:text-xl font-semibold text-gray-800 dark:text-white">
                  {activeCategory ? `${categories.find(c => c.key === activeCategory)?.label}` : 'Recent Resources'}
                  {selectedSubject !== 'all' && ` • ${selectedSubject}`}
                </h2>
                <button 
                  onClick={() => {
                    setActiveCategory(null);
                    setSelectedSubject('all');
                  }}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  View all
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {filteredDashboardResources.map((resource, index) => (
                  <ResourceCard
                    key={index}
                    title={resource.title}
                    type={resource.type}
                    subject={resource.subject}
                    date={resource.date}
                    downloads={resource.downloads}
                    thumbnail={resource.thumbnail}
                    onView={() => resource.type === 'video' ? handleVideoCardClick(resource.videoUrl, resource.title) : handleViewPdf(resource.url, resource.title)}
                    onDownload={() => handleDownload(resource.title, resource.type)}
                    videoUrl={resource.videoUrl}
                  />
                ))}
                {filteredDashboardResources.length === 0 && (
                  <div className="col-span-3 text-center py-8 lg:py-12">
                    <p className="text-gray-500 dark:text-gray-400">
                      {activeCategory && selectedSubject !== 'all' 
                        ? `No ${categories.find(c => c.key === activeCategory)?.label.toLowerCase()} found for ${selectedSubject}.`
                        : activeCategory 
                          ? `No ${categories.find(c => c.key === activeCategory)?.label.toLowerCase()} found.`
                          : `No resources found for ${selectedSubject}.`
                      }
                    </p>
                    <button 
                      onClick={() => {
                        setActiveCategory(null);
                        setSelectedSubject('all');
                      }}
                      className="mt-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      View all resources
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 h-16 backdrop-filter backdrop-blur-md ${darkMode ? 'bg-gray-800/85 border-gray-700' : 'bg-white/85 border-gray-100'} border-b`}>
        <div className="w-full px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Mobile Menu Button */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden mr-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 mobile-menu-button"
            >
              <FiMenu className={`w-6 h-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
            </button>
            
            <div className="  flex items-center justify-center text-white font-bold">
               <button
             className=''
             onClick={() => naviget('/')}

             >
             <FaHome className='w-6 h-6 sm:w-8 sm:h-8 '/>
             </button>
           </div>
            <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} hidden sm:block`}>Tulu Dimtu <span className='text-blue-700'>Student Study Portal</span></h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} transition-all duration-300`}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>
            
            
            
            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={toggleProfileDropdown}
                className={`flex items-center space-x-2 p-1 rounded-full hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'} transition-colors`}
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                    <img 
                      src={profileImage}
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                </div>
                <div className="hidden md:block text-left">
                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{userName}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Student</p>
                </div>
              </button>
              
              {/* Profile Dropdown Menu */}
              {showProfileDropdown && (
                <div className={`absolute right-0 mt-2 w-80 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-xl border overflow-hidden z-50 animate-fadeIn`}>
                  <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center overflow-hidden border-2 border-white dark:border-gray-800 shadow-md">
                          <img 
                            src={editingProfile ? tempProfileImage : profileImage}
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {editingProfile && (
                          <>
                            <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors shadow-md border-2 border-white dark:border-gray-800">
                              <FiCamera className="w-3.5 h-3.5 text-white" />
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                              />
                            </label>
                            <div className="absolute -top-1 -left-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                              <FiEdit2 className="w-2.5 h-2.5 text-gray-800" />
                            </div>
                          </>
                        )}
                      </div>
                      <div className="flex-1">
                        {editingProfile ? (
                          <>
                            <div className="mb-2">
                              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Full Name</label>
                              <input
                                type="text"
                                value={tempUserName}
                                onChange={(e) => setTempUserName(e.target.value)}
                                className={`w-full px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-800 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                placeholder="Enter your name"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Email Address</label>
                              <input
                                type="email"
                                value={userEmail}
                                readOnly
                                className={`w-full px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-gray-400 border-gray-600' : 'bg-gray-100 text-gray-500 border-gray-300'} border cursor-not-allowed`}
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <h3 className="font-bold text-lg text-gray-800 dark:text-white">{userName}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{userEmail}</p>
                            <div className="flex items-center mt-1">
                              <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                                Premium Student
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">• ID: STU2024</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* Edit Mode Controls */}
                    {editingProfile ? (
                      <div className="flex space-x-2 mt-4">
                        <button
                          onClick={saveProfile}
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                        >
                          <FiSave className="w-4 h-4" />
                          <span>Save Changes</span>
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="mt-4">
                        <button
                          onClick={startEditingProfile}
                          className={`w-full py-2 px-4 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} transition-colors flex items-center justify-center space-x-2`}
                        >
                          <FiEdit2 className="w-4 h-4" />
                          <span>Edit Profile</span>
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="py-2">
                    <button className={`flex items-center w-full px-4 py-3 text-sm ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} transition-colors`}>
                      <FiUser className="mr-3 w-4 h-4" />
                      <div className="text-left">
                        <div>View Full Profile</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">See complete profile details</div>
                      </div>
                    </button>
                    
                    
                    <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'} my-2`}></div>
                    <button 
                      onClick={handleLogout}
                      className={`flex items-center w-full px-4 py-3 text-sm ${darkMode ? 'text-red-400 hover:bg-red-900/20' : 'text-red-600 hover:bg-red-50'} transition-colors`}
                    >
                      <FiLogOut className="mr-3 w-4 h-4" />
                      <div className="text-left">
                        <div>Log Out</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Sign out of your account</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Close dropdown when clicking outside */}
      {showProfileDropdown && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowProfileDropdown(false)}
        />
      )}
      
      {/* Sidebar and Main Content */}
      <div className="flex pt-16">
        {/* Sidebar - Fixed on desktop, hidden on mobile */}
        <aside className={`fixed lg:sticky lg:top-16 left-0 w-60 h-[calc(100vh-4rem)] ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border-r overflow-y-auto pt-6 z-40 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          {/* Close button for mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FiX className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          
          <div className="px-4 space-y-1">
            {navLinks.map((link, index) => (
              <button
                key={index}
                onClick={() => handleNavClick(link.key)}
                className={`flex items-center w-full text-left px-4 py-3 rounded-lg ${activeSection === link.key ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-l-3 border-blue-500' : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-blue-50/50'} transition-colors`}
              >
                <span className="mr-3">{link.icon}</span>
                <span className="font-medium">{link.label}</span>
              </button>
            ))}
          </div>
          
          <div className="px-4 mt-8">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 mb-2">Subjects</h3>
            <div className="space-y-1">
              {subjectLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={() => handleSubjectClick(link.key === 'all' ? 'all' : link.label)}
                  className={`flex items-center w-full text-left px-4 py-3 rounded-lg ${selectedSubject === (link.key === 'all' ? 'all' : link.label) ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-blue-50/50'} transition-colors`}
                >
                  <span className="mr-3">{link.icon}</span>
                  <span className="font-medium">{link.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="px-4 mt-8">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 mb-2">Tools</h3>
            <div className="space-y-1">
              {toolLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={() => handleNavClick(link.key)}
                  className={`flex items-center w-full text-left px-4 py-3 rounded-lg ${activeSection === link.key ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-blue-50/50'} transition-colors`}
                >
                  <span className="mr-3">{link.icon}</span>
                  <span className="font-medium">{link.label}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>
        
        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full overflow-x-hidden">
          {renderContent()}
        </main>
      </div>
      
      {/* PDF Viewer Modal */}
      {showPdfViewer && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className={`rounded-xl w-full max-w-6xl h-[90vh] flex flex-col ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`h-14 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border-b flex items-center justify-between px-4`}>
              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{pdfTitle}</h3>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => downloadFile('', pdfTitle, 'pdf')}
                  className={`w-9 h-9 rounded-full hover:${darkMode ? 'bg-gray-600' : 'bg-gray-200'} flex items-center justify-center`}
                  title="Download PDF"
                >
                  <FiDownload className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
                </button>
                <button className={`w-9 h-9 rounded-full hover:${darkMode ? 'bg-gray-600' : 'bg-gray-200'} flex items-center justify-center`} title="Print">
                  <FiPrinter className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
                </button>
                <button className={`w-9 h-9 rounded-full hover:${darkMode ? 'bg-gray-600' : 'bg-gray-200'} flex items-center justify-center`} title="Full Screen">
                  <FiMaximize2 className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
                </button>
              </div>
            </div>
            <iframe
              src={pdfUrl}
              className="flex-1 w-full border-none"
              title="PDF Viewer"
            />
          </div>
          <button
            onClick={closePdfViewer}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black/90"
          >
            <FiX />
          </button>
        </div>
      )}
      
    
    
    
    
    
    
    
    
      {/* Video Player Modal */}
     {showVideoPlayer && (
  <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
    <div className={`rounded-xl w-full max-w-6xl h-[90vh] flex flex-col ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      {/* Header */}
      <div className={`h-14 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border-b flex items-center justify-between px-4`}>
        <div className="flex items-center space-x-3">
          <FiPlay className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
          <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{videoTitle}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => downloadFile(videoUrl, videoTitle, 'video')}
            className={`w-9 h-9 rounded-full hover:${darkMode ? 'bg-gray-600' : 'bg-gray-200'} flex items-center justify-center`}
            title="Download Video"
          >
            <FiDownload className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
          </button>
          <button className={`w-9 h-9 rounded-full hover:${darkMode ? 'bg-gray-600' : 'bg-gray-200'} flex items-center justify-center`} title="Full Screen">
            <FiMaximize2 className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
          </button>
        </div>
      </div>

      {/* Video Content */}
      <div className="flex-1 w-full relative">
        {videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') ? (
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoUrl.split('v=')[1].split('&')[0]}`}
            title={videoTitle}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            controls
            autoPlay
            className="w-full h-full object-contain bg-black"
            src={videoUrl}
          >
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </div>

    {/* Close Button */}
    <button
      onClick={closeVideoPlayer}
      className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black/90"
    >
      <FiX />
    </button>
  </div>
)}






      
      {/* Downloading Overlay */}
      {downloading && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
          <div className={`p-8 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} flex flex-col items-center space-y-4 min-w-96`}>
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-gray-200 dark:border-gray-700">
                <div 
                  className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-blue-500 border-t-transparent animate-spin"
                  style={{ animationDuration: '1s' }}
                ></div>
              </div>
              <FiDownload className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-blue-500" />
            </div>
            <p className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>Downloading File...</p>
            
            <div className="w-64 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${downloadProgress}%` }}
              ></div>
            </div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{downloadProgress}% complete</p>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} text-center`}>
              File will be saved to your Downloads folder
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const ResourceCard = ({ title, type, subject, date, downloads, thumbnail, onView, onDownload, videoUrl }) => {
  const typeIcons = {
    pdf: <FiFileText />,
    video: <FiVideo />,
    audio: <FiFile />,
    document: <FiFile />,
    default: <FiFile />
  };

  const typeColors = {
    pdf: 'blue',
    video: 'green',
    audio: 'purple',
    document: 'yellow',
    default: 'gray'
  };

  const icon = typeIcons[type] || typeIcons.default;
  const color = typeColors[type] || typeColors.default;

  const isVideo = type === 'video';

  // Handle card click for video - opens video when clicking anywhere on the thumbnail
  const handleCardClick = (e) => {
    if (isVideo && videoUrl) {
      e.preventDefault();
      e.stopPropagation();
      // Call the parent handler to open video
      onView();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-700 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-600 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      <div 
        className="h-40 lg:h-48 relative bg-cover bg-center cursor-pointer" 
        style={{ backgroundImage: `url(${thumbnail})` }}
        onClick={handleCardClick}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        <span className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-sm`}>
          {type.toUpperCase()}
        </span>
        {isVideo && (
          <>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white/80 dark:bg-gray-800/80 rounded-full flex items-center justify-center hover:bg-white/90 dark:hover:bg-gray-700/90 transition-colors">
                <FiPlay className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="absolute bottom-3 left-3 bg-black/60 text-white px-2 py-1 rounded text-xs">
              Click to Play
            </div>
          </>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-gray-800 dark:text-white text-base lg:text-lg mb-1 truncate">{title}</h3>
        <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 dark:text-gray-400 mb-3 gap-1">
          <span className="font-medium">{subject}</span>
          <span className="hidden sm:inline mx-2">•</span>
          <span>{date}</span>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <FiDownload className="w-4 h-4 mr-1" />
            <span>{downloads} downloads</span>
          </div>
          
          <div className="flex justify-end space-x-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onView();
              }}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-500 transition"
              title={isVideo ? "Watch Video" : "View Document"}
            >
              {isVideo ? <FiPlay className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDownload();
              }}
              className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/50 transition"
              title={`Download ${type.toUpperCase()}`}
            >
              <FiDownload className="w-4 h-4" /> 
            </button>
            <button 
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-500 transition" 
              title="Add to Favorites"
              onClick={(e) => e.stopPropagation()}
            >
              <FiStar className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentStudyPlace;