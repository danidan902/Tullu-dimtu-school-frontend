import{ useState, useEffect, useRef, useCallback } from "react";
import { 
  Send, X, Bot, User, Loader2, 
  Sparkles, Zap, Brain, 
  RefreshCw,  Volume2, VolumeX, MessageSquareText

} from "lucide-react";

// Add CSS animations directly
const styles = `
  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
  }
  @keyframes progress {
    0% { width: 0%; }
    50% { width: 100%; }
    100% { width: 0%; }
  }
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  .animate-progress {
    animation: progress 2s ease-in-out infinite;
  }
  .animate-bounce {
    animation: bounce 0.5s ease-in-out infinite;
  }
  .animate-pulse {
    animation: pulse 2s ease-in-out infinite;
  }
  .animate-spin {
    animation: spin 1s linear infinite;
  }
  .animate-shimmer {
    animation: shimmer 2s infinite;
  }
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      sender: "bot", 
      text: "Hello! I'm Tulu Dimtu SchoolBot. How can I help you today?", 
      timestamp: new Date(),
      animated: true
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingMessage, setTypingMessage] = useState("");
  const [currentTypingIndex, setCurrentTypingIndex] = useState(0);
  const [theme, setTheme] = useState("cyberpunk");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [particles, setParticles] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatWindowRef = useRef(null);
  const typingIntervalRef = useRef(null);
  const particleIntervalRef = useRef(null);

  // Particle system for background effects
  useEffect(() => {
    if (isOpen && !isFullscreen) {
      particleIntervalRef.current = setInterval(() => {
        if (particles.length < 15) {
          setParticles(prev => [
            ...prev,
            {
              id: Date.now(),
              x: Math.random() * 100,
              y: Math.random() * 100,
              size: Math.random() * 3 + 1,
              color: theme === "cyberpunk" ? "#00f3ff" : 
                     theme === "galaxy" ? "#9d4edd" : "#ff00ff",
              speed: Math.random() * 2 + 0.5
            }
          ]);
        }
      }, 300);

      const cleanup = setInterval(() => {
        setParticles(prev => prev.filter(p => Date.now() - p.id < 3000));
      }, 1000);

      return () => {
        clearInterval(particleIntervalRef.current);
        clearInterval(cleanup);
      };
    }
  }, [isOpen, isFullscreen, particles.length, theme]);

  const simulateTyping = useCallback((message) => {
    setIsTyping(true);
    setTypingMessage("");
    setCurrentTypingIndex(0);

    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }

    typingIntervalRef.current = setInterval(() => {
      setCurrentTypingIndex((prev) => {
        if (prev < message.length) {
          setTypingMessage(message.substring(0, prev + 1));
          return prev + 1;
        } else {
          clearInterval(typingIntervalRef.current);
          setIsTyping(false);
          
          const botMessage = { 
            id: Date.now() + 1, 
            sender: "bot", 
            text: message,
            timestamp: new Date(),
            animated: true
          };
          
          setMessages(prev => [...prev, botMessage]);
          
          if (messages.length === 1) {
            setTimeout(() => {
              setMessages(prev => [...prev, {
                id: Date.now() + 2,
                sender: "bot",
                text: "✨ I'm powered by Tulu Dimtu School and ready to assist with all your educational needs!",
                timestamp: new Date(),
                animated: true
              }]);
            }, 500);
          }
          
          return prev;
        }
      });
    }, 20);
  }, [messages.length]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      if (soundEnabled) {
        try {
          // Use a simpler sound approach
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.value = 800;
          oscillator.type = 'sine';
          gainNode.gain.value = 0.1;
          
          oscillator.start();
          setTimeout(() => oscillator.stop(), 100);
        } catch (e) {
          console.log("Sound disabled");
        }
      }
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading || isTyping) return;

    const userMessage = { 
      id: Date.now(), 
      sender: "user", 
      text: input.trim(),
      timestamp: new Date(),
      animated: true
    };
    
    setMessages(prev => [...prev, userMessage]);
    const userInput = input.trim();
    setInput("");
    setIsLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Smart responses based on user input
    const inputLower = userInput.toLowerCase();
    let botResponse = "";
 

    if (inputLower.includes('hello') || inputLower.includes('hi') || inputLower.includes('hey')) {
      botResponse = "Hello there! 👋 I'm Tulu Dimtu SchoolBot. Ready to assist you with educational queries, course information, and learning resources!";
    } else if (inputLower.includes('course') || inputLower.includes('class') || inputLower.includes('subject')) {
      botResponse = "We offer various courses including Mathematics, Science, Languages, Computer Programming, and Arts. Which subject are you interested in?";
    } else if (inputLower.includes('time') || inputLower.includes('schedule') || inputLower.includes('hour')) {
      botResponse = "School hours are from 8:30 AM to 3:30 PM, Monday through Friday. Extra-curricular activities are scheduled after regular hours.";
    } else if (inputLower.includes('teacher') || inputLower.includes('faculty') || inputLower.includes('staff')) {
      botResponse = "Our faculty consists of highly qualified and experienced educators. Each department has specialized teachers with advanced degrees in their fields.";
    } else if (inputLower.includes('homework') || inputLower.includes('assignment')) {
      botResponse = "I can help you understand assignment requirements! Please share the specific subject or topic you need assistance with.";
    } else if (inputLower.includes('thank') || inputLower.includes('thanks') || inputLower.includes('thnks' || inputLower.includes('thnk'))) {
      botResponse = "You're welcome! 😊 I'm always here to help with your educational journey. Feel free to ask anything else!";
    } else if (inputLower.includes('bye') || inputLower.includes('goodbye')) {
      botResponse = "Goodbye! 👋 Have a great day of learning! Remember, I'm always here when you need educational assistance.";
    } else if (inputLower.includes('ai') || inputLower.includes('artificial intelligence')) {
      botResponse = "Yes! I'm powered by AI technology designed specifically for educational assistance. I can help explain concepts, provide resources, and support your learning journey.";
    } else if (inputLower.includes('math') || inputLower.includes('algebra') || inputLower.includes('calculus')) {
      botResponse = "Mathematics is my specialty! I can help with formulas, problem-solving strategies, and concept explanations. What specific math topic are you working on?";
    } else if (inputLower.includes('science') || inputLower.includes('physics') || inputLower.includes('chemistry') || inputLower.includes('biology')) {
      botResponse = "Science is fascinating! I can explain scientific concepts, help with experiments, or provide study resources. Which branch of science interests you?";
    } else if (inputLower.includes("admission") || inputLower.includes("apply") || inputLower.includes("enroll")) {
    botResponse = "Admissions for the upcoming academic year are open from August 8th to August 20th. You can apply through our online portal or visit the administration office for assistance. please dear student when you want to apply make sure you have all the required documents ready. For more details, visit www.tulludimtuschool.edu.et/admissions or contact ";
} else if (inputLower.includes("fee") || inputLower.includes("tuition") || inputLower.includes("payment")) {
    botResponse = "Our fee structure varies by grade level. The admission fee is 700 birr. You can pay with cash, bank transfer through our online scaan QR code, and pay at the school accounts office and we also accept mobile money payments for your convenience.";
} else if (inputLower.includes("principal") || inputLower.includes("head") || inputLower.includes("director")) {
    botResponse = "Our school is led by Principal Dr. Bedhasa , who holds a Master's in Educational Leadership and has over 12 years of experience. Dr. Bedhasa is dedicated to fostering a nurturing and academically rigorous environment for all students.";
} else if (inputLower.includes("hours") || inputLower.includes("time") || inputLower.includes("schedule")) {
    botResponse = "School operates Monday-Friday from 8:00 AM to 3:30 PM. Extracurricular activities run until 5:00 PM. Office hours are 7:30 AM to 8:00 PM. We are closed on weekends and public holidays. For a detailed calendar, visit www.tulludimtuschool.edu.et/calendar.";
} else if (inputLower.includes("contact") || inputLower.includes("phone") || inputLower.includes("call")) {
    botResponse = "📞 Main Office: +251 11 123 4567\n📱 Admissions: +251 91 234 5678\n📧 Email: info@tulludimtuschool.edu.et\n📠 Fax: +251 11 123 4568 ";
} else if (inputLower.includes("location") || inputLower.includes("address") || inputLower.includes("where")) {
    botResponse = "📍 Tulludimtu School\nSheger city Addministration\nAddis Ababa, Ethiopia\n(For more information just see our location https://tuludimtuschool.com/contact) ";
} else if (inputLower.includes("courses") || inputLower.includes("subjects") || inputLower.includes("curriculum")) {
    botResponse = "We follow the national curriculum with enhanced programs in:\n• STEM (Science, Technology, Physics, Math)\n• Languages (English, Amharic, Oromic)\n• Social Sciences\n• Arts & Music\n• Physical Education\n• ICT & Programming Development \n\nAdvanced Placement (AP) courses are available for high school students.";
} else if (inputLower.includes("uniform") || inputLower.includes("dress") || inputLower.includes("clothing")) {
    botResponse = "School uniforms are mandatory and available at the school store. Requirements: Navy blue trousers/skirt with white shirt and school tie. Sports uniforms are also required for PE days. Please refer to the student handbook for detailed guidelines.";
} else if (inputLower.includes("teacher") || inputLower.includes("faculty") || inputLower.includes("staff")) {
    botResponse = "Our faculty consists of qualified professionals with advanced degrees. All teachers participate in continuous professional development programs. We maintain a low student-teacher ratio to ensure personalized attention and support for each student.";
} else if (inputLower.includes("event") || inputLower.includes("calendar") || inputLower.includes("holiday")) {
    botResponse = "The academic calendar, including holidays and special events, is available on our website. Key events: Sports Day (March), Cultural Festival (May), Parents Day (October). ";
} else if (inputLower.includes("bus") || inputLower.includes("transport") || inputLower.includes("pickup")) {
    botResponse = "School bus service covers major areas of Addis Ababa. Routes and fees are available at the transportation office. Safety-certified drivers and attendants provided. Contact ";
} else if (inputLower.includes("library") || inputLower.includes("lab") || inputLower.includes("facilit")) {
    botResponse = "Our facilities include:\n• Modern science laboratories\n• Computer lab with high-speed internet\n• Well-stocked library\n• Sports field and gymnasium\n• Art and music rooms \n\nStudents have access during and after school hours.";
} else if (inputLower.includes("parent") || inputLower.includes("pta") || inputLower.includes("meeting")) {
    botResponse = "Parent-Teacher meetings are held quarterly. The PTA meets monthly. You can join our parents' WhatsApp group for updates. Contact the PTA coordinator at ";
} else if (inputLower.includes("lunch") || inputLower.includes("food") || inputLower.includes("cafeteria")) {
    botResponse = "Our cafeteria serves nutritious meals daily. Monthly meal plans are available. Special dietary needs can be accommodated with prior notice. Contact the cafeteria manager for details.";
} else if (inputLower.includes("sport") || inputLower.includes("game") || inputLower.includes("athletic")) {
    botResponse = "Sports programs include football, basketball, athletics, and volleyball. We participate in inter-school competitions throughout the year. Training sessions are held after school. Contact the sports coordinator for more information.";
} else if (inputLower.includes("result") || inputLower.includes("exam") || inputLower.includes("grade") || inputLower.includes("report")) {
    botResponse = "Report cards are issued quarterly. Parents can access grades through our secure online portal. Contact the academic office for login assistance. For exam schedules, visit www.tulludimtuschool.edu.et/exams.";
} else if (inputLower.includes("website") || inputLower.includes("online") || inputLower.includes("portal") || inputLower.includes("web")) {
    botResponse = "Visit our website: www.tulludimtuschool.edu.et\nParent Portal: portal.tulludimtuschool.edu.et\nFollow us on Facebook & Telegram for updates";
} else if (inputLower.includes("help") || inputLower.includes("support") || inputLower.includes("emergency") || inputLower.includes("urgent")) {
    botResponse = "For urgent matters during school hours, call the main office. After hours, contact the administrator on duty at +251 92 345 6789. For technical support with online services, email";
} else if (inputLower.includes("amharic") || inputLower.includes("አማርኛ")) {
    botResponse = "ትምህርት ቤታችን በአማርኛም እንገኛለን። ለበለጠ መረጃ +2519 2122 5887 ይደውሉ። እንኳን ደህና መጡ! 😊";
} else if (inputLower.includes("register") || inputLower.includes("registration") || inputLower.includes("sign up")) {
    botResponse = "I can help with registration! Please specify:\n\n• Which grade level? (KG, Elementary, High School)\n• Are you a new student or transferring?\n• Do you need information about:\n  - Required documents\n  - Application deadlines\n  - Registration fees\n  - Online application link\n\nOr simply visit: www.tulludimtuschool.edu.et/apply";
} else if (inputLower.includes("new student") || inputLower.includes("first time") || inputLower.includes("never attended") || inputLower.includes("fresh")) {
    botResponse = "🎓 **New Student Registration:**\n\n📋 **Required Documents:**\n1. Original birth certificate\n2. 4 recent passport photos\n3. Medical fitness certificate\n4. Parent/guardian ID copies (2 each)\n5. Vaccination records (for KG-Grade 3)\n\n📝 **Process:**\n1. Complete online pre-registration\n2. Submit documents at admin office\n3. Take placement assessment (Grade 2+)\n4. Attend orientation with parents\n5. Pay registration fee (1,500 Birr)\n\n⏰ **Office Hours for New Admissions:** 9:00 AM - 2:00 PM";
} else if (inputLower.includes("old student") || inputLower.includes("returning") || inputLower.includes("previous") || inputLower.includes("continuing") || inputLower.includes("re-enroll")) {
    botResponse = "👋 **Welcome Back! Returning Student Process:**\n\n📅 **Re-enrollment Period:** June 1-30 annually\n\n✅ **Simple Steps:**\n1. Pay re-enrollment fee (800 Birr) at accounts office\n2. Submit clearance form from library & labs\n3. Update parent contact information\n4. Collect new academic year materials\n\n📱 **Quick Re-enrollment Online:** portal.tulludimtuschool.edu.et/re-enroll\n\n⚠️ **Note:** Students with unpaid fees or incomplete clearance cannot re-enroll";
} else if (inputLower.includes("about") || inputLower.includes("tulludimtu") || inputLower.includes("school info") || inputLower.includes("description")) {
    botResponse = "🏫 **About Tulludimtu School:**\n\nTulludimtu School is a leading K-12 institution in Addis Ababa, Ethiopia, known for academic excellence and holistic education. We follow the national curriculum enhanced with STEM, ICT, and language programs. Our mission is to develop ethical, innovative leaders through quality teaching, modern facilities, and a supportive community environment.\n\n• Established: [Year]\n• Students: 1,200+\n• Staff: 85+\n• Campus: 5-acre modern facility\n• Accreditation: Ethiopian Ministry of Education\n\nLearn more: www.tulludimtuschool.edu.et/about";
} else if (inputLower.includes("mission") || inputLower.includes("vision") || inputLower.includes("philosophy")) {
    botResponse = "🌟 **Our Guiding Principles:**\n\n**Vision:** To be Ethiopia's premier school for developing globally competitive, ethically grounded citizens.\n\n**Mission:** To provide quality education that empowers students academically, builds strong character, and prepares them for lifelong success through innovative teaching and a nurturing environment.\n\n**Values:** Integrity, Excellence, Respect, Innovation, Community Service";
} else if (inputLower.includes("history") || inputLower.includes("established") || inputLower.includes("founded")) {
    botResponse = "📜 **School History:**\n\nTulludimtu School was founded in [Year] with [number] students. Over the years, we have grown from a small neighborhood school to a respected educational institution serving over 1,200 students. Our campus has expanded to include modern laboratories, a library, sports facilities, and smart classrooms while maintaining our commitment to personalized attention and academic excellence.";
} else if (inputLower.includes('science') || inputLower.includes('physics') || inputLower.includes('chemistry') || inputLower.includes('biology')) {
    botResponse = "Science is fascinating! I can explain scientific concepts, help with experiments, or provide study resources. Which branch of science interests you?";
} else if (inputLower.includes('help') || inputLower.includes('support')) {
    botResponse = "I'm here to help! I can assist with:\n• Course information\n• Study resources\n• Homework help\n• Educational concepts\n• School procedures\nWhat do you need assistance with?";
}  else {
      const generalResponses = [
        "That's an interesting question! I'd be happy to help you with educational information about that topic.",
        "As your educational assistant, I can provide information on various school-related topics. Could you be more specific?",
        "I understand you're asking about learning resources. Let me provide some helpful educational information.",
        "Great question! This relates to important educational concepts. Here's what I can share with you.",
        "I'm designed to assist with educational queries. Based on your question, here's some information that might help.",
        "That's relevant to learning and education! Let me share some insights that could assist your understanding."
      ];
      botResponse = generalResponses[Math.floor(Math.random() * generalResponses.length)];
    }

    simulateTyping(botResponse);
    setIsLoading(false);
  }, [input, isLoading, isTyping, simulateTyping]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const clearChat = () => {
    setMessages([
      { 
        id: 1, 
        sender: "bot", 
        text: "Hello! I'm Tulu Dimtu SchoolBot. How can I help you today?", 
        timestamp: new Date(),
        animated: true
      }
    ]);
    setIsTyping(false);
    setTypingMessage("");
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }
    
    if (soundEnabled) {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 1200;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.1;
        
        oscillator.start();
        setTimeout(() => oscillator.stop(), 200);
      } catch (e) {
        console.log("Sound disabled");
      }
    }
  };

  const toggleTheme = () => {
    const themes = ["cyberpunk", "galaxy", "neon"];
    const currentIndex = themes.indexOf(theme);
    setTheme(themes[(currentIndex + 1) % themes.length]);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: "smooth",
      block: "end" 
    });
  }, [messages, typingMessage]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isFullscreen]);

  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
      if (particleIntervalRef.current) {
        clearInterval(particleIntervalRef.current);
      }
    };
  }, []);

  // Theme styles
  const themeStyles = {
    cyberpunk: {
      primary: "from-cyan-500 to-blue-600",
      secondary: "from-purple-600 to-pink-600",
      bg: "bg-gradient-to-br from-gray-900 via-black to-gray-900",
      border: "border-cyan-500/20",
      text: "text-cyan-100",
      bubbleBot: "bg-gradient-to-r from-cyan-900/30 to-blue-900/30 backdrop-blur-lg",
      bubbleUser: "bg-gradient-to-r from-purple-600 to-pink-600",
      particle: "text-cyan-400",
      placeholder: "placeholder-cyan-100/50"
    },
    galaxy: {
      primary: "from-purple-700 to-indigo-900",
      secondary: "from-pink-600 to-rose-800",
      bg: "bg-gradient-to-br from-gray-900 via-purple-900 to-black",
      border: "border-purple-500/20",
      text: "text-purple-100",
      bubbleBot: "bg-gradient-to-r from-purple-900/40 to-indigo-900/40 backdrop-blur-lg",
      bubbleUser: "bg-gradient-to-r from-violet-600 to-fuchsia-600",
      particle: "text-purple-400",
      placeholder: "placeholder-purple-100/50"
    },
    neon: {
      primary: "from-green-400 to-cyan-500",
      secondary: "from-pink-500 to-rose-500",
      bg: "bg-gradient-to-br from-black via-gray-900 to-black",
      border: "border-green-500/20",
      text: "text-green-100",
      bubbleBot: "bg-gradient-to-r from-green-900/30 to-cyan-900/30 backdrop-blur-lg",
      bubbleUser: "bg-gradient-to-r from-green-500 to-teal-500",
      particle: "text-green-400",
      placeholder: "placeholder-green-100/50"
    }
  };

  const currentTheme = themeStyles[theme];

  return (
    <>
      {/* Add global styles */}
      <style>{styles}</style>
      
      <div className={`fixed z-50 font-sans ${isFullscreen ? 'inset-0' : 'bottom-4 right-4 sm:bottom-6 sm:right-6'}`}>
        {/* Background particles */}
        {!isFullscreen && isOpen && (
          <div className="absolute inset-0 pointer-events-none">
            {particles.map(particle => (
              <div
                key={particle.id}
                className="absolute rounded-full animate-float"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  backgroundColor: particle.color,
                  opacity: 0.6,
                  animationDelay: `${particle.id % 2000}ms`,
                  animationDuration: `${3000 / particle.speed}ms`
                }}
              />
            ))}
          </div>
        )}

        {/* Chat toggle button */}
        {!isOpen && !isFullscreen && (
          <div className="relative group">
            <div className="absolute -inset-1 bg-[#04595E] hover:[#04395E]  rounded-full"></div>
            <button
              onClick={toggleChat}
              className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full"
              aria-label="Open chat"
            >
              <MessageSquareText size={24} className="sm:size-7 text-white" />
              {/* <Sparkles size={12} className="absolute -top-1 -right-1 text-yellow-300 animate-spin" /> */}
             
            </button>
          </div>
        )}

        {/* Main chat window */}
        {(isOpen || isFullscreen) && (
          <div
            ref={chatWindowRef}
            className={`
              ${isFullscreen ? 'w-full h-full rounded-none' : 'w-[calc(100vw-2rem)] sm:w-96 h-[500px] rounded-2xl'}
              ${currentTheme.bg} shadow-2xl flex flex-col border ${currentTheme.border} overflow-hidden relative
              ${isFullscreen ? '' : 'max-w-[calc(100vw-2rem)] sm:max-w-none backdrop-blur-sm'}
              transform transition-all duration-500 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
            `}
            style={{
              backgroundImage: 'linear-gradient(to bottom right, var(--tw-gradient-from), var(--tw-gradient-to))'
            }}
          >
            {/* Header */}
            <div className={`relative bg-gradient-to-r ${currentTheme.primary} px-4 py-3 sm:px-5 sm:py-4 flex items-center justify-between border-b ${currentTheme.border}`}>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Bot size={20} className="text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1">
                    <Zap size={12} className="text-yellow-300 animate-pulse" />
                  </div>
                </div>
                <div>
                  <h2 className="text-white font-bold text-sm sm:text-base">Tulu Dimtu SchoolBot</h2>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleTheme}
                  className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                  aria-label="Change theme"
                  title="Change theme"
                >
                  <RefreshCw size={16} />
                </button>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                  aria-label="Toggle sound"
                  title={soundEnabled ? "Mute sounds" : "Unmute sounds"}
                >
                  {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                </button>
               
                <button
                  onClick={clearChat}
                  className="text-white/80 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all duration-300 flex items-center gap-1"
                  title="Clear chat"
                >
                  <RefreshCw size={14} />
                </button>
                <button
                  onClick={toggleChat}
                  className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                  aria-label="Close chat"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`
                      max-w-[85%] rounded-3xl p-4 relative overflow-hidden
                      transform transition-all duration-500 hover:scale-[1.02]
                      ${msg.sender === "user"
                        ? `${currentTheme.bubbleUser} text-white rounded-br-none shadow-lg`
                        : `${currentTheme.bubbleBot} ${currentTheme.text} border ${currentTheme.border} rounded-bl-none shadow-lg`
                      }
                    `}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`flex items-center gap-2 ${msg.sender === 'user' ? 'text-white/80' : currentTheme.particle}`}>
                        {msg.sender === "bot" ? (
                          <>
                            <Bot size={12} />
                            <span className="text-xs font-medium">SchoolBot</span>
                          </>
                        ) : (
                          <>
                            <User size={12} />
                            <span className="text-xs font-medium">You</span>
                          </>
                        )}
                      </div>
                      <span className="text-xs opacity-60">
                        • {formatTime(msg.timestamp)}
                      </span>
                      {msg.animated && (
                        <Sparkles size={10} className="text-yellow-300 animate-pulse" />
                      )}
                    </div>
                    
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {msg.text}
                    </p>
                  </div>
                </div>
              ))}
              
              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className={`${currentTheme.bubbleBot} backdrop-blur-lg border ${currentTheme.border} rounded-3xl rounded-bl-none p-4 shadow-lg max-w-[85%]`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Bot size={12} className={currentTheme.particle} />
                      <span className={`text-xs ${currentTheme.text} opacity-70`}>
                        SchoolBot • {formatTime(new Date())}
                      </span>
                      <Sparkles size={10} className="text-yellow-300 animate-spin" />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        <div className={`w-2 h-2 ${currentTheme.particle} rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
                        <div className={`w-2 h-2 ${currentTheme.particle} rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
                        <div className={`w-2 h-2 ${currentTheme.particle} rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <div className="relative">
                        <p className={`text-sm ${currentTheme.text}`}>
                          {typingMessage}
                          <span className="inline-block w-1 h-4 bg-cyan-400 animate-pulse ml-1"></span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Loading indicator */}
              {isLoading && !isTyping && (
                <div className="flex justify-start">
                  <div className={`${currentTheme.bubbleBot} backdrop-blur-lg border ${currentTheme.border} rounded-3xl p-4`}>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Brain size={16} className={`${currentTheme.particle} animate-pulse`} />
                      </div>
                      <div>
                        <p className={`text-sm ${currentTheme.text} font-medium`}>Thinking...</p>
                        <p className={`text-xs ${currentTheme.text} opacity-70`}>Analyzing your question</p>
                      </div>
                    </div>
                    <div className="mt-2 w-full bg-gray-700/30 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full animate-progress"></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className={`border-t ${currentTheme.border} p-4 backdrop-blur-lg bg-black/30`}>
              
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-30"></div>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about courses, subjects, or school info..."
                    className={`w-full px-4 py-3 text-sm ${currentTheme.text} ${currentTheme.placeholder} ${currentTheme.bg} backdrop-blur-sm border ${currentTheme.border} rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent relative`}
                    disabled={isLoading || isTyping}
                  />
                  {input && (
                    <button
                      onClick={() => setInput("")}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${currentTheme.text}/50 hover:${currentTheme.text}`}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading || isTyping}
                  className={`p-3 bg-gradient-to-r ${currentTheme.primary} text-white rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-300/50`}
                  aria-label="Send message"
                >
                  {isLoading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <Send size={20} />
                  )}
                </button>
              </div>
             
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ChatBot;