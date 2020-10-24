import { LightningElement, api } from 'lwc'
import { composeUrl } from '../../util/url';

export default class LeftNav extends LightningElement {

    @api category;

    constructor () {
        super();
    }

    get link() {
        return composeUrl('/home',{category:this.category});
    }
}
