import autoprefixer from 'autoprefixer'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import cssnano from 'cssnano'
import fs from 'fs'
import { globbySync } from 'globby'
import mime from 'mime'
import MiniCSSExtractPlugin from 'mini-css-extract-plugin'
import path from 'path'
import sass from 'sass'
import CopyPlugin from 'copy-webpack-plugin'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const IS_PRODUCTION = !!process.env.NODE_ENV && process.env.NODE_ENV === 'production'
const PUBLIC_PATH = IS_PRODUCTION
    ? 'https://hot.garb.ag/'
    : 'https://pandoc.localhost/'

const fonts = globbySync('./src/vendor/fonts/**/*.scss')
    .map(fn => fn.replace('src/vendor', 'vendor'))
    .reduce((acc, fn) => {
        const name = path.basename(fn, '.scss')
        acc[name] = fn
        return acc
    }, {})

export default {
    mode: process.env.NODE_ENV || 'development',
    devtool: 'source-map',
    context: path.resolve('./src'),
    entry: {
        ...fonts,
        bundle: './index',

    },
    output: {
        path: path.resolve('./public'),
        publicPath: PUBLIC_PATH,
        chunkFilename: '[name].[contenthash].js',
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
                            exclude: /node_modules/,
                            presets: [
                                [
                                    '@babel/env',
                                    {
                                        loose: true
                                    }
                                ]
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
                            exclude: /node_modules/,
                            presets: [
                                ['@babel/env', {
                                    loose: true
                                }],
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
                            implementation: sass,
                        },
                    },
                ],
            },
            {
                test: /\.(otf|woff2?)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name].[contenthash][ext]',
                },
            },
        ],
    },
    plugins: [
        IS_PRODUCTION && new CleanWebpackPlugin(),
        new MiniCSSExtractPlugin({
            filename: `styles/[name].css`
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'node_modules/hyphenopoly/patterns/en-us.wasm'),
                    to: 'hyphenopoly/'
                },
                {
                    from: path.resolve(__dirname, 'node_modules/hyphenopoly/Hyphenopoly*.js'),
                    to: 'hyphenopoly/[name][ext]',
                },
            ],
        }),
    ].filter(Boolean),
    resolve: {
        extensions: [
            '.css',
            '.scss',
            '.js',
            '.ts',
        ],
        enforceExtension: false,
        modules: [
            './node_modules',
            './src',
        ],
    },
}
