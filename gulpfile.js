var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');

var redactorPath = 'lib/redactor';
var fieldPath = 'src/assets/field/dist';

gulp.task('redactor-js', function() {
    return gulp.src(redactorPath+'/redactor.js')
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(redactorPath));
});

gulp.task('redactor-css', function() {
    return gulp.src(redactorPath+'/redactor.css')
        .pipe(cleanCSS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(redactorPath));
});

gulp.task('field-js', function() {
    return gulp.src(fieldPath+'/js/RedactorInput.js')
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(fieldPath+'/js'));
});

gulp.task('field-css', function() {
    return gulp.src(fieldPath+'/css/RedactorInput.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cleanCSS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(fieldPath+'/css'));
});

gulp.task('craft-sass', function() {
    return gulp.src('node_modules/craftcms-sass/src/_mixins.scss')
        .pipe(gulp.dest('lib/craftcms-sass'));
});

gulp.task('redactor', ['redactor-js', 'redactor-css']);
gulp.task('field', ['field-js', 'field-css']);
gulp.task('default', ['redactor', 'field']);
