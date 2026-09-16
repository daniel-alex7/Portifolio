document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Tema claro/escuro ---------- */
  const themeToggleBtn = document.getElementById('theme-toggle');
  themeToggleBtn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    themeToggleBtn.setAttribute('aria-pressed', String(next === 'dark'));
    try { localStorage.setItem('theme', next); } catch (e) {}
  });
  themeToggleBtn.setAttribute('aria-pressed', String(root.getAttribute('data-theme') === 'dark'));

  /* ---------- Nav: fundo ao rolar + link ativo ---------- */
  const nav = document.getElementById('site-nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 8);
  }, { passive: true });

  const sections = ['realizacoes', 'projetos', 'certificados']
    .map(id => document.getElementById(id))
    .filter(Boolean);
  const navLinks = Array.from(document.querySelectorAll('.nav-link[href^="#"]'));

  if (sections.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(section => observer.observe(section));
  }

  /* ---------- Terminal: efeito de digitação (uma única vez) ---------- */
  const terminalBody = document.getElementById('terminal-body');
  const script = [
    { type: 'prompt', text: '$ whoami' },
    { type: 'output', text: 'Daniel Robson Alexandre Silva' },
    { type: 'prompt', text: '$ cat sobre.txt' },
    { type: 'output', text: 'Estudante de Ciência da Computação (UNICSUL)' },
    { type: 'output', text: 'Hoje em operações financeiras, migrando para tecnologia' },
    { type: 'prompt', text: '$ ls contato/' },
    { type: 'output', text: 'github.com/daniel-alex7  linkedin.com/in/danielr-alexandre' }
  ];

  function renderStatic() {
    terminalBody.innerHTML = script
      .map(line => `<div class="${line.type === 'prompt' ? 'line-prompt' : 'line-output'}">${line.type === 'prompt' ? line.text : '> ' + line.text}</div>`)
      .join('') + '<span class="cursor"></span>';
  }

  function typeTerminal() {
    let lineIndex = 0;
    let charIndex = 0;

    function typeNextChar() {
      if (lineIndex >= script.length) {
        terminalBody.insertAdjacentHTML('beforeend', '<span class="cursor"></span>');
        return;
      }
      const current = script[lineIndex];
      const prefix = current.type === 'prompt' ? '' : '> ';
      const full = prefix + current.text;

      let lineEl = terminalBody.querySelector(`[data-line="${lineIndex}"]`);
      if (!lineEl) {
        lineEl = document.createElement('div');
        lineEl.className = current.type === 'prompt' ? 'line-prompt' : 'line-output';
        lineEl.setAttribute('data-line', String(lineIndex));
        terminalBody.appendChild(lineEl);
      }

      charIndex += 1;
      lineEl.textContent = full.slice(0, charIndex);

      if (charIndex >= full.length) {
        lineIndex += 1;
        charIndex = 0;
        setTimeout(typeNextChar, current.type === 'prompt' ? 220 : 90);
      } else {
        setTimeout(typeNextChar, current.type === 'prompt' ? 28 : 14);
      }
    }

    typeNextChar();
  }

  if (prefersReducedMotion) {
    renderStatic();
  } else {
    typeTerminal();
  }

  /* ---------- Projetos: dados ao vivo do GitHub ---------- */
  function relativeTime(dateString) {
    const diffMs = Date.now() - new Date(dateString).getTime();
    const days = Math.floor(diffMs / 86400000);
    if (days < 1) return 'atualizado hoje';
    if (days < 30) return `atualizado há ${days} dia${days > 1 ? 's' : ''}`;
    const months = Math.floor(days / 30);
    if (months < 12) return `atualizado há ${months} mês${months > 1 ? 'es' : ''}`;
    const years = Math.floor(months / 12);
    return `atualizado há ${years} ano${years > 1 ? 's' : ''}`;
  }

  document.querySelectorAll('.project-card[data-repo]').forEach(async (card) => {
    const repo = card.getAttribute('data-repo');
    const statsEl = card.querySelector('.project-stats');
    if (!statsEl) return;
    try {
      const res = await fetch(`https://api.github.com/repos/daniel-alex7/${repo}`);
      if (!res.ok) return;
      const data = await res.json();

      if (data.language) {
        const chip = document.createElement('span');
        chip.className = 'stat-chip';
        chip.textContent = data.language;
        statsEl.appendChild(chip);
      }
      if (data.stargazers_count > 0) {
        const chip = document.createElement('span');
        chip.className = 'stat-chip';
        chip.textContent = `★ ${data.stargazers_count}`;
        statsEl.appendChild(chip);
      }
      if (data.pushed_at) {
        const chip = document.createElement('span');
        chip.className = 'stat-chip';
        chip.textContent = relativeTime(data.pushed_at);
        statsEl.appendChild(chip);
      }
    } catch (e) {
      /* API indisponível ou limite de requisições atingido: card continua funcional sem os chips */
    }
  });

  /* ---------- Certificados: busca + filtro + estatísticas ---------- */
  const certCards = Array.from(document.querySelectorAll('.cert-card'));
  const filterButtons = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('cert-search');
  const resultsEl = document.getElementById('cert-results');
  const statCountEl = document.getElementById('stat-count');
  const statHoursEl = document.getElementById('stat-hours');

  const totalCerts = certCards.length;
  const totalHours = certCards.reduce((sum, card) => sum + (parseInt(card.getAttribute('data-hours'), 10) || 0), 0);

  function animateNumber(el, target) {
    if (prefersReducedMotion) { el.textContent = String(target); return; }
    const duration = 700;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = String(Math.round(target * progress));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  animateNumber(statCountEl, totalCerts);
  animateNumber(statHoursEl, totalHours);

  let activeFilter = 'all';

  function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    certCards.forEach(card => {
      const matchesCategory = activeFilter === 'all' || card.getAttribute('data-category') === activeFilter;
      const matchesQuery = !query || card.textContent.toLowerCase().includes(query);
      const visible = matchesCategory && matchesQuery;
      card.classList.toggle('is-hidden', !visible);
      if (visible) visibleCount += 1;
    });

    resultsEl.textContent = `Mostrando ${visibleCount} de ${totalCerts} certificados`;
  }

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-pressed', 'true');
      activeFilter = button.getAttribute('data-filter');
      applyFilters();
    });
  });

  searchInput.addEventListener('input', applyFilters);

  applyFilters();
});
