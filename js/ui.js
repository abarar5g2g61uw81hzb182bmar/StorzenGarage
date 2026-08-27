// Function to handle Theme Toggling
function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-theme');
    
    // Save to local storage
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Update Icons
    document.getElementById('moonIcon').style.display = isDark ? 'none' : 'block';
    document.getElementById('sunIcon').style.display = isDark ? 'block' : 'none';
    
    // Update Logo
    document.getElementById('logoLight').style.display = isDark ? 'none' : 'block';
    document.getElementById('logoDark').style.display = isDark ? 'block' : 'none';
}

// 1. Initial State Check (on load)
window.addEventListener('DOMContentLoaded', () => {
    const bodyDark = document.documentElement.classList.contains('dark-theme') || document.body.classList.contains('dark-theme');
    // Align body class since HTML script might have put it on documentElement
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

// 2. Button Click Listener
document.getElementById('themeToggleBtn').addEventListener('click', toggleTheme);

// 3. Headlight Click Listeners (The Easter Egg!)
document.getElementById('headlightTriggerMobile').addEventListener('click', toggleTheme);
document.getElementById('headlightTriggerDesktop').addEventListener('click', toggleTheme);

// 4. Password Toggle
document.getElementById('togglePasswordBtn').addEventListener('click', function() {
    const passInput = document.getElementById('passwordInput');
    if (passInput.type === 'password') {
        passInput.type = 'text';
        this.style.opacity = '1';
    } else {
        passInput.type = 'password';
        this.style.opacity = '0.6';
    }
});
