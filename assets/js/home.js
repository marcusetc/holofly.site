(() => {
    'use strict';
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function initRevealAnimations() {
        if (!('IntersectionObserver' in window) || reducedMotion.matches) return;
        const sections = [...document.querySelectorAll('[data-home-reveal]')];
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.remove('home-reveal-pending');
                observer.unobserve(entry.target);
            });
        }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });
        sections.forEach(section => {
            // Content above the fold is always immediately visible, including hash navigation.
            if (section.getBoundingClientRect().top < window.innerHeight) return;
            section.classList.add('home-reveal-pending');
            observer.observe(section);
        });
        const showAll = () => {
            sections.forEach(section => section.classList.remove('home-reveal-pending'));
            observer.disconnect();
        };
        reducedMotion.addEventListener('change', event => { if (event.matches) showAll(); });
        // A keyboard user must never land on an invisible link.
        document.addEventListener('focusin', event => {
            const section = event.target.closest('[data-home-reveal]');
            if (section) {
                section.classList.remove('home-reveal-pending');
                observer.unobserve(section);
            }
        });
    }

    function initDualSpotlight() {
        const hero = document.querySelector('.home-hero');
        if (!hero) return;
        const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
        let hoveredSide = '';
        const update = () => {
            const focused = document.activeElement.closest('[data-home-side]');
            hero.dataset.activeSide = (focused && hero.contains(focused) ? focused.dataset.homeSide : '') || hoveredSide;
        };
        hero.querySelectorAll('[data-home-side]').forEach(element => {
            element.addEventListener('pointerenter', () => {
                if (!finePointer.matches) return;
                hoveredSide = element.dataset.homeSide;
                update();
            });
            element.addEventListener('pointerleave', () => { hoveredSide = ''; update(); });
        });
        hero.addEventListener('focusin', update);
        hero.addEventListener('focusout', event => {
            const next = event.relatedTarget?.closest('[data-home-side]');
            hero.dataset.activeSide = (next && hero.contains(next) ? next.dataset.homeSide : '') || hoveredSide;
        });
        finePointer.addEventListener('change', () => { hoveredSide = ''; update(); });
    }

    function initMenuFocusBoundary() {
        // The shared script still owns opening/closing. Isolate this page's content while open.
        const toggle = document.getElementById('menuToggle');
        const header = document.querySelector('.site-header');
        const background = document.querySelectorAll('.home-main, .page-footer, .home-skip');
        if (!toggle || !header) return;
        const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';
        const sync = () => background.forEach(element => { element.inert = isOpen(); });
        new MutationObserver(sync).observe(toggle, { attributes: true, attributeFilter: ['aria-expanded'] });
        header.addEventListener('keydown', event => {
            if (!isOpen() || event.key !== 'Tab') return;
            const items = [...header.querySelectorAll('a[href], button')].filter(element => element.getClientRects().length);
            const first = items[0];
            const last = items[items.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault(); last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault(); first.focus();
            }
        });
        sync();
    }

    initRevealAnimations();
    initDualSpotlight();
    initMenuFocusBoundary();
})();
