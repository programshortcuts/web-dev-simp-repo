// video-controls.js -web-dev-simp-repo
/* =========================
   VIDEO CONTROLS (CLEAN SYSTEM)
========================= */

export function initAllVideos(root = document) {
    const steps = root.querySelectorAll('.step-float');
    steps.forEach(bindVideoControls);
}

function bindVideoControls(step) {
    const stepVid = step.querySelector('.step-vid');
    const vid = step.querySelector('video');

    if (!stepVid || !vid) return;

    // prevent double binding
    if (step.dataset.videoBound === 'true') return;
    step.dataset.videoBound = 'true';

    const playBtn = step.querySelector('.playbtn');
    const fwdBtn = step.querySelector('.fwdBtn');
    const rwdBtn = step.querySelector('.rwdBtn');

    /* =========================
       PLAY / PAUSE
    ========================= */
    playBtn?.addEventListener('click', (e) => {
        
        e.preventDefault();
        e.stopPropagation();

        togglePlay(vid);
        syncPlayBtn(playBtn, vid);
    });
    /* =========================
       FORWARD
    ========================= */
    fwdBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        vid.currentTime = Math.min(
            vid.duration || Infinity,
            vid.currentTime + 5
        );
    });
    /* =========================
       REWIND
    ========================= */
    rwdBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        vid.currentTime = Math.max(
            0,
            vid.currentTime - 5
        );
    });
    /* =========================
       KEYBOARD CONTROLS (STEP ONLY)
    ========================= */
    step.addEventListener('keydown', (e) => {
        if (e.target.closest('.vid-cntrl-btns, .playbtn, .fwdBtn, .rwdBtn')) return;
        const key = e.key.toLowerCase();
        const isInside = step.contains(document.activeElement);
        if (!isInside) return;

        // SPACE = play/pause
        if (key === ' ') {
            e.preventDefault();
            togglePlay(vid);
            syncPlayBtn(playBtn, vid);
            return;
        }

        // LEFT = back
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            vid.currentTime = Math.max(0, vid.currentTime - 0.5);
            return;
        }

        // RIGHT = forward
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            vid.currentTime = Math.min(
                vid.duration || Infinity,
                vid.currentTime + 0.5
            );
            return;
        }
    });
}

/* =========================
   HELPERS
========================= */

function togglePlay(vid) {
    if (vid.paused) vid.play();
    else vid.pause();
}

function syncPlayBtn(btn, vid) {
    if (!btn) return;
    btn.textContent = vid.paused ? '>' : '||';
}

/* =========================
   GLOBAL SAFETY PAUSE
========================= */

export function pauseAllVideos(root = document) {
    const vids = root.querySelectorAll('video');

    vids.forEach((vid) => {
        vid.pause();

        const step = vid.closest('.step-float');
        const btn = step?.querySelector('.playbtn');

        syncPlayBtn(btn, vid);
    });
}