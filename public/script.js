// Theme Toggle
const themeToggle = document.querySelector('.theme-toggle');
const sunIcon = document.querySelector('.fa-sun');
const moonIcon = document.querySelector('.fa-moon');
const body = document.body;

// Check for system preference
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    body.classList.remove('dark-mode');
    body.classList.add('bright-mode');
    sunIcon.classList.add('active');
    moonIcon.classList.remove('active');
}

themeToggle.addEventListener('click', () => {
    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        body.classList.add('bright-mode');
        sunIcon.classList.add('active');
        moonIcon.classList.remove('active');
    } else {
        body.classList.remove('bright-mode');
        body.classList.add('dark-mode');
        moonIcon.classList.add('active');
        sunIcon.classList.remove('active');
    }
});

// Add mouse parallax effect to galaxy
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth - 0.5;
    const mouseY = e.clientY / window.innerHeight - 0.5;
    
    const galaxy = document.querySelector('.galaxy');
    galaxy.style.transform = `translate(-50%, -50%) rotateX(${mouseY * 10}deg) rotateY(${mouseX * 10}deg)`;
    
    // Parallax effect for content sections
    const hero = document.querySelector('.hero');
    const counters = document.querySelector('.counters');
    const cards = document.querySelectorAll('.card');
    
    gsap.to(hero, {
        x: mouseX * 20,
        y: mouseY * 20,
        duration: 1
    });
    
    gsap.to(counters, {
        x: mouseX * -15,
        y: mouseY * -15,
        duration: 1
    });
    
    cards.forEach((card, index) => {
        gsap.to(card, {
            x: mouseX * (10 + index * 5),
            y: mouseY * (10 + index * 5),
            duration: 1
        });
    });
});

// Portal pop-out animation
const portfolioBtn = document.getElementById('portfolioBtn');
const portalContainer = document.getElementById('portalContainer');
const portalCenter = document.querySelector('.portal-center');
const portalRings = document.querySelectorAll('.portal-ring');
const lightBeams = document.querySelector('.light-beams');
const typewriterText = document.getElementById('typewriterText');
const proceedBtn = document.getElementById('proceedBtn');

portfolioBtn.addEventListener('click', () => {
    // Hide the button with a pop effect
    gsap.to(portfolioBtn, {
        opacity: 0,
        scale: 0.5,
        duration: 0.5,
        ease: 'power2.inOut',
        onComplete: () => {
            portfolioBtn.style.display = 'none';
            portalContainer.style.display = 'flex';
            
            // Animate portal rings
            portalRings.forEach((ring, index) => {
                gsap.to(ring, {
                    opacity: 0.8,
                    duration: 0.5,
                    delay: index * 0.2,
                    onComplete: function() {
                        gsap.to(ring, {
                            scale: 1.5,
                            opacity: 0,
                            duration: 1.5,
                            repeat: -1,
                            delay: index * 0.2
                        });
                    }
                });
            });
            
            // Pop-out animation for portal center
            gsap.fromTo(portalCenter, {
                scale: 0,
                opacity: 0
            }, {
                scale: 1,
                opacity: 1,
                duration: 1.5,
                ease: 'elastic.out(1, 0.5)'
            });
            
            // Light beams fade in
            gsap.to(lightBeams, {
                opacity: 0.9,
                duration: 1.2,
                delay: 0.3,
                ease: 'power2.inOut'
            });
            
            // Typewriter effect
            setTimeout(() => {
                const typed = new Typed('#typewriterText', {
                    strings: ["Visitor, are you ready to visit Archishman's Archeverse?"],
                    typeSpeed: 35,
                    showCursor: true,
                    cursorChar: '|',
                    onComplete: () => {
                        setTimeout(() => {
                            gsap.to(proceedBtn, {
                                opacity: 1,
                                scale: 1,
                                duration: 1,
                                ease: 'back.out(1.7)'
                            });
                        }, 600);
                    }
                });
            }, 1000);
        }
    });
});

// Live counters animation
function animateCounter(elementId, targetValue, duration) {
    const element = document.getElementById(elementId);
    const startValue = 0;
    const increment = targetValue / (duration / 50); // 50ms intervals
    let currentValue = startValue;
    
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= targetValue) {
            clearInterval(timer);
            currentValue = targetValue;
        }
        element.textContent = Math.floor(currentValue);
    }, 50);
}

// Initialize counters when they come into view
function initCounters() {
    const countersSection = document.querySelector('.counters');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter('projectsCount', 25, 2000); // 25 projects
                animateCounter('worksCount', 12, 2000);    // 12 works
                animateCounter('journeyCount', 5, 2000);   // 5 years
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(countersSection);
}

// Card hover effects
function initCardEffects() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -15,
                duration: 0.4,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                duration: 0.4,
                ease: 'power2.out'
            });
        });
    });
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initCounters();
    initCardEffects();
    
    // Add some random movement to tech icons
    const techIcons = document.querySelectorAll('.tech-icon');
    techIcons.forEach(icon => {
        // Random starting position
        const randomDelay = Math.random() * 5;
        icon.style.animationDelay = `${randomDelay}s`;
    });
});
