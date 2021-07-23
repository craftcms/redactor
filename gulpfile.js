const gulp = require('gulp');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify-es').default;
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const merge = require('merge-stream');

const assetsPath = 'src/assets';
const redactorSrcPath = 'lib/redactor';
const redactorDistPath = `${assetsPath}/redactor/dist`;
const pluginsSrcPath = 'lib/redactor-plugins';
const pluginsDistPath = `${assetsPath}/redactor-plugins/dist`;
const fieldSrcPath = `${assetsPath}/field/src`;
const fieldDistPath = `${assetsPath}/field/dist`;

gulp.task('redactor-clean', () => {
  return del([
    `${redactorSrcPath}/**/*.min.*`,
    `${pluginsSrcPath}/**/*.min.*`,
  ]);
});

gulp.task('redactor-js', ['redactor-clean'], () => {
  return gulp.src(`${redactorSrcPath}/**/*.js`)
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(rename(path => {
      path.dirname = `../../${redactorDistPath}/${path.dirname}`;
      path.extname = '.min.js';
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(file => {
      return file.base;
    }))
});

gulp.task('redactor-css', ['redactor-clean'], () => {
  return gulp.src(redactorSrcPath+'/redactor.css')
    .pipe(sourcemaps.init())
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(redactorDistPath));
});

gulp.task('redactor-plugin-js', ['redactor-clean'], () => {
  return gulp.src(`${pluginsSrcPath}/**/*.js`)
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(rename(path => {
      path.dirname = `../../${pluginsDistPath}/${path.dirname}`;
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(file => {
      return file.base;
    }))
});

gulp.task('redactor-plugin-css', ['redactor-clean'], () => {
  return gulp.src(`${pluginsSrcPath}/**/*.css`)
    .pipe(sourcemaps.init())
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(rename(path => {
      path.dirname = `../../${pluginsDistPath}/${path.dirname}`;
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(file => {
      return file.base;
    }))
});

gulp.task('field-js', () => {
  gulp.src(`${fieldSrcPath}/js/*`)
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(fieldDistPath+'/js'));
});

gulp.task('field-css', () => {
  return gulp.src(`${fieldSrcPath}/css/*`)
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compact'
    }).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(fieldDistPath+'/css'));
});

gulp.task('redactor-plugins', ['redactor-plugin-js', 'redactor-plugin-css']);
gulp.task('redactor', ['redactor-js', 'redactor-css', 'redactor-plugins']);
gulp.task('field', ['field-js', 'field-css']);
gulp.task('default', ['redactor', 'field']);
