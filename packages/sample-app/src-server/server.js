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


// -- Services --------------------------------------------------------------------------
const {getCategories,getProductsByCategory} = require('./services/products')

app.get('/api/categories', (req, res) => {
    const categories = getCategories();
    res.setHeader('Content-Type', 'application/json');
    res.send(categories);
});

app.get('/api/products', (req, res) => {
    const cat = req.query['category'];
    const products = getProductsByCategory(cat);
    res.setHeader('Content-Type', 'application/json');
    res.send(products);
});


// SSR
// https://salesforce.quip.com/UIlHA82pHsH0
app.get('/home', (req, res) => {
    renderRoute(req,res,'commerce-home')
});
app.get('/*', (req, res) => {
    renderRoute(req,res,'demo-main')
});

function initialize(server) {
    server.get('/api/sample-product', function(req, res) {
        let pid = req.query['pid'];
        let product = store.products[pid];
        res.setHeader('Content-Type', 'application/json');
        res.send({ body: product });
    });
}

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


function renderRoute(req, res, tagName) {
    if (req.query.ssr !== undefined) {
        const context = {
            baseUrl: `http://localhost:${port}`
        };
        renderSsr({
            req,
            module: '../dist/lwc-components-server.js',
            exportName: 'Main',
            tagName,
            context
        }).then( ({html,styles,store}) => {
            //console.log(`${fragment}`)
            res.send(
                renderTemplate({
                    title: 'SSR for Commerce',
                    storeData: store,
                    scripts: ['static/js/declarative-shadow-poorlyfill.js','static/js/lwc-components.js'],
                    tagName,
                    styles,
                    fragment: html,
                }),
            );
        });
    } else {
        res.send(
            renderTemplate({
                title: 'Pure Client',
                scripts: ['static/js/lwc-components.js'],
                tagName,
            }),
        );
    }
}

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
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" crossorigin="anonymous">
            <link rel="stylesheet" href="/static/css/global.css">
            ${args.styles ? args.styles.map((style) => `<style type="text/css">${style}</style>`).join('\n') : ''}    
        </head>
        <body>
            ${args.storeData ? `<script>window['__B2C_INITIAL_STATE__']=${JSON.stringify(args.storeData)}</script>` : ''}
            ${
                args.fragment ?  `${args.fragment}` : `<${args.tagName}></${args.tagName}>`
            }
            ${args.scripts && args.scripts.map((script) => `<script src="${script}"></script>`).join('\n')}    
        </body>
    
        </html>    
    `
}

