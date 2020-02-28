const autoprefixer = require('autoprefixer')
const changed = require('gulp-changed')
const concat = require('gulp-concat')
const cssnano = require('cssnano')
const fiber = require('fibers')
const gulp = require('gulp')
const html = require('gulp-htmlmin')
const mergeStream = require('merge-stream')
const path = require('path')
const postcss = require('gulp-postcss')
const rename = require('gulp-rename')
const rimraf = require('rimraf')
const s3 = require('gulp-s3-upload')()
const sass = require('gulp-sass')
const webpack = require('webpack')

sass.compiler = require('sass')

const clean = rimraf.bind(null, 'public/*')
exports.clean = clean

function buildSass() {
    return gulp
        .src('src/custom.scss')
        .pipe(
            sass({
                fiber,
                includePaths: ['src/css', 'node_modules'],
            })
            .on('error', sass.logError)
        )
        .pipe(gulp.dest('public'))
}

buildSass.displayName = 'build:sass'
exports.buildSass = buildSass

const watchSass = () => gulp.watch('src/css/**/*.scss', { ignoreInitial: false }, buildSass)

watchSass.displayName = 'watch:sass'
exports.watchSass = watchSass

function buildVendor() {
    return gulp
        .src('src/css/vendor/**/*.css')
        .pipe(concat('vendor.css'))
        .pipe(changed('public'))
        .pipe(gulp.dest('public'))
}

buildVendor.displayName = 'build:vendor'
exports.buildVendor = buildVendor

function buildCSS() {
    return mergeStream(
        buildSass(),
        buildVendor(),
    )
    .pipe(
        postcss([
            autoprefixer({
                flexbox: false,
            }),
            cssnano({
                preset: ['advanced', {
                    discardComments: {
                        removeAll: true,
                    },
                }],
            }),
        ]),
    )
    .pipe(gulp.dest('public'))
    .pipe(
        s3(
            { ACL: 'bucket-owner-full-control', Bucket: 'hot.blep.wtf' },
            { charset: 'utf-8' },
        ),
    )
}

buildCSS.displayName = 'build:css'
exports.buildCSS = buildCSS

function buildFonts() {
    return gulp
        .src('src/fonts/**/*', { buffer: false })
        .pipe(changed('public/fonts'))
        .pipe(gulp.dest('public/fonts'))
        .pipe(
            s3(
                {
                    ACL: 'bucket-owner-full-control',
                    Bucket: 'hot.blep.wtf',
                    keyTransform: relativePath => `fonts/${ relativePath }`,
                },
                { charset: 'utf-8' },
            ),
        )
}

buildFonts.displayName = 'build:fonts'
exports.buildFonts = buildFonts

function buildJS() {
}

const build = gulp.parallel(buildFonts, buildCSS)
exports.build = build

exports.default = build
