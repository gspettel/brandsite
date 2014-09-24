angular.module( 'skybrand.filterspanel', [
  'templates-app',
  'skybrand.model', 
  'skybrand.utilities',
  'ui.state',
  'ivpusic.cookie'
])

.controller( 'FiltersPanelCtrl', function filtersPanelController( $scope, $rootScope, modelService, ipCookie, separator, utilitiesService, $stateParams, $location) { 
  
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

    angular.forEach($stateParams, function(value, key){
       if(value) {
        searchParams[key] = value;
       }
    });

    delete searchParams['mainCategory'];

    var filters = utilitiesService.filters.getSelected(modelService.filters.available, '|');

    if(filters.asset_master_brand_category){
      searchParams.master_brand_category = filters.asset_master_brand_category;
    } else {
      delete searchParams['master_brand_category'];
    }
    if(filters.asset_channels_brand){
      searchParams.channels_brand = filters.asset_channels_brand;
    } else {
      delete searchParams['channels_brand'];
    }
    if(filters.asset_channels_category){
      searchParams.channels_category = filters.asset_channels_category;
    } else {
      delete searchParams['channels_category'];
    }
    if(filters.asset_products_category){
      searchParams.products_category = filters.asset_products_category;
    } else {
      delete searchParams['products_category'];
    }
    if(filters.asset_products_product){
      searchParams.products_product = filters.asset_products_product;
    } else {
      delete searchParams['products_product'];
    }
    if(filters.asset_campaigns_product_area){
      searchParams.campaigns_product_area = filters.asset_campaigns_product_area;
    } else {
      delete searchParams['campaigns_product_area'];
    }
    if(filters.asset_campaigns_media){
      searchParams.campaigns_media = filters.asset_campaigns_media;
    } else {
      delete searchParams['campaigns_media'];
    }
    if(filters.asset_initiatives_category){
      searchParams.initiatives_category = filters.asset_initiatives_category;
    } else {
      delete searchParams['initiatives_category'];
    }
    if(filters.asset_initiatives_initiative){
      searchParams.initiatives_initiative = filters.asset_initiatives_initiative;
    } else {
      delete searchParams['initiatives_initiative'];
    }
    if(filters.asset_content_content){
      searchParams.content_content = filters.asset_content_content;
    } else {
      delete searchParams['content_content'];
    }
    if(filters.asset_content_document){
      searchParams.content_document = filters.asset_content_document;
    } else {
      delete searchParams['content_document'];
    }
    if(filters.year){
      searchParams.year = filters.year;
    }else {
      delete searchParams['year'];
    }
    if(filters.quarter){
      searchParams.quarter = filters.quarter;
    }else {
      delete searchParams['quarter'];
    }
    if(filters.filetype){
      searchParams.filetype = filters.filetype;
    }else {
      delete searchParams['filetype'];
    }
    if(filters.country){
      searchParams.country = filters.country;
    }else {
      delete searchParams['country'];
    }
    if(filters.is_replacement){
      searchParams.is_replacement = filters.is_replacement;
    }else {
      delete searchParams['is_replacement'];
    }
    if(filters.is_private){
      searchParams.is_private = filters.is_private;
    }else {
      delete searchParams['is_private'];
    }
    if($stateParams.showFilters){
      searchParams.showFilters = $stateParams.showFilters;
    }else {
      delete searchParams['showFilters'];
    }
      
    $location.search(searchParams);

  }, true);

  $scope.clearSiblings = function(collection, option) {
    angular.forEach(collection, function(value, index) {
      if (option.value !== value.value) {
        value.selected = false;
      }
    });
  };

  var filterPanelClickHandler = $rootScope.$on('filterPanel:click', function() {
    modelService.showFilters = !modelService.showFilters;
    ipCookie('showFilters', modelService.showFilters, {path: '/'});
  });

  $scope.$on("$destroy", function(){
    filterPanelClickHandler();
  });

})

;

