import {renderToString} from 'react-dom/server'
import express from 'express';
import exphbs from 'express-handlebars';
import spm from './middleware/single-page-middleware';
import webpackMiddleware from './middleware/webpack-middleware';
import DocumentTitle from 'react-document-title';
const isDev = process.env.NODE_ENV !== 'production';
const app = express();
const websocketClient = require('./websocket-client');
if (isDev) { //Serve files from src directory and use webpack-dev-server
    console.log('Enabled Webpack Hot Reloading');
    webpackMiddleware(app);

    app.set('views', 'src/');
    app.use(express.static('src'));
} else { //Serve files from build directory
    app.use(express.static('build'));
    app.set('views', 'build/');
}

app.use(spm);
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {

     res.render('index', {
        isDev: true,
        title: 'test',
        layout: false
    });
});

app.listen(3000, function () {
    console.log('express-handlebars example server listening on: 3000');
});
