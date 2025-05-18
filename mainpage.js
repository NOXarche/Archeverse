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

// Theme Toggling
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
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
        updateBackground(newTheme);
    });
    
    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.className = 'fas fa-sun';
        } else {
            themeIcon.className = 'fas fa-moon';
        }
    }
    
    function updateBackground(theme) {
        const activeSection = getCurrentSection();
        if (theme === 'dark') {
            document.body.style.background = activeSection === 'projects' ? 
                'radial-gradient(#1E1E1E, #121212)' : 
                'linear-gradient(135deg, rgba(0, 168, 150, 0.05), rgba(160, 32, 240, 0.05))';
        } else {
            document.body.style.background = activeSection === 'projects' ? 
                '#F8F9FA' : 
                'linear-gradient(135deg, rgba(0, 119, 182, 0.05), rgba(255, 107, 53, 0.05))';
        }
    }
    
    function getCurrentSection() {
        // Simple logic to determine active section based on scroll position
        const scrollPosition = window.scrollY;
        const projectsSection = document.getElementById('projects');
        const projectsPosition = projectsSection.offsetTop;
        
        return scrollPosition >= projectsPosition ? 'projects' : 'hero';
    }
    
    // Initialize background
    updateBackground(savedTheme);
    
    // Update visitor counter (simulated)
    const counterElement = document.getElementById('counter');
    let count = parseInt(localStorage.getItem('visitorCount') || '1247');
    
    // Increment count for this visit
    count++;
    localStorage.setItem('visitorCount', count.toString());
    counterElement.textContent = count;
    
    // Resume upload handling
    const resumeUpload = document.getElementById('resume-upload');
    resumeUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Here you would normally upload to Firebase
            // For demo purposes, just show an alert
            alert(`Resume "${file.name}" selected. In production, this would be uploaded to Firebase.`);
        }
    });
    
    // Scroll animations
    const animateOnScroll = function() {
        const nodes = document.querySelectorAll('.node');
        const projectCards = document.querySelectorAll('.project-card');
        
        nodes.forEach(node => {
            if (isElementInViewport(node) && !node.classList.contains('animated')) {
                node.classList.add('animated');
                node.style.animation = 'fadeInRight 0.5s ease forwards';
            }
        });
        
        projectCards.forEach(card => {
            if (isElementInViewport(card) && !card.classList.contains('animated')) {
                card.classList.add('animated');
                card.style.animation = 'fadeInUp 0.5s ease forwards';
            }
        });
    };
    
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // Add scroll animations
    window.addEventListener('scroll', animateOnScroll);
    // Initial check for elements in viewport
    animateOnScroll();
});

// Add these CSS animations to your stylesheet
document.head.insertAdjacentHTML('beforeend', `
<style>
@keyframes fadeInRight {
    from {
        opacity: 0;
        transform: translateX(-20px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
`);
