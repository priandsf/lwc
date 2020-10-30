const SSR = typeof global!=='undefined' && global['__B2C_SSR__']===true;

export function isSsr() {
    return SSR;
}

const SSRCONTEXT= '__B2C_SSRCONTEXT__';
export function getSsrContext() {
    if(SSR) {
        return global[SSRCONTEXT];
    }
    return undefined;
}
