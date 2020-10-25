import { LightningElement, api } from 'lwc';

export default class Block extends LightningElement {

    @api row;
    @api col;

    get title() {
        return `Block ${this.row}-${this.col}`;
    }

    infoClick() {
        const json = {
            row: this.row,
            col: this.col
        }
        alert(JSON.stringify(json,null,'  '));
    }
}
