import { LightningElement } from 'lwc';

export default class Main extends LightningElement {

    static USE_LIGHTDOM = true;

}

customElements.define("app-body", Main.CustomElementConstructor);
