module.exports = function (grunt) {
    "use strict";
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.initConfig({
        output: './dist/',
        source: './src/',
        vendor: './src/vendor/',
        clean: {
            output: ['<%= output %>/**']
        },
        jsbeautifier: {
            mono: {
                src: ['<%= output %>mono.js']
            },
            monoLib: {
                src: ['<%= output %>monoLib.js']
            }
        },
        options: {
            chrome: {
                useChrome: 1,
                useLocalStorage: 1,
                chromeForceDefineBgPage: 1
            },
            firefox: {
                useFf: 1
            },
            gm: {
                useGm: 1
            },
            opera12: {
                useOpera12: 1
            },
            safari: {
                useSafari: 1
            }
        }
    });

    var ifStrip = require('./grunt/ifStrip').ifStrip;
    var extractIncludes = require('./grunt/extractIncludes').extractIncludes;
    var beautify = require('js-beautify').js_beautify;
    var beautifyOptions = {
        "eol": "\n",
        "indent_size": 2
    };
    var lineNormalize = function (content) {
        content = content.replace(/\n\n\n/g, '\n');
        return content;
    };

    ['chrome', 'firefox', 'gm', 'opera12', 'safari'].forEach(function (browser) {
        grunt.registerTask(browser, function () {
            var path = grunt.config('source') + 'components';

            var content = grunt.file.read(path + '/wrapper.js');
            content = content.replace('{browserApiPath}', '../vendor/' + browser + '/browser.js');
            content = extractIncludes(content, path);
            content = ifStrip(content, grunt.config('options.' + browser) || {});
            content = beautify(content, beautifyOptions);
            content = lineNormalize(content);

            var output = grunt.config('output') + browser + '/mono.js';
            grunt.file.write(output, content);
        });
    });

    grunt.registerTask('firefoxLib', function () {
        var path = grunt.config('vendor') + 'firefox/lib/';

        var content = grunt.file.read(path + 'monoLib.js');
        content = extractIncludes(content, path);
        content = ifStrip(content, grunt.config('options.firefoxLib') || {});
        content = beautify(content, beautifyOptions);
        content = lineNormalize(content);

        var output = grunt.config('output') + 'firefox/monoLib.js';
        grunt.file.write(output, content);
    });

    grunt.registerTask('default', [
        'clean:output',
        'chrome',
        'firefox',
        'firefoxLib',
        'gm',
        'opera12',
        'safari'
    ]);
};