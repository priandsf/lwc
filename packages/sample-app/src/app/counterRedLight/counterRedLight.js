import { LightningElement } from 'lwc';

export default class Counter extends LightningElement {

    static USE_LIGHTDOM = true;

    counter = 0;

    addOne() {
        this.counter++;
    }
}
