import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import {
  FaUserCircle, FaPhone, FaEnvelope, FaSchool, FaFilePdf, 
  FaFileImage, FaFileAlt, 
  FaPrint, FaDownload, FaEye, FaFolderOpen, FaCamera, FaTimes,
  FaUsers, FaFileWord, FaFileExcel, FaFilePowerpoint,
  FaTrash, FaUpload, 
  FaMale, FaFemale, FaEdit, FaSave, FaTimesCircle, FaUserGraduate
} from 'react-icons/fa';
 
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AdminDashboardPage = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewed: 0,
    accepted: 0,
    rejected: 0,
    male: 0,
    female: 0,
    otherGender: 0,
    byGrade: {}
  });
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterGrade, setFilterGrade] = useState('all');
  const [filterGender, setFilterGender] = useState('all');
  const [filterProgram, setFilterProgram] = useState('all');
  const [filterField, setFilterField] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingFile, setViewingFile] = useState(null);
  const [studentDocuments, setStudentDocuments] = useState([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [uploadingDocuments, setUploadingDocuments] = useState(false);
  const [documentFiles, setDocumentFiles] = useState([]);
  const [showBulkExport, setShowBulkExport] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [newDocumentType, setNewDocumentType] = useState('');
  const [teachers, setTeachers] = useState([]);
  
  // Edit mode states
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [editLoading, setEditLoading] = useState(false);

  // Function to calculate gender statistics
  const calculateGenderStats = (admissionsData) => {
    const genderCounts = {
      male: 0,
      female: 0,
      otherGender: 0
    };
    
    admissionsData.forEach(admission => {
      const gender = admission.gender ? admission.gender.toLowerCase() : '';
      if (gender === 'male') {
        genderCounts.male++;
      } else if (gender === 'female') {
        genderCounts.female++;
      } else {
        genderCounts.otherGender++;
      }
    });
    
    return genderCounts;
  };

  // Function to calculate grade-specific gender stats
  const calculateGradeGenderStats = (admissionsData, grade) => {
    const gradeAdmissions = admissionsData.filter(a => a.applyingGrade === grade);
    return calculateGenderStats(gradeAdmissions);
  };

  // Function to calculate all stats from admissions data
  const calculateAllStats = (admissionsData) => {
    const total = admissionsData.length;
    const pending = admissionsData.filter(a => a.status === 'pending').length;
    const reviewed = admissionsData.filter(a => a.status === 'reviewed').length;
    const accepted = admissionsData.filter(a => a.status === 'accepted').length;
    const rejected = admissionsData.filter(a => a.status === 'rejected').length;
    
    const genderCounts = calculateGenderStats(admissionsData);
    
    const byGrade = {};
    admissionsData.forEach(admission => {
      const grade = admission.applyingGrade || 'Unknown';
      byGrade[grade] = (byGrade[grade] || 0) + 1;
    });
    
    return {
      total,
      pending,
      reviewed,
      accepted,
      rejected,
      male: genderCounts.male,
      female: genderCounts.female,
      otherGender: genderCounts.otherGender,
      byGrade
    };
  };

  // Effect to update stats whenever admissions change
  useEffect(() => {
    if (admissions.length > 0) {
      const newStats = calculateAllStats(admissions);
      setStats(newStats);
    }
  }, [admissions]);

  useEffect(() => {
    fetchAdmissions();
    fetchTeachers();
  }, []);

  const fetchAdmissions = async () => {
    try {
      setIsLoading(true);
      setLoading(true);
      setError(null);
      console.log('📡 Fetching admissions from:', `${API_URL}/api/admissions`);
      
      const response = await axios.get(`${API_URL}/api/admissions`, {
        timeout: 10000
      });
      
      console.log('✅ Admissions response:', response.data);
      
      if (response.data.success) {
        const admissionsData = response.data.data || [];
        console.log(`📊 Loaded ${admissionsData.length} admissions`);
        setAdmissions(admissionsData);
        setSelectedStudents([]);
      } else {
        setError('Failed to fetch admissions: ' + (response.data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('❌ Fetch error:', error);
      setError(`Failed to connect to server. Please check if backend is running at ${API_URL}`);
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/teachers`);
      if (response.data.success) {
        setTeachers(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  // Edit student function
  const handleEditClick = () => {
    if (selectedAdmission) {
      setEditFormData({
        firstName: selectedAdmission.firstName || '',
        lastName: selectedAdmission.lastName || '',
        grandParentName: selectedAdmission.grandParentName || '',
        gender: selectedAdmission.gender || '',
        dob: selectedAdmission.dob ? selectedAdmission.dob.split('T')[0] : '',
        age: selectedAdmission.age || '',
        applyingGrade: selectedAdmission.applyingGrade || '',
        lastSchool: selectedAdmission.lastSchool || '',
        lastGrade: selectedAdmission.lastGrade || '',
        parentName: selectedAdmission.parentName || '',
        parentPhone: selectedAdmission.parentPhone || '',
        parentEmail: selectedAdmission.parentEmail || '',
        relationship: selectedAdmission.relationship || '',
        address: selectedAdmission.address || '',
        nationality: selectedAdmission.nationality || '',
        religion: selectedAdmission.religion || '',
        gradeAverage: selectedAdmission.gradeAverage || '',
        condition: selectedAdmission.condition || '',
        fayida: selectedAdmission.fayida || '',
        program: selectedAdmission.program || '',
        field: selectedAdmission.field || '',
        status: selectedAdmission.status || 'pending'
      });
      setIsEditing(true);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async () => {
    if (!selectedAdmission) return;
    
    setEditLoading(true);
    try {
      const response = await axios.put(`${API_URL}/api/admissions/${selectedAdmission._id}`, editFormData);
      
      if (response.data.success) {
        // Update the admissions list
        const updatedAdmission = response.data.data;
        setAdmissions(prev => prev.map(ad => 
          ad._id === selectedAdmission._id ? updatedAdmission : ad
        ));
        setSelectedAdmission(updatedAdmission);
        setIsEditing(false);
        alert('Student information updated successfully!');
      } else {
        alert('Failed to update: ' + (response.data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Edit error:', error);
      alert('Failed to update student information: ' + (error.response?.data?.message || error.message));
    } finally {
      setEditLoading(false);
    }
  };

  // Download all documents for a student
  const downloadAllDocuments = async (studentId, studentName) => {
    if (!studentId) {
      alert('Student ID is required');
      return;
    }
    
    setIsLoading(true);
    try {
      console.log(`📥 Downloading all documents for student: ${studentName || studentId}`);
      
      const response = await axios.get(
        `${API_URL}/api/admissions/${studentId}/download`,
        {
          responseType: 'blob',
          timeout: 60000 // 60 seconds timeout for multiple files
        }
      );
      
      // Create blob and download
      const blob = new Blob([response.data], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().split('T')[0];
      const fileName = `${studentName || 'student'}_documents_${timestamp}.zip`;
      
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      alert('Documents downloaded successfully!');
    } catch (error) {
      console.error('Error downloading documents:', error);
      alert(`Failed to download documents: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to open/view documents
  const openDocument = (doc) => {
    if (!doc || !doc.url) {
      alert('Document URL not available');
      return;
    }
    
    const fileUrl = getFileUrl(doc.url);
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    } else {
      alert('Unable to open document');
    }
  };

  // Fetch student documents
  const fetchStudentDocuments = async (studentId) => {
    try {
      setDocumentsLoading(true);
      console.log('📁 Fetching documents for student:', studentId);
      
      const response = await axios.get(`${API_URL}/api/admissions/${studentId}/documents`);
      
      if (response.data.success) {
        console.log('📄 Documents received:', response.data.documents);
        setStudentDocuments(response.data.documents || []);
      } else {
        console.error('Failed to fetch documents:', response.data.message);
        setStudentDocuments([]);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      setStudentDocuments([]);
    } finally {
      setDocumentsLoading(false);
    }
  };

  // Get full URL for any file
  const getFileUrl = (filePath) => {
    if (!filePath) return null;
    if (filePath.startsWith('http')) return filePath;
    if (filePath.startsWith('/')) return `${API_URL}${filePath}`;
    return `${API_URL}/uploads/${filePath}`;
  };

  // Get student photo URL
  const getStudentPhotoUrl = (admission) => {
    if (!admission) return null;
    if (admission.photo?.secure_url) return admission.photo.secure_url;
    if (admission.photo?.url) return admission.photo.url;
    if (admission.photo && typeof admission.photo === 'string') return getFileUrl(admission.photo);
    if (admission.studentPhoto) return getFileUrl(admission.studentPhoto);
    return null;
  };

  // Function to fetch all documents for multiple students
  const fetchAllDocumentsForStudents = async (studentIds) => {
    const allDocuments = {};
    for (const studentId of studentIds) {
      try {
        const response = await axios.get(`${API_URL}/api/admissions/${studentId}/documents`);
        if (response.data.success && response.data.documents) {
          allDocuments[studentId] = response.data.documents;
        } else {
          allDocuments[studentId] = [];
        }
      } catch (error) {
        console.error(`Error fetching documents for student ${studentId}:`, error);
        allDocuments[studentId] = [];
      }
    }
    return allDocuments;
  };

  // Export student information with separate document columns
  const exportStudentInfo = async (studentIds, format = 'pdf') => {
    if (!studentIds || studentIds.length === 0) {
      alert('Please select at least one student to export');
      return;
    }
    
    setIsLoading(true);
    try {
      if (format === 'excel') {
        const selectedStudents = admissions.filter(admission => studentIds.includes(admission._id));
        
        // Fetch all documents for selected students
        const allDocuments = await fetchAllDocumentsForStudents(studentIds);
        
        // Collect all unique document types
        const allDocumentTypes = new Set();
        for (const studentId of studentIds) {
          const docs = allDocuments[studentId] || [];
          docs.forEach(doc => {
            if (doc.type) {
              allDocumentTypes.add(doc.type);
            }
          });
        }
        
        // Create Excel data with separate columns for each document type
        const excelData = [];
        
        for (const student of selectedStudents) {
          const studentDocs = allDocuments[student._id] || [];
          
          // Create a map of document type to URL
          const docsByType = {};
          studentDocs.forEach(doc => {
            const fileUrl = getFileUrl(doc.url);
            if (fileUrl) {
              const docType = doc.type || 'Other';
              // If multiple documents of same type, combine them with newline
              if (docsByType[docType]) {
                docsByType[docType] += '\n' + fileUrl;
              } else {
                docsByType[docType] = fileUrl;
              }
            }
          });
          
          // Create row data with all possible document type columns
          const rowData = {
            'Student ID': student.studentId || student.admissionId || 'N/A',
            'First Name': student.firstName || '',
            'Last Name': student.lastName || '',
            'Full Name': `${student.firstName || ''} ${student.lastName || ''} ${student.grandParentName || ''}`.trim(),
            'Grand Parent Name': student.grandParentName || 'N/A',
            'Gender': student.gender || 'N/A',
            'Date of Birth': student.dob ? new Date(student.dob).toLocaleDateString() : 'N/A',
            'Age': student.age || 'N/A',
            'Applying Grade': student.applyingGrade || 'N/A',
            'Previous School': student.lastSchool || 'N/A',
            'Previous Grade': student.lastGrade || 'N/A',
            'Parent Name': student.parentName || 'N/A',
            'Parent Phone': student.parentPhone || 'N/A',
            'Parent Email': student.parentEmail || 'N/A',
            'Relationship': student.relationship || 'N/A',
            'Address': student.address || 'N/A',
            'Nationality': student.nationality || 'N/A',
            'Religion': student.religion || 'N/A',
            'Grade Average': student.gradeAverage || 'N/A',
            'Status': student.status || 'pending',
            'Application Date': student.createdAt ? new Date(student.createdAt).toLocaleDateString() : 'N/A',
            'Last Updated': student.updatedAt ? new Date(student.updatedAt).toLocaleDateString() : 'N/A',
            'Registration Condition': student.condition || 'N/A',
            'FAN/FIN': student.fayida || 'N/A',
            'Program': student.program || 'N/A',
            'Field': student.field || 'N/A',
          };
          
          // Add document type columns
          const documentTypes = Array.from(allDocumentTypes).sort();
          documentTypes.forEach(docType => {
            rowData[docType] = docsByType[docType] || 'No document';
          });
          
          excelData.push(rowData);
        }
        
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        
        // Set column widths
        const colWidths = [
          { wch: 15 }, // Student ID
          { wch: 15 }, // First Name
          { wch: 15 }, // Last Name
          { wch: 25 }, // Full Name
          { wch: 20 }, // Grand Parent Name
          { wch: 10 }, // Gender
          { wch: 15 }, // Date of Birth
          { wch: 8 },  // Age
          { wch: 15 }, // Applying Grade
          { wch: 25 }, // Previous School
          { wch: 15 }, // Previous Grade
          { wch: 20 }, // Parent Name
          { wch: 15 }, // Parent Phone
          { wch: 25 }, // Parent Email
          { wch: 15 }, // Relationship
          { wch: 30 }, // Address
          { wch: 15 }, // Nationality
          { wch: 15 }, // Religion
          { wch: 12 }, // Grade Average
          { wch: 12 }, // Status
          { wch: 15 }, // Application Date
          { wch: 15 }, // Last Updated
          { wch: 20 }, // Registration Condition
          { wch: 15 }, // FAN/FIN
          { wch: 15 }, // Program
          { wch: 15 }, // Field
        ];
        
        // Add width for each document type column
        const documentTypes = Array.from(allDocumentTypes).sort();
        documentTypes.forEach(() => {
          colWidths.push({ wch: 40 });
        });
        
        worksheet['!cols'] = colWidths;
        
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
        
        // Write workbook
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().split('T')[0];
        
        link.href = url;
        link.setAttribute('download', `students-data-with-documents-${timestamp}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        
        setShowBulkExport(false);
        alert(`Exported ${studentIds.length} student(s) to Excel with separate document columns successfully!`);
        setIsLoading(false);
        return;
      }
      
      // For PDF and CSV formats
      const response = await axios.post(
        `${API_URL}/api/admissions/export`,
        { studentIds, format },
        { 
          responseType: 'blob',
          timeout: 30000
        }
      );
      
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().split('T')[0];
      
      let fileName;
      switch(format) {
        case 'pdf':
          fileName = `students-report-${timestamp}.pdf`;
          break;
        case 'csv':
          fileName = `students-data-${timestamp}.csv`;
          break;
        default:
          fileName = `students-export-${timestamp}.${format}`;
      }
      
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      setShowBulkExport(false);
      alert(`Exported ${studentIds.length} student(s) successfully!`);
      
    } catch (error) {
      console.error('Export error:', error);
      alert(`Export failed: ${error.response?.data?.message || error.message}`);
    }
    setIsLoading(false);
  };

  // Upload student documents
  const uploadStudentDocuments = async (studentId, files, documentType) => {
    if (!studentId || files.length === 0 || !documentType) {
      alert('Please select document type and files');
      return;
    }
    
    setUploadingDocuments(true);
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('documents', file);
      });
      formData.append('documentType', documentType);
      
      const response = await axios.post(
        `${API_URL}/api/admissions/${studentId}/upload-documents`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 30000
        }
      );
      
      if (response.data.success) {
        alert(`Successfully uploaded ${files.length} document(s)`);
        setShowDocumentUpload(false);
        setDocumentFiles([]);
        setNewDocumentType('');
        if (selectedAdmission && selectedAdmission._id === studentId) {
          fetchStudentDocuments(studentId);
        }
      } else {
        alert('Failed to upload documents: ' + (response.data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Document upload error:', error);
      alert('Failed to upload documents: ' + (error.response?.data?.message || error.message));
    } finally {
      setUploadingDocuments(false);
    }
  };

  // Update admission status - FIXED
  const updateStatus = async (id, newStatus) => {
    if (!id) {
      alert('Student ID is required');
      return;
    }
    
    try {
      console.log(`Updating status for student ${id} to: ${newStatus}`);
      
      const response = await axios.put(`${API_URL}/api/admissions/${id}/status`, {
        status: newStatus
      });
      
      if (response.data.success) {
        setAdmissions(prevAdmissions => 
          prevAdmissions.map(admission => 
            admission._id === id ? { ...admission, status: newStatus } : admission
          )
        );
        
        if (selectedAdmission && selectedAdmission._id === id) {
          setSelectedAdmission({ ...selectedAdmission, status: newStatus });
        }
        
        console.log(`✅ Status updated to ${newStatus}`);
        alert(`Status updated to ${newStatus} successfully!`);
      } else {
        alert('Failed to update status: ' + (response.data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Status update error:', error);
      let errorMessage = 'Failed to update status. ';
      if (error.response?.status === 404) {
        errorMessage = 'Student not found. Please refresh the page and try again.';
      } else if (error.response?.data?.message) {
        errorMessage += error.response.data.message;
      } else {
        errorMessage += 'Please check connection.';
      }
      alert(errorMessage);
    }
  };

  // Upload student photo - FIXED
  const uploadStudentPhoto = async (studentId, file) => {
    if (!studentId || !file) {
      alert('Student ID and file are required');
      return;
    }
    
    try {
      setUploadingPhoto(true);
      
      const formData = new FormData();
      formData.append('photo', file);
      
      const response = await axios.post(
        `${API_URL}/api/admissions/${studentId}/upload-photo`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 30000
        }
      );
      
      if (response.data.success) {
        const updatedAdmission = response.data.data;
        setAdmissions(prevAdmissions => 
          prevAdmissions.map(admission => 
            admission._id === studentId ? updatedAdmission : admission
          )
        );
        
        if (selectedAdmission && selectedAdmission._id === studentId) {
          setSelectedAdmission(updatedAdmission);
        }
        
        setPhotoPreview(null);
        alert('Photo uploaded successfully!');
      } else {
        alert('Failed to upload photo: ' + (response.data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Photo upload error:', error);
      alert('Failed to upload photo: ' + (error.response?.data?.message || error.message));
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Handle photo file selection
  const handlePhotoSelect = (studentId) => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
      fileInputRef.current.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
          if (!validTypes.includes(file.type)) {
            alert('Please select a valid image file (JPEG, PNG, GIF, WEBP)');
            return;
          }
          
          if (file.size > 5 * 1024 * 1024) {
            alert('File size too large. Maximum size is 5MB');
            return;
          }
          
          const reader = new FileReader();
          reader.onload = (e) => {
            setPhotoPreview(e.target.result);
          };
          reader.readAsDataURL(file);
          
          uploadStudentPhoto(studentId, file);
        }
      };
    }
  };

  // Print student information - FIXED
  const printStudentInfo = (studentId) => {
    const student = admissions.find(s => s._id === studentId);
    if (!student) return;
    
    // Get student photo URL
    const studentPhotoUrl = getStudentPhotoUrl(student);

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Profile - ${student.firstName} ${student.lastName} ${student.grandParentName}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --primary: #2c3e50;
            --secondary: #3498db;
            --accent: #2980b9;
            --light: #f8f9fa;
            --dark: #2c3e50;
            --success: #27ae60;
            --warning: #f39c12;
            --danger: #e74c3c;
            --border: #e0e6ed;
            --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        body {
            font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .report_container {
            max-width: 1200px;
            margin: 20px auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
            overflow: hidden;
            position: relative;
        }

        .report_header {
            background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
            color: white;
            padding: 30px 40px;
            position: relative;
            overflow: hidden;
        }

        .header_pattern {
            position: absolute;
            top: 0;
            right: 0;
            width: 200px;
            height: 100%;
            background: rgba(255, 255, 255, 0.1);
            clip-path: polygon(100% 0, 100% 100%, 0 100%);
        }

        .school_info {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 20px;
        }

        .school_name {
            font-size: 28px;
            font-weight: 700;
            letter-spacing: 1px;
        }

        .school_motto {
            font-size: 14px;
            opacity: 0.9;
            margin-top: 5px;
        }

        .report_badge {
            background: rgba(255, 255, 255, 0.2);
            padding: 8px 20px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            backdrop-filter: blur(10px);
        }

        .report_title {
            text-align: center;
            font-size: 24px;
            font-weight: 600;
            margin-top: 15px;
            letter-spacing: 2px;
            text-transform: uppercase;
            opacity: 0.95;
        }

        .student_profile_section {
            padding: 30px 40px;
            display: grid;
            grid-template-columns: 250px 1fr;
            gap: 40px;
            border-bottom: 1px solid var(--border);
        }

        .photo_container {
            position: relative;
        }

        .photo_wrapper {
            width: 220px;
            height: 260px;
            border-radius: 8px;
            overflow: hidden;
            border: 3px solid white;
            box-shadow: var(--shadow);
            background: var(--light);
            position: relative;
        }

        .student_photo {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
        }   

        .student_photo:hover {
            transform: scale(1.05);
        }

        .photo_placeholder {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #95a5a6;
            font-size: 14px;
        }

        .photo_placeholder i {
            font-size: 48px;
            margin-bottom: 10px;
            opacity: 0.5;
        }

        .student_id_card {
            background: white;
            padding: 15px;
            border-radius: 8px;
            margin-top: 15px;
            border: 1px solid var(--border);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .id_label {
            font-size: 12px;
            color: #7f8c8d;
            margin-bottom: 5px;
        }

        .id_value {
            font-size: 16px;
            font-weight: 700;
            color: var(--primary);
        }

        .student_details {
            display: flex;
            flex-direction: column;
            gap: 25px;
        }

        .info_section {
            padding: 20px;
            border-radius: 8px;
            border: 1px solid var(--border);
            background: white;
            position: relative;
        }

        .info_section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 100%;
            background: var(--secondary);
        }

        .section_header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            color: var(--primary);
            padding-bottom: 10px;
            border-bottom: 2px solid var(--border);
        }

        .section_header i {
            margin-right: 10px;
            color: var(--secondary);
        }

        .info_grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
        }

        .info_row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px dashed #e0e0e0;
        }

        .info_row:last-child {
            border-bottom: none;
        }

        .info_label {
            font-weight: 600;
            color: #555;
            font-size: 14px;
        }

        .info_value {
            color: #333;
            font-weight: 500;
            text-align: right;
        }

        .underline_info {
            border-bottom: 2px solid var(--secondary);
            padding-bottom: 5px;
            margin-bottom: 5px;
        }

        .status_container {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            padding: 20px;
            border-radius: 8px;
            margin-top: 10px;
        }

        .status_header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }

        .status_badge {
            padding: 8px 20px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .status_pending {
            background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%);
            color: #856404;
        }

        .status_accepted {
            background: linear-gradient(135deg, #55efc4 0%, #00b894 100%);
            color: #155724;
        }

        .status_review {
            background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
            color: #004085;
        }

        .documents_section {
            padding: 30px 40px;
            background: #f8f9fa;
        }

        .section_title {
            font-size: 20px;
            font-weight: 600;
            color: var(--primary);
            margin-bottom: 25px;
            display: flex;
            align-items: center;
            padding-bottom: 10px;
            border-bottom: 2px solid var(--border);
        }

        .section_title i {
            margin-right: 10px;
            color: var(--secondary);
        }

        .documents_grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
        }

        .document_card {
            background: white;
            border-radius: 8px;
            padding: 15px;
            border: 1px solid var(--border);
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
            transition: all 0.3s ease;
            text-align: center;
        }

        .document_card:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .document_icon {
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, var(--secondary) 0%, var(--accent) 100%);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 20px;
            margin-bottom: 10px;
        }

        .document_info {
            flex: 1;
            width: 100%;
        }

        .document_name {
            font-weight: 600;
            color: var(--primary);
            margin-bottom: 5px;
            font-size: 14px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .document_meta {
            font-size: 12px;
            color: #7f8c8d;
            margin-top: 5px;
        }

        .signature_section {
            padding: 30px 40px;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 40px;
            border-top: 1px solid var(--border);
        }

        .signature_box {
            text-align: center;
            padding: 25px;
            border-radius: 8px;
            background: #f8f9fa;
            border: 2px dashed #cbd5e1;
            transition: all 0.3s ease;
        }

        .signature_box:hover {
            border-color: var(--secondary);
            background: #edf7ff;
        }

        .signature_title {
            font-weight: 600;
            color: var(--primary);
            margin-bottom: 20px;
            font-size: 16px;
        }

        .signature_line {
            width: 80%;
            height: 1px;
            background: #333;
            margin: 30px auto 10px;
        }

        .signature_date {
            font-size: 14px;
            color: #7f8c8d;
            margin-top: 15px;
        }

        .report_footer {
            padding: 20px 40px;
            background: var(--primary);
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .print_info {
            font-size: 14px;
            opacity: 0.9;
        }

        .controls {
            position: fixed;
            bottom: 30px;
            right: 30px;
            display: flex;
            gap: 15px;
            z-index: 1000;
        }

        .control_btn {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: white;
            border: none;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            color: var(--primary);
            transition: all 0.3s ease;
        }

        .control_btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
            color: var(--secondary);
        }

        .print_btn {
            background: linear-gradient(135deg, var(--secondary) 0%, var(--accent) 100%);
            color: white;
        }

        .print_btn:hover {
            background: linear-gradient(135deg, var(--accent) 0%, var(--primary) 100%);
        }

        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 2000;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(5px);
        }

        .modal_content {
            background: white;
            padding: 30px;
            border-radius: 12px;
            max-width: 600px;
            width: 90%;
            position: relative;
            animation: modalFadeIn 0.3s ease;
        }

        @keyframes modalFadeIn {
            from {
                opacity: 0;
                transform: translateY(-30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .close_modal {
            position: absolute;
            top: 15px;
            right: 15px;
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #7f8c8d;
        }

        .qr_code {
            text-align: center;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
            margin-top: 20px;
        }

        .qr_placeholder {
            width: 150px;
            height: 150px;
            background: #e0e6ed;
            border-radius: 8px;
            margin: 0 auto 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #7f8c8d;
            font-size: 14px;
        }

        @media print {
            body {
                background: white !important;
                padding: 0 !important;
            }
            .report_container {
                margin: 0 !important;
                box-shadow: none !important;
                border-radius: 0 !important;
            }
            .controls, .modal {
                display: none !important;
            }
            .student_photo:hover {
                transform: none !important;
            }
            .document_card:hover {
                transform: none !important;
                box-shadow: none !important;
            }
            .report_footer {
                background: #f8f9fa !important;
                color: #333 !important;
            }
        }

        @media (max-width: 1024px) {
            .documents_grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        @media (max-width: 768px) {
            .student_profile_section {
                grid-template-columns: 1fr;
                gap: 20px;
            }
            .info_grid {
                grid-template-columns: 1fr;
            }
            .documents_grid {
                grid-template-columns: 1fr;
            }
            .signature_section {
                grid-template-columns: 1fr;
                gap: 20px;
            }
            .controls {
                bottom: 20px;
                right: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="report_container">
        <div class="report_header">
            <div class="header_pattern"></div>
            <div class="school_info">
                <div>
                    <div class="school_name">TULU DIMTU SCHOOL</div>
                    <div class="school_motto">Excellence in Education Since 2009</div>
                </div>
                <div class="report_badge">OFFICIAL STUDENT RECORD</div>
            </div>
            <div class="report_title">Student Admission Profile</div>
        </div> 

        <div class="student_profile_section">
            <div class="photo_container">
                <div class="photo_wrapper">
                    ${studentPhotoUrl ? 
                        `<img src="${studentPhotoUrl}" alt="${student.firstName} ${student.lastName} ${student.grandParentName}" class="student_photo" 
                             onerror="this.onerror=null; this.src='';">` : 
                        `<div class="photo_placeholder">
                            <i class="fas fa-user-graduate"></i>
                            Photo Not Available
                        </div>`
                    }
                </div>
                <div class="student_id_card">
                    <div class="id_label">STUDENT IDENTIFICATION</div>
                    <div class="id_value">${student.studentId || student.admissionId || 'N/A'}</div>
                </div>
            </div>

            <div class="student_details">
                <div class="info_section">
                    <div class="section_header">
                        <i class="fas fa-user-circle"></i>
                        <h3>Personal Information</h3>
                    </div>
                    <div class="info_grid">
                        <div class="info_row">
                            <span class="info_label">Full Name:</span>
                            <span class="info_value underline_info">${student.firstName} ${student.lastName} ${student.grandParentName}</span>
                        </div>
                        <div class="info_row">
                            <span class="info_label">Date of Birth:</span>
                            <span class="info_value underline_info">${student.dob ? new Date(student.dob).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</span>
                        </div>
                        <div class="info_row">
                            <span class="info_label">Gender:</span>
                            <span class="info_value underline_info">${student.gender || 'N/A'}</span>
                        </div>
                         <div class="info_row">
                            <span class="info_label">FAN:</span>
                            <span class="info_value underline_info">${student.fayida || 'N/A'}</span>
                        </div>
                         <div class="info_row">
                            <span class="info_label">Program:</span>
                            <span class="info_value underline_info">${student.program || 'N/A'}</span>
                        </div>
                        <div class="info_row">
                            <span class="info_label">Field:</span>
                            <span class="info_value underline_info">${student.field || 'N/A'}</span>
                        </div>
                        <div class="info_row">
                            <span class="info_label">Media Of Instruction:</span>
                            <span class="info_value underline_info">${student.nationality || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                <div class="info_section">
                    <div class="section_header">
                        <i class="fas fa-graduation-cap"></i>
                        <h3>Academic Information</h3>
                    </div>
                    <div class="info_grid">
                        <div class="info_row">
                            <span class="info_label">Applying Grade:</span>
                            <span class="info_value underline_info">${student.applyingGrade || 'N/A'}</span>
                        </div>
                        <div class="info_row">
                            <span class="info_label">Previous School:</span>
                            <span class="info_value underline_info">${student.lastSchool || 'N/A'}</span>
                        </div>
                        <div class="info_row">
                            <span class="info_label">Previous Grade:</span>
                            <span class="info_value underline_info">${student.lastGrade || 'N/A'}</span>
                        </div>
                        <div>
                            <div class="info_row">
                                <span class="info_label">Grade Average:</span>
                                <span class="info_value underline_info">${student.gradeAverage !== undefined ? student.gradeAverage : 'N/A'}</span>
                            </div>
                        </div>

                         <div>
                            <div class="info_row">
                                <span class="info_label">Registration Condition:</span>
                                <span class="info_value underline_info">${student.condition !== undefined ? student.condition : 'N/A'}</span>
                            </div>
                        </div>
   
                        
                        <div class="info_row">
                            <span class="info_label">Enrollment Year:</span>
                            <span class="info_value underline_info">${student.enrollmentYear || new Date().getFullYear()}</span>
                        </div>
                    </div>
                </div>

                <div class="info_section">
                    <div class="section_header">
                        <i class="fas fa-users"></i>
                        <h3>Parent/Guardian Information</h3>
                    </div>
                    <div class="info_grid">
                        <div class="info_row">
                            <span class="info_label">Parent Name:</span>
                            <span class="info_value underline_info">${student.parentName || 'N/A'}</span>
                        </div>
                        <div class="info_row">
                            <span class="info_label">Relationship:</span>
                            <span class="info_value underline_info">${student.relationship || 'N/A'}</span>
                        </div>
                        <div class="info_row">
                            <span class="info_label">Phone Number:</span>
                            <span class="info_value underline_info">${student.parentPhone || 'N/A'}</span>
                        </div>
                        <div class="info_row">
                            <span class="info_label">Email Address:</span>
                            <span class="info_value underline_info">${student.parentEmail || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                <div class="status_container">
                    <div class="status_header">
                        <div>
                            <h3 style="color: var(--primary);">Application Status</h3>
                            <p style="font-size: 14px; color: #7f8c8d; margin-top: 5px;">
                                Last updated: ${student.updatedAt ? new Date(student.updatedAt).toLocaleDateString() : 'N/A'}
                            </p>
                        </div>
                        <div class="status_badge status_${student.status || 'pending'}">
                            ${(student.status || 'pending').toUpperCase()}
                        </div>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-top: 20px;">
                        <div style="flex: 1; padding-right: 10px;">
                            <div style="font-size: 12px; color: #7f8c8d;">Applied Date</div>
                            <div style="font-weight: 600; margin-top: 5px;">${student.createdAt ? new Date(student.createdAt).toLocaleDateString() : 'N/A'}</div>
                        </div>
                        <div style="flex: 1; padding-left: 10px;">
                            <div style="font-size: 12px; color: #7f8c8d;">Application ID</div>
                            <div style="font-weight: 600; margin-top: 5px;">${student.admissionId || student.studentId || 'N/A'}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>





      
    </div>

    <div class="controls">
        <button class="control_btn print_btn" onclick="window.print()" title="Print Report">
            <i class="fas fa-print"></i>
        </button>
        <button class="control_btn" onclick="generateQR()" title="Generate QR Code">
            <i class="fas fa-qrcode"></i>
        </button>
        <button class="control_btn" onclick="window.close()" title="Close Window">
            <i class="fas fa-times"></i>
        </button>
    </div>

    
          
        </div>
    </div>

    <script>
       

        
</script>
</body>
</html>
`);
    printWindow.document.close();
  };
  
  // Delete admission - FIXED
  const deleteAdmission = async (id) => {
    if (!id) {
      alert('Student ID is required');
      return;
    }
    
    const confirmDelete = window.confirm("Are you sure you want to delete this admission application? This will also delete all associated files.");
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`${API_URL}/api/admissions/${id}`);
      if (response.data.success) {
        setAdmissions(prevAdmissions => prevAdmissions.filter(admission => admission._id !== id));
        if (selectedAdmission && selectedAdmission._id === id) {
          setSelectedAdmission(null);
        }
        setSelectedStudents(prev => prev.filter(studentId => studentId !== id));
        alert('Admission deleted successfully!');
      } else {
        alert('Failed to delete: ' + (response.data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete admission: " + (error.response?.data?.message || error.message));
    }
  };

  // Toggle student selection
  const toggleStudentSelection = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) ? prev.filter(id => id !== studentId) : [...prev, studentId]
    );
  };

  // Select all filtered students
  const selectAllFiltered = () => {
    const filteredIds = filteredAdmissions.map(a => a._id);
    setSelectedStudents(filteredIds);
  };

  // Clear all selections
  const clearSelections = () => {
    setSelectedStudents([]);
  };

  // Filter admissions with grade, gender, program, and field
  const filteredAdmissions = admissions.filter(admission => {
    if (filterStatus !== 'all' && admission.status !== filterStatus) return false;
    if (filterGrade !== 'all' && admission.applyingGrade !== filterGrade) return false;
    if (filterGender !== 'all' && admission.gender?.toLowerCase() !== filterGender.toLowerCase()) return false;
    if (filterProgram !== 'all' && admission.program !== filterProgram) return false;
    if (filterField !== 'all' && admission.field !== filterField) return false;
    
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      const fullName = `${admission.firstName || ''} ${admission.lastName || ''}`.toLowerCase();
      const parentName = admission.parentName?.toLowerCase() || '';
      const studentId = admission.studentId?.toLowerCase() || '';
      const admissionId = admission.admissionId?.toLowerCase() || '';
      const parentPhone = admission.parentPhone || '';
      const parentEmail = admission.parentEmail?.toLowerCase() || '';
      const age = admission.age?.toString() || '';
      
      return (
        fullName.includes(searchLower) ||
        parentName.includes(searchLower) ||
        studentId.includes(searchLower) ||
        admissionId.includes(searchLower) ||
        parentPhone.includes(searchTerm) ||
        parentEmail.includes(searchLower) ||
        age.includes(searchTerm)
      );
    }
    return true;
  });

  // Get grade-specific gender stats for display
  const getGradeGenderStats = (grade) => {
    const gradeAdmissions = admissions.filter(a => a.applyingGrade === grade);
    const male = gradeAdmissions.filter(a => a.gender?.toLowerCase() === 'male').length;
    const female = gradeAdmissions.filter(a => a.gender?.toLowerCase() === 'female').length;
    return { male, female, total: gradeAdmissions.length };
  };

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'reviewed': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'accepted': return 'bg-green-100 text-green-800 border border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border border-red-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  // Get file icon based on type
  const getFileIcon = (fileName) => {
    if (!fileName) return <FaFileAlt className="text-gray-400" />;
    const ext = fileName.split('.').pop().toLowerCase();
    switch(ext) {
      case 'pdf': return <FaFilePdf className="text-red-500" />;
      case 'jpg': case 'jpeg': case 'png': case 'gif': case 'webp':
        return <FaFileImage className="text-green-500" />;
      case 'doc': case 'docx': return <FaFileWord className="text-blue-500" />;
      case 'xls': case 'xlsx': return <FaFileExcel className="text-green-600" />;
      case 'ppt': case 'pptx': return <FaFilePowerpoint className="text-orange-500" />;
      default: return <FaFileAlt className="text-blue-500" />;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  // Get initials
  const getInitials = (firstName, lastName) => {
    const firstInitial = firstName?.[0]?.toUpperCase() || '?';
    const lastInitial = lastName?.[0]?.toUpperCase() || '?';
    return firstInitial + lastInitial;
  };

  if (loading && admissions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent mx-auto"></div>
          <p className="mt-6 text-lg font-medium text-gray-700">Loading Admissions Dashboard...</p>
          <p className="mt-2 text-sm text-gray-500">Connecting to {API_URL}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <input type="file" ref={fileInputRef} accept="image/*" style={{ display: 'none' }} />
      
      {/* Bulk Export Modal */}
      {showBulkExport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Export Student Information</h3>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="pdf">PDF Document</option>
                  <option value="csv">CSV Spreadsheet</option>
                  <option value="excel">Excel File</option>
                </select>
              </div>
              <div className="mb-6">
                <p className="text-sm text-gray-600">Selected students: <span className="font-semibold">{selectedStudents.length}</span></p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => exportStudentInfo(selectedStudents, exportFormat)}
                  disabled={isLoading}
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {isLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div> : <FaDownload className="mr-2" />}
                  Export Now
                </button>
                <button onClick={() => setShowBulkExport(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Upload Modal */}
      {showDocumentUpload && selectedAdmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Upload Documents</h3>
              <button onClick={() => setShowDocumentUpload(false)}><FaTimes className="text-gray-500 hover:text-gray-700" /></button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
                <select
                  value={newDocumentType}
                  onChange={(e) => setNewDocumentType(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select document type</option>
                  <option value="Birth Certificate">Birth Certificate</option>
                  <option value="Previous School Report">Previous School Report</option>
                  <option value="Transfer Certificate">Transfer Certificate</option>
                  <option value="Medical Certificate">Medical Certificate</option>
                  <option value="Passport Photo">Passport Photo</option>
                  <option value="Parent ID Proof">Parent ID Proof</option>
                  <option value="Address Proof">Address Proof</option>
                  <option value="Other">Other Document</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Files (Multiple allowed)</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setDocumentFiles(Array.from(e.target.files))}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {documentFiles.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600">Selected {documentFiles.length} file(s)</p>
                  </div>
                )}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => uploadStudentDocuments(selectedAdmission._id, documentFiles, newDocumentType)}
                  disabled={uploadingDocuments || !newDocumentType || documentFiles.length === 0}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {uploadingDocuments ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div> : <FaUpload className="mr-2" />}
                  Upload Documents
                </button>
                <button onClick={() => setShowDocumentUpload(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900"><span className="text-indigo-600">Student Admissions</span> Management System</h1>
              <p className="text-gray-600 mt-2">Manage and review student applications and documents - Admin Mode Active</p>
            </div>
            <div className="mt-4 md:mt-0">
              <button onClick={fetchAdmissions} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                Refresh
              </button>
            </div>
          </div>
          
          {/* Quick Action Bar */}
          <div className="mt-6 flex flex-wrap gap-3">
            {selectedStudents.length > 0 && (
              <div className="flex items-center space-x-3 bg-blue-50 p-3 rounded-lg border border-blue-200">
                <span className="text-sm font-medium text-blue-700">{selectedStudents.length} student(s) selected</span>
                <button onClick={() => setShowBulkExport(true)} className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center"><FaDownload className="mr-1" />Export</button>
                <button onClick={() => exportStudentInfo(selectedStudents, 'pdf')} className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 flex items-center"><FaPrint className="mr-1" />Print</button>
                <button onClick={clearSelections} className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50">Clear</button>
              </div>
            )}
          </div>
          
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center"><svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg><span className="text-red-700">{error}</span></div>
            </div>
          )}
        </div>

        {/* Grade and Gender Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'].map(grade => {
            const stats = getGradeGenderStats(grade);
            return (
              <div key={grade} className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-bold text-gray-800">{grade}</h3>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">Total: {stats.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <FaMale className="text-blue-600 text-sm" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Male</p>
                      <p className="text-lg font-bold text-blue-600">{stats.male}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="bg-pink-100 p-2 rounded-lg">
                      <FaFemale className="text-pink-600 text-sm" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Female</p>
                      <p className="text-lg font-bold text-pink-600">{stats.female}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${stats.total ? (stats.male / stats.total) * 100 : 0}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-6"><div className="flex items-center"><div className="p-3 bg-indigo-100 rounded-lg mr-4"><FaUserCircle className="w-6 h-6 text-indigo-600" /></div><div><div className="text-sm font-medium text-gray-500">Total</div><div className="mt-1 text-2xl font-bold text-gray-900">{stats.total}</div></div></div></div>
          <div className="bg-white rounded-xl shadow p-6"><div className="flex items-center"><div className="p-3 bg-yellow-100 rounded-lg mr-4"><svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div><div><div className="text-sm font-medium text-gray-500">Pending</div><div className="mt-1 text-2xl font-bold text-yellow-600">{stats.pending}</div></div></div></div>
          <div className="bg-white rounded-xl shadow p-6"><div className="flex items-center"><div className="p-3 bg-blue-100 rounded-lg mr-4"><svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg></div><div><div className="text-sm font-medium text-gray-500">Reviewed</div><div className="mt-1 text-2xl font-bold text-blue-600">{stats.reviewed}</div></div></div></div>
          <div className="bg-white rounded-xl shadow p-6"><div className="flex items-center"><div className="p-3 bg-green-100 rounded-lg mr-4"><svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div><div><div className="text-sm font-medium text-gray-500">Accepted</div><div className="mt-1 text-2xl font-bold text-green-600">{stats.accepted}</div></div></div></div>
          <div className="bg-white rounded-xl shadow p-6"><div className="flex items-center"><div className="p-3 bg-red-100 rounded-lg mr-4"><svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div><div><div className="text-sm font-medium text-gray-500">Rejected</div><div className="mt-1 text-2xl font-bold text-red-600">{stats.rejected}</div></div></div></div>
          <div className="bg-white rounded-xl shadow p-6"><div className="flex items-center"><div className="p-3 bg-blue-100 rounded-lg mr-4"><FaMale className="w-6 h-6 text-blue-600" /></div><div><div className="text-sm font-medium text-gray-500">Male</div><div className="mt-1 text-2xl font-bold text-blue-600">{stats.male}</div></div></div></div>
          <div className="bg-white rounded-xl shadow p-6"><div className="flex items-center"><div className="p-3 bg-pink-100 rounded-lg mr-4"><FaFemale className="w-6 h-6 text-pink-600" /></div><div><div className="text-sm font-medium text-gray-500">Female</div><div className="mt-1 text-2xl font-bold text-pink-600">{stats.female}</div></div></div></div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Students</label>
              <input type="text" placeholder="Search by name, ID, phone, email, grade..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Grade</label>
              <select value={filterGrade} onChange={(e) => setFilterGrade(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="all">All Grades</option>
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 10">Grade 10</option>
                <option value="Grade 11">Grade 11</option>
                <option value="Grade 12">Grade 12</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Gender</label>
              <select value={filterGender} onChange={(e) => setFilterGender(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="all">All Genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Program</label>
              <select value={filterProgram} onChange={(e) => setFilterProgram(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="all">All Programs</option>
                <option value="Regular Program">Regular Program</option>
                <option value="Night Program">Night Program</option>
           
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Field</label>
              <select value={filterField} onChange={(e) => setFilterField(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="all">All Fields</option>
                <option value="Natural Science">Natural Science</option>
                <option value="Social Science">Social Science</option>
             
              </select>
            </div>
          </div>
          <div className="mt-4 flex space-x-2">
            <button onClick={selectAllFiltered} className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-sm font-medium flex items-center"><FaUsers className="mr-2" />Select All Filtered</button>
            <button onClick={() => { setFilterStatus('all'); setFilterGrade('all'); setFilterGender('all'); setFilterProgram('all'); setFilterField('all'); setSearchTerm(''); clearSelections(); }} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">Clear All Filters</button>
          </div>
        </div>

        {/* Admissions Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div><h2 className="text-lg font-semibold text-gray-900">Student Applications</h2><p className="text-sm text-gray-500">Showing {filteredAdmissions.length} of {admissions.length} applications{selectedStudents.length > 0 && <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">{selectedStudents.length} selected</span>}</p></div>
            <button onClick={() => setShowBulkExport(true)} disabled={selectedStudents.length === 0} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-sm"><FaDownload className="mr-2" />Export</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8"><input type="checkbox" checked={selectedStudents.length === filteredAdmissions.length && filteredAdmissions.length > 0} onChange={selectAllFiltered} className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" /></th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Information</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Academic Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent Information</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status & Actions</th>
                 </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAdmissions.map((admission) => {
                  const studentPhotoUrl = getStudentPhotoUrl(admission);
                  const isSelected = selectedStudents.includes(admission._id);
                  return (
                    <tr key={admission._id} className={`hover:bg-gray-50 transition-colors ${isSelected ? 'bg-blue-50' : ''}`}>
                      <td className="px-6 py-4"><input type="checkbox" checked={isSelected} onChange={() => toggleStudentSelection(admission._id)} className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" /></td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12 relative">
                            {studentPhotoUrl ? (
                              <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-indigo-300"><img src={studentPhotoUrl} alt={`${admission.firstName} ${admission.lastName}`} className="h-full w-full object-cover" onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }} /></div>
                            ) : (
                              <div className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">{getInitials(admission.firstName, admission.lastName)}</div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">{admission.firstName} {admission.lastName}</div>
                            <div className="text-sm text-gray-500">ID: {admission.studentId || admission.admissionId || 'N/A'}</div>
                            <div className="text-xs text-gray-400 mt-1">{admission.gender} • {admission.age} yrs</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{admission.applyingGrade}</div>
                        <div className="text-sm text-gray-500 flex items-center mt-1"><FaSchool className="w-3 h-3 mr-1" />{admission.lastSchool || 'Not specified'}</div>
                        <div className="text-xs text-gray-400 mt-1">Avg: {admission.gradeAverage || 'N/A'}%</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{admission.parentName}</div>
                        <div className="text-sm text-gray-500 flex items-center mt-1"><FaPhone className="w-3 h-3 mr-1" />{admission.parentPhone}</div>
                        <div className="text-sm text-gray-500 flex items-center mt-1"><FaEnvelope className="w-3 h-3 mr-1" />{admission.parentEmail}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col space-y-2">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(admission.status)}`}>{admission.status?.toUpperCase() || 'PENDING'}</span>
                          <select value={admission.status || 'pending'} onChange={(e) => updateStatus(admission._id, e.target.value)} className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                          </select>
                          <div className="flex space-x-2">
                            <button onClick={() => printStudentInfo(admission._id)} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center"><FaPrint className="w-3 h-3 mr-1" />Print</button>
                            <button onClick={() => { setSelectedAdmission(admission); fetchStudentDocuments(admission._id); setIsEditing(false); }} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 flex items-center"><FaEye className="w-3 h-3 mr-1" />View</button>
                            <button onClick={() => deleteAdmission(admission._id)} className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 flex items-center"><FaTrash className="w-3 h-3 mr-1" />Delete</button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {filteredAdmissions.length === 0 && !loading && (
            <div className="text-center py-12"><div className="text-gray-400 text-lg">No applications found</div><p className="text-gray-500 mt-2">Try adjusting your search or filters</p></div>
          )}
        </div>
      </div>

      {/* Student Detail Modal with Edit Functionality */}
      {selectedAdmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex items-start justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden my-4 sm:my-auto">
            <div className="px-4 py-3 sm:px-6 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-start w-full">
                  <div className="relative mr-3">
                    <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full overflow-hidden border-2 sm:border-4 border-white relative group cursor-pointer" onClick={() => handlePhotoSelect(selectedAdmission._id)}>
                      {getStudentPhotoUrl(selectedAdmission) ? (
                        <img src={getStudentPhotoUrl(selectedAdmission)} alt={`${selectedAdmission.firstName} ${selectedAdmission.lastName}`} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-white to-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg sm:text-2xl">{getInitials(selectedAdmission.firstName, selectedAdmission.lastName)}</div>
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><FaCamera className="w-4 h-4 sm:w-6 sm:h-6 text-white" /></div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    {!isEditing ? (
                      <>
                        <h3 className="text-lg sm:text-2xl font-bold truncate">{selectedAdmission.firstName} {selectedAdmission.lastName}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="text-xs sm:text-sm bg-white bg-opacity-20 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full">ID: {selectedAdmission.studentId || selectedAdmission.admissionId || 'N/A'}</span>
                          <span className={`px-2 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm font-semibold rounded-full ${getStatusColor(selectedAdmission.status)}`}>{selectedAdmission.status?.toUpperCase()}</span>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input type="text" name="firstName" value={editFormData.firstName} onChange={handleEditChange} placeholder="First Name" className="text-sm px-2 py-1 rounded text-gray-800 w-28" />
                          <input type="text" name="lastName" value={editFormData.lastName} onChange={handleEditChange} placeholder="Last Name" className="text-sm px-2 py-1 rounded text-gray-800 w-28" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!isEditing ? (
                    <button onClick={handleEditClick} className="px-3 py-1.5 sm:px-4 sm:py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center text-xs sm:text-sm"><FaEdit className="mr-1" />Edit</button>
                  ) : (
                    <>
                      <button onClick={handleEditSubmit} disabled={editLoading} className="px-3 py-1.5 sm:px-4 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center text-xs sm:text-sm"><FaSave className="mr-1" />Save</button>
                      <button onClick={() => setIsEditing(false)} className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center text-xs sm:text-sm"><FaTimesCircle className="mr-1" />Cancel</button>
                    </>
                  )}
                  <button onClick={() => printStudentInfo(selectedAdmission._id)} className="px-3 py-1.5 sm:px-4 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center text-xs sm:text-sm"><FaPrint className="mr-1" />Print</button>
                  <button onClick={() => setSelectedAdmission(null)} className="text-white hover:text-gray-200 p-1.5 sm:p-2 rounded-full hover:bg-white hover:bg-opacity-20"><svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-120px)] sm:max-h-[70vh]">
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                {/* Student Information Section - Editable */}
                <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Student Information</h4>
                  {!isEditing ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div><label className="block text-xs sm:text-sm font-medium text-gray-500">Full Name</label><p className="mt-1 text-sm sm:text-lg font-semibold text-gray-900">{selectedAdmission.firstName} {selectedAdmission.lastName} {selectedAdmission.grandParentName}</p></div>
                      <div><label className="block text-xs sm:text-sm font-medium text-gray-500">Age</label><p className="mt-1 text-sm sm:text-lg font-semibold text-gray-900">{selectedAdmission.age} years</p></div>
                      <div><label className="block text-xs sm:text-sm font-medium text-gray-500">Gender & DOB</label><p className="mt-1 text-sm sm:text-lg font-semibold text-gray-900">{selectedAdmission.gender} • {selectedAdmission.dob ? new Date(selectedAdmission.dob).toLocaleDateString() : 'N/A'}</p></div>
                      <div><label className="block text-xs sm:text-sm font-medium text-gray-500">Nationality</label><p className="mt-1 text-sm sm:text-lg font-semibold text-gray-900">{selectedAdmission.nationality || 'N/A'}</p></div>
                      <div><label className="block text-xs sm:text-sm font-medium text-gray-500">FAN Number</label><p className="mt-1 text-sm sm:text-lg font-semibold text-gray-900">{selectedAdmission.fayida || 'N/A'}</p></div>
                      <div><label className="block text-xs sm:text-sm font-medium text-gray-500">Program</label><p className="mt-1 text-sm sm:text-lg font-semibold text-gray-900">{selectedAdmission.program || 'N/A'}</p></div>
                      <div><label className="block text-xs sm:text-sm font-medium text-gray-500">Field</label><p className="mt-1 text-sm sm:text-lg font-semibold text-gray-900">{selectedAdmission.field || 'N/A'}</p></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div><label className="block text-xs sm:text-sm font-medium text-gray-700">First Name</label><input type="text" name="firstName" value={editFormData.firstName} onChange={handleEditChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm" /></div>
                      <div><label className="block text-xs sm:text-sm font-medium text-gray-700">Last Name</label><input type="text" name="lastName" value={editFormData.lastName} onChange={handleEditChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm" /></div>
                      <div><label className="block text-xs sm:text-sm font-medium text-gray-700">Grand Parent Name</label><input type="text" name="grandParentName" value={editFormData.grandParentName} onChange={handleEditChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm" /></div>
                      <div><label className="block text-xs sm:text-sm font-medium text-gray-700">Gender</label><select name="gender" value={editFormData.gender} onChange={handleEditChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm"><option value="">Select</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select></div>
                      <div><label className="block text-xs sm:text-sm font-medium text-gray-700">Date of Birth</label><input type="date" name="dob" value={editFormData.dob} onChange={handleEditChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm" /></div>
                      <div><label className="block text-xs sm:text-sm font-medium text-gray-700">Age</label><input type="number" name="age" value={editFormData.age} onChange={handleEditChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm" /></div>
                      <div><label className="block text-xs sm:text-sm font-medium text-gray-700">Nationality</label><input type="text" name="nationality" value={editFormData.nationality} onChange={handleEditChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm" /></div>
                      <div><label className="block text-xs sm:text-sm font-medium text-gray-700">FAN/FIN</label><input type="text" name="fayida" value={editFormData.fayida} onChange={handleEditChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm" /></div>
                      <div><label className="block text-xs sm:text-sm font-medium text-gray-700">Program</label><input type="text" name="program" value={editFormData.program} onChange={handleEditChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm" /></div>
                      <div><label className="block text-xs sm:text-sm font-medium text-gray-700">Field</label><input type="text" name="field" value={editFormData.field} onChange={handleEditChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm" /></div>
                      <div><label className="block text-xs sm:text-sm font-medium text-gray-700">Religion</label><input type="text" name="religion" value={editFormData.religion} onChange={handleEditChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm" /></div>
                    </div>
                  )}
                </div>

                {/* Academic Information Section - Editable */}
                <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Academic Information</h4>
                  {!isEditing ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div><label className="block text-xs sm:text-sm font-medium text-gray-500">Applying Grade</label><p className="mt-1 text-sm sm:text-lg font-semibold text-gray-900">{selectedAdmission.applyingGrade}</p></div>
                      <div><label className="block text-xs sm:text-sm font-medium text-gray-500">Last School</label><p className="mt-1 text-sm sm:text-lg font-semibold text-gray-900">{selectedAdmission.lastSchool}</p></div>
                      <div><label className="block text-xs sm:text-sm font-medium text-gray-500">Last Grade</label><p className="mt-1 text-sm sm:text-lg font-semibold text-gray-900">{selectedAdmission.lastGrade}</p></div>
                      <div><label className="block text-xs sm:text-sm font-medium text-gray-500">Grade Average</label><p className="mt-1 text-sm sm:text-lg font-semibold text-gray-900">{selectedAdmission.gradeAverage}%</p></div>
                      <div><label className="block text-xs sm:text-sm font-medium text-gray-500">Condition</label><p className="mt-1 text-sm sm:text-lg font-semibold text-gray-900">{selectedAdmission.condition || 'N/A'}</p></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div><label className="block text-xs sm:text-sm font-medium text-gray-700">Applying Grade</label><select name="applyingGrade" value={editFormData.applyingGrade} onChange={handleEditChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm"><option value="">Select</option><option value="Grade 9">Grade 9</option><option value="Grade 10">Grade 10</option><option value="Grade 11">Grade 11</option><option value="Grade 12">Grade 12</option></select></div>
                      <div><label className="block text-xs sm:text-sm font-medium text-gray-700">Last School</label><input type="text" name="lastSchool" value={editFormData.lastSchool} onChange={handleEditChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm" /></div>
                      <div><label className="block text-xs sm:text-sm font-medium text-gray-700">Last Grade</label><input type="text" name="lastGrade" value={editFormData.lastGrade} onChange={handleEditChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm" /></div>
                      <div><label className="block text-xs sm:text-sm font-medium text-gray-700">Grade Average (%)</label><input type="number" name="gradeAverage" value={editFormData.gradeAverage} onChange={handleEditChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm" /></div>
                      <div><label className="block text-xs sm:text-sm font-medium text-gray-700">Condition</label><input type="text" name="condition" value={editFormData.condition} onChange={handleEditChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm" placeholder="e.g., Regular, Conditional" /></div>
                    </div>
                  )}
                </div>

                {/* Parent Information Section - Editable */}
                <div className="bg-indigo-50 rounded-xl p-4 sm:p-6">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Parent/Guardian Information</h4>
                  {!isEditing ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div><label className="block text-xs sm:text-sm font-medium text-gray-500">Full Name</label><p className="mt-1 text-sm sm:text-lg font-semibold text-gray-900">{selectedAdmission.parentName}</p></div>
                      <div><label className="block text-xs sm:text-sm font-medium text-gray-500">Relationship</label><p className="mt-1 text-sm sm:text-lg font-semibold text-gray-900">{selectedAdmission.relationship}</p></div>
                      <div><label className="block text-xs sm:text-sm font-medium text-gray-500">Phone</label><p className="mt-1 text-sm sm:text-lg font-semibold text-gray-900">{selectedAdmission.parentPhone}</p></div>
                      <div><label className="block text-xs sm:text-sm font-medium text-gray-500">Email</label><p className="mt-1 text-sm sm:text-lg font-semibold text-gray-900 break-all">{selectedAdmission.parentEmail}</p></div>
                      <div className="sm:col-span-2"><label className="block text-xs sm:text-sm font-medium text-gray-500">Address</label><p className="mt-1 text-sm sm:text-lg font-semibold text-gray-900">{selectedAdmission.address}</p></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div><label className="block text-xs sm:text-sm font-medium text-gray-700">Parent Name</label><input type="text" name="parentName" value={editFormData.parentName} onChange={handleEditChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm" /></div>
                      <div><label className="block text-xs sm:text-sm font-medium text-gray-700">Relationship</label><input type="text" name="relationship" value={editFormData.relationship} onChange={handleEditChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm" /></div>
                      <div><label className="block text-xs sm:text-sm font-medium text-gray-700">Phone</label><input type="tel" name="parentPhone" value={editFormData.parentPhone} onChange={handleEditChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm" /></div>
                      <div><label className="block text-xs sm:text-sm font-medium text-gray-700">Email</label><input type="email" name="parentEmail" value={editFormData.parentEmail} onChange={handleEditChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm" /></div>
                      <div className="sm:col-span-2"><label className="block text-xs sm:text-sm font-medium text-gray-700">Address</label><textarea name="address" value={editFormData.address} onChange={handleEditChange} rows="2" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm"></textarea></div>
                    </div>
                  )}
                </div>

                {/* Documents Section with Upload and Management */}
                <div className="mt-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                    <h4 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center"><FaFolderOpen className="mr-2 text-indigo-600" />Student Documents</h4>
                    <div className="flex gap-2">
                      <button onClick={() => fetchStudentDocuments(selectedAdmission._id)} className="px-3 py-1.5 sm:px-4 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs sm:text-sm"><FaFolderOpen className="inline mr-1" />Refresh</button>
                      <button onClick={() => setShowDocumentUpload(true)} className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs sm:text-sm"><FaUpload className="inline mr-1" />Upload</button>
                      <button onClick={() => downloadAllDocuments(selectedAdmission._id, `${selectedAdmission.firstName}_${selectedAdmission.lastName}`)} className="px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-xs sm:text-sm" disabled={isLoading}>{isLoading ? 'Downloading...' : <><FaDownload className="inline mr-1" />Download All</>}</button>
                    </div>
                  </div>
                  
                  {documentsLoading ? (
                    <div className="text-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div><p className="mt-2 text-gray-600">Loading documents...</p></div>
                  ) : studentDocuments.length > 0 ? (
                    <div className="bg-white border rounded-xl overflow-hidden">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                        {studentDocuments.map((doc, idx) => (
                          <div key={idx} className="border rounded-lg p-3 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center">
                                <div className="text-3xl mr-3">{getFileIcon(doc.filename)}</div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sm truncate">{doc.type || 'Document'}</div>
                                  <div className="text-xs text-gray-500 truncate">{doc.filename}</div>
                                  <div className="text-xs text-gray-400">{(doc.size / 1024).toFixed(1)} KB</div>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-3">
                              <button onClick={() => openDocument(doc)} className="flex-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"><FaEye className="inline mr-1" />View</button>
                              <a href={getFileUrl(doc.url)} download={doc.filename} className="flex-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs text-center"><FaDownload className="inline mr-1" />Download</a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-xl"><FaFolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-2" /><p className="text-gray-500">No documents available</p><button onClick={() => setShowDocumentUpload(true)} className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg text-sm"><FaUpload className="inline mr-1" />Upload Documents</button></div>
                  )}
                </div>
              </div>
            </div>

            <div className="px-4 py-3 sm:px-6 sm:py-4 bg-gray-50 border-t flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="text-xs sm:text-sm text-gray-500">Applied: {formatDate(selectedAdmission.createdAt)}</div>
              <div className="flex gap-2 w-full sm:w-auto">
                <select value={editFormData.status || selectedAdmission.status} onChange={(e) => updateStatus(selectedAdmission._id, e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
                <button onClick={() => setSelectedAdmission(null)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;