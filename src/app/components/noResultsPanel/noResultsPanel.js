angular.module( 'skybrand.noResultsPanel', [
  'templates-app',
  'skybrand.model'
])

.directive('noResultsPanel', function noResultsPanel(modelService, $stateParams, $rootScope) {
  return {
    restrict: "A",
    scope: {
      data:'@'
    },
    templateUrl: 'components/noResultsPanel/noResultsPanel.tpl.html',
    replace: false,
    link: function(scope, element, attrs, ngModel) {
      scope.stateParams = $stateParams;
      scope.modelService = modelService;

      scope.toggleFilters = function(){
        $rootScope.$broadcast('filterPanel:click');
      };

      scope.refineSearch = function(){
        $rootScope.$broadcast('searchBox:focus');

        $('html, body').animate({
          scrollTop: $('body').offset().top
        }, 400);
      };

      scope.clearSearch = function(){
        $rootScope.$broadcast('searchBox:clear');
        
        $('html, body').animate({
          scrollTop: $('body').offset().top
        }, 400);
      };

    }
  };

})

;

