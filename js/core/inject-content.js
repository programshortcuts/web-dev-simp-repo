// inject-content.js
export const mainTargetDiv = document.querySelector('#mainTargetDiv')

import { sideBar } from "../ui/toggle-sidebar.js"
import { getLastFocusedLink, setLastCLICKEDLink,getLastCLICKEDLink } from "../nav/sidebar-state.js";
let lastClickedSideBarLink = null
import { initCopyCode } from "../ui/copy-code.js";
import { sideBarAsARRAY } from "../nav/sidebar-nav.js";
import { getSteps, initStepNav,updateSteps } from "../nav/step-nav.js";
import { refreshImages } from "../ui/toggle-img-sizes.js";
const navTitleH1 = document.querySelector('#navTitle h1')
export const endNxtBtn = document.querySelector('#endNxtBtn')
export const prevBtn = document.querySelector('#prevBtn')
import { removeALLSideLinkChange } from "../nav/step-nav.js";
function handleInjectContentBtnsContainer(e){
    if(e.type == 'click'){
        e.preventDefault()
        e.stopPropagation()
        const lastClicked = getLastCLICKEDLink()
        let iSideBarAs = sideBarAsARRAY.indexOf(lastClicked)
        
        if (e.currentTarget === prevBtn) {
            iSideBarAs = (iSideBarAs - 1 + sideBarAsARRAY.length) % sideBarAsARRAY.length
            setLastCLICKEDLink(sideBarAsARRAY[iSideBarAs])
            injectFromHref(sideBarAsARRAY[iSideBarAs].href)
            mainTargetDiv.scrollTo(0, 0)
            return
        }
        if (e.target === endNxtBtn) {
            removeALLSideLinkChange()
            iSideBarAs = (iSideBarAs + 1) % sideBarAsARRAY.length
            setLastCLICKEDLink(sideBarAsARRAY[iSideBarAs])
            injectFromHref(sideBarAsARRAY[iSideBarAs].href)
            mainTargetDiv.scrollTo(0, 0)
            document.querySelector('body').scrollTo(0, 0)
            sideBarAsARRAY[iSideBarAs].classList.add('sideLinkChange')
            // return
        } 
        mainTargetDiv.scrollIntoView({
            behavior: 'instant', 
            block: 'start',

        })
    }
}
function handleNxtLessonBtn(key){
    if (key === 'a') {
        const steps = getSteps()
        steps[steps.length - 1].focus()
    }
    if (key === 'f') {
        const steps = getSteps()
        steps[0].focus()
    }
    if (key === 'm') {
        mainTargetDiv.focus()
        document.querySelector('body').scrollTo(0, 0)
    }
    if (key === 'enter') {
        mainTargetDiv.scrollTo(0, 0)
    }
}
export function initInjectContentListeners(){
    endNxtBtn.addEventListener('click', handleInjectContentBtnsContainer)
    prevBtn.addEventListener('click', handleInjectContentBtnsContainer)
    // Make it so 'a' goes to steps[step.length - 1], when endNxtLesson or prevLessonBtn has focus and 'a' is pressed
    endNxtBtn.addEventListener('keydown', e => {
        const key = e.key.toLowerCase()
        handleNxtLessonBtn(key)
    })
    prevBtn.addEventListener('keydown', e => {
        const key = e.key.toLowerCase()
        handleNxtLessonBtn(key)
    })
    
    let linkClicked = false
    initStepNav()
    sideBarAsARRAY.forEach(el =>{
        if(el.hasAttribute('autofocus')){
            linkClicked = true
        }
    })
    if(!linkClicked){injectFromHref('home-page.html')        }
    sideBar.addEventListener('click', e => {
        e.preventDefault()
        e.stopPropagation()
        const a = e.target.closest('a')
        if(a === null) return        
        injectFromHref(a)
        window.scrollTo(0,0)
        lastClickedSideBarLink = a
        setLastCLICKEDLink(a)
        linkClicked = true
        mainTargetDiv.scrollTo(0,0)
    });
    sideBar.addEventListener('keydown', e => {
        const a = e.target.closest('a')
        const key = e.key.toLowerCase()

        if(a === null) return
        if(key === 'enter'){
            e.preventDefault()
            e.stopPropagation()
            setLastCLICKEDLink(a)
            if (a === getLastFocusedLink() && lastClickedSideBarLink == a) {
                
                mainTargetDiv.focus()
                mainTargetDiv.scrollIntoView({ behavior : 'instant', block: 'start'})
            } else {
                injectFromHref(a)
                document.querySelector('body').scrollIntoView({ behavior : 'instant', block: 'start'})
            }
        }
    });
}
export async function injectFromHref(href) {
    if (!href) return
    try {
        const response = await fetch(href)
        const html = await response.text()
        mainTargetDiv.innerHTML = html
        const lessontitle = mainTargetDiv.querySelector('#lessonTitle')
        navTitleH1.innerText = lessontitle.innerText
        mainTargetDiv.scrollTo(0,0)
        refreshImages(mainTargetDiv)       
        initCopyCode()
        updateSteps()
    } catch (err) {
        mainTargetDiv.innerHTML = `<p>Failed to load content.</p>`
    }
}