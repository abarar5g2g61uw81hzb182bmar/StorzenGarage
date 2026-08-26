// Theme Logic (Strictly toggling monochrome classes)
const themeToggleBtn = document.getElementById('themeToggleBtn');
const html = document.documentElement;

themeToggleBtn.addEventListener('click', () => {
    html.classList.toggle('dark');
    localStorage.theme = html.classList.contains('dark') ? 'dark' : 'light';
});

// Password Eye Toggle
const togglePasswordBtn = document.getElementById('togglePasswordBtn');
const passwordInput = document.getElementById('passwordInput');
const eyeOpen = document.getElementById('eyeOpenIcon');
const eyeClosed = document.getElementById('eyeClosedIcon');

togglePasswordBtn.addEventListener('click', () => {
    const isPass = passwordInput.type === 'password';
    passwordInput.type = isPass ? 'text' : 'password';
    eyeOpen.classList.toggle('hidden', isPass);
    eyeOpen.classList.toggle('block', !isPass);
    eyeClosed.classList.toggle('hidden', !isPass);
    eyeClosed.classList.toggle('block', isPass);
});

// Modals
const forgotModal = document.getElementById('forgotModal');
const forgotModalInner = document.getElementById('forgotModalInner');
const openModalBtn = document.getElementById('openForgotModalBtn');
const closeModalBtn = document.getElementById('closeForgotModalBtn');

function toggleModal(show) {
    if (show) {
        forgotModal.classList.remove('opacity-0', 'pointer-events-none');
        forgotModalInner.classList.remove('scale-95');
    } else {
        forgotModal.classList.add('opacity-0', 'pointer-events-none');
        forgotModalInner.classList.add('scale-95');
    }
}

openModalBtn.addEventListener('click', () => toggleModal(true));
closeModalBtn.addEventListener('click', () => toggleModal(false));
forgotModal.addEventListener('click', (e) => {
    if (e.target === forgotModal) toggleModal(false);
});

// Toasts
export function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    
    const isDark = html.classList.contains('dark');
    // Using clean glass styles for toasts too
    const baseStyle = isDark 
        ? 'bg-[#1a1a24]/90 border border-white/10 text-white' 
        : 'bg-white/90 border border-black/10 text-slate-900';
    
    toast.className = `px-5 py-3.5 rounded-2xl text-[13px] font-medium shadow-xl backdrop-blur-xl ${baseStyle} transition-all duration-300 transform translate-y-4 opacity-0`;
    toast.textContent = message;
    
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.remove('translate-y-4', 'opacity-0'));
    
    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}
