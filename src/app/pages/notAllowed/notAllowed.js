angular.module( 'skybrand.notAllowed', [
  'templates-app',
  'ui.state',
  'skybrand.cache',
  'skybrand.model'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'not-allowed', {
    url: '/not-allowed',
    views: {
      "main": {
        controller: 'NotAllowedCtrl',
        templateUrl: 'pages/notAllowed/notAllowed.tpl.html'
      }
    }
  });
})

.controller( 'NotAllowedCtrl', function NotAllowedController( $scope, modelService ) { 
  $scope.modelService = modelService;  
})

;