// // PhoneVerification.jsx
// import { useState } from "react";
// import axios from "axios";
// import { CheckCircle, Phone, Key, Loader2 } from "lucide-react";

// const PhoneVerification = () => {
//   const [phone, setPhone] = useState("");
//   const [code, setCode] = useState("");
//   const [step, setStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState(false);

//   // Send code to Twilio
//   const sendCode = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       await axios.post("http://localhost:5000/api/send-verification", {
//         phone: "+251" + phone, // Send full E.164 format
//       });
//       setStep(2);
//     } catch (err) {
//       setError(err.response?.data?.error || "Failed to send code");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Verify code with Twilio
//   const verifyCode = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await axios.post("http://localhost:5000/api/check-verification", {
//         phone: "+251" + phone,
//         code,
//       });
//       if (res.data.success) {
//         setSuccess(true);
//         setTimeout(() => setSuccess(false), 3000);
//       }
//     } catch (err) {
//       setError(err.response?.data?.error || "Verification failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetFlow = () => {
//     setStep(1);
//     setCode("");
//     setError("");
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-100">
//         <div className="text-center mb-8">
//           <div className="flex justify-center mb-4">
//             <div className="bg-blue-100 p-3 rounded-full">
//               <Phone className="w-8 h-8 text-blue-600" />
//             </div>
//           </div>
//           <h1 className="text-3xl font-bold text-gray-800 mb-2">Phone Verification</h1>
//           <p className="text-gray-500">
//             {step === 1
//               ? "Enter your phone number to receive a code"
//               : "Enter the verification code sent to your phone"}
//           </p>
//         </div>

//         {success ? (
//           <div className="text-center py-8">
//             <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
//             <h2 className="text-2xl font-bold text-gray-800 mb-2">Verified!</h2>
//             <p className="text-gray-600">Your phone number has been successfully verified.</p>
//           </div>
//         ) : (
//           <>
//             {step === 1 ? (
//               <div className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Phone Number
//                   </label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <span className="text-gray-500">+251</span>
//                     </div>
//                     <input
//                       type="tel"
//                       value={phone}
//                       onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 9))}
//                       className="w-full pl-16 py-3.5 border border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//                       placeholder="9XXXXXXXX"
//                       disabled={loading}
//                     />
//                   </div>
//                   <p className="mt-2 text-sm text-gray-500">
//                     Enter your 9-digit Ethiopian mobile number
//                   </p>
//                 </div>
//               </div>
//             ) : (
//               <div className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Verification Code
//                   </label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <Key className="w-5 h-5 text-gray-400" />
//                     </div>
//                     <input
//                       type="text"
//                       value={code}
//                       onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
//                       className="w-full pl-12 py-3.5 border border-gray-300 rounded-xl text-lg tracking-widest text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//                       placeholder="000000"
//                       maxLength={6}
//                       disabled={loading}
//                     />
//                   </div>
//                   <p className="mt-2 text-sm text-gray-500">Enter the 6-digit code sent to {phone}</p>
//                 </div>
//                 <button
//                   onClick={resetFlow}
//                   className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
//                 >
//                   ← Change phone number
//                 </button>
//               </div>
//             )}

//             {error && (
//               <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
//                 <p className="text-red-600 text-sm font-medium">{error}</p>
//               </div>
//             )}

//             <div className="mt-8">
//               {step === 1 ? (
//                 <button
//                   onClick={sendCode}
//                   disabled={!phone || phone.length !== 9 || loading}
//                   className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center"
//                 >
//                   {loading ? (
//                     <>
//                       <Loader2 className="w-5 h-5 mr-2 animate-spin" />
//                       Sending...
//                     </>
//                   ) : (
//                     "Send Verification Code"
//                   )}
//                 </button>
//               ) : (
//                 <button
//                   onClick={verifyCode}
//                   disabled={code.length !== 6 || loading}
//                   className="w-full py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center"
//                 >
//                   {loading ? (
//                     <>
//                       <Loader2 className="w-5 h-5 mr-2 animate-spin" />
//                       Verifying...
//                     </>
//                   ) : (
//                     "Verify Code"
//                   )}
//                 </button>
//               )}
//             </div>

//             <div className="mt-6 text-center">
//               <p className="text-sm text-gray-500">
//                 {step === 1 ? (
//                   "By continuing, you agree to receive an SMS for verification."
//                 ) : (
//                   "Didn't receive the code? "
//                 )}
//                 {step === 2 && (
//                   <button onClick={sendCode} className="text-blue-600 hover:text-blue-800 font-medium">
//                     Resend code
//                   </button>
//                 )}
//               </p>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PhoneVerification;




import React, { useState, useEffect } from 'react';

const EthiopianUniversityEntranceExam = () => {
  const [currentSubject, setCurrentSubject] = useState('physics');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(7200); // 2 hours like actual EUEE
  const [showExplanation, setShowExplanation] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());

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
        options: ["0.08 J", "0.8 J", "0.04 J", "0.4 J"],
        correct: 0,
        explanation: "E = ½CV² = 0.5×4×10⁻⁶×(200)² = 0.08 J"
      },
      {
        question: "8. The de Broglie wavelength of electron accelerated through 150 V is approximately:",
        options: ["1 Å", "10 Å", "0.1 Å", "100 Å"],
        correct: 0,
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
        options: ["40 days", "30 days", "60 days", "20 days"],
        correct: 0,
        explanation: "75% decay = 2 half-lives = 2×20 = 40 days"
      },
      {
        question: "11. In a p-n junction diode, the reverse saturation current doubles for every:",
        options: ["10°C rise", "5°C rise", "20°C rise", "15°C rise"],
        correct: 0,
        explanation: "Reverse saturation current approximately doubles for every 10°C rise in temperature"
      },
      {
        question: "12. The magnetic field at center of circular coil of radius R carrying current I is:",
        options: ["μ₀I/2R", "μ₀I/2πR", "μ₀I/R", "2μ₀I/R"],
        correct: 0,
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
        options: ["317.5 m/s", "635 m/s", "2540 m/s", "895 m/s"],
        correct: 0,
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
        options: ["Current, area, number of turns", "Current only", "Area only", "Number of turns only"],
        correct: 0,
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
        options: ["sp", "sp²", "sp³", "sp³d"],
        correct: 0,
        explanation: "Acetylene has sp hybridization with linear geometry"
      },
      {
        question: "3. The pH of 0.01 M NH₄Cl solution (Kb for NH₃ = 1.8×10⁻⁵) is approximately:",
        options: ["5.63", "6.63", "3.63", "8.37"],
        correct: 0,
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
        options: ["693 s", "346 s", "1386 s", "173 s"],
        correct: 0,
        explanation: "t = (2.303/k)log(1/(1-0.75)) = (2.303/0.002)log4 = 693 s"
      },
      {
        question: "7. The hybridization of Xe in XeF₄ is:",
        options: ["sp³d²", "sp³d", "sp³", "sp³d³"],
        correct: 0,
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
        options: ["All of these", "Cu deposits at cathode", "O₂ evolves at anode", "Cu anode dissolves"],
        correct: 0,
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
        options: ["Azimuthal (l)", "Principal (n)", "Magnetic (m)", "Spin (s)"],
        correct: 0,
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
        options: ["Face centered cubic", "Body centered cubic", "Simple cubic", "Hexagonal"],
        correct: 0,
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
        options: ["Ammoniacal AgNO₃", "Fehling's solution", "Benedict's reagent", "Schiff's reagent"],
        correct: 0,
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
        options: ["[Co(en)₃]³⁺", "[Co(NH₃)₆]³⁺", "[Ni(CO)₄]", "[PtCl₄]²⁻"],
        correct: 0,
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
        options: ["450°C, 200 atm, Fe catalyst", "500°C, 100 atm, Ni catalyst", "400°C, 300 atm, Pt catalyst", "350°C, 150 atm, Cu catalyst"],
        correct: 0,
        explanation: "Industrial conditions: 450-500°C, 150-200 atm, iron catalyst with promoters"
      }
    ],
    mathematics: [
      {
        question: "1. ∫₀^{π/2} sin³x cos²x dx equals:",
        options: ["2/35", "2/15", "8/15", "4/15"],
        correct: 0,
        explanation: "Using reduction formula or Beta function: B(2, 3/2)/2 = 2/35"
      },
      {
        question: "2. Number of 5-digit numbers divisible by 3 using digits 0,1,2,3,4,5 without repetition:",
        options: ["216", "120", "96", "240"],
        correct: 0,
        explanation: "Sum of all digits = 15 (divisible by 3). Total numbers = 5! = 120 excluding 0 at first place: 4×4! = 96. Total = 216"
      },
      {
        question: "3. If |z - 3| = |z - 3i|, then locus of z is:",
        options: ["y = x", "x + y = 3", "x - y = 0", "y = -x"],
        correct: 0,
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
        options: ["(8/3)a²", "(4/3)a²", "2a²", "a²"],
        correct: 0,
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
        options: ["2x - 3y + 4z = 8", "2x - 3y + 4z = 20", "x + 2y + 3z = 14", "x - y + z = 2"],
        correct: 0,
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
        options: ["4", "2", "3", "1"],
        correct: 0,
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
        options: ["n(n+1)(n+2)(n+3)/4", "n(n+1)(n+2)/3", "n(n+1)(2n+1)/6", "n(n+1)/2"],
        correct: 0,
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
        options: ["π/2", "π", "2π", "π/4"],
        correct: 0,
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
        options: ["1", "1/2", "2", "1/3"],
        correct: 0,
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
        options: ["All of these", "Idiom", "Euphemism", "Cliché"],
        correct: 0,
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
  };

  // Initialize other subjects with sample questions (without A, B, C, D)
  ['history', 'economics', 'geography'].forEach(subject => {
    quizData[subject] = Array.from({ length: 20 }, (_, i) => ({
      question: `${i + 1}. Ethiopian ${subject.charAt(0).toUpperCase() + subject.slice(1)} EUEE Question ${i + 1}:`,
      options: ["Option A", "Option B", "Option C", "Option D"],
      correct: i % 4,
      explanation: `Explanation for ${subject} question ${i + 1} following Ethiopian curriculum standards.`
    }));
  });

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
          <div className="text-sm mt-1">{subject.code}</div>
        </div>
      </button>
    );
  };

  // Results Screen
  if (showScore) {
    const subjectName = subjects.find(s => s.id === currentSubject).name;
    const percentage = Math.round((score / currentQuestions.length) * 100);
    
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">EUEE Results</h1>
            <p className="text-gray-600">Subject: {subjectName}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{subjectName} Assessment</h2>
                    <p className="text-gray-600">Ethiopian University Entrance Exam Level</p>
                  </div>
                  <div className="text-3xl">{percentage >= 80 ? '🎯' : percentage >= 60 ? '📈' : '📚'}</div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-blue-50 p-4 rounded text-center border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600">{score}</div>
                    <div className="text-sm text-blue-800">Correct</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded text-center border border-green-200">
                    <div className="text-2xl font-bold text-green-600">{currentQuestions.length - score}</div>
                    <div className="text-sm text-green-800">Incorrect</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded text-center border border-purple-200">
                    <div className="text-2xl font-bold text-purple-600">{percentage}%</div>
                    <div className="text-sm text-purple-800">Score</div>
                  </div>
                  <div className="bg-amber-50 p-4 rounded text-center border border-amber-200">
                    <div className="text-2xl font-bold text-amber-600">
                      {Math.round((answeredQuestions.size / currentQuestions.length) * 100)}%
                    </div>
                    <div className="text-sm text-amber-800">Answered</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {currentQuestions.map((_, index) => (
                    <div
                      key={index}
                      className={`w-8 h-8 rounded flex items-center justify-center text-sm ${
                        selectedAnswers[index] === currentQuestions[index].correct
                          ? 'bg-green-100 text-green-800 border border-green-300'
                          : selectedAnswers[index] !== undefined
                          ? 'bg-red-100 text-red-800 border border-red-300'
                          : 'bg-gray-100 text-gray-600 border border-gray-300'
                      }`}
                    >
                      {index + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Switch Subject</h3>
                <div className="grid grid-cols-2 gap-3">
                  {subjects.map(subject => (
                    <button
                      key={subject.id}
                      onClick={() => handleSubjectChange(subject.id)}
                      className="p-3 bg-gray-50 hover:bg-gray-100 rounded text-center"
                    >
                      <div className="font-medium">{subject.name}</div>
                      <div className="text-xs text-gray-500">{subject.code}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={resetQuiz}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-medium"
                  >
                    Retry This Quiz
                  </button>
                  <button
                    onClick={() => {
                      const subjectIndex = subjects.findIndex(s => s.id === currentSubject);
                      const nextSubject = subjects[(subjectIndex + 1) % subjects.length].id;
                      handleSubjectChange(nextSubject);
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded font-medium"
                  >
                    Try Next Subject
                  </button>
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
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Ethiopian University Entrance Exam (EUEE) Practice</h1>
          <p className="text-gray-600">Grade 12 Advanced Level - All Subjects</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Subject Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Subjects</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 gap-3">
                {subjects.map(subject => (
                  <SubjectButton key={subject.id} subject={subject} />
                ))}
              </div>
            </div>

            {/* Progress */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Answered</span>
                    <span className="font-medium">{answeredQuestions.size}/20</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${(answeredQuestions.size / 20) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Time</span>
                    <span className="font-mono font-medium">{formatTime(timeLeft)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(timeLeft / 7200) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-800">
                      {currentQuestion + 1}<span className="text-gray-400">/20</span>
                    </div>
                    <div className="text-sm text-gray-600">Current Question</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Quiz */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {subjects.find(s => s.id === currentSubject).name}
                  </h2>
                  <p className="text-gray-600">{subjects.find(s => s.id === currentSubject).code} - EUEE Level</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-blue-50 text-blue-800 px-4 py-2 rounded border border-blue-200">
                    <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
                  </div>
                  <div className="bg-green-50 text-green-800 px-4 py-2 rounded border border-green-200">
                    <span className="font-bold">Score: {score}</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>Question {currentQuestion + 1} of 20</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${((currentQuestion + 1) / 20) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Question */}
              <div>
                <div className="bg-gray-50 rounded p-6 mb-6 border border-gray-200">
                  <div className="flex items-start">
                    <div className="bg-blue-100 text-blue-800 w-10 h-10 rounded flex items-center justify-center font-bold mr-4">
                      {currentQuestion + 1}
                    </div>
                    <p className="text-gray-700 text-lg">{currentQuestionData.question}</p>
                  </div>
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {currentQuestionData.options.map((option, index) => {
                    const isSelected = selectedAnswers[currentQuestion] === index;
                    const isCorrect = index === currentQuestionData.correct;
                    return (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        className={`p-4 text-left rounded border-2 transition-all ${
                          isSelected 
                            ? isCorrect
                              ? 'bg-green-100 border-green-500'
                              : 'bg-red-100 border-red-500'
                            : 'bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-8 h-8 flex items-center justify-center rounded mr-3 ${
                            isSelected 
                              ? isCorrect
                                ? 'bg-green-500 text-white'
                                : 'bg-red-500 text-white'
                              : 'bg-gray-200 text-gray-700'
                          }`}>
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="flex-1">{option}</span>
                          {isSelected && (
                            <div className="ml-2">
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
                  <div className={`p-4 rounded mb-6 ${
                    selectedAnswers[currentQuestion] === currentQuestionData.correct
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex items-start">
                      <div className={`w-6 h-6 flex items-center justify-center rounded mr-3 ${
                        selectedAnswers[currentQuestion] === currentQuestionData.correct
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                      }`}>
                        {selectedAnswers[currentQuestion] === currentQuestionData.correct ? '✓' : '✗'}
                      </div>
                      <div>
                        <p className="font-medium mb-1">
                          {selectedAnswers[currentQuestion] === currentQuestionData.correct
                            ? 'Correct Answer'
                            : 'Incorrect Answer'}
                        </p>
                        <p className="text-gray-700">{currentQuestionData.explanation}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between">
                  <button
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    className={`px-6 py-3 rounded font-medium ${
                      currentQuestion === 0
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-600 hover:bg-gray-700 text-white'
                    }`}
                  >
                    Previous
                  </button>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowExplanation(!showExplanation)}
                      className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded font-medium"
                    >
                      {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
                    </button>

                    {currentQuestion === 19 ? (
                      <button
                        onClick={handleSubmit}
                        className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded font-medium"
                      >
                        Submit Quiz
                      </button>
                    ) : (
                      <button
                        onClick={handleNext}
                        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium"
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
  );
};

export default EthiopianUniversityEntranceExam;