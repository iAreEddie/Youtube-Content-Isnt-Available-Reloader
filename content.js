/**
 * YouTube Video Reloader Content Script
 * Efficient detection using MutationObserver to avoid CPU polling.
 */

(function () {
    const ERROR_TEXT = "This content isn't available, try again later.";
    let observer = null;

    function initObserver() {
        if (observer) observer.disconnect();

        observer = new MutationObserver(() => {
            const errorContainer = document.querySelector('.ytp-error');
            if (errorContainer) {
                const errorTextElement = errorContainer.querySelector('.ytp-error-content-wrap-reason span');
                if (errorTextElement && errorTextElement.textContent.trim() === ERROR_TEXT) {
                    console.log('[YouTube Video Reloader] Error detected via MutationObserver! Reloading...');
                    observer.disconnect();
                    location.reload();
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    console.log('[YouTube Video Reloader] Extension active using MutationObserver.');
    initObserver();
    window.addEventListener('yt-navigate-finish', initObserver);
})();
