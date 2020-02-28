const autoprefixer = require('autoprefixer')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const cssnano = require('cssnano')
const mime = require('mime')
const path = require('path')

module.exports = {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    context: path.resolve('src'),
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
                test: /\.s[ac]ss$/i,
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            esModule: true,
                        },
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            esModule: true,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                autoprefixer({
                                    flexbox: false,
                                }),
                                cssnano(),
                            ],
                        },
                    },
                    {
                        loader: 'resolve-url-loader',
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: require('sass'),
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
        new CleanWebpackPlugin(),
        // FIXME: Broken for Webpack 5.
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
    experiments: {
        asset: true,
    },
}
