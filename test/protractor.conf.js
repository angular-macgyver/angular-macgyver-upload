exports.config = {
  specs: ["test/e2e/*.spec.js"],
  baseUrl: "http://localhost:9001",
  framework: "jasmine",

  onPrepare: function() {
    var disableNgAnimate;
    disableNgAnimate = function() {
      return angular.module('disableNgAnimate', []).run(function($animate) {
        return $animate.enabled(false);
      });
    };
    return browser.addMockModule('disableNgAnimate', disableNgAnimate);
  }
}
