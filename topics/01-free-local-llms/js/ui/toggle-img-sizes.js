// toggle-img-sizes.js
let mediaCache = [];

// =========================
// CACHE (CALL AFTER INJECT)
// =========================
export function initMediaCache(root = document) {
    mediaCache = [...root.querySelectorAll('.step-img, .step-vid')];
}

// alias for your old code (FIXES YOUR ERROR)
export function refreshImages(root = document) {
    initMediaCache(root);
}

// =========================
// RESET ALL ENLARGE STATES
// =========================
export function denlargeAllImages() {
    mediaCache.forEach(el => {
        el.classList.remove('enlarge');
    });
}

// =========================
// CYCLE MEDIA INSIDE A STEP
// =========================
export function cycleMedia(step) {

    if (!step) return;

    const items = [...step.querySelectorAll('.step-img, .step-vid')];

    if (!items.length) return;

    // clear all first
    items.forEach(el => el.classList.remove('enlarge'));

    let index = Number(step.dataset.mediaIndex ?? -1);
    index++;

    if (index >= items.length) {
        step.dataset.mediaIndex = -1;
        return;
    }

    items[index].classList.add('enlarge');
    step.dataset.mediaIndex = index;
}

// =========================
// CLICK TOGGLE SINGLE MEDIA
// =========================
// =========================
// GLOBAL MEDIA CLICK
// =========================
export function initMediaClicks(root = document) {

    root.addEventListener("click", (e) => {

        const media = e.target.closest('.step-img, .step-vid');
        if (!media) return;

        const step = media.closest('.step-float');
        if (!step) return;

        const items = [...step.querySelectorAll('.step-img, .step-vid')];

        const wasActive = media.classList.contains('enlarge');

        // always reset first
        items.forEach(el => el.classList.remove('enlarge'));
        step.dataset.mediaIndex = -1;

        // ONLY re-apply if it WAS NOT active
        if (!wasActive) {
            media.classList.add('enlarge');
            step.dataset.mediaIndex = items.indexOf(media);
        }
    });
}

export function bindMainFocusReset(mainTargetDiv) {

    if (!mainTargetDiv) return;

    mainTargetDiv.addEventListener('focusin', () => {

        // reset all media when entering main area
        denlargeAllImages();

        // reset indexes too (important)
        mediaCache.forEach(el => {
            const step = el.closest('.step-float');
            if (step) step.dataset.mediaIndex = -1;
        });
    });
}
export function initGlobalMediaReset(root = document) {

    document.addEventListener('pointerdown', (e) => {

        const media = e.target.closest('.step-img, .step-vid');

        // CASE 1: clicked media → allow normal handling
        if (media) return;

        // CASE 2: clicked anywhere else → HARD RESET EVERYTHING
        denlargeAllImages();

        document.querySelectorAll('.step-float').forEach(step => {
            step.dataset.mediaIndex = -1;
        });
    });
}