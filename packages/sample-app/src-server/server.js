/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
// -- Libs -----------------------------------------------------------------------------
const express = require('express');

const compression = require('compression')

// -- Config ----------------------------------------------------------------------------
const log = process.stdout.write.bind(process.stdout);
const port = process.env.PORT || 3005;
const app = express();

const production = false;

// Production configuration
if(production) {
    app.use(compression())
}


// -- Middlewares -----------------------------------------------------------------------
app.use(express.static('public',{redirect:false}));


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
