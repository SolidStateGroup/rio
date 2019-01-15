// webpack.config.prod.js
// Watches + deploys files minified + cachebusted
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    devtool: 'source-map',
    mode: 'production',
    entry: [
        './src/main.js',
    ],
    optimization: { // chunk bundle into Libraries, App JS and dumb components
        minimizer: [
            new UglifyJSPlugin({
                cache: true,
                parallel: true,
                sourceMap: true, // set to true if you want JS source maps
                extractComments: true,
                uglifyOptions: {
                    compress: {
                        drop_console: true,
                    },
                },
            }),
        ],
    },
    output: {
        publicPath: '/',
        path: path.join(__dirname, '../build'),
        filename: '[name].[hash].js'
    },
    plugins: require('./plugins')
        .concat([

                //Clear out build folder
                new CleanWebpackPlugin(['build'], { root: path.join(__dirname, '../') }),

                new webpack.DefinePlugin({
                    __DEV__: false,
                }),

                //Reduce file size
                new webpack.optimize.OccurrenceOrderPlugin(),

                //pull inline styles into cachebusted file
                new ExtractTextPlugin({ filename: "style.[hash].css", allChunks: true }),
            ]
            //for each page, produce a html file with base assets
                .concat(require('./pages').map(function (page) {
                    console.log(page);
                    return new HtmlWebpackPlugin({
                            filename: page + '.handlebars', //output
                            template: './src/' + page + '.handlebars', //template to use
                            "assets": { //add these script/link tags
                                "client": "[hash].js",
                                'style': 'style.[hash].css',
                            }
                        }
                    )
                }))
        ),

    module: {
        rules: require('./loaders').concat([
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader!sass-loader' })
            }
        ])
    }
}
;