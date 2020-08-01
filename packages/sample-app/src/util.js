/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/

const qs = window.location.search;
const up = new URLSearchParams(qs);

export function isParam(p) {
    return !(up.get(p)==='false')
}

export function resetParams() {
    let url =  window.location.href;
    if (url.indexOf("?") >= 0) {
        url = url.substring(0, url.indexOf("?"))
    }
    window.location.href = url;
}

export function setParam(p,v) {
    up.delete(p);
    if(!v) {
        up.set(p,'false');
    }
    let url =  window.location.href;
    if (url.indexOf("?") >= 0) {
        url = url.substring(0, url.indexOf("?"))
    }
    url = url + "?" + up.toString();
    window.location.href = url;
}

export function toggleParam(p) {
    setParam(p,!isParam(p));
}