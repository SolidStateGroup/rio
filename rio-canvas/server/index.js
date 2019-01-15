const express = require('express');
const exphbs = require('express-handlebars');
const spm = require('./middleware/single-page-middleware');
const webpackMiddleware = require('./middleware/webpack-middleware');
const isDev = process.env.NODE_ENV !== 'production';
const app = express();

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
        title: 'rio-canvas',
        layout: false
    });
});

app.listen(3000, function () {
    console.log('express-handlebars example server listening on: 3000');
});
