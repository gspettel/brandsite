angular.module('skybrand.typeahead', [
  'skybrand.server',
  'ui.bootstrap'
])

.directive('brandTypeahead', function typeahead(serverService, $rootScope, $http) {
  return {
    restrict: 'A',
    scope: {
      brandTypeahead: '=',
      type: '@'
    },
    template: '<input class="inputBox" type="text" data-ng-model="value" data-typeahead-on-select="onSelect($item, $model, $label)" placeholder="{{type === \'campaigns\' ? \'Search in the campaigns library...\' : \'What are you looking for today?\'}}" data-typeahead="item for item in getValues($viewValue)" data-typeahead-loading="loading"/>'+
      '<a href="javascript:void(0);" data-ng-show="value.length" data-ng-click="clear()" class="icon fade clear ng-hide"><i class="skycon-close" aria-hidden="true"></i></a>'+
      '<a href="javascript:void(0);" data-ng-click="updateVal()" class="icon search"><i class=" skycon-search" aria-hidden="true"></i></a>',
    replace: false,
    link: function(scope, iElement) {

      var input = iElement.find('.inputBox');

      if(scope.brandTypeahead) {
        scope.value = scope.brandTypeahead;
      }
      
      iElement.addClass('wrap-typeahead');
      //scope.value = scope.typeahead;

      scope.updateVal = function() {
        scope.brandTypeahead = scope.value;
      };

      scope.clear = function() {
        scope.brandTypeahead = '';
        scope.value = '';
      };

      var url = scope.type === 'campaigns' ? '/api/suggestions/campaigns/' : '/api/suggestions/assets/';

      scope.getValues = function(val) {
        return $http.get(url, {
          params: {
            title: val
          }
        }).then(function(res){
          return res.data;
        });
      };

      $rootScope.$on('searchBox:focus', function() {
        input.focus();
      });

      $rootScope.$on('searchBox:clear', scope.clear);

      scope.onSelect = function($item, $model, $label) {
        scope.brandTypeahead = $item;
      };

      input.on('keypress', function(e) {
        scope.$apply(function() {
          if (e.keyCode === 13) {
            scope.brandTypeahead = input.val();
          }
        });
      });

    }
  };
})

;