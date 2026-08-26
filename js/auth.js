import { auth } from './firebase-init.js';
import { 
    signInWithEmailAndPassword, 
    GoogleAuthProvider, 
    signInWithPopup,
    sendPasswordResetEmail,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import { showToast } from './ui.js';

// DOM Elements
const signInForm = document.getElementById('signInForm');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const rememberMeCheckbox = document.getElementById('rememberMeCheckbox');
const googleAuthBtn = document.getElementById('googleAuthBtn');
const forgotPasswordForm = document.getElementById('forgotPasswordForm');
const forgotEmailInput = document.getElementById('forgotEmailInput');

// Email/Password Sign In
signInForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    try {
        const persistence = rememberMeCheckbox.checked ? browserLocalPersistence : browserSessionPersistence;
        await setPersistence(auth, persistence);
        
        await signInWithEmailAndPassword(auth, email, password);
        showToast('Login successful! Redirecting...', 'success');
        
        // window.location.href = 'dashboard.html';
    } catch (error) {
        let msg = 'Login failed. Please check your credentials.';
        if (error.code === 'auth/invalid-credential') msg = 'Invalid email or password.';
        showToast(msg, 'error');
    }
});

// Google Auth
googleAuthBtn.addEventListener('click', async () => {
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
        showToast('Google login successful!', 'success');
        // window.location.href = 'dashboard.html';
    } catch (error) {
        if (error.code !== 'auth/popup-closed-by-user') {
            showToast('Google authentication failed.', 'error');
        }
    }
});

// Forgot Password
forgotPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = forgotEmailInput.value.trim();

    try {
        await sendPasswordResetEmail(auth, email);
        showToast('Password reset link sent to your email!', 'success');
        document.getElementById('closeForgotModalBtn').click(); // close modal
        forgotEmailInput.value = '';
    } catch (error) {
        let msg = 'Failed to send reset link.';
        if (error.code === 'auth/user-not-found') msg = 'No account found with this email.';
        showToast(msg, 'error');
    }
});
