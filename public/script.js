// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
    gsap.defaults({duration: 0.1, ease: "none"});
    document.body.classList.add('reduced-motion');
}

// Loading screen animation
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const loadingScreen = document.querySelector('.loading-screen');
        gsap.to(loadingScreen, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                loadingScreen.style.display = 'none';
                initializeAnimations();
            }
        });
    }, 1500);
});

function initializeAnimations() {
    // Initial animations
    gsap.from('.hero', { 
        opacity: 0, 
        y: 40, 
        duration: 1,
        ease: "power3.out" 
    });
    
    gsap.from('.counter', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.5,
        stagger: 0.2,
        ease: "back.out(1.7)"
    });
    
    gsap.from('.card', {
        opacity: 0,
        x: -30,
        duration: 0.6,
        delay: 1,
        stagger: 0.15,
        ease: "power2.out"
    });

    // Final welcome micro-interaction: particle burst
    setTimeout(() => {
        const burstContainer = document.createElement('div');
        burstContainer.style.position = 'fixed';
        burstContainer.style.top = '50%';
        burstContainer.style.left = '50%';
        burstContainer.style.transform = 'translate(-50%, -50%)';
        burstContainer.style.pointerEvents = 'none';
        burstContainer.style.zIndex = '10000';
        document.body.appendChild(burstContainer);

        for(let i=0; i<30; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = '6px';
            particle.style.height = '6px';
            particle.style.background = document.body.classList.contains('dark-mode') ? '#00D1FF' : '#008080';
            particle.style.borderRadius = '50%';
            particle.style.top = '50%';
            particle.style.left = '50%';
            burstContainer.appendChild(particle);

            const angle = Math.random() * 2 * Math.PI;
            const distance = Math.random() * 100 + 50;
            gsap.to(particle, {
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance,
                opacity: 0,
                duration: 1.5,
                ease: 'power2.out',
                onComplete: () => particle.remove()
            });
        }

        setTimeout(() => burstContainer.remove(), 2000);
    }, 2000);
}

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

// Custom cursor
if (!prefersReducedMotion && window.innerWidth > 768) {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');

    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {x: e.clientX, y: e.clientY, duration: 0.1});
        gsap.to(cursorFollower, {x: e.clientX, y: e.clientY, duration: 0.4});
    });

    document.querySelectorAll('a, button, .card, .theme-toggle').forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(cursor, {width: 40, height: 40, duration: 0.3});
            gsap.to(cursorFollower, {width: 60, height: 60, duration: 0.3});
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(cursor, {width: 20, height: 20, duration: 0.3});
            gsap.to(cursorFollower, {width: 40, height: 40, duration: 0.3});
        });
    });
}

// Particle background animation
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let width, height;
function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}
resize();
window.addEventListener('resize', resize);

// Particle class
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.baseX = x;
        this.baseY = y;
        this.density = (Math.random() * 30) + 1;
        this.color = body.classList.contains('dark-mode') ? '#00D1FF' : '#008080';
    }
    
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
    
    update() {
        // Check if we have mouse position
        if (mouse.x !== undefined && mouse.y !== undefined) {
            // Calculate distance between particle and mouse
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            
            // Max distance, past that the force will be 0
            const maxDistance = 100;
            let force = (maxDistance - distance) / maxDistance;
            
            // If we're close enough, apply force
            if (distance < maxDistance) {
                this.x += forceDirectionX * force * this.density;
                this.y += forceDirectionY * force * this.density;
            } else {
                // If we're not close to the mouse, move back to original position
                if (this.x !== this.baseX) {
                    let dx = this.x - this.baseX;
                    this.x -= dx/10;
                }
                if (this.y !== this.baseY) {
                    let dy = this.y - this.baseY;
                    this.y -= dy/10;
                }
            }
        }
    }
}

// Initialize particles
const particlesArray = [];
function initParticles() {
    // Clear existing particles
    particlesArray.length = 0;
    
    // Create particles in the shape of "AD" (Archishman Das initials)
    // This is a simplified approach - in a real implementation, you'd use a more sophisticated
    // method to draw text or shapes with particles
    
    // Create a grid of particles
    const particleCount = 100;
    const gridSize = Math.sqrt(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        particlesArray.push(new Particle(x, y));
    }
    
    // Additional particles in "A" shape
    const centerX = width / 2;
    const centerY = height / 2;
    const letterHeight = height * 0.3;
    const letterWidth = width * 0.1;
    
    // Letter A
    for (let i = 0; i < 30; i++) {
        // Left leg of A
        let x = centerX - letterWidth + (Math.random() * 10 - 5);
        let y = centerY + letterHeight/2 - (i/30) * letterHeight + (Math.random() * 10 - 5);
        particlesArray.push(new Particle(x, y));
        
        // Right leg of A
        x = centerX + letterWidth + (Math.random() * 10 - 5);
        y = centerY + letterHeight/2 - (i/30) * letterHeight + (Math.random() * 10 - 5);
        particlesArray.push(new Particle(x, y));
        
        // Crossbar of A (only in middle section)
        if (i > 10 && i < 20) {
            x = centerX - letterWidth + (i/30) * letterWidth * 2 + (Math.random() * 10 - 5);
            y = centerY + (Math.random() * 10 - 5);
            particlesArray.push(new Particle(x, y));
        }
    }
    
    // Letter D
    for (let i = 0; i < 30; i++) {
        // Vertical bar of D
        let x = centerX + letterWidth * 2 + (Math.random() * 10 - 5);
        let y = centerY + letterHeight/2 - (i/30) * letterHeight + (Math.random() * 10 - 5);
        particlesArray.push(new Particle(x, y));
        
        // Curved part of D
        const angle = (i/30) * Math.PI;
        x = centerX + letterWidth * 2 + Math.cos(angle) * letterWidth + (Math.random() * 10 - 5);
        y = centerY - Math.sin(angle) * letterHeight/2 + (Math.random() * 10 - 5);
        particlesArray.push(new Particle(x, y));
    }
}

// Mouse interaction
const mouse = {
    x: undefined,
    y: undefined,
    radius: 100
};

window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('mouseout', function() {
    mouse.x = undefined;
    mouse.y = undefined;
});

// Animation loop
function animate() {
    if (prefersReducedMotion) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].draw();
        particlesArray[i].update();
    }
    
    requestAnimationFrame(animate);
}

// Update particle colors when theme changes
themeToggle.addEventListener('click', () => {
    const newColor = body.classList.contains('dark-mode') ? '#00D1FF' : '#008080';
    particlesArray.forEach(particle => {
        particle.color = newColor;
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

portfolioBtn.addEventListener('click', (e) => {
    // Create mask for page transition
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
    document.body.appendChild(mask);

    // Animate mask
    gsap.to(mask, {
        opacity: 0.8,
        duration: 0.5,
        ease: 'power2.inOut',
        onComplete: () => {
            // Hide the button with a pop effect
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
                        duration: 0.5,
                        onComplete: () => {
                            mask.remove();
                        }
                    });
                    
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
        }
    });
});

// Magnetic effect on buttons
const buttons = document.querySelectorAll('button, a');

if (!prefersReducedMotion) {
    buttons.forEach(button => {
        button.addEventListener('mousemove', e => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(button, {x: x * 0.2, y: y * 0.2, duration: 0.3});
        });
        button.addEventListener('mouseleave', () => {
            gsap.to(button, {x: 0, y: 0, duration: 0.3});
        });
    });
}

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

// Scroll-triggered animations
const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            gsap.from(entry.target, {
                opacity: 0,
                y: 50,
                duration: 0.8,
                ease: "power2.out"
            });
            animateOnScroll.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

// Card hover effects
function initCardEffects() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -15,
                boxShadow: '0 15px 30px rgba(0, 209, 255, 0.5)',
                duration: 0.4,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                boxShadow: '0 4px 15px rgba(0, 209, 255, 0.3)',
                duration: 0.4,
                ease: 'power2.out'
            });
        });
        
        // Observe for scroll animations
        animateOnScroll.observe(card);
    });
}

// Parallax effect on mouse move
function initParallaxEffect() {
    document.addEventListener('mousemove', (e) => {
        if (prefersReducedMotion) return;
        
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;
        
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
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initCounters();
    initCardEffects();
    initParallaxEffect();
    
    // Start animation loop if not reduced motion
    if (!prefersReducedMotion) {
        animate();
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    resize();
    initParticles();
});
