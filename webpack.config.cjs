const packageJson = require('./package.json');
const version = packageJson.version;
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

module.exports = (env, argv) => {

    const conf = {
        mode: 'development',
        devServer: {
            port: 8080,
            host: argv.mode === 'production' ? `localhost` : `localhost`,
            allowedHosts: "all",
            static:
                [
                    {
                        directory: path.join(__dirname, `public`),
                        publicPath: "/",
                        serveIndex: false,
                        watch: true,
                    },
                ],
            open: {
                target: ['index.html', 'index_ajax2.html'],
            },
        },
        entry: {
            'ajax-client': ['./src/index.js'],
        },
        output: {
            path: path.join(__dirname, 'lib'),
            publicPath: '/',
            filename: argv.mode === 'production' ? `[name].js` : `[name].js`,  //`[name].min.js`
            library: {
                type: 'umd',
            },
            globalObject: 'this',
        },

        optimization: {
            minimizer: [new TerserPlugin({
                //extractComments: true,
                //cache: true,
                //parallel: true,
                //sourceMap: true,
                terserOptions: {
                    compress: {
                        drop_console: true,
                    },
                },
                extractComments: true,
            })],
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: [
                        {
                            loader: 'babel-loader',
                        }
                    ],
                },
            ],

        },
        resolve: {
            alias: {}
        },
        plugins: [
            // new webpack.BannerPlugin(`[name] v${version} Copyright (c) 2019-2020 https://github.com/riversun(riversun.org@gmail.com)`),
        ],

    };

    if (argv.mode !== 'production') {
        conf.devtool = 'inline-source-map';
    }

    return conf;

};
