module.exports = function(grunt) {
  grunt.config("karma", {
    options: {
      configFile: "test/karma.conf.js"
    },
    src: {
      background: true
    },
    travis: {
      singleRun: true
    }
  });
};
