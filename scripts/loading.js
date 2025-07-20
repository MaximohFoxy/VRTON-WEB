// Loading Manager for VRTon - Coordinates all dynamic resource loading
class LoadingManager {
    constructor() {
        this.loadingStates = {
            i18n: false,
            components: false,
            countdown: false,
            dom: false,
            video: false,
            teams: false
        };
        
        this.loadingScreen = document.getElementById('loading-screen');
        this.loadingText = document.querySelector('.loading-text');
        this.loadingSubtext = document.querySelector('.loading-subtext');
        
        // Detect current page
        this.isTeamPage = window.location.pathname.includes('colaboradores') || 
                         document.querySelector('.furality-hero');
        this.isIndexPage = window.location.pathname === '/' || 
                          window.location.pathname.includes('index.html') ||
                          document.querySelector('.hero-video');
        
        this.currentLang = localStorage.getItem('vrton-language') || 'es';
        this.translations = null; // Will be loaded from i18n
        
        this.fallbackMessages = {
            es: {
                loading: 'Cargando VRTon',
                loadingTeam: 'Cargando Equipo',
                preparing: 'Preparando experiencia inmersiva...',
                preparingTeam: 'Preparando información del equipo...',
                translations: 'Cargando traducciones...',
                components: 'Cargando componentes...',
                countdown: 'Iniciando contador...',
                teams: 'Cargando información del equipo...',
                video: 'Preparando video...',
                finalizing: 'Finalizando carga...'
            },
            en: {
                loading: 'Loading VRTon',
                loadingTeam: 'Loading Team',
                preparing: 'Preparing immersive experience...',
                preparingTeam: 'Preparing team information...',
                translations: 'Loading translations...',
                components: 'Loading components...',
                countdown: 'Starting countdown...',
                teams: 'Loading team information...',
                video: 'Preparing video...',
                finalizing: 'Finalizing load...'
            }
        };
        this.init();
    }
    
    init() {
        // Monitor DOM loading
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.markReady('dom');
            });
        } else {
            this.markReady('dom');
        }
        
        // Monitor video loading (only on index page)
        if (this.isIndexPage) {
            this.setupVideoLoading();
        } else {
            // No video on other pages, mark as ready
            this.markReady('video');
        }
        
        // Set up callbacks for dynamic resources
        this.setupCallbacks();
        
        // Update loading text based on page type
        this.updateInitialLoadingText();
        
        // Start loading animation
        this.startLoadingAnimation();
        
        // Fallback timeout to prevent infinite loading
        const timeoutDuration = this.isTeamPage ? 4000 : 8000; // Faster timeout for team page
        setTimeout(() => {
            if (!this.isAllReady()) {
                console.warn('Loading timeout reached, forcing completion');
                this.completeLoading();
            }
        }, timeoutDuration);
    }
    
    setupVideoLoading() {
        const video = document.getElementById('background-video');
        if (video) {
            const checkVideo = () => {
                if (video.readyState >= 3) { // HAVE_FUTURE_DATA
                    this.markReady('video');
                } else {
                    video.addEventListener('canplay', () => {
                        this.markReady('video');
                    }, { once: true });
                    
                    video.addEventListener('loadeddata', () => {
                        this.markReady('video');
                    }, { once: true });
                }
            };
            
            if (video.readyState >= 3) {
                this.markReady('video');
            } else {
                checkVideo();
            }
        } else {
            // No video, mark as ready
            this.markReady('video');
        }
    }
    
    setupCallbacks() {
        // i18n callback
        window.onI18nReady = () => {
            // Get translations from i18n system
            if (window.i18n && window.i18n.translations) {
                this.translations = window.i18n.translations;
                this.currentLang = window.i18n.currentLanguage;
            }
            
            this.updateLoadingText('translations');
            this.markReady('i18n');
        };
        
        // Components callback
        window.onComponentsReady = () => {
            this.updateLoadingText('components');
            this.markReady('components');
        };
        
        // Countdown callback (only on index page)
        window.onCountdownReady = () => {
            this.updateLoadingText('countdown');
            this.markReady('countdown');
        };
        
        // Teams callback (only on team page)
        window.onTeamsReady = () => {
            this.updateLoadingText('teams');
            this.markReady('teams');
        };
        
        // If not on index page, mark countdown as ready
        if (!this.isIndexPage) {
            setTimeout(() => this.markReady('countdown'), 100);
        }
        
        // If not on team page, mark teams as ready
        if (!this.isTeamPage) {
            setTimeout(() => this.markReady('teams'), 100);
        }
        
        // Add a faster timeout specifically for teams loading
        if (this.isTeamPage) {
            setTimeout(() => {
                if (!this.loadingStates.teams) {
                    console.warn('Teams loading timeout reached, forcing completion');
                    this.markReady('teams');
                }
            }, 1500); // 1.5 seconds timeout for teams specifically
        }
    }
    
    markReady(component) {
        console.log(`Loading: ${component} ready`);
        this.loadingStates[component] = true;
        
        // Log current state for debugging
        if (this.isTeamPage) {
            const readyComponents = Object.entries(this.loadingStates)
                .filter(([key, value]) => value)
                .map(([key]) => key);
            console.log(`Team page - Ready components: ${readyComponents.join(', ')}`);
        }
        
        if (this.isAllReady()) {
            this.completeLoading();
        }
    }
    
    isAllReady() {
        return Object.values(this.loadingStates).every(state => state === true);
    }
    
    updateLoadingText(stage) {
        // Use i18n translations if available, otherwise fallback
        const messages = (this.translations && this.translations[this.currentLang] && this.translations[this.currentLang].loading) 
            ? this.translations[this.currentLang].loading 
            : this.fallbackMessages[this.currentLang];
            
        let text = this.isTeamPage ? 
            (messages.loadingTeam || messages.loading) : 
            (messages.loading || messages.title);
        let subtext = this.isTeamPage ? 
            (messages.preparingTeam || messages.preparing) : 
            messages.preparing;
        
        switch (stage) {
            case 'translations':
                subtext = messages.translations;
                break;
            case 'components':
                subtext = messages.components;
                break;
            case 'countdown':
                subtext = messages.countdown;
                break;
            case 'teams':
                subtext = messages.teams;
                break;
            case 'video':
                subtext = messages.video;
                break;
            case 'finalizing':
                subtext = messages.finalizing;
                break;
        }
        
        if (this.loadingText) this.loadingText.textContent = text;
        if (this.loadingSubtext) this.loadingSubtext.textContent = subtext;
    }
    
    updateInitialLoadingText() {
        const messages = this.fallbackMessages[this.currentLang];
        const text = this.isTeamPage ? messages.loadingTeam : messages.loading;
        const subtext = this.isTeamPage ? messages.preparingTeam : messages.preparing;
        
        if (this.loadingText) this.loadingText.textContent = text;
        if (this.loadingSubtext) this.loadingSubtext.textContent = subtext;
    }
    
    startLoadingAnimation() {
        const stages = this.isTeamPage ? 
            ['translations', 'components', 'teams'] : 
            ['translations', 'components', 'countdown', 'video'];
        let currentStage = 0;
        
        const updateStage = () => {
            if (currentStage < stages.length && !this.isAllReady()) {
                this.updateLoadingText(stages[currentStage]);
                currentStage++;
                // Faster timing for team page
                const delay = this.isTeamPage ? 400 : 800;
                setTimeout(updateStage, delay);
            }
        };
        
        // Faster initial delay for team page
        const initialDelay = this.isTeamPage ? 200 : 500;
        setTimeout(updateStage, initialDelay);
    }
    
    completeLoading() {
        this.updateLoadingText('finalizing');
        
        // Small delay to show finalizing message
        setTimeout(() => {
            // Add loaded class to body for content animation
            document.body.classList.remove('loading');
            document.body.classList.add('loaded');
            
            // Hide loading screen with smooth transition
            this.loadingScreen.classList.add('hidden');
            
            // Remove loading screen from DOM after transition
            setTimeout(() => {
                if (this.loadingScreen && this.loadingScreen.parentNode) {
                    this.loadingScreen.remove();
                }
            }, 800);
            
            console.log('🚀 VRTon loading completed successfully!');
        }, 300);
    }
    
    // Public method to force completion (for debugging)
    forceComplete() {
        console.log('Forcing loading completion...');
        this.completeLoading();
    }
}

// Initialize loading manager immediately
const loadingManager = new LoadingManager();

// Make it globally accessible for debugging
window.loadingManager = loadingManager;
