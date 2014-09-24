angular.module('skybrand.admin.access.user.add', [
  'templates-app',
  'skybrand.model',
  'skybrand.server',
  'ui.state'
])

.config(function config($stateProvider) {
  $stateProvider.state('admin-access.user-add', {
    url: '/user/add',
    resolve: {
      init: function($rootScope, serverService, modelService, $stateParams, $q, $timeout) {

        var deferred = $q.defer();

        modelService.sharedData = {};

        serverService.roles.get().then(function(response){
          modelService.sharedData.roles = response.result;
        }); 

        $rootScope.lightbox.open({
          type: 'access.user.add',
          data: modelService.sharedData,
          backOnClose: !modelService.isFirstLoad
        });
        
        deferred.reject();

        return deferred.promise;
      }
    }

  });
})

;