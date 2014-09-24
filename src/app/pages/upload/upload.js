angular.module( 'skybrand.upload', [
  'ui.state',
  'skybrand.model',
  'skybrand.filereader',
  'skybrand.utilities',
  'fidi.uploader'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'upload', {
    url: '/upload',
    views: {
      "main": {
        controller: 'UploadCtrl',
        templateUrl: 'pages/upload/upload.tpl.html'
      }
    },
    resolve: {
      access: function(utilitiesService, $q) {

        var 
          deferred = $q.defer()
        ;
        
        //check permissions
        utilitiesService.assurePermissions(['asset-upload'], deferred);

        return deferred.promise;
      }
    },
    data:{ 
      pageTitle: 'Upload assets' 
    }
  });
})

.controller( 'UploadCtrl', function UploadController( $scope, $stateParams, $rootScope, modelService, serverService, $timeout, utilitiesService, fileReaderService, $q, uploaderService ) { 
  
  uploaderService.setConfig({
    'url': '/api/assets/add',
    'flash_swf_url': modelService.cms.config.urls.local_templates + modelService.cms.env +'/assets/others/Moxie.swf',
    'silverlight_xap_url': modelService.cms.config.urls.local_templates + modelService.cms.env +'/assets/others/Moxie.xap'
  });

  utilitiesService.filters.reset();

  $scope.modelService = modelService;
  $scope.utilitiesService = utilitiesService;
  $scope.selectedFile = null;
  $scope.filters = {
    selected: {},
    available: angular.copy(modelService.filters.available)
  };
  $scope.uploadFailures = [];
  $scope.files = [];
  $scope.replacementAssetPage = 1;
  $scope.allowedThumbFiles = [{title : "Image files", extensions : "jpg,jpeg,gif,png"}];
  $scope.runningUploads = 0;
  
  $scope.$watch('selectedFile', function(newVal, oldVal) {
    if (newVal === oldVal) {
      return false;
    }
    if (!newVal.done && !newVal.uploading && !newVal.touched) {
      newVal.filters = angular.copy(modelService.filters.available);
      newVal.filters.main_categories[0].selected = true;
      newVal.asset_main_category = newVal.filters.main_categories[0];
      newVal.country = newVal.filters.countries[2];
      newVal.filters.countries[2].selected = true;
      newVal._is_new = true;
      newVal.touched = true;
    }
  });

  $scope.loadMoreReplacements = function(){
    $scope.replacementAssetPage++;
    $scope.loadingReplacements = true;
    serverService.assets.get({'title': $scope.selectedFile.filters.title_to_replace, page: $scope.replacementAssetPage, items_per_page: 6}).then(function(result){      
      $scope.loadingReplacements = false;
      $scope.assetsToReplace.records = $scope.assetsToReplace.records.concat(result.records);
      $scope.assetsToReplace.total = result.total;
    });
  };

  $scope.clearReplacement = function(){
    $scope.replacementAssetPage = 1;
    $scope.assetsToReplace = null;
    $scope.selectedFile.filters.asset_to_replace = null;
    $scope.selectedFile.filters.title_to_replace = null;
  };

  $scope.$watch('selectedFile.filters.title_to_replace', function(newVal, oldVal) {
    if (!newVal || !newVal.length) {
      return false;
    }
    $scope.replacementAssetPage = 1;
    $scope.loadingReplacements = true;
    serverService.assets.get({'title': newVal, page: $scope.replacementAssetPage, items_per_page: 6}).then(function(result){    
      $scope.assetsToReplace = result;
      $scope.loadingReplacements = false;
    });

  });

  $scope.clearSiblings = function(collection, option) {
    angular.forEach(collection, function(value, index) {
      if (option.value !== value.value) {
        value.selected = false;
      }
    });
  };

  $scope.recheckTitle = function(){
    var origTitle = $scope.selectedFile.filters.title;
    $scope.selectedFile.filters.title = '';
    $timeout(function(){
      $scope.selectedFile.filters.title = origTitle;
    });
  };

  $scope.showGuide = function(collection, option) {
    $rootScope.lightbox.open({type: 'assets.guide.naming'});
  };

  $scope.selectFirst = function() {
    if(!$scope.selectedFile) {
      $scope.select($scope.files[0]);
    }
  };

  $scope.countLeft = function() {
    var count = 0;
    angular.forEach($scope.files, function(value, key) {
      if (!value.done) {
        count += 1;
      }
    });
    return count;
  };

  $scope.addThumb = function() {
    $scope.selectedFile.fields.thumb[0] = $scope.selectedFile.fields.thumb[$scope.selectedFile.fields.thumb.length - 1];
    if(modelService.cms.isIE8 || modelService.cms.isIE9) {
      $scope.selectedFile.fields.thumb[0].thumb = $scope.selectedFile.fields.thumb[$scope.selectedFile.fields.thumb.length - 1].name;
      $scope.selectedFile.fields.thumb[0].thumb_default = false;
      $scope.customThumbSelected = true;
      return false;
    }
    $timeout(function() {
      fileReaderService
        .createObjectURL($scope.selectedFile.fields.thumb[0].getNative(), $scope)
        .then(function(imageData) {
          $scope.selectedFile.fields.thumb[0].thumb = imageData;
          $scope.selectedFile.fields.thumb[0].thumb_default = false;
        });
    });

    $scope.customThumbSelected = true;

  };
  
  $scope.restoreDefaultThumb = function() {

    var thumb = utilitiesService.files.getThumb($scope.selectedFile);

    if (modelService.cms.isIE8 || modelService.cms.isIE9) {   
      $scope.selectedFile.fields.thumb[0] = {
        'thumb': thumb,
        'thumb_default': true
      };
      $scope.customThumbSelected = false;
      return true;
    }

    if(thumb instanceof File) {
      fileReaderService
        .createObjectURL(thumb, $scope)
        .then(function(imageData) {
          $scope.selectedFile.fields.thumb[0] = {
            'thumb': imageData,
            'thumb_default': true
          };
        });
    }
    else if (thumb instanceof plupload.File) {
      fileReaderService
        .createObjectURL(thumb.getNative(), $scope)
        .then(function(imageData) {
          $scope.selectedFile.fields.thumb[0] = {
            'thumb': imageData,
            'thumb_default': true
          };
        });
    } else {
      $scope.selectedFile.fields.thumb[0] = {
        'thumb': thumb,
        'thumb_default': true
      };
    }

    $scope.customThumbSelected = false;

  };

  $scope.select = function(asset) {

      $scope.selectedFile = asset;
      if (typeof $scope.selectedFile.fields === 'undefined') {
        $scope.selectedFile.fields = {
          'thumb': []
        };
      }
      if (typeof $scope.selectedFile.fields.thumb === 'undefined') {
        $scope.selectedFile.fields.thumb = [];
      }
      if (!$scope.selectedFile.fields.thumb.length) {
        var thumb = utilitiesService.files.getThumb($scope.selectedFile);
        if (typeof thumb.type !== 'undefined') {
          $scope.selectedFile.fields.thumb.push(typeof $scope.selectedFile.getNative !== 'undefined' ? $scope.selectedFile.getNative() : $scope.selectedFile);
          fileReaderService
            .createObjectURL($scope.selectedFile.fields.thumb[0], $scope)
            .then(function(imageData) {
              $scope.selectedFile.fields.thumb[0].thumb = imageData;
              $scope.selectedFile.fields.thumb[0].thumb_default = true;
            });
        } else {
          $scope.selectedFile.fields.thumb.push({
            'thumb': thumb,
            'thumb_default': true
          });
        }
        $scope.selectedFile.fields.thumb_default = true;
        $scope.customThumbSelected = false;
      }

  };

  $scope.upload = function() {

    //collect the user's selected filters
    var args = utilitiesService.filters.getSelected($scope.selectedFile.filters, '|'),
        currentFile = $scope.selectedFile
    ;

    $('html, body').animate({
      scrollTop: $('body').offset().top
    }, 400);

    //create the asset page
    delete args.thumb;

    function uploadFailed(reason) {
      currentFile.failed = true;
      currentFile.reason = reason;
      $scope.runningUploads = $scope.runningUploads > 0 ? $scope.runningUploads -= 1 : 0;
    }
    
    currentFile.uploading = true;
    $scope.runningUploads += 1;

    serverService.assets.add(args).then(function(responseAdd){

         //start the upload
        uploaderService.setConfig({ 'url': '/api/assets/upload'});
        
        uploaderService.upload(currentFile, {id: responseAdd.result.id}).then(function(response) {

            if (!currentFile.fields.thumb[0].thumb_default) {
              //if not default thumb the upload it

              uploaderService.setConfig({ 'url': '/api/assets/thumb/upload'});
              uploaderService.upload(currentFile.fields.thumb[0], { id: responseAdd.result.id }).then(function() {
                  currentFile.done = true;
              }, function(reason){
                uploadFailed(reason);
              });

            } else {

              //else set the default
              serverService.assets.addDefaultThumb({
                'id': responseAdd.result.id
              }).then(function(){
                  currentFile.done = true;
                  currentFile.uploading = false;
                  $scope.runningUploads = $scope.runningUploads > 0 ? $scope.runningUploads -= 1 : 0;
                  $rootScope.$broadcast('assets:added');
              }, function(reason){
                uploadFailed(reason);
              });

            }

        }, function(reason){
          uploadFailed(reason);
        }); 
     
    }, function(reason){
      uploadFailed(reason);
    });

    $scope.showFailures = function(){
      console.log('not yet implemented!');
    };

  };

})

;

