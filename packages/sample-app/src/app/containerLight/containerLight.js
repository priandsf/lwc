import { LightningElement } from 'lwc';
import { isParam } from '../../util'

export default class Layout extends LightningElement {

    static USE_LIGHTDOM = true;

    showslots = isParam('slots')
    shownoslots = isParam('no-slots')
}
