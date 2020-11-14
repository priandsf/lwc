/**
 * This script is a poor man way to rehydrate the server side render LWC component serialized using
 * the declarative shadow DOM format. 
 */

function rehydrate(root) {
    const declarativeShadowRoots = root.querySelectorAll('template[shadowroot]');
    
    for (const declarativeShadowRoot of declarativeShadowRoots) {
        const hostElement = declarativeShadowRoot.parentElement;
        const mode = declarativeShadowRoot.getAttribute('shadowroot');
        const shadowRoot = hostElement.attachShadow({ mode });
        
        shadowRoot.append(declarativeShadowRoot.content);
        declarativeShadowRoot.remove();

        rehydrate(shadowRoot);
    }
}

function supportsDeclarativeShadowDOM() {
    return HTMLTemplateElement.prototype.hasOwnProperty("shadowRoot");
}

if (!supportsDeclarativeShadowDOM()) {
    rehydrate(document.body);
}