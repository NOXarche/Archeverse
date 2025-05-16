// Initialize sound control
let soundEnabled = true;
let soundInitialized = false;

// Audio elements
const portalOpenSound = document.getElementById('portal-open-sound');
const ambientSound = document.getElementById('ambient-sound');
const buttonHoverSound = document.getElementById('button-hover-sound');

// Set volume levels
portalOpenSound.volume = 0.7;
ambientSound.volume = 0.2;
buttonHoverSound.volume = 0.3;

// Sound toggle functionality
const toggleSoundBtn = document.getElementById('toggle-sound');
const toggleSoundIcon = toggleSoundBtn.querySelector('i');

// Function to initialize audio (must be triggered by user interaction)
function initializeAudio() {
    if (!soundInitialized) {
        // Create a context for all audio
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioContext = new AudioContext();
        
        // Load and decode audio files
        fetch('/sounds/portal-open.mp3')
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
            .then(audioBuffer => {
                portalOpenSound._decodedAudio = audioBuffer;
            })
            .catch(error => console.error('Error loading portal sound:', error));
            
        fetch('/sounds/ambient.mp3')
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
            .then(audioBuffer => {
                ambientSound._decodedAudio = audioBuffer;
            })
            .catch(error => console.error('Error loading ambient sound:', error));
            
        fetch('/sounds/button-hover.mp3')
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
            .then(audioBuffer => {
                buttonHoverSound._decodedAudio = audioBuffer;
            })
            .catch(error => console.error('Error loading button sound:', error));
            
        soundInitialized = true;
    }
}

// Play sound function that works with both HTML5 Audio and AudioContext
function playSound(sound) {
    if (!soundEnabled) return;
    
    if (sound._decodedAudio) {
        // Use AudioContext (more reliable)
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioContext = new AudioContext();
        const source = audioContext.createBufferSource();
        source.buffer = sound._decodedAudio;
        source.connect(audioContext.destination);
        source.start(0);
    } else {
        // Fallback to HTML5 Audio
        sound.currentTime = 0;
        sound.play().catch(error => {
            console.warn('Audio play failed:', error);
        });
    }
}

toggleSoundBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    
    if (soundEnabled) {
        toggleSoundIcon.className = 'fas fa-volume-up';
        ambientSound.play().catch(e => console.warn('Could not play ambient sound:', e));
    } else {
        toggleSoundIcon.className = 'fas fa-volume-mute';
        ambientSound.pause();
        portalOpenSound.pause();
    }
    
    // Initialize audio on first user interaction
    initializeAudio();
});

// Button hover sound effect
const enterBtn = document.getElementById('enter-btn');

enterBtn.addEventListener('mouseenter', () => {
    if (soundEnabled) {
        playSound(buttonHoverSound);
    }
});

// Initialize audio on first user interaction
document.addEventListener('click', initializeAudio, { once: true });

// Loading animation
function startLoadingAnimation() {
    const progressBar = document.querySelector('.progress-bar');
    const counterElement = document.querySelector('.counter');
    let counter = 0;
    
    const interval = setInterval(() => {
        if (counter < 100) {
            counter += 1;
            progressBar.style.width = `${counter}%`;
            counterElement.textContent = `${counter}%`;
        } else {
            clearInterval(interval);
            setTimeout(() => {
                // Show a message to click to continue
                const loadingMessage = document.querySelector('.loading-message');
                loadingMessage.textContent = 'Click anywhere to enter';
                
                // Wait for user interaction before starting animation
                document.body.addEventListener('click', function startAnimation() {
                    document.body.removeEventListener('click', startAnimation);
                    startPortalAnimation();
                });
            }, 500);
        }
    }, 30);
}

// Portal animation sequence
function startPortalAnimation() {
    // GSAP Timeline
    const tl = gsap.timeline();
    
    // Fade out loading screen
    tl.to('.loading-screen', {
        opacity: 0,
        duration: 1,
        onComplete: () => {
            document.querySelector('.loading-screen').style.display = 'none';
        }
    })
    
    // Fade in portal hero
    .to('.portal-hero', {
        opacity: 1,
        duration: 1
    })
    
    // Grow portal door
    .to('.portal-door', {
        width: '100vw',
        height: '100vh',
        duration: 0.5,
        ease: 'power2.inOut',
        onStart: () => {
            if (soundEnabled) {
                playSound(portalOpenSound);
            }
        }
    })
    
    // Open the doors
    .to('.door-left', {
        x: '-100%',
        duration: 1.5,
        ease: 'power2.out'
    }, '<')
    .to('.door-right', {
        x: '100%',
        duration: 1.5,
        ease: 'power2.out'
    }, '<')
    
    // Show portal glow
    .to('.portal-glow', {
        width: '150vw',
        height: '150vh',
        opacity: 0.8,
        duration: 1.5,
        ease: 'power2.inOut'
    }, '<')
    
    // Show content
    .to('.content-container', {
        opacity: 1,
        duration: 1,
        onComplete: () => {
            if (soundEnabled) {
                ambientSound.play().catch(e => console.warn('Could not play ambient sound:', e));
            }
            createParticles();
            
            // Make sure the button is clickable
            makeButtonClickable();
        }
    })
    
    // Animate text lines
    .to('.line1 span', {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out'
    })
    .to('.line2 span', {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out'
    }, '-=0.4')
    .to('.username-line span', {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out'
    }, '-=0.4');
}

// Make sure the button is clickable
function makeButtonClickable() {
    const enterBtnLink = document.querySelector('.enter-btn-link');
    
    // Add a pulsing animation to draw attention
    gsap.to('.enter-btn', {
        scale: 1.05,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
    });
    
    // Add an event listener to ensure navigation works
    enterBtnLink.addEventListener('click', function(e) {
        // Navigate to main page
        window.location.href = 'mainpage.html';
    });
    
    // Make sure the button is visible and interactive
    enterBtnLink.style.pointerEvents = 'auto';
    enterBtnLink.style.cursor = 'pointer';
    
    // Add a tooltip or hint
    const hint = document.createElement('div');
    hint.textContent = 'Click to continue';
    hint.style.color = 'var(--text-secondary)';
    hint.style.fontSize = '0.9rem';
    hint.style.marginTop = '1rem';
    hint.style.opacity = '0';
    
    document.querySelector('.cta-container').appendChild(hint);
    
    gsap.to(hint, {
        opacity: 1,
        duration: 1,
        delay: 1
    });
}

// Create floating particles effect
function createParticles() {
    const particlesContainer = document.querySelector('.portal-particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = `${Math.random() * 5 + 2}px`;
        particle.style.height = particle.style.width;
        particle.style.backgroundColor = 'rgba(0, 200, 255, 0.6)'; // Match accent color
        particle.style.borderRadius = '50%';
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.left = `${Math.random() * 100}%`;
        
        particlesContainer.appendChild(particle);
        
        // Animate each particle
        gsap.to(particle, {
            y: `-=${Math.random() * 200 + 100}`,
            x: `+=${Math.random() * 100 - 50}`,
            opacity: 0,
            duration: Math.random() * 5 + 3,
            ease: 'power1.out',
            onComplete: () => {
                // Reset particle
                particle.style.top = `${Math.random() * 100}%`;
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.opacity = '0.6';
                
                // Animate again
                gsap.to(particle, {
                    y: `-=${Math.random() * 200 + 100}`,
                    x: `+=${Math.random() * 100 - 50}`,
                    opacity: 0,
                    duration: Math.random() * 5 + 3,
                    ease: 'power1.out',
                    repeat: -1
                });
            }
        });
    }
}

// Firebase integration
function initFirebase() {
    // Replace with your Firebase config
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_AUTH_DOMAIN",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_STORAGE_BUCKET",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID"
    };
    
    try {
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        
        // Check authentication state
        firebase.auth().onAuthStateChanged((user) => {
            const usernameElement = document.getElementById('username');
            
            if (user) {
                // User is signed in
                const displayName = user.displayName || user.email || "Explorer";
                usernameElement.textContent = displayName;
            } else {
                // User is not signed in
                usernameElement.textContent = "mysterious explorer";
            }
        });
    } catch (error) {
        console.error("Firebase initialization error:", error);
        // Fallback if Firebase fails
        document.getElementById('username').textContent = "mysterious explorer";
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        initFirebase();
    } catch (error) {
        console.error("Firebase initialization error:", error);
        // Fallback if Firebase fails
        document.getElementById('username').textContent = "mysterious explorer";
    }
    
    startLoadingAnimation();
    
    // Ensure the button is clickable
    const enterBtnLink = document.querySelector('.enter-btn-link');
    enterBtnLink.addEventListener('click', function() {
        window.location.href = 'mainpage.html';
    });
});
