module.exports = function(grunt) { 
	grunt.initConfig({ pkg: grunt.file.readJSON('package.json'), 
		
		less: {
			development: {
				options: {
					paths: 'css/less',
					yuicompress: true
				},
					files: {
					'css/style.css': 'css/less/style.less'
				}
			}
		},

		watch: {
			less: {
				files: 'css/less/*.less',
				tasks: 'less'
			},
			sass: {
				files: 'css/sass/*.scss',
				tasks: 'sass'
			}
		},

		sass: {
		    // this is the "dev" Sass config used with "grunt watch" command
            dev: {
                options: {
                    style: 'expanded',
                    // tell Sass to look in the Bootstrap stylesheets directory when compiling
                    loadPath: 'node_modules/bootstrap-sass/assets/stylesheets'
                },
                files: {
		       		'css/themeStyle.css': 'css/sass/style.scss'
		     	}
            },
            // this is the "production" Sass config used with the "grunt buildcss" command
            dist: {
                options: {
                    style: 'compressed',
                    loadPath: 'node_modules/bootstrap-sass/assets/stylesheets'
                },
                files: {
			    	'css/themeStyle.css': 'css/sass/style.scss'
			    }
            }
	  	},

		wiredep: {
	        target: {
	          	src: '*.html' // point to your HTML file.
	        }
	  	},
	});

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-wiredep');

}