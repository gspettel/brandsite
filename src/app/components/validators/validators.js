angular.module('skybrand.validators', [
  'skybrand.server'
])

.directive('validateAssetTitle', function(serverService) {
  return {
    require: 'ngModel',
    scope: {
      exclude_id: '@validateAssetTitleExclude',
      loading: '=validateProgress',
      model: '=ngModel'
    },
    link: function(scope, element, attrs, ctrl) {
      element.addClass('validation');
      scope.$watch('model', function(newVal, oldVal) {
        ctrl.$setValidity('assetTitleFailedUpload', true);

        if (newVal === oldVal) {
          ctrl.$setValidity('assetTitle', false);
          return false;
        }
        scope.loading = true;

        if (typeof newVal === 'undefined' || newVal.length === 0) {
          ctrl.$setValidity('assetTitle', false);
          scope.loading = false;
          return false;
        }

        serverService.assets.checkTitle({
          'title': newVal,
          'exclude_id': scope.exclude_id
        }).then(function(result) {
          scope.loading = false;
          ctrl.$setValidity('assetTitle', result.success);
        }, function(reason) {
          scope.loading = false;
          ctrl.$setValidity('assetTitle', false);
          ctrl.$setValidity('assetTitleFailedUpload', reason && !reason.errors.failed_asset);
        });

      });
    }
  };
})

.directive('validateCollectionRequired', function() {
  return {
    require: 'ngModel',
    scope: {
      model: '=ngModel'
    },
    link: function(scope, element, attrs, ctrl) {

      element.addClass('validation');

      scope.$watch('model', function(newVal, oldVal) {

        var valid = false;

        angular.forEach(newVal, function(value, key) {
          if (value.selected) {
            valid = true;
          }
        });

        ctrl.$setValidity('collectionRequired', valid);

      }, true);
    }
  };
})

.directive('validateCollectionSingleValue', function() {
  return {
    require: 'ngModel',
    scope: {
      model: '=ngModel'
    },
    link: function(scope, element, attrs, ctrl) {

      element.addClass('validation');

      scope.$watch('model', function(newVal, oldVal) {

        var occurence = 0;

        angular.forEach(newVal, function(value, key) {
          if (value.selected) {
            occurence += 1;
          }
        });

        ctrl.$setValidity('collectionSingleValue', occurence === 1);

      }, true);
    }
  };
})

.directive('dateRequired', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {

      element.addClass('validation');

      scope.$watch(function() {
        return ngModel.$modelValue;
      }, function(newVal, oldVal) { 
        ngModel.$setValidity('dateRequired', newVal);
      }, true);
    }
  };
})

.directive('validateReplacementRequired', function() {
  return {
    require: 'ngModel',
    scope: {
      model: '=ngModel'
    },
    link: function(scope, element, attrs, ngModel) {
    
      element.addClass('validation');

      scope.$watch(function() {
        return ngModel.$modelValue;
      }, function(newVal, oldVal) { 
        ngModel.$setValidity('replacementRequired', newVal);
      }, true);

    }
  };
})

;