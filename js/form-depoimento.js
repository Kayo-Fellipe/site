// DOM Elements
const testimonialForm = document.getElementById('testimonialForm');
const photoTypeRadios = document.getElementsByName('photoType');
const photoUrlGroup = document.getElementById('photoUrlGroup');
const photoUploadGroup = document.getElementById('photoUploadGroup');
const successMessage = document.getElementById('successMessage');

// Toggle photo input type
photoTypeRadios.forEach(radio => {
  radio.addEventListener('change', (e) => {
    if (e.target.value === 'url') {
      photoUrlGroup.classList.remove('hidden');
      photoUploadGroup.classList.add('hidden');
    } else {
      photoUrlGroup.classList.add('hidden');
      photoUploadGroup.classList.remove('hidden');
    }
  });
});

// Process image upload
async function processImage(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve(getDefaultAvatarUrl());
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}

// Get default avatar URL based on name
function getDefaultAvatarUrl(name) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
}

// Show success message
function showSuccessMessage() {
  successMessage.classList.remove('hidden');
  testimonialForm.classList.add('hidden');
}

// Handle form submission
testimonialForm.addEventListener('submit', async (e) => {
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
    const photoFile = document.getElementById('photoUpload').files[0];
    if (photoFile) {
      try {
        photoUrl = await processImage(photoFile);
      } catch (error) {
        console.error('Error processing image:', error);
        photoUrl = getDefaultAvatarUrl(name);
      }
    } else {
      photoUrl = getDefaultAvatarUrl(name);
    }
  }
  
  try {
    // Create testimonial object
    const newTestimonial = {
      name,
      photo: photoUrl,
      service,
      testimonial: testimonialText,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    };
    
    // Add to Firebase
    const testimonialRef = firebase.database().ref('testimonials');
    await testimonialRef.push(newTestimonial);
    
    // Show success message
    showSuccessMessage();
  } catch (error) {
    console.error('Error submitting testimonial:', error);
    alert('Ocorreu um erro ao enviar seu depoimento. Por favor, tente novamente.');
  }
});