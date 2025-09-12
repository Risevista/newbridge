'use strict';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

class Parallax {
    constructor({
        bodyClass = 'parallax',
        breakpoint = 1025,
        shift = 0,
        debug = false,
        exclude = 'html.ipad'
    }) {
        // Check if GSAP and ScrollTrigger are available
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || window.innerWidth < breakpoint || document.querySelectorAll(exclude).length) {
            console.warn('[Parallax] GSAP and/or ScrollTrigger not defined, please check script loading');
            return false;
        }

        // Variables and options
        this.options = {
            breakpoint: breakpoint,
            shift: shift,
            debug: debug
        };

        // Add class to body to indicate module is active
        document.body.classList.add(bodyClass);

        // Register GSAP plugins
        gsap.registerPlugin(ScrollTrigger);

        // Define animations
        this.registerAnimations(this);

        // Launch animations
        this.launchAnimations(this);
    }

    registerAnimations(self) {
        this.animations = {
            // Image transition effect
            gsapImageTransition() {
                if (window.innerWidth < self.options.breakpoint) {
                    return false;
                }

                const targets = ['.image-man'];
                
                document.querySelectorAll(targets.join(', ')).forEach((target) => {
                    const jsImage = target.querySelector('.js-image');
                    const gitImage = target.querySelector('.git-image');

                    if (!jsImage || !gitImage) return;

                    gsap.timeline({
                        scrollTrigger: {
                            trigger: target,
                            start: 'top top',
                            end: 'bottom bottom',
                            scrub: 1,
                            markers: self.options.debug,
                            onUpdate: (self) => {
                                const progress = self.progress;
                                gsap.to(jsImage, {
                                    opacity: 1 - progress,
                                    duration: 0.5,
                                    ease: "power2.out"
                                });
                                gsap.to(gitImage, {
                                    opacity: progress,
                                    duration: 0.5,
                                    ease: "power2.out"
                                });
                            }
                        }
                    });
                });
            },

            // Fixed images effect
            gsapFixedImages() {
                if (window.innerWidth < self.options.breakpoint) {
                    return false;
                }

                const targets = ['.sidebar'];

                document.querySelectorAll(targets.join(', ')).forEach((target) => {
                    gsap.timeline({
                        scrollTrigger: {
                            trigger: target,
                            start: 'top top',
                            end: 'bottom bottom',
                            pin: true,
                            pinSpacing: false,
                            markers: self.options.debug
                        }
                    });
                });
            }
        };
    }

    launchAnimations(self) {
        for (const key in self.animations) {
            if (typeof self.animations[key] === 'function') {
                self.animations[key]();
            }
        }
    }

    isScrollTriggerDefined() {
        return typeof ScrollTrigger !== 'undefined';
    }
}

// Initialize Parallax only on client-side
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        new Parallax({
            bodyClass: 'parallax',
            breakpoint: 768,
            debug: false
        });
    });
} 