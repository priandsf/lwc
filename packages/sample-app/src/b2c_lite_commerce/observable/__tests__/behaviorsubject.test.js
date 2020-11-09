import BehaviorSubject from '../behaviorsubject';

describe('b2c_lite_commerce/observable: BehaviorSubject', () => {
    describe('Subject value', () => {
        it('Carry a value', () => {
            const sub = new BehaviorSubject('val');

            expect(sub.value).toBe('val');
            expect(sub.getValue()).toBe('val');

            sub.next('val2');
            expect(sub.value).toBe('val2');
            expect(sub.getValue()).toBe('val2');
        });
    });

    describe('the subscribe() method', () => {
        it('The subscribe function handles late binding', () => {
            const sub = new BehaviorSubject();

            const handler1 = jest.fn();
            sub.subscribe(handler1)
            expect(handler1).toHaveBeenCalledTimes(1);

            sub.next('val2');

            const handler2 = jest.fn();
            sub.subscribe(handler2);

            expect(handler1).toHaveBeenCalledTimes(2);
            expect(handler2).toHaveBeenCalledTimes(1);
        });
    });
});
