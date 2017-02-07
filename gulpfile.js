var gulp = require('gulp');

gulp.task('user-testing', function() {
  gulp.src(['./src/**/*'])
  .pipe(gulp.dest('./_preview'));
});
