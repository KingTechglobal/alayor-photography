// main.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Navigation Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const nav = document.querySelector('.nav');

    if (mobileToggle && nav) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            nav.classList.toggle('active');
        });

        // Close mobile menu when a link is clicked
        document.querySelectorAll('.nav a, .header-cta').forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                nav.classList.remove('active');
            });
        });
    }

    // 2. Header Scroll Effect
    const header = document.querySelector('.header');
    const handleScrollHeader = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScrollHeader);
    handleScrollHeader(); // Trigger on load

    // 3. Active Nav Link on Scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav a');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollPosition >= sectionTop && scrollPosition < (sectionTop + sectionHeight)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // 4. Portfolio Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    if (filterBtns.length > 0 && portfolioItems.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                portfolioItems.forEach(item => {
                    if (filterValue === 'all' || item.classList.contains(filterValue)) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // 5. Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const revealPoint = 100;

        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < windowHeight - revealPoint) {
                element.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger once on load

    // 6. Testimonial Carousel
    const cards = document.querySelectorAll('.testimonial-card-new');
    const dotsContainer = document.getElementById('carouselDots');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (cards.length > 0 && dotsContainer) {
        let currentIndex = 0;
        let autoPlayTimer;

        // Clean dots container if anything exists
        dotsContainer.innerHTML = '';

        // Generate dots
        cards.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Go to review ${i + 1}`);
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        function goToSlide(index, direction = 'next') {
            const prev = cards[currentIndex];
            
            // Exit current card
            prev.classList.remove('active');
            prev.style.position = 'absolute';
            prev.style.opacity = '0';
            prev.style.transform = direction === 'next' ? 'translateX(-80px)' : 'translateX(80px)';

            currentIndex = (index + cards.length) % cards.length;

            // Enter new card
            const current = cards[currentIndex];
            current.style.position = 'absolute';
            current.style.opacity = '0';
            current.style.transform = direction === 'next' ? 'translateX(80px)' : 'translateX(-80px)';
            current.classList.add('active');

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    current.style.position = 'relative';
                    current.style.opacity = '1';
                    current.style.transform = 'translateX(0)';
                });
            });

            // Reset transitions styles
            setTimeout(() => {
                prev.style.transform = '';
                prev.style.position = 'absolute';
            }, 600);

            // Update active dots
            document.querySelectorAll('.dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }

        function nextSlide() {
            goToSlide(currentIndex + 1, 'next');
        }

        function prevSlide() {
            goToSlide(currentIndex - 1, 'prev');
        }

        function startAutoPlay() {
            clearInterval(autoPlayTimer);
            autoPlayTimer = setInterval(nextSlide, 7000);
        }

        if (nextBtn && prevBtn) {
            nextBtn.addEventListener('click', () => { nextSlide(); startAutoPlay(); });
            prevBtn.addEventListener('click', () => { prevSlide(); startAutoPlay(); });
        }

        // Keyboard Navigation for Reviews
        document.addEventListener('keydown', (e) => {
            const testimonialsSection = document.getElementById('testimonials');
            if (testimonialsSection) {
                const rect = testimonialsSection.getBoundingClientRect();
                const inView = rect.top < window.innerHeight && rect.bottom >= 0;
                if (inView) {
                    if (e.key === 'ArrowRight') { nextSlide(); startAutoPlay(); }
                    if (e.key === 'ArrowLeft') { prevSlide(); startAutoPlay(); }
                }
            }
        });

        // Touch Swipe Gestures
        let touchStartX = 0;
        const carousel = document.getElementById('testimonialCarousel');
        if (carousel) {
            carousel.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
            carousel.addEventListener('touchend', (e) => {
                const diff = touchStartX - e.changedTouches[0].clientX;
                if (Math.abs(diff) > 50) {
                    diff > 0 ? nextSlide() : prevSlide();
                    startAutoPlay();
                }
            });
        }

        startAutoPlay();
    }

    // 7. Interactive Booking Integration
    const bookButtons = document.querySelectorAll('.btn-book');
    const interestDropdown = document.getElementById('interest');
    const nameInput = document.getElementById('name');

    if (bookButtons.length > 0 && interestDropdown) {
        bookButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Read package
                const packageVal = btn.getAttribute('data-package');
                if (packageVal) {
                    interestDropdown.value = packageVal;
                }
                
                // Focus on name field
                if (nameInput) {
                    setTimeout(() => {
                        nameInput.focus();
                    }, 800); // Wait for scroll animation
                }
            });
        });
    }

    // 8. Interactive Hero lens showcase slideshow
    const heroImg = document.getElementById('hero-gallery-img');
    const galleryImages = [
        "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Studio/Camera
        "https://images.unsplash.com/photo-1518104593124-ac2e82a5eb9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Birthday
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Maternity
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"  // Prewedding
    ];

    if (heroImg) {
        let currentImgIndex = 0;
        setInterval(() => {
            heroImg.style.opacity = '0';
            setTimeout(() => {
                currentImgIndex = (currentImgIndex + 1) % galleryImages.length;
                heroImg.src = galleryImages[currentImgIndex];
                heroImg.style.opacity = '1';
            }, 500); // match transition
        }, 5000);
    }

    // 9. Interactive 3D tilt hover effect on glass pricing cards
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    if (pricingCards.length > 0 && window.innerWidth > 992) {
        pricingCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left; // x coordinate within card
                const y = e.clientY - rect.top;  // y coordinate within card
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Maximum tilt degrees
                const maxTilt = 8;
                
                const tiltX = ((centerY - y) / centerY) * maxTilt;
                const tiltY = ((x - centerX) / centerX) * maxTilt;
                
                card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-5px)`;
                card.style.boxShadow = `${-tiltY * 1.5}px ${tiltX * 1.5}px 30px rgba(230, 36, 41, 0.15)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.boxShadow = '';
            });
        });
    }

    // 10. Contact Form Submission Handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameVal = document.getElementById('name').value;
            const emailVal = document.getElementById('email').value;
            const interestVal = document.getElementById('interest').value;
            const messageVal = document.getElementById('message').value;

            // Visual feedback
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = "Booking Success! \ud83c\udf89";
            submitBtn.style.background = "linear-gradient(135deg, #10b981, #059669)";
            submitBtn.style.pointerEvents = "none";

            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = "";
                submitBtn.style.pointerEvents = "auto";
                contactForm.reset();
            }, 4000);
        });
    }
});
