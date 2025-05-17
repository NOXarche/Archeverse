// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
    gsap.defaults({duration: 0.1, ease: "none"});
    document.body.classList.add('reduced-motion');
}

// Loading screen animation with bridge building progress
window.addEventListener('DOMContentLoaded', () => {
    createLoadingAnimation();
    
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
    }, 2000);
});

function createLoadingAnimation() {
    const loader = document.querySelector('.loader');
    const loaderText = document.querySelector('.loader-text');
    const loadingPercentage = document.querySelector('.loading-percentage');
    const loadingSigma = document.querySelector('.loading-sigma');
    const bridgeDeck = document.querySelector('.bridge-deck');
    const bridgeCables = document.querySelector('.bridge-cables');
    
    // Create floating dots
    for (let i = 0; i < 6; i++) {
        const dot = document.createElement('div');
        dot.className = 'loading-dot';
        loader.appendChild(dot);
        
        // Position dots in a circular formation
        const angle = (i / 6) * Math.PI * 2;
        const x = Math.cos(angle) * 40;
        const y = Math.sin(angle) * 40;
        
        gsap.set(dot, {
            x: x,
            y: y,
            background: body.classList.contains('dark-mode') ? 
                `hsl(${i * 60}, 100%, 70%)` : 
                `hsl(${i * 60}, 80%, 50%)`
        });
        
        // Animate dots with staggered delay
        gsap.to(dot, {
            y: y - 20,
            opacity: 0.3,
            duration: 1,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.1
        });
    }
    
    // Animate bridge progress
    gsap.to(bridgeDeck, {
        scaleX: 1,
        duration: 2,
        ease: "power2.inOut"
    });
    
    gsap.to(bridgeCables, {
        opacity: 1,
        duration: 1,
        delay: 1,
        ease: "power2.inOut"
    });
    
    // Animate loading metrics
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += 1;
        const sigma = (progress / 100 * 1.5).toFixed(1);
        
        loadingPercentage.textContent = `${progress}%`;
        loadingSigma.textContent = `σ=${sigma}`;
        
        if (progress >= 100) {
            clearInterval(loadingInterval);
        }
    }, 20);
    
    // Animate loader text
    gsap.to(loaderText, {
        scale: 1.1,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
    });
}

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

    // Initialize 3D wireframe models for CE cards
    initWireframeModels();
    
    // Initialize data charts for DS cards
    initDataCharts();
    
    // Initialize timeline for hybrid card
    initTimeline();

    // Create neural network / blueprint background
    createThematicBackground();

    // Fluid welcome animation
    setTimeout(() => {
        createParticleBurst(window.innerWidth / 2, window.innerHeight / 2);
    }, 2200);
}

// Create Skill Globe with themed nodes
function createSkillGlobe() {
    const skills = [
        { icon: 'fab fa-html5', name: 'HTML5', type: 'ds' },
        { icon: 'fab fa-css3-alt', name: 'CSS3', type: 'ds' },
        { icon: 'fab fa-js', name: 'JavaScript', type: 'ds' },
        { icon: 'fab fa-react', name: 'React', type: 'ds' },
        { icon: 'fab fa-node-js', name: 'Node.js', type: 'ds' },
        { icon: 'fas fa-database', name: 'SQL', type: 'ds' },
        { icon: 'fab fa-python', name: 'Python', type: 'ds' },
        { icon: 'fas fa-chart-line', name: 'Data Analysis', type: 'ds' },
        { icon: 'fas fa-drafting-compass', name: 'AutoCAD', type: 'ce' },
        { icon: 'fas fa-cube', name: '3D Modeling', type: 'ce' },
        { icon: 'fas fa-building', name: 'Structural Design', type: 'ce' },
        { icon: 'fas fa-ruler-combined', name: 'Civil Engineering', type: 'ce' }
    ];
    
    const globeContainer = document.querySelector('.globe-container');
    const radius = 120;
    
    skills.forEach((skill, i) => {
        const skillElement = document.createElement('div');
        skillElement.className = `skill-icon ${skill.type}-skill`;
        skillElement.innerHTML = `<i class="${skill.icon}" title="${skill.name}"></i>`;
        
        // Position icons in a spherical formation
        const phi = Math.acos(-1 + (2 * i) / skills.length);
        const theta = Math.sqrt(skills.length * Math.PI) * phi;
        
        skillElement.style.transform = `
            rotateY(${theta}rad)
            rotateX(${phi}rad)
            translateZ(${radius}px)
        `;
        
        globeContainer.appendChild(skillElement);
    });

    // Make globe interactive with mouse
    document.addEventListener('mousemove', (e) => {
        if (prefersReducedMotion) return;
        
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        
        gsap.to('.globe-container', {
            rotateY: `${x * 30}deg`,
            rotateX: `${-y * 30}deg`,
            duration: 2,
            ease: "power2.out"
        });
    });
}

// Create particle burst effect
function createParticleBurst(x, y) {
    const burstContainer = document.createElement('div');
    burstContainer.style.position = 'fixed';
    burstContainer.style.top = y + 'px';
    burstContainer.style.left = x + 'px';
    burstContainer.style.transform = 'translate(-50%, -50%)';
    burstContainer.style.pointerEvents = 'none';
    burstContainer.style.zIndex = '10000';
    burstContainer.style.filter = 'url(#goo)';
    document.body.appendChild(burstContainer);

    for(let i=0; i<30; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '10px';
        particle.style.height = '10px';
        particle.style.background = document.body.classList.contains('dark-mode') ? 
            `hsl(${i * 12}, 100%, 70%)` : 
            `hsl(${i * 12}, 80%, 50%)`;
        particle.style.borderRadius = '50%';
        particle.style.top = '0';
        particle.style.left = '0';
        burstContainer.appendChild(particle);

        const angle = Math.random() * 2 * Math.PI;
        const distance = 50 + Math.random() * 150;
        const duration = 0.8 + Math.random() * 1.2;
        
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
}

// Create thematic background based on mode
function createThematicBackground() {
    const networkBackground = document.getElementById('network-background');
    
    if (body.classList.contains('dark-mode')) {
        // Neural network with bridge wires for dark mode
        createNeuralNetworkBackground(networkBackground);
    } else {
        // Blueprint grid with scatter plots for light mode
        createBlueprintBackground(networkBackground);
    }
}

function createNeuralNetworkBackground(container) {
    // Clear previous content
    container.innerHTML = '';
    
    // Create neural network nodes
    for (let i = 0; i < 30; i++) {
        const node = document.createElement('div');
        node.className = 'network-node';
        node.style.position = 'absolute';
        node.style.width = '4px';
        node.style.height = '4px';
        node.style.borderRadius = '50%';
        node.style.background = i % 3 === 0 ? 'var(--dark-accent1)' : 'var(--dark-accent2)';
        node.style.left = `${Math.random() * 100}%`;
        node.style.top = `${Math.random() * 100}%`;
        node.style.boxShadow = '0 0 10px currentColor';
        container.appendChild(node);
        
        // Create connections (bridge wires)
        for (let j = 0; j < 2; j++) {
            const connection = document.createElement('div');
            connection.className = 'network-connection';
            connection.style.position = 'absolute';
            connection.style.width = '100px';
            connection.style.height = '1px';
            connection.style.background = 'linear-gradient(90deg, var(--dark-accent1), transparent)';
            connection.style.left = '0';
            connection.style.top = '50%';
            connection.style.transformOrigin = 'left center';
            
            // Random rotation
            const angle = Math.random() * 360;
            connection.style.transform = `rotate(${angle}deg)`;
            
            node.appendChild(connection);
        }
    }
    
    // Animate nodes
    gsap.to('.network-node', {
        y: '+=20',
        opacity: 0.5,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.1
    });
}

function createBlueprintBackground(container) {
    // Clear previous content
    container.innerHTML = '';
    
    // Create scatter plot points
    for (let i = 0; i < 40; i++) {
        const point = document.createElement('div');
        point.className = 'scatter-point';
        point.style.position = 'absolute';
        point.style.width = '3px';
        point.style.height = '3px';
        point.style.borderRadius = '50%';
        point.style.background = i % 3 === 0 ? 'var(--bright-accent1)' : 'var(--bright-accent2)';
        point.style.left = `${Math.random() * 100}%`;
        point.style.top = `${Math.random() * 100}%`;
        point.style.opacity = '0.6';
        container.appendChild(point);
    }
    
    // Create topo lines
    for (let i = 0; i < 5; i++) {
        const topoLine = document.createElement('div');
        topoLine.className = 'topo-line';
        topoLine.style.position = 'absolute';
        topoLine.style.height = '1px';
        topoLine.style.width = '100%';
        topoLine.style.background = 'var(--bright-accent1)';
        topoLine.style.opacity = '0.15';
        topoLine.style.left = '0';
        topoLine.style.top = `${20 + i * 15}%`;
        
        // Create wavy effect
        topoLine.style.clipPath = `polygon(0 0, 
            ${10 + Math.random() * 10}% ${Math.random() * 10}px, 
            ${30 + Math.random() * 10}% ${-Math.random() * 10}px, 
            ${50 + Math.random() * 10}% ${Math.random() * 10}px, 
            ${70 + Math.random() * 10}% ${-Math.random() * 10}px, 
            ${90 + Math.random() * 10}% ${Math.random() * 10}px, 
            100% 0)`;
            
        container.appendChild(topoLine);
    }
}

// Initialize 3D wireframe models for CE cards
function initWireframeModels() {
    const wireframeContainer = document.querySelector('.wireframe-model');
    if (!wireframeContainer) return;
    
    // Create wireframe lines
    for (let i = 0; i < 15; i++) {
        const line = document.createElement('div');
        line.className = 'wireframe-line';
        line.style.position = 'absolute';
        line.style.height = '1px';
        line.style.width = `${30 + Math.random() * 50}%`;
        line.style.left = `${Math.random() * 70}%`;
        line.style.top = `${Math.random() * 100}%`;
        line.style.transform = `rotate(${Math.random() * 180 - 90}deg)`;
        
        if (body.classList.contains('dark-mode')) {
            line.style.background = 'var(--dark-accent3)';
        } else {
            line.style.background = 'var(--bright-accent2)';
        }
        
        wireframeContainer.appendChild(line);
    }
    
    // Create wireframe nodes
    for (let i = 0; i < 8; i++) {
        const node = document.createElement('div');
        node.className = 'wireframe-node';
        node.style.position = 'absolute';
        node.style.width = '4px';
        node.style.height = '4px';
        node.style.borderRadius = '50%';
        node.style.left = `${Math.random() * 100}%`;
        node.style.top = `${Math.random() * 100}%`;
        
        if (body.classList.contains('dark-mode')) {
            node.style.background = 'var(--dark-accent3)';
            node.style.boxShadow = '0 0 5px var(--dark-accent3)';
        } else {
            node.style.background = 'var(--bright-accent2)';
            node.style.boxShadow = '0 0 5px var(--bright-accent2)';
        }
        
        wireframeContainer.appendChild(node);
    }
    
    // Animate wireframe
    gsap.to('.wireframe-node', {
        scale: 1.5,
        opacity: 0.7,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.1
    });
}

// Initialize data charts for DS cards
function initDataCharts() {
    const chartContainer = document.querySelector('.chart-bars');
    if (!chartContainer) return;
    
    // Create chart bars
    const barHeights = [60, 40, 80, 30, 50, 70, 45];
    
    barHeights.forEach(height => {
        const bar = document.createElement('div');
        bar.className = 'chart-bar';
        bar.style.height = '0';
        chartContainer.appendChild(bar);
        
        // Animate bars growing
        gsap.to(bar, {
            height: `${height}%`,
            duration: 1.5,
            ease: 'power2.out',
            delay: Math.random()
        });
    });
}

// Initialize timeline for hybrid card
function initTimeline() {
    const timelineContainer = document.querySelector('.card-timeline');
    if (!timelineContainer) return;
    
    // Create timeline line
    const line = document.createElement('div');
    line.className = 'timeline-line';
    line.style.position = 'absolute';
    line.style.height = '2px';
    line.style.width = '0';
    line.style.top = '50%';
    line.style.left = '10%';
    
    if (body.classList.contains('dark-mode')) {
        line.style.background = 'var(--dark-accent4)';
    } else {
        line.style.background = 'var(--bright-accent3)';
    }
    
    timelineContainer.appendChild(line);
    
    // Animate timeline line
    gsap.to(line, {
        width: '80%',
        duration: 2,
        ease: 'power2.inOut'
    });
    
    // Position timeline nodes
    const nodes = timelineContainer.querySelectorAll('.timeline-node');
    
    nodes.forEach((node, index) => {
        const position = 10 + (index * 35);
        node.style.left = `${position}%`;
        node.style.top = '50%';
        node.style.transform = 'translate(-50%, -50%)';
        node.style.opacity = '0';
        
        // Animate nodes appearing
        gsap.to(node, {
            opacity: 1,
            scale: 1.2,
            duration: 0.5,
            delay: 1 + (index * 0.3),
            ease: 'back.out(1.7)'
        });
    });
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

// Theme Toggle with enhanced transition
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
    // Create theme transition overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.zIndex = '9999';
    overlay.style.pointerEvents = 'none';
    overlay.style.opacity = '0';
    
    if (body.classList.contains('dark-mode')) {
        // Transitioning to bright mode
        overlay.style.background = 'radial-gradient(circle at center, #FFFFFF, #F9F4EF)';
        body.appendChild(overlay);
        
        gsap.to(overlay, {
            opacity: 1,
            duration: 0.5,
            onComplete: () => {
                body.classList.remove('dark-mode');
                body.classList.add('bright-mode');
                sunIcon.classList.add('active');
                moonIcon.classList.remove('active');
                updateThemeColors();
                createThematicBackground();
                
                gsap.to(overlay, {
                    opacity: 0,
                    duration: 0.5,
                    delay: 0.1,
                    onComplete: () => overlay.remove()
                });
            }
        });
    } else {
        // Transitioning to dark mode
        overlay.style.background = 'radial-gradient(circle at center, #121212, #0F0E17)';
        body.appendChild(overlay);
        
        gsap.to(overlay, {
            opacity: 1,
            duration: 0.5,
            onComplete: () => {
                body.classList.remove('bright-mode');
                body.classList.add('dark-mode');
                moonIcon.classList.add('active');
                sunIcon.classList.remove('active');
                updateThemeColors();
                createThematicBackground();
                
                gsap.to(overlay, {
                    opacity: 0,
                    duration: 0.5,
                    delay: 0.1,
                    onComplete: () => overlay.remove()
                });
            }
        });
    }
});

function updateThemeColors() {
    // Update wireframe models
    const wireframeLines = document.querySelectorAll('.wireframe-line');
    const wireframeNodes = document.querySelectorAll('.wireframe-node');
    
    wireframeLines.forEach(line => {
        if (body.classList.contains('dark-mode')) {
            line.style.background = 'var(--dark-accent3)';
        } else {
            line.style.background = 'var(--bright-accent2)';
        }
    });
    
    wireframeNodes.forEach(node => {
        if (body.classList.contains('dark-mode')) {
            node.style.background = 'var(--dark-accent3)';
            node.style.boxShadow = '0 0 5px var(--dark-accent3)';
        } else {
            node.style.background = 'var(--bright-accent2)';
            node.style.boxShadow = '0 0 5px var(--bright-accent2)';
        }
    });
    
    // Update timeline
    const timelineLine = document.querySelector('.timeline-line');
    if (timelineLine) {
        if (body.classList.contains('dark-mode')) {
            timelineLine.style.background = 'var(--dark-accent4)';
        } else {
            timelineLine.style.background = 'var(--bright-accent3)';
        }
    }
}

// Sound toggle functionality
const soundToggle = document.querySelector('.sound-toggle');
let soundEnabled = false;

// Create audio elements
const hoverSound = new Audio('sounds/hover.mp3');
const clickSound = new Audio('sounds/click.mp3');
const themeSound = new Audio('sounds/theme.mp3');

// Set volume
hoverSound.volume = 0.2;
clickSound.volume = 0.3;
themeSound.volume = 0.4;

soundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundToggle.classList.toggle('active');
    
    if (soundEnabled) {
        // Play a sound when enabled
        themeSound.play();
    }
});

// Add sound to interactive elements
document.querySelectorAll('button, a, .fluid-card, .theme-toggle').forEach(el => {
    el.addEventListener('mouseenter', () => {
        if (soundEnabled) {
            hoverSound.currentTime = 0;
            hoverSound.play();
        }
    });
    
    el.addEventListener('click', () => {
        if (soundEnabled) {
            clickSound.currentTime = 0;
            clickSound.play();
        }
    });
});

// Custom cursor with themed trails
if (!prefersReducedMotion && window.innerWidth > 768) {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    const cursorTrail = document.querySelector('.cursor-trail');
    let trailDots = [];
    let isIdle = false;
    let idleTimeout;
    
    document.addEventListener('mousemove', (e) => {
        // Reset idle state
        isIdle = false;
        clearTimeout(idleTimeout);
        
        // Remove grid lines if they exist
        document.querySelectorAll('.cursor-gridline').forEach(line => line.remove());
        
        // Move cursor
        gsap.to(cursor, {x: e.clientX, y: e.clientY, duration: 0.1});
        gsap.to(cursorFollower, {x: e.clientX, y: e.clientY, duration: 0.8, ease: "power3.out"});
        
        // Create trail effect based on theme
        if (body.classList.contains('dark-mode')) {
            // Binary code trail for dark mode
            createBinaryTrail(e.clientX, e.clientY);
        } else {
            // Surveyor's crosshair for light mode
            createSurveyorTrail(e.clientX, e.clientY);
        }
        
        // Set idle timeout
        idleTimeout = setTimeout(() => {
            isIdle = true;
            if (body.classList.contains('dark-mode')) {
                createGridlines(e.clientX, e.clientY);
            } else {
                createCrossHair(e.clientX, e.clientY);
            }
        }, 2000);
    });

    function createBinaryTrail(x, y) {
        // Limit trail dots
        if (trailDots.length > 10) {
            const oldDot = trailDots.shift();
            oldDot.remove();
        }
        
        // Create binary digit
        const digit = document.createElement('div');
        digit.className = 'cursor-trail-dot';
        digit.textContent = Math.round(Math.random());
        digit.style.left = `${x}px`;
        digit.style.top = `${y}px`;
        digit.style.color = 'var(--dark-accent1)';
        digit.style.fontFamily = 'var(--font-mono)';
        digit.style.fontSize = '10px';
        
        cursorTrail.appendChild(digit);
        trailDots.push(digit);
        
        // Fade out and remove
        gsap.to(digit, {
            opacity: 0,
            y: '+= 20',
            duration: 1,
            ease: 'power1.out',
            onComplete: () => {
                const index = trailDots.indexOf(digit);
                if (index > -1) {
                    trailDots.splice(index, 1);
                }
                digit.remove();
            }
        });
    }
    
    function createSurveyorTrail(x, y) {
        // Limit trail dots
        if (trailDots.length > 5) {
            const oldDot = trailDots.shift();
            oldDot.remove();
        }
        
        // Create surveyor dot
        const dot = document.createElement('div');
        dot.className = 'cursor-trail-dot';
        dot.style.width = '3px';
        dot.style.height = '3px';
        dot.style.borderRadius = '50%';
        dot.style.background = 'var(--bright-accent1)';
        dot.style.left = `${x}px`;
        dot.style.top = `${y}px`;
        
        cursorTrail.appendChild(dot);
        trailDots.push(dot);
        
        // Fade out and remove
        gsap.to(dot, {
            opacity: 0,
            scale: 2,
            duration: 0.8,
            ease: 'power1.out',
            onComplete: () => {
                const index = trailDots.indexOf(dot);
                if (index > -1) {
                    trailDots.splice(index, 1);
                }
                dot.remove();
            }
        });
    }
    
    function createGridlines(x, y) {
        // Create horizontal and vertical gridlines
        const horizontal = document.createElement('div');
        horizontal.className = 'cursor-gridline horizontal';
        horizontal.style.top = `${y}px`;
        horizontal.style.left = `${x - 50}px`;
        
        const vertical = document.createElement('div');
        vertical.className = 'cursor-gridline vertical';
        vertical.style.left = `${x}px`;
        vertical.style.top = `${y - 50}px`;
        
        document.body.appendChild(horizontal);
        document.body.appendChild(vertical);
        
        // Animate gridlines
        gsap.to([horizontal, vertical], {
            opacity: 0.7,
            duration: 0.5,
            ease: 'power2.out'
        });
    }
    
    function createCrossHair(x, y) {
        // Create crosshair elements
        const horizontal = document.createElement('div');
        horizontal.className = 'cursor-gridline horizontal';
        horizontal.style.top = `${y}px`;
        horizontal.style.left = `${x - 50}px`;
        horizontal.style.background = 'var(--bright-accent1)';
        
        const vertical = document.createElement('div');
        vertical.className = 'cursor-gridline vertical';
        vertical.style.left = `${x}px`;
        vertical.style.top = `${y - 50}px`;
        vertical.style.background = 'var(--bright-accent1)';
        
        document.body.appendChild(horizontal);
        document.body.appendChild(vertical);
        
        // Animate crosshair
        gsap.to([horizontal, vertical], {
            opacity: 0.7,
            duration: 0.5,
            ease: 'power2.out'
        });
    }

    document.querySelectorAll('a, button, .fluid-card, .theme-toggle, .skill-icon').forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(cursor, {width: 40, height: 40, duration: 0.3, ease: "elastic.out(1, 0.3)"});
            gsap.to(cursorFollower, {width: 60, height: 60, duration: 0.3, ease: "elastic.out(1, 0.3)"});
            
            // Change cursor appearance for code elements
            if (el.classList.contains('card-button') && body.classList.contains('bright-mode')) {
                cursor.innerHTML = '</>';
                cursor.style.display = 'flex';
                cursor.style.justifyContent = 'center';
                cursor.style.alignItems = 'center';
                cursor.style.fontSize = '12px';
                cursor.style.fontFamily = 'var(--font-mono)';
                cursor.style.color = 'white';
            }
        });
        
        el.addEventListener('mouseleave', () => {
            gsap.to(cursor, {width: 20, height: 20, duration: 0.3, ease: "elastic.out(1, 0.3)"});
            gsap.to(cursorFollower, {width: 40, height: 40, duration: 0.3, ease: "elastic.out(1, 0.3)"});
            
            // Reset cursor content
            cursor.innerHTML = '';
        });
    });
}

// Portal pop-out animation with enhanced effects
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
        ? 'radial-gradient(circle at ' + e.clientX + 'px ' + e.clientY + 'px, #00F5FF, #A020F0)'
        : 'radial-gradient(circle at ' + e.clientX + 'px ' + e.clientY + 'px, #3DA9A9, #F9BC60)';
    mask.style.zIndex = '10000';
    mask.style.pointerEvents = 'none';
    mask.style.opacity = '0';
    mask.style.filter = 'blur(30px)';
    document.body.appendChild(mask);

    // Enhanced mask animation with ripple effect
    gsap.to(mask, {
        opacity: 0.8,
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete: () => {
            // Add particles burst effect
            createParticleBurst(e.clientX, e.clientY);
            
            gsap.to(portfolioBtn, {
                opacity: 0,
                scale: 0.5,
                duration: 0.5,
                ease: 'power2.inOut',
                onComplete: () => {
                    portfolioBtn.style.display = 'none';
                    portalContainer.style.display = 'flex';
                    
                    // Enhanced portal animation sequence
                    animatePortalSequence();
                    
                    // Fade out mask with pulsing
                    gsap.to(mask, {
                        opacity: 0,
                        duration: 1.2,
                        ease: "elastic.out(1, 0.3)",
                        onComplete: () => mask.remove()
                    });
                }
            });
        }
    });
});

function animatePortalSequence() {
    // Animate portal rings with improved timing
    portalRings.forEach((ring, index) => {
        gsap.to(ring, {
            opacity: 0.8,
            duration: 0.5,
            delay: index * 0.15,
            onComplete: function() {
                gsap.to(ring, {
                    scale: 1.5 + (index * 0.2),
                    opacity: 0,
                    duration: 2,
                    repeat: -1,
                    ease: "sine.inOut",
                    delay: index * 0.1
                });
            }
        });
    });
    
    // Enhanced portal center animation
    gsap.fromTo(portalCenter, {
        scale: 0,
        opacity: 0,
        rotation: -180
    }, {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 1.8,
        ease: 'elastic.out(1, 0.5)'
    });
    
    // Enhanced light beams with pulsing and rotation
    gsap.to(lightBeams, {
        opacity: 0.9,
        rotation: 180,
        duration: 1.5,
        delay: 0.3,
        ease: 'power2.inOut',
        onComplete: () => {
            gsap.to(lightBeams, {
                opacity: 0.6,
                scale: 1.1,
                rotation: 360,
                duration: 3,
                yoyo: true,
                repeat: -1,
                ease: "sine.inOut"
            });
        }
    });
    
    // Improved typewriter effect
    setTimeout(() => {
        const typed = new Typed('#typewriterText', {
            strings: ["<span style='color: var(--dark-accent1)'>Visitor</span>, are you ready to enter <span style='color: var(--dark-accent2)'>Archishman's Archeverse</span>?"],
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

// Fluid card hover effects with 3D tilt
function initCardEffects() {
    const cards = document.querySelectorAll('.fluid-card');
    
    cards.forEach(card => {
        // Create 3D hover effect
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -15,
                rotationY: 10,
                rotationX: -10,
                boxShadow: body.classList.contains('dark-mode') ?
                    '0 15px 30px rgba(0, 245, 255, 0.5)' :
                    '0 15px 30px rgba(61, 169, 169, 0.5)',
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
                rotationY: 0,
                rotationX: 0,
                boxShadow: body.classList.contains('dark-mode') ?
                    '0 4px 15px rgba(0, 245, 255, 0.3)' :
                    '0 4px 15px rgba(61, 169, 169, 0.3)',
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
        
        // 3D tilt effect on mousemove
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            gsap.to(card, {
                rotationX: rotateX,
                rotationY: rotateY,
                duration: 0.5,
                ease: "power2.out"
            });
            
            const blob = card.querySelector('.fluid-blob');
            gsap.to(blob, {
                left: x - 50,
                top: y - 50,
                duration: 1,
                ease: "power3.out"
            });
        });
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

// Add scroll indicator
function initScrollIndicator() {
    const scrollProgress = document.querySelector('.scroll-progress');
    
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        
        scrollProgress.style.width = progress + '%';
    });
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    createLoadingAnimation();
    initCounters();
    initCardEffects();
    initParallaxEffect();
    createSkillGlobe();
    initScrollIndicator();
    
    // Add intersection observer for all sections
    document.querySelectorAll('section').forEach(section => {
        animateOnScroll.observe(section);
    });
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
