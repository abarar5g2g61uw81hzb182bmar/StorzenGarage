export function initValidation() {
    // 1. Live Domain Checker
    const domainInput = document.getElementById('regDomain');
    const domainStatus = document.getElementById('domainStatus');
    const domainNextBtn = document.getElementById('domainNextBtn');
    let typingTimer;

    if (domainInput) {
        domainInput.addEventListener('input', function() {
            this.value = this.value.toLowerCase().replace(/[^a-z0-9]/g, '');
            domainStatus.innerHTML = '⏳';
            domainNextBtn.disabled = true;
            clearTimeout(typingTimer);

            if (this.value.length >= 3) {
                typingTimer = setTimeout(() => {
                    // Mock API check (Replace with real Firestore check later)
                    const takenDomains = ['demo', 'admin', 'test'];
                    if (takenDomains.includes(this.value)) {
                        domainStatus.innerHTML = '×';
                        domainStatus.style.color = '#ef4444';
                    } else {
                        domainStatus.innerHTML = '✓';
                        domainStatus.style.color = '#22c55e';
                        domainNextBtn.disabled = false;
                    }
                }, 800);
            } else {
                domainStatus.innerHTML = '';
            }
        });
    }

    // 2. Email Typo Detector
    const emailInput = document.getElementById('regEmail');
    const typoHint = document.getElementById('emailTypoHint');
    const typoSuggestion = document.getElementById('typoSuggestion');
    
    const commonTypos = {
        'gmil.com': 'gmail.com',
        'yaho.com': 'yahoo.com',
        'hotmai.com': 'hotmail.com'
    };

    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const parts = this.value.split('@');
            if (parts.length === 2) {
                const domain = parts[1].toLowerCase();
                if (commonTypos[domain]) {
                    typoSuggestion.innerText = parts[0] + '@' + commonTypos[domain];
                    typoHint.classList.remove('hidden');
                } else {
                    typoHint.classList.add('hidden');
                }
            }
        });

        if (typoSuggestion) {
            typoSuggestion.addEventListener('click', () => {
                emailInput.value = typoSuggestion.innerText;
                typoHint.classList.add('hidden');
            });
        }
    }

    // 3. Phone Masking
    const phoneInput = document.getElementById('regPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,5})/);
            e.target.value = !x[2] ? x[1] : '+' + x[1] + ' ' + x[2] + (x[3] ? ' ' + x[3] : '');
        });
    }

    // 4. Logo Dropzone Preview
    const logoInput = document.getElementById('regLogoInput');
    const dropzone = document.getElementById('logoDropzone');
    
    if (logoInput && dropzone) {
        logoInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    dropzone.innerHTML = `<img src="${event.target.result}" class="preview-img" alt="Logo">`;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // 5. Password Eye Toggles
    document.querySelectorAll('.toggle-pass').forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.previousElementSibling;
            if (input.type === 'password') {
                input.type = 'text';
                this.innerText = '*';
            } else {
                input.type = 'password';
                this.innerText = '•';
            }
        });
    });
}
document.addEventListener('DOMContentLoaded', initValidation);
