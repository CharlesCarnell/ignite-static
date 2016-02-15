module.exports = function(grunt) {
	require('jit-grunt')(grunt, {
		replace: 'grunt-text-replace',
		aws_s3: 'grunt-aws-s3',
	});

	require('time-grunt')(grunt);
	grunt.loadNpmTasks('grunt-contrib-compress');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		'connect': {
			server: {
				options: {
					hostname: '0.0.0.0',
					port: 9000,
					base: '.',
					livereload: true,
					open: {
						target: 'http://localhost:9000/templates'
					}
				}
			}
		},

		compress: {
			prod: {
				options: {
					mode: 'gzip'
				},
				files: [
					{
						expand: true,
						src: ['assets/js/main.min.js', 'assets/js/vendor.min.js'],
						ext: '.min.js.gz'
					},
					{
						expand: true,
						src: ['assets/css/style.min.css'],
						ext: '.min.css.gz'
					},
					{
						expand: true,
						src: ['assets/images/icons-sprite.svg'],
						ext: '.svg.gz'
					}
				]
			}
		},

		bless: {
			css: {
				options: {

				},
				files: {
					'assets/css/style.bless.min.css': 'assets/css/style.min.css'
				}
			}
		},

		'sass': {
			options: {
			},
			dist: {
				files: {
					'assets/css/style.css': 'assets/scss/style.scss'
				}
			}
		},

		'watch': {
			grunt: {
				files: ['Gruntfile.js']
			},

			sass: {
				files: ['assets/scss/**/*.scss'],
				tasks: ['sass'],
			},

			livereload: {
				options: { livereload: true },
				files: ['assets/css/style.css', 'templates/*.html', 'assets/js/main.js']
			}
		},

		'cssmin': {
			options: {
				banner: '/*! <%= pkg.name %> compiled at <%= grunt.template.today("yyyy-mm-dd HH:MM") %> */',
        compatibility: 'ie7',
        noAdvanced: true
			},
			dist: {
				src: 'assets/css/style.css',
				dest: 'assets/css/style.min.css'
			}
		},

		'uglify': {
			options: {
				banner: '/*! <%= pkg.name %> compiled at <%= grunt.template.today("yyyy-mm-dd HH:MM") %> */\n'
			},
			dist: {
				files: {
					'assets/js/main.min.js': ['assets/js/main.js'],
					'assets/js/vendor.min.js': ['assets/js/vendor.js']
				}
			}
		},

		'dr-svg-sprites': {
			options: {
				cssPngPrefix: '.no-svg',
				layout: 'horizontal',
				cssIncludeElementSizes: 'false',
				cssPrefix: '_ui',
				unit: 12,
				previewPath: 'assets/images',
				map: function (name) {
					return name.split().reverse().join();
				}
			},
			'icons': {
				options: {
					spriteElementPath: 'assets/images/uncompressed/sprites/*.svg',
					spritePath:  'assets/images',
					cssPath: 'assets/scss',
					cssSuffix: 'scss',
					// cssUnit: "rem",
					// cssIncludeElementSizes: 'false',
				}
			}
		},

		'imagemin': {
			dynamic: {
				options: {
					optimizationLevel: 7
				},
				files: [
					{
						// Set to true to enable the following options…
						expand: true,
						// cwd is 'current working directory'
						cwd: 'assets/images/uncompressed',
						src: ['**/*.{png,jpg,gif,svg}'],
						// Could also match cwd. i.e. project-directory/img/
						dest: 'assets/images/',
					}
				]
			}
		},

		'concat': {
			options: {
				separator: ';',
			},
			dist: {
				src: [
					'assets/js/jquery.js',
					'assets/js/vendor/webfont.js',
					'assets/js/vendor/isotope.js',
					'assets/js/vendor/jquery-ui.min.js',
					'assets/js/vendor/fastclick.js',
					'assets/js/vendor/jquery-accessibleMegaMenu.js',
					'assets/foundation/js/foundation.min.js',
					'assets/js/owl.carousel.js',
					'assets/js/lazyload.js',
					'assets/js/stacktable.js',
					'assets/js/magnific-popup.js',
					'assets/js/google-analytics.js',
					'assets/js/google-map-api-v3.js',
					'assets/js/skrollr.min.js'
				],
				dest: 'assets/js/vendor.js',
			}
		},

		'replace': {
			dist: {
				src: ['assets/css/style.min.css'],
				dest: 'assets/css/style.min.css',
				replacements: [
					{
						from: 'background-image: url("../images/icons-sprite.svg");',
						to: 'background-image: url("../images/icons-sprite.svg.gz");'
					}
				]
			}
		},

		'jshint': {
			options: {
				quotmark: 'single'
			},
			gruntfile: ['gruntfile.js'],
			main: ['assets/js/main.js']
		},

		'concurrent': {
			first: {
				options: {
				},
				tasks: ['newer:uglify', 'cssmin']
			},
			firstForce: {
				options: {
				},
				tasks: ['uglify', 'cssmin']
			}
		}
	});



	// JSHint
	grunt.registerTask('test', function( a ){
		if( a ){
			grunt.task.run('jshint:' + a);
		} else {
			grunt.task.run('jshint');
		}
	});

	// Build
	grunt.registerTask('build', ['newer:concat', 'sass', 'concurrent:first', 'replace:dist', 'compress', 'bless']);
	grunt.registerTask('build-force', ['concat', 'sass', 'concurrent:firstForce', 'replace:dist', 'compress', 'bless']);

	// Sprites + Build
	grunt.registerTask('build-sprites', function(){
		//grunt.task.run('imagemin');
		grunt.task.run('dr-svg-sprites');
		grunt.task.run('build-force');
	});

	// Start server
	grunt.registerTask('serve', function(){
		grunt.task.run('server');
	});
	grunt.registerTask('server', ['connect', 'watch']);

	// Deploy
	grunt.registerTask('deployec2', function( a ){
		grunt.task.run('build-force');
		grunt.task.run('build-force');
		grunt.task.run('rsync:' + a);
	});
	// Deploy
	grunt.registerTask('deploys3', function( a ){
		grunt.task.run('build-force');
		grunt.task.run('build-force');
		grunt.task.run('aws_s3:' + a);
	});
};
