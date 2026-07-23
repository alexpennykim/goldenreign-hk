/* ============================================
   金璽鐘錶 GOLDEN REIGN
   Interactive Features
   ============================================ */

(function () {
    'use strict';

    /* ===== Navbar Scroll Effect ===== */
    const navbar = document.getElementById('navbar');

    function handleNavScroll() {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });

    /* ===== Mobile Menu Toggle ===== */
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    navToggle.addEventListener('click', function () {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    navMenu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    /* ===== Smooth Scroll for Anchor Links ===== */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                var offset = navbar.offsetHeight;
                var targetPos = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({
                    top: targetPos,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ===== Scroll Reveal Animation (Intersection Observer) ===== */
    var revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(function (el) {
            revealObserver.observe(el);
        });
    } else {
        // Fallback: just show everything
        revealElements.forEach(function (el) {
            el.classList.add('active');
        });
    }

    /* ===== Animated Counter for Stats ===== */
    var statNumbers = document.querySelectorAll('.stat-num');
    var statsAnimated = false;

    function animateCounter(el, target) {
        var duration = 2000;
        var startTime = null;
        var suffix = el.getAttribute('data-suffix') || '';

        function easeOutExpo(t) {
            return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        }

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var eased = easeOutExpo(progress);
            var current = Math.floor(eased * target);

            // Format large numbers
            if (target >= 1000) {
                el.textContent = current.toLocaleString() + suffix;
            } else {
                el.textContent = current + suffix;
            }

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                if (target >= 1000) {
                    el.textContent = target.toLocaleString() + suffix;
                } else {
                    el.textContent = target + suffix;
                }
            }
        }

        requestAnimationFrame(step);
    }

    function checkStatsVisibility() {
        var statsSection = document.querySelector('.about-stats');
        if (!statsSection || statsAnimated) return;

        var rect = statsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            statsAnimated = true;
            statNumbers.forEach(function (el) {
                var target = parseInt(el.getAttribute('data-target'), 10);
                if (!isNaN(target)) {
                    animateCounter(el, target);
                }
            });
        }
    }

    window.addEventListener('scroll', checkStatsVisibility, { passive: true });
    checkStatsVisibility();

    /* ===== Contact Form Submission ===== */
    var contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Basic validation
            var name = document.getElementById('name').value.trim();
            var phone = document.getElementById('phone').value.trim();
            var email = document.getElementById('email').value.trim();
            var service = document.getElementById('service').value;
            var message = document.getElementById('message').value.trim();

            // Validate required fields
            if (!name || !phone) {
                showFormMessage('請填寫必填欄位（姓名及聯絡電話）', 'error');
                return;
            }

            // Validate phone format (basic)
            var phonePattern = /^[+]?[\d\s\-\(\)]{6,20}$/;
            if (!phonePattern.test(phone)) {
                showFormMessage('請輸入有效的聯絡電話號碼', 'error');
                return;
            }

            // Validate email if provided
            if (email) {
                var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(email)) {
                    showFormMessage('請輸入有效的電子郵箱地址', 'error');
                    return;
                }
            }

            // Simulate form submission
            var submitBtn = contactForm.querySelector('button[type="submit"]');
            var originalText = submitBtn.textContent;
            submitBtn.textContent = '提交中...';
            submitBtn.disabled = true;

            setTimeout(function () {
                // Show success message
                var successHTML =
                    '<div class="form-success">' +
                    '<h3>感謝您的咨詢</h3>' +
                    '<p>我們的專業顧問將在24小時內與您聯繫。<br>如需即時服務，請致電 +852 8402 7613</p>' +
                    '</div>';

                contactForm.innerHTML = successHTML;
            }, 1500);
        });
    }

    function showFormMessage(msg, type) {
        // Remove existing message
        var existing = contactForm.querySelector('.form-msg');
        if (existing) existing.remove();

        var msgEl = document.createElement('div');
        msgEl.className = 'form-msg';
        msgEl.style.cssText =
            'padding: 0.8rem 1rem; margin-bottom: 1rem; font-size: 0.8rem; border-radius: 4px; ' +
            (type === 'error'
                ? 'background: rgba(200, 50, 50, 0.1); border: 1px solid rgba(200, 50, 50, 0.3); color: #e07070;'
                : 'background: rgba(197, 165, 114, 0.1); border: 1px solid var(--color-gold); color: var(--color-gold);');
        msgEl.textContent = msg;

        var submitBtn = contactForm.querySelector('button[type="submit"]');
        contactForm.insertBefore(msgEl, submitBtn);

        // Auto-remove after 3 seconds
        setTimeout(function () {
            if (msgEl.parentNode) msgEl.remove();
        }, 3000);
    }

    /* ===== Floating Gold Particles ===== */
    var particlesContainer = document.getElementById('heroParticles');
    if (particlesContainer) {
        var particleCount = 18;
        for (var i = 0; i < particleCount; i++) {
            var particle = document.createElement('span');
            particle.className = 'hero-particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (8 + Math.random() * 12) + 's';
            particle.style.animationDelay = (Math.random() * 10) + 's';
            var size = 2 + Math.random() * 3;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particlesContainer.appendChild(particle);
        }
    }

    /* ===== Multi-layer Parallax Effect for Hero ===== */
    var heroContent = document.getElementById('heroContent');
    var heroBgLayer = document.getElementById('heroBgLayer');
    var heroSection = document.getElementById('hero');

    if (heroContent && heroSection) {
        window.addEventListener('scroll', function () {
            var scrolled = window.scrollY;
            var heroHeight = heroSection.offsetHeight;

            if (scrolled < heroHeight) {
                /* Content moves up and fades */
                heroContent.style.transform = 'translateY(' + (scrolled * 0.35) + 'px)';
                heroContent.style.opacity = Math.max(0, 1 - scrolled / (heroHeight * 0.65));

                /* Background moves slower (depth effect) */
                if (heroBgLayer) {
                    heroBgLayer.style.transform = 'scale(1.1) translateY(' + (scrolled * 0.15) + 'px)';
                }
            }
        }, { passive: true });
    }

    /* ===== Mouse Parallax for Hero Background ===== */
    if (heroBgLayer && heroSection) {
        heroSection.addEventListener('mousemove', function (e) {
            if (window.scrollY > heroSection.offsetHeight) return;
            var x = (e.clientX / window.innerWidth - 0.5) * 20;
            var y = (e.clientY / window.innerHeight - 0.5) * 20;
            var currentScroll = window.scrollY;
            heroBgLayer.style.transform = 'scale(1.1) translate(' + x + 'px, ' + (y + currentScroll * 0.15) + 'px)';
        });
    }

    /* ===== Brand Item Click - Smooth scroll to contact ===== */
    document.querySelectorAll('.brand-item').forEach(function (item) {
        item.addEventListener('click', function () {
            var contactSection = document.getElementById('contact');
            if (contactSection) {
                var offset = navbar.offsetHeight;
                var targetPos = contactSection.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({
                    top: targetPos,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ===== Active Nav Link on Scroll ===== */
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

    function updateActiveNav() {
        var scrollPos = window.scrollY + navbar.offsetHeight + 100;

        sections.forEach(function (section) {
            var top = section.offsetTop;
            var height = section.offsetHeight;
            var id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(function (link) {
                    link.classList.remove('active-nav');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active-nav');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    /* ===== Brand Carousel ===== */
    var carouselTrack = document.getElementById('carouselTrack');
    var carouselPrev = document.getElementById('carouselPrev');
    var carouselNext = document.getElementById('carouselNext');
    var carouselDots = document.getElementById('carouselDots');

    if (carouselTrack) {
        var slides = carouselTrack.querySelectorAll('.carousel-slide');
        var slideWidth = 0;
        var gap = 24; /* 1.5rem */

        function getSlideWidth() {
            if (slides.length > 0) {
                slideWidth = slides[0].offsetWidth + gap;
            }
        }

        /* Generate dots */
        if (carouselDots) {
            slides.forEach(function (_, i) {
                var dot = document.createElement('button');
                dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
                dot.setAttribute('aria-label', '第 ' + (i + 1) + ' 張');
                dot.addEventListener('click', function () {
                    carouselTrack.scrollTo({ left: i * slideWidth, behavior: 'smooth' });
                });
                carouselDots.appendChild(dot);
            });
        }

        var dotElements = carouselDots ? carouselDots.querySelectorAll('.carousel-dot') : [];

        function updateDots() {
            if (!carouselDots) return;
            var scrollLeft = carouselTrack.scrollLeft;
            var currentIndex = Math.round(scrollLeft / slideWidth);
            dotElements.forEach(function (dot, i) {
                dot.classList.toggle('active', i === currentIndex);
            });
        }

        /* Prev button */
        if (carouselPrev) {
            carouselPrev.addEventListener('click', function () {
                getSlideWidth();
                carouselTrack.scrollBy({ left: -slideWidth, behavior: 'smooth' });
            });
        }

        /* Next button */
        if (carouselNext) {
            carouselNext.addEventListener('click', function () {
                getSlideWidth();
                carouselTrack.scrollBy({ left: slideWidth, behavior: 'smooth' });
            });
        }

        /* Update dots on scroll */
        carouselTrack.addEventListener('scroll', updateDots, { passive: true });

        /* Recalculate on resize */
        window.addEventListener('resize', getSlideWidth);
        getSlideWidth();

        /* Auto-scroll every 5 seconds (pauses on hover) */
        var autoScroll = setInterval(function () {
            if (carouselTrack.matches(':hover')) return;
            getSlideWidth();
            var maxScroll = carouselTrack.scrollWidth - carouselTrack.clientWidth;
            if (carouselTrack.scrollLeft >= maxScroll - 10) {
                carouselTrack.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                carouselTrack.scrollBy({ left: slideWidth, behavior: 'smooth' });
            }
        }, 5000);
    }

    /* ===== Lazy load - trigger initial reveal for elements already in view ===== */
    window.addEventListener('load', function () {
        handleNavScroll();
        checkStatsVisibility();

        // Trigger reveal for elements in initial viewport
        revealElements.forEach(function (el) {
            var rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                el.classList.add('active');
            }
        });
    });

})();
