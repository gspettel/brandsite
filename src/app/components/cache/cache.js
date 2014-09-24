angular.module('skybrand.cache', [])

.service('cacheService', function($cacheFactory) {
   return $cacheFactory('SkyBrand');
  }
)

;