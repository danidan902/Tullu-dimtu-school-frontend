
// YouTubeCards.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Home, BookOpen, Download, FileText, ExternalLink, Video, Book, Clock, Users, Search, Filter, Star, ChevronDown, ChevronUp, Sparkles, Layers, DoorOpen, CodeIcon, Terminal, TerminalSquare, Code2Icon, Code2, BookOpenCheckIcon } from "lucide-react";

const videos = [
 
  {
       id: "1",
    category: "Chemistry",
    episode: "EUEE Prep",
    title: "Chemistry Entrance Exam Prep| Chemistry in Industry | EUEE",
    videoUrl: "https://www.youtube.com/watch?v=mxeNeX1B9iA&list=PLUf24gkZq8wKzfyBQ7iii-T28Z9wZMheO&index=5",
    thumbnail: "https://img.youtube.com/vi/mxeNeX1B9iA/maxresdefault.jpg",
    duration: "",
    views: "",
    date: "",
    subject: "Chemistry",
    grade: "12",
    materials: [
      { type: "pdf", name: "Chemistry Industry Notes.pdf", url: "https://www.scribd.com/document/865986766/2025-Ethiopian-Entrance-Exam" },
      { type: "pdf", name: "Practice Questions.pdf", url: "https://www.scribd.com/document/865986766/2025-Ethiopian-Entrance-Exam" },
      { type: "link", name: "Additional Resources", url: "https://chem.libretexts.org" }
    ],
    relatedVideos: ["2", "5", "19"]
  },
  


{

    id: "2",
    category: "",
    episode: "",
    title: "Chemistry 2017 Entrance Exam (first round) | Ethiopia | EUEE | Chemistry EUEE",
    videoUrl: "https://www.youtube.com/watch?v=oZmayOd5hgk&list=PLUf24gkZq8wKzfyBQ7iii-T28Z9wZMheO",
    thumbnail: "https://img.youtube.com/vi/oZmayOd5hgk/maxresdefault.jpg",
    duration: "", // Add duration if available
    views: "", // Add views if available
    date: "",
    materials: [
      { type: "pdf", name: "Chemistry Industry Notes.pdf", url: "https://example.com/chemistry-industry-notes.pdf" },
      { type: "pdf", name: "Practice Questions.pdf", url: "https://example.com/practice-questions.pdf" },
      { type: "link", name: "Additional Resources", url: "https://chem.libretexts.org" }
    ],
},
  {
    id: "3",
    category: "",
    episode: "",
    title: "Ethiopian Grade 11 Biology 2#1 Animals | Biology Entrance Exam Preparation | EUEE",
    videoUrl: "https://www.youtube.com/watch?v=bPyXFhAjsuQ&list=PLN5XUISsXgLZe-sOcTpKBA6jtgdNs1NJq",
    thumbnail: "https://img.youtube.com/vi/bPyXFhAjsuQ/hqdefault.jpg",
    duration: "",
    views: "",
    date: "",
    materials: [
      { type: "pdf", name: "Entrance Questions", url: "https://fetena.net/exam/entrance" },
      { type: "pdf", name: "Practice Questions.pdf", url: "https://fetena.net/exam/entrance" },
      { type: "link", name: "Additional Resources", url: "https://chem.libretexts.org" }
    ],
  },
  {
    id: "4",
    category: "",
    episode: "",
    title: "Ethiopian Grade 10 Biology 3#1 Biochemical Molecules",
    videoUrl: "https://www.youtube.com/watch?v=SkNy3uyGrRQ",
    thumbnail: "https://img.youtube.com/vi/SkNy3uyGrRQ/hqdefault.jpg",
    duration: "",
    views: "",
    date: "",
    materials: [
      { type: "pdf", name: "Chemistry Industry Notes.pdf", url: "https://example.com/chemistry-industry-notes.pdf" },
      { type: "pdf", name: "Practice Questions.pdf", url: "https://example.com/practice-questions.pdf" },
      { type: "link", name: "Additional Resources", url: "https://chem.libretexts.org" }
    ],
  },
  {
    id: "5",
    category: "",
    episode: "",
    title: "Grade 11 Chemistry Unit 1: Overview and Introduction",
    videoUrl: "https://www.youtube.com/watch?v=uEKbo74Sqxw&list=PLhXdcrTaVuV97iCstbUfSoUj-ElBbQsdX",
    thumbnail: "https://img.youtube.com/vi/uEKbo74Sqxw/maxresdefault.jpg",
    duration: "",
    views: "",
    date: "",
    materials: [
      { type: "pdf", name: "Chemistry Industry Notes.pdf", url: "https://example.com/chemistry-industry-notes.pdf" },
      { type: "pdf", name: "Practice Questions.pdf", url: "https://example.com/practice-questions.pdf" },
      { type: "link", name: "Additional Resources", url: "https://chem.libretexts.org" }
    ],
  },
  {
    id: "6",
    category: "",
    episode: "",
    title: "Sustainable Fashion & Ethiopian Textile Industry Future",
    videoUrl: "https://www.youtube.com/watch?v=lRoXsZ9LVD0&list=PLhXdcrTaVuV97iCstbUfSoUj-ElBbQsdX&index=16",
    thumbnail: "https://img.youtube.com/vi/lRoXsZ9LVD0/maxresdefault.jpg",
    duration: "",
    views: "",
    date: "",
    materials: [
      { type: "pdf", name: "Chemistry Industry Notes.pdf", url: "https://example.com/chemistry-industry-notes.pdf" },
      { type: "pdf", name: "Practice Questions.pdf", url: "https://example.com/practice-questions.pdf" },
      { type: "link", name: "Additional Resources", url: "https://chem.libretexts.org" }
    ],
  },
   {
    id: "7",
    category: "",
    episode: "",
    title: "Grade 10 Maths Unit 1: Unit Introduction",
    videoUrl: "https://www.youtube.com/watch?v=E_Y-T3Ms53g&list=PLhXdcrTaVuV8c_y8eCxyl2P8fakFYc34x",
    thumbnail: "https://img.youtube.com/vi/E_Y-T3Ms53g/maxresdefault.jpg",
    duration: "",
    views: "",
    date: "",
    materials: [
      { type: "pdf", name: "Maths Questions", url: "https://www.wolframalpha.com/examples/mathematics/elementary-math" },
      { type: "pdf", name: "Practice Questions.pdf", url: "https://fetena.net/exam/entrance" },
      { type: "link", name: "Additional Resources", url: "https://fetena.net/exam/entrance" }
    ],
  },
   {
    id: "8",
    category: "",
    episode: "",
    title: "Grade 10 Maths Unit 1: University Entrance Exam Questions",
    videoUrl: "https://www.youtube.com/watch?v=igQcWQ9GlN8&list=PLhXdcrTaVuV8c_y8eCxyl2P8fakFYc34x&index=34",
    thumbnail: "https://img.youtube.com/vi/igQcWQ9GlN8/maxresdefault.jpg",
    duration: "",
    views: "",
    date: "",
    materials: [
      { type: "pdf", name: "Entrance Exam Question", url: "https://fetena.net/exam/entrance" },
      { type: "pdf", name: "Practice Questions.pdf", url: "https://fetena.net/exam/entrance" },
      { type: "link", name: "Additional Resources", url: "https://chem.libretexts.org" }
    ],
  },
   {
    id: "9",
    category: "",
    episode: "",
    title: "2017 Mathematics Entrance Examination Answers with Explanations",
    videoUrl: "https://www.youtube.com/watch?v=UTj3lBpDSpw&t=209s",
    thumbnail: "https://img.youtube.com/vi/UTj3lBpDSpw/hqdefault.jpg",
    duration: "",
    views: "",
    date: "",
    materials: [
      { type: "pdf", name: "Chemistry Industry Notes.pdf", url: "https://fetena.net/exam/entrance" },
      { type: "pdf", name: "Practice Questions.pdf", url: "https://fetena.net/exam/entrance" },
      { type: "link", name: "Additional Resources", url: "https://chem.libretexts.org" }
    ],
  },
  {
    id: "10",
    category: "",
    episode: "",
    title: "History Grade 10 unit 1 part 1 | Features of Capitalism",
    videoUrl: "https://www.youtube.com/watch?v=SBaP7dSPAWo&list=PLfXpdCfxjXmawz_iyafoAuXe5o6c65VVl",
    thumbnail: "https://img.youtube.com/vi/SBaP7dSPAWo/hqdefault.jpg",
    duration: "",
    views: "",
    date: "",
    materials: [
      { type: "pdf", name: "Chemistry Industry Notes.pdf", url: "#" },
      { type: "pdf", name: "Practice Questions.pdf", url: "#" },
      { type: "link", name: "Additional Resources", url: "https://chem.libretexts.org" }
    ],
  },
  {
    id: "11",
    category: "",
    episode: "",
    title: "Grade 9 history unit 3 part 2 | Major Religions of Ethiopia",
    videoUrl: "https://www.youtube.com/watch?v=nHw-n0Q5_rU&list=PLfXpdCfxjXmYzIdv3DwZXyzUOV589XPkQ&index=2",
    thumbnail: "https://img.youtube.com/vi/nHw-n0Q5_rU/hqdefault.jpg",
    duration: "",
    views: "",
    date: "",
    materials: [
      { type: "pdf", name: "Chemistry Industry Notes.pdf", url: "#" },
      { type: "pdf", name: "Practice Questions.pdf", url: "#" },
      { type: "link", name: "Additional Resources", url: "https://chem.libretexts.org" }
    ],
  },
  {
    id: "12",
    category: "",
    episode: "",
    title: "Grade 9 history unit 9 part 3 | The Age of Revolutions 1750s to 1815 | Napoleonic Era |",
    videoUrl: "https://www.youtube.com/watch?v=C1oxnVDbP3U&list=PLfXpdCfxjXmYzIdv3DwZXyzUOV589XPkQ&index=18",
    thumbnail: "https://img.youtube.com/vi/C1oxnVDbP3U/hqdefault.jpg",
    duration: "",
    views: "",
    date: "",
    materials: [
      { type: "pdf", name: "History Entrance Exam", url: "https://fetena.net/exam/entrance" },
      { type: "pdf", name: "Practice Questions", url: "https://fetena.net/exam/entrance" },
      { type: "link", name: "Additional Resources", url: "https://chem.libretexts.org" }
    ],
  },
  {
    id: "13",
    category: "",
    episode: "",
    title: "Grade 12 Biology Unit 1: 1.2 Appreciation of nature",
    videoUrl: "https://www.youtube.com/watch?v=e-xB10Iifn8&list=PLhXdcrTaVuV8FWaAc1T1UQwgoixZzC9q-",
    thumbnail: "https://img.youtube.com/vi/pVCA3evW5pw/maxresdefault.jpg",
    duration: "",
    views: "",
    date: "",
    materials: [
      { type: "pdf", name: "Biology Entrance Exam Questions", url: "https://fetena.net/exam/entrance" },
      { type: "pdf", name: "Practice Questions", url: "https://fetena.net/exam/entrance" },
      { type: "link", name: "Additional Resources", url: "https://chem.libretexts.org" }
    ],
  },
  {
    id: "14",
    category: "",
    episode: "",
    title: "Ethiopian Grade 11 Economics 1#1 Theory of Consumer",
    videoUrl: "https://www.youtube.com/watch?v=qE5m4LPD-io&list=PLN5XUISsXgLaCWJOr0eNkzo3Y_IxO9Vzd",
    thumbnail: "https://img.youtube.com/vi/qE5m4LPD-io/hqdefault.jpg",
    duration: "",
    views: "",
    date: "",
    materials: [
      { type: "pdf", name: "Chemistry Industry Notes.pdf", url: "https://example.com/chemistry-industry-notes.pdf" },
      { type: "pdf", name: "Practice Questions.pdf", url: "https://example.com/practice-questions.pdf" },
      { type: "link", name: "Additional Resources", url: "https://chem.libretexts.org" }
    ],
  },
  {
    id: "15",
    category: "",
    episode: "",
    title: "Ethiopian Grade 11 Economics 1#8 optimum of consumer",
    videoUrl: "https://www.youtube.com/watch?v=jy7ysI3OUuw&list=PLN5XUISsXgLaCWJOr0eNkzo3Y_IxO9Vzd&index=8",
    thumbnail: "https://img.youtube.com/vi/jy7ysI3OUuw/hqdefault.jpg",
    duration: "",
    views: "",
    date: "",
    materials: [
      { type: "pdf", name: "Chemistry Industry Notes.pdf", url: "https://example.com/chemistry-industry-notes.pdf" },
      { type: "pdf", name: "Practice Questions.pdf", url: "https://example.com/practice-questions.pdf" },
      { type: "link", name: "Additional Resources", url: "https://chem.libretexts.org" }
    ],
  },
  {
    id: "16",
    category: "",
    episode: "",
    title: "Ethiopian Grade 11 Physics 3#1 Motion in 1D and 2D",
    videoUrl: "https://www.youtube.com/watch?v=ueTs_3k9XII&list=PLN5XUISsXgLYu7YqiXJh6bTyvxDBJrIVV",
    thumbnail: "https://img.youtube.com/vi/ueTs_3k9XII/hqdefault.jpg",
    duration: "",
    views: "",
    date: "",
    materials: [
      { type: "pdf", name: "Physics Entrance Exam Questions", url: "https://www.metaappz.com/References/Exams/Ethiopia_ESSLCE_Exam?s=physics&y=2023" },
      { type: "pdf", name: "Practice Questions", url: "https://www.metaappz.com/References/exams/ethiopia_esslce_exam" },
      { type: "link", name: "Additional Resources", url: "https://chem.libretexts.org" }
    ],
  },
  {
    id: "17",
    category: "",
    episode: "",
    title: "Ethiopian Grade 12 physics 2#8 Newton's Gravitational laws",
    videoUrl: "https://www.youtube.com/watch?v=t5MwkevZZoM&list=PLN5XUISsXgLZS8rvDfqVaG8oRoliGyfn1&index=8",
    thumbnail: "https://img.youtube.com/vi/t5MwkevZZoM/hqdefault.jpg",
    duration: "",
    views: "",
    date: "",
    materials: [
      { type: "pdf", name: "Chemistry Industry Notes.pdf", url: "https://www.metaappz.com/References/Exams/Ethiopia_ESSLCE_Exam?s=physics&y=2023" },
      { type: "pdf", name: "Practice Questions", url: "https://www.metaappz.com/References/exams/ethiopia_esslce_exam" },
      { type: "link", name: "Additional Resources", url: "https://chem.libretexts.org" }
    ],
  },
  {
    id: "18",
    category: "",
    episode: "",
    title: "Grade 12 Biology Unit 1: National Exam Questions",
    videoUrl: "https://www.youtube.com/watch?v=KeVhGghtebk&list=PLhXdcrTaVuV8FWaAc1T1UQwgoixZzC9q-&index=14",
    thumbnail: "https://img.youtube.com/vi/KeVhGghtebk/maxresdefault.jpg",
    duration: "",
    views: "",
    date: "",
    materials: [
      { type: "pdf", name: "Ethiopian National Questions ", url: "https://www.metaappz.com/References/exams/ethiopia_esslce_exam" },
      { type: "pdf", name: "Practice Questions", url: "https://www.metaappz.com/References/exams/ethiopia_esslce_exam" },
      { type: "link", name: "Additional Resources", url: "https://chem.libretexts.org" }
    ],
  },
  {
    id: "19",
    category: "",
    episode: "",
    title: "Grade 12 chemistry Unit 1 Acid Base Equilibria part 1 | | ተሻሽሎ የቀረበ",
    videoUrl: "https://www.youtube.com/watch?v=ONz6CPhpGqM&list=PLtpriW2pnN_6Ottbq6XSWdfg-aZjZQA4H",
    thumbnail: "https://img.youtube.com/vi/ONz6CPhpGqM/hqdefault.jpg",
    duration: "",
    views: "",
    date: "",
    materials: [
      { type: "pdf", name: "Chemistry Industry Notes.pdf", url: "https://ptable.com/#Properties" },
      { type: "pdf", name: "Practice Questions", url: "https://www.metaappz.com/References/exams/ethiopia_esslce_exam" },
      { type: "link", name: "Additional Resources", url: "https://chem.libretexts.org" }
    ],
  },
  {
    id: "20",
    category: "",
    episode: "",
    title: "Grade 10 Geography unit 3 part 1 | Natural Resource Base Africa | Overviews of Natural Resources",
    videoUrl: "https://www.youtube.com/watch?v=w4VwX5qQDzs&list=PLfXpdCfxjXmYXuf73oC6k9xvakjdwE9P-&index=13",
    thumbnail: "https://img.youtube.com/vi/w4VwX5qQDzs/hqdefault.jpg",
    duration: "",
    views: "",
    date: "",
    materials: [
      { type: "pdf", name: "Chemistry Industry Notes.pdf", url: "https://chem.libretexts.org/Special:Search?qid=&fpid=230&fpth=&query=geograph&type=wiki" },
      { type: "pdf", name: "Practice Questions.pdf", url: "https://chem.libretexts.org/Special:Search?qid=&fpid=230&fpth=&query=geograph&type=wiki" },
      { type: "link", name: "Additional Resources", url: "https://chem.libretexts.org" }
    ],
  },
  {
    id: "21",
    category: "",
    episode: "",
    title: "Grade 10 geography unit 2 part 3 | Climates of Africa | Climate types and zones of Africa",
    videoUrl: "https://www.youtube.com/watch?v=INuuof-rAWc&list=PLfXpdCfxjXmYXuf73oC6k9xvakjdwE9P-&index=15",
    thumbnail: "https://img.youtube.com/vi/INuuof-rAWc/hqdefault.jpg",
    duration: "",
    views: "",
    date: "",
    materials: [
      { type: "pdf", name: "Chemistry Industry Notes.pdf", url: "https://chem.libretexts.org/Special:Search?qid=&fpid=230&fpth=&query=geograph&type=wiki" },
      { type: "pdf", name: "Practice Questions.pdf", url: "https://chem.libretexts.org/Special:Search?qid=&fpid=230&fpth=&query=geograph&type=wiki" },
      { type: "link", name: "Additional Resources", url: "https://chem.libretexts.org" }
    ],
  },
  {
    id: "22",
    category: "",
    episode: "",
    title: "Ethiopian Grade 11 Geography 3#2 Resources Under pressure",
    videoUrl: "https://www.youtube.com/watch?v=Nu_6jOPSud0&list=PLN5XUISsXgLbUwR_ySjNvk_sqUes_tXAd&index=2",
    thumbnail: "https://img.youtube.com/vi/Nu_6jOPSud0/hqdefault.jpg",
    duration: "",
    views: "",
    date: "",
    materials: [
      { type: "pdf", name: "Chemistry Industry Notes.pdf", url: "https://chem.libretexts.org/Special:Search?qid=&fpid=230&fpth=&query=geograph&type=wiki" },
      { type: "pdf", name: "Practice Questions.pdf", url: "https://chem.libretexts.org/Special:Search?qid=&fpid=230&fpth=&query=geograph&type=wiki" },
      { type: "link", name: "Additional Resources", url: "https://chem.libretexts.org" }
    ],
  },
  {
    id: "23",
    category: "",
    episode: "",
    title: "Ethiopian Grade 11 Geography 3#3 Land resource depletion",
    videoUrl: "https://www.youtube.com/watch?v=0adNWfg6630&list=PLN5XUISsXgLbUwR_ySjNvk_sqUes_tXAd&index=3",
    thumbnail: "https://img.youtube.com/vi/0adNWfg6630/hqdefault.jpg",
    duration: "",
    views: "",
    date: "",
    materials: [
      { type: "pdf", name: "Chemistry Industry Notes.pdf", url: "https://chem.libretexts.org/Special:Search?qid=&fpid=230&fpth=&query=geograph&type=wiki" },
      { type: "pdf", name: "Practice Questions.pdf", url: "https://chem.libretexts.org/Special:Search?qid=&fpid=230&fpth=&query=geograph&type=wiki" },
      { type: "link", name: "Additional Resources", url: "https://chem.libretexts.org" }
    ],

  },
  {
    id: "24",
    category: "",
    episode: "",
    title: "Ethiopian Grade 12 Geography 3#1 Management of Conflict",
    videoUrl: "https://www.youtube.com/watch?v=dQ8Z6ShqWuM&list=PLN5XUISsXgLaeRgKf14c1LYtiusZB1GH4",
    thumbnail: "https://img.youtube.com/vi/dQ8Z6ShqWuM/hqdefault.jpg",
    duration: "",
    views: "",
    date: "",
    materials: [
      { type: "pdf", name: "Chemistry Industry Notes.pdf", url: "https://chem.libretexts.org/Special:Search?qid=&fpid=230&fpth=&query=geograph&type=wiki" },
      { type: "pdf", name: "Practice Questions.pdf", url: "https://chem.libretexts.org/Special:Search?qid=&fpid=230&fpth=&query=geograph&type=wiki" },
      { type: "link", name: "Additional Resources", url: "https://chem.libretexts.org" }
    ],
  },
   {
    id: "25",
    category: "",
    episode: "",
    title: "Ethiopian Grade 12 Geography 3#4 drivers of conflict",
    videoUrl: "https://www.youtube.com/watch?v=elSiYbZsrNk&list=PLN5XUISsXgLaeRgKf14c1LYtiusZB1GH4&index=4",
    thumbnail: "https://img.youtube.com/vi/elSiYbZsrNk/hqdefault.jpg",
    duration: "",
    views: "",
    date: "",
    materials: [
      { type: "pdf", name: "Chemistry Industry Notes.pdf", url: "https://chem.libretexts.org/Special:Search?qid=&fpid=230&fpth=&query=geograph&type=wiki" },
      { type: "pdf", name: "Practice Questions.pdf", url: "https://chem.libretexts.org/Special:Search?qid=&fpid=230&fpth=&query=geograph&type=wiki" },
      { type: "link", name: "Additional Resources", url: "https://chem.libretexts.org" }
    ],
  },
   {
    id: "26",
    category: "",
    episode: "",
    title: "Ethiopian Grade 12 Geography 3#3 Resource Use",
    videoUrl: "https://www.youtube.com/watch?v=mICt0hm5a_s&list=PLN5XUISsXgLaeRgKf14c1LYtiusZB1GH4&index=3",
    thumbnail: "https://img.youtube.com/vi/mICt0hm5a_s/hqdefault.jpg",
    duration: "",
    views: "",
    date: "",
    materials: [
      { type: "pdf", name: "Chemistry Industry Notes.pdf", url: "https://chem.libretexts.org/Special:Search?qid=&fpid=230&fpth=&query=geograph&type=wiki" },
      { type: "pdf", name: "Practice Questions.pdf", url: "https://chem.libretexts.org/Special:Search?qid=&fpid=230&fpth=&query=geograph&type=wiki" },
      { type: "link", name: "Additional Resources", url: "https://chem.libretexts.org" }
    ],
  },
   {
    id: "27",
    category: "",
    episode: "",
    title: "2016 Grade 12 GEOGRAPHY MODEL EXAM ON GRADE 12 NEW CURRICULUM Part 4 (UNIT 1)@bridgeeducation4771",
    videoUrl: "https://www.youtube.com/watch?v=sUQerOLgz6U&list=PL0_kVj6YTXpX6wpTCFpqM-no-YtfNJxw9",
    thumbnail: "https://img.youtube.com/vi/sUQerOLgz6U/hqdefault.jpg",
    duration: "",
    views: "",
    date: "",
    materials: [
      { type: "pdf", name: "Chemistry Industry Notes.pdf", url: "https://chem.libretexts.org/Special:Search?qid=&fpid=230&fpth=&query=geograph&type=wiki" },
      { type: "pdf", name: "Practice Questions.pdf", url: "https://chem.libretexts.org/Special:Search?qid=&fpid=230&fpth=&query=geograph&type=wiki" },
      { type: "link", name: "Additional Resources", url: "https://chem.libretexts.org" }
    ],
}

];

// Sample study materials by subject
const studyMaterials = {
  "Chemistry": [
     { id: "math1", type: "pdf", name: "የ12ተኛ ክፍል የእንግሊዝኛ ዩኒቨርሲቲ መግቢያ ፈተና ጥያቄዎች ...", url: "https://www.scribd.com/document/865986766/2025-Ethiopian-Entrance-Exam", subject: "All subject", grade: "9-12", downloads: "3.2K", image: "https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg" },
    { id: "math2", type: "pdf", name: "Entrance Examination For Grade 12 From 1995 - 2011 | PDF ", url: "https://fetena.net/exam/entrance", subject: "Entrance Exam", grade: "9-10", downloads: "2.1K", image: "https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg" },
    { id: "math2", type: "pdf", name: "Excel in Your Ethiopian Academic Journey", url: "https://www.ethiostudyhub.com/", subject: "Entrance Exam", grade: "9-10", downloads: "2.1K", image: "https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg" },
    { id: "math2", type: "pdf", name: "ለ ማትሪክ የሚያዘጋጁ ጥያቄዎች Ethiopian University Entrance ...", url: "https://www.neaea.com/question-and-answer/", subject: "Entrance Exam", grade: "9-10", downloads: "2.1K", image: "https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg" },
    { id: "math2", type: "pdf", name: "የ12ተኛ ክፍል የእንግሊዝኛ ዩኒቨርሲቲ መግቢያ ፈተና ጥያቄዎች ...", url: "https://www.metaappz.com/References/exams/ethiopia_esslce_exam", subject: "Entrance Exam", grade: "9-10", downloads: "2.1K", image: "https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg" },
    { id: "math2", type: "pdf", name: "English Ethiopian university entrance questions answer ,2007 ...", url: "https://temaribet.net/blogs/2", subject: "Entrance Exam", grade: "9-10", downloads: "2.1K", image: "https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg" },
    { id: "chem1", type: "pdf", name: "Grade 10 All Subject Explore", url: "https://kehulum.com/textbook/grade-10?utm_source=chatgpt.com", subject: "All", grade: "10", downloads: "1K", image: "https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg" },
    { id: "chem2", type: "pdf", name: "History and ShortNote", url: "https://www.bbc.co.uk/bitesize/subjects/zk26n39", subject: "History", grade: "11-12", downloads: "1.8K", image: "https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg" },
    { id: "chem3", type: "link", name: "Interactive Periodic Table", url: "https://ptable.com", subject: "Chemistry", grade: "All", downloads: "5.1K", image: "https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg"},
    { id: "chem4", type: "link", name: "Get All Subject", url: "https://kehulum.com/student-textbook/new/grade-12/english-for-ethiopia", subject: "Explore Subject", grade: "All", downloads: "1.1K", image: "https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg" },
    { id: "chem5", type: "link", name: "High School Courses", url: "https://study.com/academy/level/high-school.html?utm_source=chatgpt.com", subject: "All", grade: "Grade 9-12", downloads: "1.2K", image: "https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg" },
    { id: "chem6", type: "link", name: "Ask anything with Flexi", url: "https://www.ck12.org/flexi/#q=hi&ref=student-landing", subject: "Flexi", grade: "All", downloads: "2.1K", image: "https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg" },
    { id: "chem7", type: "link", name: "Explore All Subject ", url: "https://ocw.mit.edu/", subject: "Chemistry", grade: "All", downloads: "5.1K", image: "https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg" }, 
    { id: "chem8", type: "link", name: "Entrance Exam Question  ", url: "https://books.examgalaxy.com/?utm_source=chatgpt.com", subject: "Entrance Exam", grade: "12", downloads: "5.1K", image: "https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg" }, 
    { id: "chem9", type: "link", name: "Ethiopian Entrance Exam Question ", url: "https://kehulum.com/entrance-exam/natural-science?utm_source=chatgpt.com", subject: "All Subject", grade: "12", downloads: "5.1K",image: "https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg" }, 
    { id: "chem10", type: "link", name: "Explore All Subject ", url: "https://www.neaea.com/question-and-answer/?utm_source=chatgpt.com", subject: "All Subject", grade: "12", downloads: "5.1K", image: "https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg" }, 
   
    { id: "chem11", type: "link", name: "ALL Ethiopian National Exam Question and Answer [PDF] ", url: "https://www.neaea.com/question-and-answer/?utm_source=chatgpt.com", subject: "All Subject", grade: "All", downloads: "5.1K", image: "https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg" }, 
   { id: "chem12", type: "link", name: "National Exam Question", url: "https://learnethiopia.com/courses-page/geography-for-entrance-exam/?utm_source=chatgpt.com&v=4de1b7a4dc53", subject: "All Subject", grade: "12", downloads: "5.1K", image: "https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg" },
   { id: "chem13", type: "link", name: "Questions about Grade 12 University Entrance Exam", url: "https://tikuretentrance.com/", subject: "All Subject", grade: "12", downloads: "5.1K" },
   { id: "chem14", type: "link", name: "Ethiopian Grade 12 National Exam Questions and Answers", url: "https://www.ethiobookreview.com/national-exams", subject: "All Subject", grade: "12", downloads: "5.1K", image: "https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg" },
  ]
  
  
  
  ,
  "Mathematics": [
   
  ],
  "Biology": [
    { id: "bio1", type: "pdf", name: "Cell Biology Notes", url: "#", subject: "Biology", grade: "10-12", downloads: "1.5K", image: "https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg" }
  ],
  "Physics": [
    { id: "hiso1", type: "pdf", name: "Physics Formula Handbook", url: "#", subject: "Physics", grade: "11-12", downloads: "2.7K", image: "https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg" }
  ],
  
};

const premiumResources = {

  "All Subjects": [
    { id: "all1", type: "platform", name: "Coursera", url: "https://coursera.org", description: "University courses", category: "Courses", rating: 4.7, access: "Freemium" },
    { id: "all2", type: "platform", name: "edX", url: "https://edx.org", description: "Online learning", category: "Courses", rating: 4.6, access: "Freemium" },
    { id: "all3", type: "tool", name: "Quizlet", url: "https://quizlet.com", description: "Flashcards & study sets", category: "Memorization", rating: 4.5, access: "Freemium" },
    { id: "all4", type: "tool", name: "Anki", url: "https://apps.ankiweb.net", description: "Spaced repetition", category: "Memorization", rating: 4.8, access: "Free" }
  ]
};


const coding = {
  "Coding": [
  // { id: "cod1", type: "link", name: "FreeCodeCamp", url: "https://www.freecodecamp.org/?utm_source=chatgpt.com", subject: "Learn HTML, CSS, JavaScript, Python, and more with hands-on projects and certificates.",  },
  // { id: "", type: "link", name: "Codecademy", url: "https://www.codecademy.com/?utm_source=chatgpt.com", subject: "",  },
 {
      id: "cod1",
      type: "link",
      name: "Python Programming",
      url: "https://www.w3schools.com/python/default.asp",
      image: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg",
      subject: "Python is a popular programming language used for web development, automation, data science, and AI. Start Learning..."
    },
    {
      id: "cod2",
      type: "link",
      name: "Java Programming",
      url: "https://www.w3schools.com/java/default.asp",
      image: "https://upload.wikimedia.org/wikipedia/en/3/30/Java_programming_language_logo.svg",
      subject: "Java is widely used to build mobile apps, desktop software, games, and enterprise systems."
    },
    {
      id: "cod3",
      type: "link",
      name: "PHP Programming",
      url: "https://www.w3schools.com/php/default.asp",
      image: "https://upload.wikimedia.org/wikipedia/commons/2/27/PHP-logo.svg",
      subject: "PHP is a server-side scripting language used to build dynamic websites and web applications. Start Learning..."
    },
    {
      id: "cod4",
      type: "link",
      name: "SQL Tutorial",
      url: "https://www.w3schools.com/sql/default.asp",
      image: "https://upload.wikimedia.org/wikipedia/commons/8/87/Sql_data_base_with_logo.png",
      subject: "SQL is used to store, manage, and retrieve data from databases. Start Learning..."
    },
    {
      id: "cod5",
      type: "link",
      name: "JavaScript Tutorial",
      url: "https://www.w3schools.com/js/default.asp",
      image: "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png",
      subject: "JavaScript is used to create dynamic and interactive web applications. Start Learning..."
    },
    {
      id: "cod6",
      type: "link",
      name: "CSS Tutorial",
      url: "https://www.w3schools.com/css/default.asp",
      image: "https://upload.wikimedia.org/wikipedia/commons/d/d5/CSS3_logo_and_wordmark.svg",
      subject: "CSS is used to style and design beautiful, responsive websites. Start Learning..."
    },
      {
      id: "cod7",
      type: "link",
      name: "React Tutorial",
      url: "https://www.w3schools.com/react/default.asp",
      image: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
      subject: "React is a JavaScript library for building user interfaces. React is used to build single-page applications."
    },
      {
      id: "cod8",
      type: "link",
      name: "HTML Tutorial",
      url: "https://www.w3schools.com/html/default.asp",
      image: "https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg",
      subject: "HTML is the standard markup language for Web pages. With HTML you can create your own Website. Start Learning..."
    },
     {
  id: "cod9",
  type: "link",
  name: "C Programming Tutorial",
  url: "https://www.w3schools.com/c/index.php",
  image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg",
  subject: "C is a powerful general‑purpose programming language used for systems and application development. Start Learning..."
},
     {
      id: "cod10",
      type: "link",
      name: "C++ Tutorial",
      url: "https://www.w3schools.com/cpp/default.asp",
      image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
      subject: "C++ is used to create computer programs, and is one of the most used language in game development. Start Learning..."
    },
     {
      id: "cod11",
      type: "link",
      name: "Bootstrap Tutorial",
      url: "https://www.w3schools.com/bootstrap/bootstrap_ver.asp",
      image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-plain.svg",
      subject: "Bootstrap is the most popular HTML, CSS, and JavaScript framework for developing responsive, mobile-first websites. Start Learning..."
    },
     {
      id: "cod12",
      type: "link",
      name: "C# Tutorial",
      url: "https://www.w3schools.com/cs/index.php",
      image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg",
      subject: "C# (C-Sharp) is a programming language developed by Microsoft that runs on the .NET Framework. Start Learninig..."
    },
     {
      id: "cod13",
      type: "link",
      name: "MySQL Tutorial",
      url: "https://www.w3schools.com/mysql/default.asp",
      image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
      subject: "MySQL is a widely used relational database management system (RDBMS). Start Learning..."
    },
    {
      id: "cod14",
      type: "link",
      name: "Learn jQuery",
      url: "https://www.w3schools.com/jquery/default.asp",
      image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jquery/jquery-original.svg",
      subject: "jQuery is a JavaScript Library. jQuery greatly simplifies JavaScript programming. Start Learning..."
    },
    {
      id: "cod15",
      type: "link",
      name: "Learn Django",
      url: "https://www.w3schools.com/django/index.php",
      image: "https://upload.wikimedia.org/wikipedia/commons/7/75/Django_logo.svg",
      subject: "Django is a back-end server side web framework. Django is free, open source and written in Python. Start Learning..."
    },
    {
      id: "cod16",
      type: "link",
      name: "Node.js Tutorial",
      url: "https://www.w3schools.com/nodejs/default.asp",
      image: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg",
      subject: "Node.js is a free, open source tool that lets you run JavaScript outside the web browser."
    },
    {
      id: "cod17",
      type: "link",
      name: "Angular Tutorial",
      url: "https://www.w3schools.com/angular/default.asp",
      image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg",
      subject: "Angular is a framework for building client applications in HTML and TypeScript. Start Learning..."
    },
    {
      id: "cod18",
      type: "link",
      name: "Cyber Security Tutorial",
      url: "https://www.w3schools.com/cybersecurity/index.php",
      image: "https://cdn-icons-png.flaticon.com/512/3064/3064197.png",
      subject: "This course serves as an excellent primer to the many different domains of Cyber security."
    },
    {
      id: "cod19",
      type: "link",
      name: "Data Science Tutorial",
      url: "https://www.w3schools.com/datascience/default.asp",
      image: "https://cdn-icons-png.flaticon.com/512/1055/1055687.png",
      subject: "A Data Scientist helps companies with data-driven decisions, to make their business better. Start Learninig..."
    },
    {
      id: "cod20",
      type: "link",
      name: "SoloLearn Platform",
      url: "https://www.sololearn.com/en/?utm_source=chatgpt.com",
      image: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/sololearn.svg",
      subject: "Learn the latest technology with interactive, hands-on courses. It’s free. Start Learning..."
    },
    {
      id: "cod21",
      type: "link",
      name: "Machine Learning",
      url: "https://www.w3schools.com/ai/default.asp",
      image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
      subject: "Machine Learning is a subfield of Artificial intelligence Learning machines to imitate human intelligence Start Learning..."
    },
    {
      id: "cod22",
      type: "link",
      name: "",
      url: "",
      image: "",
      subject: ""
    },
    {
      id: "cod23",
      type: "link",
      name: "",
      url: "",
      image: "",
      subject: ""
    },
    {
      id: "cod24",
      type: "link",
      name: "",
      url: "",
      image: "",
      subject: ""
    },
    {
      id: "cod25",
      type: "link",
      name: "",
      url: "",
      image: "",
      subject: ""
    },
    

   
  
  ]
}


const extractVideoId = (url) => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  const urlParams = new URLSearchParams(url.split('?')[1] || '');
  return urlParams.get('v') || url.split('/').pop();
};

const YouTubeCards = () => {
  const navigate = useNavigate();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [expandedVideo, setExpandedVideo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedGrade, setSelectedGrade] = useState("All");
  const [activeTab, setActiveTab] = useState("videos"); // "videos", "premium", "pdfs"
  const containerRef = useRef(null);

  // Get unique subjects from videos
  const subjects = ["All", ...new Set(videos.filter(v => v.subject).map(v => v.subject))];
  const grades = ["All", ...new Set(videos.filter(v => v.grade).map(v => v.grade))];

  // Filter videos based on search and filters
  const filteredVideos = videos.filter(video => {
    const matchesSearch = searchTerm === "" || 
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = selectedSubject === "All" || video.subject === selectedSubject;
    const matchesGrade = selectedGrade === "All" || video.grade === selectedGrade;
    
    return matchesSearch && matchesSubject && matchesGrade;
  });

  // Filter premium resources based on selected subject
  const filteredPremiumResources = selectedSubject === "All" 
    ? premiumResources["All Subjects"]
    : premiumResources[selectedSubject] || [];

  // Filter PDFs based on selected subject
  const filteredPdfs = selectedSubject === "All"
    ? Object.values(studyMaterials).flat()
    : studyMaterials[selectedSubject] || [];




  const filteredcode = selectedSubject === "All"
    ? Object.values(coding).flat()
    : coding[selectedSubject] || [];




  const openVideo = (videoUrl) => {
    const videoId = extractVideoId(videoUrl);
    setSelectedVideo(videoId);
    document.body.style.overflow = 'hidden';
  };

  const closeVideo = () => {
    setSelectedVideo(null);
    document.body.style.overflow = 'auto';
  };

  const toggleMaterials = (videoId) => {
    setExpandedVideo(expandedVideo === videoId ? null : videoId);
  };

  const downloadMaterial = (material) => {
    console.log(`Downloading: ${material.name}`);
    window.open(material.url, '_blank');
  };

  // Background particle effect
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.style.position = 'absolute';
      particle.style.width = `${Math.random() * 4 + 2}px`;
      particle.style.height = particle.style.width;
      particle.style.background = `hsl(${Math.random() * 60 + 200}, 100%, 70%)`;
      particle.style.borderRadius = '50%';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.opacity = Math.random() * 0.5 + 0.1;
      particle.style.zIndex = '0';
      
      container.appendChild(particle);
      
      const duration = Math.random() * 10 + 10;
      particle.animate([
        { transform: 'translateY(0px)', opacity: particle.style.opacity },
        { transform: `translateY(${Math.random() * 100 - 50}px)`, opacity: 0 }
      ], {
        duration: duration * 1000,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
      });
      
      setTimeout(() => {
        particle.remove();
      }, duration * 1000);
    };

    const interval = setInterval(createParticle, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 overflow-hidden" ref={containerRef}>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Header with Back Button */}
        <div className="fixed top-2 left-2 right-2 z-10 md:top-4 md:left-4 md:right-auto">
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center space-x-2 w-full md:w-auto px-3 py-2 md:px-4 md:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md text-sm md:text-base"
          >
            <Home className="w-4 h-4 md:w-5 md:h-5" />
            <span className="truncate">Back to Home Page</span>
          </button>
        </div>

        {/* Study Platform Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center pt-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Interactive Study Platform
          </h1>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Watch educational videos, download study materials, and access premium resources all in one place
          </p>
        </motion.div>

        {/* Tab Buttons */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-1">
            <button
              onClick={() => setActiveTab("videos")}
              className={`px-6 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 ${activeTab === "videos" ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg' : 'text-gray-300 hover:text-white hover:bg-gray-700/50'}`}
            >
              <Video className="w-5 h-5" />
              Videos ({filteredVideos.length})
            </button>
            <button
              onClick={() => setActiveTab("premium")}
              className={`px-6 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 ${activeTab === "premium" ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' : 'text-gray-300 hover:text-white hover:bg-gray-700/50'}`}
            >
              <Sparkles className="w-5 h-5" />
              Premium Resources
            </button>
            <button
              onClick={() => setActiveTab("pdfs")}
              className={`px-6 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 ${activeTab === "pdfs" ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg' : 'text-gray-300 hover:text-white hover:bg-gray-700/50'}`}
            >
              <FileText className="w-5 h-5" />
              PDF Materials
            </button>

             <button
              onClick={() => setActiveTab("coding")}
              className={`px-6 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 ${activeTab === "coding" ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg' : 'text-gray-300 hover:text-white hover:bg-gray-700/50'}`}
            >
              <Code2 className="w-5 h-5" />
              Coding
            </button>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 p-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-900/80 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex gap-4 w-full md:w-auto">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="pl-10 pr-8 py-3 bg-gray-900/80 border border-gray-700 rounded-xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
              
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="px-4 py-3 bg-gray-900/80 border border-gray-700 rounded-xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {grades.map(grade => (
                  <option key={grade} value={grade}>Grade {grade}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Main Content - Videos Tab */}
        {activeTab === "videos" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Video className="w-6 h-6" />
              Educational Videos ({filteredVideos.length})
            </h2>

            {/* Videos Grid - 3x3 Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredVideos.map((video, index) => (
                  <motion.div
                    key={video.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: index * 0.05,
                      type: "spring",
                      stiffness: 100 
                    }}
                  >
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300 h-full flex flex-col">
                      {/* Thumbnail */}
                      <div 
                        className="relative h-48 cursor-pointer group flex-shrink-0"
                        onClick={() => openVideo(video.videoUrl)}
                        onMouseEnter={() => setHoveredCard(video.id)}
                        onMouseLeave={() => setHoveredCard(null)}
                      >
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                        <div className="absolute top-3 left-3">
                          <span className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                            {video.subject || "General"}
                          </span>
                        </div>
                        <div className="absolute bottom-3 right-3 bg-black/80 text-white text-sm px-2 py-1 rounded">
                          {video.duration}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-red-600 rounded-full p-4">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 flex-grow flex flex-col">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-white font-bold text-lg line-clamp-2">{video.title}</h3>
                          {video.grade && (
                            <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded">
                              Grade {video.grade}
                            </span>
                          )}
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-between text-gray-400 text-sm mb-4">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {video.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {video.views} views
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span>4.5</span>
                          </div>
                        </div>

                        {/* Study Materials Toggle */}
                        {video.materials && video.materials.length > 0 && (
                          <div className="mt-auto">
                            <button
                              onClick={() => toggleMaterials(video.id)}
                              className="w-full flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
                            >
                              <div className="flex items-center gap-2 text-cyan-300">
                                <FileText className="w-5 h-5" />
                                <span>Study Materials ({video.materials.length})</span>
                              </div>
                              {expandedVideo === video.id ? 
                                <ChevronUp className="w-5 h-5" /> : 
                                <ChevronDown className="w-5 h-5" />
                              }
                            </button>

                            {/* Materials List */}
                            <AnimatePresence>
                              {expandedVideo === video.id && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="mt-3 space-y-2"
                                >
                                  {video.materials.map((material, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg hover:bg-gray-800 transition-colors"
                                    >
                                      <div className="flex items-center gap-3">
                                        <FileText className="w-5 h-5 text-cyan-400" />
                                        <span className="text-white">{material.name}</span>
                                      </div>
                                      <button
                                        onClick={() => downloadMaterial(material)}
                                        className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                                      >
                                        {material.type === 'link' ? 
                                          <ExternalLink className="w-4 h-4" /> : 
                                          <Download className="w-4 h-4" />
                                        }
                                        {material.type === 'link' ? 'Open' : 'Download'}
                                      </button>
                                    </div>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Main Content - Premium Resources Tab */}
        {activeTab === "premium" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Sparkles className="w-6 h-6" />
              Premium Study Resources ({filteredPremiumResources.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPremiumResources.map((resource, index) => (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-2xl overflow-hidden shadow-2xl border border-purple-700/30 hover:border-purple-500/50 transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{resource.name}</h3>
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${resource.access === 'Free' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                            {resource.access}
                          </span>
                          <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                            {resource.category}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-500/20 px-3 py-1 rounded-full">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-yellow-300 font-bold">{resource.rating}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 mb-6">{resource.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-cyan-300 text-sm font-medium">{resource.type}</span>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Visit Resource
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Main Content - PDFs Tab */}









        {activeTab === "pdfs" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6" />
              PDF Study Materials ({filteredPdfs.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPdfs.map((pdf, index) => (
                <motion.div
                  key={pdf.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gradient-to-br from-emerald-900/50 to-green-900/50 rounded-2xl overflow-hidden shadow-2xl border border-emerald-700/30 hover:border-emerald-500/50 transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{pdf.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-sm">
                            {pdf.subject}
                          </span>
                          <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                            Grade {pdf.grade}
                          </span>
                         
                        </div>
                      </div>
                      <div className="text-emerald-400">
                         <img
                            src={pdf.image}
                             alt={pdf.name}
                            className="h-24 object-contain"
      />
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <div className="text-gray-400 text-sm mb-2">View</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-800 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-emerald-500 to-green-500 h-full rounded-full"
                            style={{ width: `${Math.min(100, (parseInt(pdf.downloads) / 100))}%` }}
                          ></div>
                        </div>
                        <span className="text-white font-bold">{pdf.downloads}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">{pdf.type.toUpperCase()}</span>
                      <button
                        onClick={() => downloadMaterial(pdf)}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                      >
                        <BookOpenCheckIcon className="w-4 h-4" />
                        Open
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}



      





     {activeTab === "coding" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Code2Icon className="w-6 h-6" />
              Coding Materia  ({filteredcode.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredcode.map((code, index) => (
                <motion.div
                  key={code.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gradient-to-br from-emerald-900/50 to-green-900/50 rounded-2xl overflow-hidden shadow-2xl border border-emerald-700/30 hover:border-emerald-500/50 transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{code.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1  text-emerald-300  text-sm">
                            {code.subject}
                          </span>
                            <img
                            src={code.image}
                             alt={code.name}
                            className="h-12 object-contain"
      />
                        </div>
                      </div>
                      <div className="text-emerald-400">
                        <Code2Icon className="w-8 h-8" />
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <div className="text-gray-400 text-sm mb-2">View</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-800 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-emerald-500 to-green-500 h-full rounded-full"
                            style={{ width: `${Math.min(100, (parseInt(code.downloads) / 100))}%` }}
                          ></div>
                        </div>
                        <span className="text-white font-bold">{code.downloads}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">{code.type.toUpperCase()}</span>
                      <button
                        onClick={() => downloadMaterial(code)}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                      >
                        <Code2 className="w-4 h-4" />
                        Start Learning
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}






        {/* Quick Stats - Always visible */}
        <div className="mt-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700/50">
          <h3 className="text-xl font-bold text-white mb-6">Platform Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-cyan-500/10 rounded-xl">
              <div className="text-3xl font-bold text-cyan-400">{videos.length}</div>
              <div className="text-gray-400">Videos</div>
            </div>
            <div className="text-center p-4 bg-purple-500/10 rounded-xl">
              <div className="text-3xl font-bold text-purple-400">
                {Object.values(premiumResources).flat().length}
              </div>
              <div className="text-gray-400">Premium Resources</div>
            </div>
            <div className="text-center p-4 bg-emerald-500/10 rounded-xl">
              <div className="text-3xl font-bold text-emerald-400">
                {Object.values(studyMaterials).flat().length}
              </div>
              <div className="text-gray-400">PDF Materials</div>
            </div>
            <div className="text-center p-4 bg-blue-500/10 rounded-xl">
              <div className="text-3xl font-bold text-blue-400">24</div>
              <div className="text-gray-400">Subjects Covered</div>
            </div>
          </div>
        </div>
      </div>







      {/* Video Modal (Same as before) */}
      <AnimatePresence>
        {selectedVideo && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeVideo}
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed inset-0 z-50 flex items-center justify-center"
            >
              <div className="relative w-full max-w-6xl mx-auto">
                <motion.button
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  onClick={closeVideo}
                  className="absolute top-10 right-0 text-white hover:text-cyan-400 transition-colors duration-200 z-10 group"
                >
                  <div className="flex items-center">
                    <span className="mr-2 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Close
                    </span>
                    <div className="bg-gray-900/50 hover:bg-gray-800/80 p-3 rounded-full backdrop-blur-sm border border-gray-700">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  </div>
                </motion.button>

                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <div className="relative pt-[56.25%]">
                    <iframe
                      src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1&mute=0&rel=0&modestbranding=1&color=white&enablejsapi=1`}
                      className="absolute top-0 left-0 w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      title="YouTube video player"
                    ></iframe>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default YouTubeCards;





