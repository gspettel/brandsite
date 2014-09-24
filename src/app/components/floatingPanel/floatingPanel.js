angular.module('skybrand.floatingPanel', [
  'skybrand.shareInput'
])

.directive('floatingPanel', function floatingPanel($interval, $window) {

  return {
      restrict: 'A',
      link: function (scope, element, attr) {

        // var checkInt = null;

        // var checkHeight = (function autoExec() {          
        //   if ($('.lightbox .lightbox-container').height() > $(window).height() + 30) { 
        //     if(element.hasClass('fixed')) {
        //       return false;
        //     }
        //     element.css('width', element.width());
        //     element.addClass('fixed');
        //   } else {
        //     element.removeAttr('style');
        //     element.removeClass('fixed');
        //   }
        //   return autoExec;
        // })();

        // checkInt = $interval(checkHeight, 300);

        // scope.$on("$destroy", function(){
        //   $interval.clear(checkInt);
        // });

      }
  };

})

;