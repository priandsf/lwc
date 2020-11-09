import { keyAsString } from './store-key';

/**
 * Generic @wire adapter that works with a store.
 *
 * Note: this is deprecated for Commerce as it does not work with Server Side Rendering
 *
 * Typical usage:
 *    const myStore  = new Store('MyStore',loadMyStore);
 *    ...
 *    @wire(StoreAdapter,{store:myStore[,key: objectkey]}) myData;
 *
 * or:
 *    const myStore  = new Store('MyStore',loadMyStore);
 *    class MyAdapter extends StoreAdapter {
 *      constructor(dataCallback) {
 *        super(dataCallback,myStore);
 *      }
 *    }
 *    ...
 *    @wire(MyAdapter,{[,key: objectkey]}) myData;
 *
 */
export class StoreAdapter {

    /**
     * Dedicated constructor.
     * 'store' and 'key' can be used by inherited, specialized stores
     */
    constructor(dataCallback,store,key) {
        this.initialStore = this.store = store;
        this.initialKey = this.key = key;
        this.dataCallback = dataCallback;
        this.connected = false;
        this.subscribedStore = undefined;
        this.subscribedKey = undefined;
    }

    _unsubscribe() {
        if(this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = undefined;
            this.subscribedStore = undefined;
            this.subscribedKey = undefined;
        }
    }

    _subscribe() {
        if(this.subscribedStore!==this.store || keyAsString(this.subscribedKey)!==keyAsString(this.key)) {
            this._unsubscribe();
            if(this.store) {
                this.subscribedStore = this.store;
                this.subscribedKey = this.key;
                this.subscription = this.subscribedStore.getObservable(this.subscribedKey).subscribe(this.dataCallback);
            }
        }
    }

    update(config) {
        this.config = config;
        if(this.initialStore===undefined) this.store = config.store;
        if(this.initialKey===undefined) this.key = config.key;
        if(this.connected) {
            this._subscribe();
        }
    }

    connect() {
        this.connected = true;
        this._subscribe();
    }

    disconnect() {
        this._unsubscribe();
        this.connected = false;
    }
}