MacGyver Upload
===

MacGyver upload is a file upload directive using [jQuery File Upload](https://github.com/blueimp/jQuery-File-Upload)

[![Build Status](https://travis-ci.org/angular-macgyver/angular-macgyver-upload.png?branch=master)](https://travis-ci.org/angular-macgyver/angular-macgyver-upload)

## Using MacGyver File Upload

```js
angular.module("myModule", ["Mac.Upload"]);
```

## Code Example
```html
<input type="file"
  mac-upload
  mac-upload-url="url"
  mac-upload-add="add($event)"
/>
```

#### Additional attributes:
```js
/**
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
```

## Dependencies
- AngularJS
- jQuery
- jQuery UI Widget
- jQuery file upload

## TODO
- More unit tests
- e2e Protractor tests
- Documentations
- Bugs

## Getting Started On Development
#### Install all node packages

  `npm install`
  
#### Install Bower and Grunt globally

  `sudo npm -g install grunt-cli bower`
  
#### Fetch dependencies

  `bower install`
  
#### Starting Grunt
To run the watch process and a connect server

  `grunt dev`

## Author

**Adrian Lee**
+ <http://twitter.com/adrianthemole>
+ <http://github.com/adrianlee44>
