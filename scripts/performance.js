// Performance Monitor for VRTon - Tracks loading times and metrics
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.startTime = performance.now();
        this.debug = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
        
        if (this.debug) {
            this.init();
        }
    }
    
    init() {
        // Track various performance metrics
        this.trackPageLoad();
        this.trackResourceLoading();
        this.trackInteractionMetrics();
        
        // Report metrics after page is fully loaded
        window.addEventListener('load', () => {
            setTimeout(() => this.reportMetrics(), 1000);
        });
    }
    
    trackPageLoad() {
        this.mark('page-start');
        
        document.addEventListener('DOMContentLoaded', () => {
            this.mark('dom-ready');
        });
        
        window.addEventListener('load', () => {
            this.mark('page-loaded');
        });
    }
    
    trackResourceLoading() {
        // Track critical resources
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                if (entry.name.includes('.css') || entry.name.includes('.js')) {
                    this.metrics[`resource-${entry.name.split('/').pop()}`] = {
                        duration: entry.duration,
                        size: entry.transferSize || entry.encodedBodySize,
                        startTime: entry.startTime
                    };
                }
            });
        });
        
        observer.observe({ entryTypes: ['resource'] });
    }
    
    trackInteractionMetrics() {
        // First Input Delay (FID)
        new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                this.metrics.firstInputDelay = entry.processingStart - entry.startTime;
            });
        }).observe({ entryTypes: ['first-input'] });
        
        // Largest Contentful Paint (LCP)
        new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.metrics.largestContentfulPaint = lastEntry.startTime;
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        // Cumulative Layout Shift (CLS)
        let clsScore = 0;
        new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                if (!entry.hadRecentInput) {
                    clsScore += entry.value;
                }
            });
            this.metrics.cumulativeLayoutShift = clsScore;
        }).observe({ entryTypes: ['layout-shift'] });
    }
    
    mark(name) {
        const time = performance.now();
        this.metrics[name] = time - this.startTime;
        
        if (this.debug) {
            console.log(`📊 ${name}: ${(time - this.startTime).toFixed(2)}ms`);
        }
    }
    
    measure(name, startMark, endMark) {
        const duration = this.metrics[endMark] - this.metrics[startMark];
        this.metrics[`${name}-duration`] = duration;
        
        if (this.debug) {
            console.log(`📏 ${name}: ${duration.toFixed(2)}ms`);
        }
        
        return duration;
    }
    
    reportMetrics() {
        if (!this.debug) return;
        
        // Calculate key metrics
        const domTime = this.metrics['dom-ready'];
        const loadTime = this.metrics['page-loaded'];
        
        console.group('🚀 VRTon Performance Report');
        console.log(`⏱️ DOM Ready: ${domTime?.toFixed(2)}ms`);
        console.log(`📦 Page Load: ${loadTime?.toFixed(2)}ms`);
        
        if (this.metrics.largestContentfulPaint) {
            console.log(`🖼️ LCP: ${this.metrics.largestContentfulPaint.toFixed(2)}ms`);
        }
        
        if (this.metrics.firstInputDelay) {
            console.log(`⚡ FID: ${this.metrics.firstInputDelay.toFixed(2)}ms`);
        }
        
        if (this.metrics.cumulativeLayoutShift !== undefined) {
            console.log(`📐 CLS: ${this.metrics.cumulativeLayoutShift.toFixed(4)}`);
        }
        
        // Resource performance
        const resources = Object.entries(this.metrics)
            .filter(([key]) => key.startsWith('resource-'))
            .sort(([,a], [,b]) => b.duration - a.duration);
            
        if (resources.length > 0) {
            console.log('📁 Resource Loading Times:');
            resources.slice(0, 5).forEach(([name, data]) => {
                const fileName = name.replace('resource-', '');
                console.log(`  ${fileName}: ${data.duration.toFixed(2)}ms (${(data.size/1024).toFixed(1)}KB)`);
            });
        }
        
        console.groupEnd();
        
        // Performance recommendations
        this.generateRecommendations();
    }
    
    generateRecommendations() {
        const recommendations = [];
        
        if (this.metrics['page-loaded'] > 3000) {
            recommendations.push('⚠️ Page load time > 3s - Consider optimizing resources');
        }
        
        if (this.metrics.largestContentfulPaint > 2500) {
            recommendations.push('⚠️ LCP > 2.5s - Optimize critical resources');
        }
        
        if (this.metrics.firstInputDelay > 100) {
            recommendations.push('⚠️ FID > 100ms - Reduce JavaScript execution time');
        }
        
        if (this.metrics.cumulativeLayoutShift > 0.1) {
            recommendations.push('⚠️ CLS > 0.1 - Add size attributes to images');
        }
        
        if (recommendations.length > 0) {
            console.group('💡 Performance Recommendations');
            recommendations.forEach(rec => console.log(rec));
            console.groupEnd();
        } else {
            console.log('✅ All performance metrics are good!');
        }
    }
    
    // Public method to manually track custom metrics
    trackCustom(name, value) {
        this.metrics[`custom-${name}`] = value;
        if (this.debug) {
            console.log(`📊 Custom - ${name}: ${value}`);
        }
    }
}

// Initialize performance monitoring
if (typeof window !== 'undefined') {
    window.performanceMonitor = new PerformanceMonitor();
}
