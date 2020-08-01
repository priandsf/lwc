# Simple LightDOM for LWC

This demo is a POC shows the same application using slots and scopes, using different modes: native shadow dom, synthetic shadow and light dom.

To run the sample-app:  
```sh
cd packages/sample-app
yarn start
```

The sample-app checked-in code is configured to use the light dom. To switch to a different mode:

- Using native shadow DOM
  in template.html, comment `window.LWC_LIGHTDOM = true`
  in main.js, comment `import "@lwc/synthetic-shadow"`
- Using the synthetic shadow DOM
  in template.html, comment `window.LWC_LIGHTDOM = true`
  in main.js, uncomment `import "@lwc/synthetic-shadow"`
- Using the ligh DOM, without the synthetic shadow
  in template.html, uncomment `window.LWC_LIGHTDOM = true`
  in main.js, comment `import "@lwc/synthetic-shadow"`

Of course, there is probably some obstacle to deal with the light dom, but its shows that the extend of the changes to the LWC engine is small. Note that the use of light DOM is currently set globally, while it should be done at the component level.
