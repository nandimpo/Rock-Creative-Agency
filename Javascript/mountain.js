/* ==================== MOUNTAIN ANIMATION - HERO ONLY ==================== */
/* File: Javascript/mountain.js */
/* This animation is ONLY for hero sections with class .mountain-section */

class MountainAnimation {
    constructor(selector = '.mountain-section') {
        // Only target hero sections
        this.section = document.querySelector(selector);
        
        if (!this.section) {
            console.warn('❌ Mountain section not found with selector:', selector);
            return;
        }
        
        // Get elements only from the hero section
        this.h1 = this.section.querySelector('h1');
        this.h2 = this.section.querySelector('h2');
        this.svg = this.section.querySelector('.mountain-svg');
        this.peaks = this.section.querySelectorAll('.mountain-peak');
        
        this.isAnimating = false;
        this.hasAnimated = false;
        
        if (this.h1 || this.h2 || this.svg) {
            this.init();
        }
    }

    /**
     * Initialize the animation
     */
    init() {
        this.observeAnimation();
        this.addInteractivity();
        console.log('✓ Mountain Animation initialized (Hero only)');
        console.log('  - H1:', this.h1?.textContent || 'Not found');
        console.log('  - H2:', this.h2?.textContent || 'Not found');
        console.log('  - SVG Peaks:', this.peaks.length);
    }

    /**
     * Observe when hero section comes into view
     * Animation only triggers once when section is first visible
     */
    observeAnimation() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Only animate if in viewport and hasn't animated yet
                if (entry.isIntersecting && !this.hasAnimated) {
                    this.hasAnimated = true;
                    this.isAnimating = true;
                    this.section.classList.add('animate-in');
                    console.log('✓ Mountain animation triggered');
                    
                    // Stop observing after animation starts
                    observer.unobserve(entry.target);
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '0px'
        });

        observer.observe(this.section);
    }

    /**
     * Add hover interactivity - only in hero section
     */
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

    /**
     * Reset hero animation to initial state
     */
    reset() {
        this.isAnimating = false;
        this.hasAnimated = false;
        this.section.classList.remove('animate-in');
        
        if (this.h1) this.h1.style.animation = 'none';
        if (this.h2) this.h2.style.animation = 'none';
        if (this.svg) this.svg.style.animation = 'none';
        
        // Trigger reflow to restart animation
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

    /**
     * Get hero animation status
     */
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

    /**
     * Manually trigger hero animation
     */
    play() {
        this.isAnimating = true;
        this.hasAnimated = true;
        this.section.classList.add('animate-in');
        console.log('✓ Hero animation playing');
    }

    /**
     * Stop hero animation
     */
    pause() {
        this.isAnimating = false;
        this.section.classList.remove('animate-in');
        console.log('✓ Hero animation paused');
    }
}

/**
 * Auto-initialize on DOM ready
 * Only initializes for .mountain-section (hero sections)
 */
document.addEventListener('DOMContentLoaded', () => {
    const heroSections = document.querySelectorAll('.mountain-section');
    
    if (heroSections.length > 0) {
        console.log('✓ Found ' + heroSections.length + ' mountain section(s)');
        
        // Initialize all hero sections with mountain animation
        heroSections.forEach((section, index) => {
            const animation = new MountainAnimation(`.mountain-section:nth-of-type(${index + 1})`);
        });
        
        // Store first instance globally for easy access
        window.mountainAnimation = new MountainAnimation('.mountain-section');
        console.log('✓ Mountain animations fully initialized');
    } else {
        console.warn('❌ No mountain sections found');
    }
});

/**
 * ==================== USAGE EXAMPLES ====================
 * 
 * // Access the global instance (first hero section)
 * window.mountainAnimation.setPeakColor('#4D7994');        // Primary blue
 * window.mountainAnimation.setPeakColor('#F2D275');        // Secondary yellow
 * window.mountainAnimation.setPeakWidth(5);               // Thicker lines
 * window.mountainAnimation.setAnimationDuration(2);       // Slower animation
 * window.mountainAnimation.reset();                       // Restart animation
 * console.log(window.mountainAnimation.getStatus());      // Check status
 * 
 * // Animation only triggers on hero sections with class .mountain-section
 * // No fill, only lines are drawn (stroke-dasharray animation)
 */