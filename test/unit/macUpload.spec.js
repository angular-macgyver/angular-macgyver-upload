'use strict';

describe("macUpload provider and service", function() {

  beforeEach(function(){
    module("Mac.Upload");
  });

  it("should get default", function(){
    inject(function(macUpload) {
      expect(macUpload.defaults.dragoverClass, "droppable");
    });

  });

  it("should update default", function(){
    module(function(macUploadProvider) {
      macUploadProvider.setDefaults("dragoverClass", "testing");
    });
    inject(function(macUpload) {
      expect(macUpload.defaults.dragoverClass, "testing");
    });
  });
});
