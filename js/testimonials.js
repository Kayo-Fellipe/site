// Get Firebase database reference
const db = firebase.database();
const testimonialRef = db.ref('testimonials');

/**
 * Get all testimonials from Firebase
 * @returns {Promise<Array>} Array of testimonial objects
 */
async function getTestimonials() {
  try {
    const snapshot = await testimonialRef.once('value');
    const data = snapshot.val();
    return data ? Object.values(data) : [];
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
}

/**
 * Add a new testimonial
 * @param {Object} testimonial - Testimonial object
 * @returns {Promise<Object>} Added testimonial with ID
 */
async function addTestimonial(testimonial) {
  try {
    const newTestimonialRef = testimonialRef.push();
    const newTestimonial = {
      ...testimonial,
      id: newTestimonialRef.key,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    };
    
    await newTestimonialRef.set(newTestimonial);
    return newTestimonial;
  } catch (error) {
    console.error('Error adding testimonial:', error);
    throw error;
  }
}

/**
 * Delete a testimonial by ID
 * @param {string} id - Testimonial ID
 * @returns {Promise<boolean>} Success flag
 */
async function deleteTestimonial(id) {
  try {
    await testimonialRef.child(id).remove();
    return true;
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return false;
  }
}

/**
 * Get a single testimonial by ID
 * @param {string} id - Testimonial ID
 * @returns {Promise<Object|null>} Testimonial object or null if not found
 */
async function getTestimonialById(id) {
  try {
    const snapshot = await testimonialRef.child(id).once('value');
    return snapshot.val();
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    return null;
  }
}