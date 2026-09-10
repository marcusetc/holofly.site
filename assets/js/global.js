(function () {
    'use strict';

    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const overlay = document.getElementById('overlay');

    if (menuToggle && navMenu && overlay) {
        const setMenuState = function (isOpen) {
            menuToggle.classList.toggle('active', isOpen);
            navMenu.classList.toggle('active', isOpen);
            overlay.classList.toggle('active', isOpen);
            document.body.classList.toggle('menu-open', isOpen);
            menuToggle.setAttribute('aria-expanded', String(isOpen));
            menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
            overlay.setAttribute('aria-hidden', String(!isOpen));
        };

        menuToggle.addEventListener('click', function () {
            setMenuState(!navMenu.classList.contains('active'));
        });

        overlay.addEventListener('click', function () {
            setMenuState(false);
        });

        navMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                setMenuState(false);
            });
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && navMenu.classList.contains('active')) {
                setMenuState(false);
                menuToggle.focus();
            }
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                setMenuState(false);
            }
        });
    }
}());
