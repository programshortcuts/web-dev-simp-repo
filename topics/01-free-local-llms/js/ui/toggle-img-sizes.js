// toggle-img-sizes.js
let mediaCache = [];
import  { mainTargetDiv } from "../nav/main-content-nav.js";

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

    root.addEventListener("click", e => {

        const media = e.target.closest(".step-img, .step-vid");
        if (!media) return;

        const step = media.closest('.step-float');
        if (!step) return;

        // ALWAYS RESET FIRST
        const items = [...step.querySelectorAll('.step-img, .step-vid')];
        items.forEach(el => el.classList.remove('enlarge'));

        step.dataset.mediaIndex = -1;

        // then apply clean toggle
        media.classList.add("enlarge");
    });
}