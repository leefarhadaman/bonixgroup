// Main Application Controller
class BonixApp {
    constructor() {
        this.init();
    }

    init() {
        this.initContactForm();
        this.initVideoModal();
        this.initImageGallery();
        this.initTooltips();
        this.initBackToTop();
        this.initThemeToggle();
        this.initScrollSpy();
        this.initLazyLoading();
        this.addAdditionalCSS();
    }

    initContactForm() {
        const form = document.getElementById('contactForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const submitBtn = form.querySelector('.form-submit');
                const originalText = submitBtn.innerHTML;
                
                // Show loading state
                submitBtn.innerHTML = '<i class="loading-spinner"></i> Sending...';
                submitBtn.disabled = true;

                try {
                    const formData = new FormData(form);
                    const data = Object.fromEntries(formData);
                    
                    // Validate all fields before submission
                    const isFormValid = this.validateForm(form);
                    if (!isFormValid) {
                        throw new Error('Please fill in all required fields correctly.');
                    }
                    
                    // Simulate API call
                    await this.simulateAPICall(data);
                    
                    this.showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
                    form.reset();
                    
                } catch (error) {
                    this.showNotification(error.message || 'Sorry, there was an error sending your message. Please try again.', 'error');
                } finally {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            });

            // Real-time form validation
            const inputs = form.querySelectorAll('.form-input, .form-select, .form-textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldError(input));
            });
        }
    }

    async simulateAPICall(data) {
        // Simulate network delay and potential errors
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate random success/failure for demo
                if (Math.random() > 0.1) { // 90% success rate
                    resolve(data);
                } else {
                    reject(new Error('Network error occurred'));
                }
            }, 2000);
        });
    }

    validateForm(form) {
        const inputs = form.querySelectorAll('.form-input[required], .form-select[required], .form-textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove existing error
        this.clearFieldError(field);

        // Check if required field is empty
        if (field.required && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        } else if (value) {
            // Type-specific validation
            switch (field.type) {
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        isValid = false;
                        errorMessage = 'Please enter a valid email address';
                    }
                    break;
                case 'tel':
                    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                    if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                        isValid = false;
                        errorMessage = 'Please enter a valid phone number';
                    }
                    break;
                case 'text':
                    if (field.name === 'name' && value.length < 2) {
                        isValid = false;
                        errorMessage = 'Name must be at least 2 characters long';
                    }
                    break;
            }

            // Textarea specific validation
            if (field.tagName.toLowerCase() === 'textarea' && value.length < 10) {
                isValid = false;
                errorMessage = 'Message must be at least 10 characters long';
            }
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'field-error';
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    initVideoModal() {
        const playButton = document.getElementById('playVideo');
        if (playButton) {
            playButton.addEventListener('click', () => {
                this.openVideoModal();
            });
        }
    }

    openVideoModal() {
        const modal = document.createElement('div');
        modal.className = 'video-modal';
        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-content">
                <button class="modal-close">
                    <i class="fas fa-times"></i>
                </button>
                <div class="video-container">
                    <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0" 
                            frameborder="0" allowfullscreen></iframe>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        // Close modal events
        const closeModal = () => {
            modal.remove();
            document.body.style.overflow = '';
        };

        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);
        
        // Close on escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }

    initImageGallery() {
        const projectImages = document.querySelectorAll('.project-image img');
        projectImages.forEach(img => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => {
                this.openImageModal(img.src, img.alt);
            });
        });
    }

    openImageModal(src, alt) {
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-content">
                <button class="modal-close">
                    <i class="fas fa-times"></i>
                </button>
                <div class="image-container">
                    <img src="${src}" alt="${alt}" class="modal-image">
                </div>
                <div class="modal-caption">${alt}</div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        // Close modal events
        const closeModal = () => {
            modal.remove();
            document.body.style.overflow = '';
        };

        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);
        
        // Close on escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }

    initTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.showTooltip(e.target, e.target.getAttribute('data-tooltip'));
            });
            
            element.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
        });
    }

    showTooltip(element, text) {
        this.hideTooltip(); // Remove any existing tooltip
        
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        let top = rect.top - tooltipRect.height - 10;
        
        // Adjust position if tooltip goes off screen
        if (left < 10) left = 10;
        if (left + tooltipRect.width > window.innerWidth - 10) {
            left = window.innerWidth - tooltipRect.width - 10;
        }
        if (top < 10) top = rect.bottom + 10;
        
        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
        
        setTimeout(() => tooltip.classList.add('visible'), 10);
    }

    hideTooltip() {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }

    initBackToTop() {
        const backToTop = document.createElement('button');
        backToTop.className = 'back-to-top';
        backToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
        backToTop.setAttribute('aria-label', 'Back to top');
        backToTop.setAttribute('data-tooltip', 'Back to top');
        document.body.appendChild(backToTop);
        
        const toggleVisibility = this.throttle(() => {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }, 100);
        
        window.addEventListener('scroll', toggleVisibility);
        
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    initThemeToggle() {
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.setAttribute('aria-label', 'Toggle theme');
        themeToggle.setAttribute('data-tooltip', 'Toggle dark mode');
        
        // Add to navbar if it exists
        const navbarActions = document.querySelector('.navbar-actions');
        if (navbarActions) {
            navbarActions.insertBefore(themeToggle, navbarActions.firstChild);
        }
        
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            themeToggle.querySelector('i').className = 'fas fa-sun';
        }
        
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const icon = themeToggle.querySelector('i');
            const isDark = document.body.classList.contains('dark-theme');
            
            icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            
            this.showNotification(`${isDark ? 'Dark' : 'Light'} theme activated`, 'info');
        });
    }

    initScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.navbar-link[href^="#"]');
        
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '-80px 0px -80px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    
                    // Update active nav link
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);
        
        sections.forEach(section => {
            observer.observe(section);
        });
    }

    initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            imageObserver.observe(img);
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Auto remove after 5 seconds
        const autoRemove = setTimeout(() => {
            this.removeNotification(notification);
        }, 5000);
        
        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            clearTimeout(autoRemove);
            this.removeNotification(notification);
        });
    }

    removeNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }

    getNotificationIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        return icons[type] || icons.info;
    }

    // Utility function to debounce function calls
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Utility function to throttle function calls
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Add additional CSS dynamically
    addAdditionalCSS() {
        const additionalCSS = `
/* Notification Styles */
.notification {
    position: fixed;
    top: 2rem;
    right: 2rem;
    background: var(--bg-primary);
    border-left: 4px solid var(--primary-color);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-xl);
    padding: 1rem 1.5rem;
    min-width: 300px;
    max-width: 500px;
    z-index: var(--z-tooltip);
    transform: translateX(100%);
    opacity: 0;
    transition: all var(--transition-normal);
}

.notification.show {
    transform: translateX(0);
    opacity: 1;
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.notification-success {
    border-left-color: #10b981;
}

.notification-success .notification-content i {
    color: #10b981;
}

.notification-error {
    border-left-color: #ef4444;
}

.notification-error .notification-content i {
    color: #ef4444;
}

.notification-warning {
    border-left-color: #f59e0b;
}

.notification-warning .notification-content i {
    color: #f59e0b;
}

.notification-info {
    border-left-color: var(--primary-color);
}

.notification-info .notification-content i {
    color: var(--primary-color);
}

.notification-close {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: 0.25rem;
    border-radius: var(--radius-sm);
    transition: all var(--transition-fast);
    margin-left: auto;
}

.notification-close:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
}

/* Modal Styles */
.video-modal,
.image-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: var(--z-modal);
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    cursor: pointer;
}

.modal-content {
    position: relative;
    background: var(--bg-primary);
    border-radius: var(--radius-xl);
    overflow: hidden;
    max-width: 90vw;
    max-height: 90vh;
    box-shadow: var(--shadow-xl);
    animation: modalAppear 0.3s ease-out;
}

@keyframes modalAppear {
    from {
        opacity: 0;
        transform: scale(0.9);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

.modal-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(0, 0, 0, 0.7);
    border: none;
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    transition: all var(--transition-normal);
}

.modal-close:hover {
    background: var(--primary-color);
    transform: scale(1.1);
}

.video-container {
    position: relative;
    width: 80vw;
    height: 45vw;
    max-width: 1200px;
    max-height: 675px;
}

.video-container iframe {
    width: 100%;
    height: 100%;
    border: none;
}

.image-container {
    display: flex;
    align-items: center;
    justify-content: center;
    max-height: 80vh;
}

.modal-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}

.modal-caption {
    padding: 1rem;
    text-align: center;
    color: var(--text-secondary);
    background: var(--bg-secondary);
}

/* Tooltip Styles */
.tooltip {
    position: absolute;
    background: var(--bg-dark);
    color: white;
    padding: 0.5rem 0.75rem;
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    white-space: nowrap;
    z-index: var(--z-tooltip);
    opacity: 0;
    transform: translateX(-50%) translateY(5px);
    transition: all var(--transition-fast);
    pointer-events: none;
}

.tooltip::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: var(--bg-dark);
}

.tooltip.visible {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
}

/* Back to Top Button */
.back-to-top {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 50px;
    height: 50px;
    background: var(--primary-color);
    border: none;
    border-radius: 50%;
    color: white;
    cursor: pointer;
    box-shadow: var(--shadow-lg);
    opacity: 0;
    visibility: hidden;
    transform: translateY(20px);
    transition: all var(--transition-normal);
    z-index: var(--z-fixed);
}

.back-to-top.visible {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

.back-to-top:hover {
    background: var(--primary-dark);
    transform: translateY(-2px);
    box-shadow: var(--shadow-xl);
}

.back-to-top i {
    font-size: 1.25rem;
}

/* Theme Toggle Button */
.theme-toggle {
    background: transparent;
    border: 2px solid var(--border-light);
    color: var(--text-secondary);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--transition-normal);
    margin-right: 1rem;
}

.theme-toggle:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
    transform: scale(1.1);
}

/* Form Error Styles */
.form-input.error,
.form-select.error,
.form-textarea.error {
    border-color: #ef4444;
    background: rgba(239, 68, 68, 0.05);
}

.field-error {
    display: block;
    color: #ef4444;
    font-size: 0.875rem;
    margin-top: 0.25rem;
    font-weight: 500;
}

/* Loading Spinner */
.loading-spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* Dark Theme Styles */
.dark-theme {
    --bg-primary: #1a202c;
    --bg-secondary: #2d3748;
    --bg-dark: #0f1419;
    --text-primary: #f7fafc;
    --text-secondary: #e2e8f0;
    --text-muted: #a0aec0;
    --text-light: #cbd5e0;
    --border-color: #4a5568;
    --border-light: #2d3748;
}

.dark-theme .navbar {
    background: rgba(26, 32, 44, 0.95);
    border-bottom-color: var(--border-color);
}

.dark-theme .service-card,
.dark-theme .project-card,
.dark-theme .contact-form-container {
    background: var(--bg-secondary);
    border-color: var(--border-color);
}

.dark-theme .footer {
    background: var(--bg-dark);
}

.dark-theme .tooltip {
    background: var(--bg-primary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
}

.dark-theme .tooltip::after {
    border-top-color: var(--bg-primary);
}

/* Lazy Loading Images */
img.lazy {
    opacity: 0;
    transition: opacity var(--transition-normal);
}

img.lazy.loaded {
    opacity: 1;
}

/* Responsive Modal Styles */
@media (max-width: 768px) {
    .notification {
        top: 1rem;
        right: 1rem;
        left: 1rem;
        min-width: auto;
        max-width: none;
        transform: translateY(-100%);
    }
    
    .notification.show {
        transform: translateY(0);
    }
    
    .video-container {
        width: 90vw;
        height: 50.6vw;
    }
    
    .modal-content {
        max-width: 95vw;
        max-height: 95vh;
    }
    
    .back-to-top {
        bottom: 1rem;
        right: 1rem;
        width: 45px;
        height: 45px;
    }
}

@media (max-width: 480px) {
    .theme-toggle {
        width: 35px;
        height: 35px;
        margin-right: 0.5rem;
    }
    
    .notification {
        padding: 0.75rem 1rem;
        font-size: 0.875rem;
    }
    
    .tooltip {
        font-size: 0.8rem;
        padding: 0.4rem 0.6rem;
    }
}
`;

        const style = document.createElement('style');
        style.textContent = additionalCSS;
        document.head.appendChild(style);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BonixApp();
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BonixApp;
}
