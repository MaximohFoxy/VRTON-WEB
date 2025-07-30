/**
 * CSS Loading Fallback Utility
 * Ensures critical CSS files load properly with fallback mechanisms
 */

(function() {
    'use strict';
    
    /**
     * Creates a fallback CSS loader for a specific stylesheet
     * @param {string} href - The CSS file path to load
     * @param {number} timeout - Timeout in milliseconds before fallback kicks in
     */
    function createCSSFallback(href, timeout = 3000) {
        let cssLoaded = false;
        const link = document.querySelector(`link[href*="${href}"]`);
        
        if (!link) {
            console.warn(`CSS fallback: No link found for ${href}`);
            return;
        }
        
        // Track when CSS loads successfully
        link.addEventListener('load', function() { 
            cssLoaded = true; 
            console.log(`CSS loaded successfully: ${href}`);
        });
        
        // Set up fallback timer
        setTimeout(function() {
            if (!cssLoaded) {
                console.warn(`CSS fallback triggered for: ${href}`);
                const fallback = document.createElement('link');
                fallback.rel = 'stylesheet';
                fallback.href = href;
                fallback.onerror = function() {
                    console.error(`CSS fallback failed for: ${href}`);
                };
                document.head.appendChild(fallback);
            }
        }, timeout);
    }
    
    /**
     * Initialize CSS fallbacks for common stylesheets
     */
    function initCSSFallbacks() {
        // Main stylesheet fallback
        createCSSFallback('styles.css');
        
        // Font Awesome fallback
        createCSSFallback('font-awesome');
        
        // Add more fallbacks as needed
        // createCSSFallback('other-critical.css');
    }
    
    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCSSFallbacks);
    } else {
        initCSSFallbacks();
    }
    
    // Export for manual use if needed
    window.VRTonUtils = window.VRTonUtils || {};
    window.VRTonUtils.createCSSFallback = createCSSFallback;
    window.VRTonUtils.initCSSFallbacks = initCSSFallbacks;
})();
