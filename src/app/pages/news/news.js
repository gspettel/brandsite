angular.module( 'skybrand.news', [
  'templates-app',
  'skybrand.server',
  'ui.state',
  'skybrand.cache',
  'skybrand.model',
  'skybrand.utilities',
  'ivpusic.cookie',
  'skybrand.notifications',
  'skybrand.morePanel'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'news', {
    url: '/news',
    resolve: {
      data: function($rootScope, serverService, $stateParams, $q, $timeout, cacheService) {

        var 
          deferred = $q.defer(),
          data = null
        ;
        
        if( data = cacheService.get('news.weekly')) {
          deferred.resolve(data);
        } else {
          
          $rootScope.lightbox.open({type: 'notifications.loading', message1: 'Loading News'});

          serverService.news.getWeekly().then(function(response) {
            
            $rootScope.lightbox.close().then(function(){

              deferred.resolve(response);

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
        controller: 'NewsCtrl',
        templateUrl: 'pages/news/news.tpl.html'
      }
    },
    data:{ pageTitle: 'News' }
  });
})

.controller( 'NewsCtrl', function NewsCtrl( $scope, $rootScope, $stateParams, ipCookie, utilitiesService, serverService, data, notificationsService, modelService, $anchorScroll) { 
  $scope.newsData = data;
  $scope.notifications = notificationsService;
  $scope.modelService = modelService;
  $scope.utilitiesService = utilitiesService;

  $('html, body').scrollTop(0);

  $scope.loadMore = function() {
    $rootScope.lightbox.open({type: 'notifications.loading', message1: 'Loading News'});

    serverService.news.getWeekly({'last_id': $scope.newsData.result.last_id}).then(function(response) {
      
      $rootScope.lightbox.close().then(function(){
        angular.forEach(response.result.records, function(value, index){
          $scope.newsData.result.records.push(value);
        });

        setTimeout(function(){
          utilitiesService.parser.videos(650);
        }, 500);

        $scope.newsData.result.last_id = response.result.last_id;

        if(response.result.records.length < 3) {
          $scope.completed = true;
          return;
        }

      });

    });
  };

  $scope.$on("$destroy", function(){
    ipCookie('newsLastVisit', new Date().getTime(), {path: '/'});
    notificationsService.resetNews();
  });

  $scope.newsChanged = (function autoExec() {
    setTimeout(function(){
      utilitiesService.parser.videos(650);
    }, 500);
    return autoExec;
  })();

})

;

