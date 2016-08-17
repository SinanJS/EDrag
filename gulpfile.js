'use strict';
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rev = require('gulp-rev');
var pump = require('pump');
var through = require('through2');
var modify = require('modify-filename');
var uglifycss = require('gulp-uglifycss');
var watch = require('gulp-watch');

gulp.task('compress', function(callback) {
    return gulp.src('js/*.js')
        .pipe(uglify())
        .pipe(rev())
        .pipe(through.obj(function(file, enc, cb) {
            // write the NEW path
            file.path = modify(file.revOrigPath, function(name, ext) {
                //return name + '.min' + ext + '?' + file.revHash;
                return name + '.min' + ext;
            });
            // send it back to stream
            cb(null, file);
        }))
        .pipe(gulp.dest('build/js'));
});
gulp.task('hash',function(){
    return gulp.src('build/js/*.js')
        .pipe(rev())
        .pipe(through.obj(function(file, enc, cb) {
            // write the NEW path
            file.path = m;
            odify(file.revOrigPath, function(name, ext) {
                return name + '.min' + ext;
            });
            cb(null, file);
        }))
        .pipe(gulp.dest('build/js'));
});
gulp.task('default',['compress'], function(callback) {
    gulp.watch('js/*.js',['compress']);
});