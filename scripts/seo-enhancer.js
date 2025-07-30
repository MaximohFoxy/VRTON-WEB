// SEO Enhancement Script for VRTon
// This script provides additional SEO optimizations and monitoring

class SEOEnhancer {
    constructor() {
        this.init();
    }

    init() {
        // Only run in browser environment
        if (typeof window === 'undefined') return;
        
        this.addStructuredDataForCurrentPage();
        this.optimizeImages();
        this.addBreadcrumbs();
        this.monitorPagePerformance();
        this.enhanceAccessibility();
        this.setupSocialMediaTracking();
    }

    addStructuredDataForCurrentPage() {
        const currentPath = window.location.pathname;
        
        // Add FAQ structured data for index page
        if (currentPath === '/' || currentPath.includes('index.html')) {
            this.addFAQStructuredData();
            this.addEventStructuredData();
        }
        
        // Add Team structured data for colaboradores page
        if (currentPath.includes('colaboradores')) {
            this.addTeamStructuredData();
        }
    }

    addFAQStructuredData() {
        const faqData = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "¿Quién y cómo puede participar en la VRTon?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Toda aquella persona o comunidad que quiera ayudar a organizar la VRTon es bienvenida, siempre respetando el hecho de hacerlo sin fines de lucro. Si estás interesado en participar como voluntario dirígete a nuestro canal de Discord."
                    }
                },
                {
                    "@type": "Question", 
                    "name": "¿Para qué serán los fondos recaudados este año? ¿Qué es la Teletón?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Por tercer año consecutivo estaremos juntando fondos para la Teletón Chile. La Teletón es una campaña benéfica que se realiza en varios países con el objetivo de recaudar fondos para ayudar a personas con discapacidad, principalmente a través de centros de rehabilitación y programas de inclusión."
                    }
                },
                {
                    "@type": "Question",
                    "name": "¿Esto es transparente? ¿A dónde va el dinero?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Para maximizar la transparencia todas las donaciones se harán a través de los medios oficiales de la Teletón, sin ningún tipo de intermediario de nuestra parte."
                    }
                }
            ]
        };

        this.injectStructuredData(faqData, 'faq-schema');
    }

    addEventStructuredData() {
        const eventData = {
            "@context": "https://schema.org",
            "@type": "Event",
            "name": "VRTon 2025",
            "description": "Evento anual de realidad virtual para recaudar fondos para la Teletón Chile. Actividades dentro y fuera de VRChat, juegos, shows en vivo y más.",
            "startDate": "2025-12-01",
            "endDate": "2025-12-02",
            "eventStatus": "https://schema.org/EventScheduled",
            "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
            "location": {
                "@type": "VirtualLocation",
                "url": "https://discord.gg/gSCsPKTsVJ",
                "name": "VRChat y Discord"
            },
            "organizer": {
                "@type": "Organization",
                "name": "VRTon",
                "url": "https://vrton.org"
            },
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "CLP",
                "availability": "https://schema.org/InStock",
                "url": "https://discord.gg/gSCsPKTsVJ"
            },
            "image": "https://vrton.org/assets/icons/icon-512x512.webp"
        };

        this.injectStructuredData(eventData, 'event-schema');
    }

    addTeamStructuredData() {
        const teamData = {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "VRTon",
            "url": "https://vrton.org",
            "employee": [
                {
                    "@type": "OrganizationRole",
                    "roleName": "Director",
                    "description": "Equipo encargado de la toma de decisiones estratégicas y supervisión"
                },
                {
                    "@type": "OrganizationRole",
                    "roleName": "Desarrollador",
                    "description": "Encargados de la creación de webs, aplicaciones y herramientas VR"
                },
                {
                    "@type": "OrganizationRole",
                    "roleName": "Diseñador",
                    "description": "Especialistas en diseño 2D y 3D para entornos virtuales"
                }
            ]
        };

        this.injectStructuredData(teamData, 'team-schema');
    }

    injectStructuredData(data, id) {
        // Remove existing script with same ID
        const existing = document.getElementById(id);
        if (existing) existing.remove();

        // Create and inject new structured data
        const script = document.createElement('script');
        script.id = id;
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(data);
        document.head.appendChild(script);
    }

    optimizeImages() {
        // Add loading="lazy" to images below the fold
        const images = document.querySelectorAll('img');
        images.forEach((img, index) => {
            // Skip first 2 images (likely above the fold)
            if (index > 1 && !img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            // Add alt text if missing
            if (!img.hasAttribute('alt')) {
                img.setAttribute('alt', 'Imagen de VRTon - Realidad Virtual para Causas Sociales');
            }
            
            // Add width and height if missing (prevents CLS)
            if (!img.hasAttribute('width') && !img.hasAttribute('height')) {
                // Get natural dimensions when image loads
                img.onload = function() {
                    if (!this.hasAttribute('width')) {
                        this.setAttribute('width', this.naturalWidth);
                        this.setAttribute('height', this.naturalHeight);
                    }
                };
            }
        });
    }

    addBreadcrumbs() {
        const currentPath = window.location.pathname;
        let breadcrumbData = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Inicio",
                    "item": "https://vrton.org/"
                }
            ]
        };

        if (currentPath.includes('colaboradores')) {
            breadcrumbData.itemListElement.push({
                "@type": "ListItem",
                "position": 2,
                "name": "Colaboradores",
                "item": "https://vrton.org/colaboradores.html"
            });
        }

        this.injectStructuredData(breadcrumbData, 'breadcrumb-schema');
    }

    monitorPagePerformance() {
        // Monitor Core Web Vitals for SEO
        if ('PerformanceObserver' in window) {
            // Largest Contentful Paint
            new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                if (lastEntry.startTime > 2500) {
                    console.warn('SEO Warning: LCP is above 2.5s:', lastEntry.startTime);
                }
            }).observe({ entryTypes: ['largest-contentful-paint'] });

            // Cumulative Layout Shift
            let clsScore = 0;
            new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (!entry.hadRecentInput) {
                        clsScore += entry.value;
                    }
                });
                if (clsScore > 0.1) {
                    console.warn('SEO Warning: CLS is above 0.1:', clsScore);
                }
            }).observe({ entryTypes: ['layout-shift'] });
            
            // Monitor font loading performance
            this.monitorFontLoading();
        }
    }
    
    monitorFontLoading() {
        // Monitor font loading with font-display: swap
        if ('fonts' in document) {
            // Check if fonts are loaded
            document.fonts.ready.then(() => {
                console.log('✅ All fonts loaded successfully with font-display: swap');
            });
            
            // Monitor individual font loads
            document.fonts.addEventListener('loadingdone', (event) => {
                console.log(`🔤 Font loaded: ${event.fontface.family}`);
            });
            
            document.fonts.addEventListener('loadingerror', (event) => {
                console.warn(`⚠️ Font loading error: ${event.fontface.family}`);
            });
        }
        
        // Check for FOIT (Flash of Invisible Text) issues
        const textElements = document.querySelectorAll('h1, h2, h3, p, span, div');
        textElements.forEach(element => {
            const computedStyle = window.getComputedStyle(element);
            if (computedStyle.fontFamily.includes('Font Awesome')) {
                // Ensure icons have fallback content
                if (!element.textContent.trim() && !element.getAttribute('aria-label')) {
                    element.setAttribute('aria-label', 'Icono');
                }
            }
        });
    }

    enhanceAccessibility() {
        // Add ARIA labels to interactive elements without them
        const buttons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
        buttons.forEach(button => {
            if (!button.textContent.trim()) {
                button.setAttribute('aria-label', 'Botón interactivo');
            }
        });

        // Add roles to navigation elements
        const navs = document.querySelectorAll('nav:not([role])');
        navs.forEach(nav => {
            nav.setAttribute('role', 'navigation');
        });

        // Ensure all links have meaningful text
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            const linkText = link.textContent.trim();
            if (!linkText && !link.getAttribute('aria-label')) {
                link.setAttribute('aria-label', 'Enlace de VRTon');
            }
        });
    }

    setupSocialMediaTracking() {
        // Track social media interactions for SEO insights
        const socialLinks = document.querySelectorAll('a[href*="discord.gg"], a[href*="instagram.com"], a[href*="x.com"], a[href*="youtube.com"], a[href*="tiktok.com"]');
        
        socialLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const platform = this.getSocialPlatform(link.href);
                
                // Send to analytics if available
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'social_interaction', {
                        'social_network': platform,
                        'social_action': 'click',
                        'social_target': link.href
                    });
                }
                
                console.log(`Social media interaction: ${platform}`);
            });
        });
    }

    getSocialPlatform(url) {
        if (url.includes('discord.gg')) return 'Discord';
        if (url.includes('instagram.com')) return 'Instagram';
        if (url.includes('x.com')) return 'X (Twitter)';
        if (url.includes('youtube.com')) return 'YouTube';
        if (url.includes('tiktok.com')) return 'TikTok';
        return 'Unknown';
    }

    // Public method to update meta tags dynamically
    updatePageMeta(title, description, keywords) {
        document.title = title;
        
        const descMeta = document.querySelector('meta[name="description"]');
        if (descMeta) descMeta.setAttribute('content', description);
        
        const keywordsMeta = document.querySelector('meta[name="keywords"]');
        if (keywordsMeta) keywordsMeta.setAttribute('content', keywords);
        
        // Update Open Graph
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute('content', title);
        
        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) ogDesc.setAttribute('content', description);
        
        // Update Twitter Cards
        const twitterTitle = document.querySelector('meta[property="twitter:title"]');
        if (twitterTitle) twitterTitle.setAttribute('content', title);
        
        const twitterDesc = document.querySelector('meta[property="twitter:description"]');
        if (twitterDesc) twitterDesc.setAttribute('content', description);
    }
}

// Initialize SEO enhancements when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.seoEnhancer = new SEOEnhancer();
    });
} else {
    window.seoEnhancer = new SEOEnhancer();
}

// Export for use in other scripts (browser compatible)
window.SEOEnhancer = SEOEnhancer;
