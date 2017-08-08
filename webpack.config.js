const path = require('path');
const fs = require('fs');
const WatchIgnorePlugin = require('watch-ignore-webpack-plugin');
const NodemonPlugin = require('nodemon-webpack-plugin');

let nodeModules = {};
fs.readdirSync('node_modules')
    .filter(module => ['.bin'].indexOf(module) === -1)
.forEach(module => nodeModules[module] = 'commonjs ' + module);

module.exports = {
    entry: './src/index.ts',
    target: 'node',
    node: {
        __dirname: true
    },
    output: {
        filename: 'target/authentication-provider-backend.js'
    },
    resolve: {
        extensions: [
            ".webpack.js", ".web.js", ".ts", ".tsx", ".js"
        ]
    },
    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader'
            }
        ]
    },
    externals: nodeModules,
    plugins: [
        new NodemonPlugin()
    ]
};