// m-key-handler.js
import { lastStep } from "./step-nav.js";
import { mainTargetDiv } from "./main-content-nav.js";
export function handleMKey({e,focusZone}) {
    e.preventDefault();
    e.stopPropagation();
    let key = e.key.toLowerCase()
    // 1. If there is a lastStep → ALWAYS go there
    // console.log(lastFocusedMainEl)
    // console.log('handle m key')
    if(focusZone != 'mainTargetDiv'){
        if(lastStep){
            lastStep.focus()
        } else if(document.contains(mainTargetDiv)){
            mainTargetDiv.focus()
        }
        return
    }
    // 2. Otherwise ALWAYS go to mainTargetDiv
    if (focusZone === 'mainTargetDiv'){
        if (e.target === lastStep){
            mainTargetDiv.focus()
            // mainTargetDiv.scrollIntoView({behavior:'instant',block:'start'});
            document.body.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest'
            });
            return
        } else
        if(e.target === mainTargetDiv){
            if(lastStep){
                lastStep.focus()
                return
            }  
        } else if(e.target.closest('a')) {
            lastStep.focus()
        } else {

            mainTargetDiv.focus()
            document.body.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest'
            });
        }
        
        return        
        
    }
}
