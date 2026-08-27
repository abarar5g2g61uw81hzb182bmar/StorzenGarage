import { auth } from './firebase-init.js';
import { 
    signInWithEmailAndPassword, 
    GoogleAuthProvider, 
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

const signInForm = document.getElementById('signInForm');
const googleAuthBtn = document.getElementById('googleAuthBtn');

signInForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('emailInput').value.trim();
    const password = document.getElementById('passwordInput').value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Logged in successfully!");
    } catch (error) {
        alert("Error: " + error.message);
    }
});

googleAuthBtn.addEventListener('click', async () => {
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
        alert("Google Sign in successful!");
    } catch (error) {
        if(error.code !== 'auth/popup-closed-by-user') {
            alert("Google login failed.");
        }
    }
});
