const path = require('path');
const webpack = require('webpack');

module.exports = function override(config, env) {
    // Alias configuration
    config.resolve.alias = {
        ...config.resolve.alias,
        'crypto': path.resolve(__dirname, '../backend/node_modules/crypto-browserify'),
        'stream': path.resolve(__dirname, '../backend/node_modules/stream-browserify'),
        'buffer': path.resolve(__dirname, '../backend/node_modules/buffer'),
        'util': path.resolve(__dirname, '../backend/node_modules/util')
    };

    // Providing process polyfill
    config.plugins.push(new webpack.ProvidePlugin({
        process: 'process/browser',
    }));

    return config;
};