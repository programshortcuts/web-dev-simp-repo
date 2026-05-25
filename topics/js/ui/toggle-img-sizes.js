// toggle-img-sizes.js
import { mainTargetDiv } from "../core/inject-content.js"
let allImgs = []
let activeStep = null
let activeImgIndex = -1
let iStepImgs = -1
export function refreshImages(root = mainTargetDiv){
    allImgs = root.querySelectorAll('.step-img > img, .step-vid > vid')
    resetImageState()

}
function resetImageState(){
    activeStep = null
    activeImgIndex = -1 
    denlargeAllImages()
    allImgs.forEach(img => {
        img.addEventListener('click', e => {
            e.preventDefault()
            toggleImgSize(img)
            
            return
        });
    })
}
// export function updateImgs() {allImgs = document.querySelectorAll('.step-img img, .step-vid video')}
// --- Image handling ---
export function handleClickImgSizes({ e }) {
    if(e.target.tagName === 'IMG'){
        toggleImgSize(e.target)
    }

}
export function handleImgSizes({ e }) {
    const step = e.target.closest('.step-float')
    if(e.type === 'click'){
        console.log(e.target)
        if(e.target.tagName === 'IMG'){
            // toggleImgSize(e.target)
        }
        return
    }
    // if (!step) return
    if (step !== activeStep) {
        denlargeAllImages()
        activeStep = step
        activeImgIndex = -1
    }
    const imgs = step.querySelectorAll('.step-img img, .step-vid video')
    if (imgs.length === 1) {
        toggleImgSize(imgs[0])
        return
    }
    activeImgIndex++
    if (activeImgIndex >= imgs.length) {
        denlargeAllImages()
        activeImgIndex = -1
        return
    }
    toggleImgSize(imgs[activeImgIndex])
}
function toggleImgSize(img){
    img.classList.toggle("enlarge");
    // img.style.zIndex = img.classList.contains("enlarge") ? 100 : 0;
}
// --- Utility ---
export function denlargeAllImages() {
    allImgs.forEach(img => {
        if (img.classList.contains('enlarge')) img.classList.remove("enlarge");
        // img.style.zIndex = 0;
    });
}