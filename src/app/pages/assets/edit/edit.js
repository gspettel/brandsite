
angular.module('skybrand.assets.edit', [
  'templates-app',
  'skybrand.model',
  'skybrand.utilities',
  'skybrand.filereader',
  'fidi.uploader',
  'skybrand.server',
  'skybrand.filedroppanel',
  'ui.state'
])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config($stateProvider) {
  $stateProvider.state('assets-edit', {
    url: '/assets/edit/:id',
    views: {
      "main": {
        controller: 'AssetsEditCtrl',
        templateUrl: 'pages/assets/edit/edit.tpl.html'
      }
    },
    resolve: {
      access: function(utilitiesService, $q) {

        var 
          deferred = $q.defer()
        ;
        
        //check permissions
        utilitiesService.assureAdmin(deferred);

        return deferred.promise;
      }
    },
    data: {
      pageTitle: 'Edit asset'
    }
  });
})

/**
 * And of course we define a controller for our route.
 */
.controller('AssetsEditCtrl', function AssetsEditController($scope, $rootScope, modelService, serverService, utilitiesService, $stateParams, $timeout, fileReaderService, uploaderService) {
  
  uploaderService.setConfig({
    'url': '/api/assets/thumb/upload',
    'flash_swf_url': modelService.cms.config.urls.local_templates + modelService.cms.env + '/assets/others/Moxie.swf',
    'silverlight_xap_url': modelService.cms.config.urls.local_templates + modelService.cms.env + '/assets/others/Moxie.xap'
  });

  $scope.modelService = modelService;
  $scope.$rootScope = $rootScope;
  $scope.utilitiesService = utilitiesService;
  $scope.asset = null;
  $scope.assetDefaults = null;
  $scope.filters = {
    selected: {},
    available: modelService.filters.available
  };
  $scope.filtersDefaults = null;
  $scope.thumbs = [];
  $scope.replacementAssetPage = 1;
  $scope.allowedThumbFiles = [{title : "Image files", extensions : "jpg,jpeg,gif,png"}];
  $scope.customThumbSelected = false;

  $rootScope.lightbox.open({type: 'notifications.loading'});

  serverService.assets.get({
    id: $stateParams.id
  }).then(function(response) {

    $rootScope.lightbox.close();

    $scope.asset = response.records[0];

    utilitiesService.filters.populateFiltersFromAsset($scope.asset, $scope.filters);

    $scope.thumbs.push({
      thumb: $scope.asset.data.thumb,
      thumb_default: true
    });

    $scope.assetDefaults = angular.copy($scope.asset);
    $scope.filtersDefaults = angular.copy($scope.filters);

  });

  $scope.loadMoreReplacements = function(){
    $scope.replacementAssetPage++;
    $scope.loadingReplacements = true;
    serverService.assets.get({'title': $scope.filters.available.title_to_replace, page: $scope.replacementAssetPage, items_per_page: 6}).then(function(result){      
      $scope.loadingReplacements = false;
      $scope.assetsToReplace.records = $scope.assetsToReplace.records.concat(result.records);
      $scope.assetsToReplace.total = result.total;
    });
  };

  $scope.clearReplacement = function(){
    $scope.replacementAssetPage = 1;
    $scope.assetsToReplace = null;
    $scope.filters.available.asset_to_replace = null;
    $scope.filters.available.title_to_replace = null;
  };

  $scope.$watch('filters.available.title_to_replace', function(newVal, oldVal) {
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

  $scope.reset = function() {
    $scope.asset = angular.copy($scope.assetDefaults);
    $scope.filters = angular.copy($scope.filtersDefaults);

    $scope.thumbs = [];

    $scope.thumbs.push({
      thumb: $scope.asset.data.thumb
    });

  };

  $scope.restoreDefaultThumb = function() {

    $rootScope.lightbox.open({type: 'notifications.loading', message1: 'Setting the default thumbnail'});
    serverService.assets.addDefaultThumb({
      'id': $scope.asset.id
    }).then(function(){
      
      serverService.assets.get({id: $scope.asset.id}).then(function(response){
        if($scope.thumbs.length){
          $scope.thumbs[0].thumb = response.records[0].data.thumb;
          $scope.thumbs[0].thumb_default = true;
        } else {
          $scope.thumbs.push({thumb: response.records[0].data.thumb, thumb_default: true});
        }
        $rootScope.lightbox.close().then(function(){
          $rootScope.lightbox.open({type: 'notifications.loading', message1: 'Default thumbnail set', autoclose: true});
        });
      });

    });

    $scope.customThumbSelected = false;

  };

  $scope.addThumb = function() {
    $scope.thumbs[0] = $scope.thumbs[$scope.thumbs.length - 1];
    if (modelService.cms.isIE8 || modelService.cms.isIE9) {
      $scope.thumbs[0].thumb = $scope.thumbs[$scope.thumbs.length - 1].name;
      $scope.thumbs[0].thumb_default = false;
      return false;
    }
    $timeout(function() {
      fileReaderService
        .createObjectURL($scope.thumbs[0].getNative(), $scope)
        .then(function(imageData) {
          $scope.thumbs[0].thumb = imageData;
          $scope.thumbs[0].thumb_default = false;
        });
    });

    $scope.customThumbSelected = true;

  };

  $scope.save = function() {
    //collect the user's selected filters
    var asset_data = utilitiesService.filters.getSelected($scope.filters.available, '|');

    asset_data.id = $scope.asset.id;
    asset_data.title = $scope.asset.data.title;
    asset_data.summary = $scope.asset.data.summary;

    $rootScope.lightbox.open({type: 'notifications.loading', message1: 'Updating the asset'});
    serverService.assets.update(asset_data).then(function() {

      $rootScope.lightbox.close().then(function(){

        //upload the thumbnail if one was specified
        if ($scope.thumbs[0] instanceof plupload.File || $scope.thumbs[0] instanceof File) {

          $rootScope.lightbox.open({type: 'notifications.loading', message1: 'Updating the thumbnail'});
          uploaderService.upload($scope.thumbs[0], {
            'id': $scope.asset.id
          }).then(function() {
            
            $rootScope.lightbox.close().then(function(){
              
              $rootScope.lightbox.open({type: 'notifications.success', message1: 'The asset was successfully updated', autoclose: true});
              $rootScope.$broadcast('assets:updated');
              $('html, body').animate({
                scrollTop: $('body').offset().top
              }, 400);

            });

          }, function(reason){
            $rootScope.lightbox.close().then(function(){
              $rootScope.lightbox.open({type: 'confirmation.error', message1: 'Error uploading file ' + $scope.files[i].name + '. <br/><p class="intro smaller">Server response: ' + reason.result + '</p>'});
            });
          });
        } else {
            
          $rootScope.lightbox.open({type: 'notifications.success', message1: 'The asset was successfully updated', autoclose: true});
          $rootScope.$broadcast('assets:updated');
          $('html, body').animate({
            scrollTop: $('body').offset().top
          }, 400);

        }

      });

    });

  }; 

})

;