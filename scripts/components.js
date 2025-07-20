// Componente para cargar header y footer en todas las páginas
document.addEventListener('DOMContentLoaded', async function() {
    
    // Función para cargar un componente HTML
    async function loadComponent(url, containerId) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = html;
            }
        } catch (error) {
            console.error(`Error loading component from ${url}:`, error);
        }
    }
    
    // Función para cargar un componente y insertarlo antes de un elemento
    async function loadComponentBefore(url, targetSelector) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            const targetElement = document.querySelector(targetSelector);
            if (targetElement) {
                targetElement.insertAdjacentHTML('beforebegin', html);
            }
        } catch (error) {
            console.error(`Error loading component from ${url}:`, error);
        }
    }
    
    // Función para cargar un componente y insertarlo después de un elemento
    async function loadComponentAfter(url, targetSelector) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            const targetElement = document.querySelector(targetSelector);
            if (targetElement) {
                targetElement.insertAdjacentHTML('afterend', html);
            }
        } catch (error) {
            console.error(`Error loading component from ${url}:`, error);
        }
    }
    
    // Cargar header si hay un contenedor específico para él
    if (document.getElementById('header-container')) {
        await loadComponent('includes/header.html', 'header-container');
    } else if (document.getElementById('header-placeholder')) {
        // Reemplazar el placeholder del header
        const placeholder = document.getElementById('header-placeholder');
        const response = await fetch('includes/header.html');
        if (response.ok) {
            const html = await response.text();
            placeholder.outerHTML = html;
        }
    } else {
        // Si no hay contenedor específico, insertar al inicio del body
        await loadComponentBefore('includes/header.html', 'body > *:first-child');
    }
    
    // Cargar footer si hay un contenedor específico para él
    if (document.getElementById('footer-container')) {
        await loadComponent('includes/footer.html', 'footer-container');
    } else {
        // Si no hay contenedor específico, insertar al final del body (antes de los scripts)
        const lastScript = document.querySelector('body script:last-of-type');
        if (lastScript) {
            await loadComponentBefore('includes/footer.html', 'body script:last-of-type');
        } else {
            // Si no hay scripts, insertar al final del body
            await loadComponentAfter('includes/footer.html', 'body > *:last-child');
        }
    }
    
    // Reinicializar funcionalidades que puedan depender del header/footer
    initializeHeaderFooterComponents();
});

// Función para reinicializar componentes después de cargar header/footer
function initializeHeaderFooterComponents() {
    // Reinicializar el menú móvil si existe
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (menuToggle && navMenu) {
        // Eliminar event listeners existentes si los hay
        menuToggle.replaceWith(menuToggle.cloneNode(true));
        const newMenuToggle = document.getElementById('menu-toggle');
        
        newMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const icon = newMenuToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Cerrar menú al hacer clic en un enlace
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = newMenuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });

        // Cerrar menú al redimensionar la ventana
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                navMenu.classList.remove('active');
                const icon = newMenuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Inicializar selector de idioma
    initializeLanguageSelector();
    
    // Marcar la página actual en la navegación
    markCurrentPage();
}

// Función para inicializar el selector de idioma
function initializeLanguageSelector() {
    const langButtons = document.querySelectorAll('.lang-btn');
    
    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            const selectedLang = this.dataset.lang;
            if (window.i18n) {
                window.i18n.setLanguage(selectedLang);
            }
        });
    });
}

// Función para marcar la página actual en la navegación
function markCurrentPage() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        // Remover clases activas existentes
        link.classList.remove('active');
        
        // Saltear enlaces que son anchors (empiezan con #)
        if (link.getAttribute('href').startsWith('#')) {
            return;
        }
        
        const linkPath = new URL(link.href).pathname;
        
        // Marcar como activo si coincide la ruta
        if (linkPath === currentPath || 
            (currentPath === '/' && link.href.endsWith('/')) ||
            (currentPath.includes('colaboradores') && link.href.includes('colaboradores'))) {
            link.classList.add('active');
        }
    });
}

// Exportar funciones para uso global si es necesario
window.loadComponent = loadComponent;
window.initializeHeaderFooterComponents = initializeHeaderFooterComponents;
