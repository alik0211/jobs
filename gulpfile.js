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

const reload = browserSync.reload;

gulp.task('serve', function() {
  browserSync({
    server: {
      baseDir: 'app'
    },
    port: 8888,
    notify: false
  });
});

gulp.task('serve:dist', ['build'], function() {
  browserSync({
    server: {
      baseDir: 'dist'
    },
    port: 9999,
    notify: false
  });
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

gulp.task('clean', function() {
  return del.sync('dist');
});

gulp.task('build', ['clean', 'sass:prod'], function() {
  gulp.src('app/*.html')
    .pipe(removeHtml())
    .pipe(injectCSS())
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'));

  gulp.src('app/img/**/*').pipe(gulp.dest('dist/img'));
});

gulp.task('watch', ['sass:dev', 'serve'], function() {
  gulp.watch('app/*.html', reload);
  gulp.watch('app/sass/**/*.sass', ['sass:dev', reload]);
});

gulp.task('default', ['watch']);
