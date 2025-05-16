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

// Skill Orbs Animation
const skillOrbs = document.querySelectorAll('.skill-orb');

skillOrbs.forEach((orb, index) => {
    // Add 3D rotation animation
    orb.style.animation = `float ${6 + index % 3}s infinite ease-in-out ${index * 0.2}s, rotate ${10 + index % 5}s linear infinite`;
    
    // Random starting positions
    orb.style.transform = `translateY(${Math.random() * 20 - 10}px)`;
});

// Cursor Trail Effect
const cursorTrail = document.querySelector('.cursor-trail');
const trailElements = [];
const trailCount = 15;

// Create trail elements
for (let i = 0; i < trailCount; i++) {
    const trail = document.createElement('div');
    trail.className = 'trail-dot';
    trail.style.width = `${8 - (i * 0.5)}px`;
    trail.style.height = `${8 - (i * 0.5)}px`;
    trail.style.backgroundColor = body.classList.contains('dark-mode') ? 
        `rgba(${0}, ${209 - i * 10}, ${255 - i * 10}, ${1 - i * 0.06})` : 
        `rgba(${0}, ${128 - i * 5}, ${128 - i * 5}, ${1 - i * 0.06})`;
    trail.style.borderRadius = '50%';
    trail.style.position = 'fixed';
    trail.style.pointerEvents = 'none';
    trail.style.zIndex = '9999';
    trail.style.transform = 'translate(-50%, -50%)';
    trail.style.transition = 'opacity 0.2s ease';
    document.body.appendChild(trail);
    trailElements.push({
        element: trail,
        x: 0,
        y: 0
    });
}

// Update cursor trail positions
document.addEventListener('mousemove', (e) => {
    gsap.to(cursorTrail, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1
    });
    
    // Update trail positions with delay
    setTimeout(() => {
        trailElements.forEach((trail, index) => {
            trail.x = e.clientX;
            trail.y = e.clientY;
            
            gsap.to(trail.element, {
                x: trail.x,
                y: trail.y,
                duration: 0.3,
                delay: index * 0.02
            });
        });
    }, 10);
});

// Background Animation
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
const particleCount = 100;

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Particle class
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.color = body.classList.contains('dark-mode') ? 
            `rgba(0, 209, 255, ${Math.random() * 0.3})` : 
            `rgba(0, 128, 128, ${Math.random() * 0.3})`;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > canvas.width || this.x < 0) {
            this.speedX = -this.speedX;
        }
        
        if (this.y > canvas.height || this.y < 0) {
            this.speedY = -this.speedY;
        }
    }
    
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Initialize particles
function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

// Connect particles with lines
function connectParticles() {
    const maxDistance = 150;
    for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < maxDistance) {
                ctx.beginPath();
                ctx.strokeStyle = body.classList.contains('dark-mode') ? 
                    `rgba(0, 209, 255, ${0.1 - distance/maxDistance * 0.1})` : 
                    `rgba(0, 128, 128, ${0.1 - distance/maxDistance * 0.1})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
    }
    
    connectParticles();
    requestAnimationFrame(animate);
}

initParticles();
animate();

// Update particle colors when theme changes
themeToggle.addEventListener('click', () => {
    particles.forEach(particle => {
        particle.color = body.classList.contains('dark-mode') ? 
            `rgba(0, 209, 255, ${Math.random() * 0.3})` : 
            `rgba(0, 128, 128, ${Math.random() * 0.3})`;
    });
    
    trailElements.forEach((trail, index) => {
        trail.element.style.backgroundColor = body.classList.contains('dark-mode') ? 
            `rgba(${0}, ${209 - index * 10}, ${255 - index * 10}, ${1 - index * 0.06})` : 
            `rgba(${0}, ${128 - index * 5}, ${128 - index * 5}, ${1 - index * 0.06})`;
    });
});

// Portal Animation
const portfolioBtn = document.getElementById('portfolioBtn');
const portalContainer = document.getElementById('portalContainer');
const portalCenter = document.querySelector('.portal-center');
const lightBeams = document.querySelector('.light-beams');
const typewriterText = document.getElementById('typewriterText');
const proceedBtn = document.getElementById('proceedBtn');

portfolioBtn.addEventListener('click', () => {
    // Hide the button
    gsap.to(portfolioBtn, {
        opacity: 0,
        y: -50,
        duration: 0.5,
        onComplete: () => {
            portfolioBtn.style.display = 'none';
            portalContainer.style.display = 'flex';
            
            // Start portal animation
            gsap.to(portalCenter, {
                scale: 1,
                duration: 1.5,
                ease: "elastic.out(1, 0.5)"
            });
            
            gsap.to(lightBeams, {
                opacity: 0.8,
                duration: 1,
                delay: 0.5
            });
            
            // Typewriter effect
            setTimeout(() => {
                const typed = new Typed('#typewriterText', {
                    strings: ["Visitor, are you ready to visit Archishman's Archeverse?"],
                    typeSpeed: 40,
                    showCursor: true,
                    cursorChar: '|',
                    onComplete: () => {
                        // Show proceed button
                        setTimeout(() => {
                            gsap.to(proceedBtn, {
                                opacity: 1,
                                scale: 1,
                                duration: 0.8,
                                ease: "back.out(1.7)"
                            });
                        }, 500);
                    }
                });
            }, 1500);
        }
    });
});

// Parallax effect
document.addEventListener('mousemove', (e) => {
    const xPos = (e.clientX / window.innerWidth - 0.5) * 20;
    const yPos = (e.clientY / window.innerHeight - 0.5) * 20;
    
    gsap.to('.hero', {
        x: xPos,
        y: yPos,
        duration: 1
    });
    
    gsap.to('.skills-container', {
        x: xPos * 0.5,
        y: yPos * 0.5,
        rotateX: -yPos * 0.2,
        rotateY: xPos * 0.2,
        duration: 1
    });
});
