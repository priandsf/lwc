/**
 * Some url utilities.
 */

import { getSsrContext } from "./ssr";

export function hasQueryParameter(key) {
    if(getSsrContext() ) {
        return getSsrContext().query.hasOwnProperty(key);
    }
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has(key);
}

export function getQueryParameter(key) {
    if(getSsrContext() ) {
        return getSsrContext().query[key];
    }
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(key);
}

export function queryString(params) {
    // The order of the parameters is predictable
    return params ? 
            Object.keys(params).sort()
                .map(function(k) {
                    const pk = params[k];
                    return encodeURIComponent(k) + (pk!==undefined ? ('=' + encodeURIComponent(pk)) : '')} 
                )
                .join('&')
            : "";
}

export function composeUrl(path, params = {}) {
    let url = path;
    // Propagate the SSR parameter
    const ssr = hasQueryParameter('ssr');
    if(ssr) {
        params['ssr'] = undefined;
    }
    const shadow = hasQueryParameter('shadow');
    if(shadow) {
        params['shadow'] = undefined;
    }
    let qs = queryString(params)
    if (qs) {
        url += '?' + qs;
    }
    return url;
}

export function getBaseUrl() {
    if(getSsrContext() ) {
        return getSsrContext().baseUrl;
    }
    return '';
}