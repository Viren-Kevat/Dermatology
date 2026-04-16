
// Fade-in on scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
        if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add('visible'), i * 80);
            observer.unobserve(e.target);
        }
    });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Mobile drawer
function openDrawer() {
    document.getElementById('navDrawer').classList.add('open');
    document.getElementById('navOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeDrawer() {
    document.getElementById('navDrawer').classList.remove('open');
    document.getElementById('navOverlay').classList.remove('open');
    document.body.style.overflow = '';
}

// Initialize Swiper Carousels
document.addEventListener('DOMContentLoaded', function () {
    // ── Top Banner (already in your file, unchanged) ──────────────
    new Swiper('.top-banner-swiper', {
        slidesPerView: 1,
        loop: true,
        autoplay: { delay: 4000, disableOnInteraction: false },
        effect: 'fade',
        fadeEffect: { crossFade: true },
        speed: 600,
    });

    // ── Hero Swiper ───────────────────────────────────────────────
    const progressBar = document.getElementById('heroProgressBar');
    const AUTOPLAY_DELAY = 5000;

    function resetProgress() {
        progressBar.classList.remove('animating');
        progressBar.style.transition = 'none';
        progressBar.style.width = '0%';
    }

    function startProgress() {
        // Force reflow so the transition re-fires from 0
        void progressBar.offsetWidth;
        progressBar.classList.add('animating');
    }

    const heroSwiper = new Swiper('#heroSwiper', {
        slidesPerView: 1,
        loop: true,
        speed: 700,
        grabCursor: true,

        // Crossfade between slides — looks clean with split layout
        effect: 'fade',
        fadeEffect: { crossFade: true },

        autoplay: {
            delay: AUTOPLAY_DELAY,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,   // pauses on hover — user reads at own pace
        },

        keyboard: {
            enabled: true,             // ← / → arrow keys work
            onlyInViewport: true,
        },

        pagination: {
            el: '#heroSwiper .swiper-pagination',
            clickable: true,
        },

        navigation: {
            nextEl: '#heroSwiper .swiper-button-next',
            prevEl: '#heroSwiper .swiper-button-prev',
        },

        on: {
            init() {
                startProgress();
            },
            slideChangeTransitionStart() {
                resetProgress();
            },
            slideChangeTransitionEnd() {
                startProgress();
            },
            autoplayPause() {
                // Freeze progress bar visually when autoplay pauses on hover
                const computed = window.getComputedStyle(progressBar).width;
                const total = progressBar.parentElement.offsetWidth;
                const pct = (parseFloat(computed) / total) * 100;
                progressBar.classList.remove('animating');
                progressBar.style.transition = 'none';
                progressBar.style.width = pct + '%';
            },
            autoplayResume() {
                // Resume from where it was paused — restart full bar
                resetProgress();
                startProgress();
            },
        },
    });

    // Reviews Swiper
    new Swiper('.reviews-swiper', {
        slidesPerView: 1,
        spaceBetween: 24,
        loop: true,
        grabCursor: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            },
        },
    });

    // Products Swiper
    new Swiper('.products-swiper', {
        slidesPerView: 1,
        spaceBetween: 24,
        loop: true,
        grabCursor: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            560: {
                slidesPerView: 2,
            },
            768: {
                slidesPerView: 3,
            },
            1024: {
                slidesPerView: 4,
            },
        },
    });

    // Gallery Swiper
    new Swiper('.gallery-swiper', {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        grabCursor: true,
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        autoplay: {
            delay: 6000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });
});

function openDrawer() {
    document.getElementById('navDrawer').classList.add('open');
    document.getElementById('navOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeDrawer() {
    document.getElementById('navDrawer').classList.remove('open');
    document.getElementById('navOverlay').classList.remove('open');
    document.body.style.overflow = '';
}

const CS_REPLIES = {
    'Book an appointment':
        "To book an appointment you can call us at <strong>972-221-2784</strong> or use our secure online patient portal, available 24/7. We're open Mon–Fri, 8 AM – 5 PM. 📅",
    'What services do you offer?':
        "We offer <strong>Botox & injectables, dermal fillers, chemical peels, laser hair removal, Fraxel resurfacing, Thermage CPT, microdermabrasion, sclerotherapy,</strong> and more. Want details on any specific treatment?",
    'What are your office hours?':
        "We're open <strong>Monday – Friday, 8:00 AM – 5:00 PM</strong>. Closed on weekends. You can request appointments online anytime through our patient portal! 🕐",
    'Tell me about Dr. Mitchell':
        "<strong>Dr. Sarah Mitchell, M.D.</strong> is triple board-certified (ABD, ABIM & NBME) with 15+ years of experience in Skine Care, TX. Voted <em>Best Dermatologist in Denton County 2025</em> ⭐ 4.9/5 from 289+ reviews."
};
const CS_FALLBACK =
    "Thanks for reaching out! For more details please call us at <strong>972-221-2784</strong> or visit us at 3821 Long Prairie Rd, Skine Care, TX 75028. 😊";

let csOpen = false;
let csBusy = false;

function csToggle() {
    csOpen = !csOpen;
    document.getElementById('csPanel').classList.toggle('open', csOpen);
    document.getElementById('csFab').classList.toggle('open', csOpen);
    if (csOpen) {
        const badge = document.getElementById('csBadge');
        badge.style.opacity = '0';
        badge.style.transform = 'scale(0)';
        setTimeout(() => document.getElementById('csInput').focus(), 300);
    }
}

function csGrow(el) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 72) + 'px';
}

function csKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); csSend(); }
}

function csChip(btn, text) {
    document.getElementById('csChips').style.display = 'none';
    csPushMsg('user', text);
    setTimeout(() => csTyping(() => csPushMsg('bot', CS_REPLIES[text] || CS_FALLBACK)), 500);
}

function csSend() {
    const inp = document.getElementById('csInput');
    const text = inp.value.trim();
    if (!text || csBusy) return;
    document.getElementById('csChips').style.display = 'none';
    inp.value = '';
    inp.style.height = 'auto';
    csPushMsg('user', text);
    setTimeout(() => csTyping(() => csPushMsg('bot', CS_FALLBACK)), 500);
}

function csPushMsg(role, html) {
    const msgs = document.getElementById('csMsgs');
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const d = document.createElement('div');
    d.className = 'msg ' + role;
    if (role === 'bot') {
        d.innerHTML =
            `<div class="msg-row">
          <div class="msg-mini-av">CS</div>
          <div class="msg-bubble">${html}</div>
        </div>
        <div class="msg-meta"><span class="msg-time">${now}</span></div>`;
    } else {
        d.innerHTML =
            `<div class="msg-row">
          <div class="msg-bubble">${html}</div>
        </div>
        <div class="msg-meta">
          <span class="msg-time">${now}</span>
          <span class="msg-tick">✓✓</span>
        </div>`;
    }
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
}

function csTyping(cb) {
    csBusy = true;
    const msgs = document.getElementById('csMsgs');
    const d = document.createElement('div');
    d.className = 'msg bot';
    d.id = 'csTypingEl';
    d.innerHTML =
        `<div class="msg-row">
        <div class="msg-mini-av">CS</div>
        <div class="typing-bubble">
          <span></span><span></span><span></span>
        </div>
      </div>`;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
    setTimeout(() => {
        const el = document.getElementById('csTypingEl');
        if (el) el.remove();
        csBusy = false;
        cb();
    }, 1500);
}
