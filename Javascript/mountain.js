
class MountainAnimation {
    constructor(selector = '.mountain-section') {

        this.section = document.querySelector(selector);
        
        if (!this.section) {
            console.warn('❌ Mountain section not found with selector:', selector);
            return;
        }
        
  
        this.h1 = this.section.querySelector('h1');
        this.h2 = this.section.querySelector('h2');
        this.svg = this.section.querySelector('.mountain-svg');
        this.peaks = this.section.querySelectorAll('.mountain-peak');

        
        this.fogs = this.section.querySelectorAll('.fog-layer');
        
        this.isAnimating = false;
        this.hasAnimated = false;
        
        if (this.h1 || this.h2 || this.svg) {
            this.init();
        }
    }

    init() {
        this.observeAnimation();
        this.addInteractivity();
        this.addScrollFogEffect();  
        this.addMouseFogDrift();     
        console.log('✓ Mountain Animation initialized (Hero only)');
        console.log('  - H1:', this.h1?.textContent || 'Not found');
        console.log('  - H2:', this.h2?.textContent || 'Not found');
        console.log('  - SVG Peaks:', this.peaks.length);
    }

   
    observeAnimation() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                
                if (entry.isIntersecting && !this.hasAnimated) {
                    this.hasAnimated = true;
                    this.isAnimating = true;
                    this.section.classList.add('animate-in');
                    console.log('✓ Mountain animation triggered');

                    
                    this.playFog();

                    
                    observer.unobserve(entry.target);
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '0px'
        });

        observer.observe(this.section);
    }

    
    playFog() {
        this.fogs.forEach((fog) => {
            fog.style.animationPlayState = 'running';
            fog.style.opacity = '1';
            fog.style.transition = 'opacity 2s ease, filter 3s ease, transform 3s ease';
        });
        console.log('✓ Fog reveal animation started');
    }

   
    addScrollFogEffect() {
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentY = window.scrollY;

       
            if (currentY < lastScrollY && window.scrollY < window.innerHeight / 2) {
                this.fogs.forEach(fog => {
                    fog.style.opacity = '0.6';
                    fog.style.filter = 'blur(100px)';
                });
            } 
         
            else if (currentY > lastScrollY) {
                this.fogs.forEach(fog => {
                    fog.style.opacity = '0.3';
                    fog.style.filter = 'blur(70px)';
                });
            }

          
            if (window.scrollY <= 10) {
                this.fogs.forEach(fog => {
                    fog.style.opacity = '1';
                    fog.style.filter = 'blur(120px)';
                    fog.style.transition = 'opacity 2.5s ease, filter 2.5s ease';
                });
                console.log('🌫️ Fog reappeared at top');
            }

            lastScrollY = currentY;
        });
    }

    
    addMouseFogDrift() {
        if (!this.fogs.length) return;

        this.section.addEventListener('mousemove', (e) => {
            const rect = this.section.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;  // -1 to 1 range
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

            this.fogs.forEach((fog, i) => {
                const intensity = (i + 1) * 10;
                gsap.to(fog, {
                    duration: 3,
                    x: x * intensity,
                    y: y * intensity,
                    ease: "power2.out"
                });
            });
        });

   
        this.section.addEventListener('mouseleave', () => {
            this.fogs.forEach(fog => {
                gsap.to(fog, { duration: 3, x: 0, y: 0, ease: "power2.out" });
            });
        });

        console.log('🖱️ Fog drift interactivity enabled');
    }

  
    addInteractivity() {
        if (!this.section) return;

        this.section.addEventListener('mouseenter', () => {
            if (this.h1 && this.hasAnimated) {
                this.h1.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
                this.h1.style.transform = 'scale(1.05)';
            }
            if (this.h2 && this.hasAnimated) {
                this.h2.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
                this.h2.style.transform = 'scale(1.05)';
            }
        });

        this.section.addEventListener('mouseleave', () => {
            if (this.h1) this.h1.style.transform = 'scale(1)';
            if (this.h2) this.h2.style.transform = 'scale(1)';
        });
    }

    reset() {
        this.isAnimating = false;
        this.hasAnimated = false;
        this.section.classList.remove('animate-in');
        
        if (this.h1) this.h1.style.animation = 'none';
        if (this.h2) this.h2.style.animation = 'none';
        if (this.svg) this.svg.style.animation = 'none';
        
     
        void this.section.offsetWidth;
        
        if (this.h1) this.h1.style.animation = '';
        if (this.h2) this.h2.style.animation = '';
        if (this.svg) this.svg.style.animation = '';
        
        console.log('✓ Hero animation reset');
    }

    /**
     * Change mountain line color (stroke only)
     * @param {string} color - CSS color value (e.g., '#A5744E', '#4D7994')
     */
    setPeakColor(color) {
        this.peaks.forEach(peak => {
            peak.setAttribute('stroke', color);
        });
        console.log('✓ Mountain line color set to:', color);
    }

    /**
     * Change mountain line thickness (stroke-width)
     * @param {number} width - Stroke width value (default: 3)
     */
    setPeakWidth(width) {
        this.peaks.forEach(peak => {
            peak.setAttribute('stroke-width', width);
        });
        console.log('✓ Mountain line width set to:', width);
    }

    /**
     * Change animation drawing speed
     * @param {number} duration - Duration in seconds
     */
    setAnimationDuration(duration) {
        const css = `
            .mountain-section h1, 
            .mountain-section h2 {
                animation-duration: ${duration}s !important;
            }
            .mountain-peak-1, 
            .mountain-peak-2, 
            .mountain-peak-3 {
                animation-duration: ${duration}s !important;
            }
            .mountain-svg {
                animation-duration: ${duration * 1.5}s !important;
            }
        `;
        
        let style = document.getElementById('mountain-animation-duration');
        if (!style) {
            style = document.createElement('style');
            style.id = 'mountain-animation-duration';
            document.head.appendChild(style);
        }
        style.textContent = css;
        console.log('✓ Animation duration set to:', duration + 's');
    }

   
    getStatus() {
        return {
            isAnimating: this.isAnimating,
            hasAnimated: this.hasAnimated,
            hasH1: !!this.h1,
            hasH2: !!this.h2,
            hasSVG: !!this.svg,
            peakCount: this.peaks.length,
            h1Text: this.h1?.textContent || 'N/A',
            h2Text: this.h2?.textContent || 'N/A'
        };
    }

    play() {
        this.isAnimating = true;
        this.hasAnimated = true;
        this.section.classList.add('animate-in');
        this.playFog(); 
        console.log('✓ Hero animation playing');
    }

    pause() {
        this.isAnimating = false;
        this.section.classList.remove('animate-in');
        console.log('✓ Hero animation paused');
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const heroSections = document.querySelectorAll('.mountain-section');
    
    if (heroSections.length > 0) {
        console.log('✓ Found ' + heroSections.length + ' mountain section(s)');
        

        heroSections.forEach((section, index) => {
            const animation = new MountainAnimation(`.mountain-section:nth-of-type(${index + 1})`);
        });
        

        window.mountainAnimation = new MountainAnimation('.mountain-section');
        console.log('✓ Mountain animations fully initialized');
    } else {
        console.warn('❌ No mountain sections found');
    }
});
