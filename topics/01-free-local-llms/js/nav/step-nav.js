// step-nav.js

import { pauseAllVideos } from "../ui/video-controls.js";
import { cycleMedia,denlargeAllImages } from "../ui/toggle-img-sizes.js";

import { changeTutorialLink } from "../ui/change-tutorial-link.js";
import { lastClickedSideBarLink } from "./side-bar-nav.js";
import { getFocusZone } from "./get-focus-zone.js";

let steps = [];
let allVids = [];

let iSteps = 0;

export let lastStep = null;

// =========================
// INIT
// =========================
export function initStepNavigation({ mainTargetDiv }) {

    if (!mainTargetDiv) return;

    steps = [...mainTargetDiv.querySelectorAll('.step-float')];
    allVids = [...mainTargetDiv.querySelectorAll('.step-vid > video')];

    iSteps = 0;

    // =========================
    // STEP EVENTS
    // =========================
    steps.forEach((step, index) => {

        step.setAttribute('tabindex', '0');

        step.addEventListener('focus', () => {
            lastStep = step;
            iSteps = index;

            step.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        });

        step.addEventListener('keydown', (e) => {

            const key = e.key.toLowerCase();
            const stepFloat = e.currentTarget;

            if (!stepFloat) return;

            changeTutorialLink(e);

            const active = document.activeElement;

            // =========================
            // SHIFT + ENTER
            // =========================
            if (key === 'enter' && e.shiftKey) {
                e.preventDefault();

                const items = [...stepFloat.querySelectorAll('.step-img, .step-vid')];

                if (!items.length) return;

                let index = Number(stepFloat.dataset.mediaIndex ?? -1);
                index++;

                // END → RESET EVERYTHING + RETURN FOCUS TO STEP
                if (!items[index]) {
                    stepFloat.dataset.mediaIndex = -1;

                    items.forEach(el => el.classList.remove('enlarge'));
                    pauseAllVideos();

                    denlargeAllImages?.(); // extra safety global reset

                    requestAnimationFrame(() => {
                        stepFloat.focus();
                    });

                    return;
                }

                // NORMAL CYCLE
                stepFloat.dataset.mediaIndex = index;

                items.forEach(el => el.classList.remove('enlarge'));
                pauseAllVideos();

                const activeMedia = items[index];

                if (activeMedia.classList.contains('step-vid')) {
                    activeMedia.classList.add('enlarge');
                    activeMedia.querySelector('video')?.play();
                } else {
                    activeMedia.classList.add('enlarge');
                }

                return;
            }

            // =========================
            // ENTER (STEP RULE)
            // =========================
            if (key === 'enter' && !e.shiftKey) {

                e.preventDefault();

                // CASE 1: STEP itself is focused
                if (active === stepFloat) {

                    const firstCopy = stepFloat.querySelector('.copy-code');

                    if (firstCopy) {
                        firstCopy.focus();
                        return;
                    }

                    // no focusables → allow media cycle fallback
                    cycleMedia(stepFloat);
                    return;
                }

                // CASE 2: inside step (button/link/input/etc)
                cycleMedia(stepFloat);
                return;
            }

            // =========================
            // M KEY
            // =========================
            if (key === 'm' && e.target.closest('a')) {
                stepFloat.focus();
                return;
            }
        });
    });

    syncCurrentStep();
}

// =========================
// GLOBAL NAV (F / A / NUMBERS)
// =========================
document.addEventListener('keydown', (e) => {

    const key = e.key.toLowerCase();
    const active = document.activeElement;

    if (!steps.length) return;

    const isTypingInsideMedia =
        active?.tagName === 'VIDEO' ||
        active?.classList?.contains('copy-code');

    if (isTypingInsideMedia) {

        if (key === 's') {
            lastClickedSideBarLink?.focus();
            return;
        }

        if (key === 't') {
            tutorialLink?.focus();
            return;
        }

        return;
    }

    if (
        active?.closest?.('.side-bar') ||
        active?.id === 'sideBarBtn'
    ) return;

    const activeStep = active?.closest?.('.step-float');

    if (activeStep) {
        const idx = steps.indexOf(activeStep);
        if (idx !== -1) iSteps = idx;
    }

    // =========================
    // NEXT (F)
    // =========================
    if (key === 'f') {
        iSteps = activeStep ? (iSteps + 1) % steps.length : 0;
        steps[iSteps]?.focus();
        return;
    }

    // =========================
    // PREV (A)
    // =========================
    if (key === 'a') {
        iSteps = activeStep
            ? (iSteps - 1 + steps.length) % steps.length
            : steps.length - 1;

        steps[iSteps]?.focus();
        return;
    }

    // =========================
    // NUMBER KEYS
    // =========================
    if (key >= '1' && key <= '9') {

        const num = parseInt(key, 10) - 1;

        if (num < steps.length) {
            iSteps = num;
            steps[iSteps]?.focus();
        }
    }
});

// =========================
// SYNC
// =========================
function syncCurrentStep() {

    const active = document.activeElement;
    const step = active?.closest?.('.step-float');

    if (!step) {
        iSteps = 0;
        return;
    }

    const index = steps.indexOf(step);

    if (index !== -1) {
        iSteps = index;
    }
}

// =========================
export function getLastStep() {
    return lastStep;
}