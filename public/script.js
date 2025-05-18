// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Set initial theme based on preference or default to dark mode (data science)
    const savedTheme = localStorage.getItem('archeverse-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const themeSwitch = document.getElementById('theme-switch');
    if (savedTheme === 'light') {
        themeSwitch.checked = true;
    }
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        gsap.defaults({duration: 0.1, ease: "none"});
        document.body.classList.add('reduced-motion');
    }
    
    // Custom cursor
    if (!prefersReducedMotion && window.innerWidth > 768) {
        const cursor = document.createElement('div');
        cursor.classList.add('cursor');
        document.body.appendChild(cursor);
        
        const cursorFollower = document.createElement('div');
        cursorFollower.classList.add('cursor-follower');
        document.body.appendChild(cursorFollower);
        
        document.addEventListener('mousemove', (e) => {
            gsap.to(cursor, {x: e.clientX, y: e.clientY, duration: 0.1});
            gsap.to(cursorFollower, {x: e.clientX, y: e.clientY, duration: 0.8, ease: "power3.out"});
        });
        
        document.querySelectorAll('a, button, .skill-icon, .theme-toggle, .sound-toggle, .project-card').forEach(el => {
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
    
    // Preloader with elegant animation
    const preloader = document.querySelector('.preloader');
    
    // Hide preloader after animation
    window.addEventListener('load', () => {
        if (preloader) {
            setTimeout(() => {
                gsap.to(preloader, {
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.inOut",
                    onComplete: () => {
                        preloader.style.visibility = 'hidden';
                        if (preloader.parentNode) {
                            preloader.remove();
                        }
                        initializeAnimations();
                    }
                });
            }, 2000);
        }
    });
    
    // Theme Toggle
    themeSwitch.addEventListener('change', () => {
        const newTheme = themeSwitch.checked ? 'light' : 'dark';
        
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
        
        if (newTheme === 'light') {
            // Transitioning to bright mode
            overlay.style.background = 'radial-gradient(circle at center, #FFFFFF, #FAFAFA)';
        } else {
            // Transitioning to dark mode
            overlay.style.background = 'radial-gradient(circle at center, #121212, #0F0E17)';
        }
        
        document.body.appendChild(overlay);
        
        // Play theme toggle sound
        if (soundEnabled) {
            themeSound.currentTime = 0;
            themeSound.play();
        }
        
        gsap.to(overlay, {
            opacity: 1,
            duration: 0.5,
            onComplete: () => {
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('archeverse-theme', newTheme);
                
                updateModelAndLights();
                updateBackgroundEffects();
                
                gsap.to(overlay, {
                    opacity: 0,
                    duration: 0.5,
                    delay: 0.1,
                    onComplete: () => overlay.remove()
                });
            }
        });
    });
    
    // Initialize Three.js scene
    let scene, camera, renderer;
    let dataModel, civilModel;
    let pointLight1, pointLight2, ambientLight;
    let envMap; // Environment map for reflections
    let clock = new THREE.Clock();
    let mouseX = 0, mouseY = 0;
    let animationFrameId;
    
    function initThreeJS() {
        try {
            const canvas = document.getElementById('model-canvas');
            const container = document.querySelector('.model-container');

            if (!canvas || !container) {
                console.error("Canvas or container not found for Three.js");
                return;
            }

            scene = new THREE.Scene();

            camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
            camera.position.set(0, 0, 2.5);
            
            renderer = new THREE.WebGLRenderer({
                canvas: canvas,
                alpha: true,
                antialias: true
            });
            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.physicallyCorrectLights = true;
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.0;
            
            // Create environment map for reflections
            const pmremGenerator = new THREE.PMREMGenerator(renderer);
            pmremGenerator.compileEquirectangularShader();
            
            // Create a simple environment
            const cubeRenderTarget = pmremGenerator.fromScene(new THREE.Scene());
            envMap = cubeRenderTarget.texture;
            
            ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
            scene.add(ambientLight);
            
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
            directionalLight.position.set(5, 8, 5);
            scene.add(directionalLight);
            
            pointLight1 = new THREE.PointLight(0x00E676, 0.8, 100);
            pointLight1.position.set(2, 2, 2);
            scene.add(pointLight1);
            
            pointLight2 = new THREE.PointLight(0x536DFE, 0.8, 100);
            pointLight2.position.set(-2, -2, 2);
            scene.add(pointLight2);
            
            // Create Data Science Model (Neural Network)
            dataModel = createDataScienceModel();
            scene.add(dataModel);

            // Create Civil Engineering Model (Building Structure)
            civilModel = createCivilEngineeringModel();
            scene.add(civilModel);
            
            updateModelAndLights();
            
            window.addEventListener('resize', () => {
                if (camera && renderer && container && container.clientWidth > 0 && container.clientHeight > 0) {
                    camera.aspect = container.clientWidth / container.clientHeight;
                    camera.updateProjectionMatrix();
                    renderer.setSize(container.clientWidth, container.clientHeight);
                }
            });
            
            document.addEventListener('mousemove', (event) => {
                mouseX = (event.clientX / window.innerWidth) * 2 - 1;
                mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
            });
            
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            animate();

        } catch (error) {
            console.error('Error initializing Three.js:', error);
            const modelContainer = document.querySelector('.model-container');
            if (modelContainer) {
                modelContainer.innerHTML = '<p style="color: currentColor; text-align: center; padding-top: 40%;">3D Preview Unavailable</p>';
            }
        }
    }
    
    // Create Data Science Model (Neural Network Visualization)
    function createDataScienceModel() {
        const group = new THREE.Group();
        
        // Neural network core
        const coreGeometry = new THREE.IcosahedronGeometry(0.3, 2);
        const coreMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x00E676,
            emissive: 0x00E676,
            emissiveIntensity: 0.6,
            metalness: 0.9,
            roughness: 0.2,
            envMap: envMap,
            transparent: true,
            opacity: 0.9
        });
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        group.add(core);
        
        // Neural network nodes
        const nodeGeometry = new THREE.SphereGeometry(0.04, 10, 10);
        const nodeMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x00E676, 
            emissive: 0x00E676, 
            emissiveIntensity: 0.7,
            metalness: 0.8,
            roughness: 0.2,
            envMap: envMap
        });
        const nodeMaterialAlt = new THREE.MeshPhysicalMaterial({ 
            color: 0x536DFE, 
            emissive: 0x536DFE, 
            emissiveIntensity: 0.5,
            metalness: 0.8,
            roughness: 0.2,
            envMap: envMap
        });
        
        // Create layered neural network structure
        const layers = 4;
        const nodesPerLayer = [8, 12, 12, 6];
        const layerDistance = 0.5;
        const nodes = [];
        
        for (let layer = 0; layer < layers; layer++) {
            for (let i = 0; i < nodesPerLayer[layer]; i++) {
                const currentMaterial = layer % 2 === 0 ? nodeMaterial : nodeMaterialAlt;
                const node = new THREE.Mesh(nodeGeometry, currentMaterial);
                
                // Position nodes in a circular pattern within each layer
                const angle = (i / nodesPerLayer[layer]) * Math.PI * 2;
                const radius = 0.6 + Math.random() * 0.2;
                
                node.position.set(
                    Math.cos(angle) * radius,
                    (layer - (layers/2) + 0.5) * layerDistance,
                    Math.sin(angle) * radius
                );
                
                nodes.push(node);
                group.add(node);
            }
        }
        
        // Create neural connections between layers
        const lineMaterial = new THREE.LineBasicMaterial({ 
            color: 0x00E676, 
            transparent: true, 
            opacity: 0.15 
        });
        
        // Connect each node to several nodes in the next layer
        for (let layer = 0; layer < layers - 1; layer++) {
            const startIdx = layer === 0 ? 0 : nodesPerLayer.slice(0, layer).reduce((a, b) => a + b, 0);
            const endIdx = startIdx + nodesPerLayer[layer];
            const nextLayerStart = endIdx;
            const nextLayerEnd = nextLayerStart + nodesPerLayer[layer + 1];
            
            for (let i = startIdx; i < endIdx; i++) {
                const connectionsCount = Math.floor(Math.random() * 3) + 2;
                
                for (let c = 0; c < connectionsCount; c++) {
                    const targetIdx = nextLayerStart + Math.floor(Math.random() * nodesPerLayer[layer + 1]);
                    
                    if (targetIdx < nextLayerEnd) {
                        const points = [nodes[i].position.clone(), nodes[targetIdx].position.clone()];
                        const geometry = new THREE.BufferGeometry().setFromPoints(points);
                        const line = new THREE.Line(geometry, lineMaterial);
                        group.add(line);
                    }
                }
            }
        }
        
        return group;
    }
    
    // Create Civil Engineering Model (Building Structure)
    function createCivilEngineeringModel() {
        const group = new THREE.Group();
        
        // Building base
        const baseGeometry = new THREE.BoxGeometry(1.5, 0.1, 1.5);
        const baseMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x5D4037, 
            metalness: 0.2,
            roughness: 0.8,
            envMap: envMap
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = -0.8;
        group.add(base);
        
        // Building columns
        const columnGeometry = new THREE.CylinderGeometry(0.08, 0.08, 1.5, 8);
        const columnMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x5D4037, 
            metalness: 0.2,
            roughness: 0.8,
            envMap: envMap
        });
        
        const columnPositions = [
            [-0.6, 0, -0.6],
            [0.6, 0, -0.6],
            [-0.6, 0, 0.6],
            [0.6, 0, 0.6]
        ];
        
        columnPositions.forEach(pos => {
            const column = new THREE.Mesh(columnGeometry, columnMaterial);
            column.position.set(pos[0], pos[1], pos[2]);
            group.add(column);
        });
        
        // Building floors
        const floorGeometry = new THREE.BoxGeometry(1.5, 0.05, 1.5);
        const floorMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x0288D1, 
            metalness: 0.3,
            roughness: 0.7,
            envMap: envMap
        });
        
        for (let i = 0; i < 3; i++) {
            const floor = new THREE.Mesh(floorGeometry, floorMaterial);
            floor.position.y = -0.5 + (i * 0.5);
            group.add(floor);
        }
        
        // Building roof
        const roofGeometry = new THREE.ConeGeometry(1.1, 0.5, 4);
        const roofMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0x0288D1, 
            metalness: 0.3,
            roughness: 0.7,
            envMap: envMap
        });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = 0.75;
        roof.rotation.y = Math.PI / 4;
        group.add(roof);
        
        // Building details
        const detailGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        const detailMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0xE64A19, 
            metalness: 0.4,
            roughness: 0.6,
            envMap: envMap
        });
        
        for (let i = 0; i < 8; i++) {
            const detail = new THREE.Mesh(detailGeometry, detailMaterial);
            const angle = (i / 8) * Math.PI * 2;
            detail.position.set(
                Math.cos(angle) * 0.8,
                0.2,
                Math.sin(angle) * 0.8
            );
            group.add(detail);
        }
        
        return group;
    }
    
    function updateModelAndLights() {
        if (!scene || !dataModel || !civilModel) return;
        
        const currentTheme = document.documentElement.getAttribute('data-theme');
        
        dataModel.visible = currentTheme === 'dark';
        civilModel.visible = currentTheme === 'light';
        
        if (currentTheme === 'dark') {
            pointLight1.color.setHex(0x00E676);
            pointLight2.color.setHex(0x536DFE);
            ambientLight.intensity = 0.7;
        } else {
            pointLight1.color.setHex(0x5D4037);
            pointLight2.color.setHex(0x0288D1);
            ambientLight.intensity = 0.8;
        }
    }
    
    function animate() {
        animationFrameId = requestAnimationFrame(animate);
        
        const delta = clock.getDelta();
        
        if (dataModel && dataModel.visible) {
            dataModel.rotation.y += 0.002;
            dataModel.rotation.x += 0.001;
            dataModel.rotation.y += (mouseX * 0.02 - dataModel.rotation.y) * 0.04;
            dataModel.rotation.x += (mouseY * 0.02 - dataModel.rotation.x) * 0.04;
            
            // Animate data nodes
            dataModel.children.forEach(child => {
                if (child instanceof THREE.Mesh && child.geometry.type === 'SphereGeometry' && child.geometry.parameters.radius < 0.1) {
                    child.position.x += Math.sin(clock.elapsedTime * (Math.random() * 0.5 + 0.5) + child.id * 0.1) * 0.0005;
                    child.position.y += Math.cos(clock.elapsedTime * (Math.random() * 0.5 + 0.5) + child.id * 0.1) * 0.0005;
                }
            });
        }
        
        if (civilModel && civilModel.visible) {
            civilModel.rotation.y += 0.001;
            civilModel.rotation.y += (mouseX * 0.01 - civilModel.rotation.y) * 0.04;
            civilModel.rotation.x += (mouseY * 0.01 - civilModel.rotation.x) * 0.04;
        }
        
        if (renderer && scene && camera) {
            renderer.render(scene, camera);
        }
    }
    
    function updateBackgroundEffects() {
        createParticles();
        createBinaryCode();
        createSkyscrapers();
    }
    
    function createParticles() {
        const particlesContainer = document.querySelector('.particles');
        if (!particlesContainer) return;
        
        particlesContainer.innerHTML = '';
        
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const particleCount = currentTheme === 'dark' ? 30 : 40;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const size = Math.random() * 3 + 1;
            const opacity = Math.random() * 0.3 + 0.1;
            
            particle.style.top = `${y}%`;
            particle.style.left = `${x}%`;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.opacity = opacity;
            
            if (currentTheme === 'dark') {
                particle.style.backgroundColor = Math.random() > 0.5 ? 'var(--dark-accent1)' : 'var(--dark-accent2)';
            } else {
                particle.style.backgroundColor = Math.random() > 0.5 ? 'var(--bright-accent1)' : 'var(--bright-accent2)';
            }
            
            particlesContainer.appendChild(particle);
            animateParticle(particle);
        }
    }
    
    function animateParticle(particle) {
        const duration = Math.random() * 18 + 12;
        const xMove = Math.random() * 12 - 6;
        const yMove = Math.random() * 12 - 6;
        
        gsap.to(particle, {
            x: xMove,
            y: yMove,
            scale: Math.random() * 0.5 + 0.8,
            duration: duration,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }
    
    function createBinaryCode() {
        const binaryContainer = document.querySelector('.binary');
        if (!binaryContainer) return;
        
        binaryContainer.innerHTML = '';
        
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme !== 'dark') return;
        
        const streamCount = 15;
        
        for (let i = 0; i < streamCount; i++) {
            const stream = document.createElement('div');
            stream.className = 'binary-stream';
            
            const x = Math.random() * 100;
            const delay = Math.random() * 6;
            let binaryText = '';
            const length = Math.floor(Math.random() * 12) + 8;
            
            for (let j = 0; j < length; j++) {
                binaryText += Math.round(Math.random());
            }
            
            stream.style.left = `${x}%`;
            stream.style.color = 'var(--dark-accent1)';
            stream.style.fontFamily = 'var(--font-mono)';
            stream.style.fontSize = `${Math.random() * 6 + 7}px`;
            stream.style.opacity = Math.random() * 0.25 + 0.05;
            stream.style.textShadow = '0 0 3px var(--dark-accent1)';
            stream.style.animationDuration = `${Math.random() * 10 + 5}s`;
            stream.style.animationDelay = `${delay}s`;
            
            stream.textContent = binaryText;
            binaryContainer.appendChild(stream);
        }
    }
    
    function createSkyscrapers() {
        const skyscrapersContainer = document.querySelector('.skyscrapers');
        if (!skyscrapersContainer) return;
        
        skyscrapersContainer.innerHTML = '';
        
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme !== 'dark') return;
        
        const buildingCount = 12;
        
        for (let i = 0; i < buildingCount; i++) {
            const skyscraper = document.createElement('div');
            skyscraper.className = 'skyscraper';
            
            const width = Math.random() * 30 + 20;
            const height = Math.random() * 150 + 100;
            const left = (i / buildingCount) * 100;
            
            skyscraper.style.width = `${width}px`;
            skyscraper.style.height = `${height}px`;
            skyscraper.style.left = `${left}%`;
            skyscraper.style.bottom = '0';
            
            // Create windows
            const windowCount = Math.floor((height / 15) * (width / 15));
            
            for (let j = 0; j < windowCount; j++) {
                const windowEl = document.createElement('div');
                windowEl.className = 'skyscraper-window';
                windowEl.style.width = '2px';
                windowEl.style.height = '2px';
                windowEl.style.position = 'absolute';
                windowEl.style.background = 'var(--dark-accent1)';
                windowEl.style.left = `${Math.random() * 100}%`;
                windowEl.style.top = `${Math.random() * 100}%`;
                windowEl.style.opacity = Math.random() > 0.5 ? '1' : '0.5';
                
                skyscraper.appendChild(windowEl);
            }
            
            skyscrapersContainer.appendChild(skyscraper);
        }
    }
    
    // Initialize typed.js
    function initializeTypedText() {
        const typedTextElement = document.getElementById('typed-text');
        if (typedTextElement && window.Typed) {
            try {
                const options = {
                    strings: [
                        'Archishman Das',
                        'Civil Engineer',
                        'Data Scientist',
                        'Bridging Structure and Data',
                        'Engineering Digital Solutions',
                        'Building Tomorrow\'s Infrastructure'
                    ],
                    typeSpeed: 40,
                    backSpeed: 25,
                    backDelay: 1800,
                    loop: true,
                    smartBackspace: true,
                    showCursor: true,
                    cursorChar: '|',
                };
                new Typed(typedTextElement, options);
            } catch (error) {
                console.error('Error initializing Typed.js:', error);
                typedTextElement.textContent = 'Archishman Das | Civil Engineer & Data Scientist';
            }
        } else {
            console.warn('Typed.js library or target element #typed-text not found.');
            if(typedTextElement) typedTextElement.textContent = 'Archishman Das | Civil Engineer & Data Scientist';
        }
    }
    
    // Sound toggle functionality
    const soundToggle = document.querySelector('.sound-toggle');
    let soundEnabled = false;

    // Create audio elements with more professional sounds
    const hoverSound = new Audio('sounds/hover.mp3'); // Soft "blip" sound (300Hz sine wave)
    const clickSound = new Audio('sounds/click.mp3'); // Gentle "tap" sound (wooden percussive)
    const themeSound = new Audio('sounds/theme.mp3'); // Smooth whoosh (filtered noise)

    // Set volume
    hoverSound.volume = 0.2;
    clickSound.volume = 0.3;
    themeSound.volume = 0.4;

    if (soundToggle) {
        soundToggle.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            soundToggle.classList.toggle('active');
            
            if (soundEnabled) {
                // Play a sound when enabled
                themeSound.play();
            }
        });
    }

    // Add sound to interactive elements
    document.querySelectorAll('button, a, .skill-icon, .theme-toggle, .project-card').forEach(el => {
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
    
    // Portfolio button animation
    const portfolioBtn = document.getElementById('portfolioBtn');
    if (portfolioBtn) {
        portfolioBtn.addEventListener('mouseenter', () => {
            gsap.to(portfolioBtn, { scale: 1.05, duration: 0.3, ease: 'power2.out' });
        });
        
        portfolioBtn.addEventListener('mouseleave', () => {
            gsap.to(portfolioBtn, { scale: 1, duration: 0.3, ease: 'power2.out' });
        });
        
        portfolioBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Create fluid mask for page transition
            const mask = document.createElement('div');
            mask.style.position = 'fixed';
            mask.style.top = '0';
            mask.style.left = '0';
            mask.style.width = '100vw';
            mask.style.height = '100vh';
            mask.style.background = document.documentElement.getAttribute('data-theme') === 'dark' 
                ? 'radial-gradient(circle at ' + e.clientX + 'px ' + e.clientY + 'px, var(--dark-accent1), var(--dark-accent2))'
                : 'radial-gradient(circle at ' + e.clientX + 'px ' + e.clientY + 'px, var(--bright-accent1), var(--bright-accent2))';
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
                    
                    gsap.to(['.container', '.background', '.theme-toggle', '.sound-toggle', '.featured-projects', '.site-footer'], {
                        opacity: 0,
                        y: -50,
                        duration: 0.8,
                        ease: 'power2.inOut',
                        stagger: 0.05,
                        onComplete: () => {
                            window.location.href = portfolioBtn.getAttribute('href');
                        }
                    });
                }
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
            particle.style.background = document.documentElement.getAttribute('data-theme') === 'dark' 
                ? `hsl(${i * 12}, 100%, 70%)` : 
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
    
    // Scroll down button functionality
    const scrollDownBtn = document.querySelector('.scroll-down-btn');
    if (scrollDownBtn) {
        scrollDownBtn.addEventListener('click', () => {
            const featuredSection = document.querySelector('.featured-projects');
            if (featuredSection) {
                featuredSection.scrollIntoView({ behavior: 'smooth' });
                
                if (soundEnabled) {
                    clickSound.currentTime = 0;
                    clickSound.play();
                }
            }
        });
    }
    
    // Initialize everything
    function initializeAnimations() {
        initThreeJS();
        initializeTypedText();
        updateBackgroundEffects();
        initScrollIndicator();
        
        // Animate project cards on scroll
        const projectCards = document.querySelectorAll('.project-card');
        if (projectCards.length) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        gsap.to(entry.target, {
                            y: 0,
                            opacity: 1,
                            duration: 0.8,
                            ease: "back.out(1.7)",
                            delay: Array.from(projectCards).indexOf(entry.target) * 0.1
                        });
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            projectCards.forEach(card => {
                gsap.set(card, { y: 50, opacity: 0 });
                observer.observe(card);
            });
        }
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        // Reinitialize any size-dependent features
        if (window.innerWidth <= 768) {
            document.body.style.cursor = 'auto';
        } else if (!prefersReducedMotion) {
            document.body.style.cursor = 'none';
        }
    });
});
