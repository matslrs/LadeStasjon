module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
	  wiredep: {
	        target: {
	          src: '*.html' // point to your HTML file.
	        }
	      },
		  sass: {                              // Task
		      dist: {                            // Target
		        options: {                       // Target options
		          style: 'expanded'
		        },
		        files: {                         // Dictionary of files
		          'main.css': 'main.scss',       // 'destination': 'source'
		          'widgets.css': 'widgets.scss'
		        }
		      }
		    }
  });
  
  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-contrib-sass');
  // Default task(s).
  grunt.registerTask('default', ['wiredep', 'sass']);

};