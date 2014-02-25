module.exports = function(grunt) {
  require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    bower: grunt.file.readJSON("bower.json")
  });

  grunt.loadTasks("misc/grunt");

  grunt.registerTask("dev", [
    "karma:src",
    "connect",
    "watch"
  ]);
}
