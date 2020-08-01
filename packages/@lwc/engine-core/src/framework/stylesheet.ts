/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { isArray, isUndefined, ArrayJoin, ArrayPush } from '@lwc/shared';

import * as api from './api';
import { VNode } from '../3rdparty/snabbdom/types';
import { VM } from './vm';
import { Template } from './template';

/**
 * Function producing style based on a host and a shadow selector. This function is invoked by
 * the engine with different values depending on the mode that the component is running on.
 */
type StylesheetFactory = (
    hostSelector: string,
    shadowSelector: string,
    nativeShadow: boolean
) => string;

/**
 * The list of stylesheets associated with a template. Each entry is either a StylesheetFactory or a
 * TemplateStylesheetFactory a given stylesheet depends on other external stylesheets (via the
 * @import CSS declaration).
 */
export type TemplateStylesheetFactories = Array<StylesheetFactory | TemplateStylesheetFactories>;

function createShadowStyleVNode(content: string): VNode {
    return api.h(
        'style',
        {
            key: 'style', // special key
            attrs: {
                type: 'text/css',
            },
        },
        [api.t(content)]
    );
}

export function updateSyntheticShadowAttributes(vm: VM, template: Template) {
    const { elm, context, renderer } = vm;
    const { stylesheets: newStylesheets, stylesheetTokens: newStylesheetTokens } = template;

    let newHostAttribute: string | undefined;
    let newShadowAttribute: string | undefined;

    // Reset the styling token applied to the host element.
    const oldHostAttribute = context.hostAttribute;
    if (!isUndefined(oldHostAttribute)) {
        renderer.removeAttribute(elm, oldHostAttribute);
    }

    // Apply the new template styling token to the host element, if the new template has any
    // associated stylesheets.
    if (
        !isUndefined(newStylesheetTokens) &&
        !isUndefined(newStylesheets) &&
        newStylesheets.length !== 0
    ) {
        newHostAttribute = newStylesheetTokens.hostAttribute;
        newShadowAttribute = newStylesheetTokens.shadowAttribute;

        renderer.setAttribute(elm, newHostAttribute, '');
    }

    // Update the styling tokens present on the context object.
    context.hostAttribute = newHostAttribute;
    context.shadowAttribute = newShadowAttribute;
}

function evaluateStylesheetsContent(
    stylesheets: TemplateStylesheetFactories,
    hostSelector: string,
    shadowSelector: string,
    nativeShadow: boolean
): string[] {
    const content: string[] = [];

    for (let i = 0; i < stylesheets.length; i++) {
        const stylesheet = stylesheets[i];

        if (isArray(stylesheet)) {
            ArrayPush.apply(
                content,
                evaluateStylesheetsContent(stylesheet, hostSelector, shadowSelector, nativeShadow)
            );
        } else {
            ArrayPush.call(content, stylesheet(hostSelector, shadowSelector, nativeShadow));
        }
    }

    return content;
}

export function getStylesheetsContent(vm: VM, template: Template): string[] {
    const { stylesheets, stylesheetTokens: tokens } = template;
    const { syntheticShadow } = vm.renderer;
    // PHIL: handle Light DOM
    const { lightDom } = vm;

    let content: string[] = [];

    if (!isUndefined(stylesheets) && !isUndefined(tokens)) {
        // PHIL: handle Light DOM
        const hostSelector = (lightDom || syntheticShadow) ? `[${tokens.hostAttribute}]` : '';
        const shadowSelector = (lightDom || syntheticShadow) ? `[${tokens.shadowAttribute}]` : '';

        // PHIL: handle Light DOM
        content = evaluateStylesheetsContent(
            stylesheets,
            hostSelector,
            shadowSelector,
            !(lightDom || syntheticShadow)
        );
    }

    return content;
}

export function createStylesheet(vm: VM, stylesheets: string[]): VNode | null {
    const { lightDom, renderer } = vm;

    if (lightDom || renderer.syntheticShadow) {
        for (let i = 0; i < stylesheets.length; i++) {
            renderer.insertGlobalStylesheet(stylesheets[i],vm.elm);
        }

        return null;
    } else {
        const shadowStyleSheetContent = ArrayJoin.call(stylesheets, '\n');
        return createShadowStyleVNode(shadowStyleSheetContent);
    }
}
