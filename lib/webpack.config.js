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

    const sprykerNamespace = oryx.find(settings.sprykerNamespace, []);
    const projectNamespace = oryx.find(settings.projectNamespace, []);
    let isExtendedInProject = false;

    const namespaces = {
        Spryker: sprykerNamespace[0]
    }

    const tsPaths = {
        '*': ['*', namespaces.Spryker + '/*'],
        'Spryker/*': [namespaces.Spryker + '/*']
    };

    if (projectNamespace.length > 0) {
        namespaces.Project = projectNamespace[0];
        tsPaths['Project/*'] = [namespaces.Project + '/*'];
        isExtendedInProject = true;
    }

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

        entry: path.join(namespaces.Spryker, './main.ts'),

        output: {
            path: settings.paths.publicDir,
            filename: './js/zed-app.[name].js',
            publicPath: '/assets/',
            jsonpFunction: 'webpackJsonp_ZedApp'
        },

        resolve: {
            extensions: ['.ts', '.js', '.json', '.css', '.scss'],
            alias: namespaces
        },

        module: {
            rules: [{
                test: /\.ts$/,
                loader: 'ts-loader',
                options: {
                    configFileName: path.join(__dirname, '../tsconfig.json'),
                    compilerOptions: {
                        baseUrl: settings.paths.rootDir,
                        paths: tsPaths
                    }
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
                name: 'main'
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'manifest'
            }),
            new webpack.DefinePlugin({
                IS_EXTENDED_IN_PROJECT: isExtendedInProject
            }),
            new webpack.ContextReplacementPlugin(/^Spryker/, (context) => {
                Object.assign(context, {
                    context: namespaces.Spryker,
                    request: context.request.replace(/^Spryker/, '.')
                });
            }),
            baseCss,
            utilCss,
            css
        ]
    };

    if (isExtendedInProject) {
        config.plugins = [
            ...config.plugins,
            new webpack.ContextReplacementPlugin(/^Project/, (context) => {
                Object.assign(context, {
                    context: namespaces.Project,
                    request: context.request.replace(/^Project/, '.')
                });
            })
        ];
    }

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
