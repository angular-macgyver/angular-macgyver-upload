'use strict';

describe("macUploadController", function() {
  var macUploadCtrl, scope, element, directive, $compile, $controller;

  beforeEach(function() {
    module("Mac.Upload");
    module(function($compileProvider){
      directive = $compileProvider.directive;
    });

    inject(function($rootScope, _$controller_, _$compile_) {
      scope = $rootScope.$new();
      $compile = _$compile_;
      $controller = _$controller_;
      element = angular.element("<input type='file' />").fileupload();

      macUploadCtrl = $controller("macUploadController", {
        $scope: scope,
        $element: element,
        $attrs: {}
      });
    });
  });

  it("should have adders", function() {
    expect(macUploadCtrl.adders).toBeDefined();
  });

  it("should have progressors", function() {
    expect(macUploadCtrl.progressors).toBeDefined();
  });

  it("should read the default option", function() {
    expect(macUploadCtrl.uploadOption("progressInterval")).toBe(100);
  });

  it("should update option", function() {
    macUploadCtrl.uploadOption("progressInterval", 999);
    expect(element.fileupload("option", "progressInterval")).toBe(999);
  });

  it("should update options with object", function() {
    macUploadCtrl.uploadOption({
      progressInterval: 999,
      recalculateProgress: false
    });
    expect(element.fileupload("option", "progressInterval")).toBe(999);
  });

  describe("invokeCallback", function(){
    var tempController;

    beforeEach(function(){
      directive("testDirective", function(){
        return {
          restrict: "A",
          link: function($scope, $element, attrs, ctrl) {
            tempController = $controller("macUploadController", {
              $scope: $scope,
              $element: $element,
              $attrs: attrs
            });
          }
        };
      });
    });

    afterEach(function() {
      tempController = null;
    });

    it("should invoke the callback", function() {
      scope.callback = jasmine.createSpy("callback");
      $compile("<input type='file' test-directive mac-upload-add='callback()' />")(scope);
      tempController.invokeCallback("add", jQuery.Event(), {});

      expect(scope.callback).toHaveBeenCalled();
    });

    it("should get $data", function() {
      var match;

      scope.callback = function(data) {
        expect(data.test).toBe("test");
      };
      $compile("<input type='file' test-directive mac-upload-add='callback($data)' />")(scope);

      tempController.invokeCallback("add", jQuery.Event(), {test: "test"});
    });

    it("should get $xhr", function() {
      var match;

      scope.callback = function(data) {
        expect(data.$status).toBe(200);
        expect(data.responseText).toBe("{}");
      };
      $compile("<input type='file' test-directive mac-upload-add='callback($xhr)' />")(scope);

      tempController.invokeCallback("add", jQuery.Event(), {jqXHR: {$status: 200, responseText: "{}"}});
    });

    it("should get $status and $response", function() {
      var match;

      scope.callback = function(status, response) {
        expect(status).toBe(200);
        expect(response.test).toBe("test");
      };
      $compile("<input type='file' test-directive mac-upload-add='callback($status, $response)' />")(scope);

      tempController.invokeCallback("add", jQuery.Event(), {jqXHR: {$status: 200, responseText: "{\"test\": \"test\"}"}});
    });

    it("should invoke all the functions in adders", function() {
      var adder1 = jasmine.createSpy("adder1"), adder2 = jasmine.createSpy("adder2");

      $compile("<input type='file' test-directive />")(scope);

      tempController.adders.push(adder1);
      tempController.adders.push(adder2);

      tempController.callbacks.add(jQuery.Event(), {process: jQuery.Deferred});

      expect(adder1).toHaveBeenCalled();
      expect(adder2).toHaveBeenCalled();
    });

    it("should invoke all the functions in progressors", function() {
      var progressor1 = jasmine.createSpy("adder1"), progressor2 = jasmine.createSpy("adder2");

      $compile("<input type='file' test-directive />")(scope);

      tempController.progressors.push(progressor1);
      tempController.progressors.push(progressor2);

      tempController.callbacks.progress(jQuery.Event(), {process: jQuery.Deferred});

      expect(progressor1).toHaveBeenCalled();
      expect(progressor2).toHaveBeenCalled();
    });
  });
});

describe("macUpload directive", function() {
  var $compile, scope;

  beforeEach(function() {
    module("Mac.Upload");

    inject(function($rootScope, _$compile_) {
      $compile = _$compile_;
      scope = $rootScope.$new()
    });
  });

  it("should initialize jQuery file upload", function() {
    var element, exceptionCheck;

    element = $compile("<input type='type' mac-upload />")(scope);

    exceptionCheck = function() {
      element.fileupload("option", "progressInterval");
    };

    expect(exceptionCheck).not.toThrow()
  });

  it("should set the url", function() {
    var element;
    scope.url = "http://www.example.com";

    element = $compile("<input type='type' mac-upload mac-upload-url='url' />")(scope);

    expect(element.fileupload("option", "url")).toBe("http://www.example.com");
  });
});
