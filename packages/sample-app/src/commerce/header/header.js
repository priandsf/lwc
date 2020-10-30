import { LightningElement } from 'lwc'
import { hasQueryParameter } from '../util/url';

export default class Header extends LightningElement {

    get ssr() {
        return hasQueryParameter('ssr');
    }
}
