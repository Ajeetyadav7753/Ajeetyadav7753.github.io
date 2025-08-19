document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS (Animate On Scroll) library
    // AOS will automatically detect elements with data-aos attributes and animate them.
    AOS.init({
        duration: 1000,     // Animation duration in milliseconds
        easing: 'ease-out-quad', // Easing function for animations
        once: true,         // Whether animation should happen only once - true for portfolio
        mirror: false,      // Whether elements should animate out while scrolling past them
        delay: 0            // Global delay for animations
    });

    // --- Navigation (from previous version, still good!) ---
    const navSlide = () => {
        const burger = document.querySelector('.burger');
        const nav = document.querySelector('.nav-links');
        const navLinks = document.querySelectorAll('.nav-links li');

        burger.addEventListener('click', () => {
            nav.classList.toggle('nav-active');

            navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });

            burger.classList.toggle('toggle');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (nav.classList.contains('nav-active')) {
                    nav.classList.remove('nav-active');
                    burger.classList.remove('toggle');
                    navLinks.forEach(item => item.style.animation = '');
                }
            });
        });
    };

    const smoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    // Calculate offset to account for fixed header
                    const headerOffset = document.querySelector('header').offsetHeight;
                    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = elementPosition - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }
            });
        });
    };

    // --- Dynamic Active Nav Link based on Scroll (using IntersectionObserver) ---
    const setActiveNavLinkOnScroll = () => {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-links a');

        const observerOptions = {
            root: null, // viewport
            rootMargin: '-30% 0px -30% 0px', // Adjust sensitivity for active link
            threshold: 0 // As soon as any part of the section enters
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const currentSectionId = entry.target.id;
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href').includes(currentSectionId)) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            observer.observe(section);
        });

        // Set initial active link on load (or if URL has a hash)
        const currentHash = window.location.hash;
        if (currentHash) {
            navLinks.forEach(link => {
                if (link.getAttribute('href') === currentHash) {
                    link.classList.add('active');
                }
            });
        } else {
            // Default to home if no hash
            document.querySelector('.nav-links a[href="#home"]').classList.add('active');
        }
    };

    // --- Manual Scroll Reveal for elements not handled by AOS, or for specific effects ---
    const manualScrollReveal = () => {
        const sectionTitles = document.querySelectorAll('.section-title');
        const contactIntro = document.querySelector('.contact-intro');

        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        sectionTitles.forEach(title => {
            observer.observe(title);
        });
        if (contactIntro) {
             observer.observe(contactIntro);
        }
    };


    // --- Initialize all functions ---
    navSlide();
    smoothScroll();
    setActiveNavLinkOnScroll();
    manualScrollReveal(); // For section titles and contact intro
});