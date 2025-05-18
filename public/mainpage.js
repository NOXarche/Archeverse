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


const app = firebase.initializeApp(firebaseConfig);
const analytics = firebase.analytics();
 const db = firebase.firestore();
const storage = firebase.storage();

// Initialize libraries after DOM content loads
document.addEventListener('DOMContentLoaded', function() {
    // Register GSAP ScrollTrigger plugin if available
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }
    
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
        
        // Update radar chart colors if it exists
        if (window.skillRadarChart) {
            updateChartColors(window.skillRadarChart);
        }
        
        // Update 3D model colors if it exists
        if (window.scene) {
            updateModelColors();
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
                "AI Researcher",
                "Structural Engineer",
                "Tech Innovator"
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
                    } else if (entry.target.classList.contains('timeline-item') || 
                               entry.target.classList.contains('skill')) {
                        entry.target.classList.add('animated-fadeInRight');
                    }
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.section-title, .project-card, .skill, .timeline-item, .achievement-card, .blog-card, .cert-card').forEach(el => {
            observer.observe(el);
        });
    };
    
    observeElements();
    
    // Initialize Skill Bars Animation
    const animateSkillBars = () => {
        const skillBars = document.querySelectorAll('.progress');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const value = entry.target.getAttribute('data-value');
                    entry.target.style.width = `${value}%`;
                }
            });
        }, { threshold: 0.5 });
        
        skillBars.forEach(bar => {
            observer.observe(bar);
        });
    };
    
    animateSkillBars();
    
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
    
    // Initialize Radar Chart for Skills
    if (typeof Chart !== 'undefined' && document.getElementById('radarChart')) {
        const ctx = document.getElementById('radarChart').getContext('2d');
        
        // Get theme colors
        const ceAccent = getComputedStyle(document.documentElement).getPropertyValue('--ce-accent').trim() || '#00A896';
        const dsAccent = getComputedStyle(document.documentElement).getPropertyValue('--ds-accent').trim() || '#A020F0';
        
        window.skillRadarChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Engineering', 'Data Science', 'Programming', 'Research', 'Project Management', 'AI/ML'],
                datasets: [{
                    label: 'Skill Level',
                    data: [95, 85, 80, 90, 75, 88],
                    backgroundColor: `rgba(${hexToRgb(ceAccent)}, 0.2)`,
                    borderColor: dsAccent,
                    pointBackgroundColor: ceAccent,
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: dsAccent
                }]
            },
            options: {
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            stepSize: 20,
                            backdropColor: 'transparent'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        angleLines: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        pointLabels: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary')
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
    
    // Function to update chart colors when theme changes
    function updateChartColors(chart) {
        if (!chart) return;
        
        const ceAccent = getComputedStyle(document.documentElement).getPropertyValue('--ce-accent').trim() || '#00A896';
        const dsAccent = getComputedStyle(document.documentElement).getPropertyValue('--ds-accent').trim() || '#A020F0';
        const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim() || '#E2E2E2';
        
        chart.data.datasets[0].backgroundColor = `rgba(${hexToRgb(ceAccent)}, 0.2)`;
        chart.data.datasets[0].borderColor = dsAccent;
        chart.data.datasets[0].pointBackgroundColor = ceAccent;
        chart.data.datasets[0].pointHoverBorderColor = dsAccent;
        
        chart.options.scales.r.pointLabels.color = textColor;
        chart.options.scales.r.grid.color = 'rgba(255, 255, 255, 0.1)';
        chart.options.scales.r.angleLines.color = 'rgba(255, 255, 255, 0.1)';
        
        chart.update();
    }
    
    // Helper function to convert hex to rgb
    function hexToRgb(hex) {
        // Remove # if present
        hex = hex.replace('#', '');
        
        // Convert 3-digit hex to 6-digits
        if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        
        // Convert hex to rgb
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        
        return `${r}, ${g}, ${b}`;
    }
    
    // Timeline Animation with GSAP
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        // Animate timeline path drawing
        gsap.utils.toArray('.timeline-items').forEach(timeline => {
            gsap.from(timeline, {
                scrollTrigger: {
                    trigger: timeline,
                    start: "top 80%",
                    toggleActions: "play none none none"
                },
                onStart: () => {
                    timeline.classList.add('in-viewport');
                }
            });
        });
        
        // Add animation delays for staggered effect
        document.querySelectorAll('.timeline-item').forEach((item, index) => {
            item.style.transitionDelay = `${index * 0.1}s`;
        });
    }
    
    // Milestone Map Animation
    const milestones = document.querySelectorAll('.milestone');
    milestones.forEach(milestone => {
        milestone.addEventListener('mouseenter', () => {
            milestone.querySelector('.milestone-marker').style.transform = 'scale(1.3)';
            milestone.querySelector('.milestone-marker').style.background = getComputedStyle(document.documentElement).getPropertyValue('--ds-accent');
        });
        
        milestone.addEventListener('mouseleave', () => {
            milestone.querySelector('.milestone-marker').style.transform = '';
            milestone.querySelector('.milestone-marker').style.background = '';
        });
    });
    
    // AI Chatbot functionality
    const chatInput = document.querySelector('.chat-input input');
    const sendChat = document.querySelector('.send-chat');
    const chatMessages = document.querySelector('.chat-messages');
    const minimizeChat = document.querySelector('.minimize-chat');
    
    if (chatInput && sendChat && chatMessages) {
        const sendMessage = () => {
            const message = chatInput.value.trim();
            if (message === '') return;
            
            // Add user message
            const userMessageElement = document.createElement('div');
            userMessageElement.classList.add('message', 'user-message');
            userMessageElement.innerHTML = `<p>${message}</p>`;
            chatMessages.appendChild(userMessageElement);
            
            // Clear input
            chatInput.value = '';
            
            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Simulate bot typing
            setTimeout(() => {
                // Add bot message
                const botMessageElement = document.createElement('div');
                botMessageElement.classList.add('message', 'bot-message');
                botMessageElement.innerHTML = `<p>I'm a simulated AI assistant. In production, I would respond to your query: "${message}"</p>`;
                chatMessages.appendChild(botMessageElement);
                
                // Scroll to bottom
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 1000);
        };
        
        sendChat.addEventListener('click', sendMessage);
        
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
        
        // Minimize chat functionality
        if (minimizeChat) {
            minimizeChat.addEventListener('click', () => {
                const chatbot = document.querySelector('.chatbot');
                chatbot.classList.toggle('minimized');
                
                if (chatbot.classList.contains('minimized')) {
                    minimizeChat.innerHTML = '<i class="fas fa-plus"></i>';
                    chatMessages.style.display = 'none';
                    chatInput.parentElement.style.display = 'none';
                } else {
                    minimizeChat.innerHTML = '<i class="fas fa-minus"></i>';
                    chatMessages.style.display = 'flex';
                    chatInput.parentElement.style.display = 'flex';
                }
            });
        }
    }
    
    // Endorsement functionality
    const endorseBtns = document.querySelectorAll('.endorse-btn');
    endorseBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const skill = this.parentElement;
            const endorsers = skill.querySelector('.endorsers');
            const endorserCount = skill.querySelector('.endorser-count');
            
            // Check if already endorsed (for demo purposes)
            if (this.classList.contains('endorsed')) {
                alert('You have already endorsed this skill!');
                return;
            }
            
            // Create new endorser avatar with user initials (demo)
            const userInitials = 'YU'; // "You"
            const newEndorser = document.createElement('div');
            newEndorser.classList.add('endorser-avatar');
            newEndorser.setAttribute('data-name', 'You');
            newEndorser.textContent = userInitials;
            
            // Insert before the count element
            endorsers.insertBefore(newEndorser, endorserCount);
            
            // Update count
            const currentCount = parseInt(endorserCount.textContent.replace('+', ''));
            endorserCount.textContent = `+${currentCount - 1}`;
            
            // Mark as endorsed
            this.classList.add('endorsed');
            this.textContent = 'Endorsed';
            this.style.background = getComputedStyle(document.documentElement).getPropertyValue('--success');
            this.style.color = 'white';
        });
    });
    
    // Coding Challenge functionality
    const submitChallenge = document.querySelector('.submit-challenge');
    if (submitChallenge) {
        submitChallenge.addEventListener('click', function() {
            const codeInput = document.querySelector('.challenge-input textarea').value.trim();
            
            if (codeInput === '') {
                alert('Please write your solution first!');
                return;
            }
            
            // Simple check for optimization (just for demo)
            if (codeInput.includes('map') || codeInput.includes('comprehension') || codeInput.includes('lambda')) {
                alert('Great job! Your solution uses optimization techniques!');
            } else {
                alert('Your solution works but could be more optimized. Try using list comprehensions or map functions!');
            }
        });
    }
    
    // Bridge Simulator
    const bridgeSimulator = document.getElementById('bridgeSimulator');
    const simulateBtn = document.getElementById('simulateBtn');
    const loadControl = document.getElementById('loadControl');
    const spanControl = document.getElementById('spanControl');
    
    if (bridgeSimulator && simulateBtn && loadControl && spanControl) {
        const ctx = bridgeSimulator.getContext('2d');
        
        // Set canvas dimensions
        bridgeSimulator.width = bridgeSimulator.offsetWidth;
        bridgeSimulator.height = bridgeSimulator.offsetHeight;
        
        // Draw initial bridge
        drawBridge(parseInt(loadControl.value), parseInt(spanControl.value));
        
        simulateBtn.addEventListener('click', () => {
            const load = parseInt(loadControl.value);
            const span = parseInt(spanControl.value);
            
            // Animate bridge deflection
            animateBridgeDeflection(load, span);
        });
        
        // Update bridge on control change
        loadControl.addEventListener('input', () => {
            drawBridge(parseInt(loadControl.value), parseInt(spanControl.value));
        });
        
        spanControl.addEventListener('input', () => {
            drawBridge(parseInt(loadControl.value), parseInt(spanControl.value));
        });
        
        function drawBridge(load, span) {
            // Clear canvas
            ctx.clearRect(0, 0, bridgeSimulator.width, bridgeSimulator.height);
            
            // Calculate bridge parameters
            const bridgeWidth = bridgeSimulator.width * 0.8;
            const bridgeHeight = 10;
            const startX = (bridgeSimulator.width - bridgeWidth) / 2;
            const startY = bridgeSimulator.height / 2;
            
            // Draw supports
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--ce-accent');
            ctx.fillRect(startX - 10, startY - 20, 20, 40);
            ctx.fillRect(startX + bridgeWidth - 10, startY - 20, 20, 40);
            
            // Draw bridge deck
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-primary');
            
            // Calculate deflection based on load and span
            const maxDeflection = (load / 100) * 30 * (span / 50);
            
            // Draw curved bridge deck
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.quadraticCurveTo(
                startX + bridgeWidth / 2, 
                startY + maxDeflection,
                startX + bridgeWidth, 
                startY
            );
            ctx.lineTo(startX + bridgeWidth, startY + bridgeHeight);
            ctx.quadraticCurveTo(
                startX + bridgeWidth / 2, 
                startY + bridgeHeight + maxDeflection,
                startX, 
                startY + bridgeHeight
            );
            ctx.closePath();
            ctx.fill();
            
            // Draw load arrow
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--ds-accent');
            ctx.beginPath();
            ctx.moveTo(startX + bridgeWidth / 2, startY - 40);
            ctx.lineTo(startX + bridgeWidth / 2 - 10, startY - 20);
            ctx.lineTo(startX + bridgeWidth / 2 + 10, startY - 20);
            ctx.closePath();
            ctx.fill();
            
            // Draw load value
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-primary');
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`${load} kN`, startX + bridgeWidth / 2, startY - 50);
            
            // Draw span value
            ctx.fillText(`Span: ${span} m`, startX + bridgeWidth / 2, startY + 40);
        }
        
        function animateBridgeDeflection(load, span) {
            let progress = 0;
            const duration = 30; // frames
            const originalLoad = load;
            
            function animate() {
                progress++;
                
                // Apply dynamic load for animation
                const animatedLoad = originalLoad * (1 + Math.sin(progress / 5) * 0.2);
                drawBridge(animatedLoad, span);
                
                if (progress < duration) {
                    requestAnimationFrame(animate);
                } else {
                    // Reset to original state
                    drawBridge(originalLoad, span);
                }
            }
            
            animate();
        }
        
        // Handle window resize
        window.addEventListener('resize', () => {
            bridgeSimulator.width = bridgeSimulator.offsetWidth;
            bridgeSimulator.height = bridgeSimulator.offsetHeight;
            drawBridge(parseInt(loadControl.value), parseInt(spanControl.value));
        });
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
        
        window.scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);
        
        // Create a bridge-like structure
        const group = new THREE.Group();
        
        // Get theme colors
        const ceAccent = getComputedStyle(document.documentElement).getPropertyValue('--ce-accent').trim() || '#00A896';
        const dsAccent = getComputedStyle(document.documentElement).getPropertyValue('--ds-accent').trim() || '#A020F0';
        
        // Base platform
        const platformGeometry = new THREE.BoxGeometry(10, 0.5, 3);
        const platformMaterial = new THREE.MeshBasicMaterial({ color: ceAccent });
        const platform = new THREE.Mesh(platformGeometry, platformMaterial);
        group.add(platform);
        
        // Pillars
        const pillarGeometry = new THREE.CylinderGeometry(0.2, 0.2, 3, 32);
        const pillarMaterial = new THREE.MeshBasicMaterial({ color: dsAccent });
        
        const pillar1 = new THREE.Mesh(pillarGeometry, pillarMaterial);
        pillar1.position.set(-4, -1.5, 0);
        group.add(pillar1);
        
        const pillar2 = new THREE.Mesh(pillarGeometry, pillarMaterial);
        pillar2.position.set(4, -1.5, 0);
        group.add(pillar2);
        
        // Add data points (spheres)
        const dataPointGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const dataPointMaterial = new THREE.MeshBasicMaterial({ color: dsAccent });
        
        for (let i = -4; i <= 4; i += 1) {
            const dataPoint = new THREE.Mesh(dataPointGeometry, dataPointMaterial);
            dataPoint.position.set(i, 0.5, 0);
            group.add(dataPoint);
        }
        
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
        
        // Function to update model colors when theme changes
        window.updateModelColors = function() {
            const ceAccent = getComputedStyle(document.documentElement).getPropertyValue('--ce-accent').trim() || '#00A896';
            const dsAccent = getComputedStyle(document.documentElement).getPropertyValue('--ds-accent').trim() || '#A020F0';
            
            platformMaterial.color.set(ceAccent);
            pillarMaterial.color.set(dsAccent);
            dataPointMaterial.color.set(dsAccent);
        };
        
        // Handle window resize
        window.addEventListener('resize', () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
    }
    
    // Carousel functionality
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const carouselSlide = document.querySelector('.carousel-slide');
    
    if (prevBtn && nextBtn && carouselSlide) {
        let currentSlide = 0;
        const slides = document.querySelectorAll('.carousel-slide > div');
        const totalSlides = slides.length;
        
        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateCarousel();
        });
        
        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateCarousel();
        });
        
        function updateCarousel() {
            const offset = -currentSlide * 100;
            carouselSlide.style.transform = `translateX(${offset}%)`;
        }
    }
    
    // Contact form functionality
    const sendBtn = document.querySelector('.send-btn');
    if (sendBtn) {
        sendBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const nameInput = document.querySelector('.contact-form input[type="text"]');
            const emailInput = document.querySelector('.contact-form input[type="email"]');
            const messageInput = document.querySelector('.contact-form textarea');
            
            if (!nameInput.value || !emailInput.value || !messageInput.value) {
                alert('Please fill in all fields');
                return;
            }
            
            // Simulate form submission
            this.textContent = 'Sending...';
            this.disabled = true;
            
            setTimeout(() => {
                this.textContent = 'Message Sent!';
                this.style.background = getComputedStyle(document.documentElement).getPropertyValue('--success');
                
                // Reset form
                nameInput.value = '';
                emailInput.value = '';
                messageInput.value = '';
                
                // Reset button after delay
                setTimeout(() => {
                    this.textContent = 'Send Message';
                    this.style.background = '';
                    this.disabled = false;
                }, 3000);
            }, 1500);
        });
    }
    
    // Easter egg for recruiters
    document.addEventListener('keydown', (e) => {
        if (e.code === 'KeyA' && e.altKey) {
            showSecretContactForm();
        }
    });
    
    function showSecretContactForm() {
        const secretForm = document.createElement('div');
        secretForm.className = 'secret-contact';
        secretForm.innerHTML = `
            <div class="secret-contact-inner">
                <h3>Direct Contact for Recruiters</h3>
                <p>You found the secret contact form! Please reach out directly:</p>
                <p><strong>Email:</strong> recruiter@archeverse.com</p>
                <p><strong>Phone:</strong> +1 (555) 987-6543</p>
                <button id="closeSecret">Close</button>
            </div>
        `;
        
        document.body.appendChild(secretForm);
        
        // Add styles
        secretForm.style.position = 'fixed';
        secretForm.style.top = '0';
        secretForm.style.left = '0';
        secretForm.style.width = '100%';
        secretForm.style.height = '100%';
        secretForm.style.background = 'rgba(0,0,0,0.8)';
        secretForm.style.display = 'flex';
        secretForm.style.justifyContent = 'center';
        secretForm.style.alignItems = 'center';
        secretForm.style.zIndex = '9999';
        
        const inner = secretForm.querySelector('.secret-contact-inner');
        inner.style.background = getComputedStyle(document.documentElement).getPropertyValue('--secondary-bg');
        inner.style.padding = '2rem';
        inner.style.borderRadius = '8px';
        inner.style.maxWidth = '400px';
        inner.style.textAlign = 'center';
        
        const closeBtn = document.getElementById('closeSecret');
        closeBtn.style.background = getComputedStyle(document.documentElement).getPropertyValue('--ds-accent');
        closeBtn.style.color = 'white';
        closeBtn.style.border = 'none';
        closeBtn.style.padding = '0.5rem 1rem';
        closeBtn.style.borderRadius = '4px';
        closeBtn.style.marginTop = '1rem';
        closeBtn.style.cursor = 'pointer';
        
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(secretForm);
        });
    }
});
