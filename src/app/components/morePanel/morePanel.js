angular.module( 'skybrand.morePanel', [
])

.directive('morePanel', function($timeout) {
  return {
    restrict: 'A',
    transclude: true,
    template: '<div class="skycom-12 alpha" data-ng-class="{\'expand\':expand}"><div data-ng-transclude></div><a href="javascript:void(0);" data-ng-click="readMore()" data-ng-hide="smaller"><span data-ng-show="!expand">Read more</span> <span class="ng-hide" data-ng-show="expand">Show less</span></a></div>',
    
    compile: function compile(tElement, tAttrs, transclude) {
      return function postLink(scope, iElement, iAttrs, controller) {
        scope.expand = false;

        //delay the execution to allow image loading
        $timeout(function() {
          if (iElement.height() < 300) {
            scope.expand = true;
            scope.smaller = false;
          } 
        }, 100);

        scope.readMore = function() {
          scope.expand = !scope.expand;
        };
      };
    }
  };
})

;