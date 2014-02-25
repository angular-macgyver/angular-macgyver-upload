/**
 * @chalk
 * @name MacGyver fileupload
 * @description
 * Module for proxying jQuery File Upload
 * NOTE: Additional options can be found at
 * https://github.com/blueimp/jQuery-File-Upload/wiki/Options
 *
 * @dependencies
 * - jQuery
 * - [jQuery file upload](https://github.com/blueimp/jQuery-File-Upload)
 *
 * @param {String} mac-upload-url      File upload url
 * @param {Expr}   mac-upload-files    Array to store uploaded files
 *
 * @param {Expr}   mac-upload-add      Function to call on add
 * @param {Expr}   mac-upload-submit   Function to call on submit
 * @param {Expr}   mac-upload-success  Upload success callback
 * @param {Expr}   mac-upload-error    Upload error callback
 * @param {Expr}   mac-upload-always   Callback for completed (success, abort or error) requests
 * @param {Expr}   mac-upload-progress Callback for upload progress
 * @param {Expr}   mac-upload-stop     Callback for uploads stop
 *
 * @param {Expr}   mac-upload-processstart
 * Callback for the start of the fileupload processing queue
 *
 * @param {Expr}   mac-upload-processstop
 * Callback for the stop of the fileupload processing queue.
 *
 * @param {Expr}   mac-upload-options Additional options to pass to jquery fileupload
 *
 * @param {*} mac-upload-progress Add progress to each file
 * @param {*} mac-upload-previews Add file data to each file using File Reader API
 * @param {String} mac-upload-drop-zone Add drop zone support with CSS selector
 */

(function(window, document, undefined) {'use strict';

angular.module("Mac.Upload", []).
  /**
   * @chalk
   * @name macUploadProvider
   * @description
   * mac-upload provider allowing application to configurate mac-upload defaults
   * in `config` block
   */
  provider("macUpload", function() {
    var defaults = {
      dragoverClass: "droppable",
      emitEvents: [
        'fileuploadadd',
        'fileuploadsubmit',
        'fileuploadsend',
        'fileuploaddone',
        'fileuploadfail',
        'fileuploadalways',
        'fileuploadprogress',
        'fileuploadprogressall',
        'fileuploadstart',
        'fileuploadstop',
        'fileuploadchange',
        'fileuploadpaste',
        'fileuploaddrop',
        'fileuploaddragover',
        'fileuploadchunksend',
        'fileuploadchunkdone',
        'fileuploadchunkfail',
        'fileuploadchunkalways',
        'fileuploadprocessstart',
        'fileuploadprocess',
        'fileuploadprocessdone',
        'fileuploadprocessfail',
        'fileuploadprocessalways',
        'fileuploadprocessstop'
      ]
    };

    /**
     * @chalk
     * @name setDefaults
     * @function
     * @description
     * Setting mac-upload defaults
     * @param {String | Object} key Key to update
     */
    this.setDefaults = function(key, value) {
      if (angular.isObject(key)) {
        angular.extend(defaults, key);
      } else {
        defaults[key] = value;
      }
    };

    this.$get = [function(){
      return {
        defaults: defaults
      };
    }];
  }).

  /**
   * @chalk
   * @name macUploadController
   * @description
   * Controller for mac-upload directive. Expose callback functions for easier
   * unit testings
   */
  controller("macUploadController", [
    "$scope",
    "$element",
    "$attrs",
    "$parse",
    function($scope, element, attrs, $parse) {
      var ctrl = {
        adders: [],
        progressors: [],
        uploadOption: function(key, value) {
          // If passed in only an object, travse through each object
          // property
          if (angular.isObject(key)) {
            for (var prop in key) {
              ctrl.uploadOption(prop, key[prop]);
            }

          //Read option
          } else if (angular.isString(key) && value === undefined) {
            return element.fileupload("option", key);

          //Set option based on key and value
          } else {
            element.fileupload("option", key, value);
          }
        },
        invokeCallback: function(action, $event, $data, invokeApply) {
          var normalized = attrs.$normalize("mac-upload-" + action);

          // `invokeApply` default to true
          if (invokeApply === undefined) {
            invokeApply = true;
          }

          if (attrs[normalized]) {
            var $xhr = $data.jqXHR,
                responseText = "",
                locals = {
                  $event: $event,
                  $data: $data
                };

            // `invokeCallback` is designed to be generic to handle most
            // fileupload callbacks. Since $data.jqXHR only comes back
            // with upload request callbacks, $xhr is checked before
            // getting status and response
            if ($xhr !== undefined) {
              locals.$xhr = $xhr;
              locals.$status = $xhr.$status;
              responseText = $xhr.responseText || "";

              try {
                locals.$response = JSON.parse(responseText);
              } catch (err) {
                locals.$response = responseText;
              }
            }

            $parse(attrs[normalized])($scope, locals);

            if (invokeApply) {
              $scope.$apply();
            }
          }
        },
        // Multiple file upload callbacks
        callbacks: {
          add: function($event, $data) {
            if ($event.isDefaultPrevented()){
              return false;
            }

            ctrl.invokeCallback("add", $event, $data);

            angular.forEach(ctrl.adders, function(fn) {
              fn($data);
            });

            $data.process().then(function(){
              if ((ctrl.uploadOption("autoUpload") ||
                  $data.autoUpload) &&
                  $data.autoUpload !== false){
                $data.submit();
              }
            });
          },
          submit: function($event, $data) {
            if ($event.isDefaultPrevented()){
              return false;
            }

            ctrl.invokeCallback("submit", $event, $data);
          },
          fail: function($event, $data) {
            if ($event.isDefaultPrevented()){
              return false;
            }

            ctrl.invokeCallback("fail", $event, $data);
          },
          done: function($event, $data) {
            if ($event.isDefaultPrevented()){
              return false;
            }

            ctrl.invokeCallback("success", $event, $data);
          },
          always: function($event, $data) {
            if ($event.isDefaultPrevented()){
              return false;
            }

            ctrl.invokeCallback("always", $event, $data);
          },
          progress: function($event, $data) {
            if ($event.isDefaultPrevented()){
              return false;
            }

            angular.forEach(ctrl.progressors, function(fn){
              fn($data);
            });

            ctrl.invokeCallback("progress", $event, $data);
          },
          stop: function($event) {
            ctrl.invokeCallback("stop", $event);
          },
          processstart: function($event) {
            ctrl.invokeCallback("processstart", $event);
          },
          processstop: function($event) {
            ctrl.invokeCallback("processstop", $event);
          }
        }
      };
      return ctrl;
    }
  ]).

  /**
   * @chalk
   * @name macUpload
   * @description
   * Main upload directive for initializing file upload on file type input
   */
  directive("macUpload", [
    "$parse",
    "macUpload",
    function($parse, macUpload) {
      return {
        require:    "macUpload",
        controller: "macUploadController",
        link: function($scope, element, attrs, uploadCtrl) {
          var options = {},
              defaults = macUpload.defaults;

          options.url = $parse(attrs.macUploadUrl)($scope) || "";

          element.fileupload(angular.extend(options, uploadCtrl.callbacks, {
            pasteZone: null,
            replaceFileInput: false
          })).
          on(defaults.emitEvents.join(' '), function(event, data) {
            $scope.$emit(event.type, data);
          });
        }
      };
    }
  ]).

  /**
   * @chalk
   * @name macUploadPreviewsController
   * @description
   * Controller for mac-upload-previews directive used for reading file content
   * using FileReader API
   */
  controller("macUploadPreviewsController", [
    function() {
      /**
       * @name type
       * @function
       * @description
       * Get the class of the object
       * @param {Object} object Any object
       * @returns {String} Object class name
       */
      this.class = function(object) {
        return Object.prototype.toString.call(object).slice(8, -1);
      };

      /**
       * @name isFileSupported
       * @function
       * @description
       * Check if browser support file reader
       * @returns {Boolean} if file reader is supported
       */
      this.isFileSupported = function() {
        return window.FileReader && window.File && window.FileList;
      };

      /**
       * @name readFiles
       * @function
       * @description
       * Read file data using file reader API
       * @param {Array} files Array of files
       */
      this.readFiles = function(files) {
        var reader, readFile, self = this;

        if (!this.sFileSupported()) {
          return false;
        }

        readFile = function(file) {
          reader = new FileReader();
          reader.onload = function(event) {
            file.data = event.target.result;
          };

          reader.readAsDataURL(file);
        };

        angular.forEach(files, function(file){
          // Make sure items in the array are File class
          if (self.class(file) === "File") {
            readFile(file);
          }
        });

      };
    }
  ]).

  directive("macUploadPreviews", [
    "$rootScope",
    function($rootScope) {
      return {
        restrict: "A",
        require: ["macUploadPreviews", "macUpload"],
        controller: "macUploadPreviewsController",
        link: function($scope, element, attrs, ctrls) {
          var previewsCtrl = ctrls[0],
              uploadCtrl = ctrls[1],
              adder = function($data) {
                previewsCtrl.readFiles($data.files);
              };

          uploadCtrl.adders.push(adder);
        }
      };
    }
  ]).

  /*
  @chalk
  @name macUploadProgressController
  @description
  Controller for mac-upload-progress directive. This controller currently has
  one function `updateProgress` to calculate file upload progress.

  @param {Function} updateProgress Update progress
    - {Object} data File upload data from jQuery file upload
    - {Object} file File object stored on preview controller
    - returns {Integer} Upload percentage
  */
  controller("macUploadProgressController", [
    function() {
      this.updateProgress = function(data, file) {
        file.progress = parseInt(data.loaded / data.total * 100, 10);
        return file.progress;
      };
    }
  ]).

  /*
  @chalk
  @name macUploadProgress
  @description
  mac-upload-progress directive. Mostly used for binding controller onto scope
  */
  directive("macUploadProgress", [
    function() {
      return {
        restrict: "A",
        require: ["macUpload", "macUploadProgress", "macUploadFiles"],
        controller: "macUploadProgressController",
        link: function($scope, element, attrs, ctrls) {
          var uploadCtrl = ctrls[0],
              progressCtrl = ctrls[1],
              filesCtrl = ctrls[2],
              progress = function($data) {
                var file = filesCtrl.getFileByFilename($data.files[0].name);

                if (file !== null) {
                  progressCtrl.updateProgress($data, file);
                }
              };

          uploadCtrl.progressors.push(progress);
        }
      };
    }
  ]).

  /**
   * @chalk
   * @name macUploadFilesController
   * @description
   * Controller for mac-upload-files directive to add files capability to mac-upload
   */
  controller("macUploadFilesController", [
    "$scope",
    "$attrs",
    "$parse",
    function($scope, attrs, $parse) {
      var filesGet, filesSet, ctrl = {};

      filesGet = $parse(attrs.macUploadFiles);
      // Similar to how AngularJS handle unassignable variable
      filesSet = filesGet.assign || function() {
        throw new Error(attrs.macUploadFiles + "used with mac-upload is non-assignable");
      };

      ctrl.files = filesGet($scope);

      /**
       * @name getFileByFilename
       * @function
       * @description
       * Get the file in the file list
       * @param {String} filename File name
       */
      ctrl.getFileByFilename = function(filename) {
        var i;

        for (i = ctrl.files.length - 1; i >= 0 ; i--) {
          if (ctrl.files[i].name === filename) {
            return ctrl.files[i];
          }
        }
        return null;
      };

      return ctrl;
    }
  ]).

  directive("macUploadFiles", [
    function() {
      return {
        restrict: "A",
        require: ["macUpload", "macUploadFiles"],
        controller: "macUploadFilesController",
        link: function($scope, element, attrs, ctrls) {
          var uploadCtrl = ctrls[0],
              filesCtrl = ctrls[1],
              adder = function($data) {
                var method = uploadCtrl.uploadOption("prependFiles") ?
                  "unshift" : "push";

                Array.prototype[method].apply(filesCtrl.files, $data.files);
              };

          uploadCtrl.adders.push(adder);
        }
      };
    }
  ]).

  /**
   * @name mac-upload-options directive
   * @description
   * Set additional fileupload options
   */
  directive("macUploadOptions", [
    function() {
      return {
        restrict: "A",
        require: "macUpload",
        priority: 100,
        link: function($scope, element, attrs, ctrls) {
          // Fail silently if options is not defined
          if (!attrs.macUploadOptions) {
            return;
          }

          $scope.$watch(attrs.macUploadOptions, function(newOptions) {
            element.fileupload("option", newOptions);
          });
        }
      };
    }
  ]).

  /**
   * @name mac-upload-drop-zone directive
   * @description
   * Adding dropzone support
   * @param {String} mac-upload-drop-zone CSS selector
   */
  directive("macUploadDropZone", [
    "$document",
    "$timeout",
    "macUpload",
    function($document, $timeout, macUpload) {
      return {
        restrict: "A",
        require: ["macUpload"],
        priority: 100,
        link: function($scope, element, attrs, ctrls) {
          var preventDefault, dragoverCallback, dragoverTimeout, dropZone,
              selector;

          if (!attrs.macUploadDropZone) {
            throw new Error("mac-upload-drop-zone missing selector");
          }

          selector = attrs.macUploadDropZone;
          dropZone = angular.element(selector);

          /**
           * @name preventDefault
           * @function
           * @description
           * Callback for drop and dragover to disable default behavior
           * @param {Event} event jQuery event
           */
          preventDefault = function(event) {
            event.preventDefault();
          };

          /**
           * @name dragoverCallback
           * @function
           * @description
           * Callback for drag zone dragover event
           * @param {Event} event jQuery event
           */
          dragoverCallback = function(event) {
            var node, target, className = macUpload.defaults.dragoverClass;

            if (dragoverTimeout !== null) {
              $timeout.cancel(dragoverTimeout);
            }

            target = angular.element(event.target);
            node = target.is(dropZone) ? dropZone : target.parents(selector);
            if (node.length > 0) {
              dropZone.addClass(className);

              dragoverTimeout = $timeout(function() {
                dropZone.removeClass(className);
              }, 150, false);
            }
          };

          $document.bind("drop dragover", preventDefault);
          dropZone.bind("dragover", dragoverCallback);

          // Remove all bindings when fileupload element is removed
          $scope.$on("$destroy", function() {
            $document.unbind("drop dragover", preventDefault);
            dropZone.unbind("dragover", dragoverCallback);
          });

          // Initialize dropZone support on jQuery file upload
          element.fileupload("option", "dropZone", dropZone);
        }
      };
    }
  ]);

})(window, document);
