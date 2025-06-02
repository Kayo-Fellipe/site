// Combined JavaScript Functionality for Full Portfolio Site

// ======================= main.js =======================
const header = document.getElementById('header');
const mobileToggle = document.getElementById('mobile-toggle');
const nav = document.getElementById('nav');
const navLinks = document.querySelectorAll('#nav ul li a');
const scrollTopBtn = document.querySelector('.scroll-top');

mobileToggle.addEventListener('click', () => {
  mobileToggle.classList.toggle('active');
  nav.classList.toggle('active');
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileToggle.classList.remove('active');
    nav.classList.remove('active');
  });
});

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

  if (window.scrollY > 500) {
    scrollTopBtn.classList.add('active');
  } else {
    scrollTopBtn.classList.remove('active');
  }

  updateActiveNavLink();
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
    }
  });
});

function updateActiveNavLink() {
  const sections = document.querySelectorAll('section');
  const scrollPosition = window.scrollY + 200;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

const revealElements = () => {
  const elements = document.querySelectorAll('.section-header, .about-content, .portfolio-item, .service-card, .testimonial-slider, .contact-content');
  elements.forEach(element => {
    const windowHeight = window.innerHeight;
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150;
    if (elementTop < windowHeight - elementVisible) {
      element.classList.add('animate');
    }
  });
};

const style = document.createElement('style');
style.textContent = `
  .section-header, .about-content, .portfolio-item, .service-card, .testimonial-slider, .contact-content {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.5s ease, transform 0.5s ease;
  }
  .section-header.animate, .about-content.animate, .portfolio-item.animate, .service-card.animate, .testimonial-slider.animate, .contact-content.animate {
    opacity: 1;
    transform: translateY(0);
  }
  .portfolio-item:nth-child(2), .service-card:nth-child(2) { transition-delay: 0.2s; }
  .portfolio-item:nth-child(3), .service-card:nth-child(3) { transition-delay: 0.4s; }
  .portfolio-item:nth-child(4), .service-card:nth-child(4) { transition-delay: 0.6s; }
`;
document.head.appendChild(style);

window.addEventListener('scroll', revealElements);
window.addEventListener('load', () => {
  revealElements();
  updateActiveNavLink();
});

// ======================= form-contact.js =======================
const contactForm = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const subjectInput = document.getElementById('subject');
const messageInput = document.getElementById('message');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    if (!validateForm()) {
      e.preventDefault();
      return;
    }
    const name = nameInput.value.trim();
    sessionStorage.setItem('contactFormData', JSON.stringify({ name }));
    submitForm();
    e.preventDefault();
  });
}

function validateForm() {
  let isValid = true;
  removeErrors();

  if (nameInput.value.trim() === '') {
    showError(nameInput, 'Por favor, insira seu nome');
    isValid = false;
  }
  if (emailInput.value.trim() === '') {
    showError(emailInput, 'Por favor, insira seu e-mail');
    isValid = false;
  } else if (!isValidEmail(emailInput.value)) {
    showError(emailInput, 'Por favor, insira um e-mail válido');
    isValid = false;
  }
  if (subjectInput.value.trim() === '') {
    showError(subjectInput, 'Por favor, insira um assunto');
    isValid = false;
  }
  if (messageInput.value.trim() === '') {
    showError(messageInput, 'Por favor, insira sua mensagem');
    isValid = false;
  }
  return isValid;
}

function showError(input, message) {
  const formGroup = input.parentElement;
  const errorMessage = document.createElement('p');
  errorMessage.className = 'error-message';
  errorMessage.textContent = message;
  input.classList.add('error-input');
  formGroup.appendChild(errorMessage);
}

function removeErrors() {
  document.querySelectorAll('.error-message').forEach(e => e.remove());
  [nameInput, emailInput, subjectInput, messageInput].forEach(input => input.classList.remove('error-input'));
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function submitForm() {
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;

  setTimeout(() => {
    contactForm.reset();
    showFormMessage('success', 'Your message has been sent successfully!');
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }, 1500);
}

function showFormMessage(type, message) {
  const messageElement = document.createElement('div');
  messageElement.className = `form-message ${type}`;
  messageElement.textContent = message;

  const messageStyle = document.createElement('style');
  messageStyle.textContent = `
    .form-message {
      padding: 12px; margin-bottom: 16px; border-radius: 4px; text-align: center;
    }
    .form-message.success {
      background-color: rgba(16, 185, 129, 0.2);
      color: #10b981;
      border: 1px solid #10b981;
    }
    .form-message.error {
      background-color: rgba(239, 68, 68, 0.2);
      color: #ef4444;
      border: 1px solid #ef4444;
    }
    .error-message {
      color: #ef4444;
      font-size: 0.85rem;
      margin-top: 4px; margin-bottom: 0;
    }
    .error-input {
      border-color: #ef4444 !important;
    }
  `;
  document.head.appendChild(messageStyle);

  contactForm.prepend(messageElement);
  setTimeout(() => messageElement.remove(), 5000);
}

[nameInput, emailInput, subjectInput, messageInput].forEach(input => {
  input.addEventListener('input', () => {
    input.classList.remove('error-input');
    const errorMessage = input.parentElement.querySelector('.error-message');
    if (errorMessage) errorMessage.remove();
  });
});

// ======================= thankyou.js =======================
document.addEventListener('DOMContentLoaded', () => {
  const formData = sessionStorage.getItem('contactFormData');
  if (formData) {
    try {
      const { name } = JSON.parse(formData);
      if (name) {
        const heading = document.querySelector('h1');
        if (heading) heading.textContent = `Obrigado, ${name}!`;
      }
      sessionStorage.removeItem('contactFormData');
    } catch (error) {
      console.error('Error parsing form data:', error);
    }
  }
});
