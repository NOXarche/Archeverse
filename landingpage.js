// Initialize sound control
let soundEnabled = true;

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

toggleSoundBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    
    if (soundEnabled) {
        toggleSoundIcon.className = 'fas fa-volume-up';
        ambientSound.play();
    } else {
        toggleSoundIcon.className = 'fas fa-volume-mute';
        ambientSound.pause();
        portalOpenSound.pause();
    }
});

// Button hover sound effect
const enterBtn = document.querySelector('.enter-btn');

enterBtn.addEventListener('mouseenter', () => {
    if (soundEnabled) {
        buttonHoverSound.currentTime = 0;
        buttonHoverSound.play();
    }
});

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
                startPortalAnimation();
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
                portalOpenSound.play();
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
                ambientSound.play();
            }
            createParticles();
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

// Create floating particles effect
function createParticles() {
    const particlesContainer = document.querySelector('.portal-particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = `${Math.random() * 5 + 2}px`;
        particle.style.height = particle.style.width;
        particle.style.backgroundColor = 'rgba(230, 196, 5, 0.6)';
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
}

// Enter button functionality
enterBtn.addEventListener('click', () => {
    // Navigate to main portfolio page
    window.location.href = 'portfolio.html';
});

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
});
