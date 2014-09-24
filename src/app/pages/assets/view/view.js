angular.module('skybrand.assets.view', [
  'templates-app',
  'skybrand.server',
  'ui.state'
])

.config(function config($stateProvider) {
  $stateProvider.state('assets-view', {
    url: '/assets/view/:assetId',
    resolve: {
      init: function($rootScope, serverService, $stateParams, $q, $timeout, $location) {

        var deferred = $q.defer();
        
        $location.search({});

        $rootScope.lightbox.open({type: 'notifications.loading', message1: 'Loading data'});

        serverService.assets.get({
            id: $stateParams.assetId
          }).then(function(response) {
            if(!response.total) {
              $location.path('/not-found');
              return;
            }
            $rootScope.lightbox.close().then(function(){
              
              $timeout(function(){
                $rootScope.lightbox.open({
                  type: 'assets.view',
                  data: response.records[0],
                  backOnClose: true
                });
              }, 0);

            });

          });

        deferred.reject();

        return deferred.promise;
      }
    }

  });
})

;