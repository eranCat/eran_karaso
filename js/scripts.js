/*!
* Start Bootstrap - Resume v7.0.6 (https://startbootstrap.com/theme/resume)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-resume/blob/master/LICENSE)
*/

window.addEventListener('DOMContentLoaded', () => {

    // --- Tabbed navigation ---
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
            link.classList.toggle('active', href === '#' + targetId);
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const targetId = link.getAttribute('href').replace('#', '');
            showSection(targetId);
            history.pushState(null, '', '#' + targetId);
        });
    });

    const initialId = (window.location.hash || '#about').replace('#', '');
    showSection(initialId);

    const navbarToggler = document.body.querySelector('.navbar-toggler');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // --- GitHub repos ---
    const GITHUB_USER = 'eranCat';
    const EXCLUDED_REPOS = new Set(['eranCat']); // profile readme repo

    // Language → accent color mapping
    const LANG_COLORS = {
        'TypeScript':   '#3178c6',
        'JavaScript':   '#f1e05a',
        'Python':       '#3572A5',
        'Kotlin':       '#A97BFF',
        'Swift':        '#F05138',
        'Java':         '#b07219',
        'Jupyter Notebook': '#DA5B0B',
        'HTML':         '#e34c26',
        'CSS':          '#563d7c',
        'C#':           '#178600',
        'C++':          '#f34b7d',
        'C':            '#555555',
        'Shell':        '#89e051',
    };

    function langDot(lang) {
        const color = LANG_COLORS[lang] || '#8b92a8';
        return `<span class="lang-dot" style="background:${color}" aria-hidden="true"></span>`;
    }

    function formatDate(iso) {
        return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    }

    function buildCard(repo) {
        const lang = repo.language || '';
        const desc = repo.description ? escapeHtml(repo.description) : '<em class="no-desc">No description</em>';
        const topics = (repo.topics || []).slice(0, 4)
            .map(t => `<span class="repo-topic">${escapeHtml(t)}</span>`).join('');

        return `
        <div class="project-card" role="article">
            <div class="repo-header">
                <svg class="repo-icon" aria-hidden="true" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8Z"/>
                </svg>
                <h3 class="repo-name mb-0">${escapeHtml(repo.name.replace(/-/g, ' '))}</h3>
            </div>
            <p class="repo-desc">${desc}</p>
            ${topics ? `<div class="repo-topics">${topics}</div>` : ''}
            <div class="repo-meta">
                ${lang ? `<span class="repo-lang">${langDot(lang)}<span>${escapeHtml(lang)}</span></span>` : ''}
                ${repo.stargazers_count ? `<span class="repo-stat">
                    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/></svg>
                    ${repo.stargazers_count}
                </span>` : ''}
                <span class="repo-updated">Updated ${formatDate(repo.updated_at)}</span>
            </div>
            <a class="card-btn" href="${escapeHtml(repo.html_url)}" target="_blank" rel="noopener">View on GitHub</a>
        </div>`;
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    async function loadRepos() {
        const grid = document.getElementById('project-grid');
        const errorEl = document.getElementById('projects-error');

        try {
            const res = await fetch(
                `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`,
                { headers: { Accept: 'application/vnd.github.mercy-preview+json' } }
            );

            if (!res.ok) throw new Error(`GitHub API ${res.status}`);

            const repos = await res.json();
            const filtered = repos
                .filter(r => !r.fork && !EXCLUDED_REPOS.has(r.name) && !r.private)
                .sort((a, b) => {
                    // push archived and no-description repos to the end
                    if (a.archived !== b.archived) return a.archived ? 1 : -1;
                    return new Date(b.updated_at) - new Date(a.updated_at);
                });

            if (filtered.length === 0) throw new Error('No repos');

            grid.innerHTML = filtered.map(buildCard).join('');
        } catch (err) {
            console.error('GitHub repos failed:', err);
            grid.innerHTML = '';
            errorEl.hidden = false;
        }
    }

    loadRepos();
});
