// Sistema de internacionalización para VRTon
class I18n {
    constructor() {
        this.currentLanguage = localStorage.getItem('vrton-language') || 'es';
        this.translations = {};
        this.isInitialized = false;
        this.init();
    }

    async init() {
        try {
            const response = await fetch('data/translations.json');
            this.translations = await response.json();
            this.updateContent();
            this.updateLanguageSelector();
            
            // Notificar que i18n está completamente inicializado
            this.isInitialized = true;
            if (window.onI18nReady) {
                window.onI18nReady();
            }
            
            console.log('i18n fully initialized with translations');
        } catch (error) {
            console.error('Error loading translations:', error);
            // Still notify even on error to prevent infinite loading
            if (window.onI18nReady) {
                window.onI18nReady();
            }
        }
    }

    setLanguage(lang) {
        console.log('setLanguage called with:', lang);
        console.log('Available translations:', Object.keys(this.translations));
        console.log('Is initialized:', this.isInitialized);
        
        if (this.translations[lang]) {
            this.currentLanguage = lang;
            localStorage.setItem('vrton-language', lang);
            this.updateContent();
            this.updateLanguageSelector();
            
            // Actualizar el atributo lang del documento
            document.documentElement.lang = lang === 'es' ? 'es' : 'en';
            
            console.log('Language successfully changed to:', lang);
        } else {
            console.error('Language not found in translations:', lang);
        }
    }

    getText(key) {
        const keys = key.split('.');
        let value = this.translations[this.currentLanguage];
        
        for (const k of keys) {
            if (value && value[k]) {
                value = value[k];
            } else {
                return key; // Fallback al key si no se encuentra la traducción
            }
        }
        
        return value;
    }

    updateContent() {
        // Actualizar todos los elementos con data-i18n
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (key) {
                const text = this.getText(key);
                if (text !== key) { // Solo actualizar si encontramos la traducción
                    element.textContent = text;
                }
            }
        });
        
        // Actualizar lista de proyectos
        const projectsList = document.querySelector('[data-i18n-list="causa.projects"]');
        if (projectsList) {
            const projects = this.getText('causa.projects');
            if (Array.isArray(projects)) {
                projectsList.innerHTML = projects.map(project => 
                    `<li><i class="fas fa-check-circle"></i> ${project}</li>`
                ).join('');
            }
        }

        // Generar FAQs dinámicamente
        this.generateFAQs();
        
        // Actualizar meta tags para SEO
        this.updateMetaTags();
    }

    updateElement(selector, key) {
        const element = document.querySelector(selector);
        if (element) {
            const text = this.getText(key);
            if (element.tagName === 'INPUT' && element.type === 'button') {
                element.value = text;
            } else {
                element.textContent = text;
            }
        }
    }

    generateFAQs() {
        const faqContainer = document.querySelector('.faq-container');
        if (faqContainer) {
            const faqs = this.getText('faqs.questions');
            if (Array.isArray(faqs) && faqs.length > 0) {
                faqContainer.innerHTML = faqs.map((faq, index) => `
                    <div class="faq-item" itemscope itemtype="https://schema.org/Question">
                        <div class="faq-question" role="button" tabindex="0" aria-expanded="false" aria-controls="faq${index + 1}">
                            <h3 itemprop="name">${faq.question}</h3>
                            <i class="fas fa-chevron-down" aria-hidden="true"></i>
                        </div>
                        <div class="faq-answer" id="faq${index + 1}" itemscope itemtype="https://schema.org/Answer">
                            <div itemprop="text">
                                <p>${faq.answer}</p>
                            </div>
                        </div>
                    </div>
                `).join('');
                
                // Reinicializar funcionalidad de FAQs
                this.initializeFAQs();
            } else {
                console.warn('No FAQ questions found in translations');
            }
        } else {
            console.warn('FAQ container not found in page');
        }
    }

    initializeFAQs() {
        const faqQuestions = document.querySelectorAll('.faq-question');
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const answer = question.nextElementSibling;
                const icon = question.querySelector('i');
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                
                // Cerrar todas las FAQs
                faqQuestions.forEach(q => {
                    q.setAttribute('aria-expanded', 'false');
                    q.nextElementSibling.style.maxHeight = null;
                    q.querySelector('i').style.transform = 'rotate(0deg)';
                });
                
                // Abrir la FAQ actual si no estaba expandida
                if (!isExpanded) {
                    question.setAttribute('aria-expanded', 'true');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    icon.style.transform = 'rotate(180deg)';
                }
            });
        });
    }

    updateLanguageSelector() {
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.lang === this.currentLanguage) {
                btn.classList.add('active');
            }
        });
    }

    updateMetaTags() {
        const titleElement = document.querySelector('title');
        const descriptionMeta = document.querySelector('meta[name="description"]');
        const keywordsMeta = document.querySelector('meta[name="keywords"]');
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogDescription = document.querySelector('meta[property="og:description"]');
        const twitterTitle = document.querySelector('meta[property="twitter:title"]');
        const twitterDescription = document.querySelector('meta[property="twitter:description"]');
        const htmlLang = document.querySelector('html');
        
        if (this.currentLanguage === 'en') {
            // Update main page meta tags for English
            if (titleElement && window.location.pathname === '/' || window.location.pathname.includes('index.html')) {
                titleElement.textContent = 'VRTon - Virtual Reality for Social Causes | Teletón Chile 2025 | Non-Profit Organization';
            } else if (titleElement && window.location.pathname.includes('colaboradores')) {
                titleElement.textContent = 'Our Multidisciplinary Team - VRTon Collaborators | Virtual Reality Professionals for Social Causes';
            }
            
            if (descriptionMeta && window.location.pathname === '/' || window.location.pathname.includes('index.html')) {
                descriptionMeta.setAttribute('content', 'VRTon - Non-profit organization using virtual reality to create positive social impact. Supporting Teletón Chile 2025. Join our VR solidarity community.');
            } else if (descriptionMeta && window.location.pathname.includes('colaboradores')) {
                descriptionMeta.setAttribute('content', 'Meet VRTon\'s incredible multidisciplinary team: developers, 2D/3D designers, audiovisuals, marketing, moderators and professionals committed to virtual reality for social causes.');
            }
            
            if (keywordsMeta && window.location.pathname === '/' || window.location.pathname.includes('index.html')) {
                keywordsMeta.setAttribute('content', 'virtual reality, VR, non-profit organization, social change, immersive education, VR therapies, social technology, positive impact, social causes, Teletón Chile, VRChat, charity events, fundraising, disability, rehabilitation, VRTon 2025');
            }
            
            // Update Open Graph
            if (ogTitle) {
                ogTitle.setAttribute('content', window.location.pathname.includes('colaboradores') ? 
                'Our Multidisciplinary Team - VRTon Collaborators | Virtual Reality Professionals' : 
                'VRTon - Virtual Reality for Social Causes | Supporting Teletón Chile 2025');
            }
            
            if (ogDescription) {
                ogDescription.setAttribute('content', window.location.pathname.includes('colaboradores') ? 
                'Meet the professionals who make VRTon possible: developers, designers, audiovisuals and moderators committed to social change through virtual reality.' : 
                'Non-profit organization transforming virtual reality into social change. Join VRTon 2025 and help raise funds for Teletón Chile through immersive VR events.');
            }
            
            // Update Twitter Cards
            if (twitterTitle) {
                twitterTitle.setAttribute('content', window.location.pathname.includes('colaboradores') ? 
                'Our Multidisciplinary Team - VRTon Collaborators | Virtual Reality Professionals' : 
                'VRTon - Virtual Reality for Social Causes | Supporting Teletón Chile 2025');
            }
            
            if (twitterDescription) {
                twitterDescription.setAttribute('content', window.location.pathname.includes('colaboradores') ? 
                'Meet the professionals who make VRTon possible: developers, designers, audiovisuals and moderators committed to social change.' : 
                'Non-profit organization transforming virtual reality into social change. Join VRTon 2025 and help raise funds for Teletón Chile.');
            }
            
            if (htmlLang) {
                htmlLang.setAttribute('lang', 'en');
            }
        } else {
            // Update main page meta tags for Spanish
            if (titleElement && window.location.pathname === '/' || window.location.pathname.includes('index.html')) {
                titleElement.textContent = 'VRTon - Realidad Virtual para Causas Sociales | Teletón Chile 2025 | Organización Sin Ánimo de Lucro';
            } else if (titleElement && window.location.pathname.includes('colaboradores')) {
                titleElement.textContent = 'Nuestro Equipo Multidisciplinario - Colaboradores VRTon | Profesionales en Realidad Virtual para Causas Sociales';
            }
            
            if (descriptionMeta && window.location.pathname === '/' || window.location.pathname.includes('index.html')) {
                descriptionMeta.setAttribute('content', 'VRTon - Organización sin ánimo de lucro que utiliza realidad virtual para crear impacto social positivo. Apoyamos la Teletón Chile 2025. Únete a nuestra comunidad VR solidaria.');
            } else if (descriptionMeta && window.location.pathname.includes('colaboradores')) {
                descriptionMeta.setAttribute('content', 'Conoce al increíble equipo multidisciplinario de VRTon: desarrolladores, diseñadores 2D/3D, audiovisuales, marketing, moderadores y más profesionales comprometidos con la realidad virtual para causas sociales.');
            }
            
            if (keywordsMeta && window.location.pathname === '/' || window.location.pathname.includes('index.html')) {
                keywordsMeta.setAttribute('content', 'realidad virtual, VR, organización sin lucro, cambio social, educación inmersiva, terapias VR, tecnología social, impacto positivo, causas sociales, Teletón Chile, VRChat, eventos solidarios, recaudación fondos, discapacidad, rehabilitación, VRTon 2025');
            }
            
            // Update Open Graph
            if (ogTitle) {
                ogTitle.setAttribute('content', window.location.pathname.includes('colaboradores') ? 
                'Nuestro Equipo Multidisciplinario - Colaboradores VRTon | Profesionales en Realidad Virtual' : 
                'VRTon - Realidad Virtual para Causas Sociales | Apoyamos Teletón Chile 2025');
            }
            
            if (ogDescription) {
                ogDescription.setAttribute('content', window.location.pathname.includes('colaboradores') ? 
                'Conoce a los profesionales que hacen posible VRTon: desarrolladores, diseñadores, audiovisuales y moderadores comprometidos con el cambio social a través de la realidad virtual.' : 
                'Organización sin ánimo de lucro que transforma la realidad virtual en cambio social. Únete a VRTon 2025 y ayuda a recaudar fondos para la Teletón Chile a través de eventos inmersivos en VR.');
            }
            
            // Update Twitter Cards
            if (twitterTitle) {
                twitterTitle.setAttribute('content', window.location.pathname.includes('colaboradores') ? 
                'Nuestro Equipo Multidisciplinario - Colaboradores VRTon | Profesionales en Realidad Virtual' : 
                'VRTon - Realidad Virtual para Causas Sociales | Apoyamos Teletón Chile 2025');
            }
            
            if (twitterDescription) {
                twitterDescription.setAttribute('content', window.location.pathname.includes('colaboradores') ? 
                'Conoce a los profesionales que hacen posible VRTon: desarrolladores, diseñadores, audiovisuales y moderadores comprometidos con el cambio social.' : 
                'Organización sin ánimo de lucro que transforma la realidad virtual en cambio social. Únete a VRTon 2025 y ayuda a recaudar fondos para la Teletón Chile.');
            }
            
            if (htmlLang) {
                htmlLang.setAttribute('lang', 'es');
            }
        }
        
        // Update hreflang attributes
        this.updateHreflangTags();
    }
    
    updateHreflangTags() {
        // Remove existing hreflang tags
        document.querySelectorAll('link[hreflang]').forEach(link => link.remove());
        
        // Add new hreflang tags
        const head = document.head;
        const currentPath = window.location.pathname;
        const baseUrl = 'https://vrton.org';
        
        // Spanish version
        const esLink = document.createElement('link');
        esLink.rel = 'alternate';
        esLink.hreflang = 'es';
        esLink.href = baseUrl + currentPath;
        head.appendChild(esLink);
        
        // English version  
        const enLink = document.createElement('link');
        enLink.rel = 'alternate';
        enLink.hreflang = 'en';
        enLink.href = baseUrl + currentPath + (currentPath.includes('?') ? '&' : '?') + 'lang=en';
        head.appendChild(enLink);
        
        // x-default (fallback)
        const defaultLink = document.createElement('link');
        defaultLink.rel = 'alternate';
        defaultLink.hreflang = 'x-default';
        defaultLink.href = baseUrl + currentPath;
        head.appendChild(defaultLink);
    }
}

// Inicializar el sistema de internacionalización
let i18n;

document.addEventListener('DOMContentLoaded', () => {
    i18n = new I18n();
    // Hacer disponible globalmente inmediatamente
    window.i18n = i18n;
    console.log('i18n initialized and exposed globally');
});

// Exportar para uso global
window.i18n = i18n;
