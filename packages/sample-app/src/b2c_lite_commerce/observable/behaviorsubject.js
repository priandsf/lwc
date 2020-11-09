import Subject from './subject';
/**
 * A simple observable behavior subject.
 */
export default class BehaviorSubject extends Subject {

    constructor(value) {
        super();
        this._value = value;
    }

    get value() {
        return this._value;
    }
    getValue() {
        return this._value;
    }

    /**
     * Emits the next value to all subscribed handlers.
     * The value is stored to be emitted to late subscribers
     *
     * @param {object} [nextValue]
     *  The optional value to provide to subscribers.
     */
    next(nextValue) {
        this._value = nextValue;
        return super.next(nextValue);
    }

    /**
     * Subscribes to notifications from this subject.
     * The handler is immediately notified with the current value.
     *
     * @param {function} nextHandler
     *  A handler for the notification.
     *
     * @returns {Subscription}
     *      A subscription that may be used to unsubscribe from the notifications.
     */
    subscribe(nextHandler) {
        const subscription = super.subscribe(nextHandler);
        nextHandler(this._value);
        return subscription;
    }
}
