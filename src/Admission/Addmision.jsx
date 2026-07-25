// AdmissionForm.jsx
import React, { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import TelebirrQR from '../assets/TelebirrQR.jpg';
import logo from '../assets/tullulogo.png';
import imageCompression from 'browser-image-compression';
import Cropper from 'react-easy-crop';

// ===== CONSTANTS & CONFIGURATION =====
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_DOCUMENT_TYPES = [...ALLOWED_IMAGE_TYPES, 'application/pdf'];

// ===== API SERVICE =====
const api = axios.create({
  baseURL: API_URL,
  timeout: 300000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error('API Error:', {
        status: error.response.status,
        data: error.response.data,
      });
    }
    return Promise.reject(error);
  }
);

// ===== INITIAL STATE =====
const getInitialFormData = () => ({
  age: '',
  grandParentName: '',
  firstName: '',
  lastName: '',
  gender: '',
  dob: '',
  nationality: '',
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
  field: null,
});

// ===== PAYMENT METHODS =====
const PAYMENT_METHODS = [
  {
    name: "Telebirr",
    gradient: "from-green-500 to-emerald-600",
    image: TelebirrQR,
    payCode: "150120",
    icon: (props) => (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
      </svg>
    )
  },
  {
    name: "CBE Birr",
    gradient: "from-blue-500 to-cyan-600",
    image: TelebirrQR,
    payCode: "250230",
    icon: (props) => (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
      </svg>
    )
  }
];

// ===== UTILITY FUNCTIONS =====
const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validateFileType = (file, isPhoto = false) => {
  const allowedTypes = isPhoto ? ALLOWED_IMAGE_TYPES : ALLOWED_DOCUMENT_TYPES;
  return allowedTypes.includes(file.type.toLowerCase());
};

const validateFileSize = (file) => {
  return file.size <= MAX_FILE_SIZE_BYTES;
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const sanitizeInput = (value) => {
  if (typeof value !== 'string') return value;
  return value.replace(/[<>]/g, '').trim();
};

const capitalizeName = (value) => {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
    || window.innerWidth < 768;
};

// ===== CUSTOM HOOKS =====
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  return [storedValue, setValue];
};

// ===== PHOTO CROPPER COMPONENT =====
const PhotoCropper = ({ image, onCropComplete, onClose, isMobile }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);

  const onCropChange = (crop) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom) => {
    setZoom(zoom);
  };

  const onCropCompleteHandler = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropConfirm = useCallback(async () => {
    if (!croppedAreaPixels) return;
    
    setIsCropping(true);
    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      onCropComplete(croppedImage);
    } catch (error) {
      console.error('Error cropping image:', error);
    } finally {
      setIsCropping(false);
    }
  }, [image, croppedAreaPixels, onCropComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative bg-gray-900 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-700">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-lg font-bold text-white flex items-center">
            <span className="mr-2">✂️</span> Crop Photo (3:4)
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
          >
            ✕
          </button>
        </div>

        <div className="relative" style={{ height: isMobile ? '400px' : '500px' }}>
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={3/4}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropCompleteHandler}
            cropShape="rect"
            showGrid={false}
            style={{
              containerStyle: {
                position: 'relative',
                width: '100%',
                height: '100%',
                backgroundColor: '#1a1a2e',
              },
              cropAreaStyle: {
                borderRadius: '4px',
                border: '2px solid #4F46E5',
              },
            }}
          />
        </div>

        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-gray-400 text-sm">🔍</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-gray-400 text-sm">{Math.round(zoom * 100)}%</span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl bg-gray-800 text-gray-300 font-medium hover:bg-gray-700 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleCropConfirm}
              disabled={isCropping}
              className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCropping ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Processing...
                </span>
              ) : (
                '✅ Crop & Upload'
              )}
            </button>
          </div>

          <div className="mt-3 text-xs text-center text-gray-500">
            <span className="inline-flex items-center gap-3">
              <span>↔️ Drag to move</span>
              <span>🔍 Pinch or slider to zoom</span>
              <span>📐 Fixed 3:4 ratio</span>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Helper function to get cropped image
const getCroppedImg = async (imageSrc, pixelCrop) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const file = new File([blob], 'cropped-photo.jpg', {
        type: 'image/jpeg',
        lastModified: Date.now(),
      });
      resolve(file);
    }, 'image/jpeg', 0.95);
  });
};

const createImage = (url) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });
};

// ===== MAIN COMPONENT =====
const AdmissionForm = () => {
  const [formData, setFormData] = useState(getInitialFormData());
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [fanSubmitError, setFanSubmitError] = useState('');
  const [applicationData, setApplicationData] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const [fileUploadProgress, setFileUploadProgress] = useState({});
  const [activePaymentMethod, setActivePaymentMethod] = useState(0);
  const [apiHealth, setApiHealth] = useLocalStorage('apiHealth', 'checking');
  const [isMobile, setIsMobile] = useState(isMobileDevice());
  const [abortController, setAbortController] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState({});
  
  // Photo Cropper State
  const [showCropper, setShowCropper] = useState(false);
  const [cropperImage, setCropperImage] = useState(null);
  const [pendingPhotoField, setPendingPhotoField] = useState(null);
  const [croppedPhotoPreview, setCroppedPhotoPreview] = useState(null);

  // Refs
  const fileInputRefs = useRef({});
  const formRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    checkApiHealth();
    
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setIsMobile(isMobileDevice());
      }, 250);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      mountedRef.current = false;
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
      if (abortController) {
        abortController.abort();
      }
    };
  }, []);

  const checkApiHealth = useCallback(async () => {
    try {
      const response = await api.get('/api/health');
      if (mountedRef.current) {
        setApiHealth('healthy');
      }
    } catch (error) {
      if (mountedRef.current) {
        setApiHealth('unhealthy');
        setSubmitError('⚠️ Cannot connect to server. Please check your connection.');
      }
    }
  }, [setApiHealth]);

  const compressImage = useCallback(async (file) => {
    if (!file || !file.type.startsWith('image/')) return file;

    try {
      const options = {
        maxSizeMB: isMobile ? 0.3 : 0.5,
        maxWidthOrHeight: isMobile ? 800 : 1024,
        useWebWorker: true,
        fileType: 'image/jpeg',
        quality: isMobile ? 0.7 : 0.85,
      };
      const compressedFile = await imageCompression(file, options);
      
      if (isMobile && compressedFile.size > 500 * 1024) {
        const furtherCompression = await imageCompression(compressedFile, {
          maxSizeMB: 0.3,
          maxWidthOrHeight: 600,
          useWebWorker: true,
        });
        return new File([furtherCompression], file.name, {
          type: 'image/jpeg',
          lastModified: Date.now(),
        });
      }
      
      return new File([compressedFile], file.name, {
        type: compressedFile.type,
        lastModified: compressedFile.lastModified,
      });
    } catch (error) {
      console.error('Image compression failed:', error);
      return file;
    }
  }, [isMobile]);

  const validateFile = useCallback((file, fieldName) => {
    const isPhoto = fieldName === 'photo';
    const errors = [];

    if (!file) {
      errors.push('File is required');
      return errors;
    }

    if (!validateFileType(file, isPhoto)) {
      const allowedTypes = isPhoto ? 'images' : 'images or PDF';
      errors.push(`Invalid file type. Please upload ${allowedTypes} only.`);
    }

    const maxSize = isMobile ? 3 * 1024 * 1024 : MAX_FILE_SIZE_BYTES;
    if (file.size > maxSize) {
      const sizeInMB = maxSize / (1024 * 1024);
      errors.push(`File is too large! Maximum size is ${sizeInMB}MB${isMobile ? ' on mobile' : ''}.`);
    }

    return errors;
  }, [isMobile]);

  const handlePhotoSelect = useCallback(async (e) => {
    const { name, files } = e.target;
    
    if (!files || !files[0]) {
      console.log('No file selected');
      return;
    }

    const file = files[0];
    console.log(`Photo selected: ${file.name}, size: ${formatFileSize(file.size)}`);

    setErrors(prev => ({ ...prev, [name]: '' }));

    const validationErrors = validateFile(file, name);
    if (validationErrors.length > 0) {
      setErrors(prev => ({ ...prev, [name]: validationErrors[0] }));
      if (fileInputRefs.current[name]) {
        fileInputRefs.current[name].value = '';
      }
      return;
    }

    setPendingPhotoField(name);
    
    const reader = new FileReader();
    reader.onload = () => {
      setCropperImage(reader.result);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);

    if (fileInputRefs.current[name]) {
      fileInputRefs.current[name].value = '';
    }
  }, [validateFile]);

  const handleCroppedPhoto = useCallback(async (croppedFile) => {
    setShowCropper(false);
    setCropperImage(null);

    const fieldName = pendingPhotoField;
    if (!fieldName || !croppedFile) return;

    console.log(`Cropped photo: ${croppedFile.name}, size: ${formatFileSize(croppedFile.size)}`);

    setFileUploadProgress(prev => ({
      ...prev,
      [fieldName]: {
        fileName: croppedFile.name,
        fileSize: formatFileSize(croppedFile.size),
        progress: 0,
        status: 'validating',
      }
    }));

    let processedFile = croppedFile;
    if (croppedFile.type.startsWith('image/')) {
      setFileUploadProgress(prev => ({
        ...prev,
        [fieldName]: {
          ...prev[fieldName],
          status: 'compressing',
        }
      }));
      
      setUploadStatus('Compressing image...');
      
      try {
        processedFile = await compressImage(croppedFile);
        console.log(`Compressed: ${formatFileSize(croppedFile.size)} -> ${formatFileSize(processedFile.size)}`);
      } catch (error) {
        console.error('Compression failed:', error);
        setErrors(prev => ({ ...prev, [fieldName]: 'Failed to compress image. Please try a smaller image.' }));
        setFileUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[fieldName];
          return newProgress;
        });
        return;
      }
    }

    setFormData(prev => ({ ...prev, [fieldName]: processedFile }));
    setSelectedFiles(prev => ({ ...prev, [fieldName]: processedFile }));

    // Create preview URL for the cropped photo
    const previewUrl = URL.createObjectURL(processedFile);
    setCroppedPhotoPreview(previewUrl);

    setFileUploadProgress(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        progress: 100,
        status: 'completed',
      }
    }));

    setUploadStatus('');

    setTimeout(() => {
      setFileUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[fieldName];
        return newProgress;
      });
    }, 2000);

    setPendingPhotoField(null);
  }, [pendingPhotoField, compressImage]);

  const handleFileSelect = useCallback(async (e) => {
    const { name, files } = e.target;
    
    if (name === 'photo') {
      handlePhotoSelect(e);
      return;
    }

    if (!files || !files[0]) {
      console.log('No file selected');
      return;
    }

    const file = files[0];
    console.log(`File selected: ${file.name}, size: ${formatFileSize(file.size)}`);

    setErrors(prev => ({ ...prev, [name]: '' }));

    const validationErrors = validateFile(file, name);
    if (validationErrors.length > 0) {
      setErrors(prev => ({ ...prev, [name]: validationErrors[0] }));
      if (fileInputRefs.current[name]) {
        fileInputRefs.current[name].value = '';
      }
      return;
    }

    setFileUploadProgress(prev => ({
      ...prev,
      [name]: {
        fileName: file.name,
        fileSize: formatFileSize(file.size),
        progress: 0,
        status: 'validating',
      }
    }));

    let processedFile = file;
    if (file.type.startsWith('image/')) {
      setFileUploadProgress(prev => ({
        ...prev,
        [name]: {
          ...prev[name],
          status: 'compressing',
        }
      }));
      
      setUploadStatus('Compressing image...');
      
      try {
        processedFile = await compressImage(file);
        console.log(`Compressed: ${formatFileSize(file.size)} -> ${formatFileSize(processedFile.size)}`);
      } catch (error) {
        console.error('Compression failed:', error);
        setErrors(prev => ({ ...prev, [name]: 'Failed to compress image. Please try a smaller image.' }));
        if (fileInputRefs.current[name]) {
          fileInputRefs.current[name].value = '';
        }
        setFileUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[name];
          return newProgress;
        });
        return;
      }
    }

    setFormData(prev => ({ ...prev, [name]: processedFile }));
    setSelectedFiles(prev => ({ ...prev, [name]: processedFile }));

    setFileUploadProgress(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        progress: 100,
        status: 'completed',
      }
    }));

    setUploadStatus('');

    setTimeout(() => {
      setFileUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[name];
        return newProgress;
      });
    }, 2000);

    if (fileInputRefs.current[name]) {
      fileInputRefs.current[name].value = '';
    }

  }, [validateFile, compressImage, handlePhotoSelect]);

  const handleChange = useCallback((e) => {
    const { name, value, files } = e.target;

    if (name === 'fayida') {
      const onlyNums = value.replace(/\D/g, '').slice(0, 16);
      setFormData(prev => ({ ...prev, [name]: onlyNums }));
      setFanSubmitError('');
      return;
    }

    if (files && files[0]) {
      handleFileSelect(e);
      return;
    }

    let processedValue = value;
    const capitalizeFields = ['firstName', 'lastName', 'parentName', 'grandParentName'];
    if (capitalizeFields.includes(name)) {
      processedValue = capitalizeName(value);
    }

    if (name === 'applyingGrade') {
      const isGrade11or12 = value === 'Grade 11' || value === 'Grade 12';
      setFormData(prev => ({
        ...prev,
        [name]: value,
        field: isGrade11or12 ? prev.field : null,
      }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: processedValue }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  }, [handleFileSelect]);

  const handleFileClick = useCallback((fieldName) => {
    console.log(`Opening file picker for: ${fieldName}`);
    const inputRef = fileInputRefs.current[fieldName];
    if (inputRef) {
      if (isMobile) {
        setTimeout(() => {
          inputRef.click();
        }, 100);
      } else {
        inputRef.click();
      }
    } else {
      console.warn(`File input ref not found for: ${fieldName}`);
    }
  }, [isMobile]);

  const validateStep = useCallback((step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.grandParentName.trim()) newErrors.grandParentName = 'Grandparent name is required';
      if (!formData.gender) newErrors.gender = 'Gender is required';
      if (!formData.dob) newErrors.dob = 'Date of birth is required';
      if (!formData.age) newErrors.age = 'Age is required';
      if (!formData.nationality) newErrors.nationality = 'Media of instruction is required';
      if (!formData.program) newErrors.program = 'Program is required';
      if (!formData.fayida) {
        newErrors.fayida = 'FAN/FCN is required';
      } else if (formData.fayida.length !== 16) {
        newErrors.fayida = 'FAN/FCN must be exactly 16 digits';
      }
      if (!formData.photo) newErrors.photo = 'Photo is required';

      const isGrade11or12 = formData.applyingGrade === 'Grade 11' || formData.applyingGrade === 'Grade 12';
      if (isGrade11or12 && !formData.field) {
        newErrors.field = 'Stream selection is required for Grade 11 and 12';
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
      } else if (!validateEmail(formData.parentEmail)) {
        newErrors.parentEmail = 'Please enter a valid email address';
      }
      if (!formData.address.trim()) newErrors.address = 'Address is required';
    }

    if (step === 4) {
      const requiredDocs = ['birthCertificate', 'transcript', 'faydaId', 'ParentPhoto', 'clearance'];
      requiredDocs.forEach(doc => {
        if (!formData[doc]) {
          const label = doc.replace(/([A-Z])/g, ' $1').trim();
          newErrors[doc] = `${label} is required`;
        }
      });
    }

    if (step === 5) {
      if (!formData.paymentReceipt) {
        newErrors.paymentReceipt = 'Payment receipt is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const nextStep = useCallback(() => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep, validateStep]);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    setFanSubmitError('');
    setSubmitError(null);

    for (let step = 1; step <= 5; step++) {
      if (!validateStep(step)) {
        setCurrentStep(step);
        setSubmitError(`⚠️ Please fill in all required fields in Step ${step}`);
        return;
      }
    }

    if (formData.fayida) {
      if (formData.fayida.length !== 16) {
        setFanSubmitError('❌ FAN/FCN number must be exactly 16 digits');
        setSubmitError('❌ FAN/FCN number must be exactly 16 digits');
        return;
      }

      try {
        const response = await api.get(`/api/students/check-fan/${formData.fayida}`);
        if (response.data.exists) {
          setFanSubmitError('❌ This FAN/FCN number is already registered. Please use a different number.');
          setSubmitError('❌ This FAN/FCN number is already registered. Please use a different number.');
          return;
        }
      } catch (error) {
        console.error('FAN check error:', error);
      }
    }

    if (apiHealth !== 'healthy') {
      await checkApiHealth();
      if (apiHealth !== 'healthy') {
        setSubmitError('⚠️ Cannot connect to server. Please check your connection.');
        return;
      }
    }

    const controller = new AbortController();
    setAbortController(controller);

    setIsSubmitting(true);
    setSubmitError(null);
    setFanSubmitError('');
    setUploadProgress(0);
    setUploadStatus('Preparing submission...');

    try {
      const formDataToSend = new FormData();

      const textFields = [
        'firstName', 'lastName', 'grandParentName', 'gender', 'dob', 'age',
        'nationality', 'religion', 'applyingGrade', 'lastSchool', 'lastGrade',
        'gradeAverage', 'parentName', 'relationship', 'parentPhone', 'parentEmail',
        'parentOccupation', 'address', 'condition', 'program', 'fayida'
      ];

      textFields.forEach(field => {
        const value = formData[field];
        if (value !== null && value !== undefined) {
          formDataToSend.append(field, sanitizeInput(value));
        }
      });

      const isGrade11or12 = formData.applyingGrade === 'Grade 11' || formData.applyingGrade === 'Grade 12';
      const fieldValue = isGrade11or12 ? formData.field : null;
      if (fieldValue !== null) {
        formDataToSend.append('field', fieldValue);
      }

      const fileFields = [
        'photo', 'birthCertificate', 'transcript', 'transferCertificate',
        'paymentReceipt', 'faydaId', 'ParentPhoto', 'clearance'
      ];

      for (const field of fileFields) {
        if (formData[field] instanceof File) {
          let fileToSend = formData[field];
          if (isMobile && fileToSend.type.startsWith('image/') && fileToSend.size > 500 * 1024) {
            try {
              const compressed = await imageCompression(fileToSend, {
                maxSizeMB: 0.3,
                maxWidthOrHeight: 600,
                useWebWorker: true,
              });
              fileToSend = new File([compressed], fileToSend.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
            } catch (err) {
              console.warn('Final compression failed, using original file');
            }
          }
          formDataToSend.append(field, fileToSend);
        }
      }

      formDataToSend.append('submissionId', `submission_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
      formDataToSend.append('isMobile', isMobile.toString());

      const response = await api.post('/api/admissions/submit', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
        signal: controller.signal,
        timeout: isMobile ? 180000 : 120000,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.lengthComputable) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent);
            setUploadStatus(`Uploading... ${percent}%`);
          }
        }
      });

      if (mountedRef.current) {
        setSubmitSuccess(true);
        setApplicationData({
          admissionId: response.data.admissionId || `ADM${Date.now().toString().slice(-6)}`,
          fullName: `${formData.firstName} ${formData.lastName}`,
          grade: formData.applyingGrade,
          timestamp: new Date().toLocaleString(),
          ...response.data
        });

        setFormData(getInitialFormData());
        setSelectedFiles({});
        setCroppedPhotoPreview(null);
        setCurrentStep(1);
        setErrors({});
        setFanSubmitError('');
        setUploadStatus('Completed!');
      }

    } catch (error) {
      if (error.name === 'AbortError') {
        setSubmitError('Submission was cancelled.');
        return;
      }

      console.error('Submission error:', error);

      if (error.response) {
        const { status, data } = error.response;
        
        if (status === 409 || data?.message?.toLowerCase().includes('email already exists')) {
          const errorMsg = data?.message || 'This email is already registered. Please use a different email address.';
          setErrors(prev => ({ ...prev, parentEmail: errorMsg }));
          setCurrentStep(3);
          setSubmitError('⚠️ Email already exists');
        } else if (status === 400) {
          if (data?.errors) {
            setErrors(data.errors);
            setSubmitError('⚠️ Please fix the highlighted fields');
          } else {
            setSubmitError(`⚠️ ${data?.message || 'Invalid data format'}`);
          }
        } else if (status === 413) {
          setSubmitError(`⚠️ File too large. Maximum size is ${MAX_FILE_SIZE_MB}MB per file.`);
        } else if (status === 500) {
          setSubmitError('⚠️ Server error. Please try again later.');
        } else {
          setSubmitError(`⚠️ ${data?.message || 'Submission failed'}`);
        }
      } else if (error.code === 'ECONNABORTED') {
        setSubmitError('⚠️ Request timeout. Please check your connection and try again.');
      } else if (error.request) {
        setSubmitError('⚠️ No response from server. Please check your connection.');
      } else {
        setSubmitError('⚠️ An unexpected error occurred. Please try again.');
      }

      setUploadProgress(0);
      setUploadStatus('');
    } finally {
      if (mountedRef.current) {
        setIsSubmitting(false);
        setAbortController(null);
      }
    }
  }, [formData, validateStep, apiHealth, checkApiHealth, isMobile]);

  const resetForm = useCallback(() => {
    setFormData(getInitialFormData());
    setSelectedFiles({});
    setCroppedPhotoPreview(null);
    setCurrentStep(1);
    setSubmitSuccess(false);
    setApplicationData(null);
    setErrors({});
    setSubmitError(null);
    setFanSubmitError('');
    setUploadProgress(0);
    setUploadStatus('');
    setFileUploadProgress({});
    setShowCropper(false);
    setCropperImage(null);
    setPendingPhotoField(null);
  }, []);

  const isGrade11or12 = useMemo(() => {
    return formData.applyingGrade === 'Grade 11' || formData.applyingGrade === 'Grade 12';
  }, [formData.applyingGrade]);

  const progress = useMemo(() => {
    return Math.round(((currentStep - 1) / 4) * 100);
  }, [currentStep]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A2540] via-[#12355B] to-[#1E5F99] overflow-hidden relative">
      <BackgroundAnimation />
      
      <div className="relative z-10 min-h-screen py-4 md:py-12 px-2 sm:px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Header currentStep={currentStep} progress={progress} isMobile={isMobile} />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="backdrop-blur-xl bg-white/6 border border-white/10 rounded-2xl md:rounded-3xl shadow-2xl shadow-black/30 overflow-hidden">
              <ProgressBar currentStep={currentStep} />

              <div className="px-3 md:px-6 lg:px-8 pt-4 md:pt-8">
                <StepIndicator currentStep={currentStep} progress={progress} />
              </div>

              {Object.keys(fileUploadProgress).length > 0 && (
                <FileProgressDisplay 
                  fileUploadProgress={fileUploadProgress}
                  isFileUploading={Object.values(fileUploadProgress).some(p => p.progress < 100)}
                />
              )}

              {isSubmitting && (
                <UploadProgressDisplay
                  uploadProgress={uploadProgress}
                  uploadStatus={uploadStatus}
                />
              )}

              <form ref={formRef} onSubmit={handleSubmit} noValidate>
                {['photo', 'birthCertificate', 'transcript', 'transferCertificate', 
                  'paymentReceipt', 'faydaId', 'ParentPhoto', 'clearance'].map((field) => (
                  <input
                    key={field}
                    type="file"
                    ref={(el) => {
                      fileInputRefs.current[field] = el;
                    }}
                    onChange={handleChange}
                    name={field}
                    className="hidden"
                    accept={field === "photo" ? "image/*" : ".pdf,.jpg,.jpeg,.png,.gif,.webp"}
                  />
                ))}

                {showCropper && cropperImage && (
                  <PhotoCropper
                    image={cropperImage}
                    onCropComplete={handleCroppedPhoto}
                    onClose={() => {
                      setShowCropper(false);
                      setCropperImage(null);
                      setPendingPhotoField(null);
                    }}
                    isMobile={isMobile}
                  />
                )}

                <AnimatePresence mode="wait">
                  {submitSuccess ? (
                    <SuccessScreen 
                      applicationData={applicationData} 
                      resetForm={resetForm} 
                      isMobile={isMobile}
                    />
                  ) : (
                    <StepContent
                      currentStep={currentStep}
                      formData={formData}
                      errors={errors}
                      handleChange={handleChange}
                      handleFileClick={handleFileClick}
                      fileUploadProgress={fileUploadProgress}
                      setFormData={setFormData}
                      isGrade11or12={isGrade11or12}
                      activePaymentMethod={activePaymentMethod}
                      setActivePaymentMethod={setActivePaymentMethod}
                      isMobile={isMobile}
                      croppedPhotoPreview={croppedPhotoPreview}
                    />
                  )}
                </AnimatePresence>

                {!submitSuccess && (
                  <NavigationButtons
                    currentStep={currentStep}
                    isSubmitting={isSubmitting}
                    apiHealth={apiHealth}
                    onPrev={prevStep}
                    onNext={nextStep}
                    uploadStatus={uploadStatus}
                    uploadProgress={uploadProgress}
                    isMobile={isMobile}
                    submitError={submitError}
                    fanSubmitError={fanSubmitError}
                  />
                )}
              </form>
            </div>
          </motion.div>

          {isMobile && (
            <div className="mt-4 text-center text-xs text-gray-400">
              <p>📱 Mobile optimized • Images will be compressed for faster upload</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ===== BACKGROUND ANIMATION =====
const BackgroundAnimation = memo(() => {
  const canvasRef = useRef(null);
  const isMobile = isMobileDevice();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particleCount = isMobile ? 15 : 50;
    const particles = [];

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * (isMobile ? 2 : 3) + 1;
        this.speedX = Math.random() * (isMobile ? 0.3 : 0.5) - (isMobile ? 0.15 : 0.25);
        this.speedY = Math.random() * (isMobile ? 0.3 : 0.5) - (isMobile ? 0.15 : 0.25);
        this.color = `rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, 255, ${isMobile ? 0.3 : 0.5})`;
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

    let animationId;
    let frameCount = 0;

    const animate = () => {
      if (isMobile) {
        frameCount++;
        if (frameCount % 2 === 0) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          particles.forEach(particle => {
            particle.update();
            particle.draw();
          });
        }
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(particle => {
          particle.update();
          particle.draw();
        });
      }
      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [isMobile]);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />;
});

// ===== HEADER =====
const Header = memo(({ currentStep, progress, isMobile }) => (
  <motion.div 
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, type: "spring" }}
    className="text-center mb-6 md:mb-12"
  >
    <div className="relative inline-block mb-4 md:mb-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        whileHover={{ scale: 1.05 }}
        className={`${isMobile ? 'w-32 h-32' : 'w-48 h-48'} mx-auto flex items-center justify-center bg-white rounded-full shadow-lg`}
      >
        <img src={logo} alt="Logo" className={`${isMobile ? 'w-28 h-28' : 'w-40 h-40'} object-contain`} />
      </motion.div>
      
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 border-2 border-transparent border-t-purple-500/50 rounded-full"
      />
    </div>
    
    <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl md:text-4xl lg:text-5xl'} font-black bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-1 md:mb-3 tracking-tight px-2`}>
      TULLU DIMTU SECONDARY SCHOOL
    </h1>
    
    <div className="relative inline-block">
      <h2 className={`${isMobile ? 'text-lg' : 'text-xl md:text-2xl'} font-bold text-cyan-300 mb-2`}>
        Admission Portal 2026
      </h2>
      <div className="absolute -inset-x-4 inset-y-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent blur-sm" />
    </div>
    
    <p className="text-gray-300 mt-2 md:mt-4 max-w-2xl mx-auto text-xs md:text-base px-4">
      Begin your journey to excellence. Join Ethiopia's premier educational institution.
    </p>
    
    <motion.div 
      className="mt-4 md:mt-8 flex justify-center space-x-2"
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
          className="w-4 md:w-8 h-1 rounded-full transition-all duration-300"
        />
      ))}
    </motion.div>
  </motion.div>
));

// ===== PROGRESS BAR =====
const ProgressBar = memo(({ currentStep }) => (
  <div className="relative h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 overflow-hidden">
    <motion.div
      animate={{ x: ['0%', '100%'] }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
    />
  </div>
));

// ===== STEP INDICATOR =====
const StepIndicator = memo(({ currentStep, progress }) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-8 gap-3">
    <div className="flex items-center space-x-3 md:space-x-4">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 md:w-12 md:h-12 rounded-full border-2 border-purple-500/30 flex items-center justify-center"
      >
        <span className="text-base md:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          {currentStep}
        </span>
      </motion.div>
      <div>
        <h3 className="text-base md:text-xl font-bold text-white">
          {getStepTitle(currentStep)}
        </h3>
        <p className="text-gray-400 text-xs md:text-sm">Step {currentStep} of 5</p>
      </div>
    </div>
    
    <div className="relative w-12 h-12 md:w-16 md:h-16">
      <svg className="w-full h-full transform -rotate-90">
        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-700" />
        <motion.circle
          cx="24"
          cy="24"
          r="20"
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          className="text-indigo-500"
          initial={{ strokeDasharray: "125.6", strokeDashoffset: "125.6" }}
          animate={{ strokeDashoffset: 125.6 - (125.6 * progress) / 100 }}
          transition={{ duration: 0.5 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white font-bold text-xs md:text-base">{progress}%</span>
      </div>
    </div>
  </div>
));

// ===== FILE PROGRESS DISPLAY =====
const FileProgressDisplay = memo(({ fileUploadProgress, isFileUploading }) => (
  <motion.div
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: 'auto' }}
    className="px-4 md:px-6 py-2 md:py-3 bg-gray-800/80 border-b border-gray-700/50"
  >
    <p className="text-xs md:text-sm text-cyan-300 font-medium mb-1 md:mb-2">
      {isFileUploading ? '📤 Processing files...' : '✅ Files processed successfully!'}
    </p>
    <div className="space-y-1 md:space-y-2">
      {Object.entries(fileUploadProgress).map(([fieldName, progress]) => (
        <div key={fieldName} className="space-y-0.5">
          <div className="flex justify-between text-xs">
            <span className="text-gray-300 truncate">
              {progress.fileName || fieldName}
              {progress.status && (
                <span className="ml-2 text-gray-400">({progress.status})</span>
              )}
            </span>
            <span className="text-gray-400">{progress.progress}%</span>
          </div>
          <div className="w-full h-1 md:h-1.5 bg-gray-700 rounded-full overflow-hidden">
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
));

// ===== UPLOAD PROGRESS DISPLAY =====
const UploadProgressDisplay = memo(({ uploadProgress, uploadStatus }) => (
  <motion.div
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: 'auto' }}
    className="px-4 md:px-6 py-2 md:py-3 bg-gray-800/50 border-b border-gray-700/50"
  >
    <div className="flex items-center justify-between mb-1 md:mb-2">
      <span className="text-xs md:text-sm text-cyan-300 font-medium">
        {uploadStatus || `Processing... ${uploadProgress}%`}
      </span>
      <span className="text-xs md:text-sm text-gray-400">{uploadProgress}%</span>
    </div>
    <div className="w-full h-1.5 md:h-2 bg-gray-700 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: '0%' }}
        animate={{ width: `${uploadProgress}%` }}
        transition={{ duration: 0.3 }}
        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
      />
    </div>
  </motion.div>
));

// ===== STEP CONTENT =====
const StepContent = memo(({
  currentStep,
  formData,
  errors,
  handleChange,
  handleFileClick,
  fileUploadProgress,
  setFormData,
  isGrade11or12,
  activePaymentMethod,
  setActivePaymentMethod,
  isMobile,
  croppedPhotoPreview
}) => {
  const stepComponents = {
    1: Step1,
    2: Step2,
    3: Step3,
    4: Step4,
    5: Step5
  };

  const StepComponent = stepComponents[currentStep];
  
  if (!StepComponent) return null;

  return (
    <motion.div
      key={`step-${currentStep}`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="px-3 md:px-6 lg:px-8 pb-4 md:pb-6"
    >
      <StepComponent
        formData={formData}
        errors={errors}
        handleChange={handleChange}
        handleFileClick={handleFileClick}
        fileUploadProgress={fileUploadProgress}
        setFormData={setFormData}
        isGrade11or12={isGrade11or12}
        activePaymentMethod={activePaymentMethod}
        setActivePaymentMethod={setActivePaymentMethod}
        isMobile={isMobile}
        croppedPhotoPreview={croppedPhotoPreview}
      />
    </motion.div>
  );
});

// ===== NAVIGATION BUTTONS =====
const NavigationButtons = memo(({
  currentStep,
  isSubmitting,
  apiHealth,
  onPrev,
  onNext,
  uploadStatus,
  uploadProgress,
  isMobile,
  submitError,
  fanSubmitError
}) => (
  <div className={`px-3 md:px-6 lg:px-8 py-3 md:py-6 border-t border-gray-700/50 bg-gray-900/30 flex flex-col`}>
    {(submitError || fanSubmitError) && (
      <div className="mb-4">
        {submitError && (
          <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl">
            <p className="text-red-300 text-sm text-center">{submitError}</p>
          </div>
        )}
        {fanSubmitError && (
          <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl">
            <p className="text-red-300 text-sm text-center">{fanSubmitError}</p>
          </div>
        )}
      </div>
    )}

    <div className="flex flex-col sm:flex-row justify-between gap-3">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="button"
        onClick={onPrev}
        disabled={currentStep === 1 || isSubmitting}
        className={`px-4 md:px-6 py-2 md:py-3 bg-gray-800/50 text-gray-200 font-semibold rounded-xl hover:bg-gray-700/50 border border-gray-700 hover:border-gray-600 transition-all duration-300 text-sm md:text-base ${
          (currentStep === 1 || isSubmitting) ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''
        } order-2 sm:order-1`}
      >
        ← Previous
      </motion.button>

      {currentStep < 5 ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={onNext}
          disabled={isSubmitting}
          className={`px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 text-sm md:text-base ${
            isSubmitting ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''
          } order-1 sm:order-2`}
        >
          Continue →
        </motion.button>
      ) : (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={isSubmitting || apiHealth !== 'healthy'}
          className={`px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 text-sm md:text-base ${
            (isSubmitting || apiHealth !== 'healthy') ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''
          } order-1 sm:order-2`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-4 w-4 md:h-5 md:w-5 mr-2" viewBox="0 0 24 24">
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
  </div>
));

// ===== STEP 1: PERSONAL DETAILS =====
const Step1 = memo(({ formData, errors, handleChange, handleFileClick, fileUploadProgress, setFormData, isGrade11or12, isMobile, croppedPhotoPreview }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6">
    <div className="lg:col-span-2">
      <h4 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4 flex items-center">
        <span className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-indigo-500/20 flex items-center justify-center mr-2">👤</span>
        Student Information
      </h4>
    </div>
    
    <div className="space-y-3 md:space-y-4">
      <InputField
        label="First Name"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        error={errors.firstName}
        placeholder="Enter first name"
        required
        isMobile={isMobile}
      />

      <InputField
        label="Last Name"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        error={errors.lastName}
        placeholder="Enter last name"
        required
        isMobile={isMobile}
      />
      
      <InputField
        label="Grand Father Name"
        name="grandParentName"
        value={formData.grandParentName}
        onChange={handleChange}
        error={errors.grandParentName}
        placeholder="Enter grand father name"
        required
        isMobile={isMobile}
      />
      
      <GenderSelect
        value={formData.gender}
        onChange={handleChange}
        error={errors.gender}
        isMobile={isMobile}
      />
      
      <SelectField
        label="Program"
        name="program"
        value={formData.program}
        onChange={handleChange}
        options={['Regular Program', 'Night Program']}
        error={errors.program}
        placeholder="- Select -"
        required
        isMobile={isMobile}
      />
      
      <SelectField
        label="Media of Instruction"
        name="nationality"
        value={formData.nationality}
        onChange={handleChange}
        options={['Afaan Oromoo', 'Afaan Amharaa']}
        error={errors.nationality}
        placeholder="- Select -"
        required
        isMobile={isMobile}
      />
    </div>
    
    <div className="space-y-3 md:space-y-4">
      <InputField
        label="Date of Birth"
        type="date"
        name="dob"
        value={formData.dob}
        onChange={handleChange}
        error={errors.dob}
        required
        isMobile={isMobile}
      />
      
      <InputField
        label="Age"
        type="number"
        name="age"
        value={formData.age}
        onChange={handleChange}
        error={errors.age}
        placeholder="Enter age"
        required
        isMobile={isMobile}
      />
    
      <InputField
        label="National ID (FAN/FCN)"
        name="fayida"
        type="text"
        maxLength={16}
        value={formData.fayida}
        onChange={handleChange}
        error={errors.fayida}
        placeholder="Enter 16-digit FAN/FCN number"
        required
        isMobile={isMobile}
      />

      <GradeSelection
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        isGrade11or12={isGrade11or12}
        isMobile={isMobile}
      />

      <PhotoUploadWithPreview
        formData={formData}
        errors={errors}
        handleFileClick={handleFileClick}
        fileUploadProgress={fileUploadProgress}
        isMobile={isMobile}
        croppedPhotoPreview={croppedPhotoPreview}
        setFormData={setFormData}
      />
    </div>
  </div>
));

// ===== PHOTO UPLOAD WITH PREVIEW AND CHANGE BUTTON =====
const PhotoUploadWithPreview = memo(({ 
  formData, 
  errors, 
  handleFileClick, 
  fileUploadProgress, 
  isMobile, 
  croppedPhotoPreview,
  setFormData
}) => {
  // Generate preview URL from file if no cropped preview exists
  const getPreviewUrl = () => {
    if (croppedPhotoPreview) return croppedPhotoPreview;
    if (formData.photo) {
      return URL.createObjectURL(formData.photo);
    }
    return null;
  };

  const previewUrl = getPreviewUrl();

  // Handle change photo
  const handleChangePhoto = () => {
    // Clear the photo
    setFormData(prev => ({ ...prev, photo: null }));
    // Open file picker
    handleFileClick('photo');
  };

  return (
    <div>
      <label className="block text-xs md:text-sm font-medium text-gray-300 mb-1 md:mb-2">
        Student Photo <span className="text-red-400">*</span>
      </label>
      
      {previewUrl ? (
        // Show cropped photo preview with Change Photo button - SMALLER SIZE
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <div className="relative  ">
            <img
  src={previewUrl}
  alt="Student Photo"
  className="w-28 h-36 object-cover rounded-md border-2 border-gray-300 shadow-sm"
/>
         
          </div>
          
          <div className="mt-2 flex items-center justify-between">
            <div className="text-xs text-gray-400">
              <span className="text-green-400">✓</span> Photo uploaded
            </div>
            <button
              type="button"
              onClick={handleChangePhoto}
              className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-medium flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Change
            </button>
          </div>
          
          {errors.photo && (
            <p className="mt-1 text-xs md:text-sm text-red-400">{errors.photo}</p>
          )}
        </motion.div>
      ) : (
        // Show upload button when no photo
        <div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleFileClick('photo')}
            className={`w-full p-4 md:p-6 border-2 ${errors.photo ? 'border-red-500' : 'border-dashed border-gray-600'} rounded-xl text-center cursor-pointer bg-gray-800/30 hover:bg-gray-800/50 transition-all relative overflow-hidden`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleFileClick('photo');
              }
            }}
          >
            <div className="text-gray-400">
              <div className="text-2xl md:text-3xl mb-1">📤</div>
              <p className="font-medium text-sm">Upload Photo</p>
              <p className="text-xs">max {isMobile ? '3' : '5'}MB</p>
              <p className="text-xs text-blue-400 mt-1">✂️ Cropped to 3:4</p>
            </div>
          </motion.div>
          {errors.photo && (
            <p className="mt-1 text-xs md:text-sm text-red-400">{errors.photo}</p>
          )}
        </div>
      )}
    </div>
  );
});

// ===== STEP 2: ACADEMIC BACKGROUND =====
const Step2 = memo(({ formData, errors, handleChange, isMobile }) => (
  <div className="space-y-4 md:space-y-6">
    <h4 className="text-base md:text-lg font-semibold text-white mb-4 md:mb-6 flex items-center">
      <span className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mr-2 shadow-md">📚</span>
      Academic Background
    </h4>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
      <InputField
        label="Last Grade Completed"
        name="lastGrade"
        value={formData.lastGrade}
        onChange={handleChange}
        error={errors.lastGrade}
        placeholder="e.g., Grade 10"
        required
        isMobile={isMobile}
      />
      
      <InputField
        label="Grade Average"
        name="gradeAverage"
        value={formData.gradeAverage}
        onChange={handleChange}
        error={errors.gradeAverage}
        placeholder="e.g., 85.5%"
        icon="%"
        required
        isMobile={isMobile}
      />
    </div>

    <InputField
      label="Last School Attended"
      name="lastSchool"
      value={formData.lastSchool}
      onChange={handleChange}
      error={errors.lastSchool}
      placeholder="e.g., Central High School"
      required
      isMobile={isMobile}
    />

    <SelectField
      label="Registration Condition"
      name="condition"
      value={formData.condition}
      onChange={handleChange}
      options={['New Student', 'Old Student']}
      error={errors.condition}
      placeholder="- Select -"
      required
      isMobile={isMobile}
    />
  </div>
));

// ===== STEP 3: GUARDIAN INFORMATION =====
const Step3 = memo(({ formData, errors, handleChange, isMobile }) => (
  <div className="space-y-4 md:space-y-6">
    <h4 className="text-base md:text-lg font-semibold text-white mb-4 md:mb-6 flex items-center">
      <span className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-2">👨‍👩‍👧</span>
      Guardian Information
    </h4>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
      <InputField
        label="Full Name"
        name="parentName"
        value={formData.parentName}
        onChange={handleChange}
        error={errors.parentName}
        placeholder="Guardian's full name"
        required
        isMobile={isMobile}
      />
      
      <SelectField
        label="Relationship"
        name="relationship"
        value={formData.relationship}
        onChange={handleChange}
        options={['Father', 'Mother', 'Guardian', 'Other']}
        error={errors.relationship}
        placeholder="- Select -"
        required
        isMobile={isMobile}
      />
      
      <InputField
        label="Phone Number"
        name="parentPhone"
        value={formData.parentPhone}
        onChange={handleChange}
        error={errors.parentPhone}
        placeholder="09 ___ ___ ___"
        type="tel"
        required
        isMobile={isMobile}
      />
      
      <InputField
        label="Student Email Address"
        type="email"
        name="parentEmail"
        value={formData.parentEmail}
        onChange={handleChange}
        error={errors.parentEmail}
        placeholder="student@example.com"
        required
        isMobile={isMobile}
      />
    </div>
    
    <div>
      <label className="block text-xs md:text-sm font-medium text-gray-300 mb-1 md:mb-2">
        Home Address 
      </label>
      <textarea
        name="address"
        rows={isMobile ? 2 : 3}
        value={formData.address}
        onChange={handleChange}
        className={`w-full px-3 md:px-4 py-2 md:py-3 bg-gray-800/50 border ${errors.address ? 'border-red-500' : 'border-gray-600'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm md:text-base`}
        placeholder="Full residential address"
        required
      />
      {errors.address && <p className="mt-1 text-xs md:text-sm text-red-400">{errors.address}</p>}
    </div>
  </div>
));

// ===== STEP 4: DOCUMENT UPLOAD =====
const Step4 = memo(({ formData, errors, handleFileClick, fileUploadProgress, isMobile }) => (
  <div className="space-y-4 md:space-y-6">
    <h4 className="text-base md:text-lg font-semibold text-white mb-4 md:mb-6 flex items-center">
      <span className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-yellow-500/20 flex items-center justify-center mr-2">📄</span>
      Required Documents
    </h4>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
      {[
        { key: 'birthCertificate', label: 'Certificate Front *' },
        { key: 'transcript', label: 'Certificate Back *' },
        { key: 'faydaId', label: 'Student National ID Front' },
        { key: 'ParentPhoto', label: 'Upload Parent Photo *' },
        { key: 'transferCertificate', label: 'Parent ID (Woreda or Fayda)' },
        { key: 'clearance', label: 'Clearance *' }
      ].map((doc) => (
        <FileUploadCard
          key={doc.key}
          fieldName={doc.key}
          label={doc.label}
          file={formData[doc.key]}
          error={errors[doc.key]}
          handleFileClick={handleFileClick}
          fileUploadProgress={fileUploadProgress[doc.key]}
          isMobile={isMobile}
        />
      ))}
    </div>
  </div>
));

// ===== STEP 5: PAYMENT =====
const Step5 = memo(({ 
  formData, 
  errors, 
  handleFileClick, 
  fileUploadProgress,
  activePaymentMethod,
  setActivePaymentMethod,
  isMobile
}) => (
  <div className="max-w-2xl mx-auto">
    <div className="text-center mb-6 md:mb-8">
      <h4 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">
        💰 Payment Gateway
      </h4>
      <p className="text-gray-300 text-sm md:text-base">Complete your admission by making the required payment</p>
    </div>

    <div className="mb-6 md:mb-8">
      <PaymentMethodSelector
        activeMethod={activePaymentMethod}
        setActiveMethod={setActivePaymentMethod}
        methods={PAYMENT_METHODS}
        isMobile={isMobile}
      />

      <PaymentDetails
        method={PAYMENT_METHODS[activePaymentMethod]}
        isMobile={isMobile}
      />
    </div>

    <div className="mt-6 md:mt-8">
      <label className="block text-base md:text-lg font-semibold text-white mb-3 md:mb-4 text-center">
        Upload Payment Receipt 
      </label>
      <FileUploadField
        fieldName="paymentReceipt"
        file={formData.paymentReceipt}
        error={errors.paymentReceipt}
        handleFileClick={handleFileClick}
        accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
        variant="large"
        fileUploadProgress={fileUploadProgress.paymentReceipt}
        isMobile={isMobile}
      />
    </div>
  </div>
));

// ===== SUCCESS SCREEN =====
const SuccessScreen = memo(({ applicationData, resetForm, isMobile }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="p-4 md:p-8 text-center"
  >
    <div className="relative z-10">
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className={`mx-auto flex items-center justify-center ${isMobile ? 'h-16 w-16' : 'h-20 w-20 md:h-24 md:w-24'} rounded-full bg-gradient-to-r from-green-500 to-emerald-500 mb-4 md:mb-6 shadow-2xl shadow-emerald-500/30`}
      >
        <svg className={`${isMobile ? 'h-8 w-8' : 'h-10 w-10 md:h-12 md:w-12'} text-white`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </motion.div>
      
      <motion.h3 
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className={`${isMobile ? 'text-2xl' : 'text-3xl md:text-4xl'} font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent mb-3 md:mb-4`}
      >
        🎉 Admission Request Created Successfully!
      </motion.h3>
      
      <p className="text-gray-300 text-sm md:text-base mb-6 md:mb-8 max-w-2xl mx-auto px-4">
        Your admission request has been received and is being processed. You will receive a confirmation email shortly.
      </p>
      
      {applicationData && (
        <ApplicationSummary data={applicationData} isMobile={isMobile} />
      )}
      
      <div className="mt-6 md:mt-8 flex flex-col sm:flex-row justify-center gap-3 md:gap-4 px-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={resetForm}
          className={`px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 text-sm md:text-base`}
        >
          Submit Another Application
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={() => window.print()}
          className={`px-4 md:px-6 py-2 md:py-3 bg-gray-800/50 text-gray-200 font-semibold rounded-xl hover:bg-gray-700/50 border border-gray-700 transition-all duration-300 text-sm md:text-base`}
        >
          Print Confirmation
        </motion.button>
      </div>
    </div>
  </motion.div>
));

// ===== REUSABLE COMPONENTS =====

const InputField = memo(({ 
  label, type = 'text', name, value, onChange, error, placeholder, 
  icon, required = false, maxLength, isMobile = false 
}) => (
  <div>
    <label className="block text-xs md:text-sm font-medium text-gray-300 mb-1 md:mb-2">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        className={`w-full px-3 md:px-4 py-2 md:py-3 bg-gray-800/50 border ${error ? 'border-red-500' : 'border-gray-600'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${icon ? 'pr-8 md:pr-10' : ''} text-sm md:text-base ${isMobile ? 'text-base' : ''}`}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        autoComplete={isMobile ? 'off' : 'on'}
      />
      {icon && (
        <span className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
          {icon}
        </span>
      )}
    </div>
    {error && (
      <p id={`${name}-error`} className="mt-1 text-xs md:text-sm text-red-400" role="alert">
        {error}
      </p>
    )}
  </div>
));

const SelectField = memo(({ 
  label, name, value, onChange, options, error, placeholder, 
  required = false, isMobile = false 
}) => (
  <div>
    <label className="block text-xs md:text-sm font-medium text-gray-300 mb-1 md:mb-2">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full px-3 md:px-4 py-2 md:py-3 bg-gray-800/50 border ${error ? 'border-red-500' : 'border-gray-600'} rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm md:text-base ${isMobile ? 'text-base' : ''}`}
      aria-invalid={!!error}
      aria-describedby={error ? `${name}-error` : undefined}
    >
      {placeholder && <option value="" className="bg-gray-800">{placeholder}</option>}
      {options.map(option => (
        <option key={option} value={option} className="bg-gray-800">{option}</option>
      ))}
    </select>
    {error && (
      <p id={`${name}-error`} className="mt-1 text-xs md:text-sm text-red-400" role="alert">
        {error}
      </p>
    )}
  </div>
));

const GenderSelect = memo(({ value, onChange, error, isMobile }) => (
  <div>
    <label className="block text-xs md:text-sm font-medium text-gray-300 mb-1 md:mb-2">
      Gender * <span className="text-red-400">*</span>
    </label>
    <div className="grid grid-cols-3 gap-1 md:gap-2">
      {['Male', 'Female', 'Other'].map(gender => (
        <motion.button
          key={gender}
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onChange({ target: { name: 'gender', value: gender.toLowerCase() } })}
          className={`py-2 md:py-3 rounded-xl text-center transition-all font-medium text-sm md:text-base ${
            value === gender.toLowerCase() 
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-purple-500/30' 
              : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700'
          }`}
          aria-pressed={value === gender.toLowerCase()}
        >
          {gender}
        </motion.button>
      ))}
    </div>
    {error && (
      <p className="mt-1 text-xs md:text-sm text-red-400" role="alert">{error}</p>
    )}
  </div>
));

const GradeSelection = memo(({ formData, setFormData, errors, isGrade11or12, isMobile }) => (
  <div>
    <label className="block text-xs md:text-sm font-medium text-gray-300 mb-1 md:mb-3">
      Apply For Grade  <span className="text-red-400">*</span>
    </label>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-3">
      {['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'].map(grade => (
        <motion.button
          key={grade}
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            const isGrade11or12New = grade === 'Grade 11' || grade === 'Grade 12';
            setFormData(prev => ({ 
              ...prev, 
              applyingGrade: grade,
              field: isGrade11or12New ? prev.field : null
            }));
          }}
          className={`py-2 md:py-4 rounded-lg text-center transition-all duration-200 font-medium text-sm md:text-base ${
            formData.applyingGrade === grade 
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-blue-500/30' 
              : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/70 border border-gray-700'
          }`}
          aria-pressed={formData.applyingGrade === grade}
        >
          {grade}
        </motion.button>
      ))}
    </div>
    {errors.applyingGrade && (
      <p className="mt-1 md:mt-2 text-xs md:text-sm text-red-400" role="alert">{errors.applyingGrade}</p>
    )}

    {isGrade11or12 && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-2 md:mt-4 p-3 md:p-4 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-xl border border-purple-500/30"
      >
        <label className="block text-xs md:text-sm font-medium text-purple-300 mb-1 md:mb-2">
          Select Your Stream  (Required for {formData.applyingGrade})
        </label>
        <div className="grid grid-cols-2 gap-1 md:gap-3">
          {['Natural Science', 'Social Science'].map(stream => (
            <motion.button
              key={stream}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFormData(prev => ({ ...prev, field: stream }))}
              className={`py-2 md:py-4 rounded-xl text-center transition-all font-medium text-sm md:text-base ${
                formData.field === stream 
                  ? `bg-gradient-to-r ${stream === 'Natural Science' ? 'from-green-600 to-emerald-600' : 'from-orange-600 to-amber-600'} text-white shadow-lg shadow-${stream === 'Natural Science' ? 'green' : 'orange'}-500/30` 
                  : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/70 border border-gray-700'
              }`}
              aria-pressed={formData.field === stream}
            >
              {stream}
            </motion.button>
          ))}
        </div>
        {errors.field && (
          <p className="mt-1 md:mt-2 text-xs md:text-sm text-red-400" role="alert">{errors.field}</p>
        )}
      </motion.div>
    )}
  </div>
));

const FileUploadField = memo(({ 
  fieldName, 
  file, 
  error, 
  handleFileClick, 
  accept, 
  variant = 'normal', 
  fileUploadProgress,
  isMobile = false
}) => (
  <div>
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => handleFileClick(fieldName)}
      className={`w-full ${variant === 'large' ? (isMobile ? 'p-6' : 'p-8') : (isMobile ? 'p-4' : 'p-6')} border-2 ${error ? 'border-red-500' : 'border-dashed border-gray-600'} rounded-xl text-center cursor-pointer bg-gray-800/30 hover:bg-gray-800/50 transition-all relative overflow-hidden`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleFileClick(fieldName);
        }
      }}
    >
      {fileUploadProgress && fileUploadProgress.progress < 100 ? (
        <div className="text-blue-400">
          <div className={`${variant === 'large' ? (isMobile ? 'text-3xl' : 'text-4xl') : (isMobile ? 'text-2xl' : 'text-3xl')} mb-1 md:mb-2`}>⏳</div>
          <p className="font-medium truncate text-sm md:text-base">{fileUploadProgress.fileName || fieldName}</p>
          <div className="mt-2 md:mt-3">
            <div className="w-full h-1 md:h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: `${fileUploadProgress.progress}%` }}
                transition={{ duration: 0.3 }}
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">{fileUploadProgress.progress}%</p>
          </div>
        </div>
      ) : file ? (
        <div className="text-green-400">
          <div className={`${variant === 'large' ? (isMobile ? 'text-3xl' : 'text-4xl') : (isMobile ? 'text-2xl' : 'text-3xl')} mb-1 md:mb-2`}>✅</div>
          <p className="font-medium truncate text-sm md:text-base">{file.name}</p>
          <p className="text-xs text-gray-400">{formatFileSize(file.size)} • Click to change</p>
        </div>
      ) : (
        <div className="text-gray-400">
          <div className={`${variant === 'large' ? (isMobile ? 'text-3xl' : 'text-4xl') : (isMobile ? 'text-2xl' : 'text-3xl')} mb-1 md:mb-2`}>📤</div>
          <p className="font-medium text-sm md:text-base">Upload {fieldName === 'photo' ? 'Photo' : 'Document'}</p>
          <p className="text-xs">max {isMobile ? '3' : '5'}MB</p>
        </div>
      )}
    </motion.div>
    {error && (
      <p className="mt-1 text-xs md:text-sm text-red-400" role="alert">{error}</p>
    )}
  </div>
));

const FileUploadCard = memo(({ fieldName, label, file, error, handleFileClick, fileUploadProgress, isMobile }) => (
  <motion.div whileHover={{ scale: 1.02 }} className="space-y-1 md:space-y-3">
    <label className="block text-xs md:text-sm font-medium text-gray-300">
      {label}
    </label>
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={() => handleFileClick(fieldName)}
      className={`p-3 md:p-6 border-2 ${error ? 'border-red-500' : 'border-dashed border-gray-600'} rounded-xl text-center cursor-pointer bg-gray-800/30 hover:bg-gray-800/50 transition-all relative overflow-hidden`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleFileClick(fieldName);
        }
      }}
    >
      {fileUploadProgress && fileUploadProgress.progress < 100 ? (
        <div className="text-blue-400">
          <p className="font-medium truncate text-sm">{fileUploadProgress.fileName || fieldName}</p>
          <div className="mt-1 md:mt-2">
            <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: `${fileUploadProgress.progress}%` }}
                transition={{ duration: 0.3 }}
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">{fileUploadProgress.progress}%</p>
          </div>
        </div>
      ) : file ? (
        <div className="text-green-400">
          <p className="font-medium truncate text-sm">{file.name}</p>
          <p className="text-xs text-gray-400 mt-1">{formatFileSize(file.size)}</p>
        </div>
      ) : (
        <div className="text-gray-400">
          <p className="font-medium text-sm">Upload Document</p>
          <p className="text-xs mt-1">max {isMobile ? '3' : '5'}MB</p>
        </div>
      )}
    </motion.div>
    {error && (
      <p className="text-xs md:text-sm text-red-400" role="alert">{error}</p>
    )}
  </motion.div>
));

const PaymentMethodSelector = memo(({ activeMethod, setActiveMethod, methods, isMobile }) => (
  <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-4 md:mb-6">
    {methods.map((method, index) => (
      <motion.button
        key={index}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="button"
        onClick={() => setActiveMethod(index)}
        className={`flex items-center px-3 md:px-5 py-2 md:py-2.5 rounded-xl transition-all text-sm md:text-base ${
          activeMethod === index 
            ? `bg-gradient-to-r ${method.gradient} text-white shadow-lg` 
            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
        }`}
        aria-pressed={activeMethod === index}
      >
        {method.icon({ className: `${isMobile ? 'h-5 w-5' : 'h-7 w-7'}` })}
        <span className={`ml-1 md:ml-2 font-medium ${isMobile ? 'text-xs' : ''}`}>{method.name}</span>
      </motion.button>
    ))}
  </div>
));

const PaymentDetails = memo(({ method, isMobile }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 md:p-6 border border-gray-700"
  >
    <div className="flex flex-col items-center mb-4 md:mb-6">
      <div className={`${isMobile ? 'w-40 h-40' : 'w-56 h-56 md:w-64 md:h-64'} mb-3 md:mb-4 border-2 border-gray-600 rounded-2xl bg-white p-3 md:p-4 shadow-2xl`}>
        <img 
          src={method.image} 
          alt={`${method.name} QR Code`}
          className="w-full h-full object-contain"
        />
      </div>
      <div className={`px-3 md:px-4 py-1 md:py-2 rounded-full bg-gradient-to-r ${method.gradient} bg-opacity-20`}>
        <span className={`font-semibold text-white ${isMobile ? 'text-sm' : ''}`}>{method.name}</span>
      </div>
    </div>

    <div className="text-center space-y-3 md:space-y-4">
      <div>
        <p className="text-gray-400 mb-1 text-sm">Pay Code</p>
        <div className={`${isMobile ? 'text-xl' : 'text-2xl md:text-3xl'} font-mono font-bold bg-gray-900 px-4 md:px-6 py-2 md:py-3 rounded-xl inline-block border border-gray-700`}>
          {method.payCode}
        </div>
      </div>

      <div className="pt-4 md:pt-6 border-t border-gray-700">
        <div className={`${isMobile ? 'text-2xl' : 'text-3xl md:text-4xl'} font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent`}>
          500 ETB
        </div>
        <p className="text-gray-400 mt-1 md:mt-2 text-sm">Admission Processing Fee</p>
      </div>
    </div>
  </motion.div>
));

const ApplicationSummary = memo(({ data, isMobile }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className="mt-6 md:mt-8 p-4 md:p-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700 backdrop-blur-sm"
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-left">
      <div className="space-y-2 md:space-y-4">
        <div>
          <p className="text-xs md:text-sm text-gray-400">Application ID</p>
          <p className={`font-mono ${isMobile ? 'text-base' : 'text-lg md:text-xl'} font-bold text-cyan-300`}>{data.admissionId}</p>
        </div>
        <div>
          <p className="text-xs md:text-sm text-gray-400">Student Name</p>
          <p className={`${isMobile ? 'text-sm' : 'text-base md:text-lg'} font-semibold text-white`}>{data.fullName}</p>
        </div>
        <div>
          <p className="text-xs md:text-sm text-gray-400">Submitted Date</p>
          <p className={`${isMobile ? 'text-sm' : 'text-base md:text-lg'} font-semibold text-white`}>{data.timestamp}</p>
        </div>
      </div>
      <div className="space-y-2 md:space-y-4">
        <div>
          <p className="text-xs md:text-sm text-gray-400">Grade</p>
          <p className={`${isMobile ? 'text-sm' : 'text-base md:text-lg'} font-semibold text-white`}>{data.grade}</p>
        </div>
        <div>
          <p className="text-xs md:text-sm text-gray-400">Status</p>
          <p className={`${isMobile ? 'text-sm' : 'text-base md:text-lg'} font-semibold text-green-400`}>Pending Review</p>
        </div>
      </div>
    </div>
    
    <div className="mt-4 md:mt-8 p-3 md:p-4 bg-blue-900/30 rounded-xl border border-blue-700/50">
      <p className={`text-blue-300 ${isMobile ? 'text-xs' : 'text-sm'}`}>
        <span className="font-bold">🎯 Application Received</span> - Your application is now in our system and will be reviewed by our admissions committee.
      </p>
    </div>
  </motion.div>
));

const getStepTitle = (step) => {
  const titles = {
    1: 'Personal Details',
    2: 'Academic Background',
    3: 'Guardian Information',
    4: 'Document Upload',
    5: 'Payment Processing'
  };
  return titles[step] || '';
};

export default AdmissionForm;