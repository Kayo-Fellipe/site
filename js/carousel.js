/**
 * Initialize the carousel
 */
async function initCarousel() {
  try {
    // Get testimonials from Firebase
    testimonials = await getTestimonials();
    
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
  } catch (error) {
    console.error('Error initializing carousel:', error);
    carouselContainer.innerHTML = `
      <div class="error-state">
        <p>Erro ao carregar os depoimentos. Por favor, tente novamente mais tarde.</p>
      </div>
    `;
  }
}