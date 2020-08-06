import { LightningElement } from 'lwc';
import { isParam } from '../../util'

// Test chaining prototype
class BaseLayoutLight extends LightningElement {

    static USE_LIGHTDOM = true;
}

export default class LayoutLight extends BaseLayoutLight {

    showslots = isParam('slots')
    shownoslots = isParam('no-slots')
    showLightCounter = isParam('light-counters')
    showShadowCounter = isParam('shadow-counters')

}
