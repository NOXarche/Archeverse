// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
    gsap.defaults({duration: 0.1, ease: "none"});
    document.body.classList.add('reduced-motion');
}

// Loading screen animation with fluid motion
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const loadingScreen = document.querySelector('.loading-screen');
        gsap.to(loadingScreen, {
            opacity: 0,
            duration: 0.8,
            ease: "power2.inOut",
            onComplete: () => {
                loadingScreen.style.display = 'none';
                initializeAnimations();
            }
        });
    }, 1800);
});

function initializeAnimations() {
    // Initial animations with fluid motion
    gsap.from('.hero', { 
        opacity: 0, 
        y: 40, 
        duration: 1.2,
        ease: "power3.out" 
    });
    
    gsap.from('.counter', {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.5,
        stagger: 0.3,
        ease: "back.out(1.7)"
    });
    
    gsap.from('.fluid-card', {
        opacity: 0,
        y: 50,
        duration: 1.2,
        delay: 1,
        stagger: 0.2,
        ease: "elastic.out(1, 0.75)"
    });

    // Fluid welcome animation
    setTimeout(() => {
        const burstContainer = document.createElement('div');
        burstContainer.style.position = 'fixed';
        burstContainer.style.top = '50%';
        burstContainer.style.left = '50%';
        burstContainer.style.transform = 'translate(-50%, -50%)';
        burstContainer.style.pointerEvents = 'none';
        burstContainer.style.zIndex = '10000';
        burstContainer.style.filter = 'url(#goo)';
        document.body.appendChild(burstContainer);

        for(let i=0; i<20; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = '20px';
            particle.style.height = '20px';
            particle.style.background = document.body.classList.contains('dark-mode') ? '#00D1FF' : '#008080';
            particle.style.borderRadius = '50%';
            particle.style.top = '0';
            particle.style.left = '0';
            burstContainer.appendChild(particle);

            const angle = Math.random() * 2 * Math.PI;
            const distance = 50 + Math.random() * 100;
            const duration = 1 + Math.random() * 1;
            
            gsap.to(particle, {
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance,
                opacity: 0,
                scale: 0.5 + Math.random(),
                duration: duration,
                ease: 'power2.out',
                onComplete: () => particle.remove()
            });
        }

        setTimeout(() => burstContainer.remove(), 2500);
    }, 2200);
}

// Blob animation
const blob = document.getElementById('blob');

// Animate blob with mouse movement
document.addEventListener('mousemove', (e) => {
    if (prefersReducedMotion) return;
    
    const { clientX, clientY } = e;
    
    // Use GSAP for smooth animation
    gsap.to(blob, {
        left: `${clientX}px`,
        top: `${clientY}px`,
        duration: 2.5,
        ease: "power3.out"
    });
});

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
    updateThemeColors();
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
    updateThemeColors();
});

function updateThemeColors() {
    // Update fluid blobs color based on theme
    const fluidBlobs = document.querySelectorAll('.fluid-blob');
    fluidBlobs.forEach(blob => {
        if (body.classList.contains('dark-mode')) {
            blob.style.background = 'radial-gradient(circle, var(--dark-accent1), var(--dark-accent2))';
        } else {
            blob.style.background = 'radial-gradient(circle, var(--bright-accent1), var(--bright-accent2))';
        }
    });
}

// Custom cursor with fluid motion
if (!prefersReducedMotion && window.innerWidth > 768) {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');

    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {x: e.clientX, y: e.clientY, duration: 0.1});
        gsap.to(cursorFollower, {x: e.clientX, y: e.clientY, duration: 0.8, ease: "power3.out"});
    });

    document.querySelectorAll('a, button, .fluid-card, .theme-toggle').forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(cursor, {width: 40, height: 40, duration: 0.3, ease: "elastic.out(1, 0.3)"});
            gsap.to(cursorFollower, {width: 60, height: 60, duration: 0.3, ease: "elastic.out(1, 0.3)"});
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(cursor, {width: 20, height: 20, duration: 0.3, ease: "elastic.out(1, 0.3)"});
            gsap.to(cursorFollower, {width: 40, height: 40, duration: 0.3, ease: "elastic.out(1, 0.3)"});
        });
    });
}

// Portal pop-out animation with fluid motion
const portfolioBtn = document.getElementById('portfolioBtn');
const portalContainer = document.getElementById('portalContainer');
const portalCenter = document.querySelector('.portal-center');
const portalRings = document.querySelectorAll('.portal-ring');
const lightBeams = document.querySelector('.light-beams');
const typewriterText = document.getElementById('typewriterText');
const proceedBtn = document.getElementById('proceedBtn');

portfolioBtn.addEventListener('click', (e) => {
    // Create fluid mask for page transition
    const mask = document.createElement('div');
    mask.style.position = 'fixed';
    mask.style.top = '0';
    mask.style.left = '0';
    mask.style.width = '100vw';
    mask.style.height = '100vh';
    mask.style.background = body.classList.contains('dark-mode') 
        ? 'radial-gradient(circle at ' + e.clientX + 'px ' + e.clientY + 'px, #00D1FF, #A020F0)'
        : 'radial-gradient(circle at ' + e.clientX + 'px ' + e.clientY + 'px, #008080, #FFD700)';
    mask.style.zIndex = '10000';
    mask.style.pointerEvents = 'none';
    mask.style.opacity = '0';
    mask.style.filter = 'blur(30px)';
    document.body.appendChild(mask);

    // Animate mask with fluid motion
    gsap.to(mask, {
        opacity: 0.8,
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete: () => {
            // Hide the button with a fluid effect
            gsap.to(portfolioBtn, {
                opacity: 0,
                scale: 0.5,
                duration: 0.5,
                ease: 'power2.inOut',
                onComplete: () => {
                    portfolioBtn.style.display = 'none';
                    portalContainer.style.display = 'flex';
                    
                    // Fade out mask
                    gsap.to(mask, {
                        opacity: 0,
                        duration: 0.8,
                        onComplete: () => {
                            mask.remove();
                        }
                    });
                    
                    // Animate portal rings with fluid motion
                    portalRings.forEach((ring, index) => {
                        gsap.to(ring, {
                            opacity: 0.8,
                            duration: 0.5,
                            delay: index * 0.2,
                            onComplete: function() {
                                gsap.to(ring, {
                                    scale: 1.5,
                                    opacity: 0,
                                    duration: 2,
                                    repeat: -1,
                                    ease: "sine.inOut",
                                    delay: index * 0.2
                                });
                            }
                        });
                    });
                    
                    // Fluid pop-out animation for portal center
                    gsap.fromTo(portalCenter, {
                        scale: 0,
                        opacity: 0
                    }, {
                        scale: 1,
                        opacity: 1,
                        duration: 1.8,
                        ease: 'elastic.out(1, 0.5)'
                    });
                    
                    // Light beams fade in with pulsing
                    gsap.to(lightBeams, {
                        opacity: 0.9,
                        duration: 1.5,
                        delay: 0.3,
                        ease: 'power2.inOut',
                        onComplete: () => {
                            gsap.to(lightBeams, {
                                opacity: 0.6,
                                duration: 1.5,
                                yoyo: true,
                                repeat: -1,
                                ease: "sine.inOut"
                            });
                        }
                    });
                    
                    // Typewriter effect with fluid timing
                    setTimeout(() => {
                        const typed = new Typed('#typewriterText', {
                            strings: ["Visitor, are you ready to visit Archishman's Archeverse?"],
                            typeSpeed: 40,
                            showCursor: true,
                            cursorChar: '|',
                            onComplete: () => {
                                setTimeout(() => {
                                    gsap.to(proceedBtn, {
                                        opacity: 1,
                                        scale: 1,
                                        duration: 1.2,
                                        ease: 'elastic.out(1, 0.5)'
                                    });
                                }, 600);
                            }
                        });
                    }, 1000);
                }
            });
        }
    });
});

// Fluid magnetic effect on buttons
const buttons = document.querySelectorAll('button, a');

if (!prefersReducedMotion) {
    buttons.forEach(button => {
        button.addEventListener('mousemove', e => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(button, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.6,
                ease: "power2.out"
            });
        });
        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                x: 0,
                y: 0,
                duration: 0.6,
                ease: "elastic.out(1, 0.3)"
            });
        });
    });
}

// Live counters animation with fluid easing
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

// Initialize counters when they come into view with fluid animation
function initCounters() {
    const countersSection = document.querySelector('.counters');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter('projectsCount', 25, 2500); // 25 projects
                animateCounter('worksCount', 12, 2500);    // 12 works
                animateCounter('journeyCount', 5, 2500);   // 5 years
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(countersSection);
}

// Scroll-triggered animations with fluid motion
const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            gsap.from(entry.target, {
                opacity: 0,
                y: 50,
                duration: 1,
                ease: "power3.out"
            });
            animateOnScroll.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

// Fluid card hover effects
function initCardEffects() {
    const cards = document.querySelectorAll('.fluid-card');
    
    cards.forEach(card => {
        // Create fluid motion on hover
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -15,
                boxShadow: '0 15px 30px rgba(0, 209, 255, 0.5)',
                duration: 0.6,
                ease: 'power2.out'
            });
            
            const blob = card.querySelector('.fluid-blob');
            gsap.to(blob, {
                scale: 2,
                opacity: 0.3,
                duration: 0.8,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                boxShadow: '0 4px 15px rgba(0, 209, 255, 0.3)',
                duration: 0.6,
                ease: 'power2.out'
            });
            
            const blob = card.querySelector('.fluid-blob');
            gsap.to(blob, {
                scale: 1,
                opacity: 0.2,
                duration: 0.8,
                ease: 'power2.out'
            });
        });
        
        // Fluid movement on mousemove
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const blob = card.querySelector('.fluid-blob');
            gsap.to(blob, {
                left: x - 50,
                top: y - 50,
                duration: 1,
                ease: "power3.out"
            });
        });
        
        // Observe for scroll animations
        animateOnScroll.observe(card);
    });
}

// Fluid parallax effect on mouse move
function initParallaxEffect() {
    document.addEventListener('mousemove', (e) => {
        if (prefersReducedMotion) return;
        
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;
        
        const hero = document.querySelector('.hero');
        const counters = document.querySelector('.counters');
        const cards = document.querySelectorAll('.fluid-card');
        
        gsap.to(hero, {
            x: mouseX * 20,
            y: mouseY * 20,
            duration: 2,
            ease: "power3.out"
        });
        
        gsap.to(counters, {
            x: mouseX * -15,
            y: mouseY * -15,
            duration: 2,
            ease: "power3.out"
        });
        
        cards.forEach((card, index) => {
            gsap.to(card, {
                x: mouseX * (10 + index * 5),
                y: mouseY * (10 + index * 5),
                duration: 2,
                ease: "power3.out"
            });
        });
    });
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initCounters();
    initCardEffects();
    initParallaxEffect();
});

// Handle window resize
window.addEventListener('resize', () => {
    // Reinitialize any size-dependent features
    if (window.innerWidth <= 768) {
        document.body.style.cursor = 'auto';
    } else if (!prefersReducedMotion) {
        document.body.style.cursor = 'none';
    }
});
