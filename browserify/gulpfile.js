
const del = require('del');
const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');

gulp.task('clean', function() {
  return del([ './src/main/webapp/bundle.*' ]);
});

gulp.task('build', function() {
  return browserify({
      entries: [
        './src/main/js/main.js',
        './src/main/js/sub.js'
      ],
      paths: [ './node_modules' ]
    })
    .bundle()
    .pipe(source('bundle.js') )
    .pipe(gulp.dest('./src/main/webapp') );
});

gulp.task('watch', gulp.series('build', function(){
  gulp.watch([ './src/main/js/**/*.js' ], gulp.series('build') )
    .on('change', function(path) {
      console.log(path);
    });
}) );

gulp.task('default',  gulp.series('build') );
