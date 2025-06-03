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
    const photoFile = document.getElementById('photoUpload').files[0];
    if (photoFile) {
      photoUrl = await processImage(photoFile);
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
      testimonial: testimonialText
    };
    
    // Add testimonial to Firebase
    await addTestimonial(newTestimonial);
    
    // Show success message
    showSuccessMessage();
  } catch (error) {
    console.error('Error submitting testimonial:', error);
    alert('Ocorreu um erro ao enviar seu depoimento. Por favor, tente novamente.');
  }
}