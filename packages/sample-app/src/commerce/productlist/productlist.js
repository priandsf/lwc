import { LightningElement } from 'lwc'
import { getQueryParameter } from '../util/url';
import { productsStore } from '../api/productApis'


export default class ProductList extends LightningElement {

    category;
    products;

    constructor() {
        super();
    }
    connectedCallback() {
        this.category = getQueryParameter("category");
        this.subscription = productsStore.subscribe(this.category,(products) => { 
            this.products = products;
        })
    }
    disconnectedCallback() {
        this.subscription.unsubscribe();
    }    

    get hasProducts() {
        return this.products.data && this.products.data.length>0;
    }
    get hasCategory() {
        return !!this.category;
    }
}
