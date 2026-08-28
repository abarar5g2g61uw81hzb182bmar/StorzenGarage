// ==========================================
// js/ui.js — 3D Parallax, Typewriter & Wizard Engine
// ==========================================

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Garage Shutter Loader ---
    const loader = document.getElementById('loader');
    const appWrapper = document.getElementById('appWrapper');
    
    // Smooth reveal after assets load
    setTimeout(() => {
        loader.classList.add('hidden');
        appWrapper.classList.remove('loading');
        // Start Typewriter only after glass clears up
        setTimeout(startTypewriter, 500);
    }, 1800);


    // --- 2. Advanced Typewriter Effect ---
    const promptText = "Do you already have an account in STORZEN GARAGE?";
    const typeTarget = document.getElementById('typewriterText');
    const decisionButtons = document.getElementById('decisionButtons');
    let charIndex = 0;

    function startTypewriter() {
        if (!typeTarget) return;
        
        if (charIndex < promptText.length) {
            // Human-like typing delay (randomized slightly)
            const typingSpeed = Math.random() * 30 + 30; 
            
            // Keep the blinking cursor at the end
            typeTarget.innerHTML = promptText.substring(0, charIndex + 1) + '<span class="cursor"></span>';
            charIndex++;
            setTimeout(startTypewriter, typingSpeed);
        } else {
            // Typing finished, reveal buttons smoothly
            setTimeout(() => {
                decisionButtons.classList.add('show');
            }, 500);
        }
    }


    // --- 3. 3D Parallax (Mouse & Gyroscope) ---
    const tiltCard = document.getElementById('tiltCard');
    
    // A. Desktop Mouse Parallax
    document.addEventListener('mousemove', (e) => {
        if (window.innerWidth < 768 || !tiltCard) return; 
        
        // Calculate tilt angles (Smooth sensitivity)
        const xAxis = (window.innerWidth / 2 - e.pageX) / 45; 
        const yAxis = (window.innerHeight / 2 - e.pageY) / -45;
        
        tiltCard.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });

    // Reset when mouse leaves
    document.addEventListener('mouseleave', () => {
        if (tiltCard) tiltCard.style.transform = `rotateY(0deg) rotateX(0deg)`;
    });

    // B. Mobile Gyroscope Parallax (Device Orientation)
    if (window.DeviceOrientationEvent) {
        window.addEventListener("deviceorientation", (e) => {
            if (window.innerWidth >= 768 || !tiltCard) return; // Only active on mobile
            if (!e.gamma || !e.beta) return; // Null check
            
            // Gamma is left/right (-90 to 90), Beta is front/back (-180 to 180)
            let xAxis = e.gamma / 2.5; 
            let yAxis = (e.beta - 45) / 2.5; // Offset by 45deg assuming normal holding position
            
            // Cap the rotation to prevent extreme flipping
            xAxis = Math.max(-15, Math.min(15, xAxis));
            yAxis = Math.max(-15, Math.min(15, yAxis));
            
            tiltCard.style.transform = `rotateY(${xAxis}deg) rotateX(${-yAxis}deg)`;
        });
    }


    // --- 4. Custom Theme Engine & BMW Headlight Easter Egg ---
    function toggleTheme() {
        const isDark = document.body.classList.toggle('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        // Toggle SVG Icons & Logos safely
        document.getElementById('moonIcon').style.display = isDark ? 'none' : 'block';
        document.getElementById('sunIcon').style.display = isDark ? 'block' : 'none';
        document.getElementById('logoLight').style.display = isDark ? 'none' : 'block';
        document.getElementById('logoDark').style.display = isDark ? 'block' : 'none';
    }

    // Initialize correct theme on load based on body class
    if (document.body.classList.contains('dark-theme')) {
        document.getElementById('moonIcon').style.display = 'none';
        document.getElementById('sunIcon').style.display = 'block';
        document.getElementById('logoLight').style.display = 'none';
        document.getElementById('logoDark').style.display = 'block';
    }

    // Attach Click Events to Theme Switchers
    const themeBtn = document.getElementById('themeToggleBtn');
    const mobileHeadlight = document.getElementById('headlightTriggerMobile');
    const desktopHeadlight = document.getElementById('headlightTriggerDesktop');
    
    if(themeBtn) themeBtn.addEventListener('click', toggleTheme);
    if(mobileHeadlight) mobileHeadlight.addEventListener('click', toggleTheme);
    if(desktopHeadlight) desktopHeadlight.addEventListener('click', toggleTheme);


    // --- 5. Main Flow Routing (Yes / No) ---
    const step0 = document.getElementById('step-0');
    const signInForm = document.getElementById('signInForm');
    const signUpWizard = document.getElementById('signUpWizard');

    // User taps YES
    document.getElementById('btnYes').addEventListener('click', () => {
        step0.classList.remove('active');
        setTimeout(() => signInForm.classList.add('active'), 500); // 500ms allows fade out
    });

    // User taps NO
    document.getElementById('btnNo').addEventListener('click', () => {
        step0.classList.remove('active');
        setTimeout(() => signUpWizard.classList.add('active'), 500);
    });


    // --- 6. Step-by-Step Onboarding Wizard ---
    const slides = [
        'slide-name', 
        'slide-domain', 
        'slide-garage', 
        'slide-contact', 
        'slide-checkout'
    ];
    let currentSlideIndex = 0;

    const nextButtons = document.querySelectorAll('.next-btn');
    
    nextButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const currentSlide = document.getElementById(slides[currentSlideIndex]);
            
            // 6A. HTML5 Validation Trigger
            const inputs = currentSlide.querySelectorAll('input');
            let isValid = true;
            inputs.forEach(input => {
                if (!input.checkValidity()) {
                    input.reportValidity();
                    isValid = false;
                }
            });

            if (!isValid) return; // Stop if inputs are empty/invalid

            // 6B. Slide Transition Logic
            if (currentSlideIndex < slides.length - 1) {
                currentSlide.classList.remove('active');
                
                setTimeout(() => {
                    const nextSlide = document.getElementById(slides[currentSlideIndex + 1]);
                    nextSlide.classList.add('active');
                    
                    // Auto-focus the first input of the new slide for UX
                    const firstInput = nextSlide.querySelector('input');
                    if (firstInput) firstInput.focus();
                    
                }, 400); // Wait for CSS fade out
                
                currentSlideIndex++;
            }
        });
    });

    // --- 7. Input Restrictions & Formatting ---
    
    // Domain format: only lowercase, numbers, no spaces or special chars
    const regDomain = document.getElementById('regDomain');
    if (regDomain) {
        regDomain.addEventListener('input', function () {
            this.value = this.value.toLowerCase().replace(/[^a-z0-9]/g, '');
        });
    }

    // Phone format: numbers only
    const regPhone = document.getElementById('regPhone');
    if (regPhone) {
        regPhone.addEventListener('input', function () {
            this.value = this.value.replace(/[^0-9+]/g, ''); 
        });
    }
});
