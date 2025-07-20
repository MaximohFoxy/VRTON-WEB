// Script para la nueva página de equipos estilo Furality con colores VRTon
document.addEventListener('DOMContentLoaded', () => {
    let equiposData = null;

    // Aplicar estilo Furality al body
    document.body.classList.add('furality-body');

    // Cargar datos de equipos desde JSON
    async function cargarEquipos() {
        try {
            const response = await fetch('data/equipos.json');
            if (!response.ok) {
                throw new Error('No se pudo cargar el archivo de equipos');
            }
            equiposData = await response.json();
            console.log('Equipos cargados:', equiposData);
            renderizarPagina();
        } catch (error) {
            console.error('Error al cargar equipos:', error);
            mostrarError();
        }
    }

    // Renderizar toda la página
    function renderizarPagina() {
        if (!equiposData) return;

        renderizarNavegacion();
        renderizarEquipos();
        configurarNavegacion();
    }

    // Iconos para cada departamento
    const iconosDepartamentos = {
        'moderacion': 'fas fa-shield-alt',
        'desarrollo': 'fas fa-code',
        'audiovisuales': 'fas fa-video',
        'diseno': 'fas fa-palette',
        'marketing': 'fas fa-bullhorn',
        'eventos': 'fas fa-calendar-alt'
    };

    // Renderizar navegación estilo Furality
    function renderizarNavegacion() {
        const navegacionContainer = document.getElementById('team-navigation');
        navegacionContainer.className = 'furality-nav';
        
        navegacionContainer.innerHTML = `
            <h2>Departamentos</h2>
            <div class="furality-departments">
                ${equiposData.equipos.map(equipo => `
                    <a href="#team-${equipo.id}" class="furality-dept-btn" data-team="${equipo.id}">
                        <i class="${iconosDepartamentos[equipo.id] || 'fas fa-users'}"></i>
                        ${equipo.nombre}
                    </a>
                `).join('')}
            </div>
        `;

        // Agregar eventos de click
        document.querySelectorAll('.furality-dept-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const teamId = btn.getAttribute('data-team');
                scrollToTeam(teamId);
            });
        });
    }

    // Renderizar equipos estilo Furality
    function renderizarEquipos() {
        const container = document.getElementById('teams-container');
        container.className = 'furality-container';
        container.innerHTML = '';

        equiposData.equipos.forEach(equipo => {
            const teamSection = crearSeccionEquipo(equipo);
            container.appendChild(teamSection);
        });
    }

    // Crear sección individual de equipo estilo Furality
    function crearSeccionEquipo(equipo) {
        const section = document.createElement('section');
        section.className = 'furality-department';
        section.id = `team-${equipo.id}`;

        // Generar iniciales para fallback de imágenes
        const liderIniciales = equipo.lider.nombre.split(' ').map(n => n[0]).join('');

        section.innerHTML = `
            <h2 class="furality-dept-title">${equipo.nombre}</h2>
            
            <!-- Líder del departamento -->
            <div class="furality-leader">
                <div class="furality-leader-photo">
                    <img src="assets/colaboradores/${equipo.lider.foto}" 
                         alt="${equipo.lider.nombre}"
                         onerror="this.src='https://via.placeholder.com/60x60/e30613/ffffff?text=${encodeURIComponent(liderIniciales)}'">
                </div>
                <div class="furality-leader-info">
                    <div class="furality-leader-name">${equipo.lider.nombre}</div>
                    <div class="furality-leader-role">${equipo.lider.rol}</div>
                </div>
                <div class="furality-leader-social">
                    <a href="#" class="furality-social-btn" title="Discord">
                        <i class="fab fa-discord"></i>
                    </a>
                    <a href="#" class="furality-social-btn" title="Twitter">
                        <i class="fab fa-twitter"></i>
                    </a>
                    <a href="#" class="furality-social-btn" title="Instagram">
                        <i class="fab fa-instagram"></i>
                    </a>
                </div>
            </div>

            <!-- Miembros del equipo -->
            <div class="furality-team-subtitle">${equipo.nombre} Team</div>
            <div class="furality-members">
                ${equipo.miembros.map(miembro => crearMiembroFurality(miembro)).join('')}
            </div>
        `;

        return section;
    }

    // Crear miembro estilo Furality
    function crearMiembroFurality(miembro) {
        const iniciales = miembro.nombre.split(' ').map(n => n[0]).join('');
        return `
            <div class="furality-member">
                <div class="furality-member-photo">
                    <img src="assets/colaboradores/${miembro.foto}" 
                         alt="${miembro.nombre}"
                         onerror="this.src='https://via.placeholder.com/50x50/fd5c63/ffffff?text=${encodeURIComponent(iniciales)}'">
                </div>
                <div class="furality-member-info">
                    <div class="furality-member-name">${miembro.nombre}</div>
                    <div class="furality-member-role">${miembro.rol}</div>
                </div>
                <div class="furality-member-social">
                    <a href="#" class="furality-social-btn" title="Discord">
                        <i class="fab fa-discord"></i>
                    </a>
                    <a href="#" class="furality-social-btn" title="Twitter">
                        <i class="fab fa-twitter"></i>
                    </a>
                </div>
            </div>
        `;
    }

    // Configurar navegación suave
    function configurarNavegacion() {
        // Configurar Intersection Observer para botones activos
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const teamId = entry.target.id.replace('team-', '');
                    updateActiveButton(teamId);
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-140px 0px -50% 0px'
        });

        // Observar todas las secciones de equipos
        document.querySelectorAll('.furality-department').forEach(section => {
            observer.observe(section);
        });
    }

    // Actualizar botón activo
    function updateActiveButton(activeTeamId) {
        document.querySelectorAll('.furality-dept-btn').forEach(button => {
            button.classList.remove('active');
            if (button.getAttribute('data-team') === activeTeamId) {
                button.classList.add('active');
            }
        });
    }

    // Scroll suave a equipo específico
    function scrollToTeam(teamId) {
        const targetSection = document.getElementById(`team-${teamId}`);
        if (targetSection) {
            const headerHeight = document.querySelector('header').offsetHeight;
            const navHeight = document.querySelector('.furality-nav').offsetHeight;
            const offset = headerHeight + navHeight + 20;
            
            const targetPosition = targetSection.offsetTop - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    // Mostrar error si no se pueden cargar los datos
    function mostrarError() {
        const container = document.getElementById('teams-container');
        container.className = 'furality-container';
        container.innerHTML = `
            <div style="text-align: center; padding: 60px 20px;">
                <h2 style="color: var(--white); margin-bottom: 20px;">
                    <i class="fas fa-exclamation-triangle"></i> Error al cargar equipos
                </h2>
                <p style="color: rgba(255,255,255,0.8); font-size: 1.1rem;">
                    No se pudieron cargar los datos de los equipos. Por favor, inténtalo más tarde.
                </p>
            </div>
        `;
    }

    // Animaciones de entrada progresiva
    function animateOnScroll() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.furality-member').forEach(member => {
            member.style.opacity = '0';
            member.style.transform = 'translateY(20px)';
            member.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(member);
        });
    }

    // Inicializar la aplicación
    cargarEquipos().then(() => {
        // Animar elementos después de que se cargue todo
        setTimeout(animateOnScroll, 500);
    });

    console.log('Script de equipos Furality cargado correctamente');
});
