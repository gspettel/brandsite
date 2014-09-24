angular.module( 'skybrand.news.campaign', [
  'templates-app',
  'skybrand.server',
  'ui.state',
  'skybrand.cache',
  'skybrand.utilities',
  'ivpusic.cookie',
  'skybrand.notifications'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'news-campaign', {
    url: '/news/campaign',
    resolve: {
      data: function( $rootScope, serverService, $stateParams, $q, $timeout, cacheService ) {

        var 
          deferred = $q.defer(),
          data = null,
          args = {page: 1, items_per_page: 3}
        ;
        
        if( data = cacheService.get(JSON.stringify(args))) {
          deferred.resolve(data.result);
        } else {

          $rootScope.lightbox.open({type: 'notifications.loading', message1: 'Loading Campaigns'});

          serverService.news.getCampaigns(args).then(function(response) {
            
            $rootScope.lightbox.close().then(function(){

              deferred.resolve(response.result);

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
        controller: 'CampaignCtrl',
        templateUrl: 'pages/news/campaign/campaign.tpl.html'
      }
    },
    data:{ pageTitle: 'News' }
  });
})

.controller( 'CampaignCtrl', function CampaignCtrl( $scope, $rootScope, utilitiesService, $location, ipCookie, $stateParams, separator, serverService, data, notificationsService ) { 
  
  $scope.campaignsData = data;
  $scope.notifications = notificationsService;
  $scope.utilitiesService = utilitiesService;

  $scope.loadMore = function() {
    $rootScope.lightbox.open({type: 'notifications.loading', message1: 'Loading Campaigns'});

    serverService.news.getCampaigns({page: $scope.campaignsData.page + 1, items_per_page: 3}).then(function(response) {
      
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

})

;
