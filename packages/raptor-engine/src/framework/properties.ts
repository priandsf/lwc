import assert from "./assert";
import {
    subscribeToSetHook,
    notifyListeners,
} from "./watcher";
import {
    isRendering,
    vmBeingRendered,
} from "./invoker";
import { toString, isArray, isObject, isNull } from "./language";
import { XProxy } from "./xproxy";
import { TargetSlot, MembraneSlot } from "./membrane";

const ObjectPropertyToProxyCache: WeakMap<Object, Object> = new WeakMap();
const ProxyCache: WeakSet<Object> = new WeakSet(); // used to identify any proxy created by this piece of logic.

function propertyGetter(target: Object, key: string | Symbol): any {
    if (key === TargetSlot) {
        return target;
    } else if (key === MembraneSlot) {
        return propertyProxyHandler;
    }
    const value = target[key];
    if (isRendering && vmBeingRendered) {
        subscribeToSetHook(vmBeingRendered, target, key);
    }
    return (value && isObject(value)) ? getPropertyProxy(value) : value;
}

function propertySetter(target: Object, key: string | Symbol, value: any): boolean {
    if (isRendering) {
        assert.logError(`Setting property "${toString(key)}" of ${toString(target)} during the rendering process of ${vmBeingRendered} is invalid. The render phase must have no side effects on the state of any component.`);
        return false;
    }
    const oldValue = target[key];
    if (oldValue !== value) {
        target[key] = value;
        notifyListeners(target, key);
    } else if (key === 'length' && isArray(target)) {
        // fix for issue #236: push will add the new index, and by the time length
        // is updated, the internal length is already equal to the new length value
        // therefore, the oldValue is equal to the value. This is the forking logic
        // to support this use case.
        notifyListeners(target, key);
    }
    return true;
}

function propertyDelete(target: Object, key: string | Symbol): boolean {
    delete target[key];
    notifyListeners(target, key);
    return true;
}

const propertyProxyHandler = {
    get: propertyGetter,
    set: propertySetter,
    deleteProperty: propertyDelete,
    apply(target: any/*, thisArg: any, argArray?: any*/) {
        assert.fail(`invalid call invocation for property proxy ${target}`);
    },
    construct(target: any/*, argArray: any, newTarget?: any*/) {
        assert.fail(`invalid construction invocation for property proxy ${target}`);
    },
};

export function getPropertyProxy(value: Object): any {
    assert.isTrue(isObject(value), "perf-optimization: avoid calling this method for non-object value.");

    // TODO: Provide a holistic way to deal with built-ins, right now we just care ignore Date
    if (isNull(value) || value.constructor === Date) {
        return value;
    }
    // TODO: perf opt - we should try to give identity to propertyProxies so we can test
    // them faster than a weakmap lookup.
    if (ProxyCache.has(value)) {
        return value;
    }

    assert.block(function devModeCheck() {
        const isNode = value instanceof Node;
        assert.invariant(!isNode, `Do not store references to DOM Nodes. Instead use \`this.querySelector()\` and \`this.querySelectorAll()\` to find the nodes when needed.`);
    });

    let proxy = ObjectPropertyToProxyCache.get(value);
    if (proxy) {
        return proxy;
    }
    proxy = new XProxy(value, propertyProxyHandler);
    ObjectPropertyToProxyCache.set(value, proxy);
    ProxyCache.add(proxy);
    return proxy;
}
