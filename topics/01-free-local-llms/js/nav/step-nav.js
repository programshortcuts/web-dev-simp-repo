// step-nav.js

import { pauseAllVideos } from "../ui/video-controls.js";
import { cycleMedia, denlargeAllImages } from "../ui/toggle-img-sizes.js";
import { changeTutorialLink } from "../ui/change-tutorial-link.js";
import { lastClickedSideBarLink } from "./side-bar-nav.js";
import { getFocusZone } from "./get-focus-zone.js";

let steps = [];
let allVids = [];

let iSteps = 0;

export let lastStep = null;

// =========================
// INIT (RUN ON EVERY INJECT)
// =========================
export function initStepNavigation({ mainTargetDiv }) {

    if (!mainTargetDiv) return;

    steps = [...mainTargetDiv.querySelectorAll('.step-float')];
    allVids = [...mainTargetDiv.querySelectorAll('.step-vid > video')];

    // reset index safely on reload
    iSteps = 0;

    // =========================
    // VIDEO (CLICK ONLY)
    // =========================


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
            const stepFloat = e.target.closest('.step-float');

            if (!stepFloat) return;

            changeTutorialLink(e);
            if (key === 'enter' && e.shiftKey) {
                e.preventDefault();

                const stepFloat =
                    e.target.closest('.step-float') ||
                    document.activeElement.closest('.step-float');

                if (!stepFloat) return;

                const items = [...stepFloat.querySelectorAll('.step-img, .step-vid')];
                if (!items.length) return;

                // get current index safely
                let index = Number(stepFloat.dataset.mediaIndex ?? -1);
                index++;

                // END OF CYCLE → HARD RESET (IMPORTANT)
                if (!items[index]) {
                    stepFloat.dataset.mediaIndex = -1;

                    // 🔥 single source reset (IMPORTANT FIX)
                    items.forEach(el => el.classList.remove('enlarge'));

                    pauseAllVideos();

                    requestAnimationFrame(() => {
                        stepFloat.focus();
                    });

                    return;
                }

                // NORMAL CYCLE
                stepFloat.dataset.mediaIndex = index;

                // 🔥 ALWAYS RESET FIRST (prevents stuck state)
                items.forEach(el => el.classList.remove('enlarge'));

                pauseAllVideos();

                const active = items[index];

                // APPLY ONLY ONE STATE OWNER
                if (active.classList.contains('step-vid')) {
                    const vid = active.querySelector('video');
                    active.classList.add('enlarge');
                    vid?.play();
                } else {
                    active.classList.add('enlarge');
                }

                requestAnimationFrame(() => {
                    stepFloat.focus();
                });
            }
            if (key === 'enter' && !e.shiftKey) {
                if (key === 'enter' && !e.shiftKey) {

                    const stepFloat = e.target.closest('.step-float');
                    if (!stepFloat) return;

                    e.preventDefault();

                    // ALWAYS treat ENTER as MEDIA CONTROL ONLY
                    cycleMedia(stepFloat);
                    return;
                }
            }
            
            if (key === 'm' && e.target.classList.contains('copy-code')) {
                step.focus()
                return;
            }
            if (key === 'm' && e.target.closest('a')) {
                step.focus()
                return;
            }
            
        });
    });

    // IMPORTANT: always re-sync index on inject
    syncCurrentStep();
}

// =========================
// GLOBAL NAV (F / A)
// =========================
document.addEventListener('keydown', (e) => {

    const key = e.key.toLowerCase();

    const active = document.activeElement;
    if (e.target.closest('a')) {
        if (getFocusZone(e.target) === 'mainTargetDiv'){
            return
        }
        // return; // let browser handle Enter, Cmd+Enter, etc.
    }
    if (!steps.length) return;

    // ignore typing inside media

    // only block step navigation keys inside media typing contexts
    const isTypingInsideMedia =
        active?.tagName === 'VIDEO' ||
        active?.classList?.contains('copy-code');

    if (isTypingInsideMedia) {

        // allow ONLY sidebar shortcut escape keys if needed
        if (key === 's' && lastClickedSideBarLink) {
            lastClickedSideBarLink.focus();
            return;
        }

        if (key === 't') {
            tutorialLink?.focus();
            return;
        }

        return; // block other navigation keys
    }

    // sidebar safety
    if (
        active?.closest?.('.side-bar') ||
        active?.id === 'sideBarBtn'
    ) return;

    // =========================
    // GET CURRENT STEP SAFELY
    // =========================
    const activeStep = active?.closest?.('.step-float');

    // sync index if we're inside a step
    if (activeStep) {
        const idx = steps.indexOf(activeStep);
        if (idx !== -1) iSteps = idx;
    }

    // =========================
    // F = NEXT
    // =========================
    if (key === 'f') {

        iSteps = activeStep
            ? (iSteps + 1) % steps.length
            : 0;

        steps[iSteps]?.focus();
        return;
    }

    // =========================
    // A = PREVIOUS
    // =========================
    if (key === 'a') {

        iSteps = activeStep
            ? (iSteps - 1 + steps.length) % steps.length
            : steps.length - 1;

        steps[iSteps]?.focus();
        return;
    }

    // =========================
    // NUMBER KEYS (NEW FIX)
    // =========================
    if (key >= '1' && key <= '9') {

        const num = parseInt(key, 10) - 1;

        if (num < steps.length) {
            iSteps = num;
            steps[iSteps]?.focus();
        }

        return;
    }
});

// =========================
// FORCE SYNC (IMPORTANT FIX)
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