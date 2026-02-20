/* ============================================================
   Hair Scan AI — Global Script
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

    /* ----------------------------------------------------------
       Mobile nav toggle
    ---------------------------------------------------------- */
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu   = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            navMenu.classList.toggle('open');
            const isOpen = navMenu.classList.contains('open');
            navToggle.setAttribute('aria-expanded', isOpen);
        });

        // Close on link click
        navMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navMenu.classList.remove('open');
            });
        });

        // Close on outside click
        document.addEventListener('click', function (e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('open');
            }
        });
    }

    /* ----------------------------------------------------------
       FAQ — tab switching
    ---------------------------------------------------------- */
    const faqTabBtns   = document.querySelectorAll('.faq-tab-btn');
    const faqCategories = document.querySelectorAll('.faq-category');

    faqTabBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const cat = this.getAttribute('data-category');

            faqTabBtns.forEach(function (b) { b.classList.remove('active'); });
            faqCategories.forEach(function (c) { c.classList.remove('active'); });

            this.classList.add('active');
            const target = document.querySelector('.faq-category[data-category="' + cat + '"]');
            if (target) target.classList.add('active');
        });
    });

    /* ----------------------------------------------------------
       FAQ — accordion toggle
    ---------------------------------------------------------- */
    document.querySelectorAll('.faq-question').forEach(function (btn) {
        btn.addEventListener('click', function () {
            const item   = this.closest('.faq-item');
            const answer = item.querySelector('.faq-answer');
            const isOpen = item.classList.contains('open');

            // Collapse all
            document.querySelectorAll('.faq-item.open').forEach(function (openItem) {
                openItem.classList.remove('open');
                openItem.querySelector('.faq-answer').classList.remove('open');
            });

            // Toggle clicked
            if (!isOpen) {
                item.classList.add('open');
                answer.classList.add('open');
            }
        });
    });

    /* ----------------------------------------------------------
       Animate score bars on first view
    ---------------------------------------------------------- */
    function animateBars () {
        document.querySelectorAll('.bar-fill[data-width]').forEach(function (bar) {
            bar.style.width = bar.getAttribute('data-width');
        });
    }

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateBars();
                    observer.disconnect();
                }
            });
        }, { threshold: 0.3 });

        const mockCard = document.querySelector('.mock-result-card');
        if (mockCard) observer.observe(mockCard);
    } else {
        animateBars();
    }

    /* ----------------------------------------------------------
       Contact form — validation + GDPR
    ---------------------------------------------------------- */
    const contactForm = document.getElementById('contactForm');

    // Check success query param
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
        showFormMsg('✅ Your message has been sent. We\'ll get back to you within 30 days.', 'success');
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            const name    = (document.getElementById('name')    || {}).value || '';
            const email   = (document.getElementById('email')   || {}).value || '';
            const message = (document.getElementById('message') || {}).value || '';
            const consent = document.getElementById('privacy-consent');

            if (!name.trim() || !email.trim() || !message.trim()) {
                e.preventDefault();
                showFormMsg('⚠️ Please fill in all required fields.', 'error');
                return;
            }

            if (name.trim().length < 2) {
                e.preventDefault();
                showFormMsg('⚠️ Name must be at least 2 characters.', 'error');
                return;
            }

            if (message.trim().length < 10) {
                e.preventDefault();
                showFormMsg('⚠️ Message must be at least 10 characters.', 'error');
                return;
            }

            const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRe.test(email.trim())) {
                e.preventDefault();
                showFormMsg('⚠️ Please enter a valid email address.', 'error');
                return;
            }

            if (consent && !consent.checked) {
                e.preventDefault();
                showFormMsg('⚠️ You must agree to the Privacy Policy to send this message.', 'error');
                return;
            }

            const submitBtn = document.getElementById('submitBtn');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending…';
            }
        });
    }

    function showFormMsg (text, type) {
        const el = document.getElementById('formMessage');
        if (!el) return;
        el.textContent = text;
        el.className = 'form-message ' + type;
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /* ----------------------------------------------------------
       Touch-friendly hover for feature cards (iOS)
    ---------------------------------------------------------- */
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        document.querySelectorAll('.feature-card').forEach(function (card) {
            let moved = false;
            card.addEventListener('touchstart', function () { moved = false; }, { passive: true });
            card.addEventListener('touchmove',  function () { moved = true;  }, { passive: true });
            card.addEventListener('touchend',   function () {
                if (!moved) {
                    this.classList.toggle('touch-hover');
                }
            });
        });
    }
});
