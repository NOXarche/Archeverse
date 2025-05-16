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
    
    // Update skill galaxy colors
    updateGalaxyColors();
});

// Skill Galaxy Script
const skills = [
    {name: 'HTML', tooltip: 'HTML5 Projects', preview: 'Responsive websites built with semantic HTML5'},
    {name: 'CSS', tooltip: 'CSS3 & SCSS Projects', preview: 'Modern designs with animations and transitions'},
    {name: 'UI/UX', tooltip: 'User Interface Designs', preview: 'User-centered design approach with Figma prototypes'},
    {name: 'AutoCAD', tooltip: 'AutoCAD Designs', preview: 'Detailed 2D and 3D architectural models'},
    {name: 'STAAD', tooltip: 'STAAD Structural Analysis', preview: 'Bridge and building structural analysis projects'},
    {name: 'Finance', tooltip: 'Financial Models', preview: 'Investment analysis and financial forecasting'},
    {name: 'App Dev', tooltip: 'Mobile App Development', preview: 'Cross-platform mobile applications'},
    {name: 'Web Dev', tooltip: 'Web Development', preview: 'Full-stack web applications with modern frameworks'}
];

let scene, camera, renderer;
let orbs = [];
let orbGroup;
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let tooltip = document.getElementById('tooltip');
let preview = document.getElementById('preview');

function initGalaxy() {
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.z = 20;

    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('skillGalaxyCanvas'), 
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Create orb group for global rotation
    orbGroup = new THREE.Group();
    scene.add(orbGroup);

    // Create orbs
    const geometry = new THREE.SphereGeometry(1.2, 32, 32);
    
    skills.forEach((skill, index) => {
        // Create material based on current theme
        const color = body.classList.contains('dark-mode') ? 0x00D1FF : 0x008080;
        const material = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.8
        });
        
        const orb = new THREE.Mesh(geometry, material);
        
        // Position orbs in a spherical distribution
        const phi = Math.acos(-1 + (2 * index) / skills.length);
        const theta = Math.sqrt(skills.length * Math.PI) * phi;
        const radius = 10;
        
        orb.position.set(
            radius * Math.cos(theta) * Math.sin(phi),
            radius * Math.sin(theta) * Math.sin(phi),
            radius * Math.cos(phi)
        );
        
        // Store skill data with the orb
        orb.userData = skill;
        
        // Add to orb group
        orbGroup.add(orb);
        orbs.push(orb);
    });

    // Event listeners
    window.addEventListener('resize', onWindowResize);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('click', onClick);

    // Start animation loop
    animate();
}

function updateGalaxyColors() {
    const newColor = body.classList.contains('dark-mode') ? 0x00D1FF : 0x008080;
    orbs.forEach(orb => {
        orb.material.color.set(newColor);
    });
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
    // Update mouse position for raycasting
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Check for intersections
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(orbs);

    // Reset all orbs
    orbs.forEach(orb => {
        gsap.to(orb.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 0.3
        });
        orb.material.opacity = 0.8;
    });
    
    // Handle hover effects
    if (intersects.length > 0) {
        const orb = intersects[0].object;
        
        // Show tooltip
        tooltip.style.display = 'block';
        tooltip.style.left = event.clientX + 10 + 'px';
        tooltip.style.top = event.clientY + 10 + 'px';
        tooltip.textContent = orb.userData.tooltip;
        
        // Highlight orb
        gsap.to(orb.scale, {
            x: 1.3,
            y: 1.3,
            z: 1.3,
            duration: 0.3
        });
        orb.material.opacity = 1.0;
        
        // Change cursor
        document.body.style.cursor = 'pointer';
    } else {
        // Hide tooltip and reset cursor
        tooltip.style.display = 'none';
        document.body.style.cursor = 'default';
    }
}

function onClick(event) {
    // Check for intersections
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(orbs);

    // Hide any existing preview
    preview.style.display = 'none';
    
    // Show preview if orb is clicked
    if (intersects.length > 0) {
        const orb = intersects[0].object;
        preview.style.display = 'block';
        preview.style.left = event.clientX + 20 + 'px';
        preview.style.top = event.clientY + 20 + 'px';
        preview.textContent = orb.userData.preview;
        
        // Animate the clicked orb
        gsap.to(orb.scale, {
            x: 1.8,
            y: 1.8,
            z: 1.8,
            duration: 0.3,
            yoyo: true,
            repeat: 1
        });
    }
}

function animate() {
    requestAnimationFrame(animate);
    
    // Individual orb rotation
    orbs.forEach(orb => {
        orb.rotation.x += 0.01;
        orb.rotation.y += 0.01;
    });
    
    // Global rotation of the entire orb group
    orbGroup.rotation.y += 0.002;
    
    renderer.render(scene, camera);
}

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
    initGalaxy();
    initCounters();
    initCardEffects();
});
