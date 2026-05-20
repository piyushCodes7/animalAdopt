
// Volunteer Form Validation
const volunteerForm = document.getElementById('volunteerForm');
if (volunteerForm) {
  volunteerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = this.querySelector('input[name="name"]').value.trim();
    const email = this.querySelector('input[name="email"]').value.trim();
    const phone = this.querySelector('input[name="phone"]').value.trim();
    const availability = this.querySelector('select[name="availability"]').value;
    const message = this.querySelector('textarea[name="message"]').value.trim();
    
    // Basic validation
    if (name.length < 2) {
      showToast('Please enter a valid name', 'error');
      return;
    }
    
    if (!isValidEmail(email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    
    if (!isValidPhone(phone)) {
      showToast('Please enter a valid phone number (at least 10 digits)', 'error');
      return;
    }
    
    if (!availability) {
      showToast('Please select your availability', 'error');
      return;
    }
    
    // Success: Save to local storage
    if (typeof saveVolunteerSubmission === 'function') {
      saveVolunteerSubmission(name, email, phone, availability, message);
    } else {
      showToast('Thank you for your interest in volunteering! We will contact you soon.', 'success');
    }
    this.reset();
  });
}

// Contact Form Validation
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = this.querySelector('input[name="name"]').value.trim();
    const email = this.querySelector('input[name="email"]').value.trim();
    const subject = this.querySelector('input[name="subject"]').value.trim();
    const message = this.querySelector('textarea[name="message"]').value.trim();
    
    // Basic validation
    if (name.length < 2) {
      showToast('Please enter a valid name', 'error');
      return;
    }
    
    if (!isValidEmail(email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    
    if (subject.length < 3) {
      showToast('Please enter a subject with at least 3 characters', 'error');
      return;
    }
    
    if (message.length < 10) {
      showToast('Please enter a message with at least 10 characters', 'error');
      return;
    }
    
    // Success: Save to local storage
    if (typeof saveContactSubmission === 'function') {
      saveContactSubmission(name, email, subject, message);
    } else {
      showToast('Thank you for your message! We will get back to you soon.', 'success');
    }
    this.reset();
  });
}

// Adopt button functionality
const adoptButtons = document.querySelectorAll('.adopt-btn');
adoptButtons.forEach(button => {
  button.addEventListener('click', function() {
    const petCard = this.closest('.pet-card');
    const petName = petCard.querySelector('.pet-content h3').textContent.trim();
    const petType = petCard.dataset.type || 'unknown pet';
    
    // Success: Open adoption modal form
    if (typeof openAdoptionModal === 'function') {
      openAdoptionModal(petName, petType);
    } else {
      showToast(`Thank you for your interest in adopting ${petName}! Please fill out the contact form and we'll be in touch.`, 'success');
    }
  });
});

// Helper functions
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phone.length >= 10 && phoneRegex.test(phone);
}
