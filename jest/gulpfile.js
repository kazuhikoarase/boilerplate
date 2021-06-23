
const del = require('del');
const gulp = require('gulp');
const webpack = require('webpack-stream');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const jest = require('gulp-jest').default;

gulp.task('clean', function() {
  return del([ 'build', 'src/main/webapp/bundle.*' ]);
});

var webpackConfig = function(filename) {
  return {
    mode : 'development', // 'development' or 'production',
    devtool : 'source-map',
    output : { filename : filename },
    module: {
      rules: [
        { test: /\.vue$/, loader: 'vue-loader' },
        {
          test: /\.js$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [ '@babel/preset-env' ]
            }
          }
        }
      ]
    },
    plugins: [
      new VueLoaderPlugin()
    ] };
};

gulp.task('build', function() {
  return gulp.src([ 'src/main/js/main.js' ])
    .pipe(plumber({
      errorHandler : notify.onError({
        title : 'error in <%= error.plugin %>',
        message : '<%= error.message %>'
      })
    }))
    .pipe(webpack(webpackConfig('bundle.js') ) )
    .pipe(gulp.dest('src/main/webapp/'));
});

gulp.task('build-third-parties', function() {
  return gulp.src([ 'src/main/js/third-parties.js' ])
    .pipe(plumber({
      errorHandler : notify.onError({
        title : 'error in <%= error.plugin %>',
        message : '<%= error.message %>'
      })
    }))
    .pipe(webpack(webpackConfig('bundle-third-parties.js') ) )
    .pipe(gulp.dest('src/main/webapp/'));
});

gulp.task('jest', function() {
  return gulp.src('.')
    .pipe(jest({
      collectCoverage: true,
      coverageDirectory: './build/coverage',
      collectCoverageFrom: [
        "src/main/js/**/*.{js,vue}",
        "src/test/js/**/*.{js,vue}"
      ],
      preprocessorIgnorePatterns: [
        "<rootDir>/dist/",
        "<rootDir>/node_modules/"
      ],
      automock: false
    }));
});

gulp.task('watch', function() {
  gulp.watch([
      './src/main/js/**/*.js',
      './src/main/js/**/*.vue',
      './src/test/js/**/*.js'
    ], gulp.series('build', 'jest') )
    .on('change', function(path) {
      console.log(path);
    });
});

gulp.task('default',  gulp.series('build') );
