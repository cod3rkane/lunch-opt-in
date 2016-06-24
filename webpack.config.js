var webpack = require('webpack');
var CleanPlugin = require('clean-webpack-plugin');
var I18nPlugin = require("i18n-webpack-plugin");
//var ExtractPlugin = require('extract-text-webpack-plugin');
var production = process.env.NODE_ENV === 'production';
var path = require('path');
var entryPath = path.resolve(__dirname, 'public/a');
var distUrl = '/dist/';
var distPath = path.resolve(__dirname, 'public' + distUrl);

var languages = {
    "en": null,
    "pt": require("./public/a/js/app/languages/pt.json")
};

var plugins = [
    new webpack.optimize.CommonsChunkPlugin({
        name: 'main', // Move dependencies to our main file
        children: true, // Look for common dependencies in all children,
        minChunks: 2, // How many times a dependency must come up before being extracted
    }),
    // Cleanup the builds/ folder before
    // compiling our final assets
    new CleanPlugin(distPath),
    //new ExtractPlugin('[name]-[hash].css', {allChunks: true}), // <=== where should content be piped
];

if (production) {
    plugins = plugins.concat([
        // This plugin looks for similar chunks and files
        // and merges them for better caching by the user
        new webpack.optimize.DedupePlugin(),

        // This plugins optimizes chunks and modules by
        // how much they are used in your app
        new webpack.optimize.OccurenceOrderPlugin(),

        // This plugin prevents Webpack from creating chunks
        // that would be too small to be worth loading separately
        new webpack.optimize.MinChunkSizePlugin({
            minChunkSize: 51200, // ~50kb
        }),

        // This plugin minifies all the Javascript code of the final bundle
        new webpack.optimize.UglifyJsPlugin({
            mangle: true,
            compress: {
                warnings: false, // Suppress uglification warnings
            },
        }),

        // This plugins defines various variables that we can set to false
        // in production to avoid code related to them from being compiled
        // in our final bundle
        new webpack.DefinePlugin({
            __SERVER__: !production,
            __DEVELOPMENT__: !production,
            __DEVTOOLS__: !production,
            'process.env': {
                BABEL_ENV: JSON.stringify(process.env.NODE_ENV),
                NODE_ENV: JSON.stringify("production"),
            },
        }),
    ]);
}

var config = Object.keys(languages).map(function(language) {
    return {
        name: language,
        debug: !production,
        devtool: production ? false : 'eval',
        entry: {
            home: entryPath + '/js/app/index',
        },
        output: {
            path: distPath,
            chunkFilename: '[name]' + (production ? '-[chunkhash]' : '') + '.js',
            filename: language + '-' + '[name]' + (production ? '-[chunkhash]' : '') + '.js',
            publicPath: distUrl,
        },
        plugins: plugins.concat([
            new I18nPlugin(
                languages[language]
            ),
        ]),
        module: {
            preLoaders: [
                //{
                //    test: /\.js/,
                //    loader: 'eslint',
                //}
            ],
            loaders: [
                {
                    test: /\.js/,
                    // Enable caching for improved performance during development
                    // It uses default OS directory by default. If you need something
                    // more custom, pass a path to it. I.e., babel?cacheDirectory=<path>
                    loaders: ['babel?cacheDirectory'],
                    // Parse only app files! Without this it will go through entire project.
                    // In addition to being slow, that will most likely result in an error.
                    include: entryPath
                },
                //{
                //    test: /\.js$/,
                //    loader: 'babel-loader',
                //    query: {
                //        presets: ['react'],
                //    }
                //},
                {
                    test: /\.scss/,
                    //loader: ExtractPlugin.extract('style', 'css!sass'),
                    //loaders: ['style', 'css', 'sass'],
                    loader: "style-loader!css-loader!sass-loader?outputStyle=expanded"
                },
                {
                    test: /\.html/,
                    loader: 'html',
                },
                {
                    // When you encounter images, compress them with image-webpack (wrapper around imagemin)
                    // and then inline them as data64 URLs
                    test: /\.(png|jpg|jpeg|svg|gif)$/,
                    loaders: ['url-loader?limit=3000', 'image-webpack'],
                },
            ]
        },
        resolve: {
            extensions: ['', '.js'],
            root: entryPath,
            alias: {
                'App': 'js/app',
            }
        }
    };
});

module.exports = config;
