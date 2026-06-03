// step-nav.js
/* =========================
   STEP NAVIGATION (CLEAN)
========================= */

import { pauseAllVideos } from "../ui/video-controls.js";
import { cycleMedia, denlargeAllImages } from "../ui/toggle-img-sizes.js";

import { changeTutorialLink } from "../ui/change-tutorial-link.js";
import { lastClickedSideBarLink } from "./side-bar-nav.js";

let steps = [];
let currentIndex = 0;

export let lastStep = null;

/* =========================
   INIT
========================= */

export function initStepNavigation({ mainTargetDiv }) {
    if (!mainTargetDiv) return;

    steps = [...mainTargetDiv.querySelectorAll('.step-float')];
    currentIndex = 0;

    steps.forEach((step, index) => {
        step.setAttribute('tabindex', '0');

        step.addEventListener('focus', () => {
            lastStep = step;
            currentIndex = index;

            step.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        });

        step.addEventListener('keydown', (e) => handleStepKey(e, step, index));
    });

    syncStep();
}

/* =========================
   KEY HANDLER (STEP ONLY)
========================= */

function handleStepKey(e, step, index) {
    const key = e.key.toLowerCase();
    const active = document.activeElement;

    function getFirstFocusableChild(targetStep) {
        return [...targetStep.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]'
        )].find((el) => {
            if (el.matches('a, img, video, audio') || el.hasAttribute('disabled')) return false;
            return !el.closest('.vid-cntrl-btns');
        });
    }

    if (!step.contains(active)) return;

    changeTutorialLink(e);

    /* =========================
       SHIFT + ENTER → cycle media
    ========================= */
    if (key === 'enter' && e.shiftKey) {
        e.preventDefault();

        cycleMedia(step);
        return;
    }

    /* =========================
       ENTER → step action / media fallback
    ========================= */
    if (key === 'enter' && !e.shiftKey) {
        e.preventDefault();
        changeTutorialLink(e)
        const isDirectStepFocus = active === step;

        if (isDirectStepFocus) {
            const firstFocusableChild = getFirstFocusableChild(step);

            if (firstFocusableChild) {
                firstFocusableChild.focus();
                return;
            }
        }

        cycleMedia(step);
        return;
    }

    /* =========================
       M key (sidebar restore)
    ========================= */
    if (key === 'm') {
        const link = e.target.closest('a');
        if (link) step.focus();
        return;
    }
}

/* =========================
   GLOBAL NAV (F / A / NUMBERS)
========================= */

document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    const active = document.activeElement;

    if (!steps.length) return;

    const isBlocked =
        active?.tagName === 'VIDEO' ||
        active?.classList?.contains('copy-code');

    if (isBlocked) {
        if (key === 's') lastClickedSideBarLink?.focus();
        return;
    }

    if (
        active?.closest?.('.side-bar') ||
        active?.id === 'sideBarBtn'
    ) return;

    const activeStep = active?.closest?.('.step-float');

    if (activeStep) {
        currentIndex = steps.indexOf(activeStep);
    }

    /* =========================
       NEXT (F)
    ========================= */
    if (key === 'f') {
        currentIndex = (currentIndex + 1) % steps.length;
        steps[currentIndex]?.focus();
        return;
    }

    /* =========================
       PREV (A)
    ========================= */
    if (key === 'a') {
        currentIndex =
            (currentIndex - 1 + steps.length) % steps.length;

        steps[currentIndex]?.focus();
        return;
    }

    /* =========================
       NUMBER KEYS
    ========================= */
    if (key >= '1' && key <= '9') {
        const num = parseInt(key, 10) - 1;

        if (num < steps.length) {
            currentIndex = num;
            steps[currentIndex]?.focus();
        }
    }
});

/* =========================
   SYNC
========================= */

function syncStep() {
    const active = document.activeElement;
    const step = active?.closest?.('.step-float');

    if (!step) {
        currentIndex = 0;
        return;
    }

    const idx = steps.indexOf(step);
    if (idx !== -1) currentIndex = idx;
}

/* =========================
   EXPOSE
========================= */

export function getLastStep() {
    return lastStep;
}