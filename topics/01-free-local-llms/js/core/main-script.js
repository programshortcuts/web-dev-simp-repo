// main-script.js
// ===== Imports =====
import { bindMainFocusReset } from "../ui/toggle-img-sizes.js";
import { initAllVideos } from "../ui/video-controls.js";
import { letterFocus } from "../nav/letter-focus.js";
import { getFocusZone } from "../nav/get-focus-zone.js";
import { initDropDowns } from "../ui/drop-downs-sidebar-temp.js";

import { initStepNavigation, lastStep } from "../nav/step-nav.js";
import { initMediaClicks } from "../ui/toggle-img-sizes.js";
import {
    initToggleSidebar,
    mainContainer,
    sideBarBtn
} from "../ui/toggle-side-bar.js";

import {
    sideBarNav,
    lastClickedSideBarLink,
    lastFocusedSideBarLink
} from "../nav/side-bar-nav.js";

import { mainContentNav, mainTargetDiv } from "../nav/main-content-nav.js";

export const navBarLessonTitle = document.querySelector('#navBarLessonTitle');

// =========================
// INIT
// =========================

document.addEventListener('DOMContentLoaded', initMain);

function initMain() {

    if (window._mainScriptInitialized) return;
    window._mainScriptInitialized = true;

    initDropDowns();
    initToggleSidebar();
    initMediaClicks()
    initStepNavigation({ mainTargetDiv });
    initAllVideos(mainTargetDiv);
    setupGlobalKeyListener();
    bindMainFocusReset(mainTargetDiv)
}

// =========================
// GLOBAL KEY ROUTER
// =========================

function setupGlobalKeyListener() {

    addEventListener('keydown', (e) => {

        const active = document.activeElement;

        const key = e.key.toLowerCase();

        // =========================
        // GLOBAL M KEY
        // =========================
        if (key === 'm') {

            e.preventDefault();
            e.stopPropagation();

            if (lastStep) {
                lastStep.focus();
            } else {
                mainTargetDiv.focus();
            }

            return;
        }
        if (
            active?.closest('#mainTargetDiv a') &&
            key !== 'm'
        ) {
            return;
        }

        let focusZone = getFocusZone({ e });

        // force header override
        const headerKeys = ['b', 'c', 'd', 'e', 'h', 'p', 'n'];
        if (headerKeys.includes(key)) focusZone = 'header';

        // main container override
        if (e.target === mainTargetDiv) {
            focusZone = 'mainTargetDiv';

            if (key === 'enter') {
                mainTargetDiv.querySelector('.step-float')?.focus();
                return;
            }
        }

        switch (focusZone) {

            case 'sideBar':
                sideBarNav({ e, focusZone });
                break;

            case 'mainTargetDiv':
                mainContentNav({ e, focusZone });
                break;

            case 'header':
                letterFocus({ e, focusZone });
                break;
        }
    });
}