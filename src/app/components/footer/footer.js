angular.module('skybrand.footer', [
  'templates-app',
  'skybrand.lightbox'
])

.directive('footer', function(modelService, $timeout, $location) {
  return {
    restrict: 'A',
    templateUrl: 'components/footer/footer.tpl.html',
    replace: true,
    scope: true,
    controller: function($scope) {
      $scope.year = new Date().getFullYear();
    }
  };
})

;