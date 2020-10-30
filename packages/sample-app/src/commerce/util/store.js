import { isSsr, getSsrContext } from "./ssr";
import { BehaviorSubject } from 'commerce/observable'

const INITIAL_STATE = '__B2C_INITIAL_STATE__';
const SSR = isSsr();

class StoreSubject extends BehaviorSubject {
    constructor(store,key,value) {
        super(value);
        this.key = key || '';
        this.store = store;
        // We have to store the SSR context when the subject is created, as it will be unavailable when the request is completed
        // Thus it won't be available dynamically when a Promise is resolved
        if(SSR) {
            this.ssrContext = getSsrContext();
        }
    }
    next(nextValue) {
        // In case of SSR, we make sure that the value is stored in the global ssr context
        // So the server renderer can retrieve it afterwards
        if(this.ssrContext) {
            const states = this.ssrContext.states;
            const state = states[this.store.name] || ( states[this.store.name] = {}) 
            state[this.key] = nextValue;
        }
        super.next(nextValue);
    }
    _delete(handler) {
        super._delete(handler);
        // No more handler, we remove the subject
        if(this._nextHandlers.size==0) {
            this.store._subscriberRemoved(this.key);
        }
    }
}


/**
 * Simple in memory store.
 *
 * This is a centralized client side state manager that stores data and notify subscribers on changes.
 * An instance of a store is generally dedicated to one type of data management, like a cart of a set of products.
 *
 * A store can hold a single JS object or a set of objects referemced by a key. For example, a typical commerce
 * application will have one cart object, and multiple products referenced by their id. A single object is
 * in fact an object with a undefined, null or empty string key.
 *
 * The store uses a lazy loading mechanism, which attempts to load the data on its first access. To do this,
 * it uses a 'loader' that is invoked when the data should be loaded. This function returns a Promise that
 * resolves when the data, or a load error, is available.
 *
 * An object is created in the store as soon as it is accessed for the first time. It always contains the
 * following properties:
 *   - data
 *     The actually object data, like a product. It can be null if the data hasn't been loaded yet, or if
 *     there was an error when loading the object.
 *   - error
 *     An error object if the store failed to load the object. It can be null if the data hasn't been loaded yet,
 *     or if the object loaded properly.
 *   - loaded
 *     Set when an attempt to load the object was completed, which resulted in some data or an error.
 *   - loading
 *     Contains a promise if the data is being loaded. Most applications will simply check if the value
 *     is not null/undefined to display a loading icon. The promise is provided to support advanced use cases
 *     like Server Side Rendering
 *
 * Each object in the store can have subscribers that will be notified when the object is updated. When an
 * object has no longer subscribers, it is removed from the store. To keep it alive, one can create a fake
 * subscriber to keep a reference active.
 * When the an object is changed, because the data was loaded, or changed programmatically, all the subscribers
 * are notified. Also, when a subscriber sunscribes to an object that is already in the store, then it
 * receives an initial notification.
 *
 */
export class Store {

    constructor(name,options) {
        this.options = options || {};
        this.name = name;

        // Preload the store on the client when SSR was activated
        if(!SSR) {
            this._container = {};
            if(typeof window !== 'undefined' && typeof window[INITIAL_STATE] !== 'undefined') {
                const initialState = window[INITIAL_STATE][name];
                if(initialState) {
                    for (const [key, value] of Object.entries(initialState)) {
                        this._container[key||''] = new StoreSubject(this,key,value);
                    }
                    delete window[INITIAL_STATE][name];
                }
            }
        }
    }

    get container() {
        // Client side container
        if(!SSR) {
            return this._container;
        }
        // Server side container
        // It must be stored in the SSR context as
        const ssrContext = getSsrContext();
        const subjects = ssrContext._subjects || (ssrContext._subjects={})
        return subjects[this.name] || (subjects[this.name] = {})
    }

    _get(key,load) {
        let sub = this.container[key||''] ;
        if(sub===undefined) {
            sub = new StoreSubject(this,key,{
                data: undefined,
                error: undefined,
                loaded: false,
                loading: undefined
            });
            this.container[key||''] = sub;
        }
        if(load && !sub.value.loaded) {
            this._load(sub);
        }
        return sub;
    }

    _load(sub,loader) {
        if(!loader) loader = this.options.loader;
        const value = sub.value;
        if(!value.loading && loader) {
            const loading = loader(sub.key)
                .then( (value) => {
                    const v = {
                        data: value,
                        error: undefined,
                        loaded: true,
                        loading: undefined
                    }
                    sub.next(v);
                    return v;
                } )
                .catch( (error) => {
                    const v = {
                        data: undefined,
                        error: error.message,
                        loaded: true,
                        loading: undefined
                    }
                    sub.next(v);
                    return v;
                } );
            if(SSR) {
                // With SSR, we don't notify the loading stage as this is not necessary
                // We simply store the value so it gets to the store.
                value.loading = loading;
                if(loading) {
                    getSsrContext().loading.push(loading);
                }
            } else {
                sub.next({
                    data: value.data,
                    error: value.error,
                    loaded: value.loaded,
                    loading
                });
            }
        }
    }

    _subscriberRemoved(key) {
        // We could have a function that discards using a MRU, or whatever...
        // This can be extended in many ways
        if(typeof this.options.discard!=='undefined') {
            if(this.options.discard===false) {
                return;
            }
        }
        delete this.container[key||''];
    }


    //
    // Public methods
    //

    getSubject(key) {
        return this._get(key,true);
    }

    has(key) {
        return this.container.hasOwnProperty(key||'');
    }

    get(key) {
        return this.getSubject(key).value;
    }

    async getAsync(key) {
        const sub = this.getSubject(key);
        const value = sub.value;
        if(!value.loaded && value.loading) {
            await value.loading;
        }
        return value;
    }

    set(key,data) {
        const k = arguments.length==1 ? undefined : key;
        const d = arguments.length==1 ? key : data;
        const sub = this._get(k,false);
        // Should it throw an exception if the loading flag is set, and thus the assignment failed?
        if(!sub.value.loading) {
            sub.next({data:d,error:undefined,loaded:true,loading:undefined});
        }
    }
    setError(key,error) {
        const k = arguments.length==1 ? undefined : key;
        const e = arguments.length==1 ? key : error;
        const sub = this._get(k,false);
        // Should it throw an exception if the loading flag is set, and thus the assignment failed?
        if(!sub.value.loading) {
            sub.next({data:undefined,error:e ,loaded:true,loading:undefined});
        }
    }
    remove(key) {
        const sub = this.container[key||''];
        // Only if there is no subscribers
        if(sub && sub._nextHandlers.size===0) {
            delete this.container[key||''];
        }
    }
    load(key,loader) {
        const k = arguments.length==1 ? undefined : key;
        const l = arguments.length==1 ? key : loader;
        const sub = this._get(k,false);
        if(!sub.value.loading) {
            this._load(sub,l);
        }
        return sub.value;
    }

    subscribe(key,listener) {
        const k = arguments.length==1 ? undefined : key;
        const l = arguments.length==1 ? key : listener;
        return this.getSubject(k).subscribe(l);
    }
}

export function createStore(name,loader) {
    return new Store(name,loader);
}
