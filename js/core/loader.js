export function initLoader() {
    const loaderContainer = document.getElementById('loader-container');
    const appWrapper = document.getElementById('appWrapper');
    if (!loaderContainer) return;

    loaderContainer.innerHTML = `
        <div class="car-svg-container">
            <svg viewBox="0 0 300 100" class="car-outline-svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path class="car-body-path" d="M 40 70 L 30 55 C 25 45, 35 40, 50 35 L 90 30 C 110 25, 130 15, 160 15 C 200 15, 230 30, 250 40 C 265 48, 275 55, 280 70 Z" />
                <path class="car-window-path" d="M 100 30 C 120 20, 140 18, 160 18 C 180 18, 210 25, 230 38 L 160 38 Z" />
                <circle class="car-wheel-path" cx="75" cy="70" r="15" />
                <circle class="car-wheel-path" cx="225" cy="70" r="15" />
                <path class="car-detail-path" d="M 265 50 L 275 55" stroke-width="3" />
            </svg>
        </div>
        <p class="loader-text" style="font-weight: 700; letter-spacing: 3px; font-size: 0.85rem; margin-top: 20px;">
            ASSEMBLING WORKSPACE<span class="loading-dots">...</span>
        </p>
    `;

    // Internal CSS for SVG Drawing
    const style = document.createElement('style');
    style.innerHTML = `
        .car-body-path { stroke-dasharray: 800; stroke-dashoffset: 800; animation: draw 2s ease-in-out forwards; }
        .car-window-path { stroke-dasharray: 300; stroke-dashoffset: 300; animation: draw 1.5s ease-in-out 0.5s forwards; }
        .car-wheel-path { stroke-dasharray: 100; stroke-dashoffset: 100; animation: draw 1s ease-in-out 1s forwards; }
        .car-detail-path { stroke-dasharray: 50; stroke-dashoffset: 50; stroke: #ff3333; animation: blink 2s infinite; }
        @keyframes draw { to { stroke-dashoffset: 0; } }
        @keyframes blink { 0%, 100% { opacity: 0.2; } 50% { opacity: 1; } }
        .loader-overlay { display: flex; flex-direction: column; align-items: center; justify-content: center; position: fixed; inset: 0; z-index: 999; background: var(--glass-bg); backdrop-filter: blur(30px); transition: opacity 0.8s ease; }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
        loaderContainer.style.opacity = '0';
        setTimeout(() => {
            loaderContainer.classList.add('hidden');
            if (appWrapper) appWrapper.classList.remove('loading');
        }, 800);
    }, 2800);
}
document.addEventListener('DOMContentLoaded', initLoader);
