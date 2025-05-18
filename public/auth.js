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
const db = firebase.firestore();
const errorMessage = document.getElementById('errorMessage');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const googleSignIn = document.getElementById('googleSignIn');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const themeOptions = document.querySelectorAll('.theme-option');
const togglePasswordBtns = document.querySelectorAll('.toggle-password');
const registerPassword = document.getElementById('registerPassword');

// Theme Toggling
document.addEventListener('DOMContentLoaded', function() {
    const htmlElement = document.documentElement;
    
    // Check for saved theme preference or use default
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateActiveThemeButton(savedTheme);
    
    // Initialize visual elements based on current theme
    updateVisualElements(savedTheme);
    
    // Update code snippets based on theme
    updateCodeSnippets(savedTheme);
});

// Theme option buttons
themeOptions.forEach(option => {
    option.addEventListener('click', function() {
        const theme = this.getAttribute('data-theme');
        const htmlElement = document.documentElement;
        
        // Apply theme with animation
        applyThemeWithAnimation(theme);
        
        // Save theme preference
        localStorage.setItem('theme', theme);
        
        // Update active button
        updateActiveThemeButton(theme);
        
        // Update visual elements for the theme
        updateVisualElements(theme);
        
        // Update code snippets
        updateCodeSnippets(theme);
    });
});

function applyThemeWithAnimation(theme) {
    const htmlElement = document.documentElement;
    const authContainer = document.querySelector('.auth-container');
    
    // Add transition class
    authContainer.classList.add('theme-transitioning');
    
    // Apply new theme
    htmlElement.setAttribute('data-theme', theme);
    
    // Remove transition class after animation completes
    setTimeout(() => {
        authContainer.classList.remove('theme-transitioning');
    }, 500);
}

function updateActiveThemeButton(theme) {
    themeOptions.forEach(option => {
        if (option.getAttribute('data-theme') === theme) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
}

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

// Toggle password visibility
togglePasswordBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const input = btn.parentElement.querySelector('input');
        const icon = btn.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            input.type = 'password';
            icon.className = 'fas fa-eye';
        }
    });
});

// Password strength meter
if (registerPassword) {
    registerPassword.addEventListener('input', () => {
        const strength = calculatePasswordStrength(registerPassword.value);
        updateStrengthMeter(strength);
    });
}

function calculatePasswordStrength(password) {
    // Password strength criteria
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    
    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 1;
    
    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 1;
    
    // Contains number
    if (/[0-9]/.test(password)) strength += 1;
    
    // Contains special character
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    return strength;
}

function updateStrengthMeter(strength) {
    const segments = document.querySelectorAll('.strength-segment');
    const strengthText = document.querySelector('.strength-text');
    
    // Reset all segments
    segments.forEach(segment => {
        segment.className = 'strength-segment';
    });
    
    // Update segments based on strength
    for (let i = 0; i < strength; i++) {
        if (segments[i]) {
            if (strength === 1) segments[i].classList.add('weak');
            else if (strength === 2) segments[i].classList.add('medium');
            else if (strength === 3) segments[i].classList.add('strong');
            else segments[i].classList.add('very-strong');
        }
    }
    
    // Update text
    if (strength === 0) strengthText.textContent = 'Password strength';
    else if (strength === 1) strengthText.textContent = 'Weak password';
    else if (strength === 2) strengthText.textContent = 'Medium password';
    else if (strength === 3) strengthText.textContent = 'Strong password';
    else strengthText.textContent = 'Very strong password';
}

// Login form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const loginBtn = loginForm.querySelector('.auth-btn');
    
    // Clear previous error messages and states
    clearErrors();
    
    // Show loading state
    loginBtn.classList.add('loading');
    
    // Sign in with email and password
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log("User signed in:", user);
            
            // Check if user is an admin before redirecting
            checkIfAdmin(user.uid);
        })
        .catch((error) => {
            const errorCode = error.code;
            
            // Hide loading state
            loginBtn.classList.remove('loading');
            
            // Handle specific input errors
            if (errorCode === 'auth/invalid-email') {
                showInputError('loginEmail', 'Invalid email format');
            } else if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
                showInputError('loginEmail', 'Invalid credentials');
                showInputError('loginPassword', 'Invalid credentials');
            } else {
                // Display general error message
                showErrorMessage(getErrorMessage(errorCode));
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
    const registerBtn = registerForm.querySelector('.auth-btn');
    
    // Clear previous error messages and states
    clearErrors();
    
    // Check if passwords match
    if (password !== confirmPassword) {
        showInputError('confirmPassword', 'Passwords do not match');
        return;
    }
    
    // Check password strength
    const strength = calculatePasswordStrength(password);
    if (strength < 3) {
        showInputError('registerPassword', 'Password is too weak');
        return;
    }
    
    // Show loading state
    registerBtn.classList.add('loading');
    
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
            
            // Get current user
            const user = auth.currentUser;
            
            // By default, new users are not admins
            // They need to be manually added to the admins collection
            showErrorMessage("Registration successful! Please contact the administrator to grant you admin access.");
            
            // Hide loading state
            registerBtn.classList.remove('loading');
            
            // Reset form
            registerForm.reset();
            
            // Switch to login tab
            tabBtns[0].click();
        })
        .catch((error) => {
            const errorCode = error.code;
            
            // Hide loading state
            registerBtn.classList.remove('loading');
            
            // Handle specific input errors
            if (errorCode === 'auth/email-already-in-use') {
                showInputError('registerEmail', 'Email already in use');
            } else if (errorCode === 'auth/invalid-email') {
                showInputError('registerEmail', 'Invalid email format');
            } else if (errorCode === 'auth/weak-password') {
                showInputError('registerPassword', 'Password is too weak');
            } else {
                // Display general error message
                showErrorMessage(getErrorMessage(errorCode));
            }
        });
});

// Google Sign In
googleSignIn.addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    
    // Clear previous error messages
    clearErrors();
    
    auth.signInWithPopup(provider)
        .then((result) => {
            // Signed in
            const user = result.user;
            console.log("User signed in with Google:", user);
            
            // Check if user is an admin before redirecting
            checkIfAdmin(user.uid);
        })
        .catch((error) => {
            const errorCode = error.code;
            
            // Don't show error for cancelled popups
            if (errorCode !== 'auth/cancelled-popup-request') {
                showErrorMessage(getErrorMessage(errorCode));
            }
        });
});

// Check if user is already signed in
auth.onAuthStateChanged((user) => {
    if (user) {
        // Check if user is an admin before redirecting
        checkIfAdmin(user.uid);
    }
});

// Function to check if user is an admin
function checkIfAdmin(userId) {
    // Show loading state on login button
    const loginBtn = loginForm.querySelector('.auth-btn');
    loginBtn.classList.add('loading');
    
    // Check admin status in Firestore
    db.collection('admins').doc(userId).get()
        .then((doc) => {
            // Hide loading state
            loginBtn.classList.remove('loading');
            
            if (doc.exists && doc.data().isAdmin === true) {
                // User is an admin, redirect to admin page
                window.location.href = 'admin.html';
            } else {
                // User is not an admin
                showErrorMessage('You do not have admin privileges.');
                // Sign out the user
                auth.signOut();
            }
        })
        .catch((error) => {
            // Hide loading state
            loginBtn.classList.remove('loading');
            
            console.error("Error checking admin status:", error);
            showErrorMessage('Error verifying admin status.');
        });
}

// Error handling functions
function showInputError(inputId, message) {
    const inputGroup = document.getElementById(inputId).parentElement;
    inputGroup.classList.add('error');
    
    // Add error message if not already present
    if (!inputGroup.querySelector('.input-error-message')) {
        const errorSpan = document.createElement('span');
        errorSpan.className = 'input-error-message';
        errorSpan.textContent = message;
        errorSpan.style.color = '#ff6b6b';
        errorSpan.style.fontSize = '0.8rem';
        errorSpan.style.marginTop = '0.3rem';
        errorSpan.style.display = 'block';
        inputGroup.appendChild(errorSpan);
    } else {
        inputGroup.querySelector('.input-error-message').textContent = message;
    }
}

function showErrorMessage(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
}

function clearErrors() {
    // Remove all input error states
    document.querySelectorAll('.input-group').forEach(group => {
        group.classList.remove('error');
        const errorMessage = group.querySelector('.input-error-message');
        if (errorMessage) errorMessage.remove();
    });
    
    // Clear general error message
    errorMessage.textContent = '';
    errorMessage.classList.remove('show');
}

function getErrorMessage(errorCode) {
    switch (errorCode) {
        case 'auth/invalid-email':
            return 'Invalid email address format.';
        case 'auth/user-disabled':
            return 'This account has been disabled.';
        case 'auth/user-not-found':
            return 'No account found with this email.';
        case 'auth/wrong-password':
            return 'Incorrect password.';
        case 'auth/email-already-in-use':
            return 'Email already in use.';
        case 'auth/weak-password':
            return 'Password is too weak.';
        case 'auth/account-exists-with-different-credential':
            return 'An account already exists with the same email address.';
        case 'auth/popup-blocked':
            return 'Popup was blocked by the browser.';
        default:
            return 'An error occurred. Please try again.';
    }
}

// Visual Elements
function updateVisualElements(theme) {
    // Update data visualization
    updateDataChart(theme);
    
    // Update 3D model
    update3DModel(theme);
    
    // Rotate code snippets
    rotateCodeSnippets();
    
    // Update background elements
    updateBackgroundElements(theme);
}

function updateDataChart(theme) {
    const ctx = document.getElementById('dataChart').getContext('2d');
    
    // Set colors based on theme
    let primaryColor, secondaryColor;
    
    switch(theme) {
        case 'dark':
            primaryColor = '#A020F0';
            secondaryColor = '#00A896';
            break;
        case 'light':
            primaryColor = '#0077B6';
            secondaryColor = '#FF6B35';
            break;
        case 'cyber':
            primaryColor = '#00F5D4';
            secondaryColor = '#F20089';
            break;
        case 'sunrise':
            primaryColor = '#FF6B35';
            secondaryColor = '#0077B6';
            break;
        case 'material':
            primaryColor = '#6200EE';
            secondaryColor = '#03DAC6';
            break;
        case 'terminal':
            primaryColor = '#00FF41';
            secondaryColor = '#0AEFFF';
            break;
        default:
            primaryColor = '#A020F0';
            secondaryColor = '#00A896';
    }
    
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
    if (!container) return;
    
    // Clear previous model
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    
    // Set colors based on theme
    let primaryColor, secondaryColor;
    
    switch(theme) {
        case 'dark':
            primaryColor = 0xA020F0;
            secondaryColor = 0x00A896;
            break;
        case 'light':
            primaryColor = 0x0077B6;
            secondaryColor = 0xFF6B35;
            break;
        case 'cyber':
            primaryColor = 0x00F5D4;
            secondaryColor = 0xF20089;
            break;
        case 'sunrise':
            primaryColor = 0xFF6B35;
            secondaryColor = 0x0077B6;
            break;
        case 'material':
            primaryColor = 0x6200EE;
            secondaryColor = 0x03DAC6;
            break;
        case 'terminal':
            primaryColor = 0x00FF41;
            secondaryColor = 0x0AEFFF;
            break;
        default:
            primaryColor = 0xA020F0;
            secondaryColor = 0x00A896;
    }
    
    // Create new scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // Create model based on theme
    if (theme === 'dark' || theme === 'cyber' || theme === 'terminal') {
        // Data Science theme - create neural network visualization
        createNeuralNetwork(scene, primaryColor, secondaryColor);
    } else {
        // Civil Engineering theme - create bridge structure
        createBridgeStructure(scene, primaryColor, secondaryColor);
    }
    
    camera.position.z = 5;
    
    // Add interactive controls
    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
        const y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;
        
        gsap.to(scene.rotation, {
            x: y * 0.3,
            y: x * 0.5,
            duration: 1
        });
    });
    
    // Animation
    function animate() {
        requestAnimationFrame(animate);
        scene.rotation.y += 0.005;
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (container) {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }
    });
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

function updateBackgroundElements(theme) {
    const elements = document.querySelectorAll('.floating-element');
    
    // Update opacity based on theme
    elements.forEach(element => {
        if (theme === 'cyber') {
            element.style.opacity = '0.15';
        } else if (theme === 'terminal') {
            element.style.opacity = '0.2';
        } else {
            element.style.opacity = '0.1';
        }
    });
}

function updateCodeSnippets(theme) {
    const snippets = {
        dark: [
            "// Neural Network Architecture\nmodel = Sequential([\n  Dense(128, activation='relu'),\n  Dropout(0.2),\n  Dense(1, activation='sigmoid')\n])",
            "// Structural Analysis Function\nfunction beamIntegrity(sensors) {\n  const safetyFactor = 0.85;\n  return sensors.map(s => s * safetyFactor);\n}",
            "// Data Processing Pipeline\ndf = pd.read_csv('sensors.csv')\ndf = df.dropna().groupby('location').mean()"
        ],
        light: [
            "// Structural Analysis Function\nfunction beamIntegrity(sensors) {\n  const safetyFactor = 0.85;\n  return sensors.map(s => s * safetyFactor);\n}",
            "// Bridge Load Calculator\nfunction calculateLoad(length, width) {\n  return length * 0.75 + Math.pow(width/10, 2);\n}",
            "// Material Stress Test\nclass ConcreteTest {\n  constructor(psi) {\n    this.strength = psi;\n  }\n}"
        ],
        cyber: [
            "// Cybersecurity Check\nfunction authenticate(user) {\n  return crypto.subtle.digest('SHA-256',\n    new TextEncoder().encode(user.password));\n}",
            "// Neural Network Architecture\nmodel = Sequential([\n  Dense(256, activation='relu'),\n  Dropout(0.3),\n  Dense(1, activation='sigmoid')\n])",
            "// Encryption Protocol\nconst encrypted = await window.crypto.subtle\n  .encrypt(\n    { name: 'RSA-OAEP' },\n    publicKey,\n    data\n  );"
        ],
        sunrise: [
            "// Data Visualization\nconst chart = new Chart(ctx, {\n  type: 'bar',\n  data: {\n    labels: ['Jan', 'Feb', 'Mar'],\n    datasets: [{ data: [12, 19, 3] }]\n  }\n});",
            "// Analytics Dashboard\nfunction renderMetrics(data) {\n  return data.map(d => {\n    return `<div class=\"metric\">${d.value}</div>`;\n  }).join('');\n}",
            "// Reporting Engine\nclass Report {\n  generate(data, format) {\n    if (format === 'csv') return this.toCSV(data);\n    return this.toJSON(data);\n  }\n}"
        ],
        material: [
            "// Material Design Component\nclass RippleButton extends Component {\n  createRipple(event) {\n    const button = event.currentTarget;\n    const ripple = document.createElement('span');\n    button.appendChild(ripple);\n  }\n}",
            "// Animation System\nconst fadeIn = element => {\n  gsap.fromTo(element, \n    { opacity: 0 }, \n    { opacity: 1, duration: 0.5 }\n  );\n};",
            "// Theme Manager\nconst applyTheme = (theme) => {\n  document.documentElement.style.setProperty(\n    '--primary', theme.primary\n  );\n};"
        ],
        terminal: [
            "// System Access\nsudo chmod 755 ./deploy.sh\n./deploy.sh --env=production",
            "// Network Scan\nnmap -sS -sV -O -p 1-65535 192.168.1.1/24\n# Checking for open ports...",
            "// Git Operations\ngit checkout -b feature/auth\ngit commit -m \"Implement JWT auth\"\ngit push origin feature/auth"
        ]
    };
    
    // Default to dark theme snippets if theme not found
    const themeSnippets = snippets[theme] || snippets.dark;
    
    document.querySelectorAll('.snippet code').forEach((snippet, i) => {
        if (themeSnippets[i]) {
            snippet.textContent = themeSnippets[i];
        }
    });
}
