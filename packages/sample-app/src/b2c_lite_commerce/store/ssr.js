const SSRFLAG= '__B2C_SSR__';
const SSRCONTEXT= '__B2C_SSRCONTEXT__';

export function isSsr() {
    return typeof global!=='undefined' && global[SSRFLAG]===true;
}

export function getSsrContext() {
    if(isSsr()) {
        return global[SSRCONTEXT];
    }
    return undefined;
}
