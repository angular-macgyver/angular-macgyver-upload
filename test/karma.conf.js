module.exports = function(config) {
  config.set({
    basePath: "../",
    frameworks: ["jasmine"],
    files: [
      "bower_components/jquery/dist/jquery.js",
      "bower_components/angular/angular.js",
      "bower_components/angular-mocks/angular-mocks.js",
      "bower_components/jquery-file-upload/js/vendor/jquery.ui.widget.js",
      "bower_components/jquery-file-upload/js/jquery.fileupload.js",

      "upload.js",

      "test/unit/*.spec.js"
    ],
    reporters: ["dots"],
    colors: true,
    autoWatch: false,
    browsers: ["PhantomJS"],
    plugins: [
      "karma-jasmine",
      "karma-phantomjs-launcher"
    ]
  });
}
