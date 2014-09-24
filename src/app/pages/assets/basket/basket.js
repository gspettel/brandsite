angular.module('skybrand.assets.basket', [
  'templates-app',
  'skybrand.server',
  'ivpusic.cookie',
  'ui.state'
])

.config(function config($stateProvider) {
  $stateProvider.state('assets-basket', {
    url: '^/basket?assets',
    resolve: {
      init: function($rootScope, $timeout, $q, serverService, $stateParams, separator) {
        
        var deferred = $q.defer(),
            ids = $stateParams.assets;

        $rootScope.lightbox.open({type: 'notifications.loading', message1: 'Loading basket items'});

        serverService.assets.get({id: ids, page: -1}).then(function(result) {
            
          $rootScope.lightbox.close().then(function(){

            $rootScope.lightbox.open({
              type: 'assets.basket',
              data: result.records,
              backOnClose: true
            }); 
            
          });

        });

        deferred.reject();

        return deferred.promise;

      }
    }
  });
})

;