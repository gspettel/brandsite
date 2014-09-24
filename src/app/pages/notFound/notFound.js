angular.module( 'skybrand.notFound', [
  'templates-app',
  'ui.state',
  'skybrand.model',
  'skybrand.analytics'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'not-found', {
    url: '/not-found',
    views: {
      "main": {
        controller: 'NotFoundCtrl',
        templateUrl: 'pages/notFound/notFound.tpl.html'
      }
    }
  });
})

.controller( 'NotFoundCtrl', function NotFoundController( $scope, modelService, analyticsService ) { 
  $scope.modelService = modelService;
  analyticsService.track404Page();
})

;

