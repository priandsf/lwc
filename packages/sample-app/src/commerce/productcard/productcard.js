import { LightningElement, api } from 'lwc'

export default class ProductCard extends LightningElement {

    @api product;

    get productPage() {
        return this.product && this.product.id ? "product?pid="+encodeURIComponent(this.product.id) : "";
    }

    infoClick() {
        const json = JSON.stringify(this.product,null,'  ');
        alert(json);
    }
}
