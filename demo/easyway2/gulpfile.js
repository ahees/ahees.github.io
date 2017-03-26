var gulp         = require('gulp'),
	sass         = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	//cssmin 		 = require('gulp-cssmin'),
	//cleanCSS     = require('gulp-clean-css'),
	//rename       = require('gulp-rename'),
	browserSync  = require('browser-sync').create();
	//concat       = require('gulp-concat'),
	//uglify       = require('gulp-uglify');

gulp.task('browser-sync', ['styles'], function() {
		browserSync.init({
				//proxy: "luclang.test",
				server: {
					baseDir: 'app'
				},
				notify: false
		});
});

gulp.task('styles', function () {
	return gulp.src('app/sass/*.sass')
	.pipe(sass().on('error', sass.logError))
	.pipe(autoprefixer({browsers: ['last 150 versions'], cascade: true}))
	//.pipe(cleanCSS())
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.stream());
});

gulp.task('watch', function () {
	gulp.watch('app/sass/**/*.sass', ['styles']);
	gulp.watch('app/libs/**/*.scss', ['styles']);
	gulp.watch('app/js/*.js').on("change", browserSync.reload);
	//gulp.watch('../js/*.js').on("change", browserSync.reload);
	gulp.watch('app/**/*.html').on('change', browserSync.reload);
	//gulp.watch('../**/*.php').on('change', browserSync.reload);
	//gulp.watch('../**/*.less').on('change', browserSync.reload);
});

gulp.task('default', ['browser-sync', 'watch']);