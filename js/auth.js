// ==========================================
// js/auth.js — Firebase Magic Link & Firestore Setup
// ==========================================

import { auth, db } from './firebase-init.js';
import { 
    sendSignInLinkToEmail, 
    isSignInWithEmailLink, 
    signInWithEmailLink 
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import { 
    doc, 
    setDoc, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

// --- 1. Custom Liquid Glass Toast Notification ---
export function showToast(message, type = 'success') {
    const existing = document.getElementById('glassToast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'glassToast';
    
    // Premium Glass Styling
    toast.style.position = 'fixed';
    toast.style.bottom = '35px';
    toast.style.right = '35px';
    toast.style.padding = '18px 26px';
    toast.style.borderRadius = '20px';
    toast.style.background = type === 'error' ? 'rgba(153, 27, 27, 0.4)' : 'var(--glass-bg)';
    toast.style.backdropFilter = 'blur(30px)';
    toast.style.webkitBackdropFilter = 'blur(30px)';
    toast.style.border = type === 'error' ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid var(--glass-border)';
    toast.style.color = type === 'error' ? '#fca5a5' : 'var(--text-main)';
    toast.style.boxShadow = 'var(--glass-shadow)';
    toast.style.zIndex = '99999';
    toast.style.fontWeight = '600';
    toast.style.fontSize = '0.95rem';
    toast.style.transform = 'translateY(30px)';
    toast.style.opacity = '0';
    toast.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    toast.innerText = message;

    document.body.appendChild(toast);

    // Animate In
    requestAnimationFrame(() => {
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
    });

    // Auto Remove
    setTimeout(() => {
        toast.style.transform = 'translateY(30px)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, 4500);
}


// --- 2. LOGIN FLOW (Sending Magic Link) ---
const signInForm = document.getElementById('signInForm');

if (signInForm) {
    signInForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value.trim();
        const submitBtn = document.getElementById('magicLinkBtn');
        
        // Button Loading State
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Sending Link...';
        submitBtn.style.opacity = '0.6';
        submitBtn.style.pointerEvents = 'none';

        const actionCodeSettings = {
            // URL must point to your Firebase Hosted domain or localhost during dev
            url: window.location.origin + window.location.pathname, 
            handleCodeInApp: true
        };

        try {
            await sendSignInLinkToEmail(auth, email, actionCodeSettings);
            // Save email in localStorage so we don't have to ask for it again when they click the link
            window.localStorage.setItem('emailForSignIn', email);
            
            showToast('Magic link sent! Please check your inbox.', 'success');
            submitBtn.innerHTML = 'Secure Link Sent ✓';
            
        } catch (error) {
            submitBtn.innerHTML = originalText;
            submitBtn.style.opacity = '1';
            submitBtn.style.pointerEvents = 'auto';
            showToast('Error: ' + error.message, 'error');
        }
    });
}


// --- 3. ONBOARDING FLOW (Send Verification / Magic Link during signup) ---
const sendVerificationBtn = document.getElementById('sendVerificationBtn');

if (sendVerificationBtn) {
    sendVerificationBtn.addEventListener('click', async (e) => {
        // Validation handled by ui.js. Here we just trigger the backend send.
        const email = document.getElementById('regEmail').value.trim();
        if (!email) return;

        const actionCodeSettings = {
            url: window.location.origin + window.location.pathname,
            handleCodeInApp: true
        };

        try {
            await sendSignInLinkToEmail(auth, email, actionCodeSettings);
            window.localStorage.setItem('emailForSignIn', email);
            showToast(`Verification link sent to ${email}`, 'success');
        } catch (error) {
            showToast('Could not send verification: ' + error.message, 'error');
        }
    });
}


// --- 4. FINAL WORKSPACE CREATION (Checkout Slide) ---
const signUpWizard = document.getElementById('signUpWizard');

if (signUpWizard) {
    signUpWizard.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Collect all data from the previous slides
        const name = document.getElementById('regName').value.trim();
        const domain = document.getElementById('regDomain').value.trim();
        const garageName = document.getElementById('regGarageName').value.trim();
        const city = document.getElementById('regCity').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const phone = document.getElementById('regPhone').value.trim();
        const isYearly = document.getElementById('yearlyDiscount').checked;
        
        const finalBtn = document.getElementById('finalCreateBtn');
        
        finalBtn.innerHTML = 'Securing Workspace...';
        finalBtn.style.pointerEvents = 'none';
        finalBtn.style.opacity = '0.6';

        try {
            // Because they use a magic link, the actual user creation in Firebase Auth 
            // happens when they click the link in their email. 
            // Here, we preemptively save their setup data to Firestore linked to their email.
            
            // Create a safe document ID from their email
            const safeDocId = email.toLowerCase().replace(/[^a-z0-9]/g, '');
            
            const workspaceData = {
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
                    status: 'pending_verification',
                    firstMonthPrice: 28,
                    regularPrice: isYearly ? 1069 : 99 // 10% discount math approx
                },
                createdAt: serverTimestamp()
            };

            // Write to Firestore
            await setDoc(doc(db, "pending_workshops", safeDocId), workspaceData);

            showToast('Setup complete! Click the link in your email to login and access your dashboard.', 'success');
            finalBtn.innerHTML = 'Check your Inbox!';

        } catch (error) {
            finalBtn.innerHTML = 'Start Free Trial &rarr;';
            finalBtn.style.pointerEvents = 'auto';
            finalBtn.style.opacity = '1';
            showToast('Error setting up workspace: ' + error.message, 'error');
        }
    });
}


// --- 5. HANDLING THE USER CLICKING THE EMAIL LINK ---
window.addEventListener('DOMContentLoaded', () => {
    // Check if the current URL contains a Firebase Auth Link
    if (isSignInWithEmailLink(auth, window.location.href)) {
        
        let email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
            // If they opened the link on a different device/browser
            email = window.prompt('Please enter your email to confirm verification:');
        }

        // Sign the user in
        signInWithEmailLink(auth, email, window.location.href)
            .then((result) => {
                window.localStorage.removeItem('emailForSignIn');
                
                showToast('Successfully verified! Logging you in...', 'success');
                
                // Route to dashboard
                // setTimeout(() => { window.location.href = 'dashboard.html'; }, 2000);
            })
            .catch((error) => {
                showToast('Link expired or invalid. Please request a new one.', 'error');
            });
    }
});
