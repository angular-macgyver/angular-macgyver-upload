describe("macUpload options", function() {
  var element, scope;
  beforeEach(function() {
    module("Mac.Upload");

    inject(function($rootScope, $compile) {
      scope = $rootScope.$new();
      scope.options = {}

      element = $compile("<input type='file' mac-upload mac-upload-options='options' />")(scope);
      scope.$digest();
    });
  });

  it("should update options when scope variable changes", function() {
    scope.options.progressInterval = 99;
    scope.$digest();

    expect(element.fileupload("option", "progressInterval")).toBe(99);
  });

  it("should throw when mac-upload directive is missing", function() {
    var fn = function() {
      inject(function($compile) {
        $compile("<input type='file' mac-upload-options='options' />")(scope);
      });
    };

    expect(fn).toThrow();
  });
});
