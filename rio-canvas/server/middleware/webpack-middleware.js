//Uses webpack dev + hot middleware
import webpack from 'webpack';
import config from '../../config/webpack.config.dev';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

const compiler = webpack(config);

module.exports = function (app) {
    const middleware = webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath,
        contentBase: 'src',
        stats: { colors: true },
    });
    app.use(middleware);

    app.use(webpackHotMiddleware(compiler, {
        log: console.log,
        path: '/__webpack_hmr',
        heartbeat: 10 * 1000
    }));
    return middleware;
};