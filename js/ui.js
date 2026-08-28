// js/ui.js - Core UI Interactions & Wizard Logic

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Garage Shutter Loader ---
    const loader = document.getElementById('loader');
    const appWrapper = document.getElementById('appWrapper');
    
    setTimeout(() => {
        loader.classList.add('hidden');
        appWrapper.classList.remove('loading');
        startTypewriter(); // Start animation only after loader hides
    }, 1500);


    // --- 2. Typewriter Effect ---
    const promptText = "Do you already have an account in STORZEN GARAGE?";
    const typeTarget = document.getElementById('typewriterText');
    const decisionButtons = document.getElementById('decisionButtons');
    let i = 0;

    function startTypewriter() {
        if (i < promptText.length) {
            typeTarget.innerHTML += promptText.charAt(i);
            i++;
            setTimeout(startTypewriter, 40); // Typing speed
        } else {
            // Show buttons after typing finishes
            setTimeout(() => {
                decisionButtons.classList.add('show');
            }, 300);
        }
    }


    // --- 3. 3D Parallax Tilt Effect ---
    const tiltCard = document.getElementById('tiltCard');
    document.addEventListener('mousemove', (e) => {
        if (window.innerWidth < 768) return; 
        
        // Calculate tilt angles based on mouse position
        const xAxis = (window.innerWidth / 2 - e.pageX) / 45; 
        const yAxis = (window.innerHeight / 2 - e.pageY) / -45;
        
        tiltCard.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });

    document.addEventListener('mouseleave', () => {
        tiltCard.style.transform = `rotateY(0deg) rotateX(0deg)`;
    });


    // --- 4. Theme Toggle & Headlight Easter Egg ---
    function toggleTheme() {
        const isDark = document.body.classList.toggle('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        document.getElementById('moonIcon').style.display = isDark ? 'none' : 'block';
        document.getElementById('sunIcon').style.display = isDark ? 'block' : 'none';
        document.getElementById('logoLight').style.display = isDark ? 'none' : 'block';
        document.getElementById('logoDark').style.display = isDark ? 'block' : 'none';
    }

    // Set initial theme icons based on body class
    if (document.body.classList.contains('dark-theme')) {
        document.getElementById('moonIcon').style.display = 'none';
        document.getElementById('sunIcon').style.display = 'block';
        document.getElementById('logoLight').style.display = 'none';
        document.getElementById('logoDark').style.display = 'block';
    }

    document.getElementById('themeToggleBtn').addEventListener('click', toggleTheme);
    document.getElementById('headlightTriggerMobile').addEventListener('click', toggleTheme);
    document.getElementById('headlightTriggerDesktop').addEventListener('click', toggleTheme);


    // --- 5. Main Flow Routing (Yes/No) ---
    const step0 = document.getElementById('step-0');
    const signInForm = document.getElementById('signInForm');
    const signUpWizard = document.getElementById('signUpWizard');

    document.getElementById('btnYes').addEventListener('click', () => {
        step0.classList.remove('active');
        setTimeout(() => signInForm.classList.add('active'), 400);
    });

    document.getElementById('btnNo').addEventListener('click', () => {
        step0.classList.remove('active');
        setTimeout(() => signUpWizard.classList.add('active'), 400);
    });


    // --- 6. Advanced Onboarding Wizard Logic ---
    const slides = [
        'slide-name', 
        'slide-domain', 
        'slide-garage', 
        'slide-contact', 
        'slide-otp', 
        'slide-checkout'
    ];
    let currentSlideIndex = 0;

    // Attach click events to all "Continue" buttons
    const nextButtons = document.querySelectorAll('.next-btn');
    nextButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const currentSlide = document.getElementById(slides[currentSlideIndex]);
            
            // Validate inputs in the current slide before moving forward
            const inputs = currentSlide.querySelectorAll('input');
            let isValid = true;
            inputs.forEach(input => {
                if (!input.checkValidity()) {
                    input.reportValidity();
                    isValid = false;
                }
            });

            if (!isValid) return;

            // Handle OTP Mock Send
            if (e.target.id === 'sendOtpBtn') {
                const btnText = e.target.innerHTML;
                e.target.innerHTML = 'Sending...';
                e.target.style.opacity = '0.7';
                
                // Simulate network request
                setTimeout(() => {
                    e.target.innerHTML = btnText;
                    e.target.style.opacity = '1';
                    moveToNextSlide();
                }, 1500);
                return;
            }

            moveToNextSlide();
        });
    });

    function moveToNextSlide() {
        if (currentSlideIndex < slides.length - 1) {
            const current = document.getElementById(slides[currentSlideIndex]);
            const next = document.getElementById(slides[currentSlideIndex + 1]);
            
            current.classList.remove('active');
            
            setTimeout(() => {
                next.classList.add('active');
                
                // Auto-focus first input of new slide
                const firstInput = next.querySelector('input');
                if (firstInput) firstInput.focus();
                
            }, 400);
            
            currentSlideIndex++;
        }
    }

    // OTP Input Formatting (Numbers only)
    const regOtp = document.getElementById('regOtp');
    if (regOtp) {
        regOtp.addEventListener('input', function (e) {
            this.value = this.value.replace(/[^0-9]/g, ''); // Strip non-numeric
        });
    }

    // Domain Input Formatting (Lowercase, no spaces, no special chars)
    const regDomain = document.getElementById('regDomain');
    if (regDomain) {
        regDomain.addEventListener('input', function (e) {
            this.value = this.value.toLowerCase().replace(/[^a-z0-9]/g, '');
        });
    }
});
