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
    
    // Notificar que los componentes están listos
    if (window.onComponentsReady) {
        window.onComponentsReady();
    }
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
            console.log('Language button clicked:', selectedLang);
            
            // Función para cambiar idioma
            const changeLanguage = () => {
                if (window.i18n && window.i18n.isInitialized) {
                    console.log('Changing language to:', selectedLang);
                    window.i18n.setLanguage(selectedLang);
                    return true;
                }
                return false;
            };
            
            // Intentar cambiar idioma inmediatamente
            if (!changeLanguage()) {
                console.log('i18n not ready, waiting for initialization...');
                
                // Callback para cuando i18n esté listo
                window.onI18nReady = () => {
                    console.log('i18n ready callback triggered');
                    changeLanguage();
                    window.onI18nReady = null; // Limpiar callback
                };
                
                // Fallback con polling si el callback no funciona
                const checkI18n = setInterval(() => {
                    if (changeLanguage()) {
                        clearInterval(checkI18n);
                        window.onI18nReady = null;
                    }
                }, 100);
                
                // Timeout después de 5 segundos
                setTimeout(() => {
                    clearInterval(checkI18n);
                    window.onI18nReady = null;
                    console.error('Failed to initialize i18n after 5 seconds');
                }, 5000);
            }
        });
    });
}

// Función para marcar la página actual en la navegación
function markCurrentPage() {
    const currentPath = window.location.pathname;
    const currentHash = window.location.hash;
    const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach(link => {
        // Remover clases activas existentes
        link.classList.remove('active');

        const linkHref = link.getAttribute('href');
        const linkPath = linkHref.includes('#') ? linkHref.split('#')[0] : linkHref;
        const linkHash = linkHref.includes('#') ? '#' + linkHref.split('#')[1] : '';

        // Verificar si estamos en la página principal (index.html o /)
        const isHomePage = currentPath === '/' || 
                         currentPath === '/index.html' || 
                         currentPath.endsWith('/index.html');

        // Verificar si el enlace apunta a la página actual
        const linkMatchesPage = linkPath === '' || 
                              linkPath === 'index.html' || 
                              new URL(link.href).pathname === currentPath;

        // Marcar como activo basado en diferentes condiciones
        if (
            // Para la página colaboradores
            (currentPath.includes('colaboradores') && linkHref.includes('colaboradores')) ||

            // Para enlaces a secciones dentro de la misma página
            (isHomePage && linkMatchesPage && linkHash && currentHash === linkHash) ||

            // Para el enlace 'Inicio' cuando estamos en la página principal sin hash
            (isHomePage && !currentHash && (linkHref === 'index.html' || linkHref === '/')) ||

            // Para otras páginas específicas
            (!isHomePage && !linkHref.includes('#') && linkMatchesPage)
        ) {
           if(linkHref != 'index.html') link.classList.add('active');
        }
    });
}

// Actualizar navegación al cambiar de sección mediante scroll
document.addEventListener('DOMContentLoaded', function() {
    // Actualizar navegación cuando cambia el hash (por ejemplo, al hacer clic en un enlace interno)
    window.addEventListener('hashchange', function() {
        markCurrentPage();
    });

    // Actualizar navegación al hacer scroll (para detectar qué sección está visible)
    let isScrolling = false;
    window.addEventListener('scroll', function() {
        if (!isScrolling) {
            isScrolling = true;
            setTimeout(function() {
                updateActiveNavOnScroll();
                isScrolling = false;
            }, 100);
        }
    });

    function updateActiveNavOnScroll() {
        aux = 0;
        // Solo ejecutar en la página principal
        const currentPath = window.location.pathname;
        const isHomePage = currentPath === '/' || 
                         currentPath === '/index.html' || 
                         currentPath.endsWith('/index.html');
        if (!isHomePage) return;

        // Obtener todas las secciones con ID
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('nav a');

        // Determinar qué sección está actualmente visible
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150; //0
            const sectionHeight = section.offsetHeight;
            aux= sectionTop + sectionHeight
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.id;
            }
        });

        // Si estamos al principio de la página, considerar que estamos en 'inicio'
        if (window.scrollY < 100) {
            currentSectionId = '';
        }

        // Actualizar clase active en los enlaces
        navLinks.forEach(link => {
            link.classList.remove('active');

            const linkHref = link.getAttribute('href');
            // Enlace de inicio
            if ((currentSectionId === '' || window.scrollY < 100) && 
                (linkHref === 'index.html' || linkHref === '/')) {
                link.classList.add('active');
            }
            // Enlaces a secciones
            else if (linkHref.includes('#' + currentSectionId) && currentSectionId != '') {
                link.classList.add('active');
            }
        });
    }
});

// Exportar funciones para uso global si es necesario
window.loadComponent = loadComponent;
window.initializeHeaderFooterComponents = initializeHeaderFooterComponents;
