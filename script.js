document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-links a, .btn, .logo a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Check if it's an internal link (starts with #)
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - document.querySelector('.main-header').offsetHeight, // Offset by header height
                        behavior: 'smooth'
                    });
                }

                // Close mobile menu if open
                const nav = document.querySelector('.main-nav');
                const hamburger = document.querySelector('.hamburger');
                if (nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    hamburger.classList.remove('active');
                    document.body.style.overflow = ''; // Re-enable scrolling
                }
            }
        });
    });

    // Mobile Navigation (Hamburger menu)
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.main-nav');

    hamburger.addEventListener('click', () => {
        nav.classList.toggle('active');
        hamburger.classList.toggle('active');
        // Prevent scrolling when mobile menu is open
        if (nav.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Add 'active' class to nav link on scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    const headerHeight = document.querySelector('.main-header').offsetHeight;

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight; // Adjusted for fixed header
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // Form submission handling (for Formspree)
    const form = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission

        const formData = new FormData(form);

        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                formStatus.textContent = 'Thank you for your message! We will get back to you soon.';
                formStatus.className = 'form-status success';
                form.reset(); // Clear the form
            } else {
                const data = await response.json();
                if (Object.hasOwnProperty.call(data, 'errors')) {
                    formStatus.textContent = data["errors"].map(error => error["message"]).join(", ");
                } else {
                    formStatus.textContent = 'Oops! There was a problem submitting your form. Please try again or contact us directly.';
                }
                formStatus.className = 'form-status error';
            }
        } catch (error) {
            console.error('Error:', error);
            formStatus.textContent = 'Oops! Something went wrong. Please check your internet connection and try again.';
            formStatus.className = 'form-status error';
        }
    });
});