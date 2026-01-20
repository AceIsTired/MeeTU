// script.js - Updated for smooth theme transitions

// Add CSS for theme transitioning
const transitionStyle = document.createElement('style');
transitionStyle.textContent = `
    body.theme-changing *,
    body.theme-changing *::before,
    body.theme-changing *::after {
        transition: all 0.5s ease !important;
    }
    
    /* Pause animations during theme change for smoother transition */
    body.theme-changing .animate-float,
    body.theme-changing .animate-float-slow,
    body.theme-changing .animate-float-slower,
    body.theme-changing .animate-pulse-gentle,
    body.theme-changing .animate-spin-slow,
    body.theme-changing .animate-bounce-gentle,
    body.theme-changing .animate-heartbeat {
        animation-play-state: paused;
    }
`;
document.head.appendChild(transitionStyle);

// Theme switching with smooth transitions for all elements
function setTheme(theme) {
    // Add a class to body to indicate theme transition
    document.body.classList.add('theme-changing');
    
    // Temporarily disable pointer events during transition
    document.body.style.pointerEvents = 'none';
    
    // Store current theme for comparison
    const currentTheme = localStorage.getItem('theme') || 'default';
    
    // Only proceed if theme is actually changing
    if (currentTheme !== theme) {
        // Add slight delay to ensure CSS transitions are ready
        setTimeout(() => {
            // Remove all theme classes
            document.body.classList.remove('theme-pink', 'theme-light-green', 'theme-light-pink');
            
            // Add new theme class if not default
            if (theme !== 'default') {
                document.body.classList.add('theme-' + theme);
            }
            
            // Save theme preference
            localStorage.setItem('theme', theme);
            
            // Update meta theme-color for mobile browsers
            updateThemeColor(theme);
            
            // Remove transition class and restore pointer events after transition completes
            setTimeout(() => {
                document.body.classList.remove('theme-changing');
                document.body.style.pointerEvents = 'auto';
                
                // Resume animations
                document.querySelectorAll('[class*="animate-"]').forEach(el => {
                    const animation = getComputedStyle(el).animationName;
                    if (animation && animation !== 'none') {
                        el.style.animationPlayState = 'running';
                    }
                });
            }, 500);
        }, 10);
    } else {
        // Theme not changing, remove classes immediately
        document.body.classList.remove('theme-changing');
        document.body.style.pointerEvents = 'auto';
    }
}

// Update theme color for mobile browsers
function updateThemeColor(theme) {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    let color;
    
    switch(theme) {
        case 'default':
            color = '#082e09';
            break;
        case 'pink':
            color = '#350910';
            break;
        case 'light-green':
            color = '#f4e8de';
            break;
        default:
            color = '#082e09';
    }
    
    if (metaThemeColor) {
        metaThemeColor.setAttribute('content', color);
    } else {
        const meta = document.createElement('meta');
        meta.name = 'theme-color';
        meta.content = color;
        document.head.appendChild(meta);
    }
}

// Load saved theme - remove light-pink option
const savedTheme = localStorage.getItem('theme');
if (savedTheme && savedTheme !== 'light-pink') {
    // Apply theme without transition on initial load
    document.body.classList.remove('theme-pink', 'theme-light-green', 'theme-light-pink');
    if (savedTheme !== 'default') {
        document.body.classList.add('theme-' + savedTheme);
    }
    updateThemeColor(savedTheme);
} else {
    localStorage.setItem('theme', 'default');
    updateThemeColor('default');
}

// Nav heart hover effects
document.querySelectorAll('.navigation-link').forEach(link => {
    link.addEventListener('mouseenter', function() {
        const heart = this.querySelector('.nav-heart');
        if (heart) {
            heart.style.transform = 'translate(-50%, -50%) scale(1)';
            heart.style.opacity = '1';
        }
    });
    
    link.addEventListener('mouseleave', function() {
        const heart = this.querySelector('.nav-heart');
        if (heart) {
            heart.style.transform = 'translate(-50%, -50%) scale(0)';
            heart.style.opacity = '0';
        }
    });
});

// Simple page transition
document.querySelectorAll('a[href]').forEach(link => {
    if (link.href && !link.href.startsWith('#') && link.target !== '_blank') {
        link.addEventListener('click', (e) => {
            if (link.href !== window.location.href) {
                e.preventDefault();
                document.body.style.opacity = '0';
                document.body.style.transition = 'opacity 0.3s ease';
                setTimeout(() => {
                    window.location.href = link.href;
                }, 300);
            }
        });
    }
});

// Fade in on load
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // Initialize any interactive elements
    initParallax();
    
    // Add random animation delays to background elements for more organic feel
    addRandomAnimationDelays();
});

// Parallax effect for background shapes
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const shapes = document.querySelectorAll('.organic-shape, .floating-heart, .background-circle');
        shapes.forEach((shape, index) => {
            const speed = 0.1 + (index * 0.05);
            const yPos = -(scrolled * speed);
            shape.style.transform = `translateY(${yPos}px) rotate(${shape.style.transform ? parseFloat(shape.style.transform.split('rotate(')[1]) || 0 : 0}deg)`;
        });
    });
}

// Add random animation delays for more organic movement
function addRandomAnimationDelays() {
    const animatedElements = document.querySelectorAll('[class*="animate-"]');
    animatedElements.forEach(el => {
        const randomDelay = Math.random() * 5; // Random delay up to 5 seconds
        el.style.setProperty('--animation-delay', `${randomDelay}s`);
    });
}

// Handle dropdown menu for mobile
document.addEventListener('DOMContentLoaded', () => {
    const dropdowns = document.querySelectorAll('.nav-dropdown');
    
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('.navigation-link');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (window.innerWidth < 768) {
            // Mobile: toggle on click
            link.addEventListener('click', (e) => {
                if (menu.style.display === 'block') {
                    menu.style.display = 'none';
                } else {
                    menu.style.display = 'block';
                    menu.style.opacity = '1';
                    menu.style.visibility = 'visible';
                    menu.style.transform = 'translateY(0)';
                }
                e.preventDefault();
            });
        }
    });
});

// Add keyboard navigation for theme toggles
document.addEventListener('keydown', (e) => {
    if (e.altKey) {
        switch(e.key) {
            case '1':
                setTheme('default');
                break;
            case '2':
                setTheme('pink');
                break;
            case '3':
                setTheme('light-green');
                break;
        }
    }
});

// Theme toggle tooltips
document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        const title = this.getAttribute('title');
        // You could add a custom tooltip here if desired
    });
});

// Prevent theme change during page transitions
let isPageTransitioning = false;

// Enhanced page transition
document.querySelectorAll('a[href]').forEach(link => {
    if (link.href && !link.href.startsWith('#') && link.target !== '_blank') {
        link.addEventListener('click', (e) => {
            if (link.href !== window.location.href && !isPageTransitioning) {
                e.preventDefault();
                isPageTransitioning = true;
                
                // Add page transition class
                document.body.classList.add('page-transition');
                
                // Fade out
                document.body.style.opacity = '0';
                document.body.style.transition = 'opacity 0.3s ease';
                
                setTimeout(() => {
                    window.location.href = link.href;
                }, 300);
            }
        });
    }
});