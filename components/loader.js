// ==========================================
// components/loader.js — SVG Car Drawing Animation
// ==========================================

export function initLoader() {
    const loaderContainer = document.getElementById('loader-container');
    if (!loaderContainer) return;

    loaderContainer.innerHTML = `
        <div class="loader-overlay" id="loaderOverlay">
            <div class="car-svg-container">
                <!-- Sleek Sports Car Outline SVG -->
                <svg viewBox="0 0 300 100" class="car-outline-svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <!-- Car Body Path -->
                    <path class="car-body-path" d="M 40 70 L 30 55 C 25 45, 35 40, 50 35 L 90 30 C 110 25, 130 15, 160 15 C 200 15, 230 30, 250 40 C 265 48, 275 55, 280 70 Z" />
                    <!-- Windows -->
                    <path class="car-window-path" d="M 100 30 C 120 20, 140 18, 160 18 C 180 18, 210 25, 230 38 L 160 38 Z" />
                    <!-- Wheels (Circles) -->
                    <circle class="car-wheel-path" cx="75" cy="70" r="15" />
                    <circle class="car-wheel-path" cx="225" cy="70" r="15" />
                    <!-- Details (Headlight) -->
                    <path class="car-detail-path" d="M 265 50 L 275 55" stroke-width="3" />
                </svg>
            </div>
            <p class="loader-text">ASSEMBLING WORKSPACE<span class="loading-dots">...</span></p>
        </div>
    `;
}
