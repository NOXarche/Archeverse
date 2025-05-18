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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize variables
const auth = firebase.auth();
const errorMessage = document.getElementById('errorMessage');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const googleSignIn = document.getElementById('googleSignIn');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const themeToggle = document.getElementById('themeToggle');

// Theme Toggling
document.addEventListener('DOMContentLoaded', function() {
    const htmlElement = document.documentElement;
    const themeIcon = themeToggle.querySelector('i');
    
    // Check for saved theme preference or use default
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    // Toggle theme on click
    themeToggle.addEventListener('click', function() {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Update visual elements for the theme
        updateVisualElements(newTheme);
    });
    
    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.className = 'fas fa-sun';
        } else {
            themeIcon.className = 'fas fa-moon';
        }
    }
    
    // Initialize visual elements based on current theme
    updateVisualElements(savedTheme);
});

// Tab switching
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons and contents
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
    });
});

// Login form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Clear previous error messages
    errorMessage.textContent = '';
    
    // Sign in with email and password
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log("User signed in:", user);
            window.location.href = 'admin.html';
        })
        .catch((error) => {
            const errorCode = error.code;
            
            // Display appropriate error message
            switch (errorCode) {
                case 'auth/invalid-email':
                    errorMessage.textContent = 'Invalid email address format.';
                    break;
                case 'auth/user-disabled':
                    errorMessage.textContent = 'This account has been disabled.';
                    break;
                case 'auth/user-not-found':
                    errorMessage.textContent = 'No account found with this email.';
                    break;
                case 'auth/wrong-password':
                    errorMessage.textContent = 'Incorrect password.';
                    break;
                default:
                    errorMessage.textContent = 'An error occurred. Please try again.';
                    break;
            }
        });
});

// Register form submission
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Clear previous error messages
    errorMessage.textContent = '';
    
    // Check if passwords match
    if (password !== confirmPassword) {
        errorMessage.textContent = 'Passwords do not match.';
        return;
    }
    
    // Create user with email and password
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed up
            const user = userCredential.user;
            
            // Update profile with name
            return user.updateProfile({
                displayName: name
            });
        })
        .then(() => {
            console.log("User registered successfully");
            window.location.href = 'admin.html';
        })
        .catch((error) => {
            const errorCode = error.code;
            
            // Display appropriate error message
            switch (errorCode) {
                case 'auth/email-already-in-use':
                    errorMessage.textContent = 'Email already in use.';
                    break;
                case 'auth/invalid-email':
                    errorMessage.textContent = 'Invalid email address format.';
                    break;
                case 'auth/weak-password':
                    errorMessage.textContent = 'Password is too weak.';
                    break;
                default:
                    errorMessage.textContent = 'An error occurred. Please try again.';
                    break;
            }
        });
});

// Google Sign In
googleSignIn.addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    
    auth.signInWithPopup(provider)
        .then((result) => {
            // Signed in
            const user = result.user;
            console.log("User signed in with Google:", user);
            window.location.href = 'admin.html';
        })
        .catch((error) => {
            const errorCode = error.code;
            
            // Display appropriate error message
            switch (errorCode) {
                case 'auth/account-exists-with-different-credential':
                    errorMessage.textContent = 'An account already exists with the same email address.';
                    break;
                case 'auth/popup-blocked':
                    errorMessage.textContent = 'Popup was blocked by the browser.';
                    break;
                case 'auth/cancelled-popup-request':
                    // User closed the popup, no need to show error
                    break;
                default:
                    errorMessage.textContent = 'An error occurred. Please try again.';
                    break;
            }
        });
});

// Check if user is already signed in
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in, redirect to admin page
        console.log("User is already signed in:", user);
        window.location.href = 'admin.html';
    }
});

// Visual Elements
function updateVisualElements(theme) {
    // Update data visualization
    updateDataChart(theme);
    
    // Update 3D model
    update3DModel(theme);
    
    // Rotate code snippets
    rotateCodeSnippets();
}

function updateDataChart(theme) {
    const ctx = document.getElementById('dataChart').getContext('2d');
    
    // Set colors based on theme
    const primaryColor = theme === 'dark' ? '#A020F0' : '#0077B6';
    const secondaryColor = theme === 'dark' ? '#00A896' : '#FF6B35';
    
    // Destroy existing chart if it exists
    if (window.dataChart) {
        window.dataChart.destroy();
    }
    
    // Create new chart
    window.dataChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Data Points',
                data: [12, 19, 3, 5, 2, 3],
                borderColor: primaryColor,
                backgroundColor: 'transparent',
                tension: 0.4
            }, {
                label: 'Predictions',
                data: [5, 15, 10, 8, 12, 15],
                borderColor: secondaryColor,
                backgroundColor: 'transparent',
                borderDash: [5, 5],
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        display: false
                    },
                    ticks: {
                        display: false
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        display: false
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

function update3DModel(theme) {
    const container = document.getElementById('modelContainer');
    
    // Clear previous model
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    
    // Set colors based on theme
    const primaryColor = theme === 'dark' ? 0xA020F0 : 0x0077B6;
    const secondaryColor = theme === 'dark' ? 0x00A896 : 0xFF6B35;
    
    // Create new scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // Create model based on theme
    if (theme === 'dark') {
        // Data Science theme - create neural network visualization
        createNeuralNetwork(scene, primaryColor, secondaryColor);
    } else {
        // Civil Engineering theme - create bridge structure
        createBridgeStructure(scene, primaryColor, secondaryColor);
    }
    
    camera.position.z = 5;
    
    // Animation
    function animate() {
        requestAnimationFrame(animate);
        scene.rotation.y += 0.01;
        renderer.render(scene, camera);
    }
    
    animate();
}

function createNeuralNetwork(scene, primaryColor, secondaryColor) {
    // Create nodes and connections for neural network
    const nodeGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const nodeMaterial = new THREE.MeshBasicMaterial({ color: primaryColor });
    
    // Create layers
    const layers = [3, 4, 3]; // Input, hidden, output layers
    const nodes = [];
    
    // Create nodes
    for (let l = 0; l < layers.length; l++) {
        const layer = [];
        const layerSize = layers[l];
        const xPos = (l - 1) * 2;
        
        for (let i = 0; i < layerSize; i++) {
            const yPos = (i - (layerSize - 1) / 2) * 0.8;
            const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
            node.position.set(xPos, yPos, 0);
            scene.add(node);
            layer.push(node);
        }
        
        nodes.push(layer);
    }
    
    // Create connections
    const lineMaterial = new THREE.LineBasicMaterial({ color: secondaryColor });
    
    for (let l = 0; l < nodes.length - 1; l++) {
        const currentLayer = nodes[l];
        const nextLayer = nodes[l + 1];
        
        for (let i = 0; i < currentLayer.length; i++) {
            for (let j = 0; j < nextLayer.length; j++) {
                const geometry = new THREE.BufferGeometry().setFromPoints([
                    currentLayer[i].position,
                    nextLayer[j].position
                ]);
                const line = new THREE.Line(geometry, lineMaterial);
                scene.add(line);
            }
        }
    }
}

function createBridgeStructure(scene, primaryColor, secondaryColor) {
    // Create bridge deck
    const deckGeometry = new THREE.BoxGeometry(5, 0.2, 1);
    const deckMaterial = new THREE.MeshBasicMaterial({ color: primaryColor });
    const deck = new THREE.Mesh(deckGeometry, deckMaterial);
    scene.add(deck);
    
    // Create pillars
    const pillarGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 16);
    const pillarMaterial = new THREE.MeshBasicMaterial({ color: secondaryColor });
    
    const pillar1 = new THREE.Mesh(pillarGeometry, pillarMaterial);
    pillar1.position.set(-1.5, -0.85, 0);
    scene.add(pillar1);
    
    const pillar2 = new THREE.Mesh(pillarGeometry, pillarMaterial);
    pillar2.position.set(1.5, -0.85, 0);
    scene.add(pillar2);
    
    // Create supports
    const supportGeometry = new THREE.BoxGeometry(0.8, 0.1, 1);
    const supportMaterial = new THREE.MeshBasicMaterial({ color: secondaryColor });
    
    const support1 = new THREE.Mesh(supportGeometry, supportMaterial);
    support1.position.set(-1.5, -0.15, 0);
    scene.add(support1);
    
    const support2 = new THREE.Mesh(supportGeometry, supportMaterial);
    support2.position.set(1.5, -0.15, 0);
    scene.add(support2);
}

function rotateCodeSnippets() {
    const snippets = document.querySelectorAll('.snippet');
    
    snippets.forEach((snippet, index) => {
        // Random rotation between -10 and 10 degrees
        const rotation = (Math.random() - 0.5) * 20;
        snippet.style.transform = `rotate(${rotation}deg)`;
        
        // Set animation delay
        snippet.style.animationDelay = `${index * 2}s`;
    });
}

// Initialize visual elements
document.addEventListener('DOMContentLoaded', function() {
    // Get current theme
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    
    // Initialize visual elements
    updateVisualElements(currentTheme);
    
    // Set up code snippet rotation
    setInterval(() => {
        rotateCodeSnippets();
    }, 10000);
});
