// step-nav.js
import { sideBarAs } from "../nav/sidebar-nav.js"
import { getLastCLICKEDLink } from "./sidebar-state.js"
import { mainTargetDiv } from "../core/inject-content.js"
import { handleImgSizes,denlargeAllImages } from "../ui/toggle-img-sizes.js"
import { changeTutorialLink } from "../ui/change-tutorial-link.js"
import { handleStepClickedNav, } from "./step-clicked-nav.js"
import { refreshImages } from "../ui/toggle-img-sizes.js";
import { endNxtBtn,prevBtn } from "../core/inject-content.js"

// nonSideBarEls is an awfule way to do this but i'm desperate right now
let steps = []
let copyCodes = []
let iSteps = 0
let lastStep
let allImgs = []
let stepClicked = false
let iCopyCodes = 0
let stepCopyCodes = []
export function initStepNav(){{
    copyCodes = []
    // refreshImages(mainTargetDiv)
    // refreshImages()
    updateSteps()
    updateCopyCodes()
    initLessonBtnFocusListeners()
    
}}
export function removeALLSideLinkChange() {
    sideBarAs.forEach(el =>
        el.classList.remove('sideLinkChange')
    )
}
function initLessonBtnFocusListeners(e){
    // endNxtBtn.addEventListener('keydown', handleLessonBtnsFocus);
    // prevBtn.addEventListener('keydown', handleLessonBtnsFocus);
    // endNxtBtn.addEventListener('click', handleLessonBtnsFocus);
    // prevBtn.addEventListener('click', handleLessonBtnsFocus);
}
function handleLessonBtnsFocus(e){
    if(e.type === 'keydown'){
        let key = e.key.toLowerCase()
        
        if (key === 'a') {
            steps[steps.length - 1].focus()
        }
        if(key === 'enter'){
            removeALLSideLinkChange() 
            return
        }
    }
    if (e.type === 'click') {
        removeALLSideLinkChange()
        
    }
}

export function getSteps(){
    return steps
}
export function updateSteps(){
    steps = mainTargetDiv.querySelectorAll('.step-float')
    // I don't fully know why nonSideBarEls is working
    const sideBarEls = [...document.querySelectorAll('[id],a')].filter(el => {
        if(!el.closest('.side-bar'))
        return 
    })
    copyCodes = updateCopyCodes()
    copyCodes.forEach(el => {
        el.addEventListener('focusin', e => {
            denlargeAllImages(allImgs)
        });
        el.addEventListener('keydown', e => {
            const key = e.key.toLowerCase()
            const step = e.target.closest('.step-float')
            if(e.shiftKey && key === 'enter'){
                // step.focus()
                return
            }
            if(key === 'enter' && !e.shiftKey){
                console.log(e.target)
                handleImgSizes({e})
                const el = e.target
            }
            
        });
    })
    // This should not be here, this needs to get implemented into  toggle-img-sizes.js i think
    steps.forEach((el,i) => {
        if(el.hasAttribute('autofocus')){
            el.focus()
            lastStep = el
            iSteps = i
        }
        
        el.addEventListener('focus', e => {
            scrollToCenter({el})
            denlargeAllImages(allImgs)
            removeStepClicked(steps)            
            stepClicked = false
            iSteps = i
            iCopyCodes = 0
            lastStep = steps[iSteps]
            

        })
        el.addEventListener('click', e => {
            lastStep = steps[iSteps]
            // if(e.type != 'click') return
            scrollToCenter({el})
            changeTutorialLink(e)
        });
        el.addEventListener('mousedown', e => {
            lastStep = steps[iSteps]
            changeTutorialLink(e)
        });
        el.addEventListener('keydown', e => {
            let key = e.key.toLowerCase()
            const step = e.target.closest('.step-float')
            if(!step.classList.contains('step-float')) return
            if(key === 'enter' && !step.querySelector('.copy-code')){
                scrollToCenter({ el })
                handleImgSizes({e})
                return
            }
            if (e.shiftKey && key === 'enter') {
                const el = e.target
                scrollToCenter({el})
                handleImgSizes({ e })
                return
            }
            if (!e.shiftKey && key === 'enter') {
                const imgsContainer = step.querySelector('.imgs-container')

                if (!imgsContainer) {
                    stepClicked = true
                }
                let smooth = true
                // handleStepClickedNav({e})
                if(!step.classList.contains('step-float')) return
                changeTutorialLink(e)
            }
            if(key === 'm'){
                denlargeAllImages()
                mainTargetDiv.scrollTo(0,0)
            }
            if(key === 's'){
                denlargeAllImages()
            }
            
        });
    })
    
}


function stepFocus(index){
    if(index >= steps.length){
        index = steps.length -1
    }
    steps[index]?.focus()
}
export function getLastStep(){return lastStep}

function removeStepClicked(steps){
    steps.forEach(el => el.classList.remove('step-clicked'))
}
export function scrollToCenter({el,smooth}){
    if(!el) return
    if(smooth){
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }else {
        el.scrollIntoView({ behavior: 'instant', block: 'center' })
    }
}
export function stepNav({ e, navState }) {
    if (navState.zone !== 'mainTargetDiv') return false
    const key = e.key.toLowerCase()
    const step = e.target.closest('.step-float')
    if(e.target === mainTargetDiv){
        if(key === 'enter'){
            // step.focus()
            
        }
    }
    if (key === 'enter' && e.target === mainTargetDiv) {
        iSteps = 0
        steps[0].focus()
        scrollTo(0, 0)
        return true
    }
    if (stepClicked) {
        if (!step) return
        
        if (!step.classList.contains('step-clicked')) {
            step?.classList.add('step-clicked')
        }
        iCopyCodes = handleStepClickedNav({ e, iCopyCodes })
        handleStepClickedNav({ e })
        return true
    }
    if (!isNaN(key)) {
        const intLet = parseInt(key)
        iSteps = steps[intLet - 1]
        if (intLet >= steps.length) iSteps = steps.length - 1
        if(!steps) return
        steps[intLet - 1].focus()
        return true
    }

    
    
    if (key === 'm') {
        if (e.target === mainTargetDiv) {
            // lastStep?.focus()
        } else {

            mainTargetDiv.focus()
            mainTargetDiv.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
                // inline: 'nearest',
            })
        }
        return true
    }
    if (key === 'a') {
        iSteps = (iSteps - 1 + steps.length) % steps.length
        // steps[iSteps].focus()
        stepFocus(iSteps)
        return true
    }
    if (key === 'f') {
        if (e.target === mainTargetDiv) {
            iSteps = 0
        } else {
            iSteps = (iSteps + 1) % steps.length
        }
        stepFocus(iSteps)
        return true
    }
    return false
}

function updateCopyCodes() {
    const copyCodes = document.querySelectorAll('.copy-code')
    return copyCodes

}