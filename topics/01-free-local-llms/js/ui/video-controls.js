// video-controls.js -web-dev-simp-repo

export function initAllVideos(root = document) {

    const stepFloats = root.querySelectorAll('.step-float')

    stepFloats.forEach(bindVideoControls)
}

function bindVideoControls(step) {
    const stepVid = step.querySelector('.step-vid')
    const vid = step.querySelector('video')

    if (!stepVid || !vid) return

    // prevent duplicate listeners
    if (step.dataset.videoBound === 'true') return

    step.dataset.videoBound = 'true'

    // make sure video itself is focusable
    if (!vid.hasAttribute('tabindex')) {
        vid.setAttribute('tabindex', '0')
    }

    /* ------------------------- CLICK VIDEO
    -------------------------
    */

    stepVid.addEventListener('click', e => {
        const clickedControls = e.target.closest(
            '.playBtn, .fwdBtn, .rwdBtn'
        )
        // don't toggle enlarge when clicking controls
        if (clickedControls) return
        e.stopPropagation()

        toggleEnlarge(stepVid, vid)
    })

    /*
    -------------------------
    BUTTON CONTROLS
    -------------------------
    */

    const playBtn = step.querySelector('.playbtn')
    const fwdBtn = step.querySelector('.fwdBtn')
    const rwdBtn = step.querySelector('.rwdBtn')

    playBtn?.addEventListener('click', e => {

        e.stopPropagation()

        togglePlay(vid)

        updatePlayBtn(playBtn, vid)
    })
    

    fwdBtn?.addEventListener('click', e => {

        e.stopPropagation()

        vid.currentTime = Math.min(
            vid.duration,
            vid.currentTime + 5
        )
    })

    rwdBtn?.addEventListener('click', e => {

        e.stopPropagation()

        vid.currentTime = Math.max(
            0,
            vid.currentTime - 5
        )
    })

    /*
    -------------------------
    KEYBOARD
    IMPORTANT:
    bind to STEP
    not VIDEO
    -------------------------
    */

    step.addEventListener('keydown', e => {

        const key = e.key.toLowerCase()
        const playBtn = stepVid.querySelector('.playBtn')
        const fwdBtn = stepVid.querySelector('.fwdBtn')
        const revBtn = stepVid.querySelector('.rwdBtn')


        const hasCopyCodes =
            step.querySelectorAll('.copy-code').length > 0

        const isFocusedInsideThisStep =
            step.contains(document.activeElement)

        if (!isFocusedInsideThisStep) return

        /*
ENTER
*/
        if (
            key === 'enter' &&
            !e.shiftKey
        ) {

            // IMPORTANT:
            // if no copy-codes,
            // let step-nav handle enlarge
            if (!hasCopyCodes) {
                return
            }

            e.preventDefault()

            togglePlay(vid)

            updatePlayBtn(playBtn, vid)

            return
        }
        /*
SHIFT + ENTER
*/

        if (
            key === 'enter' &&
            e.shiftKey
        ) {

            // IMPORTANT:
            // if no copy-codes,
            // let step-nav handle enlarge
            if (!hasCopyCodes) {
                return
            }

            e.preventDefault()

            toggleEnlarge(stepVid, vid)

            return
        }

        /*
LEFT
        */

        if (e.keyCode === 37) {
            e.preventDefault()
            // rwdBtn.classList.toggle('active')
            vid.currentTime = Math.max(
                0,
                vid.currentTime - 0.5
            )

            return
        }

        /*
        RIGHT
        */

        if (e.keyCode === 39) {

            e.preventDefault()
            // fwdBtn.classList.toggle('active')
            vid.currentTime = Math.min(
                vid.duration,
                vid.currentTime + 0.5
            )

            return
        }
        /*
SPACE
*/

        if (
            key === ' ' ||
            key === 'spacebar'
        ) {

            e.preventDefault()
            e.stopPropagation()
            togglePlay(vid)
            const stepVid = e.target.closest('.step-vid')
            const playBtn = stepVid.querySelector('.playbtn')

            updatePlayBtn(playBtn, vid)

            return
        }
    })
}

/*
-----------------------------------
HELPERS
-----------------------------------
*/

function toggleEnlarge(stepVid, vid) {

    function toggleEnlarge(stepVid, vid) {

        const isEnlarged = stepVid.classList.contains('enlarge');

        if (isEnlarged) {
            stepVid.classList.remove('enlarge');
            vid.pause();
        } else {
            stepVid.classList.add('enlarge');
            vid.play();
        }
    }
}

function togglePlay(vid) {

    if (vid.paused) {

        vid.play()

    } else {

        vid.pause()
    }
}

function updatePlayBtn(btn, vid) {

    if (!btn) return

    btn.innerText = vid.paused
        ? '>'
        : '||'
}

export function pauseAllVideos(root = document) {

    const vids = root.querySelectorAll('video');

    vids.forEach(vid => {

        vid.pause();

        const step = vid.closest('.step-float');

        const playBtn =
            step?.querySelector('.playbtn');

        updatePlayBtn(playBtn, vid);
    });
}