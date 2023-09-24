const { override, addWebpackAlias } = require('customize-cra');
const path = require('path');
const webpack = require('webpack');

module.exports = function override(config, env) {
    addWebpackAlias({
        'crypto': path.resolve(__dirname, 'node_modules/crypto-browserify'),
        'stream': path.resolve(__dirname, 'node_modules/stream-browserify'),
        'buffer': path.resolve(__dirname, 'node_modules/buffer'),
        'util': path.resolve(__dirname, 'node_modules/util')
    })
    config.plugins.push(new webpack.ProvidePlugin({
        process: 'process/browser',
    }));

    config.resolve.fallback = {
        ...config.resolve.fallback, // This ensures you don't accidentally override any existing fallbacks
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
    };

    return config;
};