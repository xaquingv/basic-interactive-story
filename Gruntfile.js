var fs = require('fs');

module.exports = function(grunt) {

    require('jit-grunt')(grunt);

    grunt.initConfig({

        projects: { },

        watch: {
            js: {
                files: ['src/js/**/*'],
                tasks: ['interactive'],
            },
            css: {
                files: ['src/css/**/*'],
                tasks: ['sass', 'cssmin', 'shell:render'],
            },
            assets: {
                files: ['src/assets/**/*'],
                tasks: ['copy:assets']
            }
        },

        clean: {
            build: ['build']
        },

        sass: {
            options: {
                sourceMap: true
            },
            interactive: {
                files: {
                    'build/main.css': 'src/css/main.scss'
                }
            }
        },

        cssmin: {
          options: {
            shorthandCompacting: false,
            roundingPrecision: -1
          },
          target: {
            files: {
              'build/main.css': ['build/main.css']
            }
          }
        },

        shell: {
            interactive: {
                command: './node_modules/.bin/jspm bundle-sfx <%= projects.jspmFlags %> src/js/main build/main.js',
                options: {
                    execOptions: {
                        cwd: '.'
                    }
                }
            },
            render: {
                command: './node_modules/.bin/babel-node src/js/renderer/render.js'
            }
        },

        'template': {
            'options': {
                'data': {
                    'assetPath': '<%= projects.assetPath %>',
                }
            },
            'index': {
                'files': {
                    'build/index.html': ['build/index.html'],
                }
            }
        },

        copy: {
            assets: {
                files: [
                    {expand: true, cwd: 'src/', src: ['assets/**/*'], dest: 'build'},
                ]
            }
        },
        
        connect: {
            server: {
                options: {
                    hostname: '0.0.0.0',
                    port: 8000,
                    base: 'build',
                    middleware: function (connect, options, middlewares) {
                        // inject a custom middleware http://stackoverflow.com/a/24508523
                        middlewares.unshift(function (req, res, next) {
                            res.setHeader('Access-Control-Allow-Origin', '*');
                            res.setHeader('Access-Control-Allow-Methods', '*');
                            return next();
                        });
                        return middlewares;
                    }
                }
            }
        }
    });

    grunt.registerTask('interactive', ['shell:interactive', 'sass:interactive', 'cssmin', 'shell:render', 'template:index']);
    grunt.registerTask('all', ['interactive', 'copy:assets'])
    grunt.registerTask('default', ['clean', 'all', 'connect', 'watch']);
    grunt.registerTask('build', ['clean', 'all']);

    grunt.registerTask('render', ['interactive', 'shell:render']);

    grunt.loadNpmTasks('grunt-contrib-cssmin');
}
