/**
 * Testimonials Management
 * Handles the storage and retrieval of testimonial data
 */

// Storage key for localStorage
const STORAGE_KEY = 'portfolio_testimonials';

/**
 * Get all testimonials from storage
 * @returns {Array} Array of testimonial objects
 */
function getTestimonials() {
  // Try to get testimonials from localStorage
  const storedData = localStorage.getItem(STORAGE_KEY);
  
  if (storedData) {
    return JSON.parse(storedData);
  }
  
  // If no data exists, initialize with mock data
  saveTestimonials(MOCK_TESTIMONIALS);
  return MOCK_TESTIMONIALS;
}

/**
 * Save testimonials to storage
 * @param {Array} testimonials - Array of testimonial objects
 */
function saveTestimonials(testimonials) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(testimonials));
}

/**
 * Add a new testimonial
 * @param {Object} testimonial - Testimonial object
 * @returns {Object} Added testimonial with ID
 */
function addTestimonial(testimonial) {
  const testimonials = getTestimonials();
  
  // Generate a new ID
  const newId = testimonials.length > 0 
    ? Math.max(...testimonials.map(t => t.id)) + 1 
    : 1;
  
  // Add testimonial with new ID
  const newTestimonial = {
    ...testimonial,
    id: newId,
    // Add timestamp for sorting (optional)
    timestamp: new Date().toISOString()
  };
  
  // Save updated testimonials
  const updatedTestimonials = [...testimonials, newTestimonial];
  saveTestimonials(updatedTestimonials);
  
  return newTestimonial;
}

/**
 * Delete a testimonial by ID
 * @param {number} id - Testimonial ID
 * @returns {boolean} Success flag
 */
function deleteTestimonial(id) {
  const testimonials = getTestimonials();
  const filteredTestimonials = testimonials.filter(t => t.id !== id);
  
  if (filteredTestimonials.length < testimonials.length) {
    saveTestimonials(filteredTestimonials);
    return true;
  }
  
  return false; // No testimonial found with that ID
}

/**
 * Get a single testimonial by ID
 * @param {number} id - Testimonial ID
 * @returns {Object|null} Testimonial object or null if not found
 */
function getTestimonialById(id) {
  const testimonials = getTestimonials();
  return testimonials.find(t => t.id === id) || null;
}