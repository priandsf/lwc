const SSR = (typeof process !== 'undefined') && (typeof process.versions.node !== 'undefined');
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
