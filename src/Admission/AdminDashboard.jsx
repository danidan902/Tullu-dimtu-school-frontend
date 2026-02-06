import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import {
  FaUserCircle, FaPhone, FaEnvelope, FaSchool, FaFilePdf, 
  FaFileImage, FaFileAlt, 
  FaPrint, FaDownload, FaEye, FaFolderOpen, FaCamera, FaTimes,
  FaUsers, FaFileWord, FaFileExcel, FaFilePowerpoint,
  FaTrash, FaUpload, 
  FaMale, FaFemale
} from 'react-icons/fa';
 
const API_URL = process.env.REACT_APP_API_URL || 'https://tullu-dimtu-school-backend-1.onrender.com';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingFile, setViewingFile] = useState(null);
  const [studentDocuments, setStudentDocuments] = useState([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);
  
  // New states for enhanced features
  // const [editingField, setEditingField] = useState(null);
  // const [editValue, setEditValue] = useState('');
  // const [bulkActions, setBulkActions] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [uploadingDocuments, setUploadingDocuments] = useState(false);
  const [documentFiles, setDocumentFiles] = useState([]);
  const [showBulkExport, setShowBulkExport] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [newDocumentType, setNewDocumentType] = useState('');
  const [teachers, setTeachers] = useState([]);
  // const [assignedTeacher, setAssignedTeacher] = useState('');

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

  // Function to calculate all stats from admissions data
  const calculateAllStats = (admissionsData) => {
    const total = admissionsData.length;
    const pending = admissionsData.filter(a => a.status === 'pending').length;
    const reviewed = admissionsData.filter(a => a.status === 'reviewed').length;
    const accepted = admissionsData.filter(a => a.status === 'accepted').length;
    const rejected = admissionsData.filter(a => a.status === 'rejected').length;
    
    // Calculate gender counts
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
        
        // Reset selection when data refreshes
        setSelectedStudents([]);
      } else {
        setError('Failed to fetch admissions: ' + (response.data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('❌ Fetch error:', error);
      setError(`Failed to connect to server. Please check if backend is running at ${API_URL}`);
    } finally {
      setLoading(false);
    }
    setIsLoading(false);
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

  // Fetch student documents
  const fetchStudentDocuments = async (studentId) => {
    try {
      setDocumentsLoading(true);
      console.log('📁 Fetching documents for student:', studentId);
      
      const response = await axios.get(`${API_URL}/api/admissions/${studentId}/documents`);
      
      if (response.data.success) {
        console.log('📄 Documents received:', response.data.documents);
        setStudentDocuments(response.data.documents || []);
        
        // If there are documents, open the first one
        if (response.data.documents && response.data.documents.length > 0) {
          openDocument(response.data.documents[0]);
        }
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
    
    // If it's already a full URL
    if (filePath.startsWith('http')) {
      return filePath;
    }
    
    // If it's a relative path starting with /
    if (filePath.startsWith('/')) {
      return `${API_URL}${filePath}`;
    }
    
    // If it's just a filename
    return `${API_URL}/uploads/${filePath}`;
  };

  // Get student photo URL
  const getStudentPhotoUrl = (admission) => {
    if (!admission) return null;
    
    // Check if photo object exists with secure_url
    if (admission.photo?.secure_url) {
      return admission.photo.secure_url;
    }
    
    // Check if photo object has url
    if (admission.photo?.url) {
      return admission.photo.url;
    }
    
    // Check if there's a photo field directly
    if (admission.photo && typeof admission.photo === 'string') {
      return getFileUrl(admission.photo);
    }
    
    // Check for studentPhoto field
    if (admission.studentPhoto) {
      return getFileUrl(admission.studentPhoto);
    }
    
    // Return null if no photo
    return null;
  };

  // Open a document in new tab
  const openDocument = (document) => {
    if (!document || !document.url) {
      console.error('No document URL provided');
      return;
    }
    
    const fileUrl = getFileUrl(document.url);
    console.log('Opening document:', fileUrl);
    
    if (fileUrl) {
      setViewingFile(document);
      window.open(fileUrl, '_blank');
    }
  };

  // Download all documents as zip
  const downloadAllDocuments = async (studentId, studentName) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/api/admissions/${studentId}/documents/download`,
        { responseType: 'blob' }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${studentName}-documents.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading documents:', error);
      alert('Failed to download documents');
    }
    setIsLoading(false);
  };

  // NEW: Bulk export student information with Excel support
  const exportStudentInfo = async (studentIds, format = 'pdf') => {
    if (!studentIds || studentIds.length === 0) {
      alert('Please select at least one student to export');
      return;
    }
    
    setIsLoading(true);
    try {
      // For Excel export using client-side generation
      if (format === 'excel') {
        // Create Excel data from selected students
        const selectedStudents = admissions.filter(admission => 
          studentIds.includes(admission._id)
        );
        
        // Prepare Excel data
        const excelData = selectedStudents.map(student => ({
          'Student ID': student.studentId || student.admissionId || 'N/A',
          'First Name': student.firstName || '',
          'Last Name': student.lastName || '',
          'Full Name': `${student.firstName || ''} ${student.lastName || ''} ${student.grandParentName || ''}`.trim(),
          'grandParentName': student.grandParentName || 'N/A',
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
          'gradeAverage': student.gradeAverage || 'N/A',
          'Status': student.status || 'pending',
          'Application Date': student.createdAt ? new Date(student.createdAt).toLocaleDateString() : 'N/A',
          'Last Updated': student.updatedAt ? new Date(student.updatedAt).toLocaleDateString() : 'N/A',
          'Registration Condition': student.condition || 'N/A',
          'FAN/FIN': student.fayida || 'N/A',
          'Program': student.program || 'N/A',
          'field': student.field || 'N/A',

        }));
        
        // Create worksheet
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        
        // Create workbook
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
        
        // Generate Excel file
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { 
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().split('T')[0];
        
        link.href = url;
        link.setAttribute('download', `students-data-${timestamp}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        
        setShowBulkExport(false);
        alert(`Exported ${studentIds.length} student(s) to Excel successfully!`);
        setIsLoading(false);
        return;
      }
      
      // For PDF, CSV, or other formats, use the existing backend API
      const response = await axios.post(
        `${API_URL}/api/admissions/export`,
        { studentIds, format },
        { 
          responseType: 'blob',
          timeout: 30000 // 30 seconds timeout for large exports
        }
      );
      
      // Create blob from response
      const blob = new Blob([response.data], {
        type: response.headers['content-type']
      });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().split('T')[0];
      
      // Set filename based on format
      let fileName;
      switch(format) {
        case 'pdf':
          fileName = `students-report-${timestamp}.pdf`;
          break;
        case 'csv':
          fileName = `students-data-${timestamp}.csv`;
          break;
        case 'excel':
          fileName = `students-data-${timestamp}.xlsx`;
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
      
      // Show specific error messages
      if (error.response) {
        if (error.response.status === 404) {
          alert('Export feature is not available on the server. Please contact administrator to set up export functionality.');
        } else if (error.response.status === 500) {
          alert('Server error occurred while exporting. Please try again later.');
        } else {
          alert(`Export failed: ${error.response.data?.message || 'Unknown error'}`);
        }
      } else if (error.request) {
        alert('No response from server. Please check your connection.');
      } else {
        alert(`Failed to export: ${error.message}`);
      }
    }
    setIsLoading(false);
  };

  // NEW: Upload multiple documents
  const uploadStudentDocuments = async (studentId, files, documentType) => {
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
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      if (response.data.success) {
        alert(`Successfully uploaded ${files.length} document(s)`);
        setShowDocumentUpload(false);
        setDocumentFiles([]);
        setNewDocumentType('');
        
        // Refresh documents list
        if (selectedAdmission && selectedAdmission._id === studentId) {
          fetchStudentDocuments(studentId);
        }
      }
    } catch (error) {
      console.error('Document upload error:', error);
      alert('Failed to upload documents');
    } finally {
      setUploadingDocuments(false);
    }
  };

  // NEW: Print student information WITH PHOTO
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
                    <div class="school_motto">Excellence in Education Since 2000</div>
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
       

        
</body>
</html>
`);
    printWindow.document.close();
  };

  // Update admission status - FIXED VERSION
  const updateStatus = async (id, newStatus) => {
    try {
      const response = await axios.patch(`${API_URL}/api/admissions/${id}/status`, {
        status: newStatus
      });
      
      if (response.data.success) {
        // Update local state
        setAdmissions(prevAdmissions => 
          prevAdmissions.map(admission => 
            admission._id === id ? { ...admission, status: newStatus } : admission
          )
        );
        
        console.log(`✅ Status updated to ${newStatus}`);
        
        // Show success message
        alert(`Status updated to ${newStatus} successfully!`);
      } else {
        alert('Failed to update status: ' + (response.data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Status update error:', error);
      alert('Failed to update status. Please check connection.');
    }
  };

  // Upload student photo - FIXED VERSION
  const uploadStudentPhoto = async (studentId, file) => {
    try {
      setUploadingPhoto(true);
      
      const formData = new FormData();
      formData.append('photo', file);
      
      const response = await axios.post(
        `${API_URL}/api/admissions/${studentId}/upload-photo`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      if (response.data.success) {
        // Update local state
        const updatedAdmission = response.data.data;
        setAdmissions(prevAdmissions => 
          prevAdmissions.map(admission => 
            admission._id === studentId ? updatedAdmission : admission
          )
        );
        
        // Update selected admission if open
        if (selectedAdmission && selectedAdmission._id === studentId) {
          setSelectedAdmission(updatedAdmission);
        }
        
        // Clear preview
        setPhotoPreview(null);
        
        alert('Photo uploaded successfully!');
      } else {
        alert('Failed to upload photo: ' + (response.data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Photo upload error:', error);
      alert('Failed to upload photo. Please check connection.');
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
          // Validate file type
          const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
          if (!validTypes.includes(file.type)) {
            alert('Please select a valid image file (JPEG, PNG, GIF)');
            return;
          }
          
          // Validate file size (max 5MB)
          if (file.size > 5 * 1024 * 1024) {
            alert('File size too large. Maximum size is 5MB');
            return;
          }
          
          // Create preview
          const reader = new FileReader();
          reader.onload = (e) => {
            setPhotoPreview(e.target.result);
          };
          reader.readAsDataURL(file);
          
          // Upload photo
          uploadStudentPhoto(studentId, file);
        }
      };
    }
  };

  // Delete admission - FIXED VERSION
  const deleteAdmission = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this admission application? This will also delete all associated files."
    );

    if (!confirmDelete) return;

    try {
      const admissionToDelete = admissions.find(a => a._id === id);

      // const loadingToast = toast.loading("Deleting...");

      const response = await axios.delete(`${API_URL}/api/admissions/${id}`);

      if (response.data.success) {
        // Remove from list using functional update
        setAdmissions(prevAdmissions => 
          prevAdmissions.filter(admission => admission._id !== id)
        );

        // Close modal if open
        if (selectedAdmission && selectedAdmission._id === id) {
          setSelectedAdmission(null);
        }

        // Remove from selection
        setSelectedStudents(prev => 
          prev.filter(studentId => studentId !== id)
        );

        alert('Admission deleted successfully!');
      } else {
        alert('Failed to delete: ' + (response.data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete admission. Please check connection.");
    }
  };

  // NEW: Toggle student selection
  const toggleStudentSelection = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  // NEW: Select all filtered students
  const selectAllFiltered = () => {
    const filteredIds = filteredAdmissions.map(a => a._id);
    setSelectedStudents(filteredIds);
  };

  // NEW: Clear all selections
  const clearSelections = () => {
    setSelectedStudents([]);
  };

  // Filter admissions
  const filteredAdmissions = admissions.filter(admission => {
    if (filterStatus !== 'all' && admission.status !== filterStatus) return false;
    if (filterGrade !== 'all' && admission.applyingGrade !== filterGrade) return false;
    
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      const fullName = `${admission.firstName || ''} ${admission.lastName || ''}`.toLowerCase();
      const parentName = admission.parentName?.toLowerCase() || '';
      const studentId = admission.studentId?.toLowerCase() || '';
      const admissionId = admission.admissionId?.toLowerCase() || '';
      const parentPhone = admission.parentPhone || '';
      const parentEmail = admission.parentEmail?.toLowerCase() || '';
      const age = admission.age ?.toString() || '';
      
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
      case 'pdf':
        return <FaFilePdf className="text-red-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FaFileImage className="text-green-500" />;
      case 'doc':
      case 'docx':
        return <FaFileWord className="text-blue-500" />;
      case 'xls':
      case 'xlsx':
        return <FaFileExcel className="text-green-600" />;
      case 'ppt':
      case 'pptx':
        return <FaFilePowerpoint className="text-orange-500" />;
      default:
        return <FaFileAlt className="text-blue-500" />;
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
      {/* Hidden file input for photo upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: 'none' }}
      />
      
      {/* Bulk Export Modal */}
      {showBulkExport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Export Student Information</h3>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Export Format
                </label>
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
                <p className="text-sm text-gray-600">
                  Selected students: <span className="font-semibold">{selectedStudents.length}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {exportFormat === 'pdf' ? 'Generates a printable PDF report' : 
                   exportFormat === 'csv' ? 'Creates a CSV file for spreadsheet software' :
                   'Creates an Excel file with all student data'}
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => exportStudentInfo(selectedStudents, exportFormat)}
                  disabled={isLoading}
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Exporting...
                    </>
                  ) : (
                    <>
                      <FaDownload className="mr-2" />
                      Export Now
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowBulkExport(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
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
              <button onClick={() => setShowDocumentUpload(false)}>
                <FaTimes className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Type
                </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Files (Multiple allowed)
                </label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setDocumentFiles(Array.from(e.target.files))}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {documentFiles.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600">
                      Selected {documentFiles.length} file(s):
                    </p>
                    <ul className="mt-2 space-y-1">
                      {documentFiles.map((file, index) => (
                        <li key={index} className="text-xs text-gray-500 flex items-center">
                          <FaFileAlt className="mr-2 text-gray-400" />
                          {file.name} ({(file.size / 1024).toFixed(1)} KB)
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => uploadStudentDocuments(selectedAdmission._id, documentFiles, newDocumentType)}
                  disabled={uploadingDocuments || !newDocumentType || documentFiles.length === 0}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {uploadingDocuments ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <FaUpload className="mr-2" />
                      Upload Documents
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowDocumentUpload(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header with Teacher Options */}
        <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                <span className="text-indigo-600">Student Admissions</span> Management System
              </h1>
              <p className="text-gray-600 mt-2">Manage and review student applications and documents - Teacher Mode Active</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Connected Teachers</p>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm font-medium text-gray-700">{teachers.length} Active</span>
                  </div>
                </div>
                <button
                  onClick={fetchAdmissions}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </div>
            </div>
          </div>
          
          {/* Quick Action Bar */}
          <div className="mt-6 flex flex-wrap gap-3">
            {selectedStudents.length > 0 && (
              <div className="flex items-center space-x-3 bg-blue-50 p-3 rounded-lg border border-blue-200">
                <span className="text-sm font-medium text-blue-700">
                  {selectedStudents.length} student(s) selected
                </span>
                <button
                  onClick={() => setShowBulkExport(true)}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center"
                >
                  <FaDownload className="mr-1" />
                  Export Selected
                </button>
                <button
                  onClick={() => exportStudentInfo(selectedStudents, 'pdf')}
                  className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 flex items-center"
                >
                  <FaPrint className="mr-1" />
                  Print Selected
                </button>
                <button
                  onClick={clearSelections}
                  className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
          
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Stats Overview with Gender Counts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-indigo-100 rounded-lg mr-4">
                <FaUserCircle className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Total Applications</div>
                <div className="mt-1 text-2xl font-bold text-gray-900">{stats.total}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg mr-4">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Pending Review</div>
                <div className="mt-1 text-2xl font-bold text-yellow-600">{stats.pending}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Reviewed</div>
                <div className="mt-1 text-2xl font-bold text-blue-600">{stats.reviewed}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Accepted</div>
                <div className="mt-1 text-2xl font-bold text-green-600">{stats.accepted}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg mr-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Rejected</div>
                <div className="mt-1 text-2xl font-bold text-red-600">{stats.rejected}</div>
              </div>
            </div>
          </div>

          {/* Male Count */}
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <FaMale className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Male Students</div>
                <div className="mt-1 text-2xl font-bold text-blue-600">{stats.male}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {stats.total > 0 ? `${Math.round((stats.male / stats.total) * 100)}% of total` : '0%'}
                </div>
              </div>
            </div>
          </div>

          {/* Female Count */}
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-pink-100 rounded-lg mr-4">
                <FaFemale className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Female Students</div>
                <div className="mt-1 text-2xl font-bold text-pink-600">{stats.female}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {stats.total > 0 ? `${Math.round((stats.female / stats.total) * 100)}% of total` : '0%'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Search and Filters with Bulk Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Students</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, ID, phone, email, grade..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Grade</label>
              <select
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Grades</option>
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 10">Grade 10</option>
                <option value="Grade 11">Grade 11</option>
                <option value="Grade 12">Grade 12</option>
              </select>
            </div>
            
            <div className="flex flex-col space-y-2">
              <div className="flex space-x-2">
                <button
                  onClick={selectAllFiltered}
                  className="flex-1 px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-sm font-medium flex items-center justify-center"
                >
                  <FaUsers className="mr-1" />
                  Select All
                </button>
                <button
                  onClick={() => {
                    setFilterStatus('all');
                    setFilterGrade('all');
                    setSearchTerm('');
                    clearSelections();
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Admissions Table with Selection */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Student Applications</h2>
              <p className="text-sm text-gray-500">
                Showing {filteredAdmissions.length} of {admissions.length} applications
                {selectedStudents.length > 0 && (
                  <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    {selectedStudents.length} selected
                  </span>
                )}
              </p>
              {/* Gender Summary */}
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-xs text-gray-600">Male: {stats.male}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                  <span className="text-xs text-gray-600">Female: {stats.female}</span>
                </div>
                {stats.otherGender > 0 && (
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                    <span className="text-xs text-gray-600">Other: {stats.otherGender}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowBulkExport(true)}
                disabled={selectedStudents.length === 0}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-sm"
              >
                <FaDownload className="mr-2" />
                Export
              </button>
              <div className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                    <input
                      type="checkbox"
                      checked={selectedStudents.length === filteredAdmissions.length && filteredAdmissions.length > 0}
                      onChange={selectAllFiltered}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student Information
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Academic Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Parent Information
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status & Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAdmissions.map((admission) => {
                  const studentPhotoUrl = getStudentPhotoUrl(admission);
                  const isSelected = selectedStudents.includes(admission._id);
                  
                  return (
                    <tr key={admission._id} className={`hover:bg-gray-50 transition-colors ${isSelected ? 'bg-blue-50' : ''}`}>
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleStudentSelection(admission._id)}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12 relative">
                            {studentPhotoUrl ? (
                              <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-indigo-300">
                                <img 
                                  src={studentPhotoUrl} 
                                  alt={`${admission.firstName} ${admission.lastName}`}
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.style.display = 'none';
                                    e.target.parentElement.innerHTML = `
                                      <div class="h-12 w-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                        ${getInitials(admission.firstName, admission.lastName)}
                                      </div>
                                    `;
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                {getInitials(admission.firstName, admission.lastName)}
                              </div>
                            )}
                            {!studentPhotoUrl && (
                              <div className="absolute -bottom-1 -right-1 bg-indigo-100 rounded-full p-1 border border-white">
                                <FaCamera className="w-3 h-3 text-indigo-600" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">
                              {admission.firstName} {admission.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              <span className={`inline-flex items-center px-2 py-1 text-xs rounded mr-2 ${
                                admission.gender === 'Male' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : admission.gender === 'Female' 
                                  ? 'bg-pink-100 text-pink-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {admission.gender === 'Male' && <FaMale className="w-2 h-2 mr-1" />}
                                {admission.gender === 'Female' && <FaFemale className="w-2 h-2 mr-1" />}
                                {admission.gender || 'N/A'}
                              </span>
                              <span className='inline-block px-2 py-1 text-xs bg-gray-100 rounded mr-2'>
                                {admission.age ? `${admission.age} yrs` : 'N/A'}
                              </span>
                              <span className="inline-block px-2 py-1 text-xs bg-gray-100 rounded">
                                {admission.gradeAverage ? `Avg: ${admission.gradeAverage}%` : 'N/A'}
                              </span>
                              <span className="text-xs">
                                {admission.dob ? new Date(admission.dob).toLocaleDateString() : 'N/A'}
                              </span>
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              ID: {admission.studentId || admission.admissionId || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{admission.applyingGrade}</div>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <FaSchool className="w-3 h-3 mr-1" />
                          {admission.lastSchool || 'Not specified'}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Previous: {admission.lastGrade || 'N/A'}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{admission.parentName}</div>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <FaPhone className="w-3 h-3 mr-1" />
                          {admission.parentPhone}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <FaEnvelope className="w-3 h-3 mr-1" />
                          {admission.parentEmail}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(admission.status)}`}>
                              {admission.status?.toUpperCase() || 'PENDING'}
                            </span>
                            {admission.assignedTeacher && (
                              <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                                Assigned
                              </span>
                            )}
                          </div>
                          <select
                            value={admission.status || 'pending'}
                            onChange={(e) => updateStatus(admission._id, e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          >
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                          </select>


                          <div className="flex space-x-2">
                            <button
                              onClick={() => printStudentInfo(admission._id)}
                              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex items-center"
                            >
                              <FaPrint className="w-3 h-3 mr-1" />
                              Print
                            </button>
                            <button
                              onClick={() => {
                                setSelectedAdmission(admission);
                                fetchStudentDocuments(admission._id);
                              }}
                              className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors flex items-center"
                            >
                              <FaEye className="w-3 h-3 mr-1" />
                              View
                            </button>

                             <button 
                            onClick={() => deleteAdmission(admission._id)}
                              className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors flex items-center"
                            >
                              <FaTrash className="w-3 h-3 mr-1" />
                              Delete
                            

                            </button>

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
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg">No applications found</div>
              <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Admission Detail Modal */}
      
      
      
      
      
      
      





      
      
      
     {selectedAdmission && (
  <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex items-start justify-center p-2 sm:p-4 z-50">
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden my-4 sm:my-auto">
      {/* Modal Header with Quick Actions */}
      <div className="px-4 py-3 sm:px-6 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-start w-full">
            <div className="relative mr-3">
              <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full overflow-hidden border-2 sm:border-4 border-white relative group">
                {getStudentPhotoUrl(selectedAdmission) ? (
                  <img 
                    src={getStudentPhotoUrl(selectedAdmission)} 
                    alt={`${selectedAdmission.firstName} ${selectedAdmission.lastName}`}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `
                        <div class="h-full w-full bg-gradient-to-br from-white to-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg sm:text-2xl">
                          ${getInitials(selectedAdmission.firstName, selectedAdmission.lastName)}
                        </div>
                      `;
                    }}
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-white to-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg sm:text-2xl">
                    {getInitials(selectedAdmission.firstName, selectedAdmission.lastName)}
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                     onClick={() => handlePhotoSelect(selectedAdmission._id)}>
                  <FaCamera className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-indigo-100 rounded-full p-1 border-2 border-white">
                <FaCamera className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">  
              <h3 className="text-lg sm:text-2xl font-bold truncate">
                {selectedAdmission.firstName} {selectedAdmission.lastName} 
                <span className={`ml-2 sm:ml-3 text-xs sm:text-sm px-1.5 py-0.5 sm:px-2 sm:py-1 rounded ${
                  selectedAdmission.gender === 'Male' 
                    ? 'bg-blue-200 text-blue-800' 
                    : selectedAdmission.gender === 'Female' 
                    ? 'bg-pink-200 text-pink-800'
                    : 'bg-gray-200 text-gray-800'
                }`}>
                  {selectedAdmission.gender === 'Male' && <FaMale className="inline mr-0.5 sm:mr-1" />}
                  {selectedAdmission.gender === 'Female' && <FaFemale className="inline mr-0.5 sm:mr-1" />}
                  {selectedAdmission.gender}
                </span>
              </h3>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="text-xs sm:text-sm bg-white bg-opacity-20 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full">
                  ID: {selectedAdmission.studentId || selectedAdmission.admissionId || 'N/A'}
                </span>
                <span className={`px-2 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm font-semibold rounded-full ${getStatusColor(selectedAdmission.status).replace('border ', '')}`}>
                  {selectedAdmission.status?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end w-full sm:w-auto space-x-2">
            <button
              onClick={() => printStudentInfo(selectedAdmission._id)}
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center text-xs sm:text-sm"
            >
              <FaPrint className="mr-1 w-3 h-3 sm:w-4 sm:h-4" />
              Print Info
            </button>
            <button
              onClick={() => setSelectedAdmission(null)}
              className="text-white hover:text-gray-200 p-1.5 sm:p-2 rounded-full hover:bg-white hover:bg-opacity-20"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Modal Content */}
      <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-120px)] sm:max-h-[70vh]">

        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h5 className="font-medium text-blue-900 flex items-center text-sm sm:text-base">
                <FaCamera className="mr-2 w-3 h-3 sm:w-4 sm:h-4" />
                Student Profile 
              </h5>
              <p className="text-xs sm:text-sm text-blue-600 mt-0.5">
                Student Admission profile
              </p>
            </div>
          </div>
          {uploadingPhoto && photoPreview && (
            <div className="mt-3 flex items-center space-x-3">
              <div className="relative">
                <img 
                  src={photoPreview} 
                  alt="Preview" 
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-blue-300"
                />
                <div className="absolute inset-0 bg-blue-100 bg-opacity-50 rounded-full flex items-center justify-center">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800">Uploading photo...</p>
                <p className="text-xs text-blue-600">Please wait while we process your photo</p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          {/* Personal Information with Quick Edit */}
          <div>
            <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4 border-b pb-2">
                <div className="flex items-center">
                  <div className="p-1.5 sm:p-2 bg-indigo-100 rounded-lg mr-2 sm:mr-3">
                    <FaUserCircle className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                  </div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900">
                    Student Information <span className='text-red-400 text-xs sm:text-sm'>*</span>
                  </h4>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-500">Full Name <span className='text-red-400 text-xs sm:text-sm'>*</span></label>
                  <p className="mt-1 text-sm sm:text-lg font-semibold text-gray-900 truncate">
                    {selectedAdmission.firstName} {selectedAdmission.lastName} {selectedAdmission.grandParentName}
                  </p>
                </div>

                <div>
                  <label className='block text-xs sm:text-sm font-medium text-gray-500'>Student Age <span className='text-red-400 text-xs sm:text-sm'>*</span></label>
                  <p className='mt-1 text-sm sm:text-lg font-semibold text-gray-900'>
                    {selectedAdmission.age ? `${selectedAdmission.age} years` : 'N/A'}
                  </p>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-500">Gender & Date of Birth <span className='text-red-400 text-xs sm:text-sm'>*</span></label>
                  <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className={`inline-flex w-fit px-2 py-1 text-xs sm:text-sm rounded ${
                      selectedAdmission.gender === 'Male' 
                        ? 'bg-blue-100 text-blue-800' 
                        : selectedAdmission.gender === 'Female' 
                        ? 'bg-pink-100 text-pink-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedAdmission.gender === 'Male' && <FaMale className="inline mr-1" />}
                      {selectedAdmission.gender === 'Female' && <FaFemale className="inline mr-1" />}
                      {selectedAdmission.gender}
                    </span>
                    <span className="text-sm sm:text-lg font-semibold text-gray-900">
                      • {selectedAdmission.dob ? new Date(selectedAdmission.dob).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-500">Nationality <span className='text-red-400 text-xs sm:text-sm'>*</span></label>
                  <p className="mt-1 text-sm sm:text-lg font-semibold text-gray-900">
                    {selectedAdmission.nationality || 'N/A'}
                  </p>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-500">FAN <span className='text-red-400 text-xs sm:text-sm'>*</span></label>
                  <p className="mt-1 text-sm sm:text-lg font-semibold text-gray-900 truncate">
                    {selectedAdmission.fayida || 'Not specified'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Academic Information */}
            <div className="bg-gray-50 rounded-xl p-4 sm:p-6 mt-4 sm:mt-6">
              <div className="flex items-center mb-3 sm:mb-4 border-b pb-2">
                <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg mr-2 sm:mr-3">
                  <FaSchool className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <h4 className="text-base sm:text-lg font-semibold text-gray-900">
                  Academic Information <span className='text-red-400 text-xs sm:text-sm'>*</span>
                </h4>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-500">Field <span className='text-red-400 text-xs sm:text-sm'>*</span></label>
                  <p className="mt-1 text-sm sm:text-lg font-semibold text-gray-900">
                    {selectedAdmission.field || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-500">Program <span className='text-red-400 text-xs sm:text-sm'>*</span></label>
                  <p className="mt-1 text-sm sm:text-lg font-semibold text-gray-900">
                    {selectedAdmission.program || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-500">Apply For Grade <span className='text-red-400 text-xs sm:text-sm'>*</span></label>
                  <p className="mt-1 text-sm sm:text-lg font-semibold text-gray-900">
                    {selectedAdmission.applyingGrade}
                  </p>
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-500">Last Grade Completed <span className='text-red-400 text-xs sm:text-sm'>*</span></label>
                  <p className="mt-1 text-sm sm:text-lg font-semibold text-gray-900">
                    {selectedAdmission.lastGrade}
                  </p>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-500">Grade Average <span className='text-red-400 text-xs sm:text-sm'>*</span></label>
                  <p className="mt-1 text-sm sm:text-lg font-semibold text-gray-900">
                    {selectedAdmission.gradeAverage ? `${selectedAdmission.gradeAverage}%` : 'N/A'}
                  </p>
                </div>
                
                <div className="sm:col-span-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-500">Last School Attended <span className='text-red-400 text-xs sm:text-sm'>*</span></label>
                  <p className="mt-1 text-sm sm:text-lg font-semibold text-gray-900">
                    {selectedAdmission.lastSchool}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Parent Information */}
          <div>
            <div className="bg-indigo-50 rounded-xl p-4 sm:p-6">
              <div className="flex items-center mb-3 sm:mb-4 border-b pb-2">
                <div className="p-1.5 sm:p-2 bg-indigo-100 rounded-lg mr-2 sm:mr-3">
                  <FaUserCircle className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                </div>
                <h4 className="text-base sm:text-lg font-semibold text-gray-900">
                  Parent/Guardian Information <span className='text-red-400 text-xs sm:text-sm'>*</span>
                </h4>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-500">Full Name <span className='text-red-400 text-xs sm:text-sm'>*</span></label>
                  <p className="mt-1 text-sm sm:text-base font-semibold text-gray-900 truncate">
                    {selectedAdmission.parentName}
                  </p>
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-500">Relationship <span className='text-red-400 text-xs sm:text-sm'>*</span></label>
                  <p className="mt-1 text-sm sm:text-base font-semibold text-gray-900">
                    {selectedAdmission.relationship}
                  </p>
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-500">Phone Number <span className='text-red-400 text-xs sm:text-sm'>*</span></label>
                  <p className="mt-1 text-sm sm:text-base font-semibold text-gray-900">
                    {selectedAdmission.parentPhone}
                  </p>
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-500">Email Address <span className='text-red-400 text-xs sm:text-sm'>*</span></label>
                  <p className="mt-1 text-sm sm:text-base font-semibold text-gray-900 break-all">
                    {selectedAdmission.parentEmail}
                  </p>
                </div>
                
                {selectedAdmission.parentOccupation && (
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-500">Occupation <span className='text-red-400 text-xs sm:text-sm'>*</span></label>
                  <p className="mt-1 text-sm sm:text-base font-semibold text-gray-900">
                    {selectedAdmission.parentOccupation}
                  </p>
                </div>
                )}
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-500">Home Address <span className='text-red-400 text-xs sm:text-sm'>*</span></label>
                  <p className="mt-1 text-sm sm:text-base font-semibold text-gray-900">
                    {selectedAdmission.address}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Student Documents Section */}
        <div className="mt-6 sm:mt-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
            <div>
              <h4 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
                <FaFolderOpen className="mr-2 text-indigo-600 w-4 h-4 sm:w-5 sm:h-5" />
                Student Documents <span className='text-red-400 text-xs sm:text-sm'>*</span>
              </h4>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
                All documents stored in one place for easy access and management
              </p>
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <button
                onClick={() => fetchStudentDocuments(selectedAdmission._id)}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center text-xs sm:text-sm"
              >
                <FaFolderOpen className="mr-1.5 w-3 h-3 sm:w-4 sm:h-4" />
                Refresh Documents
              </button>
              <button
                onClick={() => printStudentInfo(selectedAdmission._id)}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center text-xs sm:text-sm"
              >
                <FaPrint className="mr-1.5 w-3 h-3 sm:w-4 sm:h-4" />
                Print Summary
              </button>
            </div>
          </div>
          
          {documentsLoading ? (
            <div className="text-center py-6 sm:py-8">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-2 text-xs sm:text-sm text-gray-600">Loading documents...</p>
            </div>
          ) : studentDocuments.length > 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-4 py-3 sm:px-6 sm:py-4 bg-gray-50 border-b">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="min-w-0">
                    <span className="font-medium text-gray-700 text-sm sm:text-base">
                      {selectedAdmission.firstName}'s Documents
                    </span>
                    <span className="ml-2 text-xs sm:text-sm text-gray-500">
                      ({studentDocuments.length} files stored)
                    </span>
                  </div>
                  <div className="flex space-x-1.5 sm:space-x-2">
                    <button
                      onClick={() =>
                        downloadAllDocuments(
                          selectedAdmission._id,
                          `${selectedAdmission.firstName}_${selectedAdmission.lastName}`
                        )
                      }
                      className="px-2.5 py-1 sm:px-3 sm:py-1 bg-indigo-600 text-white text-xs sm:text-sm rounded hover:bg-indigo-700 flex items-center"
                    >
                      <FaDownload className="mr-1 w-3 h-3 sm:w-4 sm:h-4" />
                      {isLoading ? (
                        <div className="flex items-center gap-1.5">
                          <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Preparing...
                        </div>
                      ) : (
                        "Download All"
                      )}
                    </button>  
                  </div>
                </div>
              </div>
              
              <div className="divide-y divide-gray-100">
                {studentDocuments.map((doc, index) => (
                  <div key={index} className="px-4 py-3 sm:px-6 sm:py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start sm:items-center min-w-0">
                        <div className="text-xl sm:text-2xl mr-3 sm:mr-4">
                          {getFileIcon(doc.filename)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-gray-900 text-sm sm:text-base truncate">
                            {doc.type.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500 truncate">
                            {doc.filename} • {(doc.size / 1024).toFixed(1)} KB
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5 sm:mt-1">
                            Uploaded: {formatDate(doc.uploadedAt)}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-end">
                        <button
                          onClick={() => openDocument(doc)}
                          className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 flex items-center text-xs sm:text-sm"
                        >
                          <FaEye className="mr-1 w-3 h-3 sm:w-4 sm:h-4" />
                          View
                        </button>
                        <a
                          href={getFileUrl(doc.url)}
                          download={doc.filename}
                          className="px-2.5 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 flex items-center text-xs sm:text-sm"
                        >
                          <FaDownload className="mr-1 w-3 h-3 sm:w-4 sm:h-4" />
                          Download
                        </a>
                        <button
                          onClick={() => printStudentInfo(selectedAdmission._id)}
                          className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 flex items-center text-xs sm:text-sm"
                        >
                          <FaPrint className="mr-1 w-3 h-3 sm:w-4 sm:h-4" />
                          Print
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
              <FaFolderOpen className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
              <h5 className="text-base sm:text-lg font-medium text-gray-700">No Documents Available Yet</h5>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">Upload documents to keep all student information in one place</p>
              <div className="mt-4 sm:mt-6 flex flex-wrap justify-center gap-2 sm:gap-4">
                <button
                  onClick={() => setShowDocumentUpload(true)}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs sm:text-sm"
                >
                  <FaUpload className="inline mr-1.5 w-3 h-3 sm:w-4 sm:h-4" />
                  Upload Documents
                </button>
                <button
                  onClick={() => fetchStudentDocuments(selectedAdmission._id)}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-xs sm:text-sm"
                >
                  Check for Documents
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Footer with Enhanced Actions */}
      <div className="px-4 py-3 sm:px-6 sm:py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="text-xs sm:text-sm text-gray-500">
            Applied: {formatDate(selectedAdmission.createdAt)}
            {selectedAdmission.updatedAt && (
              <span className="block sm:inline sm:ml-3 mt-0.5 sm:mt-0">Last updated: {formatDate(selectedAdmission.updatedAt)}</span>
            )}
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                updateStatus(selectedAdmission._id, 'accepted');
              }}
              className="px-4 py-1.5 sm:px-6 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base flex-1 sm:flex-none text-center"
            >
              Accept Application
            </button>
            <button
              onClick={() => printStudentInfo(selectedAdmission._id)}
              className="px-4 py-1.5 sm:px-6 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm sm:text-base flex-1 sm:flex-none"
            >
              <FaPrint className="mr-1.5 w-3 h-3 sm:w-4 sm:h-4" />
              Print Full Report
            </button>
            <button
              onClick={() => setSelectedAdmission(null)}
              className="px-4 py-1.5 sm:px-6 sm:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base flex-1 sm:flex-none text-center"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};
export default AdminDashboardPage;





// this name of this name of this name of this name of this name of this name of this name 
