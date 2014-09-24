angular.module('skybrand.legal', [
  'templates-app',
  'ui.state'
])

.config(function config($stateProvider) {
  $stateProvider.state('legal', {
    url: '/legal',
    resolve: {
      init: function($rootScope, $stateParams, $q, $timeout, $location) {

        var deferred = $q.defer();
        
        $location.search({});

        $timeout(function(){
          $rootScope.lightbox.open({
            type: 'legal',
            backOnClose: true
          });
        });

        deferred.reject();

        return deferred.promise;
      }
    }

  });
})

;