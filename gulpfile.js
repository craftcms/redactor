var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify-es').default;
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var merge = require('merge-stream');

var redactorPath = 'lib/redactor';
var srcPath = 'src/assets/field/src';
var distPath = 'src/assets/field/dist';


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
    var files = [
        srcPath+'/js/RedactorInput.js',
        srcPath+'/js/PluginBase.js',
        srcPath+'/js/CraftAssetImages.js',
        srcPath+'/js/CraftAssetImageEditor.js',
        srcPath+'/js/CraftAssetFiles.js',
        srcPath+'/js/CraftElementLinks.js',
        srcPath+'/js/RedactorOverrides.js'
    ];

    var tasks = [];

    for (var idx = 0; idx < files.length; idx++) {
        tasks.push(gulp.src(files[idx])
            .pipe(sourcemaps.init())
            .pipe(uglify())
            .pipe(rename({ suffix: '.min' }))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(distPath+'/js')));

        tasks.push(gulp.src(files[idx])
            .pipe(gulp.dest(distPath+'/js')));
    }

    return merge.apply(this, tasks);
});

gulp.task('redactor-plugins', function () {
    var modifiedPlugins = ['fullscreen'];
    var streams = [];

    for (var i = 0; i < modifiedPlugins.length; i++) {
        var plugin = modifiedPlugins[i];
        streams.push(gulp.src('lib/redactor-plugins/'+plugin+'/'+plugin+'.js')
            .pipe(sourcemaps.init())
            .pipe(uglify())
            .pipe(rename({ suffix: '.min' }))
            .pipe(gulp.dest('lib/redactor-plugins/'+plugin)));
    }

    return merge.apply(this, streams);
});

gulp.task('field-css', function() {
    return gulp.src(srcPath+'/css/RedactorInput.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cleanCSS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(distPath+'/css'));
});

gulp.task('redactor', ['redactor-js', 'redactor-css']);
gulp.task('field', ['field-js', 'field-css']);
gulp.task('default', ['redactor', 'field']);
