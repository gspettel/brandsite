angular.module( 'skybrand.news.campaignLibrary', [
  'templates-app',
  'ui.state',
  'skybrand.animations',
  'skybrand.model',
  'skybrand.utilities',
  'ivpusic.cookie',
  'skybrand.cache',
  'ivpusic.cookie',
  'skybrand.filterspanel.campaigns',
  'skybrand.notifications'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'news-campaign-library', {
    url: '/news/campaign-library?'+
    'title&'+
    'year&'+
    'country&'+
    'quarter',
    resolve: {
      data: function($rootScope, serverService, $stateParams, ipCookie, utilitiesService, modelService, $q, $timeout, cacheService) {

        var 
          deferred = $q.defer(),
          data = null,
          urlFilters = utilitiesService.filters.getFromUrl($stateParams, '|')
        ;

        urlFilters.page = 1;
        urlFilters.items_per_page = 10;
        
        if( data = cacheService.get(JSON.stringify(urlFilters))) {
          //work on copy so it doesn't preserve the item state (eg. the expanded or collapsable state)
          deferred.resolve({'showFilters': modelService.showFilters, 'results': angular.copy(data.result)});
        } else {

          $rootScope.lightbox.open({type: 'notifications.loading', message1: 'Loading Campaigns'});

          serverService.news.getCampaigns(urlFilters).then(function(response) {
            
            $rootScope.lightbox.close().then(function(){
              //work on copy so it doesn't preserve the item state (eg. the expanded or collapsable state)
              deferred.resolve({'showFilters': modelService.showFilters, 'results': angular.copy(response.result)});

            });

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
    views: {
      "main": {
        controller: 'CampaignLibraryCtrl',
        templateUrl: 'pages/news/campaignLibrary/campaignLibrary.tpl.html'
      }
    },
    data:{ pageTitle: 'News' }
  });
})

.controller( 'CampaignLibraryCtrl', function CampaignLibraryCtrl( $scope, $rootScope, separator, ipCookie, $location, modelService, utilitiesService, $stateParams, serverService, data, notificationsService ) { 

  $scope.campaignsData = data.results;
  $scope.modelService = data.modelService;
  $scope.showFilters = data.showFilters;
  $scope.notifications = notificationsService;
  $scope.utilitiesService = utilitiesService;
  $scope.filters = modelService.filters;
  $scope.title = $stateParams.title;

  utilitiesService.filters.populateAvailableFromUrl(modelService.filters.available, $stateParams, '|');

  $scope.urlFilters = utilitiesService.filters.getFromUrl($stateParams, '|');

  $scope.loadMore = function() {
    $rootScope.lightbox.open({type: 'notifications.loading', message1: 'Loading Campaigns'});

    $scope.urlFilters.page = $scope.campaignsData.page + 1;
    $scope.urlFilters.items_per_page = 10;

    serverService.news.getCampaigns($scope.urlFilters).then(function(response) {
      
      $rootScope.lightbox.close().then(function(){
        if(response.result.records.length < $scope.campaignsData.items_per_page) {
          $scope.completed = true;
        }
        $scope.campaignsData.records = $scope.campaignsData.records.concat(response.result.records);
        $scope.campaignsData.page = response.result.page;

        setTimeout(function(){
          utilitiesService.parser.videos(846);
        }, 500);

      });

    });
  };

  $scope.clearSiblings = function(collection, option) {
    angular.forEach(collection, function(value, index) {
      if (option.value !== value.value) {
        value.selected = false;
      }
    });
  };


  $scope.select = function(campaign) { 
    // if(typeof $scope.lastSelected !== 'undefined') {
    //   $scope.lastSelected.expanded = false; 
    // }
    campaign.expanded = true; 
    //$scope.lastSelected = campaign;

  };

  $scope.$watch('title', function(newVal, oldVal){
    if(newVal === oldVal) { return false; }

    var searchParams = {};

    angular.forEach($stateParams, function(value, key){
      if(value) {
        searchParams[key] = value;
      }
    });

    if(newVal.length) {
      searchParams['title'] = newVal;
    } else {
      delete searchParams['title'];
    }

    $location.path('/news/campaign-library').search(searchParams);

  });

  $scope.openVideo = function(campaign){

    $rootScope.lightbox.open({
      type: 'video',
      data: {
        url: campaign.data.video_id,
        copy: campaign.data.video_summary,
        title: campaign.data.video_title
      }
    });

  };

  $scope.openGallery = function(campaign){

    $rootScope.lightbox.open({
      type: 'gallery',
      data: campaign.data.images,
      title: campaign.data.campaign_gallery_title
    });

  };

  $scope.toggleFilters = function(){
    $rootScope.$broadcast('filterPanel:click');
  };

  $scope.openAssets = function(campaign){

    var ids = [];
    angular.forEach(campaign.data.campaign_related_assets, function(value, index){
      ids.push(value.data.asset_id);
    });
    
    $location.path('/assets/all').search({id: ids.join('|')}); 

  };

  $scope.$on("$destroy", function(){
    ipCookie('campaignsLastVisit', new Date().getTime(), {path: '/'});
    notificationsService.resetCampaigns();
  });
  
  setTimeout(function(){
    utilitiesService.parser.videos(846);
  }, 500);

})

;

