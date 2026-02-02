/**
 * YouTube Video Reloader Content Script
 * High-frequency detection for playback errors.
 */

(function () {
    const ERROR_TEXT = "This content isn't available, try again later.";
    let checkInterval = null;

    function startFastCheck() {
        if (checkInterval) clearInterval(checkInterval);

        console.log('[YouTube Video Reloader] Starting high-frequency check (100Hz)...');

        checkInterval = setInterval(() => {
            const player = document.querySelector('#ytd-player');
            const errorContainer = document.querySelector('.ytp-error');

            // 1. Detect Error
            if (errorContainer) {
                const errorTextElement = errorContainer.querySelector('.ytp-error-content-wrap-reason span');
                if (errorTextElement && errorTextElement.textContent.trim() === ERROR_TEXT) {
                    console.log('[YouTube Video Reloader] Error detected! Reloading immediately...');
                    clearInterval(checkInterval);
                    location.reload();
                    return;
                }
            }

            // 2. Detect Success (Player exists and has a video source, no error)
            if (player && !errorContainer) {
                const video = player.querySelector('video');
                // Only stop if the video element has a source, meaning it's actually trying to play
                if (video && video.src && video.src.startsWith('blob:')) {
                    console.log('[YouTube Video Reloader] Video loaded successfully. Stopping check.');
                    clearInterval(checkInterval);
                }
            }
        }, 100); // 10 times per second
    }

    // Run on initial load
    startFastCheck();

    // Restart check on YouTube SPA navigation (new video clicked)
    window.addEventListener('yt-navigate-finish', () => {
        console.log('[YouTube Video Reloader] Navigation detected. Restarting check...');
        startFastCheck();
    });
})();
