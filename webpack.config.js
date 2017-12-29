
var path = require('path');
var webpack = require('webpack');

module.exports = function (env) {

    // Default Object
    let config = {

        resolve: {

            alias: {
                declarative: path.resolve(__dirname, 'source/'),
            },

            modules: [
                path.resolve(__dirname, "node_modules"),
                "node_modules"
            ],
        },

        stats: {
            colors: true
        },

        module: {
            loaders: [
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    query: {
                        presets: ['env']
                    }
                }
            ]
        },

        devtool: 'source-map'
    }

    // Allow the user to pack demos if they choose to (usually used with the
    // webpack development server that is provided)
    if (env && env.demoName) {

        // Configure the input and output of this current demo
        let currentDemo = path.resolve(__dirname, "examples", env.demoName)
        config.entry = {
            app: path.resolve(currentDemo, "scripts.js"),
        }
        config.output = {
            path: currentDemo,
            filename: "bundle.js",
        }
        config.devServer = {
            contentBase: currentDemo,
        }

    // Otherwise we are building the bundle directly
    } else {

        config.entry = './source/main.js'
        config.output = {
            path: path.resolve(__dirname),
            filename: 'svg.declarative.js'
        }
    }

    return config
}
