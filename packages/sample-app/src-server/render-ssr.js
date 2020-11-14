const fetch = require('node-fetch');
const { renderComponent } = require('@lwc/engine-server');
const { performance } = require('perf_hooks');

const SSR = '__B2C_SSR__'
const SSRCONTEXT= '__B2C_SSRCONTEXT__'

// Globally patch fetch on the SSR environment to make it available to the code
if (!global.fetch) {
    global.fetch = fetch;
}
global[SSR] = true;

function initContext(ssrContext) {
    global[SSRCONTEXT] = ssrContext;
}

function clearContext() {
    delete global[SSRCONTEXT];
}

const MAX_ITERATIONS = 8;

//
// This function doesn't need to run in a VM to isolate the globals
// As the rendering is fully synchronous, the global is set before running the rendering, and removed once some
// The same context can be reused in multiple iterations, the store can keep its data between renderings
//
async function renderSsr({
    req,
    module,
    exportName,
    tagName,
    synth,
    context,
}) {
    let props = {};

    // Measure the rendering time
    // Note that all the services are using a timeout of 100ms
    // The services are executed in parallel, so the total rendering time should be ~100+t
    const startTime = performance.now();

    // This context is made available locally in a global (__SSRCONTEXT__)
    const ssrContext = {
        query: req.query,
        baseUrl: 'http://localhost:3005',
        loading: [],
        states: {}
    }
    for(let i=0; i<MAX_ITERATIONS; i++) {
        console.log(`SSR Iteration #${i}`)
        initContext(ssrContext);
        try {
            const ctor = exportName ? require(module)[exportName] : require(module);
            if (ctor.getServerInitialProps) {
                props = await ctor.getServerInitialProps(context);
            }

            const r = renderComponent(tagName, ctor, props, {syntheticShadow:synth, renderStruct: true})
            if(ssrContext.loading.length==0) {
                const result = {
                    html: r.html,
                    styles: r.styles,
                    store: ssrContext.states
                }
                const endTime = performance.now();
                console.log(`SSR rendering completed, iteration #${i}, time=${Math.floor(endTime-startTime)}ms`)
                return result;
            }
        } finally {
            clearContext();
        }
        const wait = Promise.all(ssrContext.loading)
        await wait;
        ssrContext.loading = [];
    }

    return window;
}

module.exports = {
    renderSsr
}
