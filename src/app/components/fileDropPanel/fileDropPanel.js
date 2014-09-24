angular.module('skybrand.filedroppanel', [
  'templates-app',
  'skybrand.model',
  'skybrand.filereader'
])

.directive('fileDropPanel', ['$parse', 'fileReaderService', 'modelService', '$filter', '$rootScope',
  function($parse, fileReaderService, modelService, $filter, $rootScope) {
    return {
      restrict: "A",
      scope: {
        fileDropPanel: '=fileDropPanel',
        message: '@'
      },
      transclude: true,
      template: '<div>'+
          '<div class="header" data-ng-transclude>'+
          '</div>'+
          '<div class="drop-panel" >'+
            '<span data-ng-show="!modelService.cms.isIE8 && !modelService.cms.isIE9" class="ng-hide"><span data-ng-bind="message"></span><br/>Max single file size is 2GB</span>'+
            '<span class="ng-hide" data-ng-show="(modelService.cms.isIE8 || modelService.cms.isIE9) && modelService.cms.hasFlash">Use the \'Add files\' button to start adding files</span>'+
            '<span data-ng-show="(modelService.cms.isIE8 || modelService.cms.isIE9) && !modelService.cms.hasFlash">'+
              'Flash Player not detected. This website requires Flash v10 or above to upload assets. Please install Flash Player 10 then use the \'Add files\' button to start adding files.'+
            '</span>'+
          '</div>'+
        '</div>',
      replace: false,
      link: function(scope, element, attrs) {

        scope.modelService = modelService;
        
        if(typeof scope.message === 'undefined') {
          scope.message = 'Drag and drop multiple files here';
        }
        
        element.addClass('wrap-file-drop-panel');

        var onDragOver = function(e) {
          e.preventDefault();
          element.addClass("dragOver");
        };

        var onDragEnd = function(e) {
          e.preventDefault();
          element.removeClass("dragOver");
        };

        var resampleImage = function(imageData) {
          return resampler.resample(
            imageData, element.width(),
            element.height(), scope);
        };

        var loadFile = function(file) {
          fileReaderService
            .createObjectURL(file, scope)
            .then(function(imageData) {
              scope.fileDropPanel[0].thumb = imageData;
              scope.fileDropPanel[0].thumb_default = false;
            });
        };

        element.bind("dragover", onDragOver)
          .bind("dragleave", onDragEnd)
          .bind("drop", function(e) {
            onDragEnd(e);

            var valid_ext = true;

            angular.forEach(e.originalEvent.dataTransfer.files, function(value, key) {
              var ext = $filter('ext')(value.name),
                  allowed_ext = "jpg,jpeg,gif,tiff,tif,png,psd,psb,zip,rar,tar,gzip,txt,doc,docx,xls,xlsx,ppt,pptx,pdf,rtf,mp3,ogg,wav,mov,mp4,f4v,flv,c4d,swf,eps,avi,ai,mpg,tga,ttf,JPG,JPEG,GIF,TIFF,TIF,PNG,PSD,PSB,ZIP,RAR,TAR,GZIP,TXT,DOC,DOCX,XLS,XLSX,PPT,PPTX,PDF,RTF,MP3,OGG,WAV,MOV,MP4,F4V,FLV,C4D,SWF,EPS,AVI,AI,MPG,TGA,TTF".split(',')
              ;
              if($.inArray(ext, allowed_ext) === -1) {
                $rootScope.lightbox.open({type: 'confirmation.error', message1: 'File type not allowed: ' + value.name});
                valid_ext = false;
                return false;
              }
              if(value.size > 2147483648) {
                $rootScope.lightbox.open({type: 'confirmation.error', message1: 'File too large. Must be less than 2GB'});
                valid_ext = false;
                return false;
              }
            });

            if(!valid_ext) {
              return false;
            }

            if (typeof attrs.fileDropPanelPreview !== 'undefined') {
              if (!scope.fileDropPanel.length) {
                scope.fileDropPanel.push(e.originalEvent.dataTransfer.files[0]);
              } else {
                scope.fileDropPanel[0] = e.originalEvent.dataTransfer.files[0];
              }
              loadFile(scope.fileDropPanel[0]);
            } else {
              angular.forEach(e.originalEvent.dataTransfer.files, function(value, key) {
                scope.$apply(function() {
                  scope.fileDropPanel.push(value);
                });
              });
            }

            if (attrs.onLoaded) {
              scope.$apply(function() {
                scope.$parent.$eval(attrs.onLoaded);
              });
            }

          });

      }
    };
  }
])

;