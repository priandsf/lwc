import { LightningElement, buildCustomElementConstructor } from 'lwc';

export default class Body extends LightningElement {

}

customElements.define("app-body", buildCustomElementConstructor(Body));
