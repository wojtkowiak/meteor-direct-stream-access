/* eslint strict: [2, "global"] */
'use strict';

var fs      = require('fs');
var gulp    = require('gulp');
var $       = require('gulp-load-plugins')();

$.merge = require('merge-stream');

gulp.task('docs', function docs() {
    var streams = $.merge();
    var options = {
        private: false,
        'heading-depth': 3,
        template: fs.readFileSync('../templates/api.hbs', 'utf8')
    };
    var apiDocs = { 'CLIENT.md': '../src/**/!(*.server.js)', 'SERVER.md': '../src/**/!(*.client.js)' };

    function error(err) {
        $.util.log('jsdoc2md failed:', err.message);
    }

    Object.keys(apiDocs).forEach(function generateApiDoc(doc) {
        streams.add(gulp.src(apiDocs[doc])
            .pipe($.concat(doc))
            .pipe($.jsdocToMarkdown(options))
            .on('error', error)
            .pipe(gulp.dest('..')));
    });

    return streams;
});

gulp.task('watch', function watch() {
    gulp.watch('../**/*.{js,hbs}', ['docs']);
});
