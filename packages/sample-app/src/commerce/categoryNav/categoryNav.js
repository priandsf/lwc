import { LightningElement } from 'lwc'
import { categoriesStore } from '../api/productApis'

export default class LeftNav extends LightningElement {

    categories;

    connectedCallback() {
        this.subscription = categoriesStore.subscribe((categories) => { 
            this.categories = categories;
        })
    }
    disconnectedCallback() {
        this.subscription.unsubscribe();
    }    
}
