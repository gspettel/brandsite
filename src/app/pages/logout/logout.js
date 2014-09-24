angular.module('skybrand.logout', [
  'templates-app',
  'skybrand.server',
  'ui.state'
])

.config(function config($stateProvider) {
  $stateProvider.state('logout', {
    url: '/logout',
    resolve: {
      init: function($rootScope, serverService, $stateParams, $q) {

        var deferred = $q.defer();
          
        $rootScope.lightbox.open({
          type: 'logout'
        });

        deferred.reject();

        return deferred.promise;
      }
    }

  });
})

;