
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import TelebirrQR from '../assets/TelebirrQR.jpg';
import logo from '../assets/tullulogo.png';
import imageCompression from 'browser-image-compression';

const API_URL = process.env.REACT_APP_API_URL || 'https://tullu-dimtu-school-backend-1.onrender.com';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: 300000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const AdmissionForm = () => {
  const initialFormData = {
    age: '',
    grandParentName: '',
    firstName: '',
    lastName: '',
    gender: '',
    dob: '',
    nationality: 'Afaan Oromoo, Afan Amharaa',
    religion: '',
    photo: null,
    applyingGrade: '',
    lastSchool: '',
    lastGrade: '',
    gradeAverage: '',
    parentName: '',
    relationship: '',
    parentPhone: '',
    parentEmail: '',
    parentOccupation: '',
    address: '',
    birthCertificate: null,
    transcript: null,
    transferCertificate: null,
    paymentReceipt: null,
    faydaId: null,
    ParentPhoto: null,
    clearance: null,
    condition: '',
    program: '',
    fayida: '',
    field: ''
  };

  const paymentMethods = [
    {
      name: "Telebirr",
      color: "green",
      gradient: "from-green-500 to-emerald-600",
      hoverGradient: "from-green-600 to-emerald-700",
      image: TelebirrQR,
      payCode: "150120",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
      )
    },
    {
      name: "CBE Birr",
      color: "blue",
      gradient: "from-blue-500 to-cyan-600",
      hoverGradient: "from-blue-600 to-cyan-700",
      image: TelebirrQR,
      payCode: "250230",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
        </svg>
      )
    }
  ];

  const [activeMethod, setActiveMethod] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [applicationData, setApplicationData] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [apiHealth, setApiHealth] = useState('checking');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const [serverMessage, setServerMessage] = useState('');
  // State for individual file upload progress
  const [fileUploadProgress, setFileUploadProgress] = useState({});
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [uploadCounter, setUploadCounter] = useState(0);

  const fileInputRefs = {
    photo: useRef(null),
    birthCertificate: useRef(null),
    transcript: useRef(null),
    transferCertificate: useRef(null),
    paymentReceipt: useRef(null),
    faydaId: useRef(null),
    ParentPhoto: useRef(null),
    clearance: useRef(null)
  };

  // const grades = ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
  // const relationships = ['Father', 'Mother', 'Guardian', 'Other'];
  // const nationalities = ['Afaan Oromoo', 'Afaan Amharaa'];
  // const conditions = ['New Student', 'Old Student'];

  // Enhanced button styles
  const buttonClasses = {
    primary: 'px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5',
    secondary: 'px-6 py-3 bg-gray-800/50 text-gray-200 font-semibold rounded-xl hover:bg-gray-700/50 border border-gray-700 hover:border-gray-600 transition-all duration-300',
    success: 'px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5',
    warning: 'px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-semibold rounded-xl hover:from-yellow-700 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300',
    danger: 'px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold rounded-xl hover:from-red-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300',
    ghost: 'px-6 py-3 text-gray-300 font-semibold rounded-xl hover:bg-white/5 transition-all duration-300',
  };

  // Mouse position tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animated background
  useEffect(() => {
    const canvas = document.getElementById('animated-bg');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = window.innerWidth < 768 ? 30 : 50;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.color = `rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, 255, 0.5)`;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    checkAPIHealth();
  }, []);

  const checkAPIHealth = async () => {
    try {
      const response = await api.get('/api/health');
      setApiHealth('healthy');
      if (response.data.message) {
        setServerMessage(`✅ Server: ${response.data.message}`);
      }
    } catch (error) {
      setApiHealth('unhealthy');
      setSubmitError('⚠️ Cannot connect to server. Please make sure backend is running.');
    }
  };

  // Function to compress image with progress tracking
  const compressImage = async (file, fieldName) => {
    if (!file.type.startsWith('image/')) return file;

    const options = {
      maxSizeMB: 0.5, // Compress to max 0.5MB
      maxWidthOrHeight: 1024,
      useWebWorker: true,
      fileType: file.type,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      console.log(`Compressed ${file.name} from ${(file.size / 1024 / 1024).toFixed(2)}MB to ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
      return compressedFile;
    } catch (error) {
      console.error('Image compression failed:', error);
      return file;
    }
  };

  // Function to check file size
  const checkFileSize = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return `File is too large! Maximum size is 5MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.`;
    }
    return '';
  };

  // Function to validate file type
  const validateFileType = (file, fieldName) => {
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const validPdfTypes = ['application/pdf'];
    const validTypes = fieldName === 'photo' ? validImageTypes : [...validImageTypes, ...validPdfTypes];
    
    if (!validTypes.includes(file.type.toLowerCase())) {
      const allowedTypes = fieldName === 'photo' ? 'JPG, JPEG, PNG, GIF, WEBP' : 'JPG, JPEG, PNG, GIF, WEBP, PDF';
      return `Invalid file type. Please upload ${allowedTypes} files only.`;
    }
    return '';
  };

  // Simulate file processing/uploading for individual files
  const simulateFileProcessing = (fieldName, fileName, fileSize) => {
    setIsFileUploading(true);
    
    // Initialize progress for this file
    setFileUploadProgress(prev => ({
      ...prev,
      [fieldName]: {
        fileName: fileName,
        fileSize: (fileSize / 1024 / 1024).toFixed(2),
        progress: 0,
        status: 'starting'
      }
    }));

    // Start counter from 1
    setUploadCounter(1);

    // Simulate processing steps with counter
    const steps = [
      { progress: 10, status: 'reading', count: 1 },
      { progress: 30, status: 'validating', count: 2 },
      { progress: 50, status: 'processing', count: 3 },
      { progress: 70, status: 'finalizing', count: 4 },
      { progress: 100, status: 'completed', count: 5 }
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setUploadCounter(step.count);
        setFileUploadProgress(prev => ({
          ...prev,
          [fieldName]: {
            ...prev[fieldName],
            progress: step.progress,
            status: step.status
          }
        }));

        // If this is the last step, mark as completed after a delay
        if (index === steps.length - 1) {
          setTimeout(() => {
            setIsFileUploading(false);
            // Clear the progress for this file after 3 seconds
            setTimeout(() => {
              setFileUploadProgress(prev => {
                const newProgress = { ...prev };
                delete newProgress[fieldName];
                return newProgress;
              });
              setUploadCounter(0);
            }, 3000);
          }, 1000);
        }
      }, index * 500); // 500ms delay between steps
    });
  };

  const handleChange = async (e) => {
    const { name, value, files } = e.target;
    
    if (files && files[0]) {
      const file = files[0];
      
      // Clear any previous errors for this field
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
      
      // Check file type
      const typeError = validateFileType(file, name);
      if (typeError) {
        setErrors(prev => ({ ...prev, [name]: typeError }));
        return;
      }
      
      // Check file size
      const sizeError = checkFileSize(file);
      if (sizeError) {
        setErrors(prev => ({ ...prev, [name]: sizeError }));
        return;
      }
      
      // Start file upload progress simulation
      simulateFileProcessing(name, file.name, file.size);
      
      // For image files, compress before setting state
      let processedFile = file;
      if (file.type.startsWith('image/')) {
        try {
          processedFile = await compressImage(file, name);
        } catch (error) {
          console.error('Compression error:', error);
          setErrors(prev => ({ ...prev, [name]: 'Failed to compress image. Please try a different image.' }));
          return;
        }
      }
      
      setFormData(prev => ({ ...prev, [name]: processedFile }));
      
      // Clear the error since file is now valid
      setErrors(prev => ({ ...prev, [name]: '' }));
    } else {
      const capitalizeFields = ['firstName', 'lastName', 'parentName', 'grandParentName'];
      let processedValue = value;
      
      if (capitalizeFields.includes(name)) {
        if (value.length === 1) {
          processedValue = value.toUpperCase();
        } else if (value.length > 1) {
          const firstChar = value.charAt(0);
          const rest = value.slice(1);
          processedValue = firstChar.toUpperCase() + rest;
        }
      }
      
      setFormData(prev => ({ ...prev, [name]: processedValue }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileClick = (fieldName) => {
    fileInputRefs[fieldName]?.current?.click();
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.grandParentName.trim()) newErrors.grandParentName = 'Grandparent name is required';
      if (!formData.gender) newErrors.gender = 'Gender is required';
      if (!formData.dob) newErrors.dob = 'Date of birth is required';
      if (!formData.age) newErrors.age = 'Age is required';
      if (!formData.nationality) newErrors.nationality = 'Media Of Instruction is required';
      if (!formData.program) newErrors.program = "Program is required";
      if (!formData.fayida) newErrors.fayida = "FAN is required";
      if (!formData.field) newErrors.field = "Field is required";
 
      // Photo validation - only check if it exists
      if (!formData.photo) {
        newErrors.photo = 'Photo is required';
      }
      // Don't check if it's a File instance here - let the server handle validation
      
      if (formData.dob) {
        const dob = new Date(formData.dob);
        const today = new Date();
        const minAgeDate = new Date();
        minAgeDate.setFullYear(today.getFullYear() - 3);
        
        if (dob > minAgeDate) newErrors.dob = 'Student must be at least 3 years old';
        if (dob > today) newErrors.dob = 'Date of birth cannot be in the future';
      }
    }
    
    if (step === 2) {
      if (!formData.applyingGrade) newErrors.applyingGrade = 'Grade is required';
      if (!formData.lastSchool.trim()) newErrors.lastSchool = 'Last school is required';
      if (!formData.lastGrade.trim()) newErrors.lastGrade = 'Last grade is required';
      if (!formData.gradeAverage.trim()) newErrors.gradeAverage = 'Grade average is required';
      if (!formData.condition) newErrors.condition = 'Registration condition is required';
    }
    
    if (step === 3) {
      if (!formData.parentName.trim()) newErrors.parentName = 'Parent name is required';
      if (!formData.relationship) newErrors.relationship = 'Relationship is required';
      if (!formData.parentPhone.trim()) newErrors.parentPhone = 'Phone number is required';
      if (!formData.parentEmail.trim()) {
        newErrors.parentEmail = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.parentEmail)) {
        newErrors.parentEmail = 'Email is invalid';
      }
      if (!formData.address.trim()) newErrors.address = 'Address is required';
    }
    
    if (step === 4) {
      // Check required files - only check if they exist
      if (!formData.birthCertificate) newErrors.birthCertificate = 'Birth certificate is required';
      if (!formData.transcript) newErrors.transcript = 'Transcript is required';
      if (!formData.faydaId) newErrors.faydaId = 'Student ID is required';
      if (!formData.ParentPhoto) newErrors.ParentPhoto = 'Parent Photo is required';
      if (!formData.clearance) newErrors.clearance = 'Clearance is required';
    }
    
    if (step === 5) {
      if (!formData.paymentReceipt) {
        newErrors.paymentReceipt = 'Payment receipt is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Mobile detection for file size limits
  const isMobile = window.innerWidth < 768;
  const maxFileSizeMB = isMobile ? 1 : 5;
  const maxFileSizeBytes = maxFileSizeMB * 1024 * 1024;
  
  // Validate all steps first
  for (let step = 1; step <= 5; step++) {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.grandParentName.trim()) newErrors.grandParentName = 'Grandparent name is required';
      if (!formData.gender) newErrors.gender = 'Gender is required';
      if (!formData.dob) newErrors.dob = 'Date of birth is required';
      if (!formData.age) newErrors.age = 'Age is required';
      if (!formData.nationality) newErrors.nationality = 'Media Of Instruction is required';
      if (!formData.program) newErrors.program = "Program is required";
      if (!formData.fayida) newErrors.fayida = "FAN is required";
      if (!formData.field) newErrors.field = "Field is required";
      if (!formData.photo) newErrors.photo = 'Photo is required';
      
      // Check file size for photo on mobile
      if (formData.photo && formData.photo.size && isMobile && formData.photo.size > maxFileSizeBytes) {
        newErrors.photo = `Photo is too large! Maximum size is ${maxFileSizeMB}MB on mobile.`;
      }
    }
    
    if (step === 2) {
      if (!formData.applyingGrade) newErrors.applyingGrade = 'Grade is required';
      if (!formData.lastSchool.trim()) newErrors.lastSchool = 'Last school is required';
      if (!formData.lastGrade.trim()) newErrors.lastGrade = 'Last grade is required';
      if (!formData.gradeAverage.trim()) newErrors.gradeAverage = 'Grade average is required';
      if (!formData.condition) newErrors.condition = 'Registration condition is required';
    }
    
    if (step === 3) {
      if (!formData.parentName.trim()) newErrors.parentName = 'Parent name is required';
      if (!formData.relationship) newErrors.relationship = 'Relationship is required';
      if (!formData.parentPhone.trim()) newErrors.parentPhone = 'Phone number is required';
      if (!formData.parentEmail.trim()) {
        newErrors.parentEmail = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.parentEmail)) {
        newErrors.parentEmail = 'Email is invalid';
      }
      if (!formData.address.trim()) newErrors.address = 'Address is required';
    }
    
    if (step === 4) {
      if (!formData.birthCertificate) newErrors.birthCertificate = 'Birth certificate is required';
      if (!formData.transcript) newErrors.transcript = 'Transcript is required';
      if (!formData.faydaId) newErrors.faydaId = 'Student ID is required';
      if (!formData.ParentPhoto) newErrors.ParentPhoto = 'Parent Photo is required';
      if (!formData.clearance) newErrors.clearance = 'Clearance is required';
      
      // Check file sizes for step 4 documents on mobile
      const step4Files = [
        { name: 'birthCertificate', file: formData.birthCertificate },
        { name: 'transcript', file: formData.transcript },
        { name: 'faydaId', file: formData.faydaId },
        { name: 'ParentPhoto', file: formData.ParentPhoto },
        { name: 'clearance', file: formData.clearance }
      ];
      
      step4Files.forEach(({ name, file }) => {
        if (file && file.size && isMobile && file.size > maxFileSizeBytes) {
          newErrors[name] = `${name.replace(/([A-Z])/g, ' $1')} is too large! Maximum size is ${maxFileSizeMB}MB on mobile.`;
        }
      });
    }
    
    if (step === 5) {
      if (!formData.paymentReceipt) newErrors.paymentReceipt = 'Payment receipt is required';
      
      // Check file size for payment receipt on mobile
      if (formData.paymentReceipt && formData.paymentReceipt.size && isMobile && 
          formData.paymentReceipt.size > maxFileSizeBytes) {
        newErrors.paymentReceipt = `Payment receipt is too large! Maximum size is ${maxFileSizeMB}MB on mobile.`;
      }
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSubmitError(`⚠️ Please fill in all required fields correctly. ${isMobile ? `(Mobile limit: ${maxFileSizeMB}MB per file)` : ''}`);
      // Go to the step with errors
      setCurrentStep(step);
      return;
    }
  }
  
  // Additional file type validation before submission
  const fileFields = [
    'photo',
    'birthCertificate', 
    'transcript',
    'transferCertificate',
    'paymentReceipt',
    'faydaId',
    'ParentPhoto',
    'clearance'
  ];
  
  for (const field of fileFields) {
    const file = formData[field];
    if (file && file instanceof File) {
      const typeError = validateFileType(file, field);
      if (typeError) {
        setErrors(prev => ({ ...prev, [field]: typeError }));
        setSubmitError(`⚠️ Invalid file type. Please check all files. ${isMobile ? `(Mobile limit: ${maxFileSizeMB}MB per file)` : ''}`);
        // Find which step contains this field and navigate to it
        if (field === 'photo') setCurrentStep(1);
        else if (['birthCertificate', 'transcript', 'faydaId', 'ParentPhoto', 'clearance'].includes(field)) setCurrentStep(4);
        else if (field === 'paymentReceipt') setCurrentStep(5);
        return;
      }
      
      // Final size check before submission
      if (isMobile && file.size > maxFileSizeBytes) {
        setErrors(prev => ({ ...prev, [field]: `File is too large! Maximum size is ${maxFileSizeMB}MB on mobile.` }));
        setSubmitError(`⚠️ File size exceeds mobile limit. Maximum size is ${maxFileSizeMB}MB per file on mobile.`);
        // Find which step contains this field and navigate to it
        if (field === 'photo') setCurrentStep(1);
        else if (['birthCertificate', 'transcript', 'faydaId', 'ParentPhoto', 'clearance'].includes(field)) setCurrentStep(4);
        else if (field === 'paymentReceipt') setCurrentStep(5);
        return;
      }
    }
  }
  
  if (apiHealth !== 'healthy') {
    const healthCheck = await checkAPIHealth();
    if (healthCheck !== 'healthy') {
      setSubmitError('⚠️ Cannot connect to server. Please make sure backend is running on ' + API_URL);
      return;
    }
  }
  
  setIsSubmitting(true);
  setSubmitError(null);
  setUploadProgress(0);
  setUploadStatus('Preparing files...');
  setServerMessage('🎯 CREATE ADMISSION REQUEST RECEIVED');
  
  // Start counter for final submission
  let counter = 1;
  const counterInterval = setInterval(() => {
    setUploadCounter(counter);
    counter++;
    if (counter > 100) counter = 1; // Reset after 100
  }, 100); // Update counter every 100ms
  
  try {
    const formDataToSend = new FormData();
    
    const textFields = {
      age: formData.age,
      firstName: formData.firstName,
      lastName: formData.lastName,
      grandParentName: formData.grandParentName,
      gender: formData.gender.toLowerCase(),
      dob: formData.dob,
      nationality: formData.nationality,
      religion: formData.religion || '',
      applyingGrade: formData.applyingGrade,
      lastSchool: formData.lastSchool,
      lastGrade: formData.lastGrade,
      gradeAverage: formData.gradeAverage || '',
      parentName: formData.parentName,
      relationship: formData.relationship,
      parentPhone: formData.parentPhone,
      parentEmail: formData.parentEmail.toLowerCase(),
      parentOccupation: formData.parentOccupation || '',
      address: formData.address,
      condition: formData.condition,
      program: formData.program,
      fayida: formData.fayida,
      field: formData.field,
    };
    
    // Add text fields
    Object.entries(textFields).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });
    
    // Add compressed files
    let fileCount = 0;
    for (const field of fileFields) {
      const file = formData[field];
      if (file) {
        // Send the file regardless of whether it's a File instance or not
        // The server will handle validation
        formDataToSend.append(field, file);
        fileCount++;
      }
    }
    
    setUploadStatus(`Uploading ${fileCount} files...`);
    setServerMessage('🎯 CREATE ADMISSION REQUEST RECEIVED - Uploading files...');
    
    const submissionId = `submission_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    formDataToSend.append('submissionId', submissionId);
    formDataToSend.append('isMobile', isMobile.toString()); // Send mobile flag to server
    
    // Log what we're sending (for debugging)
    console.log('Sending form data:', {
      textFields,
      fileCount,
      isMobile,
      maxFileSizeMB,
      hasPhoto: !!formData.photo,
      photoType: formData.photo ? formData.photo.type : 'No photo',
      photoName: formData.photo ? formData.photo.name : 'No photo',
      photoSize: formData.photo ? `${(formData.photo.size / 1024 / 1024).toFixed(2)}MB` : 'No photo',
      hasBirthCertificate: !!formData.birthCertificate,
      hasTranscript: !!formData.transcript,
    });
    
    const response = await api.post(
      '/api/admissions/submit',
      formDataToSend,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120000,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.lengthComputable) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
            
            if (percentCompleted < 100) {
              setUploadStatus(`Uploading... ${percentCompleted}%`);
              setServerMessage(`🎯 CREATE ADMISSION REQUEST RECEIVED - Uploading ${percentCompleted}%`);
            } else {
              setUploadStatus('Processing submission...');
              setServerMessage('🎯 CREATE ADMISSION REQUEST RECEIVED - Processing...');
            }
          }
        }
      }
    );
    
    console.log('Server Response:', response.data);
    
    // Check if response indicates success
    if (response.status === 200 || response.status === 201) {
      clearInterval(counterInterval);
      setUploadCounter(100);
      
      setSubmitSuccess(true);
      
      // Extract data from response
      const responseData = response.data || {};
      setApplicationData({
        admissionId: responseData.admissionId || `ADM${Date.now().toString().slice(-6)}`,
        studentId: responseData.studentId || `STU${Date.now().toString().slice(-6)}`,
        fullName: `${formData.firstName} ${formData.lastName}`,
        grade: formData.applyingGrade,
        timestamp: new Date().toLocaleString(),
        ...responseData
      });
      
      setFormData(initialFormData);
      setCurrentStep(1);
      setErrors({});
      setSubmitError(null);
      setUploadProgress(0);
      setUploadStatus('');
      setServerMessage('✅ Admission request created successfully!');
      // Clear file upload progress
      setFileUploadProgress({});
    } else {
      throw new Error(response.data?.message || 'Submission failed');
    }
    
  } catch (error) {
    console.error('Submission error:', error);
    clearInterval(counterInterval);
    
    let errorMessage = 'An unexpected error occurred. Please try again.';
    let serverResponseMessage = '';
    
    if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timeout. Please check your connection and try again.';
    } else if (error.response) {
      // Extract server error message
      const serverError = error.response.data;
      
      if (typeof serverError === 'string') {
        serverResponseMessage = serverError;
      } else if (serverError && typeof serverError === 'object') {
        serverResponseMessage = serverError.message || JSON.stringify(serverError);
      }
      
      if (error.response.status === 413) {
        errorMessage = isMobile 
          ? `File too large. Maximum size is ${maxFileSizeMB}MB per file on mobile.` 
          : 'File too large. Maximum size is 5MB per file.';
      } else if (error.response.status === 415) {
        errorMessage = 'Unsupported file type. Please upload JPG, PNG, GIF, WEBP, or PDF files.';
      } else if (error.response.status === 400) {
        if (serverResponseMessage.includes('photo') || 
            serverResponseMessage.includes('Photo') ||
            serverResponseMessage.includes('birth certificate') || 
            serverResponseMessage.includes('transcript')) {
          errorMessage = `⚠️ ${serverResponseMessage}`;
        } else if (serverResponseMessage.includes('valid') || serverResponseMessage.includes('file')) {
          errorMessage = `⚠️ ${serverResponseMessage}`;
        } else {
          errorMessage = '⚠️ Invalid data. Please check all fields and try again.';
        }
      } else if (error.response.status === 500) {
        errorMessage = 'Internal server error. Please try again later.';
      } else {
        errorMessage = `Server error (${error.response.status}): ${serverResponseMessage || 'Please try again.'}`;
      }
    } else if (error.request) {
      errorMessage = 'No response from server. Please check backend server and network connection.';
    } else {
      errorMessage = `Error: ${error.message}`;
    }
    
    setSubmitError(errorMessage);
    setUploadProgress(0);
    setUploadStatus('');
    setUploadCounter(0);
    
    // Show server message if available
    if (serverResponseMessage) {
      setServerMessage(`Server: ${serverResponseMessage}`);
    }
  } finally {
    setIsSubmitting(false);
  }
};

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentStep(1);
    setSubmitSuccess(false);
    setApplicationData(null);
    setErrors({});
    setSubmitError(null);
    setUploadProgress(0);
    setUploadStatus('');
    setServerMessage('');
    setFileUploadProgress({});
    setUploadCounter(0);
  };

  const testConnection = async () => {
    try {
      setSubmitError('Testing connection...');
      const response = await api.get('/api/health');
      setSubmitError(`✅ Connection successful! Server: ${response.data.message || 'OK'}`);
      setServerMessage(`✅ Server: ${response.data.message || 'Ready for admission requests'}`);
    } catch (error) {
      setSubmitError(`❌ Connection failed: ${error.message}`);
      setServerMessage('❌ Server connection failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 overflow-hidden relative">
      {/* Animated Background Canvas */}
      {/* <canvas id="animated-bg" className="absolute inset-0 z-0" /> */}
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
       
       
      </div>

      <div className="relative z-10 min-h-screen py-6 md:py-12 px-3 sm:px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* API Status Indicator */}
        

          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="text-center mb-8 md:mb-12"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className="relative inline-block mb-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                whileHover={{ scale: 1.05 }}
                className="w-48 h-48 mx-auto flex items-center justify-center bg-white rounded-full shadow-lg"
              >
                <img
                  src={logo}
                  alt="Logo"
                  className="w-40 h-40 object-contain"
                />
              </motion.div>
              
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-transparent border-t-purple-500/50 rounded-full"
              />
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-2 md:mb-3 tracking-tight px-2">
              TULLU DIMTU SECONDARY SCHOOL
            </h1>
            <div className="relative inline-block">
              <h2 className="text-xl md:text-2xl font-bold text-cyan-300 mb-2">Admission Portal 2026</h2>
              <div className="absolute -inset-x-4 inset-y-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent blur-sm" />
            </div>
            <p className="text-gray-300 mt-3 md:mt-4 max-w-2xl mx-auto text-sm md:text-base px-4">
              Begin your journey to excellence. Join Ethiopia's premier educational institution.
            </p>
            
            {/* Progress Indicator */}
            <motion.div 
              className="mt-6 md:mt-8 flex justify-center space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {[1, 2, 3, 4, 5].map((step) => (
                <motion.div
                  key={step}
                  animate={{ 
                    scale: currentStep === step ? 1.2 : 1,
                    backgroundColor: currentStep >= step ? '#4F46E5' : '#374151'
                  }}
                  whileHover={{ scale: 1.1 }}
                  className="w-6 md:w-8 h-1 rounded-full transition-all duration-300"
                />
              ))}
            </motion.div>
          </motion.div>

          {/* Main Form Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="backdrop-blur-xl bg-white/6 border border-white/10 rounded-2xl md:rounded-3xl shadow-2xl shadow-black/30 overflow-hidden">
              <div className="relative h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 overflow-hidden">
                <motion.div
                  animate={{ x: ['0%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                />
              </div>

              <div className="px-4 md:px-6 lg:px-8 pt-6 md:pt-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4">
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-purple-500/30 flex items-center justify-center"
                    >
                      <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                        {currentStep}
                      </span>
                    </motion.div>
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-white">
                        {currentStep === 1 && 'Personal Details'}
                        {currentStep === 2 && 'Academic Background'}
                        {currentStep === 3 && 'Guardian Information'}
                        {currentStep === 4 && 'Document Upload'}
                        {currentStep === 5 && 'Payment Processing'}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Step {currentStep} of 5
                      </p>
                    </div>
                  </div>
                  
                  <div className="relative w-14 h-14 md:w-16 md:h-16">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="28" cy="28" r="26" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-700" />
                      <motion.circle
                        cx="28"
                        cy="28"
                        r="26"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="transparent"
                        className="text-indigo-500"
                        initial={{ strokeDasharray: "163.4", strokeDashoffset: "163.4" }}
                        animate={{ strokeDashoffset: 163.4 - (163.4 * (currentStep - 1)) / 4 }}
                        transition={{ duration: 0.5 }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white font-bold text-sm md:text-base">{currentStep * 20}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Individual File Upload Progress Indicators */}
              {Object.keys(fileUploadProgress).length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="px-6 py-3 bg-gray-800/80 border-b border-gray-700/50"
                >
                  <p className="text-sm text-cyan-300 font-medium mb-2">
                    {isFileUploading ? '📤 Processing files...' : '✅ Files processed successfully!'}
                  </p>
                  <div className="space-y-2">
                    {Object.entries(fileUploadProgress).map(([fieldName, progress]) => (
                      <div key={fieldName} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-300 truncate">
                            {progress.fileName || fieldName}
                            {progress.status && (
                              <span className="ml-2 text-gray-400">
                                ({progress.status})
                              </span>
                            )}
                          </span>
                          <span className="text-gray-400">
                            {uploadCounter > 0 ? `Step ${uploadCounter} of 5` : `${progress.progress}%`}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: '0%' }}
                            animate={{ width: `${progress.progress}%` }}
                            transition={{ duration: 0.3 }}
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Overall Upload Progress Bar (shown during submission) */}
              {isSubmitting && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="px-6 py-3 bg-gray-800/50 border-b border-gray-700/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-cyan-300 font-medium">
                      {uploadStatus || `Processing... ${uploadProgress}%`}
                    </span>
                    <span className="text-sm text-gray-400">
                      {uploadCounter > 0 ? `Step ${uploadCounter}` : `${uploadProgress}%`}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.3 }}
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                    />
                  </div>
                  {serverMessage && (
                    <p className="text-xs text-yellow-400 mt-2">{serverMessage}</p>
                  )}
                </motion.div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Hidden file inputs */}
                {Object.keys(fileInputRefs).map((field) => (
                  <input
                    key={field}
                    type="file"
                    ref={fileInputRefs[field]}
                    onChange={handleChange}
                    name={field}
                    className="hidden"
                    accept={field === 'photo' ? "image/*" : ".pdf,.jpg,.jpeg,.png,.gif,.webp"}
                  />
                ))}

                <AnimatePresence mode="wait">
                  {submitSuccess ? (
                    <SuccessScreen applicationData={applicationData} resetForm={resetForm} formData={formData} />
                  ) : (
                    <motion.div
                      key={`step-${currentStep}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="px-4 md:px-6 lg:px-8 pb-6"
                    >
                      {currentStep === 1 && (
                        <Step1 
                          formData={formData} 
                          handleChange={handleChange} 
                          errors={errors}
                          handleFileClick={handleFileClick}
                          fileUploadProgress={fileUploadProgress}
                          uploadCounter={uploadCounter}
                        />
                      )}
                      
                      {currentStep === 2 && (
                        <Step2 formData={formData} handleChange={handleChange} errors={errors} setFormData={setFormData} />
                      )}
                      
                      {currentStep === 3 && (
                        <Step3 formData={formData} handleChange={handleChange} errors={errors} />
                      )}
                      
                      {currentStep === 4 && (
                        <Step4 
                          formData={formData} 
                          errors={errors}
                          handleFileClick={handleFileClick}
                          fileUploadProgress={fileUploadProgress}
                          uploadCounter={uploadCounter}
                        />
                      )}
                      
                      {currentStep === 5 && (
                        <Step5 
                          formData={formData} 
                          errors={errors}
                          handleFileClick={handleFileClick}
                          paymentMethods={paymentMethods}
                          activeMethod={activeMethod}
                          setActiveMethod={setActiveMethod}
                          submitError={submitError}
                          testConnection={testConnection}
                          fileUploadProgress={fileUploadProgress}
                          uploadCounter={uploadCounter}
                        />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                {!submitSuccess && (
                  <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6 border-t border-gray-700/50 bg-gray-900/30 flex flex-col sm:flex-row justify-between gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={prevStep}
                      disabled={currentStep === 1}
                      className={`${buttonClasses.secondary} ${currentStep === 1 ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''} order-2 sm:order-1`}
                    >
                      ← Previous
                    </motion.button>

                    {currentStep < 5 ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={nextStep}
                        className={`${buttonClasses.primary} order-1 sm:order-2`}
                      >
                        Continue →
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={isSubmitting || apiHealth !== 'healthy'}
                        className={`${buttonClasses.success} ${isSubmitting || apiHealth !== 'healthy' ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''} order-1 sm:order-2`}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                            </svg>
                            {uploadStatus || 'Processing...'}
                          </span>
                        ) : (
                          '🎓 Submit Application'
                        )}
                      </motion.button>
                    )}
                  </div>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Step Components
const Step1 = ({ formData, handleChange, errors, handleFileClick, fileUploadProgress, uploadCounter }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
    <div className="lg:col-span-2">
      <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
        <span className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center mr-2">
          👤
        </span>
        Student Information
      </h4>
    </div>
    
    <div className="space-y-4">
      <InputField
        label="First Name :"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        error={errors.firstName}
        placeholder="Enter first name"
      />

      <InputField
        label="Last Name :"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        error={errors.lastName}
        placeholder="Enter last name"
      />
      
      <InputField
        label="Grand Father Name :"
        name="grandParentName"
        value={formData.grandParentName}
        onChange={handleChange}
        error={errors.grandParentName}
        placeholder="Enter grand father name"
      />
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Gender :
        </label>
        <div className="grid grid-cols-3 gap-2">
          {['Male', 'Female', 'Other'].map(gender => (
            <motion.button
              key={gender}
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleChange({ target: { name: 'gender', value: gender.toLowerCase() } })}
              className={`py-3 rounded-xl text-center transition-all font-medium ${formData.gender === gender.toLowerCase() 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-purple-500/30' 
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700'}`}
            >
              {gender}
            </motion.button>
          ))}
        </div>
        {errors.gender && <p className="mt-1 text-sm text-red-400">{errors.gender}</p>}
      </div>


       <SelectField
        label="Program:"
        name="program"
        value={formData.program}
        onChange={handleChange}
        options={[ 'Regular Program', 'Night Program']} 
        error={errors.program}
        required
        placeholder='-Select-'
      />
        
         <SelectField
        label="Field :"
        name="field"
        value={formData.field}
        onChange={handleChange}
        options={[ 'Natural Science', 'Social Science', 'Other']} 
        error={errors.field}
        required
        placeholder='-Select'
      />
      
      <SelectField
        label="Media Of Instruction :"
        name="nationality"
        value={formData.nationality}
        onChange={handleChange}
        options={[ 'Afaan Oromoo', 'Afaan Amharaa']} 
        error={errors.nationality}
        required
        placeholder='-Select'
      />
      {errors.nationality && <p className="mt-1 text-sm text-red-400">{errors.nationality}</p>}
    </div>
    
    <div className="space-y-4">
      <InputField
        label="Date of Birth :"
        type="date"
        name="dob"
        value={formData.dob}
        onChange={handleChange}
        error={errors.dob}
      />
      
      <InputField
        label="Age :"
        type="number"
        name="age"
        value={formData.age}
        onChange={handleChange}
        error={errors.age}
        placeholder="Enter age"
      />
    
    <InputField
        label="National ID (FAN/FCN Number):"
        
        name="fayida"
        value={formData.fayida}
        onChange={handleChange}
        error={errors.fayida}
        placeholder=""
      />

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Student Photo :
        </label>
        <FileUploadField
          fieldName="photo"
          file={formData.photo}
          error={errors.photo}
          handleFileClick={handleFileClick}
          accept="image/*"
          fileUploadProgress={fileUploadProgress.photo}
          uploadCounter={uploadCounter}
        />
        {formData.photo && !errors.photo && !fileUploadProgress.photo && (
          <p className="mt-1 text-sm text-green-400">
            ✓ Photo uploaded: {formData.photo.name} ({(formData.photo.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        )}
      </div>
    </div>
  </div>
);

const Step2 = ({ formData, handleChange, errors, setFormData }) => (
  <div className="space-y-6">
    <h4 className="text-lg font-semibold text-white mb-6 flex items-center">
      <span className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mr-2 shadow-md">
        📚
      </span>
      Academic Background
    </h4>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Apply For Grade :
        </label>
        <div className="grid grid-cols-2 gap-3">
          {['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'].map(grade => (
            <motion.button  
              key={grade}
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setFormData(prev => ({ ...prev, applyingGrade: grade }))}
              className={`py-4 rounded-xl text-center transition-all duration-200 font-medium ${formData.applyingGrade === grade 
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30' 
                : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/70 border border-gray-700'}`}
            >
              {grade}
            </motion.button>
          ))}
        </div>
        {errors.applyingGrade && <p className="mt-2 text-sm text-red-400">{errors.applyingGrade}</p>}
      </div>
      
      <InputField
        label="Last Grade Completed :"
        name="lastGrade"
        value={formData.lastGrade}
        onChange={handleChange}
        error={errors.lastGrade}
        placeholder="e.g., Grade 10"
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InputField
        label="Grade Average :"
        name="gradeAverage"
        value={formData.gradeAverage}
        onChange={handleChange}
        error={errors.gradeAverage}
        placeholder="e.g., 85.5%"
        icon="%"
      />
      
      <InputField
        label="Last School Attended :"
        name="lastSchool"
        value={formData.lastSchool}
        onChange={handleChange}
        error={errors.lastSchool}
        placeholder="e.g., Central High School"
      />
    </div>

    <SelectField
      label="Registration Condition :"
      name="condition"
      value={formData.condition}
      onChange={handleChange}
      options={['New Student', 'Old Student']}
      error={errors.condition}
      placeholder='-Select'
      required
      
    />
  </div>
);

const Step3 = ({ formData, handleChange, errors }) => (
  <div className="space-y-6">
    <h4 className="text-lg font-semibold text-white mb-6 flex items-center">
      <span className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-2">
        👨‍👩‍👧
      </span>
      Guardian Information
    </h4>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      <InputField
        label="Full Name :"
        name="parentName"
        value={formData.parentName}
        onChange={handleChange}
        error={errors.parentName}
        placeholder="Guardian's full name"
      />
      
      <SelectField
        label="Relationship :"
        name="relationship"
        value={formData.relationship}
        onChange={handleChange}
        options={['Father', 'Mother', 'Guardian', 'Other']}
        error={errors.relationship}
        placeholder="Select Relationship"
      />
      
      <InputField
        label="Phone Number :"
        name="parentPhone"
        value={formData.parentPhone}
        onChange={handleChange}
        error={errors.parentPhone}
        placeholder="09 ___ ___ ___"
      />
      
      <InputField
        label="Email Address :"
        type="email"
        name="parentEmail"
        value={formData.parentEmail}
        onChange={handleChange}
        error={errors.parentEmail}
        placeholder="guardian@example.com"
      />
    </div>
    
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Home Address :
      </label>
      <textarea
        name="address"
        rows={3}
        value={formData.address}
        onChange={handleChange}
        className={`w-full px-4 py-3 bg-gray-800/50 border ${errors.address ? 'border-red-500' : 'border-gray-600'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all`}
        placeholder="Full residential address"
      />
      {errors.address && <p className="mt-1 text-sm text-red-400">{errors.address}</p>}
    </div>
  </div>
);

const Step4 = ({ formData, errors, handleFileClick, fileUploadProgress, uploadCounter }) => (
  <div className="space-y-6">
    <h4 className="text-lg font-semibold text-white mb-6 flex items-center">
      <span className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center mr-2">
        📄
      </span>
      Required Documents
    </h4>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      {[
        { key: 'birthCertificate', label: 'Certificate Front *', icon: '' },
        { key: 'transcript', label: 'Certificate Back *', icon: '' },
        { key: 'faydaId', label: 'Student National ID Front ', icon: '' },
        { key: 'ParentPhoto', label: 'Upload Parent Photo ', icon: '' },
        { key: 'transferCertificate', label: 'Parent ID (Woreda Or Fayda Nu)', icon: '' },
        { key: 'clearance', label: 'Clearance', icon: ''}
       
      ].map((doc) => (
        <FileUploadCard
          key={doc.key}
          fieldName={doc.key}
          label={doc.label}
          icon={doc.icon}
          file={formData[doc.key]}
          error={errors[doc.key]}
          handleFileClick={handleFileClick}
          fileUploadProgress={fileUploadProgress[doc.key]}
          uploadCounter={uploadCounter}
        />
      ))}
    </div>
  </div>
);

const Step5 = ({ formData, errors, handleFileClick, paymentMethods, activeMethod, setActiveMethod, submitError, testConnection, fileUploadProgress, uploadCounter }) => (
  <div className="max-w-2xl mx-auto">
    <div className="text-center mb-8">
      <h4 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">
        💰 Payment Gateway
      </h4>
      <p className="text-gray-300">Complete your admission by making the required payment</p>
    </div>

    <div className="mb-8">
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {paymentMethods.map((method, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => setActiveMethod(index)}
            className={`flex items-center px-5 py-2.5 rounded-xl transition-all ${activeMethod === index 
              ? `bg-gradient-to-r ${method.gradient} text-white shadow-lg` 
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
          >
            {method.icon}
            <span className="ml-2 font-medium">{method.name}</span>
          </motion.button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="w-56 h-56 md:w-64 md:h-64 mb-4 border-2 border-gray-600 rounded-2xl bg-white p-4 shadow-2xl">
            <img 
              src={paymentMethods[activeMethod].image} 
              alt={`${paymentMethods[activeMethod].name} QR Code`}
              className="w-full h-full object-contain"
            />
          </div>
          <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${paymentMethods[activeMethod].gradient} bg-opacity-20`}>
            <span className={`font-semibold text-${paymentMethods[activeMethod].color}-400`}>
              {paymentMethods[activeMethod].name}
            </span>
          </div>
        </div>

        <div className="text-center space-y-4">
          <div>
            <p className="text-gray-400 mb-1">Pay Code</p>
            <div className="text-2xl md:text-3xl font-mono font-bold bg-gray-900 px-6 py-3 rounded-xl inline-block border border-gray-700">
              {paymentMethods[activeMethod].payCode}
            </div>
          </div>

          <div className="pt-6 border-t border-gray-700">
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              500 ETB
            </div>
            <p className="text-gray-400 mt-2">Admission Processing Fee</p>
          </div>
        </div>
      </motion.div>
    </div>

    <div className="mt-8">
      <label className="block text-lg font-semibold text-white mb-4 text-center">
         Upload Payment Receipt :
      </label>
      <FileUploadField
        fieldName="paymentReceipt"
        file={formData.paymentReceipt}
        error={errors.paymentReceipt}
        handleFileClick={handleFileClick}
        accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
        variant="large"
        fileUploadProgress={fileUploadProgress.paymentReceipt}
        uploadCounter={uploadCounter}
      />
    </div>

  </div>
);

const SuccessScreen = ({ applicationData, resetForm, formData }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="p-6 md:p-8 text-center"
  >
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ x: Math.random() * window.innerWidth, y: -100, rotate: 0 }}
          animate={{ y: window.innerHeight, rotate: 360 }}
          transition={{ duration: Math.random() * 2 + 1, repeat: Infinity, delay: Math.random() * 0.5 }}
          className="absolute w-2 h-2"
          style={{ background: `hsl(${Math.random() * 360}, 100%, 60%)`, borderRadius: '50%' }}
        />
      ))}
    </div>

    <div className="relative z-10">
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="mx-auto flex items-center justify-center h-20 w-20 md:h-24 md:w-24 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 mb-6 shadow-2xl shadow-emerald-500/30"
      >
        <svg className="h-10 w-10 md:h-12 md:w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </motion.div>
      
      <motion.h3 
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent mb-4"
      >
        🎉 Admission Request Created Successfully!
      </motion.h3>
      
      <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
        🎯 Your admission request has been received and is being processed. You will receive a confirmation email shortly.
      </p>
      
      {applicationData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 p-6 md:p-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700 backdrop-blur-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400">Application ID</p>
                <p className="font-mono text-lg md:text-xl font-bold text-cyan-300">{applicationData.admissionId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Student Name</p>
                <p className="text-base md:text-lg font-semibold text-white">{applicationData.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Submitted Date</p>
                <p className="text-base md:text-lg font-semibold text-white">{applicationData.timestamp}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400">Student ID</p>
                <p className="font-mono text-lg md:text-xl font-bold text-purple-300">{applicationData.studentId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Grade</p>
                <p className="text-base md:text-lg font-semibold text-white">{applicationData.grade}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Status</p>
                <p className="text-base md:text-lg font-semibold text-green-400">Pending Review</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-blue-900/30 rounded-xl border border-blue-700/50">
            <p className="text-blue-300 text-sm">
              <span className="font-bold">🎯 CREATE ADMISSION REQUEST RECEIVED</span> - Your application is now in our system and will be reviewed by our admissions committee.
            </p>
          </div>
        </motion.div>
      )}
      
      <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={resetForm}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
        >
          Submit Another Application
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={() => window.print()}
          className="px-6 py-3 bg-gray-800/50 text-gray-200 font-semibold rounded-xl hover:bg-gray-700/50 border border-gray-700 transition-all duration-300"
        >
          Print Confirmation
        </motion.button>
      </div>
    </div>
  </motion.div>
);

// Reusable Components
const InputField = ({ label, type = 'text', name, value, onChange, error, placeholder, icon }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">
      {label}
    </label>
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 bg-gray-800/50 border ${error ? 'border-red-500' : 'border-gray-600'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${icon ? 'pr-10' : ''}`}
        placeholder={placeholder}
      />
      {icon && (
        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
          {icon}
        </span>
      )}
    </div>
    {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
  </div>
);

const SelectField = ({ label, name, value, onChange, options, error, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-3 bg-gray-800/50 border ${error ? 'border-red-500' : 'border-gray-600'} rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all`}
    >
      {placeholder && <option value="" className="bg-gray-800">{placeholder}</option>}
      {options.map(option => (
        <option key={option} value={option} className="bg-gray-800">{option}</option>
      ))}
    </select>
    {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
  </div>
);

const FileUploadField = ({ fieldName, file, error, handleFileClick, accept, variant = 'normal', fileUploadProgress, uploadCounter }) => (
  <div>
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => handleFileClick(fieldName)}
      className={`w-full ${variant === 'large' ? 'p-8' : 'p-6'} border-2 ${error ? 'border-red-500' : 'border-dashed border-gray-600'} rounded-xl text-center cursor-pointer bg-gray-800/30 hover:bg-gray-800/50 transition-all relative overflow-hidden`}
    >
      {fileUploadProgress ? (
        <div className="text-blue-400">
          <div className={`${variant === 'large' ? 'text-4xl' : 'text-3xl'} mb-2`}>⏳</div>
          <p className="font-medium truncate">{fileUploadProgress.fileName || fieldName}</p>
          <div className="mt-3">
            <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: `${fileUploadProgress.progress}%` }}
                transition={{ duration: 0.3 }}
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
              />
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Step {uploadCounter} of 5 • {fileUploadProgress.progress}%
            </p>
          </div>
        </div>
      ) : file ? (
        <div className="text-green-400">
          <div className={`${variant === 'large' ? 'text-4xl' : 'text-3xl'} mb-2`}>📷</div>
          <p className="font-medium truncate">{file.name}</p>
          <p className="text-sm text-gray-400">
            {(file.size / 1024 / 1024).toFixed(2)} MB • Click to change
          </p>
        </div>
      ) : (
        <div className="text-gray-400">
          <div className={`${variant === 'large' ? 'text-4xl' : 'text-3xl'} mb-2`}>📤</div>
          <p className="font-medium">Upload {fieldName === 'photo' ? 'Photo' : 'Document'}</p>
          <p className="text-sm">
            max 5MB
          </p>
        </div>
      )}
    </motion.div>
    {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
  </div>
);

const FileUploadCard = ({ fieldName, label, icon, file, error, handleFileClick, fileUploadProgress, uploadCounter }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="space-y-3"
  >
    <label className="block text-sm font-medium text-gray-300">
      {icon} {label}
    </label>
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={() => handleFileClick(fieldName)}
      className={`p-6 border-2 ${error ? 'border-red-500' : 'border-dashed border-gray-600'} rounded-xl text-center cursor-pointer bg-gray-800/30 hover:bg-gray-800/50 transition-all relative overflow-hidden`}
    >
      {fileUploadProgress ? (
        <div className="text-blue-400">
          <p className="font-medium truncate">{fileUploadProgress.fileName || fieldName}</p>
          <div className="mt-2">
            <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: `${fileUploadProgress.progress}%` }}
                transition={{ duration: 0.3 }}
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Step {uploadCounter} of 5 • {fileUploadProgress.progress}%
            </p>
          </div>
        </div>
      ) : file ? (
        <div className="text-green-400">
          <p className="font-medium truncate">{file.name}</p>
          <p className="text-sm text-gray-400 mt-1">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
      ) : (
        <div className="text-gray-400">
          <p className="font-medium">Upload Document</p>
          <p className="text-sm mt-1">image max 5MB</p>
        </div>
      )}
    </motion.div>
    {error && <p className="text-sm text-red-400">{error}</p>}
  </motion.div>
);

export default AdmissionForm;
