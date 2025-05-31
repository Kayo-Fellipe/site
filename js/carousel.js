/**
 * Testimonial Carousel
 * Handles the display and navigation of testimonials in a carousel
 */

// DOM elements
const carouselContainer = document.getElementById('testimonialCarousel');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const indicatorsContainer = document.getElementById('carouselIndicators');

// State
let currentIndex = 0;
let testimonials = [];

/**
 * Initialize the carousel
 */
function initCarousel() {
  // Get testimonials
  testimonials = getTestimonials();
  
  if (testimonials.length === 0) {
    carouselContainer.innerHTML = `
      <div class="empty-state">
        <p>Nenhum depoimento encontrado. Seja o primeiro a deixar seu depoimento!</p>
      </div>
    `;
    return;
  }
  
  // Create carousel items
  createCarouselItems();
  
  // Create indicators
  createIndicators();
  
  // Show first testimonial
  showTestimonial(0);
  
  // Add event listeners
  setupEventListeners();
}

/**
 * Create carousel items for each testimonial
 */
function createCarouselItems() {
  carouselContainer.innerHTML = '';
  
  testimonials.forEach((testimonial, index) => {
    const card = document.createElement('div');
    card.className = 'testimonial-card';
    card.id = `testimonial-${testimonial.id}`;
    card.setAttribute('data-index', index);
    
    card.innerHTML = `
      <div class="testimonial-header">
        <img 
          src="${testimonial.photo}" 
          alt="${testimonial.name}" 
          class="testimonial-avatar"
          onerror="this.src='https://via.placeholder.com/150?text=${testimonial.name.charAt(0)}'"
        >
        <div class="testimonial-meta">
          <h3 class="testimonial-name">${testimonial.name}</h3>
          <p class="testimonial-service">${testimonial.service}</p>
        </div>
      </div>
      <div class="testimonial-content">
        <span class="testimonial-quote">"</span>
        <p>${testimonial.testimonial}</p>
      </div>
    `;
    
    carouselContainer.appendChild(card);
  });
}

/**
 * Create indicator dots for the carousel
 */
function createIndicators() {
  indicatorsContainer.innerHTML = '';
  
  testimonials.forEach((_, index) => {
    const indicator = document.createElement('span');
    indicator.className = 'indicator';
    indicator.setAttribute('data-index', index);
    indicator.addEventListener('click', () => {
      showTestimonial(index);
    });
    
    indicatorsContainer.appendChild(indicator);
  });
}

/**
 * Show a specific testimonial by index
 * @param {number} index - The index of the testimonial to show
 */
function showTestimonial(index) {
  // Update index
  currentIndex = index;
  
  // Get all cards
  const cards = document.querySelectorAll('.testimonial-card');
  
  // Calculate prev and next indices
  const prevIndex = (index - 1 + testimonials.length) % testimonials.length;
  const nextIndex = (index + 1) % testimonials.length;
  
  // Update card classes
  cards.forEach((card, i) => {
    card.classList.remove('active', 'prev', 'next');
    
    if (i === index) {
      card.classList.add('active');
    } else if (i === prevIndex) {
      card.classList.add('prev');
    } else if (i === nextIndex) {
      card.classList.add('next');
    }
  });
  
  // Update indicators
  const indicators = document.querySelectorAll('.indicator');
  indicators.forEach((indicator, i) => {
    if (i === index) {
      indicator.classList.add('active');
    } else {
      indicator.classList.remove('active');
    }
  });
}

/**
 * Navigate to the previous testimonial
 */
function prevTestimonial() {
  const newIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
  showTestimonial(newIndex);
}

/**
 * Navigate to the next testimonial
 */
function nextTestimonial() {
  const newIndex = (currentIndex + 1) % testimonials.length;
  showTestimonial(newIndex);
}

/**
 * Setup event listeners for carousel navigation
 */
function setupEventListeners() {
  // Navigation buttons
  prevBtn.addEventListener('click', prevTestimonial);
  nextBtn.addEventListener('click', nextTestimonial);
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      prevTestimonial();
    } else if (e.key === 'ArrowRight') {
      nextTestimonial();
    }
  });
  
  // Auto-advance (optional)
  setInterval(nextTestimonial, 8000);
}

// Initialize the carousel when the page loads
document.addEventListener('DOMContentLoaded', initCarousel);