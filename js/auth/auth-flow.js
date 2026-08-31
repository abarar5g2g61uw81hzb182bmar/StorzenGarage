import { auth, db } from '../firebase-init.js';
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
    updateDoc,
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";
import { showIsland } from '../ui/interactions.js';

export function initAuthFlow() {
    
    // ==========================================
    // 1. SECURE LOGIN FLOW
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
                
                // SPAM PROTECTION: Strict Email Verification Check
                if (!userCredential.user.emailVerified) {
                    showIsland('Access Denied. Please click the verification link sent to your email.', '⚠️');
                    await auth.signOut();
                    resetButton(submitBtn, originalText);
                    return;
                }

                // Activate Trial in Firestore upon first verified login
                const userDocRef = doc(db, "workshops", userCredential.user.uid);
                await updateDoc(userDocRef, {
                    "subscription.status": "trial_active",
                    "subscription.lastLogin": serverTimestamp()
                }).catch(err => console.log("Doc update skipped/failed", err)); // Silently catch if already updated

                showIsland('Welcome back! Loading workspace...', '✅');
                if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
                
                // Redirect to dashboard (Uncomment when dashboard is ready)
                // setTimeout(() => { window.location.href = 'dashboard.html'; }, 1500);
                
            } catch (error) {
                resetButton(submitBtn, originalText);
                let msg = 'Authentication failed.';
                if (error.code === 'auth/invalid-credential') msg = 'Invalid email or password.';
                showIsland(msg, '❌');
            }
        });
    }

    // ==========================================
    // 2. MAGIC LINK (FORGOT PASSWORD) + COOLDOWN
    // ==========================================
    const forgotPassLink = document.getElementById('forgotPassLink');
    const cooldownTimer = document.getElementById('cooldownTimer');
    let isCooldown = false;

    if (forgotPassLink) {
        forgotPassLink.addEventListener('click', async (e) => {
            e.preventDefault();
            if (isCooldown) return;

            const emailInput = document.getElementById('loginEmail');
            const email = emailInput.value.trim();
            
            if (!email) {
                showIsland('Enter your email above first.', '⚠️');
                emailInput.focus();
                return;
            }

            try {
                await sendPasswordResetEmail(auth, email);
                showIsland('Magic link sent to your inbox!', '✨');
                
                isCooldown = true;
                forgotPassLink.classList.add('hidden');
                cooldownTimer.classList.remove('hidden');
                
                let timeLeft = 30;
                cooldownTimer.innerText = `Wait ${timeLeft}s`;
                
                const timer = setInterval(() => {
                    timeLeft--;
                    cooldownTimer.innerText = `Wait ${timeLeft}s`;
                    if (timeLeft <= 0) {
                        clearInterval(timer);
                        isCooldown = false;
                        forgotPassLink.classList.remove('hidden');
                        cooldownTimer.classList.add('hidden');
                    }
                }, 1000);

            } catch (error) {
                let msg = 'Error sending link.';
                if (error.code === 'auth/user-not-found') msg = 'No account found with this email.';
                showIsland(msg, '❌');
            }
        });
    }

    // ==========================================
    // 3. ACCOUNT CREATION (FROZEN STATE)
    // ==========================================
    const signUpWizard = document.getElementById('signUpWizard');

    if (signUpWizard) {
        signUpWizard.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const finalBtn = document.getElementById('finalCreateBtn');
            const originalText = finalBtn.innerHTML;
            finalBtn.innerHTML = 'Securing Workspace...';
            finalBtn.style.pointerEvents = 'none';
            finalBtn.style.opacity = '0.6';

            try {
                const name = document.getElementById('regName').value.trim();
                const domain = document.getElementById('regDomain').value.trim();
                const garageName = document.getElementById('regGarageName').value.trim();
                const city = document.getElementById('regCity').value.trim();
                const email = document.getElementById('regEmail').value.trim();
                const phone = document.getElementById('regPhone').value.trim();
                const password = document.getElementById('regPassword').value;
                const isYearly = document.getElementById('yearlyDiscount').checked;
                
                const garageTypes = [];
                document.querySelectorAll('input[name="garageType"]:checked').forEach(chip => {
                    garageTypes.push(chip.value);
                });

                let logoBase64 = null;
                const logoInput = document.getElementById('regLogoInput');
                if (logoInput.files && logoInput.files[0]) {
                    logoBase64 = await toBase64(logoInput.files[0]);
                }

                // Create Auth User
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                await updateProfile(user, { displayName: name });
                
                // SEND VERIFICATION MAGIC LINK
                await sendEmailVerification(user);

                // Build Firestore Payload (Locked State)
                const workspaceData = {
                    ownerId: user.uid,
                    ownerName: name,
                    businessInfo: {
                        garageName: garageName,
                        city: city,
                        contactEmail: email,
                        contactPhone: phone,
                        garageTypes: garageTypes,
                        logoBase64: logoBase64 
                    },
                    domainInfo: {
                        subdomain: domain,
                        fullUrl: `${domain}.garages.storzen.io`
                    },
                    subscription: {
                        plan: isYearly ? 'yearly' : 'monthly',
                        status: 'pending_verification', // Account is useless until verified
                        trialExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                        firstMonthPrice: 28,
                        regularPrice: isYearly ? 1069 : 99 
                    },
                    createdAt: serverTimestamp()
                };

                await setDoc(doc(db, "workshops", user.uid), workspaceData);

                showIsland('Account locked. Verify email to activate!', '🔒');
                if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
                
                // Immediately log them out to prevent unverified dashboard access
                await auth.signOut();
                finalBtn.innerHTML = 'Check your Inbox!';

            } catch (error) {
                resetButton(finalBtn, originalText);
                let msg = 'Failed to create account.';
                if (error.code === 'auth/email-already-in-use') msg = 'This email is already registered.';
                if (error.code === 'auth/weak-password') msg = 'Password must be at least 6 characters.';
                showIsland(msg, '❌');
            }
        });
    }

    function resetButton(btn, text) {
        btn.innerHTML = text;
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'auto';
    }

    function toBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
}

document.addEventListener('DOMContentLoaded', initAuthFlow);
