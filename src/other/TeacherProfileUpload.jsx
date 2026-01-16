import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, CheckCircle } from 'lucide-react';
import logo from '../assets/tullulogo.png';

const TeacherUploadForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    profileImage: null,
    gender: '',
    employeeId: '',
    department: '',
    position: '',
    yearsOfExperience: '',
    joiningDate: '',
    currentSubjects: '',
    highestDegree: '',
    university: '',
    graduationYear: '',
    specialization: '',
    additionalQualifications: '',
  });

  const departments = [
    'Mathematics', 'Science', 'English', 'History', 
    'Computer Science', 'Physical Education', 'Arts', 
    'Music', 'Languages', 'Social Studies'
  ];

  const positions = [
    'Head Teacher', 'Senior Teacher', 'Teacher', 
    'Assistant Teacher', 'Specialist', 'Coordinator'
  ];

  const validateForm = () => {
    const newErrors = {};
    
    // Basic validation examples
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.employeeId.trim()) newErrors.employeeId = 'Employee ID is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.position) newErrors.position = 'Position is required';
    if (!formData.highestDegree.trim()) newErrors.highestDegree = 'Highest degree is required';
    if (!formData.university.trim()) newErrors.university = 'University is required';
    if (!formData.graduationYear) newErrors.graduationYear = 'Graduation year is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        alert('File size should be less than 2MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      const firstError = Object.keys(errors)[0];
      const element = document.querySelector(`[name="${firstError}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:5000/api/teachers/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          dateOfBirth: '',
          address: '',
          profileImage: null,
          gender: '',
          employeeId: '',
          department: '',
          position: '',
          yearsOfExperience: '',
          joiningDate: '',
          currentSubjects: '',
          highestDegree: '',
          university: '',
          graduationYear: '',
          specialization: '',
          additionalQualifications: '',
        });
        
        setShowThankYou(true);
      } else {
        alert(data.message || "Something went wrong! Please try again.");
      }
    } catch (error) {
      console.error("Error uploading teacher:", error);
      alert("Unable to connect to server. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleThankYouClose = () => {
    setShowThankYou(false);
    navigate('/other/teacher-list');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      <div className="relative bg-gradient-to-r from-blue-800 to-blue-600 text-white py-28">
        <div className="fixed top-4 left-4 z-10">
          <button
            onClick={() => navigate('/other/teacher-list')}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            <Home className="w-5 h-5" />
            <span>Back to Home Page</span>
          </button>
        </div>

        <div className="flex justify-center mb-4 md:mb-6 mt-4 md:mt-0">
          <div className="bg-blue-100 rounded-2xl max-w-[200px] md:max-w-none">
            <img src={logo} alt='Tuludimtu School Logo' className='w-56 h-56'/>
          </div>
        </div>
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Teacher Profile Upload</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Fill in your information to be added to the school's teacher list
          </p>
    
    <div className="flex justify-center items-center mt-12">
  <a href='/teachersupload-platform'>
    <button
    className="px-10 py-5 text-xl md:text-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-3xl shadow-2xl hover:scale-105 transform transition-all duration-300"
  >
    Upload Study Material
  </button>
  </a>
</div>

          
        </div>

        
      </div>
       
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Personal Information Section */}
            <div className="border-b pb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  {/* <span className="text-blue-600">👤</span> */}
                </div>
                <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Profile Picture</label>
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden">
                        {formData.profileImage ? (
                          <img 
                            src={formData.profileImage} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                            {/* <span className="text-blue-400 text-4xl">👤</span> */}
                          </div>
                        )}
                      </div>
                      <label className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 shadow-lg">
                        <span>📤</span>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Upload a professional photo</p>
                      <p className="text-xs text-gray-500">Recommended: Square image, max 2MB</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    {/* <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">👤</span> */}
                    <input
                      type="text"
                      name="fullName"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={handleInputChange}
                    />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    {/* <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">✉️</span> */}
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="john@school.edu"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">📱</span>
                    <input
                      type="tel"
                      name="phone"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    {/* <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">📅</span> */}
                    <input
                      type="date"
                      name="dateOfBirth"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.gender}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                   
                    <textarea
                      name="address"
                      rows="3"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="123 School Street, City, State, ZIP"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Information Section */}
            <div className="border-b pb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                 
                </div>
                <h2 className="text-xl font-bold text-gray-900">Professional Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employee ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="employeeId"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="TCH-001"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                  />
                  {errors.employeeId && <p className="text-red-500 text-xs mt-1">{errors.employeeId}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="department"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.department}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="position"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.position}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Position</option>
                    {positions.map(pos => (
                      <option key={pos} value={pos}>{pos}</option>
                    ))}
                  </select>
                  {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Years of Experience <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="yearsOfExperience"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="5"
                    value={formData.yearsOfExperience}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Joining Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="joiningDate"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.joiningDate}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subjects Currently Teaching <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="currentSubjects"
                    rows="2"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Algebra, Geometry, Calculus"
                    value={formData.currentSubjects}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Education Section */}
            <div className="pb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600">🎓</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Education Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Highest Degree <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="highestDegree"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Master of Education"
                    value={formData.highestDegree}
                    onChange={handleInputChange}
                  />
                  {errors.highestDegree && <p className="text-red-500 text-xs mt-1">{errors.highestDegree}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    University <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="university"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="University of Education"
                    value={formData.university}
                    onChange={handleInputChange}
                  />
                  {errors.university && <p className="text-red-500 text-xs mt-1">{errors.university}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Graduation Year <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="graduationYear"
                    required
                    min="1950"
                    max="2024"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="2015"
                    value={formData.graduationYear}
                    onChange={handleInputChange}
                  />
                  {errors.graduationYear && <p className="text-red-500 text-xs mt-1">{errors.graduationYear}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialization <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Mathematics Education"
                    value={formData.specialization}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Qualifications & Certifications <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                   
                    <textarea
                      name="additionalQualifications"
                      rows="3"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="List any additional certifications, workshops, or training..."
                      value={formData.additionalQualifications}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 sm:pt-4 md:pt-6 lg:pt-8 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 items-center justify-between">
                <div className="text-xs sm:text-sm text-gray-600 w-full sm:w-auto mb-2 sm:mb-0">
                  <p className="flex items-center gap-1 sm:gap-2">
                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-red-500 rounded-full"></span>
                    Indicates required field
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-2.5 md:py-3.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg md:rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all text-xs sm:text-sm md:text-base w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-2.5 md:py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg md:rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base w-full sm:w-auto"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                        Submit Profile
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {showThankYou && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-xl md:rounded-2xl lg:rounded-3xl max-w-sm sm:max-w-md w-full p-4 sm:p-6 md:p-8 animate-scale-in">
            <div className="text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-r from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-6">
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-green-600" />
              </div>
              
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">
                Thank You!
              </h3>
              
              <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-3 sm:mb-4 md:mb-6">
                Your teacher profile has been successfully submitted. Our team will review your information and get back to you shortly.
              </p>
              
              <div className="space-y-2 sm:space-y-3">
                <button
                  onClick={handleThankYouClose}
                  className="w-full py-2 sm:py-2.5 md:py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg md:rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all text-xs sm:text-sm md:text-base"
                >
                  Back to Teacher List
                </button>
                
                <button
                  onClick={() => setShowThankYou(false)}
                  className="w-full py-2 sm:py-2.5 md:py-3.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg md:rounded-xl hover:border-gray-400 transition-all text-xs sm:text-sm md:text-base"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherUploadForm;