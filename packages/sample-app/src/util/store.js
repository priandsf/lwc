import { isSsr, getSsrContext } from "./ssr";

const INITIAL_STATE = '__B2C_INITIAL_STATE__';


//
// This method is used by the wire adapter to detect if a key changed
//
export function keyAsString(key) {
    if(typeof key === 'string') {
        return key;
    }
    if(!key) {
        return '';
    }
    return String(key);
}


//
// Initialize the global state manager for the client
// We assume that the store is only be initialized once this way, e.g. fragments coming
// later will be ignored. We might revisit that if needed
//
let GLOBALSTATE_CLIENT;
if(!isSsr()) {
    if(typeof window[INITIAL_STATE] !== 'undefined') {
        GLOBALSTATE_CLIENT = window[INITIAL_STATE];
        delete window[INITIAL_STATE];
    } else {
        GLOBALSTATE_CLIENT = {};
    }
}


class _Subscription {
    constructor(store,key,listener) {
        this._store = store;
        this._listener = listener;
        this._key = key;
    }
    unsubscribe() {
        this._store._unsubscribe(this._key,this._listener);
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

        if(!isSsr()) {
            const globalState = GLOBALSTATE_CLIENT;
            if(typeof globalState[name]==='undefined') {
                globalState[name] = {};
            }
            this._container = globalState[name];
        } else {
            this._container = undefined;
        }
    }

    _storeContainer() {
        if(this._container) {
            return this._container;
        }
        const globalState = getSsrContext().states;
        if(typeof globalState[this.name]==='undefined') {
            globalState[this.name] = {};
        }
        return globalState[this.name];
    }

    _get(container,key,load) {
        const k = keyAsString(key);
        let e = container[k];
        if(e===undefined) {
            e = container[k] = {
                data: undefined,
                error: undefined,
                loaded: false,
                loading: undefined,
                subscribers: []
            };
        }
        if(load && !e.loaded) {
            this._load(key,e);
        }
        return e;
    }

    _load(key,e,loader) {
        if(!loader) loader = this.options.loader;
        if(!e.loading && loader) {
            e.loading = loader(key)
                .then( (value) => {
                    e.data=value;
                    e.error=undefined;
                    e.loaded=true;
                    e.loading=undefined;
                    this._notify(e);
                    return e;
                } )
                .catch( (error) => {
                    e.data=undefined;
                    e.error=error.message;
                    e.loaded=true;
                    e.loading=undefined;
                    this._notify(e);
                    return e;
                } );
            if(isSsr() && e.loading) {
                getSsrContext().loading.push(e.loading);
            }
        }
    }

    _unsubscribe(key,l) {
        const container = this._storeContainer();
        const k = keyAsString(key);
        const e = container[k];
        if(e) {
            const index = e.subscribers.indexOf(l);
            if(index>=0) {
                e.subscribers.splice(index,1);
            }
            if(e.subscribers.length===0) {
                if(typeof this.options.discard!=='undefined') {
                    if(this.options.discard===false) {
                        return;
                    }
                    // We could have a function that discards using a MRU, or whatever...
                    // This can be extended in many ways
                }
                delete container[k];
            }
        }
    }

    _notify(e) {
        if(e) {
            e.subscribers.forEach( (l) => {
                if(l) l(this._exportObject(e));
            });
        }
    }

    _exportObject(container) {
        const {data,error,loading,loaded} = container;
        return {data,error,loading,loaded};
    }


    //
    // Public methods
    //

    has(key) {
        const k = keyAsString(key);
        return this._storeContainer()[k]!==undefined;
    }
    get(key) {
        return this._exportObject(this._get(this._storeContainer(),key,true));
    }
    async getAsync(key) {
        const e = this._get(this._storeContainer(),key,true);
        if(!e.loaded && e.loading) {
            await e.loading;
        }
        return this._exportObject(e);
    }
    set(key,data,error) {
        const e = this._get(this._storeContainer(),key,false);
        // Should it throw an exception if the loading flag is set, and thus the assignment failed?
        if(!e.loading) {
            Object.assign( e, {data,error,loaded:true} );
            this._notify(e);
        }
    }
    remove(key) {
        const container = this._storeContainer();
        const k = keyAsString(key);
        const e = container[k];
        if(e && e.subscribers.length===0) {
            delete container[k];
        }
    }
    load(key,loader) {
        const e = this._get(this._storeContainer(),key,false);
        if(!e.loading) {
            this._load(key,e,loader);
        }
        return e;
    }

    subscribe(key,listener) {
        const k = arguments.length==1 ? undefined : key;
        const l = arguments.length==1 ? key : listener;
        const e = this._get(this._storeContainer(),k,true);
        e.subscribers.push(l);
        if(l) l(e);
        return new _Subscription(this,k,l);
    }

    notify(key) {
        const e = this._storeContainer()[keyAsString(key)];
        if(e) {
            this._notify(e);
        }
    }
}

export function createStore(name,loader) {
    return new Store(name,loader);
}
