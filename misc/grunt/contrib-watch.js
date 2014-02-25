module.exports = function(grunt) {
  grunt.config("watch", {
    src: {
      files: "upload.js",
      tasks: ["jshint", "karma:src:run"]
    },
    unit: {
      files: ["test/unit/*.spec.js"],
      tasks: ["karma:src:run"]
    }
  })
}
