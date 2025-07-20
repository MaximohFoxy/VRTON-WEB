// Sistema de internacionalización para VRTon
class I18n {
    constructor() {
        this.currentLanguage = localStorage.getItem('vrton-language') || 'es';
        this.translations = {};
        this.init();
    }

    async init() {
        try {
            const response = await fetch('data/translations.json');
            this.translations = await response.json();
            this.updateContent();
            this.updateLanguageSelector();
        } catch (error) {
            console.error('Error loading translations:', error);
        }
    }

    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLanguage = lang;
            localStorage.setItem('vrton-language', lang);
            this.updateContent();
            this.updateLanguageSelector();
            
            // Actualizar el atributo lang del documento
            document.documentElement.lang = lang === 'es' ? 'es' : 'en';
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
        // Actualizar navegación
        this.updateElement('[data-i18n="nav.inicio"]', 'nav.inicio');
        this.updateElement('[data-i18n="nav.colaboradores"]', 'nav.colaboradores');
        this.updateElement('[data-i18n="nav.contacto"]', 'nav.contacto');

        // Actualizar header
        this.updateElement('[data-i18n="header.fundraising"]', 'header.fundraising');

        // Actualizar hero
        this.updateElement('[data-i18n="hero.title"]', 'hero.title');
        this.updateElement('[data-i18n="hero.subtitle"]', 'hero.subtitle');
        this.updateElement('[data-i18n="hero.description"]', 'hero.description');
        this.updateElement('[data-i18n="hero.button"]', 'hero.button');

        // Actualizar causa
        this.updateElement('[data-i18n="causa.title"]', 'causa.title');
        this.updateElement('[data-i18n="causa.description1"]', 'causa.description1');
        this.updateElement('[data-i18n="causa.description2"]', 'causa.description2');
        
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

        // Actualizar FAQs
        this.updateElement('[data-i18n="faqs.title"]', 'faqs.title');
        this.updateFAQs();

        // Actualizar contacto
        this.updateElement('[data-i18n="contacto.title"]', 'contacto.title');
        this.updateElement('[data-i18n="contacto.community"]', 'contacto.community');
        this.updateElement('[data-i18n="contacto.description"]', 'contacto.description');
        this.updateElement('[data-i18n="contacto.button"]', 'contacto.button');

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

    updateFAQs() {
        const faqContainer = document.querySelector('.faq-container');
        if (faqContainer) {
            const faqs = this.getText('faqs.questions');
            if (Array.isArray(faqs)) {
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
            }
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
        
        if (this.currentLanguage === 'en') {
            if (titleElement) {
                titleElement.textContent = 'VRTon - Virtual Reality for Social Causes | Non-Profit Organization';
            }
            if (descriptionMeta) {
                descriptionMeta.setAttribute('content', 'VRTon - Non-profit organization that uses virtual reality to create positive social impact. Immersive education, innovative therapies and social change through VR technology.');
            }
        } else {
            if (titleElement) {
                titleElement.textContent = 'VRTon - Realidad Virtual para Causas Sociales | Organización Sin Ánimo de Lucro';
            }
            if (descriptionMeta) {
                descriptionMeta.setAttribute('content', 'VRTon - Organización sin ánimo de lucro que utiliza realidad virtual para crear impacto social positivo. Educación inmersiva, terapias innovadoras y cambio social a través de la tecnología VR.');
            }
        }
    }
}

// Inicializar el sistema de internacionalización
let i18n;

document.addEventListener('DOMContentLoaded', () => {
    i18n = new I18n();
});

// Exportar para uso global
window.i18n = i18n;
