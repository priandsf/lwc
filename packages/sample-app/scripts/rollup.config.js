'use strict';

const replace = require('@rollup/plugin-replace');
const lwc = require('@lwc/rollup-plugin');
const { terser } = require('rollup-plugin-terser');
const commonjs = require('rollup-plugin-commonjs');
const syntheticShadow = require('./synthetic-shadow');

const env = process.env.NODE_ENV || 'development';


const lwcServerResolver = {
    resolveId(id) {
        if (id === 'lwc') {
            return {
                id: '@lwc/engine-server',
                external: true,
            }
        }
    }
}
const isProduction = env === 'production';

module.exports =  [{
    input: 'src/main.js',
    
    output: {
        format: 'esm',
        file: 'public/static/js/lwc-components.js'
    },

    plugins: [
        lwc(),
        replace({ 'process.env.NODE_ENV': JSON.stringify(env) }),
        isProduction && terser()
    ]
}, {
    input: 'src/main-synth.js',
    
    output: {
        format: 'esm',
        file: 'public/static/js/lwc-components-synth.js'
    },

    plugins: [
        //syntheticShadow(),
        lwc(),
        replace({ 'process.env.NODE_ENV': JSON.stringify(env) }),
        isProduction && terser()
    ]
}, {
    input: 'src/main-server.js',
    external: ['@lwc/engine-server'],
    
    output: {
        format: 'commonjs',
        file: 'dist/lwc-components-server.js'
    },

    plugins: [
        lwcServerResolver,
        lwc(),
        replace({ 'process.env.NODE_ENV': JSON.stringify(env) }),
        isProduction && terser()
    ]
}
]