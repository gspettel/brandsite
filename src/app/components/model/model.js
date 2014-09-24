angular.module('skybrand.model', [
  'skybrand.server',
  'ivpusic.cookie',
  'skybrand.cache'
  ])

.service('modelService', function modelService(serverService, ipCookie, $rootScope, $location, $timeout, $interval, cacheService) {
  var self = this;

  this.isFirstLoad = false;

  //every ajax request for get assets receives an id to assure that items coming from subsequest requests are not added to the interface
  //because angular q promises can't be cancelled this is the onlyway to avoid race conditions 
  this.lastRequestId = 0;

  //stores available filters coming from the cms and also filters selected by the user through the interface
  this.filters = {
    available: SkyBrand.filters
  };

  this.sharedData = null;

  this.user = null;

  this.pages = {
    settings: null,
    previous: null,
    currentPageName: ''
  };

  //contains cms cconfiguration variables (template, assets dirs, domain name etc)
  this.cms = SkyBrand;

  //data for the guidelines and our brand pages. this is initialised in the background 
  //with a timeout after the page loads or immediately if visiting the /our-brand /guidelines pages
  this.ourBrand = {
    ourBrand: null,
    guidelines: null
  };

  this.showFilters = ipCookie('showFilters');

  //basket data
  this.basket = ipCookie('brandsite_basket') || [];
  
  this.cacheIds = {
    assets: [],
    news: [],
    campaigns: []
  };

  //updates the user status
  this.updateUser = (function autoExec() {
    serverService.user.get().then(function(result) {
      if (result && result.isLocked) {
        $location.path('/access-locked');
      }
      self.user = result;
      afterUserStatus();
    });
    return autoExec;
  })();

  //check the login status every 2 minutes
  $interval(function(){
    serverService.user.get().then(function(result) {
      if (!result.isLoggedin && self.user.isLoggedin !== result.isLoggedin) {
        window.location.reload();
      }
      self.user = result;
    });
  }, 1000 * 60 * 3);
 
  function afterUserStatus() {

    if(!self.user.isLoggedin) {
      return;
    }

    serverService.settings.get().then(function(response) {
      self.pages.settings = response;
    });

  }

  //purge assets cache
  this.purgeAssetsCache = function() {
    angular.forEach(self.cacheIds.assets, function(cacheId){
      cacheService.remove(cacheId);
    });
    self.cacheIds.assets = [];
  };

  $rootScope.$on('user:logout', this.updateUser);
  $rootScope.$on('user:login', this.updateUser);
  $rootScope.$on('assets:updated', this.purgeAssetsCache);
  $rootScope.$on('assets:added', this.purgeAssetsCache);
  $rootScope.$on('assets:approved', this.purgeAssetsCache);

})

;