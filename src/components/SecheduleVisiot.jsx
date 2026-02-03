import React, { useState } from 'react';
import { CalendarDays, MapPin, Clock, User, Phone, Mail, Users, CheckCircle } from 'lucide-react';
import bg from '../assets/visitor.png';
// API base URL - change this to your backend URL
const API_BASE_URL = 'https://tullu-dimtu-school-backend-1.onrender.com/api';

const SchoolVisit = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    visitDate: '',
    numberOfVisitors: 1,
    purpose: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Prepare data for backend
      const visitData = {
        ...formData,
        visitDate: new Date(formData.visitDate) // Convert string to Date object
      };

      // Send data to backend
      const response = await fetch(`${API_BASE_URL}/visits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(visitData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit visit request');
      }

      console.log('Visit Request Saved:', data);
      setSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          organization: '',
          visitDate: '',
          numberOfVisitors: 1,
          purpose: '',
          message: ''
        });
      }, 3000);

    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (  
    <>
     <div
  className="relative w-full h-[90vh] text-white py-24 bg-cover bg-center bg-fixed"
  style={{ backgroundImage: `url(${bg})` }}
>
  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-black/50"></div>

  {/* Content */}
  <div className="relative container mx-auto px-4 text-center">
    <h1 className="text-4xl md:text-5xl font-bold mb-4 mt-16">
      Welcome <span className="text-yellow-400">to Tulu Dimtu School</span>
    </h1>

    <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto">
      We are delighted to have you visit our school website!{" "}
      <span className="text-yellow-400">
        Explore our programs, student life, and achievements.
      </span>{" "}
      Tulu Dimtu School is dedicated to nurturing academic excellence,
      leadership, and strong community values in every student.
    </p>
  </div>
</div>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
            <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8">
              <div className="flex items-center mb-6">
                <div className="bg-indigo-600 p-3 rounded-lg">
                  <CalendarDays className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 ml-4">Schedule Your Visit</h2>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              {submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-green-800 mb-2">Visit Request Submitted!</h3>
                  <p className="text-green-700">
                    Thank you for your interest in visiting Tulludimtu School. 
                    We'll contact you within 24 hours to confirm your appointment.
                  </p>
                  <p className="text-sm text-gray-600 mt-4">
                    Your request has been saved to our database successfully.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="inline h-4 w-4 mr-1" />
                        Full Name <span className='text-red-400'>*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="inline h-4 w-4 mr-1" />
                        Email Address <span className='text-red-400'>*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="inline h-4 w-4 mr-1" />
                        Phone Number <span className='text-red-400'>*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        placeholder="+251 91 234 5678"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Organization
                      </label>
                      <input
                        type="text"
                        name="organization"
                        value={formData.organization}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        placeholder="Company/School Name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <CalendarDays className="inline h-4 w-4 mr-1" />
                        Preferred Visit Date <span className='text-red-400'>*</span>
                      </label>
                      <input
                        type="date"
                        name="visitDate"
                        required
                        value={formData.visitDate}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Visitors <span className='text-red-400'>*</span>
                      </label>
                      <select
                        name="numberOfVisitors"
                        value={formData.numberOfVisitors}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      >
                        {[1,2,3,4,5,6,7,8,9,10].map(num => (
                          <option key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Purpose of Visit <span className='text-red-400'>*</span>
                    </label>
                    <select
                      name="purpose"
                      required
                      value={formData.purpose}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    >
                      <option value="">Select a purpose</option>
                      <option value="prospective-student">Prospective Student/Parent</option>
                      <option value="educational-partner">Educational Partner</option>
                      <option value="research">Research/Academic Study</option>
                      <option value="community-partner">Community Partner</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Message
                    </label>
                    <textarea
                      name="message"
                      rows="4"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      placeholder="Any specific areas you'd like to visit or questions you have..."
                    />
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">
                      By submitting this form, you agree to our privacy policy and confirm that 
                      all information provided is accurate.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Submitting...' : 'Request School Visit'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SchoolVisit;
