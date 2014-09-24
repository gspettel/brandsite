angular.module( 'skybrand.home', [
  'ui.state',
  'skybrand.model'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'home', {
    url: '/home',
    views: {
      "main": {
        controller: 'HomeCtrl',
        templateUrl: 'pages/home/home.tpl.html'
      }
    },
    data:{ pageTitle: 'Brand Site homepage' }
  });
})

.controller( 'HomeCtrl', function HomeController( $scope, $rootScope, $stateParams, modelService ) { 
  $scope.background = modelService.cms.background;
  $('body').addClass('home');

  $scope.$on("$destroy", function(){
    $('body').removeClass('home');
  });

})

;

