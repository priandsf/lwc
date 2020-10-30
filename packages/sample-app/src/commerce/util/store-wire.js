/**
 * Generic @wire adapter that works with a store.
 *
 * Note: this is deprecated for Commerce as it does not work with Server Side Rendering
 *
 * Typical usage:
 *    const myStore  = createStore('MyStore',loadMyStore);
 *    ...
 *    @wire(StoreAdapter,{store:myStore[,key: objectkey]}) myData;
 *
 * or:
 *    const myStore  = createStore('MyStore',loadMyStore);
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
        if(this.subscribedStore!==this.store || (this.subscribedKey||'')!==(this.key||'')) {
            this._unsubscribe();
            if(this.store) {
                this.subscribedStore = this.store;
                this.subscribedKey = this.key;
                this.subscription = this.subscribedStore.subscribe(this.subscribedKey,this.dataCallback);
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