var path = require('path')

module.exports = [
    {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader']
    },
    {
        test: /nesbox\/.+\..+/,
        loaders: [
            'file-loader?name=nesbox/[name].[ext]',
        ]
    },
    {
        test: /jsnes\/.+\..+/,
        loaders: [
            'file-loader?name=jsnes/[name].[ext]',
        ]
    },
    {
        test: /roms\/.+\..+/,
        loaders: [
            'file-loader?name=roms/[name].[ext]',
        ]
    },
    {
        test: /\.js?/,
        exclude: [/node_modules/, /jsnes\/.+\..+/, /nesbox\/.+\..+/],
        loaders: ['babel-loader']
    },
    {
        test: /\.html$/,
        loader: 'html-loader?attrs[]=source:src&attrs[]=img:src'
    },
    {
        test: /javatari\/.+\.(jpe?g|png|gif|svg|mp4|webm)$/i,
        loaders: [
            'file-loader?name=javatari/[name].[ext]',
            'image-webpack-loader'
        ]
    },
    {
        test: /^((?!javatari\/).)*\.(jpe?g|png|gif|svg|mp4|webm)$/i,
        loaders: [
            'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
            'image-webpack-loader'
        ]
    }
];
