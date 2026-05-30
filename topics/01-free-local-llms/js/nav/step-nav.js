// step-nav.js

import {
    videoControls,
    pauseAllVideos
} from "../ui/playStepVid.js"

import {
    cycleMedia,
    denlargeAllImages
} from "../ui/toggle-img-sizes.js"

import { changeTutorialLink } from "../ui/change-tutorial-link.js"
import { lastClickedSideBarLink } from "./side-bar-nav.js"
import { mainContainer } from "../ui/toggle-side-bar.js"

let steps = []
let copyCodes = []

let iSteps = 0
let iCopyCodes = 0

export let lastStep
export let lastFocusedMainEl

let allStepImgVids = []
let allVids = []

let stepClicked = false

export function removeLastStep() {

    lastStep = null
}

function updateCurrentCopyCodes({ step }) {

    copyCodes = [
        ...step.querySelectorAll('.copy-code')
    ]
}

export function initStepNavigation({ mainTargetDiv }) {

    // =========================
    // ELEMENTS
    // =========================

    steps = [
        ...mainTargetDiv.querySelectorAll('.step-float')
    ]

    allStepImgVids = [
        ...mainTargetDiv.querySelectorAll(
            '.step-img, .step-vid'
        )
    ]

    allVids = [
        ...mainTargetDiv.querySelectorAll(
            '.step-vid > video'
        )
    ]

    // =========================
    // VIDEO EVENTS
    // =========================

    allVids.forEach(vid => {

        vid.addEventListener('click', e => {

            if (e.target.tagName === 'VIDEO') {

                videoControls({ vid, e })
            }
        })

        vid.addEventListener('keydown', e => {

            const key = e.key.toLowerCase()

            if (key === ' ') {

                e.preventDefault()
            }

            if (e.target.tagName === 'VIDEO') {

                videoControls({ vid, e })
            }
        })
    })

    // =========================
    // IMG / VID EVENTS
    // =========================

    allStepImgVids.forEach(el => {

        el.addEventListener('pointerdown', e => {

            e.preventDefault()
        })

        el.addEventListener('click', e => {

            changeTutorialLink(e)
        })
    })

    // =========================
    // STEP EVENTS
    // =========================

    steps.forEach((step, index, arr) => {

        if (step.hasAttribute('data-autofocus')) {

            step.focus()
        }

        if (step.dataset.listenerAdded) return

        step.setAttribute('tabindex', '0')

        // =========================
        // FOCUS
        // =========================

        step.addEventListener('focus', e => {

            stepClicked = false

            iSteps = index
            iCopyCodes = 0

            lastStep = step

            denlargeAllImages()

            step.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            })

            if (
                e.target === steps[steps.length - 1]
                && steps.length > 3
            ) {

                mainContainer.scrollIntoView({
                    behavior: 'smooth',
                    block: 'end',
                    container: 'all'
                })
            }

            pauseAllVideos({ allVids })
        })

        step.addEventListener('focusin', () => {

            iSteps = index
        })

        step.addEventListener('focusout', e => {

            const stillInsideStep =
                step.contains(e.relatedTarget)

            if (stillInsideStep) return

            denlargeAllImages()
        })

        // =========================
        // KEYDOWN
        // =========================

        step.addEventListener('keydown', e => {

            const key = e.key.toLowerCase()

            const stepFloat =
                e.target.closest('.step-float')

            if (!stepFloat) return

            changeTutorialLink(e)

            // =========================
            // LINKS
            // =========================

            if (e.target.hasAttribute('href')) {

                if (key === 'enter') {

                    e.preventDefault()

                    open(e.target.href, '_blank')
                }

                return
            }

            // =========================
            // VIDEO
            // =========================

            if (e.target.tagName === 'VIDEO') {

                const vid = e.target

                videoControls({ vid, e })

                return
            }

            // =========================
            // SPACE
            // =========================

            if (key === ' ') {

                e.preventDefault()

                return
            }

            // =========================
            // COPY CODE ENTER
            // =========================

            if (
                e.target.classList.contains('copy-code')
            ) {

                if (key === 'enter') {

                    e.preventDefault()
                    e.stopPropagation()

                    // =========================
                    // SHIFT + ENTER
                    // =========================

                    if (e.shiftKey) {

                        denlargeAllImages()

                        stepClicked = false

                        requestAnimationFrame(() => {

                            stepFloat.focus()
                        })

                        return
                    }

                    // =========================
                    // NORMAL ENTER
                    // =========================

                    cycleMedia(stepFloat)

                    return
                }
            }

            // =========================
            // ENTER
            // =========================

            if (key !== 'enter') return

            e.preventDefault()
            e.stopPropagation()

            updateCurrentCopyCodes({
                step: stepFloat
            })

            stepClicked = true

            // =========================
            // NORMAL ENTER
            // =========================

            cycleMedia(stepFloat)

            const firstCopyCode =
                stepFloat.querySelector('.copy-code')

            const enlarged =
                stepFloat.querySelector('.enlarge')

            if (!firstCopyCode) {

                stepClicked = false
            }

            if (enlarged && firstCopyCode) {

                firstCopyCode.focus()
            }

            lastStep = stepFloat
        })

        // =========================
        // CLICK
        // =========================

        step.addEventListener('click', e => {

            changeTutorialLink(e)
        })

        step.dataset.listenerAdded = 'true'
    })

    // =========================
    // MAIN KEYDOWN
    // =========================

    mainTargetDiv.addEventListener('keydown', e => {

        const key = e.key.toLowerCase()

        // =========================
        // RETURN TO STEP
        // =========================

        if (key === 'm') {

            const step =
                e.target.closest('.step-float')

            if (step) {

                e.preventDefault()

                stepClicked = false

                step.focus()

                return
            }
        }

        // =========================
        // NUMBER NAV
        // =========================

        if (!isNaN(key)) {

            const intLet = parseInt(key)

            numStepNav(intLet)
        }
    })
}

// =========================
// NUMBER NAV
// =========================

function numStepNav(intLet) {

    if (!stepClicked) {

        if (intLet <= steps.length) {

            steps[intLet - 1]?.focus()
        }

        return
    }

    if (copyCodes[intLet - 1]) {

        copyCodes[intLet - 1].focus()
    }
}

// =========================
// GLOBAL STEP NAV
// =========================

export function handleStepNav({
    e,
    focusZone
}) {

    if (focusZone !== 'mainTargetDiv') return

    const key = e.key.toLowerCase()

    // =========================
    // NUMBER NAV
    // =========================

    if (!isNaN(key)) {

        const intLet = parseInt(key)

        numStepNav(intLet)
    }

    // =========================
    // FORWARD
    // =========================

    if (key === 'f') {

        if (!stepClicked) {

            iSteps =
                (iSteps + 1) % steps.length

            steps[iSteps]?.focus()

            return
        }

        iCopyCodes =
            (iCopyCodes + 1) % copyCodes.length

        copyCodes[iCopyCodes]?.focus()
    }

    // =========================
    // START
    // =========================

    if (
        key === 'f'
        && e.target === mainTargetDiv
    ) {

        if (!stepClicked) {

            iSteps = 0

            steps[0]?.focus()
        }
    }

    // =========================
    // BACKWARD
    // =========================

    if (key === 'a') {

        if (!stepClicked) {

            iSteps =
                (iSteps - 1 + steps.length)
                % steps.length

            steps[iSteps]?.focus()

            return
        }

        iCopyCodes =
            (iCopyCodes - 1 + copyCodes.length)
            % copyCodes.length

        copyCodes[iCopyCodes]?.focus()
    }

    // =========================
    // SIDEBAR
    // =========================

    if (key === 's') {

        stepClicked = false

        if (lastClickedSideBarLink) {

            lastClickedSideBarLink.focus()
        }
    }

    // =========================
    // TUTORIAL LINK
    // =========================

    if (key === 't') {

        tutorialLink.focus()
    }
}

// =========================
// SELECTED STEP
// =========================

document.addEventListener('click', e => {

    const step =
        e.target.closest('.step-float')

    if (!step) return

    document
        .querySelectorAll('.step-float.selected')
        .forEach(el => {

            el.classList.remove('selected')
        })

    step.classList.add('selected')
})