angular.module('skybrand.header', [
  'templates-app',
  'skybrand.model',
  'skybrand.notifications'
])

.directive('header', function(modelService, $stateParams, ipCookie, $rootScope, $timeout, $location, separator, notificationsService) {
  return {
    restrict: 'A',
    scope: true,
    templateUrl: 'components/header/header.tpl.html',
    replace: true,
    link: function(scope, iElement, attrs) {
      scope.modelService = modelService;
      scope.searchTerm = '';
      scope.notifications = notificationsService;
      scope.stateParams = $stateParams;

      $('li.submenu', iElement).hover(function() {
        iElement.find('li.submenu').removeClass('open');
        $(this).addClass('open');
      });

      iElement.on('mouseleave', function() {
        iElement.find('li.submenu').removeClass('open');
      });

      scope.checkIfCurrent = function(menu) {
        return $location.path().indexOf(menu)===1;
      };

      scope.search = function() {
        $location.path('/search').search({
          term: scope.searchTerm
        });
      };

      if(!ipCookie('hideIE8Notice')) {
        scope.showIE8Notice = true;
      }

      scope.closeNotice = function() {
        ipCookie('hideIE8Notice', 'true', {path: '/', expires: 21});
        scope.showIE8Notice = false;
      };

      scope.openBasket = function(){
        
        if(!modelService.basket.length) { 
          $rootScope.lightbox.open({type: 'notifications.alert', message1: 'Your basket is empty.', message2: 'Please add items from the Assets page', autoclose: true, autoclosetimeout: 3000});
          return;
        }
        var items = [];
        angular.forEach(modelService.basket, function(value, index){
          items.push(value.id ? value.id : value);
        });
        $location.path("/basket").search({assets:items.join('|')});
      };

      $('.search input[type=text]', iElement).on('keypress', function(e) {
        if (e.keyCode === 13) {
          scope.$apply(function() {
            scope.search();
          });
        }
      });

      scope.$watch('modelService.notifications.message', function(newValue, oldValue) {
        if (newValue === oldValue || newValue === '') {
          return false;
        }
        $timeout(function() {
          modelService.notifications.message = '';
        }, 2000);
      });

    }
  };
})

;