angular.module('skybrand.shareInput', [
])

.directive('shareInput', function shareInput($window) {
  return {
    restrict: 'A',
    scope: {
      shareInput: '@'
    },
    template: '<form class="sky-form" novalidate autocomplete="off">'+
              'Share the basket: <input type="text" value="{{shareInput}}" />'+
              '</form>',
    replace: false,
    link: function(scope, element) {

      scope.window = $window;

      element.addClass('wrap-share-basket');

      var input = element.find('input');

      input.on('click', function(e) {
        $(this).select().focus();
      });

    }
  };
})

;