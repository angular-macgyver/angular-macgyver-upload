module.exports = function(grunt) {
  grunt.config("connect", {
    dev: {
      options: {
        port:     9001,
        hostname: "0.0.0.0"
      }
    }
  });
}
