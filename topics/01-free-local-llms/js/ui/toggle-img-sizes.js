// toggle-img-sizes.js
/* =========================
   MEDIA STATE SYSTEM (CLEAN)
========================= */

let mediaCache = [];

/* =========================
   INIT CACHE
========================= */
export function initMediaCache(root = document) {
    mediaCache = [...root.querySelectorAll('.step-img, .step-vid')];
}

/* alias for compatibility */
export function refreshImages(root = document) {
    initMediaCache(root);
}

/* =========================
   GLOBAL RESET
========================= */
export function denlargeAllImages() {
    mediaCache.forEach(el => el.classList.remove('enlarge'));

    mediaCache.forEach(el => {
        const step = el.closest('.step-float');
        if (step) step.dataset.mediaIndex = -1;
    });
}

/* =========================
   STEP-LEVEL CYCLING
========================= */
export function cycleMedia(step) {
    if (!step) return;

    const items = [...step.querySelectorAll('.step-img, .step-vid')];
    if (!items.length) return;

    // current index
    let index = Number(step.dataset.mediaIndex ?? -1);
    index++;

    // reset if overflow
    if (index >= items.length) {
        items.forEach(el => el.classList.remove('enlarge'));
        step.dataset.mediaIndex = -1;
        return;
    }

    // clear previous
    items.forEach(el => el.classList.remove('enlarge'));

    // set new
    const active = items[index];
    active.classList.add('enlarge');

    step.dataset.mediaIndex = index;

    // if it's a video, try play safely
    if (active.classList.contains('step-vid')) {
        const vid = active.querySelector('video');
        vid?.play();
    }
}

/* =========================
   CLICK TOGGLE (MEDIA ONLY)
========================= */
export function initMediaClicks(root = document) {
    root.addEventListener('click', (e) => {
        const media = e.target.closest('.step-img, .step-vid');
        if (!media) return;

        // ignore controls completely
        if (e.target.closest('.playbtn, .fwdBtn, .rwdBtn')) return;

        const step = media.closest('.step-float');
        if (!step) return;

        const items = [...step.querySelectorAll('.step-img, .step-vid')];

        const wasActive = media.classList.contains('enlarge');

        // reset step first
        items.forEach(el => el.classList.remove('enlarge'));
        step.dataset.mediaIndex = -1;

        // re-apply if not same
        if (!wasActive) {
            media.classList.add('enlarge');
            step.dataset.mediaIndex = items.indexOf(media);

            const vid = media.querySelector('video');
            vid?.play?.();
        }
    });
}

/* =========================
   GLOBAL RESET ON OUTSIDE CLICK
========================= */
export function initGlobalMediaReset(root = document) {
    document.addEventListener('pointerdown', (e) => {
        const isMedia = e.target.closest('.step-img, .step-vid');
        const isControl = e.target.closest('.playbtn, .fwdBtn, .rwdBtn');

        if (isMedia || isControl) return;

        denlargeAllImages();
    });
}

/* =========================
   OPTIONAL FOCUS RESET
========================= */
export function bindMainFocusReset(mainTargetDiv) {
    if (!mainTargetDiv) return;

    mainTargetDiv.addEventListener('focusin', () => {
        denlargeAllImages();
    });
}