/* ==========================================
   PASHA GINOGA — PORTFOLIO JAVASCRIPT
   script.js
   ========================================== */

// ===== CUSTOM CURSOR =====
const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left  = mouseX + 'px';
    cursorDot.style.top   = mouseY + 'px';
});

function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
}
animateRing();

// Scale ring on hoverable elements
document.querySelectorAll('a, button, .gallery-item, .skill-card, .blog-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.style.transform = 'translate(-50%, -50%) scale(1.8)');
    el.addEventListener('mouseleave', () => cursorRing.style.transform = 'translate(-50%, -50%) scale(1)');
});

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    // Sticky style
    if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Active nav link highlighting
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('navMobile');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMobile.classList.toggle('open');
});

// Close mobile menu on link click
document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navMobile.classList.remove('open');
    });
});

// ===== REVEAL ON SCROLL (Intersection Observer) =====
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, parseInt(delay));
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

revealElements.forEach(el => revealObserver.observe(el));

// ===== SKILL BAR ANIMATION =====
const skillFills = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const fill = entry.target;
            const targetWidth = fill.dataset.width + '%';
            setTimeout(() => {
                fill.style.width = targetWidth;
            }, 200);
            skillObserver.unobserve(fill);
        }
    });
}, { threshold: 0.3 });

skillFills.forEach(fill => skillObserver.observe(fill));

// ===== COUNTER ANIMATION =====
const statNums = document.querySelectorAll('.stat-num');

function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const duration = 1500;
    const step = target / (duration / 16);
    let current = 0;

    const update = () => {
        current += step;
        if (current < target) {
            el.textContent = Math.floor(current);
            requestAnimationFrame(update);
        } else {
            el.textContent = target;
        }
    };
    update();
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statNums.forEach(num => counterObserver.observe(num));

// ===== GALLERY LIGHTBOX =====
const galleryItems = document.querySelectorAll('.gallery-item');

// Create lightbox elements
const lightbox = document.createElement('div');
lightbox.id = 'lightbox';
lightbox.style.cssText = `
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(10, 22, 40, 0.95);
    backdrop-filter: blur(20px);
    z-index: 9000;
    align-items: center;
    justify-content: center;
    cursor: zoom-out;
    animation: fadeIn 0.3s ease;
`;
lightbox.innerHTML = `
    <img id="lightboxImg" style="
        max-width: 90vw; 
        max-height: 85vh; 
        border-radius: 12px; 
        box-shadow: 0 20px 80px rgba(0,0,0,0.6);
        transform: scale(0.9);
        animation: scaleIn 0.3s ease forwards;
    " src="" alt="">
    <button id="lightboxClose" style="
        position: absolute;
        top: 24px; right: 24px;
        background: rgba(255,255,255,0.1);
        border: 1px solid rgba(255,255,255,0.2);
        color: white;
        width: 44px; height: 44px;
        border-radius: 50%;
        font-size: 1.2rem;
        cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        transition: background 0.2s;
    ">✕</button>
`;

const style = document.createElement('style');
style.textContent = `
    @keyframes scaleIn { to { transform: scale(1); } }
    #lightboxClose:hover { background: rgba(255,255,255,0.2) !important; }
`;
document.head.appendChild(style);
document.body.appendChild(lightbox);

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (!img || item.classList.contains('img-fallback')) return;
        const lightboxImg = document.getElementById('lightboxImg');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
});

function closeLightbox() {
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
}
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

contactForm.addEventListener('submit', e => {
    e.preventDefault();

    const btn = contactForm.querySelector('.btn-primary');
    const originalContent = btn.innerHTML;
    btn.innerHTML = '<span>Mengirim...</span>';
    btn.disabled = true;

    // Simulate sending (replace with actual fetch/EmailJS if needed)
    setTimeout(() => {
        formSuccess.classList.add('show');
        contactForm.reset();
        btn.innerHTML = originalContent;
        btn.disabled = false;

        setTimeout(() => {
            formSuccess.classList.remove('show');
        }, 5000);
    }, 1200);
});

// ===== INPUT LABEL FLOAT EFFECT =====
document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
    });
    input.addEventListener('blur', () => {
        input.parentElement.classList.remove('focused');
    });
});

// ===== SMOOTH SCROLL FOR ALL ANCHORS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ===== PARALLAX BLOBS =====
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const blob1 = document.querySelector('.blob-1');
    const blob2 = document.querySelector('.blob-2');
    if (blob1) blob1.style.transform = `translateY(${scrollY * 0.15}px)`;
    if (blob2) blob2.style.transform = `translateY(${scrollY * -0.1}px)`;
});

// ===== TYPING EFFECT for Hero Title =====
(function () {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;

    const words = ['Pasha', 'Developer', 'Creator', 'Pasha'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const gradientSpan = heroTitle.querySelector('.text-gradient');
    if (!gradientSpan) return;

    function typeEffect() {
        const currentWord = words[wordIndex];
        if (isDeleting) {
            gradientSpan.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            gradientSpan.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let delay = isDeleting ? 80 : 120;

        if (!isDeleting && charIndex === currentWord.length) {
            delay = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            delay = 400;
        }

        setTimeout(typeEffect, delay);
    }

    // Start after 1.5s
    setTimeout(typeEffect, 1500);
})();

console.log('%c Portfolio Pasha Ginoga 🚀', 'color: #4d84f7; font-size: 1.2rem; font-weight: bold;');
console.log('%c Teknik Informatika UNSRAT', 'color: #8a9bc0; font-size: 0.9rem;');