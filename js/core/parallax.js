export function initParallax() {
    const tiltCard = document.getElementById('tiltCard');
    const bgLayer = document.getElementById('bg-layer');
    const isDesktop = window.innerWidth >= 768;

    // Center coordinates
    let cx = window.innerWidth / 2;
    let cy = window.innerHeight / 2;

    window.addEventListener('resize', () => {
        cx = window.innerWidth / 2;
        cy = window.innerHeight / 2;
    });

    // 1. Desktop Mouse Tracking
    if (isDesktop) {
        document.addEventListener('mousemove', (e) => {
            if (!tiltCard) return;
            const x = (e.clientX - cx);
            const y = (e.clientY - cy);

            // Card Tilt (Opposite direction for 3D feel)
            const tiltX = (y / cy) * -10; 
            const tiltY = (x / cx) * 10;
            tiltCard.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

            // Background Pan (Same direction, subtle movement)
            if (bgLayer) {
                const bgX = (x / cx) * -15; 
                const bgY = (y / cy) * -15;
                bgLayer.style.transform = `translate(${bgX}px, ${bgY}px) scale(1.05)`;
            }
        });

        document.addEventListener('mouseleave', () => {
            if (tiltCard) tiltCard.style.transform = `rotateX(0deg) rotateY(0deg)`;
            if (bgLayer) bgLayer.style.transform = `translate(0px, 0px) scale(1.05)`;
        });
    }

    // 2. Mobile Device Orientation (Gyroscope)
    if (!isDesktop && window.DeviceOrientationEvent) {
        // Request permission for iOS 13+
        const requestPermission = () => {
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                DeviceOrientationEvent.requestPermission().then(response => {
                    if (response == 'granted') window.addEventListener('deviceorientation', handleOrientation);
                }).catch(console.error);
            } else {
                window.addEventListener('deviceorientation', handleOrientation);
            }
        };

        // Attach to first tap anywhere on screen to trigger permission if needed
        document.body.addEventListener('click', requestPermission, { once: true });

        function handleOrientation(e) {
            if (!tiltCard || !e.gamma || !e.beta) return;

            // Gamma is left-to-right (-90 to 90). Beta is front-to-back (-180 to 180)
            let x = e.gamma; 
            let y = e.beta - 45; // Offset natural holding angle

            // Clamp values to prevent flipping
            x = Math.max(-30, Math.min(30, x));
            y = Math.max(-30, Math.min(30, y));

            const tiltX = y / 2;
            const tiltY = x / 2;
            tiltCard.style.transform = `rotateX(${-tiltX}deg) rotateY(${tiltY}deg)`;

            if (bgLayer) {
                bgLayer.style.transform = `translate(${x * -0.5}px, ${y * -0.5}px) scale(1.1)`;
            }
        }
    }
}

// Auto-init
document.addEventListener('DOMContentLoaded', initParallax);
