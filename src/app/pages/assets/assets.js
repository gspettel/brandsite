angular.module( 'skybrand.assets', [
  'templates-app',
  'skybrand.model', 
  'skybrand.utilities',
  'skybrand.server',
  'skybrand.typeahead',
  'infinite-scroll',
  'skybrand.filterspanel',
  'skybrand.filedroppanel',
  'skybrand.noResultsPanel',
  'skybrand.gotoTop',
  'ivpusic.cookie',
  'ui.state'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'assets', {
    url: '/assets/:mainCategory?'+
    'id&'+
    'title&'+
    'master_brand_category&'+
    'channels_brand&'+
    'channels_category&'+
    'products_category&'+
    'products_product&'+
    'campaigns_media&'+
    'campaigns_product_area&'+
    'year&'+
    'quarter&'+
    'initiatives_category&'+
    'initiatives_initiative&'+
    'content_content&'+
    'content_document&'+
    'country&'+
    'filetype&'+
    'is_replacement&'+
    'is_private&'+
    'show_filters',
    views: {
      "main": {
        controller: 'AssetsCtrl',
        templateUrl: 'pages/assets/assets.tpl.html'
      }
    },
    resolve: {
      data: function($rootScope, serverService, utilitiesService, modelService, $stateParams, $location, $q, $timeout, cacheService) {

        var 
          deferred = $q.defer(),
          data = null
        ;

        if( !Object.keys($location.search()).length && (data = cacheService.get('assets.' + $stateParams.mainCategory))) {
          deferred.resolve(data);
        } else {
          var filters = utilitiesService.filters.getFromUrl($stateParams, '|');
          filters.page = 1;
          
          $rootScope.lightbox.open({type: 'notifications.loading', message1: 'Loading assets'});

          serverService.assets.get(filters).then(function(result) {

            data = result;
            //save in cache if not filters present
            if(!Object.keys($location.search()).length) {
              angular.forEach(data.records, function(asset){
                asset.cached = true;
              });
              cacheService.put('assets.' + $stateParams.mainCategory, data);
              modelService.cacheIds.assets.push('assets.' + $stateParams.mainCategory);
            }
            deferred.resolve(data);
            $timeout(function(){$rootScope.lightbox.close();}, 400);

          });

        }

        return deferred.promise;
      },
      access: function(utilitiesService, $q) {

        var 
          deferred = $q.defer()
        ;
        
        //check permissions
        utilitiesService.assureLoggedIn(deferred);

        return deferred.promise;
      }
    },
    data:{ pageTitle: 'Assets' }
  });
})

.controller( 'AssetsCtrl', function AssetsController($scope, $state, data, $rootScope, $stateParams, $location, modelService, serverService, utilitiesService, $timeout, ipCookie ) { 

  $scope.filters = utilitiesService.filters.getFromUrl($stateParams, '|');

  if(!data) {
    data = {
      records: {},
      pages: 0,
      items_per_page: 0,
      total: 0
    };
  }

  $scope.modelService = modelService;
  $scope.utilitiesService = utilitiesService;
  $scope.$location = $location;
  $scope.$stateParams = $stateParams;
  $scope.$rootScope = $rootScope;
  $scope.utilitiesService = utilitiesService;
  $scope.filters.page = 2;
  $scope.data = data.records;
  $scope.pages = data.pages;
  $scope.total = data.total;
  $scope.items_per_page = data.items_per_page;
  $scope.empty = false;
  $scope.completed = false;
  $scope.loading = false;
  $scope.title = $stateParams.title;

  $('html, body').scrollTop(0);
  
  $scope.$watch('title', function(newVal, oldVal){
    if(newVal === oldVal || newVal === '$') { return false; }

    if(newVal.length) {
      $location.path('/assets/all').search({title: newVal});
    } else {
      $location.url($location.path());
    }

  });

  $scope.navigate = function(path) {
    var searchParams = {};

    angular.forEach($stateParams, function(value, key){
      if(value) {
        searchParams[key] = value;
      }
    });

    delete searchParams['mainCategory'];
    delete searchParams['id'];

    if(path === 'all') {
      delete searchParams['master_brand_category'];
      delete searchParams['channels_brand'];
      delete searchParams['channels_category'];
      delete searchParams['products_category'];
      delete searchParams['products_product'];
      delete searchParams['campaigns_vehicle'];
      delete searchParams['campaigns_media'];
      delete searchParams['campaigns_product_area'];
      delete searchParams['year'];
      delete searchParams['quarter'];
      delete searchParams['initiatives_category'];
      delete searchParams['initiatives_initiative'];
      delete searchParams['content_content'];
      delete searchParams['content_document'];
      delete searchParams['country'];
      delete searchParams['assets'];
    }
    if(path === 'master-brand') {
      delete searchParams['channels_brand'];
      delete searchParams['channels_category'];
      delete searchParams['products_category'];
      delete searchParams['products_product'];
      delete searchParams['campaigns_vehicle'];
      delete searchParams['campaigns_media'];
      delete searchParams['campaigns_product_area'];
      delete searchParams['year'];
      delete searchParams['quarter'];
      delete searchParams['initiatives_category'];
      delete searchParams['initiatives_initiative'];
      delete searchParams['content_content'];
      delete searchParams['content_document'];
      delete searchParams['country'];
      delete searchParams['assets'];
    }
    if(path === 'channels') {
      delete searchParams['master_brand_category'];
      delete searchParams['products_category'];
      delete searchParams['products_product'];
      delete searchParams['campaigns_vehicle'];
      delete searchParams['campaigns_media'];
      delete searchParams['campaigns_product_area'];
      delete searchParams['year'];
      delete searchParams['quarter'];
      delete searchParams['initiatives_category'];
      delete searchParams['initiatives_initiative'];
      delete searchParams['content_content'];
      delete searchParams['content_document'];
      delete searchParams['country'];
      delete searchParams['assets'];
    }
    if(path === 'products') {
      delete searchParams['master_brand_category'];
      delete searchParams['channels_brand'];
      delete searchParams['channels_category'];
      delete searchParams['campaigns_vehicle'];
      delete searchParams['campaigns_media'];
      delete searchParams['campaigns_product_area'];
      delete searchParams['year'];
      delete searchParams['quarter'];
      delete searchParams['initiatives_category'];
      delete searchParams['initiatives_initiative'];
      delete searchParams['content_content'];
      delete searchParams['content_document'];
      delete searchParams['country'];
      delete searchParams['assets'];
    }
    if(path === 'campaigns') {
      delete searchParams['master_brand_category'];
      delete searchParams['channels_brand'];
      delete searchParams['channels_category'];
      delete searchParams['products_category'];
      delete searchParams['products_product'];
      delete searchParams['initiatives_category'];
      delete searchParams['initiatives_initiative'];
      delete searchParams['content_content'];
      delete searchParams['content_document'];
      delete searchParams['assets'];
    }
    if(path === 'initiatives') {
      delete searchParams['master_brand_category'];
      delete searchParams['channels_brand'];
      delete searchParams['channels_category'];
      delete searchParams['products_category'];
      delete searchParams['products_product'];
      delete searchParams['campaigns_vehicle'];
      delete searchParams['campaigns_media'];
      delete searchParams['campaigns_product_area'];
      delete searchParams['year'];
      delete searchParams['quarter'];
      delete searchParams['content_content'];
      delete searchParams['content_document'];
      delete searchParams['country'];
      delete searchParams['assets'];
    }
    if(path === 'content') {
      delete searchParams['master_brand_category'];
      delete searchParams['channels_brand'];
      delete searchParams['channels_category'];
      delete searchParams['products_category'];
      delete searchParams['products_product'];
      delete searchParams['campaigns_vehicle'];
      delete searchParams['campaigns_media'];
      delete searchParams['campaigns_product_area'];
      delete searchParams['year'];
      delete searchParams['quarter'];
      delete searchParams['initiatives_category'];
      delete searchParams['initiatives_initiative'];
      delete searchParams['country'];
      delete searchParams['assets'];
      delete searchParams['filetype'];
    }

    $location.path('/assets/'+path).search(searchParams); 

  };


  $scope.loadMore = function() {
    if ($scope.loading || $scope.pages !== -1 && $scope.pages < $scope.filters.page || $scope.completed) {
      return false;
    }
    $scope.loading = true;

    var lastRequestId = modelService.lastRequestId;

    serverService.assets.get($scope.filters).then(function(result) {
      $scope.pages = result.pages;
      $scope.total = result.total;
      $scope.items_per_page = result.items_per_page;

      if (result.records.length < $scope.items_per_page) {
        $scope.completed = true;
        $scope.loading = true;
      }
      if ($scope.filters.page === 1 && result.records.length <= 0) {
        $scope.empty = true;
      }
      (function autoExec(i) {
        if(modelService.cms.isIE8) {
          $.merge($scope.data, result.records);
          $scope.loading = false;
          return;
        }
        if (result.records.length === 0) {
          return false;
        }
        if (i === result.records.length) {
          $scope.loading = false;
          //once the animations have completed and they're rendered, check again if lazyload is necessary to fill in the viewport
          $timeout(function() {
            $scope.$broadcast('infiniteScroll:dataLoaded');
          }, 0);
          return false;
        }
        if (i === 0) {
          $scope.data.push(result.records[i]);
          autoExec(i + 1);
        } else {
          $timeout(function() {
            //if the page changed (another category was selected) the cancel adding the data to avoid race conditions with other calls to the function fired when the menu changed
            if (modelService.lastRequestId !== lastRequestId) {
              return false;
            }
            $scope.data.push(result.records[i]);
            autoExec(i + 1);
          }, 200);
        }
      })(0);
      $scope.filters.page += 1;
    }, function(reason) {
      $scope.completed = true;
      $scope.loading = false;

      $rootScope.lightbox.close();
    });
  };

  $scope.archive = function(id,index) {
     $rootScope.lightbox.open({type: 'confirmation', message1: 'Are you sure you want to archive this asset?'}).then(function(result){
      if(result) {
        $rootScope.lightbox.open({type: 'notifications.loading', message1: 'Archiving asset'});
        serverService.assets.archive({'id': id}).then(function(){
          $rootScope.lightbox.close().then(function(){
            $rootScope.lightbox.open({type: 'notifications.success', message1: 'Asset archived!', autoclose: true});
            $scope.data.splice(index, 1);
            $scope.total -= 1;
          });
        });
      }
    });
  };

  $scope.toggleFilters = function(){
    $rootScope.$broadcast('filterPanel:click');
  };

  $scope.basketAdd = function(asset) {
    
    var found = false,
      basketIds = []
    ;

    angular.forEach(modelService.basket, function(value, index){
      var val = value.id ? value.id : value;
      basketIds.push(val);
      if(val === asset.id) {
        $rootScope.lightbox.open({type: 'notifications.alert', message1: 'The item is already in the basket', autoclose: true});
        found = true;
        return false;        
      }
    });
    if(found){
      return false;
    }
        
    modelService.basket.push(asset);
    basketIds.push(asset.id);

    ipCookie('brandsite_basket', JSON.stringify(basketIds), {path: '/'});

    $rootScope.lightbox.open({type: 'notifications.success', message1: 'The item was added to the basket', autoclose: true});
  };

  $rootScope.$on('asset:archived', function(event, args){
    angular.forEach($scope.data, function(item, index){
      if(item.id === args.id) {
        $scope.data.splice(index, 1);
        $scope.total -= 1;
      }
    });
  });

})

;

