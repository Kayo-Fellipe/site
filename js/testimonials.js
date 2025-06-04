// Get Firebase database reference
const db = firebase.database();
const testimonialRef = db.ref('testimonials');

let testimonials = [];
let currentIndex = 0;
const carouselContainer = document.getElementById('testimonialCarousel');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const indicators = document.getElementById('carouselIndicators');

/**
 * Create carousel items from testimonials
 */
function createCarouselItems() {
  if (!carouselContainer) return;
  
  carouselContainer.innerHTML = testimonials.map((testimonial, index) => `
    <div class="testimonial-card ${index === 0 ? 'active' : ''}" data-index="${index}">
      <div class="testimonial-header">
        <img src="${testimonial.photo}" alt="${testimonial.name}" class="testimonial-avatar">
        <div class="testimonial-meta">
          <h3 class="testimonial-name">${testimonial.name}</h3>
          <p class="testimonial-service">${testimonial.service}</p>
        </div>
      </div>
      <div class="testimonial-content">
        <p>${testimonial.testimonial}</p>
      </div>
    </div>
  `).join('');
}

/**
 * Create carousel indicators
 */
function createIndicators() {
  if (!indicators) return;
  
  indicators.innerHTML = testimonials.map((_, index) => `
    <div class="indicator ${index === 0 ? 'active' : ''}" data-index="${index}"></div>
  `).join('');
  
  // Add click handlers to indicators
  document.querySelectorAll('.indicator').forEach(indicator => {
    indicator.addEventListener('click', () => {
      const index = parseInt(indicator.dataset.index);
      showTestimonial(index);
    });
  });
}

/**
 * Show testimonial at specific index
 */
function showTestimonial(index) {
  if (!carouselContainer) return;
  
  const cards = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.indicator');
  
  cards.forEach(card => card.classList.remove('active', 'prev', 'next'));
  dots.forEach(dot => dot.classList.remove('active'));
  
  currentIndex = index;
  
  // Update cards
  cards[currentIndex].classList.add('active');
  dots[currentIndex].classList.add('active');
}

/**
 * Setup event listeners for carousel controls
 */
function setupEventListeners() {
  if (!prevBtn || !nextBtn) return;
  
  prevBtn.addEventListener('click', () => {
    const newIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
    showTestimonial(newIndex);
  });
  
  nextBtn.addEventListener('click', () => {
    const newIndex = (currentIndex + 1) % testimonials.length;
    showTestimonial(newIndex);
  });
}

/**
 * Initialize the carousel
 */
async function initCarousel() {
  try {
    // Get testimonials from Firebase
    const snapshot = await testimonialRef.once('value');
    const data = snapshot.val();
    testimonials = data ? Object.values(data) : [];
    
    if (testimonials.length === 0) {
      if (carouselContainer) {
        carouselContainer.innerHTML = `
          <div class="empty-state">
            <p>Nenhum depoimento encontrado. Seja o primeiro a deixar seu depoimento!</p>
          </div>
        `;
      }
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
  } catch (error) {
    console.error('Error initializing carousel:', error);
    if (carouselContainer) {
      carouselContainer.innerHTML = `
        <div class="error-state">
          <p>Erro ao carregar os depoimentos. Por favor, tente novamente mais tarde.</p>
        </div>
      `;
    }
  }
}

// Initialize carousel when DOM is loaded
if (document.getElementById('testimonialCarousel')) {
  initCarousel();
}