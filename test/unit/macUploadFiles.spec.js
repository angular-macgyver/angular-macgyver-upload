'use strict';

describe("macUpload Files Controller", function() {
  var filesCtrl;

  beforeEach(function() {
    module("Mac.Upload");

    inject(function($controller, _$compile_, $rootScope) {
      var scope = $rootScope.$new();
      filesCtrl = $controller("macUploadFilesController", {
        $scope: scope,
        $attrs: {}
      });
    });
  });

  it("should get the correct file", function(){
    filesCtrl.files = [
      {name: "file1"},
      {name: "file2"}
    ];

    var file = filesCtrl.getFileByFilename("file1");
    expect(file.name).toBe("file1");
  });

  it("should return null when no file exist", function() {
    filesCtrl.files = [
      {name: "file1"},
      {name: "file2"}
    ];

    var file = filesCtrl.getFileByFilename("file3");
    expect(file).toBe(null);
  });
});

describe("macUpload Files Directive", function() {
  var element, filesCtrl, uploadCtrl, scope;

  beforeEach(function(){
    var directive;
    module("Mac.Upload");

    module(function($compileProvider){
      directive = $compileProvider.directive;
      directive("testDirective", function(){
        return {
          restrict: "A",
          require: ["macUpload", "macUploadFiles"],
          link: function($scope, $element, attrs, ctrls) {
            uploadCtrl = ctrls[0];
            filesCtrl = ctrls[1];
          }
        };
      });
    });

    inject(function($rootScope, $compile) {
      scope = $rootScope.$new();
      scope.test = [{name: "123"}];

      element = $compile("<input type='file' mac-upload mac-upload-files='test' test-directive />")(scope);
      scope.$digest();
    });
  });

  it("should have the same array", function() {
    expect(filesCtrl.files).toBe(scope.test);
  });

  it("should add a function to adders", function() {
    expect(uploadCtrl.adders.length).toBe(1);
  });

  it("should push to the end of the array", function(){
    uploadCtrl.adders[0]({files: [{name: "321"}]});
    expect(filesCtrl.files[1].name).toBe("321");
  });

  it("should add to the front of the array", function(){
    uploadCtrl.uploadOption("prependFiles", true);
    uploadCtrl.adders[0]({files: [{name: "321"}]});
    expect(filesCtrl.files[0].name).toBe("321");
  });
});
