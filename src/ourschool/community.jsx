import React from 'react';
import { GiVillage, GiTreehouse,  } from 'react-icons/gi';
import { FaUsers, FaHandsHelping, FaBookReader, } from 'react-icons/fa';
import communityGathering from '../assets/bulding.jpg';
import studentsTraditional from '../assets/comm.jpg';
import schoolEvent from '../assets/com.jpg';
import upSetImage from '../assets/cul.jpg'
import Footer from '../components/Footer';

const TulluDimtuSchool = () => {
  
  const communityData = {
    name: "Tullu Dimtu Secondary School Community",
    motto: "ጋር በመሆን እያደግን - Growing Together Through Education",
    schoolYears: new Date().getFullYear() - 1997,
    familiesServed: 1200,
    alumniCount: 3500
  };

  const communitySections = [
    {
      title: "Our Educational Heritage",
      icon: <GiVillage className="text-4xl text-yellow-600" />,
      content: [
        "Our educational heritage at Tullu Dimtu Secondary School reflects a proud tradition of academic excellence, cultural values, and community engagement. The school has long been a cornerstone of learning, fostering intellectual growth and moral development among students. Through a balanced curriculum, dedicated teachers, and a supportive environment, Tullu Dimtu instills discipline, creativity, and a sense of responsibility in its learners.",
        " The school not only preserves local traditions but also embraces modern education, preparing students to contribute meaningfully to society. This rich heritage serves as a foundation for future generations, ensuring that the legacy of knowledge and leadership continues to thrive."
      ],
      image: communityGathering
    },
    {
      title: "School as Community Center",
      icon: <FaUsers className="text-4xl text-green-600" />,
      content: [
        "Tullu Dimtu Secondary School serves not only as an institution of learning but also as a vibrant community center, bringing people together for social, cultural, and developmental activities. Beyond classrooms, the school hosts meetings, workshops, and events that unite parents, local leaders, and students in collective progress. It provides a space for adult education programs, health awareness campaigns, and cultural celebrations, strengthening community bonds.",
        " By opening its doors for public gatherings and civic engagements, the school plays a pivotal role in fostering unity and shared growth. This dual role as both an educational hub and a community center ensures that Tullu Dimtu remains a cornerstone of societal development, empowering generations beyond academics."
      ],
      image: studentsTraditional
    },
    {
      title: "Community Support for Education",
      icon: <FaHandsHelping className="text-4xl text-blue-600" />,
      content: [
        "Tullu Dimtu Secondary School operates a unique community scholarship program where local farmers and businesses contribute to support students in need. This ensures every child in our community can access quality secondary education regardless of family circumstances.",
        "Students at Tullu Dimtu Secondary School actively participate in community development projects, applying their classroom learning to real-world challenges while maintaining strong connections to their cultural roots."
      ],
      image: schoolEvent
    },
    {
      title: "Cultural Education Mission",
      icon: <FaBookReader className="text-4xl text-red-600" />,
      content: [
        "Tullu Dimtu Secondary School hosts annual cultural education events where students learn and showcase traditional Oromo knowledge systems, including the Irreecha thanksgiving celebration and Oromo storytelling traditions.",
        "Our school's Cultural Preservation Club works with community elders to document and archive Oromo traditions, creating educational materials that benefit both students and the wider community."
      ],
      image: upSetImage
    }
  ];

  const communityProjects = [
    {
      name: "School-Community Garden Program",
      description: "Tullu Dimtu students and local farmers collaborate on sustainable agriculture education projects",
      impact: "Supplies the school kitchen while teaching traditional and modern farming techniques"
    },
    {
      name: "Intergenerational Learning Initiative",
      description: "Connects Tullu Dimtu Secondary School students with community elders for cultural education",
      impact: "Preserves indigenous knowledge while providing digital literacy training for elders"
    },
    {
      name: "Community Education Resource Center",
      description: "A shared learning space built and maintained by Tullu Dimtu school and community members",
      impact: "Provides educational resources for students and adult community members alike"
    }
  ];

  return (
   <>
   
   <div className="font-sans mt-14 bg-gray-50 text-gray-800">
     
     <header className="bg-green-900 text-white">
       <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row items-center">
         <div className="md:w-1/2 mb-6 md:mb-0">
           <h1 className="text-3xl md:text-4xl font-bold mb-2">
             Tullu Dimtu <span className="text-yellow-400">Secondary School</span>
           </h1>
           <p className="text-xl">{communityData.motto}</p>
         </div>
         <div className="md:w-1/2 grid grid-cols-3 gap-4 text-center">
           <div className="bg-green-800 p-4 rounded-lg">
             <div className="text-2xl font-bold">{communityData.schoolYears}+</div>
             <div className="text-sm">Years of Education</div>
           </div>
           <div className="bg-yellow-600 p-4 rounded-lg text-green-900">
             <div className="text-2xl font-bold">{communityData.familiesServed}+</div>
             <div className="text-sm">Families Served</div>
           </div>
           <div className="bg-green-800 p-4 rounded-lg">
             <div className="text-2xl font-bold">{communityData.alumniCount}+</div>
             <div className="text-sm">Graduates</div>
           </div>
         </div>
       </div>
     </header>

    
     <main className="container mx-auto px-4 py-12">
      
       {communitySections.map((section, index) => (
         <section key={index} className={`mb-16 ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
           <div className="flex flex-col md:flex-row items-center gap-8">
             <div className="md:w-1/2 mb-6 md:mb-0">
               {section.image && (
                 <img 
                   src={section.image} 
                   alt={section.title} 
                   className="rounded-lg shadow-xl w-full h-auto object-cover"
                 />
               )}
             </div>
             <div className="md:w-1/2">
               <div className="flex items-center mb-4">
                 <div className="mr-4">
                   {section.icon}
                 </div>
                 <h2 className="text-2xl font-bold text-green-800">{section.title}</h2>
               </div>
               {section.content.map((paragraph, pIndex) => (
                 <p key={pIndex} className="mb-4 text-gray-700 leading-relaxed">
                   {paragraph}
                 </p>
               ))}
             </div>
           </div>
         </section>
       ))}

      
       <section className="my-20">
         <h2 className="text-3xl font-bold text-center text-green-900 mb-12">
           School-Community <span className="text-yellow-600">Partnerships</span>
         </h2>
         <div className="grid md:grid-cols-3 gap-8">
           {communityProjects.map((project, index) => (
             <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-t-4 border-yellow-500">
               <h3 className="text-xl font-bold mb-3 text-green-800">{project.name}</h3>
               <p className="text-gray-600 mb-4">{project.description}</p>
               <div className="bg-green-50 p-3 rounded">
                 <h4 className="font-semibold text-green-700 mb-1">Educational Impact:</h4>
                 <p className="text-sm text-green-800">{project.impact}</p>
                 
               </div>
             </div>
           ))}
         </div>
       </section>

      
       <section className="bg-green-800 text-white rounded-xl p-8 md:p-12 my-16">
         <div className="flex flex-col md:flex-row items-center">
           <div className="md:w-2/3 mb-6 md:mb-0">
             <h2 className="text-2xl md:text-3xl font-bold mb-4">
               Tullu Dimtu's <span className="text-yellow-400">Educational Mission</span>
             </h2>
             <p className="mb-4">
               Tullu Dimtu Secondary School integrates cultural preservation with modern education:
             </p>
             <ul className="space-y-2">
               <li className="flex items-start">
                 <span className="text-yellow-400 mr-2">•</span>
                 <span>Students research and document Oromo traditions as part of their social studies curriculum</span>
               </li>
               <li className="flex items-start">
                 <span className="text-yellow-400 mr-2">•</span>
                 <span>Our science program includes studies of traditional ecological knowledge</span>
               </li>
               <li className="flex items-start">
                 <span className="text-yellow-400 mr-2">•</span>
                 <span>Cultural performances are incorporated into our arts education program</span>
               </li>
             </ul>
           </div>
           <div className="md:w-1/3 flex justify-center">
             <GiTreehouse className="text-8xl text-yellow-400 opacity-80" />
           </div>
         
         </div>
          
       </section>
     </main>


   </div>
   
   <Footer/>
   </>
  );
};

export default TulluDimtuSchool;