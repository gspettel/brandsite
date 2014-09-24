angular.module( 'skybrand.maintenance', [
  'templates-app',
  'ui.state',
  'skybrand.model'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'maintenance', {
    url: '/maintenance',
    views: {
      "main": {
        controller: 'MaintenanceCtrl',
        templateUrl: 'pages/maintenance/maintenance.tpl.html'
      }
    }
  });
})

.controller( 'MaintenanceCtrl', function MaintenanceController( $scope, modelService, $interval, $location, serverService ) { 
  $scope.modelService = modelService;  
  $('header.main, footer').remove();

  var check = $interval(function() {
    serverService.settings.get().then(function(response) {
      modelService.pages.settings = response;
      if(!response.general.maintenance_mode) {
        alert('The website is back from maintenance! Click OK to go to the homepage');
        $interval.cancel( check );
        window.location.href = '/';
      }
    });
  }, 3000);

})

;