

import React, { useState, useEffect } from 'react';
import { ChevronLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const EthiopianUniversityEntranceExam = () => {
  const [currentSubject, setCurrentSubject] = useState('physics');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(7200); // 2 hours like actual EUEE
  const [showExplanation, setShowExplanation] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
 
   const navigate = useNavigate();

  // Timer
  useEffect(() => {
    if (timeLeft > 0 && !showScore) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleSubmit();
    }
  }, [timeLeft, showScore]);

  // Format time
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Subjects
  const subjects = [
    { id: 'physics', name: 'Physics', code: 'PHYS-1012' },
    { id: 'chemistry', name: 'Chemistry', code: 'CHEM-1012' },
    { id: 'mathematics', name: 'Mathematics', code: 'MATH-1012' },
    { id: 'english', name: 'English', code: 'ENGL-1012' },
    { id: 'biology', name: 'Biology', code: 'BIOL-1012' },
    { id: 'history', name: 'History', code: 'HIST-1012' },
    { id: 'economics', name: 'Economics', code: 'ECON-1012' },
    { id: 'geography', name: 'Geography', code: 'GEOG-1012' }
  ];

  // EUEE STYLE QUESTIONS (Letters A, B, C, D removed from options)
  const quizData = {
    physics: [
      {
        question: "1. A car accelerates uniformly from rest to 20 m/s in 5 seconds. What is its acceleration?",
        options: ["2 m/s²", "4 m/s²", "5 m/s²", "10 m/s²"],
        correct: 1,
        explanation: "a = (v - u)/t = (20 - 0)/5 = 4 m/s²"
      },
      {
        question: "2. A stone is thrown vertically upward with initial velocity 20 m/s. What is the maximum height reached? (g = 10 m/s²)",
        options: ["10 m", "15 m", "20 m", "25 m"],
        correct: 2,
        explanation: "h = u²/2g = (20)²/(2×10) = 400/20 = 20 m"
      },
      {
        question: "3. The resistance of a wire of length L and cross-sectional area A is R. If the length is doubled and area halved, the new resistance is:",
        options: ["R", "2R", "4R", "8R"],
        correct: 2,
        explanation: "R = ρL/A, new R' = ρ(2L)/(A/2) = 4ρL/A = 4R"
      },
      {
        question: "4. In Young's double slit experiment, the fringe width is 2 mm. If the distance between slits is doubled, the new fringe width becomes:",
        options: ["1 mm", "2 mm", "4 mm", "8 mm"],
        correct: 0,
        explanation: "β = λD/d, β ∝ 1/d, so if d doubles, β becomes half"
      },
      {
        question: "5. The work function of sodium is 2.3 eV. The threshold wavelength is approximately: (h = 4.14×10⁻¹⁵ eV·s, c = 3×10⁸ m/s)",
        options: ["540 nm", "5400 Å", "540 Å", "5400 nm"],
        correct: 0,
        explanation: "λ = hc/Φ = (1240 eV·nm)/2.3 eV ≈ 540 nm"
      },
      {
        question: "6. A transformer has 500 primary turns and 2500 secondary turns. If input voltage is 220 V AC, output voltage is:",
        options: ["44 V", "1100 V", "220 V", "880 V"],
        correct: 1,
        explanation: "V₂/V₁ = N₂/N₁ = 2500/500 = 5, V₂ = 5×220 = 1100 V"
      },
      {
        question: "7. A capacitor of 4 μF is charged to 200 V. The energy stored is:",
        options: [ "0.8 J", "0.08 J", "0.04 J", "0.4 J"],
        correct: 1,
        explanation: "E = ½CV² = 0.5×4×10⁻⁶×(200)² = 0.08 J"
      },
      {
        question: "8. The de Broglie wavelength of electron accelerated through 150 V is approximately:",
        options: [ "10 Å", "0.1 Å", "1 Å", "100 Å"],
        correct: 2,
        explanation: "λ = h/√(2meV) = 12.27/√150 ≈ 1 Å"
      },
      {
        question: "9. A satellite orbits Earth at height where acceleration due to gravity is g/4. Its orbital speed is: (R = Earth's radius)",
        options: ["√(gR/2)", "√(gR/4)", "√(2gR)", "√(gR)"],
        correct: 0,
        explanation: "v = √(g'r) = √((g/4)×(R+h)) ≈ √(gR/2)"
      },
      {
        question: "10. The half-life of radioactive element is 20 days. Time for 75% decay is:",
        options: [ "30 days", "40 days", "60 days", "20 days"],
        correct: 1,
        explanation: "75% decay = 2 half-lives = 2×20 = 40 days"
      },
      {
        question: "11. In a p-n junction diode, the reverse saturation current doubles for every:",
        options: [ "5°C rise", "20°C rise", "15°C rise", "10°C rise",],
        correct: 3,
        explanation: "Reverse saturation current approximately doubles for every 10°C rise in temperature"
      },
      {
        question: "12. The magnetic field at center of circular coil of radius R carrying current I is:",
        options: [ "μ₀I/2πR", "μ₀I/R", "2μ₀I/R", "μ₀I/2R",],
        correct: 3,
        explanation: "B = μ₀I/2R at center of circular coil"
      },
      {
        question: "13. A particle executes SHM with amplitude A. Kinetic energy equals potential energy when displacement is:",
        options: ["A/√2", "A/2", "A/√3", "A/3"],
        correct: 0,
        explanation: "When KE = PE, each is half total energy: ½kx² = ¼kA² ⇒ x = A/√2"
      },
      {
        question: "14. The speed of sound in hydrogen at STP is 1270 m/s. In oxygen at same temperature:",
        options: [ "635 m/s", "2540 m/s", "317.5 m/s", "895 m/s"],
        correct: 2,
        explanation: "v ∝ 1/√M, M(O₂)/M(H₂)=16, v=1270/4=317.5 m/s"
      },
      {
        question: "15. A convex lens (f=20 cm) and concave lens (f=10 cm) are combined. Power of combination:",
        options: ["-5 D", "+5 D", "+15 D", "-15 D"],
        correct: 0,
        explanation: "P = 1/0.2 + (-1/0.1) = 5 - 10 = -5 D"
      },
      {
        question: "16. The uncertainty in position of electron is 10⁻¹⁰ m. Minimum uncertainty in momentum is: (ħ = 1.05×10⁻³⁴ J·s)",
        options: ["5.27×10⁻²⁵ kg·m/s", "1.05×10⁻²⁴ kg·m/s", "2.64×10⁻²⁵ kg·m/s", "6.63×10⁻³⁴ kg·m/s"],
        correct: 0,
        explanation: "Δp ≥ ħ/(2Δx) = 1.05×10⁻³⁴/(2×10⁻¹⁰) = 5.25×10⁻²⁵ kg·m/s"
      },
      {
        question: "17. A wire stretches 2 mm under load. If radius is doubled, extension becomes:",
        options: ["0.5 mm", "1 mm", "0.25 mm", "0.125 mm"],
        correct: 2,
        explanation: "Extension ∝ 1/r², so if radius doubles, extension becomes 1/4"
      },
      {
        question: "18. The energy gap in semiconductor is 1 eV. It is transparent to wavelength:",
        options: ["1240 nm", "620 nm", "2480 nm", "310 nm"],
        correct: 0,
        explanation: "λ = hc/E = 1240 nm for E=1 eV"
      },
      {
        question: "19. A fluid flows through pipe. Velocity is maximum where:",
        options: ["Cross-section is minimum", "Cross-section is maximum", "At center", "Same everywhere"],
        correct: 0,
        explanation: "From equation of continuity: A₁v₁ = A₂v₂"
      },
      {
        question: "20. The magnetic moment of current loop depends on:",
        options: [ "Current only", "Area only", "Current, area, number of turns", "Number of turns only"],
        correct: 2,
        explanation: "Magnetic moment μ = NIA"
      }
    ],
    chemistry: [
      {
        question: "1. For reaction N₂(g) + 3H₂(g) ⇌ 2NH₃(g), ΔH = -92 kJ. Kp will decrease with:",
        options: ["Increase in temperature", "Increase in pressure", "Addition of catalyst", "Increase in volume"],
        correct: 0,
        explanation: "Exothermic reaction: increasing temperature favors backward reaction, decreasing Kp"
      },
      {
        question: "2. The hybridization of carbon in C₂H₂ is:",
        options: [ "sp²", "sp", "sp³", "sp³d"],
        correct: 1,
        explanation: "Acetylene has sp hybridization with linear geometry"
      },
      {
        question: "3. The pH of 0.01 M NH₄Cl solution (Kb for NH₃ = 1.8×10⁻⁵) is approximately:",
        options: [ "6.63", "3.63", "8.37", "5.63",],
        correct: 3,
        explanation: "For salt of weak base: pH = 7 - ½pKb - ½logC = 5.63"
      },
      {
        question: "4. The oxidation state of chromium in CrO₅ is:",
        options: ["+6", "+5", "+10", "+8"],
        correct: 0,
        explanation: "CrO₅ has 4 peroxide oxygens (-1 each) and 1 normal oxygen (-2): Cr + 4(-1) + 1(-2) = 0 ⇒ Cr = +6"
      },
      {
        question: "5. Which is NOT a colligative property?",
        options: ["Viscosity", "Osmotic pressure", "Elevation in boiling point", "Depression in freezing point"],
        correct: 0,
        explanation: "Viscosity depends on intermolecular forces, not number of solute particles"
      },
      {
        question: "6. The rate constant of first order reaction is 2×10⁻³ s⁻¹. Time for 75% completion is:",
        options: [ "346 s", "1386 s", "693 s", "173 s"],
        correct: 2,
        explanation: "t = (2.303/k)log(1/(1-0.75)) = (2.303/0.002)log4 = 693 s"
      },
      {
        question: "7. The hybridization of Xe in XeF₄ is:",
        options: [ "sp³d", "sp³d²", "sp³", "sp³d³"],
        correct: 1,
        explanation: "XeF₄ has 6 electron pairs (4 bonding + 2 lone) ⇒ sp³d²"
      },
      {
        question: "8. Which has highest boiling point?",
        options: ["CH₃CH₂OH", "CH₃OCH₃", "CH₃CH₂CH₃", "CH₃CHO"],
        correct: 0,
        explanation: "Ethanol has hydrogen bonding, giving highest boiling point"
      },
      {
        question: "9. Number of isomers for C₄H₈O (aldehydes and ketones) is:",
        options: ["4", "5", "6", "3"],
        correct: 0,
        explanation: "Aldehydes: butanal, 2-methylpropanal; Ketones: butanone, cyclobutanone"
      },
      {
        question: "10. In electrolysis of aqueous CuSO₄ using Cu electrodes:",
        options: ["Cu deposits at cathode", "O₂ evolves at anode", "All of these", "Cu anode dissolves"],
        correct: 2,
        explanation: "All processes occur during electrolysis with Cu electrodes"
      },
      {
        question: "11. The bond order in O₂²⁻ is:",
        options: ["1", "2", "1.5", "0"],
        correct: 0,
        explanation: "O₂²⁻ has 18 electrons: σ1s² σ*1s² σ2s² σ*2s² σ2pz² π2px² π2py² π*2px² π*2py², bond order = (10-8)/2 = 1"
      },
      {
        question: "12. Which quantum number determines orbital shape?",
        options: [ "Principal (n)", "Magnetic (m)", "Azimuthal (l)", "Spin (s)"],
        correct: 2,
        explanation: "Azimuthal quantum number (l) determines s, p, d, f orbital shapes"
      },
      {
        question: "13. The standard electrode potential of hydrogen electrode is taken as:",
        options: ["0.00 V", "1.00 V", "-1.00 V", "0.76 V"],
        correct: 0,
        explanation: "Standard hydrogen electrode (SHE) potential is defined as 0.00 V"
      },
      {
        question: "14. The crystal structure of NaCl is:",
        options: [ "Body centered cubic", "Face centered cubic", "Simple cubic", "Hexagonal"],
        correct: 1,
        explanation: "NaCl has face centered cubic structure with Cl⁻ ions at corners and face centers"
      },
      {
        question: "15. Which is strongest reducing agent?",
        options: ["Li", "Na", "K", "Cs"],
        correct: 0,
        explanation: "Li has most negative reduction potential (-3.04 V)"
      },
      {
        question: "16. The reagent used in Tollen's test is:",
        options: [ "Fehling's solution", "Benedict's reagent", "Ammoniacal AgNO₃", "Schiff's reagent"],
        correct: 2,
        explanation: "Tollen's reagent is [Ag(NH₃)₂]⁺ in ammoniacal solution"
      },
      {
        question: "17. The coordination number in body centered cubic structure is:",
        options: ["8", "6", "12", "4"],
        correct: 0,
        explanation: "Each atom in BCC touches 8 nearest neighbors"
      },
      {
        question: "18. Which shows optical isomerism?",
        options: [ "[Co(NH₃)₆]³⁺", "[Ni(CO)₄]", "[PtCl₄]²⁻", "[Co(en)₃]³⁺",],
        correct: 3,
        explanation: "[Co(en)₃]³⁺ has non-superimposable mirror images"
      },
      {
        question: "19. The IUPAC name of CH₃-CH=CH-CHO is:",
        options: ["But-2-enal", "3-Butenal", "But-2-en-1-al", "1-Buten-3-al"],
        correct: 0,
        explanation: "Principal functional group is aldehyde (-al), double bond at position 2"
      },
      {
        question: "20. In Haber process for ammonia synthesis, optimal conditions are:",
        options: [ "500°C, 100 atm, Ni catalyst", "400°C, 300 atm, Pt catalyst", "350°C, 150 atm, Cu catalyst", "450°C, 200 atm, Fe catalyst",],
        correct: 3,
        explanation: "Industrial conditions: 450-500°C, 150-200 atm, iron catalyst with promoters"
      }
    ],
    mathematics: [
      {
        question: "1. ∫₀^{π/2} sin³x cos²x dx equals:",
        options: [ "2/15", "8/15", "4/15", "2/35",],
        correct: 3,
        explanation: "Using reduction formula or Beta function: B(2, 3/2)/2 = 2/35"
      },
      {
        question: "2. Number of 5-digit numbers divisible by 3 using digits 0,1,2,3,4,5 without repetition:",
        options: [ "120", "96", "216", "240"],
        correct: 2,
        explanation: "Sum of all digits = 15 (divisible by 3). Total numbers = 5! = 120 excluding 0 at first place: 4×4! = 96. Total = 216"
      },
      {
        question: "3. If |z - 3| = |z - 3i|, then locus of z is:",
        options: [ "x + y = 3", "y = x", "x - y = 0", "y = -x"],
        correct: 1,
        explanation: "Let z = x + iy: |(x-3)+iy| = |x+i(y-3)| ⇒ (x-3)²+y² = x²+(y-3)² ⇒ x = y"
      },
      {
        question: "4. Solution of differential equation y' + y tan x = sec x is:",
        options: ["y = sin x + C cos x", "y = cos x + C sin x", "y = x sec x + C", "y = sec x + C tan x"],
        correct: 0,
        explanation: "Integrating factor = e^{∫tan x dx} = sec x. Solution: y sec x = ∫sec² x dx = tan x + C ⇒ y = sin x + C cos x"
      },
      {
        question: "5. Probability that in random arrangement of 'ETHIOPIA', vowels occupy even places:",
        options: ["1/14", "2/7", "3/14", "1/7"],
        correct: 0,
        explanation: "Total letters=8, vowels=5 (E,I,O,I,A). Even places=4. Probability = (5P4 × 4!/2!)/(8!/2!) = 1/14"
      },
      {
        question: "6. lim_{x→0} (sin x - x)/x³ equals:",
        options: ["-1/6", "1/6", "0", "1/3"],
        correct: 0,
        explanation: "Using Maclaurin series: sin x = x - x³/6 + x⁵/120 - ... ⇒ (sin x - x)/x³ → -1/6"
      },
      {
        question: "7. Area bounded by parabola y² = 4ax and its latus rectum is:",
        options: [ "(4/3)a²", "(8/3)a²", "2a²", "a²"],
        correct: 1,
        explanation: "Area = 2∫₀ᵃ 2√(ax) dx = 4√a × (2/3)x^{3/2}|₀ᵃ = (8/3)a²"
      },
      {
        question: "8. If P(A)=0.3, P(B)=0.4 and independent, then P(A'∩B') =",
        options: ["0.42", "0.28", "0.12", "0.18"],
        correct: 0,
        explanation: "P(A'∩B') = P(A')P(B') = 0.7 × 0.6 = 0.42"
      },
      {
        question: "9. Equation of plane through (1,2,3) perpendicular to line (x-1)/2 = (y-2)/-3 = (z-3)/4:",
        options: [ "2x - 3y + 4z = 20", "x + 2y + 3z = 14", "2x - 3y + 4z = 8", "x - y + z = 2"],
        correct: 2,
        explanation: "Direction ratios of normal are 2,-3,4. Equation: 2(x-1)-3(y-2)+4(z-3)=0 ⇒ 2x-3y+4z=8"
      },
      {
        question: "10. General solution of sin²x dx + cos²y dy = 0 is:",
        options: ["tan x - cot y = C", "tan x + cot y = C", "cot x - tan y = C", "sin x + cos y = C"],
        correct: 0,
        explanation: "∫sin²x dx = -∫cos²y dy ⇒ (x/2 - sin2x/4) = -(y/2 + sin2y/4) + C ⇒ tan x - cot y = C"
      },
      {
        question: "11. If A² = A, then (I + A)³ - 7A =",
        options: ["I", "A", "I - A", "7A"],
        correct: 0,
        explanation: "(I+A)³ = I + 3A + 3A² + A³ = I + 3A + 3A + A = I + 7A ⇒ (I+A)³ - 7A = I"
      },
      {
        question: "12. Distance between parallel lines 3x+4y=12 and 6x+8y=15 is:",
        options: ["9/10", "3/10", "3/5", "6/5"],
        correct: 0,
        explanation: "Distance = |c₂ - c₁|/√(a²+b²) = |15/2 - 12|/√(9+16) = (15-24)/10 = 9/10"
      },
      {
        question: "13. Number of real solutions of |x² - 4x + 3| = 1 is:",
        options: [ "2", "4", "3", "1"],
        correct: 1,
        explanation: "x²-4x+3=±1 gives x²-4x+2=0 (2 real) and x²-4x+4=0 (1 real, repeated) ⇒ total 4"
      },
      {
        question: "14. If f(x)=x(x-1)(x-2), then f(f(x))=0 has number of real roots:",
        options: ["7", "5", "3", "4"],
        correct: 0,
        explanation: "f(x)=0 ⇒ x=0,1,2. f(x)=1 has 3 real roots. f(x)=0 has 3 roots. f(x)=2 has 1 real root. Total = 7"
      },
      {
        question: "15. Σ_{r=1}^{n} r(r+1)(r+2) =",
        options: [ "n(n+1)(n+2)/3", "n(n+1)(2n+1)/6", "n(n+1)/2", "n(n+1)(n+2)(n+3)/4",],
        correct: 3,
        explanation: "Σ(r³+3r²+2r) = [n(n+1)/2]² + 3n(n+1)(2n+1)/6 + 2n(n+1)/2 = n(n+1)(n+2)(n+3)/4"
      },
      {
        question: "16. Circles x²+y²+2ax+c=0 and x²+y²+2by+c=0 touch if:",
        options: ["1/a² + 1/b² = 1/c²", "1/a + 1/b = 1/c", "1/a² + 1/b² = 1/c", "a² + b² = c²"],
        correct: 0,
        explanation: "Centers: (-a,0),(0,-b). Distance = √(a²+b²). Radii = √(a²-c),√(b²-c). For touching: √(a²+b²) = √(a²-c) + √(b²-c) ⇒ 1/a² + 1/b² = 1/c²"
      },
      {
        question: "17. Period of f(x) = |sin x| + |cos x| is:",
        options: [ "π", "2π", "π/2", "π/4"],
        correct: 2,
        explanation: "f(x+π/2) = |sin(x+π/2)| + |cos(x+π/2)| = |cos x| + |-sin x| = f(x)"
      },
      {
        question: "18. If vectors a, b, c are coplanar, then [a+b, b+c, c+a] =",
        options: ["2[a b c]", "0", "[a b c]", "3[a b c]"],
        correct: 0,
        explanation: "Using properties of scalar triple product: [a+b, b+c, c+a] = 2[a b c]"
      },
      {
        question: "19. Probability distribution P(X=k)=C/2^k for k=1,2,3,... Then C=",
        options: [ "1/2", "1", "2", "1/3"],
        correct: 1,
        explanation: "Σ_{k=1}^{∞} C/2^k = C(1/2)/(1-1/2) = C = 1"
      },
      {
        question: "20. Minimum value of 2x² + 3y² - 4x - 12y + 18 is:",
        options: ["4", "5", "6", "7"],
        correct: 0,
        explanation: "Complete squares: 2(x-1)² + 3(y-2)² + 4 ≥ 4"
      }
    ],
    english: [
      {
        question: "1. Choose the correct sentence:",
        options: [
          "She goes to school every day.",
          "She go to school every day.", 
          "She going to school every day.",
          "She gone to school every day."
        ],
        correct: 0,
        explanation: "Present simple tense for third person singular requires verb to end with -s or -es"
      },
      {
        question: "2. Identify the figure of speech: 'The world is a stage.'",
        options: ["Metaphor", "Simile", "Personification", "Hyperbole"],
        correct: 0,
        explanation: "Metaphor: direct comparison without 'like' or 'as'"
      },
      {
        question: "3. The phrase 'kick the bucket' is an example of:",
        options: [ "Idiom", "Euphemism", "Cliché", "All of these",],
        correct: 3,
        explanation: "It's an idiom meaning 'die', a euphemism for death, and a cliché"
      },
      {
        question: "4. Correct passive voice of: 'They are building a new bridge.'",
        options: [
          "A new bridge is being built by them.",
          "A new bridge was built by them.",
          "A new bridge has been built by them.",
          "A new bridge is built by them."
        ],
        correct: 0,
        explanation: "Present continuous passive: is/am/are + being + past participle"
      },
      {
        question: "5. Identify the dangling modifier:",
        options: [
          "Walking to school, the rain started.",
          "While walking to school, it started to rain.",
          "As I walked to school, the rain started.",
          "Walking to school, I got caught in the rain."
        ],
        correct: 0,
        explanation: "The modifier 'walking to school' has no clear subject to modify"
      },
      {
        question: "6. Choose correct subject-verb agreement:",
        options: [
          "Either the students or the teacher is responsible.",
          "Either the students or the teacher are responsible.",
          "Neither the students nor the teacher are responsible.",
          "Each of the students are responsible."
        ],
        correct: 0,
        explanation: "With 'either...or', verb agrees with nearer subject: 'teacher is'"
      },
      {
        question: "7. 'Antidisestablishmentarianism' contains:",
        options: ["Prefix, root, and suffix", "Only root", "No morphemes", "Two syllables"],
        correct: 0,
        explanation: "Anti-dis-establish-ment-arian-ism = 6 morphemes"
      },
      {
        question: "8. Identify type of clause: 'What you said is true.'",
        options: ["Noun clause", "Adjective clause", "Adverb clause", "Independent clause"],
        correct: 0,
        explanation: "'What you said' functions as a noun (subject of the verb 'is')"
      },
      {
        question: "9. Which is an example of synecdoche?",
        options: ["All hands on deck.", "He's a real Romeo.", "Time flies.", "Break a leg."],
        correct: 0,
        explanation: "'Hands' represents whole sailors/workers - part for whole"
      },
      {
        question: "10. The rhetorical appeal that relies on credibility is:",
        options: ["Ethos", "Pathos", "Logos", "Kairos"],
        correct: 0,
        explanation: "Ethos = credibility/character, Pathos = emotion, Logos = logic"
      },
      {
        question: "11. Which uses 'whom' correctly?",
        options: ["Whom did you see?", "Who did you see?", "To who did you speak?", "Whom is going?"],
        correct: 0,
        explanation: "'Whom' is object pronoun; 'who' is subject pronoun"
      },
      {
        question: "12. Identify the tense: 'I will have been working for six hours.'",
        options: ["Future perfect continuous", "Future perfect", "Future continuous", "Present perfect continuous"],
        correct: 0,
        explanation: "will + have + been + present participle = future perfect continuous"
      },
      {
        question: "13. Literary device in 'The pen is mightier than the sword':",
        options: ["Metonymy", "Synecdoche", "Metaphor", "Simile"],
        correct: 0,
        explanation: "'Pen' represents writing, 'sword' represents violence - metonymy"
      },
      {
        question: "14. Which is an example of litotes?",
        options: ["He's not the brightest bulb.", "He's very intelligent.", "He's as smart as Einstein.", "His intelligence knows no bounds."],
        correct: 0,
        explanation: "Litotes uses understatement via negation"
      },
      {
        question: "15. Identify sentence with correct parallel structure:",
        options: ["She likes to cook, jog, and read.", "She likes cooking, jogging, and to read.", "She likes to cook, jogging, and reading.", "She likes cooking, jog, and read."],
        correct: 0,
        explanation: "Parallel structure requires same grammatical form"
      },
      {
        question: "16. The word 'literally' is often misused as:",
        options: ["Figuratively", "Actually", "Really", "Truly"],
        correct: 0,
        explanation: "'Literally' means actually; often misused for emphasis"
      },
      {
        question: "17. Which is an example of zeugma?",
        options: ["He lost his coat and his temper.", "Time and tide wait for none.", "She broke his car and his heart.", "Both A and C"],
        correct: 3,
        explanation: "Zeugma uses one verb with two objects in different senses"
      },
      {
        question: "18. Identify the mood: 'If I were you, I would study.'",
        options: ["Subjunctive", "Indicative", "Imperative", "Conditional"],
        correct: 0,
        explanation: "'If I were' shows subjunctive mood for hypothetical situation"
      },
      {
        question: "19. Which sentence contains a split infinitive?",
        options: ["To quickly run is his goal.", "He wants to run quickly.", "Running quickly is his goal.", "He quickly runs."],
        correct: 0,
        explanation: "'To quickly run' splits infinitive 'to run' with adverb"
      },
      {
        question: "20. The difference between 'affect' and 'effect' is:",
        options: ["Affect is verb, effect is noun", "Affect is noun, effect is verb", "They're interchangeable", "Both can be verbs"],
        correct: 0,
        explanation: "Generally: affect (verb), effect (noun); both have exceptions"
      }
    ],
    biology: [
      {
        question: "1. During DNA replication, Okazaki fragments are formed on:",
        options: ["Lagging strand", "Leading strand", "Both strands", "Template strand"],
        correct: 0,
        explanation: "Okazaki fragments are short DNA segments synthesized discontinuously on the lagging strand"
      },
      {
        question: "2. The Hardy-Weinberg principle requires all EXCEPT:",
        options: ["Natural selection", "Random mating", "Large population", "No mutation"],
        correct: 0,
        explanation: "Hardy-Weinberg equilibrium assumes NO natural selection"
      },
      {
        question: "3. Which process occurs in both photosynthesis and respiration?",
        options: ["Chemiosmosis", "Photolysis", "Calvin cycle", "Glycolysis"],
        correct: 0,
        explanation: "Chemiosmosis generates ATP in both chloroplasts (photosynthesis) and mitochondria (respiration)"
      },
      {
        question: "4. Restriction endonucleases are used in genetic engineering because they:",
        options: ["Cut DNA at specific sequences", "Join DNA fragments", "Copy DNA", "Synthesize DNA"],
        correct: 0,
        explanation: "Restriction enzymes recognize and cut DNA at specific palindromic sequences"
      },
      {
        question: "5. The plant hormone responsible for apical dominance is:",
        options: ["Auxin", "Gibberellin", "Cytokinin", "Abscisic acid"],
        correct: 0,
        explanation: "Auxin produced at shoot apex inhibits lateral bud growth"
      },
      {
        question: "6. The correct sequence in photosynthesis is:",
        options: ["Light reaction → Calvin cycle", "Calvin cycle → Light reaction", "Photolysis → Calvin cycle", "Light reaction → Photolysis"],
        correct: 0,
        explanation: "Light reactions produce ATP/NADPH, then Calvin cycle uses them for carbon fixation"
      },
      {
        question: "7. Which is NOT a characteristic of living things?",
        options: ["Luminosity", "Reproduction", "Metabolism", "Growth"],
        correct: 0,
        explanation: "Luminosity is not a biological characteristic"
      },
      {
        question: "8. The function of tRNA is to:",
        options: ["Carry amino acids", "Form ribosomes", "Store genetic code", "Catalyze reactions"],
        correct: 0,
        explanation: "tRNA carries specific amino acids to ribosomes during protein synthesis"
      },
      {
        question: "9. Crossing over occurs during:",
        options: ["Prophase I", "Metaphase I", "Anaphase I", "Telophase I"],
        correct: 0,
        explanation: "Genetic recombination (crossing over) occurs during prophase I of meiosis"
      },
      {
        question: "10. The theory of natural selection was proposed by:",
        options: ["Darwin", "Lamarck", "Mendel", "Wallace"],
        correct: 0,
        explanation: "Charles Darwin proposed natural selection in 'Origin of Species'"
      },
      {
        question: "11. DNA replication is:",
        options: ["Semi-conservative", "Conservative", "Dispersive", "Random"],
        correct: 0,
        explanation: "Meselson-Stahl experiment proved semi-conservative replication"
      },
      {
        question: "12. Which is NOT a function of the liver?",
        options: ["Insulin production", "Detoxification", "Glycogen storage", "Protein synthesis"],
        correct: 0,
        explanation: "Insulin is produced by pancreas, not liver"
      },
      {
        question: "13. The site of protein synthesis is:",
        options: ["Ribosome", "Nucleus", "Golgi apparatus", "Endoplasmic reticulum"],
        correct: 0,
        explanation: "Ribosomes (70S in prokaryotes, 80S in eukaryotes) synthesize proteins"
      },
      {
        question: "14. Which blood vessels carry oxygenated blood?",
        options: ["Pulmonary vein", "Pulmonary artery", "Both", "Neither"],
        correct: 0,
        explanation: "Pulmonary veins carry oxygenated blood from lungs to heart"
      },
      {
        question: "15. The process of conversion of NO₂ to N₂ is called:",
        options: ["Denitrification", "Nitrification", "Nitrogen fixation", "Ammonification"],
        correct: 0,
        explanation: "Denitrifying bacteria convert nitrates/nitrites to nitrogen gas"
      },
      {
        question: "16. The part of brain controlling balance is:",
        options: ["Cerebellum", "Cerebrum", "Medulla", "Hypothalamus"],
        correct: 0,
        explanation: "Cerebellum coordinates movement and maintains balance"
      },
      {
        question: "17. HIV primarily attacks:",
        options: ["T helper cells", "B cells", "Red blood cells", "Platelets"],
        correct: 0,
        explanation: "HIV specifically targets CD4+ T helper cells"
      },
      {
        question: "18. The kingdom that includes multicellular decomposers is:",
        options: ["Fungi", "Plantae", "Animalia", "Protista"],
        correct: 0,
        explanation: "Fungi are multicellular (except yeasts) decomposers"
      },
      {
        question: "19. The father of genetics is:",
        options: ["Mendel", "Darwin", "Watson", "Crick"],
        correct: 0,
        explanation: "Gregor Mendel established principles of inheritance"
      },
      {
        question: "20. PCR technique is used for:",
        options: ["DNA amplification", "Protein synthesis", "Cell division", "Tissue culture"],
        correct: 0,
        explanation: "Polymerase Chain Reaction exponentially amplifies DNA segments"
      }

    ],





       geography: [
      {
        question: "1. Which factor is most critical in explaining Ethiopia's significant altitudinal climate variation?",
        options: ["Latitudinal position", "Ocean currents", "Elevation above sea level", "Planetary wind systems"],
        correct: 2,
        explanation: "Ethiopia's complex topography, with elevations from -125m to 4550m, creates the Dega, Woyna Dega, and Kolla zones, making elevation the primary climatic control."
      },
      {
        question: "2. The formation of the Main Ethiopian Rift (MER) is a classic example of:",
        options: ["A rift valley formed by tensional forces on a continental dome", "A graben formed by compressional folding", "A rift formed by river erosion", "A valley formed by glacial activity"],
        correct: 0,
        explanation: "The MER resulted from the doming and subsequent fracturing of the Ethiopian plateau due to tensional forces from the divergence of the African and Somali tectonic plates."
      },
      {
        question: "3. In the context of Ethiopia's drainage basins, which basin is 'endorheic'?",
        options: ["The Abbay (Blue Nile) Basin", "The Awash Basin", "The Wabi Shebelle Basin", "The Rift Valley Basin"],
        correct: 3,
        explanation: "The Rift Valley Basin (e.g., Lakes Abijatta, Shala, Chamo) is endorheic, meaning its rivers do not reach the sea but terminate in lakes."
      },
      {
        question: "4. According to soil taxonomy, the dominant and highly weathered red soil of the Ethiopian highlands, prone to phosphorus fixation, is classified as:",
        options: ["Nitosols", "Vertisols", "Fluvisols", "Leptosols"],
        correct: 0,
        explanation: "Nitosols are deep, well-drained, red, clay-rich soils dominant in the humid highlands, known for their low available phosphorus due to fixation by iron and aluminum oxides."
      },
      {
        question: "5. The ecological concept explaining the distinct Afroalpine flora of the Semien and Bale Mountains, with species like Giant Lobelia, is:",
        options: ["Adaptive radiation", "Altitudinal zonation", "Genetic drift", "Convergent evolution"],
        correct: 1,
        explanation: "Altitudinal zonation creates distinct biotic communities (like the Afroalpine belt) at specific elevation ranges due to corresponding changes in temperature, precipitation, and atmospheric pressure."
      },
      {
        question: "6. Which of the following best describes the 'Kiremt' rains in the Ethiopian climatic system?",
        options: ["Light, sporadic winter rains from the Arabian Anticyclone", "The main rainy season driven by the northward migration of the ITCZ and moist SW monsoon winds", "Convectional rains in the lowlands", "Rains caused by tropical cyclones"],
        correct: 1,
        explanation: "Kiremt (June-September) is the main rainy season resulting from the Intertropical Convergence Zone (ITCZ) moving northward, bringing moisture-laden southwest monsoon winds from the Atlantic and Congo Basin."
      },
      {
        question: "7. Which of these demographic patterns is most characteristic of contemporary Ethiopia?",
        options: ["High fertility rate, declining mortality rate, youthful population", "Low fertility, high mortality, aging population", "Negative population growth, high urbanization", "Stable population, even age distribution"],
        correct: 0,
        explanation: "Ethiopia exhibits classic Stage 2/3 demographic transition: high fertility (though declining), rapidly declining mortality due to improved healthcare, and a very young population pyramid."
      },
      {
        question: "8. The 'Transhumance' pastoral system practiced by the Afar and Somali communities is primarily a response to:",
        options: ["Spatial and temporal variability of rainfall and pasture", "Cultural traditions only", "Government settlement policies", "International border restrictions"],
        correct: 0,
        explanation: "Transhumance is an adaptive strategy where herders move livestock seasonally between wet and dry season grazing areas in response to the arid/semi-arid environment's unpredictable rainfall patterns."
      },
      {
        question: "9. What is the primary environmental consequence of large-scale irrigation projects in the Awash Valley?",
        options: ["Soil salinization", "Increased seismic activity", "Formation of new rift valleys", "Glacial retreat"],
        correct: 0,
        explanation: "Inadequate drainage in irrigated areas of the Awash Basin has led to rising water tables, bringing salts to the surface, causing soil salinization and reducing agricultural productivity."
      },
      {
        question: "10. Which theory best explains Addis Ababa's primate city status in Ethiopia's urban hierarchy?",
        options: ["Central Place Theory", "Primate City Rule (Mark Jefferson)", "Multiple Nuclei Model", "Concentric Zone Model"],
        correct: 1,
        explanation: "Addis Ababa is disproportionately larger than other Ethiopian cities (over 5 million vs. <1 million for others), fitting Jefferson's Primate City Rule due to political, economic, and historical concentration."
      },
      {
        question: "11. The concept of 'Carrying Capacity' in the context of Ethiopian highland agriculture refers to:",
        options: ["The maximum population size that can be sustained by available resources without environmental degradation", "The weight animals can carry", "The storage capacity of grain silos", "The water-holding capacity of soils"],
        correct: 0,
        explanation: "Carrying capacity is the maximum population an area can support sustainably. Ethiopian highlands often exceed this due to population pressure, leading to land fragmentation, over-cultivation, and soil erosion."
      },
      {
        question: "12. The 'GERD' (Grand Ethiopian Renaissance Dam) is strategically important primarily because it:",
        options: ["Controls the source of the Blue Nile, giving Ethiopia hydropower and water management capacity", "Is primarily for flood control in Sudan", "Serves mainly as a tourist attraction", "Is a joint Egypt-Ethiopia project"],
        correct: 0,
        explanation: "GERD, on the Blue Nile, will be Africa's largest hydropower dam, giving Ethiopia control over its water resources, generating electricity for development, and allowing regulated flow management."
      },
      {
        question: "13. Which geographical process is primarily responsible for the formation of the Danakil Depression?",
        options: ["Subsidence due to tectonic rifting and crustal thinning", "Karst dissolution of limestone", "Glacial scouring during ice ages", "Wind erosion over millennia"],
        correct: 0,
        explanation: "The Danakil Depression, one of Earth's lowest and hottest places, formed by tectonic subsidence as the Arabian, African, and Somali plates diverge, causing crustal stretching and sinking."
      },
      {
        question: "14. The 'Green Revolution' in Ethiopia has had limited success in highland smallholder systems mainly due to:",
        options: ["High cost of inputs, inadequate extension services, and soil acidity problems", "Lack of available technology", "Too much rainfall", "Farmers' resistance to change"],
        correct: 0,
        explanation: "While improved seeds and fertilizers are promoted, challenges include high costs, poor market access, credit limitations, inadequate extension support, and widespread soil acidity (pH<5.5) limiting nutrient availability."
      },
      {
        question: "15. Which of these is NOT a characteristic of 'Vertisols' (black cotton soils) in Ethiopia?",
        options: ["High permeability and rapid drainage", "High clay content (smectite)", "Cracking when dry, swelling when wet", "High fertility but difficult to work"],
        correct: 0,
        explanation: "Vertisols have very LOW permeability due to high clay content. They swell when wet (becoming waterlogged) and develop deep cracks when dry, making cultivation challenging."
      },
      {
        question: "16. Ethiopia's population distribution is primarily influenced by:",
        options: ["Altitude and associated climatic conditions", "Proximity to international borders", "Mineral resource locations", "Historical trade routes only"],
        correct: 0,
        explanation: "Over 80% of Ethiopians live in the highlands (above 1500m) due to favorable climate (temperate, reliable rainfall), fertile soils, and historical avoidance of lowland diseases like malaria."
      },
      {
        question: "17. What is the primary cause of deforestation in the Ethiopian highlands?",
        options: ["Expansion of agricultural land and fuelwood demand", "Commercial logging for timber export", "Natural forest fires", "Industrial pollution"],
        correct: 0,
        explanation: "Deforestation is driven by smallholder agricultural expansion (cropland and grazing), and over 90% of households rely on fuelwood/charcoal for energy, not by large-scale commercial logging."
      },
      {
        question: "18. Which city is correctly matched with its primary economic base?",
        options: ["Addis Ababa: Political capital and services", "Dire Dawa: Coffee processing", "Bahir Dar: Textile manufacturing", "Awasa: Cement production"],
        correct: 0,
        explanation: "Addis Ababa is the political, administrative, and service hub. Dire Dawa is a trade/transport hub, Bahir Dar is tourism/hydroelectric, Awasa is administrative/commercial for SNNP region."
      },
      {
        question: "19. The 'Theory of Plate Tectonics' explains Ethiopia's geology by:",
        options: ["Its location at the triple junction of the African, Somali, and Arabian plates", "Being part of the stable African Shield", "Resulting from meteor impacts", "Formation by oceanic sedimentation"],
        correct: 0,
        explanation: "Ethiopia sits on the seismically active Afar Triple Junction where three tectonic plates diverge, causing rifting, volcanism, and the formation of the East African Rift system."
      },
      {
        question: "20. Remote sensing and GIS are particularly valuable in Ethiopian geography for:",
        options: ["Monitoring land use change, drought assessment, and resource mapping", "Predicting earthquakes accurately", "Controlling population growth", "Determining historical climate patterns"],
        correct: 0,
        explanation: "GIS and remote sensing are crucial tools for monitoring environmental changes (deforestation, land degradation), assessing agricultural conditions, mapping resources, and planning infrastructure in data-scarce regions."
      }
    ],
    history: [
      {
        question: "1. The primary significance of the 1270 AD ascension of the Solomonic Dynasty under Yekuno Amlak was:",
        options: ["Restoration of the Aksumite lineage and centralized monarchy", "Introduction of Christianity to Ethiopia", "Establishment of trade with Rome", "Defeat of the Ottoman Empire"],
        correct: 0,
        explanation: "Yekuno Amlak overthrew the Zagwe Dynasty, claiming restoration of the Solomonic line from Aksumite kings, re-establishing a centralized monarchy that lasted until 1974."
      },
      {
        question: "2. The 'Zemene Mesafint' (Age of Princes) 1769-1855 is characterized by:",
        options: ["Decentralization of power, regional warlordism, and decline of imperial authority", "Great economic prosperity and territorial expansion", "Religious unification under Islam", "Colonial occupation by European powers"],
        correct: 0,
        explanation: "The Zemene Mesafint was a period of civil war where provincial lords (Ras) held real power, the Emperor was a figurehead, and the country was fragmented until Tewodros II restored central authority."
      },
      {
        question: "3. Which factor was most critical to Emperor Menelik II's victory at Adwa (1896)?",
        options: ["Strategic use of terrain, modern arms procurement, and unified Ethiopian command", "Numerical superiority alone", "Assistance from European allies", "Italian logistical errors only"],
        correct: 0,
        explanation: "Menelik skillfully used the mountainous terrain, had acquired modern rifles (via French/Somali coast), mobilized a large national army, and maintained unified command, unlike the divided Italians."
      },
      {
        question: "4. The primary objective of the 'Italiana' (Italian occupation 1936-1941) was to:",
        options: ["Create an East African colonial empire connecting Eritrea and Somalia", "Spread Christianity", "Liberate Ethiopia from feudalism", "Establish a democratic government"],
        correct: 0,
        explanation: "Mussolini aimed to create a vast East African colony (Africa Orientale Italiana) linking Eritrea, Ethiopia, and Somalia for prestige, resources, and strategic control of the Horn of Africa."
      },
      {
        question: "5. The 'Derg' regime (1974-1991) is ideologically classified as:",
        options: ["Marxist-Leninist military junta", "Democratic socialist", "Monarchist restorationist", "Islamic theocracy"],
        correct: 0,
        explanation: "The Derg (Provisional Military Administrative Council) adopted a Marxist-Leninist ideology, nationalizing land and industry, aligning with the Soviet bloc, and suppressing opposition through the 'Red Terror'."
      },
      {
        question: "6. The Aksumite Kingdom's decline in the 7th century AD is attributed to:",
        options: ["Shifts in trade routes and environmental degradation", "Invasion by the Ottoman Empire", "Mass conversion to Islam", "Overexpansion into Europe"],
        correct: 0,
        explanation: "Aksum declined due to the rise of Islamic powers redirecting Red Sea trade, coupled with possible environmental factors like deforestation, soil exhaustion, and climate change affecting agriculture."
      },
      {
        question: "7. The primary cause of the 1974 Ethiopian Revolution was:",
        options: ["Socio-economic grievances, famine, and demands for political reform", "Foreign invasion", "Religious conflict", "Dynastic succession dispute"],
        correct: 0,
        explanation: "The revolution stemmed from famine (1973 Wollo), economic crisis, student protests for land reform, ethnic grievances, and the imperial government's inability to address modernization demands."
      },
      {
        question: "8. Emperor Haile Selassie I's modernization efforts (1916-1974) were characterized by:",
        options: ["Centralized state-building, educational expansion, but preservation of feudal land tenure", "Complete democratization and land redistribution", "Isolation from international affairs", "Promotion of ethnic federalism"],
        correct: 0,
        explanation: "Haile Selassie modernized administration, created a national army, expanded education (Haile Selassie I University), but maintained the feudal 'gult' land system, fueling rural discontent."
      },
      {
        question: "9. The 1991 fall of the Derg regime resulted in:",
        options: ["Establishment of ethnic federalism under EPRDF", "Restoration of the monarchy", "Direct UN administration", "Partition of Ethiopia"],
        correct: 0,
        explanation: "The Ethiopian People's Revolutionary Democratic Front (EPRDF) captured Addis Ababa, established a transitional government, and introduced ethnic federalism with the 1995 constitution."
      },
      {
        question: "10. The 'Oromo migration' (16th-17th centuries) impacted Ethiopian history by:",
        options: ["Demographic and political restructuring of the highlands", "Introducing Christianity to the region", "Establishing the first unified empire", "Ending all trade with the Middle East"],
        correct: 0,
        explanation: "The large-scale Oromo population movements (Gadaa expansion) reshaped the demographic, linguistic, and political landscape, challenging the Solomonic state and leading to new integration patterns."
      },
      {
        question: "11. Which best describes the role of the Ethiopian Orthodox Tewahedo Church in medieval Ethiopia?",
        options: ["Center of literacy, culture, and political legitimacy", "Solely a religious institution with no political role", "Promoter of Islamic law", "Agent of European colonization"],
        correct: 0,
        explanation: "The Church was integral to the state, providing scribes, legitimizing rulers via Solomonic ideology, preserving Ge'ez literature, and serving as a major landowner and cultural unifier."
      },
      {
        question: "12. The primary significance of the 1529 Battle of Shimbra Kure was:",
        options: ["It began the devastating Ethiopian-Adal War, threatening the Christian kingdom", "It ended Ottoman influence in the region", "It established Portuguese control", "It unified Ethiopia permanently"],
        correct: 0,
        explanation: "The Muslim victory under Imam Ahmed ibn Ibrahim al-Ghazi (Ahmed Gragn) began a 14-year war that devastated the highlands, nearly toppling the Christian state until Portuguese intervention."
      },
      {
        question: "13. Emperor Tewodros II's (1855-1868) historical legacy is primarily as:",
        options: ["A modernizer and unifier who attempted centralization but failed due to internal and external pressures", "A successful economic reformer", "A colonial collaborator", "A promoter of ethnic separatism"],
        correct: 0,
        explanation: "Tewodros ended the Zemene Mesafint, tried to centralize power, modernize the army, and reduce church/feudal power, but his harsh methods and conflict with Britain led to his defeat at Magdala."
      },
      {
        question: "14. The 'Federal Democratic Republic of Ethiopia' established in 1995 is based on:",
        options: ["Ethnic federalism with regional states based on language/ethnicity", "A unitary centralized system", "A monarchy with constitutional limits", "A Islamic caliphate model"],
        correct: 0,
        explanation: "The 1995 constitution created nine ethnically-based regional states (e.g., Oromia, Amhara, SNNPR) with rights of self-determination, including secession, under a federal parliamentary system."
      },
      {
        question: "15. The primary economic basis of the Aksumite Kingdom was:",
        options: ["International trade (ivory, gold, aromatics) via Red Sea ports", "Subsistence agriculture only", "Slave raiding in Europe", "Nomadic pastoralism"],
        correct: 0,
        explanation: "Aksum's wealth came from controlling trade between the Roman/Byzantine world and India/Africa, exporting ivory, gold, tortoiseshell, and aromatics, using its ports like Adulis."
      },
      {
        question: "16. The 1977-78 'Ogaden War' was fundamentally about:",
        options: ["Ethiopian sovereignty over Somali-inhabited territory and Cold War proxy conflict", "Religious conflict between Christians and Muslims", "Control of Nile waters", "Access to Indian Ocean ports only"],
        correct: 0,
        explanation: "Somalia invaded to annex the Ogaden region, but with massive Soviet/Cuban military aid switching to Ethiopia, it became a proxy war where Ethiopia retained the territory."
      },
      {
        question: "17. The primary historical controversy surrounding the 'Zagwe Dynasty' (c. 900-1270 AD) relates to:",
        options: ["Its legitimacy and ethnic origins versus Solomonic claims", "Its introduction of Christianity", "Its failure to build churches", "Its conquest of Egypt"],
        correct: 0,
        explanation: "The Zagwe (possibly Agaw origin) were later portrayed as usurpers by Solomonic chroniclers, despite their significant achievements like the Lalibela rock-hewn churches."
      },
      {
        question: "18. The 'Eritrean War of Independence' (1961-1991) was mainly driven by:",
        options: ["Eritrean nationalism and desire for self-determination after federation with Ethiopia failed", "Religious differences (Christian vs Muslim)", "Economic competition over Assab port", "Cold War ideologies only"],
        correct: 0,
        explanation: "The war stemmed from Ethiopia's 1962 annexation of Eritrea (a UN federated unit), erasing its autonomy, leading to armed struggle by ELF and later EPLF for independence achieved in 1991."
      },
      {
        question: "19. The primary impact of the 16th-century 'Oromo migrations' on Ethiopian state formation was:",
        options: ["Forcing adaptation of the imperial system to incorporate Oromo military and political elites", "Complete destruction of the Ethiopian state", "Immediate unification under Oromo rule", "Introduction of European feudalism"],
        correct: 0,
        explanation: "The Solomonic dynasty gradually integrated Oromo groups through military service, marriage alliances, and granting land, with some Oromo lineages (like Yejju) becoming powerful regents."
      },
      {
        question: "20. The 2000 Ethiopia-Eritrea border war resulted in:",
        options: ["A stalemate with frozen conflict and no diplomatic relations for two decades", "Clear Ethiopian victory and annexation of Eritrea", "Unification of the two countries", "Immediate permanent peace treaty"],
        correct: 0,
        explanation: "The costly war ended with the Algiers Agreement (2000) and EEBC border ruling (2002), but Ethiopia rejected it, leading to a 'no war, no peace' stalemate until the 2018 peace deal."
      }
    ],

    economics: [
      {
        question: "1. The primary reason Ethiopia remains a 'low-income food-deficit country' despite agricultural potential is:",
        options: ["Low productivity due to fragmented landholdings, limited technology, and rainfed dependence", "Lack of arable land", "Complete absence of markets", "Over-reliance on industrial exports"],
        correct: 0,
        explanation: "Smallholder farming dominates with tiny plots, traditional methods, minimal irrigation, and vulnerability to climate shocks, constraining productivity and food security."
      },
      {
        question: "2. In national income accounting, Ethiopia's high 'Informal Sector' employment indicates:",
        options: ["Limited formal job creation and prevalence of low-productivity self-employment", "A highly developed industrial economy", "Effective government regulation", "Advanced social security coverage"],
        correct: 0,
        explanation: "Over 80% of employment is informal (small trade, services, unregistered enterprises), reflecting agriculture's dominance and limited formal manufacturing/service job growth."
      },
      {
        question: "3. The 'Structural Adjustment Program' (SAPs) of the 1990s in Ethiopia emphasized:",
        options: ["Market liberalization, privatization, and fiscal austerity", "Expansion of state-owned enterprises", "Price controls on all commodities", "Isolation from global trade"],
        correct: 0,
        explanation: "Under IMF/World Bank guidance, Ethiopia reduced tariffs, removed subsidies, started privatizing SOEs, and devalued the birr to shift toward a market-oriented economy."
      },
      {
        question: "4. The 'Dutch Disease' in economics could threaten Ethiopia if:",
        options: ["Large forex inflows from a sector (e.g., coffee exports) cause currency appreciation, harming other exports", "Too many Dutch investors enter the market", "Disease affects livestock", "Climate change reduces rainfall"],
        correct: 0,
        explanation: "If major forex earners (coffee, gold, or potentially minerals) cause the birr to appreciate, it could make other exports (like textiles) less competitive internationally."
      },
      {
        question: "5. The 'Multiplier Effect' of infrastructure investment (like GERD) works through:",
        options: ["Creating construction jobs, boosting related industries, and increasing aggregate demand", "Directly printing more currency", "Reducing imports immediately", "Eliminating taxes"],
        correct: 0,
        explanation: "Initial infrastructure spending increases income for workers/suppliers, who then spend on goods/services, creating further rounds of economic activity and employment."
      },
      {
        question: "6. Ethiopia's chronic trade deficit is primarily due to:",
        options: ["Low-value primary exports versus high-value manufactured/energy imports", "Excessive export of manufactured goods", "Lack of export products entirely", "Complete ban on imports"],
        correct: 0,
        explanation: "Exports are dominated by coffee, gold, oilseeds (low price volatility), while imports include machinery, petroleum, chemicals, and manufactured goods (higher value), creating a structural imbalance."
      },
      {
        question: "7. 'Inflation' in Ethiopia is often 'cost-push' caused by:",
        options: ["Rising global oil prices, domestic food supply shocks, and currency depreciation", "Excessive government budget surpluses", "Too much competition among businesses", "Overproduction of goods"],
        correct: 0,
        explanation: "Ethiopia's inflation spikes often follow fuel price hikes, drought-induced food shortages, and birr devaluation raising import costs, rather than excessive demand."
      },
      {
        question: "8. The 'Lewis Two-Sector Model' describes Ethiopia's development challenge as:",
        options: ["Transferring surplus labor from low-productivity agriculture to higher-productivity industry", "Moving from industry to agriculture", "Eliminating the service sector", "Focusing only on subsistence farming"],
        correct: 0,
        explanation: "The model explains how development requires shifting labor from traditional agriculture (where marginal productivity is near zero) to modern industry, but Ethiopia's manufacturing growth has been too slow to absorb this labor."
      },
      {
        question: "9. 'Crowding Out' in fiscal policy refers to when:",
        options: ["Government borrowing raises interest rates, reducing private investment", "Government spending directly increases private investment", "Exports crowd out imports", "Foreign aid replaces domestic savings"],
        correct: 0,
        explanation: "If the government funds large deficits (e.g., for infrastructure) by domestic borrowing, it can increase demand for loanable funds, raising interest rates and discouraging business borrowing for investment."
      },
      {
        question: "10. 'Import Substitution Industrialization' (ISI) in Ethiopia aimed to:",
        options: ["Develop domestic industries to replace manufactured imports", "Increase primary commodity exports", "Eliminate all imports", "Promote free trade without tariffs"],
        correct: 0,
        explanation: "Ethiopia pursued ISI in the 1960s-80s (textiles, footwear, food processing) behind tariff barriers to reduce import dependence and build industrial capacity, with mixed results due to inefficiency."
      },
      {
        question: "11. The 'Gini Coefficient' measures:",
        options: ["Income inequality within a country", "Absolute poverty levels", "GDP growth rate", "Inflation rate"],
        correct: 0,
        explanation: "Ranging from 0 (perfect equality) to 1 (perfect inequality), Ethiopia's Gini is around 0.35, indicating moderate inequality, but with significant urban-rural and regional disparities."
      },
      {
        question: "12. 'Fiscal Policy' tools used by Ethiopia include:",
        options: ["Government spending on infrastructure and taxation", "Interest rate adjustments by the central bank", "Currency devaluation", "Direct control of private prices"],
        correct: 0,
        explanation: "The government uses spending (on roads, education) and taxation (VAT, income tax) to influence economic activity, aiming for growth and redistribution, though often running deficits."
      },
      {
        question: "13. 'Comparative Advantage' suggests Ethiopia should specialize in exporting:",
        options: ["Goods with lower opportunity cost (e.g., coffee, horticulture)", "Whatever its trading partners produce", "Only manufactured goods", "Products with the highest absolute cost"],
        correct: 0,
        explanation: "Ethiopia has comparative advantage in coffee (ideal climate), cut flowers (high-altitude), and leather (livestock abundance) due to favorable natural resources and lower relative production costs."
      },
      {
        question: "14. The 'Poverty Trap' theory explains Ethiopia's challenge as:",
        options: ["Low income → low savings → low investment → low productivity → low income", "Too much foreign aid causing dependency", "Excessive government intervention", "Overpopulation as the sole cause"],
        correct: 0,
        explanation: "Poor households cannot save/invest in education or capital, remaining in low-productivity activities, perpetuating poverty across generations without external intervention (e.g., social protection)."
      },
      {
        question: "15. 'Monetary Policy' in Ethiopia is constrained by:",
        options: ["Underdeveloped financial markets and dominance of the National Bank financing government deficits", "Excessive independence of the central bank", "Lack of a national currency", "Complete dollarization of the economy"],
        correct: 0,
        explanation: "The National Bank of Ethiopia often monetizes deficits, limiting its ability to control money supply. Weak banking competition and shallow bond markets reduce traditional policy tool effectiveness."
      },
      {
        question: "16. 'Human Capital' development is crucial for Ethiopia because:",
        options: ["Education and health improvements increase labor productivity and growth potential", "It replaces the need for natural resources", "It reduces population size", "It immediately eliminates unemployment"],
        correct: 0,
        explanation: "Investing in education (technical skills) and health (reducing disease burden) creates a more productive workforce capable of moving into higher-value industries and innovation."
      },
      {
        question: "17. The 'Lorenz Curve' graphically represents:",
        options: ["Income distribution compared to perfect equality", "The relationship between inflation and unemployment", "Supply and demand curves", "Production possibility frontier"],
        correct: 0,
        explanation: "The Lorenz Curve plots cumulative income share against cumulative population share. The further it bows from the 45° line (perfect equality), the greater the income inequality."
      },
      {
        question: "18. 'Opportunity Cost' in Ethiopia's development planning is illustrated by:",
        options: ["Choosing to build GERD may mean less spending on primary healthcare or education", "Having unlimited resources for all projects", "Foreign aid covering all costs", "All projects having zero cost"],
        correct: 0,
        explanation: "With limited budget resources, investing billions in GERD has high opportunity cost—those funds could have been used for other urgent needs like health posts, schools, or rural roads."
      },
      {
        question: "19. The 'J-Curve effect' in trade describes:",
        options: ["Currency devaluation initially worsens trade balance before improving it", "Immediate improvement in trade after devaluation", "Linear relationship between exports and GDP", "Continuous decline in imports"],
        correct: 0,
        explanation: "When the birr devalues, import prices rise immediately (increasing import bill), but export volumes respond slowly as contracts adjust, so trade balance worsens before improving as exports become cheaper internationally."
      },
      {
        question: "20. 'Sustainable Development' in the Ethiopian context emphasizes:",
        options: ["Meeting present needs without compromising future generations' ability to meet theirs", "Maximizing GDP growth at all costs", "Preserving all natural resources without use", "Eliminating all industrial activity"],
        correct: 0,
        explanation: "Given climate vulnerability and resource degradation, Ethiopia's Climate Resilient Green Economy (CRGE) strategy aims for growth while reducing emissions and preserving ecosystems like forests and soils."
      }
    ]
 };

  


  const currentQuestions = quizData[currentSubject];
  const currentQuestionData = currentQuestions[currentQuestion];

  // Handlers
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
    setShowScore(true);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setScore(0);
    setShowScore(false);
    setAnsweredQuestions(new Set());
    setShowExplanation(false);
    setTimeLeft(7200);
  };

  const handleSubjectChange = (subjectId) => {
    setCurrentSubject(subjectId);
    resetQuiz();
  };

  // Subject Button
  const SubjectButton = ({ subject }) => {
    const isActive = currentSubject === subject.id;
    return (
      <button
        onClick={() => handleSubjectChange(subject.id)}
        className={`p-4 rounded-lg border-2 transition-all ${isActive ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'}`}
      >
        <div className="text-center">
          <div className="font-bold">{subject.name}</div>
          {/* <div className="text-sm mt-1">{subject.code}</div> */}
        </div>
      </button>
    );
  };

  // Results Screen
  if (showScore) {
    const subjectName = subjects.find(s => s.id === currentSubject).name;
    const percentage = Math.round((score / currentQuestions.length) * 100);
    
    return (
      <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-8">
  <div className="max-w-6xl mx-auto">
    <div className="text-center mb-6">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">
        Subject: {subjectName}
      </h1>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
            <div className="mb-3 sm:mb-0">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                {subjectName} Assessment
              </h2>
            </div>
            <div className="text-2xl sm:text-3xl">
              {percentage >= 80 ? '' : percentage >= 60 ? '' : ''}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8">
            <div className="bg-blue-50 p-3 sm:p-4 rounded text-center border border-blue-200">
              <div className="text-xl sm:text-2xl font-bold text-blue-600">{score}</div>
              <div className="text-xs sm:text-sm text-blue-800">Correct</div>
            </div>
            <div className="bg-green-50 p-3 sm:p-4 rounded text-center border border-green-200">
              <div className="text-xl sm:text-2xl font-bold text-green-600">
                {currentQuestions.length - score}
              </div>
              <div className="text-xs sm:text-sm text-green-800">Incorrect</div>
            </div>
            <div className="bg-purple-50 p-3 sm:p-4 rounded text-center border border-purple-200">
              <div className="text-xl sm:text-2xl font-bold text-purple-600">{percentage}%</div>
              <div className="text-xs sm:text-sm text-purple-800">Score</div>
            </div>
            <div className="bg-amber-50 p-3 sm:p-4 rounded text-center border border-amber-200">
              <div className="text-xl sm:text-2xl font-bold text-amber-600">
                {Math.round((answeredQuestions.size / currentQuestions.length) * 100)}%
              </div>
              <div className="text-xs sm:text-sm text-amber-800">Answered</div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4">Switch Subject</h3>
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 sm:gap-3">
            {subjects.map(subject => (
              <button
                key={subject.id}
                onClick={() => handleSubjectChange(subject.id)}
                className="p-2 sm:p-3 bg-gray-50 hover:bg-gray-100 rounded text-center transition-colors"
              >
                <div className="text-sm sm:text-base font-medium">{subject.name}</div>
                {/* <div className="text-xs text-gray-500 mt-1">{subject.code}</div> */}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
    );
  }

  // Main Quiz Screen
  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-8">
  <div className="max-w-7xl mx-auto">
    {/* Fixed Back Button - Mobile optimized */}
    <div className="fixed top-2 left-2 right-2 z-10 md:top-4 md:left-4 md:right-auto">
      
        <ChevronLeft onClick={() => navigate('/studentstudy-dashboard')} className="w-8 h-8" />
        {/* <span className="truncate">Back to Home</span> */}
     
    </div>

    {/* Main Content with padding for fixed button */}
    <div className="pt-12 md:pt-0">
      <div className="text-center mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">
           Grade 12
        </h1>
        {/* <p className="text-sm sm:text-base text-gray-600"> </p> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Subject Selection */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">Subjects</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2 sm:gap-3">
              {subjects.map(subject => (
                <SubjectButton key={subject.id} subject={subject} />
              ))}
            </div>
          </div>
        </div>

        {/* Main Quiz */}
        <div className="lg:col-span-3 order-1 lg:order-2">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                  {subjects.find(s => s.id === currentSubject).name}
                </h2>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3">
                <div className="flex items-center bg-blue-50 text-blue-800 px-3 py-1.5 sm:px-4 sm:py-2 rounded border border-blue-200">
                  <span className="font-mono font-bold text-sm sm:text-base">
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4 sm:mb-6">
              <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">
                <span>Progress</span>
                <span>Question {currentQuestion + 1} of 20</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / 20) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question */}
            <div>
              <div className="bg-gray-50 rounded p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-200">
                <div className="flex items-start">
                  <div className="bg-blue-100 text-blue-800 w-8 h-8 sm:w-10 sm:h-10 rounded flex items-center justify-center font-bold mr-3 sm:mr-4 flex-shrink-0">
                    {currentQuestion + 1}
                  </div>
                  <p className="text-base sm:text-lg text-gray-700">{currentQuestionData.question}</p>
                </div>
              </div>

              {/* Options - Stack on mobile, grid on tablet+ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                {currentQuestionData.options.map((option, index) => {
                  const isSelected = selectedAnswers[currentQuestion] === index;
                  const isCorrect = index === currentQuestionData.correct;
                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={`p-3 sm:p-4 text-left rounded border-2 transition-all ${
                        isSelected 
                          ? isCorrect
                            ? 'bg-green-50 border-green-500'
                            : 'bg-red-50 border-red-500'
                          : 'bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded mr-2 sm:mr-3 flex-shrink-0 ${
                          isSelected 
                            ? isCorrect
                              ? 'bg-green-500 text-white'
                              : 'bg-red-500 text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="flex-1 text-sm sm:text-base break-words">{option}</span>
                        {isSelected && (
                          <div className="ml-2 flex-shrink-0">
                            {isCorrect ? '✓' : '✗'}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {showExplanation && selectedAnswers[currentQuestion] !== undefined && (
                <div className={`p-3 sm:p-4 rounded mb-4 sm:mb-6 ${
                  selectedAnswers[currentQuestion] === currentQuestionData.correct
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-start">
                    <div className={`w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded mr-2 sm:mr-3 flex-shrink-0 ${
                      selectedAnswers[currentQuestion] === currentQuestionData.correct
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                    }`}>
                      {selectedAnswers[currentQuestion] === currentQuestionData.correct ? '✓' : '✗'}
                    </div>
                    <div>
                      <p className="font-medium mb-1 text-sm sm:text-base">
                        {selectedAnswers[currentQuestion] === currentQuestionData.correct
                          ? 'Correct Answer'
                          : 'Incorrect Answer'}
                      </p>
                      <p className="text-gray-700 text-sm sm:text-base">{currentQuestionData.explanation}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation - Stacked on mobile */}
              <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 sm:gap-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <button
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    className={`px-4 py-2.5 sm:px-6 sm:py-3 rounded font-medium text-sm sm:text-base flex-1 ${
                      currentQuestion === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-600 hover:bg-gray-700 text-white'
                    }`}
                  >
                    Previous
                  </button>
                  
                  <button
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="px-4 py-2.5 sm:px-6 sm:py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded font-medium text-sm sm:text-base flex-1"
                  >
                    {showExplanation ? 'Hide' : 'Explanation'}
                  </button>
                </div>

                <div>
                  {currentQuestion === 19 ? (
                    <button
                      onClick={handleSubmit}
                      className="w-full sm:w-auto px-6 py-2.5 sm:px-8 sm:py-3 bg-green-600 hover:bg-green-700 text-white rounded font-medium text-sm sm:text-base"
                    >
                      Submit Quiz
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      className="w-full sm:w-auto px-6 py-2.5 sm:px-8 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-sm sm:text-base"
                    >
                      Next Question
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
</div>
  );
};

export default EthiopianUniversityEntranceExam;