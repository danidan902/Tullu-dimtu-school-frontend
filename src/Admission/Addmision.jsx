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

// ===== THEME (navi white only) =====
const THEME = {
  background: '#fcfffe',
  card: '#fcfffe',
  input: '#fcfffe',
  button: '#fcfffe',
  text: '#0a2540',
  border: '#c9d6df',
};

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
    image: TelebirrQR,
    payCode: "150120",
  },
  {
    name: "CBE Birr",
    image: TelebirrQR,
    payCode: "250230",
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
      style={{
        position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: 'rgba(10,37,64,0.4)', padding: 16,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div style={{
        background: THEME.card, borderRadius: 16, maxWidth: 640, width: '100%',
        overflow: 'hidden', border: `1px solid ${THEME.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottom: `1px solid ${THEME.border}` }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: THEME.text, margin: 0 }}>✂️ Crop Photo (3:4)</h3>
          <button onClick={onClose} style={{ color: THEME.text, background: 'transparent', border: 'none', fontSize: 18, cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ position: 'relative', height: isMobile ? 400 : 500, background: THEME.background }}>
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={3 / 4}
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
                backgroundColor: THEME.background,
              },
              cropAreaStyle: {
                borderRadius: '4px',
                border: `2px solid ${THEME.border}`,
              },
            }}
          />
        </div>

        <div style={{ padding: 16, borderTop: `1px solid ${THEME.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <span style={{ color: THEME.text, fontSize: 14 }}>🔍</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              style={{ flex: 1, height: 6, accentColor: THEME.text }}
            />
            <span style={{ color: THEME.text, fontSize: 14 }}>{Math.round(zoom * 100)}%</span>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={onClose}
              style={{
                flex: 1, padding: '10px 16px', borderRadius: 12, background: THEME.button,
                color: THEME.text, fontWeight: 500, border: `1px solid ${THEME.border}`, cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleCropConfirm}
              disabled={isCropping}
              style={{
                flex: 1, padding: '10px 16px', borderRadius: 12, background: THEME.button,
                color: THEME.text, fontWeight: 500, border: `1px solid ${THEME.border}`,
                cursor: isCropping ? 'not-allowed' : 'pointer', opacity: isCropping ? 0.5 : 1,
              }}
            >
              {isCropping ? 'Processing...' : '✅ Crop & Upload'}
            </button>
          </div>

          <div style={{ marginTop: 12, fontSize: 12, textAlign: 'center', color: THEME.text, opacity: 0.7 }}>
            <span>↔️ Drag to move • 🔍 Pinch or slider to zoom • 📐 Fixed 3:4 ratio</span>
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

// ===== MAIN COMPONENT (single page) =====
const AdmissionForm = () => {
  const [formData, setFormData] = useState(getInitialFormData());
  const [errors, setErrors] = useState({});
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
      await api.get('/api/health');
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
      return;
    }

    const file = files[0];
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
      return;
    }

    const file = files[0];
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
    const inputRef = fileInputRefs.current[fieldName];
    if (inputRef) {
      if (isMobile) {
        setTimeout(() => {
          inputRef.click();
        }, 100);
      } else {
        inputRef.click();
      }
    }
  }, [isMobile]);

  // Single-page validation — every required field checked at once
  const validateAll = useCallback(() => {
    const newErrors = {};

    // Personal
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

    // Academic
    if (!formData.applyingGrade) newErrors.applyingGrade = 'Grade is required';
    if (!formData.lastSchool.trim()) newErrors.lastSchool = 'Last school is required';
    if (!formData.lastGrade.trim()) newErrors.lastGrade = 'Last grade is required';
    if (!formData.gradeAverage.trim()) newErrors.gradeAverage = 'Grade average is required';
    if (!formData.condition) newErrors.condition = 'Registration condition is required';

    // Guardian
    if (!formData.parentName.trim()) newErrors.parentName = 'Parent name is required';
    if (!formData.relationship) newErrors.relationship = 'Relationship is required';
    if (!formData.parentPhone.trim()) newErrors.parentPhone = 'Phone number is required';
    if (!formData.parentEmail.trim()) {
      newErrors.parentEmail = 'Email is required';
    } else if (!validateEmail(formData.parentEmail)) {
      newErrors.parentEmail = 'Please enter a valid email address';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';

    // Documents
    const requiredDocs = ['birthCertificate', 'transcript', 'faydaId', 'ParentPhoto', 'clearance'];
    requiredDocs.forEach(doc => {
      if (!formData[doc]) {
        const label = doc.replace(/([A-Z])/g, ' $1').trim();
        newErrors[doc] = `${label} is required`;
      }
    });

    // Payment
    if (!formData.paymentReceipt) {
      newErrors.paymentReceipt = 'Payment receipt is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    setFanSubmitError('');
    setSubmitError(null);

    if (!validateAll()) {
      setSubmitError('⚠️ Please fill in all required fields');
      return;
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
  }, [formData, validateAll, apiHealth, checkApiHealth, isMobile]);

  const resetForm = useCallback(() => {
    setFormData(getInitialFormData());
    setSelectedFiles({});
    setCroppedPhotoPreview(null);
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

  const isFileUploading = Object.values(fileUploadProgress).some(p => p.progress < 100);

  return (
    <div style={{ minHeight: '100vh', background: THEME.background, color: THEME.text }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: isMobile ? '16px 8px' : '32px 16px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <img src={logo} alt="Logo" style={{ height: isMobile ? 96 : 140, objectFit: 'contain' }} />
          <h1 style={{ fontSize: isMobile ? 20 : 28, fontWeight: 800, color: THEME.text, margin: '12px 0 4px' }}>
            TULLU DIMTU SECONDARY SCHOOL
          </h1>
          <h2 style={{ fontSize: isMobile ? 16 : 20, fontWeight: 700, color: THEME.text, margin: '0 0 8px' }}>
            Admission Portal 2026
          </h2>
          <p style={{ fontSize: 13, color: THEME.text, opacity: 0.75, margin: 0 }}>
            Begin your journey to excellence. Join Ethiopia's premier educational institution.
          </p>
        </div>

        {submitSuccess ? (
          <SuccessScreen applicationData={applicationData} resetForm={resetForm} isMobile={isMobile} />
        ) : (
          <form ref={formRef} onSubmit={handleSubmit} noValidate>
            {/* Hidden file inputs */}
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
                style={{ display: 'none' }}
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

            {/* File progress display */}
            {Object.keys(fileUploadProgress).length > 0 && (
              <div style={{ background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 12, marginBottom: 16 }}>
                <p style={{ fontSize: 13, color: THEME.text, margin: '0 0 8px' }}>
                  {isFileUploading ? '📤 Processing files...' : '✅ Files processed successfully!'}
                </p>
                {Object.entries(fileUploadProgress).map(([fieldName, progress]) => (
                  <div key={fieldName} style={{ marginBottom: 6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: THEME.text }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {progress.fileName || fieldName}
                      </span>
                      <span>{progress.progress}%</span>
                    </div>
                    <div style={{ width: '100%', height: 6, background: THEME.border, borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ width: `${progress.progress}%`, height: '100%', background: THEME.text, borderRadius: 99 }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Upload progress */}
            {isSubmitting && (
              <div style={{ background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 12, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: THEME.text, marginBottom: 8 }}>
                  <span>{uploadStatus || `Processing... ${uploadProgress}%`}</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div style={{ width: '100%', height: 8, background: THEME.border, borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ width: `${uploadProgress}%`, height: '100%', background: THEME.text, borderRadius: 99 }} />
                </div>
              </div>
            )}

            <div style={{
              background: THEME.card,
              border: `1px solid ${THEME.border}`,
              borderRadius: 16,
              padding: isMobile ? 16 : 28,
              display: 'grid',
              gap: 24,
            }}>
              {/* ================= SECTION: PERSONAL DETAILS ================= */}
              <Section title="👤 Student Information">
                <div style={gridStyle}>
                  <InputField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} error={errors.firstName} placeholder="Enter first name" required isMobile={isMobile} />
                  <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} error={errors.lastName} placeholder="Enter last name" required isMobile={isMobile} />
                  <InputField label="Grand Father Name" name="grandParentName" value={formData.grandParentName} onChange={handleChange} error={errors.grandParentName} placeholder="Enter grand father name" required isMobile={isMobile} />
                  <GenderSelect value={formData.gender} onChange={handleChange} error={errors.gender} isMobile={isMobile} />
                  <InputField label="Date of Birth" type="date" name="dob" value={formData.dob} onChange={handleChange} error={errors.dob} required isMobile={isMobile} />
                  <InputField label="Age" type="number" name="age" value={formData.age} onChange={handleChange} error={errors.age} placeholder="Enter age" required isMobile={isMobile} />
                  <SelectField label="Program" name="program" value={formData.program} onChange={handleChange} options={['Regular Program', 'Night Program']} error={errors.program} placeholder="- Select -" required isMobile={isMobile} />
                  <SelectField label="Media of Instruction" name="nationality" value={formData.nationality} onChange={handleChange} options={['Afaan Oromoo', 'Afaan Amharaa']} error={errors.nationality} placeholder="- Select -" required isMobile={isMobile} />
                  <InputField label="National ID (FAN/FCN)" name="fayida" type="text" maxLength={16} value={formData.fayida} onChange={handleChange} error={errors.fayida} placeholder="Enter 16-digit FAN/FCN number" required isMobile={isMobile} />
                  <GradeSelection formData={formData} setFormData={setFormData} errors={errors} isGrade11or12={isGrade11or12} isMobile={isMobile} />
                </div>
                <PhotoUploadWithPreview
                  formData={formData}
                  errors={errors}
                  handleFileClick={handleFileClick}
                  fileUploadProgress={fileUploadProgress}
                  isMobile={isMobile}
                  croppedPhotoPreview={croppedPhotoPreview}
                  setFormData={setFormData}
                />
              </Section>

              {/* ================= SECTION: ACADEMIC ================= */}
              <Section title="📚 Academic Background">
                <div style={gridStyle}>
                  <InputField label="Last Grade Completed" name="lastGrade" value={formData.lastGrade} onChange={handleChange} error={errors.lastGrade} placeholder="e.g., Grade 10" required isMobile={isMobile} />
                  <InputField label="Grade Average" name="gradeAverage" value={formData.gradeAverage} onChange={handleChange} error={errors.gradeAverage} placeholder="e.g., 85.5%" icon="%" required isMobile={isMobile} />
                  <InputField label="Last School Attended" name="lastSchool" value={formData.lastSchool} onChange={handleChange} error={errors.lastSchool} placeholder="e.g., Central High School" required isMobile={isMobile} />
                  <SelectField label="Registration Condition" name="condition" value={formData.condition} onChange={handleChange} options={['New Student', 'Old Student']} error={errors.condition} placeholder="- Select -" required isMobile={isMobile} />
                </div>
              </Section>

              {/* ================= SECTION: GUARDIAN ================= */}
              <Section title="👨‍👩‍👧 Guardian Information">
                <div style={gridStyle}>
                  <InputField label="Full Name" name="parentName" value={formData.parentName} onChange={handleChange} error={errors.parentName} placeholder="Guardian's full name" required isMobile={isMobile} />
                  <SelectField label="Relationship" name="relationship" value={formData.relationship} onChange={handleChange} options={['Father', 'Mother', 'Guardian', 'Other']} error={errors.relationship} placeholder="- Select -" required isMobile={isMobile} />
                  <InputField label="Phone Number" name="parentPhone" value={formData.parentPhone} onChange={handleChange} error={errors.parentPhone} placeholder="09 ___ ___ ___" type="tel" required isMobile={isMobile} />
                  <InputField label="Student Email Address" type="email" name="parentEmail" value={formData.parentEmail} onChange={handleChange} error={errors.parentEmail} placeholder="student@example.com" required isMobile={isMobile} />
                </div>
                <div>
                  <label style={labelStyle}>Home Address</label>
                  <textarea
                    name="address"
                    rows={isMobile ? 2 : 3}
                    value={formData.address}
                    onChange={handleChange}
                    style={{ ...inputStyle, borderColor: errors.address ? '#ef4444' : THEME.border }}
                    placeholder="Full residential address"
                  />
                  {errors.address && <p style={errorStyle}>{errors.address}</p>}
                </div>
              </Section>

              {/* ================= SECTION: DOCUMENTS ================= */}
              <Section title="📄 Required Documents">
                <div style={gridStyle}>
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
              </Section>

              {/* ================= SECTION: PAYMENT ================= */}
              <Section title="💰 Payment">
                <PaymentMethodSelector
                  activeMethod={activePaymentMethod}
                  setActiveMethod={setActivePaymentMethod}
                  methods={PAYMENT_METHODS}
                  isMobile={isMobile}
                />
                <PaymentDetails method={PAYMENT_METHODS[activePaymentMethod]} isMobile={isMobile} />

                <div style={{ marginTop: 20 }}>
                  <label style={{ ...labelStyle, textAlign: 'center', display: 'block', fontSize: 16 }}>
                    Upload Payment Receipt *
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
              </Section>

              {/* Errors */}
              {(submitError || fanSubmitError) && (
                <div style={{ display: 'grid', gap: 8 }}>
                  {submitError && <div style={errorBoxStyle}>{submitError}</div>}
                  {fanSubmitError && <div style={errorBoxStyle}>{fanSubmitError}</div>}
                </div>
              )}

              {/* Single submit button */}
              <button
                type="submit"
                disabled={isSubmitting || apiHealth !== 'healthy'}
                style={{
                  padding: '14px 20px',
                  borderRadius: 12,
                  border: `1px solid ${THEME.border}`,
                  background: THEME.button,
                  color: THEME.text,
                  fontWeight: 700,
                  fontSize: 16,
                  cursor: (isSubmitting || apiHealth !== 'healthy') ? 'not-allowed' : 'pointer',
                  opacity: (isSubmitting || apiHealth !== 'healthy') ? 0.5 : 1,
                }}
              >
                {isSubmitting ? (uploadStatus || 'Processing...') : '🎓 Submit Application'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// ===== SECTION WRAPPER =====
const Section = ({ title, children }) => (
  <section style={{ display: 'grid', gap: 16 }}>
    <h3 style={{ fontSize: 16, fontWeight: 700, color: THEME.text, margin: 0, paddingBottom: 8, borderBottom: `1px solid ${THEME.border}` }}>
      {title}
    </h3>
    {children}
  </section>
);

// ===== PHOTO UPLOAD WITH PREVIEW =====
const PhotoUploadWithPreview = memo(({
  formData, errors, handleFileClick, fileUploadProgress, isMobile, croppedPhotoPreview, setFormData
}) => {
  const getPreviewUrl = () => {
    if (croppedPhotoPreview) return croppedPhotoPreview;
    if (formData.photo) return URL.createObjectURL(formData.photo);
    return null;
  };

  const previewUrl = getPreviewUrl();

  const handleChangePhoto = () => {
    setFormData(prev => ({ ...prev, photo: null }));
    handleFileClick('photo');
  };

  return (
    <div>
      <label style={labelStyle}>Student Photo *</label>
      {previewUrl ? (
        <div>
          <img src={previewUrl} alt="Student Photo" style={{ width: 112, height: 144, objectFit: 'cover', borderRadius: 8, border: `2px solid ${THEME.border}` }} />
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 220 }}>
            <span style={{ fontSize: 12, color: THEME.text }}>✓ Photo uploaded</span>
            <button type="button" onClick={handleChangePhoto} style={smallBtnStyle}>Change</button>
          </div>
          {errors.photo && <p style={errorStyle}>{errors.photo}</p>}
        </div>
      ) : (
        <div>
          <div
            onClick={() => handleFileClick('photo')}
            style={{
              padding: 24,
              border: `2px dashed ${errors.photo ? '#ef4444' : THEME.border}`,
              borderRadius: 12,
              textAlign: 'center',
              cursor: 'pointer',
              background: THEME.background,
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 4 }}>📤</div>
            <p style={{ margin: 0, fontWeight: 500, color: THEME.text, fontSize: 14 }}>Upload Photo</p>
            <p style={{ margin: '2px 0 0', fontSize: 12, color: THEME.text, opacity: 0.7 }}>max {isMobile ? '3' : '5'}MB • Cropped to 3:4</p>
          </div>
          {errors.photo && <p style={errorStyle}>{errors.photo}</p>}
        </div>
      )}
    </div>
  );
});

// ===== SUCCESS SCREEN =====
const SuccessScreen = memo(({ applicationData, resetForm, isMobile }) => (
  <div style={{ background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 16, padding: isMobile ? 16 : 32, textAlign: 'center' }}>
    <div style={{ fontSize: 40, marginBottom: 8 }}>🎉</div>
    <h3 style={{ fontSize: isMobile ? 20 : 26, fontWeight: 700, color: THEME.text, margin: '0 0 12px' }}>
      Admission Request Created Successfully!
    </h3>
    <p style={{ color: THEME.text, opacity: 0.8, marginBottom: 20, fontSize: 14 }}>
      Your admission request has been received and is being processed. You will receive a confirmation email shortly.
    </p>
    {applicationData && (
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16, textAlign: 'left', marginBottom: 20 }}>
        <div>
          <p style={{ fontSize: 12, color: THEME.text, opacity: 0.7, margin: 0 }}>Application ID</p>
          <p style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 700, margin: 0 }}>{applicationData.admissionId}</p>
        </div>
        <div>
          <p style={{ fontSize: 12, color: THEME.text, opacity: 0.7, margin: 0 }}>Student Name</p>
          <p style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>{applicationData.fullName}</p>
        </div>
        <div>
          <p style={{ fontSize: 12, color: THEME.text, opacity: 0.7, margin: 0 }}>Grade</p>
          <p style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>{applicationData.grade}</p>
        </div>
        <div>
          <p style={{ fontSize: 12, color: THEME.text, opacity: 0.7, margin: 0 }}>Submitted Date</p>
          <p style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>{applicationData.timestamp}</p>
        </div>
      </div>
    )}
    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
      <button type="button" onClick={resetForm} style={submitBtnStyle}>Submit Another Application</button>
      <button type="button" onClick={() => window.print()} style={btnStyle}>Print Confirmation</button>
    </div>
  </div>
));

// ===== REUSABLE COMPONENTS =====
const InputField = memo(({
  label, type = 'text', name, value, onChange, error, placeholder,
  icon, required = false, maxLength, isMobile = false
}) => (
  <div>
    <label style={labelStyle}>
      {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
    </label>
    <div style={{ position: 'relative' }}>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        style={{ ...inputStyle, paddingRight: icon ? 32 : 12, borderColor: error ? '#ef4444' : THEME.border }}
        placeholder={placeholder}
        aria-invalid={!!error}
        autoComplete={isMobile ? 'off' : 'on'}
      />
      {icon && (
        <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: THEME.text }}>
          {icon}
        </span>
      )}
    </div>
    {error && <p style={errorStyle} role="alert">{error}</p>}
  </div>
));

const SelectField = memo(({
  label, name, value, onChange, options, error, placeholder, required = false, isMobile = false
}) => (
  <div>
    <label style={labelStyle}>
      {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      style={{ ...inputStyle, borderColor: error ? '#ef4444' : THEME.border }}
      aria-invalid={!!error}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(option => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
    {error && <p style={errorStyle} role="alert">{error}</p>}
  </div>
));

const GenderSelect = memo(({ value, onChange, error, isMobile }) => (
  <div>
    <label style={labelStyle}>Gender *</label>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
      {['Male', 'Female', 'Other'].map(gender => (
        <button
          key={gender}
          type="button"
          onClick={() => onChange({ target: { name: 'gender', value: gender.toLowerCase() } })}
          style={{
            padding: '10px 8px',
            borderRadius: 10,
            border: `1px solid ${THEME.border}`,
            background: THEME.button,
            color: THEME.text,
            fontWeight: value === gender.toLowerCase() ? 700 : 500,
            cursor: 'pointer',
            outline: value === gender.toLowerCase() ? `2px solid ${THEME.text}` : 'none',
          }}
          aria-pressed={value === gender.toLowerCase()}
        >
          {gender}
        </button>
      ))}
    </div>
    {error && <p style={errorStyle} role="alert">{error}</p>}
  </div>
));

const GradeSelection = memo(({ formData, setFormData, errors, isGrade11or12, isMobile }) => (
  <div style={{ gridColumn: '1 / -1' }}>
    <label style={labelStyle}>Apply For Grade *</label>
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 8 }}>
      {['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'].map(grade => (
        <button
          key={grade}
          type="button"
          onClick={() => {
            const isGrade11or12New = grade === 'Grade 11' || grade === 'Grade 12';
            setFormData(prev => ({
              ...prev,
              applyingGrade: grade,
              field: isGrade11or12New ? prev.field : null
            }));
          }}
          style={{
            padding: '12px 8px',
            borderRadius: 10,
            border: `1px solid ${THEME.border}`,
            background: THEME.button,
            color: THEME.text,
            fontWeight: formData.applyingGrade === grade ? 700 : 500,
            cursor: 'pointer',
            outline: formData.applyingGrade === grade ? `2px solid ${THEME.text}` : 'none',
          }}
          aria-pressed={formData.applyingGrade === grade}
        >
          {grade}
        </button>
      ))}
    </div>
    {errors.applyingGrade && <p style={errorStyle}>{errors.applyingGrade}</p>}

    {isGrade11or12 && (
      <div style={{ marginTop: 12, padding: 12, border: `1px solid ${THEME.border}`, borderRadius: 10, background: THEME.background }}>
        <label style={labelStyle}>Select Your Stream (Required for {formData.applyingGrade})</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
          {['Natural Science', 'Social Science'].map(stream => (
            <button
              key={stream}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, field: stream }))}
              style={{
                padding: '12px 8px',
                borderRadius: 10,
                border: `1px solid ${THEME.border}`,
                background: THEME.button,
                color: THEME.text,
                fontWeight: formData.field === stream ? 700 : 500,
                cursor: 'pointer',
                outline: formData.field === stream ? `2px solid ${THEME.text}` : 'none',
              }}
              aria-pressed={formData.field === stream}
            >
              {stream}
            </button>
          ))}
        </div>
        {errors.field && <p style={errorStyle}>{errors.field}</p>}
      </div>
    )}
  </div>
));

const FileUploadField = memo(({
  fieldName, file, error, handleFileClick, accept, variant = 'normal', fileUploadProgress, isMobile = false
}) => (
  <div>
    <div
      onClick={() => handleFileClick(fieldName)}
      style={{
        padding: variant === 'large' ? (isMobile ? 24 : 32) : (isMobile ? 16 : 24),
        border: `2px dashed ${error ? '#ef4444' : THEME.border}`,
        borderRadius: 12,
        textAlign: 'center',
        cursor: 'pointer',
        background: THEME.background,
      }}
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
        <div>
          <p style={{ margin: 0, color: THEME.text, fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {fileUploadProgress.fileName || fieldName}
          </p>
          <div style={{ width: '100%', height: 6, background: THEME.border, borderRadius: 99, overflow: 'hidden', marginTop: 8 }}>
            <div style={{ width: `${fileUploadProgress.progress}%`, height: '100%', background: THEME.text, borderRadius: 99 }} />
          </div>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: THEME.text, opacity: 0.7 }}>{fileUploadProgress.progress}%</p>
        </div>
      ) : file ? (
        <div>
          <p style={{ margin: 0, color: THEME.text, fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</p>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: THEME.text, opacity: 0.7 }}>{formatFileSize(file.size)} • Click to change</p>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: 26, marginBottom: 4 }}>📤</div>
          <p style={{ margin: 0, color: THEME.text, fontSize: 14, fontWeight: 500 }}>Upload Document</p>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: THEME.text, opacity: 0.7 }}>max {isMobile ? '3' : '5'}MB</p>
        </div>
      )}
    </div>
    {error && <p style={errorStyle} role="alert">{error}</p>}
  </div>
));

const FileUploadCard = memo(({ fieldName, label, file, error, handleFileClick, fileUploadProgress, isMobile }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <div
      onClick={() => handleFileClick(fieldName)}
      style={{
        padding: isMobile ? 12 : 20,
        border: `2px dashed ${error ? '#ef4444' : THEME.border}`,
        borderRadius: 12,
        textAlign: 'center',
        cursor: 'pointer',
        background: THEME.background,
      }}
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
        <div>
          <p style={{ margin: 0, color: THEME.text, fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {fileUploadProgress.fileName || fieldName}
          </p>
          <div style={{ width: '100%', height: 4, background: THEME.border, borderRadius: 99, overflow: 'hidden', marginTop: 6 }}>
            <div style={{ width: `${fileUploadProgress.progress}%`, height: '100%', background: THEME.text, borderRadius: 99 }} />
          </div>
          <p style={{ margin: '4px 0 0', fontSize: 11, color: THEME.text, opacity: 0.7 }}>{fileUploadProgress.progress}%</p>
        </div>
      ) : file ? (
        <div>
          <p style={{ margin: 0, color: THEME.text, fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</p>
          <p style={{ margin: '2px 0 0', fontSize: 11, color: THEME.text, opacity: 0.7 }}>{formatFileSize(file.size)}</p>
        </div>
      ) : (
        <div>
          <p style={{ margin: 0, color: THEME.text, fontSize: 13, fontWeight: 500 }}>Upload Document</p>
          <p style={{ margin: '2px 0 0', fontSize: 11, color: THEME.text, opacity: 0.7 }}>max {isMobile ? '3' : '5'}MB</p>
        </div>
      )}
    </div>
    {error && <p style={errorStyle} role="alert">{error}</p>}
  </div>
));

const PaymentMethodSelector = memo(({ activeMethod, setActiveMethod, methods, isMobile }) => (
  <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
    {methods.map((method, index) => (
      <button
        key={index}
        type="button"
        onClick={() => setActiveMethod(index)}
        style={{
          padding: '10px 18px',
          borderRadius: 10,
          border: `1px solid ${THEME.border}`,
          background: THEME.button,
          color: THEME.text,
          fontWeight: activeMethod === index ? 700 : 500,
          cursor: 'pointer',
          outline: activeMethod === index ? `2px solid ${THEME.text}` : 'none',
        }}
        aria-pressed={activeMethod === index}
      >
        {method.name}
      </button>
    ))}
  </div>
));

const PaymentDetails = memo(({ method, isMobile }) => (
  <div style={{ background: THEME.background, borderRadius: 12, padding: isMobile ? 16 : 24, border: `1px solid ${THEME.border}` }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 16 }}>
      <div style={{ width: isMobile ? 160 : 220, height: isMobile ? 160 : 220, marginBottom: 12, border: `2px solid ${THEME.border}`, borderRadius: 12, background: '#fff', padding: 12 }}>
        <img src={method.image} alt={`${method.name} QR Code`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>
      <span style={{ fontWeight: 600, color: THEME.text }}>{method.name}</span>
    </div>

    <div style={{ textAlign: 'center' }}>
      <p style={{ margin: '0 0 4px', color: THEME.text, opacity: 0.7, fontSize: 13 }}>Pay Code</p>
      <div style={{ fontFamily: 'monospace', fontSize: isMobile ? 20 : 26, fontWeight: 700, color: THEME.text, border: `1px solid ${THEME.border}`, borderRadius: 10, padding: '8px 16px', display: 'inline-block' }}>
        {method.payCode}
      </div>
      <div style={{ marginTop: 16, paddingTop: 12, borderTop: `1px solid ${THEME.border}` }}>
        <div style={{ fontSize: isMobile ? 24 : 30, fontWeight: 700, color: THEME.text }}>500 ETB</div>
        <p style={{ margin: '4px 0 0', color: THEME.text, opacity: 0.7, fontSize: 13 }}>Admission Processing Fee</p>
      </div>
    </div>
  </div>
));

// ===== STYLES =====
const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, color: THEME.text, marginBottom: 6 };

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 10,
  border: `1px solid ${THEME.border}`,
  background: THEME.input,
  color: THEME.text,
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
};

const errorStyle = { marginTop: 4, fontSize: 12, color: '#ef4444' };

const errorBoxStyle = {
  padding: 12,
  borderRadius: 10,
  border: `1px solid ${THEME.border}`,
  background: THEME.card,
  color: THEME.text,
  fontSize: 14,
  textAlign: 'center',
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: 16,
};

const btnStyle = {
  padding: '10px 16px',
  borderRadius: 10,
  border: `1px solid ${THEME.border}`,
  background: THEME.button,
  color: THEME.text,
  cursor: 'pointer',
  fontSize: 14,
  fontWeight: 600,
};

const smallBtnStyle = { ...btnStyle, padding: '6px 12px', fontSize: 12 };

const submitBtnStyle = {
  ...btnStyle,
  padding: '14px 20px',
  fontSize: 16,
  width: '100%',
};

export default AdmissionForm;
