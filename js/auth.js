import { auth } from './firebase-init.js';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

// Login
document.getElementById('signInForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPass').value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Logged in successfully!");
        // window.location.href = 'dashboard.html';
    } catch (error) {
        alert("Login Error: " + error.message);
    }
});

// Sign Up
document.getElementById('signUpForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPass').value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Here you would normally save the Garage Name to Firestore
        alert(`Account created for ${name}!`);
        // window.location.href = 'onboarding.html';
    } catch (error) {
        alert("Signup Error: " + error.message);
    }
});
