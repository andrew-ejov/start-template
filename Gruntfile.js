/*
 * Gruntfile.js
 *
 * Copyright (c) 2015 Fatov Andrew
 * Licensed under the MIT license.
 * https://github.com/DmitryRendov/inv-theme/blob/master/LICENSE
 */
var module;

module.exports = function (grunt) {

    "use strict";

    var globalConfig = {

        images_dev: 'dev/img',
        images_build: 'build/img',
        /* папки для картинок сайта */
        styles_dev: 'dev/sass',
        styles_build: 'build/css',
        /* папка для готовый файлов css стилей */
        fonts: 'fonts',
        /* папка для шрифтов */
        scripts_dev: 'dev/js',
        scripts_build: 'build/js',
        /* папка для готовых скриптов js */
        bower_path: 'libraries' /* папка где хранятся библиотеки jquery, bootstrap, SyntaxHighlighter, etc. */
    };

    grunt.initConfig({
        globalConfig: globalConfig,
        pkg: grunt.file.readJSON('package.json'),
        /**
         * Задача "copy"
         *
         * выбрать из библиотек lobalConfig.bower_path = 'libraries'
         * нужные для проекта файлы и скоипровать их в соответствующие папки
         */
        copy: {
            main: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: '<%= globalConfig.bower_path %>/jquery/dist/jquery.min.js',
                    dest: '<%= globalConfig.scripts_build %>/',
                    filter: 'isFile'
        }, {
                    expand: true,
                    flatten: true,
                    src: '<%= globalConfig.bower_path %>/html5shiv/dist/html5shiv.min.js',
                    dest: '<%= globalConfig.scripts_build %>/',
                    filter: 'isFile'
        }, {
                    expand: true,
                    flatten: true,
                    src: '<%= globalConfig.bower_path %>/bootstrap/dist/js/bootstrap.min.js',
                    dest: '<%= globalConfig.scripts_build %>/',
                    filter: 'isFile'
        }, {
                    expand: true,
                    flatten: true,
                    src: '<%= globalConfig.bower_path %>/bootstrap/dist/css/bootstrap.min.css',
                    dest: '<%= globalConfig.styles_build %>/',
                    filter: 'isFile'
        }, {
                    expand: true,
                    flatten: true,
                    src: '<%= globalConfig.bower_path %>/font-awesome/css/font-awesome.min.css',
                    dest: '<%= globalConfig.styles_build %>/',
                    filter: 'isFile'
        }, {
                    expand: true,
                    flatten: true,
                    src: '<%= globalConfig.bower_path %>/font-awesome/fonts/*',
                    dest: '<%= globalConfig.fonts_build %>/',
                    filter: 'isFile'
        }, {
                    expand: true,
                    flatten: true,
                    src: '<%= globalConfig.bower_path %>/respond/dest/respond.min.js',
                    dest: '<%= globalConfig.scripts_build %>/',
                    filter: 'isFile'
        }]
            }
        },
        /**
         * Задача "modernizr"
         *
         * используя базовую версию библиотеки modernizr.js
         * выполнить кастомизацию и скопировать в папку scripts проекта
         */
        modernizr: {

            dist: {
                // [REQUIRED] Path to the build you're using for development.
                "devFile": '<%= globalConfig.bower_path %>/modernizr/modernizr.js',

                // [REQUIRED] Path to save out the built file.
                "outputFile": '<%= globalConfig.scripts_build %>/modernizr-custom.min.js',

                // Based on default settings on http://modernizr.com/download/
                "extra": {
                    "shiv": true,
                    "printshiv": false,
                    "load": true,
                    "mq": false,
                    "cssclasses": true
                },

                // Based on default settings on http://modernizr.com/download/
                "extensibility": {
                    "addtest": false,
                    "prefixed": false,
                    "teststyles": false,
                    "testprops": false,
                    "testallprops": false,
                    "hasevents": false,
                    "prefixes": false,
                    "domprefixes": false
                },

                // By default, source is uglified before saving
                "uglify": true,

                // Define any tests you want to implicitly include.
                "tests": [],

                // By default, this task will crawl your project for references to Modernizr tests.
                // Set to false to disable.
                "parseFiles": true,

                // When parseFiles = true, this task will crawl all *.js, *.css, *.scss files, except files that are in node_modules/.
                // You can override this by defining a "files" array below.
                // "files" : {
                // "src": []
                // },

                // When parseFiles = true, matchCommunityTests = true will attempt to
                // match user-contributed tests.
                "matchCommunityTests": false,

                // Have custom Modernizr tests? Add paths to their location here.
                "customTests": []
            }

        },
        /**
         * Задача "clean"
         *
         * очистить(удалить) production-файлы перед их повторной "сборкой"
         */
        clean: {
            js: ['<%= globalConfig.scripts_dev %>/app.js', '<%= globalConfig.scripts_build %>/app.min.js'],
            css: ['<%= globalConfig.styles_dev %>/main.css', '<%= globalConfig.styles_build %>/main.min.css']
        },
        /**
         * Задача "sass"
         *
         * преобразовать файлы less в css  с последующим сжатием, оптимизацией и
         * копированием результатов в папку styles проекта
         */
        sass: { // Task
            dist: { // Target
                options: { // Target options
                    style: 'expanded',
                    loadPath: 'libraries/bourbon/app/assets/stylesheets'
                },
                files: { // Dictionary of files
                    '<%= globalConfig.styles_build %>/main.css': '<%= globalConfig.styles_dev %>/main.scss' // 'destination': 'source'
                }
            }
        },
        /**
         * Задача "watch"
         *
         * отслеживать изменения в файлах less и js  с последующим сжатием, оптимизацией и
         * копированием результатов в соответствующие папки проекта
         */
        watch: {
            styles: {
                files: ['<%= globalConfig.styles_dev %>/sass/*.scss'],
                tasks: ['sass'],
                options: {
                    nospawn: true
                }
            },
            scripts: {
                files: ['<%= globalConfig.scripts_dev %>/js/*.js', '!app.js'],
                tasks: ['js'],
                options: {
                    nospawn: true
                }
            }
        },
        /**
         * Задача "concat"
         *
         * "склеить" все файлы js  в один файл, с добавлением "шапки-баннера"
         */
        concat: {
            dist: {
                src: ['<%= globalConfig.scripts_dev %>/js/**/*.js'],
                dest: '<%= globalConfig.scripts_build %>/app.js',
                options: {
                    banner: ";(function( window, undefined ){ \n 'use strict'; \n",
                    footer: "\n}( window ));"
                }
            }
        },
        /**
         * Задача "jshint"
         *
         * проверить все файлы js на предмет соответствия стандартам
         * используя заданные в файле .jshintrc условия верфикации javascript кода
         */
        jshint: {
            all: ['Gruntfile.js', '<%= globalConfig.scripts_build %>/js/**/*.js'],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        /**
         * Задача "uglify"
         *
         * сжать финальный js файл и добавить к нему шапку-баннер
         */
        uglify: {
            options: {
                // the banner is inserted at the top of the output
                banner: '/*! \n * <%= pkg.name %> <%= pkg.version %> (<%= pkg.homepage %>) \n * Copyright <%= grunt.template.today("yyyy") %> Dmitry Vl. Rendov \n * Licensed under MIT (https://github.com/DmitryRendov/inv-theme/blob/master/LICENSE) \n */ \n'
            },
            dist: {
                files: {
                    '<%= globalConfig.scripts_build %>/app.min.js': ['<%= concat.dist.dest %>']
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-modernizr');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Default task(s).
    grunt.registerTask('default', ['copy', 'modernizr', 'clean:css', 'sass', 'js']);
    grunt.registerTask('js', ['clean:js', 'concat', 'jshint', 'uglify']);

};
