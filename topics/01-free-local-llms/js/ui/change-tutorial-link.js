// change-tutorial-link.js
export const tutorialLink = document.querySelector('#tutorialLink');

export function changeTutorialLink(e) {
    if (!tutorialLink) return null;

    const path = e?.composedPath?.() || [];
    const eventTarget = e?.target instanceof Element ? e.target : e?.target?.parentElement;

    const source = path.find((node) => node instanceof Element && node.matches?.('[data-video], [data-timestamp]'))
        || eventTarget?.closest('[data-video], [data-timestamp]')
        || e?.currentTarget?.closest?.('[data-video], [data-timestamp]');

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