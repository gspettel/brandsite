angular.module( 'skybrand.gotoTop', [
  'templates-app',
  'skybrand.model'
])

.directive('gotoTop', function gotoTop(modelService, $stateParams, $rootScope, $window) {
  return {
    restrict: "A",
    scope: {
      trackElement: '@'
    },
    templateUrl: 'components/gotoTop/gotoTop.tpl.html',
    replace: false,
    link: function(scope, element, attrs, ngModel) {
      scope.display = false;

      $window = angular.element($window);
      scope.gotoTop = function() {
        $('html, body').animate({
          scrollTop: 0
        }, 500);
      };
      $window.on("scroll", function() {
        if ($window.scrollTop() >= $(scope.trackElement).offset().top) {
          scope.$apply(function() {
            scope.display = true;
          });
        } else {
          scope.$apply(function() {
            scope.display = false;
          });
        }
      });

      scope.$on("$destroy", function(){
        $window.off("scroll");
      });

    }
  };

})

;

