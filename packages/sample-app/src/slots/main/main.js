import { LightningElement } from 'lwc';

export default class Main extends LightningElement {

    // Using Light or Shadow has no impact on the container
    //static USE_LIGHTDOM = true;

}

customElements.define("app-body", Main.CustomElementConstructor);
