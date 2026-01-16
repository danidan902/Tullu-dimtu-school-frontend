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
  HistoryIcon,
  Atom,
  FlaskConical,
  Calculator,
  BookText,
  HeartPulse
} from "lucide-react";

// Updated categories with all subjects
const categories = [
  { 
    id: 'history', 
    name: 'History', 
    color: 'bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#581c87]', 
    icon: '', 
    count: 19 
  },
  { 
    id: 'geography', 
    name: 'Geography', 
    color: 'bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#581c87]', 
    icon: '', 
    count: 19 
  },
  { 
    id: 'physics', 
    name: 'Physics', 
    color: 'bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#581c87]', 
    icon: '', 
    count: 20 
  },
  { 
    id: 'chemistry', 
    name: 'Chemistry', 
    color: 'bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#581c87]', 
    icon: '', 
    count: 20 
  },
  { 
    id: 'math', 
    name: 'Mathematics', 
    color: 'bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#581c87]', 
    icon: '', 
    count: 20 
  },
  { 
    id: 'english', 
    name: 'English', 
    color: 'bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#581c87]', 
    icon: '', 
    count: 20 
  },
  { 
    id: 'biology', 
    name: 'Biology', 
    color: 'bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#581c87]', 
    icon: '', 
    count: 20 
  }
];

const geographyQuiz = [
  {
    question: "How does altitude influence temperature and climate patterns in highland and lowland areas, especially in countries with varied relief?",
    options: [
      "Temperature increases with altitude",
      "Temperature decreases as altitude increases", // B - Correct
      "Altitude has no effect on climate",
      "Only latitude affects temperature"
    ],
    correctAnswer: "Temperature decreases as altitude increases"
  },
  {
    question: "Why are contour lines on topographic maps important for understanding landforms and human settlement patterns?",
    options: [
      "They show political boundaries",
      "They indicate rainfall",
      "They represent elevation and slope", // C - Correct
      "They display population density"
    ],
    correctAnswer: "They represent elevation and slope"
  },
  {
    question: "How does deforestation contribute to environmental problems such as soil erosion and climate change?",
    options: [
      "By increasing forest cover",
      "By improving rainfall",
      "By removing trees that protect soil and absorb carbon dioxide", // C - Correct
      "By stabilizing ecosystems"
    ],
    correctAnswer: "By removing trees that protect soil and absorb carbon dioxide"
  },
  {
    question: "Why is latitude an important factor in determining climate zones across the Earth?",
    options: [
      "It affects population growth",
      "It controls wind direction",
      "It determines soil fertility",
      "It influences the angle of sunlight received" // D - Correct
    ],
    correctAnswer: "It influences the angle of sunlight received"
  },
  {
    question: "How do rivers contribute to economic development in many regions of the world?",
    options: [
      "By preventing transportation",
      "By increasing deserts",
      "By limiting agriculture",
      "By providing water, fertile land, and transport routes" // D - Correct
    ],
    correctAnswer: "By providing water, fertile land, and transport routes"
  },
  {
    question: "Why are tropical rainforest regions experiencing high rates of biodiversity loss?",
    options: [
      "Because of cold temperatures",
      "Because of deforestation and human activities", // B - Correct
      "Because of volcanic activity",
      "Because of low rainfall"
    ],
    correctAnswer: "Because of deforestation and human activities"
  },
  {
    question: "How does population growth place pressure on natural resources in developing countries?",
    options: [
      "By reducing resource use",
      "By stabilizing ecosystems",
      "By improving sustainability",
      "By increasing demand for land, water, and energy" // D - Correct
    ],
    correctAnswer: "By increasing demand for land, water, and energy"
  },
  {
    question: "Why is climate change considered a global issue rather than a local problem?",
    options: [
      "It affects only polar regions",
      "It has no human causes",
      "It benefits all countries equally",
      "It impacts weather, ecosystems, and sea levels worldwide" // D - Correct
    ],
    correctAnswer: "It impacts weather, ecosystems, and sea levels worldwide"
  },
  {
    question: "How do human activities such as urbanization affect natural drainage systems?",
    options: [
      "They improve water flow",
      "They eliminate pollution",
      "They stabilize river systems",
      "They increase flooding and reduce infiltration" // D - Correct
    ],
    correctAnswer: "They increase flooding and reduce infiltration"
  },
  {
    question: "Why is soil conservation important for sustainable agricultural production?",
    options: [
      "It reduces crop yield",
      "It eliminates farming",
      "It increases desertification",
      "It prevents soil erosion and maintains fertility" // D - Correct
    ],
    correctAnswer: "It prevents soil erosion and maintains fertility"
  },
  {
    question: "How does the Earth's rotation cause differences in time zones across the world?",
    options: [
      "By changing seasons",
      "By causing day and night at different longitudes", // B - Correct
      "By affecting climate",
      "By altering latitude"
    ],
    correctAnswer: "By causing day and night at different longitudes"
  },
  {
    question: "Why are renewable resources important for long-term environmental sustainability?",
    options: [
      "They are unlimited and pollution-free",
      "They eliminate energy needs",
      "They increase environmental damage",
      "They reduce dependence on non-renewable resources" // D - Correct
    ],
    correctAnswer: "They reduce dependence on non-renewable resources"
  },
  {
    question: "How does relief rainfall occur in mountainous regions?",
    options: [
      "When warm air sinks",
      "When deserts form",
      "When cold air moves downward",
      "When moist air rises and cools over mountains" // D - Correct
    ],
    correctAnswer: "When moist air rises and cools over mountains"
  },
  {
    question: "Why is map scale important when interpreting distances on a map?",
    options: [
      "It changes directions",
      "It represents climate",
      "It controls elevation",
      "It shows the relationship between map distance and real distance" // D - Correct
    ],
    correctAnswer: "It shows the relationship between map distance and real distance"
  },
  {
    question: "How do ocean currents influence the climate of coastal regions?",
    options: [
      "They have no effect",
      "They prevent wind movement",
      "They reduce evaporation",
      "They transfer heat and affect temperature and rainfall" // D - Correct
    ],
    correctAnswer: "They transfer heat and affect temperature and rainfall"
  },
  {
    question: "Why is environmental conservation essential for future generations?",
    options: [
      "It limits development",
      "It reduces biodiversity",
      "It discourages economic growth",
      "It ensures sustainable use of natural resources" // D - Correct
    ],
    correctAnswer: "It ensures sustainable use of natural resources"
  },
  {
    question: "How does desertification threaten livelihoods in semi-arid regions?",
    options: [
      "By improving agriculture",
      "By increasing forest cover",
      "By stabilizing climate",
      "By reducing fertile land and water availability" // D - Correct
    ],
    correctAnswer: "By reducing fertile land and water availability"
  },
  {
    question: "Why is geographic knowledge important for national planning and development?",
    options: [
      "It replaces political decision-making",
      "It discourages urban growth",
      "It limits infrastructure development",
      "It helps in managing resources and land use effectively" // D - Correct
    ],
    correctAnswer: "It helps in managing resources and land use effectively"
  },
  {
    question: "How does global warming contribute to rising sea levels?",
    options: [
      "By cooling oceans",
      "By reducing rainfall",
      "By stopping ocean currents",
      "By melting glaciers and polar ice caps" // D - Correct
    ],
    correctAnswer: "By melting glaciers and polar ice caps"
  }
];




const historyQuiz = [
  {
    question: "How did the development of agriculture play a significant role in transforming early human societies from nomadic lifestyles into permanent settlements and organized communities?",
    options: [
      "It provided stable food supplies that supported population growth", // A - Correct
      "It forced people to migrate constantly",
      "It eliminated social cooperation",
      "It reduced technological innovation"
    ],
    correctAnswer: "It provided stable food supplies that supported population growth"
  },
  {
    question: "Why is the Battle of Adwa considered a major turning point not only in Ethiopian history but also in the wider context of African resistance to European colonialism?",
    options: [
      "It strengthened European colonial rule",
      "It showed that Africans could successfully resist colonial powers", // B - Correct
      "It ended all wars in Africa",
      "It caused Ethiopia to be colonized"
    ],
    correctAnswer: "It showed that Africans could successfully resist colonial powers"
  },
  {
    question: "In what way did the use of written sources improve the preservation and accuracy of historical information compared to oral traditions?",
    options: [
      "They removed cultural perspectives",
      "They were less reliable",
      "They provided permanent records that could be reviewed", // C - Correct
      "They completely eliminated bias"
    ],
    correctAnswer: "They provided permanent records that could be reviewed"
  },
  {
    question: "How did the Industrial Revolution bring significant economic and social changes to European societies during the 18th and 19th centuries?",
    options: [
      "By reducing production and trade",
      "By introducing machine-based manufacturing and urbanization", // B - Correct
      "By stopping technological development",
      "By weakening transportation systems"
    ],
    correctAnswer: "By introducing machine-based manufacturing and urbanization"
  },
  {
    question: "Why did early civilizations usually develop along river valleys such as the Nile, Tigris, and Euphrates?",
    options: [
      "Because rivers made travel difficult",
      "Because fertile soil and water supported agriculture", // B - Correct
      "Because rivers prevented trade",
      "Because the climate was always cold"
    ],
    correctAnswer: "Because fertile soil and water supported agriculture"
  },
  {
    question: "How did colonization negatively affect African societies in terms of political independence and economic development?",
    options: [
      "By strengthening local industries",
      "By increasing self-governance",
      "By exploiting resources and weakening traditional systems", // C - Correct
      "By promoting equality"
    ],
    correctAnswer: "By exploiting resources and weakening traditional systems"
  },
  {
    question: "Why is archaeology considered an important method for understanding societies that left little or no written records?",
    options: [
      "It focuses only on modern history",
      "It studies material remains such as tools and structures", // B - Correct
      "It replaces oral traditions",
      "It ignores physical evidence"
    ],
    correctAnswer: "It studies material remains such as tools and structures"
  },
  {
    question: "How did the rise of empires contribute to cultural exchange and technological advancement in ancient times?",
    options: [
      "By isolating communities",
      "By connecting regions through trade and administration", // B - Correct
      "By discouraging innovation",
      "By eliminating communication"
    ],
    correctAnswer: "By connecting regions through trade and administration"
  },
  {
    question: "Why is history important for helping societies understand present-day political, social, and economic challenges?",
    options: [
      "It focuses only on the past",
      "It discourages critical thinking",
      "It provides lessons and experiences from earlier societies", // C - Correct
      "It replaces scientific knowledge"
    ],
    correctAnswer: "It provides lessons and experiences from earlier societies"
  },
  {
    question: "How did the introduction of iron tools affect agricultural productivity in early societies?",
    options: [
      "It reduced food production",
      "It eliminated the need for farming",
      "It made farming more efficient and productive", // C - Correct
      "It weakened soil quality"
    ],
    correctAnswer: "It made farming more efficient and productive"
  },
  {
    question: "Why did many African countries struggle politically after gaining independence from colonial rule?",
    options: [
      "Because they had strong institutions",
      "Because they rejected self-rule",
      "Because colonial borders and systems caused instability", // C - Correct
      "Because they avoided leadership"
    ],
    correctAnswer: "Because colonial borders and systems caused instability"
  },
  {
    question: "How did trade routes such as the Trans-Saharan trade influence the development of African kingdoms?",
    options: [
      "By isolating regions",
      "By preventing communication",
      "By encouraging economic growth and cultural interaction", // C - Correct
      "By discouraging leadership"
    ],
    correctAnswer: "By encouraging economic growth and cultural interaction"
  },
  {
    question: "Why is the study of primary historical sources important for developing accurate interpretations of past events?",
    options: [
      "They are always biased",
      "They provide direct evidence from the time period", // B - Correct
      "They remove context",
      "They simplify history"
    ],
    correctAnswer: "They provide direct evidence from the time period"
  },
  {
    question: "How did leadership and governance contribute to the success or failure of ancient empires?",
    options: [
      "Leadership had no influence",
      "Strong leadership promoted stability and expansion", // B - Correct
      "Governance weakened empires",
      "Leaders discouraged cooperation"
    ],
    correctAnswer: "Strong leadership promoted stability and expansion"
  },
  {
    question: "Why did the spread of religion play a significant role in shaping early civilizations and empires?",
    options: [
      "It prevented unity",
      "It eliminated belief systems",
      "It reduced cultural identity",
      "It influenced laws, culture, and social organization" // D - Correct
    ],
    correctAnswer: "It influenced laws, culture, and social organization"
  },
  {
    question: "How did technological inventions such as writing and the wheel contribute to the advancement of human societies?",
    options: [
      "They slowed communication",
      "They reduced cooperation",
      "They improved record-keeping and transportation", // C - Correct
      "They eliminated trade"
    ],
    correctAnswer: "They improved record-keeping and transportation"
  },
  {
    question: "Why is it important to study the causes and consequences of wars in history?",
    options: [
      "To promote conflict",
      "To understand how conflicts shape societies", // B - Correct
      "To glorify violence",
      "To ignore peace efforts"
    ],
    correctAnswer: "To understand how conflicts shape societies"
  },
  {
    question: "How did European imperialism affect traditional African political systems?",
    options: [
      "By strengthening local governance",
      "By promoting self-rule",
      "By eliminating foreign influence",
      "By replacing indigenous systems with colonial administration" // D - Correct
    ],
    correctAnswer: "By replacing indigenous systems with colonial administration"
  },
  {
    question: "Why is historical knowledge important for building national identity and unity?",
    options: [
      "It creates division",
      "It helps people understand shared experiences", // B - Correct
      "It discourages patriotism",
      "It removes cultural values"
    ],
    correctAnswer: "It helps people understand shared experiences"
  }
];

const physicsQuiz = [
  {
    question: "A car starts from rest and accelerates uniformly to a speed of 20 m/s in 10 seconds. Which statement best explains the motion of the car based on the concept of acceleration?",
    options: [
      "The car moves with constant speed throughout the journey",
      "The car’s velocity increases by equal amounts in equal intervals of time",
      "The car covers equal distances every second",
      "The car has zero acceleration after starting"
    ],
    correctAnswer: "The car’s velocity increases by equal amounts in equal intervals of time"
  },
  {
    question: "According to Newton’s Second Law of Motion, how does the acceleration of an object change when the applied force is doubled while the mass remains constant?",
    options: [
      "Acceleration remains unchanged",
      "Acceleration becomes half",
      "Acceleration becomes double",
      "Acceleration becomes zero"
    ],
    correctAnswer: "Acceleration becomes double"
  },
  {
    question: "A ball is thrown vertically upward. At the highest point of its motion, which of the following statements is correct?",
    options: [
      "The velocity and acceleration are both zero",
      "The velocity is zero but acceleration is maximum",
      "The velocity is zero but acceleration is due to gravity",
      "Both velocity and acceleration change direction"
    ],
    correctAnswer: "The velocity is zero but acceleration is due to gravity"
  },
  {
    question: "Why does a heavy truck require a longer distance to stop than a small car when both are moving at the same speed?",
    options: [
      "Because the truck moves faster",
      "Because the truck has greater mass and momentum",
      "Because the truck experiences less friction",
      "Because gravity acts more on trucks"
    ],
    correctAnswer: "Because the truck has greater mass and momentum"
  },
  {
    question: "Which explanation best describes why passengers feel a backward push when a bus suddenly starts moving forward?",
    options: [
      "Due to gravitational force",
      "Due to inertia of rest",
      "Due to frictional force",
      "Due to air resistance"
    ],
    correctAnswer: "Due to inertia of rest"
  },
  {
    question: "When light passes from air into glass, which change occurs and why?",
    options: [
      "Speed increases because glass is denser",
      "Speed decreases because glass is optically denser",
      "Speed remains same due to constant frequency",
      "Light stops completely in glass"
    ],
    correctAnswer: "Speed decreases because glass is optically denser"
  },
  {
    question: "Why is a concave mirror used in vehicle headlights rather than a convex mirror?",
    options: [
      "It forms upright images",
      "It spreads light in all directions",
      "It produces a strong parallel beam of light",
      "It reduces brightness of light"
    ],
    correctAnswer: "It produces a strong parallel beam of light"
  },
  {
    question: "Which situation demonstrates the conversion of electrical energy into thermal energy most clearly?",
    options: [
      "Electric fan rotating",
      "Electric bell ringing",
      "Electric heater warming a room",
      "Battery charging a phone"
    ],
    correctAnswer: "Electric heater warming a room"
  },
  {
    question: "Why does sound travel faster in solids than in gases?",
    options: [
      "Particles in solids are farther apart",
      "Solids have higher temperature",
      "Particles in solids are closely packed",
      "Solids produce louder sound"
    ],
    correctAnswer: "Particles in solids are closely packed"
  },
  {
    question: "Which factor does NOT affect the resistance of a conductor?",
    options: [
      "Length of the conductor",
      "Material of the conductor",
      "Thickness of the conductor",
      "Color of the conductor"
    ],
    correctAnswer: "Color of the conductor"
  },
  {
    question: "If the voltage across a conductor is increased while resistance remains constant, what happens to the current according to Ohm’s Law?",
    options: [
      "Current decreases",
      "Current remains constant",
      "Current increases",
      "Current becomes zero"
    ],
    correctAnswer: "Current increases"
  },
  {
    question: "Why are transformers ineffective when operated with direct current (DC)?",
    options: [
      "DC produces too much heat",
      "DC does not create a changing magnetic field",
      "DC flows too slowly",
      "DC damages coils"
    ],
    correctAnswer: "DC does not create a changing magnetic field"
  },
  {
    question: "Which statement best explains gravitational potential energy?",
    options: [
      "Energy due to motion",
      "Energy due to position or height",
      "Energy due to temperature",
      "Energy due to electricity"
    ],
    correctAnswer: "Energy due to position or height"
  },
  {
    question: "Why does increasing the surface area of an object increase friction?",
    options: [
      "More air resistance is produced",
      "More molecular contact occurs",
      "Gravity becomes stronger",
      "Weight of object increases"
    ],
    correctAnswer: "More molecular contact occurs"
  },
  {
    question: "What happens to pressure when the same force is applied over a smaller area?",
    options: [
      "Pressure decreases",
      "Pressure remains same",
      "Pressure increases",
      "Pressure becomes zero"
    ],
    correctAnswer: "Pressure increases"
  },
  {
    question: "Why are overhead power transmission cables kept at very high voltage?",
    options: [
      "To increase resistance",
      "To reduce power loss",
      "To increase current",
      "To improve insulation"
    ],
    correctAnswer: "To reduce power loss"
  },
  {
    question: "Which phenomenon explains the bending of light when it passes from one medium to another?",
    options: [
      "Reflection",
      "Diffraction",
      "Refraction",
      "Dispersion"
    ],
    correctAnswer: "Refraction"
  },
  {
    question: "Why does ice float on water instead of sinking?",
    options: [
      "Ice has more mass",
      "Ice has higher density",
      "Ice has lower density than water",
      "Ice is colder than water"
    ],
    correctAnswer: "Ice has lower density than water"
  },
  {
    question: "Which change will increase the kinetic energy of a moving object the most?",
    options: [
      "Decreasing its mass",
      "Decreasing its speed",
      "Increasing its speed",
      "Stopping the object"
    ],
    correctAnswer: "Increasing its speed"
  },
  {
    question: "Why is energy conservation important in understanding physical systems?",
    options: [
      "Energy can be created",
      "Energy can be destroyed",
      "Energy changes form but total remains constant",
      "Energy disappears after use"
    ],
    correctAnswer: "Energy changes form but total remains constant"
  }
];

const chemistryQuiz = [
  {
    question: "Why do acids turn blue litmus paper red, and what does this indicate about their chemical nature?",
    options: [
      "They release hydroxide ions in solution",
      "They release hydrogen ions in aqueous solution",
      "They absorb oxygen from the air",
      "They neutralize bases immediately"
    ],
    correctAnswer: "They release hydrogen ions in aqueous solution"
  },
  {
    question: "Which explanation best describes why increasing temperature increases the rate of a chemical reaction?",
    options: [
      "Particles gain kinetic energy and collide more frequently",
      "Mass of reactants increases",
      "Volume of reactants decreases",
      "Chemical bonds disappear"
    ],
    correctAnswer: "Particles gain kinetic energy and collide more frequently"
  },
  {
    question: "Why is rusting considered both a chemical and environmental problem?",
    options: [
      "It improves metal strength",
      "It wastes metals and causes economic loss",
      "It only changes metal color",
      "It occurs without oxygen"
    ],
    correctAnswer: "It wastes metals and causes economic loss"
  },
  {
    question: "Which factor is most responsible for corrosion of iron in coastal areas?",
    options: [
      "Low temperature",
      "Dry air",
      "Presence of salt and moisture",
      "Absence of oxygen"
    ],
    correctAnswer: "Presence of salt and moisture"
  },
  {
    question: "Why are noble gases chemically unreactive compared to other elements?",
    options: [
      "They have incomplete outer shells",
      "They have full valence electron shells",
      "They have high atomic mass",
      "They easily lose electrons"
    ],
    correctAnswer: "They have full valence electron shells"
  },
  {
    question: "What happens during a neutralization reaction between an acid and a base?",
    options: [
      "Only heat is produced",
      "Salt and water are formed",
      "Gas is always released",
      "The reaction stops immediately"
    ],
    correctAnswer: "Salt and water are formed"
  },
  {
    question: "Why are catalysts important in industrial chemical processes?",
    options: [
      "They increase product mass",
      "They lower activation energy without being consumed",
      "They increase reaction temperature",
      "They slow down reactions"
    ],
    correctAnswer: "They lower activation energy without being consumed"
  },
  {
    question: "Which explanation best describes why metals are good conductors of electricity?",
    options: [
      "They contain fixed electrons",
      "They have free-moving electrons",
      "They have high density",
      "They dissolve in water"
    ],
    correctAnswer: "They have free-moving electrons"
  },
  {
    question: "Why is carbon able to form a large number of compounds?",
    options: [
      "It has a large atomic size",
      "It has low electronegativity",
      "It forms stable covalent bonds and chains",
      "It reacts only with oxygen"
    ],
    correctAnswer: "It forms stable covalent bonds and chains"
  },
  {
    question: "Which process explains the separation of crude oil into useful fractions?",
    options: [
      "Evaporation",
      "Filtration",
      "Fractional distillation",
      "Crystallization"
    ],
    correctAnswer: "Fractional distillation"
  },
  {
    question: "Why does increasing pressure increase the rate of reaction for gases?",
    options: [
      "Gas particles become heavier",
      "Gas particles collide more frequently",
      "Temperature increases automatically",
      "Chemical bonds weaken"
    ],
    correctAnswer: "Gas particles collide more frequently"
  },
  {
    question: "Which statement best explains why bases feel slippery to touch?",
    options: [
      "They react with skin oils",
      "They neutralize acids in skin",
      "They dissolve proteins",
      "They release hydrogen gas"
    ],
    correctAnswer: "They react with skin oils"
  },
  {
    question: "Why is water called a universal solvent?",
    options: [
      "It dissolves all substances",
      "It dissolves many ionic and polar substances",
      "It reacts with every compound",
      "It evaporates quickly"
    ],
    correctAnswer: "It dissolves many ionic and polar substances"
  },
  {
    question: "What is the main purpose of electrolysis?",
    options: [
      "To heat substances",
      "To separate compounds using electricity",
      "To neutralize acids",
      "To reduce pressure"
    ],
    correctAnswer: "To separate compounds using electricity"
  },
  {
    question: "Why does soap clean oily stains effectively?",
    options: [
      "Soap dissolves oil completely",
      "Soap molecules have hydrophilic and hydrophobic ends",
      "Soap reacts chemically with oil",
      "Soap increases water density"
    ],
    correctAnswer: "Soap molecules have hydrophilic and hydrophobic ends"
  },
  {
    question: "Which condition is necessary for combustion to occur?",
    options: [
      "Only fuel",
      "Fuel and carbon dioxide",
      "Fuel, oxygen, and heat",
      "Fuel and nitrogen"
    ],
    correctAnswer: "Fuel, oxygen, and heat"
  },
  {
    question: "Why are alloys stronger than pure metals?",
    options: [
      "They are lighter",
      "They have irregular atomic arrangement",
      "They conduct electricity better",
      "They melt easily"
    ],
    correctAnswer: "They have irregular atomic arrangement"
  },
  {
    question: "Which type of reaction involves loss of electrons?",
    options: [
      "Reduction",
      "Oxidation",
      "Neutralization",
      "Decomposition"
    ],
    correctAnswer: "Oxidation"
  },
  {
    question: "Why is fertilizer overuse harmful to the environment?",
    options: [
      "It increases soil fertility",
      "It causes water pollution and eutrophication",
      "It reduces crop yield",
      "It neutralizes soil"
    ],
    correctAnswer: "It causes water pollution and eutrophication"
  },
  {
    question: "Why is pH important in agriculture?",
    options: [
      "It affects soil temperature",
      "It affects nutrient availability to plants",
      "It changes soil color",
      "It increases rainfall"
    ],
    correctAnswer: "It affects nutrient availability to plants"
  }
];


const mathQuiz = [
  {
    question: "Why is the quadratic formula useful when solving quadratic equations?",
    options: [
      "It only works for factorable equations",
      "It provides solutions for all quadratic equations",
      "It simplifies linear equations",
      "It eliminates variables"
    ],
    correctAnswer: "It provides solutions for all quadratic equations"
  },
  {
    question: "What does the discriminant (b² − 4ac) indicate in a quadratic equation?",
    options: [
      "Number of variables",
      "Nature and number of roots",
      "Slope of graph",
      "Value of x"
    ],
    correctAnswer: "Nature and number of roots"
  },
  {
    question: "Why does the graph of a linear equation form a straight line?",
    options: [
      "It has constant slope",
      "It has two variables",
      "It has no solution",
      "It has curves"
    ],
    correctAnswer: "It has constant slope"
  },
  {
    question: "Which explanation best describes why the sum of interior angles of a triangle is always 180°?",
    options: [
      "Because triangles have three sides",
      "Due to parallel line properties",
      "Because angles are equal",
      "Due to symmetry"
    ],
    correctAnswer: "Due to parallel line properties"
  },
  {
    question: "Why is Pythagoras’ theorem applicable only to right-angled triangles?",
    options: [
      "Because it involves squares",
      "Because it relies on perpendicular sides",
      "Because all triangles are right-angled",
      "Because angles are ignored"
    ],
    correctAnswer: "Because it relies on perpendicular sides"
  },
  {
    question: "What does the slope of a graph represent?",
    options: [
      "Total distance",
      "Rate of change",
      "Area under graph",
      "Maximum value"
    ],
    correctAnswer: "Rate of change"
  },
  {
    question: "Why is zero not considered a prime number?",
    options: [
      "It has only one factor",
      "It has more than two factors",
      "It cannot divide other numbers",
      "It has infinite factors"
    ],
    correctAnswer: "It has infinite factors"
  },
  {
    question: "Why does multiplying two negative numbers give a positive result?",
    options: [
      "Due to sign rules based on number line logic",
      "Because negatives cancel always",
      "Because negatives are ignored",
      "Due to rounding"
    ],
    correctAnswer: "Due to sign rules based on number line logic"
  },
  {
    question: "What is the main purpose of statistics?",
    options: [
      "To confuse data",
      "To collect, analyze, and interpret data",
      "To eliminate errors",
      "To predict exact outcomes"
    ],
    correctAnswer: "To collect, analyze, and interpret data"
  },
  {
    question: "Why is probability always between 0 and 1?",
    options: [
      "Because outcomes are limited",
      "Because it represents chance",
      "Because fractions are used",
      "Because of rounding"
    ],
    correctAnswer: "Because it represents chance"
  },
  {
    question: "What does a negative slope indicate in a graph?",
    options: [
      "Increasing relationship",
      "No relationship",
      "Decreasing relationship",
      "Constant value"
    ],
    correctAnswer: "Decreasing relationship"
  },
  {
    question: "Why is the mean affected by extreme values?",
    options: [
      "It ignores data",
      "It depends on total sum",
      "It shows middle value",
      "It is random"
    ],
    correctAnswer: "It depends on total sum"
  },
  {
    question: "Which condition makes two triangles similar?",
    options: [
      "Equal area",
      "Equal angles",
      "Equal perimeter",
      "Equal sides only"
    ],
    correctAnswer: "Equal angles"
  },
  {
    question: "Why is algebra important in real-life problem solving?",
    options: [
      "It replaces arithmetic",
      "It helps model real-world situations",
      "It removes variables",
      "It avoids calculations"
    ],
    correctAnswer: "It helps model real-world situations"
  },
  {
    question: "Why is coordinate geometry useful?",
    options: [
      "It avoids graphs",
      "It combines algebra and geometry",
      "It removes equations",
      "It simplifies shapes"
    ],
    correctAnswer: "It combines algebra and geometry"
  },
  {
    question: "What does an identity mean in algebra?",
    options: [
      "An equation true for some values",
      "An equation true for all values",
      "An equation with no solution",
      "An inequality"
    ],
    correctAnswer: "An equation true for all values"
  },
  {
    question: "Why are percentages widely used?",
    options: [
      "They are complex",
      "They allow easy comparison",
      "They replace fractions",
      "They increase values"
    ],
    correctAnswer: "They allow easy comparison"
  },
  {
    question: "Why does dividing by zero have no meaning?",
    options: [
      "Zero is large",
      "No number multiplied by zero gives a fixed value",
      "Zero is undefined",
      "Zero changes sign"
    ],
    correctAnswer: "No number multiplied by zero gives a fixed value"
  },
  {
    question: "Why is graph interpretation important in science?",
    options: [
      "It reduces experiments",
      "It visually represents relationships",
      "It removes calculations",
      "It avoids errors"
    ],
    correctAnswer: "It visually represents relationships"
  },
  {
    question: "Why is ratio important in comparing quantities?",
    options: [
      "It increases values",
      "It simplifies comparison",
      "It removes units",
      "It randomizes data"
    ],
    correctAnswer: "It simplifies comparison"
  }
];


const englishQuiz = [
  {
    question: "Why is the theme important in understanding a literary text?",
    options: [
      "It explains grammar rules",
      "It reveals the central message of the text",
      "It describes the author’s biography",
      "It replaces the plot"
    ],
    correctAnswer: "It reveals the central message of the text"
  },
  {
    question: "Which explanation best describes the purpose of a metaphor?",
    options: [
      "To confuse the reader",
      "To compare two unlike things for deeper meaning",
      "To explain facts",
      "To summarize a story"
    ],
    correctAnswer: "To compare two unlike things for deeper meaning"
  },
  {
    question: "Why is tone important in persuasive writing?",
    options: [
      "It changes spelling",
      "It influences the reader’s emotions and attitude",
      "It removes arguments",
      "It shortens sentences"
    ],
    correctAnswer: "It influences the reader’s emotions and attitude"
  },
  {
    question: "What is the main purpose of a topic sentence in a paragraph?",
    options: [
      "To conclude ideas",
      "To introduce the main idea",
      "To give examples",
      "To add vocabulary"
    ],
    correctAnswer: "To introduce the main idea"
  },
  {
    question: "Why is reading comprehension important?",
    options: [
      "It increases speed only",
      "It helps understand meaning and context",
      "It improves handwriting",
      "It reduces vocabulary"
    ],
    correctAnswer: "It helps understand meaning and context"
  },
  {
    question: "What is the function of a thesis statement?",
    options: [
      "To list references",
      "To present the main argument",
      "To repeat ideas",
      "To end an essay"
    ],
    correctAnswer: "To present the main argument"
  },
  {
    question: "Why are conjunctions important in writing?",
    options: [
      "They shorten words",
      "They connect ideas and clauses",
      "They replace verbs",
      "They remove repetition"
    ],
    correctAnswer: "They connect ideas and clauses"
  },
  {
    question: "What does inference mean in reading?",
    options: [
      "Guessing randomly",
      "Understanding implied meaning",
      "Reading aloud",
      "Memorizing facts"
    ],
    correctAnswer: "Understanding implied meaning"
  },
  {
    question: "Why is formal language important in academic writing?",
    options: [
      "It sounds emotional",
      "It maintains clarity and professionalism",
      "It shortens essays",
      "It avoids structure"
    ],
    correctAnswer: "It maintains clarity and professionalism"
  },
  {
    question: "What is the role of punctuation in writing?",
    options: [
      "To decorate text",
      "To clarify meaning and structure",
      "To increase length",
      "To change vocabulary"
    ],
    correctAnswer: "To clarify meaning and structure"
  },
  {
    question: "Why is summarizing a text important?",
    options: [
      "To repeat all details",
      "To highlight key points concisely",
      "To rewrite the text fully",
      "To remove main ideas"
    ],
    correctAnswer: "To highlight key points concisely"
  },
  {
    question: "What does character development contribute to a story?",
    options: [
      "Only setting",
      "Depth and realism",
      "Grammar rules",
      "Conflict removal"
    ],
    correctAnswer: "Depth and realism"
  },
  {
    question: "Why is context important in understanding vocabulary?",
    options: [
      "It removes meaning",
      "It helps determine word meaning",
      "It confuses readers",
      "It changes spelling"
    ],
    correctAnswer: "It helps determine word meaning"
  },
  {
    question: "What is the purpose of dialogue in a narrative?",
    options: [
      "To increase length",
      "To reveal character and advance plot",
      "To avoid description",
      "To replace narration"
    ],
    correctAnswer: "To reveal character and advance plot"
  },
  {
    question: "Why is coherence important in writing?",
    options: [
      "It removes ideas",
      "It ensures logical flow",
      "It shortens paragraphs",
      "It adds vocabulary"
    ],
    correctAnswer: "It ensures logical flow"
  },
  {
    question: "What does audience awareness help a writer achieve?",
    options: [
      "Ignore readers",
      "Choose appropriate tone and content",
      "Increase word count",
      "Avoid grammar"
    ],
    correctAnswer: "Choose appropriate tone and content"
  },
  {
    question: "Why are figurative language devices used in literature?",
    options: [
      "To confuse meaning",
      "To enhance imagery and emotion",
      "To remove clarity",
      "To replace facts"
    ],
    correctAnswer: "To enhance imagery and emotion"
  },
  {
    question: "What is the function of an introduction in an essay?",
    options: [
      "To repeat conclusion",
      "To present topic and engage reader",
      "To list references",
      "To add examples"
    ],
    correctAnswer: "To present topic and engage reader"
  },
  {
    question: "Why is editing important in the writing process?",
    options: [
      "To increase mistakes",
      "To improve clarity and accuracy",
      "To remove structure",
      "To shorten sentences only"
    ],
    correctAnswer: "To improve clarity and accuracy"
  },
  {
    question: "What does critical reading involve?",
    options: [
      "Accepting ideas without question",
      "Analyzing and evaluating information",
      "Reading quickly",
      "Ignoring evidence"
    ],
    correctAnswer: "Analyzing and evaluating information"
  }
];


const biologyQuiz = [
  {
    question: "Why is photosynthesis considered the most important biological process on Earth?",
    options: [
      "It produces oxygen and food",
      "It removes carbon dioxide only",
      "It increases temperature",
      "It produces water"
    ],
    correctAnswer: "It produces oxygen and food"
  },
  {
    question: "Why are enzymes specific in their action?",
    options: [
      "They work at any temperature",
      "Their active site fits specific substrates",
      "They dissolve substrates",
      "They change shape permanently"
    ],
    correctAnswer: "Their active site fits specific substrates"
  },
  {
    question: "What is the main function of red blood cells?",
    options: [
      "Fight infection",
      "Carry oxygen",
      "Clot blood",
      "Digest food"
    ],
    correctAnswer: "Carry oxygen"
  },
  {
    question: "Why is cell division important for growth and repair?",
    options: [
      "It reduces cells",
      "It produces identical new cells",
      "It changes cell type",
      "It removes DNA"
    ],
    correctAnswer: "It produces identical new cells"
  },
  {
    question: "Why is diffusion important in living organisms?",
    options: [
      "It transports nutrients without energy",
      "It produces enzymes",
      "It breaks cells",
      "It increases pressure"
    ],
    correctAnswer: "It transports nutrients without energy"
  },
  {
    question: "Why is respiration essential for life?",
    options: [
      "It removes oxygen",
      "It releases energy from food",
      "It produces carbon dioxide",
      "It cools the body"
    ],
    correctAnswer: "It releases energy from food"
  },
  {
    question: "Why is DNA important in heredity?",
    options: [
      "It controls digestion",
      "It carries genetic information",
      "It produces enzymes directly",
      "It stores energy"
    ],
    correctAnswer: "It carries genetic information"
  },
  {
    question: "Why is the circulatory system important?",
    options: [
      "It produces oxygen",
      "It transports materials throughout the body",
      "It digests food",
      "It removes bones"
    ],
    correctAnswer: "It transports materials throughout the body"
  },
  {
    question: "Why is transpiration important in plants?",
    options: [
      "It cools plants and transports water",
      "It produces food",
      "It stops photosynthesis",
      "It breaks leaves"
    ],
    correctAnswer: "It cools plants and transports water"
  },
  {
    question: "Why is the nervous system important?",
    options: [
      "It stores energy",
      "It coordinates body responses",
      "It digests food",
      "It pumps blood"
    ],
    correctAnswer: "It coordinates body responses"
  },
  {
    question: "Why is biodiversity important for ecosystems?",
    options: [
      "It reduces stability",
      "It increases ecosystem balance",
      "It removes species",
      "It increases pollution"
    ],
    correctAnswer: "It increases ecosystem balance"
  },
  {
    question: "Why do plants require minerals from soil?",
    options: [
      "To increase temperature",
      "For growth and development",
      "To absorb oxygen",
      "To reduce photosynthesis"
    ],
    correctAnswer: "For growth and development"
  },
  {
    question: "Why is vaccination important?",
    options: [
      "It cures all diseases",
      "It stimulates immune memory",
      "It kills all bacteria",
      "It replaces antibiotics"
    ],
    correctAnswer: "It stimulates immune memory"
  },
  {
    question: "Why are mitochondria called the powerhouse of the cell?",
    options: [
      "They store water",
      "They produce energy",
      "They control nucleus",
      "They digest waste"
    ],
    correctAnswer: "They produce energy"
  },
  {
    question: "Why is reproduction essential for species survival?",
    options: [
      "It increases size",
      "It prevents extinction",
      "It removes variation",
      "It reduces population"
    ],
    correctAnswer: "It prevents extinction"
  },
  {
    question: "Why is homeostasis important?",
    options: [
      "It maintains stable internal conditions",
      "It increases body temperature",
      "It stops metabolism",
      "It removes cells"
    ],
    correctAnswer: "It maintains stable internal conditions"
  },
  {
    question: "Why is osmosis important in cells?",
    options: [
      "It balances water levels",
      "It transports oxygen",
      "It produces ATP",
      "It removes waste"
    ],
    correctAnswer: "It balances water levels"
  },
  {
    question: "Why is natural selection important in evolution?",
    options: [
      "It removes all traits",
      "It favors survival of adapted organisms",
      "It stops variation",
      "It prevents mutation"
    ],
    correctAnswer: "It favors survival of adapted organisms"
  },
  {
    question: "Why is digestion necessary?",
    options: [
      "To store food",
      "To break food into absorbable molecules",
      "To increase mass",
      "To remove enzymes"
    ],
    correctAnswer: "To break food into absorbable molecules"
  },
  {
    question: "Why are producers essential in food chains?",
    options: [
      "They consume others",
      "They convert solar energy into food",
      "They cause decay",
      "They remove energy"
    ],
    correctAnswer: "They convert solar energy into food"
  }
];












// Combine all quiz data with categories
const quizData = [
  ...historyQuiz.map(q => ({ ...q, category: "history" })),
  ...geographyQuiz.map(q => ({ ...q, category: "geography" })),
  ...physicsQuiz.map(q => ({ ...q, category: "physics" })),
  ...chemistryQuiz.map(q => ({ ...q, category: "chemistry" })),
  ...mathQuiz.map(q => ({ ...q, category: "math" })),
  ...englishQuiz.map(q => ({ ...q, category: "english" })),
  ...biologyQuiz.map(q => ({ ...q, category: "biology" }))
];

export default function Grade10() {
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

  // Get category icon
  const getCategoryIcon = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.icon : '📚';
  };

  // Get category color class
  const getCategoryColorClass = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return 'bg-gradient-to-r from-blue-500 to-purple-600';
    
    switch(categoryId) {
      case 'history': return 'bg-gradient-to-r from-amber-500 to-amber-700';
      case 'geography': return 'bg-gradient-to-r from-teal-500 to-teal-700';
      case 'physics': return 'bg-gradient-to-r from-purple-500 to-purple-700';
      case 'chemistry': return 'bg-gradient-to-r from-pink-500 to-pink-700';
      case 'math': return 'bg-gradient-to-r from-blue-500 to-blue-700';
      case 'english': return 'bg-gradient-to-r from-red-500 to-red-700';
      case 'biology': return 'bg-gradient-to-r from-green-500 to-green-700';
      default: return 'bg-gradient-to-r from-blue-500 to-purple-600';
    }
  };

  // Get category text color
  const getCategoryTextColor = (categoryId) => {
    switch(categoryId) {
      case 'history': return 'text-amber-800';
      case 'geography': return 'text-teal-800';
      case 'physics': return 'text-purple-800';
      case 'chemistry': return 'text-pink-800';
      case 'math': return 'text-blue-800';
      case 'english': return 'text-red-800';
      case 'biology': return 'text-green-800';
      default: return 'text-blue-800';
    }
  };

  // Get category bg color
  const getCategoryBgColor = (categoryId) => {
    switch(categoryId) {
      case 'history': return 'bg-amber-100';
      case 'geography': return 'bg-teal-100';
      case 'physics': return 'bg-purple-100';
      case 'chemistry': return 'bg-pink-100';
      case 'math': return 'bg-blue-100';
      case 'english': return 'bg-red-100';
      case 'biology': return 'bg-green-100';
      default: return 'bg-blue-100';
    }
  };

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
        isCorrect,
        category: currentQuestionData.category
      };
      setAnsweredQuestions(updatedAnswers);
    } else {
      // Add new answer
      setAnsweredQuestions(prev => [...prev, {
        question: currentQuestionData.question,
        selected: answer,
        correct: currentQuestionData.correctAnswer,
        isCorrect,
        category: currentQuestionData.category
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

  // Get total questions count for home screen
  const getTotalQuestionsCount = () => {
    return (
      historyQuiz.length +
      geographyQuiz.length +
      physicsQuiz.length +
      chemistryQuiz.length +
      mathQuiz.length +
      englishQuiz.length +
      biologyQuiz.length
    );
  };

  // Home Screen
  if (currentView === 'home') {
    const totalQuestionsCount = getTotalQuestionsCount();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8 ">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
        

          {/* Stats */}
          

          {/* Category Selection */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2 mt-12">
              
              Choose Your Subject
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-16">
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

          {/* Subject Breakdown */}
         

         
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
                
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span className="font-bold text-lg">{score} / {totalQuestions}</span>
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
              <div className="flex items-center justify-between mb-4">
                <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full">
                  Question {currentQuestion + 1}
                </span>
                <span 
                  className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${getCategoryBgColor(currentQuestionData?.category)} ${getCategoryTextColor(currentQuestionData?.category)}`}
                >
                  {currentQuestionData?.category.charAt(0).toUpperCase() + currentQuestionData?.category.slice(1)}
                </span>
              </div>
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
                        <p className="text-green-600">Well done! You understand this concept well! 🎯</p>
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

    // Calculate subject-wise scores
    const subjectScores = {};
    categories.forEach(cat => {
      subjectScores[cat.id] = {
        correct: 0,
        total: quizData.filter(q => q.category === cat.id).length,
        icon: cat.icon
      };
    });

    answeredQuestions.forEach(answer => {
      if (answer.isCorrect && subjectScores[answer.category]) {
        subjectScores[answer.category].correct += 1;
      }
    });

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-6">
              <Trophy className="w-16 h-16 text-yellow-500" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Quiz Completed!</h1>
            {categoryInfo ? (
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-white rounded-full shadow-lg mb-4">
                <span className="text-2xl">{categoryInfo.icon}</span>
                <span className="font-bold text-lg">{categoryInfo.name} Exam Results</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg mb-4">
                <span className="text-2xl">📚</span>
                <span className="font-bold text-lg">All Subjects Results</span>
              </div>
            )}
            <p className="text-gray-600 text-lg">Your performance analysis</p>
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

          {/* Subject-wise Performance (Only shown for All Subjects quiz) */}
          {!selectedCategory && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <BarChart className="w-6 h-6" />
                Subject-wise Performance
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {categories.map(category => {
                  const scoreData = subjectScores[category.id];
                  const subjectPercentage = scoreData.total > 0 
                    ? Math.round((scoreData.correct / scoreData.total) * 100)
                    : 0;
                  
                  return (
                    <div key={category.id} className="p-4 rounded-xl border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{category.icon}</span>
                          <h4 className="font-bold">{category.name}</h4>
                        </div>
                        <span className={`font-bold ${
                          subjectPercentage >= 80 ? 'text-green-600' :
                          subjectPercentage >= 60 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {subjectPercentage}%
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {scoreData.correct} / {scoreData.total} correct
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Detailed Results */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <BarChart className="w-6 h-6" />
              Detailed Breakdown
            </h2>
            
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {answeredQuestions.map((item, index) => {
                const questionCategory = quizData.find(q => q.question === item.question)?.category;
                
                return (
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
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${getCategoryBgColor(questionCategory)} ${getCategoryTextColor(questionCategory)}`}>
                            {questionCategory?.charAt(0).toUpperCase() + questionCategory?.slice(1)}
                          </span>
                        </div>
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
                );
              })}
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