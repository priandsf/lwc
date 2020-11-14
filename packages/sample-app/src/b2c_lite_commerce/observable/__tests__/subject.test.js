import Subject from '../subject';

describe('b2c_lite_commerce/observable: Subject', () => {
    describe('the next() method', () => {
        it('invokes all subscribed handlers', () => {
            const handlers = [jest.fn(), jest.fn()];

            // Create teh Subject and subscribe to it.
            const sub = new Subject();
            handlers.forEach((handler) => sub.subscribe(handler));

            // Emit a value
            sub.next();

            // All handlers should have been called.
            handlers.forEach((handler) => {
                expect(handler).toHaveBeenCalledTimes(1);
            });
        });

        it('invokes a subscribed handler with the provided next value', () => {
            const handlers = [jest.fn(), jest.fn()];

            // Create teh Subject and subscribe to it.
            const sub = new Subject();
            handlers.forEach((handler) => sub.subscribe(handler));

            // Emit a value
            sub.next('Hola!');

            // All handlers should have been called.
            handlers.forEach((handler) => {
                expect(handler).toHaveBeenCalledWith('Hola!');
            });
        });
    });

    describe('the subscribe() method', () => {
        it('returns a subscription', () => {
            const sub = new Subject();
            const subscription = sub.subscribe(() => {});

            // The subscription should always expose an "unsubscribe" method, regardless of implementation.
            expect(subscription).toHaveProperty('unsubscribe');
        });
    });
});
