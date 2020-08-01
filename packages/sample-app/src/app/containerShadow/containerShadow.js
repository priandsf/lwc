import { LightningElement } from 'lwc';
import { isParam } from '../../util'

export default class LayoutShadow extends LightningElement {

    showslots = isParam('slots')
    shownoslots = isParam('no-slots')
    showLightCounter = isParam('light-counters')
    showShadowCounter = isParam('shadow-counters')

}
