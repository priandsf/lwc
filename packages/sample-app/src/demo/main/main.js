import { LightningElement } from 'lwc';
import { hasQueryParameter } from '../../commerce/util/url';

export default class Main extends LightningElement {

    rows = [1,2,3,4,5,6]
    cols = [1,2,3,4]

    get ssr() {
        return hasQueryParameter('ssr');
    }

    get shadow() {
        return hasQueryParameter('shadow');
    }

    qs(ssr,shadow) {
        let q = ''
        if(ssr) q+= "ssr"
        if(shadow) q+= (q ? '&' : '') + "shadow";
        return '/demo' + (q ? ('?'+q) : '');
    }
    get SSR() {
        return this.qs(true,this.shadow);
    }
    get NOSSR() {
        return this.qs(false,this.shadow);
    }
    get SHADOW() {
        return this.qs(this.ssr,true);
    }
    get NOSHADOW() {
        return this.qs(this.ssr,false);
    }

}
