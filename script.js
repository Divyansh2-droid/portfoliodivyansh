// Smooth scrolling and navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initParticles();
    initAnimations();
    initSkillsAnimation();
    initTypingEffect();
    initCounterAnimation();
    initContactForm();
    initResumeDownload();
});

// Navigation functionality
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // Highlight active navigation link
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

// Particle animation for hero section
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    let animationId;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.1
        };
    }

    function initParticleSystem() {
        particles = [];
        for (let i = 0; i < 50; i++) {
            particles.push(createParticle());
        }
    }

    function updateParticles() {
        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

            // Keep particles within bounds
            particle.x = Math.max(0, Math.min(canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(canvas.height, particle.y));
        });
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(6, 182, 212, ${particle.opacity})`;
            ctx.fill();
        });

        // Draw connections between nearby particles
        particles.forEach((particle1, i) => {
            particles.slice(i + 1).forEach(particle2 => {
                const distance = Math.sqrt(
                    Math.pow(particle1.x - particle2.x, 2) +
                    Math.pow(particle1.y - particle2.y, 2)
                );

                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particle1.x, particle1.y);
                    ctx.lineTo(particle2.x, particle2.y);
                    ctx.strokeStyle = `rgba(139, 92, 246, ${0.1 - distance / 1000})`;
                    ctx.stroke();
                }
            });
        });
    }

    function animate() {
        updateParticles();
        drawParticles();
        animationId = requestAnimationFrame(animate);
    }

    // Initialize
    resizeCanvas();
    initParticleSystem();
    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticleSystem();
    });

    // Pause animation when not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            animate();
        }
    });
}

// Scroll-triggered animations
function initAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger SVG text drawing animation
                if (entry.target.classList.contains('section-title')) {
                    const svg = entry.target.querySelector('.draw-text-section');
                    if (svg) {
                        svg.style.animation = 'drawTextSection 2s ease-in-out forwards';
                    }
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });

    // Observe all elements with animation classes
    document.querySelectorAll('.animate-on-scroll, .section-title').forEach(el => {
        observer.observe(el);
    });
}

// Skills progress bar animation
function initSkillsAnimation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillCard = entry.target;
                const progressBar = skillCard.querySelector('.progress-bar');
                const percentage = progressBar.getAttribute('data-progress');
                
                // Animate progress bar
                setTimeout(() => {
                    progressBar.style.setProperty('--progress', percentage + '%');
                    progressBar.style.width = percentage + '%';
                }, 500);
                
                skillCard.classList.add('visible');
            }
        });
    }, {
        threshold: 0.5
    });

    document.querySelectorAll('.skill-card').forEach(card => {
        observer.observe(card);
    });
}

// Typing effect for hero subtitle
function initTypingEffect() {
    const typingText = document.querySelector('.typing-text');
    const texts = ['Aspiring Developer', 'Problem Solver', 'Creative Thinker'];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
        }

        setTimeout(type, typeSpeed);
    }

    // Start typing effect
    setTimeout(type, 1000);
}

// Counter animation for stats
function initCounterAnimation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;

                const updateCounter = () => {
                    current += step;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };

                updateCounter();
            }
        });
    }, {
        threshold: 0.8
    });

    document.querySelectorAll('.stat-number').forEach(stat => {
        observer.observe(stat);
    });
}

// Contact form functionality with EmailJS
function initContactForm() {
    /* 
    CUSTOMIZATION REQUIRED:
    1. Sign up for EmailJS at https://www.emailjs.com/
    2. Create an email service and template
    3. Replace the following placeholders with your actual EmailJS credentials:
    */
    
    const EMAILJS_PUBLIC_KEY = 'NpdQdzvIfqQZRUZ3U'; // Replace with your public key
    const EMAILJS_SERVICE_ID = 'service_onnkva5'; // Replace with your service ID
    const EMAILJS_TEMPLATE_ID = 'template_pan504d'; // Replace with your template ID

    // Initialize EmailJS
    emailjs.init(EMAILJS_PUBLIC_KEY);

    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Clear previous errors
        clearErrors();
        
        // Validate form
        if (!validateForm()) {
            return;
        }

        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        try {
            // Send email using EmailJS
            const formData = new FormData(form);
            const templateParams = {
                name: formData.get('name'),
                email: formData.get('email'),
                message: formData.get('message')
            };

            await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
            
            // Success
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            form.reset();
            
        } catch (error) {
            console.error('EmailJS error:', error);
            showNotification('Failed to send message. Please try again or contact me directly.', 'error');
        } finally {
            // Reset button state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });

    function validateForm() {
        let isValid = true;
        const formData = new FormData(form);
        
        // Name validation
        const name = formData.get('name').trim();
        if (name.length < 2) {
            showError('nameError', 'Name must be at least 2 characters long');
            isValid = false;
        }

        // Email validation
        const email = formData.get('email').trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError('emailError', 'Please enter a valid email address');
            isValid = false;
        }

        // Message validation
        const message = formData.get('message').trim();
        if (message.length < 10) {
            showError('messageError', 'Message must be at least 10 characters long');
            isValid = false;
        }

        return isValid;
    }

    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    function clearErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.textContent = '';
            element.style.display = 'none';
        });
    }

    function showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '10px',
            color: 'white',
            fontWeight: '500',
            zIndex: '9999',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            maxWidth: '300px',
            background: type === 'success' 
                ? 'linear-gradient(45deg, #10b981, #059669)' 
                : 'linear-gradient(45deg, #ef4444, #dc2626)'
        });

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }
}

// Resume download functionality
function initResumeDownload() {
    /* 
    CUSTOMIZATION REQUIRED:
    Replace the URL below with the direct link to your resume file.
    You can host your resume on Google Drive, Dropbox, or any cloud storage service.
    Make sure the link allows direct download.
    */
    
    const RESUME_URL = 'https://drive.google.com/file/d/1RTfJCUWn8PSM3np98boxiBo_tbmyQcuc/view?usp=sharing'; // Replace with your resume URL
    
    const resumeBtn = document.getElementById('resumeBtn');
    
    resumeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (RESUME_URL === 'YOUR_RESUME_URL_HERE') {
            alert('Please update the resume URL in the script.js file');
            return;
        }
        
        // Create temporary link for download
        const link = document.createElement('a');
        link.href = RESUME_URL;
        link.download = 'John_Doe_Resume.pdf'; // Customize filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Optional: Track download (for analytics)
        console.log('Resume downloaded');
    });
}

// Utility functions
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

// Performance optimizations
window.addEventListener('load', () => {
    // Optimize scroll performance
    const scrollHandler = debounce(() => {
        // Handle scroll events here if needed
    }, 16);
    
    window.addEventListener('scroll', scrollHandler, { passive: true });
});

// Add loading animation to page
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Handle page visibility changes for better performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause non-essential animations when page is not visible
        document.body.classList.add('paused');
    } else {
        document.body.classList.remove('paused');
    }
});