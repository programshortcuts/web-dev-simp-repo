// toggle-img-sizes.js

let allMedia = []

export function refreshImages(root = document) {
    allMedia = root.querySelectorAll('.step-img, .step-vid')
}

export function denlargeAllImages() {
    allMedia.forEach(el => {
        el.classList.remove('enlarge')
    })
}

export function handleImgSizes({ e }) {

    const key = e.key.toLowerCase()

    if (key !== 'enter') return

    const step = e.target.closest('.step-float')

    if (!step) return

    cycleMedia(step)
}

export function cycleMedia(step) {

    const items = [
        ...step.querySelectorAll('.step-img, .step-vid')
    ]

    if (!items.length) return

    let index = Number(step.dataset.mediaIndex ?? -1)

    // remove all enlarged first
    items.forEach(el => {
        el.classList.remove('enlarge')
    })

    // next item
    index++

    // reset cycle
    if (index >= items.length) {
        step.dataset.mediaIndex = -1
        return
    }

    items[index].classList.add('enlarge')

    step.dataset.mediaIndex = index
}

export function clickToggleImgSize(target) {

    const media = target.closest('.step-img, .step-vid')

    if (!media) return

    media.classList.toggle('enlarge')
}