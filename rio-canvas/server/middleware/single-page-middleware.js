module.exports = function(req, res, next) {

    const headers = req.headers;
    let rewriteTarget = '/index.html';

    if (req.method !== 'GET') {
        console.log(
            'Not rewriting',
            req.method,
            req.url,
            'because the method is not GET.'
        );
        req.url = rewriteTarget.split('/')[rewriteTarget.split('/').length-1];
        return next();
    } else if (!headers || typeof headers.accept !== 'string') {
        console.log(
            'Not rewriting',
            req.method,
            req.url,
            'because the client did not send an HTTP accept header.'
        );
        req.url = rewriteTarget.split('/')[rewriteTarget.split('/').length-1];
        return next();
    } else if (headers.accept.indexOf('application/json') === 0) {
        console.log(
            'Not rewriting',
            req.method,
            req.url,
            'because the client prefers JSON.'
        );
        req.url = rewriteTarget.split('/')[rewriteTarget.split('/').length-1];
        return next();
    } else if (headers.accept.indexOf('html') == -1) {
        console.log(
            'Not rewriting',
            req.method,
            req.url,
            'because the client does not accept HTML.'
        );
        req.url = '/' + req.url.split('/')[req.url.split('/').length-1];
        return next();
    };

    var parsedUrl = req.url;

    if (parsedUrl.indexOf('.') !== -1 && parsedUrl.indexOf('t/') == -1) {
        console.log(
            'Not rewriting',
            req.method,
            req.url,
            'because the path includes a dot (.) character.'
        );
        return next();
    }

    rewriteTarget = '/';
    req.url = rewriteTarget;
    next();
};