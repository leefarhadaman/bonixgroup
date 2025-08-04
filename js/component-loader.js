// Component Loader for Navbar and Footer
class ComponentLoader {
    constructor() {
        this.init();
    }

    async init() {
        await this.loadComponents();
        this.initializeInteractions();
        this.hideLoadingScreen();
    }

    async loadComponents() {
        // Load Navbar
        const navbarPlaceholder = document.getElementById('navbar-placeholder');
        if (navbarPlaceholder) {
            try {
                const response = await fetch('components/navbar.html');
                const html = await response.text();
                navbarPlaceholder.innerHTML = html;
            } catch (error) {
                console.error('Error loading navbar:', error);
                // Fallback navbar
                navbarPlaceholder.innerHTML = this.getFallbackNavbar();
            }
        }

        // Load Footer
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) {
            try {
                const response = await fetch('components/footer.html');
                const html = await response.text();
                footerPlaceholder.innerHTML = html;
            } catch (error) {
                console.error('Error loading footer:', error);
                // Fallback footer
                footerPlaceholder.innerHTML = this.getFallbackFooter();
            }
        }
    }

    initializeInteractions() {
        this.initMobileMenu();
        this.initScrollEffects();
        this.initSmoothScroll();
        this.initNewsletterForm();
        this.initActiveNavigation();
    }

    initMobileMenu() {
        const toggle = document.getElementById('mobile-toggle');
        const menu = document.getElementById('navbar-menu');
        
        if (toggle && menu) {
            toggle.addEventListener('click', () => {
                toggle.classList.toggle('active');
                menu.classList.toggle('active');
                document.body.classList.toggle('menu-open');
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!toggle.contains(e.target) && !menu.contains(e.target)) {
                    toggle.classList.remove('active');
                    menu.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            });

            // Close menu when clicking on links
            menu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    toggle.classList.remove('active');
                    menu.classList.remove('active');
                    document.body.classList.remove('menu-open');
                });
            });
        }
    }

    initScrollEffects() {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 100) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            });
        }
    }

    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    initActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.navbar-link');

        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.clientHeight;
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    initNewsletterForm() {
        const form = document.getElementById('newsletterForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = form.querySelector('.newsletter-input').value;
                if (email) {
                    // Add your newsletter subscription logic here
                    this.showNotification('Thank you for subscribing!', 'success');
                    form.reset();
                }
            });
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    loadingScreen.remove();
                }, 500);
            }, 1500);
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    getFallbackNavbar() {
        return `
            <nav class="navbar" id="navbar">
                <div class="navbar-container">
                    <div class="navbar-logo">
                        <span class="logo-text">Bonix</span>
                    </div>
                    <ul class="navbar-menu" id="navbar-menu">
                        <li class="navbar-item">
                            <a href="index.html#home" class="navbar-link active">Home</a>
                        </li>
                        <li class="navbar-item">
                            <a href="#services" class="navbar-link">Services</a>
                        </li>
                        <li class="navbar-item">
                            <a href="index.html#projects" class="navbar-link">Projects</a>
                        </li>
                        <li class="navbar-item">
                            <a href="about.html" class="navbar-link">About</a>
                        </li>
                        <li class="navbar-item">
                            <a href="index.html#contact" class="navbar-link">Contact</a>
                        </li>
                    </ul>
                    <div class="navbar-actions">
                        <a href="index.html#contactForm" class="btn-primary navbar-cta">Book Consultation</a>
                        <button class="mobile-menu-toggle" id="mobile-toggle">
                            <span class="hamburger-line"></span>
                            <span class="hamburger-line"></span>
                            <span class="hamburger-line"></span>
                        </button>
                    </div>
                </div>
            </nav>
        `;
    }

    getFallbackFooter() {
        return `
            <footer class="footer">
                <div class="footer-container">
                    <div class="footer-top">
                        <div class="footer-brand">
                            <div class="footer-logo">
                                <span class="logo-text">Bonix</span>
                            </div>
                            <p class="footer-description">
                                Building dreams with precision, quality, and innovation since 2010.
                            </p>
                        </div>
                    </div>
                    <div class="footer-bottom">
                        <p class="copyright">© 2025 Bonix Construction. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        `;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ComponentLoader();
});
