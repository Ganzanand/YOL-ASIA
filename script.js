// ========================================
// HAMBURGER MENU FUNCTIONALITY
// ========================================

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// ========================================
// STICKY NAVBAR ON SCROLL
// ========================================

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Update active navigation link
    updateActiveNavLink();
});

function updateActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    let currentSection = '';

    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === currentSection) {
            link.classList.add('active');
        }
    });
}

// ========================================
// SCROLL ANIMATIONS
// ========================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Add fade-in class to elements that should animate on scroll
document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll(
        '.service-card, .project-card, .team-member, .gallery-item, .about-card'
    );

    elementsToAnimate.forEach(element => {
        element.classList.add('fade-in');
        observer.observe(element);
    });
});

// ========================================
// LIGHTBOX GALLERY
// ========================================

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const closeBtn = document.querySelector('.close-btn');

let galleryImages = [];

function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryImages = Array.from(galleryItems).map((item, index) => ({
        index: index,
        color: item.querySelector('.gallery-image').style.background
    }));
}

function openLightbox(index) {
    if (lightbox) {
        lightbox.classList.add('show');
        // Create a placeholder image with the gradient color
        const item = galleryImages[index];
        lightboxImg.style.background = item.color;
        lightboxImg.style.width = '100%';
        lightboxImg.style.height = '80vh';
        lightboxImg.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox() {
    if (lightbox) {
        lightbox.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
}

if (lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

document.addEventListener('DOMContentLoaded', initGallery);

// ========================================
// CAREER FORM VALIDATION & SUBMISSION
// ========================================

const careerForm = document.getElementById('careerForm');

if (careerForm) {
    careerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Clear previous error messages
        document.querySelectorAll('.error-message').forEach(el => el.classList.remove('show'));
        document.querySelectorAll('.form-group').forEach(el => el.classList.remove('error'));
        document.getElementById('formMessage').classList.remove('show', 'success', 'error');

        // Get form values
        const fullName = document.getElementById('fullName').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const position = document.getElementById('position').value;
        const experience = document.getElementById('experience').value.trim();
        const cv = document.getElementById('cv').files[0];

        let isValid = true;

        // Validation rules
        if (!fullName) {
            showError('fullName', 'Please enter your full name');
            isValid = false;
        } else if (fullName.length < 3) {
            showError('fullName', 'Name must be at least 3 characters');
            isValid = false;
        }

        if (!phone) {
            showError('phone', 'Please enter your phone number');
            isValid = false;
        } else if (!isValidPhone(phone)) {
            showError('phone', 'Please enter a valid phone number');
            isValid = false;
        }

        if (!email) {
            showError('email', 'Please enter your email address');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError('email', 'Please enter a valid email address');
            isValid = false;
        }

        if (!position) {
            showError('position', 'Please select a position');
            isValid = false;
        }

        if (!experience) {
            showError('experience', 'Please tell us about your experience');
            isValid = false;
        } else if (experience.length < 20) {
            showError('experience', 'Please provide more details about your experience (at least 20 characters)');
            isValid = false;
        }

        if (cv && !isValidFileType(cv)) {
            showError('cv', 'Please upload a valid file type (PDF, DOC, or DOCX)');
            isValid = false;
        }

        if (isValid) {
            // Save to localStorage
            const applicationData = {
                fullName,
                phone,
                email,
                position,
                experience,
                cvName: cv ? cv.name : 'No CV uploaded',
                submittedAt: new Date().toLocaleString()
            };

            // Get existing applications or create new array
            let applications = JSON.parse(localStorage.getItem('careerApplications')) || [];
            applications.push(applicationData);
            localStorage.setItem('careerApplications', JSON.stringify(applications));

            // Show success message
            showFormMessage('formMessage', 'Your application has been submitted successfully! We will review it and get back to you soon.', 'success');

            // Reset form
            careerForm.reset();

            // Log to console for verification
            console.log('Application submitted:', applicationData);
            console.log('All applications:', applications);
        }
    });
}

function showError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + 'Error');
    const fieldElement = document.getElementById(fieldId);

    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }

    if (fieldElement) {
        fieldElement.parentElement.classList.add('error');
    }
}

function showFormMessage(elementId, message, type) {
    const messageElement = document.getElementById(elementId);
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.classList.add('show', type);

        // Auto-hide after 5 seconds
        setTimeout(() => {
            messageElement.classList.remove('show', type);
        }, 5000);
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    // Allow various phone formats
    const phoneRegex = /^[\d\s\-\+\(\)]{8,}$/;
    return phoneRegex.test(phone);
}

function isValidFileType(file) {
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    return validTypes.includes(file.type);
}

// ========================================
// CONTACT FORM SUBMISSION
// ========================================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('contactName').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        let isValid = true;

        if (!name) {
            isValid = false;
            showFormMessage('contactMessage', 'Please enter your name', 'error');
        } else if (!email || !isValidEmail(email)) {
            isValid = false;
            showFormMessage('contactMessage', 'Please enter a valid email address', 'error');
        } else if (!subject) {
            isValid = false;
            showFormMessage('contactMessage', 'Please enter a subject', 'error');
        } else if (!message || message.length < 10) {
            isValid = false;
            showFormMessage('contactMessage', 'Please enter a message (at least 10 characters)', 'error');
        }

        if (isValid) {
            const contactData = {
                name,
                email,
                subject,
                message,
                sentAt: new Date().toLocaleString()
            };

            // Save to localStorage
            let contactMessages = JSON.parse(localStorage.getItem('contactMessages')) || [];
            contactMessages.push(contactData);
            localStorage.setItem('contactMessages', JSON.stringify(contactMessages));

            showFormMessage('contactMessage', 'Thank you! Your message has been received. We will get back to you shortly.', 'success');
            contactForm.reset();

            // Log for verification
            console.log('Contact message received:', contactData);
            console.log('All contact messages:', contactMessages);
        }
    });
}

// ========================================
// SMOOTH SCROLL BEHAVIOR (Enhancement)
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Add smooth scroll to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                const target = document.querySelector(href);
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ========================================
// CONSOLE MESSAGES FOR DEBUGGING
// ========================================

console.log('%c YOL ASIA Corporate Website', 'font-size: 20px; font-weight: bold; color: #FF8C42;');
console.log('%c Welcome to YOL ASIA', 'font-size: 14px; color: #2C3E50;');
console.log('Check localStorage for:');
console.log('- Career applications: localStorage.getItem("careerApplications")');
console.log('- Contact messages: localStorage.getItem("contactMessages")');

// ========================================
// INITIALIZE ON PAGE LOAD
// ========================================

window.addEventListener('load', () => {
    console.log('YOL ASIA website fully loaded');
    
    // Initialize any additional features here
    initGallery();
    updateActiveNavLink();
});

// ========================================
// KEYBOARD SHORTCUTS (Optional)
// ========================================

document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to scroll to contact section
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    }
});
