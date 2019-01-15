// webpack.config.dev.js
const path = require('path')
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    devtool: 'eval',
    mode: 'development',
    entry: [
        'webpack-hot-middleware/client',
        'react-hot-loader/patch',
        './src/main.js',
    ],
    output: {
        path: '/',
        publicPath: 'http://localhost:3000/build/',
        filename: '[name].js'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new CopyWebpackPlugin([ { from: path.resolve(__dirname, 'src/js/pages/javatari/*.*') } ])
    ],
    module: {
        rules: require('./loaders')
            .concat([
                {
                    test: /\.scss$/,
                    loaders: ['style-loader', 'css-loader', 'sass-loader']
                }
            ]),
    }
};
