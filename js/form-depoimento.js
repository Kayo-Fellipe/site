/**
 * Testimonial Form
 * Handles the submission and validation of the testimonial form
 */

// DOM elements
const testimonialForm = document.getElementById('testimonialForm');
const photoTypeRadios = document.getElementsByName('photoType');
const photoUrlGroup = document.getElementById('photoUrlGroup');
const photoUploadGroup = document.getElementById('photoUploadGroup');
const successMessage = document.getElementById('successMessage');

/**
 * Initialize the form
 */
function initForm() {
  // Add event listeners
  setupEventListeners();
}

/**
 * Setup event listeners for the form
 */
function setupEventListeners() {
  // Toggle between URL and upload inputs
  photoTypeRadios.forEach(radio => {
    radio.addEventListener('change', togglePhotoInputType);
  });
  
  // Form submission
  testimonialForm.addEventListener('submit', handleFormSubmit);
}

/**
 * Toggle between URL and upload input fields
 */
function togglePhotoInputType() {
  const selectedType = document.querySelector('input[name="photoType"]:checked').value;
  
  if (selectedType === 'url') {
    photoUrlGroup.classList.remove('hidden');
    photoUploadGroup.classList.add('hidden');
  } else {
    photoUrlGroup.classList.add('hidden');
    photoUploadGroup.classList.remove('hidden');
  }
}

/**
 * Handle form submission
 * @param {Event} e - Form submission event
 */
async function handleFormSubmit(e) {
  e.preventDefault();
  
  // Get form data
  const formData = new FormData(testimonialForm);
  const photoType = formData.get('photoType');
  
  // Basic validation
  const name = formData.get('name').trim();
  const service = formData.get('service');
  const testimonialText = formData.get('testimonial').trim();
  
  if (!name || !service || !testimonialText) {
    alert('Por favor, preencha todos os campos obrigatórios.');
    return;
  }
  
  // Handle photo based on type
  let photoUrl = '';
  
  if (photoType === 'url') {
    photoUrl = formData.get('photoUrl').trim();
    if (!photoUrl) {
      photoUrl = getDefaultAvatarUrl(name);
    }
  } else {
    // Handle file upload
    const photoFile = document.getElementById('photoUpload').files[0];
    if (photoFile) {
      photoUrl = await processImage(photoFile);
    } else {
      photoUrl = getDefaultAvatarUrl(name);
    }
  }
  
  // Create testimonial object
  const newTestimonial = {
    name,
    photo: photoUrl,
    service,
    testimonial: testimonialText
  };
  
  // Add testimonial to storage
  addTestimonial(newTestimonial);
  
  // Show success message
  showSuccessMessage();
}

/**
 * Process uploaded image to data URL
 * @param {File} file - The uploaded image file
 * @returns {Promise<string>} - Promise resolving to the data URL
 */
function processImage(file) {
  return new Promise((resolve) => {
    // For localStorage storage, convert to data URL
    const reader = new FileReader();
    
    reader.onload = (e) => {
      resolve(e.target.result);
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Get default avatar URL based on initials
 * @param {string} name - User's name
 * @returns {string} - URL for default avatar
 */
function getDefaultAvatarUrl(name) {
  const initial = name.charAt(0).toUpperCase();
  return `https://via.placeholder.com/150/8A2BE2/FFFFFF?text=${initial}`;
}

/**
 * Show success message after form submission
 */
function showSuccessMessage() {
  // Show success overlay
  successMessage.classList.remove('hidden');
  setTimeout(() => {
    successMessage.classList.add('visible');
  }, 50);
  
  // Option to automatically redirect after a delay
  // setTimeout(() => {
  //   window.location.href = 'principal.html';
  // }, 3000);
}

/**
 * Handle conversion from dataURL to Blob for future server uploads
 * @param {string} dataUrl - Data URL string
 * @returns {Blob} - Blob object
 */
function dataURLtoBlob(dataUrl) {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new Blob([u8arr], { type: mime });
}

/**
 * Utility function to validate URLs
 * @param {string} url - URL to validate
 * @returns {boolean} - Whether URL is valid
 */
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

// Initialize the form when the page loads
document.addEventListener('DOMContentLoaded', initForm);