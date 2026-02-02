// import { useState, useEffect, useMemo } from 'react';
// import axios from 'axios';
// import studentLifeHero from '../assets/por.jpg';
// import Footer from './Footer';

// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// const StudentSeeProfile = () => {
//   const [admissions, setAdmissions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedAdmission, setSelectedAdmission] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedGrade, setSelectedGrade] = useState('all'); // 'all', '9', '10', '11', '12'

//   useEffect(() => {
//     fetchAdmissions();
//   }, []);

//   const fetchAdmissions = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const response = await axios.get(`${API_URL}/api/admissions`, {
//         timeout: 10000
//       });
      
//       if (response.data.success) {
//         const admissionsData = response.data.data || [];
//         setAdmissions(admissionsData);
//       } else {
//         setError('Failed to fetch admissions');
//       }
//     } catch (error) {
//       console.error('Fetch error:', error);
//       setError(`Failed to connect to server. Please check if backend is running at ${API_URL}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteAdmission = async (id) => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this admission application?"
//     );

//     if (!confirmDelete) return;

//     try {
//       const response = await axios.delete(`${API_URL}/api/admissions/${id}`);

//       if (response.data.success) {
//         setAdmissions(prevAdmissions => 
//           prevAdmissions.filter(admission => admission._id !== id)
//         );

//         if (selectedAdmission && selectedAdmission._id === id) {
//           setSelectedAdmission(null);
//         }

//         alert('Admission deleted successfully!');
//       } else {
//         alert('Failed to delete admission');
//       }
//     } catch (error) {
//       console.error("Delete error:", error);
//       alert("Failed to delete admission. Please check connection.");
//     }
//   };

//   const getFileUrl = (filePath) => {
//     if (!filePath) return null;
    
//     // If it's already a full URL
//     if (filePath.startsWith('http')) {
//       return filePath;
//     }
    
//     // If it's a relative path starting with /
//     if (filePath.startsWith('/')) {
//       return `${API_URL}${filePath}`;
//     }
    
//     // If it's just a filename
//     return `${API_URL}/uploads/${filePath}`;
//   };

//   // Get student photo URL
//   const getStudentPhotoUrl = (admission) => {
//     if (!admission) return null;
    
//     // Check if photo object exists with secure_url
//     if (admission.photo?.secure_url) {
//       return admission.photo.secure_url;
//     }
    
//     // Check if photo object has url
//     if (admission.photo?.url) {
//       return admission.photo.url;
//     }
    
//     // Check if there's a photo field directly
//     if (admission.photo && typeof admission.photo === 'string') {
//       return getFileUrl(admission.photo);
//     }
    
//     // Check for studentPhoto field
//     if (admission.studentPhoto) {
//       return getFileUrl(admission.studentPhoto);
//     }
    
//     // Return null if no photo
//     return null;
//   };

//   // Get initials for avatar
//   const getInitials = (firstName, lastName) => {
//     const firstInitial = firstName?.[0]?.toUpperCase() || '?';
//     const lastInitial = lastName?.[0]?.toUpperCase() || '?';
//     return firstInitial + lastInitial;
//   };

//   // Function to check if a grade matches the selected grade
//   const gradeMatches = (grade, selectedGradeValue) => {
//     if (!grade) return false;
    
//     const gradeStr = grade.toString().toLowerCase();
//     const selectedGradeStr = selectedGradeValue.toString();
    
//     // Check for various ways grade 9 might be represented
//     if (selectedGradeValue === '9') {
//       return gradeStr.includes('9') || gradeStr.includes('nine') || gradeStr.includes('grade 9') || gradeStr.includes('9th');
//     }
    
//     // Check for various ways grade 10 might be represented
//     if (selectedGradeValue === '10') {
//       return gradeStr.includes('10') || gradeStr.includes('ten') || gradeStr.includes('grade 10') || gradeStr.includes('10th');
//     }
    
//     // Check for various ways grade 11 might be represented
//     if (selectedGradeValue === '11') {
//       return gradeStr.includes('11') || gradeStr.includes('eleven') || gradeStr.includes('grade 11') || gradeStr.includes('11th');
//     }
    
//     // Check for various ways grade 12 might be represented
//     if (selectedGradeValue === '12') {
//       return gradeStr.includes('12') || gradeStr.includes('twelve') || gradeStr.includes('grade 12') || gradeStr.includes('12th');
//     }
    
//     return false;
//   };

//   // Filter admissions based on search term and selected grade
//   const filteredAdmissions = useMemo(() => {
//     let result = admissions.filter(admission => {
//       // First filter by selected grade
//       if (selectedGrade !== 'all') {
//         if (!gradeMatches(admission.applyingGrade, selectedGrade)) {
//           return false;
//         }
//       }
      
//       // Then filter by search term
//       if (searchTerm.trim()) {
//         const searchLower = searchTerm.toLowerCase().trim();
//         const fullName = `${admission.firstName || ''} ${admission.lastName || ''}`.toLowerCase();
//         const parentPhone = admission.parentPhone || '';
//         const parentEmail = admission.parentEmail?.toLowerCase() || '';
//         const studentId = admission.studentId?.toLowerCase() || '';
//         const admissionId = admission.admissionId?.toLowerCase() || '';
        
//         return (
//           fullName.includes(searchLower) ||
//           parentPhone.includes(searchTerm) ||
//           parentEmail.includes(searchLower) ||
//           studentId.includes(searchLower) ||
//           admissionId.includes(searchLower)
//         );
//       }
      
//       return true;
//     });

//     return result;
//   }, [admissions, searchTerm, selectedGrade]);

//   // Count students in each grade
//   const gradeCounts = useMemo(() => {
//     const counts = {
//       '9': 0,
//       '10': 0,
//       '11': 0,
//       '12': 0,
//       'other': 0
//     };
    
//     admissions.forEach(admission => {
//       const grade = admission.applyingGrade;
//       if (gradeMatches(grade, '9')) {
//         counts['9']++;
//       } else if (gradeMatches(grade, '10')) {
//         counts['10']++;
//       } else if (gradeMatches(grade, '11')) {
//         counts['11']++;
//       } else if (gradeMatches(grade, '12')) {
//         counts['12']++;
//       } else {
//         counts['other']++;
//       }
//     });
    
//     return counts;
//   }, [admissions]);

//   if (loading && admissions.length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
//           <p className="mt-6 text-lg font-medium text-gray-700">Loading Students Data...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//    <>
     
//        <div
//                   initial="hidden"
//                   animate="visible"
                 
//                   className="relative h-[90vh] bg-fixed w-full bg-cover bg-center"
//                   style={{ backgroundImage: `url(${studentLifeHero})`,}}
//                 >
//                   <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/40 to-transparent" />
//                   <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
//                     <div 
                      
//                       className="text-center text-white px-4"
//                     >
//                    <div className=" mb-6 md:mb-0 mt-16 ">
//            <h1 className="text-3xl md:text-5xl font-bold mb-2 text-center">
//              Student List <span className="text-yellow-400">Portal</span>
//            </h1>   
       
//            <p className="text-xl text-center"></p>
//          </div> 
//                     </div>
//                   </div>
//                 </div>

//     <div className="min-h-screen bg-gray-50 p-4 md:p-6">
//       <div className="max-w-7xl mx-auto">
       

//         <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">
//                 Student Management System
//               </h1>
//               <p className="text-gray-600 mt-2">View and manage student information</p>
//             </div>
//             <div className="mt-4 md:mt-0">
//               <button
//                 onClick={fetchAdmissions}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
//               >
//                 <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                 </svg>
//                 Refresh Data
//               </button>
//             </div>
//           </div>
          
        
//           <div className="mt-6 flex flex-col md:flex-row gap-4">
            
//             <div className="relative flex-1 max-w-md">
//               <input
//                 type="text"
//                 placeholder="Search students by name, phone, email, ID..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//               <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//               </svg>
//             </div>

          
//             <div className="flex flex-col md:flex-row gap-3">
//               <div className="relative">
//                 <select
//                   value={selectedGrade}
//                   onChange={(e) => setSelectedGrade(e.target.value)}
//                   className="appearance-none pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer w-full md:w-64"
//                 >
//                   <option value="all">All Students</option>
//                   <option value="9">Grade 9 </option>
//                   <option value="10">Grade 10 </option>
//                   <option value="11">Grade 11 </option>
//                   <option value="12">Grade 12 </option>
//                 </select>
//                 <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
//                   <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                   </svg>
//                 </div>
//               </div>

//               {/* Clear Filter Button */}
//               {selectedGrade !== 'all' && (
//                 <button
//                   onClick={() => setSelectedGrade('all')}
//                   className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
//                 >
//                   <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                   Clear Filter
//                 </button>
//               )}
//             </div>
//           </div>
          
       
          
//           {error && (
//             <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
//               <div className="flex items-center">
//                 <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                 </svg>
//                 <span className="text-red-700">{error}</span>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Students Table */}
//         <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-200">
//             <div className="flex justify-between items-center">
//               <div>
//                 <h2 className="text-xl font-bold text-gray-900">Students List</h2>
                
//               </div>
             
//             </div>
//           </div>
          
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Student Photo
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Full Name
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Phone Number
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Email Address
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Student ID
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Applying Grade
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Previous Grade
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredAdmissions.map((admission) => {
//                   const studentPhotoUrl = getStudentPhotoUrl(admission);
//                   const isGrade9 = gradeMatches(admission.applyingGrade, '9');
//                   const isGrade10 = gradeMatches(admission.applyingGrade, '10');
//                   const isGrade11 = gradeMatches(admission.applyingGrade, '11');
//                   const isGrade12 = gradeMatches(admission.applyingGrade, '12');
                  
//                   return (
//                     <tr key={admission._id} className="hover:bg-gray-50 transition-colors">
//                       {/* Student Photo */}
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="h-12 w-12 flex-shrink-0">
//                             {studentPhotoUrl ? (
//                               <img
//                                 src={studentPhotoUrl}
//                                 alt={`${admission.firstName} ${admission.lastName}`}
//                                 className="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
//                                 onError={(e) => {
//                                   e.target.onerror = null;
//                                   e.target.style.display = 'none';
//                                   e.target.parentElement.innerHTML = `
//                                     <div class="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
//                                       ${getInitials(admission.firstName, admission.lastName)}
//                                     </div>
//                                   `;
//                                 }}
//                               />
//                             ) : (
//                               <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
//                                 {getInitials(admission.firstName, admission.lastName)}
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       </td>
                      
//                       {/* Full Name */}
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-medium text-gray-900">
//                           {admission.firstName} {admission.lastName}
//                         </div>
//                         <div className="text-xs text-gray-500 mt-1">
//                           Gender: {admission.gender || 'N/A'}
//                         </div>
//                       </td>
                      
                
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">
//                           {admission.parentPhone || 'N/A'}
//                         </div>
//                       </td>
                      
                   
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">
//                           {admission.parentEmail || 'N/A'}
//                         </div>
//                       </td>
                      
                    
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-medium text-gray-900">
//                           {admission.studentId || admission.admissionId || 'N/A'}
//                         </div>
//                       </td>
                      
                     
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className={`text-sm font-medium ${
//                             isGrade9 ? 'text-blue-600' :
//                             isGrade10 ? 'text-green-600' :
//                             isGrade11 ? 'text-purple-600' :
//                             isGrade12 ? 'text-orange-600' :
//                             'text-gray-900'
//                           }`}>
//                             {admission.applyingGrade || 'N/A'}
//                           </div>
//                           {isGrade9 && (
//                             <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
//                               Grade 9
//                             </span>
//                           )}
//                           {isGrade10 && (
//                             <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
//                               Grade 10
//                             </span>
//                           )}
//                           {isGrade11 && (
//                             <span className="ml-2 px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
//                               Grade 11
//                             </span>
//                           )}
//                           {isGrade12 && (
//                             <span className="ml-2 px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
//                               Grade 12
//                             </span>
//                           )}
//                         </div>
//                       </td>
                      
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">
//                           {admission.lastGrade || 'N/A'}
//                         </div>
//                       </td>
                      
           
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <div className="flex space-x-2">
//                           <button
//                             onClick={() => setSelectedAdmission(admission)}
//                             className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-sm"
//                           >
//                             View Details
//                           </button>

//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
          
//           {filteredAdmissions.length === 0 && !loading && (
//             <div className="text-center py-12">
//               <div className="text-gray-400 text-lg">
//                 {selectedGrade === 'all' 
//                   ? 'No students found' 
//                   : `No students found in Grade ${selectedGrade}`}
//               </div>
//               <p className="text-gray-500 mt-2">
//                 {selectedGrade !== 'all' && searchTerm === '' && (
//                   <button
//                     onClick={() => setSelectedGrade('all')}
//                     className="text-blue-600 hover:text-blue-800 font-medium"
//                   >
//                     View all students instead
//                   </button>
//                 )}
//               </p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Student Detail Modal */}
//       {selectedAdmission && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl">
//             {/* Modal Header */}
//             <div className="px-12 py-12 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-xl mt-32">
//               <div className="flex justify-between items-center">
//                 <div className="flex items-center">
//                   <div className="mr-4">
//                     {getStudentPhotoUrl(selectedAdmission) ? (
//                       <img
//                         src={getStudentPhotoUrl(selectedAdmission)}
//                         alt={`${selectedAdmission.firstName} ${selectedAdmission.lastName}`}
//                         className="h-16 w-16 rounded-full object-cover border-4 border-white"
//                         onError={(e) => {
//                           e.target.onerror = null;
//                           e.target.style.display = 'none';
//                           e.target.parentElement.innerHTML = `
//                             <div class="h-16 w-16 bg-gradient-to-br from-white to-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl border-4 border-white">
//                               ${getInitials(selectedAdmission.firstName, selectedAdmission.lastName)}
//                             </div>
//                           `;
//                         }}
//                       />
//                     ) : (
//                       <div className="h-16 w-16 bg-gradient-to-br from-white to-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl border-4 border-white">
//                         {getInitials(selectedAdmission.firstName, selectedAdmission.lastName)}
//                       </div>
//                     )}
//                   </div>
//                   <div>
//                     <h3 className="text-2xl font-bold">
//                       {selectedAdmission.firstName} {selectedAdmission.lastName}
//                     </h3>
//                     <p className="text-blue-100 mt-1">
//                       Student ID: {selectedAdmission.studentId || selectedAdmission.admissionId || 'N/A'}
//                     </p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setSelectedAdmission(null)}
//                   className="text-white hover:text-gray-200 text-2xl"
//                 >
//                   ✕
//                 </button>
//               </div>
//             </div>

//             <div className="p-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           
                
//                 <div>
                  
//                   <div className="mb-6">
//                          <div className="mt-8 mb-6 pt-6 border-b border-gray-200">

//                 <div className="flex justify-center">
//                   {getStudentPhotoUrl(selectedAdmission) ? (
//                     <div className="relative">
//                       <img
//                         src={getStudentPhotoUrl(selectedAdmission)}
//                         alt={`${selectedAdmission.firstName} ${selectedAdmission.lastName}`}
//                         className="h-48 w-48 rounded-lg object-cover border-4 border-gray-200 shadow-lg"
//                         onError={(e) => {
//                           e.target.onerror = null;
//                           e.target.style.display = 'none';
//                           e.target.parentElement.innerHTML = `
//                             <div class="h-48 w-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center text-blue-600 border-4 border-gray-200">
//                               <div class="text-center">
//                                 <div class="text-4xl font-bold mb-2">${getInitials(selectedAdmission.firstName, selectedAdmission.lastName)}</div>
//                                 <div class="text-sm text-blue-500">No Photo Available</div>
//                               </div>
//                             </div>
//                           `;
//                         }}
//                       />
//                     </div>
//                   ) : (
//                     <div className="h-48 w-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center text-blue-600 border-4 border-gray-200">
//                       <div className="text-center">
//                         <div className="text-4xl font-bold mb-2">
//                           {getInitials(selectedAdmission.firstName, selectedAdmission.lastName)}
//                         </div>
//                         <div className="text-sm text-blue-500">No Photo Available</div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//                     <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
//                       Personal Information
//                     </h4>
//                     <div className="space-y-3">
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Full Name:</span>
//                         <span className="font-medium text-gray-900">
//                           {selectedAdmission.firstName} {selectedAdmission.lastName} 
//                         </span>
//                       </div>
  
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Gender:</span>
//                         <span className="font-medium text-gray-900">
//                           {selectedAdmission.gender || 'N/A'}
//                         </span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Media Of Instruction:</span>
//                         <span className="font-medium text-gray-900">
//                           {selectedAdmission.nationality || 'N/A'}
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   <div>
//                     <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
//                       Contact Information
//                     </h4>
//                     <div className="space-y-3">
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Phone:</span>
//                         <span className="font-medium text-gray-900">
//                           {selectedAdmission.parentPhone || 'N/A'}
//                         </span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Email:</span>
//                         <span className="font-medium text-gray-900 break-all">
//                           {selectedAdmission.parentEmail || 'N/A'}
//                         </span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Parent Name:</span>
//                         <span className="font-medium text-gray-900">
//                           {selectedAdmission.parentName || 'N/A'}
//                         </span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Relationship:</span>
//                         <span className="font-medium text-gray-900">
//                           {selectedAdmission.relationship || 'N/A'}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

             
//                 <div>
//                   <div className="mt-6 md:mt-72">
//                     <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
//                       Academic Information
//                     </h4>
//                     <div className="space-y-3">
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Applying Grade:</span>
//                         <span className="font-medium text-gray-900">
//                           {selectedAdmission.applyingGrade || 'N/A'}
//                           {gradeMatches(selectedAdmission.applyingGrade, '9') && (
//                             <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">Grade 9</span>
//                           )}
//                           {gradeMatches(selectedAdmission.applyingGrade, '10') && (
//                             <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-1 rounded">Grade 10</span>
//                           )}
//                           {gradeMatches(selectedAdmission.applyingGrade, '11') && (
//                             <span className="ml-2 text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">Grade 11</span>
//                           )}
//                           {gradeMatches(selectedAdmission.applyingGrade, '12') && (
//                             <span className="ml-2 text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded">Grade 12</span>
//                           )}
//                         </span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Previous Grade:</span>
//                         <span className="font-medium text-gray-900">
//                           {selectedAdmission.lastGrade || 'N/A'}
//                         </span>
//                       </div>
   
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Previous School:</span>
//                         <span className="font-medium text-gray-900">
//                           {selectedAdmission.lastSchool || 'N/A'}
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   <div>
//                     <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
//                       Additional Information
//                     </h4>
//                     <div className="space-y-3">
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Religion:</span>
//                         <span className="font-medium text-gray-900">
//                           {selectedAdmission.religion || 'Not specified'}
//                         </span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Address:</span>
//                         <span className="font-medium text-gray-900">
//                           {selectedAdmission.address || 'N/A'}
//                         </span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Applied Date:</span>
//                         <span className="font-medium text-gray-900">
//                           {selectedAdmission.createdAt ? new Date(selectedAdmission.createdAt).toLocaleDateString() : 'N/A'}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>


//             </div>

//             {/* Modal Footer */}
//             <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
//               <div className="flex justify-between items-center">
//                 <div className="text-sm text-gray-500">
//                   Student ID: {selectedAdmission.studentId || selectedAdmission.admissionId || 'N/A'}
//                 </div>
//                 <div className="flex space-x-3">
//                   {/* <button
//                     onClick={() => {
//                       // You can add print functionality here
//                       window.print();
//                     }}
//                     className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                   >
//                     Print Details
//                   </button> */}
//                   <button
//                     onClick={() => setSelectedAdmission(null)}
//                     className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//                   >
//                     Close
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
   

//    <Footer />
//    </>
//   );
// };

// export default StudentSeeProfile;





import { useState, useCallback } from 'react';
import axios from 'axios';
import studentLifeHero from '../assets/por.jpg';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const StudentSeeProfile = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [searchPerformed, setSearchPerformed] = useState(false);
  const navigate = useNavigate();

  // Search function that fetches from API
  const searchStudents = useCallback(async () => {
    if (!searchTerm.trim() && selectedGrade === 'all') {
      // If no search term and all grades selected, clear results
      setAdmissions([]);
      setSearchPerformed(false);
      return;
    }

    try {
      setSearchLoading(true);
      setError(null);
      
      // Build query parameters
      const params = {};
      
      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }
      
      if (selectedGrade !== 'all') {
        params.grade = selectedGrade;
      }

      const response = await axios.get(`${API_URL}/api/admissions/search`, {
        params,
        timeout: 10000
      });
      
      if (response.data.success) {
        const admissionsData = response.data.data || [];
        setAdmissions(admissionsData);
        setSearchPerformed(true);
      } else {
        setError('Failed to search students');
        setAdmissions([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setError(`Failed to search: ${error.message}`);
      setAdmissions([]);
    } finally {
      setSearchLoading(false);
    }
  }, [searchTerm, selectedGrade]);

  // Fetch specific student by ID for details view
  const fetchStudentById = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/admissions/${id}`, {
        timeout: 10000
      });
      
      if (response.data.success) {
        setSelectedAdmission(response.data.data);
      } else {
        setError('Failed to fetch student details');
      }
    } catch (error) {
      console.error('Fetch student error:', error);
      setError(`Failed to fetch student: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchStudents();
  };

  // Clear search results
  const handleClearSearch = () => {
    setSearchTerm('');
    setSelectedGrade('all');
    setAdmissions([]);
    setSearchPerformed(false);
    setError(null);
  };

  // View student details
  const handleViewDetails = async (admission) => {
   
    await fetchStudentById(admission._id);
  };

  const getFileUrl = (filePath) => {
    if (!filePath) return null;
    
    if (filePath.startsWith('http')) {
      return filePath;
    }
    
    if (filePath.startsWith('/')) {
      return `${API_URL}${filePath}`;
    }
    
    return `${API_URL}/uploads/${filePath}`;
  };

  const getStudentPhotoUrl = (admission) => {
    if (!admission) return null;
    
    if (admission.photo?.secure_url) {
      return admission.photo.secure_url;
    }
    
    if (admission.photo?.url) {
      return admission.photo.url;
    }
    
    if (admission.photo && typeof admission.photo === 'string') {
      return getFileUrl(admission.photo);
    }
    
    if (admission.studentPhoto) {
      return getFileUrl(admission.studentPhoto);
    }
    
    return null;
  };

  const getInitials = (firstName, lastName) => {
    const firstInitial = firstName?.[0]?.toUpperCase() || '?';
    const lastInitial = lastName?.[0]?.toUpperCase() || '?';
    return firstInitial + lastInitial;
  };

  return (
    <>
  
      <Helmet>
        <title>Student List</title>
      </Helmet>

       <div className="fixed left-2 sm:left-4 top-2 sm:top-4 z-20">
                          <button
                            onClick={() => navigate('/admission-Page')}
                            className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                            aria-label="Go back"
                          >
                            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
                          </button>
                        </div> 

      <div
        className="relative h-[90vh] bg-fixed w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${studentLifeHero})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/40 to-transparent" />
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <div className="mb-6 md:mb-0 mt-16">
              <h1 className="text-3xl md:text-5xl font-bold mb-2 text-center">
                Student List <span className="text-yellow-400">Portal</span>
              </h1>
              <p className="text-xl text-center">Search for specific students</p>
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Student Search System
                </h1>
                <p className="text-gray-600 mt-2">
                  Search for students by name, ID, or grade
                </p>
              </div>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearchSubmit} className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-5">
                  <input
                    type="text"
                    placeholder="Search by name, student ID, parent phone, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={searchLoading}
                  />
                </div>

                <div className="md:col-span-3">
                  <select
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer"
                    disabled={searchLoading}
                  >
                    <option value="all">All Grades</option>
                    <option value="9">Grade 9</option>
                    <option value="10">Grade 10</option>
                    <option value="11">Grade 11</option>
                    <option value="12">Grade 12</option>
                  </select>
                </div>

                <div className="md:col-span-4 flex gap-3">
                  <button
                    type="submit"
                    disabled={searchLoading || (!searchTerm.trim() && selectedGrade === 'all')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {searchLoading ? (
                      <span className="flex items-center justify-center">
                        <span className="mr-2">Searching...</span>
                        <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      </span>
                    ) : (
                      'Search Students'
                    )}
                  </button>

                  {(searchPerformed || admissions.length > 0) && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </form>

            {/* Search Instructions */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Search Instructions</h3>
              <p className="text-blue-700 text-sm">
                Enter student name, ID, phone number, or email address. You can also filter by grade.
                Results will only show matching with student profile.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg">
                <p className="text-red-700">{error}</p>
              </div>
            )}
          </div>

          {/* Results Section */}
          {searchPerformed && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Search Results</h2>
                    <p className="text-gray-600 mt-1">
                      Found {admissions.length} student{admissions.length !== 1 ? 's' : ''}
                      {selectedGrade !== 'all' && ` in Grade ${selectedGrade}`}
                    </p>
                  </div>
                </div>
              </div>

              {searchLoading ? (
                <div className="py-16 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
                  <p className="mt-4 text-gray-600">Searching for students...</p>
                </div>
              ) : admissions.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="text-4xl text-gray-300 mb-4">🔍</div>
                  <h3 className="text-lg font-medium text-gray-900">No students found</h3>
                  <p className="mt-2 text-gray-500 max-w-md mx-auto">
                    No students match your search criteria. Try a different search term or grade filter.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-12 py-6 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Student Name
                        </th>
                        <th scope="col" className="px-12 py-6 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Contact Info
                        </th>
                        <th scope="col" className="px-12 py-6 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Academic Info
                        </th>
                        <th scope="col" className="px-12 py-6 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Parent Info
                        </th>
                        <th scope="col" className="px-12 py-6 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {admissions.map((admission) => {
                        const studentPhotoUrl = getStudentPhotoUrl(admission);
                        return (
                          <tr key={admission._id} className="hover:bg-gray-50 transition-colors">
                            {/* Student Info */}
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className="h-12 w-12 flex-shrink-0 mr-3">
                                  {studentPhotoUrl ? (
                                    <img
                                      src={studentPhotoUrl}
                                      alt={`${admission.firstName} ${admission.lastName}`}
                                      className="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.style.display = 'none';
                                        e.target.parentElement.innerHTML = `
                                          <div class="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                            ${getInitials(admission.firstName, admission.lastName)}
                                          </div>
                                        `;
                                      }}
                                    />
                                  ) : (
                                    <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                      {getInitials(admission.firstName, admission.lastName)}
                                    </div> 
                                  )}  
                                </div>  
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {admission.firstName} {admission.lastName} 
                                  </div> 
                                  <div className="text-xs text-gray-500">
                                    ID: {admission.studentId || admission.admissionId || 'N/A'}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Gender: {admission.gender || 'N/A'}
                                  </div>
                                </div>
                              </div>
                            </td>
                            
                            {/* Contact Info */}
                            <td className="px-12 py-4">
                              <div className="text-sm">
                                <div className="text-gray-900 font-medium">{admission.parentPhone || 'N/A'}</div>
                                <div className="text-gray-500 truncate max-w-xs">{admission.parentEmail || 'N/A'}</div>
                              </div>
                            </td>
                            
                            {/* Academic Info */}
                            <td className="px-12 py-4">
                              <div className="text-sm">
                                <div className="text-gray-900 font-medium">{admission.applyingGrade || 'N/A'}</div>
                                <div className="text-gray-500">{admission.lastGrade || 'Previous: N/A'}</div>
                              </div>
                            </td>
                            
                            {/* Parent Info */}
                            <td className="px-12 py-4">
                              <div className="text-sm">
                                <div className="text-gray-900 font-medium">{admission.parentName || 'N/A'}</div>
                                <div className="text-gray-500">{admission.relationship || 'N/A'}</div>
                              </div>
                            </td>
                            
                            {/* Actions */}
                            
            
                            <td className="px-12 py-4">
                              <button
                                onClick={() => handleViewDetails(admission)}
                                className="px-12 py-2  bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                View 
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Show search prompt if no search performed */}
          {!searchPerformed && admissions.length === 0 && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="text-6xl text-gray-300 mb-6">🔍</div>
                  <h3 className="text-xl font-medium text-gray-900 mb-4">Search for Students</h3>
                  <p className="text-gray-500 mb-8">
                    Enter search criteria above to find specific students. You can search by name, student ID, parent contact information, or filter by grade.
                  </p>
                  
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Student Detail Modal - ULTRA RESPONSIVE FOR MOBILE */}
        {selectedAdmission && (
          <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="min-h-full flex items-start md:items-center justify-center p-2 md:p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl my-2 md:my-8">
                {/* Modal Header - ULTRA RESPONSIVE */}
                
                <div className="px-3 md:px-8 py-3 md:py-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-xl">
                  <div className="flex justify-between items-start">
                    
                    <div className="flex items-start">
                      
                      <div className="mr-3 md:mr-4 flex-shrink-0">
                        {getStudentPhotoUrl(selectedAdmission) ? (
                          <img
                            src={getStudentPhotoUrl(selectedAdmission)}
                            alt={`${selectedAdmission.firstName} ${selectedAdmission.lastName}`}
                            className="h-10 w-10 md:h-16 md:w-16 rounded-full object-cover border-2 md:border-4 border-white"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = `
                                <div class="h-10 w-10 md:h-16 md:w-16 bg-gradient-to-br from-white to-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-base md:text-2xl border-2 md:border-4 border-white">
                                  ${getInitials(selectedAdmission.firstName, selectedAdmission.lastName)}
                                </div>
                              `;
                            }}
                          />
                        ) : (
                          <div className="h-10 w-10 md:h-16 md:w-16 bg-gradient-to-br from-white to-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-base md:text-2xl border-2 md:border-4 border-white">
                            {getInitials(selectedAdmission.firstName, selectedAdmission.lastName)}
                          </div>
                        )}
                      </div>
                      <div className="max-w-[calc(100%-60px)] md:max-w-none">
                        <h3 className="text-base md:text-2xl font-bold leading-tight">
                          {selectedAdmission.firstName} {selectedAdmission.lastName}
                        </h3>
                        <p className="text-blue-100 mt-1 text-xs md:text-base truncate">
                          ID: {selectedAdmission.studentId || selectedAdmission.admissionId || 'N/A'}
                        </p>
                      </div>
                    </div>
      

<span
  className={` px-4 py-2 md:py-4 md:px-12 text-xl font-semibold rounded-2xl
  shadow-md transition-all duration-300 hover:scale-105
  ${
    selectedAdmission.status === 'accepted'
      ? 'bg-gradient-to-r from-green-500 to-green-900 text-white shadow-green-400/40 '
      : selectedAdmission.status === 'pending'
      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-yellow-400/40 animate-pulse'
      : selectedAdmission.status === 'rejected'
      ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-red-400/40'
      : 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800'
  }`}
>
  {selectedAdmission.status || 'Pending'}
</span>

                    <button
                      onClick={() => setSelectedAdmission(null)}
                      className="text-white hover:text-gray-200 text-xl md:text-3xl font-light ml-2"
                    >
                      ×
                    </button>
                  </div>
                </div>

                <div className="p-3 md:p-8 max-h-[80vh] md:max-h-[70vh] overflow-y-auto">
                  {/* Student Photo Section - BETTER MOBILE */}
                  <div className="flex justify-center mb-4 md:mb-8">
                    {getStudentPhotoUrl(selectedAdmission) ? (
                      <div className="relative">
                        <img
                          src={getStudentPhotoUrl(selectedAdmission)}
                          alt={`${selectedAdmission.firstName} ${selectedAdmission.lastName}`}
                          className="h-40 w-40 md:h-64 md:w-64 rounded-xl object-cover border-2 md:border-4 border-gray-200 shadow-lg"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = `
                              <div class="h-40 w-40 md:h-64 md:w-64 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center text-blue-600 border-2 md:border-4 border-gray-200">
                                <div class="text-center">
                                  <div class="text-2xl md:text-5xl font-bold mb-1 md:mb-2">${getInitials(selectedAdmission.firstName, selectedAdmission.lastName)}</div>
                                  <div class="text-xs md:text-sm text-blue-500">No Photo</div>
                                </div>
                              </div>
                            `;
                          }}
                        />
                      </div>
                    ) : (
                      <div className="h-40 w-40 md:h-64 md:w-64 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center text-blue-600 border-2 md:border-4 border-gray-200">
                        <div className="text-center">
                          <div className="text-2xl md:text-5xl font-bold mb-1 md:mb-2">
                            {getInitials(selectedAdmission.firstName, selectedAdmission.lastName)}
                          </div>
                          <div className="text-xs md:text-sm text-blue-500">No Photo Available</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Information Grid - FLEXIBLE FOR MOBILE */}
                  <div className="flex flex-col md:grid md:grid-cols-2 gap-3 md:gap-8">
                    {/* Left Column */}
                    <div className="space-y-3 md:space-y-8">
                      {/* Personal Information */}
                      <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-6">
                        <h4 className="text-sm md:text-lg font-semibold text-gray-900 mb-2 md:mb-4 pb-2 md:pb-3 border-b border-gray-200">
                          Personal Information
                        </h4>
                        <div className="space-y-2 md:space-y-4">
                          <div className="flex flex-col md:grid md:grid-cols-2 gap-2 md:gap-4">
                            <div>
                              <p className="text-xs md:text-sm text-gray-500 mb-1">Full Name</p>
                              <p className="font-medium text-gray-900 text-sm md:text-base">
                                {selectedAdmission.firstName} {selectedAdmission.lastName} {selectedAdmission.grandParentName}
                              </p>
                            </div>
                            <div className="mt-2 md:mt-0">
                              <p className="text-xs md:text-sm text-gray-500 mb-1">Gender</p>
                              <p className="font-medium text-gray-900 text-sm md:text-base">
                                {selectedAdmission.gender || 'N/A'}
                              </p>
                            </div>


                
                          </div>
                         
                          <div>
                            <p className="text-xs md:text-sm text-gray-500 mb-1">Address</p>
                            <p className="font-medium text-gray-900 text-sm md:text-base break-words">
                              {selectedAdmission.address || 'N/A'}
                            </p>
                          </div>
                          <div className="flex flex-col md:grid md:grid-cols-2 gap-2 md:gap-4">
                            <div>
                              <p className="text-xs md:text-sm text-gray-500 mb-1">Media Of Instruction</p>
                              <p className="font-medium text-gray-900 text-sm md:text-base">
                                {selectedAdmission.nationality || 'N/A'}
                              </p>
                            </div>
                           
                          </div>
                        </div>
                      </div>

                      {/* Parent Information */}
                      <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-6">
                        <h4 className="text-sm md:text-lg font-semibold text-gray-900 mb-2 md:mb-4 pb-2 md:pb-3 border-b border-gray-200">
                          Parent Information
                        </h4>
                        <div className="space-y-2 md:space-y-4">
                          <div>
                            <p className="text-xs md:text-sm text-gray-500 mb-1">Parent Name</p>
                            <p className="font-medium text-gray-900 text-sm md:text-base">
                              {selectedAdmission.parentName || 'N/A'}
                            </p>
                          </div>
                          <div className="flex flex-col md:grid md:grid-cols-2 gap-2 md:gap-4">
                            <div>
                              <p className="text-xs md:text-sm text-gray-500 mb-1">Relationship</p>
                              <p className="font-medium text-gray-900 text-sm md:text-base">
                                {selectedAdmission.relationship || 'N/A'}
                              </p>
                            </div>
                           
                          </div>
                          <div className="flex flex-col md:grid md:grid-cols-2 gap-2 md:gap-4">
                            <div>
                              <p className="text-xs md:text-sm text-gray-500 mb-1">Phone Number</p>
                              <p className="font-medium text-gray-900 text-sm md:text-base">
                                {selectedAdmission.parentPhone || 'N/A'}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs md:text-sm text-gray-500 mb-1">Email Address</p>
                              <p className="font-medium text-gray-900 text-sm md:text-base break-all">
                                {selectedAdmission.parentEmail || 'N/A'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-3 md:space-y-8">
                      {/* Academic Information */}
                      <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-6">
                        <h4 className="text-sm md:text-lg font-semibold text-gray-900 mb-2 md:mb-4 pb-2 md:pb-3 border-b border-gray-200">
                          Academic Information
                        </h4>
                        <div className="space-y-2 md:space-y-4">
                          <div className="flex flex-col md:grid md:grid-cols-2 gap-2 md:gap-4">
                            <div>
                              <p className="text-xs md:text-sm text-gray-500 mb-1">Applying Grade</p>
                              <p className="font-medium text-gray-900 text-sm md:text-base">
                                {selectedAdmission.applyingGrade || 'N/A'}
                              </p>
                            </div>
                            <div className="mt-2 md:mt-0">
                              <p className="text-xs md:text-sm text-gray-500 mb-1">Previous Grade</p>
                              <p className="font-medium text-gray-900 text-sm md:text-base">
                                {selectedAdmission.lastGrade || 'N/A'}
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs md:text-sm text-gray-500 mb-1">Previous School</p>
                            <p className="font-medium text-gray-900 text-sm md:text-base">
                              {selectedAdmission.lastSchool || 'N/A'}
                            </p>
                          </div>

                          <div>
                              <p className="text-xs md:text-sm text-gray-500 mb-1">Program </p>
                              <p className="font-medium text-gray-900 text-sm md:text-base">
                                {selectedAdmission.program || 'N/A'}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs md:text-sm text-gray-500 mb-1">Field</p>
                              <p className="font-medium text-gray-900 text-sm md:text-base">
                                {selectedAdmission.field || 'N/A'}
                              </p>
                            </div>
                         
                          <div className="flex flex-col md:grid md:grid-cols-2 gap-2 md:gap-4">
                            <div className="md:col-span-2">
                              <p className="text-xs md:text-sm text-gray-500 mb-1">Academic Year</p>
                              <p className="font-medium text-gray-900 text-sm md:text-base">
                                {new Date().getFullYear()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Additional Information */}
                      <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-6">
                        <h4 className="text-sm md:text-lg font-semibold text-gray-900 mb-2 md:mb-4 pb-2 md:pb-3 border-b border-gray-200">
                          Additional Information
                        </h4>
                        <div className="space-y-2 md:space-y-4">
                          <div className="flex flex-col md:grid md:grid-cols-2 gap-2 md:gap-4">
                            <div>
                              <p className="text-xs md:text-sm text-gray-500 mb-1">Application Date</p>
                              <p className="font-medium text-gray-900 text-sm md:text-base">
                                {selectedAdmission.createdAt ? new Date(selectedAdmission.createdAt).toLocaleDateString() : 'N/A'}
                              </p>
                            </div>
                            <div>
                             <p className="text-sm md:text-base font-semibold text-gray-600 uppercase tracking-wide mb-2">
  Status
</p>

<span
  className={`inline-flex items-center gap-2 px-4 py-1.5 text-sm font-semibold rounded-full 
  shadow-md transition-all duration-300 hover:scale-105
  ${
    selectedAdmission.status === 'accepted'
      ? 'bg-gradient-to-r from-green-500 to-green-900 text-white shadow-green-400/40'
      : selectedAdmission.status === 'pending'
      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-yellow-400/40 animate-pulse'
      : selectedAdmission.status === 'rejected'
      ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-red-400/40'
      : 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800'
  }`}
>
  {selectedAdmission.status || 'Pending'}
</span>

                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer - RESPONSIVE */}
                <div className="px-3 md:px-8 py-3 md:py-6 bg-gray-50 border-t border-gray-200 rounded-b-xl">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-2 md:gap-0">
                    <div className="text-xs md:text-sm text-gray-500 text-center md:text-left mb-2 md:mb-0">
                      <div className="block md:inline">Student ID: {selectedAdmission.studentId || selectedAdmission.admissionId || 'N/A'}</div>
                      <div className="hidden md:inline"> • </div>
                      <div className="block md:inline">Applied: {selectedAdmission.createdAt ? new Date(selectedAdmission.createdAt).toLocaleDateString() : 'N/A'}</div>
                    </div>
                    <div className="flex gap-2 md:gap-3">
                      <button
                        onClick={() => setSelectedAdmission(null)}
                        className="px-4 md:px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm md:text-base w-full md:w-auto"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

     
    </>
  );
};

export default StudentSeeProfile;