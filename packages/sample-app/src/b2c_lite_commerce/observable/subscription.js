/**
 * A subscription to an observable notification stream.
 */
export default class Subscription {
    _unsubscribeHandler;

    /**
     * Unsubscribes from the associated observable.
     */
    unsubscribe() {
        // If we have a handler, invoke it.
        if (this._unsubscribeHandler !== undefined) {
            // Snag a reference to the handler, then delete the instance property so that we only execute it once.
            const handler = this._unsubscribeHandler;
            delete this._unsubscribeHandler;

            handler();
        }
    }

    /**
     * Initializes a new Subscription with the specified unsubscribe handler.
     *
     * @param {Function} [unsubscribeHandler]
     *  A handler that is executed when then subscription is ended.
     *
     */
    constructor(unsubscribeHandler) {
        this._unsubscribeHandler = unsubscribeHandler;
    }
}
