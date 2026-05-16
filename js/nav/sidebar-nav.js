// sidebar-nav.js
import { mainContainer } from "../core/main-script.js";
import {
    setLastFocusedLink,
    getLastFocusedLink,
    clearLastFocusedLink,
    setLastCLICKEDLink,
    getLastCLICKEDLink,
    clearLastCLICKEDLink
} from "./sidebar-state.js";
import { sideBarBtn } from "../ui/toggle-sidebar.js";
import { injectFromHref, mainTargetDiv } from "../core/inject-content.js";
import { getSteps, getLastStep } from "./step-nav.js";
import { changeTutorialLink, tutorialLink } from "../ui/change-tutorial-link.js";

export const sideBarAs = document.querySelectorAll('.side-bar-links-container ul a');
export const sideBarAsARRAY = Array.from(sideBarAs);

let iSideBarAs = 0;
export function setIndexSideBarAs(i) { iSideBarAs = i; }
export function getIndexSideBarAs() { return iSideBarAs; }



// Keep track of last link activated by user (click or enter)
let lastUserActivated = null;

// Focus a sidebar link by index
function focusSideBarIndex(index) {
    if (index < 0 || index >= sideBarAsARRAY.length) return;
    const el = sideBarAsARRAY[index];
    iSideBarAs = index;
    el.focus();
    setLastFocusedLink(el);
}

// Activate a link: handles tutorial change and mainTargetDiv focus
function activateLink(link) {
    if (!link) return;

    changeTutorialLink({ target: link });

    if (lastUserActivated === link) {
        mainTargetDiv.focus();
        mainTargetDiv.scrollTo(0, 0);
        window.scrollTo(0, 0);
    }

    lastUserActivated = link;
    setLastCLICKEDLink(link);
    
}

// Initialize all sidebar listeners
export function initSideBarListeners() {
    const sideBarContainer = document.querySelector('.side-bar-links-container');

    // Delegated click handling
    sideBarContainer.addEventListener('click', e => {
        const link = e.target.closest('a');
        
        // navTitleH1.innerText = [...sideBarAs].indexOf(link) + 1
        if (!link) return;
        activateLink(link);
    });

    // Keyboard handling for each sidebar link
    sideBarAsARRAY.forEach((el, i) => {
        // Autofocus on initial load
        if (el.hasAttribute('autofocus')) {
            setLastCLICKEDLink(el);
            setLastFocusedLink(el);
            iSideBarAs = i;
            focusSideBarIndex(i);
            injectFromHref(el);
            return;
        }

        if (el.hasAttribute('focus')) {
            clearLastCLICKEDLink();
            clearLastFocusedLink();
            setLastFocusedLink(el);
            iSideBarAs = i;
            focusSideBarIndex(i);
        }

        el.addEventListener('keydown', e => {
            const key = e.key.toLowerCase();
            
            console.log('here')
            if (key === 'enter') {
                const link = e.target.closest('a');
                // navTitleH1.innerText = [...sideBarAs].indexOf(link) + 1
                activateLink(link);
            }

            if (key === 'f') {
                // Move index to this element for 'f' navigation
                const link = e.target.closest('a');
                if (!link) return;
                iSideBarAs = sideBarAsARRAY.indexOf(link);
            }

            if (key === 's') sideBarBtn?.focus();
            if (key === 'm') {
                mainTargetDiv?.focus();
                document.body.scrollIntoView({ behavior: 'instant', block: 'start' });
            }
            if (key === 't') {
                tutorialLink?.focus();
                document.body.scrollIntoView({ behavior: 'instant', block: 'start' });
            }
        });
    });

    // Optional: keydown for sidebar button
    sideBarBtn.addEventListener('keydown', e => {
        // Currently no behavior; kept for future expansion
    });
}

// External navigation handling (f/a keys)
export function sideBarNav({ e, navState }) {
    if (navState.zone !== 'sideBar') return;
    const key = e.key.toLowerCase();

    if (!isNaN(key)) {
        focusSideBarIndex(parseInt(key) - 1);
        return true;
    }

    if (key === 'f') {
        if (!mainContainer.classList.contains('collapsed')) {
            if (e.target === sideBarBtn) iSideBarAs = -1;
            focusSideBarIndex((iSideBarAs + 1) % sideBarAsARRAY.length);
        } else {
            const steps = getSteps();
            const lastStep = getLastStep();
            (lastStep || steps[0])?.focus();
        }
        return true;
    }

    if (key === 'a') {
        if (e.target.id === 'homePageSideBar') {
            focusSideBarIndex(sideBarAsARRAY.length - 2);
        } else {
            focusSideBarIndex((iSideBarAs - 1 + sideBarAsARRAY.length) % sideBarAsARRAY.length);
        }
        return true;
    }

    return false;
}