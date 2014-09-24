angular.module( 'skybrand.team', [
  'templates-app',
  'ui.state',
  'skybrand.cache',
  'skybrand.utilities'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'team', {
    url: '/team',
    resolve: {
      data: function($rootScope, serverService, $stateParams, $q, $timeout, cacheService) {

        var 
          deferred = $q.defer(),
          data = null
        ;
        
        if( data = cacheService.get('team')) {
          deferred.resolve(data.result);
        } else {
          
          $rootScope.lightbox.open({type: 'notifications.loading', message1: 'Loading page'});

          serverService.team.get().then(function(response) {
            
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

        deferred.resolve();

        return deferred.promise;
      }
    },
    views: {
      "main": {
        controller: 'TeamCtrl',
        templateUrl: 'pages/team/team.tpl.html'
      }
    },
    data:{ pageTitle: 'Meet the team' }
  });
})

.controller( 'TeamCtrl', function TeamController( $scope, $stateParams, data, utilitiesService) { 
  $scope.data = data;
  $scope.utilitiesService = utilitiesService;
})

;

