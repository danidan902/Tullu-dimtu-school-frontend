import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import logo from '../assets/tullulogo.png'
import { Helmet } from "react-helmet-async";

const TuludimtuSchoolPolicy = () => {
  const [activeSection, setActiveSection] = useState('general');
  const navigate = useNavigate();
  const policies = {
    general: {
      title: "① General Conduct and Behavior",
      content: [
        "• All students attending Tuludimtu School are expected to maintain the highest standards of personal conduct, integrity, and moral character at all times. The school community is built upon mutual respect, dignity, and consideration for others, and every student must contribute positively to this environment. Students must demonstrate respect for all members of the school community, including peers, teachers, administrative staff, support personnel, and visitors. This respect must be evident in both words and actions, whether on school premises, during school-sponsored activities, or while representing the school in any capacity. The reputation of Tuludimtu School is collectively upheld by the behavior of each individual student, and as such, students are expected to conduct themselves in a manner that brings honor to themselves, their families, and the institution.",
        
        "✋ The school uniform represents the identity and values of Tuludimtu School and must be worn correctly and with pride during all school hours, at school functions, and while traveling to and from school. The complete uniform includes all specified items worn in the prescribed manner, maintained in clean, neat, and presentable condition. Modifications to the uniform, including alterations to style, fit, or the addition of non-regulation accessories, are strictly prohibited unless specifically authorized by school administration for documented medical or religious reasons. Students must wear their uniforms in a manner that reflects the dignity of the school community, with shirts properly tucked, ties correctly knotted, and shoes polished and in good repair. The school administration reserves the right to determine what constitutes appropriate uniform wear and may require students to rectify uniform violations immediately.",
        
        "• Punctuality is a fundamental expectation at Tuludimtu School, as it demonstrates respect for the educational process and consideration for others. Students must arrive at school and to all classes on time, prepared to begin learning at the scheduled start time. The school day officially begins at the designated morning time, and students are expected to be in their homerooms or first period classes before the bell signals the start of instruction. Tardiness disrupts the learning environment, delays instructional progress, and shows disregard for established schedules. Students arriving late to school must report immediately to the administrative office to obtain a late admission slip before proceeding to class. Chronic tardiness will result in progressive disciplinary measures, including parent conferences, detention, and potential suspension of school privileges.",
        
        "✋ Respect for school property, facilities, equipment, and resources is an essential responsibility of every student at Tuludimtu School. The school environment includes classrooms, laboratories, libraries, sports facilities, equipment, furniture, instructional materials, and technological resources that are provided to support the educational mission. Students must treat all school property with care, using facilities and equipment only for their intended educational purposes and in accordance with established safety guidelines. Any damage to school property, whether accidental or intentional, must be reported immediately to a teacher or administrator. Students found responsible for deliberate damage, vandalism, or negligent destruction of school property will be required to make appropriate restitution through financial payment, repair work, or community service, and may face additional disciplinary consequences up to and including suspension or expulsion.",
        
        "• Bullying, harassment, intimidation, discrimination, or any form of aggressive behavior is strictly prohibited at Tuludimtu School. This includes physical, verbal, psychological, social, or cyber forms of bullying or harassment. The school maintains a zero-tolerance policy toward any behavior that creates a hostile environment, threatens the physical or emotional safety of any individual, or interferes with another student's ability to learn and participate in school activities. All members of the school community have the right to learn and work in a safe, supportive environment free from intimidation, humiliation, or fear. Students who experience or witness bullying or harassment have a responsibility to report such incidents to a trusted teacher, counselor, or administrator immediately. All reports will be taken seriously, investigated thoroughly, and addressed with appropriate interventions and consequences."
      ]
    },
    
    academic: {
      title: "② Academic Policies and Expectations",
      content: [
        "• Academic integrity forms the cornerstone of the educational philosophy at Tuludimtu School and is non-negotiable for all students. Every student must complete their own work honestly and ethically, giving proper credit to the ideas and words of others through appropriate citation and referencing. Plagiarism, defined as presenting another person's work, ideas, or words as one's own without proper acknowledgment, constitutes serious academic misconduct. This includes copying homework, using unauthorized materials during assessments, submitting work completed by others, purchasing or downloading assignments from external sources, or any other form of academic dishonesty. Cheating on tests, quizzes, examinations, or any form of assessment is strictly prohibited and will result in severe academic and disciplinary consequences, including failing grades on affected assignments, course failure, and potential suspension from school.",
        
        "✋ Homework is an essential component of the learning process at Tuludimtu School, designed to reinforce classroom instruction, develop independent study skills, and prepare students for upcoming lessons. All assigned homework must be completed thoughtfully and submitted by the specified deadlines. Students are expected to dedicate appropriate time each day to homework assignments, maintaining a consistent study schedule that allows for thorough completion of all academic responsibilities. Extensions on homework deadlines may be granted only under exceptional circumstances with prior approval from the subject teacher, supported by valid documentation. Regular homework completion contributes significantly to academic progress, skill development, and preparation for assessments. Failure to complete homework assignments consistently may result in lowered academic grades, mandatory after-school study sessions, and parent-teacher conferences to develop intervention strategies.",
        
        "• Examination protocols at Tuludimtu School are designed to ensure fairness, security, and the accurate assessment of student learning. All students must adhere strictly to examination rules and procedures, arriving at examination venues at least fifteen minutes before the scheduled start time with all required materials. Only items explicitly permitted by the examination instructions may be brought into the examination room, including specific writing instruments, calculators (if allowed), and other authorized resources. Communication between students during examinations is strictly prohibited, as is any attempt to access unauthorized information or materials. Students must remain in the examination room for the entire duration of the examination unless specifically permitted to leave by the invigilator. Any violation of examination rules will result in immediate disciplinary action, potentially including invalidation of the examination paper and further academic penalties.",
        
        "✋ Continuous assessment throughout the academic year contributes significantly to final course grades at Tuludimtu School. This assessment includes but is not limited to class participation, homework assignments, projects, presentations, laboratory work, quizzes, tests, and examinations. Students must participate actively in all assessment activities, demonstrating consistent effort and engagement throughout the academic term. Missing assessments without valid justification, such as documented illness or approved absences, may result in a grade of zero for that assessment component. Students with excused absences during scheduled assessments must make arrangements for alternative assessment within the timeframe specified by school policy, typically within one week of returning to school. The weighting of different assessment components varies by subject and grade level, with detailed information provided in course syllabi distributed at the beginning of each term.",
        
        "• Academic support services are available to all students at Tuludimtu School through scheduled consultation hours with teachers, peer tutoring programs, and specialized learning support staff. Students experiencing academic difficulties are strongly encouraged to seek assistance proactively rather than waiting until problems become overwhelming. Teachers maintain regular office hours for individual student consultations, and students should take advantage of these opportunities to clarify concepts, review challenging material, and receive guidance on academic improvement strategies. The school also offers study skills workshops, time management seminars, and examination preparation sessions throughout the academic year. Parents are encouraged to monitor academic progress through regular review of graded work, report cards, and parent-teacher conferences, collaborating with the school to support student success."
      ]
    },
    
    attendance: {
      title: "③ Attendance and Punctuality Regulations",
      content: [
        "• Regular school attendance is compulsory for all students enrolled at Tuludimtu School, as consistent participation in classroom instruction is fundamental to academic success. The school maintains a minimum attendance requirement of 85% of total school days for promotion to the next grade level, excluding absences for documented medical reasons, bereavement, or other exceptional circumstances approved by school administration. Attendance records are meticulously maintained and monitored, with automated notifications sent to parents when attendance falls below acceptable levels. Excessive absenteeism, even with parental permission, negatively impacts academic performance, social integration, and overall educational outcomes. Students approaching the attendance threshold will be subject to intervention strategies, including mandatory conferences with parents, administrators, and counselors to develop attendance improvement plans.",
        
        "✋ All student absences from school must be formally explained through written communication from parents or legal guardians submitted within 48 hours of the student's return to school. This communication must include the specific dates of absence, the reason for absence, and contact information for verification purposes. For illnesses extending beyond three consecutive school days, a medical certificate from a licensed healthcare provider is required, specifying the nature of the illness and the dates during which the student was medically unable to attend school. Pre-arranged leave for exceptional circumstances, such as family emergencies or significant events, must be requested in writing at least one week in advance, with supporting documentation provided where applicable. The school administration reserves the right to determine whether an absence is excused or unexcused based on the validity and documentation of the reason provided.",
        
        "• Punctuality is a fundamental expectation at Tuludimtu School, reflecting respect for the educational process and consideration for the learning community. The school day begins promptly at the designated morning time, and students are expected to be in their assigned classrooms ready to begin instruction when the opening bell rings. Morning arrival after the designated time constitutes tardiness and requires reporting to the administrative office for a late admission slip before proceeding to class. Repeated tardiness, defined as three or more late arrivals within a single month, will result in progressive disciplinary consequences beginning with parental notification, followed by detention, mandatory parent conferences, and potential restriction of school privileges. Chronic punctuality issues may also impact citizenship grades and eligibility for extracurricular activities, awards, and leadership positions within the school community.",
        
        "✋ Early departure from school before the official dismissal time requires written permission from parents or legal guardians and formal approval from the school administration office. Students must be signed out by an authorized adult at the main office, with proper identification verified by school staff, before leaving the school premises. Unauthorized early departures, including leaving campus without permission or being signed out by unauthorized individuals, will be treated as truancy and subject to disciplinary action. In cases of sudden illness or emergency during the school day, students must report to the health office or administrative office rather than contacting parents directly, allowing school personnel to assess the situation and coordinate appropriate response measures. This protocol ensures student safety and maintains accurate attendance records throughout the school day.",
        
        "• Extended absences from school for family vacations, recreational travel, or personal reasons during term time are strongly discouraged at Tuludimtu School, as they significantly disrupt the continuity of learning and academic progress. Such absences may be approved only under exceptional circumstances with advanced consultation and formal approval from school administration, typically requiring submission of a formal leave request at least two weeks in advance. Students granted approval for extended absences remain responsible for all missed academic work and must make arrangements with teachers for assignments and assessments before departure. The school does not provide individualized instruction for students missing school for non-essential reasons, and teachers are not obligated to reteach material covered during approved absences. Academic performance may be adversely affected by extended absences, regardless of advance approval or completion of missed assignments."
      ]
    },
    
    discipline: {
      title: "④ Disciplinary Procedures and Consequences",
      content: [
        "• The disciplinary philosophy at Tuludimtu School emphasizes a progressive approach that focuses on corrective measures, personal growth, and the development of responsible decision-making skills. Minor behavioral infractions are typically addressed through a series of escalating interventions beginning with verbal warnings, teacher-student conferences, and reflective assignments designed to help students understand the impact of their actions. Subsequent offenses may result in written warnings, parent notifications, detention, or loss of privileges, depending on the nature and frequency of the behavior. This graduated response system allows students opportunities to modify behavior while understanding that continued misconduct will result in increasingly serious consequences. Documentation of all disciplinary interactions is maintained to ensure consistency, track patterns of behavior, and inform appropriate interventions.",
        
        "✋ Major disciplinary violations at Tuludimtu School, including but not limited to substance abuse, possession of prohibited items, vandalism, theft, physical aggression, severe harassment, academic dishonesty on a significant scale, or repeated serious misconduct, will result in immediate and substantial disciplinary action. Such violations typically warrant suspension from school, either in-school or out-of-school, depending on the severity of the offense and the student's disciplinary history. During suspension periods, students are prohibited from attending classes, participating in school activities, or being present on school property without explicit administrative permission. Suspensions may range from one to ten school days, with longer suspensions or recommendation for expulsion reserved for the most severe offenses or chronic behavioral issues. All suspensions are accompanied by mandatory parent conferences and the development of behavior improvement plans before reinstatement.",
        
        "• All disciplinary actions at Tuludimtu School follow established due process procedures that ensure fairness, transparency, and respect for the rights of all parties involved. When a disciplinary incident occurs, students have the right to be informed of the specific allegations against them, present their perspective on the events in question, and provide any relevant information or evidence. Parents or guardians are notified of significant disciplinary matters in a timely manner and are involved in the resolution process, particularly for serious offenses requiring suspension or other major consequences. Disciplinary decisions are based on thorough investigation of facts, consideration of mitigating circumstances, review of the student's behavioral history, and alignment with established school policies. The severity of consequences corresponds to the seriousness of the infraction, the student's age and maturity level, and the potential impact on the school community.",
        
        "✋ Restorative practices are increasingly incorporated into the disciplinary framework at Tuludimtu School, particularly for offenses involving interpersonal conflict, property damage, or harm to the school community. These practices focus on repairing harm, rebuilding relationships, and reintegrating students into the community rather than solely imposing punitive measures. Restorative responses may include mediated dialogues between affected parties, community service projects, written apologies, restitution for damages, or other constructive actions that help students understand the consequences of their behavior and develop empathy for those affected. Participation in restorative processes may be voluntary or required as part of disciplinary consequences, depending on the nature of the offense and the willingness of all parties to engage meaningfully in the process. Successful completion of restorative requirements may mitigate further disciplinary action.",
        
        "• Appeals of disciplinary decisions at Tuludimtu School may be made in writing to the school administration within three school days of receiving formal notice of the disciplinary action. Appeals must specify the grounds for challenging the decision, such as procedural errors, new evidence, or claims of unfair treatment, and should include any supporting documentation. Appeals will be reviewed by an appropriate committee, typically consisting of administrators not involved in the original decision, teacher representatives, and sometimes parent representatives depending on the severity of the case. The appeals process may include meetings with the student and parents, review of disciplinary records, and consideration of additional information. Final decisions on appeals will be communicated in writing within five school days of receiving the appeal request. While the appeals process provides oversight of disciplinary decisions, the school administration retains ultimate authority in matters of student discipline."
      ]
    },
    
    safety: {
      title: "⑤ Health, Safety, and Security Policies",
      content: [
        "• Compliance with all safety instructions from school staff members is mandatory for every student at Tuludimtu School, as these protocols are designed to protect the wellbeing of the entire school community. This includes immediate adherence to instructions during emergency drills (fire, earthquake, lockdown, etc.), proper use of safety equipment in laboratories and workshops, following established procedures during physical education activities and athletic competitions, and observing all safety guidelines during field trips and extracurricular activities. Failure to follow safety protocols not only endangers the non-compliant student but also risks the safety of classmates, teachers, and staff. Safety violations will result in immediate corrective action, potential removal from the activity, and disciplinary consequences proportional to the severity of the violation and the risk created by the non-compliant behavior.",
        
        "✋ Medication administration at Tuludimtu School follows strict protocols to ensure student safety, proper dosage, and compliance with medical and legal requirements. Students requiring medication during school hours must have completed authorization forms on file with the school health office, signed by both a licensed healthcare provider and a parent or legal guardian. These forms must specify the medication name, dosage, administration time, potential side effects, and special instructions. All medications, whether prescription or over-the-counter, must be stored in the health office in their original labeled containers and administered by authorized school personnel only. Students are prohibited from carrying medications on their person or in their belongings unless explicitly authorized for emergency conditions like asthma or severe allergies, with appropriate documentation on file. Violation of medication policies may result in confiscation of medications, parental notification, and disciplinary action.",
        
        "• Emergency contact information for every student must be current, accurate, and immediately accessible to school personnel in case of illness, injury, or emergency situations. Parents and legal guardians are responsible for notifying the school office immediately of any changes to home addresses, telephone numbers (home, work, and mobile), email addresses, or authorized emergency contacts. At least three emergency contacts should be listed, with at least one contact residing locally and able to respond promptly during school hours. The school must also be informed of any changes to custody arrangements, restraining orders, or other legal matters affecting student safety and parental rights. Failure to maintain current contact information may delay emergency response and medical treatment when necessary, potentially compromising student safety in critical situations.",
        
        "✋ Illness protocols at Tuludimtu School are designed to minimize the spread of communicable diseases and protect the health of students and staff. Students with symptoms of communicable illness, including fever (temperature of 100.4°F/38°C or higher), vomiting, diarrhea, persistent cough, unexplained rash, or other signs of acute illness, must remain at home until they are symptom-free for at least 24 hours without the use of fever-reducing or symptom-masking medications. The school reserves the right to send home students who appear ill during the school day, particularly if they exhibit symptoms that may indicate contagious conditions. For certain diagnosed communicable diseases (such as chickenpox, strep throat, conjunctivitis, etc.), students must provide medical clearance before returning to school, confirming they are no longer contagious. These protocols help maintain a healthy learning environment and reduce unnecessary absences due to preventable illness transmission.",
        
        "• Physical safety measures throughout Tuludimtu School campus are established to prevent accidents, injuries, and hazardous situations. These measures include restrictions on running in hallways, stairwells, and other indoor common areas; proper use of playground equipment, laboratory apparatus, and athletic facilities; adherence to traffic safety rules when arriving or departing from school; and compliance with all posted safety signs and instructions. Students must use designated pedestrian crossings when navigating parking areas, follow instructions from crossing guards and safety patrol members, and observe all traffic regulations when biking or walking to school. During inclement weather, additional safety protocols may be implemented, including indoor recess, modified dismissal procedures, or delayed opening schedules. All students share responsibility for maintaining a safe school environment by following established safety guidelines and reporting potential hazards to school staff immediately."
      ]
    },
    
   technology: {
  title: "⑥ Technology Usage and Digital Citizenship",
  content: [
    "• Authorized use of school technology resources at Tuludimtu School is strictly limited to educational purposes directly related to the curriculum, instructional activities, or approved school projects. This includes school-owned computers, tablets, software applications, online platforms, network infrastructure, internet access, and peripheral equipment. Personal electronic devices, if permitted under specific classroom or program guidelines, may only be used during designated times and for approved educational activities under teacher supervision. Unauthorized activities on school technology resources include but are not limited to gaming, social media browsing, entertainment streaming, personal communications during instructional time, accessing inappropriate content, conducting commercial transactions, or any other non-educational use. Violations of authorized use policies may result in loss of technology privileges, disciplinary action, and in severe cases, legal consequences for misuse of school resources.",
    
    "✋ Personal electronic devices including mobile phones, smartwatches, tablets, laptops, headphones, gaming devices, and any other personal technology are completely prohibited at Tuludimtu School. Students are not permitted to bring any personal electronic devices onto school property at any time, including before school, during school hours, after school, or during extracurricular activities. This policy applies to all areas of the campus including classrooms, hallways, cafeteria, library, sports fields, and parking areas. If a personal device is found on a student or in their possession, it will be immediately confiscated and held securely in the administrative office until the end of the academic year. Parents or guardians will be required to attend a meeting with school administration to retrieve the device, and repeated violations will result in disciplinary action up to and including suspension.",
    
    "✋ For emergency communication needs, students must use designated school phones located in the administrative office, counseling department, and other approved locations. Parents needing to contact students during school hours should call the main office, and messages will be promptly delivered to students. In case of genuine emergencies requiring device use, special permission must be obtained in writing from school administration at least 24 hours in advance, with documented justification. Medical devices necessary for health monitoring are exempt from this policy but must be registered with the school nurse and approved by administration with proper medical documentation. The school accepts no responsibility for personal devices brought to school in violation of this policy, and any loss, theft, or damage is solely the responsibility of the student and their family.",
    
    "• Digital citizenship at Tuludimtu School requires respectful, ethical, and responsible behavior in all online interactions, whether using school technology resources or personal devices on school property. This includes refraining from cyberbullying, online harassment, hate speech, threats, or any communication that harms, humiliates, or intimidates others. Students must respect intellectual property rights, properly attributing digital content and avoiding plagiarism or unauthorized distribution of copyrighted materials. Inappropriate content sharing, including sexually explicit material, violent imagery, or other age-inappropriate digital content, is strictly prohibited. Digital communications should reflect the same standards of courtesy, honesty, and respect expected in face-to-face interactions. Violations of digital citizenship expectations may result in loss of technology privileges, disciplinary consequences, and in cases involving illegal activity, referral to appropriate authorities.",
    
    "✋ Care and responsibility for school-owned technology equipment issued to students is an essential expectation at Tuludimtu School. Students are responsible for the proper handling, security, and maintenance of devices assigned to them, including laptops, tablets, calculators, or other technological tools. This includes using protective cases when provided, avoiding exposure to extreme temperatures or moisture, preventing physical damage from dropping or impact, and keeping devices clean and functional. Devices must be stored securely when not in use, never left unattended in unsecured locations, and transported safely between school and home. Damage to school technology equipment due to negligence, intentional misuse, or failure to follow care instructions will result in repair or replacement costs charged to the student's family. Loss or theft of school devices must be reported immediately to school administration and local authorities if warranted.",
    
    "• Privacy protections extend to all members of the Tuludimtu School community, requiring respect for personal information, confidential data, and reasonable expectations of privacy. Unauthorized recording, photographing, or audio/video capture of students, teachers, or staff without explicit consent is strictly prohibited, except for approved educational projects with prior authorization. Sharing images, videos, or personal information about others without permission violates both school policy and potentially applicable privacy laws. Students must respect the privacy settings and preferences of classmates in online environments, refraining from screenshotting private conversations, forwarding personal communications without consent, or otherwise compromising digital privacy. The school maintains the right to monitor technology use on school networks and devices to ensure compliance with policies, protect safety, and maintain the educational environment, with appropriate notice provided regarding such monitoring practices."
  ]
}}

  return (
   <>
   <Helmet>
         <title>School Policy</title>
           </Helmet>
   
    <div className="p-4 md:p-8 bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
     
      <div className="fixed top-2 left-2 right-2 z-10 md:top-4 md:left-4 md:right-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center justify-center space-x-2 w-full md:w-auto px-3 py-2 md:px-4 md:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md text-sm md:text-base"
        >
          <Home className="w-4 h-4 md:w-5 md:h-5" />
          <span className="truncate">Back to Home Page</span>
        </button>
      </div>

     
      <div className="flex justify-center mb-4 md:mb-6 mt-14 md:mt-0">
        <div className="bg-blue-100 rounded-2xl max-w-[300px] md:max-w-none">
          <img src={logo} alt='Tuludimtu School Logo' className='w-full h-auto'/>
        </div>
      </div>

      {/* Main Title - Mobile Responsive */}
      <h1 className="text-2xl md:text-4xl font-bold mb-4 md:mb-8 text-center mt-4 md:m-24 font-serif text-blue-900 px-2">
        Tuludimtu School Rules and Policies
      </h1>
      
      {/* Welcome Section - Mobile Responsive */}
      <div className="mb-6 md:mb-12 bg-white/70 p-4 md:p-8 rounded-2xl shadow-lg backdrop-blur-sm">
        <p className="text-base md:text-lg mb-4 md:mb-6 font-sans text-gray-700">
          Welcome to Tuludimtu School's comprehensive policy document. This document outlines the rules, expectations, and procedures that govern our school community. All students, parents, and staff are expected to be familiar with and adhere to these policies to maintain a safe, respectful, and productive learning environment.
        </p>
        <p className="text-base md:text-lg font-sans text-gray-700">
          The policies contained herein are designed to support the educational mission of Tuludimtu School while ensuring the safety, dignity, and rights of all members of our community. By enrolling at Tuludimtu School, students and their families agree to abide by these rules and regulations.
        </p>
      </div>

      {/* Policy Sections - Mobile Responsive Layout */}
      <div className="flex flex-col md:flex-row mb-8">
        {/* Sidebar Navigation - Mobile Stacked on top */}
        <div className="w-full md:w-1/4 md:pr-8 mb-4 md:mb-0">
          <div className="sticky top-20 md:top-8 bg-white/80 p-4 md:p-6 rounded-2xl shadow-lg backdrop-blur-sm">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 font-serif text-blue-800">Policy Sections</h2>
            <nav className="space-y-2">
              {Object.keys(policies).map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`block w-full text-left py-3 px-4 rounded-lg transition-all duration-300 font-medium text-sm md:text-base ${activeSection === section ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500' : 'hover:bg-blue-50 text-gray-700 hover:border-l-4 hover:border-blue-300'}`}
                >
                  {policies[section].title}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Section - Full width on mobile */}
        <div className="w-full md:w-3/4">
          <div className="mb-6 md:mb-10 bg-white/80 p-4 md:p-8 rounded-2xl shadow-lg backdrop-blur-sm">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 font-serif text-blue-900">
              {policies[activeSection].title}
            </h2>
            
            {policies[activeSection].content.map((paragraph, index) => (
              <div key={index} className="mb-4 md:mb-8 pl-3 md:pl-4 border-l-2 border-blue-200">
                <p className="text-sm md:text-lg leading-relaxed font-sans text-gray-800">
                  {paragraph}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Policy Acknowledgment - Mobile Responsive */}
      <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-blue-200 bg-white/70 p-4 md:p-8 rounded-2xl shadow-lg backdrop-blur-sm">
        <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 font-serif text-blue-900">
          Policy Acknowledgment
        </h3>
        <p className="text-base md:text-lg mb-4 md:mb-6 font-sans text-gray-700">
          This comprehensive policy document represents the official rules and expectations for all students enrolled at Tuludimtu School. By enrolling in the school, students and their parents/guardians acknowledge receipt, understanding, and agreement to comply with all policies contained herein.
        </p>
        <p className="text-base md:text-lg font-sans text-gray-700">
          The school administration reserves the right to amend, supplement, or revise these policies as necessary to address changing circumstances, ensure safety and order, and fulfill the educational mission of Tuludimtu School. All policy changes will be communicated to the school community through appropriate channels with reasonable advance notice when possible. Students and parents with questions about any policy should contact the school administration for clarification before assuming non-compliance.
        </p>
      </div>
    </div>
   
   </>
  );
};

export default TuludimtuSchoolPolicy;