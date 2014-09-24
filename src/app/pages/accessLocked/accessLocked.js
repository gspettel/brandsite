angular.module( 'skybrand.accessLocked', [
  'templates-app',
  'ui.state',
  'skybrand.model'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'access-locked', {
    url: '/access-locked',
    views: {
      "main": {
        controller: 'AccessLockedCtrl',
        templateUrl: 'pages/accessLocked/accessLocked.tpl.html'
      }
    }
  });
})

.controller( 'AccessLockedCtrl', function AccessLockedController( $scope, modelService ) { 
  $scope.modelService = modelService;
})

;

