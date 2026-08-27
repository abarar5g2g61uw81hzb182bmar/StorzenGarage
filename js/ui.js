// 1. Initial Loader Logic
window.addEventListener('load', () => {
    // Ensuring background images fetch before revealing
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
        document.getElementById('appWrapper').classList.remove('loading');
    }, 1200);
});

// 2. 3D Mouse Parallax Effect for Desktop
const tiltCard = document.getElementById('tiltCard');
document.addEventListener('mousemove', (e) => {
    if (window.innerWidth < 768) return; // Only apply on desktop
    
    const xAxis = (window.innerWidth / 2 - e.pageX) / 40; // Sensitivity 
    const yAxis = (window.innerHeight / 2 - e.pageY) / -40;
    
    tiltCard.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
});

// Reset tilt on mouse out of window
document.addEventListener('mouseleave', () => {
    tiltCard.style.transform = `rotateY(0deg) rotateX(0deg)`;
});

// 3. Login / Signup Tab Switching
const tabLogin = document.getElementById('tabLogin');
const tabSignup = document.getElementById('tabSignup');
const tabSlider = document.getElementById('tabSlider');
const formLogin = document.getElementById('signInForm');
const formSignup = document.getElementById('signUpForm');

tabLogin.addEventListener('click', () => {
    tabSlider.style.transform = 'translateX(0)';
    tabLogin.classList.add('active'); tabSignup.classList.remove('active');
    formSignup.classList.remove('active');
    setTimeout(() => formLogin.classList.add('active'), 200); // Smooth form transition
});

tabSignup.addEventListener('click', () => {
    tabSlider.style.transform = 'translateX(100%)';
    tabSignup.classList.add('active'); tabLogin.classList.remove('active');
    formLogin.classList.remove('active');
    setTimeout(() => formSignup.classList.add('active'), 200);
});

// 4. Theme Toggle (Including Headlights)
function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    document.getElementById('moonIcon').style.display = isDark ? 'none' : 'block';
    document.getElementById('sunIcon').style.display = isDark ? 'block' : 'none';
    document.getElementById('logoLight').style.display = isDark ? 'none' : 'block';
    document.getElementById('logoDark').style.display = isDark ? 'block' : 'none';
}

window.addEventListener('DOMContentLoaded', () => {
    if(document.documentElement.classList.contains('dark-theme')) {
        document.body.classList.add('dark-theme');
        document.documentElement.classList.remove('dark-theme');
    }
    if (document.body.classList.contains('dark-theme')) {
        document.getElementById('moonIcon').style.display = 'none';
        document.getElementById('sunIcon').style.display = 'block';
        document.getElementById('logoLight').style.display = 'none';
        document.getElementById('logoDark').style.display = 'block';
    }
});

document.getElementById('themeToggleBtn').addEventListener('click', toggleTheme);
document.getElementById('headlightTriggerMobile').addEventListener('click', toggleTheme);
document.getElementById('headlightTriggerDesktop').addEventListener('click', toggleTheme);
