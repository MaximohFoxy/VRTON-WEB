// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos DOM
    const header = document.querySelector('header');
    const contactForm = document.getElementById('contact-form');

    // Cambiar el estilo del header al hacer scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });

    // Animación suave para los enlaces de navegación
    const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });

    // Gestión del formulario de contacto
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Obtener los valores del formulario
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // Validación básica
            if (!name || !email || !message) {
                alert('Por favor, completa todos los campos del formulario.');
                return;
            }

            // Aquí normalmente enviarías los datos a un servidor
            // Como es un ejemplo, simplemente mostramos un mensaje de éxito
            alert(`¡Gracias ${name}! Tu mensaje ha sido enviado correctamente. Te contactaremos pronto.`);

            // Reiniciar el formulario
            contactForm.reset();
        });
    }

    // Animación de aparición para las tarjetas de proyectos
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };
// Script principal para el sitio web de VRTon

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar la carga de colaboradores si estamos en la página de colaboradores
    if (document.querySelector('#colaboradores-container')) {
        cargarColaboradores();
        configurarFiltrosCategorias();
    }

    // Ajustar header al hacer scroll
    configurarHeaderScroll();
});

/**
 * Carga los colaboradores desde el archivo JSON y los muestra en la página
 */
async function cargarColaboradores() {
    try {
        const response = await fetch('data/colaboradores.json');
        if (!response.ok) {
            throw new Error('No se pudo cargar el archivo de colaboradores');
        }

        const data = await response.json();
        renderizarColaboradores(data);
    } catch (error) {
        console.error('Error al cargar colaboradores:', error);
        mostrarMensajeError();
    }
}

/**
 * Renderiza las tarjetas de colaboradores en el contenedor
 * @param {Array} colaboradores - Array de objetos con información de colaboradores
 */
function renderizarColaboradores(colaboradores) {
    const container = document.getElementById('colaboradores-container');
    container.innerHTML = '';

    if (colaboradores.length === 0) {
        container.innerHTML = '<p class="no-results">No se encontraron colaboradores.</p>';
        return;
    }

    colaboradores.forEach(colaborador => {
        const card = document.createElement('div');
        card.className = `colaborador-card ${colaborador.categoria}`;
        card.setAttribute('data-categoria', colaborador.categoria);

        // Usar imagen por defecto si no hay una específica
        const imagenUrl = colaborador.imagen ? 
            `assets/colaboradores/${colaborador.imagen}` : 
            'https://via.placeholder.com/300x300?text=Colaborador';

        card.innerHTML = `
            <div class="colaborador-image">
                <img src="${imagenUrl}" alt="${colaborador.nombre}" onerror="this.src='https://via.placeholder.com/300x300?text=VRTon'">
            </div>
            <div class="colaborador-info">
                <h3>${colaborador.nombre}</h3>
                <p class="colaborador-rol">${colaborador.categoria}</p>
                <p>${colaborador.descripcion || 'Miembro del equipo VRTon'}</p>
            </div>
        `;

        container.appendChild(card);
    });
}

/**
 * Configura los filtros de categorías para los colaboradores
 */
function configurarFiltrosCategorias() {
    const botonesCategorias = document.querySelectorAll('.categoria-selector');

    botonesCategorias.forEach(boton => {
        boton.addEventListener('click', () => {
            // Actualizar clases activas
            botonesCategorias.forEach(b => b.classList.remove('active'));
            boton.classList.add('active');

            // Filtrar colaboradores
            const categoriaSeleccionada = boton.getAttribute('data-category');
            filtrarColaboradoresPorCategoria(categoriaSeleccionada);
        });
    });
}

/**
 * Filtra las tarjetas de colaboradores según la categoría seleccionada
 * @param {string} categoria - Categoría a filtrar ('todos' para mostrar todos)
 */
function filtrarColaboradoresPorCategoria(categoria) {
    const tarjetas = document.querySelectorAll('.colaborador-card');

    tarjetas.forEach(tarjeta => {
        if (categoria === 'todos' || tarjeta.getAttribute('data-categoria') === categoria) {
            tarjeta.style.display = 'block';
        } else {
            tarjeta.style.display = 'none';
        }
    });
}

/**
 * Muestra un mensaje de error cuando no se pueden cargar los colaboradores
 */
function mostrarMensajeError() {
    const container = document.getElementById('colaboradores-container');
    container.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <p>No se pudieron cargar los colaboradores. Por favor, intenta de nuevo más tarde.</p>
        </div>
    `;
}

/**
 * Configura el comportamiento del header al hacer scroll
 */
function configurarHeaderScroll() {
    const header = document.querySelector('header');
    const heroVideo = document.querySelector('.hero-video');

    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
}
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar tarjetas de proyectos para animarlas
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });

    // Clase para elementos visibles (usada por el observer)
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            .visible {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        </style>
    `);
});
