angular.module( 'skybrand.iframe', [
])

.directive('iframe', function() {
  return {
    restrict: 'A',
    scope: {
      'src': '=iframe'
    },
    template: '<iframe width="100%" height="680" frameborder="0" scrolling="no" allowfullscreen webkitallowfullscreen mozallowfullscreen oallowfullscreen msallowfullscreen></iframe>',
    replace: true,
    link: function(scope, iElement, attrs) {
      scope.$watch('src', function(){
        iElement.attr('src', '//player.sky.com/?videoId=' + scope.src);
      });
    }
  };
})

;