
// Volunteer Form Validation
const volunteerForm = document.getElementById('volunteerForm');
if (volunteerForm) {
  volunteerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = this.querySelector('input[name="name"]').value.trim();
    const email = this.querySelector('input[name="email"]').value.trim();
    const phone = this.querySelector('input[name="phone"]').value.trim();
    const availability = this.querySelector('select[name="availability"]').value;
    
    // Basic validation
    if (name.length < 2) {
      alert('Please enter a valid name');
      return;
    }
    
    if (!isValidEmail(email)) {
      alert('Please enter a valid email address');
      return;
    }
    
    if (!isValidPhone(phone)) {
      alert('Please enter a valid phone number');
      return;
    }
    
    if (!availability) {
      alert('Please select your availability');
      return;
    }
    
    // Success
    alert('Thank you for your interest in volunteering! We will contact you soon.');
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
      alert('Please enter a valid name');
      return;
    }
    
    if (!isValidEmail(email)) {
      alert('Please enter a valid email address');
      return;
    }
    
    if (subject.length < 3) {
      alert('Please enter a subject with at least 3 characters');
      return;
    }
    
    if (message.length < 10) {
      alert('Please enter a message with at least 10 characters');
      return;
    }
    
    // Success
    alert('Thank you for your message! We will get back to you soon.');
    this.reset();
  });
}

// Adopt button functionality
const adoptButtons = document.querySelectorAll('.adopt-btn');
adoptButtons.forEach(button => {
  button.addEventListener('click', function() {
    const petName = this.closest('.pet-content').querySelector('h3').textContent;
    alert(`Thank you for your interest in adopting ${petName}! Please fill out the contact form and we'll be in touch.`);
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
