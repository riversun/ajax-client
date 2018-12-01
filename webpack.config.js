const path = require("path");

module.exports = {
    mode: 'development',
    devServer: {
        open: true,
        openPage: "index.html",
        contentBase: path.join(__dirname, 'public'),
        watchContentBase: true,
        port: 8080,
    },
    entry: {ajaxclient: './src/index.js'},
    output: {
        path: path.join(__dirname, "dist"),
        publicPath: "/",
        filename: '[name].js',
        library: ["org", "riversun"],
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                "@babel/preset-env",
                                {
                                    "useBuiltIns": "usage",
                                    "targets": "> 0.25%, not dead"
                                }
                            ]
                        ]
                    }
                }
            }
        ]
    },
    devtool: 'inline-source-map'

};
