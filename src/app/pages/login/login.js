angular.module('skybrand.login', [
  'templates-app',
  'skybrand.server',
  'skybrand.model',
  'ui.state'
])

.config(function config($stateProvider) {
  $stateProvider.state('login', {
    url: '/login',
    resolve: {
      init: function($rootScope, serverService, modelService, $stateParams, $q) {

        var deferred = $q.defer();
          
        $rootScope.lightbox.open({
          type: 'login',
          backOnClose: !modelService.isFirstLoad
        });

        deferred.reject();

        return deferred.promise;
      }
    }

  });
})

;