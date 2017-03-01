// webpack.config.dev.js
var path = require('path')
var src = path.join(__dirname, '../src') + '/';
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    devtool: 'eval',
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
        new webpack.NoErrorsPlugin(),
        new CopyWebpackPlugin([ { from: path.resolve(__dirname, 'src/js/pages/javatari') } ])
    ],
    module: {
        loaders: require('./loaders')
            .concat([
                {
                    test: /\.scss$/,
                    loaders: ['style-loader', 'css-loader', 'sass-loader']
                }
            ]),
    }
};
