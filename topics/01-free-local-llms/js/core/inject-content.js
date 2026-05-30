// inject-content.js (CLEAN RESET ENGINE)

import { allSideBarLinks, lastClickedSideBarLink, updateLastClicked, getHrefFromLink } from "../nav/side-bar-nav.js";
import { mainTargetDiv } from "../nav/main-content-nav.js";
import { initStepNavigation } from "../nav/step-nav.js";
import { refreshImages, denlargeAllImages } from "../ui/toggle-img-sizes.js";
import { addCopyCode } from "../ui/copy-code.js";
import { mainContainer } from "../ui/toggle-side-bar.js";

export const nxtBtn = document.querySelector('#endNxtBtn');
export const prevBtn = document.querySelector('#prevBtn');

let iAllSideBarLinks = 0;

// =========================
// NEXT / PREV NAV
// =========================

function highlightSidebar() {

    allSideBarLinks.forEach(el => {
        el.classList.remove('highlight');
    });

    const current = allSideBarLinks[iAllSideBarLinks];

    if (!current) return;

    current.classList.add('highlight');

    const drop = current.closest('.drop-snips');
    if (drop?.classList.contains('hide')) {
        drop.classList.remove('hide');
    }
}

// =========================
// CONTENT LOADER
// =========================

export function injectContent(href) {

    fetch(href)
        .then(res => {
            if (!res.ok) throw new Error(res.status);
            return res.text();
        })
        .then(html => {

            // =========================
            // 1. RESET STATE BEFORE INJECT
            // =========================

            denlargeAllImages();

            mainTargetDiv.innerHTML = html;

            scrollTo(0, 0);

            // =========================
            // 2. REINITIALIZE CORE SYSTEMS
            // =========================

            refreshImages(mainTargetDiv);
            initStepNavigation({ mainTargetDiv });

            addCopyCode();

            // =========================
            // 3. CLEAN FOCUS STATE
            // =========================

            const firstStep =
                mainTargetDiv.querySelector('.step-float');

            if (firstStep) {
                firstStep.focus();
            }

            // =========================
            // 4. OPTIONAL CALLBACK HOOK
            // =========================

            if (typeof callback === "function") {
                callback();
            }
        })
        .catch(err => {
            console.error('Failed to load content:', err);
        });
}

// =========================
// NEXT BUTTON
// =========================

nxtBtn?.addEventListener('click', e => {

    e.preventDefault();

    iAllSideBarLinks =
        allSideBarLinks.indexOf(lastClickedSideBarLink);

    iAllSideBarLinks =
        (iAllSideBarLinks + 1) % allSideBarLinks.length;

    updateLastClicked(allSideBarLinks[iAllSideBarLinks]);

    const href = getHrefFromLink(allSideBarLinks[iAllSideBarLinks]);

    if (href) {
        highlightSidebar();
        injectContent(href);
    }
});

// =========================
// PREV BUTTON
// =========================

prevBtn?.addEventListener('click', e => {

    e.preventDefault();

    iAllSideBarLinks =
        allSideBarLinks.indexOf(lastClickedSideBarLink);

    iAllSideBarLinks =
        (iAllSideBarLinks - 1 + allSideBarLinks.length)
        % allSideBarLinks.length;

    updateLastClicked(allSideBarLinks[iAllSideBarLinks]);

    const href = getHrefFromLink(allSideBarLinks[iAllSideBarLinks]);

    if (href) {
        highlightSidebar();
        injectContent(href);
    }
});