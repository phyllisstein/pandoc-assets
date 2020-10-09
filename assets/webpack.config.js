const autoprefixer = require('autoprefixer')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const cssnano = require('cssnano')
const fiber = require('fibers')
const mime = require('mime')
const path = require('path')

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    context: path.resolve('src'),
    resolve: {
        enforceExtension: false,
        extensions: [
            '.js',
            '.jsx',
            '.ts',
            '.tsx',
            '.wasm',
            '.mjs',
            '.json',
            '.css',
            '.scss',
        ],
        modules: [
            path.resolve('./node_modules'),
            path.resolve('./src'),
            path.resolve('./vendor'),
        ],
    },
    entry: {
        bundle: './index',
        Hyphenopoly: 'hyphenopoly/Hyphenopoly',
    },
    output: {
        path: path.resolve('public'),
        publicPath: 'http://pandoc.here/',
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                    { loader: 'postcss-loader' },
                ]
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    {
                        loader: 'style-loader',
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
                            sassOptions: {
                                fiber,
                            },
                            sourceMap: true,
                        },
                    },
                ],
            },
            {
                test: /\.woff2?$/i,
                type: 'asset/resource',
            },
            {
                test: /\.wasm$/i,
                type: 'asset/resource',
            },
        ],
    },
    plugins: [
        // new CleanWebpackPlugin(),
        // NOTE: Broken for Webpack 5.
        // new S3Plugin({
        //     s3Options: {
        //         accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        //         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        //         region: process.env.AWS_REGION,
        //     },
        //     s3UploadOptions: {
        //         ACL: 'bucket-owner-full-control',
        //         Bucket: 'hot.blep.wtf',
        //         CacheControl: 'no-store, no-cache, must-revalidate',
        //         ContentType: fileName => mime.getType(fileName),
        //     },
        // }),
    ],
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
            path.resolve('./node_modules'),
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
