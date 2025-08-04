// Script para la nueva página de equipos estilo Furality con colores VRTon
document.addEventListener('DOMContentLoaded', () => {
    let equiposData = null;

    // Aplicar estilo Furality al body
    document.body.classList.add('furality-body');
    
    // Notificar inmediatamente que los equipos están "listos" para el loading manager
    // Esto evita que el usuario espere mucho tiempo viendo "Cargando información del equipo..."
    if (window.onTeamsReady) {
        window.onTeamsReady();
    }

    // Cargar datos de equipos desde JSON
    async function cargarEquipos() {
        try {
            // Notificar que hemos iniciado la carga del equipo
            if (window.performanceMonitor) {
                window.performanceMonitor.mark('teams-data-start');
            }
            
            const response = await fetch('data/equipos.json');
            if (!response.ok) {
                throw new Error('No se pudo cargar el archivo de equipos');
            }
            equiposData = await response.json();
            
            if (window.performanceMonitor) {
                window.performanceMonitor.mark('teams-data-loaded');
            }
            
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
        
        // Track rendering completion
        if (window.performanceMonitor) {
            window.performanceMonitor.mark('teams-rendered');
        }
    }

    // Iconos para cada departamento
    const iconosDepartamentos = {
        'moderacion': 'fas fa-shield-alt',
        'desarrollo': 'fas fa-code',
        'audiovisuales': 'fas fa-video',
        'diseno': 'fas fa-palette',
        'marketing': 'fas fa-bullhorn',
        'mapmaking': 'fas fa-map',
        'eventos': 'fas fa-calendar-alt'
    };

    // Función para manejar errores de imágenes con placeholder local
    function handleImageError(img, nombre, isLeader = false) {
        // Primero intentar con el placeholder local
        if (!img.src.includes('placeholder.webp')) {
            img.src = 'assets/colaboradores/placeholder.webp';
            img.onerror = function() {
                // Si el placeholder local falla, crear un elemento de texto
                const iniciales = nombre.split(' ').map(n => n[0]).join('');
                const color = isLeader ? '#e30613' : '#fd5c63';
                const size = isLeader ? 60 : 50;
                
                // Create a canvas-based fallback
                if (window.LocalPlaceholder) {
                    const dataURL = window.LocalPlaceholder.generateDataURL(size, size, color, '#ffffff', iniciales);
                    this.src = dataURL;
                } else {
                    // Fallback: hide image and show initials in parent
                    this.style.display = 'none';
                    const initialsDiv = document.createElement('div');
                    initialsDiv.style.cssText = `
                        width: ${size}px; height: ${size}px; 
                        background: ${color}; color: white; 
                        border-radius: 50%; display: flex; 
                        align-items: center; justify-content: center; 
                        font-weight: bold; font-size: ${size * 0.4}px;
                    `;
                    initialsDiv.textContent = iniciales;
                    this.parentNode.appendChild(initialsDiv);
                }
                this.onerror = null; // Evitar bucle infinito
            };
        }
    }

    // Hacer la función disponible globalmente
    window.handleImageError = handleImageError;

    // Generar botones de redes sociales
    function generarBotonesSociales(social) {
        if (!social) return '';
        
        const redes = [];
        
        if (social.discord && social.discord.trim() !== '') {
            redes.push(`<a href="${social.discord}" class="furality-social-btn" title="Discord" target="_blank" rel="noopener noreferrer">
                <i class="fab fa-discord"></i>
            </a>`);
        }
        
        if (social.twitter && social.twitter.trim() !== '') {
            redes.push(`<a href="${social.twitter}" class="furality-social-btn" title="Twitter" target="_blank" rel="noopener noreferrer">
                <i class="fab fa-twitter"></i>
            </a>`);
        }
        
        if (social.instagram && social.instagram.trim() !== '') {
            redes.push(`<a href="${social.instagram}" class="furality-social-btn" title="Instagram" target="_blank" rel="noopener noreferrer">
                <i class="fab fa-instagram"></i>
            </a>`);
        }
        
        return redes.join('');
    }

    // Renderizar navegación estilo Furality
    function renderizarNavegacion() {
        const navegacionContainer = document.getElementById('team-navigation');
        navegacionContainer.className = 'furality-nav';
        
        navegacionContainer.innerHTML = `
            <button id="toggle-filters-btn" class="furality-filter-toggle">
                <i class="fas fa-filter"></i>
                <span data-i18n="colaboradores.filter_button">Filtrar Departamentos</span>
            </button>
            <div class="furality-departments-wrapper">
                <h2 data-i18n="colaboradores.departments_title">Departamentos</h2>
                <div class="furality-departments">
                    ${equiposData.equipos.map(equipo => `
                        <a href="#team-${equipo.id}" class="furality-dept-btn" data-team="${equipo.id}" data-i18n="teams.${equipo.id}.name">
                            <i class="${iconosDepartamentos[equipo.id] || 'fas fa-users'}"></i>
                            ${equipo.nombre}
                        </a>
                    `).join('')}
                </div>
            </div>
        `;
        //Logica boton filtro departamentos
        const toggleBtn = document.getElementById('toggle-filters-btn');
        const departmentsWrapper = navegacionContainer.querySelector('.furality-departments-wrapper');

        // Evento para mostrar/ocultar el menú de filtros en móvil
        toggleBtn.addEventListener('click', () => {
            departmentsWrapper.classList.toggle('active');
            // Actualiza el estado ARIA para accesibilidad
            const isExpanded = departmentsWrapper.classList.contains('active');
            toggleBtn.setAttribute('aria-expanded', isExpanded);
        });

        // Agregar eventos de click
        document.querySelectorAll('.furality-dept-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const teamId = btn.getAttribute('data-team');
                scrollToTeam(teamId);
                // En movil, ocultar el menú después de seleccionar una opción
                if (window.innerWidth <= 768) {
                    departmentsWrapper.classList.remove('active');
                    toggleBtn.setAttribute('aria-expanded', 'false');
                }
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

        section.innerHTML = `
            <h2 class="furality-dept-title" data-i18n="teams.${equipo.id}.name">${equipo.nombre}</h2>
            
            <p class="furality-dept-description" data-i18n="teams.${equipo.id}.description">${equipo.descripcion}</p>
            
            
            <div class="furality-leaders">
                ${equipo.lideres.map(lider => crearLiderFurality(lider)).join('')}
            </div>

            
            <div class="furality-members">
                ${equipo.miembros.map(miembro => crearMiembroFurality(miembro)).join('')}
            </div>
        `;

        return section;
    }

    // Crear líder estilo Furality
    function crearLiderFurality(lider) {
        const iniciales = lider.nombre.split(' ').map(n => n[0]).join('');
        // Si el líder tiene una 'rol_key', crea el atributo data-i18n.
        const rolTraducible = lider.rol_key ? `data-i18n="roles.${lider.rol_key}"` : '';
        
        return `
            <div class="furality-leader">
                <div class="furality-leader-photo">
                    <img src="assets/colaboradores/${lider.foto}" 
                        alt="${lider.nombre}"
                        onload="this.style.opacity='1'"
                        onerror="handleImageError(this, '${lider.nombre}', true)">
                </div>
                <div class="furality-leader-info">
                    <div class="furality-leader-name">${lider.nombre}</div>
                    <div class="furality-leader-role" ${rolTraducible}>${lider.rol}</div>
                </div>
                <div class="furality-leader-social">
                    ${generarBotonesSociales(lider.social)}
                </div>
            </div>
        `;
    }

    // Crear miembro estilo Furality
    function crearMiembroFurality(miembro) {
        const iniciales = miembro.nombre.split(' ').map(n => n[0]).join('');
        const rolTraducible = miembro.rol_key ? `data-i18n="roles.${miembro.rol_key}"` : '';

        return `
            <div class="furality-member">
                <div class="furality-member-photo">
                    <img src="assets/colaboradores/${miembro.foto}" 
                        alt="${miembro.nombre}"
                        onload="this.style.opacity='1'"
                        onerror="handleImageError(this, '${miembro.nombre}', false)">
                </div>
                <div class="furality-member-info">
                    <div class="furality-member-name">${miembro.nombre}</div>
                    <div class="furality-member-role" ${rolTraducible}>${miembro.rol}</div>
                </div>
                <div class="furality-member-social">
                    ${generarBotonesSociales(miembro.social)}
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

    // Scroll suave a equipo específico - optimized to prevent forced reflows
    function scrollToTeam(teamId) {
        const targetSection = document.getElementById(`team-${teamId}`);
        if (targetSection) {
            // Batch all layout reads in a single requestAnimationFrame
            requestAnimationFrame(() => {
                const header = document.querySelector('header');
                const nav = document.querySelector('.furality-nav');
                
                const headerHeight = header ? header.offsetHeight : 80; // fallback value
                const navHeight = nav ? nav.offsetHeight : 60; // fallback value
                const targetPosition = targetSection.offsetTop;
                
                // Calculate offset and scroll in the same frame to prevent multiple layouts
                const offset = headerHeight + navHeight + 20;
                const scrollPosition = targetPosition - offset;
                
                window.scrollTo({
                    top: scrollPosition,
                    behavior: 'smooth'
                });
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
    async function inicializar() {
        await cargarEquipos();
        
        // Animar elementos después de que se cargue todo
        setTimeout(animateOnScroll, 500);
    }
    
    // Inicializar
    inicializar();

    console.log('Script de equipos Furality cargado correctamente');
});
