

import { useState, useEffect, useRef } from "react";
import {
  BookOpen,
  Clock,
  Trophy,
  CheckCircle,
  XCircle,
  BarChart,
  Zap,
  Home,
  ChevronRight,
  Award,
  Target,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Globe,
  HistoryIcon
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
// Categories with icons and question counts
const categories = [
  { 
    id: 'geography', 
    name: 'Geography', 
    color: 'bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#581c87]', 
    icon: '', 
    count: 15 
  },
  { 
    id: 'history', 
    name: 'History', 
    color: 'bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#581c87]', 
    icon: '', 
    count: 15 
  },
  { 
    id: 'chemistry', 
    name: 'Chemistry', 
    color: 'bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#581c87]', 
    icon: '', 
    count: 15 
  },
  { 
    id: 'physics', 
    name: 'Physics', 
    color: 'bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#581c87]', 
    icon: '', 
    count: 15 
  },
  { 
    id: 'biology', 
    name: 'Biology', 
    color: 'bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#581c87]', 
    icon: '', 
    count: 15 
  },
  { 
    id: 'mathematics', 
    name: 'Mathematics', 
    color: 'bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#581c87]', 
    icon: '', 
    count: 15 
  },
  { 
    id: 'general', 
    name: 'General Knowledge', 
    color: 'bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#581c87]', 
    icon: '', 
    count: 12 
  },
];

const quizData = [
  /* ================= GEOGRAPHY (15) ================= */
  { 
    question: "What is geography mainly the study of?",
    options: [
      "Past events",
      "Earth and human activities",
      "Government systems",
      "Living organisms"
    ],
    correctAnswer: "Earth and human activities",
    category: "geography"
  },
  {
    question: "Which layer of the Earth is the hottest?",
    options: ["Crust", "Mantle", "Outer core", "Inner core"],
    correctAnswer: "Inner core",
    category: "geography"
  },
  {
    question: "Which continent is the largest by area?",
    options: ["Africa", "Asia", "Europe", "North America"],
    correctAnswer: "Asia",
    category: "geography"
  },
  {
    question: "What instrument is used to measure atmospheric pressure?",
    options: ["Thermometer", "Barometer", "Anemometer", "Hygrometer"],
    correctAnswer: "Barometer",
    category: "geography"
  },
  {
    question: "Which imaginary line divides the Earth into Northern and Southern hemispheres?",
    options: ["Prime Meridian", "Tropic of Cancer", "Equator", "Longitude"],
    correctAnswer: "Equator",
    category: "geography"
  },
  {
    question: "Which type of rainfall is common in equatorial regions?",
    options: ["Relief rainfall", "Cyclonic rainfall", "Convectional rainfall", "Frontal rainfall"],
    correctAnswer: "Convectional rainfall",
    category: "geography"
  },
  {
    question: "Which climate is found around the equator?",
    options: ["Desert", "Mediterranean", "Tropical rainforest", "Polar"],
    correctAnswer: "Tropical rainforest",
    category: "geography"
  },
  {
    question: "Which ocean is the largest?",
    options: ["Atlantic", "Indian", "Pacific", "Arctic"],
    correctAnswer: "Pacific",
    category: "geography"
  },
  {
    question: "What do contour lines on a map show?",
    options: ["Population", "Vegetation", "Height of land", "Rainfall"],
    correctAnswer: "Height of land",
    category: "geography"
  },
  {
    question: "Which factor mainly affects temperature?",
    options: ["Longitude", "Altitude", "Population", "Soil type"],
    correctAnswer: "Altitude",
    category: "geography"
  },
  {
    question: "What is erosion?",
    options: [
      "Breaking of rocks",
      "Movement of weather",
      "Wearing away of land",
      "Formation of soil"
    ],
    correctAnswer: "Wearing away of land",
    category: "geography"
  },
  {
    question: "Which natural vegetation is found in desert areas?",
    options: ["Forest", "Grassland", "Shrubs and thorny plants", "Mangrove"],
    correctAnswer: "Shrubs and thorny plants",
    category: "geography"
  },
  {
    question: "Which latitude passes through Ethiopia?",
    options: [
      "Tropic of Capricorn",
      "Tropic of Cancer",
      "Equator",
      "Arctic Circle"
    ],
    correctAnswer: "Tropic of Cancer",
    category: "geography"
  },
  {
    question: "What causes day and night?",
    options: [
      "Revolution of Earth",
      "Rotation of Earth",
      "Movement of Moon",
      "Movement of Sun"
    ],
    correctAnswer: "Rotation of Earth",
    category: "geography"
  },
  {
    question: "Which map shows natural features?",
    options: ["Political map", "Physical map", "Economic map", "Population map"],
    correctAnswer: "Physical map",
    category: "geography"
  },

  /* ================= HISTORY (15) ================= */
  {
    question: "What is history?",
    options: [
      "Study of future",
      "Study of past events",
      "Study of geography",
      "Study of science"
    ],
    correctAnswer: "Study of past events",
    category: "history"
  },
  {
    question: "Which source of history is written?",
    options: ["Tools", "Oral tradition", "Books", "Fossils"],
    correctAnswer: "Books",
    category: "history"
  },
  {
    question: "Who was the first Emperor of Ethiopia?",
    options: [
      "Menelik II",
      "Haile Selassie I",
      "Yekuno Amlak",
      "Tewodros II"
    ],
    correctAnswer: "Yekuno Amlak",
    category: "history"
  },
  {
    question: "What was the main purpose of early human tools?",
    options: ["Decoration", "Communication", "Survival", "Religion"],
    correctAnswer: "Survival",
    category: "history"
  },
  {
    question: "Which age came first in human history?",
    options: ["Iron Age", "Bronze Age", "Stone Age", "Modern Age"],
    correctAnswer: "Stone Age",
    category: "history"
  },
  {
    question: "What was the main occupation of early humans?",
    options: ["Farming", "Trading", "Hunting and gathering", "Industry"],
    correctAnswer: "Hunting and gathering",
    category: "history"
  },
  {
    question: "Which empire was ruled by King Menelik II?",
    options: [
      "Aksumite Empire",
      "Zagwe Dynasty",
      "Solomonic Dynasty",
      "Roman Empire"
    ],
    correctAnswer: "Solomonic Dynasty",
    category: "history"
  },
  {
    question: "What is archaeology?",
    options: [
      "Study of languages",
      "Study of ancient tools and remains",
      "Study of politics",
      "Study of maps"
    ],
    correctAnswer: "Study of ancient tools and remains",
    category: "history"
  },
  {
    question: "Which event made Ethiopia famous worldwide in 1896?",
    options: [
      "Battle of Adwa",
      "Italian invasion",
      "Coronation of Haile Selassie",
      "Zemene Mesafint"
    ],
    correctAnswer: "Battle of Adwa",
    category: "history"
  },
  {
    question: "Who led Ethiopia during the Battle of Adwa?",
    options: [
      "Tewodros II",
      "Menelik II",
      "Yohannes IV",
      "Haile Selassie I"
    ],
    correctAnswer: "Menelik II",
    category: "history"
  },
  {
    question: "What was the main aim of colonization in Africa?",
    options: [
      "Education",
      "Trade only",
      "Economic exploitation",
      "Cultural exchange"
    ],
    correctAnswer: "Economic exploitation",
    category: "history"
  },
  {
    question: "Which continent was most affected by colonialism?",
    options: ["Asia", "Europe", "Africa", "Australia"],
    correctAnswer: "Africa",
    category: "history"
  },
  {
    question: "What is oral tradition?",
    options: [
      "Written history",
      "Stories passed by word of mouth",
      "Archaeological evidence",
      "Ancient books"
    ],
    correctAnswer: "Stories passed by word of mouth",
    category: "history"
  },
  {
    question: "Which dynasty built rock-hewn churches in Lalibela?",
    options: [
      "Solomonic",
      "Aksumite",
      "Zagwe",
      "Gondarine"
    ],
    correctAnswer: "Zagwe",
    category: "history"
  },
  {
    question: "Why is history important?",
    options: [
      "To predict weather",
      "To understand the past and learn from it",
      "To study science",
      "To draw maps"
    ],
    correctAnswer: "To understand the past and learn from it",
    category: "history"
  },

  /* ================= CHEMISTRY (15) ================= */
  { question: "What is the atomic number of Oxygen?", options: ["6", "7", "8", "16"], correctAnswer: "8", category: "chemistry" },
  { question: "Which substance is an acid?", options: ["NaOH", "HCl", "Salt", "Water"], correctAnswer: "HCl", category: "chemistry" },
  { question: "What type of change is rusting?", options: ["Physical", "Chemical", "Reversible", "Temporary"], correctAnswer: "Chemical", category: "chemistry" },
  { question: "Which element is a metal?", options: ["Oxygen", "Carbon", "Iron", "Sulfur"], correctAnswer: "Iron", category: "chemistry" },
  { question: "What gas is produced when acid reacts with metal?", options: ["Oxygen", "Hydrogen", "Nitrogen", "Carbon dioxide"], correctAnswer: "Hydrogen", category: "chemistry" },
  { question: "pH less than 7 indicates?", options: ["Base", "Salt", "Acid", "Neutral"], correctAnswer: "Acid", category: "chemistry" },
  { question: "Which is an alkali?", options: ["HCl", "NaOH", "H2SO4", "HNO3"], correctAnswer: "NaOH", category: "chemistry" },
  { question: "Which compound is common salt?", options: ["NaCl", "KCl", "NaOH", "HCl"], correctAnswer: "NaCl", category: "chemistry" },
  { question: "Which process separates insoluble solids from liquid?", options: ["Filtration", "Evaporation", "Distillation", "Sublimation"], correctAnswer: "Filtration", category: "chemistry" },
  { question: "What is the chemical formula of water?", options: ["HO", "H2O", "H2O2", "OH"], correctAnswer: "H2O", category: "chemistry" },
  { question: "Which gas supports combustion?", options: ["Nitrogen", "Carbon dioxide", "Oxygen", "Hydrogen"], correctAnswer: "Oxygen", category: "chemistry" },
  { question: "Which element has symbol Fe?", options: ["Fluorine", "Iron", "Zinc", "Copper"], correctAnswer: "Iron", category: "chemistry" },
  { question: "What type of bond shares electrons?", options: ["Ionic", "Covalent", "Metallic", "Hydrogen"], correctAnswer: "Covalent", category: "chemistry" },
  { question: "Which is a physical change?", options: ["Burning wood", "Rusting iron", "Melting ice", "Cooking food"], correctAnswer: "Melting ice", category: "chemistry" },
  { question: "What happens during evaporation?", options: ["Liquid to gas", "Gas to liquid", "Solid to gas", "Solid to liquid"], correctAnswer: "Liquid to gas", category: "chemistry" },

  /* ================= PHYSICS (15) ================= */
  { question: "What is the SI unit of work?", options: ["Watt", "Newton", "Joule", "Pascal"], correctAnswer: "Joule", category: "physics" },
  { question: "Which law explains action and reaction?", options: ["First law", "Second law", "Third law", "Law of gravity"], correctAnswer: "Third law", category: "physics" },
  { question: "What is acceleration?", options: ["Speed", "Change in velocity", "Distance", "Force"], correctAnswer: "Change in velocity", category: "physics" },
  { question: "Which device measures electric current?", options: ["Voltmeter", "Ammeter", "Barometer", "Thermometer"], correctAnswer: "Ammeter", category: "physics" },
  { question: "What type of energy is stored in food?", options: ["Thermal", "Chemical", "Electrical", "Kinetic"], correctAnswer: "Chemical", category: "physics" },
  { question: "Which mirror forms real images?", options: ["Plane", "Concave", "Convex", "None"], correctAnswer: "Concave", category: "physics" },
  { question: "Speed of light is maximum in?", options: ["Water", "Glass", "Air", "Vacuum"], correctAnswer: "Vacuum", category: "physics" },
  { question: "Unit of power is?", options: ["Joule", "Newton", "Watt", "Ampere"], correctAnswer: "Watt", category: "physics" },
  { question: "Which force opposes motion?", options: ["Gravity", "Magnetism", "Friction", "Electric"], correctAnswer: "Friction", category: "physics" },
  { question: "What is density formula?", options: ["m×v", "m/v", "v/m", "m+v"], correctAnswer: "m/v", category: "physics" },
  { question: "What is kinetic energy related to?", options: ["Height", "Motion", "Temperature", "Mass only"], correctAnswer: "Motion", category: "physics" },
  { question: "Which wave needs medium?", options: ["Light", "Sound", "Radio", "X-ray"], correctAnswer: "Sound", category: "physics" },
  { question: "Unit of voltage?", options: ["Ohm", "Ampere", "Volt", "Watt"], correctAnswer: "Volt", category: "physics" },
  { question: "Which energy causes motion?", options: ["Potential", "Kinetic", "Heat", "Light"], correctAnswer: "Kinetic", category: "physics" },
  { question: "Which color has highest frequency?", options: ["Red", "Blue", "Violet", "Green"], correctAnswer: "Violet", category: "physics" },

  /* ================= BIOLOGY (15) ================= */
  { question: "What carries oxygen in blood?", options: ["Plasma", "Platelets", "Hemoglobin", "White cells"], correctAnswer: "Hemoglobin", category: "biology" },
  { question: "Photosynthesis occurs in?", options: ["Mitochondria", "Nucleus", "Chloroplast", "Ribosome"], correctAnswer: "Chloroplast", category: "biology" },
  { question: "Which organ removes waste from blood?", options: ["Liver", "Kidney", "Lung", "Heart"], correctAnswer: "Kidney", category: "biology" },
  { question: "Which system controls hormones?", options: ["Nervous", "Endocrine", "Digestive", "Respiratory"], correctAnswer: "Endocrine", category: "biology" },
  { question: "Which blood group is universal donor?", options: ["A", "B", "AB", "O"], correctAnswer: "O", category: "biology" },
  { question: "What is respiration?", options: ["Breathing", "Energy release", "Eating", "Excretion"], correctAnswer: "Energy release", category: "biology" },
  { question: "Which organ helps digestion?", options: ["Lung", "Stomach", "Heart", "Brain"], correctAnswer: "Stomach", category: "biology" },
  { question: "Which tissue transports food in plants?", options: ["Xylem", "Phloem", "Cambium", "Cortex"], correctAnswer: "Phloem", category: "biology" },
  { question: "What is fertilization?", options: ["Cell division", "Fusion of gametes", "Growth", "Breathing"], correctAnswer: "Fusion of gametes", category: "biology" },
  { question: "Which vitamin helps blood clot?", options: ["A", "B", "C", "K"], correctAnswer: "K", category: "biology" },
  { question: "Which gas is used in respiration?", options: ["CO2", "O2", "N2", "H2"], correctAnswer: "O2", category: "biology" },
  { question: "Small intestine function?", options: ["Digestion", "Absorption", "Breathing", "Excretion"], correctAnswer: "Absorption", category: "biology" },
  { question: "What is a herbivore?", options: ["Eats meat", "Eats plants", "Eats both", "Eats insects"], correctAnswer: "Eats plants", category: "biology" },
  { question: "Cell division for growth is?", options: ["Meiosis", "Mitosis", "Fusion", "Respiration"], correctAnswer: "Mitosis", category: "biology" },
  { question: "Which organ pumps blood?", options: ["Liver", "Brain", "Heart", "Kidney"], correctAnswer: "Heart", category: "biology" },

  /* ================= MATHEMATICS (15) ================= */
  { question: "Solve: 3² + 4²", options: ["25", "49", "12", "7"], correctAnswer: "25", category: "mathematics" },
  { question: "What is √144?", options: ["10", "11", "12", "13"], correctAnswer: "12", category: "mathematics" },
  { question: "Value of 2³ × 2²?", options: ["16", "32", "8", "64"], correctAnswer: "32", category: "mathematics" },
  { question: "Linear equation has?", options: ["Degree 1", "Degree 2", "Degree 3", "No degree"], correctAnswer: "Degree 1", category: "mathematics" },
  { question: "Area of rectangle formula?", options: ["l+w", "l×w", "2l+2w", "l²"], correctAnswer: "l×w", category: "mathematics" },
  { question: "What is 20% of 250?", options: ["25", "50", "75", "100"], correctAnswer: "50", category: "mathematics" },
  { question: "Triangle angle sum?", options: ["90°", "180°", "360°", "270°"], correctAnswer: "180°", category: "mathematics" },
  { question: "π value?", options: ["3.12", "3.14", "3.41", "3.24"], correctAnswer: "3.14", category: "mathematics" },
  { question: "Simple interest formula?", options: ["PRT", "P+RT", "PR/T", "PR²T"], correctAnswer: "PRT", category: "mathematics" },
  { question: "Solve: 10² − 4²", options: ["84", "96", "64", "100"], correctAnswer: "84", category: "mathematics" },
  { question: "Ratio of 10:5 simplifies to?", options: ["1:2", "2:1", "5:1", "1:5"], correctAnswer: "2:1", category: "mathematics" },
  { question: "Perimeter of square?", options: ["4a", "a²", "2a", "a"], correctAnswer: "4a", category: "mathematics" },
  { question: "What is a prime number?", options: ["Divisible by 2", "Divisible by many", "Only 2 factors", "Even number"], correctAnswer: "Only 2 factors", category: "mathematics" },
  { question: "Solve: 5x = 25", options: ["3", "4", "5", "6"], correctAnswer: "5", category: "mathematics" },
  { question: "Mean of 2,4,6?", options: ["3", "4", "5", "6"], correctAnswer: "4", category: "mathematics" },

  /* ================= GENERAL KNOWLEDGE (12) ================= */
{ question: "Which of the following words is considered a precise synonym for 'exuberant', particularly when describing a person's elevated emotional state?", options: ["Melancholy", "Lethargic", "Jubilant", "Apathetic"], correctAnswer: "Jubilant", category: "general" },
{ question: "In English grammar, which form correctly represents the simple past tense of the irregular verb 'to seek'?", options: ["Seeked", "Sought", "Have sought", "Seeking"], correctAnswer: "Sought", category: "general" },
{ question: "In computer architecture, the Arithmetic Logic Unit (ALU) is a fundamental component of which larger processing unit?", options: ["RAM", "Hard Drive", "Motherboard", "CPU"], correctAnswer: "CPU", category: "general" },
{ question: "The term 'World Wide Web' is best described as a:", options: ["Physical infrastructure of cables", "Global system of interconnected computer networks", "Collection of documents linked by hypertext", "Type of internet service provider"], correctAnswer: "Collection of documents linked by hypertext", category: "general" },
{ question: "Founded in 1886, which Ethiopian city serves as the diplomatic home to the African Union and numerous international organizations?", options: ["Mekele", "Gondar", "Hawassa", "Addis Ababa"], correctAnswer: "Addis Ababa", category: "general" },
{ question: "Which major river system, flowing through eleven countries and emptying into the Mediterranean Sea, is traditionally considered the longest in the world?", options: ["Amazon River", "Yangtze River", "Mississippi-Missouri", "Nile River"], correctAnswer: "Nile River", category: "general" },
{ question: "From a civic responsibility perspective, which behavior most exemplifies being an engaged citizen in a democratic society?", options: ["Avoiding jury duty", "Voting informedly in elections", "Disregarding public policies", "Evading taxation"], correctAnswer: "Voting informedly in elections", category: "general" },
{ question: "The philosophical principle of 'majority rule with protection of minority rights' is a core tenet of which system of government?", options: ["Autocracy", "Oligarchy", "Direct Democracy", "Liberal Democracy"], correctAnswer: "Liberal Democracy", category: "general" },
{ question: "Select the word that is most directly opposite in meaning to 'resilient', indicating a tendency to break or fail under pressure.", options: ["Durable", "Tenacious", "Fragile", "Sturdy"], correctAnswer: "Fragile", category: "general" },
{ question: "In the context of computer hardware, a 'scanner' is categorized as what type of device, as it converts physical data into digital signals?", options: ["Output Device", "Processing Device", "Input Device", "Storage Device"], correctAnswer: "Input Device", category: "general" },
{ question: "The Prime Meridian, running through Greenwich, England, and the 180th meridian primarily divide the Earth into which two hemispheres?", options: ["Northern and Southern", "Temperate and Tropical", "Eastern and Western", "Land and Water"], correctAnswer: "Eastern and Western", category: "general" },
{ question: "In constitutional democracies, a 'civil liberty' such as freedom of speech is best defined as a:", options: ["Privilege granted by the state", "Fundamental right protected from government interference", "Legal obligation of citizens", "Conditional benefit for good behavior"], correctAnswer: "Fundamental right protected from government interference", category: "general" }

];

export default function Grade9() {
  // State management
  const [currentView, setCurrentView] = useState('home');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(60 * 30);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [quizProgress, setQuizProgress] = useState(0);
  const navigate = useNavigate();
  
  const timerRef = useRef(null);
  const questionRef = useRef(null);

  // Get filtered questions based on selected category
  const getFilteredQuestions = () => {
    if (!selectedCategory) {
      return quizData; // Return all questions if no category selected
    }
    
    // Get questions for this category
    const categoryQuestions = quizData
      .filter(q => q.category === selectedCategory);
    
    return categoryQuestions;
  };

  const filteredQuestions = getFilteredQuestions();
  const currentQuestionData = filteredQuestions[currentQuestion];
  const totalQuestions = filteredQuestions.length;

  // Timer effect
  useEffect(() => {
    if (currentView === 'quiz' && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    }
    
    return () => clearInterval(timerRef.current);
  }, [currentView, timeRemaining]);

  // Update progress
  useEffect(() => {
    const progress = ((currentQuestion + 1) / totalQuestions) * 100;
    setQuizProgress(progress);
  }, [currentQuestion, totalQuestions]);

  const handleAnswerSelect = (answer) => {
    if (showAnswer) return;
    
    setSelectedAnswer(answer);
    setShowAnswer(true);
    
    const isCorrect = answer === currentQuestionData.correctAnswer;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    // Check if this question was already answered
    const existingIndex = answeredQuestions.findIndex(
      q => q.question === currentQuestionData.question
    );
    
    if (existingIndex >= 0) {
      // Update existing answer
      const updatedAnswers = [...answeredQuestions];
      updatedAnswers[existingIndex] = {
        question: currentQuestionData.question,
        selected: answer,
        correct: currentQuestionData.correctAnswer,
        isCorrect
      };
      setAnsweredQuestions(updatedAnswers);
    } else {
      // Add new answer
      setAnsweredQuestions(prev => [...prev, {
        question: currentQuestionData.question,
        selected: answer,
        correct: currentQuestionData.correctAnswer,
        isCorrect
      }]);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
      
      // Scroll to top of question
      if (questionRef.current) {
        questionRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
      
      // Scroll to top of question
      if (questionRef.current) {
        questionRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleStartQuiz = (categoryId = null) => {
    setSelectedCategory(categoryId);
    setCurrentView('quiz');
    setCurrentQuestion(0);
    setScore(0);
    setTimeRemaining(60 * 30);
    setAnsweredQuestions([]);
    setQuizProgress(0);
    setSelectedAnswer(null);
    setShowAnswer(false);
  };

  const handleFinishQuiz = () => {
    setCurrentView('results');
    clearInterval(timerRef.current);
  };

  const handleRestart = () => {
    setCurrentView('home');
    setSelectedCategory(null);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Check if current question has been answered
  const getCurrentQuestionAnswer = () => {
    return answeredQuestions.find(
      q => q.question === currentQuestionData?.question
    );
  };

  // Get selected category info
  const getSelectedCategoryInfo = () => {
    if (!selectedCategory) return null;
    return categories.find(cat => cat.id === selectedCategory);
  };

  // Home Screen
  if (currentView === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
        



       <div className="fixed left-2 sm:left-4 top-2 sm:top-4 z-20">
                    <button
                      onClick={() => navigate('/studentstudy-dashboard')}
                      className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                      aria-label="Go back"
                    >
                      <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
                    </button>
                  </div> 
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2 mt-16">
              
              Choose Your Subject
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <button
                onClick={() => handleStartQuiz()}
                className="bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#581c87] text-white rounded-xl p-6 text-left shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl"></span>
                  <ChevronRight className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">All Subjects</h3>
              
              </button>

              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleStartQuiz(category.id)}
                  className={`${category.color} text-white rounded-xl p-6 text-left shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{category.icon}</span>
                    <ChevronRight className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                  {/* <p className="opacity-90">{category.count} questions</p> */}
                </button>
              ))}
            </div>
          </div>

        
        </div>
      </div>
    );
  }

  // Quiz Screen
  if (currentView === 'quiz') {
    const currentAnswer = getCurrentQuestionAnswer();
    const isLastQuestion = currentQuestion === totalQuestions - 1;
    const categoryInfo = getSelectedCategoryInfo();

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Progress Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  {categoryInfo && (
                    <span className="text-2xl">{categoryInfo.icon}</span>
                  )}
                  <h1 className="text-2xl font-bold text-gray-800">
                    {selectedCategory ? categoryInfo?.name : 'All Subjects'}
                  </h1>
                </div>
                <p className="text-gray-600">Question {currentQuestion + 1} of {totalQuestions}</p>
              </div>
              
              <div className="flex items-center gap-6 mt-4 md:mt-0">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="font-mono font-bold text-lg">{formatTime(timeRemaining)}</span>
                </div>
                
               
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                    Progress
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-600">
                    {Math.round(quizProgress)}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-200">
                <div
                  style={{ width: `${quizProgress}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                />
              </div>
            </div>
          </div>

          {/* Question Card */}
          <div 
            ref={questionRef}
            className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100"
          >
            <div className="mb-6">
              <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full mb-4">
                Question {currentQuestion + 1}
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 leading-relaxed">
                {currentQuestionData?.question}
              </h2>
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestionData?.options.map((option, index) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = option === currentQuestionData.correctAnswer;
                const isAnswered = currentAnswer?.selected === option;
                
                let optionStyle = "p-4 rounded-xl border-2 transition-all duration-300 ";
                
                if (showAnswer || currentAnswer) {
                  if (isCorrect) {
                    optionStyle += "bg-green-50 border-green-500 shadow-lg";
                  } else if ((isSelected || isAnswered) && !isCorrect) {
                    optionStyle += "bg-red-50 border-red-500";
                  } else {
                    optionStyle += "border-gray-200";
                  }
                } else {
                  optionStyle += "border-gray-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer hover:shadow-md";
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={showAnswer || currentAnswer}
                    className={optionStyle}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold
                        ${showAnswer || currentAnswer
                          ? isCorrect 
                            ? 'bg-green-100 text-green-600' 
                            : (isSelected || isAnswered) && !isCorrect
                              ? 'bg-red-100 text-red-600'
                              : 'bg-gray-100 text-gray-600'
                          : 'bg-blue-100 text-blue-600'
                        }`}
                      >
                        {String.fromCharCode(65 + index)}
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-medium">{option}</p>
                      </div>
                      {(showAnswer || currentAnswer) && isCorrect && (
                        <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                      )}
                      {(showAnswer || currentAnswer) && (isSelected || isAnswered) && !isCorrect && (
                        <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Feedback */}
            {(showAnswer || currentAnswer) && (
              <div className={`mt-6 p-4 rounded-xl animate-pulse-once ${
                (currentAnswer?.isCorrect || selectedAnswer === currentQuestionData.correctAnswer) 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center gap-3">
                  {(currentAnswer?.isCorrect || selectedAnswer === currentQuestionData.correctAnswer) ? (
                    <>
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <div>
                        <p className="font-bold text-green-700">Correct!</p>
                        <p className="text-green-600">Well done! You're on fire! 🔥</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-6 h-6 text-red-600" />
                      <div>
                        <p className="font-bold text-red-700">Incorrect</p>
                        <p className="text-red-600">
                          The correct answer is: <span className="font-bold">{currentQuestionData.correctAnswer}</span>
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={handleRestart}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <Home className="w-5 h-5" />
                Exit Quiz
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Previous Button */}
              <button
                onClick={handlePrevQuestion}
                disabled={currentQuestion === 0}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-colors ${
                  currentQuestion === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </button>

              {/* Question Counter */}
              <div className="text-sm text-gray-600 font-medium">
                {currentQuestion + 1} / {totalQuestions}
              </div>

              {/* Next/Finish Button */}
              <button
                onClick={isLastQuestion ? handleFinishQuiz : handleNextQuestion}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg"
              >
                {isLastQuestion ? 'Finish Quiz' : 'Next'}
                {!isLastQuestion && <ChevronRightIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Question Navigation Dots */}
          

          {/* Category Info */}
          {categoryInfo && (
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow">
                <span className="text-xl">{categoryInfo.icon}</span>
                <span className="font-medium">{categoryInfo.name} Exam</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-600">{totalQuestions} questions</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Results Screen
  if (currentView === 'results') {
    const percentage = Math.round((score / totalQuestions) * 100);
    const performance = percentage >= 80 ? 'Excellent' : 
                       percentage >= 60 ? 'Good' : 
                       percentage >= 40 ? 'Average' : 'Needs Improvement';
    const categoryInfo = getSelectedCategoryInfo();

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-6">
              <Trophy className="w-16 h-16 text-yellow-500" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Quiz Completed!</h1>
            {categoryInfo && (
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-white rounded-full shadow-lg mb-4">
                <span className="text-2xl">{categoryInfo.icon}</span>
                <span className="font-bold text-lg">{categoryInfo.name} Exam Results</span>
              </div>
            )}
            <p className="text-gray-600 text-lg">Here's how you performed</p>
          </div>

          {/* Score Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-600 mb-2">{score}/{totalQuestions}</div>
                <p className="text-gray-600">Correct Answers</p>
              </div>
              
              <div className="text-center">
                <div className="text-5xl font-bold text-purple-600 mb-2">{percentage}%</div>
                <p className="text-gray-600">Success Rate</p>
              </div>
              
              <div className="text-center">
                <div className="text-5xl font-bold text-green-600 mb-2">{performance}</div>
                <p className="text-gray-600">Performance</p>
              </div>
            </div>
            
            {/* Performance Circle */}
            <div className="relative w-48 h-48 mx-auto my-8">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${percentage * 2.83} 283`}
                  transform="rotate(-90 50 50)"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
                <text
                  x="50"
                  y="50"
                  textAnchor="middle"
                  dy="7"
                  fontSize="20"
                  fontWeight="bold"
                  fill="#374151"
                >
                  {percentage}%
                </text>
              </svg>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <BarChart className="w-6 h-6" />
              Detailed Breakdown
            </h2>
            
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {answeredQuestions.map((item, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border ${
                    item.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      item.isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium mb-2">{item.question}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">Your Answer:</span>
                          <span className={item.isCorrect ? 'text-green-600' : 'text-red-600'}>
                            {item.selected}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">Correct Answer:</span>
                          <span className="text-green-600">{item.correct}</span>
                        </div>
                      </div>
                    </div>
                    {item.isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleRestart}
              className="flex-1 max-w-md bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all shadow-lg"
            >
              <Home className="inline-block mr-2 w-6 h-6" />
              Back to Home
            </button>
            
            <button
              onClick={() => handleStartQuiz(selectedCategory)}
              className="flex-1 max-w-md bg-white text-blue-600 py-4 rounded-xl font-bold text-lg border-2 border-blue-600 hover:bg-blue-50 transition-all shadow-lg"
            >
              <Award className="inline-block mr-2 w-6 h-6" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }
}