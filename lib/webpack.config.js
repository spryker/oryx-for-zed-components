'use strict';

const path = require('path');
const oryx = require('@spryker/oryx');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

function getConfiguration(settings) {
    const baseCssRegex = /Spryker\/\S+\/Style\/((Base\/\S+)|base)\.s?css$/;
    const baseCss = new ExtractTextPlugin({
        filename: 'css/zed-app.base.css'
    });

    const utilCssRegex = /Spryker\/\S+\/Style\/((Util\/\S+)|util)\.s?css$/;
    const utilCss = new ExtractTextPlugin({
        filename: 'css/zed-app.util.css'
    });

    const css = new ExtractTextPlugin({
        filename: 'css/zed-app.[name].css',
        allChunks: true
    });

    const cssExtractSettings = {
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
    };

    let devtool = 'inline-source-map';
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
            filename: './js/zed-app.[name].js',
            publicPath: '/assets/',
            jsonpFunction: 'webpackJsonp_ZedApp'
        },

        resolve: {
            modules: oryx.find(settings.resolveModules, [
                'node_modules'
            ]),
            extensions: ['.ts', '.js', '.json', '.css', '.scss'],
            alias: {
                'Spryker': 'src/Spryker/Zed/GuiComponentCollection/Presentation/App'
            }
        },

        module: {
            rules: [{
                enforce: 'pre',
                test: /\.ts$/,
                loader: 'import-glob'
            }, {
                enforce: 'pre',
                test: /\.s?css$/,
                loader: 'import-glob'
            }, {
                test: /\.ts$/,
                loader: 'awesome-typescript-loader',
                options: {
                    configFileName: path.resolve(__dirname, '../tsconfig.json'),
                    baseUrl: settings.paths.rootDir
                },
            }, {
                test: baseCssRegex,
                loader: baseCss.extract(cssExtractSettings)
            }, {
                test: utilCssRegex,
                loader: utilCss.extract(cssExtractSettings)
            }, {
                test: /\.s?css/i,
                exclude: [
                    baseCssRegex,
                    utilCssRegex
                ],
                loader: css.extract(cssExtractSettings)
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
                    postcss: postCssPlugins
                }
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'components'
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'manifest'
            }),
            baseCss,
            utilCss,
            css
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
