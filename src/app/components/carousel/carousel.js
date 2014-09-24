angular.module('skybrand.carousel', [
  'templates-app'
])

.directive('carousel', function($timeout) {
    return {
      restrict: 'A',
      scope: {
        'data': '=carousel', 
        'onChange': '&'
      },
      templateUrl: 'components/carousel/carousel.tpl.html',
      replace: false,
      link: function(scope, element, attrs) {

        var carouselRoot = element.find('section');

        $timeout(function(){
          carouselRoot.skycom_carousel({
              autoplay: false,
              videoAds: false
          });
        }, 400);

        var onChangeHandler = scope.onChange();
        carouselRoot.on('change',function(e, index) {
          scope.$apply(function(){
            onChangeHandler(index);
          });
        });

      }

    };

  }
)

;