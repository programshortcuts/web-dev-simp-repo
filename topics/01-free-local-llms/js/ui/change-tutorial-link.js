// change-tutorial-link.js

export function changeTutorialLink(e) {
    const tutorialLink = document.querySelector('#tutorialLink');
    if (!tutorialLink) return null;

    const source = e.target.closest('[data-video], [data-timestamp]')
        || e.currentTarget?.closest('[data-video], [data-timestamp]');

    if (!source) return tutorialLink;   console.log(source)
        const vidBase = source.getAttribute('data-video');
    const ts = source.getAttribute('data-timestamp') ;
    if (!vidBase) return tutorialLink
    
    let vidHref = vidBase;
    
    if (ts) {
        vidHref += (vidBase.includes('?') ? '&' : '?') + `t=${ts}s`;
    }
    console.log(vidHref)
    
    tutorialLink.setAttribute('href', vidHref);
    // console.log(tutorialLink)
    return tutorialLink;
}