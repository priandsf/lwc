/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import assert from '../shared/assert';
import {
    invokeComponentConstructor,
    invokeComponentRenderMethod,
    isInvokingRender,
    invokeEventListener,
} from './invoker';
import {
    isArray,
    ArrayIndexOf,
    ArraySplice,
    isFunction,
    isUndefined,
    StringToLowerCase,
} from '../shared/language';
import { invokeServiceHook, Services } from './services';
import { VM, getComponentVM, UninitializedVM } from './vm';
import { VNodes } from '../3rdparty/snabbdom/types';
import { tagNameGetter } from '../env/element';
import { Template, isUpdatingTemplate, getVMBeingRendered } from './template';

export type ErrorCallback = (error: any, stack: string) => void;
export interface ComponentInterface {
    // TODO: #1291 - complete the entire interface used by the engine
    setAttribute(attrName: string, value: any): void;
}

export interface ComponentConstructor {
    new (): ComponentInterface;
    readonly name: string;
    readonly labels?: string[];
    readonly delegatesFocus?: boolean;
}

export interface ComponentMeta {
    readonly name: string;
    readonly template?: Template;
}

const signedComponentToMetaMap: Map<ComponentConstructor, ComponentMeta> = new Map();

/**
 * INTERNAL: This function can only be invoked by compiled code. The compiler
 * will prevent this function from being imported by userland code.
 */
export function registerComponent(
    Ctor: ComponentConstructor,
    { name, tmpl: template }
): ComponentConstructor {
    signedComponentToMetaMap.set(Ctor, { name, template });
    // chaining this method as a way to wrap existing
    // assignment of component constructor easily, without too much transformation
    return Ctor;
}

export function getComponentRegisteredMeta(Ctor: ComponentConstructor): ComponentMeta | undefined {
    return signedComponentToMetaMap.get(Ctor);
}

export function createComponent(uninitializedVm: UninitializedVM, Ctor: ComponentConstructor) {
    if (process.env.NODE_ENV !== 'production') {
        assert.isTrue(
            uninitializedVm && 'cmpProps' in uninitializedVm,
            `${uninitializedVm} is not a vm.`
        );
    }

    // create the component instance
    invokeComponentConstructor(uninitializedVm, Ctor);

    const initializedVm = uninitializedVm;
    if (isUndefined(initializedVm.component)) {
        throw new ReferenceError(
            `Invalid construction for ${Ctor}, you must extend LightningElement.`
        );
    }
}

export function linkComponent(vm: VM) {
    if (process.env.NODE_ENV !== 'production') {
        assert.isTrue(vm && 'cmpRoot' in vm, `${vm} is not a vm.`);
    }
    // wiring service
    const {
        def: { wire },
    } = vm;
    if (wire) {
        const { wiring } = Services;
        if (wiring) {
            invokeServiceHook(vm, wiring);
        }
    }
}

export function clearReactiveListeners(vm: VM) {
    if (process.env.NODE_ENV !== 'production') {
        assert.isTrue(vm && 'cmpRoot' in vm, `${vm} is not a vm.`);
    }
    const { deps } = vm;
    const len = deps.length;
    if (len > 0) {
        for (let i = 0; i < len; i += 1) {
            const set = deps[i];
            const pos = ArrayIndexOf.call(deps[i], vm);
            if (process.env.NODE_ENV !== 'production') {
                assert.invariant(
                    pos > -1,
                    `when clearing up deps, the vm must be part of the collection.`
                );
            }
            ArraySplice.call(set, pos, 1);
        }
        deps.length = 0;
    }
}

export function renderComponent(vm: VM): VNodes {
    if (process.env.NODE_ENV !== 'production') {
        assert.isTrue(vm && 'cmpRoot' in vm, `${vm} is not a vm.`);
        assert.invariant(vm.isDirty, `${vm} is not dirty.`);
    }

    clearReactiveListeners(vm);

    const vnodes = invokeComponentRenderMethod(vm);
    vm.isDirty = false;
    vm.isScheduled = false;

    if (process.env.NODE_ENV !== 'production') {
        assert.invariant(
            isArray(vnodes),
            `${vm}.render() should always return an array of vnodes instead of ${vnodes}`
        );
    }
    return vnodes;
}

export function markComponentAsDirty(vm: VM) {
    if (process.env.NODE_ENV !== 'production') {
        assert.isTrue(vm && 'cmpRoot' in vm, `${vm} is not a vm.`);
        const vmBeingRendered = getVMBeingRendered();
        assert.isFalse(
            vm.isDirty,
            `markComponentAsDirty() for ${vm} should not be called when the component is already dirty.`
        );
        assert.isFalse(
            isInvokingRender,
            `markComponentAsDirty() for ${vm} cannot be called during rendering of ${vmBeingRendered}.`
        );
        assert.isFalse(
            isUpdatingTemplate,
            `markComponentAsDirty() for ${vm} cannot be called while updating template of ${vmBeingRendered}.`
        );
    }
    vm.isDirty = true;
}

const cmpEventListenerMap: WeakMap<EventListener, EventListener> = new WeakMap();

export function getWrappedComponentsListener(vm: VM, listener: EventListener): EventListener {
    if (process.env.NODE_ENV !== 'production') {
        assert.isTrue(vm && 'cmpRoot' in vm, `${vm} is not a vm.`);
    }
    if (!isFunction(listener)) {
        throw new TypeError(); // avoiding problems with non-valid listeners
    }
    let wrappedListener = cmpEventListenerMap.get(listener);
    if (isUndefined(wrappedListener)) {
        wrappedListener = function(event: Event) {
            invokeEventListener(vm, listener, undefined, event);
        };
        cmpEventListenerMap.set(listener, wrappedListener);
    }
    return wrappedListener;
}

export function getComponentAsString(component: ComponentInterface): string {
    if (process.env.NODE_ENV === 'production') {
        throw new ReferenceError();
    }
    const vm = getComponentVM(component);
    return `<${StringToLowerCase.call(tagNameGetter.call(vm.elm))}>`;
}
