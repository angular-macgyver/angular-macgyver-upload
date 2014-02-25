module.exports = function(grunt) {
  grunt.config("jshint", {
    options: {
      eqeqeq: true,
      eqnull: true,
      undef: true,
      //unused: true,
      strict: true,
      trailing: true,
      curly: true,
      browser: true,
      globals: {
        angular: true,
        console: true
      }
    },
    files: {
      src: ["upload.js"]
    }
  });
}
