angular.module('skybrand.admin.access', [
  'templates-app',
  'ui.state',
  'skybrand.model',
  'skybrand.server', 
  'skybrand.utilities', 
  'skybrand.notifications'
])

.config(function config($stateProvider) {
  $stateProvider.state('admin-access', {
    url: '/admin/access?role',
    views: {
      "main": {
        controller: 'AccessCtrl',
        templateUrl: 'pages/admin/access/access.tpl.html'
      }
    },
    resolve: {
      access: function(utilitiesService, $q) {

        var 
          deferred = $q.defer()
        ;
        
        //check permissions
        utilitiesService.assureAdmin(deferred);

        return deferred.promise;
      }
    },
    data:{ pageTitle: 'Access' }
  });
})

.controller('AccessCtrl', function AccessController($scope, $stateParams, $rootScope, serverService, utilitiesService, modelService, notificationsService) {
  
  $scope.users = [];
  $scope.roles = [];
  $scope.modelService = modelService;
  $scope.notifications = notificationsService;
  
  serverService.users.all({role: $stateParams.role}).then(function(response) {
    $scope.users = response.result;
  });

  serverService.roles.get().then(function(response){
    $scope.roles = response.result;
  }); 

  $scope.setData = function(user){
    modelService.sharedData = user;
  };

  $scope.focus = function(){
    $('.inputBox').focus();
  };

  function updateData() {
    serverService.users.all().then(function(response) {
      $scope.users = response.result;
    });
  }

  $rootScope.$on('user:removed', updateData);
  $rootScope.$on('user:added', updateData);

})

;