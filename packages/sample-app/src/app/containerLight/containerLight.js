import { LightningElement } from 'lwc';
import { isParam } from '../../util'

export default class LayoutLight extends LightningElement {

    static USE_LIGHTDOM = true;

    showslots = isParam('slots')
    shownoslots = isParam('no-slots')
    showLightCounter = isParam('light-counters')
    showShadowCounter = isParam('shadow-counters')

}
