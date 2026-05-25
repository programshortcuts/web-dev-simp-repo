// main-script.js
export const pageWrapper = document.querySelector('.page-wrapper') 
import { navLessonTitle } from "../nav/nav-lesson-title-nav.js";
export const mainContainer = document.querySelector('.main-container')
import { getFocusZone } from "../nav/get-focus-zone.js";
import { initDarkMode } from "../dark-mode.js";
import { keyboardNav } from "../nav/keyboard-nav.js";
import { initToggleSideBar } from "../ui/toggle-sidebar.js";
import { initInjectContentListeners } from "./inject-content.js";
import { initSideBarListeners } from "../nav/sidebar-nav.js";
import { initStepNav } from "../nav/step-nav.js";
import { initCopyCode } from "../ui/copy-code.js";
import { refreshImages,handleImgSizes,denlargeAllImages } from "../ui/toggle-img-sizes.js";
// No feature enters main - script unless it can survive a rewrite. !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
document.addEventListener('DOMContentLoaded', initMain)
function initMain(){
    initStepNav()
    initCopyCode()
    initSideBarListeners()
    initInjectContentListeners()
    initToggleSideBar()
    initDarkMode()
    setupGlobalKeyListener()
    refreshImages()
}
function setupGlobalKeyListener(){
    
    addEventListener('keydown', e => {
        /** The e.preventDefault to if(isTyping) means:
    Arrow keys:
        Enter, Numbers, Letters
    Without this guard, your keyboard system will:
        hijack typing inside inputs,break future search boxes,make textareas unusable
        && cause “why is arrow left changing focus instead of moving my cursor?” bugs*/
        if (e.defaultPrevented) return
        const tag = e.target.tagName
        const isTyping =
            tag === 'INPUT' ||
            tag === 'TEXTAREA' ||
            e.target.isContentEditable

        if (isTyping) return
        
        keyboardNav({ e})
    });
}