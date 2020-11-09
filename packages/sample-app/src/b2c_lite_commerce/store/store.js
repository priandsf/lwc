import { isSsr, getSsrContext } from './ssr';
import { BehaviorSubject } from 'b2c_lite_commerce/observable';
import { keyAsString } from './store-key';

export { StoreAdapter } from './store-wire';
export { isSsr, getSsrContext } from './ssr';

const INITIAL_STATE = '__B2C_INITIAL_STATE__';


/**
 * Internal subject class
 */
class StoreSubject extends BehaviorSubject {
    constructor(store,keyString,value) {
        super(value);
        this.store = store;
        this.keyString = keyString;
        this.subscribers = 0;
        // We have to store the SSR context when the subject is created, as it will be unavailable when the request is completed
        // Thus it won't be available dynamically when a Promise is resolved
        if(isSsr()) {
            this.ssrContext = getSsrContext();
        }
    }
    next(nextValue) {
        // In case of SSR, we make sure that the value is stored in the global ssr context
        // So the server renderer can retrieve it afterwards
        if(this.ssrContext) {
            const states = this.ssrContext.states;
            const state = states[this.store.name] || ( states[this.store.name] = {});
            state[this.keyString] = nextValue;
        }
        super.next(nextValue);
    }
    subscribe(handler) {
        const subscription = super.subscribe(handler);
        if(++this.subscribers===1) {
            this.store._addSubject(this);
        }
        return {
            unsubscribe: () => {
                subscription.unsubscribe();
                // If no more handlers, we remove the subject
                if(--this.subscribers===0) {
                    this.store._removeSubject(this);
                }
            }
        };
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
        this.subjects = [];

        // Preload the store on the client when SSR was activated
        if(!isSsr()) {
            this._container = {};
            if(typeof window !== 'undefined' && typeof window[INITIAL_STATE] !== 'undefined') {
                const initialState = window[INITIAL_STATE][name];
                if(initialState) {
                    for (const [keyString, value] of Object.entries(initialState)) {
                        this._container[keyString] = value;
                        this.subjects[keyString] = new StoreSubject(this,keyString,value);
                    }
                    delete window[INITIAL_STATE][name];
                }
            }
        }
    }



    _addSubject(subject) {
        this.subjects.push(subject);
    }
    _removeSubject(subject) {
        // First remove the subject from the list of subjects
        const idx = this.subjects.findIndex( (s) => subject===s);
        if(idx>=0) {
            this.subjects.splice(idx,1);
        }
        // Discard the value in the store if there is no more observable
        // We could have a function that discards using a MRU, or whatever...
        // This can be extended in many ways
        if(this.options.discard) {
            const keyString = subject.keyString;
            const count = this.subjects.reduce( (a,s) => a + (s.keyString===keyString), 0 );
            if(count===0) {
                delete this.container[keyString];
            }
        }
    }

    get container() {
        // Client side container
        if(!isSsr()) {
            return this._container;
        }
        // Server side container
        // It must be stored in the SSR context as
        const states = getSsrContext().states;
        return states[this.name] || (states[this.name] = {});
    }

    _get(key,keyString,load) {
        const container = this.container;
        if(!container[keyString]) {
            container[keyString] = { data: undefined, error: undefined, loaded: false, loading: undefined };
        }
        if(load && !container[keyString].loaded && !container[keyString].loading) {
            this._load(key,keyString);
        }
        return container[keyString];
    }

    _load(key,keyString,loader) {
        // We get the container here so it is available to the promises even though the context changed
        const container = this.container;
        loader = loader || this.options.loader;
        if(loader) {
            this._cancelRequest(container[keyString]);
            try {
                const result = loader(key);
                if(result.then) {
                    const loading = result.then( (data) => {
                        // Verify that the promise is the expected one
                        // It happens when multiple load requests are sent at the same time
                        // The latest will win
                        if(container[keyString].loading===loading) {
                            const v = container[keyString] = { data: data, error: undefined, loaded: true, loading: undefined };
                            this._notify(key,keyString,v);
                        }
                        return container[keyString];
                    } )
                    .catch( (ex) => {
                        const error = this._errorFromException(ex);
                        if(container[keyString].loading===loading) {
                            const v = container[keyString] = { data: undefined, error: error, loaded: true, loading: undefined };
                            this._notify(key,keyString,v);
                            }
                        return container[keyString];
                    } );
                    if(isSsr()) {
                        // With SSR, we don't notify the loading state as this is not necessary
                        // We simply store the value so it gets to the store.
                        container[keyString].loading = loading;
                        if(loading) {
                            getSsrContext().loading.push(loading);
                        }
                    } else {
                        const v = container[keyString] = { ...container[keyString], loading };
                        this._notify(key,keyString,v);
                    }
                } else {
                    const v = container[keyString] = { data: result,error: undefined,loaded: true,loading: undefined };
                    this._notify(key,keyString,v);
                }
            } catch(ex) {
                const error = this._errorFromException(ex);
                const v = container[keyString] = { data: undefined, error: error, loaded: true, loading: undefined };
                this._notify(key,keyString,v);
            }
        }
        return container[keyString];
    }
    _errorFromException(ex) {
        return ex.toString();
    }

    _cancelRequest(value) {
        if(value && value.loading) {
            // For now, only clear it - do more later with AbortablePromises
            value.loading = undefined;
        }
    }

    _notify(key,keyString,value) {
        this.subjects
            .filter( (subject) => subject.keyString===keyString )
            .forEach( (sub) => {
                sub.next(value);
            });
    }


    //
    // Public methods
    //

    /**
     * Checks if the store has an entry for a key.
     *
     * @param {*} key
     */
    has(key) {
        const keyString = keyAsString(key);
        return Object.prototype.hasOwnProperty.call(this.container,keyString);
    }

    /**
     * Get a value by key.
     *
     * @param {object} key
     */
    get(key) {
        return this._get(key,keyAsString(key),true);
    }

    /**
     * Shortcut to get the data by key.
     *
     * @param {object} key
     */
    getData(key) {
        return this.get(key).data;
    }

    /**
     * Shortcut to get the error by key.
     *
     * @param {object} key
     */
    getError(key) {
        return this.get(key).error;
    }

    /**
     * Returns the data after waiting for its load.
     *
     * @param {object} key
     */
    async getAsync(key) {
        const keyString = keyAsString(key);
        const value = this._get(key,keyString,true);
        if(!value.loaded && value.loading) {
            await value.loading;
        }
        return this.container[keyString];
    }

    /**
     * Set the data for a key.
     *
     * The key is optional.
     * @param {*} key
     * @param {*} data
     */
    setData(key,data) {
        const _key = arguments.length===1 ? undefined : key;
        const _data = arguments.length===1 ? key : data;
        const keyString = keyAsString(_key);
        const v = this.container[keyString] = {data:_data,error:undefined,loaded:true,loading:undefined};
        this._notify(key,keyString,v);
    }

    /**
     * Set the error for a key.
     *
     * The key is optional.
     * @param {*} key
     * @param {*} data
     */
    setError(key,error) {
        const _key = arguments.length===1 ? undefined : key;
        const _error = arguments.length===1 ? key : error;
        const keyString = keyAsString(_key);
        const v = this.container[keyString] = {data:undefined,error:_error,loaded:true,loading:undefined};
        this._notify(key,keyString,v);
    }

    /**
     * Remove an entry by key.
     *
     * @param {*} key
     * @param {*} data
     */
    remove(key) {
        const keyString = keyAsString(key);
        this._cancelRequest(this.container[keyString]);
        delete this.container[keyString];
        const v = {data:undefined, error:undefined};
        this._notify(key,keyString,v);
    }


    /**
     * Load an entry by key.
     *
     * The loading state is set during the loading process and the observers are notified
     *
     * The key is optional.
     * @param {*} key
     * @param {*} data
     */
    load(key,loader) {
        const _key = arguments.length===1 ? undefined : key;
        const _listener = arguments.length===1 ? key : loader;
        const keyString = keyAsString(_key);

        this._get(_key,keyString,false);
        return this._load(_key,keyString,_listener);
    }

    /**
     * Get an observable to get the notifications for a given key.
     *
     * @param {*} key
     */
    getObservable(key) {
        const keyString = keyAsString(key);
        const value = this._get(key,keyString,true);
        return new StoreSubject(this,keyString,value);
    }

    /**
     * Cancel an on-going request if there is one.
     */
    cancelRequest(key) {
        this._cancelRequest(this.container[keyAsString(key)]);
    }
}
