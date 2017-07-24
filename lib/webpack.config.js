'use strict';

const path = require('path');
const oryx = require('@spryker/oryx');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

function getConfiguration(settings) {
    let devtool = 'source-map';
    let postCssPlugins = [];

    if (settings.options.isProduction) {
        devtool = false;

        postCssPlugins = [
            autoprefixer({
                browsers: ['last 4 versions']
            })
        ];
    }

    let config = {
        context: settings.paths.rootDir,
        stats: settings.options.isVerbose ? 'verbose' : 'errors-only',
        devtool,

        watch: settings.options.isWatching,
        watchOptions: {
            aggregateTimeout: 300,
            poll: 500,
            ignored: /(node_modules)/
        },

        entry: oryx.find(settings.entry),

        output: {
            path: settings.paths.publicDir,
            filename: './js/[name].js',
            publicPath: '/assets/'
        },

        resolve: {
            modules: oryx.find(settings.resolveModules, [
                settings.paths.sourcePath
            ]),
            extensions: ['.ts', '.js', '.json', '.css', '.scss'],
            alias: {
                'App': `src/Spryker/Zed/GuiComponentCollection/Presentation/App`,
                'Component': `src/Spryker/Zed/GuiComponentCollection/Presentation/Component`
            }
        },

        module: {
            rules: [{
                test: /\.ts$/,
                loader: 'awesome-typescript-loader',
                options: {
                    configFileName: path.resolve(__dirname, '../tsconfig.json'),
                    baseUrl: settings.paths.rootDir
                },
            }, {
                test: /\.s?css$/i,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [{
                        loader: 'css-loader',
                        query: {
                            sourceMap: !settings.options.isProduction
                        }
                    }, {
                        loader: 'sass-loader',
                        query: {
                            sourceMap: true
                        }
                    }]
                })
            }, {
                test: /\.(ttf|woff2?|eot|svg|otf)\??(\d*\w*=?\.?)+$/i,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '/fonts/[name].[ext]',
                        publicPath: settings.paths.publicPath
                    }
                }]
            }, {
                test: /\.(jpe?g|png|gif|svg)\??(\d*\w*=?\.?)+$/i,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '/img/[name].[ext]',
                        publicPath: settings.paths.publicPath
                    }
                }]
            }]
        },

        plugins: [
            new webpack.LoaderOptionsPlugin({
                options: {
                    context: settings.paths.rootDir,
                    postcss: postCssPlugins,
                }
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'app'
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'manifest'
            }),
            new ExtractTextPlugin({
                filename: 'css/[name].css',
                allChunks: true
            })
        ]
    };

    if (settings.options.isProduction) {
        config.plugins = [
            ...config.plugins,
            new webpack.optimize.UglifyJsPlugin({
                output: {
                    comments: false,
                    source_map: true
                },
                sourceMap: true,
                mangle: false,
                compress: {
                    warnings: false,
                    dead_code: true
                }
            })
        ];
    }

    return config;
}

module.exports = getConfiguration;
