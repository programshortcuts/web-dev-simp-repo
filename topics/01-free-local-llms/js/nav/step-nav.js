// step-nav.js
import { videoControls, pauseAllVideos } from "../ui/playStepVid.js";
import { cycleMedia, denlargeAllImages } from "../ui/toggle-img-sizes.js";
import { changeTutorialLink } from "../ui/change-tutorial-link.js";
import { lastClickedSideBarLink } from "./side-bar-nav.js";

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

            const stepFloat = vid.closest('.step-float');
            if (!stepFloat) return;

            const wrapper = vid.closest('.step-vid');
            if (!wrapper) return;

            const isAlreadyEnlarged = wrapper.classList.contains('enlarge');

            // reset others always
            denlargeAllImages();
            pauseAllVideos({ allVids });

            // TOGGLE behavior
            if (!isAlreadyEnlarged) {
                wrapper.classList.add('enlarge');
            } else {
                stepFloat.dataset.mediaIndex = -1;
            }

            // play/pause
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

                const stepFloat =
                    e.target.closest('.step-float') ||
                    document.activeElement.closest('.step-float');

                if (!stepFloat) return;

                // DO NOT run on links
                if (e.target.tagName === 'A') return;

                const items = [...stepFloat.querySelectorAll('.step-img, .step-vid')];
                if (!items.length) return;

                let index = Number(stepFloat.dataset.mediaIndex ?? -1);
                index++;

                const activeItem = items[index];

                // END → reset everything + return focus
                if (!activeItem) {
                    denlargeAllImages();
                    pauseAllVideos({ allVids });

                    stepFloat.dataset.mediaIndex = -1;

                    requestAnimationFrame(() => {
                        stepFloat.focus();
                    });

                    return;
                }

                // NORMAL CYCLE
                denlargeAllImages();
                pauseAllVideos({ allVids });

                activeItem.classList.add('enlarge');

                stepFloat.dataset.mediaIndex = index;

                // CRITICAL: always restore focus so F/A works again
                requestAnimationFrame(() => {
                    stepFloat.focus();
                });

                return;
            }

            if (e.target.tagName === 'VIDEO') {
                videoControls({ vid: e.target, e });
                return;
            }

            
            if (key === 'm' && e.target.classList.contains('copy-code')) {

                step.focus()
                return;
            }

            if (key === 'enter') {

                e.preventDefault();

                // =========================
                // STEP-FLOAT HAS FOCUS
                // =========================
                if (e.target === stepFloat) {

                    const focusables = [
                        ...stepFloat.querySelectorAll(`
                a,
                button:not([tabindex="-1"]),
                input,
                textarea,
                select,
                .copy-code,
                [tabindex]:not([tabindex="-1"])
            `)
                    ].filter(el => el !== stepFloat);

                    // =========================
                    // MOVE TO FIRST FOCUSABLE
                    // =========================
                    if (focusables.length) {

                        focusables[0].focus();
                        return;
                    }

                    // =========================
                    // NO FOCUSABLES
                    // TOGGLE MEDIA
                    // =========================
                    cycleMedia(stepFloat);
                    return;
                }

                // =========================
                // COPY CODE HAS FOCUS
                // =========================
                if (e.target.classList.contains('copy-code')) {

                    cycleMedia(stepFloat);
                    return;
                }

                // =========================
                // LINKS KEEP NORMAL BEHAVIOR
                // =========================
                if (e.target.tagName === 'A') {
                    return;
                }

                // =========================
                // OTHER FOCUSABLES
                // =========================
                cycleMedia(stepFloat);
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

    // ignore typing inside media
    if (
        active?.tagName === 'VIDEO' ||
        active?.classList?.contains('copy-code')
    ){
        console.log('here')
        if(key === 's'){
            lastClickedSideBarLink.focus()
        }
        return;
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