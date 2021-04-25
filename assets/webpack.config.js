const autoprefixer = require('autoprefixer')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const cssnano = require('cssnano')
const fiber = require('fibers')
const fs = require('fs')
const mime = require('mime')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

const IS_PRODUCTION = !!process.env.NODE_ENV && process.env.NODE_ENV === 'production'
const PUBLIC_PATH = (IS_PRODUCTION && 'https://hot.garb.ag/') || process.env.PUBLIC_PATH || '/'

module.exports = {
    mode: process.env.NODE_ENV || 'development',
    devtool: 'source-map',
    context: path.resolve('./src'),
    resolve: {
        enforceExtension: false,
        modules: [
            './node_modules',
            './src',
        ],
    },
    entry: {
        bundle: './index',
        Hyphenopoly: 'hyphenopoly/Hyphenopoly',
    },
    output: {
        path: path.resolve('./public'),
        publicPath: PUBLIC_PATH,
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.js$/i,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/env',
                            ],
                            plugins: [
                                ['@babel/proposal-decorators', {
                                    legacy: true,
                                }],
                                ['@babel/proposal-class-properties', {
                                    loose: true,
                                }],
                                '@babel/transform-regenerator',
                            ],
                        },
                    }
                ]
            },
            {
                test: /\.ts$/i,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/env',
                                '@babel/typescript',
                            ],
                            plugins: [
                                ['@babel/proposal-decorators', {
                                    legacy: true,
                                }],
                                ['@babel/proposal-class-properties', {
                                    loose: true,
                                }],
                                '@babel/transform-regenerator',
                            ],
                        },
                    }
                ]
            },
            {
                test: /\.css$/i,
                use: [
                    { loader: MiniCSSExtractPlugin.loader },
                    { loader: 'css-loader' },
                    { loader: 'postcss-loader' },
                ]
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    {
                        loader: MiniCSSExtractPlugin.loader,
                    },
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'postcss-loader',
                    },
                    {
                        loader: 'resolve-url-loader',
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: require('sass'),
                        },
                    },
                ],
            },
            {
                test: /\.(otf|woff2?)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name][ext][query]',
                },
            },
            {
                test: /\.wasm$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'bin/[name][ext][query]',
                },
            },
        ],
    },
    plugins: [
        IS_PRODUCTION && new CleanWebpackPlugin(),
        new MiniCSSExtractPlugin({
            filename: `styles/[name].css`
        }),
    ].filter(Boolean),
    resolve: {
        extensions: [
            '.css',
            '.scss',
            '.js',
            '.ts',
        ]
    }
}
