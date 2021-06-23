//
// gulp configuration
//

const del = require('del');
const gulp = require('gulp');
const webpack = require('webpack-stream');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const VueLoaderPlugin = require('vue-loader/lib/plugin')

gulp.task('clean', function() {
  return del([ 'lib', 'result' ]);
});

var webpackConfig = function(filename) {
  return {
    mode : 'development', // 'development' or 'production',
    devtool : 'source-map',
    output : { filename : filename },
    plugins: [
      new VueLoaderPlugin()
    ],
    module: {
      rules: [
        { test: /\.css$/, use: [ 'style-loader', 'css-loader' ], },
        { test: /\.vue$/, loader: 'vue-loader' },
        { test: /\.ts$/, loader: 'ts-loader' },
        { // babel all.
          test: /\.js$/,
          use: {
            loader: 'babel-loader',
            options: { presets: [ '@babel/preset-env' ] }
          }
        },
      ]
    },
  };
};

gulp.task('build', function() {
  return gulp.src([ 'src/main/js/myapp.js' ])
    .pipe(plumber({
      errorHandler : notify.onError({
        title : 'error in <%= error.plugin %>',
        message : '<%= error.message %>'
      })
    }))
    .pipe(webpack(webpackConfig('bundle.js') ) )
    .pipe(gulp.dest('lib/'));
});

gulp.task('watch', function() {
  gulp.watch([
      './src/main/js/**/*.css',
      './src/main/js/**/*.vue',
      './src/main/js/**/*.ts',
      './src/main/js/**/*.js',
    ], gulp.series('build') )
    .on('change', function(path) {
      console.log(path);
    });
});

gulp.task('default',  gulp.series('build') );
