// Google Analytics tracking para VRTon
// Configuración simplificada y optimizada

(function() {
    'use strict';
    
    // Configuración de Google Analytics 4 (reemplazar con tu ID real)
    const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Reemplazar con tu ID real
    
    // Función para cargar Google Analytics
    function loadGoogleAnalytics() {
        if (GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
            console.log('Google Analytics no configurado - usar ID real para activar');
            return;
        }
        
        // Cargar script de Google Analytics
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
        document.head.appendChild(script);
        
        // Configurar gtag
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        
        // Configuración con compliance GDPR
        gtag('config', GA_MEASUREMENT_ID, {
            anonymize_ip: true,
            allow_google_signals: false,
            allow_ad_personalization_signals: false,
            cookie_flags: 'max-age=7200;secure;samesite=strict'
        });
        
        // Hacer gtag disponible globalmente
        window.gtag = gtag;
        
        console.log('Google Analytics inicializado');
    }
    
    // Función para tracking de eventos personalizados
    function trackEvent(eventName, parameters = {}) {
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, parameters);
            console.log('Evento GA:', eventName, parameters);
        }
    }
    
    // Función para tracking de scroll depth
    function initScrollTracking() {
        const scrollDepths = [25, 50, 75, 90];
        const scrollTracked = [];
        
        function trackScrollDepth() {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );
            
            scrollDepths.forEach(depth => {
                if (scrollPercent >= depth && !scrollTracked.includes(depth)) {
                    scrollTracked.push(depth);
                    trackEvent('scroll', {
                        scroll_depth: depth,
                        page_location: window.location.pathname
                    });
                }
            });
        }
        
        // Throttle scroll events para performance
        let ticking = false;
        function onScroll() {
            if (!ticking) {
                requestAnimationFrame(() => {
                    trackScrollDepth();
                    ticking = false;
                });
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', onScroll, { passive: true });
    }
    
    // Función para tracking de clicks importantes
    function initClickTracking() {
        document.addEventListener('click', function(e) {
            const link = e.target.closest('a');
            if (!link) return;
            
            const href = link.getAttribute('href');
            if (!href) return;
            
            // Enlaces externos
            if (href.startsWith('http') && !href.includes(window.location.hostname)) {
                trackEvent('click', {
                    link_classes: 'external',
                    link_url: href,
                    link_text: link.textContent.trim().substring(0, 100)
                });
            }
            
            // Enlaces a Discord
            if (href.includes('discord.gg')) {
                trackEvent('click', {
                    link_classes: 'discord',
                    link_url: href
                });
            }
            
            // Enlaces a redes sociales
            const socialPlatforms = ['instagram.com', 'twitter.com', 'x.com', 'youtube.com', 'tiktok.com'];
            const socialPlatform = socialPlatforms.find(platform => href.includes(platform));
            
            if (socialPlatform) {
                trackEvent('click', {
                    link_classes: 'social',
                    link_url: href,
                    social_platform: socialPlatform.split('.')[0]
                });
            }
        });
    }
    
    // Función para verificar consentimiento básico
    function hasConsent() {
        // Implementación básica - puedes expandir con banner de cookies
        return !navigator.doNotTrack || navigator.doNotTrack !== '1';
    }
    
    // Función principal de inicialización
    function initTracking() {
        if (!hasConsent()) {
            console.log('Tracking deshabilitado - Do Not Track activado');
            return;
        }
        
        // Cargar Google Analytics
        loadGoogleAnalytics();
        
        // Esperar a que GA esté cargado antes de inicializar eventos
        setTimeout(() => {
            initScrollTracking();
            initClickTracking();
            
            // Track page view inicial
            trackEvent('page_view', {
                page_title: document.title,
                page_location: window.location.pathname
            });
        }, 1000);
        
        console.log('Sistema de tracking GA inicializado');
    }
    
    // API pública para tracking manual
    window.VRTonAnalytics = {
        track: trackEvent,
        trackCustom: function(name, data) {
            trackEvent('custom_' + name, data);
        }
    };
    
    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTracking);
    } else {
        initTracking();
    }
    
})();
