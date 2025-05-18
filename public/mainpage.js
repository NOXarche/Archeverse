// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQ0LKF-yCoo5k1gl_ntt8r-9tR4QBZGyE",
  authDomain: "archeverse-7d502.firebaseapp.com",
  databaseURL: "https://archeverse-7d502-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "archeverse-7d502",
  storageBucket: "archeverse-7d502.firebasestorage.app",
  messagingSenderId: "489295358544",
  appId: "1:489295358544:web:2f3a2cb2a74c5343f17f55",
  measurementId: "G-G2QJ69V5DN"
};

// Initialize libraries after DOM content loads
document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggling
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;
    const themeIcon = themeToggle.querySelector('i');
    
    // Check for saved theme preference or use default
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    // Toggle theme on click
    let themeIndex = 0;
    const themes = ['dark', 'light', 'cyberpunk', 'blueprint'];
    
    // Set initial theme index based on saved theme
    themeIndex = themes.indexOf(savedTheme);
    if (themeIndex === -1) themeIndex = 0;
    
    themeToggle.addEventListener('click', function() {
        themeIndex = (themeIndex + 1) % themes.length;
        const newTheme = themes[themeIndex];
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Start or stop background animation based on theme
        if (newTheme === 'cyberpunk') {
            startGradientAnimation();
        } else {
            stopGradientAnimation();
        }
    });
    
    function updateThemeIcon(theme) {
        switch(theme) {
            case 'dark':
                themeIcon.className = 'fas fa-sun';
                break;
            case 'light':
                themeIcon.className = 'fas fa-moon';
                break;
            case 'cyberpunk':
                themeIcon.className = 'fas fa-robot';
                break;
            case 'blueprint':
                themeIcon.className = 'fas fa-drafting-compass';
                break;
        }
    }
    
    // Gradient Morphing Background
    let hue = 0;
    let animationId;
    
    function startGradientAnimation() {
        stopGradientAnimation(); // Stop any existing animation
        animateGradient();
    }
    
    function animateGradient() {
        hue = (hue + 0.5) % 360;
        document.body.style.background = `
            linear-gradient(
                ${hue}deg,
                hsl(${hue}, 80%, 10%),
                hsl(${(hue + 120) % 360}, 80%, 5%)
            )
        `;
        animationId = requestAnimationFrame(animateGradient);
    }
    
    function stopGradientAnimation() {
        if (animationId) {
            cancelAnimationFrame(animationId);
            document.body.style.background = '';
        }
    }
    
    // Initialize background animation if cyberpunk theme is active
    if (savedTheme === 'cyberpunk') {
        startGradientAnimation();
    }
    
    // Add Typewriter Effect
    if (typeof Typed !== 'undefined' && document.getElementById('typewriter')) {
        new Typed('#typewriter', {
            strings: [
                "Civil Engineer", 
                "Data Scientist", 
                "AI Researcher"
            ],
            typeSpeed: 50,
            backSpeed: 30,
            loop: true,
            smartBackspace: true
        });
    } else {
        console.log("Typed.js not loaded or typewriter element not found");
    }
    
    // Parallax Scrolling
    window.addEventListener('scroll', () => {
        const parallax = document.querySelector('.parallax-bg');
        if (parallax) {
            const scrollPosition = window.pageYOffset;
            const speed = parseFloat(parallax.getAttribute('data-speed')) || 0.3;
            parallax.style.backgroundPositionY = `${scrollPosition * speed}px`;
        }
    });
    
    // Scroll-triggered animations
    const observeElements = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-viewport');
                    
                    // Add animation classes based on element type
                    if (entry.target.classList.contains('project-card')) {
                        entry.target.classList.add('animated-fadeInUp');
                    } else if (entry.target.classList.contains('node') || 
                               entry.target.classList.contains('skill')) {
                        entry.target.classList.add('animated-fadeInRight');
                    }
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.section-title, .project-card, .skill, .sandbox, .calc-widget').forEach(el => {
            observer.observe(el);
        });
    };
    
    observeElements();
    
    // Update visitor counter (simulated)
    const counterElement = document.getElementById('counter');
    if (counterElement) {
        let count = parseInt(localStorage.getItem('visitorCount') || '1247');
        
        // Increment count for this visit
        count++;
        localStorage.setItem('visitorCount', count.toString());
        counterElement.textContent = count;
        
        // Animate counter
        animateCounter(counterElement, count - 10, count);
    }
    
    function animateCounter(element, start, end) {
        let current = start;
        const increment = Math.ceil((end - start) / 20);
        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                clearInterval(timer);
                current = end;
            }
            element.textContent = current;
        }, 50);
    }
    
    // Engineering Calculator Widget
    const spanLength = document.getElementById('span-length');
    const loadResult = document.getElementById('load-result');
    
    if (spanLength && loadResult) {
        spanLength.addEventListener('input', () => {
            const length = spanLength.value;
            const load = calculateBeamLoad(length);
            loadResult.textContent = `${load.toFixed(2)} kN/m`;
        });
        
        // Initial calculation
        const initialLoad = calculateBeamLoad(spanLength.value);
        loadResult.textContent = `${initialLoad.toFixed(2)} kN/m`;
    }
    
    function calculateBeamLoad(length) {
        // Simple beam load calculation formula (example)
        return length * 0.75 + Math.pow(length/10, 2);
    }
    
    // Resume upload handling
    const resumeUpload = document.getElementById('resume-upload');
    if (resumeUpload) {
        resumeUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Here you would normally upload to Firebase
                // For demo purposes, just show an alert
                alert(`Resume "${file.name}" selected. In production, this would be uploaded to Firebase for analysis.`);
            }
        });
    }
    
    // AI Chatbot functionality
    const chatInput = document.querySelector('.chatbot input');
    const typingIndicator = document.querySelector('.typing-indicator');
    
    if (chatInput && typingIndicator) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && chatInput.value.trim() !== '') {
                const question = chatInput.value;
                chatInput.value = '';
                
                // Show typing indicator
                typingIndicator.style.display = 'inline-block';
                
                // Simulate AI response after delay
                setTimeout(() => {
                    typingIndicator.style.display = 'none';
                    alert(`You asked: ${question}\n\nThis would connect to a real AI service in production.`);
                }, 1500);
            }
        });
    }
    
    // Live Code Sandbox
    const runButton = document.querySelector('.run-btn');
    
    if (runButton) {
        runButton.addEventListener('click', () => {
            runButton.textContent = 'Running...';
            
            // Simulate code execution
            setTimeout(() => {
                runButton.textContent = 'Run Simulation';
                alert('Code simulation complete! Results: [8.5, 17.0, 25.5, 34.0, 42.5]');
            }, 1000);
        });
    }
    
    // Physics-based hover effects for cards
    if (typeof gsap !== 'undefined') {
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                if (card.querySelector('.card-inner').style.transform.includes('rotateY(180deg)')) return;
                
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                gsap.to(card, {
                    x: (x - rect.width/2) * 0.05,
                    y: (y - rect.height/2) * 0.05,
                    rotationY: (x - rect.width/2) * 0.03,
                    rotationX: (y - rect.height/2) * -0.03,
                    duration: 0.5
                });
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    x: 0,
                    y: 0,
                    rotationY: 0,
                    rotationX: 0,
                    duration: 0.5
                });
            });
        });
    } else {
        console.log("GSAP not loaded");
    }
    
    // Easter egg for recruiters
    document.addEventListener('keydown', (e) => {
        if (e.code === 'KeyA' && e.altKey) {
            showSecretContactForm();
        }
    });
    
    function showSecretContactForm() {
        alert("You found the secret contact form! In production, this would show a direct contact method for recruiters.");
    }
    
    // Initialize 3D Model Viewer if Three.js is available
    if (typeof THREE !== 'undefined') {
        initModelViewer();
    } else {
        console.log("Three.js not loaded");
    }
    
    function initModelViewer() {
        const container = document.getElementById('model-viewer');
        if (!container) return;
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);
        
        // Create a bridge-like structure
        const group = new THREE.Group();
        
        // Base platform
        const platformGeometry = new THREE.BoxGeometry(10, 0.5, 3);
        const platformMaterial = new THREE.MeshBasicMaterial({ 
            color: getComputedStyle(document.documentElement).getPropertyValue('--ce-accent').trim() || '#00A896'
        });
        const platform = new THREE.Mesh(platformGeometry, platformMaterial);
        group.add(platform);
        
        // Pillars
        const pillarGeometry = new THREE.CylinderGeometry(0.2, 0.2, 3, 32);
        const pillarMaterial = new THREE.MeshBasicMaterial({ 
            color: getComputedStyle(document.documentElement).getPropertyValue('--ds-accent').trim() || '#A020F0'
        });
        
        const pillar1 = new THREE.Mesh(pillarGeometry, pillarMaterial);
        pillar1.position.set(-4, -1.5, 0);
        group.add(pillar1);
        
        const pillar2 = new THREE.Mesh(pillarGeometry, pillarMaterial);
        pillar2.position.set(4, -1.5, 0);
        group.add(pillar2);
        
        // Add the group to the scene
        scene.add(group);
        
        camera.position.z = 8;
        
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(0, 10, 5);
        scene.add(directionalLight);
        
        // Animation function
        function animate() {
            requestAnimationFrame(animate);
            group.rotation.y += 0.01;
            renderer.render(scene, camera);
        }
        
        animate();
        
        // Make the model interactive
        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
            const y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;
            
            gsap.to(group.rotation, {
                x: y * 0.3,
                y: x * 0.5,
                duration: 1
            });
        });
        
        container.addEventListener('mouseleave', () => {
            gsap.to(group.rotation, {
                x: 0,
                y: 0,
                duration: 1
            });
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
    }
});
