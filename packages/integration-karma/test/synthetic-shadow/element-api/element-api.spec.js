import { createElement } from 'lwc';

import Container from 'x/container';

/**
 <div>
     <x-container>
         <p>ctx first text</p>
         <div>
             <x-slot-container>
                 <p>slot-container text</p>
                 <x-with-slot>
                     <p>with-slot text</p>
                     <slot>
                         <div class="slotted">
                            <p>slotted text</p>
                        </div>
                     </slot>
                 </x-with-slot>
             </x-slot-container>
             <div class="manual-ctx">
                 <x-manually-inserted>
                     <p>slot-container text</p>
                     <x-with-slot>
                         <p>with-slot text</p>
                         <slot>
                             <div class="slotted">
                                <p>slotted text</p>
                             </div>
                         </slot>
                     </x-with-slot>
                 </x-manually-inserted>
             </div>
         </div>
         <p>ctx last text</p>
     </x-container>
 </div>
 */

describe('synthetic shadow', () => {
    const elm = createElement('x-container', { is: Container });

    const elementOutsideLWC = document.createElement('div');
    elementOutsideLWC.appendChild(elm);

    document.body.appendChild(elementOutsideLWC);

    const rootLwcElement = elm;
    const lwcElementInsideShadow = elm;
    const divManuallyApendedToShadow = elm.shadowRoot.querySelector('div.manual-ctx');
    const cmpShadow = elm.shadowRoot.querySelector('x-slot-container').shadowRoot;
    const slottedComponent = cmpShadow.querySelector('x-with-slot');
    const slottedNode = cmpShadow.querySelector('.slotted');

    describe('Element.prototype API', () => {
        it('should keep behavior for innerHTML', () => {
            expect(elementOutsideLWC.innerHTML.length).toBe(455);
            expect(rootLwcElement.innerHTML.length).toBe(0);
            expect(lwcElementInsideShadow.innerHTML.length).toBe(0);

            expect(divManuallyApendedToShadow.innerHTML.length).toBe(176); // <x-manually-inserted><p>slot-container text</p><x-with-slot><p>with

            expect(cmpShadow.innerHTML.length).toBe(99);

            expect(slottedComponent.innerHTML.length).toBe(46);
            expect(slottedNode.innerHTML.length).toBe(19);
        });

        it('should keep behavior for outerHTML', () => {
            expect(elementOutsideLWC.outerHTML.length).toBe(466);
            expect(rootLwcElement.outerHTML.length).toBe(27);
            expect(lwcElementInsideShadow.outerHTML.length).toBe(27);

            expect(divManuallyApendedToShadow.outerHTML.length).toBe(206); // <div class="manual-ctx"><x-manually-inserted><p>slot-container text</p><x-with-slot><p>wi ....

            expect(cmpShadow.outerHTML).toBe(undefined);

            expect(slottedComponent.outerHTML.length).toBe(73);
            expect(slottedNode.outerHTML.length).toBe(46);
        });

        it('should keep behavior for children', () => {
            expect(elementOutsideLWC.children.length).toBe(1);
            expect(rootLwcElement.children.length).toBe(0);
            expect(lwcElementInsideShadow.children.length).toBe(0);

            expect(divManuallyApendedToShadow.children.length).toBe(1);

            expect(cmpShadow.children.length).toBe(2);

            expect(slottedComponent.children.length).toBe(1);
            expect(slottedNode.children.length).toBe(1);
        });

        it('should keep behavior for firstElementChild', () => {
            expect(elementOutsideLWC.firstElementChild.tagName).toBe('X-CONTAINER');
            expect(rootLwcElement.firstElementChild).toBe(null);
            expect(lwcElementInsideShadow.firstElementChild).toBe(null);

            expect(divManuallyApendedToShadow.firstElementChild.tagName).toBe(
                'X-MANUALLY-INSERTED'
            );

            expect(cmpShadow.firstElementChild.tagName).toBe('P');

            expect(slottedComponent.firstElementChild.tagName).toBe('DIV');
            expect(slottedNode.firstElementChild.tagName).toBe('P');
        });

        it('should keep behavior for lastElementChild', () => {
            expect(elementOutsideLWC.lastElementChild.tagName).toBe('X-CONTAINER');
            expect(rootLwcElement.lastElementChild).toBe(null);
            expect(lwcElementInsideShadow.lastElementChild).toBe(null);

            expect(divManuallyApendedToShadow.lastElementChild.tagName).toBe('X-MANUALLY-INSERTED');

            expect(cmpShadow.lastElementChild.tagName).toBe('X-WITH-SLOT');

            expect(slottedComponent.lastElementChild.tagName).toBe('DIV');
            expect(slottedNode.lastElementChild.tagName).toBe('P');
        });

        it('should keep behavior for querySelector', () => {
            // from outside, it can pierce through multiple shadows
            expect(elementOutsideLWC.querySelector('p').innerText).toBe('ctx first text');
            expect(elementOutsideLWC.querySelector('p').innerText).toBe('ctx first text');

            expect(rootLwcElement.lastElementChild).toBe(null);
            expect(lwcElementInsideShadow.lastElementChild).toBe(null);

            expect(divManuallyApendedToShadow.lastElementChild.tagName).toBe('X-MANUALLY-INSERTED');

            expect(cmpShadow.lastElementChild.tagName).toBe('X-WITH-SLOT');

            expect(slottedComponent.lastElementChild.tagName).toBe('DIV');
            expect(slottedNode.lastElementChild.tagName).toBe('P');
        });
    });
});
