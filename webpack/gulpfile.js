
const del = require('del');
const gulp = require('gulp');
const webpack = require('webpack-stream');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const VueLoaderPlugin = require('vue-loader/lib/plugin')

gulp.task('clean', function() {
  return del([ 'src/main/webapp/bundle.*' ]);
});

gulp.task('build', function() {
  return gulp.src([ 'src/main/js/main.js' ])
    .pipe(plumber({
      errorHandler : notify.onError({
        title : 'error in <%= error.plugin %>',
        message : '<%= error.message %>'
      })
    }))
    .pipe(webpack({
      mode : 'development', // 'development' or 'production',
      devtool : 'source-map',
      output : { filename : 'bundle.js' },
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
      ] }) )
    .pipe(gulp.dest('src/main/webapp/'));
});

gulp.task('watch', function() {
  gulp.watch([
      './src/main/js/**/*.js',
      './src/main/js/**/*.vue',
      './src/test/js/**/*.js'
    ], gulp.series('build') )
    .on('change', function(path) {
      console.log(path);
    });
});

gulp.task('default',  gulp.series('build') );
