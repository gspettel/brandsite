angular.module('skybrand.analytics', [
])

.service('analyticsService', function utilitiesService(modelService, $location, $rootScope, serverService, $window, $timeout, separator ) {
  var 
    self = this,
    site = 'believeinbetter',
    account = modelService.cms.env === 'live' ? 'bskybbelieveinbetterprod' : 'bskybbelieveinbetterdev',
    debug = false
  ;  

  this.trackPage = function(){

    analytics.setup({
        site: site,
        section: $location.path().substring(1),
        page: $location.path().substring(1),
        account: account,
        contentType: $location.path().split('/')[1],
        debug: debug,
        loadVariables: {'loginStatus': modelService.user && modelService.user.isLoggedin ? true : false }
        });

    analytics.trackPage();

  };

  this.track404Page = function(){

    analytics.setup({
        site: site,
        section: $location.path().substring(1),
        page: $location.path().substring(1),
        account: account,
        contentType: $location.path().split('/')[1],
        debug: debug,
        loadVariables: {'loginStatus':  modelService.user && modelService.user.isLoggedin ? true:false, '404Page': true}
        });

    analytics.trackPage();

  };

})

;