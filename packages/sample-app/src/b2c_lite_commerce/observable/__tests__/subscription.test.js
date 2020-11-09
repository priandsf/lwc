import Subscription from '../subscription';

describe('b2b_buyer_cart/observable: Subscription', () => {
    describe('the subscribe() method', () => {
        it('executes the unsubscription handler', () => {
            const unsubscribeHandler = jest.fn();
            const sub = new Subscription(unsubscribeHandler);

            sub.unsubscribe();

            expect(unsubscribeHandler).toHaveBeenCalled();
        });

        it('executes the unsubscription handler only once when invoked multiple times', () => {
            const unsubscribeHandler = jest.fn();
            const sub = new Subscription(unsubscribeHandler);

            sub.unsubscribe();
            sub.unsubscribe();

            expect(unsubscribeHandler).toHaveBeenCalledTimes(1);
        });
    });
});
