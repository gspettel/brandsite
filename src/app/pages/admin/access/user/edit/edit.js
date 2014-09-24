angular.module('skybrand.admin.access.user.edit', [
  'templates-app',
  'skybrand.model',
  'skybrand.server',
  'ui.state'
])

.config(function config($stateProvider) {
  $stateProvider.state('admin-access.user-edit', {
    url: '/user/edit/:id',
    resolve: {
      init: function($rootScope, serverService, modelService, $stateParams, $q, $timeout) {

        var deferred = $q.defer();

        if(!modelService.sharedData) {
          $rootScope.lightbox.open({type: 'notifications.loading', message1: 'Loading data'});
          serverService.users.get({'id': $stateParams.id}).then(function(response){
            $rootScope.lightbox.close().then(function(){
              modelService.sharedData = response.result;
              $rootScope.lightbox.open({
                type: 'access.user.edit',
                data: modelService.sharedData
              });
              addRoles();
            });
          });
        } else {
          $rootScope.lightbox.open({
            type: 'access.user.edit',
            data: modelService.sharedData,
            backOnClose: true
          });
          addRoles();
        }

        function addRoles() {
          serverService.roles.get().then(function(response){
            modelService.sharedData.data.roles = response.result;
            angular.forEach(modelService.sharedData.data.roles, function(value){
              if(modelService.sharedData.data.role === value.name) {
                modelService.sharedData.data.roleBindingVal = value;
              }
            });
          }); 
        }
        
        deferred.reject();

        return deferred.promise;
      }
    }

  });
})

;