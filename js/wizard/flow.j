import { playTypewriter, showIsland } from '../ui/interactions.js';

export function initFlow() {
    const tiltCard = document.getElementById('tiltCard');
    const step0 = document.getElementById('step-0');
    const signInForm = document.getElementById('signInForm');
    const signUpWizard = document.getElementById('signUpWizard');
    const progressContainer = document.getElementById('progress-container');
    const progressFill = document.getElementById('progress-fill');

    const slides = ['slide-name', 'slide-domain', 'slide-garage', 'slide-contact', 'slide-logo', 'slide-checkout'];
    let currentSlideIndex = 0;

    // Morphing Panel Height Adjuster
    function adjustPanelHeight(activeElement) {
        if (!tiltCard || !activeElement) return;
        // Temporarily display block to calculate true height if hidden
        const prevDisplay = activeElement.style.display;
        activeElement.style.display = 'block';
        const newHeight = activeElement.scrollHeight + 120; // adding padding buffer
        activeElement.style.display = prevDisplay;
        
        tiltCard.style.height = `${newHeight}px`;
    }

    function switchStep(fromEl, toEl) {
        fromEl.classList.remove('active');
        setTimeout(() => {
            toEl.classList.add('active');
            adjustPanelHeight(toEl);
            playTypewriter(toEl);
            
            // Check for progress bar update
            const progress = toEl.getAttribute('data-progress');
            if (progress && progressContainer) {
                progressContainer.classList.remove('hidden');
                progressFill.style.width = `${progress}%`;
            } else if (progressContainer) {
                progressContainer.classList.add('hidden');
            }
            
            const firstInput = toEl.querySelector('input');
            if (firstInput) firstInput.focus();
        }, 400);
    }

    // Root Decisions
    const btnYes = document.getElementById('btnYes');
    const btnNo = document.getElementById('btnNo');
    if (btnYes) btnYes.addEventListener('click', () => switchStep(step0, signInForm));
    if (btnNo) btnNo.addEventListener('click', () => {
        switchStep(step0, signUpWizard);
        const firstSlide = document.getElementById(slides[0]);
        firstSlide.classList.add('active');
        adjustPanelHeight(firstSlide);
        playTypewriter(firstSlide);
    });

    // Master Back Buttons
    document.querySelectorAll('.btn-back[data-target="step-0"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const currentForm = e.target.closest('.wizard-step');
            switchStep(currentForm, step0);
        });
    });

    // Multi-Slide Next Logic
    document.querySelectorAll('.next-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const currentSlide = document.getElementById(slides[currentSlideIndex]);
            
            // Validate inputs before moving
            const inputs = currentSlide.querySelectorAll('input[required]');
            let isValid = true;
            inputs.forEach(input => {
                if (!input.checkValidity()) {
                    input.reportValidity();
                    isValid = false;
                }
            });
            if (!isValid) return;

            if (navigator.vibrate) navigator.vibrate(20); // Haptic

            if (currentSlideIndex < slides.length - 1) {
                currentSlide.classList.remove('active');
                setTimeout(() => {
                    currentSlideIndex++;
                    const nextSlide = document.getElementById(slides[currentSlideIndex]);
                    nextSlide.classList.add('active');
                    adjustPanelHeight(nextSlide);
                    playTypewriter(nextSlide);
                    
                    const progress = nextSlide.getAttribute('data-progress');
                    if (progressFill && progress) progressFill.style.width = `${progress}%`;
                }, 400);
            }
        });
    });

    // Multi-Slide Prev Logic
    document.querySelectorAll('.prev-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentSlideIndex > 0) {
                if (navigator.vibrate) navigator.vibrate(20);
                const currentSlide = document.getElementById(slides[currentSlideIndex]);
                currentSlide.classList.remove('active');
                setTimeout(() => {
                    currentSlideIndex--;
                    const prevSlide = document.getElementById(slides[currentSlideIndex]);
                    prevSlide.classList.add('active');
                    adjustPanelHeight(prevSlide);
                    playTypewriter(prevSlide);
                    
                    const progress = prevSlide.getAttribute('data-progress');
                    if (progressFill && progress) progressFill.style.width = `${progress}%`;
                }, 400);
            }
        });
    });

    // Close Panel Logic
    const closeBtn = document.getElementById('closePanelBtn');
    const appWrapper = document.getElementById('appWrapper');
    const refreshMsg = document.getElementById('refreshMessage');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (appWrapper) appWrapper.classList.add('hidden');
            if (refreshMsg) refreshMsg.classList.remove('hidden');
        });
    }

    // Init height on load
    setTimeout(() => {
        const activeStep = document.querySelector('.wizard-step.active');
        if (activeStep) adjustPanelHeight(activeStep);
        playTypewriter(step0);
    }, 2800); // After loader
}
document.addEventListener('DOMContentLoaded', initFlow);
