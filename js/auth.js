import { auth, db } from './firebase-init.js';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    sendEmailVerification,
    sendPasswordResetEmail,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import { 
    doc, 
    setDoc, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

// ==========================================
// 1. Premium Glass Toast Notification
// ==========================================
export function showToast(message, type = 'success') {
    const existing = document.getElementById('glassToast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'glassToast';
    
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

    requestAnimationFrame(() => {
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
    });

    setTimeout(() => {
        toast.style.transform = 'translateY(30px)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, 4500);
}

// ==========================================
// 2. STANDARD LOGIN FLOW
// ==========================================
const signInForm = document.getElementById('signInForm');

if (signInForm) {
    signInForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPass').value;
        const submitBtn = document.getElementById('loginBtn');
        
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Authenticating...';
        submitBtn.style.opacity = '0.6';
        submitBtn.style.pointerEvents = 'none';

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            
            // Check if email is verified
            if (!userCredential.user.emailVerified) {
                showToast('Please verify your email address before accessing the dashboard.', 'error');
                auth.signOut();
                resetButton(submitBtn, originalText);
                return;
            }

            showToast('Welcome back! Loading workspace...', 'success');
            // setTimeout(() => { window.location.href = 'dashboard.html'; }, 1500);
            
        } catch (error) {
            resetButton(submitBtn, originalText);
            let msg = 'Authentication failed. Please check credentials.';
            if (error.code === 'auth/invalid-credential') msg = 'Invalid email or password.';
            showToast(msg, 'error');
        }
    });
}

// ==========================================
// 3. FORGOT PASSWORD (MAGIC LINK)
// ==========================================
const forgotPassLink = document.getElementById('forgotPassLink');
if (forgotPassLink) {
    forgotPassLink.addEventListener('click', async (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('loginEmail');
        const email = emailInput.value.trim();
        
        if (!email) {
            showToast('Please enter your email address in the field first to reset password.', 'error');
            emailInput.focus();
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            showToast(`Password reset link sent to ${email}. Check your inbox!`, 'success');
        } catch (error) {
            let msg = 'Error sending reset link.';
            if (error.code === 'auth/user-not-found') msg = 'No account found with this email.';
            showToast(msg, 'error');
        }
    });
}

// ==========================================
// 4. ACCOUNT CREATION & VERIFICATION LINK
// ==========================================
const signUpWizard = document.getElementById('signUpWizard');

if (signUpWizard) {
    signUpWizard.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('regName').value.trim();
        const domain = document.getElementById('regDomain').value.trim();
        const garageName = document.getElementById('regGarageName').value.trim();
        const city = document.getElementById('regCity').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const phone = document.getElementById('regPhone').value.trim();
        const password = document.getElementById('regPassword').value;
        const isYearly = document.getElementById('yearlyDiscount').checked;
        
        const finalBtn = document.getElementById('finalCreateBtn');
        const originalText = finalBtn.innerHTML;
        
        finalBtn.innerHTML = 'Securing Workspace...';
        finalBtn.style.pointerEvents = 'none';
        finalBtn.style.opacity = '0.6';

        try {
            // A. Create User in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // B. Update Profile Name
            await updateProfile(user, { displayName: name });

            // C. Send Verification Link immediately
            await sendEmailVerification(user);

            // D. Save Data to Firestore
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
                    status: 'trial_pending_verification',
                    trialExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
                    firstMonthPrice: 28,
                    regularPrice: isYearly ? 1069 : 99 
                },
                createdAt: serverTimestamp()
            };

            await setDoc(doc(db, "workshops", user.uid), workspaceData);

            showToast('Account created! Please check your email to verify your account before logging in.', 'success');
            
            // Log them out until they verify
            await auth.signOut();
            
            finalBtn.innerHTML = 'Check your Inbox!';

        } catch (error) {
            resetButton(finalBtn, originalText);
            let msg = 'Failed to create account.';
            if (error.code === 'auth/email-already-in-use') msg = 'This email is already registered.';
            if (error.code === 'auth/weak-password') msg = 'Password must be at least 6 characters.';
            showToast(msg, 'error');
        }
    });
}

// Utility function to reset buttons
function resetButton(btn, text) {
    btn.innerHTML = text;
    btn.style.opacity = '1';
    btn.style.pointerEvents = 'auto';
}
