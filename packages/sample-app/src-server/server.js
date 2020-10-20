/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
// -- Libs -----------------------------------------------------------------------------
const express = require('express');
const fs = require('fs');
const path = require('path');

const compression = require('compression')
const {renderSsr} = require('./render-ssr')

// -- Config ----------------------------------------------------------------------------
const log = process.stdout.write.bind(process.stdout);
const port = process.env.PORT || 3005;
const app = express();

const production = false;

// Production configuration
if(production) {
    app.use(compression())
}

function staticPath(...args) {
    return path.join(__dirname+"/..", 'public', 'static', ...args);
}

// -- Middlewares -----------------------------------------------------------------------
app.use('/static', express.static(staticPath()));

// SSR
// https://salesforce.quip.com/UIlHA82pHsH0
app.get('/*', (req, res) => {
    if (req.query.ssr !== undefined) {
        const context = {
            baseUrl: `http://localhost:${port}`
        };
        renderSsr({
            module: '../dist/lwc-components-server.js',
            exportName: 'Main',
            tagName: 'app-body',
            context
        }).then( ({html,store}) => {
            //console.log(`${fragment}`)
            res.send(
                renderTemplate({
                    title: 'SSR for Commerce',
                    storeData: store,
                    scripts: ['static/js/declarative-shadow-poorlyfill.js','static/js/lwc-components.js'],
                    fragment: html,
                }),
            );
        });
    } else {
        res.send(
            renderTemplate({
                title: 'Pure Client',
                scripts: ['static/js/lwc-components.js'],
            }),
        );
    }
});


// -- Server Start -----------------------------------------------------------------------
module.exports.start = () => {
    return new Promise((resolve) => {
        const server = app.listen(port, () => {
            log(`Server ready\n`);
            log(`  http://localhost:${port}\n`);
            resolve(server);
        });
    });
};


//function htmlTemplate({ title = '', fragment = '', scripts = [] }) {
    function renderTemplate(args) {
        return `
            <!DOCTYPE html>
            <html lang="en" data-framework="lwc">
            <head>
                <meta charset="UTF-8">
                <title>${args.title}</title>
            
                <style>
                    main > .container {
                        padding: 60px 15px 0;
                    }
                    html * {
                        font-family: verdana,arial,sans-serif;
                    }
                </style>
            </head>
            <body>
                ${
                    args.fragment ?  `${args.fragment}` : `<app-body></app-body>`
                }
                ${args.scripts.map((script) => `<script src="${script}"></script>`)}    
            </body>
        
            </html>    
        `
    }

    // <body>
    // ${args.storeData ? `<script>window['__B2C_INITIAL_STATE__']=${JSON.stringify(args.storeData,null,'  ')}</script>` : ''}
    // ${
    //     args.fragment ?  `${args.fragment}` : `<app-main></app-main>`
    // }
    // ${args.scripts.map((script) => `<script src="${script}"></script>`)}    
    // </body>

