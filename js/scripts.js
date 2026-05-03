/*!
* Start Bootstrap - Resume v7.0.6 (https://startbootstrap.com/theme/resume)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-resume/blob/master/LICENSE)
*/

window.addEventListener('DOMContentLoaded', () => {

    // --- Tabbed navigation ---
    // Each nav link shows its target section and hides all others.
    // Falls back gracefully: if JS is disabled, all sections remain visible.

    const sections = document.querySelectorAll('section.resume-section');
    const navLinks = document.querySelectorAll('#navbarResponsive .nav-link');

    function showSection(targetId) {
        sections.forEach(section => {
            if (section.id === targetId) {
                section.style.display = 'flex';
                section.classList.add('active-section');
            } else {
                section.style.display = 'none';
                section.classList.remove('active-section');
            }
        });

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === '#' + targetId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Scroll main content back to top on section switch
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Wire up nav links
    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const targetId = link.getAttribute('href').replace('#', '');
            showSection(targetId);
            history.pushState(null, '', '#' + targetId);
        });
    });

    // On load: show section from URL hash, or default to #about
    const initialId = (window.location.hash || '#about').replace('#', '');
    showSection(initialId);

    // Collapse responsive navbar when a link is clicked on mobile
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});
