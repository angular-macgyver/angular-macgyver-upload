describe("macUpload Previews Controller", function() {
  var previewsCtrl;

  beforeEach(function() {
    module("Mac.Upload");

    inject(function($controller, _$compile_) {
      previewsCtrl = $controller("macUploadPreviewsController");
    });
  });

  it("should return class as Object", function() {
    var temp = {};
    expect(previewsCtrl.class(temp)).toBe("Object");
  });

  it("should return class as File", function() {
    var BlobBuilder = window.MozBlobBuilder || window.WebKitBlobBuilder,
        file = new BlobBuilder();

    expect(previewsCtrl.class(file)).toBe("WebKitBlobBuilder");
  });
});

describe("macUpload Previews Directive", function() {
  var element, macUploadCtrl;

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

    inject(function($rootScope, $compile) {
      scope = $rootScope.$new();
      element = $compile("<input type='file' mac-upload mac-upload-previews test-directive />")(scope);
    });
  });

  it("should add a function to adders", function() {
    expect(macUploadCtrl.adders.length).toBe(1);
  });


});
