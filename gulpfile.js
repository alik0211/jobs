const del          = require('del'),
      gulp         = require('gulp'),
      sass         = require('gulp-sass'),
      notify       = require('gulp-notify'),
      htmlmin      = require('gulp-htmlmin'),
      cleanCSS     = require('gulp-clean-css'),
      injectCSS    = require('gulp-inject-css'),
      removeHtml   = require('gulp-remove-html'),
      browserSync  = require('browser-sync'),
      autoprefixer = require('gulp-autoprefixer');

gulp.task('reload', function(cb) {
  browserSync.reload();

  cb();
});

gulp.task('serve', function(cb) {
  browserSync({
    server: {
      baseDir: 'app'
    },
    port: 8888,
    notify: false
  });

  cb();
});

gulp.task('sass:dev', function() {
  return gulp.src('app/sass/*.sass')
    .pipe(sass({
      includePaths: require('node-normalize-scss').includePaths
    })).on('error', notify.onError())
    .pipe(autoprefixer(['last 10 versions']))
    .pipe(gulp.dest('app/css'));
});

gulp.task('sass:prod', function() {
  return gulp.src('app/sass/*.sass')
    .pipe(sass({
      includePaths: require('node-normalize-scss').includePaths
    })).on('error', notify.onError())
    .pipe(autoprefixer(['last 10 versions']))
    .pipe(cleanCSS({ level: { 1: { specialComments: 0 }}}))
    .pipe(gulp.dest('app/css'));
});

gulp.task('clean', function(cb) {
  del.sync('dist');

  cb();
});

gulp.task('html:prod', function() {
  return gulp.src('app/*.html')
    .pipe(removeHtml())
    .pipe(injectCSS())
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'));
});

gulp.task('assets:prod', function() {
  return gulp.src('app/img/**/*').pipe(gulp.dest('dist/img'));
});

gulp.task('watch', function(cb) {
  gulp.watch('app/*.html', gulp.series('reload'));
  gulp.watch('app/sass/**/*.sass', gulp.series('sass:dev', 'reload'));

  cb();
});

gulp.task('build', gulp.series('clean', 'sass:prod', 'html:prod', 'assets:prod'));

gulp.task('default', gulp.series('sass:dev', 'serve', 'watch'));
