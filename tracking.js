// Configuración de tracking y analytics para VRTon
// Este archivo debe incluirse en todas las páginas para tracking unificado

(function() {
    'use strict';
    
    // Configuración de Google Analytics 4 (reemplazar con tu ID real)
    const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Reemplazar con tu ID real
    
    // Configuración de Facebook Pixel (opcional)
    const FB_PIXEL_ID = 'XXXXXXXXXX'; // Reemplazar con tu ID real
    
    // Configuración de hotjar (opcional)
    const HOTJAR_ID = 'XXXXXXX'; // Reemplazar con tu ID real
    
    // Función para cargar Google Analytics
    function loadGoogleAnalytics() {
        if (GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
            console.log('Google Analytics no configurado');
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
        gtag('config', GA_MEASUREMENT_ID, {
            anonymize_ip: true, // GDPR compliance
            allow_google_signals: false, // GDPR compliance
            allow_ad_personalization_signals: false // GDPR compliance
        });
        
        // Hacer gtag disponible globalmente
        window.gtag = gtag;
        
        console.log('Google Analytics cargado');
    }
    
    // Función para cargar Facebook Pixel
    function loadFacebookPixel() {
        if (FB_PIXEL_ID === 'XXXXXXXXXX') {
            console.log('Facebook Pixel no configurado');
            return;
        }
        
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        
        fbq('init', FB_PIXEL_ID);
        fbq('track', 'PageView');
        
        console.log('Facebook Pixel cargado');
    }
    
    // Función para cargar Hotjar
    function loadHotjar() {
        if (HOTJAR_ID === 'XXXXXXX') {
            console.log('Hotjar no configurado');
            return;
        }
        
        (function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid: HOTJAR_ID, hjsv:6};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
        
        console.log('Hotjar cargado');
    }
    
    // Función para tracking de eventos personalizados
    function trackEvent(eventName, parameters = {}) {
        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, parameters);
        }
        
        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', eventName, parameters);
        }
        
        console.log('Evento tracked:', eventName, parameters);
    }
    
    // Función para tracking de scroll depth
    function initScrollTracking() {
        let scrollDepths = [25, 50, 75, 90];
        let scrollTracked = [];
        
        function trackScrollDepth() {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );
            
            scrollDepths.forEach(depth => {
                if (scrollPercent >= depth && !scrollTracked.includes(depth)) {
                    scrollTracked.push(depth);
                    trackEvent('scroll_depth', {
                        scroll_depth: depth,
                        page_url: window.location.pathname
                    });
                }
            });
        }
        
        // Throttle scroll events
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
    
    // Función para tracking de clicks en enlaces externos
    function initLinkTracking() {
        document.addEventListener('click', function(e) {
            const link = e.target.closest('a');
            if (!link) return;
            
            const href = link.getAttribute('href');
            if (!href) return;
            
            // Enlaces externos
            if (href.startsWith('http') && !href.includes(window.location.hostname)) {
                trackEvent('external_link_click', {
                    link_url: href,
                    link_text: link.textContent.trim(),
                    source_page: window.location.pathname
                });
            }
            
            // Enlaces a Discord
            if (href.includes('discord.gg')) {
                trackEvent('discord_click', {
                    link_url: href,
                    source_page: window.location.pathname
                });
            }
            
            // Enlaces a redes sociales
            if (href.includes('instagram.com') || href.includes('twitter.com') || 
                href.includes('x.com') || href.includes('youtube.com') || 
                href.includes('tiktok.com')) {
                trackEvent('social_media_click', {
                    platform: getSocialPlatform(href),
                    link_url: href,
                    source_page: window.location.pathname
                });
            }
        });
    }
    
    // Función para identificar plataforma social
    function getSocialPlatform(url) {
        if (url.includes('instagram.com')) return 'instagram';
        if (url.includes('twitter.com') || url.includes('x.com')) return 'twitter';
        if (url.includes('youtube.com')) return 'youtube';
        if (url.includes('tiktok.com')) return 'tiktok';
        if (url.includes('discord.gg')) return 'discord';
        return 'unknown';
    }
    
    // Función para tracking de tiempo en página
    function initTimeTracking() {
        const startTime = Date.now();
        let timeOnPage = 0;
        
        // Track time every 30 seconds
        const timeInterval = setInterval(() => {
            timeOnPage += 30;
            
            // Track milestone times
            if ([30, 60, 120, 300].includes(timeOnPage)) {
                trackEvent('time_on_page', {
                    time_seconds: timeOnPage,
                    page_url: window.location.pathname
                });
            }
        }, 30000);
        
        // Track time when leaving page
        window.addEventListener('beforeunload', () => {
            const totalTime = Math.round((Date.now() - startTime) / 1000);
            trackEvent('page_exit', {
                time_on_page: totalTime,
                page_url: window.location.pathname
            });
            clearInterval(timeInterval);
        });
    }
    
    // Función para verificar consentimiento GDPR (básico)
    function hasGDPRConsent() {
        // Implementar lógica de consentimiento aquí
        // Por ahora, asumimos consentimiento para analytics básicos
        return true;
    }
    
    // Función principal de inicialización
    function initTracking() {
        if (!hasGDPRConsent()) {
            console.log('Tracking deshabilitado - Sin consentimiento GDPR');
            return;
        }
        
        // Cargar herramientas de tracking
        loadGoogleAnalytics();
        loadFacebookPixel();
        loadHotjar();
        
        // Inicializar tracking de eventos
        initScrollTracking();
        initLinkTracking();
        initTimeTracking();
        
        // Track page view inicial
        setTimeout(() => {
            trackEvent('page_view', {
                page_title: document.title,
                page_url: window.location.pathname,
                page_location: window.location.href
            });
        }, 1000);
        
        console.log('Sistema de tracking inicializado');
    }
    
    // Exponer funciones globalmente para uso manual
    window.VRTonTracking = {
        trackEvent: trackEvent,
        trackCustomEvent: function(name, data) {
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
