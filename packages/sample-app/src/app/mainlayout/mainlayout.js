import { LightningElement, buildCustomElementConstructor } from 'lwc';
import { toggleParam, isParam, resetParams } from '../../util'

export default class MainLayout extends LightningElement {

    static USE_LIGHTDOM = true;

    showLightContainer = isParam('light-containers')
    showShadowContainer = isParam('shadow-containers')
    showLightCounter = isParam('light-counters')
    showShadowCounter = isParam('shadow-counters')

    get showLL() {
        return this.showLightContainer && this.showLightCounter;
    }
    get showLS() {
        return this.showLightContainer && this.showShadowCounter;
    }
    get showSL() {
        return this.showShadowContainer && this.showLightCounter;
    }
    get showSS() {
        return this.showShadowContainer && this.showShadowCounter;
    }

    toggleReset() {
        resetParams();
    }
    toggleLightContainers() {
        toggleParam('light-containers');
    }
    toggleShadowContainers() {
        toggleParam('shadow-containers');
    }
    toggleLightCounters() {
        toggleParam('light-counters');
    }
    toggleShadowCounters() {
        toggleParam('shadow-counters');
    }
    toggleSlots() {
        toggleParam('slots');
    }
    toggleNoSlots() {
        toggleParam('no-slots');
    }
}

//customElements.define("app-body", buildCustomElementConstructor(MainLayout));
customElements.define("app-body", MainLayout.CustomElementConstructor);
