// Componente para cargar header y footer en todas las páginas

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

// Función para cargar y reemplazar un placeholder
async function loadComponentReplace(url, placeholderSelector) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        const placeholder = document.querySelector(placeholderSelector);
        if (placeholder) {
            placeholder.outerHTML = html;
        }
    } catch (error) {
        console.error(`Error loading component from ${url}:`, error);
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    console.log('Components.js: DOMContentLoaded event fired');
    
    // Cargar header si hay un contenedor específico para él
    if (document.getElementById('header-container')) {
        console.log('Loading header into header-container');
        await loadComponent('includes/header.html', 'header-container');
    } else if (document.getElementById('header-placeholder')) {
        console.log('Loading header by replacing placeholder');
        // Reemplazar el placeholder del header
        try {
            const response = await fetch('includes/header.html');
            if (response.ok) {
                const html = await response.text();
                const placeholder = document.getElementById('header-placeholder');
                if (placeholder) {
                    placeholder.outerHTML = html;
                    console.log('Header loaded successfully');
                } else {
                    console.error('Header placeholder not found');
                }
            } else {
                console.error('Failed to fetch header:', response.status);
            }
        } catch (error) {
            console.error('Error loading header:', error);
        }
    } else {
        console.log('No header container or placeholder found');
    }

    // Cargar footer - primero intentar con placeholder, luego con fallback
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        console.log('Loading footer using footer placeholder');
        try {
            const response = await fetch('includes/footer.html');
            if (response.ok) {
                const footerContent = await response.text();
                footerPlaceholder.outerHTML = footerContent;
                console.log('Footer loaded successfully using placeholder');
            } else {
                console.error('Failed to fetch footer:', response.status);
            }
        } catch (error) {
            console.error('Error loading footer via placeholder:', error);
        }
    } else {
        // Fallback: cargar footer después del último section o main
        const lastSection = document.querySelector('section:last-of-type');
        const lastMain = document.querySelector('main:last-of-type');
        const targetElement = lastMain || lastSection;
        
        if (targetElement) {
            console.log('Loading footer after last element (fallback method)');
            const selector = lastMain ? 'main:last-of-type' : 'section:last-of-type';
            await loadComponentAfter('includes/footer.html', selector);
            console.log('Footer loaded successfully using fallback');
        } else {
            console.log('No suitable element found for footer placement');
        }
    }

    // Inicializar componentes después de cargar
    setTimeout(() => {
        console.log('Initializing header/footer components');
        initializeHeaderFooterComponents();
    }, 100);

    // Llamar a onComponentsReady si existe (callback para cuando los componentes están listos)
    if (typeof window.onComponentsReady === 'function') {
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
    }

    // Reinicializar el selector de idioma si existe
    const languageBtn = document.getElementById('language-btn');
    const languageOptions = document.getElementById('language-options');
    
    if (languageBtn && languageOptions) {
        // Eliminar event listeners existentes si los hay
        languageBtn.replaceWith(languageBtn.cloneNode(true));
        const newLanguageBtn = document.getElementById('language-btn');
        
        newLanguageBtn.addEventListener('click', function() {
            languageOptions.classList.toggle('show');
        });

        // Cerrar selector al hacer clic fuera
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.language-selector')) {
                languageOptions.classList.remove('show');
            }
        });

        // Manejar clicks en las opciones de idioma
        const languageOptionsItems = languageOptions.querySelectorAll('a');
        languageOptionsItems.forEach(option => {
            option.addEventListener('click', function(e) {
                e.preventDefault();
                const lang = this.getAttribute('data-lang');
                if (typeof window.switchLanguage === 'function') {
                    window.switchLanguage(lang);
                }
                languageOptions.classList.remove('show');
            });
        });
    }

    // Actualizar navegación activa
    const currentPage = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && currentPage.includes(href)) {
            link.classList.add('active');
        }
    });
}

// Exportar funciones para uso global si es necesario
window.loadComponent = loadComponent;
window.loadComponentBefore = loadComponentBefore;
window.loadComponentAfter = loadComponentAfter;
window.loadComponentReplace = loadComponentReplace;
window.initializeHeaderFooterComponents = initializeHeaderFooterComponents;
