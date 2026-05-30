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
export function clickToggleImgSize(e) {

    const media = e.target.closest('.step-img, .step-vid');
    if (!media) return;

    media.classList.toggle('enlarge');
}