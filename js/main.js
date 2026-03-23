/* ===================================
   PURPLES TRADITION - MAIN JS
   Chapter-based corporate layout
   =================================== */

document.addEventListener('DOMContentLoaded', () => {
    initGNB();
    initRevealAnimations();
    initHeaderScroll();
    initCountUp();
    initMobileMenu();
    initHzTimeline();
    initLogoReveal();
    initCh5Slider();
});

/* === GNB Mega Menu Toggle === */
function initGNB() {
    const header = document.getElementById('header');
    const gnbItems = document.querySelectorAll('.gnb-item');
    const overlay = document.getElementById('gnbOverlay');

    // 1depth 클릭 → 전체 메가 메뉴 토글
    gnbItems.forEach(item => {
        const btn = item.querySelector('.gnb-1depth');

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = header.classList.contains('gnb-open');

            if (isOpen) {
                header.classList.remove('gnb-open');
                if (overlay) overlay.classList.remove('active');
            } else {
                header.classList.add('gnb-open');
                if (overlay) overlay.classList.add('active');
            }
        });
    });

    // 오버레이 클릭 시 닫기
    if (overlay) {
        overlay.addEventListener('click', () => {
            header.classList.remove('gnb-open');
            overlay.classList.remove('active');
        });
    }

    // 외부 클릭 시 닫기
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.header-main') && !e.target.closest('.gnb-overlay')) {
            header.classList.remove('gnb-open');
            if (overlay) overlay.classList.remove('active');
        }
    });

    // 2depth 링크 클릭 시 닫기 (페이지 이동)
    document.querySelectorAll('.gnb-2depth-link').forEach(link => {
        link.addEventListener('click', () => {
            header.classList.remove('gnb-open');
            if (overlay) overlay.classList.remove('active');
        });
    });
}

/* === Scroll Reveal Animations === */
function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px'
    });

    reveals.forEach(el => observer.observe(el));
}

/* === Header Scroll === */
function initHeaderScroll() {
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });
}

/* === Count Up === */
function initCountUp() {
    const counters = document.querySelectorAll('.count');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseFloat(counter.dataset.target);
                const isDecimal = counter.dataset.decimal === 'true';
                const duration = 2000;
                const start = performance.now();

                function update(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    const ease = 1 - Math.pow(1 - progress, 3);
                    const value = ease * target;

                    counter.textContent = isDecimal ? value.toFixed(1) : Math.floor(value);

                    if (progress < 1) {
                        requestAnimationFrame(update);
                    } else {
                        counter.textContent = isDecimal ? target.toFixed(1) : target;
                    }
                }

                requestAnimationFrame(update);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
}

/* === Mobile Menu Toggle === */
function initMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    const gnb = document.getElementById('gnb');

    if (!toggle || !gnb) return;

    toggle.addEventListener('click', () => {
        gnb.classList.toggle('mobile-open');
        toggle.classList.toggle('open');
        document.body.style.overflow = gnb.classList.contains('mobile-open') ? 'hidden' : '';
    });

    // Close on 2depth link click (mobile)
    gnb.querySelectorAll('.gnb-2depth-link').forEach(link => {
        link.addEventListener('click', () => {
            gnb.classList.remove('mobile-open');
            toggle.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}

/* === Smooth Scroll === */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerH = document.getElementById('header').offsetHeight;
            window.scrollTo({
                top: target.getBoundingClientRect().top + window.pageYOffset - headerH,
                behavior: 'smooth'
            });
        }
    });
});

/* === Parallax Hero === */
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero-content');
    if (hero) {
        const y = window.pageYOffset;
        if (y < 600) {
            hero.style.transform = `translateY(${y * 0.25}px)`;
            hero.style.opacity = 1 - (y / 500);
        }
    }
}, { passive: true });

/* === Horizontal Timeline (Chapter 02) === */
function initHzTimeline() {
    const wrapper = document.querySelector('.hz-timeline-wrapper');
    const panels = document.getElementById('hzPanels');
    const progressBar = document.getElementById('hzProgressBar');
    const yearDots = document.querySelectorAll('.hz-year-dot');
    const panelEls = document.querySelectorAll('.hz-panel');

    if (!wrapper || !panels || panelEls.length === 0) return;

    const totalPanels = panelEls.length;

    function updateTimeline() {
        const wrapperRect = wrapper.getBoundingClientRect();
        const wrapperTop = wrapper.offsetTop;
        const wrapperHeight = wrapper.offsetHeight;
        const stickyHeight = window.innerHeight;
        const scrollableDistance = wrapperHeight - stickyHeight;

        // How far user has scrolled within this section
        const scrolled = window.pageYOffset - wrapperTop;
        const progress = Math.max(0, Math.min(1, scrolled / scrollableDistance));

        // Move panels horizontally (each panel width + 150px gap)
        const panelWidth = panels.firstElementChild ? panels.firstElementChild.offsetWidth : 350;
        const gap = 150;
        const totalWidth = (totalPanels * panelWidth) + ((totalPanels - 1) * gap) + 120;
        const maxTranslate = Math.max(0, totalWidth - window.innerWidth);
        const translateX = progress * maxTranslate;
        panels.style.transform = `translateX(-${translateX}px)`;

        // Update progress bar
        if (progressBar) {
            progressBar.style.width = (progress * 100) + '%';
        }

        // Determine active panels (show 2 at a time)
        const panelProgress = progress * (totalPanels - 1);
        const activeIndex = Math.floor(panelProgress);

        // Update year dots
        yearDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === activeIndex || i === activeIndex + 1);
        });

        // Update panel active state (activate current + next)
        panelEls.forEach((panel, i) => {
            const distance = Math.abs(panelProgress - i);
            if (distance < 1.5) {
                panel.classList.add('active');
            } else {
                panel.classList.remove('active');
            }
        });
    }

    // Listen to scroll
    window.addEventListener('scroll', updateTimeline, { passive: true });

    // Year dot click navigation
    yearDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.dataset.index);
            const wrapperTop = wrapper.offsetTop;
            const wrapperHeight = wrapper.offsetHeight;
            const stickyHeight = window.innerHeight;
            const scrollableDistance = wrapperHeight - stickyHeight;
            const targetProgress = index / (totalPanels - 1);
            const targetScroll = wrapperTop + (targetProgress * scrollableDistance);

            window.scrollTo({
                top: targetScroll,
                behavior: 'smooth'
            });
        });
    });

    // Initial update
    updateTimeline();
}

/* === Logo Grid Scroll Reveal === */
function initLogoReveal() {
    const logos = document.querySelectorAll('.logo-item');
    if (!logos.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const items = entry.target.parentElement.querySelectorAll('.logo-item');
                items.forEach((item, i) => {
                    setTimeout(() => {
                        item.classList.add('visible');
                    }, i * 80);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    observer.observe(logos[0]);
}

/* === Ch5 Image Slider === */
function initCh5Slider() {
    const slider = document.querySelector('.ch5-slider');
    if (!slider) return;

    const slides = slider.querySelectorAll('.ch5-slide');
    const prevBtn = slider.querySelector('.ch5-prev');
    const nextBtn = slider.querySelector('.ch5-next');
    const currentEl = slider.querySelector('.ch5-current');
    let current = 0;
    let autoplayTimer;

    function goTo(idx) {
        slides[current].classList.remove('active');
        current = (idx + slides.length) % slides.length;
        slides[current].classList.add('active');
        if (currentEl) currentEl.textContent = current + 1;
    }

    function startAutoplay() {
        autoplayTimer = setInterval(() => goTo(current + 1), 5000);
    }

    function resetAutoplay() {
        clearInterval(autoplayTimer);
        startAutoplay();
    }

    prevBtn.addEventListener('click', () => { goTo(current - 1); resetAutoplay(); });
    nextBtn.addEventListener('click', () => { goTo(current + 1); resetAutoplay(); });

    startAutoplay();
}
