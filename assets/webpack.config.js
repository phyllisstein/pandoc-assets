const autoprefixer = require('autoprefixer')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const cssnano = require('cssnano')
const fiber = require('fibers')
const mime = require('mime')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

const getLinkedPath = (...fragments) =>
    path.resolve(
        path.join(
            process.cwd(),
            ...fragments,
        )
    )

module.exports = async () => {
    const IS_PRODUCTION = !!process.env.NODE_ENV && process.env.NODE_ENV === 'production'

    return {
        mode: process.env.NODE_ENV || 'development',
        devtool: 'source-map',
        context: getLinkedPath('src'),
        resolve: {
            enforceExtension: false,
            modules: [
                getLinkedPath('./node_modules'),
                getLinkedPath('./src'),
                getLinkedPath('./vendor'),
            ],
        },
        entry: {
            bundle: './index',
            Hyphenopoly: 'hyphenopoly/Hyphenopoly',
        },
        output: {
            path: getLinkedPath('public'),
            publicPath: 'https://hot.garb.ag/',
            filename: '[name].js',
        },
        module: {
            rules: [
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
        cache: {
            buildDependencies: {
                config: [__filename],
            },
            type: 'filesystem',
        },
        snapshot: {
            buildDependencies: {
                timestamp: true,
            },
            managedPaths: [
                getLinkedPath('./node_modules'),
            ],
            module: {
                timestamp: true,
            },
            resolve: {
                timestamp: true,
            },
            resolveBuildDependencies: {
                timestamp: true,
            },
        },
        experiments: {
            asset: true,
        },
    }
}
