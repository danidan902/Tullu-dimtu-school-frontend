

import { ChevronLeft } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Using simple emoji icons as fallback to avoid import issues
const SubjectButton = ({ subject, currentSubject, onClick }) => {
  const getIcon = (subjectId) => {
    const icons = {
      physics: '',
      chemistry: '',
      mathematics: '',
      english: '',
      biology: '',
      history: '',
      economics: '',
      geography: ''
    };
    return icons[subjectId] || '';
  };

  const getColorClasses = (subjectId, isActive) => {
    const colorMap = {
      physics: isActive 
        ? 'ring-4 ring-purple-300 bg-purple-100 text-purple-800 border-purple-300' 
        : 'bg-white text-gray-800 border-gray-200',
      chemistry: isActive 
        ? 'ring-4 ring-blue-300 bg-blue-100 text-blue-800 border-blue-300' 
        : 'bg-white text-gray-800 border-gray-200',
      mathematics: isActive 
        ? 'ring-4 ring-green-300 bg-green-100 text-green-800 border-green-300' 
        : 'bg-white text-gray-800 border-gray-200',
      english: isActive 
        ? 'ring-4 ring-red-300 bg-red-100 text-red-800 border-red-300' 
        : 'bg-white text-gray-800 border-gray-200',
      biology: isActive 
        ? 'ring-4 ring-emerald-300 bg-emerald-100 text-emerald-800 border-emerald-300' 
        : 'bg-white text-gray-800 border-gray-200',
      history: isActive 
        ? 'ring-4 ring-amber-300 bg-amber-100 text-amber-800 border-amber-300' 
        : 'bg-white text-gray-800 border-gray-200',
      economics: isActive 
        ? 'ring-4 ring-indigo-300 bg-indigo-100 text-indigo-800 border-indigo-300' 
        : 'bg-white text-gray-800 border-gray-200',
      geography: isActive 
        ? 'ring-4 ring-cyan-300 bg-cyan-100 text-cyan-800 border-cyan-300' 
        : 'bg-white text-gray-800 border-gray-200'
    };
    return colorMap[subjectId] || colorMap.physics;
  };

  const isActive = currentSubject === subject.id;

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${getColorClasses(subject.id, isActive)}`}
    >
      <span className="text-2xl mb-2">{getIcon(subject.id)}</span>
      <span className="font-semibold">{subject.name}</span>
      <span className="text-sm text-gray-500 mt-1">
        {subject.questionCount} questions
      </span>
    </button>
  );
};

const ProgressBar = ({ progress }) => (
  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
    <div 
      className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
      style={{ width: `${progress}%` }}
    ></div>
  </div>
);

const AnswerOption = ({ option, index, isSelected, isCorrect, onClick }) => {
  const letters = ['A', 'B', 'C', 'D'];
  
  return (
    <button
      onClick={() => onClick(index)}
      className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-300 hover:scale-101 ${
        isSelected 
          ? isCorrect
            ? 'bg-green-100 border-green-500 ring-2 ring-green-300'
            : 'bg-red-100 border-red-500 ring-2 ring-red-300'
          : 'bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50'
      }`}
    >
      <div className="flex items-center">
        <div className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 ${
          isSelected 
            ? isCorrect
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
            : 'bg-gray-200 text-gray-700'
        }`}>
          {letters[index]}
        </div>
        <span className="flex-1">{option}</span>
        {isSelected && (
          <div className="ml-2">
            {isCorrect ? (
              <span className="text-green-600 text-2xl">✓</span>
            ) : (
              <span className="text-red-600 text-2xl">✗</span>
            )}
          </div>
        )}
      </div>
    </button>
  );
};

const EthiopianGrade11Quiz = () => {
  const [currentSubject, setCurrentSubject] = useState('physics');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(3600);
  const [quizHistory, setQuizHistory] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());

   const navigate = useNavigate();
  // Subjects configuration
  const subjects = [
    { id: 'physics', name: 'Physics', questionCount: 20 },
    { id: 'chemistry', name: 'Chemistry', questionCount: 20 },
    { id: 'mathematics', name: 'Mathematics', questionCount: 20 },
    { id: 'english', name: 'English', questionCount: 20 },
    { id: 'biology', name: 'Biology', questionCount: 20 },
    { id: 'history', name: 'History', questionCount: 20 },
    { id: 'economics', name: 'Economics', questionCount: 20 },
    { id: 'geography', name: 'Geography', questionCount: 20 }
  ];

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !showScore) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleSubmit();
    }
  }, [timeLeft, showScore]);

  // Format time display
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Sample quiz data - replace with your actual 20 questions per subject



  // Advanced Grade 11 Questions - 20 for each subject
  const quizData = {
    physics: Array.from({ length: 20 }, (_, i) => ({
      question: [
        "A proton moving with velocity 10⁶ m/s enters magnetic field 0.5T at 30°. Force experienced is:",
        "A projectile has range R. If projected at 45°-θ, range becomes:",
        "The ratio of radii of gyration of solid sphere and hollow sphere about diameter is:",
        "A capacitor stores 0.02J at 100V. Its capacitance is:",
        "The de Broglie wavelength of electron in first Bohr orbit is:",
        "In Young's experiment, if one slit is covered by glass (μ=1.5), fringe pattern:",
        "A transformer has 100 primary turns and 200 secondary turns. If input is 50V AC, output is:",
        "The work function of metal is 2eV. Threshold frequency is:",
        "A particle executes SHM with amplitude A. KE equals PE when displacement is:",
        "The resistance of semiconductor decreases with temperature because:",
        "A wire stretches 2mm under load. If radius doubled, extension becomes:",
        "The speed of sound in hydrogen at STP is 1270 m/s. In oxygen at same temperature:",
        "A convex lens (f=20cm) and concave lens (f=10cm) are combined. Power is:",
        "The half-life of radioactive element is 10 days. Time for 87.5% decay:",
        "A p-n junction diode conducts when:",
        "The torque on current loop in magnetic field is maximum when:",
        "A satellite orbits Earth at height where g'=g/4. Its orbital speed is:",
        "The energy gap in semiconductor is 1eV. It is transparent to wavelength:",
        "A fluid flows through pipe of varying diameter. Where velocity is maximum:",
        "The magnetic moment of current loop depends on:"
      ][i],
      options: [
        ["4×10⁻¹⁴ N", "8×10⁻¹⁴ N", "6.4×10⁻¹⁴ N", "2×10⁻¹⁴ N"],
        ["R cos2θ", "R sin2θ", "R cos²θ", "R sin²θ"],
        ["√(2/3)", "√(3/5)", "√(5/3)", "√(3/2)"],
        ["4μF", "2μF", "1μF", "0.5μF"],
        ["λ=2πr₁", "λ=πr₁", "λ=4πr₁", "λ=r₁"],
        ["Shifts", "Disappears", "Contrast changes", "No change"],
        ["100V", "25V", "200V", "400V"],
        ["4.84×10¹⁴ Hz", "9.68×10¹⁴ Hz", "2.42×10¹⁴ Hz", "1.21×10¹⁴ Hz"],
        ["A/√2", "A/2", "A/√3", "A/3"],
        ["Electron-hole pairs increase", "Band gap decreases", "Mobility increases", "Resistivity decreases"],
        ["0.5mm", "1mm", "0.25mm", "0.125mm"],
        ["317.5 m/s", "635 m/s", "2540 m/s", "895 m/s"],
        ["+15D", "-5D", "+5D", "-15D"],
        ["30 days", "20 days", "15 days", "40 days"],
        ["Forward biased", "Reverse biased", "Unbiased", "Always"],
        ["Plane parallel to field", "Plane perpendicular to field", "At 45°", "At 30°"],
        ["√(gR/4)", "√(gR/2)", "√(2gR)", "√(gR)"],
        ["1240 nm", "620 nm", "2480 nm", "310 nm"],
        ["Where diameter is minimum", "Where diameter is maximum", "At center", "Everywhere same"],
        ["Current, area, number of turns", "Current only", "Area only", "Number of turns only"]
      ][i],
      correct: [2, 0, 2, 0, 0, 0, 1, 0, 0, 0, 3, 0, 2, 0, 0, 1, 1, 0, 0, 0][i],
      explanation: [
        "F = qvBsinθ = (1.6×10⁻¹⁹)(10⁶)(0.5)(0.5) = 4×10⁻¹⁴ N",
        "R = (u²sin(90°-2θ))/g = Rcos2θ",
        "K² = 2/5 R² (solid), 2/3 R² (hollow). Ratio = √(3/5)",
        "E = ½CV² => C = 2E/V² = 0.04/10000 = 4×10⁻⁶ F = 4μF",
        "According to Bohr's postulate: 2πr = nλ",
        "Path difference changes due to glass, shifting fringes",
        "V₂/V₁ = N₂/N₁ = 200/100 = 2 => V₂ = 25V (step-down behavior)",
        "Φ = hν₀ => ν₀ = Φ/h = (2×1.6×10⁻¹⁹)/(6.63×10⁻³⁴) = 4.84×10¹⁴ Hz",
        "Total energy E = ½kA². When KE=PE, each = E/2. ½kx² = ¼kA² => x = A/√2",
        "Thermal energy creates more charge carriers in semiconductors",
        "Extension ∝ 1/r². If radius doubles, extension becomes 1/4 of original",
        "v ∝ 1/√M. M(O₂)/M(H₂)=16 => v(O₂)=1270/4=317.5 m/s",
        "P = P₁ + P₂ = 1/0.2 + (-1/0.1) = 5 - 10 = -5D",
        "87.5% decay = 7/8 decay = 3 half-lives = 30 days",
        "Diode conducts only when forward biased (p-side positive)",
        "τ = NIABsinθ, maximum when θ=90° (plane perpendicular to field)",
        "v = √(g'r) = √((g/4)R) = √(gR/2) (r=R+h)",
        "E = hc/λ => λ = 1240 nm for E=1eV",
        "According to equation of continuity, Av = constant",
        "Magnetic moment μ = NIA"
      ][i]
    })),
    
    chemistry: Array.from({ length: 20 }, (_, i) => ({
      question: [
        "For the reaction 2SO₂(g) + O₂(g) ⇌ 2SO₃(g), Kp = 2.5 × 10¹⁰ at 500K. What is Kc?",
        "Which complex shows geometrical isomerism?",
        "The IUPAC name of CH₃-CH=CH-CHO is:",
        "In Haber process for ammonia synthesis, optimal conditions are:",
        "The pH of 0.01M NH₄Cl solution (Kb for NH₃ = 1.8×10⁻⁵) is approximately:",
        "The oxidation state of Cr in CrO₅ is:",
        "Which is not a colligative property?",
        "The rate constant of first order reaction is 2×10⁻³ s⁻¹. Time for 75% completion:",
        "The hybridisation of Xe in XeF₄ is:",
        "Which has highest boiling point?",
        "The number of isomers for C₄H₈O (aldehydes and ketones) is:",
        "In electrolysis of aqueous CuSO₄ using Cu electrodes, what happens?",
        "The bond order in O₂²⁻ is:",
        "Which quantum number determines orbital shape?",
        "The standard electrode potential of hydrogen electrode is taken as:",
        "The crystal structure of NaCl is:",
        "Which is strongest reducing agent?",
        "The reagent used in Tollen's test is:",
        "The coordination number in body centered cubic structure is:",
        "Which shows optical isomerism?"
      ][i],
      options: [
        ["6.1 × 10¹²", "4.1 × 10¹⁴", "1.0 × 10¹⁰", "2.5 × 10¹⁰"],
        ["[Pt(NH₃)₂Cl₂]", "[Co(NH₃)₆]³⁺", "[Ni(CO)₄]", "[PtCl₄]²⁻"],
        ["But-2-enal", "3-Butenal", "But-2-en-1-al", "1-Buten-3-al"],
        ["450°C, 200 atm, Fe catalyst", "500°C, 100 atm, Ni catalyst", "400°C, 300 atm, Pt catalyst", "350°C, 150 atm, Cu catalyst"],
        ["5.63", "6.63", "3.63", "8.37"],
        ["+6", "+5", "+10", "+8"],
        ["Osmotic pressure", "Elevation in boiling point", "Viscosity", "Depression in freezing point"],
        ["693 s", "1386 s", "346.5 s", "173.2 s"],
        ["sp³d", "sp³d²", "sp³", "sp³d³"],
        ["CH₃CH₂OH", "CH₃OCH₃", "CH₃CH₂CH₃", "CH₃CHO"],
        ["4", "5", "6", "3"],
        ["Cu deposits at cathode", "O₂ evolves at anode", "Cu anode dissolves", "All of these"],
        ["1", "2", "1.5", "0"],
        ["Principal", "Azimuthal", "Magnetic", "Spin"],
        ["0.00 V", "1.00 V", "-1.00 V", "0.76 V"],
        ["Face centered cubic", "Body centered cubic", "Simple cubic", "Hexagonal"],
        ["Li", "Na", "K", "Cs"],
        ["Ammoniacal AgNO₃", "Fehling's solution", "Benedict's reagent", "Schiff's reagent"],
        ["8", "6", "12", "4"],
        ["[Co(en)₃]³⁺", "[Co(NH₃)₆]³⁺", "[Ni(CO)₄]", "[PtCl₄]²⁻"]
      ][i],
      correct: [0, 0, 0, 0, 0, 0, 2, 0, 1, 0, 0, 3, 0, 1, 0, 0, 0, 0, 0, 0][i],
      explanation: [
        "Kp = Kc(RT)^Δn. Δn = -1, T=500K. Kc = Kp(RT) = 2.5×10¹⁰ × (0.0821×500) ≈ 6.1×10¹²",
        "[Pt(NH₃)₂Cl₂] is square planar and shows cis-trans isomerism",
        "Principal functional group is aldehyde (-al suffix), double bond at position 2",
        "Industrial conditions: 450-500°C, 150-200 atm, iron catalyst with promoters",
        "For salt of weak base: pH = 7 - 1/2 pKb - 1/2 log C = 7 - 2.37 - 1 = 5.63",
        "CrO₅ has peroxide linkages: Cr + 4(-1) + 1(-2) = 0 => Cr = +6",
        "Viscosity depends on intermolecular forces, not number of particles",
        "t = (2.303/k) log(1/(1-0.75)) = (2.303/0.002) log4 = 693 s",
        "XeF₄ has 6 electron pairs (4 bonding + 2 lone) => sp³d²",
        "Ethanol has hydrogen bonding, highest boiling point",
        "Aldehydes: butanal, 2-methylpropanal; Ketones: butanone, cyclobutanone",
        "All processes occur: Cu²⁺ + 2e⁻ → Cu at cathode, Cu → Cu²⁺ + 2e⁻ at anode",
        "O₂²⁻ has 18 electrons: σ1s² σ*1s² σ2s² σ*2s² σ2pz² π2px² π2py² π*2px² π*2py² => bond order = 1",
        "Azimuthal quantum number (l) determines orbital shape",
        "Standard hydrogen electrode potential is defined as 0.00 V",
        "NaCl has face centered cubic structure with Cl⁻ at corners and face centers",
        "Li has most negative E° value (-3.04V), strongest reducing agent",
        "Tollen's reagent is ammoniacal silver nitrate",
        "BCC has coordination number 8 (each atom touches 8 neighbors)",
        "[Co(en)₃]³⁺ has non-superimposable mirror images"
      ][i]
    })),
    
    mathematics: Array.from({ length: 20 }, (_, i) => ({
      question: [
        "∫(0 to π/2) sin³x cos²x dx equals:",
        "The number of 5-digit numbers divisible by 3 using digits 0,1,2,3,4,5 without repetition is:",
        "If |z - 3| = |z - 3i|, then locus of z is:",
        "The solution of differential equation y' + y tan x = sec x is:",
        "Probability that in a random arrangement of letters of 'ETHIOPIA', vowels occupy even places is:",
        "The value of lim(x→0) (sin x - x)/x³ is:",
        "The area bounded by y² = 4ax and its latus rectum is:",
        "If A and B are independent events with P(A)=0.3, P(B)=0.4, then P(A'∩B') is:",
        "The equation of plane through (1,2,3) and perpendicular to line (x-1)/2 = (y-2)/-3 = (z-3)/4 is:",
        "The general solution of sin²x dx + cos²y dy = 0 is:",
        "If matrix A is such that A² = A, then (I + A)³ - 7A equals:",
        "The distance between parallel lines 3x+4y=12 and 6x+8y=15 is:",
        "The number of real solutions of |x² - 4x + 3| = 1 is:",
        "If f(x) = x³ - 3x² + 2x, then f(f(x)) = 0 has how many real roots?",
        "The value of ∑(r=1 to n) r(r+1)(r+2) is:",
        "If the circles x²+y²+2ax+c=0 and x²+y²+2by+c=0 touch, then:",
        "The period of f(x) = |sin x| + |cos x| is:",
        "If vectors a, b, c are coplanar, then [a+b b+c c+a] =",
        "The probability distribution of X is given by P(X=k)=C/2^k for k=1,2,3,... Then C=",
        "The minimum value of 2x² + 3y² - 4x - 12y + 18 is:"
      ][i],
      options: [
        ["2/15", "2/35", "8/15", "4/15"],
        ["216", "120", "96", "240"],
        ["y = x", "x + y = 3", "x - y = 0", "y = -x"],
        ["y = sin x + C cos x", "y = cos x + C sin x", "y = x sec x + C", "y = sec x + C tan x"],
        ["1/14", "2/7", "3/14", "1/7"],
        ["-1/6", "1/6", "0", "1/3"],
        ["(8/3)a²", "(4/3)a²", "2a²", "a²"],
        ["0.42", "0.28", "0.12", "0.18"],
        ["2x - 3y + 4z = 20", "2x - 3y + 4z = 8", "x + 2y + 3z = 14", "x - y + z = 2"],
        ["tan x + cot y = C", "cot x - tan y = C", "tan x - cot y = C", "sin x + cos y = C"],
        ["I", "A", "I - A", "7A"],
        ["3/10", "3/5", "9/10", "6/5"],
        ["2", "3", "4", "1"],
        ["5", "7", "3", "4"],
        ["n(n+1)(n+2)(n+3)/4", "n(n+1)(n+2)/3", "n(n+1)(2n+1)/6", "n(n+1)/2"],
        ["1/a² + 1/b² = 1/c", "1/a + 1/b = 1/c", "1/a² + 1/b² = 1/c²", "a² + b² = c²"],
        ["π/2", "π", "2π", "π/4"],
        ["0", "2[a b c]", "[a b c]", "3[a b c]"],
        ["1/2", "1", "2", "1/3"],
        ["4", "5", "6", "7"]
      ][i],
      correct: [1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 2, 2, 1, 0, 2, 1, 1, 1, 0][i],
      explanation: [
        "Using reduction formula or beta function: B(2, 3/2)/2 = (Γ(2)Γ(3/2))/(2Γ(7/2)) = 2/35",
        "Sum of all digits = 15 (divisible by 3). Total numbers = 5! = 120 excluding 0 at first place: 4×4! = 96. Total = 120+96 = 216",
        "Let z = x+iy. |(x-3)+iy| = |x+i(y-3)| ⇒ (x-3)²+y² = x²+(y-3)² ⇒ x = y",
        "Integrating factor = e^{∫tan x dx} = sec x. Solution: y sec x = ∫sec² x dx = tan x + C ⇒ y = sin x + C cos x",
        "Total letters=8, vowels=5 (E,I,O,I,A). Even places=4. Favorable arrangements = (5P4 × 4!)/2! (for I repetition). Probability = (2880/2)/(20160/2) = 1/14",
        "Using expansion: sin x = x - x³/6 + ... ⇒ (sin x - x)/x³ → -1/6",
        "Area = 2∫(0 to a) 2√(ax) dx = 4√a × (2/3)x^(3/2)|₀ᵃ = (8/3)a²",
        "P(A'∩B') = P(A')P(B') = 0.7 × 0.6 = 0.42",
        "Direction ratios of normal are 2,-3,4. Equation: 2(x-1)-3(y-2)+4(z-3)=0 ⇒ 2x-3y+4z=8",
        "Separating variables: ∫sin²x dx = -∫cos²y dy ⇒ (x/2 - sin2x/4) = -(y/2 + sin2y/4) + C ⇒ tan x - cot y = C",
        "(I+A)³ = I + 3A + 3A² + A³ = I + 3A + 3A + A = I + 7A ⇒ (I+A)³ - 7A = I",
        "Distance = |c₂ - c₁|/√(a²+b²) = |15/2 - 12|/√(9+16) = (15-24)/10 = 9/10",
        "x²-4x+3 = ±1 gives x²-4x+2=0 and x²-4x+4=0. First gives 2 real, second gives 1 real (repeated) ⇒ total 4",
        "f(x)=x(x-1)(x-2)=0 ⇒ x=0,1,2. f(f(x))=0 ⇒ f(x)=0,1,2. Each gives 3 solutions ⇒ total 7",
        "∑r(r+1)(r+2) = ∑(r³+3r²+2r) = [n(n+1)/2]² + 3n(n+1)(2n+1)/6 + 2n(n+1)/2 = n(n+1)(n+2)(n+3)/4",
        "Centers: (-a,0) and (0,-b). Distance = √(a²+b²). Radii = √(a²-c) and √(b²-c). For touching: √(a²+b²) = √(a²-c) + √(b²-c) ⇒ 1/a² + 1/b² = 1/c²",
        "f(x+π/2) = |sin(x+π/2)| + |cos(x+π/2)| = |cos x| + |-sin x| = f(x). Period = π/2",
        "[a+b b+c c+a] = 2[a b c] (using properties of scalar triple product)",
        "∑(k=1 to ∞) C/2^k = C(1/2)/(1-1/2) = C = 1 ⇒ C=1",
        "Complete squares: 2(x-1)² + 3(y-2)² + 4 ≥ 4"
      ][i]
    })),
    
    english: Array.from({ length: 20 }, (_, i) => ({
      question: [
        "Which sentence uses the subjunctive mood correctly?",
        "Identify the figure of speech: 'The world is a stage.'",
        "The phrase 'kick the bucket' is an example of:",
        "Which is the correct passive voice of: 'They are building a new bridge.'",
        "Identify the dangling modifier: 'Walking to school, the rain started.'",
        "Which sentence has correct subject-verb agreement?",
        "The word 'antidisestablishmentarianism' contains:",
        "Identify the type of clause: 'What you said is true.'",
        "Which is an example of synecdoche?",
        "The rhetorical appeal that relies on credibility is:",
        "Which sentence uses 'whom' correctly?",
        "Identify the tense: 'I will have been working for six hours.'",
        "The literary device in 'The pen is mightier than the sword' is:",
        "Which is an example of litotes?",
        "Identify the sentence with correct parallel structure:",
        "The word 'literally' is often misused as:",
        "Which is an example of zeugma?",
        "Identify the mood: 'If I were you, I would study.'",
        "Which sentence contains a split infinitive?",
        "The difference between 'affect' and 'effect' is:"
      ][i],
      options: [
        ["I suggest that he be here on time.", "I suggest that he is here on time.", "I suggest him to be here on time.", "I suggest he being here on time."],
        ["Simile", "Metaphor", "Personification", "Hyperbole"],
        ["Euphemism", "Idiom", "Cliché", "All of these"],
        ["A new bridge is being built by them.", "A new bridge was built by them.", "A new bridge has been built by them.", "A new bridge is built by them."],
        ["Walking to school, the rain started.", "While walking to school, it started to rain.", "As I walked to school, the rain started.", "Walking to school, I got caught in the rain."],
        ["Either the students or the teacher are responsible.", "Either the students or the teacher is responsible.", "Neither the students nor the teacher are responsible.", "Each of the students are responsible."],
        ["Prefix, root, and suffix", "Multiple morphemes", "Both A and B", "Neither A nor B"],
        ["Noun clause", "Adjective clause", "Adverb clause", "Independent clause"],
        ["All hands on deck.", "He's a real Romeo.", "Time flies.", "Break a leg."],
        ["Ethos", "Pathos", "Logos", "Kairos"],
        ["Whom did you see?", "Who did you see?", "To who did you speak?", "Whom is going?"],
        ["Future perfect continuous", "Future perfect", "Future continuous", "Present perfect continuous"],
        ["Metonymy", "Synecdoche", "Metaphor", "Simile"],
        ["He's not the brightest bulb.", "He's very intelligent.", "He's as smart as Einstein.", "His intelligence knows no bounds."],
        ["She likes cooking, jogging, and to read.", "She likes to cook, jog, and read.", "She likes cooking, jogging, and reading.", "Both B and C"],
        ["Figuratively", "Actually", "Really", "Truly"],
        ["He lost his coat and his temper.", "Time and tide wait for none.", "She broke his car and his heart.", "Both A and C"],
        ["Indicative", "Imperative", "Subjunctive", "Conditional"],
        ["To quickly run is his goal.", "He wants to run quickly.", "Running quickly is his goal.", "He quickly runs."],
        ["Affect is a verb, effect is a noun", "Affect is a noun, effect is a verb", "They're interchangeable", "Both can be verbs"]
      ][i],
      correct: [0, 1, 3, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 3, 0, 3, 2, 0, 0][i],
      explanation: [
        "Subjunctive mood uses base form of verb: 'that he be'",
        "'World is a stage' is a metaphor (direct comparison)",
        "'Kick the bucket' is an idiom, euphemism for death, and a cliché",
        "Present continuous passive: is/am/are + being + past participle",
        "The modifier 'walking to school' has no clear subject to modify",
        "With 'either...or', verb agrees with nearer subject: teacher is",
        "Anti-dis-establish-ment-arian-ism: 6 morphemes (prefix+root+suffix)",
        "'What you said' functions as a noun (subject of 'is')",
        "'Hands' represents whole sailors/crew - part for whole",
        "Ethos = credibility, Pathos = emotion, Logos = logic",
        "'Whom' is object pronoun; 'who' is subject pronoun",
        "Future perfect continuous: will + have + been + present participle",
        "'Pen' represents writing, 'sword' represents violence - metonymy",
        "Litotes uses understatement via negation: 'not the brightest'",
        "Parallel structure requires same grammatical form",
        "'Literally' means actually; often misused for emphasis",
        "Zeugma uses one verb with two objects in different senses",
        "'If I were' shows subjunctive mood for hypothetical",
        "'To quickly run' splits infinitive 'to run' with adverb",
        "Generally: affect (verb), effect (noun); both have exceptions"
      ][i]
    })),
    
    biology: Array.from({ length: 20 }, (_, i) => ({
      question: [
        "During DNA replication, Okazaki fragments are formed on:",
        "The Hardy-Weinberg principle requires all EXCEPT:",
        "Which process occurs in both photosynthesis and respiration?",
        "Restriction endonucleases are used in genetic engineering because they:",
        "The plant hormone responsible for apical dominance is:",
        "The correct sequence in photosynthesis is:",
        "Which is NOT a characteristic of living things?",
        "The function of tRNA is to:",
        "Crossing over occurs during:",
        "The theory of natural selection was proposed by:",
        "DNA replication is:",
        "Which is NOT a function of the liver?",
        "The site of protein synthesis is:",
        "Which blood vessels carry oxygenated blood?",
        "The process of conversion of NO₂ to N₂ is called:",
        "The part of brain controlling balance is:",
        "HIV primarily attacks:",
        "The kingdom that includes multicellular decomposers is:",
        "The father of genetics is:",
        "PCR technique is used for:"
      ][i],
      options: [
        ["Lagging strand", "Leading strand", "Both strands", "Template strand"],
        ["Natural selection", "Random mating", "Large population", "No mutation"],
        ["Chemiosmosis", "Photolysis", "Calvin cycle", "Glycolysis"],
        ["Cut DNA at specific sequences", "Join DNA fragments", "Copy DNA", "Synthesize DNA"],
        ["Auxin", "Gibberellin", "Cytokinin", "Abscisic acid"],
        ["Light reaction → Calvin cycle → Photolysis", "Photolysis → Calvin cycle → Light reaction", "Calvin cycle → Light reaction → Photolysis", "Light reaction → Photolysis → Calvin cycle"],
        ["Reproduction", "Metabolism", "Growth", "Luminosity"],
        ["Carry amino acids", "Form ribosomes", "Store genetic code", "Catalyze reactions"],
        ["Prophase I", "Metaphase I", "Anaphase I", "Telophase I"],
        ["Darwin", "Lamarck", "Mendel", "Wallace"],
        ["Conservative", "Semi-conservative", "Dispersive", "Random"],
        ["Detoxification", "Protein synthesis", "Glycogen storage", "Insulin production"],
        ["Ribosome", "Nucleus", "Golgi apparatus", "Endoplasmic reticulum"],
        ["Pulmonary artery", "Pulmonary vein", "Both A and B", "Neither A nor B"],
        ["Nitrification", "Denitrification", "Nitrogen fixation", "Ammonification"],
        ["Cerebellum", "Cerebrum", "Medulla", "Hypothalamus"],
        ["B cells", "T helper cells", "Red blood cells", "Platelets"],
        ["Plantae", "Animalia", "Fungi", "Protista"],
        ["Mendel", "Darwin", "Watson", "Crick"],
        ["DNA amplification", "Protein synthesis", "Cell division", "Tissue culture"]
      ][i],
      correct: [0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 1, 3, 0, 1, 1, 0, 1, 2, 0, 0][i],
      explanation: [
        "Okazaki fragments are short DNA segments synthesized discontinuously on the lagging strand",
        "Hardy-Weinberg equilibrium assumes NO natural selection, along with other conditions",
        "Chemiosmosis generates ATP in both chloroplasts (photosynthesis) and mitochondria (respiration)",
        "Restriction enzymes recognize and cut DNA at specific palindromic sequences",
        "Auxin produced at shoot apex inhibits lateral bud growth, causing apical dominance",
        "Light reactions produce ATP/NADPH, then Calvin cycle uses them for carbon fixation",
        "Luminosity is not a biological characteristic of living organisms",
        "tRNA carries specific amino acids to ribosomes during protein synthesis",
        "Crossing over (genetic recombination) occurs during prophase I of meiosis",
        "Charles Darwin proposed natural selection in 'Origin of Species'",
        "Meselson-Stahl experiment proved semi-conservative replication",
        "Insulin is produced by pancreas, not liver",
        "Ribosomes (70S in prokaryotes, 80S in eukaryotes) synthesize proteins",
        "Pulmonary veins carry oxygenated blood from lungs to heart",
        "Denitrification converts nitrates/nitrites to nitrogen gas",
        "Cerebellum coordinates movement and maintains balance",
        "HIV specifically targets CD4+ T helper cells",
        "Fungi are multicellular (except yeasts) decomposers",
        "Gregor Mendel established principles of inheritance",
        "Polymerase Chain Reaction exponentially amplifies DNA segments"
      ][i]
    })),
    
    history: Array.from({ length: 20 }, (_, i) => ({
      question: [
        "The Battle of Adwa (1896) is significant because it:",
        "The Zemene Mesafint (Era of Princes) was characterized by:",
        "The primary economic system during Aksumite civilization was based on:",
        "The main reform introduced by Emperor Tewodros II was:",
        "The Ethiopian resistance during Italian occupation (1936-1941) was primarily led by:",
        "The Solomonic dynasty claims descent from:",
        "The capital of the Zagwe dynasty was:",
        "The Ethiopian calendar is based on:",
        "The Battle of Maichew (1936) marked:",
        "The Oromo population expansion in the 16th century is known as:",
        "The first capital of Ethiopia was:",
        "The Ethiopian Orthodox Church was established in the:",
        "The main cause of the Great Ethiopian Famine (1888-1892) was:",
        "The treaty of Wuchale (1889) controversy centered on:",
        "The main achievement of Emperor Zara Yaqob was:",
        "The Gondarine period is known for:",
        "The first European to reach Ethiopia was:",
        "The main export of medieval Ethiopia was:",
        "The reign of Emperor Menelik II is known for:",
        "The Derg regime came to power in:"
      ][i],
      options: [
        ["Marked first African victory over European colonial power", "Ended Italian colonization attempts", "United all Ethiopian regions", "Established modern Ethiopia"],
        ["Decentralized power and regional conflicts", "Strong central monarchy", "Religious unification", "Economic prosperity"],
        ["International trade and agriculture", "Mining only", "Pastoralism", "Manufacturing"],
        ["Centralization of state power", "Introduction of Islam", "Land redistribution", "Foreign alliances"],
        ["Patriotic fronts and Arbegnoch", "Foreign armies only", "Regional separatists", "Religious institutions only"],
        ["King Solomon and Queen of Sheba", "Alexander the Great", "King David", "The Prophet Muhammad"],
        ["Axum", "Lalibela", "Gondar", "Harar"],
        ["Coptic calendar", "Julian calendar", "Gregorian calendar", "Ancient Egyptian calendar"],
        ["The end of Ethiopian resistance", "A major Ethiopian victory", "The beginning of Italian occupation", "Ethiopian alliance with Britain"],
        ["Oromo migration", "Gadaa expansion", "Oromo invasions", "Zenith of Oromo power"],
        ["Axum", "Yeha", "Adulis", "Matara"],
        ["1st century AD", "4th century AD", "7th century AD", "10th century AD"],
        ["Rinderpest epidemic", "Drought only", "Political instability", "Foreign invasion"],
        ["Article 17 interpretation", "Border demarcation", "Trade agreements", "Military alliance"],
        ["Religious reforms and administration", "Territorial expansion", "Foreign relations", "Economic development"],
        ["Castle building and religious art", "Military conquests", "Maritime trade", "Industrial development"],
        ["Portuguese explorers", "Greek traders", "Roman merchants", "Arab traders"],
        ["Coffee and ivory", "Gold and salt", "Spices and textiles", "Copper and iron"],
        ["Modernization and territorial expansion", "Religious reforms", "Socialist policies", "Isolationism"],
        ["1974", "1977", "1991", "1960"]
      ][i],
      correct: [0, 0, 0, 0, 0, 0, 1, 1, 2, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0][i],
      explanation: [
        "Adwa was the first decisive victory of an African nation over a European colonial power",
        "Zemene Mesafint (1769-1855) was marked by weak central authority and power struggles among regional lords",
        "Aksum controlled Red Sea trade routes and had advanced agricultural terracing systems",
        "Tewodros sought to end Zemene Mesafint by centralizing power and modernizing the military",
        "Arbegnoch (patriots) conducted guerrilla warfare, supported by Allied forces in final liberation",
        "The Kebra Nagast documents the Solomonic lineage from Menelik I, son of Solomon and Sheba",
        "Lalibela was the capital where rock-hewn churches were constructed",
        "Ethiopian calendar is Julian with 13 months, 7-8 years behind Gregorian",
        "Maichew was the last major battle before Italian occupation of Addis Ababa",
        "Gadaa system expansion reshaped Ethiopian demographics and politics",
        "Axum was the first major capital and center of the Aksumite Empire",
        "Christianity became state religion under Ezana in 4th century AD",
        "Rinderpest (cattle plague) destroyed livestock, agriculture, and transportation",
        "Article 17 in Italian version made Ethiopia an Italian protectorate, Amharic version didn't",
        "Zara Yaqob strengthened church administration and wrote religious texts",
        "Gondar period (1632-1769) saw castle construction and religious manuscript production",
        "Portuguese arrived in 1490s, seeking Prester John alliance against Muslims",
        "Gold, ivory, and later coffee were major exports through Red Sea ports",
        "Menelik II modernized state, expanded territory, defeated Italians at Adwa",
        "Derg (Provisional Military Government) overthrew Haile Selassie in 1974"
      ][i]
    })),
    
    economics: Array.from({ length: 20 }, (_, i) => ({
      question: [
        "The opportunity cost of a decision is:",
        "If demand is elastic, price increase will cause:",
        "GDP differs from GNP because:",
        "The main function of central bank is:",
        "Inflation caused by excess demand is called:",
        "The Lorenz curve measures:",
        "Comparative advantage occurs when:",
        "The multiplier effect refers to:",
        "Fiscal policy involves:",
        "The law of diminishing returns applies to:",
        "A public good is characterized by:",
        "The Phillips curve shows relationship between:",
        "Externalities are:",
        "The poverty line is defined as:",
        "Human Development Index includes:",
        "Monetary policy tools include:",
        "Perfect competition requires:",
        "Gini coefficient of 0 means:",
        "Balance of payments includes:",
        "The Lorenz curve is used to calculate:"
      ][i],
      options: [
        ["The next best alternative foregone", "The monetary cost", "The time spent", "The resource cost"],
        ["Total revenue to increase", "Total revenue to decrease", "No change in revenue", "Increase in quantity demanded"],
        ["GDP includes foreign income", "GNP includes foreign income", "They are identical", "GDP excludes services"],
        ["Issue currency and control money supply", "Accept deposits from public", "Provide loans to businesses", "All of these"],
        ["Demand-pull inflation", "Cost-push inflation", "Structural inflation", "Hyperinflation"],
        ["Income inequality", "Poverty rate", "Unemployment rate", "Inflation rate"],
        ["A country has lower opportunity cost", "A country is more efficient in everything", "Trade benefits only one country", "No transportation costs"],
        ["Initial spending leading to larger total income", "Tax cuts increasing revenue", "Export-led growth", "Inflationary spiral"],
        ["Government spending and taxation", "Interest rates", "Exchange rates", "Trade policies"],
        ["Short run production", "Long run production", "Both short and long run", "Neither"],
        ["Non-excludability and non-rivalry", "Profit maximization", "Private ownership", "Market pricing"],
        ["Inflation and unemployment", "GDP and GNP", "Savings and investment", "Exports and imports"],
        ["Costs/benefits to third parties", "Government interventions", "Market failures", "Tax revenues"],
        ["Minimum income for basic needs", "Average national income", "Median income", "Per capita income"],
        ["Life expectancy, education, income", "GDP only", "Employment rate", "Industrial output"],
        ["Open market operations", "Reserve requirements", "Discount rate", "All of these"],
        ["Many buyers and sellers", "Homogeneous products", "Perfect information", "All of these"],
        ["Perfect equality", "Perfect inequality", "Moderate inequality", "Maximum poverty"],
        ["Current account and capital account", "Trade balance only", "Foreign reserves", "Government budget"],
        ["Gini coefficient", "Poverty gap", "HDI", "GDP growth"]
      ][i],
      correct: [0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0][i],
      explanation: [
        "Opportunity cost = value of next best alternative sacrificed",
        "Elastic demand: %ΔQ > %ΔP, so P↑ → TR↓",
        "GNP = GDP + net factor income from abroad",
        "Central bank: monetary authority, currency issuer, banker's bank",
        "Demand-pull: too much money chasing too few goods",
        "Lorenz curve plots cumulative % of income vs cumulative % of population",
        "Comparative advantage: lower relative opportunity cost",
        "Multiplier = 1/(1-MPC), shows ripple effect of spending",
        "Fiscal policy: government spending and taxation decisions",
        "Diminishing returns apply in short run with fixed factor",
        "Public goods: non-excludable (can't exclude users) and non-rival (consumption doesn't reduce availability)",
        "Phillips curve: inverse relationship between inflation and unemployment",
        "Externalities: spillover effects on third parties not involved in transaction",
        "Poverty line: minimum income threshold for basic necessities",
        "HDI: composite index of life expectancy, education, income per capita",
        "Monetary tools: OMOs, reserve ratio, discount rate, moral suasion",
        "Perfect competition: many firms, identical products, free entry/exit, perfect info",
        "Gini=0: perfect equality (Lorenz curve = 45° line)",
        "BoP: current account (trade) + capital account (investments) + financial account",
        "Gini coefficient measures area between Lorenz curve and equality line"
      ][i]
    })),
    
    geography: Array.from({ length: 20 }, (_, i) => ({
      question: [
        "The Great Rift Valley in Ethiopia was formed by:",
        "The Simien Mountains are known for:",
        "The Blue Nile originates from:",
        "The Danakil Depression is notable for:",
        "Ethiopia's climate is mainly influenced by:",
        "The Awash River flows into:",
        "The Ethiopian Highlands experience:",
        "Lake Tana is important because:",
        "The Ogaden region is characterized by:",
        "The Bale Mountains are located in:",
        "The main rainy season in Ethiopia is:",
        "The soil type in Ethiopian highlands is:",
        "Deforestation in Ethiopia is mainly caused by:",
        "The Great Ethiopian Renaissance Dam is being built on:",
        "Ethiopia's population distribution is influenced by:",
        "The Afar Triangle is geologically important because:",
        "Ethiopia's main export crop is:",
        "The highest peak in Ethiopia is:",
        "The Omo River is significant for:",
        "Ethiopia's time zone is:"
      ][i],
      options: [
        ["Tectonic plate divergence", "Volcanic activity", "Glacial erosion", "River erosion"],
        ["Highest peaks and endemic species", "Volcanic craters", "Desert landscape", "Ancient ruins"],
        ["Lake Tana", "Lake Victoria", "Mountains of Rwanda", "Sudanese swamps"],
        ["Extreme heat and salt flats", "Highest rainfall", "Dense forests", "Glacial lakes"],
        ["Altitude and monsoon winds", "Ocean currents", "Distance from sea", "All of these"],
        ["Lake Turkana", "Red Sea", "Indian Ocean", "It evaporates in desert"],
        ["Alpine climate", "Desert climate", "Tropical rainforest", "Mediterranean climate"],
        ["It's source of Blue Nile", "Largest lake in Africa", "Home to unique fish species", "All of these"],
        ["Semi-arid climate", "Tropical rainforest", "Highland climate", "Mediterranean climate"],
        ["Oromia Region", "Amhara Region", "Tigray Region", "SNNPR"],
        ["Kiremt (June-September)", "Belg (February-May)", "Bega (October-January)", "Both A and B"],
        ["Volcanic soil", "Laterite", "Alluvial soil", "Sandy soil"],
        ["Agricultural expansion and fuelwood", "Industrial pollution", "Urbanization only", "Climate change"],
        ["Blue Nile River", "Awash River", "Omo River", "Tekeze River"],
        ["Altitude and rainfall", "Government policy", "Historical factors", "All of these"],
        ["It's where three tectonic plates meet", "It has highest mountains", "It's most fertile region", "It's largest forest"],
        ["Coffee", "Teff", "Chat", "Oil seeds"],
        ["Ras Dashen", "Mount Batu", "Mount Tullu Dimtu", "Abune Yosef"],
        ["Hydroelectric power and archaeology", "Irrigation", "Transportation", "All of these"],
        ["East Africa Time (UTC+3)", "Central Africa Time", "West Africa Time", "GMT"]
      ][i],
      correct: [0, 0, 0, 0, 3, 3, 0, 3, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 3, 0][i],
      explanation: [
        "Rift Valley formed by divergence of African and Arabian plates",
        "Simien Mountains: UNESCO site with endemic Walia ibex and Gelada baboon",
        "Blue Nile starts at Gish Abbai spring near Lake Tana",
        "Danakil: one of hottest places on Earth, active volcanoes, salt mining",
        "Ethiopian climate: complex due to altitude (1,000-4,500m) and monsoon systems",
        "Awash River ends in Lake Abe (Afar Depression) after 1,200 km",
        "Highlands: temperate climate despite tropical location (altitude effect)",
        "Lake Tana: largest Ethiopian lake, source of Blue Nile, biodiversity hotspot",
        "Ogaden: Somali region, semi-arid, pastoralist communities",
        "Bale Mountains: Oromia region, Afro-alpine ecosystem, endangered Ethiopian wolf",
        "Kiremt: main rainy season supporting meher (main) crops",
        "Highlands: fertile volcanic soils (andosols) from volcanic activity",
        "Deforestation: agriculture expansion (90%), fuelwood (85% energy), overgrazing",
        "GERD: on Blue Nile near Sudan border, Africa's largest hydroelectric project",
        "Population: concentrated in highlands (fertile, disease-free, historical)",
        "Afar Triangle: triple junction where African, Arabian, Somali plates meet",
        "Coffee: Ethiopia's birthplace, largest export earner, 25% population involved",
        "Ras Dashen: 4,550m in Simien Mountains, 4th highest in Africa",
        "Omo River: hydroelectric dams (Gibe), Lower Omo Valley UNESCO sites, irrigation",
        "EAT: UTC+3, same as Nairobi, Moscow, Baghdad"
      ][i]
    }))
  };












  const currentQuestions = quizData[currentSubject];
  const currentQuestionData = currentQuestions[currentQuestion];

  const handleAnswerSelect = (optionIndex) => {
    const newSelectedAnswers = { ...selectedAnswers, [currentQuestion]: optionIndex };
    setSelectedAnswers(newSelectedAnswers);
    setAnsweredQuestions(new Set([...answeredQuestions, currentQuestion]));
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestion < currentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowExplanation(false);
    }
  };

  const handleSubmit = () => {
    let newScore = 0;
    Object.keys(selectedAnswers).forEach(qIndex => {
      if (selectedAnswers[qIndex] === currentQuestions[qIndex].correct) {
        newScore++;
      }
    });
    setScore(newScore);
    setQuizHistory([...quizHistory, {
      subject: currentSubject,
      score: newScore,
      total: currentQuestions.length,
      date: new Date().toLocaleString()
    }]);
    setShowScore(true);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setScore(0);
    setShowScore(false);
    setAnsweredQuestions(new Set());
    setShowExplanation(false);
    setTimeLeft(3600);
  };

  const handleSubjectChange = (subjectId) => {
    setCurrentSubject(subjectId);
    resetQuiz();
  };

  // Results Screen
  if (showScore) {
    const subjectName = subjects.find(s => s.id === currentSubject).name;
    const percentage = Math.round((score / currentQuestions.length) * 100);
   
    
   
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
      
       <div className="fixed top-2 left-2 right-2 z-10 md:top-4 md:left-4 md:right-auto">
            
              <ChevronLeft onClick={() => navigate('/studentstudy-dashboard')} className="w-8 h-8" />
              {/* <span className="truncate">Back to Home</span> */}
           
          </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mt-16">
          {/* Main Results Card - Full width on mobile, 2/3 on desktop */}
          <div className="lg:col-span-2">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-5 md:p-6 border border-white/20">
              {/* Subject Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl">
                      <span className="text-2xl sm:text-3xl">
                        {(() => {
                          const icons = {
                            physics: '',
                            chemistry: '',
                            mathematics: '',
                            english: '',
                            biology: '',
                            history: '',
                            economics: '',
                            geography: ''
                          };
                          return icons[currentSubject] || '';
                        })()}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{subjectName}</h2>
                      {/* <p className="text-gray-600 text-sm sm:text-base">Advanced Level Assessment</p> */}
                    </div>
                  </div>
                </div>
                <div className={`text-4xl sm:text-5xl transition-transform hover:scale-110 ${
                  percentage >= 80 ? 'text-yellow-500 animate-bounce' :
                  percentage >= 60 ? 'text-blue-500' :
                  'text-gray-400'
                }`}>
                  {percentage >= 80 ? '' : percentage >= 60 ? '' : ''}
                </div>
              </div>

              {/* Stats Grid - Responsive */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl sm:rounded-2xl shadow-sm border border-blue-200">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">{score}</div>
                  <div className="text-xs sm:text-sm font-medium text-blue-800">Correct</div>
                  <div className="mt-2 h-1 w-full bg-blue-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${(score / currentQuestions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-xl sm:rounded-2xl shadow-sm border border-emerald-200">
                  <div className="text-2xl sm:text-3xl font-bold text-emerald-600 mb-1">
                    {currentQuestions.length - score}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-emerald-800">Incorrect</div>
                  <div className="mt-2 h-1 w-full bg-emerald-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${((currentQuestions.length - score) / currentQuestions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl sm:rounded-2xl shadow-sm border border-purple-200">
                  <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1">{percentage}%</div>
                  <div className="text-xs sm:text-sm font-medium text-purple-800">Score</div>
                  <div className="mt-2 h-1 w-full bg-purple-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl sm:rounded-2xl shadow-sm border border-amber-200">
                  <div className="text-2xl sm:text-3xl font-bold text-amber-600 mb-1">
                    {Math.round((answeredQuestions.size / currentQuestions.length) * 100)}%
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-amber-800">Completed</div>
                  <div className="mt-2 h-1 w-full bg-amber-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${(answeredQuestions.size / currentQuestions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Performance Message */}
              <div className={`mb-6 sm:mb-8 p-4 rounded-xl sm:rounded-2xl ${
                percentage >= 80 
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200' 
                  : percentage >= 60 
                  ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200'
                  : 'bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200'
              }`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl sm:text-3xl">
                    {percentage >= 80 ? '' : percentage >= 60 ? '' : ''}
                  </span>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                      {percentage >= 80 ? 'Excellent Performance!' :
                       percentage >= 60 ? 'Good Job!' :
                       'Keep Practicing!'}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm mt-1">
                      {percentage >= 80 ? 'You have mastered this subject. Well done!' :
                       percentage >= 60 ? 'You understand most concepts. Keep going!' :
                       'Review the material and try again for better results.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Question Review Grid - Mobile Optimized */}
            
            </div>
          </div>

          {/* Right Sidebar - Stack on mobile, sidebar on desktop */}
          <div className="space-y-4 sm:space-y-5">
            {/* Subject Selection Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-5 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Select Subject</h3>
                <span className="text-lg sm:text-xl"></span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-3">
                {subjects.map(subject => (
                  <button
                    key={subject.id}
                    onClick={() => handleSubjectChange(subject.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                      currentSubject === subject.id
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 shadow-sm'
                        : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      currentSubject === subject.id
                        ? 'bg-gradient-to-r from-blue-100 to-purple-100'
                        : 'bg-gray-200'
                    }`}>
                      <span className="text-lg sm:text-xl">
                        {(() => {
                          const icons = {
                            physics: '',
                            chemistry: '',
                            mathematics: '',
                            english: '',
                            biology: '',
                            history: '',
                            economics: '',
                            geography: ''
                          };
                          return icons[subject.id] || '';
                        })()}
                      </span>
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-800 text-sm sm:text-base">{subject.name}</div>
                      <div className="text-xs text-gray-500">{subject.questionCount} questions</div>
                    </div>
                    {currentSubject === subject.id && (
                      <span className="text-blue-500 text-lg">→</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions Card */}
           

           
          </div>
        </div>

        {/* Bottom Navigation - Mobile Only */}
        
    
      </div>
    </div>
  );
};

// Main Quiz Screen - Responsive Version
return (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-3 sm:p-4 md:p-6 lg:p-8">
    <div className="max-w-7xl mx-auto">
      
      <div className="fixed top-2 left-2 right-2 z-10 md:top-4 md:left-4 md:right-auto">
            
              <ChevronLeft onClick={() => navigate('/studentstudy-dashboard')} className="w-8 h-8" />
              {/* <span className="truncate">Back to Home</span> */}
           
          </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mt-16">
        {/* Left Panel - Subject Selection */}
        <div className="lg:col-span-1">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-5 md:p-6 border border-white/20 mb-4 sm:mb-6">
            <div className="flex items-center justify-between mb-5 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">Subjects</h2>
              <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl">
                <span className="text-xl sm:text-2xl"></span>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-1 gap-3">
              {subjects.map(subject => (
                <button
                  key={subject.id}
                  onClick={() => handleSubjectChange(subject.id)}
                  className={`p-4 rounded-xl sm:rounded-2xl transition-all duration-200 transform hover:scale-[1.02] ${
                    currentSubject === subject.id
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 shadow-md'
                      : 'bg-white border border-gray-200 hover:border-blue-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className={`p-3 rounded-lg mb-3 ${
                      currentSubject === subject.id
                        ? 'bg-gradient-to-r from-blue-100 to-purple-100'
                        : 'bg-gray-100'
                    }`}>
                      <span className="text-2xl sm:text-3xl">
                        {(() => {
                          const icons = {
                            physics: '',
                            chemistry: '',
                            mathematics: '',
                            english: '',
                            biology: '',
                            history: '',
                            economics: '',
                            geography: ''
                          };
                          return icons[subject.id] || '';
                        })()}
                      </span>
                    </div>
                    <span className="font-semibold text-gray-800 text-sm sm:text-base mb-1">
                      {subject.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {/* {subject.questionCount} Qs */}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

         
        </div>

        {/* Main Quiz Area */}
        <div className="lg:col-span-3">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-5 md:p-6 border border-white/20 mb-4 sm:mb-6">
            {/* Quiz Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl sm:rounded-2xl">
                  <span className="text-2xl sm:text-3xl">
                    {(() => {
                      const icons = {
                        physics: '',
                        chemistry: '',
                        mathematics: '',
                        english: '',
                        biology: '',
                        history: '',
                        economics: '',
                        geography: ''
                      };
                      return icons[currentSubject] || '';
                    })()}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                    {subjects.find(s => s.id === currentSubject).name}
                  </h2>
                  {/* <p className="text-gray-600 text-sm sm:text-base">Advanced Level Questions</p> */}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-800 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl border border-blue-200">
                  <span className="text-lg sm:text-xl mr-2"></span>
                  <span className="font-mono font-bold text-sm sm:text-base">{formatTime(timeLeft)}</span>
                </div>
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-800 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl border border-emerald-200">
                  <span className="font-bold text-sm sm:text-base">Score: {score}</span>
                </div>
              </div>
            </div>

         
         
         
         
         
         
         
         
         
         
         
            {/* Progress Bar */}
         
         
            <div className="mb-6 sm:mb-8">
              <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>Question {currentQuestion + 1} of {currentQuestions.length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500"
                  style={{ width: `${((currentQuestion + 1) / currentQuestions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question Card */}
            <div className="mb-6 sm:mb-8">
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 mb-5 sm:mb-6 border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center font-bold text-lg sm:text-xl shadow-md">
                      Q{currentQuestion + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">Question:</h3>
                    <p className="text-gray-700 text-base sm:text-lg md:text-xl leading-relaxed">
                      {currentQuestionData.question}
                    </p>
                  </div>
                </div>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                {currentQuestionData.options.map((option, index) => {
                  const isSelected = selectedAnswers[currentQuestion] === index;
                  const isCorrect = index === currentQuestionData.correct;
                  return (
                    <AnswerOption
                      key={index}
                      option={option}
                      index={index}
                      isSelected={isSelected}
                      isCorrect={isCorrect}
                      onClick={handleAnswerSelect}
                    />
                  );
                })}
              </div>

              {/* Explanation */}
              {showExplanation && selectedAnswers[currentQuestion] !== undefined && (
                <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-5 mb-6 sm:mb-8 ${
                  selectedAnswers[currentQuestion] === currentQuestionData.correct
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200'
                    : 'bg-gradient-to-r from-red-50 to-rose-50 border border-red-200'
                }`}>
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className={`p-2 sm:p-3 rounded-lg ${
                      selectedAnswers[currentQuestion] === currentQuestionData.correct
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      <span className="text-xl sm:text-2xl">
                        {selectedAnswers[currentQuestion] === currentQuestionData.correct ? '' : ''}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
                        {selectedAnswers[currentQuestion] === currentQuestionData.correct
                          ? 'Correct Answer!'
                          : 'Incorrect Answer'}
                      </h4>
                      <p className="text-gray-700 text-sm sm:text-base">
                        <span className="font-medium">Explanation:</span> {currentQuestionData.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              )}

           
           
           
           
           
              {/* Navigation Buttons - Responsive */}
           
              <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    className={`flex-1 sm:flex-none px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl font-medium transition-all duration-200 ${
                      currentQuestion === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]'
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <span className="text-lg"></span>
                      <span className="text-sm sm:text-base">Previous</span>
                    </span>
                  </button>
                  
                  <button
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="flex-1 sm:flex-none px-4 sm:px-6 py-3 sm:py-3.5 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-800 hover:from-blue-100 hover:to-cyan-100 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] border border-blue-200"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <span className="text-lg"></span>
                      <span className="text-sm sm:text-base">
                        {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
                      </span>
                    </span>
                  </button>
                </div>

                <div>
                  {currentQuestion === currentQuestions.length - 1 ? (
                    <button
                      onClick={handleSubmit}
                      className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <span className="text-lg"></span>
                        <span className="text-sm sm:text-base">Submit Quiz</span>
                      </span>
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <span className="text-lg"></span>
                        <span className="text-sm sm:text-base">Next Question</span>
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>

          
           
          </div>

         
        </div>
      </div>
    </div>
  </div>

  );
};

export default EthiopianGrade11Quiz;