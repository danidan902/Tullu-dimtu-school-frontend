import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import NewsCard from '../components/NewsCard';
import Footer from '../components/Footer';
import { Helmet } from "react-helmet-async";

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample news data
  const sampleNews = [
    {
      id: 1,
      title: "Annual Science Fair 2024",
      content: "We're excited to announce our Annual Science Fair will be held on December 15th. Students from grades 9-12 will showcase their innovative projects. Parents and community members are welcome to attend.",
      category: "Academic",
      date: "2024-12-01",
      author: "Dr. Sarah Johnson"
    },
    {
      id: 2,
      title: "Basketball Team Wins Regional Championship",
      content: "Our school's basketball team has won the regional championship for the third consecutive year! The final score was 78-72 against Lincoln High. Congratulations to all players and Coach Miller.",
      category: "Sports",
      date: "2024-11-28",
      author: "Dr. Sarah Johnson"
    },
    {
      id: 3,
      title: "Winter Break Schedule",
      content: "Winter break will begin on December 22nd and classes will resume on January 8th. Please ensure all assignments are submitted before the break. Wishing everyone happy holidays!",
      category: "Announcement",
      date: "2024-11-25",
      author: "Dr. Sarah Johnson"
    },
    {
      id: 4,
      title: "Parent-Teacher Conference Dates",
      content: "The next round of parent-teacher conferences will be held from December 10th to 12th. Please schedule your appointments through the school portal. Your participation is crucial for student success.",
      category: "Event",
      date: "2024-11-20",
      author: "Dr. Sarah Johnson"
    },
    {
      id: 5,
      title: "New Library Resources Available",
      content: "We have added over 500 new books to our school library, including the latest STEM resources and award-winning literature. Students can check out up to 5 books at a time.",
      category: "Academic",
      date: "2024-11-18",
      author: "Dr. Sarah Johnson"
    },
    {
      id: 6,
      title: "School Cafeteria Menu Update",
      content: "Starting next week, our cafeteria will introduce new healthy meal options including vegetarian and gluten-free choices. We're committed to providing nutritious meals for all students.",
      category: "Announcement",
      date: "2024-11-15",
      author: "Dr. Sarah Johnson"
    }
  ];

  useEffect(() => {
    // In a real app, you would fetch news from an API
    const savedNews = localStorage.getItem('schoolNews');
    if (savedNews) {
      setNews(JSON.parse(savedNews));
    } else {
      setNews(sampleNews);
      localStorage.setItem('schoolNews', JSON.stringify(sampleNews));
    }
  }, []);

  const categories = ['All', 'Academic', 'Sports', 'Event', 'Announcement'];

  const filteredNews = news.filter(item => {
    const matchesCategory = filter === 'All' || item.category === filter;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
   <>
     <Helmet>
        <title>School News | Announcement</title>
        </Helmet>
        
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">

     <div className="relative bg-gradient-to-r from-blue-800 to-blue-600 text-white py-28">
             
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mt-16 mb-8">Tulu Dimtu School <span className='text-yellow-500'>News & Announcements</span></h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Stay updated with everything happening at Greenwood High School
          </p>
        </div>
      </div>
      
      <Header isDirectorPage={false} />
      
      <main className="container mx-auto px-4 py-8 ">

    


        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="w-full md:w-1/2">
              <div className="relative">
                <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="Search news by title or content..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-school-blue"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 grid-rows-2 justify-center md:justify-end">
              {categories.map(category => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-lg font-medium transition duration-300 ${
                    filter === category 
                    ? 'bg-blue-400 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  onClick={() => setFilter(category)}
                >
                  {category}
                </button>



              

              ))}


               {/* <a href='/news-event'>
                <button className={`px-4 py-2 rounded-lg font-medium transition duration-300 bg-blue-200 text-gray-700 hover:bg-gray-300`}>
                  News Archive
                </button>
               </a> */}

            </div>
          </div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {filteredNews.map(item => (
            <NewsCard key={item.id} news={item} />
          ))}
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-12">
            <i className="fas fa-newspaper text-6xl text-gray-300 mb-4"></i>
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">No news found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Quick Info Section */}
        {/* <div className="bg-white rounded-xl shadow-lg p-8 mt-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Stay Connected</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <i className="fas fa-calendar-alt text-4xl text-school-blue mb-4"></i>
              <h4 className="font-bold text-lg mb-2">Upcoming Events</h4>
              <p className="text-gray-600">Check our calendar for all school events and activities</p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <i className="fas fa-bullhorn text-4xl text-school-green mb-4"></i>
              <h4 className="font-bold text-lg mb-2">Important Announcements</h4>
              <p className="text-gray-600">Get real-time updates about school closures and alerts</p>
            </div>
            <div className="text-center p-6 bg-yellow-50 rounded-lg">
              <i className="fas fa-trophy text-4xl text-school-gold mb-4"></i>
              <h4 className="font-bold text-lg mb-2">Student Achievements</h4>
              <p className="text-gray-600">Celebrating our students' accomplishments and successes</p>
            </div>
          </div>
        </div> */}
      </main>

    
    </div>
   <Footer/>
   
   </>
  );
};

export default NewsPage;