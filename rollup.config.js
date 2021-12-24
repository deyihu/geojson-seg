// Rollup plugins

import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';
const path = require('path');

const sourceMap = process.env.NODE_ENV.trim() === 'prd';
const FILEMANE = pkg.name;

const banner = `/*!\n * ${pkg.name} v${pkg.version}\n  */`;

const plugins = [
    json(),
    nodeResolve(),
    commonjs(),
    babel({
        // exclude: ['node_modules/**']
    })
];

export default [
    {
        input: path.join(__dirname, './index.js'),
        plugins: plugins,
        // sourceMap: true,
        external: [],
        output:
        {
            'format': 'umd',
            'name': 'geojsonseg',
            'file': `dist/${FILEMANE}.js`,
            'sourcemap': sourceMap,
            'extend': true,
            'banner': banner,
            'globals': {
            }
        }
    },
    {
        input: path.join(__dirname, './index.js'),
        plugins: plugins.concat([terser()]),
        // sourceMap: true,
        external: [],
        output:
        {
            'format': 'umd',
            'name': 'geojsonseg',
            'file': `dist/${FILEMANE}.min.js`,
            'sourcemap': false,
            'extend': true,
            'banner': banner,
            'globals': {
            }
        }
    },
    {
        input: path.join(__dirname, './index.js'),
        plugins: plugins,
        external: [],
        output:
        {
            'format': 'es',
            // 'name': 'geojsonseg',
            'file': `dist/${FILEMANE}.es.js`,
            'sourcemap': false,
            'extend': true,
            'banner': banner,
            'globals': {
            }
        }
    }
];
