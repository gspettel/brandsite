angular.module( 'fidi.ie8FullImage', [
])

.directive('ie8FullImage', function() {
    return {
      restrict: "A",
      scope: {
        ie8FullImage: '=ie8FullImage'
      },
      template: '<img data-ng-src="{{ie8FullImage}}" />',
      replace: true,
      link: function(scope, element, attrs) {

        //make sure we're using ie8
        if(!!document.createElement('canvas').getContext) {
          element.remove();
          return false;
        }

        element.addClass('ie8-full-image');
        
    }
  };
})

;