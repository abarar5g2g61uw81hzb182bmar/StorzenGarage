// ==========================================
// js/ui.js — UI, 3D Parallax, Typewriter & Wizard Engine
// ==========================================

import { initLoader } from '../components/loader.js';

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Initialize Custom Car Loader ---
    initLoader();
    const loaderOverlay = document.getElementById('loaderOverlay');
    const appWrapper = document.getElementById('appWrapper');
    
    // Smooth reveal after assets/SVG animation finish
    setTimeout(() => {
        if(loaderOverlay) loaderOverlay.classList.add('hidden');
        appWrapper.classList.remove('loading');
        
        // Start Step 0 Typewriter
        playTypewriterForSlide(document.getElementById('step-0'));
    }, 2500); // 2.5s gives the car SVG time to draw nicely


    // --- 2. Dynamic Typewriter Engine ---
    let currentTypewriterTimeout = null;

    function playTypewriterForSlide(slideElement) {
        if (!slideElement) return;
        
        const typeTarget = slideElement.querySelector('.type-target');
        const stepContent = slideElement.querySelector('.step-content');
        
        if (!typeTarget) return;

        const textToType = typeTarget.getAttribute('data-text');
        typeTarget.innerHTML = '<span class="cursor"></span>'; // Reset
        
        if (stepContent) stepContent.classList.remove('show');
        
        let charIndex = 0;
        clearTimeout(currentTypewriterTimeout); // Clear any ongoing typing

        function typeChar() {
            if (charIndex < textToType.length) {
                const typingSpeed = Math.random() * 20 + 25; // Snappy human typing
                typeTarget.innerHTML = textToType.substring(0, charIndex + 1) + '<span class="cursor"></span>';
                charIndex++;
                currentTypewriterTimeout = setTimeout(typeChar, typingSpeed);
            } else {
                // Typing finished, reveal inputs/buttons
                setTimeout(() => {
                    if (stepContent) stepContent.classList.add('show');
                }, 300);
            }
        }
        
        typeChar();
    }


    // --- 3. Close Panel & Refresh Message ---
    const closePanelBtn = document.getElementById('closePanelBtn');
    const refreshMessage = document.getElementById('refreshMessage');

    if (closePanelBtn) {
        closePanelBtn.addEventListener('click', () => {
            appWrapper.classList.add('hidden'); // Hide entire glass app
            refreshMessage.classList.remove('hidden'); // Show refresh prompt
        });
    }


    // --- 4. 3D Parallax (Mouse & Gyroscope) ---
    const tiltCard = document.getElementById('tiltCard');
    
    // Desktop Mouse Parallax
    document.addEventListener('mousemove', (e) => {
        if (window.innerWidth < 768 || !tiltCard) return; 
        
        const xAxis = (window.innerWidth / 2 - e.pageX) / 45; 
        const yAxis = (window.innerHeight / 2 - e.pageY) / -45;
        tiltCard.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });
    document.addEventListener('mouseleave', () => {
        if (tiltCard) tiltCard.style.transform = `rotateY(0deg) rotateX(0deg)`;
    });

    // Mobile Gyroscope Parallax
    if (window.DeviceOrientationEvent) {
        window.addEventListener("deviceorientation", (e) => {
            if (window.innerWidth >= 768 || !tiltCard) return; 
            if (!e.gamma || !e.beta) return; 
            
            let xAxis = e.gamma / 2.5; 
            let yAxis = (e.beta - 45) / 2.5; 
            
            xAxis = Math.max(-15, Math.min(15, xAxis));
            yAxis = Math.max(-15, Math.min(15, yAxis));
            
            tiltCard.style.transform = `rotateY(${xAxis}deg) rotateX(${-yAxis}deg)`;
        });
    }


    // --- 5. Custom Theme Engine & BMW Headlights ---
    function toggleTheme() {
        const isDark = document.body.classList.toggle('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        document.getElementById('moonIcon').style.display = isDark ? 'none' : 'block';
        document.getElementById('sunIcon').style.display = isDark ? 'block' : 'none';
        document.getElementById('logoLight').style.display = isDark ? 'none' : 'block';
        document.getElementById('logoDark').style.display = isDark ? 'block' : 'none';
    }

    if (document.body.classList.contains('dark-theme')) {
        document.getElementById('moonIcon').style.display = 'none';
        document.getElementById('sunIcon').style.display = 'block';
        document.getElementById('logoLight').style.display = 'none';
        document.getElementById('logoDark').style.display = 'block';
    }

    const themeBtn = document.getElementById('themeToggleBtn');
    const mobileHeadlight = document.getElementById('headlightTriggerMobile');
    const desktopHeadlight = document.getElementById('headlightTriggerDesktop');
    
    if(themeBtn) themeBtn.addEventListener('click', toggleTheme);
    if(mobileHeadlight) mobileHeadlight.addEventListener('click', toggleTheme);
    if(desktopHeadlight) desktopHeadlight.addEventListener('click', toggleTheme);


    // --- 6. Main Routing & Back Buttons ---
    const step0 = document.getElementById('step-0');
    const signInForm = document.getElementById('signInForm');
    const signUpWizard = document.getElementById('signUpWizard');

    function switchStep(fromEl, toEl) {
        fromEl.classList.remove('active');
        setTimeout(() => {
            toEl.classList.add('active');
            playTypewriterForSlide(toEl);
        }, 400); // Wait for CSS transition
    }

    // YES / NO Root Decisions
    document.getElementById('btnYes').addEventListener('click', () => {
        switchStep(step0, signInForm);
    });
    document.getElementById('btnNo').addEventListener('click', () => {
        switchStep(step0, signUpWizard);
    });

    // Hard-coded Back Buttons (e.g., from Login back to Step 0)
    const specificBackBtns = document.querySelectorAll('.btn-back[data-target]');
    specificBackBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = e.currentTarget.getAttribute('data-target');
            const targetEl = document.getElementById(targetId);
            const currentEl = e.currentTarget.closest('.wizard-step');
            
            // Special case: going back to Step 0 closes the sub-forms
            if(targetId === 'step-0') {
                signInForm.classList.remove('active');
                signUpWizard.classList.remove('active');
                setTimeout(() => {
                    targetEl.classList.add('active');
                    playTypewriterForSlide(targetEl);
                }, 400);
            } else {
                switchStep(currentEl, targetEl);
            }
        });
    });


    // --- 7. Multi-Slide Wizard Navigation (Next / Prev) ---
    const slides = ['slide-name', 'slide-domain', 'slide-garage', 'slide-contact', 'slide-checkout'];
    let currentSlideIndex = 0;

    // NEXT Logic
    const nextButtons = document.querySelectorAll('.next-btn');
    nextButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const currentSlide = document.getElementById(slides[currentSlideIndex]);
            
            // HTML5 Validation
            const inputs = currentSlide.querySelectorAll('input');
            let isValid = true;
            inputs.forEach(input => {
                if (!input.checkValidity()) {
                    input.reportValidity();
                    isValid = false;
                }
            });
            if (!isValid) return; 

            if (currentSlideIndex < slides.length - 1) {
                currentSlide.classList.remove('active');
                setTimeout(() => {
                    currentSlideIndex++;
                    const nextSlide = document.getElementById(slides[currentSlideIndex]);
                    nextSlide.classList.add('active');
                    
                    playTypewriterForSlide(nextSlide);
                    
                    const firstInput = nextSlide.querySelector('input');
                    if (firstInput) firstInput.focus();
                }, 400);
            }
        });
    });

    // PREV Logic
    const prevButtons = document.querySelectorAll('.prev-btn');
    prevButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (currentSlideIndex > 0) {
                const currentSlide = document.getElementById(slides[currentSlideIndex]);
                currentSlide.classList.remove('active');
                
                setTimeout(() => {
                    currentSlideIndex--;
                    const prevSlide = document.getElementById(slides[currentSlideIndex]);
                    prevSlide.classList.add('active');
                    playTypewriterForSlide(prevSlide);
                }, 400);
            }
        });
    });

    // --- 8. Input Restrictions & Formatting ---
    const regDomain = document.getElementById('regDomain');
    if (regDomain) {
        regDomain.addEventListener('input', function () {
            this.value = this.value.toLowerCase().replace(/[^a-z0-9]/g, '');
        });
    }

    const regPhone = document.getElementById('regPhone');
    if (regPhone) {
        regPhone.addEventListener('input', function () {
            this.value = this.value.replace(/[^0-9+]/g, ''); 
        });
    }
});
