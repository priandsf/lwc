import { LightningElement } from 'lwc'
import { getQueryParameter } from '../../util/url';
import { productsStore } from '../api/productApis'


export default class ProductList extends LightningElement {

    category;
    products;

    constructor() {
        super();
        this.category = getQueryParameter("category");
        this.onStateChangeBind = (products) => { 
            this.products = products;
        }
    }
    connectedCallback() {
        productsStore.subscribe(this.onStateChangeBind,this.category);
    }
    disconnectedCallback() {
        productsStore.unsubscribe(this.onStateChangeBind);
    }    

    get hasProducts() {
        return this.products.data && this.products.data.length>0;
    }
    get hasCategory() {
        return !!this.category;
    }
}
