angular.module( 'skybrand', [
  'templates-app',
  'templates-common',
  'skybrand.model',
  'skybrand.header',
  'skybrand.footer',
  'skybrand.validators',
  'skybrand.notFound',
  'skybrand.accessLocked',
  'skybrand.notAllowed',
  'skybrand.home',
  'skybrand.login',
  'skybrand.logout',
  'skybrand.assets',
  'skybrand.team',
  'skybrand.news',
  'skybrand.news.campaign',
  'skybrand.news.campaignLibrary',
  'skybrand.ourBrand',
  'skybrand.guidelines',
  'skybrand.upload',
  'skybrand.admin.activity',
  'skybrand.admin.approval',
  'skybrand.assets.view',
  'skybrand.assets.edit',
  'skybrand.admin.access',
  'skybrand.admin.access.user.edit',
  'skybrand.admin.access.user.add',
  'skybrand.brandhub.book',
  'skybrand.brandhub.book.completed',
  'skybrand.brandhub.view',
  'skybrand.assets.basket',
  'skybrand.maintenance',
  'skybrand.legal',
  'ui.state',
  'ui.route',
  'ngAnimate',
  'rn-lazy',
  'plupload.module',
  'fidi.ie8FullImage',
  'skybrand.utilities',
  'skybrand.analytics'
])

.value('$anchorScroll', angular.noop)
.constant('separator', '%7C')

.config( function ( $httpProvider, $locationProvider, $compileProvider, $stateProvider, $urlRouterProvider, $anchorScrollProvider ) {
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
  $httpProvider.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';
  $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
  $locationProvider.html5Mode(true).hashPrefix('!');
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|blob|ftp|mailto|webcal|chrome-extension):/);
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|blob):/);

  //if no route is matched go to home
  $urlRouterProvider.otherwise( '/home' );


  $httpProvider.interceptors.push(function($q, $location) {
    return {
      'response': function(response) {
        if(response.session && !response.session.isLoggedIn && response.config.url !== '/api/user/login' && response.config.url !== '/api/user/logout') {
          $location.path('/login');          
        }
        return response;
      },
     'responseError': function(rejection) {
        if(rejection.data.result && rejection.data.result.in_maintenance) {
          $location.path('/maintenance');
        }
        if(rejection.session && !rejection.session.isLoggedIn && rejection.config.url !== '/api/user/login' && rejection.config.url !== '/api/user/logout') {
          $location.path('/login');          
        }
        return $q.reject(rejection);
      }
    };
  });

})

.run( function run ($rootScope, $location, modelService, utilitiesService, analyticsService) {
 
  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data ) && angular.isDefined( toState.data.pageTitle ) ) {
      $rootScope.pageTitle = toState.data.pageTitle;
      //ie8 fix 
      if(modelService.cms.isIE8 || modelService.cms.isIE9) {
        setTimeout(function(){
            window.document.title = toState.data.pageTitle;
        }, 500);
      }
    }
    //not found page has its own tracking config
    if($location.path() !== '/not-found') {
      analyticsService.trackPage();
    }
  });

  $rootScope.$on('$locationChangeStart', function onStateChangeStart(event, to, from){ 
    //detect if it's the first page load
    modelService.isFirstLoad = to === from;
    var prevUrl = utilitiesService.getPathFromAbsUrl(from);
    if(prevUrl.indexOf('/view') === -1) {
      modelService.pages.previous = prevUrl; 
    }
    
    //if lightbox is opened when changing routes 
    //then close it and continue afterwards
    if($rootScope.lightbox.isOpened()) {
      event.preventDefault();
      $rootScope.lightbox.close().then(function(){
        $location.path(utilitiesService.getPathFromAbsUrl(to), true);
      });
    }

  });

})

.controller( 'BodyCtrl', function BodyController($scope, $rootScope, modelService) {
  $scope.rootScope = $rootScope;
  $scope.model = modelService;
})

;

