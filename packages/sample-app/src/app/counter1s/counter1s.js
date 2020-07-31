import { LightningElement } from 'lwc';

export default class Counter extends LightningElement {

    counter = 0;

    addOne() {
        this.counter++;
    }
}
