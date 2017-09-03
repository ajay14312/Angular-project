'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Configurable paths for the application
  var appConfig = {
    app: require('./package.json').appPath || 'app',
    dist: 'dist'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    earthAngularProject: appConfig,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      js: {
        files: ['<%= earthAngularProject.app %>/scripts/{,*/}*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      styles: {
        files: ['<%= earthAngularProject.app %>/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= earthAngularProject.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= earthAngularProject.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 433,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect().use(
                '/node_modules',
                connect.static('./node_modules')
              ),
              connect().use(
                '/app/styles',
                connect.static('./app/styles')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      test: {
        options: {
          port: 9001,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect.static('test'),
              connect().use(
                '/node_modules',
                connect.static('./node_modules')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= earthAngularProject.dist %>'
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= earthAngularProject.app %>/scripts/{,*/}*.js'
        ]
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= earthAngularProject.dist %>/{,*/}*',
            '!<%= earthAngularProject.dist %>/.git{,*/}*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      server: {
        options: {
          map: true,
        },
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= earthAngularProject.dist %>/scripts/{,*/}*.js',
          '<%= earthAngularProject.dist %>/styles/{,*/}*.css',
          '<%= earthAngularProject.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= earthAngularProject.dist %>/styles/fonts/*'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= earthAngularProject.app %>/index.html',
      options: {
        dest: '<%= earthAngularProject.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ['<%= earthAngularProject.dist %>/{,*/}*.html'],
      css: ['<%= earthAngularProject.dist %>/styles/{,*/}*.css'],
      options: {
        assetsDirs: [
          '<%= earthAngularProject.dist %>',
          '<%= earthAngularProject.dist %>/images',
          '<%= earthAngularProject.dist %>/styles'
        ]
      }
    },

    // The following *-min tasks will produce minified files in the dist folder
    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
     cssmin: {
       dist: {
        files: {
       '<%= earthAngularProject.dist %>/styles/main.css': [
            '.tmp/styles/{,*/}*.css'
           ]
         }
       }
     },
    uglify: {
       dist: {
        files: {
        '<%= earthAngularProject.dist %>/scripts/scripts.js': [
         '<%= earthAngularProject.dist %>/scripts/scripts.js'
      ]
        }
       }
     },
     concat: {
       dist: {}
     },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= earthAngularProject.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= earthAngularProject.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= earthAngularProject.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= earthAngularProject.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= earthAngularProject.dist %>',
          src: ['*.html', 'views/{,*/}*.html'],
          dest: '<%= earthAngularProject.dist %>'
        }]
      }
    },
    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },
    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= earthAngularProject.dist %>/*.html']
      }
    },
    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= earthAngularProject.app %>',
          dest: '<%= earthAngularProject.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
			'json/*.*',
            'views/{,*/}*.html',
            'images/{,*/}*.*',
            'styles/fonts/{,*/}*.*',
			'scripts/{,*/}*.*'
          ]
        },
				{
          expand: true,
          cwd: 'node_modules/',
          dest: '<%= earthAngularProject.dist %>/node_modules',
          src: ['{,*/}*.js']
        },
		{
          expand: true,
          cwd: 'node_modules/jquery/dist',
          src: '{,*/}*.js',
          dest: '<%= earthAngularProject.dist %>/node_modules/jquery/dist'
        },
		{
          expand: true,
          cwd: 'node_modules/angular-ui-router/release',
          src: '{,*/}*.js',
          dest: '<%= earthAngularProject.dist %>/node_modules/angular-ui-router/release'
        },
		{
          expand: true,
          cwd: 'node_modules/bootstrap/dist',
          src: '{,*/}*.*',
          dest: '<%= earthAngularProject.dist %>/node_modules/bootstrap/dist/'
        },
		{
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= earthAngularProject.dist %>/images',
          src: ['generated/*']
        }, {
          expand: true,
          cwd: 'node_modules/bootstrap/dist',
          src: 'fonts/*',
          dest: '<%= earthAngularProject.dist %>'
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= earthAngularProject.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'copy:styles'
      ],
      test: [
        'copy:styles'
      ],
      dist: [
        'copy:styles'
      ]
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      }
    }
  });
  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }
    grunt.task.run([
      'clean:server',
      'concurrent:server',
      'autoprefixer:server',
      'connect:livereload',
      'watch'
    ]);
  });
  grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });
  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    
    'useminPrepare',
    'concat',
    'concurrent:dist',
    'autoprefixer',
    'ngAnnotate',
    'cssmin',
    'copy:dist',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);
};
