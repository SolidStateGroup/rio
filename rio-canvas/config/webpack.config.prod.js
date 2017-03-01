// webpack.config.prod.js
// Watches + deploys files minified + cachebusted
var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const src = path.join(__dirname, '../src') + '/';

module.exports = {
    devtool: 'source-map',

    entry: [
        './src/main.js',
    ],


    output: {
        publicPath: '/',
        path: path.join(__dirname, '../build'),
        filename: '[name].[hash].js'
    },

    plugins: require('./plugins')
        .concat([

                //Clear out build folder
                new CleanWebpackPlugin(['build'], { root: path.join(__dirname, '../') }),

                //Ensure NODE_ENV is set to production
                new webpack.DefinePlugin({
                    'process.env': {
                        'NODE_ENV': JSON.stringify('production')
                    },
                    __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false'))
                }),

                //remove duplicate files
                new webpack.optimize.DedupePlugin(),

                //pull inline styles into cachebusted file
                new ExtractTextPlugin({ filename: "style.[hash].css", allChunks: true }),

                new webpack.LoaderOptionsPlugin({
                    minimize: true,
                    debug: false
                }),

                //Uglify
                new webpack.optimize.UglifyJsPlugin({
                    compress: {
                        warnings: false,
                        'screw_ie8': true
                    },
                    output: {
                        comments: false
                    },
                    sourceMap: false
                }),

            ]
            //for each page, produce a html file with base assets
                .concat(require('./pages').map(function (page) {
                    console.log(page);
                    return new HtmlWebpackPlugin({
                            filename: page + '.handlebars', //output
                            template: './src/' + page + '.handlebars', //template to use
                            "assets": { //add these script/link tags
                                "client": "[hash].js",
                            }
                        }
                    )
                }))
        ),

    module: {
        loaders: require('./loaders').concat([
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: 'css!sass' })
            }
        ])
    }
}
;