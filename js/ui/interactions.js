let currentTypewriterTimeout = null;

export function playTypewriter(slideElement) {
    if (!slideElement) return;
    const typeTarget = slideElement.querySelector('.type-target');
    const stepContent = slideElement.querySelector('.step-content');
    if (!typeTarget) return;

    const textToType = typeTarget.getAttribute('data-text');
    typeTarget.innerHTML = '<span class="cursor"></span>';
    if (stepContent) stepContent.classList.remove('show');
    
    let charIndex = 0;
    clearTimeout(currentTypewriterTimeout);

    function typeChar() {
        if (charIndex < textToType.length) {
            const speed = Math.random() * 15 + 25; 
            typeTarget.innerHTML = textToType.substring(0, charIndex + 1) + '<span class="cursor"></span>';
            charIndex++;
            currentTypewriterTimeout = setTimeout(typeChar, speed);
        } else {
            setTimeout(() => { if (stepContent) stepContent.classList.add('show'); }, 200);
        }
    }
    typeChar();
}

export function showIsland(message, icon = '✨') {
    const island = document.getElementById('dynamic-island');
    const msgEl = document.getElementById('island-message');
    const iconEl = document.getElementById('island-icon');
    if (!island) return;

    msgEl.innerText = message;
    iconEl.innerText = icon;
    
    island.classList.remove('hidden');
    // Force reflow
    void island.offsetWidth;
    island.classList.add('show');

    // Haptic feedback if available
    if (navigator.vibrate) navigator.vibrate(50);

    setTimeout(() => {
        island.classList.remove('show');
        setTimeout(() => island.classList.add('hidden'), 500);
    }, 3500);
}

export function initThemeToggle() {
    const themeBtn = document.getElementById('themeToggleBtn');
    const mobileHeadlight = document.getElementById('headlightTriggerMobile');
    const desktopHeadlight = document.getElementById('headlightTriggerDesktop');

    function toggleTheme() {
        const isDark = document.documentElement.classList.toggle('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        document.getElementById('moonIcon').style.display = isDark ? 'none' : 'block';
        document.getElementById('sunIcon').style.display = isDark ? 'block' : 'none';
        document.getElementById('logoLight').style.display = isDark ? 'none' : 'block';
        document.getElementById('logoDark').style.display = isDark ? 'block' : 'none';
    }

    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
    if (mobileHeadlight) mobileHeadlight.addEventListener('click', toggleTheme);
    if (desktopHeadlight) desktopHeadlight.addEventListener('click', toggleTheme);
}
document.addEventListener('DOMContentLoaded', initThemeToggle);
