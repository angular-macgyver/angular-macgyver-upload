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