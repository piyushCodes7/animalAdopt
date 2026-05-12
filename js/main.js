
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');

menuBtn.addEventListener('click',()=>{
if(navLinks.style.display === 'flex'){
navLinks.style.display='none';
}else{
navLinks.style.display='flex';
navLinks.style.flexDirection = 'column';
navLinks.style.position = 'absolute';
navLinks.style.top = '100%';
navLinks.style.left = '0';
navLinks.style.right = '0';
navLinks.style.background = 'rgba(246,240,232,.98)';
navLinks.style.padding = '2rem';
navLinks.style.gap = '1.5rem';
navLinks.style.boxShadow = '0 10px 40px rgba(0,0,0,.1)';
}
});

// Close mobile menu when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 900) {
      navLinks.style.display = 'none';
    }
  });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.style.background = 'rgba(246,240,232,.95)';
    navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,.08)';
  } else {
    navbar.style.background = 'rgba(246,240,232,.75)';
    navbar.style.boxShadow = 'none';
  }
});
