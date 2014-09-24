angular.module('skybrand.repeatCompleted', [
])

.directive('repeatCompleted', function repeatCompleted($timeout) {

  return {
      restrict: 'A',
      link: function (scope, element, attr) {
          if (scope.$last === true) {
              $timeout(function () {
                  scope.$emit('repeat:completed');
              });
          }
      }
  };

})

;