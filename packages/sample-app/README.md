# LightDOM POC for LWC

This branch adds an option to LWC to use Light DOM instead of Shadow DOM. Everything happens at runtime and, the design of LWC to support synthetic-shadow-dom makes it possible.

A live demo is available here: [https://git.soma.salesforce.com/pages/priand/pages-lwc-lightdom](https://git.soma.salesforce.com/pages/priand/pages-lwc-lightdom)

## How does it work?
A component can be declared to use Light DOM at its class level, by setting up a class property:  

```js
export default class Layout extends LightningElement {

    static USE_LIGHTDOM = true;

```

It supports slots and scoped styles, when running within a LWC template. The demo application shows an hierarchy of intermingled components, some using the Shadow DOM and some the Light DOM.


## What still have to be done

- Change USE_LIGHTDOM to something better
  Choose a better name, more aligned with the rest of LWC. It might even be a Symbol, to be exported by the LWC engine. 

- `insertGlobalStyleSheet` inverted parameters.  
  This implementation needed the current element as a parameter. For convenience, it has been added last and optional so it does not break existing code. But ultimately, these parameters should be inversed.  

- The dom code looks for host the Shadow DOM (`DocumentFragment`) using a loop. This might be replaced by a `querySelector`.  

- Make it work with the synthetic DOM  
  It currently fails when the synthetic DOM is loaded. It need some deeper understand of the synthetic shadow to get it fixed. Moreover, the original get/setAttribute methods are only available in the synthetic shadow module while they should be used in core.  
  
- Server Side Rendering should handle this new mode (renderer.ts)  
  Note: the SSR code does not yet handle the synthetic shadow.
  
  
## Pending questions

- Should we authorize a component a component to inherit from another one, with a different DOM option?


