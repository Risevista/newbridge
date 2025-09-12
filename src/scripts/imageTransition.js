import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

window.onload = function() {
  const jsImage = document.querySelector('.js-image');
  const gitImage = document.querySelector('.git-image');

  if (!jsImage || !gitImage) return;

  window.onscroll = function() {
    var scrollTop = window.scrollY;

    if (scrollTop == 0) {
      gsap.to(jsImage, {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out"
      });
      gsap.to(gitImage, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out"
      });
    }
    if (scrollTop > 10) {
      gsap.to(jsImage, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out"
      });
      gsap.to(gitImage, {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out"
      });
    }
  };
}; 