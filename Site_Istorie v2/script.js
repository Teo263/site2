// Menu Toggle Functionality
const menuToggle = document.getElementById('menu-toggle');
const closeMenu = document.getElementById('close-menu');
const sideMenu = document.getElementById('side-menu');

if (menuToggle && closeMenu && sideMenu) {
    menuToggle.addEventListener('click', () => {
        sideMenu.classList.toggle('open');
        document.body.classList.toggle('menu-open');
    });

    closeMenu.addEventListener('click', () => {
        sideMenu.classList.remove('open');
        document.body.classList.remove('menu-open');
    });
}

// Page Transitions
document.addEventListener('DOMContentLoaded', () => {
    const main = document.querySelector('main');
    if (main) {
        // Initial page load animation
        main.style.transform = 'translateX(100%)';
        main.style.opacity = '0';
        
        requestAnimationFrame(() => {
            main.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
            main.style.transform = 'translateX(0)';
            main.style.opacity = '1';
        });
    }

    // Internal Links Transition
    document.querySelectorAll('a').forEach(link => {
        if (link.hostname === window.location.hostname) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.href;
                
                // Slide out current page
                main.style.transform = 'translateX(-100%)';
                main.style.opacity = '0';

                setTimeout(() => {
                    window.location.href = target;
                }, 500);
            });
        }
    });
});

// Add this to prevent transition on back/forward navigation
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        const main = document.querySelector('main');
        main.style.transition = 'none';
        main.style.transform = 'translateX(0)';
        main.style.opacity = '1';
    }
});