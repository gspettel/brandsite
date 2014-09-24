angular.module( 'skybrand.filterspanel.campaigns', [
  'templates-app',
  'skybrand.model', 
  'skybrand.utilities',
  'ui.state',
  'ivpusic.cookie'
])

.controller( 'FiltersPanelCampaignsCtrl', function filtersPanelCampaignsController( $scope, $rootScope, ipCookie, modelService, separator, utilitiesService, $stateParams, $location) { 
  
  $scope.filters = modelService.filters;
  $scope.modelService = modelService;
  $scope.$stateParams = $stateParams;

  utilitiesService.filters.reset();
  utilitiesService.filters.populateAvailableFromUrl(modelService.filters.available, $stateParams, '|' );

  $scope.$watch('filters.available', function(newValue, oldValue) {
    if (newValue === oldValue || oldValue === null) {
      return false;
    }
    
    var searchParams = {};

    var filters = utilitiesService.filters.getSelected($scope.filters.available, '|');

    if(filters.year.length){
      searchParams.year = filters.year;
    } else {
      delete searchParams['filters'];
    }
    if(filters.quarter.length){
      searchParams.quarter = filters.quarter;
    } else {
      delete searchParams['quarter'];
    }
    if(filters.country.length){
      searchParams.country = filters.country;
    } else {
      delete searchParams['country'];
    }
      
    $location.search(searchParams);

  }, true);

  var filterPanelClickHandler = $rootScope.$on('filterPanel:click', function() {
    modelService.showFilters = !modelService.showFilters;
    ipCookie('showFilters', modelService.showFilters, {path: '/'});
  });

  $scope.$on("$destroy", function(){
    filterPanelClickHandler();
  });

})

;

