import { LightningElement } from 'lwc'
import { categoriesStore } from '../api/productApis'

export default class LeftNav extends LightningElement {

    categories;

    constructor () {
        super();
        this.onStateChangeBind = (categories) => { 
            this.categories = categories;
        }
    }

    connectedCallback() {
        categoriesStore.subscribe(this.onStateChangeBind);
    }
    disconnectedCallback() {
        categoriesStore.unsubscribe(this.onStateChangeBind);
    }    

}
