document.addEventListener('DOMContentLoaded', () => {
    // Preloader
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    });

    // Hamburger Menu and Overlay
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const overlay = document.createElement('div');
    overlay.classList.add('nav-overlay');
    document.body.appendChild(overlay);

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('open');
        overlay.classList.toggle('active');
    });

    overlay.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('open');
        overlay.classList.remove('active');
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('open');
            overlay.classList.remove('active');
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        });
    });

    // Dropdown Menu for Mobile
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        toggle.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            }
        });
    });

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Scroll Animations
    const elements = document.querySelectorAll('.welcome, .stats, .services-overview, .testimonials, .projects, .cta-banner, .contact, .appointment, .faq, .map, .gallery, .service-details, .benefits, .related-projects, .mission-vision, .history, .team, .project-filter, .project-timeline');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.querySelectorAll('.animate-text').forEach((el, index) => {
                    el.style.animationDelay = `${index * 0.2}s`;
                });
                entry.target.querySelectorAll('.animate-img').forEach((el, index) => {
                    el.style.animationDelay = `${(index + 1) * 0.3}s`;
                });
            }
        });
    }, { threshold: 0.2 });

    elements.forEach(element => {
        element.classList.add('animate');
        observer.observe(element);
    });

    // Hero Slider with Navigation Dots
    const slides = document.querySelectorAll('.slide');
    const sliderNav = document.querySelector('.slider-nav');
    if (slides.length > 0) {
        let currentSlide = 0;

        // Create navigation dots
        if (sliderNav && slides.length > 1) {
            slides.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.classList.add('slider-dot');
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    currentSlide = index;
                    showSlide(currentSlide);
                });
                sliderNav.appendChild(dot);
            });
        }

        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
            if (sliderNav) {
                document.querySelectorAll('.slider-dot').forEach((dot, i) => {
                    dot.classList.toggle('active', i === index);
                });
            }
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }

        if (slides.length > 1) {
            setInterval(nextSlide, 6000);
        }
        showSlide(currentSlide);
    }

    // Hero Parallax Effect
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            hero.querySelectorAll('.slide').forEach(slide => {
                slide.style.transform = `translate(${x * 20}px, ${y * 20}px) scale(1.05)`;
            });
        });

        hero.addEventListener('mouseleave', () => {
            hero.querySelectorAll('.slide').forEach(slide => {
                slide.style.transform = 'scale(1.05)';
            });
        });
    }

    // Testimonial Carousel
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const testimonials = document.querySelectorAll('.testimonial');
        let currentTestimonial = 0;

        function showTestimonial(index) {
            carousel.scrollTo({
                left: testimonials[index].offsetLeft - (carousel.offsetWidth - testimonials[index].offsetWidth) / 2,
                behavior: 'smooth'
            });
        }

        function nextTestimonial() {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(currentTestimonial);
        }

        setInterval(nextTestimonial, 8000);
        showTestimonial(currentTestimonial);
    }

    // Project Filter
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filter = button.getAttribute('data-filter');
                projectItems.forEach(item => {
                    if (filter === 'all' || item.classList.contains(filter)) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                });
            });
        });
    }

    // Gallery Lightbox
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length > 0) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const imgSrc = item.querySelector('img').src;
                const title = item.querySelector('h3').textContent;
                const description = item.querySelector('p').textContent;

                const lightbox = document.createElement('div');
                lightbox.classList.add('lightbox');
                lightbox.innerHTML = `
                    <div class="lightbox-content">
                        <span class="lightbox-close">×</span>
                        <img src="${imgSrc}" alt="${title}">
                        <h3>${title}</h3>
                        <p>${description}</p>
                    </div>
                `;
                document.body.appendChild(lightbox);

                const close = lightbox.querySelector('.lightbox-close');
                close.addEventListener('click', () => {
                    lightbox.remove();
                });

                lightbox.addEventListener('click', (e) => {
                    if (e.target === lightbox) {
                        lightbox.remove();
                    }
                });
            });
        });
    }

    // Contact and Appointment Forms
    const contactForm = document.getElementById('contact-form');
    const appointmentForm = document.getElementById('appointment-form');
    [contactForm, appointmentForm].forEach(form => {
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Form submitted! (This is a demo)');
                form.reset();
            });
        }
    });
});

// Add visible class for animations
document.styleSheets[0].insertRule(`
    .animate.visible {
        animation: fadeIn 1s ease forwards;
    }
`, document.styleSheets[0].cssRules.length);

// Lightbox Styles
document.styleSheets[0].insertRule(`
    .lightbox {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
    }
`, document.styleSheets[0].cssRules.length);

document.styleSheets[0].insertRule(`
    .lightbox-content {
        background: var(--bg-white);
        padding: 20px;
        border-radius: 10px;
        max-width: 80%;
        max-height: 80%;
        text-align: center;
        position: relative;
    }
`, document.styleSheets[0].cssRules.length);

document.styleSheets[0].insertRule(`
    .lightbox-content img {
        max-width: 100%;
        max-height: 400px;
        border-radius: 10px;
        margin-bottom: 20px;
    }
`, document.styleSheets[0].cssRules.length);

document.styleSheets[0].insertRule(`
    .lightbox-content h3 {
        font-size: 24px;
        color: var(--primary-color);
        margin-bottom: 10px;
    }
`, document.styleSheets[0].cssRules.length);

document.styleSheets[0].insertRule(`
    .lightbox-content p {
        font-size: 16px;
        color: var(--text-light);
    }
`, document.styleSheets[0].cssRules.length);

document.styleSheets[0].insertRule(`
    .lightbox-close {
        position: absolute;
        top: 10px;
        right: 20px;
        font-size: 30px;
        color: var(--text-dark);
        cursor: pointer;
        transition: color 0.3s ease;
    }
`, document.styleSheets[0].cssRules.length);

document.styleSheets[0].insertRule(`
    .lightbox-close:hover {
        color: var(--primary-color);
    }
`, document.styleSheets[0].cssRules.length);