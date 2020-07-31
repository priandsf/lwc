import { LightningElement } from 'lwc';

export default class Counter extends LightningElement {

    USE_LIGHTDOM() { return true; }

    counter = 0;

    addOne() {
        this.counter++;
    }
}
