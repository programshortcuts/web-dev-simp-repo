// step-nav.js
import { videoControls, pauseAllVideos } from "../ui/playStepVid.js";
import { cycleMedia, denlargeAllImages } from "../ui/toggle-img-sizes.js";
import { changeTutorialLink } from "../ui/change-tutorial-link.js";

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
    allVids.forEach(vid => {
        vid.addEventListener('click', (e) => {
            videoControls({ vid, e });
        });
    });

    // =========================
    // STEP EVENTS
    // =========================
    steps.forEach((step, index) => {

        step.setAttribute('tabindex', '0');

        step.addEventListener('focus', () => {

            lastStep = step;
            iSteps = index;

            denlargeAllImages();
            pauseAllVideos({ allVids });

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

                denlargeAllImages();
                pauseAllVideos({ allVids });

                stepFloat.dataset.mediaIndex = -1;

                requestAnimationFrame(() => {
                    stepFloat.focus();
                });

                return;
            }

            if (e.target.tagName === 'VIDEO') {
                videoControls({ vid: e.target, e });
                return;
            }

            if (key === 'enter' && e.target.classList.contains('copy-code')) {

                e.preventDefault();
                cycleMedia(stepFloat);
                return;
            }

            if (key === 'enter') {

                e.preventDefault();

                cycleMedia(stepFloat);

                stepFloat.querySelector('.copy-code')?.focus();
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

    if (!steps.length) return;

    // ignore media typing
    if (
        active?.tagName === 'VIDEO' ||
        active?.classList?.contains('copy-code')
    ) return;

    // sidebar safety
    if (
        active?.closest?.('.side-bar') ||
        active?.id === 'sideBarBtn'
    ) return;

    // =========================
    // F = NEXT STEP
    // =========================
    if (key === 'f') {

        syncCurrentStep();

        iSteps = (iSteps + 1) % steps.length;

        steps[iSteps]?.focus();
        return;
    }

    // =========================
    // A = PREVIOUS STEP
    // =========================
    if (key === 'a') {

        syncCurrentStep();

        iSteps = (iSteps - 1 + steps.length) % steps.length;

        steps[iSteps]?.focus();
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