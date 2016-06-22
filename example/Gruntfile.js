module.exports = function (grunt) {
    "use strict";
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.initConfig({
        output: './dist/',
        clean: {
            output: ['<%= output %>/**']
        },
        copy: {
            bg: {
                cwd: 'src/js/',
                expand: true,
                src: [
                    'bg.js'
                ],
                dest: '<%= output %><%= vendor %><%= libFolder %>'
            },

            dataJs: {
                expand: true,
                cwd: 'src/js/',
                src: [
                    'popup.js',
                    'options.js',
                    'base.js'
                ],
                dest: '<%= output %><%= vendor %><%= dataJsFolder %>'
            },

            includes: {
                cwd: 'src/includes/',
                expand: true,
                src: [
                    'inject.js'
                ],
                dest: '<%= output %><%= vendor %><%= includesFolder %>'
            },

            baseData: {
                cwd: 'src/',
                expand: true,
                src: [
                    'options.html',
                    'popup.html',
                    'manifest.json'
                ],
                dest: '<%= output %><%= vendor %><%= dataFolder %>'
            }
        }
    });

    grunt.registerTask('monoPrepare', function () {
        var output = grunt.template.process('<%= output %><%= vendor %><%= dataJsFolder %>/mono.js');
        var path = grunt.template.process('../dist/<%= monoDist %>/mono.js');
        var content = grunt.file.read(path);
        grunt.file.write(output, content);
    });

    grunt.registerTask('monoLibPrepare', function () {
        var output = grunt.template.process('<%= output %><%= vendor %><%= libFolder %>/monoLib.js');
        var path = grunt.template.process('../dist/<%= monoDist %>/monoLib.js');
        var content = grunt.file.read(path);
        grunt.file.write(output, content);
    });

    grunt.registerTask('chrome', function () {
        grunt.config.merge({
            monoDist: 'chrome',
            vendor: 'chrome/src/',
            libFolder: 'js/',
            dataJsFolder: 'js/',
            includesFolder: 'includes/',
            dataFolder: ''
        });
        grunt.task.run([
            'copy:baseData',
            'copy:bg',
            'copy:dataJs',
            'copy:includes',
            'monoPrepare'
        ]);
    });

    grunt.registerTask('buildJpmFF', function () {
        var Path = require('path');
        var async = this.async();
        var src = grunt.template.process('<%= output %><%= vendor %>');
        var cwd = Path.join(process.cwd(), src);

        return grunt.util.spawn({
            cmd: 'jpm',
            args: ['xpi'],
            opts: {
                cwd: cwd
            }
        }, function done(error, result, code) {
            console.log('Exit code:', code);
            result.stdout && console.log(result.stdout);
            result.stderr && console.log(result.stderr);

            if (error) {
                throw grunt.util.error('buildJpmFF error!');
            }

            return async();
        });
    });

    grunt.registerTask('firefox', function () {
        grunt.config.merge({
            copy: {
                ffBase: {
                    expand: true,
                    cwd: 'src/vendor/firefox/',
                    src: [
                        'lib/**',
                        'data/**',
                        'package.json'
                    ],
                    dest: '<%= output %><%= vendor %>'
                }
            },
            monoDist: 'firefox',
            vendor: 'firefox/src/',
            libFolder: 'lib/',
            dataJsFolder: 'data/js/',
            includesFolder: 'data/includes/',
            dataFolder: 'data/'
        });
        grunt.task.run([
            'copy:ffBase',
            'copy:baseData',
            'copy:bg',
            'copy:dataJs',
            'copy:includes',
            'monoPrepare',
            'monoLibPrepare',
            'buildJpmFF'
        ]);
    });

    grunt.registerTask('safari', function () {
        grunt.config.merge({
            copy: {
                safariBase: {
                    expand: true,
                    cwd: 'src/vendor/safari/',
                    src: [
                        '*'
                    ],
                    dest: '<%= output %><%= vendor %>'
                }
            },
            monoDist: 'safari',
            vendor: 'safari/build.safariextension/',
            libFolder: 'js/',
            dataJsFolder: 'js/',
            includesFolder: 'includes/',
            dataFolder: ''
        });
        grunt.task.run([
            'copy:safariBase',
            'copy:baseData',
            'copy:bg',
            'copy:dataJs',
            'copy:includes',
            'monoPrepare'
        ]);
    });

    grunt.registerTask('opera12', function () {
        grunt.registerTask('addUserScript', function() {
            var fs = require('fs');
            var path = require('path');
            var vendor = grunt.template.process('<%= output %><%= vendor %>');

            var fileList = grunt.file.expand(vendor + 'includes/*.js');
            fileList.forEach(function (fullPath) {
                var filename = path.basename(fullPath);
                var headPath = 'src/vendor/opera12/includesUserScript/' + filename + '.head';
                var jsPath = vendor + 'includes/' + filename;
                if (grunt.file.exists(headPath)) {
                    var headContent = grunt.file.read(headPath);
                    var jsContent = grunt.file.read(jsPath);

                    jsContent = headContent + '\n\n' + jsContent;
                    grunt.file.write(jsPath, jsContent);
                } else {
                    console.error('Opera 12 head is not found!', filename);
                }
            });

            var allHeadPath = 'src/vendor/opera12/jsUserScript/all.head';
            var addHeadContent = grunt.file.read(allHeadPath);

            fileList = grunt.file.expand(vendor + 'js/*.js');
            fileList.forEach(function (fullPath) {
                var filename = path.basename(fullPath);
                var jsPath = vendor + 'js/' + filename;

                var jsContent = grunt.file.read(jsPath);
                jsContent = addHeadContent + '\n\n' + jsContent;
                grunt.file.write(jsPath, jsContent);
            });
        });

        grunt.registerTask('mono2includes', function () {
            var vendor = grunt.template.process('<%= output %><%= vendor %>');
            var includesPath = vendor + grunt.config('includesFolder');
            var dataJsFolder = vendor + grunt.config('dataJsFolder');
            grunt.file.copy(dataJsFolder + 'mono.js', includesPath + '0_mono.js');
        });

        grunt.config.merge({
            copy: {
                opera12CopyIncludes: {
                    expand: true,
                    cwd: '<%= output %><%= vendor %><%= dataJsFolder %>',
                    src: [
                        'base.js'
                    ],
                    dest: '<%= output %><%= vendor %><%= includesFolder %>'
                },
                opera12Base: {
                    expand: true,
                    cwd: 'src/vendor/opera12/',
                    src: [
                        'icons/**',
                        'js/**',
                        'config.xml',
                        'index.html'
                    ],
                    dest: '<%= output %><%= vendor %>'
                }
            },
            compress: {
                opera12: {
                    options: {
                        mode: 'zip',
                        archive: '<%= output %><%= vendor %>../build.oex'
                    },
                    files: [{
                        expand: true,
                        filter: 'isFile',
                        cwd: '<%= output %><%= vendor %>',
                        src: '**',
                        dest: ''
                    }]
                }
            },
            monoDist: 'opera12',
            vendor: 'opera12/src/',
            libFolder: 'js/',
            dataJsFolder: 'js/',
            includesFolder: 'includes/',
            dataFolder: ''
        });
        grunt.task.run([
            'copy:opera12Base',
            'copy:baseData',
            'copy:bg',
            'copy:dataJs',
            'copy:includes',
            'monoPrepare',
            'copy:opera12CopyIncludes',
            'mono2includes',
            'addUserScript',
            'compress:opera12'
        ]);
    });

    grunt.registerTask('default', [
        'clean:output',
        'chrome',
        'firefox',
        'safari',
        'opera12'
    ]);
};