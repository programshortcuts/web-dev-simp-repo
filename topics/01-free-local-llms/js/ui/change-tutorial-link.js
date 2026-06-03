// change-tutorial-link.js
export const tutorialLink = document.querySelector('#tutorialLink');

export function changeTutorialLink(e) {
    if (!tutorialLink) return null;
    
    const eventTarget = e.target instanceof Element ? e.target : e.target?.parentElement;
    const source = eventTarget?.closest('[data-video], [data-timestamp]')
        || e.target?.closest('[data-video], [data-timestamp]');

    if (!source) return tutorialLink;

    const vidBase = source.getAttribute('data-video');
    const ts = source.getAttribute('data-timestamp');
    if (!vidBase) return tutorialLink;

    let vidHref = vidBase;
    if (ts) {
        vidHref += (vidBase.includes('?') ? '&' : '?') + `t=${ts}s`;
    }

    tutorialLink.setAttribute('href', vidHref);
    
    return tutorialLink;
}