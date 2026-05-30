// main-content-nav.js

import { handleMKey } from "./m-key-handler.js";
import {
    mainContainer,
    navBarLessonTitle,
    sideBarBtn
} from "../ui/toggle-side-bar.js";

import { lastClickedSideBarLink } from "./side-bar-nav.js";
import { nxtBtn, prevBtn } from "../core/inject-content.js";

export const mainTargetDiv =
    document.querySelector('#mainTargetDiv');

// =========================
// MAIN NAV ROUTER
// =========================

export function mainContentNav({ e, focusZone }) {

    const key = e.key?.toLowerCase();
    const active = document.activeElement;

    if (!key) return;

    // =========================
    // DO NOT INTERFERE WITH MEDIA
    // =========================
    const isMedia =
        active?.tagName === 'VIDEO' ||
        active?.classList?.contains('copy-code');

    if (isMedia) {
        return;
    }

    // =========================
    // M KEY → RETURN TO STEP / MAIN
    // =========================
    if (key === 'm') {
        handleMKey({ e, focusZone });
        return;
    }

    // =========================
    // NEXT / PREV LESSON
    // =========================
    if (key === 'e') {

        nxtBtn?.focus?.();
        mainContainer?.scrollIntoView({
            behavior: 'smooth',
            block: 'end'
        });

        return;
    }

    if (key === 'p') {

        prevBtn?.focus?.();
        return;
    }

    // =========================
    // HEADER / NAV SHORTCUTS
    // =========================
    if (key === 'n') {

        navBarLessonTitle?.focus?.();
        return;
    }

    if (key === 's') {

        if (mainContainer.classList.contains('collapsed')) {
            sideBarBtn?.focus?.();
            return;
        }

        if (lastClickedSideBarLink) {
            lastClickedSideBarLink.focus();
        } else {
            sideBarBtn?.focus?.();
        }

        return;
    }

    // =========================
    // (IMPORTANT)
    // DO NOT HANDLE STEP NAV HERE ANYMORE
    // =========================
    // Step system is fully handled inside step-nav.js
}