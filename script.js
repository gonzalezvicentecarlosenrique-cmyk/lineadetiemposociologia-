document.addEventListener('DOMContentLoaded', () => {
  const nodes = document.querySelectorAll('.node');
  const filterBtns = document.querySelectorAll('.legend-btn');
  const searchInput = document.getElementById('timeline-search');
  const progressBar = document.getElementById('progress-bar');
  const timelineLine = document.getElementById('timeline-line');
  const timelineContainer = document.getElementById('timeline-container');
  const yearIndicator = document.getElementById('year-indicator');
  const currentYearDisplay = document.getElementById('current-year-display');

  // Control del tiempo según el scroll
  function handleTimeScroll() {
    const winScroll = window.scrollY;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // 1. Actualizar barra de lectura horizontal
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';

    // 2. Dibujar hilo de tiempo vertical
    const containerRect = timelineContainer.getBoundingClientRect();
    const containerTop = containerRect.top + window.scrollY;
    const containerHeight = containerRect.height;
    const viewportTrigger = window.scrollY + (window.innerHeight * 0.65); // Punto de activación en pantalla

    let lineProgress = viewportTrigger - containerTop;
    if (lineProgress < 0) lineProgress = 0;
    if (lineProgress > containerHeight) lineProgress = containerHeight;
    
    timelineLine.style.height = lineProgress + 'px';

    // 3. Iluminar / Activar tarjetas al alcanzar su momento en el tiempo
    let activeYear = null;
    let anyNodeActive = false;

    nodes.forEach(node => {
      if (node.classList.contains('is-hidden')) return;

      const nodeRect = node.getBoundingClientRect();

      if (nodeRect.top < window.innerHeight * 0.65) {
        node.classList.add('active-time');
        activeYear = node.getAttribute('data-year');
        anyNodeActive = true;
      } else {
        node.classList.remove('active-time');
      }
    });

    // 4. Mostrar o actualizar el contador de años flotante
    if (anyNodeActive && activeYear && winScroll > 200) {
      yearIndicator.classList.add('visible');
      currentYearDisplay.textContent = activeYear;
    } else {
      yearIndicator.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', handleTimeScroll);
  handleTimeScroll(); // Evaluación inicial

  // Lógica de Filtros por Categoría y Búsqueda en tiempo real
  let currentFilter = 'all';
  let currentSearch = '';

  function applyFilters() {
    nodes.forEach(node => {
      const category = node.getAttribute('data-category');
      const textContent = node.textContent.toLowerCase();

      const matchesCategory = (currentFilter === 'all' || category === currentFilter);
      const matchesSearch = textContent.includes(currentSearch);

      if (matchesCategory && matchesSearch) {
        node.classList.remove('is-hidden');
      } else {
        node.classList.add('is-hidden');
      }
    });

    // Re-evaluar la posición de los elementos tras filtrar
    setTimeout(handleTimeScroll, 100);
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter');
      applyFilters();
    });
  });

  searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value.toLowerCase().trim();
    applyFilters();
  });
});