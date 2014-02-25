describe("macUpload Progress Controller", function() {
  var progressCtrl;

  beforeEach(function() {
    module("Mac.Upload");

    inject(function($controller, _$compile_) {
      progressCtrl = $controller("macUploadProgressController");
    });
  });

  it("should calculate the progress", function() {
    var file = {};
    progressCtrl.updateProgress({loaded: 500, total: 1000}, file);
    expect(file.progress).toBe(50);
  });
});

describe("macUpload Progress Directive", function() {
  var element, macUploadCtrl, $compile, scope;

  beforeEach(function(){
    var directive;
    module("Mac.Upload");

    module(function($compileProvider){
      directive = $compileProvider.directive;
      directive("testDirective", function(){
        return {
          restrict: "A",
          require: "macUpload",
          link: function($scope, $element, attrs, ctrl) {
            macUploadCtrl = ctrl;
          }
        };
      });
    });

    inject(function($rootScope, _$compile_) {
      scope = $rootScope.$new();
      $compile = _$compile_;
      element = $compile("<input type='file' mac-upload mac-upload-progress mac-upload-files='files' test-directive />")(scope);
    });
  });

  it("should throw without mac-upload-files", function() {
    var fn = function() {
      $compile("<input type='file' mac-upload mac-upload-progress test-directive />")(scope);
    };
    expect(fn).toThrow()
  });

  it("should add a function to progressors", function() {
    expect(macUploadCtrl.progressors.length).toBe(1);
  });
});
