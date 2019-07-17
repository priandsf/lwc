/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { isUndefined, ArrayPush, forEach } from '../shared/language';
import { guid } from './utils';
import { WireAdapterConstructor, ContextValue, getAdapterToken, setAdapterToken } from './wiring';

type WireContextDisconnectCallback = () => void;
type WireContextInternalProtocolCallback = (
    newContext: ContextValue,
    disconnectCallback: WireContextDisconnectCallback
) => void;
interface ContextConsumer {
    provide(newContext: ContextValue): void;
}

interface WireContextEvent extends CustomEvent {
    detail: WireContextInternalProtocolCallback;
}

// this is lwc internal implementation
export function createContextProvider(adapter: WireAdapterConstructor) {
    let adapterContextToken = getAdapterToken(adapter);
    if (!isUndefined(adapterContextToken)) {
        throw new Error(`Adapter already have a context provider.`);
    }
    adapterContextToken = guid();
    setAdapterToken(adapter, adapterContextToken);
    return (elm: EventTarget) => {
        const connectQueue = [];
        const disconnectQueue = [];
        elm.addEventListener(adapterContextToken as string, (evt: WireContextEvent) => {
            const { detail } = evt;
            const consumer: ContextConsumer = {
                provide(newContext) {
                    detail(newContext, disconnectCallback);
                },
            };
            const disconnectCallback = () => {
                forEach.call(disconnectQueue, callback => callback(consumer));
            };
            forEach.call(connectQueue, callback => callback(consumer));
        });
        return {
            onConsumerConnected(callback: (consumer: ContextConsumer) => void) {
                ArrayPush.call(connectQueue, callback);
            },
            onConsumerDisconnected(callback: (consumer: ContextConsumer) => void) {
                ArrayPush.call(disconnectQueue, callback);
            },
        };
    };
}
