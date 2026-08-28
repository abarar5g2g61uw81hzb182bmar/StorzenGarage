// js/auth.js - Firebase Authentication & Database Storage

import { auth, db } from './firebase-init.js';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import { 
    doc, 
    setDoc, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

// --- Custom Glass Toast Notification ---
function showToast(message, type = 'success') {
    const existing = document.getElementById('glassToast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'glassToast';
    
    // Apply styling based on liquid glass CSS rules
    toast.style.position = 'fixed';
    toast.style.bottom = '30px';
    toast.style.right = '30px';
    toast.style.padding = '16px 24px';
    toast.style.borderRadius = '16px';
    toast.style.background = type === 'error' ? 'rgba(220, 38, 38, 0.2)' : 'var(--glass-bg)';
    toast.style.backdropFilter = 'blur(20px)';
    toast.style.border = type === 'error' ? '1px solid rgba(220, 38, 38, 0.4)' : '1px solid var(--glass-border)';
    toast.style.color = type === 'error' ? '#ff8a8a' : 'var(--text-main)';
    toast.style.boxShadow = 'var(--glass-shadow)';
    toast.style.zIndex = '9999';
    toast.style.fontWeight = '600';
    toast.style.fontSize = '0.9rem';
    toast.style.transform = 'translateY(20px)';
    toast.style.opacity = '0';
    toast.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    toast.innerText = message;

    document.body.appendChild(toast);

    // Animate In
    requestAnimationFrame(() => {
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
    });

    // Auto Remove
    setTimeout(() => {
        toast.style.transform = 'translateY(20px)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}


// --- LOGIN LOGIC ---
const signInForm = document.getElementById('signInForm');
if (signInForm) {
    signInForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPass').value;
        const submitBtn = signInForm.querySelector('button[type="submit"]');

        submitBtn.innerHTML = 'Authenticating...';
        submitBtn.style.opacity = '0.7';

        try {
            await signInWithEmailAndPassword(auth, email, password);
            showToast('Welcome back! Loading workspace...');
            
            // Redirect to dashboard (Uncomment when dashboard is ready)
            // setTimeout(() => { window.location.href = 'dashboard.html'; }, 1500);
            
        } catch (error) {
            submitBtn.innerHTML = 'Sign In &rarr;';
            submitBtn.style.opacity = '1';
            
            let msg = 'Authentication failed. Please check credentials.';
            if (error.code === 'auth/invalid-credential') msg = 'Invalid email or password.';
            if (error.code === 'auth/too-many-requests') msg = 'Too many attempts. Try again later.';
            showToast(msg, 'error');
        }
    });
}


// --- FINAL ACCOUNT CREATION LOGIC ---
const signUpWizard = document.getElementById('signUpWizard');
if (signUpWizard) {
    signUpWizard.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // 1. Gather all data from the wizard slides
        const name = document.getElementById('regName').value.trim();
        const domain = document.getElementById('regDomain').value.trim();
        const garageName = document.getElementById('regGarageName').value.trim();
        const city = document.getElementById('regCity').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const phone = document.getElementById('regPhone').value.trim();
        const password = document.getElementById('regPassword').value;
        const isYearly = document.getElementById('yearlyDiscount').checked;
        const otpCode = document.getElementById('regOtp').value.trim();
        
        const finalBtn = document.getElementById('finalCreateBtn');

        // Validation check (Mock OTP validation)
        if (otpCode.length !== 6) {
            showToast('Please enter a valid 6-digit OTP.', 'error');
            return;
        }

        finalBtn.innerHTML = 'Creating Workspace...';
        finalBtn.style.pointerEvents = 'none';
        finalBtn.style.opacity = '0.7';

        try {
            // 2. Create Firebase Auth User
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 3. Update Auth Profile
            await updateProfile(user, { displayName: name });

            // 4. Create Master Workshop Document in Firestore
            const workspaceData = {
                ownerId: user.uid,
                ownerName: name,
                businessInfo: {
                    garageName: garageName,
                    city: city,
                    contactEmail: email,
                    contactPhone: phone
                },
                domainInfo: {
                    subdomain: domain,
                    fullUrl: `${domain}.garages.storzen.io`
                },
                subscription: {
                    plan: isYearly ? 'yearly' : 'monthly',
                    status: 'trial',
                    trialExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                    nextPaymentAmount: isYearly ? 1069 : 28 // ₹28 first month, or yearly discounted
                },
                createdAt: serverTimestamp(),
                settings: {
                    taxEnabled: false,
                    logoBase64: null
                }
            };

            // Assuming schema: workshops/{workspaceId}
            // We use the user's UID as the workspace ID for the MVP to keep relations simple
            await setDoc(doc(db, "workshops", user.uid), workspaceData);

            showToast('Workspace created successfully! Redirecting...', 'success');

            // 5. Redirect to Dashboard
            // setTimeout(() => { window.location.href = 'dashboard.html'; }, 2000);

        } catch (error) {
            finalBtn.innerHTML = 'Start Free Trial &rarr;';
            finalBtn.style.pointerEvents = 'auto';
            finalBtn.style.opacity = '1';

            let msg = 'Failed to create account.';
            if (error.code === 'auth/email-already-in-use') msg = 'This email is already registered.';
            if (error.code === 'auth/weak-password') msg = 'Password must be at least 6 characters.';
            
            showToast(msg, 'error');
        }
    });
}
